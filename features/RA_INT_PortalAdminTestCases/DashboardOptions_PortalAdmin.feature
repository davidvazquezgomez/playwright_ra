@DashboardOptions @DashboardOptions_PortalAdmin
Feature: Dashboard Options for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC019_01_PortalAdmin_DashboardOptions - Generate an unfiltered Updates report
    When click on "Global Inc" of the portals
    Then the "Overview" page is displayed
    And verify for client portal name "Global Inc"
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
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "Global Inc - Updates Dashboard" page

  @readOnly
  Scenario: TC019_02_PortalAdmin_DashboardOptions - Generate a filtered Updates report
    Given the "Updates Dashboard - Global Inc" page is open
    When press "Filter" button on the Dashboard filter
    And select "Australia" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed for "Jurisdiction" with value "Australia"
    Then verify filtered actions are displayed for "Priority" with value "High"
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    Then verify the dashboard dropdown value is "Updates"
    When press "Generate Report" button
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "Global Inc - Updates Dashboard" page
    And verify the downloaded file name format is "Global Inc_Updates_Report_" with current date and time

  @mutable
  Scenario: TC019_03_PortalAdmin_DashboardOptions - Generate an unfiltered Actions report
    Given the "Global Inc - Actions Dashboard" page is open
    When press "Dashboard options" button
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    And select "Actions" from the "Generate report for" dropdown
    Then verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are selected in the Dashboard Options popup
    When press "Generate Report" button
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "Global Inc - Actions Dashboard" page
    And verify the downloaded file name format is "Global Inc_Actions_Report_" with current date and time

  @readOnly
  Scenario: TC019_04_PortalAdmin_DashboardOptions - Generate a filtered Actions report
    Given the "Global Inc - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And select "Argentina" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed
    When press "Dashboard options" button
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Report" is displayed in the Dashboard Options popup
    When click on "Generate Report" option from the "Dashboard Options" popup
    And select "Actions" from the "Generate report for" dropdown
    When press "Generate Report" button
    Then verify "Report generated and downloaded successfully" toast message is displayed in the "Global Inc - Actions Dashboard" page
    And verify the downloaded file name format is "Global Inc_Actions_Report_" with current date and time

  @mutable
  Scenario: TC020_01_PortalAdmin_DashboardOptions - Generate an unfiltered Updates audit trail
    Given the "Updates Dashboard - Global Inc" page is open
    Then the "Updates Dashboard" page is displayed
    When press "Dashboard options" button
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Audit Trail" is displayed in the Dashboard Options popup
    When click on "Generate Audit Trail" option from the "Dashboard Options" popup
    Then verify the "Update allocated to responsible person;User added to Update Watchlist;User removed from Update Watchlist;Update status changed;Update priority changed;Action added;User added to Action;User removed from Action;Action status Changed;Action priority Changed" audit trail change area parameters are displayed
    When select "Update priority changed" audit trail change area parameter
    And press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "Global Inc - Updates Dashboard" page
    And verify the downloaded file name format is "Global Inc_AuditTrail_Report_" with current date and time

  @readOnly
  Scenario: TC020_02_PortalAdmin_DashboardOptions - Generate a filtered Updates audit trail
    Given the "Updates Dashboard - Global Inc" page is open
    When press "Filter" button on the Dashboard filter
    And select "Australia" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed
    When press "Dashboard options" button on the Dashboard
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    When click on "Generate Audit Trail" option from the "Dashboard Options" popup
    When select "Action added" audit trail change area parameter
    And press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "Global Inc - Updates Dashboard" page
    And verify the downloaded file name format is "Global Inc_AuditTrail_Report_" with current date and time

  @mutable
  Scenario: TC020_03_PortalAdmin_DashboardOptions - Generate an unfiltered Actions audit trail
    Given the "Global Inc - Actions Dashboard" page is open
    When press "Dashboard options" button
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    And verify "Generate Audit Trail" is displayed in the Dashboard Options popup
    When click on "Generate Audit Trail" option from the "Dashboard Options" popup
    Then verify the "Update allocated to responsible person;User added to Update Watchlist;User removed from Update Watchlist;Update status changed;Update priority changed;Action added;User added to Action;User removed from Action;Action status Changed;Action priority Changed" audit trail change area parameters are displayed
    When select "Action priority Changed" audit trail change area parameter
    And press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "Global Inc - Actions Dashboard" page
    And verify the downloaded file name format is "Global Inc_AuditTrail_Report_" with current date and time

  @readOnly
  Scenario: TC020_04_PortalAdmin_DashboardOptions - Generate a filtered Actions audit trail
    Given the "Global Inc - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And select "Argentina" in the "Jurisdiction" filter on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed
    And verify for "Dashboard options" button is visible
    When press "Dashboard options" button
    Then verify the "Dashboard options" popup is displayed on the Dashboard
    When select "Action added" audit trail change area parameter
    When press "Generate Audit Trail" button
    Then verify "Audit trail report generated and downloaded successfully" toast message is displayed in the "Global Inc - Actions Dashboard" page
    And verify the downloaded file name format is "Global Inc_AuditTrail_Report_" with current date and time
    And logout from the application
