import { Then, When } from './fixtures';

When(
    'fill the "Title" field with {string} value in {string} page',
    async ({ releaseNotesPage }, title: string, _pageName: string) => {
        await releaseNotesPage.fillTitle(title);
    }
);

Then(
    'verify {string} value is displayed in the "Title" field on the {string} page',
    async ({ releaseNotesPage }, title: string, _pageName: string) => {
        await releaseNotesPage.verifyTitleValue(title);
    }
);

When(
    'select today\'s date from the "Date" calendar in {string} page',
    async ({ releaseNotesPage }, _pageName: string) => {
        await releaseNotesPage.selectTodaysDate();
    }
);

When(
    'fill the "Release Notes" field with {string} value in {string} page',
    async ({ releaseNotesPage }, releaseNotes: string, _pageName: string) => {
        await releaseNotesPage.fillReleaseNotes(releaseNotes);
    }
);

Then(
    'verify the created release note {string} is displayed with today\'s date in the {string} page',
    async ({ releaseNotesPage }, title: string, _pageName: string) => {
        await releaseNotesPage.verifyCreatedReleaseNoteIsDisplayed(title);
    }
);

Then(
    'verify every release note is expanded in the {string} page',
    async ({ releaseNotesPage }, _pageName: string) => {
        await releaseNotesPage.verifyReleaseNotesExpansionState(true);
    }
);

Then(
    'verify every release note is collapsed in the {string} page',
    async ({ releaseNotesPage }, _pageName: string) => {
        await releaseNotesPage.verifyReleaseNotesExpansionState(false);
    }
);

Then(
    'verify the list of releases notes is displayed in the {string} page',
    async ({ releaseNotesPage }, _pageName: string) => {
        await releaseNotesPage.verifyReleaseNotesListIsDisplayed();
    }
);

Then(
    'verify releases notes are sorted by {string} in {string} order',
    async ({ releaseNotesPage }, sortBy: string, sortDirection: string) => {
        await releaseNotesPage.verifyReleaseNotesAreSortedBy(sortBy, sortDirection);
    }
);

Then(
    'verify {string} release note details are displayed on the first release note',
    async ({ releaseNotesPage }, details: string) => {
        await releaseNotesPage.verifyFirstReleaseNoteDetailsAreDisplayed(details);
    }
);

When(
    'click on the first release note in the {string} page',
    async ({ releaseNotesPage }, _pageName: string) => {
        await releaseNotesPage.clickFirstReleaseNote();
    }
);

Then(
    'verify {string} release note details are not displayed on the first release note',
    async ({ releaseNotesPage }, details: string) => {
        await releaseNotesPage.verifyFirstReleaseNoteDetailsAreNotDisplayed(details);
    }
);
