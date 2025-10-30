import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';

test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test.describe('TC-15 Settings: update display name', () => {
  test('Chromium: can open Settings and update display name', async ({ page }, info) => {
    await loginWithEnv(page);
    await readyDashboard(page);

    // Try open Settings via visible UI; fallback: hard route
    const openSettings = async () => {
      const header = page.locator('header').first().or(page.getByRole('navigation').first());
      const settingsFromHeader =
        header.getByRole('button', { name: /settings|profile/i }).first()
          .or(header.getByRole('link', { name: /settings|profile/i }).first());

      if (await settingsFromHeader.isVisible().catch(() => false)) {
        await settingsFromHeader.click();
      } else {
        // common side menu path
        const sideSettings = page.getByRole('link', { name: /settings|profile/i }).first()
          .or(page.getByRole('menuitem', { name: /settings|profile/i }).first());
        if (await sideSettings.isVisible().catch(() => false)) {
          await sideSettings.click();
        } else {
          await page.goto(new URL('/settings', APP).toString()).catch(() => {});
        }
      }
    };

    await openSettings();

    // Find display-name field
    const nameInput =
      page.getByLabel(/display name|name/i).first()
        .or(page.locator('input[name*="name" i]').first());

    await expect(nameInput).toBeVisible({ timeout: 15000 });

    const newName = `Shuvo • QA ${Date.now().toString().slice(-5)}`;
    await nameInput.fill(newName);

    const saveBtn =
      page.getByRole('button', { name: /save|update/i }).first()
        .or(page.getByRole('link', { name: /save|update/i }).first());
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Success cue: toast/snackbar OR value persists after reload
    const toast = page.getByText(/saved|updated|success/i).first();
    if (await toast.isVisible().catch(() => false)) {
      await expect(toast).toBeVisible();
    } else {
      await page.reload();
      await expect(nameInput).toHaveValue(newName);
    }

    await info.attach('tc15_settings_after', { body: await page.screenshot(), contentType: 'image/png' });
  });
});
