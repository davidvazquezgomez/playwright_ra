import { Then, When } from './fixtures';
import { registerScenarioCleanup } from './scenarioCleanup.hooks';

When('press "Edit" button for the first team in the "Team Management" page', async ({ teamManagementPage }) => {
  await teamManagementPage.editFirstTeam();
});

When('open the Add Team Members dialog', async ({ teamManagementPage }) => {
  await teamManagementPage.openAddTeamMembersDialog();
});

When('select {string} option in the "Search user" field', async ({ teamManagementPage }, userName: string) => {
  await teamManagementPage.selectTeamMemberToAdd(userName);
});

When('press "Add User" button in the "Add Team Members" popup', async ({ teamManagementPage }) => {
  await teamManagementPage.addSelectedTeamMembers();
});

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
  if (fieldLabel !== 'Team Leader') {
    throw new Error(`Team Management field "${fieldLabel}" is not supported.`);
  }

  await teamManagementPage.addTeamLeader(emailAddress);
});

When('remove {string} from the {string} field', async ({ teamManagementPage }, userName: string, fieldLabel: string) => {
  if (fieldLabel !== 'Team Leader') {
    throw new Error(`Team Management field "${fieldLabel}" is not supported.`);
  }

  await teamManagementPage.removeTeamLeader(userName);
});

When('search for {string} in the Team Name field', async ({ teamManagementPage }, teamName: string) => {
  await teamManagementPage.searchTeamsByName(teamName);
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