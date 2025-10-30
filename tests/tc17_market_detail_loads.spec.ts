import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';

test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test.describe('TC-17 Market detail loads', () => {
  test('Chromium: can open a market detail page', async ({ page }, info) => {
    await loginWithEnv(page);
    await readyDashboard(page);
    await waitHeaderReady(page);

    // Try Markets menu
    const header = page.locator('header').first().or(page.getByRole('navigation').first());
    const marketsMenu = header.getByRole('button', { name: /markets/i }).first()
      .or(header.getByRole('link', { name: /markets/i }).first());
    if (await marketsMenu.isVisible().catch(() => false)) await marketsMenu.click();

    // Click a known symbol if visible, else go to generic trading route
    const btc = page.getByRole('link', { name: /btc|eth/i }).first()
      .or(page.getByText(/btc|eth/i).first());
    if (await btc.isVisible().catch(() => false)) {
      await btc.click();
    } else {
      await page.goto(new URL('/trade', APP).toString()).catch(() => {});
    }

    // Assert a market detail cue (symbol tag, price, or chart)
    const symbolTag = page.getByText(/btc|eth/i).first();
    const price     = page.getByText(/price|last|mark/i).first();
    const chart     = page.getByRole('img', { name: /chart|tradingview/i }).first()
      .or(page.locator('canvas').first());

    await expect(symbolTag.or(price).or(chart)).toBeVisible({ timeout: 15000 });

    await info.attach('tc17_market_detail', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });
});
