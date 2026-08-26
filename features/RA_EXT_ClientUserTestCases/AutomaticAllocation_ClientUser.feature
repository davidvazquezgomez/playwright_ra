@AutomaticAllocation @AutomaticAllocation_ClientUser
Feature: Automatic Allocation of Updates for Client User

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "CLIENTUSER"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_01_ClientUser_AutomaticAllocation - Navigate to Automatic Allocation Setup
    And verify for client portal name "ClientPortal_20260209133616 - Overview"
    When click on "Automatic Allocation of Updates" option from the left navigation
    Then the "Automatic Allocation of Updates" page is displayed
    And verify if "Allocation Name; Jurisdiction; Impact Area; Allocate To" are displayed on the Automatic Allocation of Updates page
    When press "Create New Allocation" button
    Then the "Automatic Allocation Setup" page is displayed

  @readOnly
  Scenario Outline: TC001_02_ClientUser_AutomaticAllocation - Apply sorting and verify the table headers
    Given the "Automatic Allocation of Updates - ClientPortal_20260209133616" page is open
    Then verify "<column>" column header is displayed in the "Automatic Allocation of Updates" page
    When click on "<column>" column header in the "Automatic Allocation of Updates" page
    Then verify items are sorted in "ascending" order by "<column>" in the "Automatic Allocation of Updates" page
    When click on "<column>" column header in the "Automatic Allocation of Updates" page
    Then verify items are sorted in "descending" order by "<column>" in the "Automatic Allocation of Updates" page
    When click on "<column>" column header in the "Automatic Allocation of Updates" page
    Then verify sorting is removed for "<column>" in the "Automatic Allocation of Updates" page

    Examples:
      | column          |
      | Allocation Name |
      | Jurisdiction    |
      | Impact Area     |
      | Allocate To     |

  @mutable
  Scenario: TC001_03_ClientUser_AutomaticAllocation - Verify warning message validations before creating a new allocation
    Given the "Automatic Allocation Setup - ClientPortal_20260209133616" page is open
    And verify "Allocation Name;Impact Area(s);Jurisdiction(s);Allocate Update To;Update Owner;Update Watchlist" form fields are displayed in the Automatic Allocation Setup page
    When press "Save" button
    Then verify "Allocation Name is required; At least one option (Impact Area or Jurisdiction) must be selected.;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When fill the "Allocation Name" field with "QaTest"
    Then verify "At least one option (Impact Area or Jurisdiction) must be selected.;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When click on the "Impact Area(s)" checkbox
    Then verify "Impact Area(s) are required;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When select the "Taxation of equity & incentives" option in the "Impact Area(s)" field
    Then verify "Update Owner is required" field errors are displayed in the Automatic Allocation Setup page
    When click on the "Jurisdiction(s)" checkbox
    Then verify "Operator is required;Jurisdiction(s) are required;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When select the "AND" option in the "Operator" field
    And select the "Canada" option in the "Jurisdiction(s)" field
    Then verify "Update Owner is required." field errors are displayed in the Automatic Allocation Setup page

  @mutable @cleanup
  Scenario: TC001_04_ClientUser_AutomaticAllocation - Create and delete an allocation with the Cancel button
    Given the "Automatic Allocation Setup - ClientPortal_20260209133616" page is open
    And register cleanup to remove the "QaTest" allocation from portal "ClientPortal_20260209133616"
    When fill the "Allocation Name" field with "QaTest"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select the "AND" option in the "Operator" field
    Then select the "satestclientuser2, satestclientuser2" option in the "Update Owner" field
    Then select the "satestclientadmin, satestclientadmin" option in the "Update Watchlist" field
    And press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    And the popup message is "If you leave this page, your changes will be lost. Do you want to continue without saving?"
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify the "Impact Area(s)" checkbox is still selected
    And verify the "Jurisdiction(s)" checkbox is still selected
    And verify "AND" is still selected in the "Operator" field
    And verify "satestclientuser2, satestclientuser2" is still selected in the "Update Owner" field
    And verify "satestclientadmin, satestclientadmin" is still selected in the "Update Watchlist" field
    When press "Save" button
    Then verify "Allocation created successfully." toast message is displayed in the "Automatic Allocation of Updates" page
    And the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is present in the "Automatic Allocation of Updates" page
    When click on "Remove Allocation" icon from the allocation "QaTest"
    Then the "Confirm Deletion" popup is displayed
    And press "Delete" button
    Then verify "Allocation deleted successfully." toast message is displayed in the "Automatic Allocation Setup" page

  @readOnly
  Scenario: TC001_05_ClientUser_AutomaticAllocation - Cancel allocation creation with the "Cancel" button
    Given the "Automatic Allocation Setup - ClientPortal_20260209133616" page is open
    When fill the "Allocation Name" field with "QaTest"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select the "AND" option in the "Operator" field
    And select the "satestclientuser2, satestclientuser2" option in the "Update Owner" field
    When press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    When press "Continue" button on the "Unsaved Changes" popup
    Then the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is not in the "Automatic Allocation of Updates" page

  @readOnly
  Scenario: TC001_06_ClientUser_AutomaticAllocation - Cancel allocation creation with the "Back" button
    Given the "Automatic Allocation Setup - ClientPortal_20260209133616" page is open
    When fill the "Allocation Name" field with "QaTest"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select the "AND" option in the "Operator" field
    And select the "satestclientuser2, satestclientuser2" option in the "Update Owner" field
    When press "Back" button
    Then the "Unsaved Changes" popup is displayed
    And the popup message is "If you leave this page, your changes will be lost. Do you want to continue without saving?"
    When press "Continue" button on the "Unsaved Changes" popup
    Then the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is not in the "Automatic Allocation of Updates" page

  @mutable @cleanup
  Scenario: TC001_07_ClientUser_AutomaticAllocation - Create and delete an allocation with the Back button
    Given the "Automatic Allocation Setup - ClientPortal_20260209133616" page is open
    And register cleanup to remove the "QaTest" allocation from portal "ClientPortal_20260209133616"
    When fill the "Allocation Name" field with "QaTest"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select the "AND" option in the "Operator" field
    And select the "satestclientuser2, satestclientuser2" option in the "Update Owner" field
    And select the "audit, sonigour" option in the "Update Watchlist" field
    And press "Back" button
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify the "Impact Area(s)" checkbox is still selected
    And verify the "Jurisdiction(s)" checkbox is still selected
    And verify "AND" is still selected in the "Operator" field
    And verify "satestclientuser2, satestclientuser2" is still selected in the "Update Owner" field
    And verify "audit, sonigour" is still selected in the "Update Watchlist" field
    When press "Save" button
    Then verify "Allocation created successfully." toast message is displayed in the "Automatic Allocation Setup" page
    And the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is present in the "Automatic Allocation of Updates" page
    When click on "Remove Allocation" icon from the allocation "QaTest"
    Then the "Confirm Deletion" popup is displayed
    And press "Delete" button
    Then verify "Allocation deleted successfully." toast message is displayed in the "Automatic Allocation Setup" page

  @mutable @cleanup
  Scenario: TC003_01_ClientUser_AutomaticAllocation - Use multiple Jurisdiction and Impact Area selections
    Given the "Automatic Allocation Setup - ClientPortal_20260209133616" page is open
    And register cleanup to remove the "QaTest" allocation from portal "ClientPortal_20260209133616"
    When fill the "Allocation Name" field with "QaTest"
    Then click on the "Impact Area(s)" checkbox
    And select the "Select All" option in the "Impact Area(s)" field
    When click on the "Jurisdiction(s)" checkbox
    Then select the "Select All" option in the "Jurisdiction(s)" field
    And select the "AND" option in the "Operator" field
    And select the "satestclientuser2, satestclientuser2" option in the "Update Owner" field
    And press "Save" button
    Then verify "Allocation created successfully." toast message is displayed in the "Automatic Allocation Setup" page
    And the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is present in the "Automatic Allocation of Updates" page
    When click on "Remove Allocation" icon from the allocation "QaTest"
    Then the "Confirm Deletion" popup is displayed
    And press "Delete" button
    Then verify "Allocation deleted successfully." toast message is displayed in the "Automatic Allocation Setup" page

  @mutable @cleanup
  Scenario: TC004_01_ClientUser_AutomaticAllocation - Create and delete an allocation using a team
    Given the "Automatic Allocation Setup - ClientPortal_20260209133616" page is open
    And register cleanup to remove the "QaTest" allocation from portal "ClientPortal_20260209133616"
    When fill the "Allocation Name" field with "QaTest"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select the "AND" option in the "Operator" field
    And select the "StageTeam11Aug2026" option in the "Update Owner" field
    And verify "StageTeam11Aug2026" is still selected in the "Update Owner" field
    When select the "satestclientuser2, satestclientuser2" option in the "Update Owner" field
    And press "Save" button
    Then verify "Allocation created successfully." toast message is displayed in the "Automatic Allocation Setup" page
    And the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is present in the "Automatic Allocation of Updates" page
    When click on "Remove Allocation" icon from the allocation "QaTest"
    Then the "Confirm Deletion" popup is displayed
    And press "Delete" button
    Then verify "Allocation deleted successfully." toast message is displayed in the "Automatic Allocation Setup" page

  @mutable @cleanup
  Scenario: TC005_ClientUser_AutomaticAllocation - Verify warning message for duplicate allocations
    Given the "Automatic Allocation of Updates - ClientPortal_20260209133616" page is open
    And remove the "QaTest2" allocation if it exists
    And register cleanup to remove the "QaTest2" allocation from portal "ClientPortal_20260209133616"
    Then press "Create New Allocation" button
    And the "Automatic Allocation Setup" page is displayed
    When fill the "Allocation Name" field with "QaTest2"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select the "AND" option in the "Operator" field
    And select the "satestclientuser2, satestclientuser2" option in the "Update Owner" field
    And press "Save" button
    Then the "Duplicate automatic allocation detected" popup is displayed
    And the duplicate automatic allocation warning is displayed
    And verify "Create anyway;Cancel" buttons are displayed on the "Duplicate automatic allocation detected" popup
    When press "Create anyway" button
    Then verify "Allocation created successfully." toast message is displayed in the "Automatic Allocation Setup" page
    And the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest2" allocation is present in the "Automatic Allocation of Updates" page
    When click on "Remove Allocation" icon from the allocation "QaTest2"
    Then the "Confirm Deletion" popup is displayed
    And press "Delete" button
    Then verify "Allocation deleted successfully." toast message is displayed in the "Automatic Allocation Setup" page
