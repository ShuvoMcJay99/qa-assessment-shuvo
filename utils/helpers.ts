import { test, expect, Page } from '@playwright/test';

/** Base URL helpers */
export const APP: string =
  (process.env.DEFAULT_BASE_URL ||
    process.env.BASE_URL ||
    'https://test1.gotrade.goquant.io/') as string;

export function getBaseURL(): string {
  try {
    const testInfo = test?.info();
    const project = testInfo.project as { use?: { baseURL?: string } };
    const use = project?.use;
    if (use?.baseURL) return use.baseURL as string;
  } catch {
    // test.info() can only be called while a test is running — ignore if not available
  }
  return process.env.BASE_URL || APP;
}

/** Simple “fixture” loader from env */
export function loadUsers() {
  return {
    okx: {
      user: process.env.OKX_USERNAME || process.env.TEST_USER_EMAIL || '',
      pass: process.env.OKX_PASSWORD || process.env.TEST_USER_PASS || '',
    },
    usdm: {
      user: process.env.GOTRADE_USERNAME || process.env.TEST_USER_EMAIL || '',
      pass: process.env.GOTRADE_PASSWORD || process.env.TEST_USER_PASS || '',
    },
    coinm: {
      user: process.env.COINM_USERNAME || process.env.TEST_USER_EMAIL || '',
      pass: process.env.COINM_PASSWORD || process.env.TEST_USER_PASS || '',
    },
  };
}

/** Common flows */
export async function login(page: Page, creds?: { user: string; pass: string }, remember = false) {
  const u = creds?.user || process.env.GOTRADE_USERNAME || process.env.TEST_USER_EMAIL || '';
  const p = creds?.pass || process.env.GOTRADE_PASSWORD || process.env.TEST_USER_PASS || '';
  await page.goto('/login');
  await page.getByLabel(/email|username/i).first().fill(u);
  await page.getByLabel(/password/i).first().fill(p);
  if (remember) await page.locator('[data-testid="remember-me"]').first().check().catch(() => {});
  await page.getByRole('button', { name: /sign ?in|log ?in|continue/i }).first().click();
}

export async function readyDashboard(page: Page) {
  await expect(page.locator('[data-testid="home-shell"]')).toBeVisible();
}
export async function waitHeaderReady(page: Page) {
  await expect(page.locator('header')).toBeVisible();
}
export async function loginWithEnv(page: Page) {
  await page.goto('/');
  if (/login/i.test(new URL(page.url()).pathname)) await login(page);
}
export async function loginAndReady(page: Page) {
  await loginWithEnv(page);
  await readyDashboard(page);
  await waitHeaderReady(page);
}

export async function waitForToast(page: Page, pat: RegExp | string = /saved|updated|success/i) {
  const toast = page.locator('[data-testid="toast-success"], [role="alert"], [data-sonner-toast]');
  await expect(toast.filter({ hasText: pat })).toBeVisible({ timeout: 8000 });
}

export async function waitForWsTick(page: Page) {
  await expect(page.locator('[data-testid="ws-indicator"]')).toHaveText(/connected|live/i, {
    timeout: 15000,
  });
}

export async function selectExchange(page: Page, name: string) {
  const headerEx = '[data-testid="header-exchange"]';
  const menu = page.getByRole('button', { name: /exchange|markets/i }).first();
  if (await menu.isVisible().catch(() => false)) await menu.click().catch(() => {});
  const opt =
    page.getByText(new RegExp(name, 'i')).first() ||
    page.getByRole('link', { name }).first();
  await opt.click().catch(() => {});
  await expect(page.locator(headerEx)).toContainText(new RegExp(name, 'i'));
}

export async function logout(page: Page) {
  const direct = page
    .getByRole('button', { name: /log ?out|sign ?out/i })
    .first()
    .or(page.getByRole('link', { name: /log ?out|sign ?out/i }).first());

  if (await direct.isVisible().catch(() => false)) {
    await direct.click().catch(() => {});
  } else {
    const profile = page.locator('header [aria-haspopup="menu"], header [class*="avatar"]').first();
    if (await profile.isVisible().catch(() => false)) {
      await profile.click().catch(() => {});
      await page.getByRole('menuitem', { name: /log ?out|sign ?out/i }).first().click().catch(() => {});
    }
  }

  await expect(page.getByRole('button', { name: /log ?in|sign ?in|continue/i })).toBeVisible({
    timeout: 10000,
  });
}
