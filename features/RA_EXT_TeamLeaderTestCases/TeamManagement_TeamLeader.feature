@TeamManagement @TeamManagement_TeamLeader
Feature: Team Management for Team Leader

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMLEADER"
    And verify if applicable portals are displayed

  
  @readOnly
  Scenario Outline: TC001_01_TeamLeader_TeamManagement - Verify Teams table column header and sorting
    Given the "Team Management - 01_QA_StageTestPortal" page is open
    Then verify "<column>" column header is displayed in the "Team Management" page
    When click on "<column>" column header in the "Team Management" page
    Then verify items are sorted in "ascending" order by "<column>" in the "Team Management" page
    When click on "<column>" column header in the "Team Management" page
    Then verify items are sorted in "descending" order by "<column>" in the "Team Management" page
    When click on "<column>" column header in the "Team Management" page
    Then verify sorting is removed for "<column>" in the "Team Management" page

    Examples:
      | column       |
      | Team Name    |
      | Team Leaders |
      | Created Date |
      | Updated Date |

  

 
  