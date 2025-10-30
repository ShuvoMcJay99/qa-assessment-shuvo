import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';
import { loadUsers, login, selectExchange, waitForWsTick } from '../utils/helpers';
import { S } from '../utils/selectors';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('TC-07 Market data updates via WS', async ({ page }) => {
  test.slow();

  const { coinm } = loadUsers();
  await login(page, coinm);
  await selectExchange(page, 'Binance COIN-M');

  await page.getByRole('tab', { name: /markets/i }).click().catch(async () => {
    await page.click('[data-testid="tab-markets"]');
  });

  await expect(page.locator(S.market.wsIndicator)).toHaveText(/connected|live/i);
  await waitForWsTick(page);
});
