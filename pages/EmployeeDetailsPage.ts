import { Page, Locator, expect } from '@playwright/test';

export class EmployeeDetailsPage {
  readonly page: Page;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly formLoader: Locator;
  readonly tableRow: Locator;
  readonly otherIdInput: Locator;
  readonly savePersonalDetailsButton: Locator;
  readonly deleteSelectedButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');

    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.formLoader = page.locator('.oxd-form-loader');
    this.tableRow = page.locator('.oxd-table-card').first();

    this.otherIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Other Id' })
      .locator('input');

    this.savePersonalDetailsButton = page
      .locator('form')
      .filter({ hasText: 'Other Id' })
      .getByRole('button', { name: 'Save' })
      .first();

    this.deleteSelectedButton = page
      .locator('.oxd-table-cell-actions button:has(.bi-trash), .oxd-table-cell-actions button i.bi-trash')
      .first();

    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
  }

  async searchByEmployeeId(empId: string): Promise<void> {
    await this.employeeIdInput.waitFor({ state: 'visible' });
    await this.employeeIdInput.click({ clickCount: 3 });
    await this.page.keyboard.press('Backspace');
    await this.employeeIdInput.fill(empId);

    // Promise.all ensures listener is active BEFORE trigger
    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/v2/pim/employees') && resp.status() === 200,
        { timeout: 15000 }
      ).catch(() => null),
      this.searchButton.click(),
    ]);

    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
  }

  async clickEditEmployee(): Promise<void> {
    await this.tableRow.waitFor({ state: 'visible', timeout: 10000 });
    const editBtn = this.tableRow
      .locator('button:has(.bi-pencil-fill), button i.bi-pencil-fill')
      .first();
    await editBtn.click();
  }

  async updateOtherId(otherId: string): Promise<void> {
    await this.otherIdInput.waitFor({ state: 'visible' });
    
    await this.otherIdInput.click({ clickCount: 3 });
    await this.page.keyboard.press('Backspace');
    await this.otherIdInput.fill(otherId);

    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/v2/pim/employees/') && resp.status() === 200,
        { timeout: 15000 }
      ).catch(() => null),
      this.savePersonalDetailsButton.click(),
    ]);

    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
  }

  async verifyOtherIdUpdated(expectedOtherId: string): Promise<void> {
    await expect(this.otherIdInput).toHaveValue(expectedOtherId, { timeout: 10000 });
  }

  async deleteEmployee(): Promise<void> {
    await this.tableRow.waitFor({ state: 'visible', timeout: 10000 });
    await this.deleteSelectedButton.click();

    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/api/v2/pim/employees') && resp.request().method() === 'DELETE',
        { timeout: 15000 }
      ).catch(() => null),
      this.confirmDeleteButton.click(),
    ]);

    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
  }
}