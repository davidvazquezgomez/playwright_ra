import { Then, When } from './fixtures';
import { registerScenarioCleanup } from './scenarioCleanup.hooks';

Then('verify if {string} are displayed on the Automatic Allocation of Updates page', async ({ automaticAllocationPage }, fields: string) => {
  await automaticAllocationPage.verifyAutomaticAllocationFieldsDisplayed(fields);
});

Then('verify the {string} allocation is present in the {string} page', async ({ automaticAllocationPage }, allocationName: string, pageName: string) => {
  if (pageName !== 'Automatic Allocation of Updates') {
    throw new Error(`Page "${pageName}" is not supported for Automatic Allocation verification.`);
  }

  await automaticAllocationPage.verifyAllocationIsPresent(allocationName);
});

Then('verify the {string} allocation is not in the {string} page', async ({ automaticAllocationPage }, allocationName: string, pageName: string) => {
  if (pageName !== 'Automatic Allocation of Updates') {
    throw new Error(`Page "${pageName}" is not supported for Automatic Allocation verification.`);
  }

  await automaticAllocationPage.verifyAllocationIsPresent(allocationName, false);
});

Then('verify {string} form fields are displayed in the Automatic Allocation Setup page', async ({ automaticAllocationPage }, fields: string) => {
  await automaticAllocationPage.verifyAutomaticAllocationSetupFieldsDisplayed(fields);
});

Then('verify {string} field errors are displayed in the Automatic Allocation Setup page', async ({ automaticAllocationPage }, messages: string) => {
  await automaticAllocationPage.verifyAutomaticAllocationSetupFieldErrors(messages);
});

Then('verify the {string} checkbox is still selected', async ({ automaticAllocationPage }, checkboxName: string) => {
  await automaticAllocationPage.verifyCheckboxIsStillSelected(checkboxName);
});

Then('verify {string} is still selected in the {string} field', async ({ automaticAllocationPage }, expectedValue: string, fieldName: string) => {
  await automaticAllocationPage.verifyFieldValueIsStillSelected(expectedValue, fieldName);
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

When('click on "Remove Allocation" icon from the allocation {string}', async ({ automaticAllocationPage }, allocationName: string) => {
  await automaticAllocationPage.removeAllocation(allocationName);
});

When('add the user {string} in the {string} field', async ({ automaticAllocationPage }, emailAddress: string, fieldLabel: string) => {
  if (fieldLabel !== 'Search for Teams and Users') {
    throw new Error(`Automatic Allocation field "${fieldLabel}" is not supported.`);
  }

  await automaticAllocationPage.addAllocationRecipient(emailAddress);
});

When(
  'register cleanup to restore the recipient of the {string} allocation, remove {string}, and use portal {string}',
  async ({ automaticAllocationPage, commonPage, userManagementPage, testData }, allocationName: string, temporaryUserEmail: string, portalName: string) => {
    const originalRecipient = await automaticAllocationPage.getAllocationRecipient();
    registerScenarioCleanup(testData, async () => {
      await commonPage.openNamedPage(`Automatic Allocation of Updates - ${portalName}`);
      await automaticAllocationPage.editAllocation(allocationName);
      await automaticAllocationPage.restoreAllocationRecipient(originalRecipient);
      await commonPage.clickButton('Save');
      await commonPage.openNamedPage(`User Management - ${portalName}`);
      await commonPage.selectTab('Non-Deloitte Users');
      await userManagementPage.removeExternalUserIfPresent(temporaryUserEmail);
    });
  },
);