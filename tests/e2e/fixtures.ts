import { test as base, chromium, type BrowserContext } from '@playwright/test';
import * as path from 'path';

// Mirrors the shape expected by authenticationReducer and actualSaveToLocalStorage().
const fakeAuthStateBetaTester = {
  userAuthenticated: true,
  userLoginLoading: false,
  userRegistrationLoading: false,
  userRegistrationSent: false,
  accessCodeRequestLoading: false,
  accessCodeRequestSent: false,
  accessToken: 'fake-access-token-for-e2e',
  accessTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  refreshToken: 'fake-refresh-token-for-e2e',
  user: {
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@e2e.local',
    username: 'test-user',
    roles: ['BETA_TESTER'],
  },
};

const fakeAuthStateExtraFeatures = {
  userAuthenticated: true,
  userLoginLoading: false,
  userRegistrationLoading: false,
  userRegistrationSent: false,
  accessCodeRequestLoading: false,
  accessCodeRequestSent: false,
  accessToken: 'fake-access-token-for-e2e',
  accessTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  refreshToken: 'fake-refresh-token-for-e2e',
  user: {
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@e2e.local',
    username: 'test-user',
    roles: ['EXTRA_FEATURE'],
  },
};

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  authenticatedBetaTesterExtensionId: string;
  authenticatedExtraFeaturesExtensionId: string;
}>({
  context: async ({ }, use) => {
    const pathToExtension = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../build/chrome-mv3') : path.join(__dirname, '../../dist');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },

  // Use this fixture instead of extensionId in tests that require authentication.
  // It injects a fake authenticated Redux state into chrome.storage before the
  // test runs. launchPersistentContext ignores Playwright's storageState option,
  // so this is the only reliable way to pre-authenticate an extension context.
  authenticatedBetaTesterExtensionId: async ({ context, extensionId }, use) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate((authState) => {
      const persistState = { cookies: true, userSession: authState };
      return new Promise<void>((resolve, reject) => {
        const storage = chrome.storage?.sync || chrome.storage?.local;
        if (storage) {
          storage.set({ 'persist:state': persistState }, () => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve();
          });
        } else {
          localStorage.setItem('persist:state', JSON.stringify(persistState));
          resolve();
        }
      });
    }, fakeAuthStateBetaTester);

    await page.close();
    await use(extensionId);
  },

  // user to test extra features
  authenticatedExtraFeaturesExtensionId: async ({ context, extensionId }, use) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate((authState) => {
      const persistState = { cookies: true, userSession: authState };
      return new Promise<void>((resolve, reject) => {
        const storage = chrome.storage?.sync || chrome.storage?.local;
        if (storage) {
          storage.set({ 'persist:state': persistState }, () => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve();
          });
        } else {
          localStorage.setItem('persist:state', JSON.stringify(persistState));
          resolve();
        }
      });
    }, fakeAuthStateExtraFeatures);

    await page.close();
    await use(extensionId);
  },
});
export const expect = test.expect;
