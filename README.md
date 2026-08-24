# Regulatory Advantage E2E Tests

E2E testing framework based on **Playwright** with a **BDD/Gherkin** approach, **Allure** reports, and an **Azure DevOps** pipeline.


## Prerequisites

| Tool       | Version            | Notes                                              |
| ---------- | ------------------ | -------------------------------------------------- |
| Node.js    | ≥ 20.x             | Recommended: 22.x                                  |
| Java (JDK) | ≥ 11               | Required for Allure CLI (e.g., Amazon Corretto 21) |
| npm        | included with Node |                                                    |

## Installation

```bash
npm ci
npx playwright install --with-deps chromium
```

Create or update the local `.env` file. It is ignored by Git and must never be committed with credentials.

## Running Tests

All BDD test commands generate tests first, then invoke the `desktop` Playwright project (Desktop Chrome, 1280x720), unless noted otherwise.

### Available Scripts

| Command                                     | Description                                        |
| ------------------------------------------- | -------------------------------------------------- |
| `npm run test:bdd`                          | Runs BDD tests (default)                           |
| `npm run test:bdd:tags -- "@UploadUpdates"` | Runs only tests with the `@UploadUpdates`          |
| `npm run test:bdd:smoke`                    | Runs only tests with the `@smoke`                  |
| `npm run test:bdd:ui`                       | Opens BDD tests in Playwright UI Mode              |
| `npm run test:bdd:debug`                    | Runs BDD tests with the Playwright Inspector       |
| `npm run test:bdd:regression`               | Runs tests tagged with `@regression`               |
| `npm run test:bdd:readonly`                 | Runs `@readOnly` tests with up to four workers     |
| `npm run test:bdd:mutable`                  | Runs `@mutable` tests serially                     |
| `npm run test:bdd:diagnostic`               | Runs the diagnostic flow, defaulting to `@mutable` |
| `npm run tsc`                               | Type-checks TypeScript without emitting files      |
| `npm run bdd:classify`                      | Reports scenario classification                    |
| `npm run bdd:classify:write`                | Writes scenario classification changes             |
| `npm run bdd:validate-contracts`            | Validates feature and step contracts               |
| `npm run diagnostics:prepare`               | Prepares sanitized Playwright diagnostics          |
| `npm run allure:enhance`                    | Enhances Allure results with unexecuted BDD steps  |
| `npm run allure:report`                     | Generates and opens the Allure report              |
| `npm run allure:generate`                   | Generates the report only (does not open it)       |
| `npm run allure:open`                       | Opens an already generated report only             |
| `npm run bdd:generate`                      | Generates `.spec.js` files from `.feature` files   |

### Quick Example

```bash
# Run on desktop and view the report
npm run test:bdd
npm run allure:report

npm run test:bdd:tags -- @Notifications
npm run test:bdd:readonly
```

On Windows PowerShell, set a variable for one command with `$env:NAME='value'`:

```powershell
$env:ENV='DEV'; npm.cmd run test:bdd:smoke
```

### UI Mode and Debugging

Use Playwright UI Mode to select, run, and inspect BDD scenarios from a graphical interface:

```bash
npm run test:bdd:ui
```

Use the Playwright Inspector to pause execution, step through the scenario, and inspect the active page. In the Inspector, use **Pick Locator** to capture a locator, XPath, or the element's HTML from the browser state at the pause point:

```bash
npm run test:bdd:debug
```

The debug command pauses before executing the first test action. Add `await this.page.pause()` temporarily inside a page-object method to pause on a specific automation line, then remove it before committing.

## BDD Architecture

```
.feature (Gherkin)  →  bddgen  →  .spec.js (Playwright)  →  Allure Report
```

### Writing a BDD Test

**1. Create a `.feature` file** in `features/`:

```gherkin
@mi_feature
Feature: My functionality
  Background:
    Given the application is available

  @smoke @story:MyStory
  Scenario: My scenario
    Given the user "USER" has logged in
    When the user navigates to "/my-section"
    Then the page loads successfully
```

**2. Implement missing steps** in `features/steps/`:

```typescript
import { When, Then } from './fixtures';

When('the user does something new', async ({ basePage }) => {
  await basePage.loadPage('/new-route');
});
```

Existing steps (login, navigation) are reused automatically.

**3. Run:**

```bash
npm run test:bdd
```

### Allure Tags

The `@label:value` tags in `.feature` files are automatically converted into Allure labels (allure-playwright v3 detects them natively):

| Tag in `.feature`      | Displayed in Allure as |
| ---------------------- | ---------------------- |
| `@epic:EpicName`       | Epic                   |
| `@feature:FeatureName` | Feature                |
| `@story:StoryName`     | Story                  |
| `@severity:critical`   | Severity               |

### Scenario Outline — Descriptive Naming

To make parameterized examples appear with readable names in Allure (instead of "Example #1"), add a `# title-format:` comment above the `Examples` table:

```gherkin
Scenario Outline: Login with different roles
    When the user "<role>" logs in

    # title-format: Login with role <role>
    Examples:
      | role          |
      | USER          |
      | ADMIN         |
```

> Full BDD documentation: `docs/BDD_GHERKIN_GUIDE.md`


## Runtime Configuration

`playwright.bdd.config.ts` reads these settings:

| Variable                 | Default                                    | Purpose                                      |
| ------------------------ | ------------------------------------------ | -------------------------------------------- |
| `ENV`                    | `STAGE`                                    | Target environment: `DEV` or `STAGE`         |
| `HEADLESS`               | `false` locally                            | Run Chromium without a visible browser       |
| `RETRIES`                | `0` locally, `2` in CI                     | Number of retries                            |
| `WORKERS`                | Playwright default                         | Worker count                                 |
| `PARALLEL_RUN`           | `false`                                    | Enables fully parallel execution when `true` |
| `TRACE_MODE`             | `retain-on-failure`                        | Playwright trace mode                        |
| `TEST_TIMEOUT`           | `300000` ms                                | Per-test timeout                             |
| `BDD_MISSING_STEPS_MODE` | `fail-on-run` locally, `fail-on-gen` in CI | Undefined-step handling                      |
| `RESULTS_GROUP`          | `all`                                      | JUnit result filename group                  |
| `REUSE_AUTH_STATE`       | disabled                                   | Reuse authentication state when `true`; prewarming is enabled only in CI/Azure, never in local CLI or UI runs |

The pipeline also supplies account credentials and artifact settings through environment variables. Keep those values in `.env` locally or in Azure DevOps secret variables.

## Allure Report

The report displays Gherkin steps (Given/When/Then) natively. `detail: false` hides internal fixture steps. Results are written to `allure-results`; JUnit files and other Playwright artifacts are written under `test-results`.


```bash
# Generate and open
npm run allure:report
```


## Project Structure

```
├── .env                        # Local configuration (ignored; never commit secrets)
├── playwright.bdd.config.ts    # Central Playwright + BDD configuration
├── package.json
├── tsconfig.json
│
├── config/
│   └── devices.config.ts       # Desktop device profile (viewport)
│
├── pages/                      # Page Objects (POM)
│   ├── BasePage.ts             # Base class with reusable methods
│   └── ...                     # Page objects for each application area
│
├── features/                   # BDD tests in Gherkin
│   ├── login.feature           # Authentication feature
│   └── steps/                  # Step definitions (TypeScript)
│       ├── fixtures.ts         # Custom BDD fixtures + Given/When/Then
│       ├── common.steps.ts     # Common reusable steps
│
├── scripts/
│   └── allure-bdd-enhance.js   # Injects skipped BDD steps into Allure
│
├── utils/
│   ├── EnvValidator.ts         # Environment variable validation
│   └── Logger.ts               # Centralized logger with Allure
│
├── azure-pipelines.yml         # Azure DevOps CI/CD pipeline
│
├── docs/
│   └── BDD_GHERKIN_GUIDE.md    # Complete BDD/Gherkin guide
│
└── test-data/                  # Input files used by scenarios
```


## Key Components

### `BasePage.ts` — Base Class

All Page Objects inherit from `BasePage`. Available methods:

| Method                                 | Description                                        |
| -------------------------------------- | -------------------------------------------------- |
| `waitForElement(selector)`             | Waits for an element to exist in the DOM           |
| `waitForSelectorStatus(sel, s)`        | Waits for a state: visible, hidden, attached, etc. |
| `clickElement(selector)`               | Clicks an element                                  |
| `fillInputText(selector, text)`        | Enters text into an input                          |
| `loadPage(url)`                        | Navigates to a URL                                 |
| `takeScreenshot(path?)`                | Takes a screenshot                                 |
| `captureScreenshotInCurrentStep(name)` | Captures and attaches a screenshot in Allure       |

### `features/steps/fixtures.ts` — BDD Fixtures

Defines the fixtures injected into step definitions, including the page objects for the current application areas. It also exports `Given`, `When`, and `Then`.


## CI/CD Pipeline

The [`azure-pipelines.yml`](azure-pipelines.yml) pipeline runs BDD tests in Azure DevOps:

1. Installs Node.js 22, dependencies, Chromium, and Java 21.
2. Type-checks TypeScript, audits dependencies, and validates BDD contracts.
3. Runs STAGE `@readOnly` tests in parallel and `@mutable` tests serially on Desktop Chrome.
4. Publishes JUnit results, the Allure report, diagnostics for failed runs, and Allure history.

Credentials and URLs are injected from Azure DevOps secret variables, including `STAGE_URL`, `GA_PORTAL_STAGE_URL`, and role-specific `USER_*` variables.

## References

- [BDD/Gherkin guide](docs/BDD_GHERKIN_GUIDE.md)
- [Playwright documentation](https://playwright.dev/docs/intro)
- [playwright-bdd documentation](https://github.com/vitalets/playwright-bdd)
- [Allure Playwright documentation](https://allurereport.org/docs/playwright/)
