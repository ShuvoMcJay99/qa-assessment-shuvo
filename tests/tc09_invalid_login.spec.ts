import { test, expect, Page } from '@playwright/test';

const APP = process.env.DEFAULT_BASE_URL ?? 'https://test1.gotrade.goquant.io/';
test('fallback smoke: app loads & login form visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/email|username/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
/** Wait for any credible login UI cue (no dependency on headings). */
async function waitForLoginUi(page: Page) {
  const candidates = [
    page.getByRole('button', { name: /log ?in|sign ?in|submit|continue/i }).first(),
    page.getByLabel(/email|username/i).first(),
    page.getByPlaceholder(/email|username/i).first(),
    page.locator('input[type="email"]').first(),
    page.locator('input[type="text"]').first(),
  ];
  for (const loc of candidates) {
    try { await loc.waitFor({ state: 'visible', timeout: 8000 }); return; } catch {}
  }
  // fallback: any textbox must be visible
  await expect(page.getByRole('textbox').first()).toBeVisible({ timeout: 5000 });
}

async function gotoLogin(page: Page) {
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  // If the app redirects, allow it to settle
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await waitForLoginUi(page);
}

async function submitLogin(page: Page, user: string, pass: string) {
  // Fill username/email using the first available locator
  const userField =
    (await page.getByLabel(/email|username/i).first().isVisible().catch(() => false))
      ? page.getByLabel(/email|username/i).first()
      : (await page.getByPlaceholder(/email|username/i).first().isVisible().catch(() => false))
          ? page.getByPlaceholder(/email|username/i).first()
          : page.locator('input[type="email"], input[type="text"]').first();

  await userField.fill(user);

  const passField =
    (await page.getByLabel(/password/i).first().isVisible().catch(() => false))
      ? page.getByLabel(/password/i).first()
      : page.locator('input[type="password"]').first();

  await passField.fill(pass);

  const submitBtn = page.getByRole('button', { name: /log ?in|sign ?in|submit|continue/i }).first();
  await submitBtn.click();
}

test.describe('TC-09 Invalid Login', () => {
  test('Chromium: shows a clear error on bad credentials', async ({ page }, info) => {
    await gotoLogin(page);
    await submitLogin(page, process.env.OKX_USERNAME || 'user@example.com', 'wrong-password-123');

    // Common error message variants
    const errorSurface = page.getByText(/invalid|incorrect|unauthori[sz]ed|failed|try again/i).first();
    await expect(errorSurface).toBeVisible({ timeout: 10000 });

    await info.attach('tc09_invalid_login_screen', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });
    await info.attach('tc09_url.txt', { body: Buffer.from(page.url()), contentType: 'text/plain' });
  });
});
