import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test('User can log in successfully to OrangeHRM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.login('Admin', 'admin123');

  await dashboardPage.verifyDashboard();
});