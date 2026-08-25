import { Given, Then, When } from './fixtures';
import { registerScenarioCleanup } from './scenarioCleanup.hooks';

Given(
  'the {string} impact area is restored in the {string} page',
  async ({ manageImpactAreasPage }, impactAreaName: string, pageName: string) => {
    if (pageName !== 'Manage Impact Areas' || impactAreaName !== 'Impact Area Test') {
      throw new Error(`Impact area "${impactAreaName}" on page "${pageName}" is not supported.`);
    }

    await manageImpactAreasPage.restoreImpactAreaNameIfNeeded(
      impactAreaName,
      'Impact Area Test Updated'
    );
  }
);

Given(
  'register cleanup to restore the {string} impact area in the {string} page',
  async ({ commonPage, manageImpactAreasPage, testData }, impactAreaName: string, pageName: string) => {
    if (pageName !== 'Manage Impact Areas' || impactAreaName !== 'Impact Area Test') {
      throw new Error(`Impact area "${impactAreaName}" on page "${pageName}" is not supported.`);
    }

    registerScenarioCleanup(testData, async () => {
      await commonPage.openNamedPage(pageName);
      await manageImpactAreasPage.restoreImpactAreaNameIfNeeded(
        impactAreaName,
        'Impact Area Test Updated',
      );
    });
  },
);

When(
  'set the {string} field to {string} on the {string} page',
  async ({ manageImpactAreasPage }, fieldName: string, value: string, pageName: string) => {
    if (pageName !== 'Edit Impact Area' || fieldName !== 'Impact Area Name') {
      throw new Error(`Field "${fieldName}" on page "${pageName}" is not supported.`);
    }

    await manageImpactAreasPage.setImpactAreaName(value);
  }
);

Then(
  'verify {string} value is displayed in the "Impact Area Name" field on the {string} page',
  async ({ manageImpactAreasPage }, value: string, pageName: string) => {
    if (pageName !== 'Edit Impact Area') {
      throw new Error(`Page "${pageName}" is not supported.`);
    }

    await manageImpactAreasPage.verifyImpactAreaNameValue(value);
  }
);

Then(
  'verify {string} impact area is displayed in the {string} page',
  async ({ manageImpactAreasPage }, impactAreaName: string, pageName: string) => {
    if (pageName !== 'Manage Impact Areas') {
      throw new Error(`Page "${pageName}" is not supported.`);
    }

    await manageImpactAreasPage.verifyImpactAreaDisplayed(impactAreaName);
  }
);

When(
  'click on the {string} impact area in the {string} page',
  async ({ manageImpactAreasPage }, impactAreaName: string, pageName: string) => {
    if (pageName !== 'Manage Impact Areas') {
      throw new Error(`Page "${pageName}" is not supported.`);
    }

    await manageImpactAreasPage.editImpactArea(impactAreaName);
  }
);

Then(
  'verify existing impact areas are displayed in the {string} page',
  async ({ manageImpactAreasPage }, pageName: string) => {
    if (pageName !== 'Manage Impact Areas') {
      throw new Error(`Page "${pageName}" is not supported.`);
    }

    await manageImpactAreasPage.verifyExistingImpactAreasDisplayed();
  }
);

Then('verify every impact area contains {string}', async ({ manageImpactAreasPage }, impactAreaName: string) => {
  await manageImpactAreasPage.verifyEveryImpactAreaContains(impactAreaName);
});

Then('verify {string} message is displayed in the {string} page', async ({ manageImpactAreasPage }, message: string, pageName: string) => {
  if (pageName !== 'Manage Impact Areas') {
    throw new Error(`Page "${pageName}" is not supported.`);
  }

  await manageImpactAreasPage.verifyNoImpactAreasMessage(message);
});