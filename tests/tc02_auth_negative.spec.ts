import { test, expect } from '@playwright/test';
import { S } from '../utils/selectors';

test('TC-02 Invalid credentials block login', async ({ page }) => {
  await page.goto('/login');
  await page.locator(S.login.user).fill('invalid_user');
  await page.locator(S.login.pass).fill('wrong_pass');
  await page.locator(S.login.submit).click();

  await expect(page.locator('[data-testid="auth-error"]')).toHaveText(/invalid|incorrect/i);
  await expect(page).not.toHaveURL(/home|dashboard/i);
});
