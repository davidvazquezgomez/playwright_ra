import { Then, When } from './fixtures';

Then('verify {string} are displayed in the "Add Action" popup', async ({ actionsDashboardPage }, fields: string) => {
  await actionsDashboardPage.verifyMandatoryFieldsAreDisplayed(fields);
});

Then('verify comments section is not displayed in the "Add Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.verifySectionIsNotDisplayed('comments');
});

Then('verify attachments section is not displayed in the "Add Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.verifySectionIsNotDisplayed('attachments');
});

Then(
  'verify {string} validation messages are displayed in the "Add Action" popup',
  async ({ actionsDashboardPage }, messages: string) => {
    await actionsDashboardPage.verifyMandatoryFieldMessagesAreDisplayed(messages);
  }
);

When(
  'fill the {string} field with {string} value in the "Add Action" popup',
  async ({ actionsDashboardPage }, fieldName: string, value: string) => {
    await actionsDashboardPage.fillField(fieldName, value);
  }
);

When(
  'select {string} options in the {string} field in the "Add Action" popup',
  async ({ actionsDashboardPage }, options: string, fieldName: string) => {
    await actionsDashboardPage.selectOptions(options, fieldName);
  }
);

When(
  'select {string} option in the {string} field in the "Add Action" popup',
  async ({ actionsDashboardPage }, option: string, fieldName: string) => {
    await actionsDashboardPage.selectOptions(option, fieldName);
  }
);

When('select today\'s date from the "Deadline" calendar in the "Add Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.selectTodaysDeadline();
});

Then(
  'verify {string} value is displayed in the {string} field on the "Add Action" popup',
  async ({ actionsDashboardPage }, value: string, fieldName: string) => {
    await actionsDashboardPage.verifyFieldValue(fieldName, value);
  }
);

Then(
  'verify {string} options are selected in the {string} field on the "Add Action" popup',
  async ({ actionsDashboardPage }, options: string, fieldName: string) => {
    await actionsDashboardPage.verifyOptionsAreSelected(options, fieldName);
  }
);

Then(
  'verify {string} option is selected in the {string} field on the "Add Action" popup',
  async ({ actionsDashboardPage }, option: string, fieldName: string) => {
    await actionsDashboardPage.verifyOptionsAreSelected(option, fieldName);
  }
);

Then('verify today\'s date is displayed in the "Deadline" field on the "Add Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.verifyTodaysDeadlineIsDisplayed();
});

When('wait {int} seconds before pressing "Save" in the "Add Action" popup', async ({ actionsDashboardPage }, seconds: number) => {
  await actionsDashboardPage.pauseBeforeSaving(seconds * 1000);
});

Then('verify {string} action is displayed in the first row of the {string} page', async ({ actionsDashboardPage }, actionName: string, _pageName: string) => {
  await actionsDashboardPage.verifyActionIsDisplayedInFirstRow(actionName);
});

Then('verify {string} action is not displayed in the {string} page', async ({ actionsDashboardPage }, actionName: string, _pageName: string) => {
  await actionsDashboardPage.verifyActionIsNotDisplayed(actionName);
});

When('search for {string} update in the {string} page', async ({ actionsDashboardPage }, updateTitle: string, _pageName: string) => {
  await actionsDashboardPage.searchForUpdate(updateTitle);
});

When('press "clear" button in the "Select or type update title" search box', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.clearUpdateSearch();
});

Then('verify {string} update is displayed in the {string} page', async ({ actionsDashboardPage }, updateTitle: string, _pageName: string) => {
  await actionsDashboardPage.verifyUpdateIsDisplayed(updateTitle);
});

When('click on the first action in the {string} page', async ({ actionsDashboardPage }, _pageName: string) => {
  await actionsDashboardPage.openFirstAction();
});

When(
  'select the {string} result by clicking on the {string} section',
  async ({ actionsDashboardPage }, updateTitle: string, sectionName: string) => {
    if (sectionName !== 'Action') {
      throw new Error(`Section "${sectionName}" is not supported for update action selection.`);
    }

    await actionsDashboardPage.openActionForUpdate(updateTitle);
  },
);

Then('verify the "Update Action" modal is displayed', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.verifyUpdateActionModalIsDisplayed();
});

Then('verify the "Update Action" modal contains the {string} sections', async ({ actionsDashboardPage }, sections: string) => {
  await actionsDashboardPage.verifyUpdateActionSectionsAreDisplayed(sections);
});

Then('verify the "Update Action" modal contains the {string} values', async ({ actionsDashboardPage }, values: string) => {
  await actionsDashboardPage.verifyUpdateActionValuesAreDisplayed(values);
});

When('select {string} option in the {string} field in the "Update Action" popup', async ({ actionsDashboardPage }, option: string, fieldName: string) => {
  await actionsDashboardPage.selectUpdateActionOption(option, fieldName);
});

When('press "Update" button in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.updateAction();
});

Then('verify {string} option is selected in the {string} field on the "Update Action" popup', async ({ actionsDashboardPage }, option: string, fieldName: string) => {
  await actionsDashboardPage.verifyUpdateActionOptionIsSelected(option, fieldName);
});

When('enable the "Private Action" toggle in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.enablePrivateAction();
});

When('disable the "Private Action" toggle in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.disablePrivateAction();
});

Then('verify the "Private Action" toggle is enabled in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.verifyPrivateActionState(true);
});

Then('verify the "Private Action" toggle is disabled in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.verifyPrivateActionState(false);
});

When('open the "Comments" tab in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.openCommentsTab();
});

When('enter {string} comment in the "Update Action" popup', async ({ actionsDashboardPage }, comment: string) => {
  await actionsDashboardPage.enterComment(comment);
});

When('press "Comment" button in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.postComment();
});

Then('verify {string} comment is displayed in the "Update Action" popup', async ({ actionsDashboardPage }, comment: string) => {
  await actionsDashboardPage.verifyCommentIsDisplayed(comment);
});

Then('verify a date is displayed for {string} comment in the "Update Action" popup', async ({ actionsDashboardPage }, comment: string) => {
  await actionsDashboardPage.verifyCommentDateIsDisplayed(comment);
});

Then('verify actions are displayed for {string} comment in the "Update Action" popup', async ({ actionsDashboardPage }, comment: string) => {
  await actionsDashboardPage.verifyCommentActionsAreDisplayed(comment);
});

When('open the "Attachments" tab in the "Update Action" popup', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.openAttachmentsTab();
});

Then('verify the "Upload files" button is displayed in the "Update Action" Attachments tab', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.verifyUpdateActionUploadFilesButtonIsDisplayed();
});

When('upload {string} attachment in the "Update Action" popup', async ({ actionsDashboardPage }, filePath: string) => {
  await actionsDashboardPage.uploadAttachment(filePath);
});

When('press "Remove" button on the attachment', async ({ actionsDashboardPage }) => {
  await actionsDashboardPage.removeFirstAttachment();
});

Then('verify {string} attachment is displayed in the "Update Action" popup', async ({ actionsDashboardPage }, fileName: string) => {
  await actionsDashboardPage.verifyAttachmentIsDisplayed(fileName, true);
});

Then('verify {string} attachment is not displayed in the "Update Action" popup', async ({ actionsDashboardPage }, fileName: string) => {
  await actionsDashboardPage.verifyAttachmentIsDisplayed(fileName, false);
});