import { Browser } from '@playwright/test';
import { promises as fs } from 'fs';
import { createHash, randomUUID } from 'crypto';
import path from 'path';
import { CommonPage } from '../pages/CommonPage';
import { LoginPage } from '../pages/LoginPage';

interface FeatureAuthentication {
  userType: string;
  role: string;
  url: string;
  username: string;
  password: string;
  totpSecret: string;
}

const featureLoginStep =
  /^\s*(?:Given|When|Then|And|But)\s+launch Regulatory Advantage application URL and login as "([^"]+)" user "([^"]+)"\s*$/m;
const authStateDirectory = path.join(process.cwd(), 'test-results', 'auth-state');
const lockTimeoutMs = Number(process.env.AUTH_STATE_LOCK_TIMEOUT_MS || 300000);
const staleLockTimeoutMs = Number(process.env.AUTH_STATE_STALE_LOCK_TIMEOUT_MS || 900000);
const lockRetryDelayMs = 200;

export interface AuthSession {
  shouldSkipInitialLogin(userType: string, role: string): boolean;
  recordLogin(): void;
  recordLogout(): void;
}

export function isAuthStateReuseEnabled(): boolean {
  return process.env.REUSE_AUTH_STATE === 'true';
}

export async function clearAuthStates(): Promise<void> {
  if (isAuthStateReuseEnabled()) {
    await fs.rm(authStateDirectory, { recursive: true, force: true });
  }
}

export async function prewarmAuthStates(browser: Browser): Promise<void> {
  if (!isAuthStateReuseEnabled()) {
    return;
  }

  const authenticationsByStatePath = new Map<string, FeatureAuthentication>();
  for (const featureFile of await findFeatureFiles(path.join(process.cwd(), 'features'))) {
    const authentication = await getFeatureAuthenticationFromFile(featureFile);
    if (authentication) {
      authenticationsByStatePath.set(getAuthStatePath(authentication), authentication);
    }
  }

  console.log(`Prewarming ${authenticationsByStatePath.size} authentication state(s).`);
  for (const [statePath, authentication] of authenticationsByStatePath) {
    await fs.mkdir(path.dirname(statePath), { recursive: true });
    await createAuthState(browser, authentication, statePath);
  }
}

export async function createAuthSession(testFile: string): Promise<AuthSession> {
  const authentication = isAuthStateReuseEnabled() ? await getFeatureAuthentication(testFile) : undefined;
  let initialLoginHandled = false;
  let isAuthenticated = Boolean(authentication);

  return {
    shouldSkipInitialLogin(userType: string, role: string): boolean {
      const matchesFeatureAuthentication =
        !initialLoginHandled &&
        isAuthenticated &&
        authentication?.userType === userType.toLowerCase() &&
        authentication.role === role;

      initialLoginHandled = true;
      return matchesFeatureAuthentication;
    },
    recordLogin(): void {
      initialLoginHandled = true;
      isAuthenticated = true;
    },
    recordLogout(): void {
      isAuthenticated = false;
    },
  };
}

export async function prepareFeatureAuthState(browser: Browser, testFile: string): Promise<string | undefined> {
  if (!isAuthStateReuseEnabled()) {
    return undefined;
  }

  const authentication = await getFeatureAuthentication(testFile);
  if (!authentication) {
    return undefined;
  }

  const statePath = getAuthStatePath(authentication);
  if (await fileExists(statePath)) {
    return statePath;
  }

  const lockPath = `${statePath}.lock`;
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  const lockToken = await acquireLock(lockPath);

  try {
    if (!await fileExists(statePath)) {
      await createAuthState(browser, authentication, statePath);
    }
  } finally {
    await releaseLock(lockPath, lockToken);
  }

  return statePath;
}

async function getFeatureAuthentication(testFile: string): Promise<FeatureAuthentication | undefined> {
  const featureFile = getFeatureFile(testFile);
  return getFeatureAuthenticationFromFile(featureFile);
}

async function getFeatureAuthenticationFromFile(featureFile: string): Promise<FeatureAuthentication | undefined> {
  const featureContent = await fs.readFile(featureFile, 'utf8');
  const backgroundContent = getBackgroundContent(featureContent);
  const loginMatch = backgroundContent.match(featureLoginStep);

  if (!loginMatch) {
    return undefined;
  }

  const userType = loginMatch[1].toLowerCase();
  const role = loginMatch[2];
  if (userType !== 'deloitte' && userType !== 'external') {
    throw new Error(`Unknown user type "${loginMatch[1]}" in ${featureFile}. Use "deloitte" or "external".`);
  }

  const environment = (process.env.ENV || 'STAGE').toUpperCase();
  const url = environment === 'DEV' ? process.env.DEV_URL : process.env.STAGE_URL;
  if (!url) {
    throw new Error(`URL is not configured for environment ${environment}.`);
  }

  const normalizedRole = role.toUpperCase();
  const username = process.env[`USER_${normalizedRole}`];
  const password = process.env[`USER_${normalizedRole}_PASSWORD`];
  const totpSecret = process.env[`USER_${normalizedRole}_TOTP_SECRET`] || '';
  if (!username || !password) {
    throw new Error(`Credentials are missing for "${role}". Configure USER_${normalizedRole} and USER_${normalizedRole}_PASSWORD.`);
  }
  if (userType === 'external' && !totpSecret) {
    throw new Error(`Credentials are missing for "${role}". Configure USER_${normalizedRole}_TOTP_SECRET.`);
  }

  return { userType, role, url, username, password, totpSecret };
}

async function findFeatureFiles(directory: string): Promise<string[]> {
  const featureFiles: string[] = [];

  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      featureFiles.push(...await findFeatureFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      featureFiles.push(entryPath);
    }
  }

  return featureFiles;
}

function getFeatureFile(testFile: string): string {
  const generatedFeaturesDirectory = path.join(process.cwd(), '.features-gen', 'features');
  const relativeTestFile = path.relative(generatedFeaturesDirectory, testFile);
  const relativeFeatureFile = relativeTestFile.replace(/\.feature\.spec\.js$/, '.feature');

  if (relativeFeatureFile === relativeTestFile || relativeFeatureFile.startsWith('..')) {
    throw new Error(`Unable to determine the source feature for generated test ${testFile}.`);
  }

  return path.join(process.cwd(), 'features', relativeFeatureFile);
}

function getBackgroundContent(featureContent: string): string {
  const backgroundStart = featureContent.search(/^\s*Background:\s*$/m);
  if (backgroundStart === -1) {
    return '';
  }

  const afterBackground = featureContent.slice(backgroundStart).replace(/^\s*Background:\s*\r?\n/m, '');
  const nextSection = afterBackground.search(/^\s*(?:Scenario(?: Outline)?|Rule):/m);
  return nextSection === -1 ? afterBackground : afterBackground.slice(0, nextSection);
}

function getAuthStatePath(authentication: FeatureAuthentication): string {
  const environment = (process.env.ENV || 'STAGE').toUpperCase();
  const accountId = `${authentication.userType}-${authentication.role}`.toLowerCase();
  const stateId = createHash('sha256')
    .update(`${environment}:${authentication.url}:${accountId}`)
    .digest('hex')
    .slice(0, 16);

  return path.join(authStateDirectory, environment.toLowerCase(), `${stateId}.json`);
}

async function createAuthState(browser: Browser, authentication: FeatureAuthentication, statePath: string): Promise<void> {
  const context = await browser.newContext();
  const page = await context.newPage();
  const commonPage = new CommonPage(page, context);
  const loginPage = new LoginPage(page, context);

  try {
    await commonPage.launchApplication(authentication.url);
    await loginPage.login(authentication.username, authentication.password, authentication.totpSecret);
    await commonPage.dismissCookieConsent();
    await context.storageState({ path: statePath });
  } finally {
    try {
      await context.close();
    } catch (error) {
      if (!isResourceBusyError(error)) {
        throw error;
      }
    }
  }
}

async function acquireLock(lockPath: string): Promise<string> {
  const deadline = Date.now() + lockTimeoutMs;
  const lockToken = `${process.pid}:${randomUUID()}`;

  while (true) {
    try {
      await fs.mkdir(lockPath);
      await fs.writeFile(path.join(lockPath, 'owner'), lockToken, 'utf8');
      return lockToken;
    } catch (error) {
      if (!isAlreadyExistsError(error)) {
        throw error;
      }
      await removeStaleLock(lockPath);
      if (Date.now() >= deadline) {
        throw new Error(`Timed out waiting for authentication state lock ${lockPath}.`);
      }
      await delay(lockRetryDelayMs);
    }
  }
}

async function releaseLock(lockPath: string, lockToken: string): Promise<void> {
  try {
    const owner = await fs.readFile(path.join(lockPath, 'owner'), 'utf8');
    if (owner === lockToken) {
      await fs.rm(lockPath, { recursive: true, force: true });
    }
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }
}

async function removeStaleLock(lockPath: string): Promise<void> {
  try {
    const lockStats = await fs.stat(lockPath);
    const lockAgeMs = Date.now() - lockStats.mtimeMs;
    if (lockAgeMs > staleLockTimeoutMs && !(await isLockOwnerAlive(lockPath))) {
      await fs.rm(lockPath, { recursive: true, force: true });
    }
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }
}

async function isLockOwnerAlive(lockPath: string): Promise<boolean> {
  try {
    const owner = await fs.readFile(path.join(lockPath, 'owner'), 'utf8');
    const processId = Number(owner.split(':', 1)[0]);
    if (!Number.isInteger(processId) || processId <= 0) {
      return false;
    }

    process.kill(processId, 0);
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'EPERM') {
      return true;
    }
    return false;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isAlreadyExistsError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'EEXIST';
}

function isNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT';
}

function isResourceBusyError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'EBUSY';
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}