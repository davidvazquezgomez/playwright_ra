import { Then, When } from './fixtures';

Then(
    'verify {string} button is not displayed for the portals in the list',
    async ({ clientPortalListPage }, buttonName: string) => {
        if (buttonName !== 'Edit') {
            throw new Error(`Button "${buttonName}" is not supported.`);
        }

        await clientPortalListPage.verifyEditButtonIsNotDisplayed();
    }
);

When(
    'select {string} option from the {string} dropdown in the {string} page',
    async ({ clientPortalListPage }, itemsPerPage: string, dropdown: string, pageName: string) => {
        if (dropdown !== 'Items per page' || pageName !== 'Client Portal List') {
            throw new Error(`Dropdown "${dropdown}" is not supported on page "${pageName}".`);
        }

        await clientPortalListPage.selectClientPortalsPerPage(itemsPerPage);
    }
);

When(
    'press "Edit Client" button for the {string} client portal',
    async ({ clientPortalListPage }, portalName: string) => {
        await clientPortalListPage.editClientPortal(portalName);
    },
);

Then(
    'verify {int} client portals are displayed in the {string} page',
    async ({ clientPortalListPage }, expectedCount: number, pageName: string) => {
        if (pageName !== 'Client Portal List') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalListPage.verifyClientPortalsDisplayed(expectedCount);
    }
);

When(
    'press {string} pagination button in the {string} page',
    async ({ clientPortalListPage }, button: string, pageName: string) => {
        if (pageName !== 'Client Portal List') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalListPage.clickPaginationButton(button);
    }
);

Then(
    'verify the current page is {string} in the {string} page',
    async ({ clientPortalListPage }, expectedPage: string, pageName: string) => {
        if (pageName !== 'Client Portal List') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalListPage.verifyCurrentPage(expectedPage);
    }
);

Then(
    'verify {string} client portal is displayed in the {string} page',
    async ({ clientPortalListPage }, portalName: string, pageName: string) => {
        if (pageName !== 'Client Portal List') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalListPage.verifyClientPortalDisplayed(portalName);
    }
);

When(
    'select {string} in the {string} filter on the {string} page',
    async ({ clientPortalListPage }, filterValue: string, filterName: string, pageName: string) => {
        if (pageName !== 'Client Portal List') {
            throw new Error(`Filter "${filterName}" is not supported on page "${pageName}".`);
        }

        if (filterName === 'Created Date') {
            await clientPortalListPage.filterByCreatedDate(filterValue);
            return;
        }

        if (filterName === 'Status') {
            await clientPortalListPage.filterByStatus(filterValue);
            return;
        }

        throw new Error(`Filter "${filterName}" is not supported on page "${pageName}".`);
    }
);

Then(
    'verify every client portal has {string} equal to {string}',
    async ({ clientPortalListPage }, columnName: string, dateValue: string) => {
        if (columnName !== 'Created Date') {
            throw new Error(`Column "${columnName}" is not supported.`);
        }

        await clientPortalListPage.verifyEveryClientPortalCreatedDate(dateValue);
    }
);

Then(
    'verify {string} filter results are displayed in the {string} page',
    async ({ clientPortalListPage }, status: string, pageName: string) => {
        if (pageName !== 'Client Portal List') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalListPage.verifyStatusFilterResults(status);
    }
);

Then(
    'verify no client portal results are displayed in the {string} page',
    async ({ clientPortalListPage }, pageName: string) => {
        if (pageName !== 'Client Portal List') {
            throw new Error(`Page "${pageName}" is not supported.`);
        }

        await clientPortalListPage.verifyNoClientPortalResultsDisplayed();
    }
);

