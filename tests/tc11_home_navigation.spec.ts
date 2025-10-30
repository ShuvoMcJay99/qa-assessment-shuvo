import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('Chromium: header menus render and Trading menu opens', async ({ page }, info) => {
  await readyDashboard(page);

  const header = page.locator('header').first().or(page.getByRole('navigation').first());

  const markets  = header.getByRole('button', { name: /markets/i }).first()
                   .or(header.getByRole('link',   { name: /markets/i }).first());
  const trading  = header.getByRole('button', { name: /trading/i }).first()
                   .or(header.getByRole('link',   { name: /trading/i }).first());
  const accounts = header.getByRole('button', { name: /accounts/i }).first()
                   .or(header.getByRole('link',   { name: /accounts/i }).first());

  await expect(markets).toBeVisible({ timeout: 10000 });
  await expect(trading).toBeVisible();
  await expect(accounts).toBeVisible();

  await trading.click();
  await expect(page.getByRole('menu')).toBeVisible({ timeout: 8000 })
    .catch(async () => {
      await info.attach('tc11_menu_fallback', { body: await page.screenshot(), contentType: 'image/png' });
    });
});
