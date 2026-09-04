@DashboardOptions @DashboardOptions_SuperAdmin
Feature: Dashboard Options for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC019_01_SuperAdmin_DashboardOptions - Generate an unfiltered Updates report
    When click on "01_13Jan REG" of the portals
    Then the "Overview" page is displayed
    And verify for client portal name "01_13Jan REG"
    When press "Open Dashboard" button
    Then the "Updates Dashboard" page is displayed
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    Then verify the dashboard dropdown value is "Updates"
    And verify "Update Title;Jurisdiction;Impact Area;Date Announced;Date Effective;Priority;Status;Last Updated" columns are selected in the Dashboard Options popup
    And verify "Generate Report;Cancel" buttons are displayed on the "Dashboard Options" popup
    When press "Generate Report" button
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Updates Dashboard" page

  @readOnly
  Scenario: TC019_02_SuperAdmin_DashboardOptions - Generate a filtered Updates report
    Given the "Updates Dashboard - 01_13Jan REG" page is open
    When press "Filter" button on the Dashboard filter
    And select "Belgium" in the "Jurisdiction" filter on the Dashboard filter
    And select "Medium" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed for "Jurisdiction" with value "Belgium"
    Then verify filtered actions are displayed for "Priority" with value "Medium"
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    Then verify the dashboard dropdown value is "Updates"
    When press "Generate Report" button
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Updates Dashboard" page
    And verify the downloaded file name format is "01_13Jan REG_Updates_Report_" with current date and time

  @mutable
  Scenario: TC019_03_SuperAdmin_DashboardOptions - Generate an unfiltered Actions report
    Given the "Actions Dashboard - 01_13Jan REG" page is open
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    And select "Actions" from the "Generate report for" dropdown
    Then verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are selected in the Dashboard Options popup
    When press "Generate Report" button
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Actions Dashboard" page
    And verify the downloaded file name format is "01_13Jan REG_Actions_Report_" with current date and time

  @readOnly
  Scenario: TC019_04_SuperAdmin_DashboardOptions - Generate a filtered Actions report
    Given the "Actions Dashboard - 01_13Jan REG" page is open
    When press "Filter" button on the Dashboard filter
    And select "Belgium" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    And select "Actions" from the "Generate report for" dropdown
    When press "Generate Report" button
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Actions Dashboard" page
    And verify the downloaded file name format is "01_13Jan REG_Actions_Report_" with current date and time

  @mutable
  Scenario: TC020_01_SuperAdmin_DashboardOptions - Generate an unfiltered Updates audit trail
    Given the "Updates Dashboard - 01_13Jan REG" page is open
    Then the "Updates Dashboard" page is displayed
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Audit Trail" is displayed in the Dashboard Options popup
    When click on "Generate Audit Trail" option from the "Dashboard Options" popup
    Then verify the "Update allocated to responsible person;User added to Update Watchlist;User removed from Update Watchlist;Update status changed;Update priority changed;Action added;User added to Action;User removed from Action;Action status Changed;Action priority Changed" audit trail change area parameters are displayed
    When select "Update priority changed" audit trail change area parameter
    And press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Updates Dashboard" page
    And verify the downloaded file name format is "01_13Jan REG_AuditTrail_Report_" with current date and time

  @readOnly
  Scenario: TC020_02_SuperAdmin_DashboardOptions - Generate a filtered Updates audit trail
    Given the "Updates Dashboard - 01_13Jan REG" page is open
    When press "Filter" button on the Dashboard filter
    And select "Belgium" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    When click on "Generate Audit Trail" option from the "Dashboard Options" popup
    And press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Updates Dashboard" page
    And verify the downloaded file name format is "01_13Jan REG_AuditTrail_Report_" with current date and time

  @mutable
  Scenario: TC020_03_SuperAdmin_DashboardOptions - Generate an unfiltered Actions audit trail
    Given the "Actions Dashboard - 01_13Jan REG" page is open
    Then verify for "Dashboard options" button is visible
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Audit Trail" is displayed in the Dashboard Options popup
    When click on "Generate Audit Trail" option from the "Dashboard Options" popup
    Then verify the "Update allocated to responsible person;User added to Update Watchlist;User removed from Update Watchlist;Update status changed;Update priority changed;Action added;User added to Action;User removed from Action;Action status Changed;Action priority Changed" audit trail change area parameters are displayed
    When select "Action priority Changed" audit trail change area parameter
    And press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Actions Dashboard" page
    And verify the downloaded file name format is "01_13Jan REG_AuditTrail_Report_" with current date and time

  @readOnly
  Scenario: TC020_04_SuperAdmin_DashboardOptions - Generate a filtered Actions audit trail
    Given the "Actions Dashboard - 01_13Jan REG" page is open
    When press "Filter" button on the Dashboard filter
    And select "Belgium" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    When click on "Generate Audit Trail" option from the "Dashboard Options" popup
    When press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "01_13Jan REG - Actions Dashboard" page
    And verify the downloaded file name format is "01_13Jan REG_AuditTrail_Report_" with current date and time
    And logout from the application
