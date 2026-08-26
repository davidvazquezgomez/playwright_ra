@Notifications @Notifications_ClientUser
Feature: Notifications for Client User

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "CLIENTUSER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_2_ClientUser_Notifications - Verify Notifications Preferences has Actions and Teams Sections Available
    Given the "Notification Preferences" page is open
    Then verify "Actions" section is visible with notification options for the following "Allocated an Action; Changes to Action Status (where assigned to Action); Changes to Action Priority (where assigned to Action); Action due tomorrow and not yet complete; Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team; Removed from team"

  @mutable
  Scenario: TC001_3_ClientUser_Notifications - Verify enable or disable Notifications Preferences
    Given the "Notification Preferences" page is open
    When press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    When press "Cancel" button on the "Unsaved Changes" popup
    Then the "Default Notifications Settings" page is displayed
    When mouse hover on one of the notification type
    And verify the notification is currently disabled
    When switch the toggle to enable
    Then verify the toggle is enabled
    When press the "notification"
    Then verify the toggle is disabled
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC001_4_ClientUser_Notifications - Verify Notifications Preferences for Updates, Actions and Teams
    Given the "Notification Preferences" page is open
    When toggle "Set as responsible person" System notification option to be "enabled"
    When toggle "Changes to Update Status (where on the team)" System notification option to be "enabled"
    When toggle "Allocated an Action" System notification option to be "enabled"
    When toggle "Changes to Action Priority (where assigned to Action)" System notification option to be "enabled"
    When toggle "Added to team" System notification option to be "enabled"
    And press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
#Como Aqui solo verificamos que las opciones mencionadas sean visibles, no es necesario coger un portal especifico

  @mutable
  Scenario: TC002_1_ClientUser_Notifications - Verify Notifications Preferences at user level
    Given the "Notification Preferences" page is open
    Then the "Notification Preferences" page is displayed
    And verify "Updates" section is visible with notification options for the following "Set as responsible person;Changes to Update Status (where on the team);Changes to Update Priority (where on the team);Update now within 30 days of effective date and not yet closed;Update now within 7 days of effective date and not yet closed;Update becomes effective today and not yet closed"
    And verify "Actions" section is visible with notification options for the following "Allocated an Action;Changes to Action Status (where assigned to Action);Changes to Action Priority (where assigned to Action);Action due tomorrow and not yet complete;Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team;Removed from team"
    And verify "Periodic Summary Emails" section is visible with notification option "Periodic summary of Updates and Actions via email?"

  @mutable
  Scenario: TC002_2_ClientUser_Notifications - Verify enable or disable Notifications Preferences at user level
    Given the "Notification Preferences" page is open
    When select one notification type currently disabled
    Then switch the toggle to enable
    And press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    And press "Cancel" button on the "Unsaved Changes" popup
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    When refresh the page
    Then ensure persistence of the enabled setting
    When press the notification type again
    Then verify the toggle is disabled
    And identify a notification type currently enabled
    When switch the toggle to disabled
    Then verify the toggle is disabled
    When press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
    When refresh the settings page
    Then verify the disabled state persisted
