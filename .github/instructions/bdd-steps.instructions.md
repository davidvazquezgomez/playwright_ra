---
name: bdd-steps-architecture
description: "Use when editing Gherkin step definitions, BDD fixtures, or files under features/steps. Keeps steps as thin orchestration layers and delegates Playwright behavior to page objects."
applyTo: "features/steps/**/*.ts"
---

# BDD Step Definition Rules

- Match step text exactly to the Gherkin phrases used in `features/**/*.feature`.
- A step definition may read parameters, environment values, test data, and fixtures.
- A step definition must call a method on a page object for UI behavior.
- Steps in `common.steps.ts` must call methods on `CommonPage`; they must not call `BasePage` browser helpers directly for shared UI behavior.
- Register `CommonPage` in `features/steps/fixtures.ts` and inject its typed fixture into common steps.
- Before creating or modifying a binding, search `features/**/*.feature` and `features/steps/**/*.ts` for equivalent Gherkin actions or assertions.
- When equivalent behavior is used, or is expected to be used, across multiple features, maintain one canonical phrase and binding in `common.steps.ts`, delegated to `CommonPage`.
- Refactor existing equivalent bindings from page-specific step files into `common.steps.ts`; update affected features and remove the retired bindings rather than retaining duplicate step definitions or page-specific wrappers.
- Keep a step in a page-specific step file only when the business behavior or UI entity is unique to that page.
- When a page-object action uses `BasePage.clickElement`, do not introduce a separate `waitForElement` for that same selector: `clickElement` performs that wait itself.
- Do not place Playwright selectors or actions in this folder.
- Do not import `expect` from `@playwright/test` in step definitions for UI assertions.
- Do not access `page` directly from a step definition.
- Do not call `page.locator`, `page.getBy*`, `page.goto`, `page.waitFor*`, `locator.click`, `locator.fill`, or similar APIs here.
- If a required page method does not exist, add it to the owning file in `pages/` and call it from the step.
- Put reusable application behavior in `pages/CommonPage.ts`; put behavior belonging to one application page in that page's object.
- Keep each step focused on one business-level action or verification.
- When adding a page object, register it in `features/steps/fixtures.ts` and use the typed fixture in the step.
