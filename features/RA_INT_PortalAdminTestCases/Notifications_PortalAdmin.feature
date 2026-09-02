@Notifications @Notifications_PortalAdmin
Feature: Notifications for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_PortalAdmin_Notifications - Verify that when you access notification preferences by clicking the Edit button, the available frequency sections are displayed
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
  Scenario: TC001_2_PortalAdmin_Notifications - Verify Notifications Preferences has Actions and Teams Sections Available
    Given the "Notification Preferences" page is open
    Then verify "Actions" section is visible with notification options for the following "Allocated an Action; Changes to Action Status (where assigned to Action); Changes to Action Priority (where assigned to Action); Action due tomorrow and not yet complete; Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team; Removed from team"

  @mutable
  Scenario: TC001_3_PortalAdmin_Notifications - Verify Notifications Preferences for Updates, Actions and Teams
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
  Scenario: TC002_1_PortalAdmin_Notifications - Verify Notifications Preferences at user level
    Given the "Notification Preferences" page is open
    Then verify "Updates" section is visible with notification options for the following "Set as responsible person;Changes to Update Status (where on the team);Changes to Update Priority (where on the team);Update now within 30 days of effective date and not yet closed;Update now within 7 days of effective date and not yet closed;Update becomes effective today and not yet closed"
    And verify "Actions" section is visible with notification options for the following "Allocated an Action;Changes to Action Status (where assigned to Action);Changes to Action Priority (where assigned to Action);Action due tomorrow and not yet complete;Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team;Removed from team"
    And verify "Periodic Summary Emails" section is visible with notification option "Periodic summary of Updates and Actions via email?"

  @mutable
  Scenario: TC002_2_PortalAdmin_Notifications - Verify disable Notifications Preferences at user level
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
  Scenario: TC003_1_PortalAdmin_Notifications - Verify enable Notifications Preferences for updates
    When press "Edit Client" button for the "Global Inc" client portal
    Then the "Client Portal Setup" page is displayed
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under "System" option from "Updates" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Updates" section if it is "unchecked"
    And check "Select All" Check box under "Lock Settings" option from "Updates" section if it is "unchecked"
    When select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Disabled"
    And select the frequency option "Daily" located under "Periodic Summary of Updates and Actions via email?" section
    When press "Update Portal" button
    Then verify "Global Inc updated successfully" toast message is displayed in the "Client Portal List" page


  @mutable
  Scenario: TC003_3_PortalAdmin_Notifications - Verify disabled Notifications Preferences for Updates
    When press "Edit Client" button for the "Global Inc" client portal
    Then the "Client Portal Setup" page is displayed
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under "System" option from "Updates" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Updates" section if it is "checked"
    And check "Select All" Check box under "Lock Settings" option from "Updates" section if it is "checked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Enabled"
    When press "Update Portal" button
    Then verify "Global Inc updated successfully" toast message is displayed in the "Client Portal List" page

  

  @mutable
  Scenario: TC004_1_PortalAdmin_Notifications - Verify enable Notifications Preferences for actions
    When press "Edit Client" button for the "Global Inc" client portal
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under "System" option from "Actions" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Actions" section if it is "unchecked"
    And check "Select All" Check box under "Lock Settings" option from "Actions" section if it is "unchecked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Disabled"
    When press "Update Portal" button
    Then verify "Global Inc updated successfully" toast message is displayed in the "Client Portal List" page

  

  @mutable
  Scenario: TC004_3_PortalAdmin_Notifications - Verify disabled Notifications Preferences for Actions
    When press "Edit Client" button for the "Global Inc" client portal
    Then the "Client Portal Setup" page is displayed
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under "System" option from "Actions" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Actions" section if it is "checked"
    And check "Select All" Check box under "Lock Settings" option from "Actions" section if it is "checked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Enabled"
    When press "Update Portal" button
    Then verify "Global Inc updated successfully" toast message is displayed in the "Client Portal List" page

  

  @mutable
  Scenario: TC005_1_PortalAdmin_Notifications - Verify enable Notifications Preferences for teams
    When press "Edit Client" button for the "Global Inc" client portal
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under "System" option from "Teams" section if it is "unchecked"
    And check "Select All" Check box under "Email" option from "Teams" section if it is "unchecked"
    And check "Select All" Check box under "Lock Settings" option from "Teams" section if it is "unchecked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Disabled"
    When press "Update Portal" button
    Then verify "Global Inc updated successfully" toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC005_3_PortalAdmin_Notifications - Verify disabled Notifications Preferences for Teams
    When press "Edit Client" button for the "Global Inc" client portal
    Then the "Client Portal Setup" page is displayed
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under "System" option from "Teams" section if it is "checked"
    And check "Select All" Check box under "Email" option from "Teams" section if it is "checked"
    And check "Select All" Check box under "Lock Settings" option from "Teams" section if it is "checked"
    And select "Periodic summary of Updates and Actions via email?" located under "Periodic Summary Emails" section if it is "Enabled"
    When press "Update Portal" button
    Then verify "Global Inc updated successfully" toast message is displayed in the "Client Portal List" page
