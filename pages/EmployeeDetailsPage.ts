import { Page, Locator, expect } from '@playwright/test';

export class EmployeeDetailsPage {
  readonly page: Page;
  readonly employeeIdSearchInput: Locator;
  readonly searchButton: Locator;
  readonly tableRow: Locator;
  readonly otherIdInput: Locator;
  readonly personalDetailsSaveButton: Locator;
  readonly successToast: Locator;
  readonly formLoader: Locator;
  readonly topbarUserDropdown: Locator;
  readonly logoutLink: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.employeeIdSearchInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');

    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.tableRow = page.getByRole('table').getByRole('row').nth(1);

    this.otherIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Other Id' })
      .locator('input');

    this.personalDetailsSaveButton = page
      .locator('form')
      .filter({ has: page.locator('label', { hasText: 'Other Id' }) })
      .getByRole('button', { name: 'Save' });

    this.successToast = page.locator('.oxd-toast').filter({ hasText: /success/i });
    this.formLoader = page.locator('.oxd-form-loader');

    this.topbarUserDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.employeeIdSearchInput.fill(employeeId);
    await this.searchButton.click();
    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
    await this.tableRow.waitFor({ state: 'visible' });
  }

  async clickEditEmployee(): Promise<void> {
    const editBtn = this.tableRow.locator('button i.bi-pencil-fill, button i.bi-pencil').locator('..');
    await editBtn.waitFor({ state: 'visible' });
    await editBtn.click();

    await this.page.waitForURL('**/pim/viewPersonalDetails/empNumber/**', { timeout: 15000 });
    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
  }

  async updateOtherId(otherId: string): Promise<void> {
    await this.otherIdInput.waitFor({ state: 'visible' });

    await this.otherIdInput.click({ clickCount: 3 });
    await this.otherIdInput.fill(otherId);

    await this.otherIdInput.dispatchEvent('input');
    await this.otherIdInput.dispatchEvent('change');

    const saveApiResponsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/v2/pim/employees/') &&
        (response.request().method() === 'PUT' || response.request().method() === 'POST') &&
        response.status() === 200,
      { timeout: 15000 }
    );

    await this.personalDetailsSaveButton.click();

    await saveApiResponsePromise;
    await expect(this.successToast.first()).toBeVisible({ timeout: 10000 });
    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
  }

  async verifyOtherIdUpdated(otherId: string): Promise<void> {
    await expect(this.otherIdInput).toHaveValue(otherId, { timeout: 10000 });
  }

  async deleteEmployee(): Promise<void> {
    // Scope the delete button directly to the specific searched row
    const scopedDeleteBtn = this.tableRow.locator('button i.bi-trash').locator('..');
    await scopedDeleteBtn.waitFor({ state: 'visible' });
    await scopedDeleteBtn.click();

    await this.confirmDeleteButton.click();
    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
  }

  async logout(): Promise<void> {
    await this.topbarUserDropdown.click();
    await this.logoutLink.click();
    await this.page.waitForURL('**/auth/login');
  }
}