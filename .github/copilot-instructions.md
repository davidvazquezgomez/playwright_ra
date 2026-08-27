# Repository Instructions

## Project Context

This repository is a TypeScript end-to-end test framework using Playwright, playwright-bdd, and Gherkin features.

The main flow is:

```text
features/*.feature -> features/steps/*.ts -> pages/*.ts -> Playwright
```

Before changing code, inspect the related `.feature`, step definition, fixture, and page object. Use the existing page object and fixture patterns before introducing new abstractions.

Shared-step ownership is explicit:

- Steps in `features/steps/common.steps.ts` must delegate to `pages/CommonPage.ts`.
- `CommonPage` owns reusable application behavior such as loading the application and shared navigation.
- `LoginPage` owns authentication behavior, including login and logout.
- Page-specific steps must delegate to the page object that owns the application page, such as `ClientPortalListPage` or `UploadUpdatesPage`.
- Before adding or changing a step, search `features/**/*.feature` and `features/steps/**/*.ts` for equivalent business actions.
- When a Gherkin action or assertion is used, or will be used, by multiple features, define its single canonical binding in `features/steps/common.steps.ts` and delegate it to `CommonPage`.
- When an equivalent binding already exists in a page-specific step file, refactor it into `common.steps.ts`, move reusable behavior to `CommonPage`, update every affected feature to the canonical phrase, and remove the retired duplicate binding and page-specific wrappers.
- Keep steps page-specific only when their business behavior or UI entity is genuinely unique to one application page.

## BDD and Page Object Architecture

- Gherkin phrases are declared in `.feature` files.
- Step definitions in `features/steps/` implement those phrases.
- Step definitions must orchestrate the scenario and call page-object methods.
- Playwright actions and assertions belong in `pages/`, not in step definition files.
- Do not use `page`, locators, `expect`, `getByRole`, `getByText`, `locator`, `waitFor`, `click`, `fill`, `goto`, or other Playwright APIs directly in `features/steps/`.
- Keep selectors, navigation logic, waits, retries, and UI assertions inside the owning page object.
- Reuse `BasePage` helpers when they already provide the required behavior.
- Before creating or changing any page-object action, assertion, wait, navigation, form, upload, or date-picker method, inspect `pages/BasePage.ts` for an existing helper. Reuse the matching helper when one exists; do not duplicate it in a page object.
- Only add a new helper to `BasePage` when the behavior is generic and reusable across pages. Otherwise, add the smallest page-specific business method and use `BasePage` only for its underlying browser operation.
- Before the first page-object edit, state which relevant `BasePage` helper was inspected and whether it will be reused or why it does not apply.
- Prefer existing `BasePage` methods for shared Playwright operations; add new methods to a page object only for behavior specific to that page.
- Before adding Playwright behavior to a page object, determine whether it is generic and reusable across application pages. When it is, add a focused, selector- or value-parameterized helper to `BasePage` and call it from the owning page object; keep page objects responsible for page-specific selectors and business actions.
- `BasePage.clickElement(selector)` already calls `waitForElement(selector)` before clicking. Do not add a preceding `waitForElement` for the same selector; use an explicit wait only when a different state or condition is required.
- `BasePage.requireAdministratorRole(action)` restricts a business action to roles whose name contains `ADMIN`, such as `SUPERADMIN`, `PORTALADMIN`, and `CLIENTADMIN`. Call it as the first statement of a page-object method that only administrators may perform; it throws a technical error for non-administrator roles and when no role was recorded.
- `BasePage.recordAuthenticatedRole(role)` stores the authenticated role for the current browser page and is called by the login step in `common.steps.ts`. `BasePage.getAuthenticatedRole()` returns it and is useful as failure evidence. Do not infer the role from credentials or environment variables inside a page object.
- `BasePage.retryWithReload(condition, attempts)` reloads the page between attempts until the condition succeeds. Use it when an element is known to appear only after a refresh, instead of fixed waits or ad hoc reload loops. Perform the full re-setup inside the condition, including navigation and grid filters, because the reload discards that state. It retries errors and re-throws them on the last attempt, so report an application defect only after it returns `false`.
- All page objects must extend `BasePage` and use its existing helpers for clicks, waits, navigation, reloads, screenshots, form actions, and uploads whenever possible.
- Create a method in a page object only when `BasePage` does not provide the required behavior or when the method represents a meaningful business action owned by that page.
- Do not add generic browser-operation wrappers to page-specific objects when the equivalent `BasePage` method already exists.
- Add a new page object only when the behavior belongs to a distinct application page. Do not create duplicate page objects for one page.
- Expose page objects through `features/steps/fixtures.ts` when steps need them.
- Keep step definitions short and readable; they should describe the business action, not the UI implementation.

## Failure Classification and Application Defects

- Keep technical automation failures distinct from confirmed application defects. Selectors, strict-mode violations, navigation failures, configuration problems, authentication failures, and Playwright timeouts are technical failures unless the test has independently verified the expected UI state.
- Classify a failure as an application defect only when the automation successfully performs the action, reads the relevant UI state, and has evidence that the observed result contradicts a defined business rule. Do not infer an application defect from a timeout or an unavailable element alone.
- Page objects must report confirmed application defects through `BasePage.failWithApplicationError(businessRule, expectedResult, actualResult, evidence?)`. Do not construct ad hoc application-defect error messages in page objects or step definitions.
- Supply concise, user-visible evidence to `failWithApplicationError`: the business rule, the expected result, the actual result, and any corroborating UI state such as an ARIA attribute, toast, displayed value, or row data.
- `failWithApplicationError` emits the stable `APPLICATION DEFECT DETECTED` prefix and a structured English message. Preserve that prefix because `config/allure-categories.json` categorizes it as `Confirmed application defect` in Allure.
- Do not catch all exceptions and rethrow them as application defects. Preserve native errors for unexpected technical failures so Allure can classify locator, timeout, configuration, and BDD-contract issues accurately.
- When adding a new application-level assertion, design it to first validate that the UI interaction and relevant state are available, then use `failWithApplicationError` only for the verified business-rule mismatch.

## Change Workflow

1. Find the feature phrase or failing behavior that controls the requested change.
2. Search features and step definitions for an equivalent reusable phrase before creating a binding.
3. Read the nearest step definition, fixture, and page object.
4. Put Playwright implementation in the appropriate page object.
5. Put shared implementation in `CommonPage`; keep `common.steps.ts` as calls to `CommonPage` methods.
6. Consolidate existing equivalent bindings into one canonical shared step when used by multiple features.
7. Keep each step as a call to the owning page-object method.
8. Run TypeScript validation and `npm run bdd:generate` after changes.
9. Do not remove existing user changes or refactor unrelated code.

## Naming

- Use PascalCase for page object classes and filenames, such as `LoginPage` and `ClientPortalListPage`.
- Use descriptive method names that express the business action, such as `login` or `verifyApplicablePortals`.
- Keep selectors private to the page object that owns them.
- Define selectors as private, descriptive camelCase properties near the top of each page object, following the existing `LoginPage` pattern.
- Reuse selector properties in page methods and use selector factories only for parameterized selectors; do not scatter raw selector strings through methods.
