---
name: playwright-page-objects
description: "Use when editing Playwright page objects or files under pages. Keeps selectors, browser actions, waits, and UI assertions inside page objects."
applyTo: "pages/**/*.ts"
---

# Page Object Rules

- Put all Playwright interaction for the application in `pages/`.
- A page object owns its selectors, navigation, waits, clicks, form actions, and UI assertions.
- Extend `BasePage` when the object needs shared helpers.
- `CommonPage` is the owner for reusable application-wide behavior used by `common.steps.ts`, such as loading the application and shared navigation.
- `LoginPage` is the owner for authentication behavior, including login and logout.
- Steps must call page-object methods; they must not call `BasePage` directly for UI behavior.
- Reuse existing `BasePage` methods for common waits, clicks, navigation, reloads, screenshots, and form actions before writing equivalent Playwright code in a page object.
- `BasePage.clickElement(selector)` includes `waitForElement(selector)`. Do not call `waitForElement` immediately before `clickElement` with the same selector; add a separate wait only for a distinct state or condition.
- Add a page-specific helper in the owning page object only when `BasePage` does not provide the required behavior.
- Do not create wrappers that only rename a `BasePage` method; create a page method only for missing behavior or a meaningful business action.
- Keep selectors private and close to the methods that use them.
- Declare selectors as private descriptive properties near the top of the page object, following the `LoginPage` pattern (for example, `private emailInput = "input[type='email']"`).
- Name selector properties with descriptive camelCase names such as `uploadFilesButton`, `downloadTemplateLink`, or `continueButton`.
- Reuse selector properties throughout the page object instead of repeating raw selector strings; use a selector factory only when the selector requires a parameter.
- Prefer stable selectors such as role, label, test id, or accessible name over brittle CSS or XPath.
- Inspect the rendered DOM before adding or changing a selector. For Kendo buttons, text can be rendered inside `.k-button-text` with presentation whitespace; do not assume `button:text-is(...)` will resolve it. Prefer an accessible role/name selector when available, or scope the selector to the rendered `.k-button-text` element.
- Do not use `fill()` on a segmented Kendo DatePicker input. Select dates through its calendar UI. Reuse `BasePage.selectTodayFromKendoDatePicker(datePickerSelector)` for current-date selection; add other generic Kendo date-picker actions to `BasePage` only when they are reusable across pages.
- Encapsulate complete business actions in methods that can be called from BDD steps.
- Document every page-object method with a JSDoc block immediately above it. State the business action or assertion it performs, and document every parameter with `@param`.
- Return business-relevant values when a step needs data; do not expose raw locators to steps.
- Reuse existing helpers and page objects before adding new ones.
- Do not add methods that have no current caller unless they are required shared infrastructure.
- Keep assertions about rendered UI in the page object so step files remain free of Playwright APIs.
- After changes, validate with TypeScript and `npm run bdd:generate`. BDD generation validates bindings and compilation, not live selectors; when an interaction selector changes and the test environment is available, run the smallest affected scenario or test as well.
