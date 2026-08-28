@Overview @Overview_TeamMember
Feature: Overview for Team Member

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMMEMBER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario: TC001_TeamMember_Overview - Verify overview page loads with all the fields and buttons visible
    When click on "ClientPortal_20260212124931" of the portals
    Then the "Overview" page is displayed
    And verify for client portal name "ClientPortal_20260212124931"
    And verify if "Applicable widgets" are displayed on the Overview page
    And verify View button is displayed for all the applicable widgets
    And verify for view as grid or card is displayed and save as favorite option is visible
    And is selected and the star is "" filled by default
    When click on view as grid or card and verify view as grid or card
    Then verify for view as grid or card is displayed and save as favorite option is visible
    When restore the initial overview view
    And verify for "open dashboard" button is visible
    And verify if "Deloitte label;Application Name;Ask Deloitte;Notifications bell;Profile" are displayed on the Overview page
    And verify if "Disclaimer;Privacy;Terms of use;OSS Attribution;Cookie;Cookie Settings" are displayed on the Overview page

  @readOnly
  Scenario Outline: TC002_TeamMember_Overview - Verify navigation from overview widgets
    When click on "ClientPortal_20260212124931" of the portals
    Then the "Overview" page is displayed
    And verify "<widgets>" are displayed
    And verify "<widgets>" display the corresponding due dates
    When press "View" button from "<widget>" widget
    When press "<viewAll>" button
    Then the "<dashboard>" page is displayed
    And verify if "<tabs>" are displayed on the Overview page
    When press "back" button
    Then the "Overview" page is displayed

    Examples:
      | widgets                                 | widget              | viewAll          | dashboard                                       | tabs                      |
      | Outstanding Updates;Outstanding Actions | Outstanding Updates | View All Updates | ClientPortal_20260212124931 - Updates Dashboard | Updates;Actions;Analytics |
      | Outstanding Updates;Outstanding Actions | Outstanding Actions | View All Actions | ClientPortal_20260212124931 - Actions Dashboard | Updates;Actions;Analytics |

  @readOnly
  Scenario: TC004_TeamMember_Overview - Verify View as Grid and Card functionality and Save as Favorite option
    When click on "ClientPortal_20260212124931" of the portals
    Then the "Overview" page is displayed
    And verify "Outstanding Updates" are displayed
    And verify for view as grid or card is displayed and save as favorite option is visible
    And is selected and the star is "" filled by default
    When click on view as grid or card and verify view as grid or card
    Then verify for view as grid or card is displayed and save as favorite option is visible
    And verify for view as grid or card is displayed and save as favorite option is visible
    And is selected and the star is "not" filled by default
    When press "favorite icon" button
    And verify for view as grid or card is displayed and save as favorite option is visible
    And is selected and the star is "" filled by default
    When restore the initial overview view
