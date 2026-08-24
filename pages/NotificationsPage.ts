import { BasePage } from './BasePage';

export class NotificationsPage extends BasePage {
    private notificationListingGrid = 'app-table[page="view-all-notifications"] kendo-grid';
    private notificationSettingsSectionByHeading = (heading: string) =>
        `.notification-frequency-section:has(> h6:text-is("${heading}"))`;
    private notificationCategoryByHeading = (heading: string) =>
        `.notification-category:has(> h6:text-is("${heading}"))`;
    private frequencyOptions = '.notification-frequency-section .frequency-options';
    private frequencyOptionLabels = `${this.frequencyOptions} label.frequency-label:has(input[type="radio"])`;
    private frequencyRadioButtonByName = (frequencyName: string) =>
        `${this.notificationSettingsSectionByHeading('Periodic Summary Emails')} ` +
        `.frequency-options label.frequency-label:text-is("${frequencyName}") input[type="radio"]`;
    private notificationOptionLabelsByCategory = (categoryName: string) =>
        `${this.notificationCategoryByHeading(categoryName)} .notification-item .notification-label`;
    private userNotificationOptionCheckboxes =
        '.notification-category .notification-item input[type="checkbox"]';
    private systemNotificationCheckboxByOption = (optionName: string) =>
        `.notification-category .notification-item:has(.notification-label:text-is("${optionName}")) ` +
        'kendo-checkbox[formcontrolname="isSystem"] input[type="checkbox"]';
    private selectAllCheckboxByCategoryAndColumn = (categoryName: string, columnName: string) => {
        const columnIndexes: Record<string, number> = {
            System: 2,
            Email: 3,
            'Lock Settings': 4,
        };
        const columnIndex = columnIndexes[columnName];
        if (!columnIndex) {
            throw new Error(`Notification column "${columnName}" is not supported.`);
        }

        return `${this.notificationCategoryByHeading(categoryName)} ` +
            `.select-all-row > div:nth-child(${columnIndex}) input[type="checkbox"]`;
    };
    private periodicSummaryOptionByName = (optionName: string) =>
        `${this.notificationSettingsSectionByHeading('Periodic Summary Emails')} ` +
        `.switch-container:has(label.form-label:text-is("${optionName}")) kendo-switch[role="switch"]`;

    /**
     * Verifies that the notification listing contains at least one triggered System notification.
     */
    async verifySystemNotificationsTriggered(): Promise<void> {
        await this.ensureKendoGridHasRows(
            this.notificationListingGrid,
            'A System notification must be listed after its triggering business action is completed.',
            'The Notification Listing All Notifications tab was displayed and its grid showed no data.',
        );
    }

    /**
     * Verifies that the notification listing has no System notifications after the triggering setting is disabled.
     */
    async verifyNoSystemNotifications(): Promise<void> {
        await this.ensureKendoGridHasNoRows(
            this.notificationListingGrid,
            'No System notification must be listed when its triggering notification preference is disabled.',
            'The Notification Listing All Notifications tab was displayed after the triggering business action.',
        );
    }

    /**
     * Verifies that a supported section is visible on the default notification settings page.
     * @param sectionName Exact heading of the notification settings section.
     */
    async verifySectionIsAvailable(sectionName: string): Promise<void> {
        if (sectionName !== 'Periodic Summary Emails') {
            throw new Error(`Notification settings section "${sectionName}" is not supported.`);
        }

        await this.verifyElementIsDisplayed(this.notificationSettingsSectionByHeading(sectionName));
    }

    /**
    * Verifies that the frequency section exposes every requested radio-button option.
    * Reports missing options without stopping the scenario when at least one requested option is rendered.
     * @param sectionName Name of the notification settings section that contains the frequency choices.
     * @param options Semicolon-delimited radio-button option labels.
     */
    async verifyFrequencyOptionsAreVisible(sectionName: string, options: string): Promise<void> {
        if (sectionName !== 'Frequency') {
            throw new Error(`Notification settings section "${sectionName}" is not supported.`);
        }

        const optionNames = options.split(';').map(option => option.trim()).filter(Boolean);
        if (optionNames.length === 0) {
            throw new Error('At least one frequency option must be provided.');
        }

        await this.waitForSelectorStatus(
            this.notificationSettingsSectionByHeading('Periodic Summary Emails'),
            'visible',
        );
        const frequencyOptionLabels = this._page.locator(this.frequencyOptionLabels);
        const renderedOptions: string[] = [];

        for (let index = 0; index < await frequencyOptionLabels.count(); index += 1) {
            const optionLabel = frequencyOptionLabels.nth(index);
            const radioButton = optionLabel.locator('input[type="radio"]');
            if (await optionLabel.isVisible() && await radioButton.isVisible()) {
                const optionName = (await optionLabel.textContent())?.trim();
                if (optionName) {
                    renderedOptions.push(optionName);
                }
            }
        }

        await this.verifyExpectedOptions(
            optionNames,
            renderedOptions,
            'The Frequency section must display every configured email frequency option.',
        );
    }

    /**
     * Selects an email summary frequency and verifies that its radio button is selected.
     * @param frequencyName Exact visible frequency option label.
     * @param sectionName Frequency section name used by the feature.
     */
    async selectPeriodicSummaryFrequency(frequencyName: string, sectionName: string): Promise<void> {
        const supportedSections = [
            'Periodic Summary Emails',
            'Periodic Summary of Updates and Actions via email?',
        ];
        if (!supportedSections.includes(sectionName)) {
            throw new Error(`Frequency section "${sectionName}" is not supported.`);
        }

        const radioButton = this.frequencyRadioButtonByName(frequencyName);
        await this.clickElement(radioButton);
        const isSelected = await this.checkIfFieldIsSelected(radioButton);
        if (isSelected) {
            return;
        }

        this.failWithApplicationError(
            'The selected periodic summary frequency must remain selected.',
            `${frequencyName} is selected.`,
            `${frequencyName} is not selected.`,
            'The radio button was visible and was selected before its checked state was evaluated.',
        );
    }

    /**
    * Verifies that a notification category exposes every requested notification option.
     * @param sectionName Name of the notification category that contains the options.
     * @param options Semicolon-delimited notification option labels.
     */
    async verifyNotificationOptionsAreVisible(sectionName: string, options: string): Promise<void> {
        const supportedCategories = ['Updates', 'Actions', 'Teams'];
        if (!supportedCategories.includes(sectionName)) {
            throw new Error(`Notification category "${sectionName}" is not supported.`);
        }

        const optionNames = options.split(';').map(option => option.trim()).filter(Boolean);
        if (optionNames.length === 0) {
            throw new Error('At least one notification option must be provided.');
        }

        const updatesCategory = this.notificationCategoryByHeading(sectionName);
        await this.waitForSelectorStatus(updatesCategory, 'visible');

        const notificationOptionLabels = this._page.locator(
            this.notificationOptionLabelsByCategory(sectionName),
        );
        const renderedOptions: string[] = [];
        for (let index = 0; index < await notificationOptionLabels.count(); index += 1) {
            const optionLabel = notificationOptionLabels.nth(index);
            if (await optionLabel.isVisible()) {
                const optionName = (await optionLabel.textContent())?.trim();
                if (optionName) {
                    renderedOptions.push(optionName);
                }
            }
        }

        await this.verifyExpectedOptions(
            optionNames,
            renderedOptions,
            `The ${sectionName} section must display every configured notification option.`,
        );
    }

    /**
     * Toggles the System notification checkbox associated with an option so it ends up in the requested state,
     * then verifies the checkbox reflects that state as an application defect check.
     * When the checkbox already matches the desired state, it is toggled off and back on to genuinely exercise
     * the control instead of leaving it unchanged, which would hide a checkbox that never reacts to clicks.
     * @param optionName Exact visible label of the notification option.
     * @param desiredState Target selected state for the checkbox, "enabled" or "disabled".
     */
    async toggleSystemNotificationOption(optionName: string, desiredState: 'enabled' | 'disabled'): Promise<void> {
        const checkboxSelector = this.systemNotificationCheckboxByOption(optionName);
        const checkbox = this._page.locator(checkboxSelector);
        await checkbox.scrollIntoViewIfNeeded();

        const desiredEnabled = desiredState === 'enabled';
        const isCurrentlyEnabled = await this.checkIfFieldIsSelected(checkboxSelector);

        if (isCurrentlyEnabled === desiredEnabled) {
            await checkbox.click({ force: true });
        }
        await checkbox.click({ force: true });

        const isEnabled = await this.checkIfFieldIsSelected(checkboxSelector);
        if (isEnabled === desiredEnabled) {
            return;
        }

        this.failWithApplicationError(
            'A System notification option must reflect the state selected by the user.',
            `${optionName} is ${desiredState}.`,
            `${optionName} is ${isEnabled ? 'enabled' : 'disabled'}.`,
            'The System notification checkbox was visible and its checked state was read successfully.',
        );
    }

    /**
     * Verifies that all user-level notification options and the periodic summary switch are disabled.
     * @param preferenceGroup Name of the preference group verified by the feature.
     */
    async verifyAllUserNotificationPreferencesAreDisabled(preferenceGroup: string): Promise<void> {
        if (preferenceGroup !== 'Notifications Preferences') {
            throw new Error(`Notification preference group "${preferenceGroup}" is not supported.`);
        }

        await this.waitForSelectorStatus(this.notificationCategoryByHeading('Updates'), 'visible');
        const checkboxes = this._page.locator(this.userNotificationOptionCheckboxes);
        const enabledOptions: string[] = [];

        for (let index = 0; index < await checkboxes.count(); index += 1) {
            const checkbox = checkboxes.nth(index);
            if (!await checkbox.isChecked()) {
                continue;
            }

            const optionName = (await checkbox
                .locator('xpath=ancestor::div[contains(@class, "notification-item")]')
                .locator('.notification-label')
                .textContent())?.trim();
            enabledOptions.push(optionName ?? `Notification option ${index + 1}`);
        }

        const periodicSummarySwitch = this.periodicSummaryOptionByName(
            'Periodic summary of Updates and Actions via email?',
        );
        if (await this.getElementAttribute(periodicSummarySwitch, 'aria-checked') === 'true') {
            enabledOptions.push('Periodic summary of Updates and Actions via email?');
        }

        if (enabledOptions.length === 0) {
            return;
        }

        this.failWithApplicationError(
            'All user notification preferences must be disabled.',
            'No System, Email, or periodic summary notification preference is enabled.',
            `Enabled preferences: [${enabledOptions.join(' | ')}].`,
            'All user notification checkboxes and the periodic summary switch were read successfully.',
        );
    }

    /**
     * Toggles a Select All notification checkbox only when it has the requested current state.
     * @param checkboxName Visible label of the checkbox. Only Select All is supported.
     * @param columnName Notification column: System, Email, or Lock Settings.
     * @param categoryName Notification category: Updates, Actions, or Teams.
     * @param currentState Current checkbox state that triggers a toggle: checked or unchecked.
     */
    async toggleSelectAllCheckboxIfState(
        checkboxName: string,
        columnName: string,
        categoryName: string,
        currentState: string,
    ): Promise<void> {
        if (checkboxName !== 'Select All') {
            throw new Error(`Checkbox "${checkboxName}" is not supported.`);
        }

        const supportedCategories = ['Updates', 'Actions', 'Teams'];
        if (!supportedCategories.includes(categoryName)) {
            throw new Error(`Notification category "${categoryName}" is not supported.`);
        }

        const normalizedState = currentState.trim().toLowerCase();
        if (normalizedState !== 'checked' && normalizedState !== 'unchecked') {
            throw new Error(`Checkbox state "${currentState}" is not supported.`);
        }

        const checkbox = this.selectAllCheckboxByCategoryAndColumn(categoryName, columnName);
        const expectedCurrentState = normalizedState === 'checked';
        const isChecked = await this.checkIfFieldIsSelected(checkbox);
        if (isChecked !== expectedCurrentState) {
            return;
        }

        await this.clickElement(checkbox);
        const expectedNewState = !expectedCurrentState;
        const actualNewState = await this.checkIfFieldIsSelected(checkbox);
        if (actualNewState === expectedNewState) {
            return;
        }

        this.failWithApplicationError(
            'A Select All notification checkbox must change state when selected.',
            `${categoryName} ${columnName} is ${expectedNewState ? 'checked' : 'unchecked'}.`,
            `${categoryName} ${columnName} is ${actualNewState ? 'checked' : 'unchecked'}.`,
            `The checkbox started ${isChecked ? 'checked' : 'unchecked'}.`,
        );
    }

    /**
     * Verifies that the Periodic Summary Emails section displays its summary notification switch.
     * @param sectionName Name of the notification settings section.
     * @param optionName Label of the expected summary notification option.
     */
    async verifyPeriodicSummaryOptionIsVisible(sectionName: string, optionName: string): Promise<void> {
        if (sectionName !== 'Periodic Summary Emails') {
            throw new Error(`Notification settings section "${sectionName}" is not supported.`);
        }

        await this.waitForSelectorStatus(
            this.notificationSettingsSectionByHeading(sectionName),
            'visible',
        );

        const summaryOption = this.periodicSummaryOptionByName(optionName);
        if (await this._page.locator(summaryOption).isVisible()) {
            return;
        }

        this.failWithApplicationError(
            'The Periodic Summary Emails section must display its summary notification switch.',
            optionName,
            'The requested summary notification switch is not visible.',
            'The Periodic Summary Emails section was visible before the switch was evaluated.',
        );
    }

    /**
     * Toggles the Periodic Summary Emails switch only when it has the requested current state.
     * @param optionName Label of the summary notification switch.
     * @param sectionName Name of the notification settings section.
     * @param currentState Current switch state that triggers a toggle: enabled or disabled.
     */
    async togglePeriodicSummaryOptionIfState(
        optionName: string,
        sectionName: string,
        currentState: string,
    ): Promise<void> {
        if (sectionName !== 'Periodic Summary Emails') {
            throw new Error(`Notification settings section "${sectionName}" is not supported.`);
        }

        const normalizedState = currentState.trim().toLowerCase();
        if (normalizedState !== 'enabled' && normalizedState !== 'disabled') {
            throw new Error(`Notification switch state "${currentState}" is not supported.`);
        }

        const summaryOption = this.periodicSummaryOptionByName(optionName);
        const expectedCurrentState = normalizedState === 'enabled' ? 'true' : 'false';
        const currentAriaState = await this.getElementAttribute(summaryOption, 'aria-checked');
        if (currentAriaState !== expectedCurrentState) {
            return;
        }

        await this.clickElement(summaryOption);
        const expectedResult = expectedCurrentState === 'true' ? 'false' : 'true';
        const actualResult = await this.getElementAttribute(summaryOption, 'aria-checked');
        if (actualResult === expectedResult) {
            return;
        }

        this.failWithApplicationError(
            'The Periodic Summary Emails switch must change state when selected.',
            `aria-checked="${expectedResult}"`,
            `aria-checked="${actualResult}"`,
            `The switch started with aria-checked="${currentAriaState}".`,
        );
    }

    /**
     * Reports missing configured options without stopping the scenario when any expected option is rendered.
     * @param expectedOptions Options required by the feature.
     * @param renderedOptions Visible options read from the UI.
     * @param businessRule Business rule that requires the options to be displayed.
     */
    private async verifyExpectedOptions(
        expectedOptions: string[],
        renderedOptions: string[],
        businessRule: string,
    ): Promise<void> {
        const missingOptions = expectedOptions.filter(optionName =>
            !renderedOptions.some(renderedOption =>
                renderedOption.localeCompare(optionName, undefined, { sensitivity: 'accent' }) === 0,
            ),
        );

        if (missingOptions.length === 0) {
            return;
        }

        const expectedResult = `[${expectedOptions.join(' | ')}]`;
        const actualResult = `[${renderedOptions.join(' | ')}]`;
        const evidence = `Missing options: [${missingOptions.join(' | ')}].`;

        if (renderedOptions.length === 0) {
            this.failWithApplicationError(businessRule, expectedResult, actualResult, evidence);
        }

        await this.reportApplicationError(businessRule, expectedResult, actualResult, evidence);
    }
}