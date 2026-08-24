import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReleaseNotesPage extends BasePage {
    private readonly titleInput = 'kendo-textbox[formcontrolname="title"] input';
    private readonly releaseNotesDatePicker = 'kendo-datepicker[formcontrolname="releaseNotesDate"]';
    private readonly releaseNotesEditor = 'kendo-editor[formcontrolname="releaseNotes"] [contenteditable="true"]';
    private readonly releaseNoteTitleByText = (title: string) =>
        this._page.locator('.release-note-panel-title__text').filter({ hasText: title });
    private readonly releaseNoteItems = 'kendo-panelbar-item[role="treeitem"]';
    private readonly releaseNotesViewer = '.release-notes-viewer';
    private readonly releaseNotesViewerItems =
        `${this.releaseNotesViewer} kendo-panelbar-item[role="treeitem"]`;
    private readonly releaseNoteDates =
        `${this.releaseNotesViewer} .release-note-panel-title__date`;

    /**
     * Fills the title of the release note being created.
     * @param title Release note title.
     */
    async fillTitle(title: string): Promise<void> {
        await this.fillInputText(this.titleInput, title);
    }

    /**
     * Verifies that the release note title retains the expected value.
     * @param title Expected release note title.
     */
    async verifyTitleValue(title: string): Promise<void> {
        await expect(this._page.locator(this.titleInput), `Expected Release Title to retain the value "${title}".`).toHaveValue(title);
    }

    /**
     * Selects the current local date for the release note.
     */
    async selectTodaysDate(): Promise<void> {
        await this.selectTodayFromKendoDatePicker(this.releaseNotesDatePicker);
    }

    /**
     * Fills the rich-text content of the release note.
     * @param releaseNotes Release note details.
     */
    async fillReleaseNotes(releaseNotes: string): Promise<void> {
        await this.fillInputText(this.releaseNotesEditor, releaseNotes);
    }

    /**
     * Verifies that the newly created release note is listed with the current date.
     * @param title Created release note title.
     */
    async verifyCreatedReleaseNoteIsDisplayed(title: string): Promise<void> {
        const today = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date());
        const expectedTitle = `${title} - ${today}`;

        await expect(this.releaseNoteTitleByText(expectedTitle), `Expected created release note "${expectedTitle}" to be visible.`).toHaveText(expectedTitle);
    }

    /**
     * Verifies that every release note panel has the expected expansion state.
     * @param isExpanded Whether every release note panel should be expanded.
     */
    async verifyReleaseNotesExpansionState(isExpanded: boolean): Promise<void> {
        const releaseNoteItems = this._page.locator(this.releaseNoteItems);
        const itemCount = await releaseNoteItems.count();
        const expectedState = String(isExpanded);

        if (itemCount === 0) {
            throw new Error('No release notes are displayed.');
        }

        for (let index = 0; index < itemCount; index += 1) {
            await expect(releaseNoteItems.nth(index), `Expected release note ${index + 1} to have aria-expanded="${expectedState}".`).toHaveAttribute('aria-expanded', expectedState);
        }
    }

    /**
     * Verifies that the Release Notes viewer displays at least one release note.
     */
    async verifyReleaseNotesListIsDisplayed(): Promise<void> {
        await expect(this._page.locator(this.releaseNotesViewer)).toBeVisible();
        await expect(this._page.locator(this.releaseNotesViewerItems)).not.toHaveCount(0);
    }

    /**
     * Verifies that the displayed release notes follow the requested date order.
     * @param sortBy Release note property used for sorting.
     * @param sortDirection Expected sorting direction.
     */
    async verifyReleaseNotesAreSortedBy(sortBy: string, sortDirection: string): Promise<void> {
        if (sortBy !== 'Date' || sortDirection !== 'descending') {
            throw new Error(`Unsupported Release Notes sort: ${sortBy} in ${sortDirection} order.`);
        }

        const dateLabels = await this._page.locator(this.releaseNoteDates).allTextContents();
        const dates = dateLabels.map((dateLabel) => this.parseReleaseNoteDate(dateLabel));

        for (let index = 1; index < dates.length; index += 1) {
            if (dates[index] > dates[index - 1]) {
                this.failWithApplicationError(
                    'Release Notes must be sorted by Date in descending order.',
                    `[${[...dateLabels].sort((firstDate, secondDate) =>
                        this.parseReleaseNoteDate(secondDate) - this.parseReleaseNoteDate(firstDate),
                    ).map(dateLabel => dateLabel.trim()).join(' | ')}]`,
                    `[${dateLabels.map(dateLabel => dateLabel.trim()).join(' | ')}]`,
                    `"${dateLabels[index - 1].trim()}" appears before the newer date "${dateLabels[index].trim()}".`,
                );
            }
        }
    }

    /**
     * Verifies that the first release note displays the expected details.
     * @param details Expected release note details.
     */
    async verifyFirstReleaseNoteDetailsAreDisplayed(details: string): Promise<void> {
        const firstReleaseNoteDetails = this._page
            .locator(this.releaseNotesViewerItems)
            .first()
            .locator('.release-note-panel-content');

        await expect(firstReleaseNoteDetails).toBeVisible();
        await expect(firstReleaseNoteDetails).toContainText(details);
    }

    /**
     * Collapses the first release note in the Release Notes viewer.
     */
    async clickFirstReleaseNote(): Promise<void> {
        const firstReleaseNote = this._page.locator(this.releaseNotesViewerItems).first();

        await firstReleaseNote.locator('.k-link').click();
        await expect(firstReleaseNote).toHaveAttribute('aria-expanded', 'false');
    }

    /**
     * Verifies that the expected details of the first release note are hidden.
     * @param details Expected release note details.
     */
    async verifyFirstReleaseNoteDetailsAreNotDisplayed(details: string): Promise<void> {
        const firstReleaseNoteDetails = this._page
            .locator(this.releaseNotesViewerItems)
            .first()
            .locator('.release-note-panel-content')
            .filter({ hasText: details });

        await expect(firstReleaseNoteDetails).not.toBeVisible();
    }

    /**
     * Converts a Release Notes viewer date label into a comparable UTC timestamp.
     * @param dateLabel Rendered date label in the format "- dd MMM yyyy".
     */
    private parseReleaseNoteDate(dateLabel: string): number {
        const match = dateLabel.trim().match(/^-\s*(\d{2})\s+([A-Za-z]{3})\s+(\d{4})$/);

        if (!match) {
            throw new Error(`Unable to parse release note date "${dateLabel.trim()}".`);
        }

        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            .indexOf(match[2]);

        if (monthIndex === -1) {
            throw new Error(`Unable to parse release note month "${match[2]}".`);
        }

        return Date.UTC(Number(match[3]), monthIndex, Number(match[1]));
    }
}
