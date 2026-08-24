import { Given, When, Then } from './fixtures';

Given('launch Regulatory Advantage application URL and login as {string} user {string}', async ({ commonPage, loginPage, authSession }, userType: string, rol: string) => {
  const normalizedUserType = userType.toLowerCase();
  if (normalizedUserType !== 'deloitte' && normalizedUserType !== 'external') {
    throw new Error(`Unknown user type "${userType}". Use "deloitte" or "external".`);
  }
  const environment = (process.env.ENV || 'STAGE').toUpperCase();
  const url = environment === 'DEV' ? process.env.DEV_URL : process.env.STAGE_URL;
  if (!url) {
    throw new Error(`URL is not configured for environment ${environment}.`);
  }

  await commonPage.launchApplication(url);

  if (authSession.shouldSkipInitialLogin(normalizedUserType, rol)) {
    await commonPage.dismissCookieConsent();
    return;
  }

  const normalizedRole = rol.toUpperCase();
  const user = `USER_${normalizedRole}`;
  const password = `USER_${normalizedRole}_PASSWORD`;
  const totpSecret = `USER_${normalizedRole}_TOTP_SECRET`;

  const userFinal = process.env[user];
  const passwordFinal = process.env[password];
  const totpSecretFinal = process.env[totpSecret];

  if (!userFinal || !passwordFinal) {
    throw new Error(
      `Credentials are missing for "${rol}". ` +
      `Configure ${user} and ${password} in the environment variables.`
    );
  }

  console.log(`Login as ${normalizedUserType} user ${rol}: ${userFinal}`);

  if (normalizedUserType === 'external') {
    if (!totpSecretFinal) {
      throw new Error(
        `Credentials are missing for "${rol}". ` +
        `Configure ${totpSecret} in the environment variables.`
      );
    }

    await loginPage.login(userFinal, passwordFinal, totpSecretFinal);
    await commonPage.dismissCookieConsent();
    authSession.recordLogin();
    return;
  }

  await loginPage.login(userFinal, passwordFinal, '');
  await commonPage.dismissCookieConsent();
  authSession.recordLogin();
});

Given('launch GA Portal URL and login as external user {string}', async ({ commonPage, loginPage }, rol: string) => {
  const url = process.env.GA_PORTAL_STAGE_URL;
  if (!url) {
    throw new Error('GA Portal URL is not configured. Configure GA_PORTAL_STAGE_URL in the environment variables.');
  }

  const normalizedRole = rol.toUpperCase();
  const user = `USER_${normalizedRole}`;
  const password = `USER_${normalizedRole}_PASSWORD`;
  const userFinal = process.env[user];
  const passwordFinal = process.env[password];

  if (!userFinal || !passwordFinal) {
    throw new Error(
      `Credentials are missing for GA Portal external user "${rol}". ` +
      `Configure ${user} and ${password} in the environment variables.`
    );
  }

  await commonPage.launchApplication(url);
  console.log(`Login to GA Portal with external user ${rol}: ${userFinal}`);
  await loginPage.loginGA(userFinal, passwordFinal);
});

Given('verify if applicable portals are displayed', async ({ clientPortalListPage }) => {
  await clientPortalListPage.verifyApplicablePortals();
});

Given('the {string} page is open', async ({ commonPage }, pageName: string) => {
  await commonPage.openNamedPage(pageName);
});

When('click on {string} button on one of the portals list', async ({ clientPortalListPage }, button: string) => {
  await clientPortalListPage.editFirstClientPortal();
});

When('click on {string} option from the left navigation', async ({ commonPage }, option: string) => {
  await commonPage.clickNavigationOption(option);
});

When('click on the {string} checkbox', async ({ commonPage }, checkboxName: string) => {
  await commonPage.clickCheckbox(checkboxName);
});

When('fill the {string} field with {string} value in the {string} page', async ({ commonPage }, fieldName: string, value: string, pageName: string) => {
  await commonPage.fillGridFilterField(fieldName, value, pageName);
});

Then('verify {string} column header is displayed in the {string} page', async ({ commonPage }, columnName: string, pageName: string) => {
  await commonPage.verifyGridColumnHeaderDisplayed(columnName, pageName);
});

Then('verify {string} tabs are displayed in {string} page', async ({ commonPage }, tabs: string, pageName: string) => {
  await commonPage.verifyTabsAreDisplayed(tabs, pageName);
});

When('press the {string} section', async ({ commonPage }, tabName: string) => {
  await commonPage.selectTab(tabName);
});

When('press the {string} subsection', async ({ commonPage }, tabName: string) => {
  await commonPage.selectTab(tabName, 'subsection');
});

Then('the {string} subsection is displayed', async ({ commonPage }, subsectionName: string) => {
  await commonPage.verifySubsectionIsDisplayed(subsectionName);
});

When('click on {string} column header in the {string} page', async ({ commonPage }, columnName: string, pageName: string) => {
  await commonPage.clickGridColumnHeader(columnName, pageName);
});

Then('verify items are sorted in {string} order by {string} in the {string} page', async ({ commonPage }, order: 'ascending' | 'descending', columnName: string, pageName: string) => {
  if (order !== 'ascending' && order !== 'descending') {
    throw new Error(`Sorting order "${order}" is not supported on page "${pageName}".`);
  }

  await commonPage.verifyGridItemsSorted(order, columnName, pageName);
});

Then('verify sorting is removed for {string} in the {string} page', async ({ commonPage }, columnName: string, pageName: string) => {
  await commonPage.verifyGridSortingRemoved(columnName, pageName);
});

Then('verify pagination is displayed in the {string} page', async ({ commonPage }, pageName: string) => {
  await commonPage.verifyPaginationIsDisplayed(pageName);
});

Then('verify it displays {string} option from the left navigation', async ({ commonPage }, option: string) => {
  await commonPage.verifyNavigationOption(option);
});

Then('logout from the application', async ({ loginPage, authSession }) => {
  await loginPage.logout();
  authSession.recordLogout();
});

Then('verify user logs out from the application', async ({ loginPage }) => {
  await loginPage.verifyLogout();
});

When('press {string} button', async ({ commonPage }, button: string) => {
  await commonPage.clickButton(button);
});

When('press "Save & Continue" button on the {string} page', async ({ commonPage }, pageName: string) => {
  await commonPage.continuePortalConfiguration(pageName);
});

When('user click at {string} link', async ({ commonPage }, elementName: string) => {
  await commonPage.downloadFileFromElement(elementName);
});

Then('verify {string} user name and {string} email address are displayed', async ({ commonPage }, userName: string, emailAddress: string) => {
  await commonPage.verifyProfileDetails(userName, emailAddress);
});

Then('verify {string} are displayed on the {string} section', async ({ commonPage }, menuOptions: string, section: string) => {
  if (section !== 'Profile') {
    throw new Error(`Section "${section}" is not recognized.`);
  }

  await commonPage.verifyProfileMenuOptions(menuOptions);
});

Then('the {string} page is displayed', async ({ commonPage }, pageName: string) => {
  await commonPage.verifyPageNavigation(pageName);
});

Then('the footer page {string} is displayed', async ({ commonPage }, links: string) => {
  await commonPage.verifyFooterLinksAreDisplayed(links);
});

Then('the footer destination page {string} is displayed', async ({ commonPage }, title: string) => {
  await commonPage.verifyFooterDestinationPageIsDisplayed(title);
});

Then('the {string} popup is displayed', async ({ commonPage }, title: string) => {
  await commonPage.verifyPopupTitle(title);
});

Then('verify {string} buttons are displayed in the {string} page', async ({ commonPage, userManagementPage }, buttons: string, pageName: string) => {
  if (pageName === 'User Management') {
    await userManagementPage.verifyButtonsAreDisplayed(buttons);
    return;
  }

  await commonPage.verifyButtonsAreDisplayed(buttons, pageName);
});

Then('verify {string} are displayed in the {string} page', async ({ commonPage }, messages: string, pageName: string) => {
  await commonPage.verifyMandatoryFieldMessagesAreDisplayed(messages, pageName);
});

Then('verify {string} toast message is displayed in the {string} page', async ({ commonPage }, message: string, pageName: string) => {
  await commonPage.verifyToastMessageIsDisplayed(message, pageName);
});

Then('verify {string} buttons are displayed on the {string} popup', async ({ commonPage }, buttons: string, title: string) => {
  await commonPage.verifyPopupButtonsAreDisplayed(buttons, title);
});

When('press {string} button on the {string} popup', async ({ commonPage }, button: string, title: string) => {
  await commonPage.clickPopupButton(button, title);
});

Then('verify the following content is displayed:', async ({ commonPage }, content: string) => {
  await commonPage.verifyDisclaimerContent(content);
});