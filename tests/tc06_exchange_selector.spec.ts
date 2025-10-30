import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';
import { loadUsers, login, selectExchange } from '../utils/helpers';
import { S } from '../utils/selectors';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('TC-06 Exchange selection persists', async ({ page }) => {
  const { usdm } = loadUsers();
  await login(page, usdm);
  await selectExchange(page, 'OKX');

  await page.reload();
  await expect(page.locator(S.header.exchange)).toContainText('OKX');

  await page.getByRole('link', { name: /Markets/i }).click();
  await expect(page.locator(S.header.exchange)).toContainText('OKX');
});
