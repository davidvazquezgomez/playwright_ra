import { Then, When } from './fixtures';
import { registerScenarioCleanup } from './scenarioCleanup.hooks';

Then('the "Deloitte Users" section is displayed', async ({ userManagementPage }) => {
  await userManagementPage.verifyDeloitteUsersSectionDisplayed();
});

Then('verify {string} buttons are displayed in the User Management page', async ({ userManagementPage }, buttons: string) => {
  await userManagementPage.verifyButtonsAreDisplayed(buttons);
});

Then('verify the user {string} is displayed in the table', async ({ userManagementPage }, emailAddress: string) => {
  await userManagementPage.verifyUserIsDisplayedInTable(emailAddress);
});

Then('verify the user {string} is not displayed in the table', async ({ userManagementPage }, emailAddress: string) => {
  await userManagementPage.verifyUserIsNotDisplayedInTable(emailAddress);
});

When('select the user {string} from the table', async ({ userManagementPage }, emailAddress: string) => {
  await userManagementPage.selectUserFromTable(emailAddress);
});

When('search for {string} in the User Management table {string} field', async ({ userManagementPage }, searchText: string, columnName: string) => {
  await userManagementPage.searchUsers(searchText, columnName);
});

When('click on "Clear" button from the User Management table {string} field', async ({ userManagementPage }, columnName: string) => {
  await userManagementPage.clearUserSearchFilter(columnName);
});

Then('verify the filter is removed', async ({ userManagementPage }) => {
  await userManagementPage.verifyUserSearchFilterIsRemoved('User Name');
});

Then(
  'verify the User Management table {string} filter is removed',
  async ({ userManagementPage }, columnName: string) => {
    await userManagementPage.verifyUserSearchFilterIsRemoved(columnName);
  },
);

Then(
  'verify items are sorted in {string} order by {string} in the {string} page by default',
  async ({ userManagementPage }, order: string, columnName: string, pageName: string) => {
    if (order !== 'ascending' || pageName !== 'User Management') {
      throw new Error(`Default sorting is not supported for ${order} order on the ${pageName} page.`);
    }

    await userManagementPage.verifyGridDataIsSortedByDefault(columnName);
  },
);

Then(
  'the {string} pop up is displayed with the title {string}',
  async ({ userManagementPage }, _popupName: string, title: string) => {
    await userManagementPage.verifyUserDialogDisplayed(title);
  },
);

Then('the "Delete User" dialog is displayed', async ({ userManagementPage }) => {
  await userManagementPage.verifyDeleteUserDialogDisplayed();
});

When('select {string} as the replacement user', async ({ userManagementPage }, userName: string) => {
  await userManagementPage.selectDeleteUserReplacement(userName);
});

When('enter {string} in the search user field', async ({ userManagementPage }, emailAddress: string) => {
  await userManagementPage.enterDeloitteUserSearchEmail(emailAddress);
});

When('enter {string} in the {string} field', async ({ userManagementPage }, value: string, fieldLabel: string) => {
  await userManagementPage.enterExternalUserField(value, fieldLabel);
});

When('ensure the external user {string} does not exist', async ({ userManagementPage }, emailAddress: string) => {
  await userManagementPage.removeExternalUserIfPresent(emailAddress);
});

When('ensure the Deloitte user {string} does not exist', async ({ userManagementPage }, emailAddress: string) => {
  await userManagementPage.removeUserIfPresent(emailAddress);
});

When(
  'ensure the external user {string} exists with first name {string}, last name {string}, and company {string}',
  async ({ userManagementPage, testData }, emailAddress: string, firstName: string, lastName: string, companyName: string) => {
    await userManagementPage.ensureExternalUserExists(emailAddress, firstName, lastName, companyName);
    registerScenarioCleanup(
      testData,
      () => userManagementPage.removeExternalUserIfPresent(emailAddress),
    );
  },
);

When(
  'ensure the Deloitte user {string} exists with name {string}',
  async ({ userManagementPage, testData }, emailAddress: string, userName: string) => {
    await userManagementPage.ensureDeloitteUserExists(emailAddress, userName);
    registerScenarioCleanup(
      testData,
      () => userManagementPage.removeUserIfPresent(emailAddress),
    );
  },
);

When(
  'ensure the user {string} exists in {string} with name {string} and company {string}',
  async ({ userManagementPage, testData }, emailAddress: string, sectionName: string, userName: string, companyName: string) => {
    const wasCreated = await userManagementPage.ensureUserExistsInSection(
      emailAddress,
      sectionName,
      userName,
      companyName,
    );

    if (wasCreated) {
      registerScenarioCleanup(
        testData,
        () => userManagementPage.removeUserIfPresent(emailAddress),
      );
    }
  },
);

When('register the external user {string} for cleanup', async ({ userManagementPage, testData }, emailAddress: string) => {
  registerScenarioCleanup(
    testData,
    () => userManagementPage.removeExternalUserIfPresent(emailAddress),
  );
});

When('register the user {string} for cleanup', async ({ userManagementPage, testData }, emailAddress: string) => {
  registerScenarioCleanup(
    testData,
    () => userManagementPage.removeUserIfPresent(emailAddress),
  );
});

When('select {string} from the search results', async ({ userManagementPage }, userName: string) => {
  await userManagementPage.selectDeloitteUserSearchResult(userName);
});

Then('verify the user {string} is displayed', async ({ userManagementPage }, userName: string) => {
  await userManagementPage.verifyDeloitteUserSelected(userName);
});

Then('the warning message {string} is displayed', async ({ userManagementPage }, message: string) => {
  await userManagementPage.verifyAddDeloitteUserValidationMessage(message);
});

Then('verify the warning message {string} for fields {string} is displayed', async ({ userManagementPage }, messages: string, fields: string) => {
  await userManagementPage.verifyValidationMessagesForFields(messages, fields);
});

Then('the {string} pop up is closed', async ({ userManagementPage }, title: string) => {
  await userManagementPage.verifyUserDialogClosed(title);
});