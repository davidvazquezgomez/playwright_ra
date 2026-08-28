@UserManagement @UserManagement_DeloitteUser
Feature: User Management for Deloitte User

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "DELOITTEUSER"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_01_DeloitteUser_UserManagement - Verify User Management UI
    When click on "QA_Test client3" of the portals
    Then the "Overview" page is displayed
    When click on "User Management" option from the left navigation
    Then the "User Management" page is displayed
    And verify "Deloitte Users" tabs are displayed in "User Management" page
    And verify "EXPORT USERS;Add New User" buttons are displayed in the "User Management" page
    Then verify items are sorted in "ascending" order by "User Name" in the "User Management" page by default

  @readOnly
  Scenario Outline: TC001_02_DeloitteUser_UserManagement - Verify User Management table column header and sorting
    Given the "User Management - QA_Test client3" page is open
    Then verify "<column>" column header is displayed in the "User Management" page
    When click on "<column>" column header in the "User Management" page
    Then verify items are sorted in "ascending" order by "<column>" in the "User Management" page
    When click on "<column>" column header in the "User Management" page
    Then verify items are sorted in "descending" order by "<column>" in the "User Management" page
    When click on "<column>" column header in the "User Management" page
    Then verify sorting is removed for "<column>" in the "User Management" page

    Examples:
      | column    |
      | User Name |
      | Email     |

  @mutable
  Scenario: TC002_01_DeloitteUser_UserManagement - Verify the Add Deloitte User dialog and export
    Given the "User Management - QA_Test client3" page is open
    And the "Deloitte Users" section is displayed
    When press "Add New User" button
    Then the "Add Deloitte User" pop up is displayed with the title "Add Deloitte User"
    When enter "br.dtt@deloitte.com" in the search user field
    And select "BR, Deloitte Brasil" from the search results
    Then verify the user "BR, Deloitte Brasil" is displayed
    When press "Close" button
    Then the "Add Deloitte User" pop up is closed
    When user click at "EXPORT USERS" link

  @readOnly
  Scenario Outline: TC002_02_DeloitteUser_UserManagement - Verify user is able to search and filter the users in the table
    Given the "User Management - QA_Test client3" page is open
    And search for "<searchText>" in the User Management table "<column>" field
    Then verify the user "<user>" is displayed in the table
    When click on "Clear" button from the User Management table "<column>" field
    Then verify the filter is removed

    Examples:
      | column    | searchText          | user                |
      | User Name | Deloitte            | BR, Deloitte Brasil |
      | Email     | br.dtt@deloitte.com | BR, Deloitte Brasil |
