import { chromium } from '@playwright/test';
import {
  clearAuthStates,
  isAuthStateReuseEnabled,
  prewarmAuthStates,
} from '../utils/AuthStateManager';

export default async function authStateSetup(): Promise<void> {
  await clearAuthStates();
  if (!isAuthStateReuseEnabled() || process.env.CI !== 'true' || process.argv.includes('--ui')) {
    return;
  }
  if (process.env.SHARED_AUTH_STATES === 'true') {
    console.log('Using shared authentication states from the pipeline artifact.');
    return;
  }

  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  try {
    await prewarmAuthStates(browser);
  } finally {
    await browser.close();
  }
}