import { When, Then } from './fixtures';

When('Navigate to Upload Updates page', async ({ clientPortalListPage }) => {
  await clientPortalListPage.navigateToSection('Menu', 'Upload Updates');
});

Then('verify if {string} are displayed on the Upload Updates page', async ({ uploadUpdatesPage }, field: string) => {
  await uploadUpdatesPage.verifyFieldUpdatesPage(field);
});

When('press continue button without adding any value to the fields', async ({ uploadUpdatesPage }) => {
  await uploadUpdatesPage.continueWithoutValues();
});

Then('verify Warning messages should be displayed for each mandatory fields', async ({ uploadUpdatesPage }) => {
  await uploadUpdatesPage.verifyMandatoryWarnings();
});

When('click on {string} option from the Upload Updates page', async ({ uploadUpdatesPage }, _option: string) => {
  await uploadUpdatesPage.openFileUpload();
});

When('select a {string} format file from {string} and upload it', async ({ uploadUpdatesPage }, _extension: string, filePath: string) => {
  await uploadUpdatesPage.uploadFileFromPath(filePath);
});

Then('no upload error message is displayed', async ({ uploadUpdatesPage }) => {
  await uploadUpdatesPage.verifyNoUploadError();
});

Then('verify if error message is displayed for missing fields in the uploaded file', async ({ uploadUpdatesPage }) => {
  await uploadUpdatesPage.verifyUploadedFileError();
});

Then('a message should get displayed as {string}', async ({ uploadUpdatesPage }, message: string) => {
  await uploadUpdatesPage.verifyMessage(message);
});

When('select on option {string} in {string} field', async ({ uploadUpdatesPage }, option: string, field: string) => {
  await uploadUpdatesPage.selectOptionInField(option, field);
});

When('user click over the {string} dropdown list', async ({ uploadUpdatesPage }, dropdown: string) => {
  await uploadUpdatesPage.openDropdown(dropdown);
});

When('user select {string} client from the dropdown list by clicking on the check-box', async ({ uploadUpdatesPage }, client: string) => {
  await uploadUpdatesPage.selectClientFromDropdown(client);
});

Then('the selected client {string} must get added in the Affected clients list', async ({ uploadUpdatesPage }, client: string) => {
  await uploadUpdatesPage.verifyClientInAffectedList(client);
});