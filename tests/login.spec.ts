import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const VALID_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const VALID_PASS  = process.env.TEST_USER_PASS  || 'password123';

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    // ensure a fresh start for every test
    await page.context().clearCookies();
  });

  test('should login with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // perform login
    await login.login(VALID_EMAIL, VALID_PASS);

  // Wait for a high-confidence dashboard marker instead of asserting URL (SPAs can be slow)
  // prefer visible element over strictly matching URL
await 
await page
  .locator('text=/logout/i, text=/log out/i, [data-test="profile-avatar"], text=/markets/i, text=/dashboard/i')
  .first()
  .waitFor({ state: 'visible', timeout: 40000 });

// final sanity check
await expect(page.locator('text=Logout')).toBeVisible({ timeout: 15000 });

  });

  test('should show error on invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('bad@example.com', 'wrongpass');

    await expect(login.errorMsg).toBeVisible({ timeout: 8000 });
    const err = await login.getErrorText();
    expect(err.toLowerCase()).toMatch(/invalid|incorrect|failed|unauthor/i);
  });
});
