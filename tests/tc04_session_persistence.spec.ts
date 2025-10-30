import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';
import { loadUsers, login } from '../utils/helpers';
import { S } from '../utils/selectors';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('TC-04 Remember me persists session', async ({ browser, context }) => {
  const page = await context.newPage();
  const { okx } = loadUsers();

  await login(page, okx, true);
  await expect(page.locator(S.home.shell)).toBeVisible();

  // Capture current storage and reuse in a brand-new context
  const state = await context.storageState();
  const base = ((test.info().config as any).use?.baseURL as string) || process.env.BASE_URL!;
  const ctx2 = await browser.newContext({ storageState: state, baseURL: base });
  const page2 = await ctx2.newPage();

  await page2.goto('/'); // relative works because baseURL is set above
  await expect(page2.locator(S.home.shell)).toBeVisible();

  await ctx2.close();
});
