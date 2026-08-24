@ProfileSection @ProfileSection_TeamLeader
Feature: Profile Section for Team Leader

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMLEADER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario Outline: TC001_TeamLeader_ProfileSection - Verify profile section and menu options
    When press "Profile" button
    Then verify "Team Leader (External)" user name and "teamleaderra@outlook.com" email address are displayed
    And verify "<menuOptions>" are displayed on the "Profile" section
    When press "<menuOptionButton>" button
    Then the "<page>" page is displayed
    And logout from the application
    Then verify user logs out from the application

    Examples:
      | menuOptions                                    | menuOptionButton         | page                                 |
      | Notification Preferences;Release Notes;Log out | Notification Preferences | Notification Preferences             |
      | Notification Preferences;Release Notes;Log out | Release Notes            | RegulatoryAdvantage \| Release Notes |
