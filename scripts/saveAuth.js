const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = process.env.BASE_URL || "https://test1.gotrade.goquant.io/gotrade";
  console.log("🌐  Navigating to:", base);

  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60000 });

  // fill in credentials from env vars
  await page.fill('input[name="email"], input[type="email"]', process.env.TEST_USER_EMAIL || "");
  await page.fill('input[name="password"], input[type="password"]', process.env.TEST_USER_PASS || "");

  // click Sign-In
  await Promise.all([
    page.click('button:has-text("Sign In"), button:has-text("Login"), button:has-text("Sign in")'),
    page.waitForTimeout(2000)
  ]);

  // wait for dashboard markers
  await page.waitForSelector(
    'text=Markets, text=Accounts, text=Dashboard, [data-test="profile-avatar"], text=Logout',
    { timeout: 30000 }
  );

  await context.storageState({ path: "storageState.json" });
  console.log("✅  storageState.json saved");

  await browser.close();
})();

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    storageState: 'storageState.json',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
});
