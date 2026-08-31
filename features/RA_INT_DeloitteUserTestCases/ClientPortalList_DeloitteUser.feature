@ClientPortalList @ClientPortalList_DeloitteUser
Feature: Client Portal List for Deloitte User

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "DELOITTEUSER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_01_DeloitteUser_ClientPortalList - Verify client portal list navigation
    Then verify "Edit" button is not displayed for the portals in the list
    When click on "Home" option from the left navigation
    Then the "Client Portal List" page is displayed

  @readOnly
  Scenario: TC001_02_DeloitteUser_ClientPortalList - Verify pagination
    When select "10" option from the "Items per page" dropdown in the "Client Portal List" page
    Then verify 10 client portals are displayed in the "Client Portal List" page

  @readOnly
  Scenario: TC001_03_DeloitteUser_ClientPortalList - Verify client portal filters
    When fill the "Client Portal Name" field with "QA_Test client3" value in the "Client Portal List" page
    Then verify "QA_Test client3" client portal is displayed in the "Client Portal List" page
    When select "26/09/2025" in the "Created Date" filter on the "Client Portal List" page
    Then verify every client portal has "Created Date" equal to "26/09/2025"

  @readOnly
  Scenario Outline: TC001_04_DeloitteUser_ClientPortalList - Verify status filter
    When select "<status>" in the "Status" filter on the "Client Portal List" page
    Then verify "<status>" filter results are displayed in the "Client Portal List" page

    Examples:
      | status  |
      | Enabled |
      | All     |

  @readOnly
  Scenario: TC001_04_01_DeloitteUser_ClientPortalList - Verify disabled status filter has no results
    When select "Disabled" in the "Status" filter on the "Client Portal List" page
    Then verify no client portal results are displayed in the "Client Portal List" page

  @readOnly
  Scenario Outline: TC001_05_DeloitteUser_ClientPortalList - Verify column headers and sorting
    Then the "Client Portal List" page is displayed
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
