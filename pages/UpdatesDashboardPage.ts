import * as path from 'path';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class UpdatesDashboardPage extends BasePage {
  private readonly updateSearchInput =
    'input[placeholder="Select or type update title"][role="combobox"]';
  private readonly updateSearchResultByTitle = (title: string) =>
    this._page.getByRole('option', { name: title, exact: true }).first();
  private readonly updatesGrid = () =>
    this._page.getByRole('grid', { name: 'Data table', exact: true });
  private readonly updateRowByTitle = (title: string) =>
    this.updatesGrid().locator('tbody tr.k-master-row').filter({
      has: this._page.locator('td[aria-colindex="1"]').getByText(title, { exact: true }),
    }).first();
  private readonly updatesPagerInfo = '.k-grid .k-pager-info';
  private readonly updateActionsTab = () =>
    this._page.getByRole('tab', { name: 'Update Actions', exact: true });
  private readonly actionStatusColumnHeader = () =>
    this._page.getByRole('columnheader', { name: 'Action Status', exact: true });
  private readonly activeUpdateDetailsPanel = () =>
    this._page.locator('kendo-tabstrip > [role="tabpanel"][aria-hidden="false"]').first();
  private readonly updateDetailsSectionLabelByName = (sectionName: string) =>
    this.activeUpdateDetailsPanel().locator(
      `xpath=.//label[contains(concat(' ', normalize-space(@class), ' '), ' form-label ') and normalize-space(text()[1]) = "${sectionName}"]`,
    );
  private readonly updateDetailsAttachmentsTab = () =>
    this.activeUpdateDetailsPanel().locator('..').getByRole('tab', { name: 'Attachments', exact: true });
  private readonly updateDetailsUploadFilesButton = () =>
    this.activeUpdateDetailsPanel().getByRole('button', { name: 'Upload files', exact: true });
  private readonly updateDetailsAttachmentFileInput =
    'kendo-tabstrip > [role="tabpanel"][aria-hidden="false"] app-attachments input[type="file"]';
  private readonly updateDetailsAttachmentsGrid = () =>
    this.activeUpdateDetailsPanel().locator('app-attachments').getByRole('grid', { name: 'Data table', exact: true });
  private readonly updateDetailsAttachmentDocumentNameCell = (fileName: string) =>
    this.updateDetailsAttachmentsGrid().locator('td[aria-colindex="1"]').getByText(fileName, { exact: true });
  private readonly updateDetailsFirstAttachmentRemoveButton = () =>
    this.updateDetailsAttachmentsGrid()
      .locator('tbody tr.k-master-row')
      .first()
      .locator('button[title="Remove "]');
  private readonly updateDetailsMarkAsUnreadButton = () =>
    this._page.locator('app-update-details button.btn-unread-read');
  private readonly updateDetailsEditButton = 'button[title="Edit"]';
  private readonly updateDetailsSaveButton = 'button[title="Save"]';
  private readonly updateDetailsPeoplePickerByField = (fieldName: 'User Assigned' | 'Watch List') =>
    this.activeUpdateDetailsPanel().locator(
      `app-people-picker[formcontrolname="${fieldName === 'User Assigned' ? 'userAssigned' : 'watchList'}"] kendo-dropdownlist[role="combobox"]`,
    );
  private readonly updateDetailsPeoplePickerSearchInput =
    'kendo-popup.k-animation-container-shown .k-dropdownlist-popup [role="searchbox"][aria-label="Filter"]';
  private readonly updateDetailsPeoplePickerOptionByName = (name: string) =>
    this._page.locator(
      `kendo-popup.k-animation-container-shown .k-dropdownlist-popup [role="option"]:has-text("${name}")`,
    ).first();
  private readonly updateDetailsSelectedPersonByField = (fieldName: 'User Assigned' | 'Watch List') =>
    this.updateDetailsPeoplePickerByField(fieldName).locator('.selected-person-name');
  private readonly updateDetailsCommentButton = () =>
    this.activeUpdateDetailsPanel().locator('app-comments .comment-input-actions button[type="submit"]');

  /**
   * Searches the Updates Dashboard for an update title.
   * @param updateTitle The update title to search for.
   */
  async searchForUpdate(updateTitle: string): Promise<void> {
    await this.fillInputText(this.updateSearchInput, updateTitle);
    await this.updateSearchResultByTitle(updateTitle).click();
  }

  /**
   * Verifies that the requested update is displayed in the Updates Dashboard results.
   * @param updateTitle The expected update title.
   */
  async verifyUpdateIsDisplayed(updateTitle: string): Promise<void> {
    await expect(this.updatesGrid().getByRole('row').filter({ hasText: updateTitle }).first()).toBeVisible();
  }

  /**
   * Verifies that an update title is absent from the active Updates Dashboard grid.
   * @param updateTitle The update title expected not to be displayed.
   */
  async verifyUpdateIsNotDisplayed(updateTitle: string): Promise<void> {
    await expect(this.updateRowByTitle(updateTitle)).toHaveCount(0);
  }

  /**
   * Gets the total number of items displayed in the All Updates table.
   * @param expectedItemCount Optional total that the pager must report before returning.
   * @returns Total item count reported by the All Updates table pager.
   */
  async getAllUpdatesItemCount(expectedItemCount?: number): Promise<number> {
    await this.waitImplicit(5000);

    await expect.poll(
      async () => this.getKendoPagerItemCount(this.updatesPagerInfo),
      {
        message: expectedItemCount === undefined
          ? 'Waiting for the All Updates pager to finish loading.'
          : `Waiting for the All Updates pager to report ${expectedItemCount} items.`,
        timeout: process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000,
      },
    )[expectedItemCount === undefined ? 'toBeGreaterThan' : 'toBe'](expectedItemCount ?? 0);

    return this.getKendoPagerItemCount(this.updatesPagerInfo);
  }

  /**
   * Opens the first update shown in the Updates Dashboard results.
   */
  async openFirstUpdate(): Promise<void> {
    await this.ensureKendoGridHasRows(
      this.updatesGrid(),
      'The Updates Dashboard must contain an update before the first update can be opened.',
      'The Updates Dashboard grid was displayed before attempting to open its first row.',
    );
    await this.updatesGrid().getByRole('row').nth(1).click();
  }

  /**
   * Opens the edit view for the update currently selected in Update Details.
   */
  async editSelectedUpdate(): Promise<void> {
    await this.clickElement(this.updateDetailsEditButton);
  }

  /**
   * Saves changes made to the update currently selected in Update Details.
   */
  async saveSelectedUpdate(): Promise<void> {
    const saveButton = this._page.locator(this.updateDetailsSaveButton);

    try {
      await expect(saveButton).toBeEnabled();
    } catch {
      const priority = (await this.getUpdateDetailsDropdown('Priority').locator('.k-input-value-text').textContent())?.trim() ?? '';
      const status = (await this.getUpdateDetailsDropdown('Status').locator('.k-input-value-text').textContent())?.trim() ?? '';
      this.failWithApplicationError(
        'Changing an editable update value must enable Save.',
        'The Save button is enabled after changing the update Priority or Status.',
        'The Save button remained disabled.',
        `Priority: "${priority}"; Status: "${status}"; disabled: ${await saveButton.isDisabled()}.`,
      );
    }

    await saveButton.click();
  }

  /**
   * Alternates the selected update priority between two values to guarantee a form change.
   * @param firstPriority One of the two priority values to alternate.
   * @param secondPriority The other priority value to alternate.
   */
  async toggleSelectedUpdatePriority(firstPriority: string, secondPriority: string): Promise<void> {
    const priorityDropdown = this.getUpdateDetailsDropdown('Priority');
    const currentPriority = (await priorityDropdown.locator('.k-input-value-text').innerText()).trim();
    const nextPriority = currentPriority === firstPriority ? secondPriority : firstPriority;

    await this.selectUpdateDetailsOption(nextPriority, 'Priority');
  }

  /**
   * Marks the selected update as unread.
   */
  async markSelectedUpdateAsUnread(): Promise<void> {
    await this.clickLocator(this.updateDetailsMarkAsUnreadButton());
  }

  /**
   * Verifies that the selected update is already marked as unread.
   */
  async verifyMarkAsUnreadIsDisabled(): Promise<void> {
    await expect(this.updateDetailsMarkAsUnreadButton()).toBeDisabled();
  }

  /**
   * Selects and verifies an option in a supported dropdown within Update Details.
   * @param optionName Exact visible option to select.
   * @param fieldName Business name of the Update Details field.
   */
  async selectUpdateDetailsOption(optionName: string, fieldName: string): Promise<void> {
    const dropdown = this.getUpdateDetailsDropdown(fieldName);
    const option = this._page.getByRole('option', { name: optionName, exact: true }).first();
    await this.clickLocator(dropdown);
    await this.clickLocator(option);
    await expect(dropdown.locator('.k-input-value-text')).toHaveText(optionName);
  }

  /**
   * Selects a user in a people-picker field on the selected update.
   * @param userName Exact user name to select.
   * @param fieldName Business name of the people-picker field.
   */
  async selectUpdateDetailsPerson(
    userName: string,
    fieldName: 'User Assigned' | 'Watch List',
  ): Promise<void> {
    const peoplePicker = this.updateDetailsPeoplePickerByField(fieldName);
    await this.clickLocator(peoplePicker);
    await this.fillInputText(this.updateDetailsPeoplePickerSearchInput, userName);
    const matchingUser = this.updateDetailsPeoplePickerOptionByName(userName);
    await matchingUser.waitFor({ state: 'visible' });
    await this.clickLocator(matchingUser);
    await expect(this.updateDetailsSelectedPersonByField(fieldName)).toHaveText(userName);
  }

  /**
   * Opens an update from the Updates Dashboard by its displayed title.
   * @param updateTitle Exact title of the update to open.
   */
  async openUpdateByTitle(updateTitle: string): Promise<void> {
    await this.ensureKendoGridHasRows(
      this.updatesGrid(),
      `The Updates Dashboard must contain an update before update "${updateTitle}" can be opened.`,
      `The Updates Dashboard grid was displayed before searching for update "${updateTitle}".`,
    );
    const updateRow = this.updateRowByTitle(updateTitle);
    await expect(updateRow).toBeVisible();
    await updateRow.click();
  }

  /**
   * Verifies the Update Details and Update Actions tabs on the selected update.
   */
  async verifyUpdateDetailTabs(): Promise<void> {
    await expect(this._page.getByRole('tab', { name: 'Update Details', exact: true })).toBeVisible();
    await expect(this.updateActionsTab()).toBeVisible();
  }

  /**
   * Verifies that the active Update Details panel displays each requested section label.
   * @param sections Semicolon-delimited Update Details section labels.
   */
  async verifyUpdateDetailsSectionsAreDisplayed(sections: string): Promise<void> {
    const sectionNames = sections.split(';').map(section => section.trim()).filter(Boolean);

    if (sectionNames.length === 0) {
      throw new Error('At least one Update Details section must be provided.');
    }

    for (const sectionName of sectionNames) {
      await expect(
        this.updateDetailsSectionLabelByName(sectionName),
        `Expected Update Details section "${sectionName}" to be visible.`,
      ).toBeVisible();
    }
  }

  /**
   * Verifies that the active Update Details panel contains every expected content fragment.
   * @param values Semicolon-delimited expected content fragments.
   */
  async verifyUpdateDetailsContentIsDisplayed(values: string): Promise<void> {
    const expectedValues = values.split(';').map(value => value.trim()).filter(Boolean);

    if (expectedValues.length === 0) {
      throw new Error('At least one Update Details content value must be provided.');
    }

    const updateDetailsPanel = this.activeUpdateDetailsPanel();
    await expect(updateDetailsPanel).toBeVisible();

    try {
      for (const expectedValue of expectedValues) {
        await expect(
          updateDetailsPanel,
          `Expected Update Details content "${expectedValue}" to be visible.`,
        ).toContainText(expectedValue, { useInnerText: true });
      }
    } catch {
      this.failWithApplicationError(
        'Update Details must display every expected content value for the selected update.',
        `[${expectedValues.join(' | ')}]`,
        (await updateDetailsPanel.innerText()).trim(),
        'The active Update Details panel was visible and its content was read successfully.',
      );
    }
  }

  /**
   * Verifies that the requested action buttons are visible for the selected update.
   * @param buttons Semicolon-delimited Update Details button labels.
   */
  async verifyUpdateDetailsButtonsAreDisplayed(buttons: string): Promise<void> {
    const buttonNames = buttons.split(';').map(button => button.trim()).filter(Boolean);

    if (buttonNames.length === 0) {
      throw new Error('At least one Update Details button must be provided.');
    }

    for (const buttonName of buttonNames) {
      const button = buttonName === 'Mark as Unread'
        ? this.updateDetailsMarkAsUnreadButton()
        : buttonName === 'Edit'
          ? this._page.locator(this.updateDetailsEditButton)
          : buttonName === 'Comment'
            ? this.updateDetailsCommentButton()
            : undefined;

      if (!button) {
        throw new Error(`Update Details button "${buttonName}" is not supported.`);
      }

      await expect(button, `Expected Update Details button "${buttonName}" to be visible.`).toBeVisible();
    }
  }

  /**
   * Opens the Attachments tab for the selected update and verifies it is active.
   */
  async openUpdateDetailsAttachments(): Promise<void> {
    const attachmentsTab = this.updateDetailsAttachmentsTab();
    await attachmentsTab.click();
    await expect(attachmentsTab).toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Verifies that the Upload files button is visible in Update Details Attachments.
   */
  async verifyUpdateDetailsUploadFilesButtonIsDisplayed(): Promise<void> {
    await expect(this.updateDetailsUploadFilesButton()).toBeVisible();
  }

  /**
   * Uploads an attachment to the selected update.
   * @param filePath Project-relative attachment path.
   */
  async uploadUpdateDetailsAttachment(filePath: string): Promise<void> {
    await this.uploadFileFromHiddenInput(this.updateDetailsAttachmentFileInput, path.resolve(filePath));
  }

  /**
   * Verifies whether an attachment is displayed in the selected update's Attachments tab.
   * @param fileName Expected attachment file name.
   * @param displayed Whether the attachment should be displayed.
   */
  async verifyUpdateDetailsAttachmentIsDisplayed(fileName: string, displayed: boolean): Promise<void> {
    const attachment = this.updateDetailsAttachmentDocumentNameCell(fileName);
    if (displayed) {
      await expect(attachment.first()).toBeVisible();
      return;
    }

    await expect(attachment).toHaveCount(0);
  }

  /**
   * Removes the first attachment displayed in the selected update's Attachments tab.
   */
  async removeFirstUpdateDetailsAttachment(): Promise<void> {
    await this.clickLocator(this.updateDetailsFirstAttachmentRemoveButton());
  }

  /**
   * Opens the Update Actions tab for the selected update.
   */
  async openUpdateActionsTab(): Promise<void> {
    await this.updateActionsTab().click();
    await this.verifyActiveTabIsDisplayed('Update Actions');
  }

  /**
   * Presses the Action Status column header on the selected update.
   */
  async pressActionStatusColumnHeader(): Promise<void> {
    await this.actionStatusColumnHeader().click();
  }

  /**
   * Returns the requested editable dropdown from the active Update Details panel.
   * @param fieldName Business name of the Update Details field.
   */
  private getUpdateDetailsDropdown(fieldName: string) {
    switch (fieldName) {
      case 'Priority':
        return this.activeUpdateDetailsPanel().locator(
          'kendo-dropdownlist[formcontrolname="priority"]',
        );
      case 'Status':
        return this.activeUpdateDetailsPanel().locator(
          'kendo-dropdownlist[formcontrolname="status"]',
        );
      default:
        throw new Error(`Update Details field "${fieldName}" is not supported.`);
    }
  }

  /**
   * Escapes text before it is used as literal regular-expression content.
   * @param value Text to escape.
   * @returns Escaped regular-expression content.
   */
  private escapeRegularExpression(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}