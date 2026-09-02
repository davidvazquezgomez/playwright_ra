import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class OverviewPage extends BasePage {
  
  private portalNameHeader = "h3[class*='dashboard-title']";
  private applicableWidgetsGridCells = "[class='grid-card']";
  private widgetCardByName = (widgetName: string) =>
    `${this.applicableWidgetsGridCells}:has(h4:has-text("${widgetName}"))`;
  private widgetDueDateValue = '.due-date .due-date-value';
  private widgetViewButton = '.view-button .view-btn';
  private widgetViewButtonByName = (widgetName: string) =>
    `${this.widgetCardByName(widgetName)} ${this.widgetViewButton}`;
  private overviewTitle = this.portalNameHeader;
  private viewAsGridButton = "button[title='List View']";
  private viewAsCardsButton = "button[title='Grid View']";
  private visibleViewToggleButton = '.view-toggle button.toggle-btn:visible';
  private initialViewToggleTitle?: 'List View' | 'Grid View';
  private saveAsFavouriteIcon = ".view-toggle i[title='Save as favourite']:visible";
  private selectedViewButton = ".view-toggle button[aria-pressed='true']:visible";
  private filledFavouriteStar = '.view-toggle i.fas.fa-star:visible';
  private openDashboardButton = ".dashboard-footer button:has-text('Open Dashboard')";
  private portalCell = (portalName: string) => `td[role='gridcell']:has-text("${portalName}")`;
  private readonly fieldSelectors: Record<string, string> = {
    'Deloitte label': '#headerTile[title="Deloitte Label"]',
    'Application Name': 'app-header .header-title .desktop',
    'Ask Deloitte': 'app-header .ask-deloitte',
    'Notifications bell': 'app-header .notification',
    Profile: 'app-header .profile-initials',
    Disclaimer: '#footerContainer a[title="Disclaimer"]',
    Privacy: '#footerContainer a[title="Privacy"]',
    'Terms of use': '#footerContainer a[title="Terms of use"]',
    'OSS Attribution': '#footerContainer a[title="OSS Attribution"]',
    Cookie: '#footerContainer a[title="Cookie"]',
    'Cookie Settings': '#footerContainer a[title="Cookie Settings"]',
    'Applicable widgets': this.applicableWidgetsGridCells + ':first-of-type',
    Updates: 'li[role="tab"]:has-text("Updates")',
    Actions: 'li[role="tab"]:has-text("Actions")',
    Analytics: 'li[role="tab"]:has-text("Analytics")',
  };

  private readonly overviewButtonSelectors: Record<string, string> = {
    'open dashboard': this.openDashboardButton,
  };

  /**
  * Opens the requested portal from the list unless its Overview page is already displayed.
   * @param portalName Exact Client Portal Name shown in the portal table.
   */
  async clickOnPortalAndVerifyOverview(portalName: string): Promise<void> {
    const overviewHeader = this._page.locator(this.portalNameHeader);
 
    if (await overviewHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(overviewHeader).toContainText(portalName);
      return;
    }

    await this.clickElement(this.portalCell(portalName));
    await this.waitForSelectorStatus(this.portalNameHeader, 'visible');
  }

  /**
   * Verifies that the requested client portal name is displayed in the Overview header.
   * @param portalName Expected Client Portal Name displayed in the Overview header.
   */
  async verifyClientPortalName(portalName: string): Promise<void> {
    await expect(this._page.locator(this.portalNameHeader)).toContainText(portalName);
  }

  /**
   * Verifies that a widget card exists for each requested widget title.
   * @param elementName Semicolon-delimited widget titles from the Gherkin example.
   */
  async verifyOverviewElementsDisplayed(elementName: string): Promise<void> {
    const requestedWidgets = elementName.split(';').map(widgetName => widgetName.trim()).filter(Boolean);

    if (requestedWidgets.length === 0) {
      throw new Error('At least one widget name must be provided.');
    }

    for (const widgetName of requestedWidgets) {
      const widgetCard = this._page.locator(this.widgetCardByName(widgetName));
      await expect(widgetCard).toHaveCount(1);
      await expect(widgetCard).toBeVisible();
    }
  }

  /**
   * Verifies that every named Overview widget displays its due-date value.
   * @param widgetNames Semicolon-delimited widget titles from the Gherkin example.
   */
  async verifyWidgetDueDates(widgetNames: string): Promise<void> {
    const requestedWidgets = widgetNames.split(';').map(widgetName => widgetName.trim()).filter(Boolean);

    if (requestedWidgets.length === 0) {
      throw new Error('At least one widget name must be provided.');
    }

    for (const widgetName of requestedWidgets) {
      const widgetCard = this._page.locator(this.widgetCardByName(widgetName));
      await expect(widgetCard).toBeVisible();
      await expect(widgetCard.locator(this.widgetDueDateValue)).toHaveText(/\S/);
    }
  }

  /**
   * Clicks the View button within the specified Overview widget card.
   * @param widgetName Title of the widget that owns the button.
   * @param buttonName Visible button label expected by the Gherkin step.
   */
  async clickWidgetViewButton(widgetName: string, buttonName: string): Promise<void> {
    if (buttonName !== 'View') {
      throw new Error(`Unsupported widget button "${buttonName}". Use "View".`);
    }

    await this.clickElement(this.widgetViewButtonByName(widgetName));
  }

  /**
   * Verifies that the requested Overview header or footer fields are visible.
   * @param fields Semicolon-delimited display names of fields defined in the Gherkin example.
   */
  async verifyOverviewFieldsDisplayed(fields: string): Promise<void> {   
    await this.verifyRequestedFieldsDisplayed(fields, this.fieldSelectors);
  }

  /**
   * Verifies that every applicable Overview widget contains one visible View button.
   */
  async verifyViewButtonsForApplicableWidgets(): Promise<void> {
    const widgetCards = this._page.locator(this.applicableWidgetsGridCells);
    const widgetCount = await widgetCards.count();

    expect(widgetCount).toBeGreaterThan(0);

    for (let index = 0; index < widgetCount; index++) {
      const viewButton = widgetCards.nth(index).locator(this.widgetViewButton);

      await expect(viewButton).toHaveCount(1);
      await expect(viewButton).toBeVisible();
    }
  }

  /**
   * Captures the initial visible view control or verifies that later checks show the opposite view.
   */
  async verifyViewAsCardsAndSaveAsFavouriteOption(): Promise<void> {
    const visibleToggleButton = this._page.locator(this.visibleViewToggleButton);
    await Promise.all([
      this.waitForSelectorStatus(this.visibleViewToggleButton, 'visible'),
      this.waitForSelectorStatus(this.saveAsFavouriteIcon, 'visible'),
    ]);

    const title = await visibleToggleButton.getAttribute('title');

    if (!this.initialViewToggleTitle) {

      if (title !== 'List View' && title !== 'Grid View') {
        throw new Error(`Unsupported initial Overview view toggle title "${title}".`);
      }

      this.initialViewToggleTitle = title;
      return;
    }

    const expectedViewToggleTitle = this.initialViewToggleTitle === 'List View' ? 'Grid View' : 'List View';
    expect(title).toBe(expectedViewToggleTitle);
  }

  /**
   * Verifies whether the selected view is represented by a filled or unfilled favourite star.
   * @param fillStatus Empty when the star must be filled; "not" when it must be unfilled.
   */
  async verifyFilledFavouriteStar(fillStatus: string): Promise<void> {
    const normalizedFillStatus = fillStatus.trim().toLowerCase();

    if (normalizedFillStatus === '') {
      await expect(this._page.locator(this.filledFavouriteStar)).toBeVisible();
      return;
    }

    if (normalizedFillStatus === 'not') {
      await expect(this._page.locator(this.filledFavouriteStar)).not.toBeVisible();
      return;
    }

    throw new Error(`Unsupported favourite star fill status "${fillStatus}". Use an empty value or "not".`);
  }

  /**
   * Switches the Overview view and verifies that it differs from the initially displayed view.
   */
  async clickViewAsGridAndVerifyViewAsCards(): Promise<void> {
    if (!this.initialViewToggleTitle) {
      throw new Error('Initial Overview view state has not been captured. Verify the view control before switching it.');
    }

    const expectedViewToggleTitle = this.initialViewToggleTitle === 'List View' ? 'Grid View' : 'List View';
    const initialViewToggleSelector = this.initialViewToggleTitle === 'List View'
      ? this.viewAsGridButton
      : this.viewAsCardsButton;

    await this.clickElement(initialViewToggleSelector);
    await expect(this._page.locator(this.visibleViewToggleButton)).toHaveAttribute('title', expectedViewToggleTitle);
  }

  /**
   * Restores the Overview grid or card preference captured at the start of the scenario.
   */
  async restoreInitialView(): Promise<void> {
    if (!this.initialViewToggleTitle) {
      throw new Error('Initial Overview view state has not been captured. Verify the view control before restoring it.');
    }

    const currentViewToggleTitle = await this._page.locator(this.visibleViewToggleButton).getAttribute('title');
    if (currentViewToggleTitle === this.initialViewToggleTitle) {
      return;
    }

    const restoreSelector = this.initialViewToggleTitle === 'List View'
      ? this.viewAsCardsButton
      : this.viewAsGridButton;
    await this.clickElement(restoreSelector);
    await expect(this._page.locator(this.visibleViewToggleButton)).toHaveAttribute('title', this.initialViewToggleTitle);
  }

  /**
   * Verifies that the named Overview button is visible.
   * @param buttonName Gherkin name of the Overview button to verify.
   */
  async verifyOverviewButtonIsVisible(buttonName: string): Promise<void> {
    const normalizedButtonName = buttonName.trim().toLowerCase();
    const selector = this.overviewButtonSelectors[normalizedButtonName];

    if (!selector) {
      throw new Error(`Unsupported Overview button "${buttonName}". Supported buttons: ${Object.keys(this.overviewButtonSelectors).join(', ')}.`);
    }

    await expect(this._page.locator(selector)).toBeVisible();
  }

}
