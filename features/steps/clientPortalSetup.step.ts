import { Then } from './fixtures';

Then(
    'verify {string} field is displayed in the {string} page',
    async ({ clientPortalSetupPage }, fields: string, pageName: string) => {
        if (pageName !== 'Client Portal Setup') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalSetupPage.verifyFieldsDisplayed(fields);
    }
);