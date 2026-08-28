import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    private readonly dashboardFilterButton = 'button[title="Filter"]';
    private readonly updateSearchInput =
        'input[placeholder="Select or type update title"][role="combobox"]';
    private readonly updateSearchClearButton =
        'kendo-autocomplete:has(input[placeholder="Select or type update title"]) .k-clear-value[title="clear"]';
    private readonly dashboardOptionsButton =
        'button[data-title="Dashboard options"], button[title="Dashboard Options"], button[aria-label="Dashboard Options"], button:has(.k-i-more-horizontal), button:has(.fa-ellipsis-v), button:has(.fa-ellipsis-h), button:has(kendo-svgicon.k-svg-i-more-horizontal)';
    private readonly dashboardOptionsDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Dashboard Options"))';
    private readonly dashboardOptionsActionsTab = () =>
        this._page.locator(this.dashboardOptionsDialog).getByRole('tab', { name: 'Actions Dashboard', exact: true });
    private readonly dashboardOptionsColumnByName = (columnName: string) =>
        this._page.locator(this.dashboardOptionsDialog).getByRole('listitem').filter({
            hasText: new RegExp(`^\\s*${this.escapeRegularExpression(columnName)}\\s*$`, 'i'),
        });
    private readonly dashboardOptionsSaveButton = () =>
        this._page.locator(this.dashboardOptionsDialog).getByRole('button', { name: 'Save', exact: true });
    private readonly popupOptionButtonByName = (popupName: string, optionName: string) =>
        `div[role="dialog"]:has(.k-dialog-title:text-is("${popupName}")) button[aria-label="${optionName}"]`;
    private readonly filterDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Filter"))';
    private readonly nameFilterDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Name Filter"))';
    private readonly confirmDeleteDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Confirm Delete"))';
    private readonly nameFilterErrorMessageByText = (errorMessage: string) =>
        `${this.nameFilterDialog} .text-danger:has(.ng-star-inserted:text-is("${errorMessage}"))`;
    private readonly filterNameInput = `${this.nameFilterDialog} #FilterName input.k-input-inner`;
    private readonly filterToggleButtonByText = (buttonText: string) =>
        `${this.filterDialog} .filters-toggle-btn:text-is("${buttonText}")`;
    private readonly saveFilterButton = (dialogSelector: string) =>
        this._page.locator(dialogSelector).getByRole('button', { name: 'Save filter', exact: true });
    private readonly resetFiltersButton = `${this.filterDialog} button.reset`;
    private readonly clearAllFiltersButton = () =>
        this._page.getByRole('button', { name: 'Clear all filters', exact: true });
    private readonly viewResultsButton = () =>
        this._page.locator(this.filterDialog).getByRole('button', { name: 'View results', exact: true });
    private readonly filterOptionByName = (optionName: string) =>
        `${this.filterDialog} .saved-filter-name:text-is("${optionName}")`;
    private readonly activeFilterDialog = () =>
        this._page.getByRole('dialog').filter({
            has: this._page.locator('.k-dialog-title').getByText('Filter', { exact: true }),
        });
    private readonly closeFilterButton = () =>
        this.activeFilterDialog().getByRole('button', { name: 'Close', exact: true });
    private readonly closeFilterButtonByIcon = () =>
        this.activeFilterDialog().locator('button:has(kendo-svgicon.k-svg-i-x)');
    private readonly editDashboardFilterButton = () =>
        this._page.locator(this.filterDialog).getByRole('button', { name: 'Edit', exact: true });
    private readonly filterSectionByName = (sectionName: string) =>
        this._page.locator(this.filterDialog).getByRole('treeitem', {
            name: new RegExp(`^\\s*${this.sectionNamePattern(sectionName)}\\s*$`, 'i'),
        });
    private readonly filterOptionLabels = (sectionName: string) =>
        this.filterSectionByName(sectionName).locator('label.filter-option-label:has(input[type="checkbox"])');
    private readonly filterOptionLabelByValue = (sectionName: string, value: string) =>
        this.filterOptionLabels(sectionName)
            .filter({
                has: this._page.locator('.filter-option-text .name').getByText(
                    new RegExp(`^\\s*${this.escapeRegularExpression(value)}\\s*$`, 'i'),
                ),
            })
            .first();
    private readonly visibleDashboardFilters = () =>
        this._page.locator('.dashboard-filters-container:visible');
    private readonly dashboardCheckboxFilterSectionByName = (sectionName: string) =>
        this.visibleDashboardFilters().locator('kendo-panelbar-item').filter({
            has: this._page.locator('.filter-section-title', {
                hasText: new RegExp(`^\\s*${this.sectionNamePattern(sectionName)}\\s*$`, 'i'),
            }),
        }).first();
    private readonly dashboardCheckboxByValue = (sectionName: string, value: string) =>
        this.dashboardCheckboxFilterSectionByName(sectionName)
            .locator('label.filter-option-label')
            .filter({
                has: this._page.locator('.filter-option-text').getByText(
                    new RegExp(`^\\s*${this.escapeRegularExpression(value)}\\s*$`, 'i'),
                ),
            })
            .locator('input[type="checkbox"]')
            .first();
    private readonly selectableFilterOptionLabels = (sectionName: string) =>
        this.filterOptionLabels(sectionName).filter({ hasNotText: /^\s*Select All\s*$/ });
    private readonly selectAllOptionLabel = (sectionName: string) =>
        this.filterOptionLabels(sectionName).filter({ hasText: /^\s*Select All\s*$/ }).first();
    private readonly savedFilterByName = (filterName: string, sectionName: string) =>
        this.filterSectionByName(sectionName).locator('.saved-filter-name').getByText(filterName, { exact: true });
    private readonly savedFilterDeleteButtonByName = (filterName: string) =>
        this._page.locator(this.filterDialog).locator('.saved-filter-item', {
            has: this._page.locator('.saved-filter-name').getByText(filterName, { exact: true }),
        }).getByRole('button', { name: 'Delete filter', exact: true });
    private readonly savedFilterEditButtonByName = (filterName: string) =>
        this._page.locator(this.filterDialog).locator('.saved-filter-item', {
            has: this._page.locator('.saved-filter-name').getByText(filterName, { exact: true }),
        }).getByRole('button', { name: 'Edit filter', exact: true });
    private readonly confirmDeleteFilterButton = () =>
        this._page.locator(this.confirmDeleteDialog).getByRole('button', { name: 'Delete', exact: true });
    private readonly deadlineDatePicker = (calendarName: 'Start Date' | 'End Date') =>
        this.filterSectionByName('Deadline Range').locator(
            `kendo-datepicker[formcontrolname="${calendarName === 'Start Date' ? 'startDate' : 'endDate'}"]`,
        );
    private readonly actionsGrid = () => this._page.getByRole('grid', { name: 'Data table', exact: true });
    private selectedDeadlineStartDate?: Date;
    private selectedDeadlineEndDate?: Date;
    private jurisdictionSelectionBeforeActionStatus?: string[];
    private dashboardColumnExpectedToBeHidden?: string;

    /**
     * Clears the selected update from a dashboard search control.
     * @param isClearButtonOptional Whether the absence of the clear button is allowed.
     */
    async clearUpdateSearch(isClearButtonOptional: boolean = false): Promise<void> {
        const clearButton = this._page.locator(this.updateSearchClearButton);

        if (isClearButtonOptional && !await clearButton.isVisible()) {
            return;
        }

        await this.clickElement(this.updateSearchClearButton);
        await expect(this._page.locator(this.updateSearchInput)).toHaveValue('');
    }

    /**
     * Opens the Dashboard filter panel.
     */
    async openFilterPanel(): Promise<void> {
        await this.clickElement(this.dashboardFilterButton);
    }

    /**
     * Opens the Dashboard Options popup.
     */
    async openDashboardOptions(): Promise<void> {
        await this.clickElement(this.dashboardOptionsButton);
    }

    /**
     * Verifies that the Dashboard Options popup is displayed.
     */
    async verifyDashboardOptionsPopupIsDisplayed(): Promise<void> {
        await expect(this._page.locator(this.dashboardOptionsDialog)).toBeVisible();
    }

    /**
     * Verifies that the Actions Dashboard tab is selected in Dashboard Options.
     */
    async verifyDashboardOptionsActionsTabIsSelected(): Promise<void> {
        await expect(this.dashboardOptionsActionsTab()).toHaveAttribute('aria-selected', 'true');
    }

    /**
     * Verifies the Dashboard Options content heading.
     * @param heading Expected popup heading.
     */
    async verifyDashboardOptionsHeadingIsDisplayed(heading: string): Promise<void> {
        await expect(this._page.locator(this.dashboardOptionsDialog).getByText(heading, { exact: true })).toBeVisible();
    }

    /**
     * Verifies that requested Dashboard Options columns are displayed.
     * @param columns Semicolon-delimited column names.
     */
    async verifyDashboardOptionColumnsAreDisplayed(columns: string): Promise<void> {
        for (const columnName of this.parseSemicolonDelimitedValues(columns)) {
            await expect(this.dashboardOptionsColumnByName(columnName)).toBeVisible();
        }
    }

    /**
     * Verifies that requested Dashboard Options columns share the requested selected state.
     * @param columns Semicolon-delimited column names.
     * @param selected Expected checkbox state.
     */
    async verifyDashboardOptionColumnsSelected(columns: string, selected: boolean): Promise<void> {
        for (const columnName of this.parseSemicolonDelimitedValues(columns)) {
            await expect(this.dashboardOptionsColumnByName(columnName).locator('input[type="checkbox"]')).toBeChecked({ checked: selected });
        }
    }

    /**
     * Changes a Dashboard Options column to the requested selected state.
     * @param columnName Column label in the popup.
     * @param selected Expected checkbox state.
     */
    async setDashboardOptionColumnSelected(columnName: string, selected: boolean): Promise<void> {
        const checkbox = this.dashboardOptionsColumnByName(columnName).locator('input[type="checkbox"]');
        if (await checkbox.isChecked() !== selected) {
            await checkbox.setChecked(selected);
        }
        await expect(checkbox).toBeChecked({ checked: selected });
        this.dashboardColumnExpectedToBeHidden = selected ? undefined : columnName;
    }

    /**
     * Saves the selected Dashboard Options columns.
     */
    async saveDashboardOptions(): Promise<void> {
        await this.dashboardOptionsSaveButton().click();
        await expect(this._page.locator(this.dashboardOptionsDialog)).toBeHidden();
        if (this.dashboardColumnExpectedToBeHidden) {
            await expect(
                this.actionsGrid().getByRole('columnheader', { name: this.dashboardColumnExpectedToBeHidden, exact: true }),
            ).toHaveCount(0);
            this.dashboardColumnExpectedToBeHidden = undefined;
        }
    }

    /**
     * Verifies that the Dashboard Options popup is closed.
     */
    async verifyDashboardOptionsPopupIsClosed(): Promise<void> {
        await expect(this._page.locator(this.dashboardOptionsDialog)).toBeHidden();
    }

    /**
     * Verifies that the named Actions Dashboard column header is hidden.
     * @param columnName Column header expected to be absent.
     */
    async verifyActionsDashboardColumnIsNotDisplayed(columnName: string): Promise<void> {
        await expect(this.actionsGrid().getByRole('columnheader', { name: columnName, exact: true })).toHaveCount(0);
    }

    /**
     * Expands the additional filters in the Dashboard filter panel.
     */
    async showMoreFilters(): Promise<void> {
        await this.clickElement(this.filterToggleButtonByText('More Filters'));
    }

    /**
     * Collapses the additional filters in the Dashboard filter panel.
     */
    async showLessFilters(): Promise<void> {
        await this.clickElement(this.filterToggleButtonByText('Less Filters'));
    }

    /**
     * Opens the save-filter dialog from the Dashboard filter panel.
     */
    async saveFilter(): Promise<void> {
        const activeDialog = await this._page.locator(this.nameFilterDialog).isVisible()
            ? this.nameFilterDialog
            : this.filterDialog;
        await this.saveFilterButton(activeDialog).click();
    }

    /**
     * Verifies that the Name Filter dialog is displayed.
     */
    async verifyNameFilterModalIsDisplayed(): Promise<void> {
        await this.verifyElementIsDisplayed(this.nameFilterDialog);
    }

    /**
     * Verifies that the Name Filter dialog displays a validation error.
     * @param errorMessage Exact validation message to verify.
     */
    async verifyNameFilterErrorMessage(errorMessage: string): Promise<void> {
        await this.waitForElement(this.nameFilterDialog);

        try {
            await expect(this._page.locator(this.nameFilterErrorMessageByText(errorMessage))).toBeVisible();
        } catch {
            this.failWithApplicationError(
                'Saving a dashboard filter with invalid input must display its validation message.',
                `Validation message "${errorMessage}" is displayed in the Name Filter dialog.`,
                `Validation message "${errorMessage}" is not displayed in the Name Filter dialog.`,
                `Visible Name Filter dialog content: "${(await this._page.locator(this.nameFilterDialog).innerText()).trim()}".`,
            );
        }
    }

    /**
     * Enters a name for the filter being saved.
     * @param filterName Name to enter in the Name Filter dialog.
     */
    async fillFilterName(filterName: string): Promise<void> {
        await this.fillInputText(this.filterNameInput, filterName);
    }

    /**
     * Clears all selected filters in the Dashboard filter panel.
     */
    async resetFilters(): Promise<void> {
        await this.clickElement(this.resetFiltersButton);
    }

    /**
     * Clears applied Dashboard filters when the global clear action is available.
     */
    async clearAllFiltersIfAvailable(): Promise<void> {
        const clearAllFiltersButton = this.clearAllFiltersButton();
        if (await clearAllFiltersButton.isVisible()) {
            await clearAllFiltersButton.click();
        }
    }

    /**
     * Selects a saved option in the Dashboard filter panel by double-clicking it.
     * @param optionName Exact label of the saved filter option.
     */
    async doubleClickFilterOption(optionName: string): Promise<void> {
        await this._page.locator(this.filterOptionByName(optionName)).dblclick();
    }

    /**
     * Applies the selected options in the Dashboard filter panel.
     */
    async viewFilteredResults(): Promise<void> {
        await this.viewResultsButton().click();
        await this.waitForSelectorStatus(this.filterDialog, 'hidden');
    }

    /**
     * Closes the Dashboard filter panel.
     */
    async closeFilterPanel(): Promise<void> {
        const filterDialog = this.activeFilterDialog();
        const namedCloseButton = this.closeFilterButton();
        const filterCloseButton = (await namedCloseButton.isVisible())
            ? namedCloseButton
            : this.closeFilterButtonByIcon();

        await expect(filterCloseButton).toBeVisible();
        await filterCloseButton.click();
        await expect(filterDialog).toBeHidden();
    }

    /**
     * Opens saved-filter management from the Dashboard filter panel.
     */
    async editDashboardFilters(): Promise<void> {
        await this.editDashboardFilterButton().click();
    }

    /**
     * Opens edit mode for the requested saved filter.
     * @param filterName Exact saved-filter name to edit.
     */
    async editSavedFilter(filterName: string): Promise<void> {
        await this.savedFilterEditButtonByName(filterName).click();
    }

    /**
     * Deletes the requested saved filter from the Dashboard filter panel.
     * @param filterName Exact saved-filter name to delete.
     */
    async deleteSavedFilter(filterName: string): Promise<void> {
        await this.savedFilterDeleteButtonByName(filterName).click();
    }

    /**
     * Removes a saved filter when it is already present, leaving the Dashboard filter panel closed.
     * @param filterName Exact saved-filter name to remove.
     */
    async removeSavedFilterIfExists(filterName: string): Promise<void> {
        await this.openFilterPanel();
        await this.editDashboardFilters();

        const deleteButton = this.savedFilterDeleteButtonByName(filterName);
        if (await deleteButton.count() > 0) {
            await deleteButton.click();
            await expect(this._page.locator(this.confirmDeleteDialog)).toBeVisible();
            await this.confirmDeleteFilterButton().click();
            await expect(this._page.locator(this.confirmDeleteDialog)).toBeHidden();
            await expect(deleteButton).toHaveCount(0);
        }

        await this.closeFilterPanel();
    }

    /**
     * Expands a Dashboard filter section and selects one of its options.
     * @param optionName Visible name of the option to select.
     * @param sectionName Visible name of the filter section that contains the option.
     */
    async selectFilterOption(optionName: string, sectionName: string): Promise<void> {
        await this.setFilterValueSelected(optionName, sectionName, true);
    }

    /**
     * Selects a checkbox option within a Dashboard filter section.
     * @param optionName Exact visible text of the checkbox option.
     * @param sectionName Exact visible name of the filter section.
     */
    async selectDashboardCheckboxFilterOption(optionName: string, sectionName: string): Promise<void> {
        await this.setDashboardCheckboxFilterOptionSelected(optionName, sectionName, true);
    }

    /**
     * Changes a checkbox option in a Dashboard filter section to the requested selected state.
     * @param optionName Exact visible text of the checkbox option.
     * @param sectionName Exact visible name of the filter section.
     * @param selected Expected checkbox state.
     */
    async setDashboardCheckboxFilterOptionSelected(
        optionName: string,
        sectionName: string,
        selected: boolean,
    ): Promise<void> {
        const filterSection = this.dashboardCheckboxFilterSectionByName(sectionName);
        await expect(filterSection).toBeVisible();

        if (await filterSection.getAttribute('aria-expanded') !== 'true') {
            await filterSection.locator(':scope > .k-link').click();
        }

        const optionCheckbox = this.dashboardCheckboxByValue(sectionName, optionName);
        await expect(
            optionCheckbox,
            `Expected checkbox option "${optionName}" to be available in the "${sectionName}" filter.`,
        ).toBeVisible({ timeout: 30_000 });

        if (await optionCheckbox.isChecked() !== selected) {
            await optionCheckbox.setChecked(selected);
        }

        await expect(optionCheckbox).toBeChecked({ checked: selected });
    }

    /**
     * Selects a saved filter from the requested Dashboard filter section.
     * @param filterName Exact saved-filter name to select.
     * @param sectionName Visible name of the filter section that contains the saved filter.
     */
    async selectSavedFilter(filterName: string, sectionName: string): Promise<void> {
        const filterSection = this.filterSectionByName(sectionName);
        await expect(filterSection).toBeVisible();

        if (await filterSection.getAttribute('aria-expanded') !== 'true') {
            await filterSection.click();
        }

        await this.savedFilterByName(filterName, sectionName).dblclick();
    }

    /**
     * Verifies that a saved filter is displayed in the requested filter section.
     * @param filterName Exact saved-filter name to verify.
     * @param sectionName Visible name of the filter section that contains the saved filter.
     */
    async verifySavedFilterIsDisplayed(filterName: string, sectionName: string): Promise<void> {
        const filterSection = this.filterSectionByName(sectionName);
        await expect(filterSection).toBeVisible();
        await expect(filterSection).toHaveAttribute('aria-expanded', 'true');
        await expect(
            this.savedFilterByName(filterName, sectionName),
            `Expected saved filter "${filterName}" to be displayed in section "${sectionName}".`,
        ).toBeVisible();
    }

    /**
     * Verifies that the requested sections are displayed in the Dashboard filter panel.
     * @param sections Semicolon-delimited names of the filter sections.
     */
    async verifyFilterSectionsAreDisplayed(sections: string): Promise<void> {
        const sectionNames = sections.split(';').map((section) => section.trim()).filter(Boolean);
        if (sectionNames.length === 0) {
            throw new Error('At least one filter section must be provided.');
        }

        const filterDialog = this._page.locator(this.filterDialog);
        await expect(filterDialog).toBeVisible();

        for (const sectionName of sectionNames) {
            await expect(
                filterDialog.locator('.filter-section-title').getByText(
                    new RegExp(`^\\s*${this.sectionNamePattern(sectionName)}\\s*$`, 'i'),
                ),
                `Expected filter section "${sectionName}" to be visible.`,
            ).toBeVisible();
        }
    }

    /**
     * Verifies that the requested sections are absent from the Dashboard filter panel.
     * @param sections Semicolon-delimited names of the filter sections.
     */
    async verifyFilterSectionsAreNotDisplayed(sections: string): Promise<void> {
        const sectionNames = sections.split(';').map((section) => section.trim()).filter(Boolean);
        if (sectionNames.length === 0) {
            throw new Error('At least one filter section must be provided.');
        }

        const filterDialog = this._page.locator(this.filterDialog);
        await expect(filterDialog).toBeVisible();

        for (const sectionName of sectionNames) {
            await expect(
                filterDialog.locator('.filter-section-title').getByText(
                    new RegExp(`^\\s*${this.sectionNamePattern(sectionName)}\\s*$`, 'i'),
                ),
                `Expected filter section "${sectionName}" not to be visible.`,
            ).not.toBeVisible();
        }
    }

    /**
     * Changes a Dashboard filter option to the requested selected state.
     * @param value Visible option value.
     * @param filterName Visible filter section name.
     * @param selected Expected selected state.
     */
    async setFilterValueSelected(value: string, filterName: string, selected: boolean): Promise<void> {
        const filterSection = this.filterSectionByName(filterName);
        await expect(filterSection).toBeVisible();
        if (await filterSection.getAttribute('aria-expanded') !== 'true') {
            await filterSection.locator(':scope > .k-link').click();
        }

        const optionLabel = this.filterOptionLabelByValue(filterName, value);
        const optionCheckbox = optionLabel.locator('input[type="checkbox"]');
        await expect(
            optionLabel,
            `Expected option "${value}" to be available in the "${filterName}" filter.`,
        ).toBeVisible({ timeout: 30_000 });
        if (await optionCheckbox.isChecked() !== selected) {
            await optionLabel.click();
        }
        await expect(optionCheckbox).toBeChecked({ checked: selected });
    }

    /**
     * Expands or collapses a Dashboard filter section.
     * @param sectionName Visible filter section name.
     * @param expanded Whether the section must be expanded.
     */
    async setFilterSectionExpanded(sectionName: string, expanded: boolean): Promise<void> {
        const filterSection = this.filterSectionByName(sectionName);
        await expect(filterSection).toBeVisible();
        if ((await filterSection.getAttribute('aria-expanded') === 'true') !== expanded) {
            await filterSection.locator(':scope > .k-link').click();
        }
        await expect(filterSection).toHaveAttribute('aria-expanded', String(expanded));
    }

    /**
     * Verifies the aggregate selection state in a Dashboard filter section.
     * @param sectionName Visible filter section name.
     * @param expectedState Expected unchecked, checked, or partially selected state.
     */
    async verifySelectAllState(sectionName: string, expectedState: 'unchecked' | 'checked' | 'partially selected'): Promise<void> {
        const selectedOptions = await this.getSelectedFilterOptionNames(sectionName);
        const optionCount = await this.selectableFilterOptionLabels(sectionName).count();
        if (optionCount === 0) {
            throw new Error(`No selectable options were found in the "${sectionName}" filter.`);
        }

        const stateMatches = expectedState === 'unchecked'
            ? selectedOptions.length === 0
            : expectedState === 'checked'
                ? selectedOptions.length === optionCount
                : selectedOptions.length > 0 && selectedOptions.length < optionCount;
        if (!stateMatches) {
            const expectedResult = expectedState === 'unchecked'
                ? 'No options selected.'
                : expectedState === 'checked'
                    ? `All ${optionCount} options selected.`
                    : `Between 1 and ${optionCount - 1} options selected.`;
            this.failWithApplicationError(
                `The "${sectionName}" filter Select All state must be "${expectedState}".`,
                expectedResult,
                `${selectedOptions.length} of ${optionCount} options selected: [${selectedOptions.join(' | ')}].`,
                'The filter options were displayed and their selected states were read successfully.',
            );
        }
    }

    /**
     * Toggles the Select All control in a Dashboard filter section.
     * @param sectionName Visible filter section name.
     */
    async toggleSelectAllOptions(sectionName: string): Promise<void> {
        if (sectionName === 'Action Status') {
            this.jurisdictionSelectionBeforeActionStatus = await this.getSelectedFilterOptionNames('Jurisdiction');
        }
        await this.setFilterSectionExpanded(sectionName, true);
        await this.selectAllOptionLabel(sectionName).click();
    }

    /**
     * Verifies whether all selectable options in a Dashboard filter section share a selected state.
     * @param sectionName Visible filter section name.
     * @param selected Expected selected state.
     */
    async verifyFilterOptionsSelected(sectionName: string, selected: boolean): Promise<void> {
        await this.setFilterSectionExpanded(sectionName, true);
        const optionLabels = this.selectableFilterOptionLabels(sectionName);
        const optionStates = await optionLabels.locator('input[type="checkbox"]').evaluateAll(
            (checkboxes: HTMLInputElement[]) => checkboxes.map((checkbox) => checkbox.checked),
        );
        if (optionStates.length === 0) {
            throw new Error(`No selectable options were found in the "${sectionName}" filter.`);
        }
        if (!optionStates.every((isChecked) => isChecked === selected)) {
            const selectedOptions = await this.getSelectedFilterOptionNames(sectionName);
            this.failWithApplicationError(
                `Every option in the "${sectionName}" filter must be ${selected ? 'selected' : 'unselected'}.`,
                selected ? `All ${optionStates.length} options selected.` : 'No options selected.',
                `${selectedOptions.length} of ${optionStates.length} options selected: [${selectedOptions.join(' | ')}].`,
                'The filter option checkbox states were read successfully.',
            );
        }
    }

    /**
     * Selects the requested number of unselected Dashboard filter options.
     * @param sectionName Visible filter section name.
     * @param optionCount Number of options to select.
     */
    async selectFirstUnselectedFilterOptions(sectionName: string, optionCount: number): Promise<void> {
        await this.setFilterSectionExpanded(sectionName, true);
        const optionLabels = this.selectableFilterOptionLabels(sectionName);
        const uncheckedIndexes = await optionLabels.locator('input[type="checkbox"]').evaluateAll(
            (checkboxes: HTMLInputElement[]) => checkboxes
                .map((checkbox, index) => checkbox.checked ? -1 : index)
                .filter((index) => index >= 0),
        );
        if (uncheckedIndexes.length < optionCount) {
            throw new Error(`Expected ${optionCount} unselected options in the "${sectionName}" filter.`);
        }
        for (const index of uncheckedIndexes.slice(0, optionCount)) {
            await optionLabels.nth(index).click();
        }
    }

    /**
     * Selects every currently unselected Dashboard filter option.
     * @param sectionName Visible filter section name.
     */
    async selectRemainingFilterOptions(sectionName: string): Promise<void> {
        await this.setFilterSectionExpanded(sectionName, true);
        const optionStates = await this.selectableFilterOptionLabels(sectionName)
            .locator('input[type="checkbox"]')
            .evaluateAll((checkboxes: HTMLInputElement[]) => checkboxes.map((checkbox) => checkbox.checked));
        if (optionStates.some((isChecked) => !isChecked)) {
            await this.selectAllOptionLabel(sectionName).click();
        }
    }

    /**
     * Deselects the first selected Dashboard filter option.
     * @param sectionName Visible filter section name.
     */
    async deselectFirstFilterOption(sectionName: string): Promise<void> {
        await this.setFilterSectionExpanded(sectionName, true);
        const optionLabels = this.selectableFilterOptionLabels(sectionName);
        const selectedIndex = await optionLabels.locator('input[type="checkbox"]').evaluateAll(
            (checkboxes: HTMLInputElement[]) => checkboxes.findIndex((checkbox) => checkbox.checked),
        );
        if (selectedIndex < 0) {
            throw new Error(`No selected options were found in the "${sectionName}" filter.`);
        }
        await optionLabels.nth(selectedIndex).click();
    }

    /**
     * Verifies that Jurisdiction selections were not changed when Action Status was selected.
     */
    async verifyJurisdictionSelectionUnchanged(): Promise<void> {
        if (!this.jurisdictionSelectionBeforeActionStatus) {
            throw new Error('No Jurisdiction selection was captured before selecting Action Status.');
        }
        const selectedJurisdictions = await this.getSelectedFilterOptionNames('Jurisdiction');
        if (JSON.stringify(selectedJurisdictions) !== JSON.stringify(this.jurisdictionSelectionBeforeActionStatus)) {
            this.failWithApplicationError(
                'Selecting Action Status must not change the selected Jurisdiction options.',
                `[${this.jurisdictionSelectionBeforeActionStatus.join(' | ')}]`,
                `[${selectedJurisdictions.join(' | ')}]`,
                'Jurisdiction selections were captured before selecting Action Status and read again afterwards.',
            );
        }
    }

    /**
     * Selects a Deadline Range date using its Kendo calendar.
     * @param calendarName Start or end date control.
     * @param dateValue Date in DD/MM/YYYY format.
     */
    async selectDeadlineDate(calendarName: 'Start Date' | 'End Date', dateValue: string): Promise<void> {
        const targetDate = this.parseDate(dateValue);
        const deadlineRangeSection = this.filterSectionByName('Deadline Range');
        await expect(deadlineRangeSection).toBeVisible();
        if (await deadlineRangeSection.getAttribute('aria-expanded') !== 'true') {
            await deadlineRangeSection.locator(':scope > .k-link').click();
        }
        await this.selectDateFromKendoDatePicker(this.deadlineDatePicker(calendarName), dateValue);
        if (calendarName === 'Start Date') {
            this.selectedDeadlineStartDate = targetDate;
        } else {
            this.selectedDeadlineEndDate = targetDate;
        }
    }

    /**
     * Selects a past or future Deadline Range date.
     * @param calendarName Start or end date control.
     * @param direction Whether the date must be in the past or future.
     */
    async selectRelativeDeadlineDate(calendarName: 'Start Date' | 'End Date', direction: 'past' | 'future'): Promise<void> {
        const date = new Date();
        date.setDate(date.getDate() + (direction === 'past' ? -7 : 7));
        await this.selectDeadlineDate(
            calendarName,
            `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
        );
    }

    /**
     * Verifies that the visible action rows match an optional selected filter value.
     * @param filterName Filter section name.
     * @param value Expected selected value.
     */
    async verifyFilteredActions(filterName?: string, value?: string): Promise<void> {
        const rows = this.actionsGrid().locator('tbody tr.k-master-row');
        await expect(rows.first()).toBeVisible();
        if (!filterName || !value) {
            return;
        }

        for (let index = 0; index < await rows.count(); index += 1) {
            const row = rows.nth(index);
            if (filterName === 'Jurisdiction') {
                await expect(row.locator(`img[src*="${value.toLowerCase()}"]`).or(row.getByText(value, { exact: true }))).toBeVisible();
            } else {
                const columnIndex = await this.getGridColumnIndex(filterName);
                await expect(
                    row.locator(`td[aria-colindex="${columnIndex}"]`),
                    `Expected ${filterName} to be "${value}" in row ${index + 1}.`,
                ).toContainText(new RegExp(this.escapeRegularExpression(value), 'i'));
            }
        }
    }

    /**
     * Verifies that every visible deadline is inside the selected inclusive range.
     */
    async verifyFilteredActionDeadlinesAreWithinSelectedRange(): Promise<void> {
        if (!this.selectedDeadlineStartDate || !this.selectedDeadlineEndDate) {
            throw new Error('Both Deadline Range dates must be selected before verification.');
        }
        const start = this.toUtcDate(this.selectedDeadlineStartDate);
        const end = this.toUtcDate(this.selectedDeadlineEndDate);
        const rows = this.actionsGrid().locator('tbody tr.k-master-row');
        await expect(rows.first()).toBeVisible();
        const deadlineViolations: string[] = [];

        for (let index = 0; index < await rows.count(); index += 1) {
            const deadlineText = (await rows.nth(index).locator('td[aria-colindex="4"]').textContent())?.trim() ?? '';
            const deadline = new Date(deadlineText);
            if (Number.isNaN(deadline.getTime())) {
                throw new Error(`Unable to parse deadline date "${deadlineText}".`);
            }
            const deadlineValue = this.toUtcDate(deadline);
            if (deadlineValue < start || deadlineValue > end) {
                deadlineViolations.push(`row ${index + 1}: ${deadlineText}`);
            }
        }

        if (deadlineViolations.length > 0) {
            this.failWithApplicationError(
                'Every displayed action deadline must be within the selected inclusive Deadline Range.',
                `${this.selectedDeadlineStartDate.toLocaleDateString('en-GB')} to ${this.selectedDeadlineEndDate.toLocaleDateString('en-GB')}.`,
                `[${deadlineViolations.join(' | ')}]`,
                'The displayed deadline values were parsed successfully before range comparison.',
            );
        }
    }

    /**
     * Appends text to the current saved-filter name.
     * @param text Text to append.
     */
    async appendToSavedFilterName(text: string): Promise<void> {
        const input = this._page.locator(this.filterNameInput);
        await expect(input).toBeVisible();
        await this.fillInputText(this.filterNameInput, `${await input.inputValue()}${text}`);
    }

    /**
     * Verifies that a named saved filter is absent from the requested section.
     * @param filterName Filter name expected not to be present.
     * @param sectionName Saved Filters section name.
     */
    async verifySavedFilterIsNotDisplayed(filterName: string, sectionName: string): Promise<void> {
        await expect(this.savedFilterByName(filterName, sectionName)).toHaveCount(0);
    }

    /**
     * Verifies that no filter options remain selected after Reset Filters.
     */
    async verifyFiltersAreReset(): Promise<void> {
        await expect(this._page.locator(`${this.filterDialog} label.filter-option-label input[type="checkbox"]:checked`)).toHaveCount(0);
    }

    private parseDate(dateValue: string): Date {
        const [dayText, monthText, yearText] = dateValue.split('/');
        const date = new Date(Number(yearText), Number(monthText) - 1, Number(dayText));
        if (!dayText || !monthText || !yearText || date.getDate() !== Number(dayText) || date.getMonth() !== Number(monthText) - 1) {
            throw new Error(`Date "${dateValue}" must use the DD/MM/YYYY format.`);
        }
        return date;
    }

    private toUtcDate(date: Date): number {
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    }

    private async getGridColumnIndex(columnName: string): Promise<string> {
        const columnHeaders = this.actionsGrid().getByRole('columnheader');
        const expectedColumnName = columnName.replace(/\s+/g, ' ').trim();
        const headerCount = await columnHeaders.count();
        for (let index = 0; index < headerCount; index += 1) {
            const columnHeader = columnHeaders.nth(index);
            const headerName = (await columnHeader.innerText()).replace(/\s+/g, ' ').trim();
            if (headerName.localeCompare(expectedColumnName, undefined, { sensitivity: 'accent' }) === 0) {
                return (await columnHeader.getAttribute('aria-colindex')) ?? String(index + 1);
            }
        }
        throw new Error(`The "${columnName}" column was not found.`);
    }

    private escapeRegularExpression(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private parseSemicolonDelimitedValues(values: string): string[] {
        const parsedValues = values.split(';').map((value) => value.trim()).filter(Boolean);
        if (parsedValues.length === 0) {
            throw new Error('At least one value must be provided.');
        }
        return parsedValues;
    }

    private sectionNamePattern(sectionName: string): string {
        return sectionName
            .trim()
            .split(/\s+/)
            .map((word) => this.escapeRegularExpression(word))
            .join('\\s+');
    }

    private async getSelectedFilterOptionNames(sectionName: string): Promise<string[]> {
        await this.setFilterSectionExpanded(sectionName, true);
        const optionLabels = this.selectableFilterOptionLabels(sectionName);
        return optionLabels.evaluateAll((labels: HTMLLabelElement[]) => labels.flatMap((label) => {
            const checkbox = label.querySelector<HTMLInputElement>('input[type="checkbox"]');
            return checkbox?.checked ? [label.textContent?.trim() ?? ''] : [];
        }));
    }

    /**
     * Clicks an option in a named Kendo popup.
     * @param buttonName Exact visible option name.
     * @param popupName Exact popup title that contains the option.
     */
    async clickButton(buttonName: string, popupName: string): Promise<void> {
        await this.clickElement(this.popupOptionButtonByName(popupName, buttonName));
    }
}