import { test, expect } from '@playwright/test';
import { loadUsers, login, waitForToast, getBaseURL } from '../utils/helpers';
import { S } from '../utils/selectors';
const base = getBaseURL();
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('TC-12 Update currency & timezone persists', async ({ browser, context }) => {
  const page = await context.newPage();
  const { usdm } = loadUsers();
  await login(page, usdm);

  await page.locator(S.settings.menu).click();
  await page.locator(S.settings.currency).selectOption('USD');
  await page.locator(S.settings.timezone).selectOption('Asia/Kolkata');
  await page.locator(S.settings.save).click();
  await waitForToast(page, /saved|updated/i);

  // Refresh check
  await page.reload();
  await expect(page.locator(S.settings.currency)).toHaveValue('USD');
  await expect(page.locator(S.settings.timezone)).toHaveValue('Asia/Kolkata');

  // New context check with baseURL
  const state = await context.storageState();
  const ctx2 = await browser.newContext({ storageState: state, baseURL: base });
  const page2 = await ctx2.newPage();

  await page2.goto('/settings');
  await expect(page2.locator(S.settings.currency)).toHaveValue('USD');
  await expect(page2.locator(S.settings.timezone)).toHaveValue('Asia/Kolkata');

  await ctx2.close();
});
