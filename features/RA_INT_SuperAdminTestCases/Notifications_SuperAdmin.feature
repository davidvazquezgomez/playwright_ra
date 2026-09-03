@Notifications @Notifications_SuperAdmin
Feature: Notifications for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_SuperAdmin_Notifications - Verify that when you access notification preferences by clicking the Edit button, the available frequency sections are displayed
    When click on "Edit" button on one of the portals list
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    And verify "Periodic Summary Emails" section is available
    And verify "Frequency" section is visible with radio button options for the following "Daily; Weekly; Every 2 weeks; Quarterly"
    And verify "Updates" section is visible with notification options for the following "Set as responsible person; Changes to Update Status (where on the team); Changes to Update Priority (where on the team); Update now within 30 days of effective date and not yet closed; Update now within 7 days of effective date and not yet closed; Update becomes effective today and not yet closed"

  @readOnly
  Scenario: TC001_2_SuperAdmin_Notifications - Verify Notifications Preferences has Actions and Teams Sections Available
    Given the "Notification Preferences" page is open
    Then verify "Actions" section is visible with notification options for the following "Allocated an Action; Changes to Action Status (where assigned to Action); Changes to Action Priority (where assigned to Action); Action due tomorrow and not yet complete; Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team; Removed from team"

  @mutable
  Scenario: TC001_3_SuperAdmin_Notifications - Verify Notifications Preferences for Updates, Actions and Teams
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
  Scenario: TC002_1_SuperAdmin_Notifications - Verify Notifications Preferences at user level
    Given the "Notification Preferences" page is open
    Then verify "Updates" section is visible with notification options for the following "Set as responsible person;Changes to Update Status (where on the team);Changes to Update Priority (where on the team);Update now within 30 days of effective date and not yet closed;Update now within 7 days of effective date and not yet closed;Update becomes effective today and not yet closed"
    And verify "Actions" section is visible with notification options for the following "Allocated an Action;Changes to Action Status (where assigned to Action);Changes to Action Priority (where assigned to Action);Action due tomorrow and not yet complete;Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team;Removed from team"
    And verify "Periodic Summary Emails" section is visible with notification option "Periodic summary of Updates and Actions via email?"

  @mutable
  Scenario: TC002_2_SuperAdmin_Notifications - Verify disable Notifications Preferences at user level
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
  Scenario: TC003_1_SuperAdmin_Notifications - Verify enable Notifications Preferences for updates
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Given the "Notification Preferences" page is open
    Then the "Notifications Preferences" page is displayed
    When check "Select All" Check box under "System" option from "Updates" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Updates" section if it is "unchecked"
    When select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Disabled"
    And select the frequency option "Daily" located under "Periodic Summary of Updates and Actions via email?" section
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "Deloitte" user "SUPERADMIN"
    Then the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "Stage Test_1" update from the "Updates Dashboard - 01_QA_StageTestPortal" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then the "Update Details" page is displayed from the Updates Dashboard
    When toggle the selected update priority between "High" and "Medium"
    And select "Update Allocated" option in the "Status" field in the "Update Details" subsection
    When press "Save" button on the selected update
    Then verify "Regulatory Update Updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    And logout from the application

  @readOnly
  Scenario: TC003_2_SuperAdmin_Notifications - Verify triggered notifications for updates
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Then press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC003_3_SuperAdmin_Notifications - Verify disabled Notifications Preferences for Updates
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Given the "Notification Preferences" page is open
    Then the "Notifications Preferences" page is displayed
    When check "Select All" Check box under "System" option from "Updates" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Updates" section if it is "checked"
    When select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "enabled"
    And select the frequency option "Daily" located under "Periodic Summary of Updates and Actions via email?" section
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "Deloitte" user "SUPERADMIN"
    Then the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "titlestageMultiselectLinkediD" update from the "Updates Dashboard - 01_QA_StageTestPortal" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then the "Update Details" page is displayed from the Updates Dashboard
    And select "Update Allocated" option in the "Status" field in the "Update Details" subsection
    When press "Save" button on the selected update
    Then verify "Regulatory Update Updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    And logout from the application

  @readOnly
  Scenario: TC003_4_SuperAdmin_Notifications - Verify triggered notifications for updates
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Then press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify there are no system notifications

  @mutable
  Scenario: TC004_1_SuperAdmin_Notifications - Verify enable Notifications Preferences for actions
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Given the "Notification Preferences" page is open
    Then the "Notifications Preferences" page is displayed
    When check "Select All" Check box under "System" option from "Actions" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Actions" section if it is "unchecked"
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "Deloitte" user "SUPERADMIN"
    Then the "01_QA_StageTestPortal - Actions Dashboard" page is open
    And search for "24Maximum social security contributions have been proposed" update in the "01_13Jan REG - Actions Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_13Jan REG - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When toggle the selected update priority between "High" and "Medium"
    And select "In Progress" option in the "Status" field in the "Update Action" popup
    When press "Update" button in the "Update Action" popup
    Then verify "Regulatory Update Updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    And logout from the application

  @readOnly
  Scenario: TC004_2_SuperAdmin_Notifications - Verify triggered notifications for actions
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Then press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC004_3_SuperAdmin_Notifications - Verify disabled Notifications Preferences for Actions
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Given the "Notification Preferences" page is open
    Then the "Notifications Preferences" page is displayed
    When check "Select All" Check box under "System" option from "Actions" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Actions" section if it is "checked"
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "Deloitte" user "SUPERADMIN"
    Then the "01_QA_StageTestPortal - Actions Dashboard" page is open
    And search for "24Maximum social security contributions have been proposed" update in the "01_13Jan REG - Actions Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_13Jan REG - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When toggle the selected update priority between "High" and "Medium"
    And select "Not Started" option in the "Status" field in the "Update Action" popup
    When press "Update" button in the "Update Action" popup
    Then verify "Regulatory Update Updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    And logout from the application

  @readOnly
  Scenario: TC004_4_SuperAdmin_Notifications - Verify triggered notifications for updates
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Then press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify there are no system notifications

  @mutable
  Scenario: TC005_1_SuperAdmin_Notifications - Verify enable Notifications Preferences for teams
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Given the "Notification Preferences" page is open
    Then the "Notifications Preferences" page is displayed
    When check "Select All" Check box under "System" option from "Teams" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Teams" section if it is "unchecked"
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "Deloitte" user "SUPERADMIN"
    Then the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    When press "Edit" button for the first team in the "Team Management" page
    Then the "Create/Edit Team" page is displayed
    When open the Add Team Members dialog
    Then the "Add Team Members" popup is displayed
    When select "clientadmin1, satest" option in the "Search user" field
    Then the "Team Management" page is displayed
    When press "Save" button
    And logout from the application

  @readOnly
  Scenario: TC005_2_SuperAdmin_Notifications - Verify triggered notifications for teams
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Then press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC005_3_SuperAdmin_Notifications - Verify disabled Notifications Preferences for Teams
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Given the "Notification Preferences" page is open
    Then the "Notifications Preferences" page is displayed
    When check "Select All" Check box under "System" option from "Teams" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Teams" section if it is "checked"
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "Deloitte" user "SUPERADMIN"
    Then the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When click on "Team Management" option from the left navigation
    Then the "Team Management" page is displayed
    When press "Edit" button for the first team in the "Team Management" page
    Then the "Create/Edit Team" page is displayed
    When open the Add Team Members dialog
    Then the "Add Team Members" popup is displayed
    When select "satesclientadmin, satestclientadmin" option in the "Search user" field
    Then the "Team Management" page is displayed
    When press "Save" button
    And logout from the application

  @readOnly
  Scenario: TC005_4_SuperAdmin_Notifications - Verify triggered notifications for teams
    When logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Then press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify there are no system notifications
