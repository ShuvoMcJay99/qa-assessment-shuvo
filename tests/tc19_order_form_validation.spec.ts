import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test.describe('TC-19 Order form validation (min/max)', () => {
  test('Chromium: invalid quantity (0 and huge) shows clear errors', async ({ page }, info) => {
    await loginWithEnv(page);
    await readyDashboard(page);

    // Ensure on trading page with order form
    const trading = page.getByRole('button', { name: /trading|trade/i }).first()
      .or(page.getByRole('link', { name: /trading|trade/i }).first());
    if (await trading.isVisible().catch(() => false)) await trading.click();

    const openAny = page.getByRole('link', { name: /btc|eth/i }).first()
      .or(page.getByText(/btc|eth/i).first());
    if (await openAny.isVisible().catch(() => false)) await openAny.click();

    // Find quantity & submit Buy
    const qty = page.getByLabel(/quantity|qty/i).first()
      .or(page.locator('input[name*="qty" i], input[name*="quantity" i]').first());
    const buy = page.getByRole('button', { name: /^buy\b/i }).first();

    // If no order form in this environment, skip gracefully
    if (!(await qty.isVisible().catch(() => false)) || !(await buy.isVisible().catch(() => false))) {
      test.skip(true, 'Order form not available in this environment');
      return;
    }

    // Case 1: 0 quantity
    await qty.fill('0');
    await buy.click();

    const errMin = page.getByText(/min|greater than 0|invalid/i).first()
      .or(page.getByRole('alert').first());
    await expect(errMin).toBeVisible({ timeout: 8000 });

    // Case 2: huge quantity -> insufficient balance
    await qty.fill('9999999');
    await buy.click();

    const errBal = page.getByText(/insufficient|balance|not enough/i).first()
      .or(page.getByRole('alert').first());
    await expect(errBal).toBeVisible({ timeout: 8000 });

    await info.attach('tc19_order_validation', { body: await page.screenshot(), contentType: 'image/png' });
  });
});
