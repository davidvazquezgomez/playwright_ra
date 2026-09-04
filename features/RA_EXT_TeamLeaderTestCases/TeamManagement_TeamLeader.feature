@TeamManagement @TeamManagement_TeamLeader
Feature: Team Management for Team Leader

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMLEADER"
    And verify if applicable portals are displayed

  @mutable
  Scenario Outline: TC001_01_TeamLeader_TeamManagement - Verify mandatory field validations for team setup
    When click on "01_QA_StageTestPortal" of the portals
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
  Scenario Outline: TC001_02_TeamLeader_TeamManagement - Verify Teams table column header and sorting
    Given the "Team Management - 01_QA_StageTestPortal" page is open
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
  Scenario: TC002_01_TeamLeader_TeamManagement - Edit a created team
    Given the "Team Management - 01_QA_StageTestPortal" page is open
    And ensure the team "testttt" exists with Team Leader "ext-teamleadr@yopmail.com" and Team Member "smoke@gmail.com"
    And register the team "testttt" for cleanup
    When click on "Edit" button for the "testttt" team
    And add "satestclientadmin@yopmail.com" in the "Team Leader" field
    And open the Add Team Members dialog
    And add "asjad.alam@gmail.com" in the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    When press "Save" button on the "Create/Edit Team" page
    Then verify "Team updated successfully." toast message is displayed in the "Team Management" page
    Then verify the user "satestclientadmin" is available in the team leaders
    When search for "asjad.alam@gmail.com" in the Team Members table email field
    Then verify filters are applied
    When click on "filter" button from the Team Members table email field
    Then verify the filter is removed
    When click on "Delete" icon against the team member "asjad.alam@gmail.com"
    And press "Remove user" button
    When press "Save" button on the "Create/Edit Team" page
    Then verify "Team updated successfully." toast message is displayed in the "Team Management" page

  