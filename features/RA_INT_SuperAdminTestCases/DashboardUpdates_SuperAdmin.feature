@DashboardUpdate @DashboardUpdate_SuperAdmin
Feature: Dashboard Updates for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_01_SuperAdmin_DashboardUpdates - Navigate to dashboard updates page
    When click on "01_13Jan REG" of the portals
    Then the "01_13Jan REG - Overview" page is displayed
    When press "Open Dashboard" button
    Then the "01_13Jan REG - Updates Dashboard" page is displayed
    And verify "All Updates" tabs are displayed in "01_13Jan REG - Updates Dashboard" page
    And verify "Updates;Actions;Analytics" tabs are displayed in "01_13Jan REG - Updates Dashboard" page
    When press the "Unread Updates" subsection
    Then verify pagination is displayed in the "01_13Jan REG - Updates Dashboard" page

  @readOnly
  Scenario Outline: TC001_02_SuperAdmin_DashboardUpdates - Sort column headers and verify the sorting functionality
    Given the "01_13Jan REG - Updates Dashboard - All Updates" page is open
    Then verify "<column>" column header is displayed in the "01_13Jan REG - Updates Dashboard" page
    When click on "<column>" column header in the "01_13Jan REG - Updates Dashboard" page
    Then verify items are sorted in "ascending" order by "<column>" in the "01_13Jan REG - Updates Dashboard" page
    When click on "<column>" column header in the "01_13Jan REG - Updates Dashboard" page
    Then verify items are sorted in "descending" order by "<column>" in the "01_13Jan REG - Updates Dashboard" page
    When click on "<column>" column header in the "01_13Jan REG - Updates Dashboard" page
    Then verify sorting is removed for "<column>" in the "01_13Jan REG - Updates Dashboard" page

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

  @mutable
  Scenario: TC002_01_SuperAdmin_DashboardUpdates - Verify read/unread functionality on the "Unread Updates" tab
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When search for "Test_11-5_01" update from the "1_E2E_Test1 - Updates Dashboard" page
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    And the "Test_11-5_01" page is displayed
    When press "Mark as Unread" button
    Then verify the "Mark as Unread" button is disabled
    When press "Back" button
    Then the "01_13Jan REG - Updates Dashboard - All Updates" page is displayed
    When press the "Unread Updates" subsection
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    And press "Back" button
    And verify the "Test_11-5_01" update is not displayed

  @mutable
  Scenario: TC003_01_SuperAdmin_DashboardUpdates - Create and revert a modification of an update
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When search for "Test_11-5_01" update from the "1_E2E_Test1 - Updates Dashboard" page
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then enter "ca, test" in the "User Assigned" field
    And select "ca, test" from the search results
    And select "High" option in the "Priority" field in the "Update Details" subsection
    And select "Update Closed" option in the "Status" field in the "Update Details" subsection
    And enter "ECA, test" in the "Watch List" field
    And select "ECA, test" from the search results
    When press "Save" button on the selected update
    Then verify "Regulatory update updated successfully" toast message is displayed in the "Test_11-5_01" page
  #Rectifico para restaurar los datos 
    When open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then enter "RBT, testclientadmin" in the "User Assigned" field
    And select "RBT, testclientadmin" from the search results
    And select "Low" option in the "Priority" field in the "Update Details" subsection
    And select "Update Allocated" option in the "Status" field in the "Update Details" subsection
    And press "clear" in the "Watch List" field
    When press "Save" button on the selected update
    Then verify "Regulatory update updated successfully" toast message is displayed in the "Test_11-5_01" page

  @mutable
  Scenario: TC003_02_SuperAdmin_DashboardUpdates - Simulate a modification of an update (Back button)
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When search for "Test_11-5_01" update from the "1_E2E_Test1 - Updates Dashboard" page
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then enter "ca, test" in the "User Assigned" field
    And select "ca, test" from the search results
    And select "High" option in the "Priority" field in the "Update Details" subsection
    And select "Update Closed" option in the "Status" field in the "Update Details" subsection
    And enter "ECA, test" in the "Watch List" field
    And select "ECA, test" from the search results
    When press "Back" button
    Then the "Unsaved Changes" popup is displayed
    And the popup message is "If you leave this page, your changes will be lost. Do you want to continue without saving?"
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button
    Then verify "ca, test" value is displayed in the "User Assigned" field
    And verify "High" value is displayed in the "Priority" field
    And verify "Update Closed" value is displayed in the "Status" field
    And verify "ECA, test" value is displayed in the "Watch List" field

  @mutable
  Scenario: TC003_03_SuperAdmin_DashboardUpdates - Cancel a modification of an update
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When search for "Test_11-5_01" update from the "1_E2E_Test1 - Updates Dashboard" page
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    When press "Edit" button on the selected update
    Then enter "ca, test" in the "User Assigned" field
    And select "ca, test" from the search results
    And select "High" option in the "Priority" field in the "Update Details" subsection
    And select "Update Closed" option in the "Status" field in the "Update Details" subsection
    And enter "ECA, test" in the "Watch List" field
    And select "ECA, test" from the search results
    When press "Back" button
    Then the "Unsaved Changes" popup is displayed
    When press "Continue" button
    Then the "1_E2E_Test1 - Updates Dashboard" page is displayed
    And open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    And verify the "User Assigned" field does not display "ca, test"
    And verify the "Priority" field does not display "High"
    And verify the "Status" field does not display "Update Closed"
    And verify the "Watch List" field does not display "ECA, test"

  @mutable
  Scenario: TC003_04_SuperAdmin_DashboardUpdates - Create and delete a comment
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When search for "Test_11-5_01" update from the "1_E2E_Test1 - Updates Dashboard" page
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    And enter "QaTest comment" in the "Comments" field
    When press "Comment" button
    Then verify the posted comment is seen along with timestamp and edit, reply and delete option
  #Borramos el comentario para dejar el sistema como estaba
    When press "Delete" button
    Then verify the comment is not displayed in the "Comments" field

  @mutable
  Scenario Outline: TC003_05_SuperAdmin_DashboardUpdates - Upload and delete a valid attachment
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When search for "Test_11-5_01" update from the "1_E2E_Test1 - Updates Dashboard" page
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    When open the "Attachments" tab in the "Test_11-5_01" popup
    And click on "Upload files" option from the "Test_11-5_01" page
    Then select a "<valid extension>" format file from "<file path>" and upload it
    And verify the "<name>" attachment is displayed in the "Attachments" section
  #Borramos el attachment 
    When press "Remove" button on the attachment
    Then verify the attachment is not displayed in the "Attachments" section

    Examples:
      | valid extension | file path              | name         |
      | pdf             | test-data/valid.pdf    | valid.pdf    |
      | pdf             | test-data/invalid.pdf  | invalid.pdf  |
      | xlsx            | test-data/valid.xlsx   | valid.xlsx   |
      | svg             | test-data/valid.svg    | valid.svg    |
      | png             | test-data/valid.png    | valid.png    |
      | docx            | test-data/invalid.docx | invalid.docx |

  @mutable
  Scenario Outline: TC003_06_SuperAdmin_DashboardUpdates - Upload an attachment with unsupported format
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When search for "Test_11-5_01" update from the "1_E2E_Test1 - Updates Dashboard" page
    Then open the first update in the "1_E2E_Test1 - Updates Dashboard" page
    When press "Attachments" button
    And click on "Upload files" option from the "1_E2E_Test1 - Updates Dashboard" page
    When select a "<invalid extension>" format file from "<file path>" and upload it
    Then a message should get displayed as "<expected message>"
    And verify the "<name>" attachment is not displayed in the "Attachments" section

    Examples:
      | invalid extension | file path                  | expected message | name             |
      | xls               | test-data/valid.xls        |                  | valid.xls        |
      | jpg               | test-data/invalid.jpg      |                  | invalid.jpg      |
      | csv               | test-data/invalid.csv      |                  | invalid.csv      |
      | txt               | test-data/invalid.txt      |                  | invalid.txt      |
      | xlsx              | test-data/Fichero94MB.xlsx |                  | Fichero94MB.xlsx |

  @readOnly
  Scenario: TC004_SuperAdmin_DashboardUpdates - Verify search
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    And press "Clear all filters" section on the Dashboard filter if available
    And save the "1_E2E_Test1 - Updates Dashboard" items
    When search for "Income" update in the Analytics Dashboard
    Then verify only updates that contain "Income" in the title are displayed
    When press "Enter" key on the keyboard
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same

  @readOnly
  Scenario: TC005_SuperAdmin_DashboardUpdates - Verify auto suggestions for updates
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    And press "Clear all filters" section on the Dashboard filter if available
    And press "Clear" button on the search field if available
    And save the "1_E2E_Test1 - Updates Dashboard" items
    When search for "zz" update in the Analytics Dashboard
    Then verify no updates are displayed
    When press "Enter" key on the keyboard
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same
    And the "There is no data to display." message is displayed in the "1_E2E_Test1 - Updates Dashboard" page
    And press "Clear" button on the search field
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is the same

  @readOnly
  Scenario: TC006_01_SuperAdmin_DashboardUpdates - Reset the filter
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    Then save the "1_E2E_Test1 - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When press "More Filters" button on the Dashboard filter
    Then verify the "Tags;Date Announced;Date Effective;Last Updated" option is displayed in the Dashboard filter
    When press "Less Filters" button on the Dashboard filter
    Then verify the "Tags;Date Announced;Date Effective;Last Updated" option is not displayed in the Dashboard filter
    When select "Argentina" in the "Jurisdiction" filter on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    When press "Close" button on the Dashboard filter
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is the same

  @readOnly
  Scenario: TC006_02_SuperAdmin_DashboardUpdates - Apply a predefined filter
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    Then press "Clear all filters" section on the Dashboard filter if available
    And save the "1_E2E_Test1 - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When press "More Filters" button
    Then select "Date Announced" on the Dashboard filter
    And verify the "Start date;End date" option is displayed in the Dashboard filter
    And select "3 Sep 2025" in the "Start date" filter on the Dashboard filter
    And select "30 Nov 2025" in the "End date" filter on the Dashboard filter
    When press "View results" button on the Dashboard filter
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same

  @mutable @cleanup
  Scenario: TC006_03_SuperAdmin_DashboardUpdates - Create, save and delete a custom filter
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    And register cleanup to remove saved filter "QaTest" from "1_E2E_Test1 - Updates Dashboard - All Updates"
    When press "Filter" button on the Dashboard filter
    Then remove saved filter "QaTest" if it exists on the Dashboard filter
    When select "Awaiting Allocation" in the "Status" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    And verify "Filter Name is required." error message appears on the Dashboard filter
    When fill "QaTest" in the "Filter Name" field on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter saved successfully." toast message is displayed in the "1_E2E_Test1 - Updates Dashboard" page
    When press "Filter" button on the Dashboard filter
    And press "Edit" button on the Dashboard filter
    Then verify the "QaTest" filter is displayed in the "Saved Filters" section on the Dashboard filter
    When press "Delete filter" button for "QaTest" on the Dashboard filter
    Then the "Confirm Delete" popup is displayed
    And press "Delete" button
    Then verify "Saved filter deleted successfully." toast message is displayed in the "1_E2E_Test1 - Updates Dashboard" page

  @readOnly
  Scenario: TC006_04_SuperAdmin_DashboardUpdates - Apply a customized filter
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    Then press "Clear all filters" section on the Dashboard filter if available
    And save the "1_E2E_Test1 - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    Then select "PruebaRMM 03" located in the "Saved Filters" section on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same

  @mutable
  Scenario: TC006_05_SuperAdmin_DashboardUpdates - Mark and unmark a filter as favourite
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    Then press "Clear all filters" section on the Dashboard filter if available
    And save the "1_E2E_Test1 - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    Then press "Save as favourite" button for "PruebaRMM 03" on the Dashboard filter
    And verify "Filter updated successfully." toast message is displayed in the "1_E2E_Test1 - Updates Dashboard" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    Then the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same
    When press "Remove as favourite" button for "PruebaRMM 03" on the Dashboard filter
    Then verify "Filter updated successfully." toast message is displayed in the "1_E2E_Test1 - Updates Dashboard" page
    And logout from the application

  @readOnly
  Scenario: TC006_06_SuperAdmin_DashboardUpdates - Clear all filters
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When press "Filter" button on the Dashboard filter
    Then select "Awaiting Allocation" in the "Status" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then save the "1_E2E_Test1 - Updates Dashboard" items
    When press "Clear all filters" button
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same

  @readOnly
  Scenario: TC007_01_SuperAdmin_DashboardUpdates - Apply two filters
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    Then press "Clear all filters" section on the Dashboard filter if available
    And save the "1_E2E_Test1 - Updates Dashboard" items
    Then select "Medium" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same
    When press "Filter" button on the Dashboard filter
    Then select "Italy" in the "Jurisdiction" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "1_E2E_Test1 - Updates Dashboard" item count is not the same

  @readOnly
  Scenario: TC007_02_SuperAdmin_DashboardUpdates - Verify actions dashboard select all filter after applying two filters
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    When press "Filter" button on the Dashboard filter
    When expand the "Jurisdiction" filter on the Dashboard filter
    Then verify "Select All" is "unchecked" in the "Jurisdiction" filter on the Dashboard filter
    When click on "Select All" in the "Jurisdiction" filter on the Dashboard filter
    Then verify all options are selected in the "Jurisdiction" filter on the Dashboard filter
    When collapse the "Jurisdiction" filter on the Dashboard filter
    And expand the "Jurisdiction" filter on the Dashboard filter
    Then verify all options are selected in the "Jurisdiction" filter on the Dashboard filter
    When click on "Select All" in the "Jurisdiction" filter on the Dashboard filter
    Then verify no options are selected in the "Jurisdiction" filter on the Dashboard filter
    When select the first 2 options in the "Jurisdiction" filter on the Dashboard filter
    Then verify "Select All" is "partially selected" in the "Jurisdiction" filter on the Dashboard filter
    When select all remaining options in the "Jurisdiction" filter on the Dashboard filter
    Then verify "Select All" is "checked" in the "Jurisdiction" filter on the Dashboard filter
    When deselect the first option in the "Jurisdiction" filter on the Dashboard filter
    Then verify "Select All" is "partially selected" in the "Jurisdiction" filter on the Dashboard filter
    When expand the "Status" filter on the Dashboard filter
    Then verify no options are selected in the "Status" filter on the Dashboard filter
    When click on "Select All" in the "Status" filter on the Dashboard filter
    Then verify all options are selected in the "Status" filter on the Dashboard filter
    And verify the "Jurisdiction" filter selection remains unchanged on the Dashboard filter

  @mutable
  Scenario: TC008_SuperAdmin_DashboardUpdates - Verify updates dashboard dashboard options
    Given the "1_E2E_Test1 - Updates Dashboard - All Updates" page is open
    Then press "Dashboard options" button
    When verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify the "Updates Dashboard" tab is selected in the Dashboard Options popup
    And verify "Edit Updates Dashboard" is displayed in the Dashboard Options popup
    And verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are displayed in the Dashboard Options popup
    And verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are selected in the Dashboard Options popup
    When deselect "Status" column in the Dashboard Options popup
    Then verify "Status" column is not selected in the Dashboard Options popup
    When press "Save" button in the Dashboard Options popup
    Then verify the "Dashboard Options" popup is closed on the Dashboard
    And verify "Status" column header is not displayed in the "1_E2E_Test1 - Updates Dashboard" page
    And logout from the application
