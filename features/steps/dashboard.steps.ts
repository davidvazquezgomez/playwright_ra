import { Then, When } from './fixtures';

When('press "Filter" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.openFilterPanel();
});

When('press "Dashboard Options" button on the Dashboard', async ({ dashboardPage }) => {
    await dashboardPage.openDashboardOptions();
});

Then('verify the "Dashboard Options" popup is displayed on the Dashboard', async ({ dashboardPage }) => {
    await dashboardPage.verifyDashboardOptionsPopupIsDisplayed();
});

Then('verify the "Actions Dashboard" tab is selected in the Dashboard Options popup', async ({ dashboardPage }) => {
    await dashboardPage.verifyDashboardOptionsActionsTabIsSelected();
});

Then('verify {string} is displayed in the Dashboard Options popup', async ({ dashboardPage }, heading: string) => {
    await dashboardPage.verifyDashboardOptionsHeadingIsDisplayed(heading);
});

Then('verify {string} columns are displayed in the Dashboard Options popup', async ({ dashboardPage }, columns: string) => {
    await dashboardPage.verifyDashboardOptionColumnsAreDisplayed(columns);
});

Then('verify {string} columns are selected in the Dashboard Options popup', async ({ dashboardPage }, columns: string) => {
    await dashboardPage.verifyDashboardOptionColumnsSelected(columns, true);
});

When('deselect {string} column in the Dashboard Options popup', async ({ dashboardPage }, columnName: string) => {
    await dashboardPage.setDashboardOptionColumnSelected(columnName, false);
});

When('wait {int} seconds', async ({ dashboardPage }, seconds: number) => {
    await dashboardPage.waitImplicit(seconds * 1000);
});

Then('verify {string} column is not selected in the Dashboard Options popup', async ({ dashboardPage }, columnName: string) => {
    await dashboardPage.verifyDashboardOptionColumnsSelected(columnName, false);
});

When('press "Save" button in the Dashboard Options popup', async ({ dashboardPage }) => {
    await dashboardPage.saveDashboardOptions();
});

Then('verify the "Dashboard Options" popup is closed on the Dashboard', async ({ dashboardPage }) => {
    await dashboardPage.verifyDashboardOptionsPopupIsClosed();
});

Then('verify {string} column header is not displayed in the {string} page', async ({ dashboardPage }, columnName: string, pageName: string) => {
    if (!pageName.includes('Actions Dashboard')) {
        throw new Error(`Page "${pageName}" is not supported by Dashboard Options assertions.`);
    }
    await dashboardPage.verifyActionsDashboardColumnIsNotDisplayed(columnName);
});

Then('press "More Filters" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.showMoreFilters();
});

Then('press "Less Filters" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.showLessFilters();
});

Then('press "Save filter" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.saveFilter();
});

Then('verify the "Name Filter" modal is displayed on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.verifyNameFilterModalIsDisplayed();
});

Then('verify {string} error message appears on the Dashboard filter', async ({ dashboardPage }, errorMessage: string) => {
    await dashboardPage.verifyNameFilterErrorMessage(errorMessage);
});

When('fill {string} in the "Filter Name" field on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.fillFilterName(filterName);
});

Then('press "Reset Filters" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.resetFilters();
});

Then('press "Clear all filters" section on the Dashboard filter if available', async ({ dashboardPage }) => {
    await dashboardPage.clearAllFiltersIfAvailable();
});

When('double-click {string} option on the Dashboard filter', async ({ dashboardPage }, optionName: string) => {
    await dashboardPage.doubleClickFilterOption(optionName);
});

When('press "View results" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.viewFilteredResults();
});

Then('press "Close" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.closeFilterPanel();
});

When('press "Edit" button on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.editDashboardFilters();
});

When('remove saved filter {string} if it exists on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.removeSavedFilterIfExists(filterName);
});

When('press "Delete filter" button for {string} on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.deleteSavedFilter(filterName);
});

When('select {string} in the {string} filter on the Dashboard filter', async ({ dashboardPage }, optionName: string, sectionName: string) => {
    await dashboardPage.selectDashboardCheckboxFilterOption(optionName, sectionName);
});

When('select {string} located in the {string} section on the Dashboard filter', async ({ dashboardPage }, filterName: string, sectionName: string) => {
    await dashboardPage.selectSavedFilter(filterName, sectionName);
});

Then('verify the {string} filter is displayed in the {string} section on the Dashboard filter', async ({ dashboardPage }, filterName: string, sectionName: string) => {
    await dashboardPage.verifySavedFilterIsDisplayed(filterName, sectionName);
});

Then('verify the {string} option is displayed in the Dashboard filter', async ({ dashboardPage }, sections: string) => {
    await dashboardPage.verifyFilterSectionsAreDisplayed(sections);
});

Then('verify the {string} option is not displayed in the Dashboard filter', async ({ dashboardPage }, sections: string) => {
    await dashboardPage.verifyFilterSectionsAreNotDisplayed(sections);
});

When('deselect {string} in the {string} filter on the Dashboard filter', async ({ dashboardPage }, value: string, filterName: string) => {
    await dashboardPage.setDashboardCheckboxFilterOptionSelected(value, filterName, false);
});

When('expand the {string} filter on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.setFilterSectionExpanded(filterName, true);
});

When('collapse the {string} filter on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.setFilterSectionExpanded(filterName, false);
});

Then('verify "Select All" is {string} in the {string} filter on the Dashboard filter', async ({ dashboardPage }, state: 'unchecked' | 'checked' | 'partially selected', filterName: string) => {
    if (!['unchecked', 'checked', 'partially selected'].includes(state)) {
        throw new Error(`Unsupported Select All state "${state}".`);
    }
    await dashboardPage.verifySelectAllState(filterName, state);
});

When('click on "Select All" in the {string} filter on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.toggleSelectAllOptions(filterName);
});

Then('verify all options are selected in the {string} filter on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.verifyFilterOptionsSelected(filterName, true);
});

Then('verify no options are selected in the {string} filter on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.verifyFilterOptionsSelected(filterName, false);
});

When('select the first {int} options in the {string} filter on the Dashboard filter', async ({ dashboardPage }, optionCount: number, filterName: string) => {
    await dashboardPage.selectFirstUnselectedFilterOptions(filterName, optionCount);
});

When('select all remaining options in the {string} filter on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.selectRemainingFilterOptions(filterName);
});

When('deselect the first option in the {string} filter on the Dashboard filter', async ({ dashboardPage }, filterName: string) => {
    await dashboardPage.deselectFirstFilterOption(filterName);
});

Then('verify the "Jurisdiction" filter selection remains unchanged on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.verifyJurisdictionSelectionUnchanged();
});

When('select {string} from the {string} calendar on the Dashboard filter', async ({ dashboardPage }, dateValue: string, calendarName: 'Start Date' | 'End Date') => {
    await dashboardPage.selectDeadlineDate(calendarName, dateValue);
});

When('select a {string} date from the {string} calendar on the Dashboard filter', async ({ dashboardPage }, direction: 'past' | 'future', calendarName: 'Start Date' | 'End Date') => {
    await dashboardPage.selectRelativeDeadlineDate(calendarName, direction);
});

Then('verify filtered actions are displayed', async ({ dashboardPage }) => {
    await dashboardPage.verifyFilteredActions();
});

Then('verify filtered actions are displayed for {string} with value {string}', async ({ dashboardPage }, filterName: string, value: string) => {
    await dashboardPage.verifyFilteredActions(filterName, value);
});

Then('verify every filtered action has a deadline within the selected range', async ({ dashboardPage }) => {
    await dashboardPage.verifyFilteredActionDeadlinesAreWithinSelectedRange();
});

When('append {string} to the saved filter name on the Dashboard filter', async ({ dashboardPage }, text: string) => {
    await dashboardPage.appendToSavedFilterName(text);
});

Then('verify the {string} filter is not displayed in the {string} section on the Dashboard filter', async ({ dashboardPage }, filterName: string, sectionName: string) => {
    await dashboardPage.verifySavedFilterIsNotDisplayed(filterName, sectionName);
});

Then('verify all filters are reset to their default values on the Dashboard filter', async ({ dashboardPage }) => {
    await dashboardPage.verifyFiltersAreReset();
});


Then('click on {string} option from the {string} popup', async ({ dashboardPage }, option: string, popupName: string) => {
    await dashboardPage.clickButton(option, popupName);
});