@UserManagement @UserManagement_ClientAdmin
Feature: User Management for Client Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario Outline: TC001_02_ClientAdmin_UserManagement - Verify table column header and sorting
    Given the "User Management - ClientPortal_20260213081718" page is open
    When press the "<tab>" section
    Then verify "<column>" column header is displayed in the "User Management" page
    When click on "<column>" column header in the "User Management" page
    Then verify items are sorted in "ascending" order by "<column>" in the "User Management" page
    When click on "<column>" column header in the "User Management" page
    Then verify items are sorted in "descending" order by "<column>" in the "User Management" page
    When click on "<column>" column header in the "User Management" page
    Then verify sorting is removed for "<column>" in the "User Management" page

    Examples:
      | tab                 | column    |
      | Non-Deloitte Admins | User Name |
      | Non-Deloitte Admins | Email     |
      | Non-Deloitte Users  | User Name |
      | Non-Deloitte Users  | Email     |

  @readOnly
  Scenario Outline: TC002_ClientAdmin_UserManagement - Verify user can export, search, and clear filters
    Given the "User Management - ClientPortal_20260213081718" page is open
    When press the "<tab>" section
    When user click at "EXPORT USERS" link
    And search for "<searchText>" in the User Management table "<column>" field
    Then verify the user "<user>" is displayed in the table
    When click on "Clear" button from the User Management table "<column>" field
    Then verify the filter is removed

    Examples:
      | tab                 | column    | searchText | user      |
      | Non-Deloitte Admins | User Name | QA         | QA, Admin |
      | Non-Deloitte Admins | Email     | qa.admin@  | QA, Admin |
      | Non-Deloitte Users  | User Name | QA         | QA, User  |
      | Non-Deloitte Users  | Email     | qa.user@   | QA, User  |
