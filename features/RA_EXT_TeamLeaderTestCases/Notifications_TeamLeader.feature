@Notifications @Notifications_TeamLeader
Feature: Notifications for Team Leader

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TeamLeader"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_1_TeamLeader_Notifications - Verify Notifications Preferences at user level
    Given the "Notification Preferences" page is open
    Then verify "Updates" section is visible with notification options for the following "Set as responsible person;Changes to Update Status (where on the team);Changes to Update Priority (where on the team);Update now within 30 days of effective date and not yet closed;Update now within 7 days of effective date and not yet closed;Update becomes effective today and not yet closed"
    And verify "Actions" section is visible with notification options for the following "Allocated an Action;Changes to Action Status (where assigned to Action);Changes to Action Priority (where assigned to Action);Action due tomorrow and not yet complete;Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team;Removed from team"
    And verify "Periodic Summary Emails" section is visible with notification option "Periodic summary of Updates and Actions via email?"

  @mutable
  Scenario: TC001_2_TeamLeader_Notifications - Verify disable Notifications Preferences at user level
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
  Scenario: TC002_1_TeamLeader_Notifications - Verify enable Notifications Preferences for updates
    Given the "Notification Preferences" page is open
    When check "Select All" Check box under "System" option from "Updates" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Updates" section if it is "unchecked"
    When select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Disabled"
    And select the frequency option "Daily" located under "Periodic Summary of Updates and Actions via email?" section
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC002_2_TeamLeader_Notifications - Verify triggered notifications for updates
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "People Law" update from the "Updates Dashboard - 01_QA_StageTestPortal" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then the "Update Details" page is displayed from the Updates Dashboard
    When toggle the selected update priority between "High" and "Medium"
    And select "Awaiting Allocation" option in the "Status" field in the "Update Details" subsection
    When press "Save" button on the selected update
    Then verify "Regulatory Update Updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC002_3_TeamLeader_Notifications - Verify disabled Notifications Preferences for Updates
    Given the "Notification Preferences" page is open
    When check "Select All" Check box under "System" option from "Updates" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Updates" section if it is "checked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Enabled"
    When press "Save Settings" button
    Then verify "01_QA_ClientPortalSetup updated successfully" toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC002_4_TeamLeader_Notifications - Verify triggered notifications for updates
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "People Law" update from the "Updates Dashboard - 01_QA_StageTestPortal" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
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
  Scenario: TC003_1_TeamLeader_Notifications - Verify enable Notifications Preferences for actions
    Given the "Notification Preferences" page is open
    When check "Select All" Check box under "System" option from "Actions" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Actions" section if it is "unchecked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Disabled"
    When press "Save Settings" button
    Then verify "01_QA_ClientPortalSetup updated successfully" toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC003_2_TeamLeader_Notifications - Verify triggered notifications for actions
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When search for "32Increase of maximum meal voucher vaalue" update from the "Updates Dashboard - 01_QA_StageTestPortal" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    Then the "Update Action" popup is displayed
    When select "Not Started" option in the "Status" field in the "Update Action" popup
    And toggle the selected action priority between "High" and "Medium"
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify the Systems notifications triggered

  @mutable
  Scenario: TC003_3_TeamLeader_Notifications - Verify disabled Notifications Preferences for Actions
    Given the "Notification Preferences" page is open
    When check "Select All" Check box under "System" option from "Actions" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Actions" section if it is "checked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Enabled"
    When press "Save Settings" button
    Then verify "01_QA_ClientPortalSetup updated successfully" toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC003_4_TeamLeader_Notifications - Verify triggered notifications for Actions
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    Then the "01_QA_StageTestPortal - Updates Dashboard" page is displayed
    When search for "32Increase of maximum meal voucher vaalue" update from the "Updates Dashboard - 01_QA_StageTestPortal" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    And select "Alam, Asjad" in the "User Assigned" field on the selected update
    When select "Update Allocated" option in the "Status" field in the "Update Details" subsection
    And toggle the selected update priority between "High" and "Medium"
    When press "Save" button on the selected update
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Notifications" button
    Then the "Notifications" popup is displayed
    When press "View All" button
    Then the "Notification Listing" page is displayed
    And verify there are no system notifications
