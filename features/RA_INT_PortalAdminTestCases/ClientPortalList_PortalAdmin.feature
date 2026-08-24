@ClientPortalList @ClientPortalList_PortalAdmin
Feature: Client Portal List for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_01_PortalAdmin_ClientPortalList - Verify client portal list navigation
    When click on "Edit" button on one of the portals list
    Then the "Client Portal Setup" page is displayed
    When click on "Home" option from the left navigation
    Then the "Client Portal List" page is displayed

  @readOnly
  Scenario: TC001_02_PortalAdmin_ClientPortalList - Verify pagination
    When select "10" option from the "Items per page" dropdown in the "Client Portal List" page
    Then verify 10 client portals are displayed in the "Client Portal List" page

  @readOnly
  Scenario: TC001_03_PortalAdmin_ClientPortalList - Verify client portal filters
    When fill the "Client Portal Name" field with "Global Inc" value in the "Client Portal List" page
    Then verify "Global Inc" client portal is displayed in the "Client Portal List" page
    When select "28/08/2025" in the "Created Date" filter on the "Client Portal List" page
    Then verify every client portal has "Created Date" equal to "28/08/2025"

  @readOnly
  Scenario Outline: TC001_04_PortalAdmin_ClientPortalList - Verify status filter
    When select "<status>" in the "Status" filter on the "Client Portal List" page
    Then verify "<status>" filter results are displayed in the "Client Portal List" page

    Examples:
      | status  |
      | Enabled |
      | All     |

  @readOnly
  Scenario: TC001_04_01_PortalAdmin_ClientPortalList - Verify disabled status filter has no results
    When select "Disabled" in the "Status" filter on the "Client Portal List" page
    Then verify no client portal results are displayed in the "Client Portal List" page

  @readOnly
  Scenario Outline: TC001_05_PortalAdmin_ClientPortalList - Verify column headers and sorting
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
