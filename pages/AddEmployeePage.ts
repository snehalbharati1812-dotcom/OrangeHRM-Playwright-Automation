import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

export class AddEmployeePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly fileInput: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.oxd-grid-2 input.oxd-input');
    // Selector targets the actual hidden file input in OrangeHRM
    this.fileInput = page.locator('input[type="file"]');
    this.saveButton = page.locator('button[type="submit"]');
    this.successToast = page.locator('.oxd-toast-content');
  }

  async uploadProfilePicture(relativeFilePath: string): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), relativeFilePath);
    
    // Attach file directly to input element
    await this.fileInput.setInputFiles(absolutePath);
    
    // Wait briefly for the file upload preview thumbnail to render
    await this.page.waitForTimeout(1000);
  }

  async createEmployee(firstName: string, lastName: string, empId: string, imagePath?: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    
    // Clear and fill dynamic employee ID
    await this.employeeIdInput.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.employeeIdInput.fill(empId);

    if (imagePath) {
      await this.uploadProfilePicture(imagePath);
    }

    await this.saveButton.click();

    // Verify success toast appears instead of static timeout
    await expect(this.successToast).toBeVisible({ timeout: 20000 });
  }
}