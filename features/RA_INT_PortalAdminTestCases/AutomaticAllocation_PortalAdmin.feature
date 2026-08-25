@AutomaticAllocation @AutomaticAllocation_PortalAdmin
Feature: Automatic Allocation of Updates for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

    @mutable
  Scenario: TC001_01_PortalAdmin_AutomaticAllocation - Navigate to Automatic Allocation Setup
    When click on "Global Inc" of the portals
    And the "Global Inc - Overview" page is displayed
    When click on "Automatic Allocation of Updates" option from the left navigation
    Then the "Automatic Allocation of Updates" page is displayed
    And verify if "Allocation Name; Jurisdiction; Impact Area; Allocate To" are displayed on the Automatic Allocation of Updates page
    When press "Create New Allocation" button
    Then the "Automatic Allocation Setup" page is displayed

  @readOnly
  Scenario Outline: TC001_02_PortalAdmin_AutomaticAllocation - Apply sorting and verify the table headers
    Given the "Automatic Allocation of Updates - Global Inc" page is open
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
  Scenario: TC001_03_PortalAdmin_AutomaticAllocation - Verify warning message validations before creating a new allocation
    Given the "Automatic Allocation Setup - Global Inc" page is open
    Then verify "Allocation Name; Impact Area(s);Jurisdiction(s);Allocate Update To; Update Owner;Update Watchlist" form fields are displayed in the Automatic Allocation Setup page
    When press "Save" button
    Then verify "Allocation Name is required; At least one option (Impact Area or Jurisdiction) must be selected.;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When fill the "Allocation Name" field with "QaTest"
    Then verify "At least one option (Impact Area or Jurisdiction) must be selected.;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When click on the "Impact Area(s)" checkbox
    Then verify "Impact Area(s) are required;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When select the "Taxaction of equity & incentives" option in the "Impact Area(s)" field
    Then verify "Update Owner is required" field errors are displayed in the Automatic Allocation Setup page
    When click on the "Jurisdiction(s)" checkbox
    Then verify "Operator is required;Jurisdiction(s) are required;Update Owner is required." field errors are displayed in the Automatic Allocation Setup page
    When select "AND" in the "Operator" field
    And select "Canada" in the "Jurisdiction(s)" field
    Then verify "Update Owner is required." field errors are displayed in the Automatic Allocation Setup page

  @mutable @cleanup
  Scenario: TC001_04_PortalAdmin_AutomaticAllocation - Create and delete an allocation with the Cancel button
    Given the "Automatic Allocation Setup - Global Inc" page is open
    And register cleanup to remove the "QaTest" allocation from portal "Global Inc"
    When fill the "Allocation Name" field with "QaTest"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select "AND" in the "Operator" field
    When enter the "test, TesNonDeloitteUser" in the "Update Owner" field
    Then select "test, TesNonDeloitteUser" from the search results
    When enter the "UserTest2, TestDeloitte" in the "Update Watchlist" field
    Then select "UserTest2, TestDeloitte" from the search results
    And press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    And the popup message is "If you leave this page, your changes will be lost. Do you want to continue without saving?"
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify the "Impact Area(s)" checkbox is still selected
    And verify the "Jurisdiction(s)" checkbox is still selected
    And verify "AND" is still selected in the "Operator" field
    And verify "test, TesNonDeloitteUser" is still selected in the "Update Owner" field
    And verify "UserTest2, TestDeloitte" is still selected in the "Update Watchlist" field
    When press "Save" button
    Then verify the "Allocation created successfully." message appears
    And the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is present in the "Automatic Allocation of Updates" page
    When click on "Remove Allocation" icon from the allocation "QaTest"
    Then verify the "Confirm Deletion" pop up is displayed
    And press "Delete" button
    Then verify "Allocation deleted successfully." toast message is displayed in the "Automatic Allocation Setup" page

  @readOnly
  Scenario: TC001_05_PortalAdmin_AutomaticAllocation - Cancel allocation creation with the "Cancel" button
    Given the "Automatic Allocation Setup - Global Inc" page is open
    When fill the "Allocation Name" field with "QaTest"
    And click on the "Impact Area(s)" checkbox
    And select the "Employer tax reporting/filing requirements" option in the "Impact Area(s)" field
    And click on the "Jurisdiction(s)" checkbox
    And select the "Canada" option in the "Jurisdiction(s)" field
    And select "AND" in the "Operator" field
    When enter the "clientadmin1, satest" in the "Update Owner" field
    Then select "teammember, test" from the search results
    When press "Cancel" button
    Then verify the "Unsaved Changes" pop up is displayed
    When press "Cancel" button
    Then verify the "Automatic Allocation Setup" pop up is displayed
    When press "Continue" button
    Then verify the "Automatic Allocation of Updates" page is displayed
    And verify the "QaTest" allocation is not in the "Automatic Allocation of Updates" page
#   Scenario Outline: TC001_PortalAdmin_Automatic Allocation of Updates_Verify UI validations for Automatic Allocation set up and mandatory field validations
#    # verifico errores    
#     When Verify "Automatic Allocation of Updates" option available on the left menu
#     Then Click on the "Automatic Allocation of Updates" option
#     And Validate if user navigate to "Automatic Allocations" page
#     And Validate if "Create New Allocation" button is available
#     And Validate if "<Headings>" table are available
#     When the user click to sorts the "<Headings>" column
#     #desconozco si el orden es ascendente o descendente:
#     Then the results are displayed in the selected sort order 
#     When press "Create New Allocation" button
#     And Verify user is navigated to "Automatic Allocation Setup" page
#     And press "Save" button without any changes
#     Then Verify warning messages are displayed for every mandatory field
#     When user saves the form without a "Allocation Name" field
#     Then Verify warning message is displayed for "Allocation Name" field
#     And fill the "Allocation Name" field with valid data
#     When press "Save" button form without an "Allocate Update To" field checked
#     Then Verify warning messages are displayed for every mandatory field
#     When user check the "Impact Area" and "Jurisdiction" check boxes
#     Then a selector must get displayed for both "Impact Area" and "Jurisdiction"
#     And user should select the required "Impact Area" and "Jurisdiction" displayed options
#     When user click over "Operator" field
#     Then a selector should get displayed with the list of available operators
#     And user must select the required operator from the list
#     When user checks the "Update Owner" option at "Allocate Update To" field
#     Then a selector should get displayed with the list of available users
#     And user should select the required user from the list
#     When user checks the "Update Watchlist" option at "Allocate Update To" field
#     Then a selector should get displayed with the list of available users
#     And user should select the required user from the list
#     When press "Cancel" button or browser back button
#     And Verify a warning pop up appears with "Continue" and "Cancel" buttons
#     And press "Cancel" button
#     Then the user remains on the current page
#     When user click on "Cancel" button or browser back button
#     And Verify a warning pop up appears with "Continue" and "Cancel" buttons
#     And press "Continue" button
#     Then the user is navigated away from the page  
#     And Logout from the application
#         Examples:
#       | Headings        |
#       | Allocation Name |
#       | Jurisdiction    |
#       | Impact Area     |
#       | Allocate to     | 
#  Scenario: TC002_PortalAdmin_Automatic Allocation of Updates_Verify create new allocation, edit and delete existing allocation
#    # verifico creaciÃ³n y validaciÃ³n de campos.
#     When Click on any client portal from the list of client portal list
#     Then Verify if the user navigate to the selected client portal
#     When Verify Auto "Automatic Allocation of Updates" option available on the left menu
#     Then Click on the "Automatic Allocation of Updates" option
#     And Validate if user navigate to "Automatic Allocations" page
#     When press "Create New Allocation" button
#     And Verify user is navigated to "Automatic Allocation Setup" page
#     When fill the "Allocation Name" field with valid data
#     When user check the "Impact Area(s)" option
#     Then a "selector" field must get displayed
#     And select a required "Impact Area" option
#     And Search for an "Impact Area" by entering a value
#     Then verify if the "selector" field is populated
#     When user check the "Jurisdiction(s)" option
#     Then a "selector" field must get displayed
#     And select a required "Jurisdiction" option
#     And Search for a "Jurisdiction" by entering a value
#     Then verify if the "selector" field is populated      
#     When Select the "Update Owner" option
#     And Validate the "Search for Teams and Users" search field is enabled
#     When Search for a user by entering a value
#     Then Verify the list of users is populated
#     When Select a user from the list
#     And Verify the "Search for Teams and users" field is populated with the selected user
#     When Select the "Update Watchlist" option
#     And Validate the "Search for Users or Teams..." search field is enabled
#     When Search for a user by entering a value
#     Then Verify the list of users is populated
#     When Select a user from the list
#     Then Verify the field is populated with the selected user
#     When press "Save" button
#     And Verify for success message after saving the allocation
#     Then verify if the created allocation is listed in the "Automatic Allocations of Updates" page
#     And Logout from the application
#     Scenario: TC005_PortalAdmin_Automatic Allocation of Updates_Verify warning message for duplicate allocations
#     # verifico mensaje duplicados
#     When Click on any client portal from the list of "client portal list"
#     Then Verify if the user navigate to the selected client portal
#     When Verify Auto "Automatic Allocation of Updates" option available on the left menu
#     Then Press "Automatic Allocation of Updates" option
#     And Validate if user navigate to "Automatic Allocations" page
#     When press "Create New Allocation" button
#     And Verify user is navigated to "Automatic Allocation Setup" page
#     When fill the "Allocation Name" field with valid data
#     When user check the "Impact Area(s)" option
#     Then a "selector" field must get displayed
#     And select a required "Impact Area" option
#     And Search for an "Impact Area" by entering a value
#     Then verify if the "selector" field is populated
#     When user check the "Jurisdiction(s)" option
#     Then a "selector" field must get displayed
#     And select a required "Jurisdiction" option
#     And Search for a "Jurisdiction" by entering a value
#     Then verify if the "selector" field is populated      
#     When Select the "Update Owner" option
#     And Validate the "Search for Teams and Users" search field is enabled
#     When Search for a user by entering a value
#     Then Verify the list of users is populated
#     When Select a user from the list
#     And Verify the "Search for Teams and users" field is populated with the selected user
#     When Select the "Update Watchlist" option
#     And Validate the "Search for Users or Teams..." search field is enabled
#     When Search for a user by entering a value
#     Then Verify the list of users is populated
#     When Select a user from the list
#     Then Verify the field is populated with the selected user
#     When press "Save" button
#     Then verify if the warning message is displayed for duplicate "Automatic allocation(s) named 'RuleNames' already exists for the same Impact Area(s) and/or Jurisdiction(s).If you continue, the new rule will be created, but matching updates will be allocated according to oldest created rule(s). Do you want to proceed?"
#     When press "Cancel" button
#     Then verify if the user remains on the "Automatic Allocation Setup" page
#     When press "Save" button
#     Then verify if the warning message is displayed for duplicate "Automatic allocation(s) named 'RuleNames' already exists for the same Impact Area(s) and/or Jurisdiction(s).If you continue, the new rule will be created, but matching updates will be allocated according to oldest created rule(s). Do you want to proceed?"
#     When press "Create anyway" button
#     Then Allocation should be created
#     Then verify if the user remains on the "Automatic Allocation Setup" page
#     When user fill a new allocation with the same data
#     Then verify if the warning message is displayed for duplicate "Automatic allocation(s) named 'RuleNames' already exists for the same Impact Area(s) and/or Jurisdiction(s).If you continue, the new rule will be created, but matching updates will be allocated according to oldest created rule(s). Do you want to proceed?"
#     When press "Cancel" button
#     Then verify if the user remains on the "Automatic Allocation Setup" page
#     When press "Save" button
#     Then verify if the warning message is displayed for duplicate "Automatic allocation(s) named 'RuleNames' already exists for the same Impact Area(s) and/or Jurisdiction(s).If you continue, the new rule will be created, but matching updates will be allocated according to oldest created rule(s). Do you want to proceed?"
#     When press "Create anyway" button
#     Then Allocation should be created
#     Then verify if the warning message is displayed for duplicate "Automatic allocation(s) named 'RuleNames' already exists for the same Impact Area(s) and/or Jurisdiction(s).If you continue, the new rule will be created, but matching updates will be allocated according to oldest created rule(s). Do you want to proceed?"
#     When user click on "Create anyway" button
#     Then Allocation should be created
#     Then verify if the user remains on the "Automatic Allocation Setup" page
#     When user fill a new allocation with the same data
#     Then verify if the warning message is displayed for duplicate "Automatic allocation(s) named 'RuleNames' already exists for the same Impact Area(s) and/or Jurisdiction(s).If you continue, the new rule will be created, but matching updates will be allocated according to oldest created rule(s). Do you want to proceed?"
#     When press "Cancel" button
#     Then verify if the user remains on the "Automatic Allocation Setup" page
#     When press "Save" button
#     Then verify if the warning message is displayed for duplicate "Automatic allocation(s) named 'RuleNames' already exists for the same Impact Area(s) and/or Jurisdiction(s).If you continue, the new rule will be created, but matching updates will be allocated according to oldest created rule(s). Do you want to proceed?"
#     When press "Create anyway" button
#     Then Allocation should be created
#     And Verify for success message after saving the allocation
#     Then verify if the created allocation is listed in the "Automatic Allocations of Updates" page
#     Scenario: TC006_PortalAdmin_Automatic Allocation Edition_Verify and Deletion_Verify from a existing allocation
#     # verifico edicion
#     When Click on any client portal from the list of client portal list
#     Then Verify if the user navigate to the selected client portal
#     When Verify Auto "Automatic Allocation of Updates" option available on the left menu
#     Then Click on the "Automatic Allocation of Updates" option
#     And Validate if user navigate to "Automatic Allocations" page   
#     When user click on "Edit Allocation" icon for any allocation
#     Then Verify if user navigate to "Automatic Allocation Setup" page
#     When press "Cancel" button
#     Then Verify if user navigate to "Automatic Allocation Setup" page
#     When user click on browser back button
#     Then Verify if user navigate to "Automatic Allocation Setup" page
#     When user click on "Edit Allocation" icon for any allocation
#     Then Verify if user navigate to "Automatic Allocation Setup" page
#     When user click over "Operator" field
#     And user change the value
#     And press "Save" button
#     Then Verify for success message after saving the allocation
#     # verifico eliminar
#     When user click on "Remove Allocation" icon for any allocation at the "Automatic Allocations" page
#     And Verify a warning pop up appears with "Cancel" and "Delete" buttons
#     And press "Cancel" button
#     Then Verify the allocation is listed in the table
#     When user click on "Remove Allocation" icon for any allocation
#     And Verify a warning pop up appears with "Cancel" and "Delete" buttons
#     And press "Delete" button
#     And Verify for success message after deleting the allocation
#     Then Verify the allocation is not listed in the table
#     And Logout from the application
