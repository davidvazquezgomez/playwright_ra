@TeamManagement @TeamManagement_PortalAdmin
Feature: Team Management for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario Outline: TC001_01_PortalAdmin_TeamManagement - Verify mandatory field validations for team setup
    When click on "Global Inc" of the portals
    Then the "Overview" page is displayed
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    When press "Create Team" button
    When press "Save" button on the "Create/Edit Team" page
    Then verify the warning messages "<warning message>" for mandatory fields "<mandatory field>" are displayed on the "Create/Edit Team" page

    Examples:
      | mandatory field                   | warning message                                                                                |
      | Team Name;Team Leader;Team Member | Team Name is required;At least one Team Leader is required;At least one Team Member is required |

  @readOnly
  Scenario Outline: TC001_02_PortalAdmin_TeamManagement - Verify Teams table column header and sorting
    Given the "Team Management - Global Inc" page is open
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

  @mutable @cleanup
  Scenario: TC002_01_PortalAdmin_TeamManagement - Create a team
    Given the "Team Management - Global Inc" page is open
    And ensure the team "QA_TEST_01" does not exist
    And register the team "QA_TEST_01" for cleanup
    When press "Create Team" button
    And enter "QA_TEST_01" in the Team Management "Team Name" field
    And enter "Additional information for the QA team" in the Team Management "Additional Information" field
    And add "validadmin@external.com" in the "Team Leader" field
    And open the Add Team Members dialog
    And add "externaluserra1@yopmail.com" in the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    When click on "Home" option from the left navigation
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    When press "Save" button on the "Create/Edit Team" page
    Then verify "Team created successfully." toast message is displayed in the "Team Management" page

  @mutable @cleanup
  Scenario: TC002_02_PortalAdmin_TeamManagement - Edit a created team
    Given the "Team Management - Global Inc" page is open
    And ensure the team "QA_TEST_01" exists with Team Leader "validadmin@external.com" and Team Member "externaluserra1@yopmail.com"
    And register the team "QA_TEST_01" for cleanup
    When click on "Edit" button for the "QA_TEST_01" team
    And add "ra.grewspec@gmail.com" in the "Team Leader" field
    And open the Add Team Members dialog
    And add "externaluserra2@yopmail.com;externaluserra3@yopmail.com;externaluserra4@yopmail.com" in the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    When press "Save" button on the "Create/Edit Team" page
    Then verify "Team updated successfully." toast message is displayed in the "Team Management" page
    Then verify the user "ra.grewspec@gmail.com" is available in the team leaders
    When search for "externaluserra2@yopmail.com" in the Team Members table email field
    Then verify filters are applied
    When click on "filter" button from the Team Members table email field
    Then verify the filter is removed
    When click on "Delete" icon against the team member "externaluserra1@yopmail.com"
    And press "Remove user" button
    When press "Save" button on the "Create/Edit Team" page
    Then verify "Team updated successfully." toast message is displayed in the "Team Management" page

  @mutable @cleanup
  Scenario: TC002_03_PortalAdmin_TeamManagement - Delete a created team
    Given the "Team Management - Global Inc" page is open
    And ensure the team "QA_TEST_01" exists with Team Leader "validadmin@external.com" and Team Member "externaluserra1@yopmail.com"
    And register the team "QA_TEST_01" for cleanup
    When click on "Remove" button for the "QA_TEST_01" team
    Then the "Warning" popup is displayed
    And verify "Delete;Cancel" buttons are displayed on the "Warning" popup
    When press "Delete" button on the "Warning" popup
    Then verify the deleted team "QA_TEST_01" is not available in the "Team Management" page
