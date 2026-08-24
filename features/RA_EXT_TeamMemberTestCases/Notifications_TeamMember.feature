@Notifications @Notifications_TeamMember
Feature: Notifications for Team Member

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "TEAMMEMBER"
    And verify if applicable portals are displayed
#Como Aqui solo verificamos que las opciones mencionadas sean visibles, no es necesario coger un portal especifico

  @mutable
  Scenario: TC001_TeamMember_Notifications - Verify that when you access notification preferences by clicking the Edit button, the available frequency sections are displayed
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
  Scenario: TC001_2_TeamMember_Notifications - Verify Notifications Preferences has Actions and Teams Sections Available
    Given the "Notifications Preference" page is open
    Then verify "Actions" section is visible with notification options for the following "Allocated an Action; Changes to Action Status (where assigned to Action); Changes to Action Priority (where assigned to Action); Action due tomorrow and not yet complete; Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team; Removed from team"

  @mutable
  Scenario: TC001_3_TeamMember_Notifications - Verify enable or disable Notifications Preferences
    Given the "Notifications Preference" page is open
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
  Scenario: TC001_4_TeamMember_Notifications - Verify Notifications Preferences for Updates, Actions and Teams
    Given the "Notifications Preference" page is open
    When toggle "Set as responsible person" System notification option to be "enabled"
    When toggle "Changes to Update Status (where on the team)" System notification option to be "enabled"
    When toggle "Allocated an Action" System notification option to be "enabled"
    When toggle "Changes to Action Priority (where assigned to Action)" System notification option to be "enabled"
    When toggle "Added to team" System notification option to be "enabled"
    And press "Save Settings" button
    Then verify "Notification settings updated successfully." toast message is displayed in the "Client Portal List" page
#Como Aqui solo verificamos que las opciones mencionadas sean visibles, no es necesario coger un portal especifico

  @mutable
  Scenario: TC002_1_TeamMember_Notifications - Verify Notifications Preferences at user level
    Given the "Notifications Preference" page is open
    Then the "Notifications Preferences" page is displayed
    And verify "Updates" section is visible with notification options for the following "Set as responsible person;Changes to Update Status (where on the team);Changes to Update Priority (where on the team);Update now within 30 days of effective date and not yet closed;Update now within 7 days of effective date and not yet closed;Update becomes effective today and not yet closed"
    And verify "Actions" section is visible with notification options for the following "Allocated an Action;Changes to Action Status (where assigned to Action);Changes to Action Priority (where assigned to Action);Action due tomorrow and not yet complete;Action deadline today and not yet complete"
    And verify "Teams" section is visible with notification options for the following "Added to team;Removed from team"
    And verify "Periodic Summary Emails" section is visible with notification option "Periodic summary of Updates and Actions via email?"

  @mutable
  Scenario: TC002_2_TeamMember_Notifications - Verify enable or disable Notifications Preferences at user level
    Given the "Notifications Preference" page is open
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
#En este caso si que debemos de elegir un portal especifico para poder Hacer cambios 

  @mutable
  Scenario: TC003_TeamMember_Notifications - Verify enable or disable Notifications Preferences for updates
    When press "Edit Client" button for the "01_QA_ClientPortalSetup" client portal
    Then the "Client Portal Setup" page is displayed
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When update the Knowledge Modules & Impact Areas using check-box or "Select All"
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under "System" option on the differents "Updates;Actions;Teams"
    Then verify all the "Updates;Actions;Teams" are marked as enabled
    When check "Select All" Check box under "Email" option on the differents "Updates;Actions;Teams"
    Then verify all the "Updates;Actions;Teams" are marked as enabled
    And check "Select All" Check box under "Lock Settings" option on the differents "Updates;Actions;Teams"
    Then verify all the "Updates;Actions;Teams" are marked as locked
    When check "Select All" Check box under "System" option on the differents "Updates;Actions;Teams"
    Then verify all the "Updates;Actions;Teams" are marked as disabled
    When check "Select All" Check box under "Email" option on the differents "Updates;Actions;Teams"
    Then verify all the "Updates;Actions;Teams" are marked as disabled
    And check "Select All" Check box under "Lock Settings" option on the differents "Updates;Actions;Teams"
    Then verify all the "Updates;Actions;Teams" are marked as Unlocked
    When press "Go Back" button
    Then the "Jurisdictions selection" page is displayed
    When press "Knowledge Modules & Impact Areas" button
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Go back" button
    Then the "Client Portal Set up" page is displayed
    When press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    When press "Cancel" button on the "Unsaved Changes" popup
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When press "Update Portal" button
    Then verify "01_13Jan REG updated successfully" toast message is displayed in the "Client Portal List" page

  @mutable
  Scenario: TC004_TeamMember_Notifications - Verify enable or disable Notifications Preferences for actions
    When press "Edit Client" button for the "01_QA_ClientPortalSetup" client portal
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When check "Select All" Check box under System, Email and disable them under Actions sections
    Then verify all the preferences are marked as disabled
    When check "Select All" Check box under Lock
    Then verify all the preferences are marked as locked
    When uncheck "Select All" Check box under System, Email and disable them under Actions sections
    Then verify all the preferences are marked as disabled
    When check "Select All" Check box under Lock
    Then verify all the preferences are marked as locked
    When press "Go Back" button
    Then the "Jurisdictions selection" page is displayed
    When press "Knowledge Modules & Impact Areas" button
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Go back" button
    Then the "Client Portal Set up" page is displayed
    When press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    When press "Cancel" button on the "Unsaved Changes" popup
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions selection" page is displayed
    When press "Set Notifications Preferences" button
    Then the "Default Notifications Settings" page is displayed
    When press "Update Portal" button
    Then verify "01_13Jan REG updated successfully" toast message is displayed in the "Client Portal List" page
