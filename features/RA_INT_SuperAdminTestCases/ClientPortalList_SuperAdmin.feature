@ClientPortalList @ClientPortalList_SuperAdmin
Feature: Client Portal List for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_01_SuperAdmin_ClientPortalList - Verify client portal list navigation
    When click on "Edit" button on one of the portals list
    Then the "Client Portal Setup" page is displayed
    When click on "Home" option from the left navigation
    Then the "Client Portal List" page is displayed

  @readOnly
  Scenario: TC001_02_SuperAdmin_ClientPortalList - Verify pagination
    When select "20" option from the "Items per page" dropdown in the "Client Portal List" page
    Then verify 20 client portals are displayed in the "Client Portal List" page
    When press "Next Page" pagination button in the "Client Portal List" page
    Then verify the current page is "2" in the "Client Portal List" page
    When press "Previous Page" pagination button in the "Client Portal List" page
    Then verify the current page is "1" in the "Client Portal List" page
    When press "2" pagination button in the "Client Portal List" page
    Then verify the current page is "2" in the "Client Portal List" page
    When press "Last Page" pagination button in the "Client Portal List" page
    Then verify the current page is "21" in the "Client Portal List" page
    When press "First Page" pagination button in the "Client Portal List" page
    Then verify the current page is "1" in the "Client Portal List" page

  @readOnly
  Scenario: TC001_03_SuperAdmin_ClientPortalList - Verify client portal filters
    When fill the "Client Portal Name" field with "01_13Jan REG" value in the "Client Portal List" page
    Then verify "01_13Jan REG" client portal is displayed in the "Client Portal List" page
    When select "13/01/2026" in the "Created Date" filter on the "Client Portal List" page
    Then verify every client portal has "Created Date" equal to "13/01/2026"

  @readOnly
  Scenario Outline: TC001_04_SuperAdmin_ClientPortalList - Verify status filter
    When select "<status>" in the "Status" filter on the "Client Portal List" page
    Then verify "<status>" filter results are displayed in the "Client Portal List" page

    Examples:
      | status   |
      | Enabled  |
      | Disabled |
      | All      |

  @readOnly
  Scenario Outline: TC001_05_SuperAdmin_ClientPortalList - Verify column headers and sorting
    Given the "Client Portal List" page is displayed
    Then verify "<column>" column header is displayed in the "Client Portal List" page
    When click on "<column>" column header in the "Client Portal List" page
    Then verify items are sorted in "ascending" order by "<column>" in the "Client Portal List" page
    When click on "<column>" column header in the "Client Portal List" page
    Then verify items are sorted in "descending" order by "<column>" in the "Client Portal List" page
    When click on "<column>" column header in the "Client Portal List" page
    Then verify sorting is removed for "<column>" in the "Client Portal List" page

    Examples:
      | column             |
      | Client Portal Name |
      | Created Date       |
      | Status             |
