import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TeamManagementPage extends BasePage {
  private teamGridRows = '[role="grid"][aria-label="Data table"] tbody tr.k-master-row';
  private createTeamButton = 'button:has(.k-button-text:text-is("Create Team"))';
  private firstTeamEditButton = `${this.teamGridRows}:first-child button[title^="Edit"]`;
  private addTeamMembersButton = 'button.add-save-btn:has(.k-button-text:text-is("Add Team Members"))';
  private addTeamMembersDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Add Team Members"))';
  private addTeamMemberSearchInput =
    `${this.addTeamMembersDialog} app-people-picker[formcontrolname="selectedPeople"] input[role="combobox"]`;
  private addTeamMemberSearchResultByName = (userName: string) =>
    `kendo-popup.k-animation-container-shown:visible li[role="option"]:has(.person-name:text-is("${userName}"))`;
  private addUserButton = `${this.addTeamMembersDialog} button[aria-label="Add User"]`;
  private saveTeamButton = 'button.add-save-btn[form="teamForm"]';
  private leaveTeamButton = 'button:has(.k-button-text:text-is("Leave Team"))';
  private teamNameInput = '#teamForm kendo-textbox[formcontrolname="teamName"] input.k-input-inner';
  private teamNameFilter = 'input[aria-label="Team Name Filter"]';
  private teamLeaderSearchInput = '#teamForm app-people-picker[formcontrolname="teamLeaders"] input[role="combobox"]';
  private visibleKendoPopup = 'kendo-popup.k-animation-container-shown:visible';
  private teamLeaderSearchResultByEmail = (emailAddress: string) =>
    `kendo-popup.k-animation-container-shown:visible li[role="option"]:has-text("${emailAddress}")`;
  private teamLeaderChipByName = (userName: string) =>
    `#teamForm app-people-picker[formcontrolname="teamLeaders"] .k-chip:has(.tag-person-name:text-is("${userName}"))`;
  private removeTeamLeaderChipButtonByName = (userName: string) =>
    `${this.teamLeaderChipByName(userName)} .k-chip-remove-action[aria-label="delete"]`;
  private teamRowByName = (teamName: string) =>
    `${this.teamGridRows}:has(td[data-kendo-grid-column-index="0"]:text-is("${teamName}"))`;
  private teamLeadersCell = 'td[data-kendo-grid-column-index="1"]';
  private editButtonByTeamName = (teamName: string) =>
    `${this.teamRowByName(teamName)} button[title^="Edit"]`;
  private removeButtonByTeamName = (teamName: string) =>
    `${this.teamRowByName(teamName)} button[title^="Remove"]`;
  private warningDialog = 'div[role="dialog"]:has(.k-dialog-title:text-is("Warning"))';
  private warningDeleteButton = `${this.warningDialog} button:has(.k-button-text:text-is("Delete"))`;

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
    await this.fillInputText(this.addTeamMemberSearchInput, userName);

    const searchResult = this.addTeamMemberSearchResultByName(userName);
    await this.waitForSelectorStatus(searchResult, 'visible');
    await this.clickElement(searchResult);
  }

  /**
   * Confirms the selected members in the Add Team Members dialog.
   */
  async addSelectedTeamMembers(): Promise<void> {
    await this.clickElement(this.addUserButton);
  }

  /**
   * Saves the current team from the Create/Edit Team form.
   */
  async saveTeam(): Promise<void> {
    await this.clickElement(this.saveTeamButton);
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
    await this.searchTeamsByName(teamName);
    const teamRow = this._page.locator(this.teamRowByName(teamName));
    if (await teamRow.count() === 0) {
      return;
    }

    await this.clickElement(this.removeButtonByTeamName(teamName));
    await this.clickElement(this.warningDeleteButton);
    await expect(teamRow).toHaveCount(0);
  }

  /**
   * Filters Team Management by an exact team name and opens that team's editor.
   * @param teamName Exact name of the team to edit.
   */
  async editTeam(teamName: string): Promise<void> {
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
   * Verifies that the filtered team's Team Leaders cell does not contain a user.
   * @param userName Display name that must not appear among the team's leaders.
   */
  async verifyUserIsNotAvailableInTeamLeaders(userName: string): Promise<void> {
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
    const teamLeaderChip = this._page.locator(this.teamLeaderChipByName(userName));
    if (await teamLeaderChip.count() === 0) {
      return;
    }

    await this.clickElement(this.removeTeamLeaderChipButtonByName(userName));
    await expect(teamLeaderChip).toHaveCount(0);
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

    if (await this._page.locator(this.teamLeaderChipByName(temporaryLeader)).count() > 0) {
      await this.removeTeamLeader(temporaryLeader);
      changed = true;
    }

    if (await this._page.locator(this.teamLeaderChipByName(requiredLeader)).count() === 0) {
      await this.addTeamLeader(requiredLeader);
      changed = true;
    }

    if (changed) {
      await this.saveTeam();
    }
  }
}
