import { Then, When } from './fixtures';

Then('verify the {string} chart is displayed', async ({ analyticsDashboardPage }, chartTitle: string) => {
    await analyticsDashboardPage.verifyChartIsDisplayed(chartTitle);
});

When('press {string} map control', async ({ analyticsDashboardPage }, controlTitle: string) => {
    await analyticsDashboardPage.pressMapControl(controlTitle);
});

Then('verify the map control contains the {string} name', async ({ analyticsDashboardPage }, controlTitle: string) => {
    await analyticsDashboardPage.verifyMapControlIsDisplayed(controlTitle);
});

Then(
    'verify the {string} chart contains the {string} elements',
    async ({ analyticsDashboardPage }, chartTitle: string, elements: string) => {
        await analyticsDashboardPage.verifyChartContainsElements(chartTitle, elements);
    },
);

Then('save the value from the {string} chart', async ({ analyticsDashboardPage, testData }, chartTitle: string) => {
    testData[`analyticsDashboardChart:${chartTitle}`] = await analyticsDashboardPage.getChartValues(chartTitle);
});

Then('save the {string} items', async ({ analyticsDashboardPage, testData }, tableTitle: string) => {
    testData[`analyticsDashboardTable:${tableTitle}`] = await analyticsDashboardPage.getDataTableItemCount(tableTitle);
});

Then('verify the {string} item count is the same', async ({ analyticsDashboardPage, testData }, tableTitle: string) => {
    const savedItemCount = testData[`analyticsDashboardTable:${tableTitle}`];
    if (typeof savedItemCount !== 'number') {
        throw new Error(`No saved item count exists for "${tableTitle}".`);
    }

    await analyticsDashboardPage.verifyDataTableItemCount(tableTitle, savedItemCount);
});

When(
    'navigate to page {string} in the {string} table',
    async ({ analyticsDashboardPage }, pageNumber: string, tableTitle: string) => {
        await analyticsDashboardPage.navigateDataTableToPage(pageNumber, tableTitle);
    },
);

Then(
    'verify that the first result that appears is number {string}',
    async ({ analyticsDashboardPage }, expectedFirstItemNumber: string) => {
        await analyticsDashboardPage.verifyVisibleDataTableFirstItemNumber(expectedFirstItemNumber);
    },
);

When('search for {string} update in the Analytics Dashboard', async ({ analyticsDashboardPage }, updateTitle: string) => {
    await analyticsDashboardPage.searchForUpdate(updateTitle);
});

When('open the first filtered update result in the {string} table', async ({ analyticsDashboardPage }, tableTitle: string) => {
    await analyticsDashboardPage.openFirstFilteredUpdateResult(tableTitle);
});

Then(
    'verify the {string} table contains the same number of items as the {string} chart',
    async ({ actionsDashboardPage, updatesDashboardPage, testData }, tableTitle: string, chartTitle: string) => {
        const savedItemCount = testData[`analyticsDashboardTable:${chartTitle}`];
        if (typeof savedItemCount !== 'number') {
            throw new Error(`No saved item count exists for "${chartTitle}".`);
        }

        const currentItemCount = tableTitle === 'All Updates'
            ? await updatesDashboardPage.getAllUpdatesItemCount(savedItemCount)
            : tableTitle === 'All Actions'
                ? await actionsDashboardPage.getAllActionsItemCount(savedItemCount)
                : undefined;

        if (currentItemCount === undefined) {
            throw new Error(`Table "${tableTitle}" is not supported by this comparison step.`);
        }

        if (currentItemCount !== savedItemCount) {
            throw new Error(`Expected "${tableTitle}" to contain ${savedItemCount} items, but found ${currentItemCount}.`);
        }
    },
);

Then('verify the {string} chart value is the same', async ({ analyticsDashboardPage, testData }, chartTitle: string) => {
    const savedValues = testData[`analyticsDashboardChart:${chartTitle}`];
    if (!savedValues) {
        throw new Error(`No saved values exist for chart "${chartTitle}".`);
    }

    await analyticsDashboardPage.verifyChartValues(chartTitle, savedValues, true);
});

Then('verify the {string} chart value is not the same', async ({ analyticsDashboardPage, testData }, chartTitle: string) => {
    const savedValues = testData[`analyticsDashboardChart:${chartTitle}`];
    if (!savedValues) {
        throw new Error(`No saved values exist for chart "${chartTitle}".`);
    }

    await analyticsDashboardPage.verifyChartValues(chartTitle, savedValues, false);
});