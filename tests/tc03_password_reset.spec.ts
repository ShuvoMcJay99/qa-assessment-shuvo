import { test, expect } from '@playwright/test';
import { S } from '../utils/selectors';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
test('TC-03 Forgot Password sends reset email', async ({ page }) => {
  await page.goto('/login');
  await page.locator(S.login.forgot).click();
  await expect(page).toHaveURL(/reset|forgot/i);
  await page.getByLabel(/email/i).fill(process.env.RESET_EMAIL!);
  await page.getByRole('button', { name: /send|submit/i }).click();
  await expect(page.locator('[data-testid="toast-success"]')).toHaveText(/sent|check your email/i);
});
