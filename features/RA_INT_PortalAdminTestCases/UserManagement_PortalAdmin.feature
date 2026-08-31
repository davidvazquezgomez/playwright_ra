@UserManagement @UserManagement_PortalAdmin
Feature: User Management for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario Outline: TC001_01_PortalAdmin_UserManagement - Verify User Management UI
    When click on "Global Inc" of the portals
    Then the "Overview" page is displayed
    When click on "User Management" option from the left navigation
    Then the "User Management" page is displayed
    And verify "<sections>" tabs are displayed in "User Management" page
    When press the "<sections>" section
    Then verify "<buttons>" buttons are displayed in the User Management page
    # MÃƒÂ©todo especÃƒÂ­fico en User Management por la casuÃƒÂ­stica de que el botÃƒÂ³n EXPORT USERS tiene un espacio inicial
    Then verify items are sorted in "ascending" order by "User Name" in the "User Management" page by default

    Examples:
      | sections            | buttons                                          |
      | Deloitte Users      | EXPORT USERS;Delete Selected Users;Add New User  |
      | Non-Deloitte Admins | EXPORT USERS;Delete Selected User;Add New Users  |
      | Non-Deloitte Users  | EXPORT USERS;Delete Selected Users;Add New Users |

  @readOnly
  Scenario Outline: TC001_02_PortalAdmin_UserManagement - Verify table column header and sorting
    Given the "User Management - Global Inc" page is open
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
      | Deloitte Users      | User Name |
      | Deloitte Users      | Email     |
      | Non-Deloitte Admins | User Name |
      | Non-Deloitte Admins | Email     |
      | Non-Deloitte Users  | User Name |
      | Non-Deloitte Users  | Email     |

  @mutable
  Scenario: TC002_01_PortalAdmin_UserManagement - Verify the Add Deloitte User dialog
    When click on "Global Inc" of the portals
    Then the "Overview" page is displayed
    When click on "User Management" option from the left navigation
    Then the "User Management" page is displayed
    And the "Deloitte Users" section is displayed
    When press "Add New User" button
    Then the "Add Deloitte User" pop up is displayed with the title "Add Deloitte User"
    When enter "br.dtt@deloitte.com" in the search user field
    And select "BR, Deloitte Brasil" from the search results
    Then verify the user "BR, Deloitte Brasil" is displayed
    When press "Close" button
    Then the "Add Deloitte User" pop up is closed

  @mutable @cleanup
  Scenario: TC002_02_PortalAdmin_UserManagement - Add and export a Deloitte User
    Given the "User Management - Global Inc" page is open
    And ensure the Deloitte user "br.dtt@deloitte.com" does not exist
    When press "Add New User" button
    And press "Save" button
    Then the warning message "User is required" is displayed
    When enter "br.dtt@deloitte.com" in the search user field
    And select "BR, Deloitte Brasil" from the search results
    And press "Save" button
    And search for "br.dtt@deloitte.com" in the User Management table "Email" field
    Then verify the user "br.dtt@deloitte.com" is displayed in the table
    And register the user "br.dtt@deloitte.com" for cleanup
    When press "Add New User" button
    And enter "br.dtt@deloitte.com" in the search user field
    And select "BR, Deloitte Brasil" from the search results
    And press "Save" button
    Then verify "BR, Deloitte Brasil is already associated with this client as Deloitte User." toast message is displayed in the "User Management" page
    When user click at "EXPORT USERS" link

  @mutable @cleanup
  Scenario: TC002_03_PortalAdmin_UserManagement - Create a Non-Deloitte Admin
    Given the "User Management - Global Inc" page is open
    When press the "Non-Deloitte Admins" section
    And ensure the external user "qa.admin@example.com" does not exist
    When press "Add New Users" button
    Then the "Add Non-Deloitte Admin" pop up is displayed with the title "Add Non-Deloitte Admin"
    When press "Save" button
    Then verify the warning message "First name is required;Last name is required;Email is required" for fields "First Name;Last Name;Email" is displayed
    When enter "QA" in the "First Name" field
    And enter "Admin" in the "Last Name" field
    And enter "qa.admin@example.com" in the "Email" field
    And enter "Regulatory Advantage Testing" in the "Company Name" field
    And press "Save" button
    And search for "qa.admin@example.com" in the User Management table "Email" field
    Then verify the user "qa.admin@example.com" is displayed in the table
    And register the external user "qa.admin@example.com" for cleanup

  @mutable @cleanup
  Scenario: TC002_04_PortalAdmin_UserManagement - Create a Non-Deloitte User without associations
    Given the "User Management - Global Inc" page is open
    When press the "Non-Deloitte Users" section
    And ensure the external user "qa.user@example.com" does not exist
    When press "Add New Users" button
    Then the "Add Non-Deloitte User" pop up is displayed with the title "Add Non-Deloitte User"
    When press "Save" button
    Then verify the warning message "First name is required;Last name is required;Email is required" for fields "First Name;Last Name;Email" is displayed
    When enter "QA" in the "First Name" field
    And enter "User" in the "Last Name" field
    And enter "qa.user@example.com" in the "Email" field
    And enter "Regulatory Advantage Testing" in the "Company Name" field
    When press "Save" button
    And search for "qa.user@example.com" in the User Management table "Email" field
    Then verify the user "qa.user@example.com" is displayed in the table
    And register the external user "qa.user@example.com" for cleanup

  @mutable @cleanup
  Scenario: TC002_05_PortalAdmin_UserManagement - Create a Non-Deloitte User for automatic allocation
    Given the "User Management - Global Inc" page is open
    When press the "Non-Deloitte Users" section
    And ensure the external user "qa.allocation@example.com" does not exist
    When press "Add New Users" button
    And enter "QA" in the "First Name" field
    And enter "Allocation" in the "Last Name" field
    And enter "qa.allocation@example.com" in the "Email" field
    And enter "Regulatory Advantage Testing" in the "Company Name" field
    And press "Save" button
    And search for "qa.allocation@example.com" in the User Management table "Email" field
    Then verify the user "qa.allocation@example.com" is displayed in the table
    And register the external user "qa.allocation@example.com" for cleanup

  @mutable
  Scenario: TC002_06_PortalAdmin_UserManagement - Verify user is not able to add Non-Deloitte Users with invalid characters
    Given the "User Management - Global Inc" page is open
    When press the "Non-Deloitte Users" section
    When press "Add New Users" button
    Then the "Add Non-Deloitte User" pop up is displayed with the title "Add Non-Deloitte User"
    When enter ",.-Ã‚Â´ÃƒÂ§`+'Ã‚Â¡" in the "First Name" field
    And enter ",.-Ã‚Â´ÃƒÂ§`+'Ã‚Â¡" in the "Last Name" field
    And enter "invalid-email" in the "Email" field
    When press "Save" button
    Then verify the warning message "Please enter a valid email address" for fields "Email" is displayed
    When enter "example@example.com" in the "Email" field
    And enter ",.-Ã‚Â´ÃƒÂ§`+'Ã‚Â¡" in the "Company Name" field
    When press "Save" button
    Then verify "Error inviting external user. Given Name contains invalid characters. Only letters, numbers, spaces, apostrophes (straight/curly/backtick), hyphens, periods, and square brackets are allowed" toast message is displayed in the "User Management" page
    When search for "example@example.com" in the User Management table "Email" field
    Then verify the user "example@example.com" is not displayed in the table

  @readOnly
  Scenario Outline: TC002_07_PortalAdmin_UserManagement - Verify user is able to export Non-Deloitte Users and Admins
    Given the "User Management - Global Inc" page is open
    When press the "<tab>" section
    When user click at "EXPORT USERS" link

    Examples:
      | tab                 | exportFileName                  |
      | Non-Deloitte Users  | Global_Inc_Non_Deloitte_Users_  |
      | Non-Deloitte Admins | Global_Inc_Non_Deloitte_Admins_ |

  @readOnly
  Scenario Outline: TC002_08_PortalAdmin_UserManagement - Verify user is able to search and filter the users in the table
    Given the "User Management - Global Inc" page is open
    When press the "<tab>" section
    And search for "<searchText>" in the User Management table "<column>" field
    Then verify the user "<user>" is displayed in the table
    When click on "Clear" button from the User Management table "<column>" field
    Then verify the filter is removed

    Examples:
      | tab                 | searchText           | column    | user                |
      | Deloitte Users      | Deloitte             | User Name | BR, Deloitte Brasil |
      | Deloitte Users      | br.dtt@deloitte.com  | Email     | BR, Deloitte Brasil |
      | Non-Deloitte Admins | QA, Admin            | User Name | QA, Admin           |
      | Non-Deloitte Admins | qa.admin@example.com | Email     | QA, Admin           |
      | Non-Deloitte Users  | QA, User             | User Name | QA, User            |
      | Non-Deloitte Users  | qa.user@example.com  | Email     | QA, User            |

  @mutable @cleanup
  Scenario: TC003_01_PortalAdmin_UserManagement - Delete the Deloitte User
    Given the "User Management - Global Inc" page is open
    And ensure the Deloitte user "br.dtt@deloitte.com" exists with name "BR, Deloitte Brasil"
    When select the user "br.dtt@deloitte.com" from the table
    When press "Delete Selected Users" button
    And press "Confirm" button
    Then verify "Selected user deleted successfully" toast message is displayed in the "User Management" page
    When search for "br.dtt@deloitte.com" in the User Management table "Email" field
    Then verify the user "br.dtt@deloitte.com" is not displayed in the table

  @mutable @cleanup
  Scenario: TC003_02_PortalAdmin_UserManagement - Delete the Non-Deloitte User without associations
    Given the "User Management - Global Inc" page is open
    When press the "Non-Deloitte Users" section
    And ensure the external user "qa.user@example.com" exists with first name "QA", last name "User", and company "Regulatory Advantage Testing"
    And select the user "qa.user@example.com" from the table
    When press "Delete Selected Users" button
    And press "Confirm" button
    Then verify "Selected user deleted successfully" toast message is displayed in the "User Management" page
    When search for "qa.user@example.com" in the User Management table "Email" field
    Then verify the user "qa.user@example.com" is not displayed in the table

  @mutable @cleanup
  Scenario: TC003_03_PortalAdmin_UserManagement - Delete the Non-Deloitte Admin assigned to an existing team
    Given the "Team Management - Global Inc" page is open
    When click on "User Management" option from the left navigation
    And press the "Non-Deloitte Admins" section
    And ensure the external user "qa.admin@example.com" exists with first name "QA", last name "Admin", and company "Regulatory Advantage Testing"
    When click on "Team Management" option from the left navigation
    When click on "Edit" button for the "01_QA_UserManagement" team
    And register cleanup to restore "sonigour, audit" as Team Leader of "01_QA_UserManagement", remove "qa.admin@example.com", and use portal "Global Inc"
    And remove "sonigour, audit" from the "Team Leader" field
    And add "qa.admin@example.com" in the "Team Leader" field
    And press "Save" button
    When click on "User Management" option from the left navigation
    Then the "User Management" page is displayed
    When press the "Non-Deloitte Admins" section
    And select the user "qa.admin@example.com" from the table
    When press "Delete Selected User" button
    Then the "Delete User" pop up is displayed with the title "Delete User"
    When press "Cancel" button
    And search for "qa.admin@example.com" in the User Management table "Email" field
    Then verify the user "qa.admin@example.com" is displayed in the table
    When select the user "qa.admin@example.com" from the table
    When press "Delete Selected User" button
    And select "sonigour, audit" as the replacement user
    And press "Next" button
    And press "Reassign" button
    And press "Confirm Deletion" button
    Then verify "Selected user deleted successfully" toast message is displayed in the "User Management" page
    When search for "qa.admin@example.com" in the User Management table "Email" field
    Then verify the user "qa.admin@example.com" is not displayed in the table
    When click on "Team Management" option from the left navigation
    And search for "01_QA_UserManagement" in the Team Name field
    Then verify the user "QA, Admin" is not available in the team leaders

  @mutable @cleanup
  Scenario: TC003_04_PortalAdmin_UserManagement - Delete the Non-Deloitte user assigned to an existing automatic allocation
    Given the "Automatic Allocation of Updates - Global Inc" page is open
    When click on "User Management" option from the left navigation
    And press the "Non-Deloitte Users" section
    And ensure the external user "qa.allocation@example.com" exists with first name "QA", last name "Allocation", and company "Regulatory Advantage Testing"
    When click on "Automatic Allocation of Updates" option from the left navigation
    When click on "Edit Allocation" icon for the "01_QA_UserManagement" allocation
    And register cleanup to restore the recipient of the "01_QA_UserManagement" allocation, remove "qa.allocation@example.com", and use portal "Global Inc"
    And add the user "qa.allocation@example.com" in the "Search for Teams and Users" field
    And press "Save" button
    And press "Update anyway" button
    When click on "User Management" option from the left navigation
    Then the "User Management" page is displayed
    When press the "Non-Deloitte Users" section
    And select the user "qa.allocation@example.com" from the table
    When press "Delete Selected Users" button
    Then the "Delete User" pop up is displayed with the title "Delete User"
    When press "Cancel" button
    And search for "qa.allocation@example.com" in the User Management table "Email" field
    Then verify the user "qa.allocation@example.com" is displayed in the table
    When select the user "qa.allocation@example.com" from the table
    When press "Delete Selected Users" button
    And select "sonigour, audit" as the replacement user
    And press "Next" button
    And press "Reassign" button
    And press "Confirm Deletion" button
    Then verify "Selected user deleted successfully" toast message is displayed in the "User Management" page
    When search for "qa.allocation@example.com" in the User Management table "Email" field
    Then verify the user "qa.allocation@example.com" is not displayed in the table
