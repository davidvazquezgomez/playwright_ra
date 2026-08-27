import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AnalyticsDashboardPage extends BasePage {
    private readonly chartPanelByTitle = (chartTitle: string) =>
        this._page.locator('.stats-panel').filter({
            has: this._page.locator('.donut-header').getByText(chartTitle, { exact: true }),
        });
    private readonly chartItemsByTitle = (chartTitle: string) =>
        this.chartPanelByTitle(chartTitle).locator('.stats-list .stat-item');
    private readonly worldMapByTitle = (mapTitle: string) =>
        this._page.locator('app-world-map').filter({ hasText: mapTitle });
    private readonly dataTableSectionByTitle = (chartTitle: string) =>
        this._page.locator('div.mt-4.ps-3').filter({
            has: this._page.locator('h5').getByText(chartTitle, { exact: true }),
        });
    private readonly dataTablePagerInfoByTitle = (chartTitle: string) =>
        this.dataTableSectionByTitle(chartTitle).locator('app-table .k-pager-info');
    private readonly dataTablePagerPageByTitle = (tableTitle: string, pageNumber: string) =>
        this.dataTableSectionByTitle(tableTitle).getByRole('button', { name: `Page ${pageNumber}`, exact: true });
    private readonly visibleDataTablePagerInfo = this._page.locator('app-table .k-pager-info:visible');
    private readonly firstFilteredUpdateCellByTableTitle = (tableTitle: string) =>
        this.dataTableSectionByTitle(tableTitle)
            .locator('tbody tr.k-master-row')
            .first()
            .locator('td[aria-colindex="1"]');
    private readonly updateSearchInput = 'input[placeholder="Select or type update title"][role="combobox"]';
    private readonly mapControlByTitle = (controlTitle: string) =>
        `app-world-map .zoom-controls button[title="${controlTitle}"]`;

    /**
     * Verifies that an Analytics Dashboard visualization is visible.
     * @param chartTitle Visible title of the visualization to verify.
     */
    async verifyChartIsDisplayed(chartTitle: string): Promise<void> {
        const chartPanel = this.chartPanelByTitle(chartTitle);
        const worldMap = this.worldMapByTitle(chartTitle);
        const dataTableSection = this.dataTableSectionByTitle(chartTitle);
        const visualization = chartTitle.endsWith(' Map')
            ? worldMap
            : chartPanel.or(dataTableSection);

        await expect(visualization).toBeVisible();
    }

    /**
     * Gets the total number of items displayed by an Analytics Dashboard data table.
     * @param tableTitle Visible title of the data table.
     * @returns Total item count reported by the table pager.
     */
    async getDataTableItemCount(tableTitle: string): Promise<number> {
        return this.getKendoPagerItemCount(this.dataTablePagerInfoByTitle(tableTitle));
    }

    /**
     * Verifies that an Analytics Dashboard data table reports the expected total item count.
     * @param tableTitle Visible title of the data table.
     * @param expectedItemCount Total item count expected in the table pager.
     */
    async verifyDataTableItemCount(tableTitle: string, expectedItemCount: number): Promise<void> {
        const actualItemCount = await this.getDataTableItemCount(tableTitle);
        if (actualItemCount !== expectedItemCount) {
            this.failWithApplicationError(
                `The "${tableTitle}" data table must report the expected total item count.`,
                String(expectedItemCount),
                String(actualItemCount),
                'The data table pager was displayed and read successfully.',
            );
        }
    }

    /**
     * Navigates an Analytics Dashboard data table to the requested pager page.
     * @param pageNumber Numeric page to open.
     * @param tableTitle Visible title of the data table.
     */
    async navigateDataTableToPage(pageNumber: string, tableTitle: string): Promise<void> {
        const pagerPage = this.dataTablePagerPageByTitle(tableTitle, pageNumber);
        await expect(pagerPage).toBeVisible();

        if (await pagerPage.getAttribute('aria-current') !== 'page') {
            await pagerPage.click();
        }

        await expect(pagerPage).toHaveAttribute('aria-current', 'page');
    }

    /**
     * Verifies the first visible result number in the Analytics Dashboard data table.
     * @param expectedFirstItemNumber Expected first item number reported by the visible table pager.
     */
    async verifyVisibleDataTableFirstItemNumber(expectedFirstItemNumber: string): Promise<void> {
        await expect(this.visibleDataTablePagerInfo).toHaveCount(1);
        const firstItemNumber = await this.getKendoPagerFirstItemNumber(this.visibleDataTablePagerInfo);
        if (firstItemNumber !== Number(expectedFirstItemNumber)) {
            this.failWithApplicationError(
                'The visible Analytics data table pager must report the expected first item number.',
                expectedFirstItemNumber,
                String(firstItemNumber),
                'Exactly one visible data table pager was displayed and read successfully.',
            );
        }
    }

    /**
     * Searches the Analytics Dashboard by update title.
     * @param updateTitle Exact update title to search for.
     */
    async searchForUpdate(updateTitle: string): Promise<void> {
        await this.fillInputText(this.updateSearchInput, updateTitle);
        await this.pressKeyOnElement(this.updateSearchInput, 'Enter');
    }

    /**
     * Opens the first visible update result in a filtered Analytics Dashboard table.
     * @param tableTitle Visible title of the filtered data table.
     */
    async openFirstFilteredUpdateResult(tableTitle: string): Promise<void> {
        const dataTable = this.dataTableSectionByTitle(tableTitle).locator('app-table');
        const dataRows = dataTable.locator('tbody tr.k-master-row');
        console.log(`Analytics table "${tableTitle}" rows before waiting: ${await dataRows.count()}`);
        await this.ensureKendoGridHasRows(
            dataTable,
            `The "${tableTitle}" Analytics data table must contain an update before its first result can be opened.`,
            `The "${tableTitle}" Analytics data table was displayed before attempting to open its first result.`,
        );
        const updateCell = this.firstFilteredUpdateCellByTableTitle(tableTitle);
        console.log(`Analytics table "${tableTitle}" first row: ${(await dataRows.first().innerText()).trim()}`);
        await expect(updateCell).toBeVisible();
        await updateCell.click();
    }

    /**
     * Presses a control displayed on an Analytics Dashboard map.
     * @param controlTitle Title attribute of the map control to press.
     */
    async pressMapControl(controlTitle: string): Promise<void> {
        await this.clickElement(this.mapControlByTitle(controlTitle));
    }

    /**
     * Verifies that an Analytics Dashboard map control is displayed.
     * @param controlTitle Title attribute expected on the map control.
     */
    async verifyMapControlIsDisplayed(controlTitle: string): Promise<void> {
        await expect(this._page.locator(this.mapControlByTitle(controlTitle))).toBeVisible();
    }

    /**
     * Verifies that an Analytics Dashboard chart contains every requested labelled element.
     * @param chartTitle Visible title of the chart to verify.
     * @param elements Semicolon-delimited labels expected in the chart.
     */
    async verifyChartContainsElements(chartTitle: string, elements: string): Promise<void> {
        const chartPanel = this.chartPanelByTitle(chartTitle);
        const expectedElements = elements.split(';').map((element) => element.trim()).filter(Boolean);

        if (expectedElements.length === 0) {
            throw new Error('At least one chart element must be provided.');
        }

        await expect(chartPanel).toBeVisible();

        for (const element of expectedElements) {
            await expect(chartPanel.locator('.stats-list .stat-label').getByText(element, { exact: true })).toBeVisible();
        }
    }

    /**
     * Gets every labelled numeric value displayed in an Analytics Dashboard chart.
     * @param chartTitle Visible title of the chart to read.
     * @returns Values keyed by their displayed labels.
     */
    async getChartValues(chartTitle: string): Promise<Record<string, number>> {
        const chartPanel = this.chartPanelByTitle(chartTitle);
        const chartItems = this.chartItemsByTitle(chartTitle);
        await expect(chartPanel).toBeVisible();
        await expect(chartItems).not.toHaveCount(0);

        const chartValues = await chartItems.evaluateAll((items) =>
            items.map((item) => {
                const label = item.querySelector('.stat-label')?.textContent?.trim();
                const value = item.querySelector('.stat-value')?.textContent?.trim();

                if (!label || !value || !/^\d+(?:\.\d+)?$/.test(value)) {
                    throw new Error('Chart item must contain a label and numeric value.');
                }

                return [label, Number(value)] as const;
            }),
        );

        if (chartValues.length === 0) {
            throw new Error(`Chart "${chartTitle}" does not contain any values.`);
        }

        return Object.fromEntries(chartValues);
    }

    /**
     * Verifies whether an Analytics Dashboard chart contains expected labelled values.
     * @param chartTitle Visible title of the chart to verify.
     * @param expectedValues Previously saved values keyed by displayed label.
     * @param shouldMatch Whether the current values must equal the saved values.
     */
    async verifyChartValues(
        chartTitle: string,
        expectedValues: Record<string, number>,
        shouldMatch: boolean,
    ): Promise<void> {
        const currentValues = await this.getChartValues(chartTitle);
        const valuesMatch = JSON.stringify(currentValues) === JSON.stringify(expectedValues);

        if (valuesMatch !== shouldMatch) {
            this.failWithApplicationError(
                `Chart "${chartTitle}" values must ${shouldMatch ? 'match' : 'differ from'} the saved values.`,
                shouldMatch ? JSON.stringify(expectedValues) : 'A value set different from the saved values.',
                JSON.stringify(currentValues),
                `Saved values: ${JSON.stringify(expectedValues)}.`,
            );
        }
    }
}