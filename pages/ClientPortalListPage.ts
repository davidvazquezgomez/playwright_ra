import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClientPortalListPage extends BasePage {

  private menuSection = (text: string) => `nav >> text=${text}`;
  private menuOption = (option: string) => `role=link[name='${option}']`;
  private clientPortalListHeading = "role=heading[name='Client Portal List']";
  private clientPortalOverviewHeading = 'h3.dashboard-title:has-text("Overview")';
  private gridSelector = '[role="grid"], table, ag-grid-angular, .ag-root-wrapper';
  private firstClientPortalEditButton =
    '[role="grid"][aria-label="Data table"] tbody tr.k-master-row:first-child button[title="Edit Client"]';
  private itemsPerPageDropdown = 'kendo-pager-page-sizes kendo-dropdownlist[aria-label="items per page"]';
  private itemsPerPageOption = (itemsPerPage: string) => `role=option[name="${itemsPerPage}"]`;
  private selectedItemsPerPage = (itemsPerPage: string) =>
    `${this.itemsPerPageDropdown} .k-input-value-text:text-is("${itemsPerPage}")`;
  private clientPortalTable = '[role="grid"][aria-label="Data table"]';
  private clientPortalRows = `${this.clientPortalTable} tbody tr.k-master-row`;
  private clientPortalNameFilter = 'input[aria-label="Client Portal Name Filter"]';
  private clientPortalNameCell = (portalName: string) =>
    `${this.clientPortalRows} td[data-kendo-grid-column-index="0"]:text-is("${portalName}")`;
  private clientPortalRowByName = (portalName: string) =>
    `${this.clientPortalRows}:has(td[data-kendo-grid-column-index="0"]:text-is("${portalName}"))`;
  private editClientButtonByPortalName = (portalName: string) =>
    `${this.clientPortalRowByName(portalName)} button[title="Edit Client"]`;
  private createdDatePicker = `${this.clientPortalTable} td[aria-label="Created Date Filter"] kendo-datepicker`;
  private createdDateCells = `${this.clientPortalRows} td[data-kendo-grid-column-index="1"]`;
  private statusFilterDropdown = `${this.clientPortalTable} td[aria-label="Status Filter"] kendo-dropdownlist[role="combobox"]`;
  private statusFilterOption = (status: string) => `role=option[name="${status}"]`;
  private selectedStatusFilter = (status: string) =>
    `${this.statusFilterDropdown} .k-input-value-text:text-is("${status}")`;
  private clientPortalStatusCells = `${this.clientPortalRows} td[data-kendo-grid-column-index="2"]`;
  private noClientPortalResultsMessage =
    '[role="grid"][aria-label="Data table"] tbody tr.k-grid-norecords p';
  private pagerButtonByName = (buttonName: string) => {
    const buttonSelectors: Record<string, string> = {
      'Next Page': 'kendo-pager button[title="Go to the next page"]',
      'Previous Page': 'kendo-pager button[title="Go to the previous page"]',
      'Last Page': 'kendo-pager button[title="Go to the last page"]',
      'First Page': 'kendo-pager button[title="Go to the first page"]',
    };

    return buttonSelectors[buttonName] ?? `kendo-pager-numeric-buttons button[aria-label="Page ${buttonName}"]`;
  };
  private currentPagerPage = 'kendo-pager-numeric-buttons button[aria-current="page"]';
  private lastPageButton = 'kendo-pager button[title="Go to the last page"]';
  private clientPortalMenuCandidates = [
    'app-side-navigation span.menu-text:has-text("Client Portal List"), app-side-navigation span.menu-text:has-text("Client List"), nav a:has-text("Client Portal List"), nav a:has-text("Client List"), nav span:has-text("Client Portal List"), nav span:has-text("Client List")',
    'a[aria-label*="client portal" i], a[href*="portal"]',
    'app-side-navigation i.fa-list, app-side-navigation i.fa-bars, app-side-navigation i.fa.fa-list',
  ];
  private grid = this._page.locator(this.gridSelector).first();

  /**
   * Ensures that the Client Portal List page is displayed.
   * It uses the available menu options and reloads the current page as fallback.
   */
  async ensureClientPortalListPage(): Promise<void> {
    const listHeading = this._page.locator(this.clientPortalListHeading).first();
    if (await listHeading.isVisible({ timeout: 2000 }).catch(() => false)) {
      return;
    }

    for (const selector of this.clientPortalMenuCandidates) {
      const menu = this._page.locator(selector).first();
      if (await menu.isVisible({ timeout: 1500 }).catch(() => false)) {
        await this.clickElement(selector);
        if (await this.checkIfFieldIsDisplayed(this.clientPortalListHeading)) {
          return;
        }
      }
    }

    await this.reload();
    await this.waitForSelectorStatus(this.clientPortalListHeading, 'visible');
  }

  /**
   * Verifies that a portal is available from either supported post-login landing page.
   */
  async verifyApplicablePortals(): Promise<void> {
    const clientPortalOverview = this._page.locator(this.clientPortalOverviewHeading).first();
    if (await clientPortalOverview.isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(clientPortalOverview).toBeVisible();
      return;
    }

    await this.ensureClientPortalListPage();
    await expect(
      this._page.locator(this.clientPortalListHeading).first()
    ).toBeVisible({ timeout: 90000 });
    await expect(this.grid).toBeVisible();
  }

  /**
   * Opens the edit page for the first client portal in the list.
   */
  async editFirstClientPortal(): Promise<void> {
    await this.ensureKendoGridHasRows(
      this.clientPortalTable,
      'The Client Portal List must contain a client portal before the first portal can be edited.',
      'The Client Portal List grid was displayed before attempting to edit its first row.',
    );
    await this.ensureExpectedBusinessElementIsVisible(
      this._page.locator(this.firstClientPortalEditButton),
      'A displayed client portal must provide the Edit action to an authorized user.',
      'The Edit Client button is displayed for the first client portal row.',
      'At least one Client Portal List data row is visible.',
    );
    await this.clickElement(this.firstClientPortalEditButton);
  }

  /**
   * Opens the edit page for the requested client portal.
   * @param portalName Exact client portal name displayed in the Client Portal List.
   */
  async editClientPortal(portalName: string): Promise<void> {
    const normalizedPortalName = portalName.trim();
    await this.fillInputText(this.clientPortalNameFilter, normalizedPortalName);
    await this.verifyClientPortalDisplayed(normalizedPortalName);
    await this.ensureExpectedBusinessElementIsVisible(
      this._page.locator(this.editClientButtonByPortalName(normalizedPortalName)),
      'A displayed client portal must provide the Edit Client action to an authorized user.',
      `The Edit Client button is displayed for client portal "${normalizedPortalName}".`,
      `The Client Portal List was filtered to client portal "${normalizedPortalName}".`,
    );
    await this.clickElement(this.editClientButtonByPortalName(normalizedPortalName));
  }

  /**
   * Verifies that the first visible client portal does not expose the Edit action.
   */
  async verifyEditButtonIsNotDisplayed(): Promise<void> {
    await this.verifyElementIsNotDisplayed(this.firstClientPortalEditButton);
  }

  /**
   * Selects the requested number of client portals to display per page.
   * @param itemsPerPage Number of rows to display per page.
   */
  async selectClientPortalsPerPage(itemsPerPage: string): Promise<void> {
    await this.clickElement(this.itemsPerPageDropdown);
    await this.clickElement(this.itemsPerPageOption(itemsPerPage));
    await this.waitForSelectorStatus(this.selectedItemsPerPage(itemsPerPage), 'visible');
  }

  /**
   * Verifies that the Client Portal List does not display more rows than its configured page size.
   * @param expectedCount Maximum number of client portal rows per page.
   */
  async verifyClientPortalsDisplayed(expectedCount: number): Promise<void> {
    const clientPortalRows = this._page.locator(this.clientPortalRows);

    await expect.poll(async () => clientPortalRows.count()).toBeLessThanOrEqual(expectedCount);
  }

  /**
   * Filters the Client Portal List by client portal name.
   * @param portalName Client portal name to filter by.
   */
  async filterByClientPortalName(portalName: string): Promise<void> {
    await this.fillInputText(this.clientPortalNameFilter, portalName);
  }

  /**
   * Verifies that the filtered Client Portal List displays the requested portal.
   * @param portalName Expected client portal name.
   */
  async verifyClientPortalDisplayed(portalName: string): Promise<void> {
    const clientPortalNameCell = this._page.locator(this.clientPortalNameCell(portalName));

    await expect(clientPortalNameCell).toBeVisible();
    await expect(this._page.locator(this.clientPortalRows)).toHaveCount(1);
  }

  /**
   * Filters the Client Portal List by created date.
   * @param dateValue Date to select in DD/MM/YYYY format.
   */
  async filterByCreatedDate(dateValue: string): Promise<void> {
    await this.selectDateFromKendoDatePicker(this.createdDatePicker, dateValue);
  }

  /**
   * Verifies that every displayed client portal has the requested created date.
   * @param dateValue Expected date in DD/MM/YYYY format.
   */
  async verifyEveryClientPortalCreatedDate(dateValue: string): Promise<void> {
    const [day, month, year] = dateValue.split('/').map(Number);
    const monthAbbreviations = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const expectedDate = `${String(day).padStart(2, '0')} ${monthAbbreviations[month - 1]} ${year}`;
    const dateCells = this._page.locator(this.createdDateCells);

    const doAllCreatedDatesMatch = async (): Promise<boolean> => {
      const displayedDates = (await dateCells.allTextContents()).map(date => date.trim());
      return displayedDates.length > 0 && displayedDates.every(date => date === expectedDate);
    };

    try {
      await expect.poll(doAllCreatedDatesMatch).toBe(true);
    } catch {
      const displayedDates = (await dateCells.allTextContents()).map(date => date.trim());

      this.failWithApplicationError(
        'Every displayed client portal must match the applied Created Date filter.',
        `Every Created Date is "${expectedDate}".`,
        `[${displayedDates.join(' | ')}]`,
        `The Created Date filter is "${dateValue}".`,
      );
    }
  }

  /**
   * Filters the Client Portal List by status.
   * @param status Status option to select.
   */
  async filterByStatus(status: string): Promise<void> {
    if (await this._page.locator(this.selectedStatusFilter(status)).isVisible().catch(() => false)) {
      return;
    }

    await this.clickElement(this.statusFilterDropdown);
    await this.clickElement(this.statusFilterOption(status));
    await this.waitForSelectorStatus(this.selectedStatusFilter(status), 'visible');
  }

  /**
   * Verifies that the Client Portal List displays results for the selected status.
   * @param status Selected status filter value.
   */
  async verifyStatusFilterResults(status: string): Promise<void> {
    const statusCells = this._page.locator(this.clientPortalStatusCells);

    if (status === 'All') {
      await expect.poll(async () => (await statusCells.allTextContents()).length > 0).toBe(true);
      return;
    }

    const doAllStatusesMatchFilter = async (): Promise<boolean> => {
      const displayedStatuses = (await statusCells.allTextContents())
        .map(displayedStatus => displayedStatus.trim());
      return displayedStatuses.length > 0 && displayedStatuses.every(displayedStatus => displayedStatus === status);
    };

    try {
      await expect.poll(doAllStatusesMatchFilter).toBe(true);
    } catch {
      const displayedStatuses = (await statusCells.allTextContents())
        .map(displayedStatus => displayedStatus.trim());

      this.failWithApplicationError(
        'Every displayed client portal must match the applied Status filter.',
        `Every Status is "${status}".`,
        `[${displayedStatuses.join(' | ')}]`,
        `The Status filter is "${status}".`,
      );
    }
  }

  /**
   * Verifies that the Client Portal List displays its empty state after filtering.
   */
  async verifyNoClientPortalResultsDisplayed(): Promise<void> {
    await expect(this._page.locator(this.clientPortalRows)).toHaveCount(0);
    await expect(this._page.locator(this.noClientPortalResultsMessage)).toHaveText(
      'There is no data to display.',
    );
  }

  /**
   * Navigates the Client Portal List pager using a named control or page number.
   * @param buttonName Pager control name or numeric page number.
   */
  async clickPaginationButton(buttonName: string): Promise<void> {
    const pagerButton = this.pagerButtonByName(buttonName);
    await this.waitForElement(pagerButton);

    if (await this._page.locator(pagerButton).getAttribute('aria-disabled') === 'true') {
      return;
    }

    await this.clickElement(pagerButton);
  }

  /**
   * Verifies the active page in the Client Portal List pager.
   * @param expectedPage Expected page number, or `last` for the final page.
   */
  async verifyCurrentPage(expectedPage: string): Promise<void> {
    if (expectedPage === 'last') {
      await expect(this._page.locator(this.lastPageButton)).toHaveAttribute('aria-disabled', 'true');
      return;
    }

    await expect(this._page.locator(this.currentPagerPage)).toHaveAttribute('aria-label', `Page ${expectedPage}`);
  }

  /**
  * Navigates to a section and option within the sidebar/navigation menu.
  * @param section  Main section name
  * @param option   Specific option within the section
  */
  async navigateToSection(section: string, option: string): Promise<void> {
    await this.waitForElement(this.menuSection(section));
    await this.clickElement(this.menuSection(section));
    await this.waitForElement(this.menuOption(option));
    await this.clickElement(this.menuOption(option));
    await this.captureScreenshotInCurrentStep(`Navigate_${section}_${option}`);
  }

}