import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async verifyDashboard(): Promise<void> {
    // Wait for the URL to change to the dashboard
    await expect(this.page).toHaveURL(/.*\/dashboard\/index/, { timeout: 15000 });
    
    // Check heading visibility with an increased timeout to handle demo site latency
    await expect(this.dashboardHeading).toBeVisible({ timeout: 15000 });
  }
}