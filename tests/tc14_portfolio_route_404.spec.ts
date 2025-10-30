import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';

test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('Chromium: /portfolio shows 404 and Go Home returns to dashboard', async ({ page }, info) => {
  await readyDashboard(page);

  await page.goto(new URL('/portfolio', APP).toString(), { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { name: /page not found|404/i }))
    .toBeVisible({ timeout: 10000 });

  const link = page.getByRole('link',   { name: /^go home$/i }).first();
  const btn  = page.getByRole('button', { name: /^go home$/i }).first();
  const use  = (await link.isVisible().catch(() => false)) ? link : btn;
  await use.click();

  await expect(
    page.locator('header').first().or(page.getByRole('navigation').first())
  ).toBeVisible({ timeout: 12000 });

  await info.attach('tc14_after_home', { body: await page.screenshot(), contentType: 'image/png' });
});
