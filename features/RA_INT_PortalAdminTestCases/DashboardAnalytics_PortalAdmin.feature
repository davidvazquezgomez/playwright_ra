@DashboardAnalytics @DashboardAnalytics_PortalAdmin
Feature: Dashboard Analytics for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC014_01_PortalAdmin_DashboardAnalytics - Navigate to Update Analytics page
    When click on "Global Inc" of the portals
    Then the "Global Inc - Overview" page is displayed
    When press "Open Dashboard" button
    Then the "Global Inc - Updates Dashboard" page is displayed
    When press the "Analytics" section
    Then the "Update Analytics" subsection is displayed

  @readOnly
  Scenario: TC014_02_PortalAdmin_DashboardAnalytics - Reset the filter
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then save the value from the "Outstanding Updates" chart
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When press "More Filters" button on the Dashboard filter
    Then verify the "<MoreFilters>" option is displayed in the Dashboard filter
    When press "Less Filters" button on the Dashboard filter
    Then verify the "<MoreFilters>" option is not displayed in the Dashboard filter
    When select "Canada" in the "Jurisdiction" filter on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    When press "Close" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is the same
    And verify the "Update Priority" chart value is the same

  @readOnly
  Scenario: TC014_03_PortalAdmin_DashboardAnalytics - Apply a predefined filter
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then save the value from the "Outstanding Updates" chart
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    When select "Canada" in the "Jurisdiction" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is not the same
    And verify the "Update Priority" chart value is not the same

  @mutable @cleanup
  Scenario: TC014_04_PortalAdmin_DashboardAnalytics - Create, save and delete a custom filter
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    When remove saved filter "QaTest" if it exists on the Dashboard filter
    And register cleanup to remove saved filter "QaTest" from "Global Inc - Analytics Dashboard - Update Analytics"
    When press "Filter" button on the Dashboard filter
    When select "Awaiting Allocation" in the "Status" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    And verify "Filter Name is required." error message appears on the Dashboard filter
    When fill "QaTest" in the "Filter Name" field on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter saved successfully." toast message is displayed in the "Analytics Dashboard" page

  @readOnly
  Scenario: TC014_05_PortalAdmin_DashboardAnalytics - Apply a customized filter
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then save the value from the "Outstanding Updates" chart
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    When select "QaTest" located in the "Saved Filters" section on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is not the same
    And verify the "Update Priority" chart value is not the same

  @readOnly
  Scenario: TC014_06_PortalAdmin_DashboardAnalytics - Verify Outstanding Updates chart is updated after filtering
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Outstanding Updates" chart is displayed
    And verify the "Outstanding Updates" chart contains the "<segment>" elements
    And save the value from the "Outstanding Updates" chart
    When press "Filter" button on the Dashboard filter
    When select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Updates" chart value is not the same

  @readOnly
  Scenario: TC014_08_PortalAdmin_DashboardAnalytics - Verify Outstanding Updates Map controls
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
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
  Scenario: TC014_09_PortalAdmin_DashboardAnalytics - Verify Update Priority chart is updated after filtering
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Priority" chart is displayed
    And verify the "Update Priority" chart contains the "HIGH PRIORITY UPDATES;MEDIUM PRIORITY UPDATES;LOW PRIORITY UPDATES" elements
    And save the value from the "Update Priority" chart
    When press "Filter" button on the Dashboard filter
    And select "Update Allocated" in the "Status" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Update Priority" chart value is not the same

  @mutable
  Scenario: TC015_01_PortalAdmin_DashboardAnalytics - Verify data consistency between Update Analytics Data and All Updates section
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Analytics Data" chart is displayed
    And verify "Update Title;Jurisdiction;Impact Area;Date Announced;Date Effective;Priority;Status;Last Updated" column header is displayed in the "Global Inc - Analytics Dashboard - UpdateAnalytics" page
    Then save the "Update Analytics Data" items
    When press the "Updates" section
    Then verify the "All Updates" table contains the same number of items as the "Update Analytics Data" chart

  @mutable
  Scenario: TC015_02_PortalAdmin_DashboardAnalytics - Compare Update Analytics Data and Updates Dashboard pages for a selected result
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    When search for "Increase to Monthly Social Security Tax Bases" update in the Analytics Dashboard
    Then verify the "Update Analytics Data" chart is displayed
    When open the first filtered update result in the "Update Analytics Data" table
    Then the "Increase to Monthly Social Security Tax Bases" page is displayed
    And press the "Update Details" subsection
    And verify the "Update Details" subsection displays the "User Assigned; Priority; Status;Summary; Deloitte View; Supporting References; Tags; Related updates; Watch List; Discussion; Jurisdiction; Impact Area; Date Announced; Date Effective;Regulator;Level of Authority;Status of Change" sections
    And verify the "Update Details" subsection displays the "Admin, QA;Medium;Update in Progress;Argentina's minimum and maximum monthly taxable bases for social taxes have increased for January's accrual. The minimum monthly tax base has increased to ARS 89,557.43. The maximum monthly tax base has increased to ARS 2,910,574.49.;1;2;0;0;0;0;Argentina;Employment taxes rates & thresholds;26 Dec 2024;01 Jan 2025;Social Security Authority;Legislative/Binding;Final" values
    And verify the "Update Details" subsection displays the "Mark as Unread;Edit;Comment" buttons
    When open the "Attachments" tab in the "Update Details" subsection
    Then verify the "Upload files" button is displayed in the "Update Details" Attachments tab

  @mutable
  Scenario: TC015_03_PortalAdmin_DashboardAnalytics - Verify Update Analytics Data chart is updated after filtering
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Analytics Data" chart is displayed
    When press "Filter" button on the Dashboard filter
    And select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then save the "Update Analytics Data" items
    When press the "Updates" section
    And the "All Updates" subsection is displayed
    Then verify the "All Updates" table contains the same number of items as the "Update Analytics Data" chart

  @readOnly
  Scenario Outline: TC015_04_PortalAdmin_DashboardAnalytics - Verify sort order is retained after navigating away
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Analytics Data" chart is displayed
    Then verify "<column>" column header is displayed in the "Global Inc - Analytics Dashboard - UpdateAnalytics" page
    When click on "<column>" column header in the "Global Inc - Analytics Dashboard - UpdateAnalytics" page
    Then verify items are sorted in "ascending" order by "<column>" in the "" page
    When click on "<column>" column header in the "Global Inc - Analytics Dashboard - UpdateAnalytics" page
    Then verify items are sorted in "descending" order by "<column>" in the "Global Inc - Analytics Dashboard - UpdateAnalytics" page
    When press the "Updates" section
    And press the "Analytics" section
    Then verify items are sorted in "descending" order by "<column>" in the "Global Inc - Analytics Dashboard - UpdateAnalytics" page

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
  Scenario: TC015_05_PortalAdmin_DashboardAnalytics - Verify Update Analytics Data table pagination and update details navigation
    Given the "Global Inc - Analytics Dashboard - Update Analytics" page is open
    Then verify the "Update Analytics Data" chart is displayed
    When navigate to page "4" in the "Update Analytics Data" table
    Then verify that the first result that appears is number "31"
    When press the "Updates" section
    Then press the "Analytics" section
    And verify that the first result that appears is number "31"

  @readOnly
  Scenario: TC016_01_PortalAdmin_DashboardAnalytics - Navigate to Action Analytics page
    When click on "Global Inc" of the portals
    Then the "Global Inc - Overview" page is displayed
    When press "Open Dashboard" button
    Then the "Global Inc - Updates Dashboard" page is displayed
    When press the "Analytics" section
    Then the "Update Analytics" subsection is displayed
    When press the "Actions Analytics" subsection
    Then the "Action Analytics" subsection is displayed

  @readOnly
  Scenario: TC016_02_PortalAdmin_DashboardAnalytics - Reset the filter Action Analytics page
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then save the value from the "Outstanding Actions" chart
    And save the value from the "Action Priority" chart
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;Jurisdiction;Update Priority;Action Priority;Action Status;User Assigned;Deadline range" option is displayed in the Dashboard filter
    When select "High" in the "Action Priority" filter on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    When press "Close" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is the same
    And verify the "Action Priority" chart value is the same
    And verify the "Completed Actions" chart value is the same

  @readOnly
  Scenario: TC016_03_PortalAdmin_DashboardAnalytics - Apply a predefined filter Action Analytics page
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then save the value from the "Outstanding Actions" chart
    And save the value from the "Action Priority" chart
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    When select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is not the same
    And verify the "Action Priority" chart value is not the same
    And verify the "Completed Actions" chart value is not the same

  @mutable @cleanup
  Scenario: TC016_04_PortalAdmin_DashboardAnalytics - Create, save and delete a custom filter in the Action Analytics page
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    When remove saved filter "QaTest" if it exists on the Dashboard filter
    And register cleanup to remove saved filter "QaTest" from "Global Inc - Analytics Dashboard - Action Analytics"
    When press "Filter" button on the Dashboard filter
    When select "AMPOLU, SOUNDARYA" in the "User Assigned" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    And verify "Filter Name is required." error message appears on the Dashboard filter
    When fill "QaTest" in the "Filter Name" field on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter saved successfully." toast message is displayed in the "Analytics Dashboard" page
    When press "Filter" button on the Dashboard filter
    And press "Edit" button on the Dashboard filter
    Then verify the "QaTest" filter is displayed in the "Saved Filters" section on the Dashboard filter
    When press "Delete filter" button for "QaTest" on the Dashboard filter
    Then the "Confirm Delete" popup is displayed
    And press "Delete" button on the "Confirm Delete" popup
    Then verify "Saved filter deleted successfully." toast message is displayed in the "Analytics Dashboard" page

  @readOnly
  Scenario: TC016_05_PortalAdmin_DashboardAnalytics - Apply a customized filter Action Analytics page
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then save the value from the "Outstanding Actions" chart
    And save the value from the "Action Priority" chart
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    When select "Test_Analytics" located in the "Saved Filters" section on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is not the same
    And verify the "Action Priority" chart value is not the same
    And verify the "Completed Actions" chart value is not the same

  @readOnly
  Scenario: TC016_06_PortalAdmin_DashboardAnalytics - Verify Outstanding Actions chart is updated after filtering
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Outstanding Actions" chart is displayed
    And verify the "Outstanding Actions" chart contains the "UPDATE OVERDUE;< 30 DAYS TO EFFECTIVE DATE;>30 DAYS TO EFFECTIVE DATE" elements
    And save the value from the "Outstanding Actions" chart
    When press "Filter" button on the Dashboard filter
    When select "In progress" in the "Action Status" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Outstanding Actions" chart value is not the same

  @readOnly
  Scenario: TC016_08_PortalAdmin_DashboardAnalytics - Verify Outstanding Actions Map controls
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Outstanding Actions Map" chart is displayed
    And press "Save visuals as PDF" map control
    When press "Reset Zoom" map control
    When press "Zoom In" map control
    When press "Zoom Out" map control
    When press "Switch to USA Map" map control
    Then verify the map control contains the "Switch to World Map" name
    When press "Switch to World Map" map control
    Then verify the map control contains the "Switch to USA Map" name

  @mutable
  Scenario: TC016_09_PortalAdmin_DashboardAnalytics - Verify Action Priority chart is updated after filtering on the Action Analytics page
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Action Priority" chart is displayed
    And verify the "Action Priority" chart contains the "HIGH PRIORITY ACTIONS; MEDIUM PRIORITY ACTIONS; LOW PRIORITY ACTIONS" elements
    And save the value from the "Action Priority" chart
    When press "Filter" button on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Action Priority" chart value is not the same

  @readOnly
  Scenario: TC016_10_PortalAdmin_DashboardAnalytics - Verify Completed Actions chart is updated after filtering
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Completed Actions" chart is displayed
    And verify the "Completed Actions" chart contains the "ACTION ADDRESSED AFTER DEADLINE; ACTION ADDRESSED BEFORE/ON DEADLINE" elements
    And save the value from the "Completed Actions" chart
    When press "Filter" button on the Dashboard filter
    And select "Medium" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "Completed Actions" chart value is not the same

  @mutable
  Scenario: TC017_01_PortalAdmin_DashboardAnalytics - Verify Data consistency between Actions Analytics Data and All Actions section
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Actions Analytics Data" chart is displayed
    And verify "Update Title;Action;UserAssigned;Deadline Date; Update Priority; Action Priority; Action Status" column header is displayed in the "Global Inc - Analytics Dashboard - Action Analytics" page
    Then save the "Actions Analytics Data" items
    When press the "Actions" section
    Then the "All Actions" subsection is displayed
    And verify the "All Actions" table contains the same number of items as the "Actions Analytics Data" chart

  @mutable
  Scenario: TC017_02_PortalAdmin_DashboardAnalytics - Compare Action Analytics Data and Actions Dashboard pages for a selected result
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    When search for "Labor Insurance Rates Updated" update in the Analytics Dashboard
    Then verify the "Actions Analytics Data" chart is displayed
    And select the "Labor Insurance Rates Updated" result by clicking on the "Action" section
    Then verify the "Update Action" modal is displayed
    And verify the "Update Action" modal contains the "Update;Action;User Assigned; Priority; Status; Deadline;Private Action" sections
    And verify the "Update Action" modal contains the "Labor Insurance Rates Updated;New Action Test 2;Search for user..., DeloitteUser;Medium;Complete;30 Sep 2025; Off" values
    And verify "<UpdateButtons>" buttons are displayed on the "Update Action" popup
    When open the "Attachments" tab in the "Update Action" popup
    Then verify the "Upload files" button is displayed in the "Update Action" Attachments tab
    Then press "Close" button on the "Update Action" popup
    When press "Back" button
    And press the "Actions" section
    Then the "Global Inc - Actions Dashboard" page is displayed
    When select the "Labor Insurance Rates Updated" result by clicking on the "Action" section
    Then verify the "Update Action" modal is displayed
    And verify the "Update Action" modal contains the "Update;Action;User Assigned; Priority; Status; Deadline;Private Action" sections
    And verify the "Update Action" modal contains the "Labor Insurance Rates Updated;New Action Test 2;Search for user..., DeloitteUser;Medium;Complete;30 Sep 2025; Off" values
    And verify "<UpdateButtons>" buttons are displayed on the "Update Action" popup
    When open the "Attachments" tab in the "Update Action" popup
    Then verify the "Upload files" button is displayed in the "Update Action" Attachments tab
    Then press "Close" button on the "Update Action" popup
    And press "Clear" button in the search field

  @mutable
  Scenario: TC017_03_PortalAdmin_DashboardAnalytics - Verify the information displayed when selecting an Action result
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    When search for "Labor Insurance Rates Updated" update in the Analytics Dashboard
    Then verify the "Actions Analytics Data" chart is displayed
    When select the "Labor Insurance Rates Updated" result by clicking on the "Action" section
    Then verify the "Update Action" modal is displayed
    And verify the "Update Action" modal contains the "Update;Action;User Assigned; Priority; Status; Deadline;Private Action" sections
    And verify the "Update Action" modal contains the "Labor Insurance Rates Updated;New Action Test 2;Search for user..., DeloitteUser;Medium;Complete;30 Sep 2025; Off" values
    And verify "Close;Update" buttons are displayed on the "Update Action" popup
    When open the "Attachments" tab in the "Update Action" popup
    Then verify the "Upload files" button is displayed in the "Update Action" Attachments tab
    And press "Close" button on the "Update Action" popup

  @readOnly
  Scenario: TC017_04_PortalAdmin_DashboardAnalytics - Verify Action Analytics Data chart is updated after filtering
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Actions Analytics Data" chart is displayed
    When press "Filter" button on the Dashboard filter
    And select "High" in the "Update Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then save the "Actions Analytics Data" items
    When press the "Updates" section
    Then the "All Updates" subsection is displayed
    When press the "Analytics" section
    And the "Update Analytics" subsection is displayed
    Then press the "Actions Analytics" subsection
    And verify the "Actions Analytics Data" item count is the same

  @readOnly
  Scenario Outline: TC017_05_PortalAdmin_DashboardAnalytics - Verify sort order is retained after navigating away
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Actions Analytics Data" chart is displayed
    Then verify "<column>" column header is displayed in the "Global Inc - Analytics Dashboard - Action Analytics" page
    When click on "<column>" column header in the "Global Inc - Analytics Dashboard - Action Analytics" page
    Then verify items are sorted in "ascending" order by "<column>" in the "Global Inc - Analytics Dashboard - Action Analytics" page
    When click on "<column>" column header in the "Global Inc - Analytics Dashboard - Action Analytics" page
    Then verify items are sorted in "descending" order by "<column>" in the "Global Inc - Analytics Dashboard - Action Analytics" page
    When press the "Updates" section
    And press the "Analytics" section
    And press the "Actions Analytics" subsection
    Then verify items are sorted in "descending" order by "<column>" in the "Global Inc - Analytics Dashboard - Action Analytics" page

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
  Scenario: TC017_06_PortalAdmin_DashboardAnalytics - Verify Action Analytics Data table pagination and update details navigation
    Given the "Global Inc - Analytics Dashboard - Action Analytics" page is open
    Then verify the "Actions Analytics Data" chart is displayed
    When navigate to page "4" in the "Actions Analytics Data" table
    Then verify that the first result that appears is number "31"
    When press the "Updates" section
    Then press the "Analytics" section
    And press the "Actions Analytics" subsection
    And verify that the first result that appears is number "31"
