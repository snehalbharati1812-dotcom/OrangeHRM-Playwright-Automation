import { Page, Locator, expect } from '@playwright/test';

export class AddEmployeePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly formLoader: Locator;
  readonly profilePicInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');

    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.formLoader = page.locator('.oxd-form-loader');
    this.profilePicInput = page.locator('input[type="file"]');
  }

  async addEmployee(details: { firstName: string; lastName: string; employeeId: string }): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);

    await this.employeeIdInput.click();
    await this.employeeIdInput.clear();
    await this.employeeIdInput.fill(details.employeeId);
  }

  async enterEmployeeDetails(firstName: string, lastName: string, employeeId: string): Promise<void> {
    await this.addEmployee({ firstName, lastName, employeeId });
  }

  async uploadProfilePicture(filePath: string): Promise<void> {
    await this.profilePicInput.setInputFiles(filePath);
  }

  async saveEmployee(): Promise<void> {
    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
    await this.saveButton.waitFor({ state: 'visible' });
    await this.saveButton.click();
    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});
  }

  async verifyEmployeeCreated(employeeId: string): Promise<void> {
    await this.page.waitForURL('**/pim/viewPersonalDetails/empNumber/**', { timeout: 15000 });
    await this.formLoader.waitFor({ state: 'detached' }).catch(() => {});

    await expect(
      this.page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input')
    ).toHaveValue(employeeId, { timeout: 10000 });
  }
}