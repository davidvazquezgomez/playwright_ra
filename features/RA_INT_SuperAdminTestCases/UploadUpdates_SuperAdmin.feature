@UploadUpdates @UploadUpdates_SuperAdmin
Feature: Upload Updates for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_SuperAdmin_UploadUpdates - Verify required fields and complete upload flow for all applicable clients
    When click on "Menu" option from the left navigation
    Then verify it displays "Upload Updates" option from the left navigation
    When click on "Upload Updates" option from the left navigation
    Then verify if "Upload Updates title;Upload Updates description;Upload files hyperlink;Download updates template hyperlink;Show updates to all applicable clients?;Yes option;Continue button" are displayed on the Upload Updates page
    When press continue button without adding any value to the fields
    Then verify Warning messages should be displayed for each mandatory fields
    When user click at "Download updates template" link
    When select on option "Yes" in "Show updates to all applicable clients?" field
    When click on "Upload files" option from the Upload Updates page
    And select a "xlsx" format file from "test-data/valid.xlsx" and upload it
    Then no upload error message is displayed
    When press "Continue" button

  @mutable
  Scenario Outline: TC002_SuperAdmin_UploadUpdates - Verify upload flow for selected affected clients
    When click on "Menu" option from the left navigation
    Then verify it displays "Upload Updates" option from the left navigation
    When click on "Upload Updates" option from the left navigation
    When click on "Upload files" option from the Upload Updates page
    When select a "xlsx" format file from "test-data/valid.xlsx" and upload it
    And select on option "No" in "Show updates to all applicable clients?" field
    And a message should get displayed as "Affected Clients"
    When user click over the "Select Client" dropdown list
    And user select "Global Inc" client from the dropdown list by clicking on the check-box
    Then the selected client "Global Inc" must get added in the Affected clients list
    When press "Continue" button
    Then the "Upload Summary Page" page is displayed

  @readOnly
  Scenario Outline: TC003_SuperAdmin_UploadUpdates - Verify valid XLS and XLSX uploads complete without validation errors
    When click on "Menu" option from the left navigation
    Then verify it displays "Upload Updates" option from the left navigation
    When click on "Upload Updates" option from the left navigation
    When click on "Upload files" option from the Upload Updates page
    When select a "<valid extension>" format file from "<file path>" and upload it
    Then no upload error message is displayed

    Examples:
      | valid extension | file path            |
      | xls             | test-data/valid.xls  |
      | xlsx            | test-data/valid.xlsx |

  @readOnly
  Scenario Outline: TC004_SuperAdmin_UploadUpdates - Verify validation messages for invalid XLSX content
    When click on "Menu" option from the left navigation
    Then verify it displays "Upload Updates" option from the left navigation
    When click on "Upload Updates" option from the left navigation
    When click on "Upload files" option from the Upload Updates page
    When select a "xlsx" format file from "<wrong content file>" and upload it
    Then a message should get displayed as "<expected message>"

    Examples:
      | wrong content file                                              | expected message        |
      | test-data/spellingErrorsInHeader.xlsx                           | Invalid entry error     |
      | test-data/differentHeaderCaseFormats.xlsx                       | Invalid entry error     |
      | test-data/fileWithIncompleteDetailsUnderValidHeaderColumns.xlsx | Missing entries error   |
      | test-data/fileWithNoRowsUnderValidHeaderColumns.xlsx            | Blank file upload error |
      | test-data/withRecordsAlreadyPresentInTheApplication.xlsx        | Duplicate upload error  |

  @readOnly
  Scenario Outline: TC005_SuperAdmin_UploadUpdates - Verify unsupported file formats are rejected
    When click on "Menu" option from the left navigation
    Then verify it displays "Upload Updates" option from the left navigation
    When click on "Upload Updates" option from the left navigation
    When click on "Upload files" option from the Upload Updates page
    When select a "<invalid extension>" format file from "<file path>" and upload it
    Then a message should get displayed as "<expected message>"

    Examples:
      | invalid extension | file path              | expected message                           |
      | pdf               | test-data/invalid.pdf  | Only excel files (.xls, .xlsx) are allowed |
      | docx              | test-data/invalid.docx | Only excel files (.xls, .xlsx) are allowed |
      | csv               | test-data/invalid.csv  | Only excel files (.xls, .xlsx) are allowed |
      | ppt               | test-data/invalid.pptx | Only excel files (.xls, .xlsx) are allowed |

  @readOnly
  Scenario Outline: TC006_SuperAdmin_UploadUpdates - Verify handling of XLSX with missing required columns
    When click on "Menu" option from the left navigation
    Then verify it displays "Upload Updates" option from the left navigation
    When click on "Upload Updates" option from the left navigation
    When click on "Upload files" option from the Upload Updates page
    When select a "xlsx" format file from "<wrong content file>" and upload it
    Then a message should get displayed as "<expected message>"

    Examples:
      | wrong content file                  | expected message |
      | test-data/missingJurisdiction.xlsx  |                  |
      | test-data/missingImpactArea.xlsx    |                  |
      | test-data/missingDateAnnounced.xlsx |                  |
      | test-data/missingPriority.xlsx      |                  |
      | test-data/missingStatus.xlsx        |                  |
      | test-data/missingLastUpdated.xlsx   |                  |
