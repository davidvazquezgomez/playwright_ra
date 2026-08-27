@DashboardOptions @DashboardOptions_TeamLeader
Feature: Dashboard Options for Team Leader

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMLEADER"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC019_01_TeamLeader_DashboardOptions - Generate an unfiltered Updates report
    When click on "ClientPortal_20260212191012" of the portals
    Then the "Overview" page is displayed
    And verify for client portal name "ClientPortal_20260212191012"
    When press "Open Dashboard" button
    Then the "Updates Dashboard" page is displayed
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    Then verify the dashboard dropdown default value is "Updates"
    And verify the "Update Title;Jurisdiction;Impact Area;Date Announced;Date Effective;Priority;Status;Last Updated" columns are selected in the Dashboard Options popup
    And verify "Generate Report" buttons are displayed on the "Dashboard Options" popup
    When press "Generate Report" button
    Then wait for the download completion notification
    And verify the downloaded file name format is "ClientPortal_20260212191012_Updates_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "Title;AnnouncementDateDisplay;EffectiveDateDisplay;LastUpdated;Priority;Status;Jurisdiction;ImpactArea" column headers

  @readOnly
  Scenario: TC019_02_TeamLeader_DashboardOptions - Generate a filtered Updates report
    Given the "Updates Dashboard - ClientPortal_20260212191012" page is open
    When press "Filter" button on the Dashboard filter
    And select "Canada" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the data is updated to show the applied filter records in the "Updates" dashboard
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup and clickable in the Dashboard options
    When click on "Generate Report" option from the "Dashboard Options" popup
    Then verify the dashboard dropdown value is "Updates"
    And verify the filters applied in the Updates dashboard are prechecked in the Generate Report options
    When press "Generate Report" button
    Then wait for the download completion notification
    And verify the downloaded file name format is "ClientPortal_20260212191012_Updates_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "Title;AnnouncementDateDisplay;EffectiveDateDisplay;LastUpdated;Priority;Status;Jurisdiction;ImpactArea" column headers
    And verify the report is generated with the same filters and options applied in the "Updates" dashboard

  @mutable
  Scenario: TC019_03_TeamLeader_DashboardOptions - Generate an unfiltered Actions report
    Given the "Actions Dashboard - ClientPortal_20260212191012" page is open
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup and clickable in the Dashboard options
    When click on "Generate Report" option from the "Dashboard Options" popup
    And select "Actions" from the "Generate report for" dropdown
    Then verify the "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are selected in the Dashboard Options popup
    When press "Generate Report" button
    Then wait for the download completion notification
    And verify the downloaded file name format is "ClientPortal_20260212191012_Actions_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "UpdateTitle;Action;UserAssigned;DeadlineDate;UpdatePriority;ActionPriority;ActionStatus" column headers

  @readOnly
  Scenario: TC019_04_TeamLeader_DashboardOptions - Generate a filtered Actions report
    Given the "Actions Dashboard - ClientPortal_20260212191012" page is open
    When press "Filter" button on the Dashboard filter
    And select "Italy" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the data is updated to show the applied filter records in the "Actions" dashboard
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup and clickable in the Dashboard options
    When click on "Generate Report" option from the "Dashboard Options" popup
    And select "Actions" from the "Generate report for" dropdown
    Then verify the filters applied in the Actions dashboard are prechecked in the Generate Report options
    When press "Generate Report" button
    Then wait for the download completion notification
    And verify the downloaded file name format is "ClientPortal_20260212191012_Actions_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "UpdateTitle;Action;UserAssigned;DeadlineDate;UpdatePriority;ActionPriority;ActionStatus" column headers
    And verify the report is generated with the same filters and options applied in the "Actions" dashboard

  @mutable
  Scenario: TC020_01_TeamLeader_DashboardOptions - Generate an unfiltered Updates audit trail
    Given the "Updates Dashboard - ClientPortal_20260212191012" page is open
    Then the "Updates Dashboard" page is displayed
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify "Generate Audit Trail" is displayed in the Dashboard Options popup
    When click on "Generate Audit Trail" option from the Dashboard options
    Then verify the "Update allocated to responsible person;User added to Update Watchlist;User removed from Update Watchlist;Update status changed;Update priority changed;Action added;User added to Action;User removed from Action;Action status Changed;Action priority Changed" audit trail change area parameters are displayed
    When select different audit trail parameters
    And press "Generate Audit Trail" button
    Then verify the notification area displays the report generation status
    And verify the downloaded file name format is "ClientPortal_20260212191012_AuditTrail_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "Update Title;Action;Jurisdiction;Change Area;Previous Value;Current Value;Modified By;Date Modified" column headers

  @mutable
  Scenario: TC020_02_TeamLeader_DashboardOptions - Generate a filtered Updates audit trail
    Given the "Updates Dashboard - ClientPortal_20260212191012" page is open
    When press "Filter" button on the Dashboard filter
    And select "Canada" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the data is updated to show the applied filter records in the "Updates" dashboard
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    When click on "Generate Audit Trail" option from the Dashboard options
    And press "Generate Audit Trail" button
    Then verify the notification area displays the report generation status
    And verify the downloaded file name format is "ClientPortal_20260212191012_AuditTrail_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "Update Title;Action;Jurisdiction;Change Area;Previous Value;Current Value;Modified By;Date Modified" column headers
    And verify the report is generated with the same filters and options applied in the "Updates" dashboard

  @mutable
  Scenario: TC020_03_TeamLeader_DashboardOptions - Generate an unfiltered Actions audit trail
    Given the "Actions Dashboard - ClientPortal_20260212191012" page is open
    Then verify for "Dashboard Options" button is visible
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify "Generate Audit Trail" is displayed in the Dashboard Options popup
    When click on "Generate Audit Trail" option from the Dashboard options
    Then verify the "Update allocated to responsible person;User added to Update Watchlist;User removed from Update Watchlist;Update status changed;Update priority changed;Action added;User added to Action;User removed from Action;Action status Changed;Action priority Changed" audit trail change area parameters are displayed
    When select different audit trail parameters
    And press "Generate Audit Trail" button
    Then verify the notification area displays the report generation status
    And verify the downloaded file name format is "ClientPortal_20260212191012_AuditTrail_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "Update Title;Action;Jurisdiction;Change Area;Previous Value;Current Value;Modified By;Date Modified" column headers

  @mutable
  Scenario: TC020_04_TeamLeader_DashboardOptions - Generate a filtered Actions audit trail
    Given the "Actions Dashboard - ClientPortal_20260212191012" page is open
    When press "Filter" button on the Dashboard filter
    And select "Italy" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the data is updated to show the applied filter records in the "Actions" dashboard
    And verify for "Dashboard Options" button is visible
    When press "Dashboard Options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    When press "Generate Audit Trail" button
    Then verify the notification area displays the report generation status
    And verify the downloaded file name format is "ClientPortal_20260212191012_AuditTrail_Report_" with current date and time
    When read the downloaded excel file content
    Then verify the excel file contains the "Update Title;Action;Jurisdiction;Change Area;Previous Value;Current Value;Modified By;Date Modified" column headers
    And verify the report is generated with the same filters and options applied in the "Actions" dashboard
    When logout from the application
