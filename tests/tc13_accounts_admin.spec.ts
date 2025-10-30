import { test, expect } from '@playwright/test';
import { APP, loginWithEnv, loginAndReady, readyDashboard, waitHeaderReady } from '../utils/helpers';

test('Chromium: Accounts admin page renders list or empty state', async ({ page }, info) => {
  await readyDashboard(page);

  await page.goto(new URL('/admin', APP).toString(), { waitUntil: 'domcontentloaded' });

  const addAccount = page.getByRole('button', { name: /add account/i }).first();
  const tableRow   = page.locator('table tr, [role="row"]').nth(1);
  const emptyText  = page.getByText(/no accounts|connect account|testnet/i).first();

  // Use .first() to avoid “strict mode resolved to 2 elements”
  await expect(addAccount.or(tableRow).or(emptyText).first()).toBeVisible({ timeout: 12000 });

  await info.attach('tc13_accounts', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});
