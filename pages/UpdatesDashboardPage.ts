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
    this.activeUpdateDetailsPanel().locator('.form-label').filter({
      hasText: new RegExp(`^${this.escapeRegularExpression(sectionName)}(?:\\s|$)`),
    });
  private readonly updateDetailsAttachmentsTab = () =>
    this.activeUpdateDetailsPanel().locator('..').getByRole('tab', { name: 'Attachments', exact: true });
  private readonly updateDetailsUploadFilesButton = () =>
    this.activeUpdateDetailsPanel().getByRole('button', { name: 'Upload files', exact: true });
  private readonly updateDetailsMarkAsUnreadButton = () =>
    this._page.getByRole('button', { name: 'Mark as Unread', exact: true });
  private readonly updateDetailsEditButton = 'button[title="Edit"]';
  private readonly updateDetailsSaveButton = 'button[title="Save"]';
  private readonly updateDetailsCommentButton = () =>
    this.activeUpdateDetailsPanel().getByRole('button', { name: 'Comment', exact: true });

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
   * Gets the total number of items displayed in the All Updates table.
   * @returns Total item count reported by the All Updates table pager.
   */
  async getAllUpdatesItemCount(): Promise<number> {
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
    await this.clickElement(this.updateDetailsSaveButton);
  }

  /**
   * Selects and verifies an option in a supported dropdown within Update Details.
   * @param optionName Exact visible option to select.
   * @param fieldName Business name of the Update Details field.
   */
  async selectUpdateDetailsOption(optionName: string, fieldName: string): Promise<void> {
    const dropdown = this.getUpdateDetailsDropdown(fieldName);
    await dropdown.click();
    await this._page.getByRole('option', { name: optionName, exact: true }).first().click();
    await expect(dropdown.locator('.k-input-value-text')).toHaveText(optionName);
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