import { expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class CommonPage extends BasePage {
  private sideNavigation = '.side-navigation';
  private deloitteLogo = '#headerTile[aria-label="Deloitte Logo"][href="/"]';
  private navigationRenderTimeout = 5000;
  private navigationReloadAttempts = 5;
  private readonly collapsedNavigationToggleCandidates = [
    'app-side-navigation i.fa-bars',
    'app-side-navigation i.fa.fa-bars',
    '.side-navigation-toggle',
    'button[aria-label="Toggle navigation"]',
  ];
  private cookieConsentModal = '#onetrust-banner-sdk';
  private closeCookieConsentButton = '#onetrust-banner-sdk #onetrust-close-btn-container button, #onetrust-banner-sdk button[aria-label="Close"]';

  // Main navigation items
  private menuLinkByText = (item: string) =>
    item === 'Home'
      ? `${this.sideNavigation} a.menu-link[href="/home"]`
      : `${this.sideNavigation} a.menu-link[title="${item}"], ${this.sideNavigation} a.menu-link[data-title="${item}"], ${this.sideNavigation} a.menu-link:has(.menu-text:text-is("${item}"))`;

  // Submenu items
  private submenuLinkByText = (item: string) =>
    `${this.sideNavigation} a.submenu-link[title="${item}"], ` +
    `${this.sideNavigation} a.submenu-link[data-title="${item}"], ` +
    `${this.sideNavigation} a[title="${item}"], ` +
    `${this.sideNavigation} a[data-title="${item}"], ` +
    `${this.sideNavigation} a:has-text("${item}"), ` +
    `${this.sideNavigation} button:has-text("${item}")`;

  // Menu item with submenu
  private menuWithSubmenu =
    `${this.sideNavigation} [title="Menu"], ` +
    `${this.sideNavigation} [data-title="Menu"], ` +
    `${this.sideNavigation} [aria-label="Menu"], ` +
    `${this.sideNavigation} :text-is("Menu")`;

  private continueButton = 'button.k-button-primary:has-text("Continue")';
  private nextButton = 'button.k-button-primary:has(.k-button-text:text-is("Next"))';
  private reassignButton = 'button.k-button-primary:has(.k-button-text:text-is("Reassign"))';
  private confirmButton = 'button[aria-label="Confirm"]';
  private confirmDeletionButton = 'button.k-button-error:has(.k-button-text:text-is("Confirm Deletion"))';
  private updateAnywayButton = 'button[aria-label="Update anyway"]';
  private portalConfigurationSaveAndContinueButton = 'button.k-button-primary:has(.k-button-text:text-is("Save & Continue"))';
  private setNotificationPreferencesButton = 'role=button[name="Set Notification Preferences"]';
  private updatePortalButton = 'button.k-button-primary:has(.k-button-text:text-is("Update Portal"))';
  private saveSettingsButton = 'role=button[name="Save Settings"]';
  private clientPortalSetupHeading = 'app-title h1.heading:has-text("Client Portal Setup")';
  private clientPortalNameInput = 'kendo-textbox[formcontrolname="clientPortalName"] input.k-input-inner';
  private knowledgeModulesStep = 'kendo-stepper a.k-step-link[title="Knowledge Modules & Impact Areas"]';
  private knowledgeModulesCurrentStep = 'kendo-stepper a.k-step-link[title="Knowledge Modules & Impact Areas"][aria-current="step"]';
  private knowledgeModulesHeading = 'role=heading[name="Knowledge Modules & Impact Areas"][level="1"]';
  private jurisdictionsSelectionHeading = 'role=heading[name="Jurisdictions selection"][level="1"]';
  private addNewButton = 'button:has(.k-button-text:has-text("Add New"))';
  private addNewUserButton = 'button:has(.k-button-text:text-is("Add New User"))';
  private addNewUsersButton = 'button:has(.k-button-text:text-is("Add New Users"))';
  private deleteSelectedUserButton = 'button:has(.k-button-text:text-is("Delete Selected User"))';
  private deleteSelectedUsersButton = 'button:has(.k-button-text:text-is("Delete Selected Users"))';
  private createTeamButton = 'role=button[name="Create Team"]';
  private createNewPortalButton = 'button:has(.k-button-text:text-is("Create New Portal"))';
  private createNewAllocationButton = 'button:has(.k-button-text:text-is("Create New Allocation"))';
  private saveButton = 'button:has(.k-button-text:has-text("Save"))';
  private cancelButton = 'button:has(.k-button-text:has-text("Cancel"))';
  private disableImpactAreaButton = 'button:has(.k-button-text:has-text("Disable Impact Area"))';
  private enableImpactAreaButton = 'button:has(.k-button-text:has-text("Enable Impact Area"))';
  private expandAllButton = 'button:has(.k-button-text:has-text("Expand All"))';
  private collapseAllButton = 'button:has(.k-button-text:has-text("Collapse All"))';
  private disclaimerFooterLink = 'a[aria-label="Disclaimer"]';
  private privacyFooterLink = 'a[aria-label="Privacy"]';
  private termsOfUseFooterLink = 'a[aria-label="Terms of use"]';
  private ossAttributionFooterLink = 'a[aria-label="OSS Attribution"]';
  private cookieFooterLink = 'a[aria-label="Cookie"]';
  private cookieSettingsFooterLink = 'a[aria-label="Cookie Settings"]';
  private footerLinkByLabel = (label: string) => `.footerLinks a[aria-label="${label}"]`;
  private viewAllUpdatesButton = 'button[title="Clear filters and view all updates"]';
  private viewAllActionsButton = 'button[title="Clear filters and view all actions"]';
  private addActionButton = 'button:has-text("Add Action")';
  private backButton = 'app-title a.back-link, .back a.back-link';
  private favouriteIcon = '.view-toggle > span:not(.d-none) i[title="Save as favourite"]';
  private openDashboardButton = 'role=button[name="Open Dashboard"]';
  private dashboardFilterButton = 'button[title="Filter"]';
  private downloadUpdatesTemplateLink = 'a.download-template:has-text("Download Updates Template")';
  private updatesDashboardSearchInput = 'input[placeholder="Select or type update title"][role="combobox"]';
  private exportUsersButton = 'button:has(.k-button-text:text-is("EXPORT USERS"))';
  private uploadSummaryPageTitle = 'h1.heading:text-matches("upload summary|updates summary", "i")';
  private uploadCompletePageTitle = 'text=/upload complete/i';
  private overviewPageTitle = 'h3.dashboard-title:has-text("Overview")';
  private portalOverviewPageTitle = (pageName: string) =>
    `role=heading[name="${pageName}"][level="3"]`;
  private pageHeadingByName = (pageName: string) => `h1.heading:has-text("${pageName}")`;
  private userManagementPageTitle = 'h1.heading:text-is("User Management")';
  // Notification preference pages render the title without the shared heading class.
  private defaultNotificationSettingsPageTitle =
    'app-user-notification-preference app-title h1:text-matches("Default Notifications Settings|Notification Preferences|Notifications Preferences", "i")';
  private releaseNotesPageTitle = 'app-title h1.heading:text-is("RegulatoryAdvantage | Release Notes")';
  private pageTitle = 'app-title h1.heading';
  private disclaimerContent = 'div.description-section > div';
  private privacyPreferenceCenterDialog = 'div[role="dialog"][aria-label="Privacy Preference Center"]';
  private privacyPreferenceCenterTitle = `${this.privacyPreferenceCenterDialog} h2#ot-pc-title`;
  private kendoDialogByTitle = (title: string) =>
    `div[role="dialog"]:has(.k-dialog-title:text-is("${title}"))`;
  private kendoDialogButtonByName = (title: string, buttonName: string) =>
    `${this.kendoDialogByTitle(title)} button:is([aria-label="${buttonName}"], :has(> span.k-button-text:text-is("${buttonName}")))`;
  private visibleKendoDialogContent = 'div[role="dialog"]:visible .k-dialog-content';
  private dialogActionButtonByName = (buttonName: string) =>
    `div[role="dialog"]:visible kendo-dialog-actions button[aria-label="${buttonName}"]`;
  private profileButton = 'app-header .profile-initials';
  private notificationsButton = 'app-header .right-icons li.notification';
  private notificationsPopup = 'kendo-popup.k-animation-container-shown .k-popup.notification-content';
  private notificationsPopupTitle = `${this.notificationsPopup} .popup-header h6`;
  private viewAllNotificationsLink = `${this.notificationsPopup} a.view-all-notifications`;
  private profilePopup = '.profile-content:visible';
  private profileName = `${this.profilePopup} .profile-details h5`;
  private profileEmail = `${this.profilePopup} .profile-details .email a`;
  private profileMenuOptionByName = (option: string) =>
    `${this.profilePopup} ul a:text-is("${option}")`;
  private buttonByName = (buttonName: string) =>
    this._page.getByRole('button', { name: buttonName, exact: true });
  private mandatoryFieldMessageByText = (message: string) =>
    this._page.locator('.k-form-error').filter({ hasText: message });
  private legacyApplicationMessageByText = (message: string) =>
    this._page.locator(`text=${message}`);
  private applicationMessageByText = (message: string) =>
    this._page.getByText(message, { exact: true });
  private toastMessageByText = (message: string) =>
    this._page.locator('.k-notification-content').filter({ hasText: message });
  private checkboxLabelByName = (checkboxName: string) =>
    `label.k-label:text-is("${checkboxName}")`;
  private gridFilterInputByName = (fieldName: string) =>
    `input[aria-label="${fieldName} Filter"]`;
  private sharedKendoGrid = '[role="grid"][aria-label="Data table"]';
  private sharedGridRows = `${this.sharedKendoGrid} tbody tr.k-master-row`;
  private sharedGridColumnHeaderByName = (columnName: string) =>
    `role=columnheader[name="${columnName}"]`;
  private initializedGridSortCycles = new Set<string>();
  private tabByName = (tabName: string) => `role=tab[name="${tabName}"]`;
  private paginationPageSizes =
    'kendo-pager-page-sizes:has(kendo-dropdownlist[role="combobox"][aria-label="items per page"])';
  private visibleKendoFieldOptionByName = (optionName: string) =>
    `kendo-popup.k-animation-container-shown:visible .select-all:text-is("${optionName}"), ` +
    `kendo-popup.k-animation-container-shown:visible li[role="option"]:text-is("${optionName}"), ` +
    `kendo-popup.k-animation-container-shown:visible li[role="option"]:has(.k-list-item-text:text-is("${optionName}"))`;
  private visibleKendoSelectAllCheckbox =
    'kendo-popup.k-animation-container-shown:visible .select-all input[type="checkbox"]';
  private visibleUserPickerOptionByName = (optionName: string) =>
    `kendo-popup.k-animation-container-shown:visible li[role="option"]:has(.person-name:text-is("${optionName}"))`;
  private readonly userPickerResultsTimeout = 15000;


  /**
   * Launches the application by navigating to the specified URL.
   * @param url The URL of the application to launch.
   */
  async launchApplication(url: string): Promise<void> {
    await this.loadPage(url);
    const [title, bodyText] = await Promise.all([
      this._page.title(),
      this._page.locator('body').innerText(),
    ]);

    if (title.trim().toLowerCase() === 'access denied' || /access denied/i.test(bodyText)) {
      throw new Error(
        `Application access was denied before authentication. URL: ${this._page.url()}. ` +
        'Allowlist the Azure Pipelines agent egress IPs in the STAGE WAF, or run this pipeline on a self-hosted agent with approved network access.',
      );
    }
  }

  /**
   * Verifies that a page displays its Kendo pagination page-size control.
   * @param pageName Name of the page where pagination is expected.
   */
  async verifyPaginationIsDisplayed(pageName: string): Promise<void> {
    if (!pageName.trim()) {
      throw new Error('A page name must be provided when verifying pagination.');
    }

    await this.verifyElementIsDisplayed(this.paginationPageSizes);
  }

  /**
   * Opens a Kendo field control and selects an option from its popup.
   * @param controlSelector Selector for the page-specific Kendo selection control.
   * @param optionName Exact visible option to select.
   */
  async selectKendoFieldOption(controlSelector: string, optionName: string): Promise<void> {
    await this.clickElement(controlSelector);

    if (optionName === 'Select All') {
      await this._page.locator(this.visibleKendoSelectAllCheckbox).check({ force: true });
      return;
    }

    await this.clickElement(this.visibleKendoFieldOptionByName(optionName));
  }

  /**
   * Filters and confirms a user or team from a people-picker popup with Enter.
   * @param controlSelector Selector for the page-specific people-picker control.
   * @param searchInputSelector Selector for the people-picker search input.
   * @param optionName Exact visible user or team name to select.
   */
  async selectUserPickerOption(
    controlSelector: string,
    searchInputSelector: string,
    optionName: string,
  ): Promise<void> {
    await this.clickElement(controlSelector);
    await this.waitForElement(searchInputSelector, this.userPickerResultsTimeout);
    await this.fillInputText(searchInputSelector, optionName);
    await this.waitForElement(this.visibleUserPickerOptionByName(optionName), this.userPickerResultsTimeout);
    await this.pressKeyOnElement(searchInputSelector, 'Enter');
  }

  /**
   * Opens an application page identified by its reusable Gherkin name.
   * @param pageName Name of the application page to open.
   */
  async openNamedPage(pageName: string): Promise<void> {
    const pageRoutes: Record<string, string> = {
      // Shared application pages (all test roles)
      'Manage Impact Areas': '/impact-area-list',
      'Update Privacy Notice': '/update-privacy-notice',
      'RegulatoryAdvantage | Privacy Notice': '/privacy-notice',
      'Notification Preferences': '/user-notification-preference',

      // 01_13Jan REG (portal 361; used by DeloitteUser, PortalAdmin, and SuperAdmin)
      'User Management - 01_13Jan REG': '/user-management/361',
      'Team Management - 01_13Jan REG': '/teams/361',
      'Automatic Allocation of Updates - 01_13Jan REG': '/allocation/361',
      'Automatic Allocation Setup - 01_13Jan REG': '/allocation-setup/361',
      'Updates Dashboard - 01_13Jan REG': '/project-dashboard/361/Updates/AllUpdates/All',
      '01_13Jan REG - Updates Dashboard - All Updates': '/project-dashboard/361/Updates/AllUpdates/All',
      '01_13Jan REG - Analytics Dashboard - Update Analytics': '/project-dashboard/361/Analytics/UpdateAnalytics/All',
      '01_13Jan REG - Analytics Dashboard - Action Analytics': '/project-dashboard/361/Analytics/ActionsAnalytics/All',
      'Actions Dashboard - 01_13Jan REG': '/project-dashboard/361/Actions/AllActions/All',
      '01_13Jan REG - Overview': '/dashboard/361',

      // Global Inc (portal 142; used by PortalAdmin)
      'User Management - Global Inc': '/user-management/142',
      'Team Management - Global Inc': '/teams/142',
      'Automatic Allocation of Updates - Global Inc': '/allocation/142',
      'Automatic Allocation Setup - Global Inc': '/allocation-setup/142',
      'Updates Dashboard - Global Inc': '/project-dashboard/142/Updates/AllUpdates/All',
      'Global Inc - Updates Dashboard - All Updates': '/project-dashboard/142/Updates/AllUpdates/All',
      'Global Inc - Analytics Dashboard - Update Analytics': '/project-dashboard/142/Analytics/UpdateAnalytics/All',
      'Global Inc - Analytics Dashboard - Action Analytics': '/project-dashboard/142/Analytics/ActionsAnalytics/All',
      'Global Inc - Actions Dashboard': '/project-dashboard/142/Actions/AllActions/All',

      // QA_Test client3 (portal 213; used by DeloitteUser)
      'User Management - QA_Test client3': '/user-management/213',
      'Team Management - QA_Test client3': '/teams/213',
      'Updates Dashboard - QA_Test client3': '/project-dashboard/213/Updates/AllUpdates/All',
      'QA_Test client3 - Analytics Dashboard - Update Analytics': '/project-dashboard/213/Analytics/UpdateAnalytics/All',
      'QA_Test client3 - Analytics Dashboard - Action Analytics': '/project-dashboard/213/Analytics/ActionsAnalytics/All',
      'Actions Dashboard - QA_Test client3': '/project-dashboard/213/Actions/AllActions/All',

      // 1_E2E_Test1 (portal 180; used by SuperAdmin)
      '1_E2E_Test1 - Updates Dashboard - All Updates': '/project-dashboard/180/Updates/AllUpdates/All',

      // 01_QA_StageTestPortal (portal 415; used by ClientAdmin, TeamLeader, and TeamMember)
      'Team Management - 01_QA_StageTestPortal': '/teams/415',
      'Automatic Allocation of Updates - 01_QA_StageTestPortal': '/allocation/415',
      'Automatic Allocation Setup - 01_QA_StageTestPortal': '/allocation-setup/415',
      '01_QA_StageTestPortal - Updates Dashboard - All Updates': '/project-dashboard/415/Updates/AllUpdates/All',
      '01_QA_StageTestPortal - Analytics Dashboard - Update Analytics': '/project-dashboard/415/Analytics/UpdateAnalytics/All',
      '01_QA_StageTestPortal - Analytics Dashboard - Action Analytics': '/project-dashboard/415/Analytics/ActionsAnalytics/All',
      '01_QA_StageTestPortal - Actions Dashboard': '/project-dashboard/415/Actions/AllActions/All',

      // 01_QA_ClientPortalSetup (portal 616; used by DeloitteUser, PortalAdmin, and SuperAdmin)
      '01_QA_ClientPortalSetup - Updates Dashboard - All Updates': '/project-dashboard/616/Updates/AllUpdates/All',
      '01_QA_ClientPortalSetup - Analytics Dashboard - Update Analytics': '/project-dashboard/616/Analytics/UpdateAnalytics/All',
      '01_QA_ClientPortalSetup - Overview - Update Analytics': '/project-dashboard/616/Analytics/UpdateAnalytics/All',
      '01_QA_ClientPortalSetup - Actions Dashboard': '/project-dashboard/616/Actions/AllActions/All',

      // ClientPortal_20260209133616 (portal 540; used by ClientUser)
      'Automatic Allocation of Updates - ClientPortal_20260209133616': '/allocation/540',
      'Automatic Allocation Setup - ClientPortal_20260209133616': '/allocation-setup/540',
      'ClientPortal_20260209133616 - Updates Dashboard - All Updates': '/project-dashboard/540/Updates/AllUpdates/All',
      'ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics': '/project-dashboard/540/Analytics/UpdateAnalytics/All',
      'ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics': '/project-dashboard/540/Analytics/ActionsAnalytics/All',
      'ClientPortal_20260209133616 - Actions Dashboard': '/project-dashboard/540/Actions/AllActions/All',

      // ClientPortal_20260212191012 (portal 548; used by TeamLeader and TeamMember)
      'Updates Dashboard - ClientPortal_20260212191012': '/project-dashboard/548/Updates/AllUpdates/All',
      'Actions Dashboard - ClientPortal_20260212191012': '/project-dashboard/548/Actions/AllActions/All',

      // ClientPortal_20260213081718 (portal 553; used by ClientAdmin and ClientUser)
      'User Management - ClientPortal_20260213081718': '/user-management/553',
      'Updates Dashboard - ClientPortal_20260213081718': '/project-dashboard/553/Updates/AllUpdates/All',
      'Actions Dashboard - ClientPortal_20260213081718': '/project-dashboard/553/Actions/AllActions/All',
    };
    const pageRoute = pageRoutes[pageName];

    if (!pageRoute) {
      throw new Error(`Page "${pageName}" is not recognized.`);
    }

    const environment = (process.env.ENV || 'STAGE').toUpperCase();
    const applicationUrl = environment === 'DEV' ? process.env.DEV_URL : process.env.STAGE_URL;
    if (!applicationUrl) {
      throw new Error(`URL is not configured for environment ${environment}.`);
    }

    await this.loadPage(new URL(pageRoute, applicationUrl).toString());
    await this.waitForNamedPageToRender(pageName, pageRoute);
  }

  /**
   * Verifies that a named route has completed rendering its page-specific content.
   * @param pageName Gherkin name of the requested page.
   * @param pageRoute Relative route used to open the page.
   */
  private async waitForNamedPageToRender(pageName: string, pageRoute: string): Promise<void> {
    let readinessSelector: string | undefined;

    if (pageRoute.includes('/Actions/')) {
      readinessSelector = this.dashboardFilterButton;
    } else if (pageRoute.includes('/Updates/')) {
      readinessSelector = this.updatesDashboardSearchInput;
    }

    if (!readinessSelector) {
      return;
    }

    try {
      await this.waitForElement(readinessSelector);
    } catch (error) {
      const currentUrl = this._page.url();
      const title = await this._page.title().catch(() => 'unavailable');
      const navigationError = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Unable to render "${pageName}" after navigation. Expected route: "${pageRoute}". ` +
        `Current URL: "${currentUrl}". Page title: "${title}". Original error: ${navigationError}`,
      );
    }
  }

  /**
   * Closes the OneTrust cookie-consent banner when it is displayed.
   */
  async dismissCookieConsent(): Promise<void> {
    const cookieConsentModal = this._page.locator(this.cookieConsentModal);

    await cookieConsentModal.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
    if (await cookieConsentModal.isVisible()) {
      await this.clickElement(this.closeCookieConsentButton, 5000);
      await this.waitForSelectorStatus(this.cookieConsentModal, 'hidden');
    }
  }

  /**
   * Click on a navigation option by name.
   * Handles both main menu items and submenu items.
   * For submenu items (e.g., "Upload Updates"), automatically expands the "Menu" submenu.
   * @param option The navigation option to click (e.g., "Home", "Upload Updates", "Manage Impact Areas").
   * @returns A promise that resolves when the navigation option has been clicked.
   */
  async clickNavigationOption(option: string): Promise<void> {
    const navigationWasAvailable = await this.retryWithReload(async () => {
      const sideNavigation = this._page.locator(this.sideNavigation);
      try {
        await this.waitForSelectorStatus(this.sideNavigation, 'attached', this.navigationRenderTimeout);
      } catch {
        for (let logoAttempt = 1; logoAttempt <= 3; logoAttempt++) {
          try {
            await this.clickElement(this.deloitteLogo, this.navigationRenderTimeout);
            await this.waitForSelectorStatus(this.sideNavigation, 'attached', this.navigationRenderTimeout);
            break;
          } catch (error) {
            if (logoAttempt === 3) {
              throw error;
            }
          }
        }
      }

      if (await sideNavigation.count() > 0) {
        if (!await this.expandSideNavigationIfCollapsed()) {
          return false;
        }
      }

      if (!await sideNavigation.isVisible({ timeout: this.navigationRenderTimeout }).catch(() => false)) {
        return false;
      }

      const submenuLink = this.submenuLinkByText(option);
      const mainMenuLink = this.menuLinkByText(option);

      if (await this._page.locator(mainMenuLink).count() > 0) {
        await this.clickElement(mainMenuLink, this.navigationRenderTimeout);
        return true;
      }

      await this.clickElement(this.menuWithSubmenu, this.navigationRenderTimeout);
      await this.waitForSelectorStatus(submenuLink, 'attached', this.navigationRenderTimeout);
      await this.clickElement(submenuLink, this.navigationRenderTimeout);
      return true;
    }, this.navigationReloadAttempts);

    if (!navigationWasAvailable) {
      const sideNavigation = this._page.locator(this.sideNavigation);
      throw new Error(
        `Unable to open the left navigation option "${option}" after ${this.navigationReloadAttempts} attempts. ` +
        `Side navigation elements: ${await sideNavigation.count()}. ` +
        `Visible: ${await sideNavigation.isVisible().catch(() => false)}. ` +
        `Current URL: "${this._page.url()}".`,
      );
    }
  }

  /**
   * Expands the side navigation when it is rendered in its collapsed state.
   * @returns True when the side navigation is visible.
   */
  private async expandSideNavigationIfCollapsed(): Promise<boolean> {
    const sideNavigation = this._page.locator(this.sideNavigation);
    if (await sideNavigation.isVisible().catch(() => false)) {
      return true;
    }

    for (const toggleSelector of this.collapsedNavigationToggleCandidates) {
      const toggle = this._page.locator(toggleSelector).first();
      if (!await toggle.isVisible().catch(() => false)) {
        continue;
      }

      await this.clickLocator(toggle, this.navigationRenderTimeout);
      if (await sideNavigation.isVisible({ timeout: this.navigationRenderTimeout }).catch(() => false)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Clicks a checkbox through its visible label.
   * @param checkboxName Exact visible label of the checkbox.
   */
  async clickCheckbox(checkboxName: string): Promise<void> {
    await this.clickElement(this.checkboxLabelByName(checkboxName));
  }

  /**
   * Fills a named Kendo grid filter input.
   * @param fieldName Display name of the grid field.
   * @param value Value used to filter the grid.
   * @param pageName Name of the page that owns the grid.
   */
  async fillGridFilterField(fieldName: string, value: string, pageName: string): Promise<void> {
    const supportedPages = ['Client Portal List', 'Manage Impact Areas'];
    if (!supportedPages.includes(pageName)) {
      throw new Error(`Page "${pageName}" is not supported.`);
    }

    const filterInput = this.gridFilterInputByName(fieldName);
    await this.clearInput(filterInput);
    await this.fillInputText(filterInput, value);
  }

  /**
   * Verifies that one or more shared Kendo grid column headers are visible.
   * @param columnNames Semicolon-delimited names of the expected columns.
   * @param pageName Name of the page that owns the grid.
   */
  async verifyGridColumnHeaderDisplayed(columnNames: string, pageName: string): Promise<void> {
    const columnNamesToVerify = columnNames.split(';').map(columnName => columnName.trim()).filter(Boolean);

    if (columnNamesToVerify.length === 0) {
      throw new Error(`At least one column header must be provided for page "${pageName}".`);
    }

    for (const columnName of columnNamesToVerify) {
      await this.verifyElementIsDisplayed(this.sharedGridColumnHeaderByName(columnName));
    }
  }

  /**
   * Clicks a shared Kendo grid column header to change its sort state.
   * @param columnName Name of the column to sort.
   * @param pageName Name of the page that owns the grid.
   */
  async clickGridColumnHeader(columnName: string, pageName: string): Promise<void> {
    const columnHeaderSelector = this.sharedGridColumnHeaderByName(columnName);
    const sortCycleKey = this.getGridSortCycleKey(pageName, columnName);

    if (!this.initializedGridSortCycles.has(sortCycleKey)) {
      await this.clearPreexistingGridSort(columnHeaderSelector, columnName, pageName);
      this.initializedGridSortCycles.add(sortCycleKey);
    }

    await this.clickElement(columnHeaderSelector);
  }

  /**
   * Creates a stable key used to track the first sort interaction per page and column.
   * @param pageName Name of the page that owns the grid.
   * @param columnName Name of the sorted column.
   * @returns Normalized key for internal sort-cycle state.
   */
  private getGridSortCycleKey(pageName: string, columnName: string): string {
    return `${pageName.trim().toLowerCase()}::${columnName.trim().toLowerCase()}`;
  }

  /**
   * Removes any existing sort state from the requested column so sort assertions start from an unsorted baseline.
   * @param columnHeaderSelector Selector for the requested column header.
   * @param columnName Name of the sorted column.
   * @param pageName Name of the page that owns the grid.
   */
  private async clearPreexistingGridSort(
    columnHeaderSelector: string,
    columnName: string,
    pageName: string,
  ): Promise<void> {
    const columnHeader = this._page.locator(columnHeaderSelector);

    for (let attempt = 0; attempt < 3; attempt++) {
      const currentSort = (await columnHeader.getAttribute('aria-sort'))?.trim().toLowerCase();
      if (currentSort !== 'ascending' && currentSort !== 'descending') {
        return;
      }

      await this.clickElement(columnHeaderSelector);
    }

    const finalSort = (await columnHeader.getAttribute('aria-sort'))?.trim().toLowerCase();
    if (finalSort === 'ascending' || finalSort === 'descending') {
      throw new Error(
        `Unable to clear the predefined sort for column "${columnName}" on page "${pageName}" before verifying sort order.`,
      );
    }
  }

  /**
   * Verifies that visible rows in a shared Kendo grid are sorted by a requested column.
   * @param order Expected sorting direction.
   * @param columnName Name of the sorted column.
   * @param pageName Name of the page that owns the grid.
   */
  async verifyGridItemsSorted(
    order: 'ascending' | 'descending',
    columnName: string,
    pageName: string,
  ): Promise<void> {
    const columnHeader = this._page.locator(this.sharedGridColumnHeaderByName(columnName));
    const columnIndex = await columnHeader.getAttribute('aria-colindex');
    if (!columnIndex) {
      throw new Error(`Column "${columnName}" is not supported on page "${pageName}".`);
    }

    await expect(columnHeader).toHaveAttribute('aria-sort', order);
    await this.ensureKendoGridHasRows(
      this.sharedKendoGrid,
      `The "${pageName}" grid must contain data before "${columnName}" can be sorted.`,
      `The "${columnName}" header reports aria-sort="${order}".`,
    );
    const columnCells = this._page.locator(
      `${this.sharedGridRows} td[data-kendo-grid-column-index="${Number(columnIndex) - 1}"]`,
    );
    const areColumnValuesSorted = async (): Promise<boolean> => {
      const values = (await columnCells.allTextContents()).map(value => value.trim());
      const sortedValues = [...values].sort((firstValue, secondValue) => {
        const comparison = columnName.includes('Date')
          ? this.compareGridDateValues(firstValue, secondValue)
          : this.compareGridTextValues(firstValue, secondValue);
        return order === 'ascending' ? comparison : -comparison;
      });

      return values.length > 0 && values.every((value, index) => value === sortedValues[index]);
    };

    try {
      await expect.poll(areColumnValuesSorted).toBe(true);
    } catch {
      const actualValues = (await columnCells.allTextContents()).map(value => value.trim());
      const expectedValues = [...actualValues].sort((firstValue, secondValue) => {
        const comparison = columnName.includes('Date')
          ? this.compareGridDateValues(firstValue, secondValue)
          : this.compareGridTextValues(firstValue, secondValue);
        return order === 'ascending' ? comparison : -comparison;
      });

      this.failWithApplicationError(
        `The "${columnName}" column in "${pageName}" must display rows in ${order} order ` +
        'when the header declares that sort direction.',
        `[${expectedValues.join(' | ')}]`,
        `[${actualValues.join(' | ')}]`,
        `The column header reports aria-sort="${order}".`,
      );
    }
  }

  /**
   * Verifies that sorting has been removed from a shared Kendo grid column.
   * @param columnName Name of the column without sorting.
   * @param pageName Name of the page that owns the grid.
   */
  async verifyGridSortingRemoved(columnName: string, pageName: string): Promise<void> {
    const columnHeader = this._page.locator(this.sharedGridColumnHeaderByName(columnName));
    await expect(columnHeader).not.toHaveAttribute('aria-sort', /.+/);
  }

  /**
   * Verifies that one or more tabs are visible on a supported application page.
   * @param tabs Semicolon-delimited tab labels to verify.
   * @param pageName Name of the page that owns the tabs.
   */
  async verifyTabsAreDisplayed(tabs: string, pageName: string): Promise<void> {

    const tabNames = tabs.split(';').map(tab => tab.trim()).filter(Boolean);
    if (tabNames.length === 0) {
      throw new Error('At least one tab must be provided.');
    }

    for (const tabName of tabNames) {
      await expect(this._page.locator(this.tabByName(tabName))).toBeVisible();
    }
  }

  /**
   * Verifies that a tab subsection is visible and active.
   * @param subsectionName Accessible name of the active tab subsection.
   */
  async verifySubsectionIsDisplayed(subsectionName: string): Promise<void> {
    const subsection = this._page.locator(this.tabByName(subsectionName));

    await expect(subsection).toBeVisible();
    await expect(subsection).toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Selects a tab by its accessible name and verifies that it becomes active.
   * @param tabName Accessible name of the tab to select.
   * @param tabKind Business hierarchy level represented by the tab.
   */
  async selectTab(tabName: string, tabKind: 'section' | 'subsection' = 'section'): Promise<void> {
    const tab = this.tabByName(tabName);

    await this.clickElement(tab);
    await expect(this._page.locator(tab), `Expected ${tabKind} "${tabName}" to be active.`).toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Escapes text before it is used as literal regular-expression content.
   * @param value Text to escape.
   * @returns Escaped regular-expression content.
   */
  private escapeRegularExpression(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Verifies that the requested action buttons are visible on an application page.
   * @param buttons Semicolon-delimited button labels to verify.
   * @param pageName Page name used in assertion messages.
   */
  async verifyButtonsAreDisplayed(buttons: string, pageName: string): Promise<void> {
    const buttonNames = buttons.split(';').map(button => button.trim()).filter(Boolean);

    if (buttonNames.length === 0) {
      throw new Error(`At least one button must be provided for the ${pageName} page.`);
    }

    for (const buttonName of buttonNames) {
      await expect(this.buttonByName(buttonName), `Expected "${buttonName}" button to be visible on the ${pageName} page.`).toBeVisible();
    }
  }

  /**
   * Verifies that a named application button is disabled.
   * @param buttonName Accessible name of the button to verify.
   */
  async verifyButtonIsDisabled(buttonName: string): Promise<void> {
    await expect(this.buttonByName(buttonName), `Expected "${buttonName}" button to be disabled.`).toBeDisabled();
  }

  /**
   * Verifies that every requested mandatory-field validation message is visible.
   * @param messages Semicolon-delimited mandatory-field validation messages.
   * @param pageName Page name used in assertion messages.
   */
  async verifyMandatoryFieldMessagesAreDisplayed(messages: string, pageName: string): Promise<void> {
    const mandatoryFieldMessages = messages.split(';').map(message => message.trim()).filter(Boolean);

    if (mandatoryFieldMessages.length === 0) {
      throw new Error(`At least one mandatory-field message must be provided for the ${pageName} page.`);
    }

    for (const message of mandatoryFieldMessages) {
      await expect(this.mandatoryFieldMessageByText(message), `Expected mandatory-field message "${message}" to be visible on the ${pageName} page.`).toBeVisible();
    }
  }

  /**
   * Verifies that an application message is visible.
   * @param message Exact message expected in the rendered application UI.
   */
  async verifyApplicationMessageIsDisplayed(message: string): Promise<void> {
    if (!message.trim()) {
      throw new Error('An expected application message must be provided.');
    }

    try {
      await expect(this.legacyApplicationMessageByText(message)).toBeVisible({ timeout: 3000 });
    } catch {
      await expect(this.applicationMessageByText(message), `Expected application message "${message}" to be visible.`).toBeVisible();
    }
  }

  /**
   * Verify that a navigation option is displayed.
   * Works for both main menu items and submenu items.
   * @param option The navigation option name to verify.
   * @throws Error if the option is not found.
   */
  async verifyNavigationOption(option: string): Promise<void> {
    await this.waitForSelectorStatus(this.sideNavigation, 'visible', this.navigationRenderTimeout);

    const navigationOption = this._page
      .locator(`${this.submenuLinkByText(option)}, ${this.menuLinkByText(option)}`)
      .first();

    await expect(
      navigationOption,
      `Navigation option "${option}" is not displayed in main menu or submenu.`,
    ).toBeVisible({ timeout: this.navigationRenderTimeout });
  }

  private compareGridDateValues(firstValue: string, secondValue: string): number {
    const firstTime = Date.parse(firstValue);
    const secondTime = Date.parse(secondValue);
    const normalizedFirstTime = Number.isNaN(firstTime) ? Number.POSITIVE_INFINITY : firstTime;
    const normalizedSecondTime = Number.isNaN(secondTime) ? Number.POSITIVE_INFINITY : secondTime;
    return normalizedFirstTime - normalizedSecondTime;
  }

  private compareGridTextValues(firstValue: string, secondValue: string): number {
    if (firstValue === secondValue) {
      return 0;
    }

    // The grid sorts text case-insensitively, so comparisons must ignore letter casing.
    return firstValue.localeCompare(secondValue, 'en', { sensitivity: 'base', numeric: true });
  }

  private async clickSaveButton(): Promise<void> {
    const dialogSaveButton = this.dialogActionButtonByName('Save');

    if (await this._page.locator(dialogSaveButton).isVisible()) {
      await this.clickElement(dialogSaveButton);
      return;
    }

    await this.clickElement(this.saveButton);
  }

  /**
   * Waits for a supported Client Portal configuration wizard page to render, then continues.
   * @param pageName Current wizard page that owns the Save and Continue button.
   */
  async continuePortalConfiguration(pageName: string): Promise<void> {
    let nextPageHeading: string;
    let nextPageState: 'attached' | 'visible' = 'visible';

    switch (pageName) {
      case 'Client Portal Setup':
        await this.waitForSelectorStatus(this.clientPortalSetupHeading, 'visible');
        await this.waitForSelectorStatus(this.clientPortalNameInput, 'visible');
        // The Client Portal Setup page keeps rendering after the name input appears; give it time to settle before clicking.
        await this.waitImplicit(2000);
        nextPageHeading = this.knowledgeModulesCurrentStep;
        nextPageState = 'attached';
        break;
      case 'Knowledge Modules & Impact Areas':
        await this.waitForSelectorStatus(this.knowledgeModulesHeading, 'visible');
        nextPageHeading = this.jurisdictionsSelectionHeading;
        break;
      default:
        throw new Error(`Save & Continue is not supported on page "${pageName}".`);
    }

    await this.clickElement(this.portalConfigurationSaveAndContinueButton);
    await this.waitForSelectorStatus(nextPageHeading, nextPageState);
  }

  /**
   * Clicks a supported shared action button.
   * @param button Button label to click.
   */
  async clickButton(button: string): Promise<void> {
    switch (button) {
      case "Continue":
        await this.clickElement(this.continueButton);
        break;
      case "Next":
        await this.clickElement(this.nextButton);
        break;
      case "Reassign":
        await this.clickElement(this.reassignButton);
        break;
      case "Confirm":
        {
          const visibleDialogConfirmButton = this._page
            .locator('div[role="dialog"]:visible')
            .last()
            .getByRole('button', { name: 'Confirm', exact: true });
          if (await visibleDialogConfirmButton.isVisible().catch(() => false)) {
            await this.clickLocator(visibleDialogConfirmButton);
            break;
          }

          await this.clickElement(this.confirmButton);
        }
        break;
      case "Confirm Deletion":
        await this.clickElement(this.confirmDeletionButton);
        break;
      case "Update anyway":
        await this.clickElement(this.updateAnywayButton);
        break;
      case "Add New":
        await this.clickElement(this.addNewButton);
        break;
      case "Add New User":
        await this.clickElement(this.addNewUserButton);
        break;
      case "Add New Users":
        await this.clickElement(this.addNewUsersButton);
        break;
      case "Delete Selected User":
        await this.clickElement(this.deleteSelectedUserButton);
        break;
      case "Delete Selected Users":
        await this.clickElement(this.deleteSelectedUsersButton);
        break;
      case "Add Action":
        await this.clickElement(this.addActionButton);
        break;
      case "Create Team":
        await this.clickElement(this.createTeamButton);
        break;
      case "Create New Portal":
        await this.clickElement(this.createNewPortalButton);
        break;
      case "Create New Allocation":
        await this.clickElement(this.createNewAllocationButton);
        break;
      case "Save":
        await this.clickSaveButton();
        break;
      case "Set Notifications Preferences":
        await this.clickElement(this.setNotificationPreferencesButton);
        await this.waitForSelectorStatus(this.defaultNotificationSettingsPageTitle, 'visible');
        break;
      case "Update Portal":
        await this.clickElement(this.updatePortalButton);
        break;
      case "Save Settings":
        await this.clickElement(this.saveSettingsButton);
        break;
      case "Close":
        await this.clickElement(this.dialogActionButtonByName('Close'));
        break;
      case "Cancel":
        {
          const visibleDialogCancelButton = this._page
            .locator('div[role="dialog"]:visible')
            .last()
            .getByRole('button', { name: 'Cancel', exact: true });
          if (await visibleDialogCancelButton.isVisible().catch(() => false)) {
            await this.clickLocator(visibleDialogCancelButton);
            break;
          }

          await this.clickElement(this.cancelButton);
        }
        break;
      case "Disable Impact Area":
        await this.clickElement(this.disableImpactAreaButton);
        break;
      case "Enable Impact Area":
        await this.clickElement(this.enableImpactAreaButton);
        break;
      case "Expand All":
        await this.clickElement(this.expandAllButton);
        break;
      case "Collapse All":
        await this.clickElement(this.collapseAllButton);
        break;
      case "Disclaimer":
        await this.clickElement(this.disclaimerFooterLink);
        break;
      case "Privacy":
        await this.clickElement(this.privacyFooterLink);
        break;
      case "Terms of Use":
        await this.openFooterLinkInCurrentTab(this.termsOfUseFooterLink);
        break;
      case "OSS Attribution":
        await this.clickElement(this.ossAttributionFooterLink);
        break;
      case "Cookie":
        await this.openFooterLinkInCurrentTab(this.cookieFooterLink);
        break;
      case "Cookie Settings":
        await this.clickElement(this.cookieSettingsFooterLink);
        break;
      case "View All Updates":
        await this.clickElement(this.viewAllUpdatesButton);
        break;
      case "View All Actions":
        await this.clickElement(this.viewAllActionsButton);
        break;
      case "View All":
        await Promise.all([
          this._page.waitForURL('**/view-all-notifications/all'),
          this.clickElement(this.viewAllNotificationsLink),
        ]);
        break;
      case "Profile":
        await this.clickElement(this.profileButton);
        await this.waitForSelectorStatus(this.profilePopup, 'visible');
        break;
      case "Notifications":
        await this.clickElement(this.notificationsButton);
        break;
      case "Notification Preferences":
      case "Release Notes":
        await this.clickElement(this.profileMenuOptionByName(button));
        break;
      case "Back":
        await this.clickElement(this.backButton);
        break;
      case "favorite icon":
        await this.clickElement(this.favouriteIcon);
        break;
      case "Open Dashboard":
        await this.clickElement(this.openDashboardButton);
        break;
      case "Filter":
        await this.clickElement(this.dashboardFilterButton);
        break;
      case "Dashboard options":
        await this.buttonByName('Dashboard Options').click();
        break;
      case "Generate Report":
      case "Generate Audit Trail":
      case "Comment":
      case "Delete":
      case "More Filters":
      case "Clear all filters":
      case "Remove user":
      case "Update Portal Now":
      case "Deactivate Portal":
      case "Yes":
      case "Edit Client":
      case "Reactivate Portal":
        await this.buttonByName(button).click({ noWaitAfter: true });
        break;
      case "Create anyway":
        await this.confirmDuplicateAutomaticAllocation();
        break;
      case "Attachments":
        await this._page.getByRole('tab', { name: 'Attachments', exact: true }).click();
        break;
      case "Knowledge Modules & Impact Areas":
        await this.clickElement(this.knowledgeModulesStep);
        break;
      case "Actions":
      case "My Actions":
        await this.selectTab(button);
        break;

      default:
        throw new Error(`Button "${button}" is not recognized.`);
    }
  }

  /**
   * Downloads a file from a supported shared control.
   * @param elementName Display name of the control that starts the download.
   */
  async downloadFileFromElement(elementName: string): Promise<void> {
    let selector: string;

    switch (elementName) {
      case 'Download updates template':
        selector = this.downloadUpdatesTemplateLink;
        break;
      case 'EXPORT USERS':
        selector = this.exportUsersButton;
        break;
      default:
        throw new Error(`Download element "${elementName}" is not recognized.`);
    }

    await this.downloadFile(selector);
  }

  /**
   * Verifies that the current application page displays the expected heading.
   * @param pageName Exact text expected in the page heading.
   */
  async verifyPageTitle(pageName: string): Promise<void> {
    await this.assertText(this.pageTitle, pageName);
  }

  /**
   * Verifies that every requested footer link is visible.
   * @param links Semicolon-delimited footer link labels.
   */
  async verifyFooterLinksAreDisplayed(links: string): Promise<void> {
    const linkLabels = links.split(';').map(link => link.trim()).filter(Boolean);
    if (linkLabels.length === 0) {
      throw new Error('At least one footer link must be provided.');
    }

    for (const linkLabel of linkLabels) {
      await expect(this._page.locator(this.footerLinkByLabel(linkLabel))).toBeVisible();
    }
  }

  /**
   * Verifies that navigation from a footer link displays the expected destination page heading.
   * @param title Exact heading expected on the footer destination page.
   */
  async verifyFooterDestinationPageIsDisplayed(title: string): Promise<void> {
    await this.assertText(this.pageHeadingByName(title), title);
  }

  /**
   * Verifies that a shared application toast message is displayed.
   * @param message Expected toast message.
   * @param pageName Page name used in assertion messages.
   */
  async verifyToastMessageIsDisplayed(message: string, pageName: string): Promise<void> {
    await expect(
      this.toastMessageByText(message),
      `Expected toast message "${message}" to be visible on the ${pageName} page.`,
    ).toBeVisible({ timeout: 30000 });
  }

  /**
   * Resolves the heading selector for a supported application workflow page.
   * @param pageName Name of the expected application page.
   * @returns Selector for the page heading.
   */
  private getPageNavigationSelector(pageName: string): string {
    const normalizedPageName = pageName.trim();

    // The " - All Updates" suffix identifies the default tab for routing but is not part of the rendered heading.
    if (normalizedPageName.endsWith(' - All Updates')) {
      return this.pageHeadingByName(normalizedPageName.replace(/ - All Updates$/, ''));
    }

    if (normalizedPageName.endsWith('Dashboard')) {
      return this.pageHeadingByName(normalizedPageName);
    }

    if (normalizedPageName.endsWith(' - Overview')) {
      return this.portalOverviewPageTitle(normalizedPageName);
    }

    switch (normalizedPageName) {
      case 'Upload Summary Page':
        return this.uploadSummaryPageTitle;
      case 'Upload Complete':
        return this.uploadCompletePageTitle;
      case 'Overview':
        return this.overviewPageTitle;
      case 'User Management':
        return this.userManagementPageTitle;
      case 'Notification Preferences':
      case 'Notifications Preferences':
      case 'Default Notifications Settings':
        return this.defaultNotificationSettingsPageTitle;
      case 'RegulatoryAdvantage | Release Notes':
        return this.releaseNotesPageTitle;
      default:
        return this.pageHeadingByName(normalizedPageName);
    }
  }

  /**
   * Verifies that a supported application workflow page is displayed.
   * @param pageName Name of the expected application page.
   */
  async verifyPageNavigation(pageName: string): Promise<void> {
    const selector = this.getPageNavigationSelector(pageName);
    await this.waitForSelectorStatus(selector, 'visible');
  }

  /**
   * Verifies that a supported application popup displays the expected title.
   * @param title Exact text expected in the popup heading.
   */
  async verifyPopupTitle(title: string): Promise<void> {
    if (title === 'Notifications') {
      await this.waitForSelectorStatus(this.notificationsPopup, 'visible');
      await this.assertText(this.notificationsPopupTitle, title);
      return;
    }

    if (title === 'Privacy Preference Center') {
      await this.waitForElement(this.privacyPreferenceCenterDialog);
      await this.assertText(this.privacyPreferenceCenterTitle, title);
      return;
    }

    const dialog = this.kendoDialogByTitle(title);
    await this.waitForElement(dialog);
    await this.assertText(`${dialog} .k-dialog-title`, title);
  }

  /**
   * Verifies that the visible Kendo dialog displays the expected message.
   * @param message Exact text expected in the popup content.
   */
  async verifyPopupMessage(message: string): Promise<void> {
    await expect(this._page.locator(this.visibleKendoDialogContent)).toHaveText(message);
  }

  /**
   * Verifies that the requested action buttons are visible in a supported popup.
   * @param buttons Semicolon-delimited button labels to verify.
   * @param title Title of the popup that owns the buttons.
   */
  async verifyPopupButtonsAreDisplayed(buttons: string, title: string): Promise<void> {
    const buttonNames = buttons.split(';').map(button => button.trim()).filter(Boolean);
    if (buttonNames.length === 0) {
      throw new Error(`At least one button must be provided for the ${title} popup.`);
    }

    for (const buttonName of buttonNames) {
      await this.waitForElement(this.kendoDialogButtonByName(title, buttonName));
    }
  }

  /**
   * Clicks a requested action button in a supported popup.
   * @param button Button label to click.
   * @param title Title of the popup that owns the button.
   */
  async clickPopupButton(button: string, title: string): Promise<void> {
    await this.clickElement(this.kendoDialogButtonByName(title, button));
  }

  /**
   * Confirms the duplicate automatic-allocation dialog when it is displayed after saving.
   */
  async confirmDuplicateAutomaticAllocationIfDisplayed(): Promise<void> {
    const duplicateDialog = this._page.locator(this.kendoDialogByTitle('Duplicate automatic allocation detected'));

    try {
      await duplicateDialog.waitFor({ state: 'visible', timeout: 2000 });
    } catch {
      return;
    }

    await this.confirmDuplicateAutomaticAllocation();
  }

  /**
   * Confirms creation from the duplicate automatic-allocation dialog and waits for it to close.
   */
  private async confirmDuplicateAutomaticAllocation(): Promise<void> {
    const duplicateDialog = this.kendoDialogByTitle('Duplicate automatic allocation detected');
    await this.clickElement(
      this.kendoDialogButtonByName('Duplicate automatic allocation detected', 'Create anyway'),
    );
    await this.waitForSelectorStatus(duplicateDialog, 'hidden');
  }

  /**
   * Verifies that the Disclaimer page displays the expected legal content.
   * @param content Expected Disclaimer content from the Gherkin DocString.
   */
  async verifyDisclaimerContent(content: string): Promise<void> {
    const actualContent = await this.getText(this.disclaimerContent);
    const normalizedExpectedContent = content.replace(/\s+/g, ' ').trim();
    const normalizedActualContent = actualContent.replace(/\s+/g, ' ').trim();

    if (normalizedActualContent !== normalizedExpectedContent) {
      this.failWithApplicationError(
        'The Disclaimer content must match the approved legal text.',
        normalizedExpectedContent,
        normalizedActualContent,
        'The Disclaimer content was displayed and normalized before comparison.',
      );
    }
  }

  /**
   * Verifies the identity details displayed in the Profile menu.
   * @param userName Expected user name.
   * @param emailAddress Expected email address.
   */
  async verifyProfileDetails(userName: string, emailAddress: string): Promise<void> {
    await this.waitForSelectorStatus(this.profileEmail, 'attached');

    const [actualUserName, actualEmailAddress] = await Promise.all([
      this.getText(this.profileName),
      this._page.locator(this.profileEmail).textContent(),
    ]);
    const normalizedEmailAddress = actualEmailAddress?.trim() ?? '';

    if (actualUserName !== userName || normalizedEmailAddress !== emailAddress) {
      this.failWithApplicationError(
        'The Profile menu must display the authenticated user identity configured for the scenario.',
        `Name: "${userName}"; email: "${emailAddress}".`,
        `Name: "${actualUserName}"; email: "${normalizedEmailAddress}".`,
        'The Profile popup was visible and both identity fields were rendered before comparison.',
      );
    }
  }

  /**
   * Verifies that the requested menu options are visible in the Profile menu.
   * @param menuOptions Semicolon-delimited Profile menu option labels.
   */
  async verifyProfileMenuOptions(menuOptions: string): Promise<void> {
    const options = menuOptions.split(';').map(option => option.trim()).filter(Boolean);

    if (options.length === 0) {
      throw new Error('At least one Profile menu option must be provided.');
    }

    for (const option of options) {
      await this.waitForSelectorStatus(this.profileMenuOptionByName(option), 'visible');
    }
  }

  /**
   * Opens a footer link in the active tab so its destination can be verified in the same scenario.
   * @param selector Selector for the footer link that normally opens a new tab.
   */
  private async openFooterLinkInCurrentTab(selector: string): Promise<void> {
    await this._page.locator(selector).evaluate(element => element.setAttribute('target', '_self'));
    await this.clickElement(selector);
    await this._page.waitForLoadState('domcontentloaded');
  }
}
