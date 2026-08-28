@FooterLinks @FooterLinks_TeamMember
Feature: Footer Links for Team Member

  Background:
    Given launch Regulatory Advantage application URL and login as "external" user "TEAMMEMBER"
    And verify if applicable portals are displayed

  @readOnly
  Scenario Outline: TC001_02_TeamMember_FooterLinks - Verify footer page content
    When press "<link>" button
    Then the footer destination page "<title>" is displayed

    Examples:
      | link            | title                                 |
      | Privacy         | RegulatoryAdvantage \| Privacy Notice |
      | Terms of Use    | RegulatoryAdvantage \| Terms of Use   |
      | OSS Attribution | Open-Source Acknowledgment            |
      | Cookie          | RegulatoryAdvantage \| Cookie Notice  |

  @readOnly
  Scenario: TC001_03_TeamMember_FooterLinks - Verify Cookie Settings popup
    When press "Cookie Settings" button
    Then the "Privacy Preference Center" popup is displayed

  @readOnly
  Scenario: TC001_04_TeamMember_FooterLinks - Verify Disclaimer page legal content
    When press "Disclaimer" button
    Then the footer destination page "RegulatoryAdvantage | Disclaimer" is displayed
    And verify the following content is displayed:
      """
      RegulatoryAdvantage is provided solely as a tool for tracking and managing regulatory and employment tax updates. It does not provide legal or tax advice, customized regulatory content for your specific circumstances, or make determinations regarding your compliance obligations. Deloitte does not guarantee the completeness, accuracy, or timeliness of the information presented, nor the validity or impact of any assessments performed by you or your authorized users. Use of RegulatoryAdvantage and its output does not constitute professional advice, an audit, or any form of assurance. Users remain solely responsible for their own legal and tax compliance decisions. Deloitte has no responsibility for external links or third-party content.
      """
