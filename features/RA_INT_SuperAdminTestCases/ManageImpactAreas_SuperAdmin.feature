@ManageImpactAreas @ManageImpactAreas_SuperAdmin
Feature: Manage Impact Areas for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_01_SuperAdmin_ManageImpactAreas - Verify manage impact areas page loads and search
    When click on "Menu" option from the left navigation
    When click on "Manage Impact Areas" option from the left navigation
    Then the "Manage Impact Areas" page is displayed
    And verify existing impact areas are displayed in the "Manage Impact Areas" page
    When fill the "Impact Area Name" field with "US Payroll 2" value in the "Manage Impact Areas" page
    Then verify every impact area contains "US Payroll 2"
    When fill the "Impact Area Name" field with "Invalid Impact Area" value in the "Manage Impact Areas" page
    Then verify "There is no data to display." message is displayed in the "Manage Impact Areas" page

  @readOnly
  Scenario Outline: TC001_02_SuperAdmin_ManageImpactAreas - Verify column headers and sorting
    Given the "Manage Impact Areas" page is open
    Then verify "<column>" column header is displayed in the "Manage Impact Areas" page
    When click on "<column>" column header in the "Manage Impact Areas" page
    Then verify items are sorted in "ascending" order by "<column>" in the "Manage Impact Areas" page
    When click on "<column>" column header in the "Manage Impact Areas" page
    Then verify items are sorted in "descending" order by "<column>" in the "Manage Impact Areas" page
    When click on "<column>" column header in the "Manage Impact Areas" page
    Then verify sorting is removed for "<column>" in the "Manage Impact Areas" page

    Examples:
      | column           |
      | Knowledge Module |
      | Impact Area Name |
      | Date Created     |
      | Date Updated     |
      | Status           |

  @mutable
  Scenario: TC002_01_SuperAdmin_ManageImpactAreas - Verify editing an impact area
    Given the "Manage Impact Areas" page is open
    And the "Impact Area Test" impact area is restored in the "Manage Impact Areas" page
    When fill the "Impact Area Name" field with "Impact Area Test" value in the "Manage Impact Areas" page
    And click on the "Impact Area Test" impact area in the "Manage Impact Areas" page
    Then the "Edit Impact Area" page is displayed
    When set the "Impact Area Name" field to "Impact Area Test" on the "Edit Impact Area" page
    And press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify "Impact Area Test" value is displayed in the "Impact Area Name" field on the "Edit Impact Area" page
    When press "Save" button
    Then verify "Impact Area updated successfully" toast message is displayed in the "Manage Impact Areas" page
    And verify "Impact Area Test" impact area is displayed in the "Manage Impact Areas" page

  @mutable
  Scenario: TC002_02_SuperAdmin_ManageImpactAreas - Verify disabling, enabling and restoring an impact area
    Given the "Manage Impact Areas" page is open
    And the "Impact Area Test" impact area is restored in the "Manage Impact Areas" page
    When fill the "Impact Area Name" field with "Impact Area Test" value in the "Manage Impact Areas" page
    And click on the "Impact Area Test" impact area in the "Manage Impact Areas" page
    Then the "Edit Impact Area" page is displayed
    When press "Disable Impact Area" button
    Then the "Are you sure you want to disable this impact area?" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Are you sure you want to disable this impact area?" popup
    When press "Continue" button on the "Are you sure you want to disable this impact area?" popup
    Then verify "Impact Area disabled successfully" toast message is displayed in the "Edit Impact Area" page
    When press "Enable Impact Area" button
    Then the "Are you sure you want to enable this impact area?" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Are you sure you want to enable this impact area?" popup
    When press "Continue" button on the "Are you sure you want to enable this impact area?" popup
    Then verify "Impact Area enabled successfully" toast message is displayed in the "Edit Impact Area" page
    And verify "Disable Impact Area" buttons are displayed in the "Edit Impact Area" page
    When set the "Impact Area Name" field to "Impact Area Test Updated" on the "Edit Impact Area" page
    And press "Save" button
    Then verify "Impact Area updated successfully" toast message is displayed in the "Manage Impact Areas" page
    When fill the "Impact Area Name" field with "Impact Area Test Updated" value in the "Manage Impact Areas" page
    Then verify "Impact Area Test Updated" impact area is displayed in the "Manage Impact Areas" page
    When click on the "Impact Area Test Updated" impact area in the "Manage Impact Areas" page
    Then the "Edit Impact Area" page is displayed
    When set the "Impact Area Name" field to "Impact Area Test" on the "Edit Impact Area" page
    And press "Save" button
    Then verify "Impact Area updated successfully" toast message is displayed in the "Manage Impact Areas" page
    When fill the "Impact Area Name" field with "Impact Area Test" value in the "Manage Impact Areas" page
    Then verify "Impact Area Test" impact area is displayed in the "Manage Impact Areas" page
