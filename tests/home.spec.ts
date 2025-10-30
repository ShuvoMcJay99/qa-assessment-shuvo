import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Dashboard smoke tests', () => {

  test('should show dashboard elements after login', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.verifyDashboardVisible();
  });

  test('should allow user to logout successfully', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.logout();
    await expect(page).toHaveURL(/login|signin|auth/i);
  });

});
