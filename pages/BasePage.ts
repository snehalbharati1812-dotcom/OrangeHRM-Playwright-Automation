import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly loader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loader = page.locator('.oxd-form-loader, .oxd-loading-spinner');
  }

  /**
   * Waits for OrangeHRM loading spinners/overlays to detach from the DOM.
   */
  async waitForLoaderToDisappear(): Promise<void> {
    await this.loader.waitFor({ state: 'detached', timeout: 30000 }).catch(() => null);
  }

  /**
   * Navigates to a specific path relative to baseURL and waits for page stability.
   */
  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForLoaderToDisappear();
  }
}