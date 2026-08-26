@ActionsDashboard @ActionsDashboard_TeamLeader
Feature: Dashboard Actions for Team Leader

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMLEADER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC009_01_TeamLeader_DashboardActions - Verify dashboard actions tab
    When click on "01_QA_StageTestPortal" of the portals
    Then the "Overview" page is displayed
    And verify for client portal name "01_QA_StageTestPortal - Overview"
    When press "Open Dashboard" button
    Then the "01_QA_StageTestPortal - Updates Dashboard" page is displayed
    And verify "Updates;Actions;Analytics" tabs are displayed in "01_QA_StageTestPortal - Updates Dashboard" page
    When press "Actions" button
    Then the "01_QA_StageTestPortal - Actions Dashboard" page is displayed
    And verify "All Actions" tabs are displayed in "01_QA_StageTestPortal - Actions Dashboard" page
    When press "My Actions" button
    And verify pagination is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page

  @readOnly
  Scenario Outline: TC009_02_TeamLeader_DashboardActions - Verify default column header and sorting
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    Then verify "<column>" column header is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on "<column>" column header in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then verify items are sorted in "ascending" order by "<column>" in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on "<column>" column header in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then verify items are sorted in "descending" order by "<column>" in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on "<column>" column header in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then verify sorting is removed for "<column>" in the "01_QA_StageTestPortal - Actions Dashboard" page

    Examples:
      | column          |
      | Update Title    |
      | Action          |
      | User Assigned   |
      | Deadline Date   |
      | Update Priority |
      | Action Priority |
      | Action Status   |

  @mutable
  Scenario: TC010_01_TeamLeader_DashboardActions - Create new action from the actions dashboard
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Add Action" button
    Then the "Add Action" popup is displayed
    And verify "Update;Action;User Assigned;Priority;Status;Deadline Date" are displayed in the "Add Action" popup
    And verify comments section is not displayed in the "Add Action" popup
    And verify attachments section is not displayed in the "Add Action" popup
    When press "Save" button
    Then verify "Update title is required.;Action is required.;Assigned User is required;Priority is required.;Status is required.;Deadline is required." validation messages are displayed in the "Add Action" popup
    When fill the "Update" field with "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" value in the "Add Action" popup
    And fill the "Action" field with "Test Action" value in the "Add Action" popup
    And select "Alam, Asjad" options in the "User Assigned" field in the "Add Action" popup
    And select "Medium" option in the "Priority" field in the "Add Action" popup
    And select "In Progress" option in the "Status" field in the "Add Action" popup
    And select today's date from the "Deadline" calendar in the "Add Action" popup
    And press "Close" button
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" value is displayed in the "Update" field on the "Add Action" popup
    And verify "Test Action" value is displayed in the "Action" field on the "Add Action" popup
    And verify "Alam, Asjad" options are selected in the "User Assigned" field on the "Add Action" popup
    And verify "Medium" option is selected in the "Priority" field on the "Add Action" popup
    And verify "In Progress" option is selected in the "Status" field on the "Add Action" popup
    And verify today's date is displayed in the "Deadline" field on the "Add Action" popup
    When press "Save" button
    Then verify "Action added successfully" toast message is displayed in the "01_13Jan REG - Actions Dashboard" page
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    And double-click "Test_TeamLeader2" option on the Dashboard filter
    And press "View results" button on the Dashboard filter
    And click on "Deadline Date" column header in the "01_QA_StageTestPortal - Actions Dashboard" page
    And click on "Deadline Date" column header in the "01_QA_StageTestPortal - Actions Dashboard" page
    And verify "Test Action" action is displayed in the first row of the "01_QA_StageTestPortal - Actions Dashboard" page

  @mutable
  Scenario: TC010_02_TeamLeader_DashboardActions - Verify editing an action
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    And double-click "Test_TeamLeader" option on the Dashboard filter
    And press "View results" button on the Dashboard filter
    And search for "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then verify "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When select "satestclientuser2, satestclientuser2" option in the "User Assigned" field in the "Update Action" popup
    And select "Not Started" option in the "Status" field in the "Update Action" popup
    And select "High" option in the "Priority" field in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    And verify "satestclientuser2, satestclientuser2" option is selected in the "User Assigned" field on the "Update Action" popup
    And verify "Not Started" option is selected in the "Status" field on the "Update Action" popup

  @mutable
  Scenario: TC010_03_TeamLeader_DashboardActions - Verify the private action toggle
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    And double-click "Test_TeamLeader" option on the Dashboard filter
    And press "View results" button on the Dashboard filter
    And search for "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then verify "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When enable the "Private Action" toggle in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    And verify the "Private Action" toggle is enabled in the "Update Action" popup
    When disable the "Private Action" toggle in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    And verify the "Private Action" toggle is disabled in the "Update Action" popup

  @mutable
  Scenario: TC010_04_TeamLeader_DashboardActions - Verify adding a comment to an action
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    And double-click "Test_TeamLeader" option on the Dashboard filter
    And press "View results" button on the Dashboard filter
    And search for "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then verify "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When open the "Comments" tab in the "Update Action" popup
    And enter "Test comment" comment in the "Update Action" popup
    And press "Comment" button in the "Update Action" popup
    Then verify "Test comment" comment is displayed in the "Update Action" popup
    And verify a date is displayed for "Test comment" comment in the "Update Action" popup
    And verify actions are displayed for "Test comment" comment in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page

  @mutable
  Scenario: TC010_05_TeamLeader_DashboardActions - Verify uploading an attachment to an action
    #Diseñados para fallar
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    And double-click "Test_TeamLeader" option on the Dashboard filter
    And press "View results" button on the Dashboard filter
    And search for "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then verify "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When open the "Attachments" tab in the "Update Action" popup
    When upload "<file path>" attachment in the "Update Action" popup
    And verify "<name>" attachment is displayed in the "Update Action" popup

    Examples:
      | valid extension | file path              | name         |
      | pdf             | test-data/valid.pdf    | valid.pdf    |
      | pdf             | test-data/invalid.pdf  | invalid.pdf  |
      | xlsx            | test-data/valid.xlsx   | valid.xlsx   |
      | svg             | test-data/valid.svg    | valid.svg    |
      | png             | test-data/valid.png    | valid.png    |
      | docx            | test-data/invalid.docx | invalid.docx |

  @mutable
  Scenario Outline: TC010_06_TeamLeader_DashboardActions - Upload an attachment with unsupported format
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    And double-click "Test_TeamLeader" option on the Dashboard filter
    And press "View results" button on the Dashboard filter
    And search for "Employment Taxes_Outstanding Update is approaching Effective Date 30 days" update in the "01_QA_StageTestPortal - Actions Dashboard" page
    When click on the first action in the "01_QA_StageTestPortal - Actions Dashboard" page
    Then the "Update Action" popup is displayed
    When open the "Attachments" tab in the "Update Action" popup
    When upload "<file path>" attachment in the "Update Action" popup
    Then a message should get displayed as "<expected message>"
    And verify "<name>" attachment is not displayed in the "Update Action" popup
    When select "Complete" option in the "Status" field in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    And verify "Test Action" action is not displayed in the "01_QA_StageTestPortal - Actions Dashboard" page

    Examples:
      | invalid extension | file path                  | expected message | name             |
      | xls               | test-data/valid.xls        |                  | valid.xls        |
      | jpg               | test-data/invalid.jpg      |                  | invalid.jpg      |
      | csv               | test-data/invalid.csv      |                  | invalid.csv      |
      | txt               | test-data/invalid.txt      |                  | invalid.txt      |
      | xlsx              | test-data/Fichero94MB.xlsx |                  | Fichero94MB.xlsx |

  @mutable
  Scenario: TC011_01_TeamLeader_DashboardActions - Verify adding an action from the update details page
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When search for "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" update from the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    Then verify "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" update is displayed from the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    When open the first update in the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    Then the "Update Details" page is displayed from the Updates Dashboard
    And verify "Update Details;Update Actions" tabs are displayed on the selected update
    When open the "Update Actions" tab on the selected update
    When press "Add Action" button
    Then the "Add Action" popup is displayed
    And verify "Action;User Assigned;Priority;Status;Deadline Date" are displayed in the "Add Action" popup
    And verify comments section is not displayed in the "Add Action" popup
    And verify attachments section is not displayed in the "Add Action" popup
    And verify "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" value is displayed in the "Update" field on the "Add Action" popup
    When press "Save" button
    Then verify "Action is required.;Assigned User is required;Priority is required.;Status is required.;Deadline is required." validation messages are displayed in the "Add Action" popup
    When fill the "Action" field with "Test Action" value in the "Add Action" popup
    And select "Alam, Asjad" options in the "User Assigned" field in the "Add Action" popup
    And select "Medium" option in the "Priority" field in the "Add Action" popup
    And select "In Progress" option in the "Status" field in the "Add Action" popup
    And select today's date from the "Deadline" calendar in the "Add Action" popup
    When press "Close" button
    Then the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    Then verify "Test Action" value is displayed in the "Action" field on the "Add Action" popup
    When press "Save" button
    Then verify "Action added successfully" toast message is displayed in the "Update Actions" page

  @mutable
  Scenario: TC011_02_TeamLeader_DashboardActions - Verify editing an action from the update details page
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" update from the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the "Update Actions" tab on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And click on the first action in the "Update Actions" page
    Then the "Update Action" popup is displayed
    When select "satestclientuser3, satestclientuser3" option in the "User Assigned" field in the "Update Action" popup
    And select "Not Started" option in the "Status" field in the "Update Action" popup
    And select "High" option in the "Priority" field in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "Update Actions" page
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    When click on the first action in the "Update Actions" page
    Then the "Update Action" popup is displayed
    And verify "satestclientuser3, satestclientuser3" option is selected in the "User Assigned" field on the "Update Action" popup
    And verify "Not Started" option is selected in the "Status" field on the "Update Action" popup

  @mutable
  Scenario: TC011_03_TeamLeader_DashboardActions - Verify the private action toggle from the update details page
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" update from the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the "Update Actions" tab on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And click on the first action in the "Update Actions" page
    Then the "Update Action" popup is displayed
    When enable the "Private Action" toggle in the "Update Action" popup
    And verify the "Private Action" toggle is enabled in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "Update Actions" page
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    When click on the first action in the "Update Actions" page
    Then the "Update Action" popup is displayed
    And verify the "Private Action" toggle is enabled in the "Update Action" popup
    When disable the "Private Action" toggle in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "Update Actions" page
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    When click on the first action in the "Update Actions" page
    Then the "Update Action" popup is displayed
    And verify the "Private Action" toggle is disabled in the "Update Action" popup

  @mutable
  Scenario: TC011_04_TeamLeader_DashboardActions - Verify adding a comment to an action from the update details page
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" update from the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the "Update Actions" tab on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And click on the first action in the "Update Actions" page
    Then the "Update Action" popup is displayed
    When open the "Comments" tab in the "Update Action" popup
    And enter "Test comment" comment in the "Update Action" popup
    And press "Comment" button in the "Update Action" popup
    Then verify "Test comment" comment is displayed in the "Update Action" popup
    And verify a date is displayed for "Test comment" comment in the "Update Action" popup
    And verify actions are displayed for "Test comment" comment in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "Update Actions" page

  @mutable
  Scenario: TC011_05_TeamLeader_DashboardActions - Verify uploading an attachment to an action from the update details page
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" update from the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard" page
    And open the "Update Actions" tab on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And click on the first action in the "Update Details" page
    Then the "Update Action" popup is displayed
    When open the "Attachments" tab in the "Update Action" popup
    When upload "<file path>" attachment in the "Update Action" popup
    And verify "<name>" attachment is displayed in the "Update Action" popup
    And press "Update" button in the "Update Action" popup
    Then verify "Action updated successfully" toast message is displayed in the "Update Actions" page

    Examples:
      | valid extension | file path              | name         |
      | pdf             | test-data/valid.pdf    | valid.pdf    |
      | pdf             | test-data/invalid.pdf  | invalid.pdf  |
      | xlsx            | test-data/valid.xlsx   | valid.xlsx   |
      | svg             | test-data/valid.svg    | valid.svg    |
      | png             | test-data/valid.png    | valid.png    |
      | docx            | test-data/invalid.docx | invalid.docx |

  @mutable
  Scenario Outline: TC011_06_TeamLeader_DashboardActions - Upload an attachment with unsupported format from the update details page
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When search for "Employment Taxes_Outstanding Update is approaching Effective Date 7 days" update from the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the first update in the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page
    And open the "Update Actions" tab on the selected update
    And press "Action Status" header on the selected update
    And press "Action Status" header on the selected update
    And click on the first action in the "Update Actions" page
    Then the "Update Action" popup is displayed
    When open the "Attachments" tab in the "Update Action" popup
    When open the "Attachments" tab in the "Update Action" popup
    When upload "<file path>" attachment in the "Update Action" popup
    Then a message should get displayed as "<expected message>"
    And verify "<name>" attachment is not displayed in the "Update Action" popup

    Examples:
      | invalid extension | file path                  | expected message | name             |
      | xls               | test-data/valid.xls        |                  | valid.xls        |
      | jpg               | test-data/invalid.jpg      |                  | invalid.jpg      |
      | csv               | test-data/invalid.csv      |                  | invalid.csv      |
      | txt               | test-data/invalid.txt      |                  | invalid.txt      |
      | xlsx              | test-data/Fichero94MB.xlsx |                  | Fichero94MB.xlsx |

  @readOnly
  Scenario Outline: TC012_01_TeamLeader_DashboardActions - Verify filtering the 01_QA_StageTestPortal - Actions Dashboard by
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    Then verify the "<filter>" option is displayed in the Dashboard filter
    When select "<value>" in the "<filter>" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed for "<filter>" with value "<value>"

    Examples:
      | filter          | value       |
      | Jurisdiction    | Canada      |
      | Update Priority | Low         |
      | Action Priority | High        |
      | Action Status   | In Progress |
      | User Assigned   | Alam, Asjad |

  @readOnly
  Scenario: TC012_02_TeamLeader_DashboardActions - Verify filtering the 01_QA_StageTestPortal - Actions Dashboard by deadline range
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    Then verify the "Deadline Range" option is displayed in the Dashboard filter
    When select "20/08/2026" from the "Start Date" calendar on the Dashboard filter
    And select "26/08/2026" from the "End Date" calendar on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed
    And verify every filtered action has a deadline within the selected range

  @mutable
  Scenario: TC012_03_TeamLeader_DashboardActions - Verify saving a filter
    Given the "01_QA_StageTestPortal - Updates Dashboard - All Updates" page is open
    When remove saved filter "Test DashboardAction" if it exists on the Dashboard filter
    When press "Filter" button on the Dashboard filter
    When select "Low" in the "Action Priority" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    When press "Save filter" button on the Dashboard filter
    Then verify "Filter Name is required." error message appears on the Dashboard filter
    When fill "Test DashboardAction" in the "Filter Name" field on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter saved successfully." toast message is displayed in the "Actions Dashboard" page
    And verify filtered actions are displayed for "Action Priority" with value "Low"
    When press "Filter" button on the Dashboard filter
    Then verify the "Saved Filters" option is displayed in the Dashboard filter
    And verify the "Test DashboardAction" filter is displayed in the "Saved Filters" section on the Dashboard filter

  @mutable
  Scenario: TC012_04_TeamLeader_DashboardActions - Verify editing and deleting a saved filter
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    When select "Test DashboardAction" located in the "Saved Filters" section on the Dashboard filter
    And press "Edit" button on the Dashboard filter
    And deselect "Low" in the "Action Priority" filter on the Dashboard filter
    And select "High" in the "Action Priority" filter on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify the "Name Filter" modal is displayed on the Dashboard filter
    When append " update" to the saved filter name on the Dashboard filter
    And press "Save filter" button on the Dashboard filter
    Then verify "Filter updated successfully." toast message is displayed in the "Actions Dashboard" page
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And double-click "Test DashboardAction update" option on the Dashboard filter
    And press "Edit" button on the Dashboard filter
    And press "Delete filter" button for "Test DashboardAction update" on the Dashboard filter
    When press "Delete" button on the "Confirm Delete" popup
    Then verify "Saved filter deleted successfully." toast message is displayed in the "Actions Dashboard" page

  @readOnly
  Scenario: TC012_05_TeamLeader_DashboardActions - Verify resetting the 01_QA_StageTestPortal - Actions Dashboard filters
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    When select "Low" in the "Action Priority" filter on the Dashboard filter
    And select "United Kingdom" in the "Jurisdiction" filter on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify filtered actions are displayed for "Action Priority" with value "Low"
    And verify filtered actions are displayed for "Jurisdiction" with value "United Kingdom"
    When press "Filter" button on the Dashboard filter
    And press "Reset Filters" button on the Dashboard filter
    And press "View results" button on the Dashboard filter
    Then verify all filters are reset to their default values on the Dashboard filter

  @readOnly
  Scenario: TC013_TeamLeader_DashboardActions - Verify actions dashboard select all filter
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
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
    When expand the "Action Status" filter on the Dashboard filter
    Then verify no options are selected in the "Action Status" filter on the Dashboard filter
    When click on "Select All" in the "Action Status" filter on the Dashboard filter
    Then verify all options are selected in the "Action Status" filter on the Dashboard filter
    And verify the "Jurisdiction" filter selection remains unchanged on the Dashboard filter

  @mutable @cleanup
  Scenario: TC018_TeamLeader_DashboardActions - Verify actions dashboard dashboard options Action
    Given the "01_QA_StageTestPortal - Actions Dashboard" page is open
    Then verify "Action Status" column header is displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    When press "Dashboard Options" button on the Dashboard
    Then verify the "Dashboard Options" popup is displayed on the Dashboard
    And verify the "Actions Dashboard" tab is selected in the Dashboard Options popup
    And verify "Edit Actions Dashboard" is displayed in the Dashboard Options popup
    And verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are displayed in the Dashboard Options popup
    And verify "Update Title;Action;User Assigned;Deadline Date;Update Priority;Action Priority;Action Status" columns are selected in the Dashboard Options popup
    When deselect "Action Status" column in the Dashboard Options popup
    Then verify "Action Status" column is not selected in the Dashboard Options popup
    When press "Save" button in the Dashboard Options popup
    Then verify the "Dashboard Options" popup is closed on the Dashboard
    And verify "Action Status" column header is not displayed in the "01_QA_StageTestPortal - Actions Dashboard" page
    And logout from the application
