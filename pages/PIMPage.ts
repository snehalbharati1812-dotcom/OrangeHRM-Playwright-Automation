import { Page, Locator } from '@playwright/test';

export class PIMPage {
  readonly page: Page;
  readonly pimMenu: Locator;
  readonly addEmployeeMenu: Locator;
  readonly employeeListMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.addEmployeeMenu = page.getByRole('link', { name: 'Add Employee' });
    this.employeeListMenu = page.getByRole('link', {
      name: 'Employee List',
    });
  }

  async navigateToPIM(): Promise<void> {
    await this.pimMenu.click();
  }

  async navigateToAddEmployee(): Promise<void> {
    await this.addEmployeeMenu.click();
  }

  async navigateToEmployeeList(): Promise<void> {
    await this.employeeListMenu.click();
  }
}