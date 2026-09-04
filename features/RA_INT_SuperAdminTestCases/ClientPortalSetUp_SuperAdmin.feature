@ClientPortalSetUp @ClientPortalSetUp_SuperAdmin
Feature: Client Portal Setup for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_SuperAdmin_ClientPortalSetup - Validate fields and navigation warnings
    When press "Create New Portal" button
    Then the "Client Portal Setup" page is displayed
    And verify "Client Portal Name;Deloitte Administrators;Business Sponsor;Ask Deloitte Contact" field is displayed in the "Client Portal Setup" page
    When press "Save" button
    Then verify "Client Portal Name is required;At least one Deloitte Administrator is required;Business Sponsor is required" are displayed in the "Client Portal Setup" page
    When fill the "Client Portal Name" field with "Portal Test" value in the Client Portal Setup form
    And fill the "Deloitte Administrators" field with "e-business, DTT" value in the Client Portal Setup form
    And fill the "Business Sponsor" field with "e-business, DTT" value in the Client Portal Setup form
    And fill the "Ask Deloitte Contact" field with "askdeloitte@test.com" value in the Client Portal Setup form
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
    Then the "Client Portal Setup" page is displayed
    When press "Save & Continue" button on the "Client Portal Setup" page
    Then the "Knowledge Modules & Impact Areas" page is displayed
    When update the Knowledge Modules & Impact Areas selection
    And press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    Then the "Jurisdictions" page is displayed
    When update the Jurisdictions selection
    And press "Update Portal Now" button
    Then a message should get displayed as "updated successfully"

  @mutable
  Scenario: TC002_02_SuperAdmin_ClientPortalSetup - Verify activation or deactivation of the existing portal
    When press "Edit Client" button for the "01_QA_ClientPortalSetup" client portal
    Then verify "Deactivate Portal" buttons are displayed in the "Client Portal Setup" page
    When press "Deactivate Portal" button
    And press "Yes" button
    Then a message should get displayed as "updated successfully"
    When click on "Home" option from the left navigation
    And press "Last Page" pagination button in the "Client Portal List" page
    Then verify the current page is "last" in the "Client Portal List" page
    And verify "01_QA_ClientPortalSetup" client portal displays "Disabled" status in the Client Portal List
    When click on the "01_QA_ClientPortalSetup" client portal name in the client portal listing
    Then verify an access error is displayed on the client portal listing
    When press "Edit Client" button
    And press "Reactivate Portal" button
    When press "Yes" button
    Then a message should get displayed as "updated successfully"
    And verify "01_QA_ClientPortalSetup" client portal displays "Enabled" status in the Client Portal List

  @mutable
  Scenario Outline: TC003_SuperAdmin_ClientPortalSetup - Verify Actions Enabled/Actions Disabled toggle for the existing portal
    When press "Edit Client" button for the "01_QA_ClientPortalSetup" client portal
    And set Actions availability to "<actionsState>" in Client Portal Setup
    And press "Save & Continue" button on the "Client Portal Setup" page
    And update the Knowledge Modules & Impact Areas selection
    And press "Save & Continue" button on the "Knowledge Modules & Impact Areas" page
    And update the Jurisdictions selection
    And press "Update Portal Now" button
    Then a message should get displayed as "updated successfully"
    When click on "Home" option from the left navigation
    And select "Enabled" in the "Status" filter on the "Client Portal List" page
    And click on the "01_QA_ClientPortalSetup" client portal name in the client portal listing
    When press "Open Dashboard" button
    And press "Actions" button
    Then verify the "Add Action" button is "<expectedAddActionState>" on the Actions Dashboard

    Examples:
      | actionsState     | expectedAddActionState |
      | Actions Enabled  | enabled                |
      | Actions Disabled | disabled               |
