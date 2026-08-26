import { Then, When } from './fixtures';

Then('verify the Systems notifications triggered', async ({ notificationsPage }) => {
    await notificationsPage.verifySystemNotificationsTriggered();
});

Then('verify there are no system notifications', async ({ notificationsPage }) => {
    await notificationsPage.verifyNoSystemNotifications();
});

Then('verify {string} section is available', async ({ notificationsPage }, sectionName: string) => {
    await notificationsPage.verifySectionIsAvailable(sectionName);
});

Then(
    'verify {string} section is visible with radio button options for the following {string}',
    async ({ notificationsPage }, sectionName: string, options: string) => {
        await notificationsPage.verifyFrequencyOptionsAreVisible(sectionName, options);
    },
);

Then(
    'verify {string} section is visible with notification options for the following {string}',
    async ({ notificationsPage }, sectionName: string, options: string) => {
        await notificationsPage.verifyNotificationOptionsAreVisible(sectionName, options);
    },
);

Then(
    'verify {string} section is visible with notification option {string}',
    async ({ notificationsPage }, sectionName: string, optionName: string) => {
        await notificationsPage.verifyPeriodicSummaryOptionIsVisible(sectionName, optionName);
    },
);

When(
    'toggle {string} System notification option to be {string}',
    async ({ notificationsPage }, optionName: string, desiredState: string) => {
        if (desiredState !== 'enabled' && desiredState !== 'disabled') {
            throw new Error(`System notification option target state "${desiredState}" is not supported.`);
        }
        await notificationsPage.toggleSystemNotificationOption(optionName, desiredState);
    },
);

When(
    'select {string} located under {string} section if it is {string}',
    async ({ notificationsPage }, optionName: string, sectionName: string, currentState: string) => {
        await notificationsPage.togglePeriodicSummaryOptionIfState(optionName, sectionName, currentState);
    },
);

When(
    'check {string} Check box under {string} option from {string} section if it is {string}',
    async ({ notificationsPage }, checkboxName: string, columnName: string, categoryName: string, currentState: string) => {
        await notificationsPage.toggleSelectAllCheckboxIfState(
            checkboxName,
            columnName,
            categoryName,
            currentState,
        );
    },
);

Then(
    'select the frequency option {string} located under {string} section',
    async ({ notificationsPage }, frequencyName: string, sectionName: string) => {
        await notificationsPage.selectPeriodicSummaryFrequency(frequencyName, sectionName);
    },
);

Then(
    'verify all the {string} are disabled',
    async ({ notificationsPage }, preferenceGroup: string) => {
        await notificationsPage.verifyAllUserNotificationPreferencesAreDisabled(preferenceGroup);
    },
);

When('disable all user notification preferences', async ({ notificationsPage }) => {
    await notificationsPage.disableAllUserNotificationPreferences();
});