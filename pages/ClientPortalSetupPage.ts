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
        'kendo-popup.k-animation-container-shown .k-dropdownlist-popup [role="searchbox"][aria-label="Filter"]';
    private deloitteAdministratorsValues =
        'app-people-picker[formcontrolname="deloitteAdministrators"] [role="option"][aria-selected="true"]';
    private businessSponsorValue =
        'app-people-picker[formcontrolname="businessSponsor"] .selected-person-name';
    private knowledgeModulesHeading =
        this._page.getByRole('heading', { name: 'Knowledge Modules & Impact Areas', exact: true });
    private jurisdictionsHeading =
        this._page.getByRole('heading', { name: 'Jurisdictions selection', exact: true });
    private selectAllCheckbox = this._page.getByRole('checkbox', { name: 'Select All', exact: true });
    private actionsAvailabilityButton = () =>
        this._page.getByRole('button', { name: /Actions (Enabled|Disabled)/, exact: true });

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
                await this.selectUserPickerOption(
                    this.deloitteAdministratorsInput,
                    this.peoplePickerSearchInput,
                    value,
                );
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
                await expect(this._page.locator(this.deloitteAdministratorsValues)).toContainText(expectedValue);
                return;
            case 'Business Sponsor':
                await expect(this._page.locator(this.businessSponsorValue)).toContainText(expectedValue);
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
        );
    }

    /**
     * Changes the Jurisdictions configuration through its Select All checkbox.
     */
    async updateJurisdictionsSelection(): Promise<void> {
        await this.toggleWizardSelectAll(this.jurisdictionsHeading, 'Jurisdictions');
    }

    /**
     * Sets whether the client portal exposes Actions in its dashboard.
     * @param actionsState Expected availability button label, Actions Enabled or Actions Disabled.
     */
    async setActionsAvailability(actionsState: string): Promise<void> {
        if (!['Actions Enabled', 'Actions Disabled'].includes(actionsState)) {
            throw new Error(`Actions availability "${actionsState}" is not supported.`);
        }

        const availabilityButton = this.actionsAvailabilityButton();
        await expect(availabilityButton).toBeVisible();
        if ((await availabilityButton.textContent())?.trim() !== actionsState) {
            await availabilityButton.click();
        }
        await expect(availabilityButton).toHaveText(actionsState);
    }

    /**
     * Toggles the Select All checkbox in the current portal-configuration wizard step.
     * @param pageHeading Heading that identifies the current wizard step.
     * @param stepName Business name of the wizard step used in assertion output.
     */
    private async toggleWizardSelectAll(pageHeading: ReturnType<typeof this._page.getByRole>, stepName: string): Promise<void> {
        await expect(pageHeading, `Expected the ${stepName} wizard step to be displayed.`).toBeVisible();
        await expect(this.selectAllCheckbox, `Expected the ${stepName} Select All checkbox to be displayed.`).toBeVisible();

        const initialState = await this.selectAllCheckbox.isChecked();
        await this.selectAllCheckbox.click();
        await expect(this.selectAllCheckbox).toBeChecked({ checked: !initialState });
    }
}