import { Then, When } from './fixtures';
import { registerScenarioCleanup } from './scenarioCleanup.hooks';

When('press "Edit" button for the first team in the "Team Management" page', async ({ teamManagementPage }) => {
  await teamManagementPage.editFirstTeam();
});

When('open the Add Team Members dialog', async ({ teamManagementPage }) => {
  await teamManagementPage.openAddTeamMembersDialog();
});

When('enter {string} in the Team Management {string} field', async ({ teamManagementPage }, value: string, fieldLabel: string) => {
  await teamManagementPage.enterCreateEditTeamField(value, fieldLabel);
});

When('select {string} option in the "Search user" field', async ({ teamManagementPage }, userName: string) => {
  await teamManagementPage.selectTeamMemberToAdd(userName);
});

When('press "Add User" button in the "Add Team Members" popup', async ({ teamManagementPage }) => {
  await teamManagementPage.addSelectedTeamMembers();
});

Then(
  'verify the warning messages {string} for mandatory fields {string} are displayed on the {string} page',
  async ({ teamManagementPage }, messages: string, fields: string, pageName: string) => {
    if (pageName !== 'Create/Edit Team') {
      throw new Error(`Mandatory field warnings are not supported on the "${pageName}" page.`);
    }

    await teamManagementPage.verifyMandatoryFieldWarningMessages(messages, fields);
  },
);

When('press "Save" button on the {string} page', async ({ teamManagementPage }, pageName: string) => {
  if (pageName !== 'Create/Edit Team') {
    throw new Error(`The Save button is not supported on the "${pageName}" page.`);
  }

  await teamManagementPage.saveTeam();
});

When('leave the current team from the "Create/Edit Team" page', async ({ teamManagementPage }) => {
  await teamManagementPage.leaveCurrentTeam();
});

When('click on {string} button for the {string} team', async ({ teamManagementPage }, buttonName: string, teamName: string) => {
  if (buttonName !== 'Edit') {
    throw new Error(`Team Management button "${buttonName}" is not supported.`);
  }

  await teamManagementPage.editTeam(teamName);
});

When('add {string} in the {string} field', async ({ teamManagementPage }, emailAddress: string, fieldLabel: string) => {
  if (fieldLabel === 'Team Leader') {
    await teamManagementPage.addTeamLeader(emailAddress);
    return;
  }

  if (fieldLabel === 'Search user') {
    await teamManagementPage.selectTeamMembersToAdd(emailAddress);
    return;
  }

  if (fieldLabel !== 'Team Leader' && fieldLabel !== 'Search user') {
    throw new Error(`Team Management field "${fieldLabel}" is not supported.`);
  }
});

When('remove {string} from the {string} field if exists', async ({ teamManagementPage }, userName: string, fieldLabel: string) => {
  if (fieldLabel !== 'Team Leader') {
    throw new Error(`Team Management field "${fieldLabel}" is not supported.`);
  }

  await teamManagementPage.removeTeamLeader(userName);
});

When('search for {string} in the Team Name field', async ({ teamManagementPage }, teamName: string) => {
  await teamManagementPage.searchTeamsByName(teamName);
});

When('search for {string} in the Team Members table email field', async ({ teamManagementPage }, emailAddress: string) => {
  await teamManagementPage.searchTeamMembersByEmail(emailAddress);
});

Then('verify filters are applied', async ({ teamManagementPage }) => {
  await teamManagementPage.verifyTeamMembersEmailFilterIsApplied();
});

When('click on {string} button from the Team Members table email field', async ({ teamManagementPage }, buttonName: string) => {
  if (buttonName.toLowerCase() !== 'filter') {
    throw new Error(`Team Members table email field button "${buttonName}" is not supported.`);
  }

  await teamManagementPage.clearTeamMembersEmailFilter();
});

When('click on {string} icon against the team member {string}', async ({ teamManagementPage }, iconName: string, emailAddress: string) => {
  if (iconName !== 'Delete') {
    throw new Error(`Team member icon "${iconName}" is not supported.`);
  }

  await teamManagementPage.deleteTeamMember(emailAddress);
});

When('ensure the team {string} does not exist', async ({ teamManagementPage }, teamName: string) => {
  await teamManagementPage.removeTeamIfPresent(teamName);
});

When(
  'ensure the team {string} exists with Team Leader {string} and Team Member {string}',
  async ({ teamManagementPage }, teamName: string, leaderEmail: string, memberName: string) => {
    await teamManagementPage.ensureTeamExists(teamName, leaderEmail, memberName);
  },
);

When(
  'register the team {string} for cleanup',
  async ({ teamManagementPage, testData }, teamName: string) => {
    registerScenarioCleanup(testData, () => teamManagementPage.removeTeamIfPresent(teamName));
  },
);

Then('verify the user {string} is not available in the team leaders', async ({ teamManagementPage }, userName: string) => {
  await teamManagementPage.verifyUserIsNotAvailableInTeamLeaders(userName);
});

Then('verify the user {string} is available in the team leaders', async ({ teamManagementPage }, userName: string) => {
  await teamManagementPage.verifyUserIsAvailableInTeamLeaders(userName);
});

Then('verify the deleted team {string} is not available in the {string} page', async ({ teamManagementPage }, teamName: string, pageName: string) => {
  if (pageName !== 'Team Management') {
    throw new Error(`Deleted team availability is not supported for the "${pageName}" page.`);
  }

  await teamManagementPage.verifyDeletedTeamIsNotAvailable(teamName);
});

When(
  'register cleanup to restore {string} as Team Leader of {string}, remove {string}, and use portal {string}',
  async ({ commonPage, teamManagementPage, userManagementPage, testData }, requiredLeader: string, teamName: string, temporaryUserEmail: string, portalName: string) => {
    registerScenarioCleanup(testData, async () => {
      await commonPage.openNamedPage(`Team Management - ${portalName}`);
      await teamManagementPage.restoreTeamLeaderConfiguration(teamName, requiredLeader, temporaryUserEmail);
      await commonPage.openNamedPage(`User Management - ${portalName}`);
      await commonPage.selectTab('Non-Deloitte Admins');
      await userManagementPage.removeExternalUserIfPresent(temporaryUserEmail);
    });
  },
);