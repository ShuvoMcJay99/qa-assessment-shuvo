import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passInput: Locator;
  readonly submitBtn: Locator;
  readonly errorMsg: Locator;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://test1.gotrade.goquant.io/gotrade';
    // safer selectors (fallbacks)
    this.emailInput = page.locator('input[name="email"], input[type="email"], [placeholder*="email" i]');
    this.passInput = page.locator('input[name="password"], input[type="password"], [placeholder*="password" i]');
    this.submitBtn = page.locator('button:has-text("Sign In"), button:has-text("Sign in"), button:has-text("Login"), input[type="submit"]');
    this.errorMsg = page.locator('[role="alert"], .error, .ant-alert, .toast, text=Invalid');
  }

  async goto() {
    // use domcontentloaded to avoid long networkidle hangs
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // dismiss a modal if present (search separately)
    const gotStarted = this.page.locator('text=Get Started, text=Continue, button:has-text("Get Started")').first();
    if (await gotStarted.count() > 0) {
      try { await gotStarted.click({ timeout: 4000 }); } catch { /* ignore */ }
    }

    // ensure login form is visible
    await this.emailInput.first().waitFor({ state: 'visible', timeout: 20000 });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email, { timeout: 10000 });
    await this.passInput.fill(password, { timeout: 10000 });

    // click submit and wait for a reliable post-login marker (SPA-safe)
    await Promise.all([
      this.submitBtn.click(),
      // wait for avatar or logout or nav element — whichever appears first
      this.page.locator('text=Logout, [data-test="profile-avatar"], text=Markets, text=Dashboard').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {})
    ]);
  }

  async getErrorText() {
    try {
      return (await this.errorMsg.first().innerText()).trim();
    } catch {
      return '';
    }
  }
}
