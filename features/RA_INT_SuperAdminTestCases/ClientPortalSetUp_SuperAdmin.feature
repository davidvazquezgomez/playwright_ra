@ClientPortalSetUp @ClientPortalSetUp_SuperAdmin
Feature: Client Portal Setup for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_SuperAdmin_ClientPortalSetup - Validate fields and navigation warnings
    When press "Create New Portal" button
    Then the "Client Portal Setup" page is displayed
    And verify "Client Portal Name;Deloitte Administrators;Business Sponsor;Ask Deloitte Contact" field is displayed in the "Client Portal Setup" page
    When press "Save" button
    Then verify "Client Portal Name is required;At least one Deloitte Administrator is required;Business Sponsor is required" are displayed in the "Client Portal Setup" page
    When fill the "Client Portal Name" field with "Portal Test" value in the "Client Portal Setup" page
    And fill the "Deloitte Administrators" field with "e-business, DTT" value in the "Client Portal Setup" page
    And fill the "Business Sponsor" field with "e-business, DTT" value in the "Client Portal Setup" page
    And fill the "Ask Deloitte Contact" field with "askdeloitte@test.com" value in the "Client Portal Setup" page
    And click on "Home" option from the left navigation
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify "Portal Test" value is displayed in the "Client Portal Name" field on the "Client Portal Setup" page
    And verify "e-business, DTT" value is displayed in the "Deloitte Administrators" field on the "Client Portal Setup" page
    And verify "e-business, DTT" value is displayed in the "Business Sponsor" field on the "Client Portal Setup" page
    And verify "askdeloitte@test.com" value is displayed in the "Ask Deloitte Contact" field on the "Client Portal Setup" page
    When click on "Home" option from the left navigation
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Continue" button on the "Unsaved Changes" popup
    Then the "Client Portal List" page is displayed

  @mutable
  Scenario: TC002_01_SuperAdmin_ClientPortalSetup - Verify editing the existing client portal
    When press "Edit Client" button for the "01_QA_ClientPortalSetup" client portal
    Then verify the page is navigated to the "Client Portal Setup" step
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then verify the page is navigated to the "Knowledge Modules & Impact Areas" step
    When update the Knowledge Modules & Impact Areas using check-box or "Select All"
    And press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then verify the page is navigated to the "Jurisdictions" step
    When update the Jurisdictions selection by removing specific items and making selective configurations
    And press "Update Portal Now" button
    Then verify the confirmation message "updated successfully" is displayed

  @mutable
  Scenario: TC002_02_SuperAdmin_ClientPortalSetup - Verify activation or deactivation of the existing portal
    When press "Edit Client" button for the "01_QA_ClientPortalSetup" client portal
    Then verify the "Deactivate Portal" button is displayed on the client portal setup page toolbar
    When press "Deactivate Portal" button
    And press "Yes" button
    Then verify the confirmation message "updated successfully" is displayed
    When click on "Home" option from the left navigation
    And navigate to the deactivated client list at the end of the portal listing
    Then verify the deactivated client portal details are displayed
    And click on the deactivated client portal name in the client portal listing
    Then verify the error message is displayed on the client portal listing
    When press "Edit Client" button
    And press "Reactivate Portal" button
    When press "Yes" button
    Then verify the confirmation message "updated successfully" is displayed
    And verify the portal is displayed in the list and shows status as "Enabled"

  @mutable
  Scenario Outline: TC003_SuperAdmin_ClientPortalSetup - Verify Actions Enabled/Actions Disabled toggle for the existing portal
    When press "Edit Client" button for the "01_QA_ClientPortalSetup" client portal
    And select "<actionsState>" checkbox
    And press "Save & Continue" button on the "Client Portal Setup" page
    And select the Knowledge Modules & Impact Areas using check-box or "Select All"
    And press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    And select the Jurisdictions by searching a particular state or using check-box
    And press "Update Portal Now" button
    Then verify the confirmation message "updated successfully" is displayed
    When click on "Home" option from the left navigation
    And select "Enabled" option from the Status filter
    And click on the "01_QA_ClientPortalSetup" client portal name in the client portal listing
    And press "Open Dashboard" button for the "01_QA_ClientPortalSetup" client portal
    And press "Actions" button
    Then verify the "Add Action" button is "<expectedAddActionState>"
    And logout from the application

    Examples:
      | actionsState     | expectedAddActionState |
      | Actions Enabled  | enabled                |
      | Actions Disabled | disabled               |
