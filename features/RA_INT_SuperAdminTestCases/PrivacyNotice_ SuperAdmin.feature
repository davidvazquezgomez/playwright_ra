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
    #Cancelar  y rectificar que se quiere mantener el contenido
    Then press "Cancel" button
    And the "Unsaved Changes" popup is displayed
    And verify "Continue;Cancel" buttons are displayed on the "Unsaved Changes" popup
    When press "Cancel" button on the "Unsaved Changes" popup
    And the "Update Privacy Notice" page is displayed
    Then verify the "Update Privacy Notice" content contains the "QaTest" word added to the end
    #Cancelar definitivamente
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
#Voy a probar que el contenido es el mismo de las dos páginas validando la última parte de la página
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
    Then the "<url>" page is displayed

    Examples:
      | link                           | url                                                                                                                              |
      | Deloitte Network               | https://www.deloitte.com/global/en/about/governance/network-brand-alliances/about-the-network.html?icid=bottom_about-the-network |
      | DTTLPrivacy@deloitte.com.      | mailto:DTTLPrivacyEU@deloitte.com                                                                                                |
      | Privacy Notice                 | https://www.deloitte.com/global/en/legal/privacy.html?icid=bn_privacy                                                            |
      | DTTLPrivacyEU@deloitte.com.    | mailto:DTTLPrivacyEU@deloitte.com                                                                                                |
      | DeloitteGlobalDPO@deloitte.com | mailto:DeloitteGlobalDPO@deloitte.com                                                                                            |

  @mutable
  Scenario: TC001_SuperAdmin_PrivacyNotice - Verify privacy notice
    # verifico comportamiento esperado y scroll
    When click on "Menu" option from the left navigation
    Then verify it displays "Update Privacy Notice" option from the left navigation
    When click on "Update Privacy Notice" option from the left navigation
    Then verify it displays "Update Privacy Notice" page
    When press "Cancel" button
    Then the user should remain on the "Update Privacy Notice" page
    Given the "Update Privacy Notice" page is open
    When the user modifies any content on the "Update Privacy Notice" page
    And press "Cancel" button
    Then an unsaved changes warning message should be displayed
    When press "Cancel" button
    Then the user should remain on the "Update Privacy Notice" page with the changes made
    When press "Cancel" button
    Then an unsaved changes warning message should be displayed
    When press "Continue" button
    #revisar con datos mas especificos. almacenar info al principio y al final verfificarla - Revisar con raquel tb
    Then redirected to the "Update Privacy Notice" page without saving the changes made
    When the user modifies any content on the "Update Privacy Notice" page
    And press "Save" button
    Then verify success message after saving
    When user scrolls to the bottom of the application
    Then the user should be able to scroll to the bottom
    When press "Privacy Notice" link
    Then verify it displays "Privacy Notice" page
    And compare the content from the "Update Privacy Notice" page with the published content
    And verify the headings are in bold and aligned left
    Then verify the content matches in both documents

  @mutable
  Scenario Outline: TC002_SuperAdmin_PrivacyNotice - Verify hyperlink opens correctly
    # verifico contenido y comportamiento de cada email y link
    Given the "Update Privacy Notice" page is open
    When click on "Menu" option from the left navigation
    Then verify it displays "Update Privacy Notice" option from the left navigation
    When click on "Update Privacy Notice" option from the left navigation
    Then verify it displays "Update Privacy Notice" page
    And verify the "<type>" "<linksEmails>" is blue highlighted and hyperlinked
    When click on the "<type>" "<linksEmails>"
    Then verify the "<expectedResult>" is launched
    And close the "<expectedResult>"
    And logout from the application

    Examples:
      | type  | linksEmails                    | expectedResult        |
      | email | DTTLPrivacy@deloitte.com       | email draft           |
      | email | DeloitteGlobalDPO@deloitte.com | email draft           |
      | email | PrivacyEU@deloitte.com         | email draft           |
      | link  | Deloitte Network               | Deloitte Network page |
      | link  | Privacy Notice                 | Privacy Notice page   |
