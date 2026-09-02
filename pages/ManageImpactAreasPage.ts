import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ManageImpactAreasPage extends BasePage {
    private readonly impactAreaCleanupTimeout = 30000;
    private impactAreaRows = '[role="grid"][aria-label="Data table"] tbody tr.k-master-row';
    private impactAreaNoRecordsRow = '[role="grid"][aria-label="Data table"] tbody tr.k-grid-norecords';
    private impactAreaNameCellSelector = 'td[data-kendo-grid-column-index="1"]';
    private impactAreaNameCells = `${this.impactAreaRows} ${this.impactAreaNameCellSelector}`;
    private noRecordsMessage = '[role="grid"][aria-label="Data table"] tbody tr.k-grid-norecords p';
    private impactAreaNameFilterInput = 'input[aria-label="Impact Area Name Filter"]';
    private impactAreaNameInput = '#impact-area-name input.k-input-inner';
    private saveButton = 'button:has(.k-button-text:has-text("Save"))';
    private impactAreaUpdatedToast = '.k-notification-content:has-text("Impact Area updated successfully")';

    private impactAreaNameCell(impactAreaName: string) {
        return this._page.locator(this.impactAreaNameCells).filter({
            hasText: new RegExp(`^\\s*${this.escapeRegularExpression(impactAreaName)}\\s*$`),
        });
    }

    private impactAreaRowByName(impactAreaName: string) {
        return this._page.locator(this.impactAreaRows).filter({
            has: this._page.locator(this.impactAreaNameCellSelector).filter({
                hasText: new RegExp(`^\\s*${this.escapeRegularExpression(impactAreaName)}\\s*$`),
            }),
        });
    }

    private impactAreaEditButton(impactAreaName: string) {
        return this.impactAreaRowByName(impactAreaName).locator('button[title="Edit Impact Area"]');
    }

    /**
     * Escapes an Impact Area Name for use as a literal regular-expression value.
     * @param value Text to escape.
     */
    private escapeRegularExpression(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Opens the editor for the requested impact area.
     * @param impactAreaName Exact name of the impact area to edit.
     */
    async editImpactArea(impactAreaName: string): Promise<void> {
        await this.ensureKendoGridHasRows(
            '[role="grid"][aria-label="Data table"]',
            `Manage Impact Areas must contain an impact area before "${impactAreaName}" can be edited.`,
            'The Manage Impact Areas grid was displayed before searching for the requested impact area.',
        );
        await expect(this.impactAreaRowByName(impactAreaName)).toBeVisible();
        await this.ensureExpectedBusinessElementIsVisible(
            this.impactAreaEditButton(impactAreaName),
            `The impact area "${impactAreaName}" must provide the Edit Impact Area action.`,
            `The Edit Impact Area button is displayed for "${impactAreaName}".`,
            `The impact area row "${impactAreaName}" is visible in the Manage Impact Areas grid.`,
        );
        await this.clickLocator(this.impactAreaEditButton(impactAreaName));
    }

    /**
     * Replaces the Impact Area Name with the requested value.
     * @param impactAreaName Name to enter for the impact area.
     */
    async setImpactAreaName(impactAreaName: string): Promise<void> {
        await this.waitForElement(this.impactAreaNameInput, 15000);
        await this.fillInputText(this.impactAreaNameInput, '');
        await this.waitImplicit(10000);
        await this.fillInputText(this.impactAreaNameInput, impactAreaName);
        await this.waitImplicit(10000);
    }

    /**
     * Restores an impact area's canonical name when a prior interrupted run left it with its updated name.
     * @param impactAreaName Canonical name required by the scenario.
     * @param updatedImpactAreaName Name that a prior run may have persisted.
     */
    async restoreImpactAreaNameIfNeeded(impactAreaName: string, updatedImpactAreaName: string): Promise<void> {
        if (await this.filterAndCheckImpactArea(impactAreaName)) {
            return;
        }

        if (!await this.filterAndCheckImpactArea(updatedImpactAreaName)) {
            throw new Error(
                `Neither impact area "${impactAreaName}" nor "${updatedImpactAreaName}" was found.`
            );
        }

        await this.editImpactArea(updatedImpactAreaName);
        await this.setImpactAreaName(impactAreaName);
        await this.clickElement(this.saveButton);
        await expect(this._page.locator(this.impactAreaUpdatedToast)).toBeVisible();

        if (!await this.filterAndCheckImpactArea(impactAreaName)) {
            throw new Error(`Impact area "${impactAreaName}" was not restored.`);
        }
    }

    /**
     * Verifies that the Impact Area Name input retains the requested value.
     * @param impactAreaName Expected Impact Area Name value.
     */
    async verifyImpactAreaNameValue(impactAreaName: string): Promise<void> {
        await expect(this._page.locator(this.impactAreaNameInput)).toHaveValue(impactAreaName);
    }

    /**
     * Verifies that the requested impact area is displayed in the grid.
     * @param impactAreaName Exact Impact Area Name expected in the grid.
     */
    async verifyImpactAreaDisplayed(impactAreaName: string): Promise<void> {
        await expect(this.impactAreaNameCell(impactAreaName)).toBeVisible();
    }

    /**
     * Verifies that the Manage Impact Areas grid displays at least one impact area.
     */
    async verifyExistingImpactAreasDisplayed(): Promise<void> {
        await expect(this._page.locator(this.impactAreaRows).first()).toBeVisible();
    }

    /**
     * Verifies that every visible impact area name contains the requested filter value.
     * @param impactAreaName Text expected in every displayed impact area name.
     */
    async verifyEveryImpactAreaContains(impactAreaName: string): Promise<void> {
        const impactAreaNameCells = this._page.locator(this.impactAreaNameCells);

        const doAllImpactAreasContainFilter = async (): Promise<boolean> => {
            const displayedImpactAreas = (await impactAreaNameCells.allTextContents())
                .map(displayedImpactArea => displayedImpactArea.trim());

            return displayedImpactAreas.length > 0
                && displayedImpactAreas.every(displayedImpactArea => displayedImpactArea.includes(impactAreaName));
        };

        try {
            await expect.poll(doAllImpactAreasContainFilter).toBe(true);
        } catch {
            const displayedImpactAreas = (await impactAreaNameCells.allTextContents())
                .map(displayedImpactArea => displayedImpactArea.trim());

            this.failWithApplicationError(
                'Every displayed Impact Area Name must contain the applied filter value.',
                `Every value contains "${impactAreaName}".`,
                `[${displayedImpactAreas.join(' | ')}]`,
                `The Impact Area Name filter is "${impactAreaName}".`,
            );
        }
    }

    /**
     * Verifies that the Manage Impact Areas grid has no data rows and displays its empty-state message.
     * @param message Expected empty-state message.
     */
    async verifyNoImpactAreasMessage(message: string): Promise<void> {
        await this.assertText(this.noRecordsMessage, message);
        await expect(this._page.locator(this.impactAreaRows)).toHaveCount(0);
    }

    private async filterAndCheckImpactArea(impactAreaName: string): Promise<boolean> {
        const impactAreaRows = this._page.locator(this.impactAreaRows);
        const noRecordsRow = this._page.locator(this.impactAreaNoRecordsRow);

        await expect.poll(async () =>
            ((await impactAreaRows.count()) > 0 && await impactAreaRows.first().isVisible()) ||
            ((await noRecordsRow.count()) > 0 && await noRecordsRow.first().isVisible()),
        { timeout: this.impactAreaCleanupTimeout }).toBe(true);

        await this.clearInput(this.impactAreaNameFilterInput);
        await this.fillInputText(this.impactAreaNameFilterInput, impactAreaName);

        const impactArea = this.impactAreaNameCell(impactAreaName);
        await expect.poll(async () =>
            (await impactArea.count()) > 0 ||
            ((await noRecordsRow.count()) > 0 && await noRecordsRow.first().isVisible()),
        { timeout: this.impactAreaCleanupTimeout }).toBe(true);

        return await impactArea.count() > 0;
    }

}