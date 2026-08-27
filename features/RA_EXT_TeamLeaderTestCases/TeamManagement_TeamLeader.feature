@TeamManagement @TeamManagement_TeamLeader
Feature: Team Management for Team Leader

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMLEADER"
    And verify if applicable portals are displayed

  @mutable
  Scenario Outline: TC001_TeamLeader_TeamManagement - Verify UI validations for team set up, mandatory field validations and column sorting
    When click on "ClientPortal_20260212191012" Client Portal from the client portal list
    Then the "Overview" page is displayed
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    And verify the following column headings are displayed and sortable in the Teams table:
      | Team Name    |
      | Team Leaders |
      | Created Date |
      | Updated Date |
    When save the team from the "Create/Edit Team" page
    And try saving the allocation without "<mandatory field>"
    Then verify warning message displayed as "<warning message>"
    And logout from the application

    Examples:
      | mandatory field | warning message                      |
      | Team Name       | Team name is required                |
      | Team Leader     | At least one Team Leader is required |
      | Team Member     | At least one Team Member is required |

  @mutable
  Scenario: TC002_TeamLeader_TeamManagement - Verify user is able to edit and leave team
    Then verify it displays "Team Management" option from the left navigation
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    When click on "Edit" icon for an existing team
    And add "ndaextuser@outlook.com" in the "Team Leader" field
    And add the following Team Members:
      | test.user.1784145920996@gmail.com |
      | test.user.1783697990969@gmail.com |
      | test.user.1782906153337@gmail.com |
    When save the team from the "Create/Edit Team" page
    Then verify the success message is displayed after saving the team
    And verify the new Team Leader is added to the team
    And verify the saved changes are reflected in the team
    When search for "test.user.1784145920996@gmail.com" in the Team Members table
    Then verify filters are applied
    When click on "clear filter" or "filter" button
    Then verify the filter is removed and full results are shown
    When click on delete icon against the team member "TeamMemberRA@outlook.com"
    And press "Remove user" button
    When save the team from the "Create/Edit Team" page
    Then verify the success message is displayed after saving the team
    When click on "Edit" icon for the team
    And click on "Leave Team"
    Then confirm the leave action in the confirmation pop up
    Then verify the user is removed from the team (or appropriate confirmation is shown)
    And logout from the application
