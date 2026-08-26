import * as path from 'path';
import { BasePage } from './BasePage';
import type { FileChooser } from 'playwright-core';

export class UploadUpdatesPage extends BasePage {
  private fileChooser?: FileChooser;
  private uploadStep = 'app-file-upload-step';
  private fileUploadSection = `${this.uploadStep} app-file-upload`;
  private fileInput = `${this.fileUploadSection} input[type="file"]`;
  private continueButton = `${this.uploadStep} .k-form-buttons button.k-button-primary`;
  private uploadFilesButton = `${this.fileUploadSection} button[aria-label="Upload files"]`;
  private downloadTemplateLink = `${this.fileUploadSection} a.download-template:has-text("Download Updates Template")`;
  private fileRequiredWarning = `${this.fileUploadSection} div.error-message:has-text("Please select file(s).")`;
  private showAllClientsRequiredWarning = `${this.fileUploadSection} div.error-message:has-text("Please select Yes or No.")`;
  private uploadedFileError = 'text=/error|required|missing/i';
  private uploadUpdatesTitle = `${this.fileUploadSection} h1.heading:text-is("Upload Updates")`;
  private uploadUpdatesDescription = `${this.fileUploadSection} .sub-heading:text-is("Upload regulatory updates.")`;
  private showUpdatesToAllClientsLabel = `${this.fileUploadSection} label.fw-bold:has-text("Show updates to all applicable clients?")`;
  private yesOption = `${this.fileUploadSection} input[type="radio"][value="true"]`;
  private noOption = `${this.fileUploadSection} input[type="radio"][value="false"]`;
  private affectedClientsMultiSelect = `${this.fileUploadSection} kendo-multiselect[formcontrolname="selectedClients"]`;
  private affectedClientsDropdown = `${this.affectedClientsMultiSelect} input[role="combobox"][placeholder="Select clients..."]`;
  private clientDropdownOption = (client: string) =>
    '[role="listbox"] [role="option"]:has-text("' + client + '")';
  private expectedErrorMessage = (message: string) => `text=${message}`;
  private affectedClientSelection = (client: string) =>
    `${this.affectedClientsMultiSelect} kendo-taglist[role="listbox"] .k-chip[role="option"] .k-chip-label:text-is("${client}")`;
  private fieldSelectors: Record<string, string> = {
    'Upload Updates title': this.uploadUpdatesTitle,
    'Upload Updates description': this.uploadUpdatesDescription,
    'Upload files hyperlink': this.uploadFilesButton,
    'Download updates template hyperlink': this.downloadTemplateLink,
    'Show updates to all applicable clients?': this.showUpdatesToAllClientsLabel,
    'Yes option': this.yesOption,
    'No option': this.noOption,
    'Continue button': this.continueButton,
  };

  /**
   * Verifies that every requested field is visible on the Upload Updates page.
   * @param field Semicolon-delimited display names of the fields defined in the Gherkin example.
   */
  async verifyFieldUpdatesPage(field: string): Promise<void> {
    await this.verifyRequestedFieldsDisplayed(field, this.fieldSelectors);
  }

  /**
   * Continues without supplying any required Upload Updates values.
   */
  async continueWithoutValues(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  /**
   * Verifies that the required file and Show updates to all applicable clients warnings are displayed.
   */
  async verifyMandatoryWarnings(): Promise<void> {
    await this.waitForElement(this.fileRequiredWarning);
    await this.waitForElement(this.showAllClientsRequiredWarning);
  }

  /**
   * Opens the file-selection control for regulatory updates.
   */
  async openFileUpload(): Promise<void> {
    const fileChooserPromise = this._page.waitForEvent('filechooser');
    await this.clickElement(this.uploadFilesButton);
    this.fileChooser = await fileChooserPromise;
  }

  /**
   * Verifies that the file-selection control is available.
   */
  async verifyFileUploadWindow(): Promise<void> {
    if (!await this.checkIfFieldExists(this.fileInput)) {
      throw new Error('The file upload control is not available.');
    }
  }

  /**
   * Uploads an update file from the supplied project-relative path.
   * @param filePath Path to the file to upload.
   */
  async uploadFileFromPath(filePath: string): Promise<void> {
    const resolvedFilePath = path.resolve(filePath);
    if (this.fileChooser) {
      await this.fileChooser.setFiles(resolvedFilePath);
      this.fileChooser = undefined;
      return;
    }

    await this.uploadFile(this.fileInput, resolvedFilePath);
  }

  /**
   * Verifies that the uploaded file has no validation error.
   */
  async verifyNoUploadError(): Promise<void> {
    if (await this.checkIfFieldIsDisplayed(this.uploadedFileError)) {
      this.failWithApplicationError(
        'A valid uploaded file must not display a validation error.',
        'No upload validation error is displayed.',
        `Upload validation error displayed: "${await this.getText(this.uploadedFileError)}".`,
        'The file upload section was available after the file was selected.',
      );
    }
  }

  /**
   * Verifies that the application reports an uploaded-file validation error.
   */
  async verifyUploadedFileError(): Promise<void> {
    if (!await this.checkIfFieldIsDisplayed(this.uploadedFileError)) {
      throw new Error('The uploaded file error is not displayed.');
    }
  }

  /**
   * Verifies that the requested application message is visible.
   * @param message Expected message text.
   */
  async verifyMessage(message: string): Promise<void> {
    await this.waitForElement(this.fileUploadSection);

    if (!await this.checkIfFieldIsDisplayed(this.expectedErrorMessage(message))) {
      this.failWithApplicationError(
        'The Upload Updates workflow must display the validation or status message expected for the selected file and action.',
        `Message "${message}" is displayed.`,
        `Message "${message}" is not displayed.`,
        `Visible Upload Updates content: "${(await this._page.locator(this.fileUploadSection).innerText()).trim()}".`,
      );
    }
  }

  /**
   * Selects an option in a supported Upload Updates field.
   * @param option Option label to select.
   * @param field Field label that owns the option.
   */
  async selectOptionInField(option: string, field: string): Promise<void> {
    let selector: string;
    switch (field) {
      case 'Show updates to all applicable clients?':
        switch (option.toLowerCase()) {
          case 'yes':
            selector = this.yesOption;
            break;
          case 'no':
            selector = this.noOption;
            break;
          default:
            throw new Error(`Option "${option}" is not recognized.`);
        }
        break;
      default:
        throw new Error(`Field "${field}" is not recognized.`);
    }

    await this.clickElement(selector);
  }

  /**
   * Opens a supported Upload Updates dropdown.
   * @param dropdown Dropdown label to open.
   */
  async openDropdown(dropdown: string): Promise<void> {
    let selector: string;
    switch (dropdown) {
      case 'Select Client':
        selector = this.affectedClientsDropdown;
        break;
      default:
        throw new Error(`Dropdown "${dropdown}" is not recognized.`);
    }
    await this.clickElement(selector);
  }

  /**
   * Selects a client from the opened client dropdown.
   * @param client Client name to select.
   */
  async selectClientFromDropdown(client: string): Promise<void> {
    const clientSelector = this.clientDropdownOption(client);
    await this.waitForSelectorStatus(clientSelector, 'visible');
    await this.clickElement(clientSelector);
  }

  /**
   * Verifies that a client appears in the Affected clients list.
   * @param client Expected client name.
   */
  async verifyClientInAffectedList(client: string): Promise<void> {
    const affectedClientSelector = this.affectedClientSelection(client);
    if (!await this.checkIfFieldIsDisplayed(affectedClientSelector)) {
      this.failWithApplicationError(
        'A selected client must be displayed in the Affected clients list.',
        `Client "${client}" is displayed in the Affected clients list.`,
        `Client "${client}" is not displayed in the Affected clients list.`,
        'The client option was selected from the Affected clients dropdown before verification.',
      );
    }
  }

}