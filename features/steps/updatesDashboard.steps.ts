import { Then, When } from './fixtures';

When('search for {string} update from the {string} page', async ({ updatesDashboardPage }, updateTitle: string, _pageName: string) => {
  await updatesDashboardPage.searchForUpdate(updateTitle);
});

Then('verify {string} update is displayed from the {string} page', async ({ updatesDashboardPage }, updateTitle: string, _pageName: string) => {
  await updatesDashboardPage.verifyUpdateIsDisplayed(updateTitle);
});

Then('verify the {string} update is not displayed', async ({ updatesDashboardPage }, updateTitle: string) => {
  await updatesDashboardPage.verifyUpdateIsNotDisplayed(updateTitle);
});

When('open the first update in the {string} page', async ({ updatesDashboardPage }, _pageName: string) => {
  await updatesDashboardPage.openFirstUpdate();
});

When('press "Edit" button on the selected update', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.editSelectedUpdate();
});

When('press "Save" button on the selected update', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.saveSelectedUpdate();
});

When(
  'toggle the selected update priority between {string} and {string}',
  async ({ updatesDashboardPage }, firstPriority: string, secondPriority: string) => {
    await updatesDashboardPage.toggleSelectedUpdatePriority(firstPriority, secondPriority);
  },
);

When('press "Mark as Unread" button on the selected update', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.markSelectedUpdateAsUnread();
});

Then('verify the "Mark as Unread" button is disabled on the selected update', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.verifyMarkAsUnreadIsDisabled();
});

When(
  'select {string} option in the {string} field in the "Update Details" subsection',
  async ({ updatesDashboardPage }, optionName: string, fieldName: string) => {
    await updatesDashboardPage.selectUpdateDetailsOption(optionName, fieldName);
  },
);

When(
  'select {string} in the {string} field on the selected update',
  async ({ updatesDashboardPage }, userName: string, fieldName: 'User Assigned' | 'Watch List') => {
    if (fieldName !== 'User Assigned' && fieldName !== 'Watch List') {
      throw new Error(`Update Details people-picker field "${fieldName}" is not supported.`);
    }

    await updatesDashboardPage.selectUpdateDetailsPerson(userName, fieldName);
  },
);

When('open the {string} update from the Updates Dashboard', async ({ updatesDashboardPage }, updateTitle: string) => {
  await updatesDashboardPage.openUpdateByTitle(updateTitle);
});

Then('the "Update Details" page is displayed from the Updates Dashboard', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.verifyUpdateDetailTabs();
});

Then('verify "Update Details;Update Actions" tabs are displayed on the selected update', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.verifyUpdateDetailTabs();
});

Then('verify the "Update Details" subsection displays the {string} sections', async ({ updatesDashboardPage }, sections: string) => {
  await updatesDashboardPage.verifyUpdateDetailsSectionsAreDisplayed(sections);
});

Then('verify the "Update Details" subsection displays the {string} values', async ({ updatesDashboardPage }, values: string) => {
  await updatesDashboardPage.verifyUpdateDetailsContentIsDisplayed(values);
});

Then('verify the "Update Details" subsection displays the {string} buttons', async ({ updatesDashboardPage }, buttons: string) => {
  await updatesDashboardPage.verifyUpdateDetailsButtonsAreDisplayed(buttons);
});

When('open the "Attachments" tab in the "Update Details" subsection', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.openUpdateDetailsAttachments();
});

Then('verify the "Upload files" button is displayed in the "Update Details" Attachments tab', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.verifyUpdateDetailsUploadFilesButtonIsDisplayed();
});

When('upload {string} attachment in the "Update Details" Attachments tab', async ({ updatesDashboardPage }, filePath: string) => {
  await updatesDashboardPage.uploadUpdateDetailsAttachment(filePath);
});

Then('verify the {string} attachment is displayed in the "Attachments" section', async ({ updatesDashboardPage }, fileName: string) => {
  await updatesDashboardPage.verifyUpdateDetailsAttachmentIsDisplayed(fileName, true);
});

When('press "Remove" button on the attachment', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.removeFirstUpdateDetailsAttachment();
});

Then('verify the {string} attachment is not displayed in the "Attachments" section', async ({ updatesDashboardPage }, fileName: string) => {
  await updatesDashboardPage.verifyUpdateDetailsAttachmentIsDisplayed(fileName, false);
});

When('open the "Update Actions" tab on the selected update', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.openUpdateActionsTab();
});

When('press "Action Status" header on the selected update', async ({ updatesDashboardPage }) => {
  await updatesDashboardPage.pressActionStatusColumnHeader();
});