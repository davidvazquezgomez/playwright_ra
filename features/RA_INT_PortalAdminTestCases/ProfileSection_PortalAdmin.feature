@ProfileSection @ProfileSection_PortalAdmin
Feature: Profile Section for Portal Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "PORTALADMIN"
    And verify if applicable portals are displayed

  @readOnly
  Scenario Outline: TC001_PortalAdmin_ProfileSection - Verify profile section and menu options
    When press "Profile" button
    Then verify "t-taxcmsSA0001, t-taxcmsSA0001" user name and "t-taxcmsSA0001@deloitte.com" email address are displayed
    And verify "<menuOptions>" are displayed on the "Profile" section
    When press "<menuOptionButton>" button
    Then the "<page>" page is displayed
    And logout from the application
    Then verify user logs out from the application

    Examples:
      | menuOptions                                    | menuOptionButton         | page                                 |
      | Notification Preferences;Release Notes;Log out | Notification Preferences | Notification Preferences             |
      | Notification Preferences;Release Notes;Log out | Release Notes            | RegulatoryAdvantage \| Release Notes |
