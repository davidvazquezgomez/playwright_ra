import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class UserManagementPage extends BasePage {
  private userDialogByTitle = (title: string) =>
    `div[role="dialog"]:has(.k-dialog-title:text-is("${title}"))`;
  private externalUserDialog =
    'div[role="dialog"]:has(.k-dialog-title:text-is("Add Non-Deloitte Admin"), .k-dialog-title:text-is("Add Non-Deloitte User"))';
  private externalUserFieldByName = (fieldName: string) =>
    `${this.externalUserDialog} kendo-textbox[formcontrolname="${fieldName}"] input.k-input-inner`;
  private userDialogTitleByTitle = (title: string) =>
    `${this.userDialogByTitle(title)} .k-dialog-title`;
  private deleteUserDialog = this.userDialogByTitle('Delete User');
  private deleteUserCurrentStep =
    `${this.deleteUserDialog} .k-step-current .k-step-text:text-is("Select Replacement")`;
  private deleteUserReplacementDropdown =
    `${this.deleteUserDialog} kendo-dropdownlist:has(.k-input-value-text:text-is("Reassign To"))`;
  private deleteUserReplacementSearchInput =
    'kendo-popup.k-animation-container-shown:visible .k-dropdownlist-popup input[role="searchbox"][aria-label="Filter"]';
  private deleteUserReplacementOptionByName = (userName: string) =>
    `kendo-popup.k-animation-container-shown:visible .k-dropdownlist-popup li[role="option"]:has(span:text-is("${userName}"))`;
  private deleteUserReplacementValue =
    `${this.deleteUserReplacementDropdown} .k-input-value-text`;
  private addDeloitteUserSearchInput =
    `${this.userDialogByTitle('Add Deloitte User')} input[role="combobox"][placeholder="Search for user..."]`;
  private searchResultByName = (userName: string) =>
    `.k-animation-container:visible [role="option"]:has-text("${userName}")`;
  private selectedDeloitteUserByName = (userName: string) =>
    `${this.userDialogByTitle('Add Deloitte User')} kendo-taglist[role="listbox"] .k-chip[role="option"] .tag-person-name:text-is("${userName}")`;
  private addDeloitteUserValidationMessage = (message: string) =>
    `${this.userDialogByTitle('Add Deloitte User')} kendo-formerror[role="alert"]:text-is("${message}")`;
  private validationMessageByField = (fieldName: string, message: string) =>
    `${this.externalUserDialog} ` +
    `kendo-formfield:has(kendo-label .k-label:text-is("${fieldName}")) ` +
    `kendo-formerror[role="alert"]:has-text("${message}")`;
  private buttonByName = (buttonName: string) =>
    this._page.getByRole('button', { name: buttonName, exact: true });
  private exportUsersButton = 'button:has(.k-button-text:text-is("EXPORT USERS"))';
  private gridRows = '[role="grid"][aria-label="Data table"] tbody tr.k-master-row';
  private gridColumnHeaderByName = (columnName: string) =>
    `role=columnheader[name="${columnName}"]`;
  private gridFilterInputByName = (columnName: string) =>
    `input[aria-label="${columnName} Filter"]`;
  private gridFilterClearButtonByName = (columnName: string) =>
    `td[aria-label="${columnName} Filter"] button[title="Clear"]`;
  private gridRowByText = (text: string) =>
    `${this.gridRows}:has-text("${text}")`;
  private gridRowByEmail = (emailAddress: string) =>
    `${this.gridRows}:has(td[data-kendo-grid-column-index="2"]:text-is("${emailAddress}"))`;
  private userCheckboxByEmail = (emailAddress: string) =>
    `${this.gridRowByEmail(emailAddress)} input[type="checkbox"]`;

  /**
   * Verifies that the Deloitte Users tab is visible and selected in User Management.
   */
  async verifyDeloitteUsersSectionDisplayed(): Promise<void> {
    await this.verifyActiveTabIsDisplayed('Deloitte Users');
  }

  /**
   * Verifies that the requested User Management action buttons are visible.
   * @param buttons Semicolon-delimited button labels to verify.
   */
  async verifyButtonsAreDisplayed(buttons: string): Promise<void> {
    const buttonNames = buttons.split(';').map(button => button.trim()).filter(Boolean);
    if (buttonNames.length === 0) {
      throw new Error('At least one User Management button must be provided.');
    }

    for (const buttonName of buttonNames) {
      if (buttonName === 'EXPORT USERS') {
        await expect(this._page.locator(this.exportUsersButton)).toBeVisible();
        continue;
      }

      await expect(this.buttonByName(buttonName)).toBeVisible();
    }
  }

  /**
   * Verifies that the initially displayed User Management grid data is ordered by a column.
   * This assertion intentionally does not verify the column's aria-sort state.
   * @param columnName Name of the column used to verify the default data order.
   */
  async verifyGridDataIsSortedByDefault(columnName: string): Promise<void> {
    const columnHeader = this._page.locator(this.gridColumnHeaderByName(columnName));
    const columnIndex = await columnHeader.getAttribute('aria-colindex');
    if (!columnIndex) {
      throw new Error(`Column "${columnName}" is not available in User Management.`);
    }

    const columnCells = this._page.locator(
      `${this.gridRows} td[data-kendo-grid-column-index="${Number(columnIndex) - 1}"]`,
    );
    const areValuesSortedAscending = async (): Promise<boolean> => {
      const values = (await columnCells.allTextContents()).map(value => value.trim());
      const sortedValues = [...values].sort((firstValue, secondValue) =>
        firstValue.localeCompare(secondValue),
      );

      return values.length > 0 && values.every((value, index) => value === sortedValues[index]);
    };

    try {
      await expect.poll(areValuesSortedAscending).toBe(true);
    } catch {
      const actualValues = (await columnCells.allTextContents()).map(value => value.trim());
      const expectedValues = [...actualValues].sort((firstValue, secondValue) =>
        firstValue.localeCompare(secondValue),
      );

      this.failWithApplicationError(
        `The User Management grid must be sorted by "${columnName}" in ascending order by default.`,
        `[${expectedValues.join(' | ')}]`,
        `[${actualValues.join(' | ')}]`,
        'The default grid data was displayed and read successfully before comparison.',
      );
    }
  }

  /**
   * Verifies that a filtered User Management grid contains one row with the requested user value.
   * @param userValue Email address or displayed user value expected in the grid.
   */
  async verifyUserIsDisplayedInTable(userValue: string): Promise<void> {
    const userRows = this._page.locator(this.gridRows);

    await expect(userRows).toHaveCount(1);
    await expect(this._page.locator(this.gridRowByText(userValue))).toBeVisible();
  }

  /**
   * Verifies that a filtered User Management grid has no rows for the requested user value.
   * @param userValue Email address or displayed user value that must be absent from the grid.
   */
  async verifyUserIsNotDisplayedInTable(userValue: string): Promise<void> {
    await expect(this._page.locator(this.gridRows)).toHaveCount(0);
  }

  /**
   * Filters the User Management grid by email and selects the matching user's checkbox.
   * @param emailAddress Email address of the user to select.
   */
  async selectUserFromTable(emailAddress: string): Promise<void> {
    await this.searchUsers(emailAddress, 'Email');

    const userRow = this._page.locator(this.gridRowByEmail(emailAddress));
    const userCheckbox = this._page.locator(this.userCheckboxByEmail(emailAddress));
    await expect(userRow).toBeVisible();
    await userCheckbox.check();
    await expect(userCheckbox).toBeChecked();
  }

  /**
   * Filters the User Management grid by a specified column value.
   * @param searchText Text used to filter the grid.
   * @param columnName Display name of the grid column to filter.
   */
  async searchUsers(searchText: string, columnName: string): Promise<void> {
    const filterInput = this.gridFilterInputByName(columnName);
    await this.clearInput(filterInput);
    await this.fillInputText(filterInput, searchText);
  }

  /**
   * Clears a User Management grid column filter.
   * @param columnName Display name of the grid column whose filter is cleared.
   */
  async clearUserSearchFilter(columnName: string): Promise<void> {
    const clearButton = this.gridFilterClearButtonByName(columnName);
    await this.clickElement(clearButton);
  }

  /**
   * Verifies that a User Management grid column filter has no value.
   * @param columnName Display name of the grid column whose filter is verified.
   */
  async verifyUserSearchFilterIsRemoved(columnName: string): Promise<void> {
    await expect(this._page.locator(this.gridFilterInputByName(columnName))).toHaveValue('');
  }

  /**
   * Verifies that a supported User Management dialog is visible with its expected title.
   * @param title Exact title expected in the dialog header.
   */
  async verifyUserDialogDisplayed(title: string): Promise<void> {
    this.validateUserDialogTitle(title);

    await this.waitForSelectorStatus(this.userDialogByTitle(title), 'visible');
    await this.assertText(this.userDialogTitleByTitle(title), title);
  }

  /**
   * Verifies that a supported User Management dialog is no longer visible.
   * @param title Title of the dialog expected to be closed.
   */
  async verifyUserDialogClosed(title: string): Promise<void> {
    this.validateUserDialogTitle(title);

    await this.waitForSelectorStatus(this.userDialogByTitle(title), 'hidden');
  }

  /**
   * Verifies that the Delete User reassignment dialog is displayed at its initial step.
   */
  async verifyDeleteUserDialogDisplayed(): Promise<void> {
    await expect(this._page.locator(this.deleteUserDialog)).toBeVisible();
    await expect(this._page.locator(this.deleteUserCurrentStep)).toBeVisible();
    await expect(this._page.locator(this.deleteUserReplacementDropdown)).toBeVisible();
  }

  /**
   * Selects the user who will receive assignments before deletion.
   * @param userName Display name of the replacement user.
   */
  async selectDeleteUserReplacement(userName: string): Promise<void> {
    await this.clickElement(this.deleteUserReplacementDropdown);
    await this.fillInputText(this.deleteUserReplacementSearchInput, userName);
    await this.clickElement(this.deleteUserReplacementOptionByName(userName));
  }

  /**
   * Enters an email address in the Add Deloitte User search field.
   * @param emailAddress Email address used to search for a Deloitte user.
   */
  async enterDeloitteUserSearchEmail(emailAddress: string): Promise<void> {
    await this.fillInputText(this.addDeloitteUserSearchInput, emailAddress);
  }

  /**
   * Enters a value in a supported field of the Add Non-Deloitte User or Admin dialog.
   * @param value Value to enter in the requested field.
   * @param fieldLabel Visible label of the field to populate.
   */
  async enterExternalUserField(value: string, fieldLabel: string): Promise<void> {
    const fieldNames: Record<string, string> = {
      'First Name': 'firstName',
      'Last Name': 'lastName',
      Email: 'email',
      Company: 'organization',
      'Company Name': 'organization',
    };
    const fieldName = fieldNames[fieldLabel];

    if (!fieldName) {
      throw new Error(`Field "${fieldLabel}" is not supported for external users.`);
    }

    await this.fillInputText(this.externalUserFieldByName(fieldName), value);
  }

  /**
   * Selects a visible result from the Add Deloitte User search.
   * @param userName Display name of the user to select.
   */
  async selectDeloitteUserSearchResult(userName: string): Promise<void> {
    await this.clickElement(this.searchResultByName(userName));
  }

  /**
   * Verifies that the requested Deloitte user is selected in the Add Deloitte User dialog.
   * @param userName Display name expected in the selected-user chip.
   */
  async verifyDeloitteUserSelected(userName: string): Promise<void> {
    await this.waitForSelectorStatus(this.selectedDeloitteUserByName(userName), 'visible');
  }

  /**
   * Verifies that the Add Deloitte User dialog displays the expected form validation message.
   * @param message Exact validation message expected in the dialog.
   */
  async verifyAddDeloitteUserValidationMessage(message: string): Promise<void> {
    await this.waitForSelectorStatus(this.addDeloitteUserValidationMessage(message), 'visible');
  }

  /**
   * Verifies each validation message against its corresponding user form field.
   * @param messages Semicolon-delimited expected validation messages.
   * @param fields Semicolon-delimited labels of the fields that display each message.
   */
  async verifyValidationMessagesForFields(messages: string, fields: string): Promise<void> {
    const validationMessages = messages.split(';').map(message => message.trim()).filter(Boolean);
    const fieldNames = fields.split(';').map(field => field.trim()).filter(Boolean);

    if (validationMessages.length !== fieldNames.length || validationMessages.length === 0) {
      throw new Error('Each validation message must have one corresponding field.');
    }

    for (const [index, message] of validationMessages.entries()) {
      await this.waitForSelectorStatus(this.validationMessageByField(fieldNames[index], message), 'visible');
    }
  }

  private validateUserDialogTitle(title: string): void {
    const supportedTitles = [
      'Add Deloitte User',
      'Add Non-Deloitte Admin',
      'Add Non-Deloitte User',
      'Delete User',
    ];
    if (!supportedTitles.includes(title)) {
      throw new Error(`Unsupported User Management dialog title "${title}".`);
    }
  }
}