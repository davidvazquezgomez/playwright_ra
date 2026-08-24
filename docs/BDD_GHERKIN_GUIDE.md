# BDD/Gherkin + Playwright + Allure Guide

## Table of Contents
- [BDD/Gherkin + Playwright + Allure Guide](#bddgherkin--playwright--allure-guide)
  - [Table of Contents](#table-of-contents)
  - [Architecture](#architecture)
  - [File Structure](#file-structure)
  - [How to Write Gherkin Tests](#how-to-write-gherkin-tests)
    - [Structure of a `.feature` File](#structure-of-a-feature-file)
    - [Scenario Outline (Parameterized Data)](#scenario-outline-parameterized-data)
    - [Language Notes](#language-notes)
  - [Step Definitions](#step-definitions)
    - [Available Fixtures](#available-fixtures)
  - [Tags and Filtering](#tags-and-filtering)
    - [Allure Tags](#allure-tags)
    - [Filtering by Tags](#filtering-by-tags)
  - [Allure with Gherkin](#allure-with-gherkin)
    - [Generating the Report](#generating-the-report)
  - [Running Tests](#running-tests)
  - [Debugging with the Playwright Inspector](#debugging-with-the-playwright-inspector)
  - [Environment Variables](#environment-variables)
  - [Azure DevOps](#azure-devops)
  - [Adding a New Test](#adding-a-new-test)
    - [1. Create the `.feature` File](#1-create-the-feature-file)
    - [2. Implement Missing Steps](#2-implement-missing-steps)
    - [3. Run](#3-run)

---

## Architecture

**playwright-bdd** converts `.feature` files (Gherkin) into native Playwright tests. This enables you to:

- Use the **native Playwright runner** (parallel execution, retries, trace, video)
- Reuse the **existing Page Objects** without changes
- View tests in **Allure with Gherkin formatting** (Feature > Scenario > Given/When/Then)
- Run tests in **Playwright UI mode** for visual debugging

```
┌──────────────────────┐
│   .feature files     │  ← Gherkin (Given/When/Then)
│                      │
│   bddgen (generates) │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│  Generated .spec.js  │  ← Native Playwright tests
│  (.features-gen/)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│            Step Definitions (TypeScript)              │
│        Use project Page Objects                        │
│     BasePage / LoginPage / ClientPortalListPage / ... │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│           Playwright Test Runner                      │
│     → allure-playwright reporter                      │
│     → Allure Report with native Gherkin                │
└──────────────────────────────────────────────────────┘
```

---

## File Structure

```
features/
├── login.feature                  ← Authentication feature
├── navegacion.feature             ← Navigation feature
└── steps/
    ├── fixtures.ts                ← Custom test + Given/When/Then
    ├── common.steps.ts            ← Common steps (login, navigation)
    └── login.steps.ts             ← Login steps

  .features-gen/                     ← Generated tests (DO NOT commit)
  playwright.bdd.config.ts           ← Playwright configuration for BDD
```

---

## How to Write Gherkin Tests

### Structure of a `.feature` File

```gherkin
@epic:MyEpic @feature:MyFeature
Feature: Feature description
  As a [role]
  I want [action]
  So that [benefit]

  Background:
    Given the application is available

  @smoke @severity:critical @story:MyStory
  Scenario: Descriptive scenario name
    Given the user "ROLE" has logged in
    When the user performs an action
    Then the expected result is obtained
```

### Scenario Outline (Parameterized Data)

```gherkin
  Scenario Outline: Login with multiple roles
    When the user "<role>" logs in with their credentials
    Then the user accesses the system successfully

    Examples:
      | role           |
      | USER           |
      | ADMIN          |
```

### Language Notes

The **keywords** (Feature, Scenario, Given, When, Then) must be in **English**.
**Descriptions and steps** may be written in Spanish:

```gherkin
Feature: User authentication
  Scenario: Successful login
    Given the application is available
    When the user "ADMIN" has logged in
    Then the user accesses the dashboard successfully
```

---

## Step Definitions

Each Gherkin step maps to a TypeScript function with access to Page Objects:

```typescript
import { Given, When, Then } from './fixtures';

Given('the user {string} has logged in',
  async ({ basePage, loginPage }, role: string) => {
    const user = process.env[`USER_${role}`]!;
    const password = process.env[`USER_${role}_PASSWORD`]!;
    await basePage.loadPage('/');
    await loginPage.login(user, password);
  }
);
```

> **Note:** The credential system is dynamic. The `{string}` step accepts
> any role and looks for the corresponding `USER_<ROLE>` and
> `USER_<ROLE>_PASSWORD` environment variables.

### Available Fixtures

| Fixture     | Type                  | Description               |
| ----------- | --------------------- | ------------------------- |
| `page`      | `Page`                | Playwright page           |
| `context`   | `BrowserContext`      | Browser context           |
| `basePage`  | `BasePage`            | Base Page Object          |
| `loginPage` | `LoginPage`           | Login Page Object         |
| `clientPortalListPage` | `ClientPortalListPage` | Client Portal List Page Object |
| `testData`  | `Record<string, any>` | Data shared between steps |

---

## Tags and Filtering

### Allure Tags

| Tag                    | Allure Label |
| ---------------------- | ------------ |
| `@epic:EpicName`       | Epic         |
| `@feature:FeatureName` | Feature      |
| `@story:StoryName`     | Story        |
| `@severity:critical`   | Severity     |

### Filtering by Tags

```bash
npm run test:bdd:smoke              # @smoke only
npm run test:bdd:regression         # @regression only
npx bddgen --config playwright.bdd.config.ts && \
  npx playwright test --config playwright.bdd.config.ts --grep @login
```

---

## Allure with Gherkin

Tests are displayed in Allure with a Gherkin hierarchy:

```
Behaviors
├── Epic: Authentication
│   └── Feature: Login
│       ├── Story: Login_Exitoso
│       │   └── ✅ TC-LOGIN-001 - Successful login
│       │       ├── Given the application is available
│       │       ├── When the user "USER" logs in
│       │       └── Then the user accesses the system
│       └── Story: Login_Multi_Rol
│           ├── ✅ TC-LOGIN-003 (USER)
│           └── ✅ TC-LOGIN-003 (ADMIN)
```

### Generating the Report

```bash
npm run test:bdd           # Run tests
npm run allure:generate    # Generate HTML
npm run allure:open        # Open report
```

---

## Running Tests

| Command                       | Description                     |
| ----------------------------- | ------------------------------- |
| `npm run bdd:generate`        | Generate .spec.js from .feature |
| `npm run test:bdd`            | Generate + run features         |
| `npm run test:bdd:smoke`      | @smoke only                     |
| `npm run test:bdd:regression` | @regression only                |
| `npm run test:bdd:ui`         | Open Playwright UI Mode         |
| `npm run test:bdd:ui:watch`   | Open UI Mode and regenerate BDD tests when `.feature` files change |
| `npm run test:bdd:debug`      | Open Playwright Inspector in debug mode |
| `npm run test:all`            | Classic Playwright + BDD        |
| `npm run allure:generate`     | Generate Allure report          |
| `npm run allure:open`         | Open Allure report              |

---

## Debugging with the Playwright Inspector

Run a BDD scenario with the browser and Playwright Inspector visible:

```bash
npm run test:bdd:debug
```

The Inspector pauses before the first test action. Use **Pick Locator** to select an element in the browser and obtain a locator, XPath, or its HTML while the page is in the current execution state. Continue the scenario or execute it one action at a time from the Inspector.

To pause at a precise line, add `await this.page.pause()` temporarily in the page-object method that owns that browser action. Run the debug command, inspect the page, and remove the pause before committing. Do not add `page.pause()` to a step definition; step definitions must stay as thin orchestration layers.

For graphical test selection and repeated runs without automatic pauses, use:

```bash
npm run test:bdd:ui
```

---

## Environment Variables

```env
# Credentials by role (configure as Azure DevOps secret variables)
USER_SUPERADMIN=admin@example.com
USER_SUPERADMIN_PASSWORD=password
USER_PORTALADMIN=portaladmin@example.com
USER_PORTALADMIN_PASSWORD=password
USER_DELOITTEUSER=deloitteuser@example.com
USER_DELOITTEUSER_PASSWORD=password
USER_CLIENTUSER=clientuser@example.com
USER_CLIENTUSER_PASSWORD=password
USER_TEAMLEADER=teamleader@example.com
USER_TEAMLEADER_PASSWORD=password
USER_TEAMMEMBER=teammember@example.com
USER_TEAMMEMBER_PASSWORD=password
USER_CLIENTADMIN=clientadmin@example.com
USER_CLIENTADMIN_PASSWORD=password
USER_GAPORTAL=gaportal@example.com
USER_GAPORTAL_PASSWORD=password

# Configuration
ENV=STAGE
STAGE_URL=https://stage.example.com
DEV_URL=https://dev.example.com
HEADLESS=true
TIMEOUT=30000
TEST_TIMEOUT=60000
```

---

## Azure DevOps

Pipeline: `azure-pipelines/azure-pipelines-cucumber.yml`

1. Installs dependencies + Playwright
2. Generates tests from `.feature` files
3. Runs tests with the Playwright runner
4. Generates an Allure report with Gherkin
5. Publishes artifacts

---

## Adding a New Test

### 1. Create the `.feature` File

```gherkin
@my_feature @epic:MyEpic @feature:MyFeature
Feature: My new functionality

  Background:
    Given the application is available

  @smoke @severity:normal @story:MyStory
  Scenario: My new scenario
    Given the user "USER" has logged in
    When the user performs my new action
    Then my expected result is obtained
```

### 2. Implement Missing Steps

```typescript
// features/steps/mi_feature.steps.ts
import { expect } from '@playwright/test';
import { When, Then } from './fixtures';

When('the user performs my new action', async ({ basePage }) => {
  await basePage.loadPage('/my-section');
});

Then('my expected result is obtained', async ({ page }) => {
  const result = await page.textContent('.result');
  expect(result).toBeTruthy();
});
```

### 3. Run

```bash
npm run test:bdd
```

Existing steps (login, navigation) are reused automatically.
