import { Then, When } from './fixtures';

When('press "Edit" button for the first team in the "Team Management" page', async ({ teamManagementPage }) => {
  await teamManagementPage.editFirstTeam();
});

When('press "Add Team Members" button on the "Create/Edit Team" page', async ({ teamManagementPage }) => {
  await teamManagementPage.openAddTeamMembersDialog();
});

When('select {string} option in the "Search user" field', async ({ teamManagementPage }, userName: string) => {
  await teamManagementPage.selectTeamMemberToAdd(userName);
});

When('press "Add User" button in the "Add Team Members" popup', async ({ teamManagementPage }) => {
  await teamManagementPage.addSelectedTeamMembers();
});

When('save the team from the "Create/Edit Team" page', async ({ teamManagementPage }) => {
  await teamManagementPage.saveTeam();
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

Then('verify the user {string} is not available in the team leaders', async ({ teamManagementPage }, userName: string) => {
  await teamManagementPage.verifyUserIsNotAvailableInTeamLeaders(userName);
});