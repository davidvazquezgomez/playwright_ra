import { createBdd } from 'playwright-bdd';
import { test as base } from 'playwright-bdd';
import { BasePage } from '../../pages/BasePage';
import { CommonPage } from '../../pages/CommonPage';
import { ClientPortalSetupPage } from '../../pages/ClientPortalSetupPage';
import { LoginPage } from '../../pages/LoginPage';
import { ClientPortalListPage } from '../../pages/ClientPortalListPage';
import { OverviewPage } from '../../pages/OverviewPage';
import { ReleaseNotesPage } from '../../pages/ReleaseNotesPage';
import { UploadUpdatesPage } from '../../pages/UploadUpdatesPage';
import { UserManagementPage } from '../../pages/UserManagementPage';
import { ManageImpactAreasPage } from '../../pages/ManageImpactAreasPage';
import { ActionsDashboardPage } from '../../pages/ActionsDashboardPage';
import { AnalyticsDashboardPage } from '../../pages/AnalyticsDashboardPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { UpdatesDashboardPage } from '../../pages/UpdatesDashboardPage';
import { AuthSession, createAuthSession, prepareFeatureAuthState } from '../../utils/AuthStateManager';
import { TeamManagementPage } from '../../pages/TeamManagementPage';
import { AutomaticAllocationPage } from '../../pages/AutomaticAllocationPage';
import { PrivacyNoticePage } from '../../pages/PrivacyNoticePage';
import { NotificationsPage } from '../../pages/NotificationsPage';

/**
 * Gherkin tag prefixes that allure-playwright recognizes automatically
 * when received as Playwright tags (e.g. @epic:Authentication).
 *
 * allure-playwright v3 already parses tags in the @label:value format and
 * converts them into native Allure labels (epic, feature, story, severity, etc.)
 * WITHOUT additional code. This was verified by checking that the
 * allure-results JSON files contain the correct labels.
 *
 * ⚠️  Do NOT use allure.label() in fixtures — it creates visible
 *     "Allure Metadata" steps that clutter the Gherkin step view.
 */

/**
 * Custom fixtures for BDD tests.
 *
 * Extends Playwright fixtures with the project's Page Objects.
 * playwright-bdd injects them into the step definitions automatically.
 */
export const test = base.extend<{
  _failureEvidence: void;
  basePage: BasePage;
  commonPage: CommonPage;
  clientPortalSetupPage: ClientPortalSetupPage;
  loginPage: LoginPage;
  clientPortalListPage: ClientPortalListPage;
  overviewPage: OverviewPage;
  releaseNotesPage: ReleaseNotesPage;
  uploadUpdatesPage: UploadUpdatesPage;
  userManagementPage: UserManagementPage;
  manageImpactAreasPage: ManageImpactAreasPage;
  actionsDashboardPage: ActionsDashboardPage;
  analyticsDashboardPage: AnalyticsDashboardPage;
  dashboardPage: DashboardPage;
  updatesDashboardPage: UpdatesDashboardPage;
  teamManagementPage: TeamManagementPage;
  automaticAllocationPage: AutomaticAllocationPage;
  privacyNoticePage: PrivacyNoticePage;
  notificationsPage: NotificationsPage;
  authSession: AuthSession;
  testData: Record<string, any>;
}>({
  _failureEvidence: [async ({ basePage }, use, testInfo) => {
    await use();
    await basePage.teardown(testInfo);
  }, { auto: true }],
  context: async ({ browser }, use, testInfo) => {
    const storageState = await prepareFeatureAuthState(browser, testInfo.file);
    const context = await browser.newContext(storageState ? { storageState } : undefined);
    try {
      await use(context);
    } finally {
      await context.close();
    }
  },
  basePage: async ({ page, context }, use) => {
    await use(new BasePage(page, context));
  },
  commonPage: async ({ page, context }, use) => {
    await use(new CommonPage(page, context));
  },
  clientPortalSetupPage: async ({ page, context }, use) => {
    await use(new ClientPortalSetupPage(page, context));
  },
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
  clientPortalListPage: async ({ page, context }, use) => {
    await use(new ClientPortalListPage(page, context));
  },
  overviewPage: async ({ page, context }, use) => {
    await use(new OverviewPage(page, context));
  },
  releaseNotesPage: async ({ page, context }, use) => {
    await use(new ReleaseNotesPage(page, context));
  },
  uploadUpdatesPage: async ({ page, context }, use) => {
    await use(new UploadUpdatesPage(page, context));
  },
  userManagementPage: async ({ page, context }, use) => {
    await use(new UserManagementPage(page, context));
  },
  manageImpactAreasPage: async ({ page, context }, use) => {
    await use(new ManageImpactAreasPage(page, context));
  },
  actionsDashboardPage: async ({ page, context }, use) => {
    await use(new ActionsDashboardPage(page, context));
  },
  analyticsDashboardPage: async ({ page, context }, use) => {
    await use(new AnalyticsDashboardPage(page, context));
  },
  dashboardPage: async ({ page, context }, use) => {
    await use(new DashboardPage(page, context));
  },
  updatesDashboardPage: async ({ page, context }, use) => {
    await use(new UpdatesDashboardPage(page, context));
  },
  teamManagementPage: async ({ page, context }, use) => {
    await use(new TeamManagementPage(page, context));
  },
  automaticAllocationPage: async ({ page, context }, use) => {
    await use(new AutomaticAllocationPage(page, context));
  },
  privacyNoticePage: async ({ page, context }, use) => {
    await use(new PrivacyNoticePage(page, context));
  },
  notificationsPage: async ({ page, context }, use) => {
    await use(new NotificationsPage(page, context));
  },
  authSession: async ({ }, use, testInfo) => {
    await use(await createAuthSession(testInfo.file));
  },
  testData: async ({ }, use) => {
    await use({});
  },
});

/**
 * Creates the Given, When, and Then functions bound to the fixtures.
 * They are imported by the step definitions.
 */
export const { Given, When, Then } = createBdd(test);
