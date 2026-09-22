import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type CustomFixtures = {
  authenticatedAdminPage: Page;
  createdEmployeeIds: string[];
};

export const test = base.extend<CustomFixtures>({
  createdEmployeeIds: async ({}, use) => {
    const ids: string[] = [];
    await use(ids);
  },

  authenticatedAdminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login(); // Automatically uses environment variable credentials
    await loginPage.assertLoginSuccess();
    
    await use(page);
  },
});

export { expect } from '@playwright/test';