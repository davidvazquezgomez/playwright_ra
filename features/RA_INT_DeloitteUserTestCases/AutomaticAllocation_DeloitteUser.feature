@AutomaticAllocation @AutomaticAllocation_DeloitteUser
Feature: Automatic Allocation of Updates for Deloitte User

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "DELOITTEUSER"
    And verify if applicable portals are displayed

  @mutable @cleanup
  Scenario: TC001_07_DeloitteUser_AutomaticAllocation - Delete an allocation
    Given the "Automatic Allocation of Updates - 01_13Jan REG" page is open
    When click on "Remove Allocation" icon from the first allocation
    Then the "Confirm Deletion" popup is displayed
    And press "Delete" button
    Then verify "Allocation deleted successfully." toast message is displayed in the "Automatic Allocation Setup" page
