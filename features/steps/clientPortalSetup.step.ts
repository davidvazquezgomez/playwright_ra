import { Then, When } from './fixtures';

Then(
    'verify {string} field is displayed in the {string} page',
    async ({ clientPortalSetupPage }, fields: string, pageName: string) => {
        if (pageName !== 'Client Portal Setup') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalSetupPage.verifyFieldsDisplayed(fields);
    }
);

When(
    'fill the {string} field with {string} value in the Client Portal Setup form',
    async ({ clientPortalSetupPage }, fieldName: string, value: string) => {
        await clientPortalSetupPage.fillField(fieldName, value);
    },
);

When('update the Knowledge Modules & Impact Areas selection', async ({ clientPortalSetupPage }) => {
    await clientPortalSetupPage.updateKnowledgeModulesAndImpactAreasSelection();
});

When('update the Jurisdictions selection', async ({ clientPortalSetupPage }) => {
    await clientPortalSetupPage.updateJurisdictionsSelection();
});

When(
    'set Actions availability to {string} in Client Portal Setup',
    async ({ clientPortalSetupPage }, actionsState: string) => {
        await clientPortalSetupPage.setActionsAvailability(actionsState);
    },
);

Then(
    'verify {string} value is displayed in the {string} field on the "Client Portal Setup" page',
    async ({ clientPortalSetupPage }, value: string, fieldName: string) => {
        await clientPortalSetupPage.verifyFieldValue(fieldName, value);
    },
);