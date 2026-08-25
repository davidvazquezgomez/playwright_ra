import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomaticAllocationPage extends BasePage {
  private allocationGridRows = 'app-auto-allocation [role="grid"][aria-label="Data table"] tbody tr.k-master-row';
  private readonly fieldSelectors: Record<string, string> = {
    'Allocation Name': 'role=columnheader[name="Allocation Name"]',
    Jurisdiction: 'role=columnheader[name="Jurisdiction"]',
    'Impact Area': 'role=columnheader[name="Impact Area"]',
    'Allocate To': 'role=columnheader[name="Allocate To"]',
  };
  private readonly setupFieldSelectors: Record<string, string> = {
    'Allocation Name': `label.k-label:text-is("Allocation Name")`,
    'Impact Area(s)': `label.k-label:text-is("Impact Area(s)")`,
    'Jurisdiction(s)': `label.k-label:text-is("Jurisdiction(s)")`,
    'Allocate Update To': `label.k-label:text-is("Allocate Update To")`,
    'Update Owner': `label.k-label:text-is("Update Owner")`,
    'Update Watchlist': `label.k-label:text-is("Update Watchlist")`,
  };
  private allocationRowByName = (allocationName: string) =>
    `${this.allocationGridRows}:has(td[data-kendo-grid-column-index="0"]:text-is("${allocationName}"))`;
  private allocationNameCells =
    `${this.allocationGridRows} td[data-kendo-grid-column-index="0"]`;
  private editAllocationButtonByName = (allocationName: string) =>
    `${this.allocationRowByName(allocationName)} button[title="Edit Allocation"]`;
  private removeAllocationButtonByName = (allocationName: string) =>
    `${this.allocationRowByName(allocationName)} button[title="Remove Allocation"]`;
  private allocationRecipientPicker =
    'app-auto-allocation-setup app-people-picker[formcontrolname="allocatedParty"] kendo-dropdownlist';
  private allocationNameInput =
    'app-auto-allocation-setup kendo-textbox[formcontrolname="allocationName"] input.k-input-inner';
  private readonly fieldSelectionControlByFieldName: Record<string, string> = {
    'Impact Area(s)':
      'app-auto-allocation-setup kendo-multiselect[formcontrolname="impactAreas"] input[role="combobox"]',
    Operator:
      'app-auto-allocation-setup kendo-dropdownlist[formcontrolname="operator"][role="combobox"]',
    'Jurisdiction(s)':
      'app-auto-allocation-setup kendo-multiselect[formcontrolname="jurisdictions"] input[role="combobox"]',
  };
  private readonly userPickerByFieldName: Record<string, { controlSelector: string; searchInputSelector: string }> = {
    'Update Owner':
      {
        controlSelector:
          'app-auto-allocation-setup app-people-picker[formcontrolname="allocatedParty"] kendo-dropdownlist[role="combobox"]',
        searchInputSelector:
          'kendo-popup.k-animation-container-shown:visible .k-dropdownlist-popup.custom-people-picker input[role="searchbox"][aria-label="Filter"]',
      },
    'Update Watchlist': {
      controlSelector:
        'app-auto-allocation-setup app-people-picker[formcontrolname="allocatedWatchList"] kendo-multiselect input[role="combobox"]',
      searchInputSelector:
        'app-auto-allocation-setup app-people-picker[formcontrolname="allocatedWatchList"] kendo-multiselect input[role="combobox"]',
    },
  };
  private allocationRecipientSearchInput =
    'kendo-popup.k-animation-container-shown:visible .k-dropdownlist-popup input[role="searchbox"][aria-label="Filter"]';
  private allocationRecipientOptionByEmail = (emailAddress: string) =>
    `kendo-popup.k-animation-container-shown:visible .k-dropdownlist-popup li[role="option"]:has-text("${emailAddress}")`;
  private setupFieldErrorByText = (message: string) =>
    this._page.locator(`.k-form-error`).filter({ hasText: message });
  private checkboxByName = (checkboxName: string) =>
    `role=checkbox[name="${checkboxName}"]`;
  private readonly selectedValueSelectorByFieldName: Record<string, string> = {
    Operator:
      'app-auto-allocation-setup kendo-dropdownlist[formcontrolname="operator"] .k-input-value-text',
    'Update Owner':
      'app-auto-allocation-setup app-people-picker[formcontrolname="allocatedParty"] .selected-person-name',
    'Update Watchlist':
      'app-auto-allocation-setup app-people-picker[formcontrolname="allocatedWatchList"] .tag-person-name',
  };

  /**
   * Opens the edit form for an automatic allocation.
   * @param allocationName Exact name of the allocation to edit.
   */
  async editAllocation(allocationName: string): Promise<void> {
    await this.ensureKendoGridHasRows(
      'app-auto-allocation [role="grid"][aria-label="Data table"]',
      `Automatic Allocation must contain an allocation before "${allocationName}" can be edited.`,
      'The Automatic Allocation grid was displayed before searching for the requested allocation.',
    );
    await expect(this._page.locator(this.allocationRowByName(allocationName))).toBeVisible();
    await this.ensureExpectedBusinessElementIsVisible(
      this._page.locator(this.editAllocationButtonByName(allocationName)),
      `The allocation "${allocationName}" must provide the Edit Allocation action.`,
      `The Edit Allocation button is displayed for "${allocationName}".`,
      `The allocation row "${allocationName}" is visible in the Automatic Allocation grid.`,
    );
    await this.clickElement(this.editAllocationButtonByName(allocationName));
  }

  /**
   * Opens the deletion confirmation dialog for an automatic allocation.
   * @param allocationName Exact name of the allocation to remove.
   */
  async removeAllocation(allocationName: string): Promise<void> {
    await this.ensureKendoGridHasRows(
      'app-auto-allocation [role="grid"][aria-label="Data table"]',
      `Automatic Allocation must contain an allocation before "${allocationName}" can be removed.`,
      'The Automatic Allocation grid was displayed before searching for the requested allocation.',
    );
    await this.ensureExpectedBusinessElementIsVisible(
      this._page.locator(this.removeAllocationButtonByName(allocationName)),
      `The allocation "${allocationName}" must provide the Remove Allocation action.`,
      `The Remove Allocation button is displayed for "${allocationName}".`,
      `The allocation row "${allocationName}" is visible in the Automatic Allocation grid.`,
    );
    await this.clickElement(this.removeAllocationButtonByName(allocationName));
  }

  /**
   * Verifies that the requested Automatic Allocation grid headers are visible.
   * @param fields Semicolon-delimited display names of the expected grid headers.
   */
  async verifyAutomaticAllocationFieldsDisplayed(fields: string): Promise<void> {
    await this.verifyRequestedFieldsDisplayed(fields, this.fieldSelectors);
  }

  /**
   * Verifies whether an allocation is displayed in the Automatic Allocation grid.
   * @param allocationName Exact allocation name to verify in the grid.
   * @param expectedPresent Whether the allocation is expected to be displayed.
   */
  async verifyAllocationIsPresent(allocationName: string, expectedPresent: boolean = true): Promise<void> {
    const normalizedAllocationName = allocationName.trim();
    const allocationGrid = this._page.locator('app-auto-allocation [role="grid"][aria-label="Data table"]');
    const noRecordsRow = allocationGrid.locator('tbody tr.k-grid-norecords');
    const requestedAllocationRow = this._page.locator(this.allocationRowByName(normalizedAllocationName));

    await expect(allocationGrid).toBeVisible();
    if (expectedPresent) {
      try {
        await expect(requestedAllocationRow).toBeVisible();
        return;
      } catch (error) {
        const displayedAllocationNames = (await this._page.locator(this.allocationNameCells).allTextContents())
          .map(name => name.trim());

        if (await noRecordsRow.isVisible() || displayedAllocationNames.length > 0) {
          this.failWithApplicationError(
            'A created allocation must be listed in Automatic Allocation of Updates.',
            `The allocation "${normalizedAllocationName}" is displayed.`,
            `The allocation "${normalizedAllocationName}" is not displayed.`,
            `Displayed allocation names: ${displayedAllocationNames.join(', ') || '(none)'}.`,
          );
        }

        throw error;
      }
    } else {
      await expect.poll(async () =>
        (await this._page.locator(this.allocationGridRows).count()) > 0 ||
        (await noRecordsRow.count()) > 0,
      ).toBe(true);
    }

    const displayedAllocationNames = (await this._page.locator(this.allocationNameCells).allTextContents())
      .map(name => name.trim());
    const isPresent = displayedAllocationNames.includes(normalizedAllocationName);
    if (isPresent !== expectedPresent) {
      this.failWithApplicationError(
        expectedPresent
          ? 'A created allocation must be listed in Automatic Allocation of Updates.'
          : 'A cancelled allocation must not be listed in Automatic Allocation of Updates.',
        expectedPresent
          ? `The allocation "${normalizedAllocationName}" is displayed.`
          : `The allocation "${normalizedAllocationName}" is not displayed.`,
        expectedPresent
          ? `The allocation "${normalizedAllocationName}" is not displayed.`
          : `The allocation "${normalizedAllocationName}" is displayed.`,
        `Displayed allocation names: ${displayedAllocationNames.join(', ') || '(none)'}.`,
      );
    }
  }

  /**
   * Verifies that the requested fields are visible in the Automatic Allocation Setup form.
   * @param fields Semicolon-delimited display names of the expected form fields.
   */
  async verifyAutomaticAllocationSetupFieldsDisplayed(fields: string): Promise<void> {
    await this.verifyRequestedFieldsDisplayed(fields, this.setupFieldSelectors);
  }

  /**
   * Verifies that the requested inline field errors are visible in the Automatic Allocation Setup form.
   * @param messages Semicolon-delimited field-error messages.
   */
  async verifyAutomaticAllocationSetupFieldErrors(messages: string): Promise<void> {
    const fieldErrorMessages = messages.split(';').map(message => message.trim()).filter(Boolean);
    if (fieldErrorMessages.length === 0) {
      throw new Error('At least one Automatic Allocation Setup field-error message must be provided.');
    }

    for (const message of fieldErrorMessages) {
      await expect(this.setupFieldErrorByText(message)).toBeVisible();
    }
  }

  /**
   * Fills the Allocation Name field in the Automatic Allocation Setup form.
   * @param allocationName Value to enter as the allocation name.
   */
  async fillAllocationName(allocationName: string): Promise<void> {
    await this.fillInputText(this.allocationNameInput, allocationName);
  }

  /**
   * Verifies that an Automatic Allocation Setup checkbox remains selected.
   * @param checkboxName Accessible name of the expected selected checkbox.
   */
  async verifyCheckboxIsStillSelected(checkboxName: string): Promise<void> {
    const checkboxSelector = this.checkboxByName(checkboxName);
    const isSelected = await this.checkIfFieldIsSelected(checkboxSelector);

    if (!isSelected) {
      this.failWithApplicationError(
        `The ${checkboxName} Automatic Allocation Setup checkbox must retain its selected state after dismissing unsaved changes.`,
        `The ${checkboxName} checkbox is selected.`,
        `The ${checkboxName} checkbox is not selected.`,
        `The ${checkboxName} checkbox was located and its checked state was read successfully.`,
      );
    }
  }

  /**
   * Verifies that an Automatic Allocation Setup field retains its selected value.
   * @param expectedValue Expected visible value of the field.
   * @param fieldName Business name of the field.
   */
  async verifyFieldValueIsStillSelected(expectedValue: string, fieldName: string): Promise<void> {
    const selectedValueSelector = this.selectedValueSelectorByFieldName[fieldName];
    if (!selectedValueSelector) {
      throw new Error(`Automatic Allocation field "${fieldName}" is not supported for selected-value verification.`);
    }

    const actualValue = (await this.getText(selectedValueSelector)).trim();

    if (actualValue !== expectedValue) {
      this.failWithApplicationError(
        `The ${fieldName} Automatic Allocation Setup field must retain its selected value after dismissing unsaved changes.`,
        `The ${fieldName} field displays "${expectedValue}".`,
        `The ${fieldName} field displays "${actualValue}".`,
        `The ${fieldName} selected value was read successfully from the rendered field.`,
      );
    }
  }

  /**
   * Returns the selector for a supported Automatic Allocation Kendo field.
   * @param fieldName Business name of the Automatic Allocation field.
   * @returns Selector for the field's Kendo selection control.
   */
  getFieldSelectionControlSelector(fieldName: string): string {
    const fieldSelector = this.fieldSelectionControlByFieldName[fieldName];
    if (!fieldSelector) {
      throw new Error(`Automatic Allocation Kendo field "${fieldName}" is not supported.`);
    }

    return fieldSelector;
  }

  /**
   * Returns the selectors for a supported Automatic Allocation people picker.
   * @param fieldName Business name of the Automatic Allocation field.
   * @returns Selectors for the picker control and its search input.
   */
  getUserPickerSelectors(fieldName: string): { controlSelector: string; searchInputSelector: string } {
    const userPickerSelectors = this.userPickerByFieldName[fieldName];
    if (!userPickerSelectors) {
      throw new Error(`Automatic Allocation people picker "${fieldName}" is not supported.`);
    }

    return userPickerSelectors;
  }

  /**
   * Determines whether an Automatic Allocation field is a people picker.
   * @param fieldName Business name of the Automatic Allocation field.
   * @returns True when the field selects users or teams.
   */
  isUserPickerField(fieldName: string): boolean {
    return Boolean(this.userPickerByFieldName[fieldName]);
  }

  /**
   * Assigns an automatic allocation to a user through the Search Teams and Users picker.
   * @param emailAddress Email address of the user to assign.
   */
  async addAllocationRecipient(emailAddress: string): Promise<void> {
    await this.clickElement(this.allocationRecipientPicker);
    await this.fillInputText(this.allocationRecipientSearchInput, emailAddress);
    await this.clickElement(this.allocationRecipientOptionByEmail(emailAddress));
  }
}
