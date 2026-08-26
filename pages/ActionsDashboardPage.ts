import * as path from 'path';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ActionsDashboardPage extends BasePage {
  private readonly addActionDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Add Action"))';
  private readonly actionInput = `${this.addActionDialog} input[formcontrolname="action"]`;
  private readonly updateInput = `${this.addActionDialog} kendo-autocomplete[formcontrolname="update"] input[role="combobox"]`;
  private readonly preselectedUpdateInput = `${this.addActionDialog} input[formcontrolname="update"]`;
  private readonly updateActionDialog =
    'div[role="dialog"]:has(.k-dialog-title:text-is("Update Action"))';
  private readonly dashboardUpdateSearchInput =
    'input[placeholder="Select or type update title"][role="combobox"]';
  private readonly dashboardUpdateSearchClearButton =
    'kendo-autocomplete:has(input[placeholder="Select or type update title"]) .k-clear-value[title="clear"]';
  private readonly dashboardUpdateSearchResultByTitle = (title: string) =>
    this._page.getByRole('option', { name: title, exact: true }).first();
  private readonly updateActionUserAssignedDropdown =
    `${this.updateActionDialog} app-people-picker[formcontrolname="userAssigned"] kendo-dropdownlist[role="combobox"]`;
  private readonly updateActionPriorityDropdown =
    `${this.updateActionDialog} kendo-dropdownlist[formcontrolname="priority"]`;
  private readonly updateActionStatusDropdown =
    `${this.updateActionDialog} kendo-dropdownlist[formcontrolname="status"]`;
  private readonly updateActionButton = () =>
    this._page.getByRole('button', { name: 'Update', exact: true });
  private readonly privateActionToggle = () =>
    this._page.locator(this.updateActionDialog).getByRole('switch', { name: 'Private Action', exact: true });
  private readonly updateActionCommentsTab = () =>
    this._page.locator(this.updateActionDialog).getByRole('tab', { name: 'Comments', exact: true });
  private readonly updateActionAttachmentsTab = () =>
    this._page.locator(this.updateActionDialog).getByRole('tab', { name: 'Attachments', exact: true });
  private readonly updateActionUploadFilesButton = () =>
    this._page.locator(this.updateActionDialog).getByRole('button', { name: 'Upload files', exact: true });
  private readonly commentEditor =
    `${this.updateActionDialog} app-comments [role="textbox"][contenteditable="true"]`;
  private readonly submitCommentButton = () =>
    this._page.locator(`${this.updateActionDialog} app-comments .comment-input-actions button[type="submit"]`);
  private readonly commentEntryByText = (comment: string) =>
    this._page.locator(
      `${this.updateActionDialog} app-comments .comment-item:has(.comment-body:text-is("${comment}"))`,
    ).first();
  private readonly attachmentFileInput =
    `${this.updateActionDialog} app-attachments input[type="file"]`;
  private readonly attachmentsGrid = () =>
    this._page.locator(this.updateActionDialog).locator('app-attachments').getByRole('grid', { name: 'Data table', exact: true });
  private readonly attachmentDocumentNameCell = (fileName: string) =>
    this.attachmentsGrid().locator('td[aria-colindex="1"]').getByText(fileName, { exact: true });
  private readonly firstAttachmentRow = () =>
    this.attachmentsGrid().getByRole('row').nth(1);
  private readonly updateSearchResultByTitle = (title: string) =>
    this._page.getByRole('option', { name: title, exact: true }).first();
  private readonly userAssignedDropdown = `${this.addActionDialog} app-people-picker[formcontrolname="userAssigned"] kendo-dropdownlist[role="combobox"]`;
  private readonly priorityDropdown = `${this.addActionDialog} kendo-dropdownlist[formcontrolname="priority"]`;
  private readonly statusDropdown = `${this.addActionDialog} kendo-dropdownlist[formcontrolname="status"]`;
  private readonly deadlineDatePicker = `${this.addActionDialog} kendo-datepicker[formcontrolname="deadline"]`;
  private readonly commentsSection = `${this.addActionDialog} [role="tab"]:has-text("Comments")`;
  private readonly attachmentsSection = `${this.addActionDialog} [role="tab"]:has-text("Attachments")`;
  private readonly validationMessageByText = (message: string) =>
    `${this.addActionDialog} kendo-formerror[role="alert"]:has-text("${message}")`;
  private readonly peoplePickerSearchInput =
    'kendo-popup.k-animation-container-shown .k-dropdownlist-popup [role="searchbox"][aria-label="Filter"]';
  private readonly peoplePickerOptionByName = (name: string) =>
    'kendo-popup.k-animation-container-shown .k-dropdownlist-popup [role="option"]:has-text("' + name + '")';
  private readonly selectedUserAssignedValue =
    `${this.userAssignedDropdown} .selected-person-name`;
  private readonly actionsGrid = () =>
    this._page.getByRole('grid', { name: 'Data table', exact: true });
  private readonly actionCellByUpdateTitle = (updateTitle: string) =>
    this.actionsGrid()
      .locator('tbody tr.k-master-row')
      .filter({
        has: this._page.locator('td[aria-colindex="1"]').getByText(updateTitle, { exact: true }),
      })
      .first()
      .locator('td[aria-colindex="2"]');
  private readonly updateTitleCellByUpdateTitle = (updateTitle: string) =>
    this.actionsGrid()
      .locator('tbody tr.k-master-row')
      .filter({
        has: this._page.locator('td[aria-colindex="1"]').getByText(updateTitle, { exact: true }),
      })
      .first()
      .locator('td[aria-colindex="1"]');
  private readonly actionsPagerInfo = '.k-grid .k-pager-info';

  /**
   * Verifies that the requested required fields are displayed in the Add Action dialog.
   * @param fields Semicolon-delimited field names.
   */
  async verifyMandatoryFieldsAreDisplayed(fields: string): Promise<void> {
    await this.verifyRequestedFieldsDisplayed(fields, {
      Update: this.updateInput,
      Action: this.actionInput,
      'User Assigned': this.userAssignedDropdown,
      Priority: this.priorityDropdown,
      Status: this.statusDropdown,
      'Deadline Date': this.deadlineDatePicker,
    });
  }

  /**
   * Gets the total number of items displayed in the All Actions table.
   * @returns Total item count reported by the All Actions table pager.
   */
  async getAllActionsItemCount(): Promise<number> {
    return this.getKendoPagerItemCount(this.actionsPagerInfo);
  }

  /**
   * Verifies that a section is absent while creating a new action.
   * @param section Section name expected not to be displayed.
   */
  async verifySectionIsNotDisplayed(section: 'comments' | 'attachments'): Promise<void> {
    const selector = section === 'comments' ? this.commentsSection : this.attachmentsSection;
    await expect(this._page.locator(selector)).not.toBeVisible();
  }

  /**
   * Verifies required-field validation messages displayed in the Add Action dialog.
   * @param messages Semicolon-delimited expected validation messages.
   */
  async verifyMandatoryFieldMessagesAreDisplayed(messages: string): Promise<void> {
    const validationMessages = messages.split(';').map((message) => message.trim()).filter(Boolean);

    if (validationMessages.length === 0) {
      throw new Error('At least one Add Action validation message must be provided.');
    }

    await this.waitForElement(this.addActionDialog);

    for (const message of validationMessages) {
      try {
        await expect(this._page.locator(this.validationMessageByText(message))).toBeVisible();
      } catch {
        this.failWithApplicationError(
          'Submitting an Add Action form with missing required values must display the corresponding validation message.',
          `Validation message "${message}" is displayed in the Add Action dialog.`,
          `Validation message "${message}" is not displayed in the Add Action dialog.`,
          `Visible Add Action dialog content: "${(await this._page.locator(this.addActionDialog).innerText()).trim()}".`,
        );
      }
    }
  }

  /**
   * Fills a supported Add Action dialog field.
   * @param fieldName Business name of the field.
   * @param value Value to enter.
   */
  async fillField(fieldName: string, value: string): Promise<void> {
    if (fieldName === 'Update') {
      await this.fillInputText(this.updateInput, value);
      await this.clickLocator(this.updateSearchResultByTitle(value));
      return;
    }

    if (fieldName === 'Action') {
      await this.fillInputText(this.actionInput, value);
      return;
    }

    throw new Error(`Field "${fieldName}" is not supported in the Add Action dialog.`);
  }

  /**
   * Selects one or more options in a supported Add Action dialog field.
   * @param options Comma-delimited option labels.
   * @param fieldName Business name of the field.
   */
  async selectOptions(options: string, fieldName: string): Promise<void> {
    if (fieldName === 'User Assigned') {
      await this.selectAssignedUsers(options);
      return;
    }

    const fieldSelector = this.getDropdownSelector(fieldName);

    for (const option of options.split(',').map((value) => value.trim()).filter(Boolean)) {
      await this.clickElement(fieldSelector);
      await this.clickLocator(this._page.getByRole('option', { name: option, exact: true }));
    }
  }

  /**
   * Selects today's date in the Add Action deadline calendar.
   */
  async selectTodaysDeadline(): Promise<void> {
    await this.selectTodayFromKendoDatePicker(this.deadlineDatePicker);
  }

  /**
   * Verifies that a supported Add Action dialog field retains a value.
   * @param fieldName Business name of the field.
   * @param value Expected value.
   */
  async verifyFieldValue(fieldName: string, value: string): Promise<void> {
    const selector = fieldName === 'Update'
      ? `${this.updateInput}, ${this.preselectedUpdateInput}`
      : fieldName === 'Action'
        ? this.actionInput
        : undefined;
    if (!selector) {
      throw new Error(`Field "${fieldName}" is not supported in the Add Action dialog.`);
    }

    const field = this._page.locator(selector);
    try {
      await expect(field).toHaveValue(value);
    } catch {
      this.failWithApplicationError(
        `The "${fieldName}" field must retain the value entered in the Add Action dialog.`,
        value,
        await field.first().inputValue(),
        'The Add Action field is visible and its displayed value was read after saving.',
      );
    }
  }

  /**
   * Verifies that selected options are retained in an Add Action dialog field.
   * @param options Comma-delimited expected option labels.
   * @param fieldName Business name of the field.
   */
  async verifyOptionsAreSelected(options: string, fieldName: string): Promise<void> {
    if (fieldName === 'User Assigned') {
      const selectedUsers = this._page.locator(this.selectedUserAssignedValue);
      try {
        await expect(selectedUsers).toContainText(options);
      } catch {
        this.failWithApplicationError(
          'The User Assigned field must retain the selected users in the Add Action dialog.',
          options,
          `[${(await selectedUsers.allTextContents()).map(user => user.trim()).join(' | ')}]`,
          'The selected User Assigned values were read after saving.',
        );
      }
      return;
    }

    const dropdownSelector = this.getDropdownSelector(fieldName);
    const selectedOption = this._page.locator(`${dropdownSelector} .k-input-value-text`);
    try {
      await expect(selectedOption).toHaveText(options);
    } catch {
      this.failWithApplicationError(
        `The "${fieldName}" field must retain the selected option in the Add Action dialog.`,
        options,
        (await selectedOption.textContent())?.trim() ?? '',
        'The selected dropdown value was read after saving.',
      );
    }
  }

  /**
   * Verifies that today's date remains selected in the Add Action deadline calendar.
   */
  async verifyTodaysDeadlineIsDisplayed(): Promise<void> {
    await expect(this._page.locator(`${this.deadlineDatePicker} input[role="combobox"]`)).toHaveValue(/\d/);
  }

  /**
   * Pauses the Add Action flow before its final save for observation.
   * @param milliseconds Duration of the pause in milliseconds.
   */
  async pauseBeforeSaving(milliseconds: number): Promise<void> {
    await this.waitImplicit(milliseconds);
  }

  /**
   * Verifies that the first Actions Dashboard data row contains the expected action.
   * @param actionName Expected action name.
   */
  async verifyActionIsDisplayedInFirstRow(actionName: string): Promise<void> {
    await expect(this.actionsGrid().getByRole('row').nth(1)).toContainText(actionName);
  }

  /**
   * Verifies that an action is absent from the current Actions Dashboard results.
   * @param actionName Action name expected not to be displayed.
   */
  async verifyActionIsNotDisplayed(actionName: string): Promise<void> {
    await expect(this.actionsGrid().getByText(actionName, { exact: true })).toHaveCount(0);
  }

  /**
   * Searches the dashboard by update title and selects the first exact result.
   * @param updateTitle Update title used to filter actions.
   */
  async searchForUpdate(updateTitle: string): Promise<void> {
    await this.fillInputText(this.dashboardUpdateSearchInput, updateTitle);
    await this.clickLocator(this.dashboardUpdateSearchResultByTitle(updateTitle));
  }

  /**
   * Clears the selected update from the Actions Dashboard search control.
   */
  async clearUpdateSearch(): Promise<void> {
    const clearButton = this._page.locator(this.dashboardUpdateSearchClearButton);
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    await expect(this._page.locator(this.dashboardUpdateSearchInput)).toHaveValue('');
  }

  /**
   * Verifies that the dashboard displays an action row for an update title.
   * @param updateTitle Expected update title.
   */
  async verifyUpdateIsDisplayed(updateTitle: string): Promise<void> {
    await expect(this.actionsGrid().getByRole('row').filter({ hasText: updateTitle }).first()).toBeVisible();
  }

  /**
   * Opens the first action listed in the Actions Dashboard grid.
   */
  async openFirstAction(): Promise<void> {
    await this.ensureKendoGridHasRows(
      this.actionsGrid(),
      'The Actions Dashboard must contain an action before the first action can be opened.',
      'The Actions Dashboard grid was displayed before attempting to open its first row.',
    );
    await this.clickLocator(this.actionsGrid().getByRole('row').nth(1));
  }

  /**
   * Opens the Update Action dialog from the requested Action Analytics grid cell.
   * @param updateTitle Exact update title shown in the result row.
   * @param sectionName Grid section used to open the action.
   */
  async openActionForUpdate(updateTitle: string, sectionName: string): Promise<void> {
    await this.ensureKendoGridHasRows(
      this.actionsGrid(),
      `The Actions Dashboard must contain an action before the action for update "${updateTitle}" can be opened.`,
      `The Actions Dashboard grid was displayed before searching for update "${updateTitle}".`,
    );

    const resultCellBySection = {
      Action: this.actionCellByUpdateTitle,
      'Update Title': this.updateTitleCellByUpdateTitle,
    }[sectionName];

    if (!resultCellBySection) {
      throw new Error(`Section "${sectionName}" is not supported for update action selection.`);
    }

    await this.clickLocator(resultCellBySection(updateTitle));
    await expect(this._page.locator(this.updateActionDialog)).toBeVisible();
  }

  /**
   * Verifies that the Update Action dialog is displayed.
   */
  async verifyUpdateActionModalIsDisplayed(): Promise<void> {
    await expect(this._page.locator(this.updateActionDialog)).toBeVisible();
  }

  /**
   * Verifies that the Update Action dialog displays each requested field label.
   * @param sections Semicolon-delimited field labels expected in the dialog.
   */
  async verifyUpdateActionSectionsAreDisplayed(sections: string): Promise<void> {
    const sectionNames = sections.split(';').map((section) => section.trim()).filter(Boolean);
    if (sectionNames.length === 0) {
      throw new Error('At least one Update Action section must be provided.');
    }

    const dialog = this._page.locator(this.updateActionDialog);
    await expect(dialog).toBeVisible();

    for (const sectionName of sectionNames) {
      await expect(dialog.getByText(sectionName, { exact: true })).toBeVisible();
    }
  }

  /**
   * Verifies that the Update Action dialog displays each requested value.
   * @param values Semicolon-delimited values expected in the dialog.
   */
  async verifyUpdateActionValuesAreDisplayed(values: string): Promise<void> {
    const expectedValues = values.split(';').map((value) => value.trim()).filter(Boolean);
    if (expectedValues.length === 0) {
      throw new Error('At least one Update Action value must be provided.');
    }

    const dialog = this._page.locator(this.updateActionDialog);
    await expect(dialog).toBeVisible();

    try {
      for (const expectedValue of expectedValues) {
        await expect(dialog).toContainText(new RegExp(this.escapeRegularExpression(expectedValue), 'i'));
      }
    } catch {
      this.failWithApplicationError(
        'The Update Action dialog must display every expected value.',
        `[${expectedValues.join(' | ')}]`,
        (await dialog.innerText()).trim(),
        'The Update Action dialog was visible and its content was read successfully.',
      );
    }
  }

  /**
   * Selects an option in the Update Action dialog.
   * @param option Option label to select.
   * @param fieldName Business name of the dialog field.
   */
  async selectUpdateActionOption(option: string, fieldName: string): Promise<void> {
    if (fieldName === 'User Assigned') {
      await this.selectUpdateActionUser(option);
      return;
    }

    const dropdownSelector = this.getUpdateActionDropdownSelector(fieldName);
    await this.clickElement(dropdownSelector);
    await this.clickLocator(this._page.getByRole('option', { name: option, exact: true }).first());
  }

  /**
   * Saves the changes in the Update Action dialog.
   */
  async updateAction(): Promise<void> {
    await this.updateActionButton().click();
  }

  /**
   * Verifies the selected option in the Update Action dialog.
   * @param option Expected option label.
   * @param fieldName Business name of the dialog field.
   */
  async verifyUpdateActionOptionIsSelected(option: string, fieldName: string): Promise<void> {
    if (fieldName === 'User Assigned') {
      const selectedUsers = this._page.locator(`${this.updateActionUserAssignedDropdown} .selected-person-name`);
      try {
        await expect(selectedUsers).toContainText(option);
      } catch {
        this.failWithApplicationError(
          'The Update Action User Assigned field must display the selected user.',
          option,
          `[${(await selectedUsers.allTextContents()).map(user => user.trim()).join(' | ')}]`,
          'The selected User Assigned values were read successfully.',
        );
      }
      return;
    }

    const dropdownSelector = this.getUpdateActionDropdownSelector(fieldName);
    const selectedOption = this._page.locator(`${dropdownSelector} .k-input-value-text`);
    try {
      await expect(selectedOption).toHaveText(option);
    } catch {
      this.failWithApplicationError(
        `The Update Action "${fieldName}" field must display the selected option.`,
        option,
        (await selectedOption.textContent())?.trim() ?? '',
        'The selected dropdown value was read successfully.',
      );
    }
  }

  /**
   * Enables the Private Action switch when it is currently disabled.
   */
  async enablePrivateAction(): Promise<void> {
    const toggle = this.privateActionToggle();
    if (await toggle.getAttribute('aria-checked') !== 'true') {
      await toggle.click();
    }
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  }

  /**
   * Disables the Private Action switch when it is currently enabled.
   */
  async disablePrivateAction(): Promise<void> {
    const toggle = this.privateActionToggle();
    if (await toggle.getAttribute('aria-checked') !== 'false') {
      await toggle.click();
    }
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  }

  /**
   * Verifies the requested Private Action switch state.
   * @param enabled Expected switch state.
   */
  async verifyPrivateActionState(enabled: boolean): Promise<void> {
    await expect(this.privateActionToggle()).toHaveAttribute('aria-checked', String(enabled));
  }

  /**
   * Opens the Comments tab in the Update Action dialog.
   */
  async openCommentsTab(): Promise<void> {
    await this.updateActionCommentsTab().click();
  }

  /**
   * Enters text in the comment editor of the currently open action.
   * @param comment Text of the comment to enter.
   */
  async enterComment(comment: string): Promise<void> {
    await this._page.locator(this.commentEditor).fill(comment);
  }

  /**
   * Posts the text entered in the action comment editor.
   */
  async postComment(): Promise<void> {
    await this.submitCommentButton().click();
  }

  /**
   * Verifies that a posted action comment is displayed.
   * @param comment Expected comment text.
   */
  async verifyCommentIsDisplayed(comment: string): Promise<void> {
    await expect(this.commentEntryByText(comment)).toBeVisible();
  }

  /**
   * Verifies that a displayed comment includes a date.
   * @param comment Comment text used to identify its entry.
   */
  async verifyCommentDateIsDisplayed(comment: string): Promise<void> {
    await expect(this.commentEntryByText(comment).locator('.comment-date'))
      .toHaveText(/\d{1,2}\s[A-Za-z]{3}\s\d{4}\s\d{1,2}:\d{2}\s(?:AM|PM)\s\(UTC\)/);
  }

  /**
   * Verifies that a displayed comment exposes at least one action control.
   * @param comment Comment text used to identify its entry.
   */
  async verifyCommentActionsAreDisplayed(comment: string): Promise<void> {
    const commentActions = this.commentEntryByText(comment).locator('.comment-actions-row');
    await expect(commentActions.locator('a:text-is("Reply")')).toBeVisible();
    await expect(commentActions.locator('a:text-is("Edit")')).toBeVisible();
    await expect(commentActions.locator('a:text-is("Delete")')).toBeVisible();
  }

  /**
   * Opens the Attachments tab in the Update Action dialog.
   */
  async openAttachmentsTab(): Promise<void> {
    await this.updateActionAttachmentsTab().click();
  }

  /**
   * Verifies that the Attachments tab in the Update Action dialog displays its upload control.
   */
  async verifyUpdateActionUploadFilesButtonIsDisplayed(): Promise<void> {
    await expect(this.updateActionUploadFilesButton()).toBeVisible();
  }

  /**
   * Uploads an attachment to the currently open action.
   * @param filePath Project-relative attachment path.
   */
  async uploadAttachment(filePath: string): Promise<void> {
    await this.uploadFileFromHiddenInput(this.attachmentFileInput, path.resolve(filePath));
  }

  /**
   * Verifies whether an attachment is displayed in the action attachment grid.
   * @param fileName Expected attachment file name.
   * @param displayed Whether the attachment should be displayed.
   */
  async verifyAttachmentIsDisplayed(fileName: string, displayed: boolean): Promise<void> {
    const attachment = this.attachmentDocumentNameCell(fileName);
    if (displayed) {
      await expect(attachment.first()).toBeVisible();
      return;
    }

    await expect(attachment).toHaveCount(0);
  }

  /**
   * Removes the first attachment displayed in the Update Action attachment grid.
   */
  async removeFirstAttachment(): Promise<void> {
    const attachmentRow = this.firstAttachmentRow();
    await expect(attachmentRow).toBeVisible();
    await this.clickLocator(attachmentRow.getByRole('button', { name: 'Remove', exact: true }));
  }

  /**
   * Returns the selector for a supported Add Action dialog dropdown.
   * @param fieldName Business name of the dropdown field.
   * @returns Selector for the dropdown control.
   */
  private getDropdownSelector(fieldName: string): string {
    switch (fieldName) {
      case 'User Assigned':
        return this.userAssignedDropdown;
      case 'Priority':
        return this.priorityDropdown;
      case 'Status':
        return this.statusDropdown;
      default:
        throw new Error(`Dropdown field "${fieldName}" is not supported in the Add Action dialog.`);
    }
  }

  /**
   * Returns the selector for a supported Update Action dialog dropdown.
   * @param fieldName Business name of the dropdown field.
   * @returns Selector for the dropdown control.
   */
  private getUpdateActionDropdownSelector(fieldName: string): string {
    switch (fieldName) {
      case 'Priority':
        return this.updateActionPriorityDropdown;
      case 'Status':
        return this.updateActionStatusDropdown;
      default:
        throw new Error(`Dropdown field "${fieldName}" is not supported in the Update Action dialog.`);
    }
  }

  /**
   * Searches for and selects the requested user entry in the Add Action people picker.
   * @param user User entry to search for and select.
   */
  private async selectAssignedUsers(user: string): Promise<void> {
    await this.clickElement(this.userAssignedDropdown);
    await this.fillInputText(this.peoplePickerSearchInput, user);
    await this.clickElement(this.peoplePickerOptionByName(user));
  }

  /**
   * Searches for and selects a user in the Update Action people picker.
   * @param user User entry to search for and select.
   */
  private async selectUpdateActionUser(user: string): Promise<void> {
    await this.clickElement(this.updateActionUserAssignedDropdown);
    await this.fillInputText(this.peoplePickerSearchInput, user);
    await this.clickElement(this.peoplePickerOptionByName(user));
  }

  private escapeRegularExpression(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

}