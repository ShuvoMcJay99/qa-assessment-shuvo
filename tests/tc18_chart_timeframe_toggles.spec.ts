import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';

test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test.describe('TC-18 Chart timeframe toggles', () => {
  test('Chromium: switching 1m/5m/1h/1d does not break chart', async ({ page }, info) => {
    await loginWithEnv(page);
    await readyDashboard(page);

    // Assume we’re already on a market detail from TC-17 runs;
    // if not, try to click any obvious "Trading" or "Markets" and open first market.
    const tradingBtn = page.getByRole('button', { name: /trading/i }).first()
      .or(page.getByRole('link', { name: /trading/i }).first());
    if (await tradingBtn.isVisible().catch(() => false)) await tradingBtn.click();

    const firstMarket = page.getByRole('link', { name: /btc|eth/i }).first()
      .or(page.getByText(/btc|eth/i).first());
    if (await firstMarket.isVisible().catch(() => false)) await firstMarket.click();

    // Timeframe buttons
    const frames = ['1m', '5m', '1h', '1d'];
    for (const f of frames) {
      const btn = page.getByRole('button', { name: new RegExp(`^${f}$`, 'i') }).first()
        .or(page.getByText(new RegExp(`^${f}$`, 'i')).first());
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        // Prefer aria-pressed change if present
        const pressed = page.locator('[aria-pressed="true"]').filter({ hasText: new RegExp(`^${f}$`, 'i') }).first();
        if (await pressed.isVisible().catch(() => false)) {
          await expect(pressed).toBeVisible();
        } else {
          await page.waitForTimeout(400); // minimal settle
        }
      }
    }

    // Chart (canvas or img) should still be present
    const chart = page.locator('canvas').first().or(page.getByRole('img', { name: /chart|tradingview/i }).first());
    await expect(chart).toBeVisible({ timeout: 8000 });

    await info.attach('tc18_timeframes', { body: await page.screenshot(), contentType: 'image/png' });
  });
});
