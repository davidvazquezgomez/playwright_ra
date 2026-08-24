import { BasePage } from './BasePage';

export class ClientPortalSetupPage extends BasePage {
    private clientPortalNameInput = 'kendo-textbox[formcontrolname="clientPortalName"] input.k-input-inner';
    private deloitteAdministratorsInput =
        'app-people-picker[formcontrolname="deloitteAdministrators"] input[role="combobox"]';
    private businessSponsorDropdown =
        'app-people-picker[formcontrolname="businessSponsor"] kendo-dropdownlist[role="combobox"]';
    private askDeloitteContactInput = 'kendo-textbox[formcontrolname="askDeloitteEmailid"] input.k-input-inner';

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
}