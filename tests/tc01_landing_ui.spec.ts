import { test, expect } from '@playwright/test';

test('TC-01 Landing page renders key elements and no severe console errors', async ({ page }) => {
  const severe: string[] = [];
  page.on('console', (msg) => {
    const t = msg.type();
    if (t === 'error' || t === 'assert') severe.push(msg.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /goquant/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /login/i })).toBeVisible();

  await page.getByRole('link', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/login/i);

  expect(severe, `Console errors detected:\n${severe.join('\n')}`).toHaveLength(0);
});
