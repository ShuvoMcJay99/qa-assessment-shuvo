import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';
import { loadUsers, login, selectExchange } from '../utils/helpers';
import { S } from '../utils/selectors';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('TC-08 Order form validates inputs', async ({ page }) => {
  const { okx } = loadUsers();
  await login(page, okx);
  await page.click('[data-testid="tab-trade"]');

  // Client-side invalid
  await page.locator(S.order.price).fill('-10');
  await page.locator(S.order.qty).fill('abc');
  await page.locator(S.order.submit).click();
  await expect(page.locator(S.order.error)).toHaveText(/invalid|enter valid/i);

  // Server-side reject (extreme values)
  await page.locator(S.order.price).fill('99999999');
  await page.locator(S.order.qty).fill('1000000');

  const [resp] = await Promise.all([
    page.waitForResponse(r => /order|place/i.test(r.url())),
    page.locator(S.order.submit).click(),
  ]);

  expect(resp.status(), 'Expect server-side validation error').toBeGreaterThanOrEqual(400);
  await expect(page.locator(S.order.error)).toHaveText(/limit|not allowed|insufficient|reject/i);
});
