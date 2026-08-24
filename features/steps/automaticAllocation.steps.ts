import { Then, When } from './fixtures';

Then('verify if {string} are displayed on the Automatic Allocation of Updates page', async ({ automaticAllocationPage }, fields: string) => {
  await automaticAllocationPage.verifyAutomaticAllocationFieldsDisplayed(fields);
});

Then('verify {string} form fields are displayed in the Automatic Allocation Setup page', async ({ automaticAllocationPage }, fields: string) => {
  await automaticAllocationPage.verifyAutomaticAllocationSetupFieldsDisplayed(fields);
});

Then('verify {string} field errors are displayed in the Automatic Allocation Setup page', async ({ automaticAllocationPage }, messages: string) => {
  await automaticAllocationPage.verifyAutomaticAllocationSetupFieldErrors(messages);
});

When('fill the "Allocation Name" field with {string}', async ({ automaticAllocationPage }, allocationName: string) => {
  await automaticAllocationPage.fillAllocationName(allocationName);
});

When('select the {string} option in the {string} field', async ({ automaticAllocationPage, commonPage }, optionName: string, fieldName: string) => {
  if (automaticAllocationPage.isUserPickerField(fieldName)) {
    const { controlSelector, searchInputSelector } = automaticAllocationPage.getUserPickerSelectors(fieldName);
    await commonPage.selectUserPickerOption(controlSelector, searchInputSelector, optionName);
    return;
  }

  const controlSelector = automaticAllocationPage.getFieldSelectionControlSelector(fieldName);
  await commonPage.selectKendoFieldOption(controlSelector, optionName);
});

When('click on "Edit Allocation" icon for the {string} allocation', async ({ automaticAllocationPage }, allocationName: string) => {
  await automaticAllocationPage.editAllocation(allocationName);
});

When('add the user {string} in the {string} field', async ({ automaticAllocationPage }, emailAddress: string, fieldLabel: string) => {
  if (fieldLabel !== 'Search for Teams and Users') {
    throw new Error(`Automatic Allocation field "${fieldLabel}" is not supported.`);
  }

  await automaticAllocationPage.addAllocationRecipient(emailAddress);
});