import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/web/index.php/auth/login');
  }

  async login(
    username = process.env.ADMIN_USERNAME || 'Admin',
    password = process.env.ADMIN_PASSWORD || 'admin123'
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitForLoaderToDisappear();
  }

  async assertLoginSuccess(): Promise<void> {
    await expect(this.dashboardHeader).toHaveText(/Dashboard/i, { timeout: 30000 });
  }
}