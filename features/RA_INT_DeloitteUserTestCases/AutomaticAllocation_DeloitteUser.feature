@AutomaticAllocation @AutomaticAllocation_DeloitteUser
Feature: Automatic Allocation of Updates for Deloitte User

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "DELOITTEUSER"
    And verify if applicable portals are displayed

  @mutable @cleanup
  Scenario: TC001_07_DeloitteUser_AutomaticAllocation - Create and delete an allocation with the Back button
    Given the "Automatic Allocation Setup - 01_13Jan REG" page is open
    And register cleanup to remove the "QaTest" allocation from portal "01_13Jan REG"
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
