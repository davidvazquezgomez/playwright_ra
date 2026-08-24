@AutomaticAllocation @AutomaticAllocation_DeloitteUser
Feature: Automatic Allocation of Updates for Deloitte User

  Background:
    Given launch Regulatory Advantage application URL and login as Deloitte "DELOITTEUSER"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_DeloitteUser_AutomaticAllocation - Verify delete existing allocation
    Then verify if the user navigate to the selected client portal
    When verify Auto "Automatic Allocation of Updates" option available on the left menu
    Then click on the "Automatic Allocation of Updates" option
    And validate if user navigate to "Automatic Allocations" page
    When user click on "Remove Allocation" icon for any allocation at the "Automatic Allocations" page
    And verify a warning pop up appears with "Cancel" and "Delete" buttons
    And press "Cancel" button
    Then verify the allocation is listed in the table
    When user click on "Remove Allocation" icon for any allocation
    And verify a warning pop up appears with "Cancel" and "Delete" buttons
    And press "Delete" button
    And verify for success message after deleting the allocation
    Then verify the allocation is not listed in the table
    And logout from the application
