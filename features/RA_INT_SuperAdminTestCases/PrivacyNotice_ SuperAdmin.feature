@PrivacyNotice @PrivacyNotice_SuperAdmin
Feature: Privacy Notice for Super Admin

  Background:
    Given launch Regulatory Advantage application URL and login as "deloitte" user "SUPERADMIN"
    And verify if applicable portals are displayed

  @mutable
  Scenario: TC001_01_SuperAdmin_PrivacyNotice - Navigate to Update Privacy Notice page
    When click on "Menu" option from the left navigation
    Then verify it displays "Update Privacy Notice" option from the left navigation
    When click on "Update Privacy Notice" option from the left navigation
    Then the "Update Privacy Notice" page is displayed
    And verify "Cancel;Save" buttons are displayed in the "Update Privacy Notice" page

  @mutable
  Scenario: TC001_02_SuperAdmin_PrivacyNotice - Apply changes and press "Cancel" button
    Given the "Update Privacy Notice" page is open
    When add the "QaTest" word to the end of the "Update Privacy Notice" content
    Then press "Cancel" button
    And the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    And the "Update Privacy Notice" page is displayed
    Then verify the "Update Privacy Notice" content contains the "QaTest" word added to the end
    When press "Cancel" button
    Then the "Unsaved Changes" popup is displayed
    When press "Continue" button on the "Unsaved Changes" popup
    And the "Update Privacy Notice" page is displayed
    Then verify the "Update Privacy Notice" content does not contain the "QaTest" word added to the end

  @mutable
  Scenario: TC001_03_SuperAdmin_PrivacyNotice - Apply changes and press "Save" button
    Given the "Update Privacy Notice" page is open
    When add the "QaTest" word to the end of the "Update Privacy Notice" content
    Then verify the "Update Privacy Notice" content is modified with the "QaTest" word added to the end
    When press "Save" button
    Then verify "Privacy Notice updated successfully." toast message is displayed in the "Update Privacy Notice" page
    Then verify the "Update Privacy Notice" content contains the "QaTest" word added to the end

  @mutable
  Scenario: TC001_04_SuperAdmin_PrivacyNotice - Apply changes and press "Save" button
    Given the "Update Privacy Notice" page is open
    And the footer page "Disclaimer;Privacy;Terms of use;OSS Attribution;Cookie;Cookie Settings" is displayed
    Then save the first paragraph of the "Update Privacy Notice" content
    And save the last paragraph of the "Update Privacy Notice" content
    When press "Privacy" button
    Then the "RegulatoryAdvantage | Privacy Notice" page is displayed
    And verify the first paragraph of the "Privacy Notice" content matches the saved first paragraph of the "Update Privacy Notice" content
    And verify the last paragraph of the "Privacy Notice" content matches the saved last paragraph of the "Update Privacy Notice" content
    #Eliminación
    When click on "Menu" option from the left navigation
    Then verify it displays "Update Privacy Notice" option from the left navigation
    When click on "Update Privacy Notice" option from the left navigation
    Then the "Update Privacy Notice" page is displayed
    And remove the "QaTest" word from the end of the "Update Privacy Notice" content
    When press "Save" button
    And verify the "Update Privacy Notice" content does not contain the "QaTest" word added to the end

  @readOnly
  Scenario Outline: TC001_05_SuperAdmin_PrivacyNotice - Verify links located in the "RegulatoryAdvantage | Privacy Notice" page
    Given the "RegulatoryAdvantage | Privacy Notice" page is open
    Then the "<link>" word is displayed in the "RegulatoryAdvantage | Privacy Notice" page
    When click on "<link>" word
    Then the "<url>" destination is displayed

    Examples:
      | link                           | url                                                                                                                              |
      | Deloitte Network               | https://www.deloitte.com/global/en/about/governance/network-brand-alliances/about-the-network.html?icid=bottom_about-the-network |
      | DTTLPrivacy@deloitte.com.      | mailto:DTTLPrivacy@deloitte.com                                                                                                  |
      | Privacy Notice                 | https://www.deloitte.com/global/en/legal/privacy.html?icid=bn_privacy                                                            |
      | DTTLPrivacyEU@deloitte.com.    | mailto:DTTLPrivacyEU@deloitte.com                                                                                                |
      | DeloitteGlobalDPO@deloitte.com | mailto:DeloitteGlobalDPO@deloitte.com                                                                                            |
