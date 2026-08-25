import { Then, When } from './fixtures';

type ReleaseNoteTestData = {
    title: string;
    details: string;
};

const releaseNoteTestDataKey = 'releaseNoteTestData';

function getReleaseNoteTestData(testData: Record<string, unknown>): ReleaseNoteTestData {
    const releaseNoteTestData = testData[releaseNoteTestDataKey] as ReleaseNoteTestData | undefined;
    if (!releaseNoteTestData) {
        throw new Error('The scenario has not created its generated Release Note data.');
    }

    return releaseNoteTestData;
}

When(
    'fill generated Release Note title and details in {string} page',
    async ({ releaseNotesPage, testData }, pageName: string) => {
        const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const releaseNoteTestData = {
            title: `QA Release Note ${runId}`,
            details: `Automated release note ${runId}.`,
        };

        testData[releaseNoteTestDataKey] = releaseNoteTestData;
        await releaseNotesPage.fillTitle(releaseNoteTestData.title);
        await releaseNotesPage.fillReleaseNotes(releaseNoteTestData.details);
    },
);

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
    'verify the generated release note is displayed with today\'s date in the {string} page',
    async ({ releaseNotesPage, testData }, pageName: string) => {
        await releaseNotesPage.verifyCreatedReleaseNoteIsDisplayed(getReleaseNoteTestData(testData).title);
    },
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

Then(
    'verify generated release note details are displayed',
    async ({ releaseNotesPage, testData }) => {
        const releaseNoteTestData = getReleaseNoteTestData(testData);
        await releaseNotesPage.verifyReleaseNoteDetailsAreDisplayed(
            releaseNoteTestData.title,
            releaseNoteTestData.details,
        );
    },
);

When(
    'click on the generated release note',
    async ({ releaseNotesPage, testData }) => {
        await releaseNotesPage.clickReleaseNote(getReleaseNoteTestData(testData).title);
    },
);

Then(
    'verify generated release note details are not displayed',
    async ({ releaseNotesPage, testData }) => {
        const releaseNoteTestData = getReleaseNoteTestData(testData);
        await releaseNotesPage.verifyReleaseNoteDetailsAreNotDisplayed(
            releaseNoteTestData.title,
            releaseNoteTestData.details,
        );
    },
);
