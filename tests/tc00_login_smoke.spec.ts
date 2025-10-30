import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';

test('TC-00 Login smoke reaches dashboard', async ({ page }) => {
  await loginAndReady(page);
  // Simple, stable assertion — UI shell visible
  await expect(page.locator('[data-testid="home-shell"]')).toBeVisible();
});