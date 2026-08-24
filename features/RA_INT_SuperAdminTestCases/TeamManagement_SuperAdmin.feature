@TeamManagement @TeamManagement_SuperAdmin
Feature: Team Management for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario Outline: TC001_01_SuperAdmin_TeamManagement - Verify mandatory field validations for team setup
    When click on "01_13Jan REG" of the portals
    Then the "Overview" page is displayed
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    When press "Create Team" button
    And save the team from the "Create/Edit Team" page
    Then verify the warning message "First name is required;Last name is required;Email is required" for fields "First Name;Last Name;Email" is displayed

    Examples:
      | mandatory field | warning message                      |
      | Team Name       | Team name is required                |
      | Team Leader     | At least one Team Leader is required |
      | Team Member     | At least one Team Member is required |

  @readOnly
  Scenario Outline: TC001_02_SuperAdmin_TeamManagement - Verify Teams table column header and sorting
    Given the "Team Management - 01_13Jan REG" page is open
    Then verify "<column>" column header is displayed in the "Team Management" page
    When click on "<column>" column header in the "Team Management" page
    Then verify items are sorted in "ascending" order by "<column>" in the "Team Management" page
    When click on "<column>" column header in the "Team Management" page
    Then verify items are sorted in "descending" order by "<column>" in the "Team Management" page
    When click on "<column>" column header in the "Team Management" page
    Then verify sorting is removed for "<column>" in the "Team Management" page

    Examples:
      | column       |
      | Team Name    |
      | Team Leaders |
      | Created Date |
      | Updated Date |

  @mutable
  Scenario: TC002_01_SuperAdmin_TeamManagement - Create a team
    Given the "Team Management - 01_13Jan REG" page is open
    When press "Create Team" button
    And enter "QA_TEST_01" in the "Team Name" field
    And enter "Additional information for the QA team" in the "Additional Information" field
    And add "ext-teamleadr@yopmail.com" in the "Team Leader" field
    And press "Add Team Members" button on the "Create/Edit Team" page
    And add "smoke@gmail.com;test.user.1783697990969@gmail.com" in the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    When click on "Home" option from the left navigation
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    When save the team from the "Create/Edit Team" page
    Then verify "Team created successfully." toast message is displayed in the "Team Management" page

  @mutable
  Scenario: TC002_02_SuperAdmin_TeamManagement - Edit a created team
    Given the "Team Management - 01_13Jan REG" page is open
    When click on "Edit" button for the "QA_TEST_01" team
    And add "smriti.naidu@gmail.com" in the "Team Leader" field
    And press "Add Team Members" button on the "Create/Edit Team" page
    And add "test.user.1784145920996@gmail.com;test.user.1782906153337@gmail.com" in the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    And save the team from the "Create/Edit Team" page
    Then verify "Team updated successfully." toast message is displayed in the "Team Management" page
    Then verify the user "naidu, smriti" is available in the team leaders
    When search for "test.user.1784145920996@gmail.com" in the Team Members table email field
    Then verify if filters applied
    When click on "filter" button from the Team Members table email field
    Then verify the filter is removed
    When click on "Delete" icon for the team member "smoke@gmail.com"
    And press "Remove user" button
    And save the team from the "Create/Edit Team" page
    Then verify "Team updated successfully." toast message is displayed in the "Team Management" page

  @mutable
  Scenario: TC002_03_SuperAdmin_TeamManagement - Delete a created team
    Given the "Team Management - 01_13Jan REG" page is open
    When click on "Remove" button for the "QA_TEST_01" team
    Then the "Warning" popup is displayed
    And verify "Delete;Cancel" buttons are displayed on the "Warning" popup
    When press "Delete" button on the "Warning" popup
    Then verify the deleted team "QA_TEST_01" is not available in the "Team Management" page
    And logout from the application
