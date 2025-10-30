import { Page, Locator, expect } from '@playwright/test';

export class HomePage 
{
  readonly page: Page;
  readonly marketsTab: Locator;
  readonly balancesSection: Locator;
  readonly ordersSection: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) 
  {
    this.page = page;
    this.marketsTab = page.locator('text=Markets');
    this.balancesSection = page.locator('text=Balances, text=Portfolio, [data-testid="balance"]');
    this.ordersSection = page.locator('text=Orders, [data-testid="orders-section"]');
    this.logoutButton = page.locator('text=Logout');
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL || 'https://test1.gotrade.goquant.io/gotrade', {
      waitUntil: 'domcontentloaded',
    });
  }

  async verifyDashboardVisible() {
    await expect(this.marketsTab.first()).toBeVisible({ timeout: 20000 });
    await expect(this.balancesSection.first()).toBeVisible({ timeout: 20000 });
    await expect(this.ordersSection.first()).toBeVisible({ timeout: 20000 });
  }

  async logout() 
  {
    if (await this.logoutButton.count()) {
      await this.logoutButton.first().click();
    }
  }
}
