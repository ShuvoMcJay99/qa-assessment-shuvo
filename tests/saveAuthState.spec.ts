import { test } from '@playwright/test';

test('save auth state', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://test1.gotrade.goquant.io/');
  await page.pause(); // log in manually here
  await page.context().storageState({ path: 'storageState.json' });
});
