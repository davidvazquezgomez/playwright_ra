import { When, Then } from './fixtures';

When('click on {string} of the portals', async ({ overviewPage }, portalName: string) => {
  await overviewPage.clickOnPortalAndVerifyOverview(portalName);
});

Then('verify for client portal name {string}', async ({ overviewPage }, portalName: string) => {
  await overviewPage.verifyClientPortalName(portalName);
});

Then('verify {string} are displayed', async ({ overviewPage }, elementName: string) => {
  await overviewPage.verifyOverviewElementsDisplayed(elementName);
});

Then('verify {string} display the corresponding due dates', async ({ overviewPage }, widgetNames: string) => {
  await overviewPage.verifyWidgetDueDates(widgetNames);
});

When('press {string} button from {string} widget', async ({ overviewPage }, buttonName: string, widgetName: string) => {
  await overviewPage.clickWidgetViewButton(widgetName, buttonName);
});

Then('verify if {string} are displayed on the Overview page', async ({ overviewPage }, fields: string) => {
  await overviewPage.verifyOverviewFieldsDisplayed(fields);
});

Then('verify View button is displayed for all the applicable widgets', async ({ overviewPage }) => {
  await overviewPage.verifyViewButtonsForApplicableWidgets();
});

Then('verify for view as grid or card is displayed and save as favorite option is visible', async ({ overviewPage }) => {
  await overviewPage.verifyViewAsCardsAndSaveAsFavouriteOption();
});

Then('is selected and the star is {string} filled by default', async ({ overviewPage }, fillStatus: string) => {
  await overviewPage.verifyFilledFavouriteStar(fillStatus);
});

When('click on view as grid or card and verify view as grid or card', async ({ overviewPage }) => {
  await overviewPage.clickViewAsGridAndVerifyViewAsCards();
});

When('restore the initial overview view', async ({ overviewPage }) => {
  await overviewPage.restoreInitialView();
});

Then('verify for {string} button is visible', async ({ overviewPage }, buttonName: string) => {
  await overviewPage.verifyOverviewButtonIsVisible(buttonName);
});

    