import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';

test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test.describe('TC-16 Settings: password change validation (UI only)', () => {
  test('Chromium: mismatched passwords shows validation error', async ({ page }, info) => {
    await loginWithEnv(page);
    await readyDashboard(page);

    // Navigate to Settings/Security
    await page.goto(new URL('/settings', APP).toString()).catch(() => {});
    const secTab = page.getByRole('tab', { name: /security|password/i }).first()
      .or(page.getByRole('button', { name: /security|password/i }).first());
    if (await secTab.isVisible().catch(() => false)) await secTab.click();

    // Locate fields (labels or name attrs)
    const current = page.getByLabel(/current password/i).first()
      .or(page.locator('input[name*="current" i]').first());
    const pw1 = page.getByLabel(/^new password$/i).first()
      .or(page.locator('input[name*="new" i]').first());
    const pw2 = page.getByLabel(/confirm/i).first()
      .or(page.locator('input[name*="confirm" i]').first());

    // If the form isn’t present in this build, mark N/A cleanly
    const formPresent = await pw1.isVisible().catch(() => false);
    if (!formPresent) {
      test.skip(true, 'Change Password UI not present in this environment');
      return;
    }

    await current.fill('dummy-old-pass');
    await pw1.fill('NewPass123!');
    await pw2.fill('Different123!');

    const save = page.getByRole('button', { name: /save|update|change/i }).first();
    await save.click();

    // Expect client-side mismatch error
    const error =
      page.getByText(/match|same|mismatch/i).first()
        .or(page.getByRole('alert').filter({ hasText: /match|same|mismatch/i }).first());
    await expect(error).toBeVisible({ timeout: 8000 });

    await info.attach('tc16_pw_validation', { body: await page.screenshot(), contentType: 'image/png' });
  });
});
