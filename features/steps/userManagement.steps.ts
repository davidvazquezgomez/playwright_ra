import { Then, When } from './fixtures';

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
  async ({ userManagementPage }, popupName: string, title: string) => {
    if (popupName !== title) {
      throw new Error(`Popup name "${popupName}" does not match title "${title}".`);
    }

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