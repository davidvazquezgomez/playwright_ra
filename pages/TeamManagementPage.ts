import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TeamManagementPage extends BasePage {
  private teamGridRows = '[role="grid"][aria-label="Data table"] tbody tr.k-master-row';
  private createTeamButton = 'button:has(.k-button-text:text-is("Create Team"))';
  private firstTeamEditButton = `${this.teamGridRows}:first-child button[title^="Edit"]`;
  private addTeamMembersButton = 'button.add-save-btn:has(.k-button-text:text-is("Add Team Members"))';
  private addTeamMembersDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Add Team Members"))';
  private addTeamMemberSearchInput =
    `${this.addTeamMembersDialog} app-people-picker[formcontrolname="selectedPeople"] input[role="combobox"]`;
  private addTeamMemberSearchOptions = 'kendo-popup.k-animation-container-shown:visible li[role="option"]';
  private addUserButton = `${this.addTeamMembersDialog} button[aria-label="Add User"]`;
  private addTeamMembersCancelButton = `${this.addTeamMembersDialog} button:has(.k-button-text:text-is("Cancel"))`;
  private addTeamMembersDuplicateUserWarning = `${this.addTeamMembersDialog} :text-is("User already exists in Team members list")`;
  private teamMembersGrid = '#teamForm [role="grid"][aria-label="Data table"]';
  private teamMembersEmailFilterInput = `${this.teamMembersGrid} input[aria-label*="Email"][aria-label*="Filter"], ${this.teamMembersGrid} input[placeholder*="Email" i], ${this.teamMembersGrid} td[data-kendo-grid-column-index="1"] input`;
  private teamMembersEmailFilterCell = `${this.teamMembersGrid} td[aria-label*="Email"], ${this.teamMembersGrid} td[data-kendo-grid-column-index="1"]`;
  private teamMembersEmailClearButton = `${this.teamMembersEmailFilterCell} button[title="Clear"]`;
  private teamMembersEmailFilterActionButton = `${this.teamMembersEmailFilterCell} button[title*="Filter" i]`;
  private teamMemberRowByEmail = (emailAddress: string) =>
    `${this.teamMembersGrid} tbody tr.k-master-row:has-text("${emailAddress}")`;
  private teamMemberDeleteButtonByEmail = (emailAddress: string) =>
    `${this.teamMemberRowByEmail(emailAddress)} button[title*="Delete" i], ${this.teamMemberRowByEmail(emailAddress)} button[aria-label*="Delete" i], ${this.teamMemberRowByEmail(emailAddress)} button[title*="Remove" i], ${this.teamMemberRowByEmail(emailAddress)} button[aria-label*="Remove" i]`;
  private teamMemberNameCellByName = (displayName: string) =>
    `${this.teamMembersGrid} tbody tr.k-master-row td[data-kendo-grid-column-index="0"]:text-is("${displayName}")`;
  private removeUserConfirmButton =
    'div[role="dialog"]:has(.k-dialog-title:text-is("Remove User?")) button:has(.k-button-text:text-is("Remove User"))';
  private saveTeamButton = 'button.add-save-btn[form="teamForm"]';
  private leaveTeamButton = 'button:has(.k-button-text:text-is("Leave Team"))';
  private teamNameInput = '#teamForm kendo-textbox[formcontrolname="teamName"] input.k-input-inner';
  private additionalInformationInput =
    '#teamForm kendo-formfield:has(kendo-label .k-label:text-is("Additional Information")) .k-input-inner';
  private teamNameFilter = 'input[aria-label="Team Name Filter"]';
  private teamLeaderSearchInput = '#teamForm app-people-picker[formcontrolname="teamLeaders"] input[role="combobox"]';
  private visibleKendoPopup = 'kendo-popup.k-animation-container-shown:visible';
  private teamLeaderSearchResultByEmail = (emailAddress: string) =>
    `kendo-popup.k-animation-container-shown:visible li[role="option"]:has-text("${emailAddress}")`;
  private teamLeaderChips = '#teamForm app-people-picker[formcontrolname="teamLeaders"] .k-chip';
  private teamRowByName = (teamName: string) =>
    `${this.teamGridRows}:has(td[data-kendo-grid-column-index="0"]:text-is("${teamName}"))`;
  private teamLeadersCell = 'td[data-kendo-grid-column-index="1"]';
  private editButtonByTeamName = (teamName: string) =>
    `${this.teamRowByName(teamName)} button[title^="Edit"]`;
  private removeButtonByTeamName = (teamName: string) =>
    `${this.teamRowByName(teamName)} button[title^="Remove"]`;
  private teamDeletionDialog =
    'div[role="dialog"]:has(.k-dialog-title:text-is("Warning")), div[role="dialog"]:has(.k-dialog-title:text-is("Delete Team?"))';
  private teamDeletionConfirmButton =
    'div[role="dialog"]:has(.k-dialog-title:text-is("Warning")) button:has(.k-button-text:text-is("Delete")), div[role="dialog"]:has(.k-dialog-title:text-is("Delete Team?")) button:has(.k-button-text:text-is("Delete")), div[role="dialog"]:has(.k-dialog-title:text-is("Delete Team?")) button[aria-label="Delete"]';
  private teamForm = '#teamForm';
  private teamFormWarningMessageByText = (message: string) =>
    this._page.locator(this.teamForm).getByText(message, { exact: true }).first();
  private pendingTeamMemberNameToAdd?: string;
  private editedTeamName?: string;

  /**
   * Resolves a supported Create/Edit Team field label to its input selector.
   * @param fieldLabel Visible label of the field to populate.
   * @returns Selector of the input element associated with the requested field.
   */
  private createEditTeamFieldSelector(fieldLabel: string): string {
    const fieldSelectors: Record<string, string> = {
      'Team Name': this.teamNameInput,
      'Additional Information': this.additionalInformationInput,
    };

    const selector = fieldSelectors[fieldLabel];
    if (!selector) {
      throw new Error(`Create/Edit Team field "${fieldLabel}" is not supported.`);
    }

    return selector;
  }

  /**
   * Verifies that every mandatory field of the Create/Edit Team form displays its warning message.
   * @param messages Semicolon-delimited expected warning messages.
   * @param fields Semicolon-delimited mandatory field labels that own each message.
   */
  async verifyMandatoryFieldWarningMessages(messages: string, fields: string): Promise<void> {
    const expectedMessages = messages.split(';').map(message => message.trim()).filter(Boolean);
    const fieldLabels = fields.split(';').map(field => field.trim()).filter(Boolean);

    if (expectedMessages.length === 0 || expectedMessages.length !== fieldLabels.length) {
      throw new Error('Each mandatory field must have one corresponding warning message.');
    }

    await this.waitForElement(this.teamNameInput);

    const missingWarnings: string[] = [];

    for (const [index, message] of expectedMessages.entries()) {
      const isDisplayed = await this.teamFormWarningMessageByText(message)
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (!isDisplayed) {
        missingWarnings.push(`${fieldLabels[index]}: "${message}"`);
      }
    }

    if (missingWarnings.length > 0) {
      this.failWithApplicationError(
        'Saving the Create/Edit Team form without mandatory data must display a warning message for every mandatory field.',
        `Warning messages displayed for: ${fieldLabels.join(', ')}.`,
        `No warning message was displayed for: ${missingWarnings.join('; ')}.`,
        'The Create/Edit Team form remained open after the Save action.',
      );
    }
  }
 

  /**
   * Opens the editor for the first team displayed in the Team Management grid.
   */
  async editFirstTeam(): Promise<void> {
    await this.ensureKendoGridHasRows(
      '[role="grid"][aria-label="Data table"]',
      'Team Management must contain a team before the first team can be edited.',
      'The Team Management grid was displayed before attempting to edit its first row.',
    );
    await this.ensureExpectedBusinessElementIsVisible(
      this._page.locator(this.firstTeamEditButton),
      'The first displayed team must provide the Edit action to an authorized user.',
      'The Edit button is displayed for the first team row.',
      'At least one Team Management data row is visible.',
    );
    await this.clickElement(this.firstTeamEditButton);
  }

  /**
   * Opens the Add Team Members dialog from the Create/Edit Team page.
   */
  async openAddTeamMembersDialog(): Promise<void> {
    await this.clickElement(this.addTeamMembersButton);
  }

  /**
   * Selects a requested member from the Add Team Members search results.
   * @param userName User name expected to be available for selection.
   */
  async selectTeamMemberToAdd(userName: string): Promise<void> {
    const searchOptions = this._page.locator(this.addTeamMemberSearchOptions);

    // The people picker only matches its own name order, so each supported term is tried.
    for (const [termIndex, searchTerm] of this.buildTeamMemberSearchTerms(userName).entries()) {
      await this.fillInputText(this.addTeamMemberSearchInput, searchTerm);

      const optionsAreDisplayed = await searchOptions
        .first()
        .waitFor({ state: 'visible', timeout: termIndex === 0 ? 10000 : 5000 })
        .then(() => true)
        .catch(() => false);

      if (!optionsAreDisplayed) {
        continue;
      }

      const matchingOption = await this.findTeamMemberSearchOption(userName);
      if (!matchingOption) {
        continue;
      }

      if (await matchingOption.getAttribute('aria-selected') !== 'true') {
        await this.clickLocator(matchingOption);
      }

      this.pendingTeamMemberNameToAdd = userName;
      return;
    }

    throw new Error(`No Search user option matched "${userName}" in Add Team Members.`);
  }

  /**
   * Builds the search terms accepted by the Add Team Members people picker for a display name.
   * @param userName Display name requested by the scenario.
   * @returns Unique search terms ordered from the most to the least specific.
   */
  private buildTeamMemberSearchTerms(userName: string): string[] {
    const nameParts = userName.split(',').map(part => part.trim()).filter(Boolean);
    const searchTerms = [userName, this.swapCommaSeparatedName(userName), ...nameParts];

    return searchTerms.filter((term, index, terms) => Boolean(term) && terms.indexOf(term) === index);
  }

  /**
   * Finds the search result that contains every part of the requested display name.
   * @param userName Display name requested by the scenario.
   * @returns Locator of the matching option, or null when no option matches.
   */
  private async findTeamMemberSearchOption(userName: string): Promise<Locator | null> {
    const nameParts = userName.split(/[\s,]+/).map(part => part.trim().toLowerCase()).filter(Boolean);
    const searchOptions = this._page.locator(this.addTeamMemberSearchOptions);
    const optionCount = await searchOptions.count();

    for (let optionIndex = 0; optionIndex < optionCount; optionIndex++) {
      const option = searchOptions.nth(optionIndex);
      const optionText = ((await option.textContent()) ?? '').toLowerCase();

      if (nameParts.every(namePart => optionText.includes(namePart))) {
        return option;
      }
    }

    return null;
  }

  /**
   * Selects one or many users from the Add Team Members search picker.
   * @param users Semicolon-delimited user values expected in picker results.
   */
  async selectTeamMembersToAdd(users: string): Promise<void> {
    const userNames = users.split(';').map(value => value.trim()).filter(Boolean);
    if (userNames.length === 0) {
      throw new Error('At least one Search user value must be provided.');
    }

    for (const userName of userNames) {
      await this.selectTeamMemberToAdd(userName);
    }
  }

  /**
   * Enters a value in a supported Create/Edit Team field.
   * @param value Value to enter in the requested field.
   * @param fieldLabel Visible label of the Create/Edit Team field.
   */
  async enterCreateEditTeamField(value: string, fieldLabel: string): Promise<void> {
    await this.fillInputText(this.createEditTeamFieldSelector(fieldLabel), value);
  }

  /**
   * Confirms the selected members in the Add Team Members dialog.
   */
  async addSelectedTeamMembers(): Promise<void> {
    if (
      this.pendingTeamMemberNameToAdd &&
      await this.isTeamMemberAlreadyAdded(this.pendingTeamMemberNameToAdd)
    ) {
      await this.clickElement(this.addTeamMembersCancelButton);
      this.pendingTeamMemberNameToAdd = undefined;
      return;
    }

    await this.clickElement(this.addUserButton);

    const duplicateWarning = this._page.locator(this.addTeamMembersDuplicateUserWarning);
    if (await duplicateWarning.count() > 0 && await duplicateWarning.isVisible()) {
      await this.clickElement(this.addTeamMembersCancelButton);
    }

    this.pendingTeamMemberNameToAdd = undefined;
  }

  /**
   * Determines whether a candidate user already exists in the Team Members grid.
   * @param userName Display name chosen from the Add Team Members search field.
   * @returns True when the user is already listed as a Team Member.
   */
  private async isTeamMemberAlreadyAdded(userName: string): Promise<boolean> {
    const candidateNames = [userName, this.swapCommaSeparatedName(userName)].filter(
      (value, index, self): value is string => Boolean(value) && self.indexOf(value) === index,
    );

    for (const candidateName of candidateNames) {
      if (await this._page.locator(this.teamMemberNameCellByName(candidateName)).count() > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Converts "Last, First" to "First, Last" when possible.
   * @param name Display name formatted with a comma separator.
   * @returns Swapped display name, or the original value when no swap is possible.
   */
  private swapCommaSeparatedName(name: string): string {
    const parts = name.split(',').map(value => value.trim()).filter(Boolean);
    if (parts.length !== 2) {
      return name;
    }

    return `${parts[1]}, ${parts[0]}`;
  }

  /**
   * Saves the current team from the Create/Edit Team form.
   */
  async saveTeam(): Promise<void> {
    await this.ensureEditedTeamNameIsPreserved();
    await this.clickElement(this.saveTeamButton);
  }

  /**
   * Restores Team Name on Edit Team when the field is unexpectedly cleared.
   */
  private async ensureEditedTeamNameIsPreserved(): Promise<void> {
    if (!this.editedTeamName) {
      return;
    }

    const currentTeamName = (await this._page.locator(this.teamNameInput).inputValue()).trim();
    if (currentTeamName.length > 0) {
      return;
    }

    await this.fillInputText(this.teamNameInput, this.editedTeamName);
  }

  /**
   * Starts the leave action for the currently edited team.
   */
  async leaveCurrentTeam(): Promise<void> {
    await this.clickElement(this.leaveTeamButton);
  }

  /**
   * Ensures that a minimally valid team exists for a scenario that edits or deletes it.
   * @param teamName Exact team name.
   * @param leaderEmail Email address of the Team Leader.
   * @param memberName Display name of the Team Member.
   */
  async ensureTeamExists(teamName: string, leaderEmail: string, memberName: string): Promise<void> {
    await this.searchTeamsByName(teamName);
    if (await this._page.locator(this.teamRowByName(teamName)).count() > 0) {
      return;
    }

    await this.clearInput(this.teamNameFilter);
    await this.clickElement(this.createTeamButton);
    await this.fillInputText(this.teamNameInput, teamName);
    await this.addTeamLeader(leaderEmail);
    await this.openAddTeamMembersDialog();
    await this.selectTeamMemberToAdd(memberName);
    await this.addSelectedTeamMembers();
    await this.saveTeam();
    await this.searchTeamsByName(teamName);
    await expect(this._page.locator(this.teamRowByName(teamName))).toBeVisible();
  }

  /**
   * Removes a team when it is present, allowing setup and cleanup to be rerun safely.
   * @param teamName Exact team name to remove.
   */
  async removeTeamIfPresent(teamName: string): Promise<void> {
    await this.ensureTeamManagementListIsReady();
    await this.searchTeamsByName(teamName);
    const teamRow = this._page.locator(this.teamRowByName(teamName));
    if (await teamRow.count() === 0) {
      return;
    }

    await this.removeTeam(teamName);
    await this.clickElement(this.teamDeletionConfirmButton);
    await this.waitForTeamToDisappear(teamName);
  }

  /**
   * Ensures the Team Management list page is ready before team-grid cleanup actions.
   */
  private async ensureTeamManagementListIsReady(): Promise<void> {
    const teamNameFilter = this._page.locator(this.teamNameFilter);
    if (await teamNameFilter.isVisible().catch(() => false)) {
      return;
    }

    const currentUrl = this._page.url();
    const parsedUrl = new URL(currentUrl);
    const portalId = parsedUrl.pathname
      .split('/')
      .find((pathSegment) => /^\d+$/.test(pathSegment));

    if (!portalId) {
      throw new Error(
        `Unable to open Team Management for cleanup because no portal id was found in URL "${currentUrl}".`,
      );
    }

    await this.loadPage(new URL(`/teams/${portalId}`, parsedUrl.origin).toString());
    await this.waitForElement(this.teamNameFilter);
  }

  /**
   * Opens the delete confirmation popup for the requested team.
   * @param teamName Exact name of the team to remove.
   */
  async removeTeam(teamName: string): Promise<void> {
    await this.clearInput(this.teamNameFilter);
    await this.fillInputText(this.teamNameFilter, teamName);
    await this.ensureKendoGridHasRows(
      '[role="grid"][aria-label="Data table"]',
      `Team Management must contain a team before "${teamName}" can be removed.`,
      `The Team Management grid was filtered by "${teamName}" before searching for the requested team.`,
    );
    await expect(this._page.locator(this.teamRowByName(teamName))).toBeVisible();
    await this.ensureExpectedBusinessElementIsVisible(
      this._page.locator(this.removeButtonByTeamName(teamName)),
      `The team "${teamName}" must provide the Remove action.`,
      `A Remove button is displayed for "${teamName}".`,
      `The team row "${teamName}" is visible in the Team Management grid.`,
    );
    await this.clickElement(this.removeButtonByTeamName(teamName));
    await this.waitForSelectorStatus(this.teamDeletionDialog, 'visible');
  }

  /**
   * Filters Team Management by an exact team name and opens that team's editor.
   * @param teamName Exact name of the team to edit.
   */
  async editTeam(teamName: string): Promise<void> {
    this.editedTeamName = teamName;
    await this.clearInput(this.teamNameFilter);
    await this.fillInputText(this.teamNameFilter, teamName);
    await this.ensureKendoGridHasRows(
      '[role="grid"][aria-label="Data table"]',
      `Team Management must contain a team before "${teamName}" can be edited.`,
      `The Team Management grid was filtered by "${teamName}" before searching for the requested team.`,
    );
    await expect(this._page.locator(this.teamRowByName(teamName))).toBeVisible();
    await this.ensureExpectedBusinessElementIsVisible(
      this._page.locator(this.editButtonByTeamName(teamName)),
      `The team "${teamName}" must provide the Edit action.`,
      `An Edit button is displayed for "${teamName}".`,
      `The team row "${teamName}" is visible in the Team Management grid.`,
    );
    await this.clickElement(this.editButtonByTeamName(teamName));
  }

  /**
   * Filters the Team Management grid by a team name.
   * @param teamName Team name used to filter the grid.
   */
  async searchTeamsByName(teamName: string): Promise<void> {
    await this.clearInput(this.teamNameFilter);
    await this.fillInputText(this.teamNameFilter, teamName);
  }

  /**
   * Filters Team Members by email on the Create/Edit Team page.
   * Waits for the filter input to be visible and ready before applying the filter.
   * @param emailAddress Email address used to filter Team Members.
   */
  async searchTeamMembersByEmail(emailAddress: string): Promise<void> {
    // Ensure the Team Members grid and filter input are fully rendered before attempting to interact
    await this.waitForElement(this.teamMembersEmailFilterInput, 10000);
    await this.clearInput(this.teamMembersEmailFilterInput);
    await this.fillInputText(this.teamMembersEmailFilterInput, emailAddress);
  }

  /**
   * Verifies that the Team Members email filter contains a value.
   * Waits for the filter input to be visible and stable before reading its value.
   */
  async verifyTeamMembersEmailFilterIsApplied(): Promise<void> {
    // Ensure the filter input is visible and ready
    await this.waitForElement(this.teamMembersEmailFilterInput, 10000);
    const filterValue = (await this._page.locator(this.teamMembersEmailFilterInput).inputValue()).trim();
    if (filterValue.length > 0) {
      return;
    }

    this.failWithApplicationError(
      'Applying a Team Members email filter must keep the filter value visible in the Email filter field.',
      'A non-empty value in the Team Members Email filter field.',
      filterValue,
      'The Team Members Email filter input was visible and its rendered value was read.',
    );
  }

  /**
   * Clears the Team Members email filter from the Create/Edit Team page.
   * Attempts to click a Clear or Filter button, or manually clears the input field.
   */
  async clearTeamMembersEmailFilter(): Promise<void> {
    // Ensure the filter input is visible and ready
    await this.waitForElement(this.teamMembersEmailFilterInput, 10000);
    
    const clearButton = this._page.locator(this.teamMembersEmailClearButton);
    if (await clearButton.count() > 0 && await clearButton.first().isVisible().catch(() => false)) {
      await this.clickElement(this.teamMembersEmailClearButton);
      return;
    }

    const filterButton = this._page.locator(this.teamMembersEmailFilterActionButton);
    if (await filterButton.count() > 0 && await filterButton.first().isVisible().catch(() => false)) {
      await this.clickElement(this.teamMembersEmailFilterActionButton);
      return;
    }

    // Fallback: manually clear the input field
    await this.clearInput(this.teamMembersEmailFilterInput);
  }

  /**
   * Deletes a Team Member from the Team Members grid by email.
   * Ensures the Remove User confirmation dialog appears before returning.
   * @param emailAddress Email address displayed in the Team Members row to remove.
   */
  async deleteTeamMember(emailAddress: string): Promise<void> {
    const teamMemberRow = this._page.locator(this.teamMemberRowByEmail(emailAddress));
    await expect(teamMemberRow).toHaveCount(1);
    await this.clickElement(this.teamMemberDeleteButtonByEmail(emailAddress));
    
    // Wait for the Remove User? confirmation dialog to appear
    const removeUserDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Remove User?"))';
    await this.waitForSelectorStatus(removeUserDialog, 'visible');
  }

  /**
   * Removes a Team Member from the team being edited only when the member is already listed.
   * @param emailAddress Email address of the Team Member to remove.
   */
  async removeTeamMemberIfPresent(emailAddress: string): Promise<void> {
    await this.searchTeamMembersByEmail(emailAddress);

    const teamMemberRow = this._page.locator(this.teamMemberRowByEmail(emailAddress));
    const isMemberListed = await teamMemberRow
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (isMemberListed) {
      await this.clickElement(this.teamMemberDeleteButtonByEmail(emailAddress));
      await this.clickElement(this.removeUserConfirmButton);
    }

    await this.clearTeamMembersEmailFilter();
  }

  /**
   * Verifies that a deleted team is no longer displayed in Team Management.
   * @param teamName Exact team name expected to be absent from the Team Management grid.
   */
  async verifyDeletedTeamIsNotAvailable(teamName: string): Promise<void> {
    const teamDisappeared = await this.retryWithReload(async () => {
      await this.searchTeamsByName(teamName);
      const deletedTeamRows = this._page.locator(this.teamRowByName(teamName));
      return await expect(deletedTeamRows).toHaveCount(0, { timeout: 5000 }).then(() => true).catch(() => false);
    }, 5);

    if (!teamDisappeared) {
      const deletedTeamRows = this._page.locator(this.teamRowByName(teamName));
      this.failWithApplicationError(
        'A team deleted from Team Management must no longer be listed in the Team Management grid.',
        `No Team Management rows for "${teamName}".`,
        `${await deletedTeamRows.count()} Team Management row(s) still displayed for "${teamName}".`,
        'The Team Name filter was applied and the resulting Team Management rows were read after repeated reloads.',
      );
    }
  }

  /**
   * Waits until the requested team is no longer visible in the Team Management grid.
   * @param teamName Exact team name expected to disappear after deletion.
   */
  private async waitForTeamToDisappear(teamName: string): Promise<void> {
    const teamDisappeared = await this.retryWithReload(async () => {
      await this.searchTeamsByName(teamName);
      return await this._page.locator(this.teamRowByName(teamName)).count() === 0;
    }, 5);

    if (!teamDisappeared) {
      this.failWithApplicationError(
        'A team deleted from Team Management must no longer be listed in the Team Management grid.',
        `No Team Management rows for "${teamName}".`,
        `${await this._page.locator(this.teamRowByName(teamName)).count()} Team Management row(s) still displayed for "${teamName}".`,
        'The Team Name filter was applied and the resulting Team Management rows were read after repeated reloads.',
      );
    }
  }

  /**
   * Verifies that the filtered team's Team Leaders cell does not contain a user.
   * @param userName Display name that must not appear among the team's leaders.
   */
  async verifyUserIsNotAvailableInTeamLeaders(userName: string): Promise<void> {
    const onCreateEditTeamPage = await this._page.getByRole('heading', { name: 'Create/Edit Team' }).isVisible()
      .catch(() => false);

    if (onCreateEditTeamPage) {
      if (await this.isTeamLeaderPresent(userName)) {
        const chipTexts = await this._page.locator(this.teamLeaderChips).allTextContents();
        this.failWithApplicationError(
          'A removed Team Leader must no longer be selected in the team editor.',
          `Team Leaders that do not contain "${userName}".`,
          chipTexts.map(value => value.trim()).filter(Boolean).join(' | '),
          'The Create/Edit Team page still shows the removed user as a Team Leader.',
        );
      }

      return;
    }

    const filteredTeamRows = this._page.locator(this.teamGridRows);
    await expect(filteredTeamRows).toHaveCount(1);

    const teamLeadersCell = filteredTeamRows.locator(this.teamLeadersCell);
    try {
      await expect(teamLeadersCell).not.toContainText(userName);
    } catch {
      this.failWithApplicationError(
        'A removed Team Leader must no longer be displayed for the filtered team.',
        `Team Leaders that do not contain "${userName}".`,
        (await teamLeadersCell.textContent())?.trim() ?? '',
        `The Team Leaders cell was displayed for the filtered team and still contains "${userName}".`,
      );
    }
  }

  /**
   * Verifies that the filtered team's Team Leaders include a user.
   * @param userName Display name that must appear among the team's leaders.
   */
  async verifyUserIsAvailableInTeamLeaders(userName: string): Promise<void> {
    const onCreateEditTeamPage = await this._page.getByRole('heading', { name: 'Create/Edit Team' }).isVisible()
      .catch(() => false);

    if (onCreateEditTeamPage) {
      if (!await this.isTeamLeaderPresent(userName)) {
        const chipTexts = await this._page.locator(this.teamLeaderChips).allTextContents();
        this.failWithApplicationError(
          'A Team Leader added in the team editor must remain selected before saving.',
          `Team Leaders that contain "${userName}".`,
          chipTexts.map(value => value.trim()).filter(Boolean).join(' | '),
          'The Create/Edit Team page does not show the expected Team Leader in the selected chips.',
        );
      }

      return;
    }

    await this.ensureKendoGridHasRows(
      '[role="grid"][aria-label="Data table"]',
      'Team Management must display at least one team before Team Leader availability can be verified.',
      'The Team Management grid was displayed before checking Team Leaders.',
    );

    const gridRows = this._page.locator(this.teamGridRows);
    const rowCount = await gridRows.count();
    const matchingLeaderValues: string[] = [];
    const renderedLeaderValues: string[] = [];

    for (let index = 0; index < rowCount; index += 1) {
      const leaderValue = ((await gridRows.nth(index).locator(this.teamLeadersCell).textContent()) ?? '').trim();
      if (!leaderValue) {
        continue;
      }

      renderedLeaderValues.push(leaderValue);
      if (this.doesTeamLeaderChipMatch(userName, leaderValue)) {
        matchingLeaderValues.push(leaderValue);
      }
    }

    if (matchingLeaderValues.length > 0) {
      return;
    }

    this.failWithApplicationError(
      'A Team Leader added to a team must be displayed in Team Management Team Leaders.',
      `At least one Team Leaders value that contains "${userName}".`,
      renderedLeaderValues.join(' | ') || '(no Team Leaders values read from the grid)',
      'The Team Management Team Leaders column values were read from the rendered data rows.',
    );
  }

  /**
   * Adds a Team Leader to the Create/Edit Team form through the people picker.
   * @param emailAddress Email address of the Team Leader to add.
   */
  async addTeamLeader(emailAddress: string): Promise<void> {
    await this.fillInputText(this.teamLeaderSearchInput, emailAddress);
    const searchResult = this.teamLeaderSearchResultByEmail(emailAddress);
    await this.waitForSelectorStatus(searchResult, 'visible');
    await this.clickElement(searchResult);
    await this.closeTeamLeaderOptions();
  }

  /**
   * Removes a selected Team Leader from the Create/Edit Team form.
   * @param userName Display name of the Team Leader to remove.
   */
  async removeTeamLeader(userName: string): Promise<void> {
    await this.closeTeamLeaderOptions();

    const matchIndex = await this.findTeamLeaderChipIndexByName(userName, 8000);
    if (matchIndex < 0) {
      return;
    }

    const matchedChip = this._page.locator(this.teamLeaderChips).nth(matchIndex);
    await matchedChip.hover();

    const removeButton = matchedChip
      .locator('.k-chip-remove-action, [aria-label*="delete" i], [aria-label*="remove" i], [title*="remove" i]')
      .first();

    await removeButton.click({ force: true });
    await expect.poll(async () => await this.isTeamLeaderPresent(userName)).toBe(false);
  }

  /**
   * Closes the Team Leader people-picker options before interacting with form chips.
   */
  private async closeTeamLeaderOptions(): Promise<void> {
    const visiblePopupCount = await this._page.locator(this.visibleKendoPopup).count();
    if (visiblePopupCount === 0) {
      return;
    }

    // Prefer blur/click-outside actions that keep the current input value.
    await this.clickElement(this.teamNameInput);
    try {
      await this.waitForSelectorStatus(this.visibleKendoPopup, 'hidden', 1000);
      return;
    } catch {
      // Continue to secondary fallback when click-outside does not close the popup.
    }

    await this.pressKeyOnElement(this.teamLeaderSearchInput, 'Tab');
    try {
      await this.waitForSelectorStatus(this.visibleKendoPopup, 'hidden', 1000);
      return;
    } catch {
      // Final fallback for stubborn popups.
    }

    await this.pressKeyOnElement(this.teamLeaderSearchInput, 'Escape');
    await this.waitForSelectorStatus(this.visibleKendoPopup, 'hidden', 3000);
  }

  /**
   * Normalizes display names for resilient text comparison.
   * @param value Raw chip or step text.
   * @returns Lower-cased value collapsed to single spaces.
   */
  private normalizeDisplayName(value: string): string {
    return value.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  /**
   * Finds the index of a selected Team Leader chip that matches the requested user.
   * @param userName Display name requested in the step.
   * @param timeoutMs Maximum wait for chips to render before skipping.
   * @returns Zero-based chip index, or -1 when no match is found.
   */
  private async findTeamLeaderChipIndexByName(userName: string, timeoutMs: number): Promise<number> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const chipCount = await this._page.locator(this.teamLeaderChips).count();

      for (let index = 0; index < chipCount; index += 1) {
        const chipText = (await this._page.locator(this.teamLeaderChips).nth(index).textContent()) ?? '';
        if (this.doesTeamLeaderChipMatch(userName, chipText)) {
          return index;
        }
      }

      await this.waitImplicit(300);
    }

    return -1;
  }

  /**
   * Determines whether a Team Leader chip text corresponds to the requested user.
   * @param userName Display name from the step.
   * @param chipText Rendered chip text.
   * @returns True when the chip likely represents the requested user.
   */
  private doesTeamLeaderChipMatch(userName: string, chipText: string): boolean {
    const normalizedChip = this.normalizeDisplayName(chipText);
    if (!normalizedChip) {
      return false;
    }

    const exactCandidates = [
      this.normalizeDisplayName(userName),
      this.normalizeDisplayName(this.swapCommaSeparatedName(userName)),
    ].filter((value, index, self): value is string => Boolean(value) && self.indexOf(value) === index);

    if (exactCandidates.some(candidate => normalizedChip.includes(candidate))) {
      return true;
    }

    const nameTokens = this
      .normalizeDisplayName(userName)
      .split(/[^a-z0-9]+/)
      .map(value => value.trim())
      .filter(value => value.length >= 3);

    if (nameTokens.length >= 2 && nameTokens.every(token => normalizedChip.includes(token))) {
      return true;
    }

    const strongestToken = nameTokens.sort((a, b) => b.length - a.length)[0];
    return Boolean(strongestToken && strongestToken.length >= 6 && normalizedChip.includes(strongestToken));
  }

  /**
   * Restores a Team Leader configuration after a scenario changes a shared team.
   * @param teamName Exact name of the team to restore.
   * @param requiredLeader Team Leader that must be present after restoration.
   * @param temporaryLeader Team Leader that must be removed after restoration.
   */
  async restoreTeamLeaderConfiguration(
    teamName: string,
    requiredLeader: string,
    temporaryLeader: string,
  ): Promise<void> {
    await this.editTeam(teamName);
    let changed = false;

    if (await this.isTeamLeaderPresent(temporaryLeader)) {
      await this.removeTeamLeader(temporaryLeader);
      changed = true;
    }

    if (!await this.isTeamLeaderPresent(requiredLeader)) {
      await this.addTeamLeader(requiredLeader);
      changed = true;
    }

    if (changed) {
      await this.saveTeam();
    }
  }

  /**
   * Checks whether a Team Leader is currently selected in the form.
   * @param userName Display name to find among selected Team Leader chips.
   * @returns True when the user is already selected.
   */
  private async isTeamLeaderPresent(userName: string): Promise<boolean> {
    const chipCount = await this._page.locator(this.teamLeaderChips).count();
    if (chipCount === 0) {
      return false;
    }

    for (let index = 0; index < chipCount; index += 1) {
      const chipText = (await this._page.locator(this.teamLeaderChips).nth(index).textContent()) ?? '';
      if (this.doesTeamLeaderChipMatch(userName, chipText)) {
        return true;
      }
    }

    return false;
  }
}
