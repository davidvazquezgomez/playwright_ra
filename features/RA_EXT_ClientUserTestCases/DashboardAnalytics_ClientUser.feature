@DashboardAnalytics @DashboardAnalytics_ClientUser
Feature: Dashboard Analytics for Client User

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "CLIENTUSER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC014_01_ClientUser_DashboardAnalytics - Navigate to Update Analytics page
    When click on "ClientPortal_20260209133616" of the portals
    Then the "ClientPortal_20260209133616 - Overview" page is displayed
    When press "Open Dashboard" button
    Then the "ClientPortal_20260209133616 - Updates Dashboard" page is displayed
    When press the "Analytics" section
    Then the "Update Analytics" subsection is displayed

  @readOnly
  Scenario: TC014_02_ClientUser_DashboardAnalytics - Reset the filter
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    Then save the value from the "Outstanding Updates" chart
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When press "More Filters" button on the Dashboard filter
    Then verify the "Tags;Date Announced;Date Effective;Last Updated" option is displayed in the Dashboard filter
    When press "Less Filters" button on the Dashboard filter
    Then verify the "Tags;Date Announced;Date Effective;Last Updated" option is not displayed in the Dashboard filter
    When select "Mexico" in the "Jurisdiction" filter on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    When press "Close" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is the same
    And verify the "Update Priority" chart value is the same

  @readOnly
  Scenario: TC014_03_ClientUser_DashboardAnalytics - Apply a predefined filter
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then save the value from the "Outstanding Updates" chart
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When select "Mexico" in the "Jurisdiction" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is not the same
    And verify the "Update Priority" chart value is not the same

  @mutable @cleanup
  Scenario: TC014_04_ClientUser_DashboardAnalytics - Create, save and delete a custom filter
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    When remove saved filter "QaTest" if it exists on the Dashboard filter
    And register cleanup to remove saved filter "QaTest" from "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics"
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When select "Awaiting Allocation" in the "Status" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    When press "Save filter" button on the Dashboard filter
    Then verify "Filter Name is required." error message appears on the Dashboard filter
    When fill "QaTest" in the "Filter Name" field on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter saved successfully." toast message is displayed in the "Analytics Dashboard" page

  @readOnly
  Scenario: TC014_05_ClientUser_DashboardAnalytics - Apply a customized filter
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then save the value from the "Outstanding Updates" chart
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    When select "Test_ClientUser" located in the "Saved Filters" section on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is not the same
    And verify the "Update Priority" chart value is not the same

  @readOnly
  Scenario: TC014_06_ClientUser_DashboardAnalytics - Verify Outstanding Updates chart is updated after filtering
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then verify the "Outstanding Updates" chart is displayed
    And verify the "Outstanding Updates" chart contains the "UPDATE OVERDUE;< 30 DAYS TO EFFECTIVE DATE;> 30 DAYS TO EFFECTIVE DATE" elements
    And save the value from the "Outstanding Updates" chart
    When press "Filter" button on the Dashboard filter
    When select "Employment Taxes" in the "Knowledge Module" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is the same

  @readOnly
  Scenario: TC014_08_ClientUser_DashboardAnalytics - Verify Outstanding Updates Map controls
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Outstanding Updates Map" chart is displayed
    When press "Save visuals as PDF" map control
    When press "Reset Zoom" map control
    When press "Zoom In" map control
    When press "Zoom Out" map control
    When press "Switch to USA Map" map control
    Then verify the map control contains the "Switch to World Map" name
    When press "Switch to World Map" map control
    Then verify the map control contains the "Switch to USA Map" name

  @mutable
  Scenario: TC014_09_ClientUser_DashboardAnalytics - Verify Update Priority chart is updated after filtering
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then verify the "Update Priority" chart is displayed
    And verify the "Update Priority" chart contains the "HIGH PRIORITY UPDATES;MEDIUM PRIORITY UPDATES;LOW PRIORITY UPDATES" elements
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    And select "Update Allocated" in the "Status" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Update Priority" chart value is not the same

  @mutable
  Scenario: TC015_01_ClientUser_DashboardAnalytics - Verify data consistency between Update Analytics Data and All Updates section
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Analytics Data" chart is displayed
    And verify "Update Title;Jurisdiction;Impact Area;Date Announced;Date Effective;Priority;Status;Last Updated" column header is displayed in the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page
    Then save the "Update Analytics Data" items
    When press the "Updates" section
    Then verify the "All Updates" table contains the same number of items as the "Update Analytics Data" chart

  @mutable
  Scenario: TC015_02_ClientUser_DashboardAnalytics - Compare Update Analytics Data and Updates Dashboard pages for a selected result
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    When search for "People Law" update in the Analytics Dashboard
    Then verify the "Update Analytics Data" chart is displayed
    When open the first filtered update result in the "Update Analytics Data" table
    Then the "People Law" page is displayed
    When press the "Update Details" subsection
    Then verify the "Update Details" subsection displays the "User Assigned; Priority; Status;Summary; Deloitte View; Supporting References; Tags; Related updates; Watch List; Discussion; Jurisdiction; Impact Area; Date Announced; Date Effective;Regulator;Level of Authority;Status of Change" sections
    And verify the "Update Details" subsection displays the "User, Client;High;Awaiting Allocation;Emp Tax;Annual social security rates and wage limits were updated for the 2025 tax year. Employers should review their payroll systems to ensure that the new rates and caps are being properly applied.;1;1;0;0;0;0;Canada;Administration of employment taxes withholding & payments;28 Nov 2025;28 Nov 2025;Italian Ministry of Labor and Social Policies;Legislative/Binding;Final" values
    And verify the "Update Details" subsection displays the "Mark as Unread;Edit;Comment" buttons
    When open the "Attachments" tab in the "Update Details" subsection
    Then verify the "Upload files" button is displayed in the "Update Details" Attachments tab

  @mutable
  Scenario: TC015_03_ClientUser_DashboardAnalytics - Verify Update Analytics Data chart is updated after filtering
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then verify the "Update Analytics Data" chart is displayed
    When press "Filter" button on the Dashboard filter
    And select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then save the "Update Analytics Data" items
    When press the "Updates" section
    Then the "All Updates" subsection is displayed
    Then verify the "All Updates" table contains the same number of items as the "Update Analytics Data" chart

  @readOnly
  Scenario Outline: TC015_04_ClientUser_DashboardAnalytics - Verify sort order is retained after navigating away
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Analytics Data" chart is displayed
    Then verify "<column>" column header is displayed in the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page
    When click on "<column>" column header in the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page
    Then verify items are sorted in "ascending" order by "<column>" in the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page
    When click on "<column>" column header in the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page
    Then verify items are sorted in "descending" order by "<column>" in the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page
    When press the "Updates" section
    And press the "Analytics" section
    Then verify items are sorted in "descending" order by "<column>" in the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page

    Examples:
      | column         |
      | Update Title   |
      | Jurisdiction   |
      | Impact Area    |
      | Date Announced |
      | Date Effective |
      | Priority       |
      | Status         |
      | Last Updated   |

  @readOnly
  Scenario: TC015_05_ClientUser_DashboardAnalytics - Verify Update Analytics Data table pagination and update details navigation
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Analytics Data" chart is displayed
    When navigate to page "4" in the "Update Analytics Data" table
    Then verify that the first result that appears is number "31"
    When press the "Updates" section
    And press the "Analytics" section
    Then verify that the first result that appears is number "31"

  @readOnly
  Scenario: TC016_01_ClientUser_DashboardAnalytics - Navigate to Action Analytics page
    When click on "ClientPortal_20260209133616" of the portals
    Then the "ClientPortal_20260209133616 - Overview" page is displayed
    When press "Open Dashboard" button
    Then the "ClientPortal_20260209133616 - Updates Dashboard" page is displayed
    When press the "Analytics" section
    Then the "Update Analytics" subsection is displayed
    When press the "Actions Analytics" subsection
    Then the "Actions Analytics" subsection is displayed

  @readOnly
  Scenario: TC016_02_ClientUser_DashboardAnalytics - Reset the filter Action Analytics page
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    Then save the value from the "Outstanding Actions" chart
    And save the value from the "Action Priority" chart
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    When select "High" in the "Action Priority" filter on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    When press "Close" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is the same
    And verify the "Action Priority" chart value is the same
    And verify the "Completed Actions" chart value is the same

  @readOnly
  Scenario: TC016_03_ClientUser_DashboardAnalytics - Apply a predefined filter Action Analytics page
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then save the value from the "Outstanding Actions" chart
    And save the value from the "Action Priority" chart
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    When select "Medium" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is not the same
    And verify the "Action Priority" chart value is not the same
    And verify the "Completed Actions" chart value is not the same

  @mutable @cleanup
  Scenario: TC016_04_ClientUser_DashboardAnalytics - Create, save and delete a custom filter in the Analytics page
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When remove saved filter "QaTest" if it exists on the Dashboard filter
    And register cleanup to remove saved filter "QaTest" from "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics"
    When press "Filter" button on the Dashboard filter
    When select "User, Client" in the "User Assigned" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    When press "Save filter" button on the Dashboard filter
    Then verify "Filter Name is required." error message appears on the Dashboard filter
    When fill "QaTest" in the "Filter Name" field on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter saved successfully." toast message is displayed in the "Analytics Dashboard" page

  @readOnly
  Scenario: TC016_05_ClientUser_DashboardAnalytics - Apply a customized filter Action Analytics page
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then save the value from the "Outstanding Actions" chart
    And save the value from the "Action Priority" chart
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    When select "Test_ClientUser3" located in the "Saved Filters" section on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is not the same
    And verify the "Action Priority" chart value is not the same

  @readOnly
  Scenario: TC016_06_ClientUser_DashboardAnalytics - Verify Outstanding Actions chart is updated after filtering
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then verify the "Outstanding Actions" chart is displayed
    And verify the "Outstanding Actions" chart contains the "ACTION OVERDUE;< 30 DAYS TO DEADLINE;> 30 DAYS TO DEADLINE" elements
    And save the value from the "Outstanding Actions" chart
    When press "Filter" button on the Dashboard filter
    When select "In progress" in the "Action Status" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is not the same

  @readOnly
  Scenario: TC016_08_ClientUser_DashboardAnalytics - Verify Outstanding Actions Map controls
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Outstanding Actions Map" chart is displayed
    When press "Save visuals as PDF" map control
    When press "Reset Zoom" map control
    When press "Zoom In" map control
    When press "Zoom Out" map control
    When press "Switch to USA Map" map control
    Then verify the map control contains the "Switch to World Map" name
    When press "Switch to World Map" map control
    Then verify the map control contains the "Switch to USA Map" name

  @mutable
  Scenario: TC016_09_ClientUser_DashboardAnalytics - Verify Action Priority chart is updated after filtering on the Action Analytics page
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then verify the "Action Priority" chart is displayed
    And verify the "Action Priority" chart contains the "HIGH PRIORITY ACTIONS; MEDIUM PRIORITY ACTIONS; LOW PRIORITY ACTIONS" elements
    And save the value from the "Action Priority" chart
    When press "Filter" button on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Action Priority" chart value is not the same

  @readOnly
  Scenario: TC016_10_ClientUser_DashboardAnalytics - Verify Completed Actions chart is updated after filtering
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then verify the "Completed Actions" chart is displayed
    And verify the "Completed Actions" chart contains the "ACTION ADDRESSED AFTER DEADLINE; ACTION ADDRESSED BEFORE/ON DEADLINE" elements
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    And select "Medium" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Completed Actions" chart value is not the same

  @mutable
  Scenario: TC017_01_ClientUser_DashboardAnalytics - Verify Data consistency between Actions Analytics Data and All Actions section
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Actions Analytics Data" chart is displayed
    And verify "Update Title;Action;User Assigned;Deadline Date; Update Priority; Action Priority; Action Status" column header is displayed in the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page
    Then save the "Actions Analytics Data" items
    When press the "Actions" section
    Then the "All Actions" subsection is displayed
    And verify the "All Actions" table contains the same number of items as the "Actions Analytics Data" chart

  @mutable
  Scenario: TC017_02_ClientUser_DashboardAnalytics - Compare Action Analytics Data and Actions Dashboard pages for a selected result
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When search for "People Law" update in the Analytics Dashboard
    Then verify the "Actions Analytics Data" chart is displayed
    When select the "People Law" result by clicking on the "Action" section
    Then verify the "Update Action" modal is displayed
    And verify the "Update Action" modal contains the "Update;Action;User Assigned; Priority; Status; Deadline;Private Action" sections
    And verify the "Update Action" modal contains the "People Law;Action_20260209134219;CA Admin, Client;High;Not Started;10 Feb 2026; Off" values
    And verify "Close;Update" buttons are displayed on the "Update Action" popup
    When open the "Attachments" tab in the "Update Action" popup
    Then verify the "Upload files" button is displayed in the "Update Action" Attachments tab
    When press "Close" button on the "Update Action" popup
    When press "Back" button
    When press "Open Dashboard" button
    And press the "Actions" section
    Then the "ClientPortal_20260209133616 - Actions Dashboard" page is displayed
    When select the "People Law" result by clicking on the "Action" section
    Then verify the "Update Action" modal is displayed
    And verify the "Update Action" modal contains the "Update;Action;User Assigned; Priority; Status; Deadline;Private Action" sections
    And verify the "Update Action" modal contains the "People Law;Action_20260209134219;CA Admin, Client;High;Not Started;10 Feb 2026; Off" values
    And verify "Close;Update" buttons are displayed on the "Update Action" popup
    When open the "Attachments" tab in the "Update Action" popup
    Then verify the "Upload files" button is displayed in the "Update Action" Attachments tab
    When press "Close" button on the "Update Action" popup
    And press "Clear" button in the search field

  @mutable
  Scenario: TC017_03_ClientUser_DashboardAnalytics - Verify the information displayed when selecting an Action result
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When search for "People Law" update in the Analytics Dashboard
    Then verify the "Actions Analytics Data" chart is displayed
    When select the "People Law" result by clicking on the "Update Title" section
    Then verify the "Update Action" modal is displayed
    And verify the "Update Action" modal contains the "Update;Action;User Assigned; Priority; Status; Deadline;Private Action" sections
    And verify the "Update Action" modal contains the "People Law;Action_20260209134219;CA Admin, Client;High;Not Started;10 Feb 2026; Off" values
    And verify "Close;Update" buttons are displayed on the "Update Action" popup
    When open the "Attachments" tab in the "Update Action" popup
    Then verify the "Upload files" button is displayed in the "Update Action" Attachments tab
    When press "Close" button on the "Update Action" popup

  @readOnly
  Scenario: TC017_04_ClientUser_DashboardAnalytics - Verify Action Analytics Data chart is updated after filtering
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    Then verify the "Actions Analytics Data" chart is displayed
    When press "Filter" button on the Dashboard filter
    And select "High" in the "Update Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then save the "Actions Analytics Data" items
    When press the "Updates" section
    Then the "All Updates" subsection is displayed
    When press the "Analytics" section
    Then the "Update Analytics" subsection is displayed
    When press the "Actions Analytics" subsection
    Then verify the "Actions Analytics Data" item count is the same

  @readOnly
  Scenario Outline: TC017_05_ClientUser_DashboardAnalytics - Verify sort order is retained after navigating away
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Actions Analytics Data" chart is displayed
    Then verify "<column>" column header is displayed in the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page
    When click on "<column>" column header in the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page
    Then verify items are sorted in "ascending" order by "<column>" in the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page
    When click on "<column>" column header in the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page
    Then verify items are sorted in "descending" order by "<column>" in the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page
    When press the "Updates" section
    And press the "Analytics" section
    And press the "Actions Analytics" subsection
    Then verify items are sorted in "descending" order by "<column>" in the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page

    Examples:
      | column          |
      | Update Title    |
      | Action          |
      | User Assigned   |
      | Deadline Date   |
      | Update Priority |
      | Action Priority |
      | Action Status   |

  @readOnly
  Scenario: TC017_06_ClientUser_DashboardAnalytics - Verify Action Analytics Data table pagination and update details navigation
    Given the "ClientPortal_20260209133616 - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Actions Analytics Data" chart is displayed
    When navigate to page "1" in the "Actions Analytics Data" table
    Then verify that the first result that appears is number "1"
    When press the "Updates" section
    And press the "Analytics" section
    When press the "Actions Analytics" subsection
    Then verify that the first result that appears is number "1"
