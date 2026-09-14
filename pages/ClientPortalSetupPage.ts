import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClientPortalSetupPage extends BasePage {
    private clientPortalNameInput = 'kendo-textbox[formcontrolname="clientPortalName"] input.k-input-inner';
    private deloitteAdministratorsInput =
        'app-people-picker[formcontrolname="deloitteAdministrators"] input[role="combobox"]';
    private businessSponsorDropdown =
        'app-people-picker[formcontrolname="businessSponsor"] kendo-dropdownlist[role="combobox"]';
    private askDeloitteContactInput = 'kendo-textbox[formcontrolname="askDeloitteEmailid"] input.k-input-inner';
    private peoplePickerSearchInput =
        'kendo-popup.k-animation-container-shown:visible .k-dropdownlist-popup [role="searchbox"][aria-label="Filter"]';
    private deloitteAdministratorsValues =
        'app-people-picker[formcontrolname="deloitteAdministrators"] .tag-person-name';
    private businessSponsorValue =
        'app-people-picker[formcontrolname="businessSponsor"] .selected-person-name';
    private visibleDeloitteAdminOptions = 'kendo-popup.k-animation-container-shown:visible li[role="option"]';
    private knowledgeModulesHeading =
        this._page.getByRole('heading', { name: 'Knowledge Modules & Impact Areas', exact: true });
    private jurisdictionsHeading =
        this._page.getByRole('heading', { name: 'Jurisdictions selection', exact: true });
    private knowledgeModulesSelectAllCheckboxWrapper = () =>
        this._page.locator('kendo-checkbox[aria-label^="Select all "]').first();
    private jurisdictionsSelectAllRow = this._page
        .locator('div.master-checkbox-wrapper')
        .filter({ hasText: /^\s*Select all jurisdictions\s*$/i });
    private jurisdictionsSelectAllCheckbox = this.jurisdictionsSelectAllRow.locator('input[type="checkbox"]').first();
    private actionsAvailabilityButtonByState = (actionsState: 'Actions Enabled' | 'Actions Disabled') =>
        this._page.getByRole('button', { name: actionsState, exact: true });

    /**
     * Verifies that the requested Client Portal Setup fields are visible.
     * @param fields Semicolon-delimited names of fields to verify.
     */
    async verifyFieldsDisplayed(fields: string): Promise<void> {
        await this.verifyRequestedFieldsDisplayed(fields, {
            'Client Portal Name': this.clientPortalNameInput,
            'Deloitte Administrators': this.deloitteAdministratorsInput,
            'Business Sponsor': this.businessSponsorDropdown,
            'Ask Deloitte Contact': this.askDeloitteContactInput,
        });
    }

    /**
     * Fills a supported Client Portal Setup form field.
     * @param fieldName Visible business name of the field.
     * @param value Value to enter or select.
     */
    async fillField(fieldName: string, value: string): Promise<void> {
        switch (fieldName) {
            case 'Client Portal Name':
                await this.clearInput(this.clientPortalNameInput);
                await this.fillInputText(this.clientPortalNameInput, value);
                return;
            case 'Deloitte Administrators':
                // Open the people picker dropdown
                await this.clickElement(this.deloitteAdministratorsInput);
                // Fill search input to filter options
                await this.fillInputText(this.deloitteAdministratorsInput, value);
                // Wait for options to appear and select matching one
                const matchingOption = this.findDeloitteAdminOption(value);
                await matchingOption.waitFor({ state: 'visible', timeout: 10000 });
                await this.clickLocator(matchingOption);
                return;
            case 'Business Sponsor':
                await this.selectUserPickerOption(
                    this.businessSponsorDropdown,
                    this.peoplePickerSearchInput,
                    value,
                );
                return;
            case 'Ask Deloitte Contact':
                await this.clearInput(this.askDeloitteContactInput);
                await this.fillInputText(this.askDeloitteContactInput, value);
                return;
            default:
                throw new Error(`Client Portal Setup field "${fieldName}" is not supported.`);
        }
    }

    /**
     * Finds a Deloitte Administrator option matching the given name in the visible dropdown.
     * @param optionName The name to find
     * @returns A Locator for the matching option
     */
    private findDeloitteAdminOption(optionName: string) {
        const normalizedName = optionName.trim();
        // Try to find exact match first, then try fragments
        return this._page
            .locator(this.visibleDeloitteAdminOptions)
            .filter({
                hasText: new RegExp(`^\\s*${this.escapeRegularExpression(normalizedName)}\\s*$`, 'i'),
            })
            .first()
            .or(
                this._page
                    .locator(this.visibleDeloitteAdminOptions)
                    .filter({ hasText: new RegExp(this.escapeRegularExpression(normalizedName), 'i') })
                    .first(),
            );
    }

    /**
     * Verifies that a supported Client Portal Setup field displays the expected value.
     * @param fieldName Visible business name of the field.
     * @param expectedValue Value expected in the field.
     */
    async verifyFieldValue(fieldName: string, expectedValue: string): Promise<void> {
        switch (fieldName) {
            case 'Client Portal Name':
                await expect(this._page.locator(this.clientPortalNameInput)).toHaveValue(expectedValue);
                return;
            case 'Deloitte Administrators':
                // Case-insensitive comparison for people picker names
                await expect(this._page.locator(this.deloitteAdministratorsValues)).toContainText(
                    new RegExp(`^\\s*${this.escapeRegularExpression(expectedValue)}\\s*$`, 'i')
                );
                return;
            case 'Business Sponsor':
                // Case-insensitive comparison for people picker names
                await expect(this._page.locator(this.businessSponsorValue)).toContainText(
                    new RegExp(`^\\s*${this.escapeRegularExpression(expectedValue)}\\s*$`, 'i')
                );
                return;
            case 'Ask Deloitte Contact':
                await expect(this._page.locator(this.askDeloitteContactInput)).toHaveValue(expectedValue);
                return;
            default:
                throw new Error(`Client Portal Setup field "${fieldName}" is not supported.`);
        }
    }

    /**
     * Changes the Knowledge Modules and Impact Areas configuration through its Select All checkbox.
     */
    async updateKnowledgeModulesAndImpactAreasSelection(): Promise<void> {
        await this.toggleWizardSelectAll(
            this.knowledgeModulesHeading,
            'Knowledge Modules & Impact Areas',
            this.knowledgeModulesSelectAllCheckboxWrapper(),
            this.knowledgeModulesSelectAllCheckboxWrapper().locator('input[type="checkbox"]'),
        );
    }

    /**
     * Changes the Jurisdictions configuration through its Select All checkbox.
     */
    async updateJurisdictionsSelection(): Promise<void> {
        await this.toggleWizardSelectAll(
            this.jurisdictionsHeading,
            'Jurisdictions',
            this.jurisdictionsSelectAllRow,
            this.jurisdictionsSelectAllCheckbox,
        );
    }

    /**
     * Selects Actions Enabled only when it is not already selected.
     */
    async ensureActionsEnabledIsSelected(): Promise<void> {
        if (!await this.isActionsAvailabilitySelected('Actions Enabled')) {
            await this.clickLocator(this.actionsAvailabilityButtonByState('Actions Enabled'));
        }

        await expect.poll(
            async () => this.isActionsAvailabilitySelected('Actions Enabled'),
            { message: 'Expected Actions Enabled to be selected before continuing.' },
        ).toBe(true);
    }

    /**
     * Verifies that the requested Actions availability option is selected without changing the current selection.
     * @param actionsState Option expected to be selected.
     */
    async verifyActionsAvailabilityIsSelected(actionsState: string): Promise<void> {
        const normalizedState = actionsState.trim() as 'Actions Enabled' | 'Actions Disabled';
        if (!['Actions Enabled', 'Actions Disabled'].includes(normalizedState)) {
            throw new Error(`Actions availability "${actionsState}" is not supported.`);
        }

        await expect.poll(
            async () => this.isActionsAvailabilitySelected(normalizedState),
            { message: `Expected ${normalizedState} to be selected in Client Portal Setup.` },
        ).toBe(true);
    }

    /**
     * Selects Actions Disabled after verifying that Actions Enabled is the current selection.
     */
    async selectActionsDisabled(): Promise<void> {
        await expect.poll(
            async () => this.isActionsAvailabilitySelected('Actions Enabled'),
            { message: 'Expected Actions Enabled to be selected before selecting Actions Disabled.' },
        ).toBe(true);

        const actionsDisabledButton = this.actionsAvailabilityButtonByState('Actions Disabled');
        await this.clickLocator(actionsDisabledButton);
        await expect.poll(
            async () => this.isActionsAvailabilitySelected('Actions Disabled'),
            { message: 'Expected Actions Disabled to be selected after clicking it.' },
        ).toBe(true);
    }

    /**
     * Determines whether an Actions availability option is visually selected.
     * @param actionsState Option whose selected state is read.
     * @returns Whether the requested option is selected.
     */
    private async isActionsAvailabilitySelected(
        actionsState: 'Actions Enabled' | 'Actions Disabled',
    ): Promise<boolean> {
        const targetButton = this.actionsAvailabilityButtonByState(actionsState);

        if (!await targetButton.isVisible()) {
            return false;
        }

        return targetButton.evaluate((button) => button.classList.contains('k-button-solid-primary'));
    }

    /**
     * Toggles the Select All checkbox in the current portal-configuration wizard step.
     * @param pageHeading Heading that identifies the current wizard step.
     * @param stepName Business name of the wizard step used in assertion output.
     * @param clickTarget Visible element to click to toggle the Select All state.
     * @param stateTarget Checkbox element whose checked state is asserted.
     */
    private async toggleWizardSelectAll(
        pageHeading: ReturnType<typeof this._page.getByRole>,
        stepName: string,
        clickTarget: ReturnType<typeof this._page.locator>,
        stateTarget: ReturnType<typeof this._page.locator>,
    ): Promise<void> {
        await expect(pageHeading, `Expected the ${stepName} wizard step to be displayed.`).toBeVisible();
        await expect(clickTarget, `Expected the ${stepName} Select All checkbox to be displayed.`).toBeVisible();

        const initialState = await stateTarget.isChecked();
        await clickTarget.click();

        if ((await stateTarget.isChecked()) === initialState) {
            await stateTarget.click();
        }

        await expect(stateTarget).toBeChecked({ checked: !initialState });
    }
}