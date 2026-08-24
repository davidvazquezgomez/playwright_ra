@ReleasesNotes @ReleasesNotes_SuperAdmin
Feature: Release Notes for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

@mutable
Scenario: TC001_01_SuperAdmin_ReleaseNotes - Verify creating a release note
    When click on "Menu" option from the left navigation
    And click on "Update Release Notes" option from the left navigation
    Then the "Update Release Notes" page is displayed
    And verify "Add New;Expand All;Collapse All;Cancel;Save" buttons are displayed in the "Update Release Notes" page
    When press "Add New" button
    And press "Save" button
    Then verify "Title, date, and release notes are required for each release note entry." toast message is displayed in the "Update Release Notes" page
    And verify "Title is required.;Date is required.;Release notes are required." are displayed in the "Update Release Notes" page
    When fill the "Title" field with "Release Note Test" value in "Update Release Notes" page
    And press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify "Release Note Test" value is displayed in the "Title" field on the "Update Release Notes" page
    When select today's date from the "Date" calendar in "Update Release Notes" page
    And fill the "Release Notes" field with "This release includes bug fixes and performance improvements." value in "Update Release Notes" page
    And press "Save" button
    Then verify "Release notes updated successfully." toast message is displayed in the "Update Release Notes" page
    And verify the created release note "Release Note Test" is displayed with today's date in the "Update Release Notes" page
    When press "Expand All" button
    Then verify every release note is expanded in the "Update Release Notes" page
    When press "Collapse All" button
    Then verify every release note is collapsed in the "Update Release Notes" page

  @readOnly
  Scenario: TC001_02_SuperAdmin_ReleaseNotes - Verify the release notes list from the profile menu
    When press "Profile" button
    And press "Release Notes" button
    Then the "RegulatoryAdvantage | Release Notes" page is displayed
    And verify the list of releases notes is displayed in the "RegulatoryAdvantage | Release Notes" page
    And verify releases notes are sorted by "Date" in "descending" order
    Then verify "This release includes bug fixes and performance improvements." release note details are displayed on the first release note
    When click on the first release note in the "RegulatoryAdvantage | Release Notes" page
    Then verify "This release includes bug fixes and performance improvements." release note details are not displayed on the first release note
    And logout from the application
