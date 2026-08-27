@TeamManagement @TeamManagement_ClientAdmin
Feature: Team Management for Client Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    And verify if applicable portals are displayed
    When click on "ClientPortal_20260213081718" Client Portal from the client portal list
    Then the "Overview" page is displayed

  @mutable
  Scenario Outline: TC001_ClientAdmin_TeamManagement - Verify UI validations for team set up, mandatory field validations and column sorting
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    And verify "Create Team" button is available
    When press "Create Team" button
    And verify the following column headings are displayed and sortable in the Teams table:
      | Team Name    |
      | Team Leaders |
      | Created Date |
      | Updated Date |
    When save the team from the "Create/Edit Team" page
    And try saving the allocation without <mandatory field>
    Then verify warning message displayed as "<warning message>"

    Examples:
      | mandatory field | warning message                      |
      | Team Name       | Team name is required                |
      | Team Leader     | At least one Team Leader is required |
      | Team Member     | At least one Team Member is required |

  @mutable
  Scenario: TC002_ClientAdmin_TeamManagement - Verify user is able to add, edit and leave team
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    And verify "Create Team" button is available
    When press "Create Team" button
    And enter a unique name in the "Team Name" field
    And enter "Additional information for the QA team" in the "Additional Information" field
    And add "TeamLeaderRA@outlook.com" in the "Team Leader" field
    And open the Add Team Members dialog
    And add "TeamMemberRA@outlook.com" on the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    Then verify the "TeamMemberRA@outlook.com" Team Member is added to the team member table
    When click on "Home" option from the left navigation
    Then verify a warning pop up appears with "continue" and "cancel" buttons
    When click on "Cancel" button in the confirmation pop up
    Then verify "Save" button is available
    When save the team from the "Create/Edit Team" page
    Then verify the success message is displayed after saving the team
    And verify the created team details are added to the "Team Management" table
    When click on "Edit" button of the created team in the Teams table
    And add "ndaextuser@outlook.com" in the "Team Leader" field
    And open the Add Team Members dialog
    And add the following Team Members on the "Search user" field:
      | test.user.1784145920996@gmail.com |
      | test.user.1783697990969@gmail.com |
      | test.user.1782906153337@gmail.com |
    And press "Add User" button in the "Add Team Members" popup
    Then verify the following Team Members are added to the team member table:
      | test.user.1784145920996@gmail.com |
      | test.user.1783697990969@gmail.com |
      | test.user.1782906153337@gmail.com |
    When save the team from the "Create/Edit Team" page
    Then verify the success message is displayed after saving the team
    And verify the new "Client, User" Team Leader is added to the team
    And verify the saved changes are reflected in the team
    When search for "test.user.1784145920996@gmail.com" in the Team Members table email field
    Then verify if filters applied
    When click on "filter" button from the Team Members table email field
    Then verify the filter is removed
    When click on "Delete" icon against the team member "TeamMemberRA@outlook.com"
    And press "Remove user" button
    When save the team from the "Create/Edit Team" page
    Then verify the success message is displayed after saving the team
    When click on "Remove" button of the created team in the Teams table
    Then verify a warning pop up appears with "Delete" and "Cancel" buttons
    When click on "Delete" button in the confirmation pop up
    Then verify the deleted team details are not available in the "Team Management" page
    And logout from the application
