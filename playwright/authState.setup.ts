import { chromium } from '@playwright/test';
import {
  clearAuthStates,
  isAuthStateReuseEnabled,
  prewarmAuthStates,
} from '../utils/AuthStateManager';

export default async function authStateSetup(): Promise<void> {
  await clearAuthStates();
  if (!isAuthStateReuseEnabled()) {
    return;
  }

  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  try {
    await prewarmAuthStates(browser);
  } finally {
    await browser.close();
  }
}