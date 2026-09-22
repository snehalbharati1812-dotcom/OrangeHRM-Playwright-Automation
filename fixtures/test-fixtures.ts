import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PIMPage;
  addEmployeePage: AddEmployeePage;
  employeeDetailsPage: EmployeeDetailsPage;
  authenticatedPage: void;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PIMPage(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },
  employeeDetailsPage: async ({ page }, use) => {
    await use(new EmployeeDetailsPage(page));
  },

  authenticatedPage: async ({ page, loginPage, dashboardPage }, use) => {
    const baseUrl = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';
    const username = process.env.ADMIN_USERNAME || 'Admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    await page.goto(baseUrl);
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboard();
    await use();
  },
});

export { expect };