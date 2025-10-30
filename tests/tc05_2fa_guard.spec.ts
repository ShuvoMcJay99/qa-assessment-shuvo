import { test, expect } from '@playwright/test';
import { loadUsers, login } from '../utils/helpers';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('TC-05 2FA prompts for OTP when enabled', async ({ page }) => {
  test.skip(!process.env.FEATURE_2FA, '2FA not enabled in this env');

  const { okx } = loadUsers();
  await page.goto('/login');
  await page.locator('[data-testid="login-username"]').fill(okx.user);
  await page.locator('[data-testid="login-password"]').fill(okx.pass);
  await page.locator('[data-testid="login-submit"]').click();

  await expect(page.locator('[data-testid="login-otp"]')).toBeVisible();
});
