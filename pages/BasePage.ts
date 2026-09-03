import { ElementHandle, expect, Locator, TestInfo } from '@playwright/test';
import type { BrowserContext, Page } from 'playwright-core';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import * as path from 'path';
import * as allure from 'allure-js-commons';
/**
 * All Page Objects in the project inherit from this class.
 */
export class BasePage {
  protected _page: Page;
  private context: BrowserContext;
  // Shared across page objects because every fixture wraps the same browser page.
  private static authenticatedRolesByPage = new WeakMap<Page, string>();

  constructor(page: Page, context: any) {
    this._page = page;
    this.context = context;
  }

  /**
   * Associates the authenticated role with the current browser page so role-restricted actions can validate it.
   * @param role Role used to log in, such as CLIENTADMIN or TEAMLEADER.
   */
  recordAuthenticatedRole(role: string): void {
    BasePage.authenticatedRolesByPage.set(this._page, role.trim().toUpperCase());
  }

  /**
   * Returns the role recorded for the current browser page.
   */
  protected getAuthenticatedRole(): string | undefined {
    return BasePage.authenticatedRolesByPage.get(this._page);
  }

  /**
   * Restricts a business action to administrator roles.
   * @param action Business action being protected.
   */
  protected requireAdministratorRole(action: string): void {
    const role = this.getAuthenticatedRole();
    if (!role) {
      throw new Error(
        `"${action}" is restricted to administrator roles, but no authenticated role was recorded for this scenario. ` +
        'Log in through the "launch Regulatory Advantage application URL and login as ... user ..." step before using it.',
      );
    }

    if (!role.includes('ADMIN')) {
      throw new Error(
        `"${action}" is restricted to administrator roles. The authenticated role "${role}" is not allowed to perform it.`,
      );
    }
  }

  /**
   * Retries a condition, reloading the page between attempts, until it succeeds or the attempts are exhausted.
   * Errors raised by the condition are retried; the last attempt propagates them as technical failures.
   * @param condition Condition evaluated on each attempt.
   * @param attempts Maximum number of attempts, including the first one.
   */
  protected async retryWithReload(condition: () => Promise<boolean>, attempts: number = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const isLastAttempt = attempt === attempts;
      try {
        if (await condition()) {
          return true;
        }
      } catch (error) {
        if (isLastAttempt) {
          throw error;
        }
      }

      if (!isLastAttempt) {
        await this.reload();
      }
    }

    return false;
  }

  /**
   * Fails a test with evidence that a verified application behavior violates a business rule.
   * Use only after the UI state has been successfully read; technical failures must remain native errors.
   */
  protected failWithApplicationError(
    businessRule: string,
    expectedResult: string,
    actualResult: string,
    evidence?: string,
  ): never {
    throw new Error(this.buildApplicationErrorMessage(
      businessRule,
      expectedResult,
      actualResult,
      evidence,
    ));
  }

  /**
   * Records a verified application defect without interrupting the current scenario.
   * @param businessRule Business rule violated by the rendered UI.
   * @param expectedResult Expected UI result.
   * @param actualResult Actual UI result.
   * @param evidence Corroborating rendered UI state.
   */
  protected async reportApplicationError(
    businessRule: string,
    expectedResult: string,
    actualResult: string,
    evidence?: string,
  ): Promise<void> {
    const message = this.buildApplicationErrorMessage(
      businessRule,
      expectedResult,
      actualResult,
      evidence,
    );

    console.error(message);
    await allure.attachment('Application defect detected', message, {
      contentType: allure.ContentType.TEXT,
    });
  }

  /**
   * Creates the standardized message used for confirmed application defects.
   */
  private buildApplicationErrorMessage(
    businessRule: string,
    expectedResult: string,
    actualResult: string,
    evidence?: string,
  ): string {
    const details = [
      'APPLICATION DEFECT DETECTED',
      `Business rule: ${businessRule}`,
      `Expected result: ${expectedResult}`,
      `Actual result: ${actualResult}`,
      evidence ? `Evidence: ${evidence}` : undefined,
    ].filter((detail): detail is string => Boolean(detail));

    return details.join('\n');
  }

  /**
   * Captures failure evidence without changing the page or context lifecycle.
   * @param testInfo Information about the current test.
   */
  async teardown(testInfo: TestInfo): Promise<void> {
    const screenshotFolder = process.env.SCREENSHOT_FOLDER || './screenshots';

    if (testInfo.status !== 'passed') {
      const screenshotId = String(testInfo.testId || testInfo.title)
        .replace(/[^a-zA-Z0-9_-]+/g, '_')
        .slice(0, 120);
      const screenshotPath = `${screenshotFolder}/FAILED_${screenshotId}_${Date.now()}.jpg`;
      await this.takeScreenshot(screenshotPath, { type: 'jpeg', quality: 60 });
      await allure.attachmentPath("screenshot", screenshotPath, {
        contentType: allure.ContentType.JPEG,
        fileExtension: "jpg",
      });
    }
  }

  /**
   * Dictionary to be used in some methods
   * 
   */
  private readonly _HtmlElements: string[] = ["div", "li", "p", "a", "span"];

  /**
   * Wait for the specified element
   * @param selector Element identification
   * @returns Element in selector
   */
  async waitForElement(selector: string, timeout?: number): Promise<ElementHandle<Element>> {
    const waitTimeout = timeout ?? (process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000);
    const element = await this._page.waitForSelector(selector, { timeout: waitTimeout });
    if (!element) {
      throw new Error(`Element "${selector}" not found. Timeout exceeded.`);
    }
    return element;
  }

  /**
   * Verifies that every requested field has a configured, visible selector on a page.
   * @param field Semicolon-delimited display names of the requested fields.
   * @param fieldSelectors Map of display names to page-specific selectors.
   * @param pageName Name of the page used in validation errors.
   */
  protected async verifyRequestedFieldsDisplayed(
    field: string,
    fieldSelectors: Record<string, string>
  ): Promise<void> {
    const fields = field.split(';').map(value => value.trim()).filter(Boolean);
    if (fields.length === 0) {
      throw new Error(`At least one field must be provided.`);
    }

    for (const requestedField of fields) {
      const selector = fieldSelectors[requestedField];
      if (!selector) {
        throw new Error(`No selector is configured for field "${requestedField}".`);
      }

      await this.waitForElement(selector);
    }
  }

  /**
   * Waits for a locator to reach a specific state.
   * @param selector  CSS/XPath selector string
   * @param state     'attached', 'detached', 'visible', or 'hidden'. Default is 'visible'.
   * @param timeout Maximum time to wait in milliseconds.
   */
  async waitForSelectorStatus(
    selector: string,
    state: 'attached' | 'detached' | 'visible' | 'hidden' = 'visible',
    timeout?: number,
  ): Promise<void> {
    const waitTimeout = timeout ?? (process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000);
    await this._page.locator(selector).waitFor({ state, timeout: waitTimeout });
  }

  /**
   * Waits for an element to become enabled.
   * @param selector Element selector.
   * @param timeout Maximum time to wait in milliseconds.
   */
  async waitForElementToBeEnabled(selector: string, timeout?: number): Promise<void> {
    const waitTimeout = timeout ?? (process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000);
    await expect(this._page.locator(selector)).toBeEnabled({ timeout: waitTimeout });
  }

  /**
   * Verifies that an element is hidden or absent from the current page.
   * @param selector Element selector.
   */
  async verifyElementIsNotDisplayed(selector: string): Promise<void> {
    await expect(this._page.locator(selector)).toBeHidden();
  }

  /**
   * Verifies that an element is visible on the current page.
   * @param selector Element selector.
   */
  async verifyElementIsDisplayed(selector: string): Promise<void> {
    await expect(this._page.locator(selector)).toBeVisible();
  }

  /**
   * Waits for a fixed amount of time.
   * @param milliseconds Duration of the pause in milliseconds.
   */
  async waitImplicit(milliseconds: number = 1000): Promise<void> {
    await this._page.waitForTimeout(milliseconds);
  }

  /**
   * Returns the access token stored in local storage.
   * @returns The stored access token.
   */
  async getTokenAccess(): Promise<string> {
    return await this.getLocalStorage("access_token");
  }

  /**
   * Takes a screenshot of the current page.
   * @param path Optional output path.
   * @param options Optional image format and quality.
   * @returns The screenshot data as a buffer.
   */
  async takeScreenshot(
    screenshotPath?: string,
    options: { type?: 'png' | 'jpeg'; quality?: number } = {},
  ): Promise<Buffer> {
    const screenshotsDir = process.env.SCREENSHOT_FOLDER || './screenshots';
    const outputPath = screenshotPath || `${screenshotsDir}/error-${Date.now()}.png`;
    mkdirSync(path.dirname(outputPath), { recursive: true });
    return await this._page.screenshot({ path: outputPath, ...options });
  }

  /**
    * Takes a screenshot and attaches it to the current Allure step.
    * @param screenShotName Name used for the screenshot attachment.
   */
  async captureScreenshotInCurrentStep(screenShotName: string): Promise<void> {
    const date = new Date();
    const currentDate = `${date.getHours()}_${date.getMinutes()}_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
    const screenshotFolder = process.env.SCREENSHOT_FOLDER || './screenshots';

    const screenshotPath = `${screenshotFolder}/${currentDate}_${screenShotName}.png`;
    await this.takeScreenshot(screenshotPath);

    await allure.attachmentPath(
      `${currentDate}_${screenShotName}`,
      screenshotPath,
      {
        contentType: allure.ContentType.PNG,
        fileExtension: 'png',
      }
    );
  }

  /**
    * Reads the inner text of an element.
    * @param selector Element selector.
    * @returns The element text.
   */
  async getText(selector: string): Promise<string> {
    let element = await this.waitForElement(selector);
    let val = (await element.innerText()).valueOf();
    return val;
  };

  /**
    * Extracts the first numeric value found in an element's text.
    * @param selector Element selector.
    * @returns The extracted numeric value.
   */
  async getNumericValue(selector: string): Promise<number> {
    let element = await this.waitForElement(selector);
    let text = await element.innerText();

    let regex = /[\d]+(?:\.[\d]+)?/;
    let match = text.match(regex);

    if (!match) {
      throw new Error('Could not extract a number');
    }

    let numericValue = Number(match[0]);

    if (isNaN(numericValue)) {
      throw new Error('The value is not numeric');
    }

    return numericValue;
  }

  /**
   * Gets the total item count reported by a Kendo grid pager.
   * @param pagerInfoSelector Selector or locator for the pager information element.
   * @returns Total item count reported by the pager.
   */
  async getKendoPagerItemCount(pagerInfoSelector: string | Locator): Promise<number> {
    const pagerInfo = typeof pagerInfoSelector === 'string'
      ? this._page.locator(pagerInfoSelector)
      : pagerInfoSelector;
    await expect(pagerInfo).toBeVisible();

    const pagerText = (await pagerInfo.textContent())?.trim() ?? '';
    const itemCount = /^\d+\s*-\s*\d+\s+of\s+(\d+)\s+items$/i.exec(pagerText)?.[1];
    if (!itemCount) {
      throw new Error(`Unable to read the total item count from pager text "${pagerText}".`);
    }

    return Number(itemCount);
  }

  /**
   * Gets the first item number reported by a Kendo grid pager.
   * @param pagerInfoSelector Selector or locator for the pager information element.
   * @returns First item number reported by the pager.
   */
  async getKendoPagerFirstItemNumber(pagerInfoSelector: string | Locator): Promise<number> {
    const pagerInfo = typeof pagerInfoSelector === 'string'
      ? this._page.locator(pagerInfoSelector)
      : pagerInfoSelector;
    await expect(pagerInfo).toBeVisible();

    const pagerText = (await pagerInfo.textContent())?.trim() ?? '';
    const firstItemNumber = /^(\d+)\s*-\s*\d+\s+of\s+\d+\s+items$/i.exec(pagerText)?.[1];
    if (!firstItemNumber) {
      throw new Error(`Unable to read the first item number from pager text "${pagerText}".`);
    }

    return Number(firstItemNumber);
  }

  /**
   * Requires a rendered Kendo grid to contain at least one data row.
   * An explicit empty state is a confirmed application defect; an unresolved grid remains a technical failure.
   * @param gridSelector Kendo grid selector or locator.
   * @param businessRule Rule requiring data in the grid.
   * @param evidence Additional context for the application-defect report.
   */
  protected async ensureKendoGridHasRows(
    gridSelector: string | Locator,
    businessRule: string,
    evidence?: string,
  ): Promise<void> {
    const grid = typeof gridSelector === 'string' ? this._page.locator(gridSelector) : gridSelector;
    const dataRows = grid.locator('tbody tr.k-master-row');
    const noRecordsRow = grid.locator('tbody tr.k-grid-norecords');
    const waitTimeout = process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000;
    const hasVisibleDataRows = async (): Promise<boolean> =>
      (await dataRows.count()) > 0 && await dataRows.first().isVisible();
    const hasVisibleEmptyState = async (): Promise<boolean> =>
      (await noRecordsRow.count()) > 0 && await noRecordsRow.first().isVisible();

    try {
      await expect.poll(hasVisibleDataRows, { timeout: waitTimeout }).toBe(true);
      return;
    } catch (error) {
      if (!await hasVisibleEmptyState()) {
        throw error;
      }
    }

    this.failWithApplicationError(
      businessRule,
      'At least one data row is displayed.',
      'No data rows are displayed.',
      evidence ?? `The grid displays the empty-state message "${(await noRecordsRow.innerText()).trim()}".`,
    );
  }

  /**
   * Requires a rendered Kendo grid to have no data rows and display its explicit empty state.
   * A populated grid is a confirmed application defect; an unresolved grid remains a technical failure.
   * @param gridSelector Kendo grid selector or locator.
   * @param businessRule Rule requiring the grid to be empty.
   * @param evidence Additional context for the application-defect report.
   */
  protected async ensureKendoGridHasNoRows(
    gridSelector: string | Locator,
    businessRule: string,
    evidence?: string,
  ): Promise<void> {
    const grid = typeof gridSelector === 'string' ? this._page.locator(gridSelector) : gridSelector;
    const dataRows = grid.locator('tbody tr.k-master-row');
    const noRecordsRow = grid.locator('tbody tr.k-grid-norecords');
    const hasVisibleDataRows = async (): Promise<boolean> =>
      (await dataRows.count()) > 0 && await dataRows.first().isVisible();
    const hasVisibleEmptyState = async (): Promise<boolean> =>
      (await noRecordsRow.count()) > 0 && await noRecordsRow.first().isVisible();

    await expect.poll(async () =>
      await hasVisibleDataRows() || await hasVisibleEmptyState(),
    ).toBe(true);

    if (await hasVisibleEmptyState()) {
      return;
    }

    this.failWithApplicationError(
      businessRule,
      'No data rows are displayed and the empty-state message is visible.',
      `${await dataRows.count()} data row(s) are displayed.`,
      evidence,
    );
  }

  /**
   * Requires an expected business element to be visible after its owning UI state has been verified.
   * Strict-mode failures remain technical because they indicate an ambiguous automation locator.
   * @param element Locator for the expected element.
   * @param businessRule Rule requiring the element to be available.
   * @param expectedResult User-visible result expected from the application.
   * @param evidence Verified UI context supporting the defect classification.
   */
  protected async ensureExpectedBusinessElementIsVisible(
    element: Locator,
    businessRule: string,
    expectedResult: string,
    evidence: string,
  ): Promise<void> {
    const matchingElements = await element.count();
    if (matchingElements !== 1) {
      throw new Error(
        `Unable to verify business rule because the expected element locator matched ${matchingElements} elements. ` +
        `Expected exactly one match. Rule: ${businessRule}`,
      );
    }

    if (!await element.isVisible()) {
      this.failWithApplicationError(
        businessRule,
        expectedResult,
        'The expected element exists but is not visible.',
        evidence,
      );
    }
  }

  /**
   * Click an element on the screen
   * @param selector Element identification
   */
  async clickElement(selector: string, timeout?: number) {
    const element = await this.waitForElement(selector, timeout);
    await element.click({ noWaitAfter: true });
  }

  /**
   * Clicks a Locator after waiting for it to become visible, bounded by a fixed timeout so
   * unresolved dynamic locators (e.g. dropdown/autocomplete options) fail fast instead of
   * hanging until the overall test timeout.
   * @param locator Element locator to click.
   * @param timeout Maximum time to wait in milliseconds.
   */
  async clickLocator(locator: Locator, timeout?: number): Promise<void> {
    const waitTimeout = timeout ?? (process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000);
    await locator.waitFor({ state: 'visible', timeout: waitTimeout });
    await locator.click({ timeout: waitTimeout });
  }

  /**
  * Opens a Kendo DatePicker and selects the current local calendar day.
  * @param datePickerSelector Selector for the Kendo DatePicker component.
   */
  async selectTodayFromKendoDatePicker(datePickerSelector: string): Promise<void> {
    const datePicker = this._page.locator(datePickerSelector);
    const today = new Date();
    const currentDay = String(today.getDate());

    await datePicker.scrollIntoViewIfNeeded();
    await datePicker.locator('button.k-input-button').click();
    await expect(datePicker.locator('input[role="combobox"]')).toHaveAttribute('aria-expanded', 'true');
    const todayCell = this._page
      .locator('.k-calendar:visible')
      .last()
      .locator('.k-calendar-td:not(.k-other-month)')
      .getByText(currentDay, { exact: true });
    await todayCell.scrollIntoViewIfNeeded();
    // The calendar popup can remain outside the viewport even after scrolling; dispatch the event directly.
    await todayCell.dispatchEvent('click');
    await expect(datePicker.locator('input[role="combobox"]')).toHaveValue(/\d/);
  }

  /**
  * Opens a Kendo DatePicker and selects a date in DD/MM/YYYY format.
  * @param datePickerSelector Selector or locator for the Kendo DatePicker component.
   * @param dateValue Date to select in DD/MM/YYYY format.
   */
  async selectDateFromKendoDatePicker(datePickerSelector: string | Locator, dateValue: string): Promise<void> {
    const dateParts = dateValue.split('/').map(Number);
    const [day, month, year] = dateParts;
    const targetDate = new Date(year, month - 1, day);

    if (
      dateParts.length !== 3 ||
      !day ||
      !month ||
      !year ||
      targetDate.getDate() !== day ||
      targetDate.getMonth() !== month - 1 ||
      targetDate.getFullYear() !== year
    ) {
      throw new Error(`Date "${dateValue}" must use the DD/MM/YYYY format.`);
    }

    const datePicker = typeof datePickerSelector === 'string'
      ? this._page.locator(datePickerSelector)
      : datePickerSelector;
    const monthAbbreviations = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const displayedDate = `${day} ${monthAbbreviations[month - 1]} ${year}`;
    await datePicker.scrollIntoViewIfNeeded();
    await datePicker.locator('button.k-input-button').click();
    await expect(datePicker.locator('input[role="combobox"]')).toHaveAttribute('aria-expanded', 'true');
    const calendar = this._page.locator('.k-calendar:visible').last();
    await expect(calendar).toBeVisible();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    for (let attempt = 0; attempt < 120; attempt += 1) {
      const calendarTitle = (await calendar.locator('.k-calendar-title').textContent())?.trim();
      const [visibleMonth, visibleYear] = calendarTitle?.split(/\s+/) ?? [];
      const visibleMonthIndex = monthNames.indexOf(visibleMonth);
      const visibleYearNumber = Number(visibleYear);

      if (visibleMonthIndex === targetDate.getMonth() && visibleYearNumber === targetDate.getFullYear()) {
        const targetDay = calendar
          .locator('.k-calendar-td:not(.k-other-month)')
          .getByText(String(day), { exact: true });
        await targetDay.scrollIntoViewIfNeeded();
        // The calendar popup can remain outside the viewport even after scrolling; dispatch the event directly.
        await targetDay.dispatchEvent('click');
        await expect(datePicker.locator('input[role="combobox"]')).toHaveValue(displayedDate);
        return;
      }

      const navigateForward =
        visibleYearNumber < targetDate.getFullYear() ||
        (visibleYearNumber === targetDate.getFullYear() && visibleMonthIndex < targetDate.getMonth());
      await calendar.locator(navigateForward ? '.k-calendar-nav-next' : '.k-calendar-nav-prev').click();
    }

    throw new Error(`Unable to navigate the Kendo DatePicker to date "${dateValue}".`);
  }

  /**
   * Attempts to click an element without failing when it is unavailable.
   * @param selector Element selector.
   */
  async clickElementWithoutError(selector: string, timeout?: number) {
    try {
      await this.clickElement(selector, timeout);
    } catch {
      // The alternate account option is not always displayed.
    }
  }

  /**
   * Downloads a file triggered by the specified element and saves it locally.
   * @param selector Element that starts the download.
   * @param downloadFolder Folder where the downloaded file is saved.
   * @returns Absolute path of the saved file.
   */
  async downloadFile(selector: string, downloadFolder: string = 'downloads'): Promise<string> {
    const downloadPromise = this._page.waitForEvent('download');
    await this.clickElement(selector);
    const download = await downloadPromise;
    const downloadPath = path.resolve(downloadFolder, download.suggestedFilename());

    await download.saveAs(downloadPath);
    return downloadPath;
  }

  /**
   * Fills an input element with text.
   * @param selector Input selector.
   * @param text Text to enter.
   */
  async fillInputText(selector: string, text: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.fill(text);
  }

  /**
   * Presses a key on an element.
   * @param selector Element selector.
   * @param key Key to press.
   */
  async pressKeyOnElement(selector: string, key: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.press(key);
  }

  /**
   * Asserts that an element contains exactly the expected text.
   * @param selector Element selector.
   * @param expectedText Expected element text.
   */
  async assertText(selector: string, expectedText: string): Promise<void> {
    const elementText = await this.getText(selector);
    if (!elementText || elementText !== expectedText) {
      throw new Error(
        `Text mismatch for element "${selector}". ` +
        `Expected: "${expectedText}"; observed: "${elementText}".`,
      );
    }
  }

  /**
   * Verifies that an accessible tab is visible and selected.
   * @param tabName Accessible name of the expected active tab.
   */
  async verifyActiveTabIsDisplayed(tabName: string): Promise<void> {
    const activeTab = this._page.getByRole('tab', { name: tabName, exact: true });

    await expect(activeTab).toBeVisible();
    await expect(activeTab).toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Checks whether an element exists.
   * @param selector Element selector.
   * @returns True when the element exists.
   */
  async checkIfFieldExists(selector: string): Promise<boolean> {
    try {
      await this.waitForElement(selector);
      return true;
    } catch (error) {
      throw new Error(`Field "${selector}" does not exist or is not found.`);
    }
  }

  /**
   * Checks whether an element is visible.
   * @param selector Element selector.
   * @returns True when the element is visible.
   */
  async checkIfFieldIsDisplayed(selector: string): Promise<boolean> {
    try {
      return await this._page.locator(selector).isVisible();
    } catch (error) {
      throw new Error(`The element "${selector}" is not visible.`);
    }
  }

  /**
   * Checks whether a checkbox or selectable element is selected.
   * @param selector Element selector.
   * @returns True when the element is checked.
   */
  async checkIfFieldIsSelected(selector: string): Promise<boolean> {
    try {
      let element = await this.waitForElement(selector);
      return await element.isChecked();
    } catch (error) {
      throw new Error(`The element "${selector}" is not visible.`);
    }
  }

  /**
   * Reads an attribute from an element.
   * @param selector Element selector.
   * @param attribute Attribute name.
   * @returns The attribute value, or null when it is absent.
   */
  async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    let element = await this.waitForElement(selector);
    return await element.getAttribute(attribute);
  }

  /**
   * Checks whether an element is enabled.
   * @param selector Element selector.
   * @returns True when the element is enabled.
   */
  async checkIfFieldIsEnabled(selector: string): Promise<boolean> {
    let element = await this.waitForElement(selector);
    return await element.isEnabled();
  }

  /**
   * Navigates to a URL and waits until that URL is reached.
   * @param url Destination URL.
   */
  async loadPage(url: string): Promise<void> {
    await this._page.goto(url);
    await this._page.waitForURL(url);
  }

  /**
   * Selects an option from a native select element.
   * @param selector Select element selector.
   * @param option Visible option label.
   */
  async fillSelect(selector: string, option: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click();
    await element.selectOption({ label: option });
  }

  /**
   * Returns the selected value from a select element.
   * @param selector Select element selector.
   * @returns The selected option value.
   */
  async getSelectedOption(selector: string): Promise<string> {
    let element = await this.waitForElement(selector);
    let property = await element.getProperty('value');
    let selected = await property.jsonValue();
    return selected as string;
  }

  /**
   * Clears the current value of an input element.
   * @param selector Input selector.
   */
  async clearInput(selector: string): Promise<void> {
    let inputElement = await this.waitForElement(selector);
    if (inputElement) {
      await inputElement.click({ clickCount: 3 });
      await this._page.keyboard.press('Backspace');
    }
  }

  /**
   * Types text into an element.
   * @param selector Element selector.
   * @param key Text to type.
   */
  async sendKeys(selector: string, key: string): Promise<void> {
    let element = await this.waitForElement(selector);
    await element.type(key);
  }

  /**
   * Closes the last page in the current browser context when more than one exists.
   */
  async closeLastTab(): Promise<void> {
    let pages = await this.context.pages();
    if (pages.length > 1) {
      let lastPage = pages[pages.length - 1];
      await lastPage.close();
    }
  }

  /**
   * Writes a message to the test output.
   * @param log Message to write.
   */
  async writeLog(log: string): Promise<void> {
    console.log(`\n${log}`);
  }

  /**
   * Clicks the first available element matching a selector.
   * @param selector Element selector.
   */
  async clickDisplayedElement(selector: string): Promise<void> {
    let elements = await this.getElements(selector);
    let clicked = false;
    elements.forEach(element => {
      try {
        element.click();
        clicked = true;
      } catch (error) { }
    });
    expect(clicked, "None of the element were clickable").toBe(true)
  }

  /**
   * Accepts the first browser dialog displayed within the timeout.
   * @param timeout Maximum wait time in milliseconds.
   */
  async acceptAlert(timeout = 5000): Promise<void> {
    try {
      let dialog = await this._page.waitForEvent('dialog', { timeout });
      await dialog.accept();
    } catch (error) {
      console.warn(`No alert found within ${timeout} ms.`);
    }
  }

  /**
   * Brings a page in the browser context to the foreground.
   * @param tabNumber One-based page number.
   */
  async changeFocusToTab(tabNumber: number): Promise<void> {
    try {
      await this.context.pages()[tabNumber - 1].bringToFront();
    } catch (error) {
      throw new Error(`The number "${tabNumber}" cannot be found.`);
    }
  }

  /**
   * Navigates to the previous page in browser history.
   */
  async goBack(): Promise<void> {
    await this._page.goBack();
  }

  /**
   * Removes all cookies from the current browser context.
   */
  async deleteAllCookies(): Promise<void> {
    await this._page.context().clearCookies();
  }

  /**
   * Reloads the current page.
   */
  async reload(): Promise<void> {
    await this._page.reload();
  }

  /**
   * Return the local storage
   * @param localStorageName Name of the variable storaged in the local storage
   * @returns The loca storage
   */
  async getLocalStorage(localStorageName: string): Promise<string> {
    return await this._page.evaluate(`localStorage.getItem('${localStorageName}')`);
  }

  /**
   * Sets the page viewport to a desktop-sized resolution.
   */
  async maximizeWindow(): Promise<void> {
    await this._page.setViewportSize({ width: 1920, height: 1080 });
  }

  /**
   * Uploads a file through a file input.
   * @param selector File input selector.
   * @param file File path.
   */
  async uploadFile(selector: string, file: string): Promise<void> {
    let filePath = file;
    let element: ElementHandle<Element> = await this.waitForElement(selector);
    await element.setInputFiles(filePath);
  }

  /**
   * Uploads a file through an input that is intentionally hidden by Kendo Upload.
   * @param selector Hidden file input selector.
   * @param file File path.
   */
  async uploadFileFromHiddenInput(selector: string, file: string): Promise<void> {
    const fileInput = this._page.locator(selector);
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(file);
  }

  /**
   * Checks the configured wording entries against the current page.
   * @param pathToJSON Path to the wording JSON file.
   * @param root Optional wording root.
   * @param errorMessage Assertion message when wording is missing.
   */
  checkWording(pathToJSON: string, root: string | null, errorMessage: string): void {
    try {
      let jFile: any = require(pathToJSON);
      this._HtmlElements.forEach(tag => {
        this.checker(jFile[tag], tag, errorMessage)
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Focuses an element.
   * @param selector Element selector.
   */
  async setFocus(selector: string): Promise<void> {
    let element = await this.waitForElement(selector);
    await element.focus();
  }

  /**
   * Moves the keyboard focus upward within an element.
   * @param selector Element selector.
   */
  async scrollUpElement(selector: string): Promise<void> {
    await this.setFocus(selector);
    await this._page.keyboard.press('PageUp');
  }

  /**
   * Moves the keyboard focus downward within an element.
   * @param selector Element selector.
   */
  async scrollDownElement(selector: string): Promise<void> {
    await this.setFocus(selector);
    await this._page.keyboard.press('PageDown');
  }

  /**
   * Opens a new page in the current browser context.
   * @returns The newly opened Playwright page.
   */
  async openNewTab(): Promise<Page> {
    this._page = await this.context.newPage();
    return this._page; // return the page
  }

  /**
   * Adds a cookie to the browser context.
   * @param key Cookie name.
   * @param value Cookie value.
   * @param url Cookie domain.
   */
  async setCookie(key: string, value: string, url: string): Promise<void> {
    try {
      await this.context.addCookies([{ name: key, value: value, domain: url, path: '/' }]);
    } catch (error) {
      throw new Error(`Could not set the cookie "${key}".`);
    }
  }

  /**
   * Get cookie value
   * @param selector Cookie's name
   * @returns Cookie's value
  /**
   * Returns the value of a cookie.
   * @param selector Cookie name.
   * @returns The cookie value.
   */
  async getCookie(selector: string): Promise<string> {
    try {
      // await this.waitForElement(selector);
      let cookies = await this._page.context().cookies();
      let cookie = cookies.find((c) => c.name === selector);
      if (cookie) {
        return cookie.value;
      } else {
        throw new Error(`Could not retrieve cookie with selector: "${selector}".`);
      }
    } catch (error) {
      throw new Error(`Could not retrieve cookie with selector: "${selector}".`);
    }
  }

  /**
   * Replaces attribute placeholders in a selector string.
   * @param attributes Replacement pairs in `from|to` format.
   * @param selector Selector containing the placeholders.
   * @returns The selector after replacements.
   */
  async replaceXpath(attributes: string[], selector: string): Promise<string> {
    let ret = selector;
    for (let attributeValue of attributes) {
      let attributeValueSplitted = attributeValue.split('|');
      ret = ret.replace(attributeValueSplitted[0], attributeValueSplitted[1]);
    }
    return ret;
  }

  /**
   * Verifies the wording entries for a specific HTML tag.
   * @param jToken Wording entries to verify.
   * @param tag HTML tag used in the generated XPath.
   * @param errorMessage Assertion message when wording is missing.
   */
  async checker(jToken: any[], tag: string, errorMessage: string): Promise<void> {
    if (jToken) {
      for (let i = 0; i < jToken.length - 1; i++) {
        let element = `//${tag}[contains(text(), '${jToken[i]}')]`;
        let isDisplayed = await this.checkIfFieldIsDisplayed(element);
        expect(isDisplayed, errorMessage).toBe(true);
      }
    }
  }

  /**
   * Returns all elements matching a selector.
   * @param selector Element selector.
   * @returns Matching element handles.
   */
  async getElements(selector: string): Promise<ReadonlyArray<ElementHandle>> {
    let elements = await this._page.$$(selector);
    if (!elements || elements.length === 0) {
      throw new Error(`Cannot find any element with selector '${selector}'`);
    }
    return elements;
  }

  /**
   * Closes the current browser context when a test explicitly owns that lifecycle action.
   */
  async closeContext(): Promise<void> {
    await this.context.close();
  }

  /**
   * Closes the current page when the tested workflow explicitly requires it.
   */
  async closePage(): Promise<void> {
    await this._page.close();
  }

  /**
   * Returns the path of the video recorded by Playwright for the current page.
   * @returns Recorded video path.
   */
  async getVideoPath(): Promise<string> {
    const video = this._page.video();
    if (!video) {
      throw new Error('Video recording is not enabled for the current page.');
    }
    return video.path();
  }

  /**
   * Saves the Playwright video for the current page to a new path.
   * @param videoPath Destination path.
   */
  async saveVideoAs(videoPath: string): Promise<void> {
    const video = this._page.video();
    if (!video) {
      throw new Error('Video recording is not enabled for the current page.');
    }
    await video.saveAs(videoPath);
  }

  /**
   * Deletes a file when it exists.
   * @param filePath File path.
   */
  deleteFile(filePath: string): void {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  /**
   * Waits for the application header shown after a successful login.
   */
  async waitForAccessConfirmation(): Promise<void> {
    await this.waitForSelectorStatus('#headerTile', 'visible');
  }

  /**
   * Waits for the application header shown after a successful login.
   */
  async waitForAccessConfirmationGA(): Promise<void> {
    await this.waitForSelectorStatus("//span[contains(text(), 'Welcome')]", 'visible');
  }
}
