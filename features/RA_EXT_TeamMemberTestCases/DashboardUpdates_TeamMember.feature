@DashboardUpdate @DashboardUpdate_TeamMember
Feature: Dashboard page for Team Member

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMMEMBER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_01_TeamMember_DashboardUpdates - Navigate to dashboard updates page
    When click on "01_QA_StageTestPortal" of the portals
    Then the "01_QA_StageTestPortal - Overview" page is displayed
    When press "Open Dashboard" button
    Then the "01_QA_StageTestPortal - Updates Dashboard" page is displayed
    And verify "All Updates" tabs are displayed in "01_QA_StageTestPortal - Updates Dashboard" page
    And verify "Updates;Actions;Analytics" tabs are displayed in "01_QA_StageTestPortal - Updates Dashboard" page
    When press the "Unread Updates" subsection
    Then verify pagination is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page

  @readOnly
  Scenario Outline: TC001_02_TeamMember_DashboardUpdates - Sort column headers and verify the sorting functionality
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    Then verify "<column>" column header is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    When click on "<column>" column header in the "01_QA_StageTestPortal - Updates Dashboard" page
    Then verify items are sorted in "ascending" order by "<column>" in the "01_QA_StageTestPortal - Updates Dashboard" page
    When click on "<column>" column header in the "01_QA_StageTestPortal - Updates Dashboard" page
    Then verify items are sorted in "descending" order by "<column>" in the "01_QA_StageTestPortal - Updates Dashboard" page
    When click on "<column>" column header in the "01_QA_StageTestPortal - Updates Dashboard" page
    Then verify sorting is removed for "<column>" in the "01_QA_StageTestPortal - Updates Dashboard" page

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
  Scenario: TC002_01_TeamMember_DashboardUpdates - Verify read/unread functionality on the "Unread Updates" tab
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "32Increase of maximum meal voucher vaalue" update from the "01_QA_StageTestPortal - Updates Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    Then the "32Increase of maximum meal voucher vaalue" page is displayed
    When press "Mark as Unread" button on the selected update
    Then verify the "Mark as Unread" button is disabled on the selected update
    When press "Back" button
    Then the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is displayed
    When press the "Unread Updates" subsection
    And press "Clear" button in the search field
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Back" button
    Then verify the "32Increase of maximum meal voucher vaalue" update is not displayed

  @mutable
  Scenario: TC003_01_TeamMember_DashboardUpdates - Simulate a modification of an update with the Back button
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "32Increase of maximum meal voucher vaalue" update from the "01_QA_StageTestPortal - Updates Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    And select "Update Closed" option in the "Status" field in the "Update Details" subsection
    And select "satestclientuser3, satestclientuser3" in the "Watch List" field on the selected update
    When press "Back" button
    Then the "Unsaved Changes" popup is displayed
    And the popup message is "If you leave this page, your changes will be lost. Do you want to continue without saving?"
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button
    Then verify "Update Closed" value is displayed in the "Status" field
    And verify "satestclientuser3, satestclientuser3" value is displayed in the "Watch List" field

  @mutable
  Scenario: TC003_02_TeamMember_DashboardUpdates - Cancel a modification of an update
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "32Increase of maximum meal voucher vaalue" update from the "01_QA_StageTestPortal - Updates Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Edit" button on the selected update
    And select "Update Closed" option in the "Status" field in the "Update Details" subsection
    And select "satestclientuser3, satestclientuser3" in the "Watch List" field on the selected update
    When press "Back" button
    Then the "Unsaved Changes" popup is displayed
    When press "Continue" button
    Then the "01_QA_StageTestPortal - Updates Dashboard" page is displayed
    When open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    Then verify the "Status" field does not display "Update Closed"
    And verify the "Watch List" field does not display "satestclientuser3, satestclientuser3"

  @mutable
  Scenario: TC003_03_TeamMember_DashboardUpdates - Create and delete a comment
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "32Increase of maximum meal voucher vaalue" update from the "01_QA_StageTestPortal - Updates Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When enter "QaTest comment" in the "Comments" field
    When press "Comment" button
    Then verify the posted comment is seen along with timestamp and edit, reply and delete option
  #Borramos el comentario para dejar el sistema como estaba
    When press "Delete" button
    Then verify the comment is not displayed in the "Comments" field

  @mutable
  Scenario Outline: TC003_04_TeamMember_DashboardUpdates - Upload and delete a valid attachment
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "32Increase of maximum meal voucher vaalue" update from the "01_QA_StageTestPortal - Updates Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When open the "Attachments" tab in the "Update Details" subsection
    And upload "<file path>" attachment in the "Update Details" Attachments tab
    And select a "<valid extension>" format file from "<file path>" and upload it
    Then verify the "<name>" attachment is displayed in the "Attachments" section
  #Borramos el attachment 
    When press "Remove" button on the attachment
    Then verify the "<name>" attachment is not displayed in the "Attachments" section

    Examples:
      | valid extension | file path              | name         |
      | pdf             | test-data/valid.pdf    | valid.pdf    |
      | pdf             | test-data/invalid.pdf  | invalid.pdf  |
      | xlsx            | test-data/valid.xlsx   | valid.xlsx   |
      | svg             | test-data/valid.svg    | valid.svg    |
      | png             | test-data/valid.png    | valid.png    |
      | docx            | test-data/invalid.docx | invalid.docx |

  @mutable
  Scenario Outline: TC003_06_TeamMember_DashboardUpdates - Upload an attachment with unsupported format
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "32Increase of maximum meal voucher vaalue" update from the "01_QA_StageTestPortal - Updates Dashboard" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Attachments" button
    And upload "<file path>" attachment in the "Update Details" Attachments tab
    When select a "<invalid extension>" format file from "<file path>" and upload it
    Then a message should get displayed as "<expected message>"
    And verify the "<name>" attachment is not displayed in the "Attachments" section

    Examples:
      | invalid extension | file path                  | expected message                                                         | name             |
      | xls               | test-data/valid.xls        | Invalid file type \\".xls\\". Allowed types: pdf, xlsx, svg, png, docx.  | valid.xls        |
      | jpg               | test-data/invalid.jpg      | Invalid file type \\".jpg\\". Allowed types: pdf, xlsx, svg, png, docx.  | invalid.jpg      |
      | csv               | test-data/invalid.csv      | Invalid file type \\".csv\\". Allowed types: pdf, xlsx, svg, png, docx.  | invalid.csv      |
      | txt               | test-data/invalid.txt      | Invalid file type \\".txt\\". Allowed types: pdf, xlsx, svg, png, docx.  | invalid.txt      |
      | xlsx              | test-data/Fichero94MB.xlsx | Invalid file type \\".xlsx\\". Allowed types: pdf, xlsx, svg, png, docx. | Fichero94MB.xlsx |

  @readOnly
  Scenario: TC004_TeamMember_DashboardUpdates - Verify search
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    And save the "01_QA_StageTestPortal - Updates Dashboard" items
    When search for "Income" update in the Analytics Dashboard
    Then verify only updates that contain "Income" in the title are displayed
    When press "Enter" key on the keyboard
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same

  @readOnly
  Scenario: TC005_TeamMember_DashboardUpdates - Verify auto suggestions for updates
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    And press "Clear" button in the search field if available
    And save the "01_QA_StageTestPortal - Updates Dashboard" items
    When search for "zz" update in the Analytics Dashboard
    Then verify no updates are displayed
    When press "Enter" key on the keyboard
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same
    And a message should get displayed as "There is no data to display."
    When press "Clear" button in the search field
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is the same

  @readOnly
  Scenario: TC006_01_TeamMember_DashboardUpdates - Reset the filter
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    Then save the "01_QA_StageTestPortal - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When press "More Filters" button on the Dashboard filter
    Then verify the "Tags;Date Announced;Date Effective;Last Updated" option is displayed in the Dashboard filter
    When press "Less Filters" button on the Dashboard filter
    Then verify the "Tags;Date Announced;Date Effective;Last Updated" option is not displayed in the Dashboard filter
    When select "Australia" in the "Jurisdiction" filter on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    When press "Close" button on the Dashboard filter
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is the same

  @readOnly
  Scenario: TC006_02_TeamMember_DashboardUpdates - Apply a predefined filter
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    And save the "01_QA_StageTestPortal - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters;My Updates;Knowledge Module;Jurisdiction;Impact Areas;Priority;Status" option is displayed in the Dashboard filter
    When press "More Filters" button
    And select "Date Announced" on the Dashboard filter
    Then verify the "Start date;End date" option is displayed in the Dashboard filter
    When select "3 Sep 2025" in the "Start date" filter on the Dashboard filter
    And select "30 Nov 2025" in the "End date" filter on the Dashboard filter
    When press "View results" button on the Dashboard filter
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same

  @mutable @cleanup
  Scenario: TC006_03_TeamMember_DashboardUpdates - Create, save and delete a custom filter
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    And register cleanup to remove saved filter "QaTest" from "01_QA_StageTestPortal - Updates Dashboard - All Updates"
    When press "Filter" button on the Dashboard filter
    And remove saved filter "QaTest" if it exists on the Dashboard filter
    When select "Awaiting Allocation" in the "Status" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    When press "Save filter" button on the Dashboard filter
    Then verify "Filter Name is required." error message appears on the Dashboard filter
    When fill "QaTest" in the "Filter Name" field on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter saved successfully." toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Filter" button on the Dashboard filter
    And press "Edit" button on the Dashboard filter
    Then verify the "QaTest" filter is displayed in the "Saved Filters" section on the Dashboard filter
    When press "Delete filter" button for "QaTest" on the Dashboard filter
    Then the "Confirm Delete" popup is displayed
    When press "Delete" button
    Then verify "Saved filter deleted successfully." toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page

  @readOnly
  Scenario: TC006_04_TeamMember_DashboardUpdates - Apply a customized filter
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    And save the "01_QA_StageTestPortal - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    And select "Test_TeamMember" located in the "Saved Filters" section on the Dashboard filter
    When press "View results" button on the Dashboard filter
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same

  @mutable
  Scenario: TC006_05_TeamMember_DashboardUpdates - Mark and unmark a filter as favourite
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    And save the "01_QA_StageTestPortal - Updates Dashboard" items
    When press "Filter" button on the Dashboard filter
    And press "Save as favourite" button for "Test_TeamMember" on the Dashboard filter
    Then verify "Filter updated successfully." toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    And logout from the application
    When launch Regulatory Advantage application URL and login as "external" user "TEAMMEMBER"
    Then the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same
    When press "Remove as favourite" button for "Test_TeamMember" on the Dashboard filter
    Then verify "Filter updated successfully." toast message is displayed in the "01_QA_StageTestPortal - Updates Dashboard" page
    And logout from the application

  @readOnly
  Scenario: TC006_06_TeamMember_DashboardUpdates - Clear all filters
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When press "Filter" button on the Dashboard filter
    And select "Awaiting Allocation" in the "Status" filter on the Dashboard filter
    When press "View results" button on the Dashboard filter
    Then save the "01_QA_StageTestPortal - Updates Dashboard" items
    When press "Clear all filters" button
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same

  @readOnly
  Scenario: TC007_01_TeamMember_DashboardUpdates - Apply two filters
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When press "Clear all filters" section on the Dashboard filter if available
    And save the "01_QA_StageTestPortal - Updates Dashboard" items
    When select "Medium" in the "Priority" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same
    When press "Filter" button on the Dashboard filter
    And select "Italy" in the "Jurisdiction" filter on the Dashboard filter
    When press "View results" button on the Dashboard filter
    Then verify the "01_QA_StageTestPortal - Updates Dashboard" item count is not the same

  @readOnly
  Scenario: TC007_02_TeamMember_DashboardUpdates - Verify actions dashboard select all filter after applying two filters
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
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

  @mutable @cleanup
  Scenario: TC008_TeamMember_DashboardUpdates - Verify updates dashboard options
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    And register cleanup to restore the "Status" column on "01_QA_StageTestPortal - Updates Dashboard - All Updates"
    When press "Dashboard options" button
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    Then verify the "Updates Dashboard" tab is selected in the Dashboard Options popup
    And verify "Edit Updates Dashboard" is displayed in the Dashboard Options popup
    And verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are displayed in the Dashboard Options popup
    And verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are selected in the Dashboard Options popup
    When deselect "Status" column in the Dashboard Options popup
    Then verify "Status" column is not selected in the Dashboard Options popup
    When press "Save" button in the Dashboard Options popup
    Then verify the "Dashboard Options" popup is closed on the Dashboard
    And verify "Status" column header is not displayed in the "1_E2E_Test1 - Updates Dashboard" page
