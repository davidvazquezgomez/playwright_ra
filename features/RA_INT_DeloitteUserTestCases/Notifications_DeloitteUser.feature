@Notifications @Notifications_DeloitteUser
Feature: Notifications for Deloitte User

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "DELOITTEUSER"
    Then the "Client Portal List" page is displayed
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_2_DeloitteUser_Notifications - Verify Notifications Preferences has Actions and Teams Sections Available
    Given the "Notification Preferences" page is open
    Then verify "Actions" section is visible with notification options for the following "Allocated an Action; Changes to Action Status (where assigned to Action); Changes to Action Priority (where assigned to Action); Action due tomorrow and not yet complete; Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team; Removed from team"

  @mutable
  Scenario: TC001_3_DeloitteUser_Notifications - Verify Notifications Preferences for Updates, Actions and Teams
    Given the "Notification Preferences" page is open
    When toggle "Set as responsible person" System notification option to be "enabled"
    When toggle "Changes to Update Status (where on the team)" System notification option to be "enabled"
    When toggle "Allocated an Action" System notification option to be "enabled"
    When toggle "Changes to Action Priority (where assigned to Action)" System notification option to be "enabled"
    When toggle "Added to team" System notification option to be "enabled"
    When toggle "Set as responsible person" System notification option to be "disabled"
    When toggle "Changes to Update Status (where on the team)" System notification option to be "disabled"
    When toggle "Allocated an Action" System notification option to be "disabled"
    When toggle "Changes to Action Priority (where assigned to Action)" System notification option to be "disabled"
    When toggle "Added to team" System notification option to be "disabled"
    And press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC002_1_DeloitteUser_Notifications - Verify Notifications Preferences at user level
    Given the "Notification Preferences" page is open
    Then verify "Updates" section is visible with notification options for the following "Set as responsible person;Changes to Update Status (where on the team);Changes to Update Priority (where on the team);Update now within 30 days of effective date and not yet closed;Update now within 7 days of effective date and not yet closed;Update becomes effective today and not yet closed"
    And verify "Actions" section is visible with notification options for the following "Allocated an Action;Changes to Action Status (where assigned to Action);Changes to Action Priority (where assigned to Action);Action due tomorrow and not yet complete;Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team;Removed from team"
    And verify "Periodic Summary Emails" section is visible with notification option "Periodic summary of Updates and Actions via email?"

  @mutable
  Scenario: TC002_2_DeloitteUser_Notifications - Verify disable Notifications Preferences at user level
    Given the "Notification Preferences" page is open
    When select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "disabled"
    And press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    When press "Cancel" button on the "Unsaved Changes" popup
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    When press "Profile" button
    Then verify "Notification Preferences;Release Notes;Log out" are displayed on the "Profile" section
    When press "Notification Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "enabled"
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC003_2_DeloitteUser_Notifications - Verify triggered notifications for updates
    When logout from the application
    Then launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    When press "Profile" button
    Then verify "Notification Preferences;Release Notes;Log out" are displayed on the "Profile" section
    When press "Notification Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When disable all user notification preferences
    Then verify all the "Notifications Preferences" are disabled
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    Then the "01_QA_StageTestPortal - Updates Dashboard" page is displayed
    When open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then the "Update Details" page is displayed from the Updates Dashboard
    When toggle the selected update priority between "High" and "Medium"
    And select "Update Allocated" option in the "Status" field in the "Update Details" subsection
    When press "Save" button on the selected update
    Then verify "Regulatory Update Updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC003_4_DeloitteUser_Notifications - Verify triggered notifications for updates
    When logout from the application
    Then launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    Then the "01_QA_StageTestPortal - Updates Dashboard" page is displayed
    When open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then the "Update Details" page is displayed from the Updates Dashboard
    When toggle the selected update priority between "High" and "Medium"
    And select "Update Allocated" option in the "Status" field in the "Update Details" subsection
    When press "Save" button on the selected update
    Then verify "Regulatory Update Updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify there are no system notifications

  @mutable
  Scenario: TC004_2_DeloitteUser_Notifications - Verify triggered notifications for actions
    When logout from the application
    Then launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    When press "Profile" button
    Then verify "Notification Preferences;Release Notes;Log out" are displayed on the "Profile" section
    When press "Notification Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When disable all user notification preferences
    Then verify all the "Notifications Preferences" are disabled
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    Then the "01_QA_StageTestPortal - Actions Dashboard" page is displayed
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When select "Not Started" option in the "Status" field in the "Update Action" popup
    And toggle the selected action priority between "High" and "Medium"
    When press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC004_4_DeloitteUser_Notifications - Verify triggered notifications for updates
    When logout from the application
    Then launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    Then the "01_QA_StageTestPortal - Updates Dashboard" page is displayed
    When open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    When select "Update Allocated" option in the "Status" field in the "Update Details" subsection
    And toggle the selected update priority between "High" and "Medium"
    When select "satestclientuser2, satestclientuser2" in the "User Assigned" field on the selected update
    When press "Save" button on the selected update
    Then verify "Regulatory update updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify there are no system notifications

  @mutable
  Scenario: TC005_2_DeloitteUser_Notifications - Verify triggered notifications for teams
    When logout from the application
    Then launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    When press "Profile" button
    Then verify "Notification Preferences;Release Notes;Log out" are displayed on the "Profile" section
    When press "Notification Preferences" button
    Then the "Notification Preferences" page is displayed
    When disable all user notification preferences
    Then verify all the "Notifications Preferences" are disabled
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    When press "Edit" button for the first team in the "Team Management" page
    Then the "Create/Edit Team" page is displayed
    When open the Add Team Members dialog
    Then the "Add Team Members" popup is displayed
    When select "clientadmin1, satest" option in the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    When press "Save" button on the "Create/Edit Team" page
    Then verify "Team updated successfully" toast message is displayed in the "Team Management" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC005_4_DeloitteUser_Notifications - Verify triggered notifications for teams
    When logout from the application
    Then launch Regulatory Advantage application URL and login as "external" user "CLIENTADMIN"
    When click on "01_QA_StageTestPortal" of the portals
    Then the "01_QA_StageTestPortal - Overview" page is displayed
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    When press "Edit" button for the first team in the "Team Management" page
    Then the "Create/Edit Team" page is displayed
    When open the Add Team Members dialog
    Then the "Add Team Members" popup is displayed
    When select "clientadmin1" option in the "Search user" field
    And press "Add User" button in the "Add Team Members" popup
    When press "Save" button on the "Create/Edit Team" page
    Then verify "Team updated successfully" toast message is displayed in the "Team Management" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify there are no system notifications
