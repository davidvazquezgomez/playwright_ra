import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { DEVICE_PROFILES } from './config/devices.config';
import { EnvValidator } from './utils/EnvValidator';

/**
 * Playwright Configuration for BDD/Gherkin tests.
 *
 * Runs scenarios on the only supported device: Desktop Chrome.
 *
 * Usage:
 *   npm run test:bdd                  → Desktop (default)
 */
require('dotenv').config({ quiet: true });

const env = (process.env.ENV || 'STAGE').toUpperCase();
process.env.ENV = env;

if (env !== 'DEV' && env !== 'STAGE') {
  throw new Error(`ENV must be DEV or STAGE. Received: ${env}`);
}

const envUrls: Record<string, string> = {
  DEV: process.env.DEV_URL || '',
  STAGE: process.env.STAGE_URL || '',
};

EnvValidator.validateRequired();

type MissingStepsMode = 'fail-on-gen' | 'fail-on-run' | 'skip-scenario';
type TraceMode = 'off' | 'on' | 'retain-on-failure' | 'on-first-retry' | 'on-all-retries';
const missingStepsMode =
  (process.env.BDD_MISSING_STEPS_MODE as MissingStepsMode | undefined) ||
  (process.env.CI ? 'skip-scenario' : 'fail-on-run');
const retries = Number(process.env.RETRIES ?? (process.env.CI ? 2 : 0));
const traceMode = (process.env.TRACE_MODE as TraceMode | undefined) || 'retain-on-failure';
const resultsGroup = process.env.RESULTS_GROUP || 'all';
const authStatePrewarmOnly = process.env.AUTH_STATE_PREWARM_ONLY === 'true';
const featureGlob = process.env.BDD_FEATURE_GLOB || 'features/**/**/*.feature';

// playwright-bdd configuration: generate tests from .feature files
const testDir = defineBddConfig({
  features: featureGlob,
  steps: 'features/steps/**/*.ts',
  missingSteps: missingStepsMode,
});

export default defineConfig({
  testDir: authStatePrewarmOnly ? 'playwright' : testDir,
  testMatch: authStatePrewarmOnly ? /authState\.prewarm\.spec\.ts/ : undefined,
  globalSetup: require.resolve('./playwright/authState.setup'),
  fullyParallel: process.env.PARALLEL_RUN === 'true',
  timeout: process.env.TEST_TIMEOUT ? Number(process.env.TEST_TIMEOUT) : 300000,
  forbidOnly: !!process.env.CI,
  retries,
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : undefined,

  reporter: [
    ['list'],
    ['junit', {
      outputFile: `test-results/junit-${resultsGroup}.xml`,
    }],
    // Allure reporter — displays Gherkin scenarios natively
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: false,       // false = hide fixtures and show only BDD steps (Given/When/Then)
      suiteTitle: true,
    }],
  ],

  // Bounds every action/navigation to fail fast instead of inheriting the 300s test timeout.
  use: {
    baseURL: envUrls[env],
    acceptDownloads: true,
    // Off: BasePage.teardown() already attaches a compact JPEG on failure; avoid a duplicate PNG in Allure.
    screenshot: 'off',
    trace: traceMode,
    video: 'off',
    actionTimeout: process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000,
    navigationTimeout: process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000,
  },

  expect: {
    timeout: process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 15000,
  },

  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: DEVICE_PROFILES.desktop.viewport,
        headless: process.env.HEADLESS === 'true',
      },
    },
  ],

});
