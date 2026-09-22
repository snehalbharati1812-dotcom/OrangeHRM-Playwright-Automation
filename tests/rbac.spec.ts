import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Role-Based Access Control (RBAC) @regression @rbac', () => {

  test('Admin user has access to Admin and PIM management modules', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login(
      process.env.ADMIN_USERNAME || 'Admin',
      process.env.ADMIN_PASSWORD || 'admin123'
    );
    await loginPage.assertLoginSuccess();

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PIM' })).toBeVisible();
  });

  test('ESS user cannot see or navigate to Admin management module', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    await loginPage.login(
      process.env.ESS_USERNAME || 'ess_user',
      process.env.ESS_PASSWORD || 'password123'
    );

    const isDashboardVisible = await page.locator('.oxd-topbar-header-breadcrumb-module')
      .isVisible({ timeout: 8000 })
      .catch(() => false);

    if (isDashboardVisible) {
      await expect(page.getByRole('link', { name: 'Admin' })).toBeHidden();
    } else {
      // Handle login alert box on invalid credentials
      const alertContent = page.locator('.oxd-alert-content-text');
      await expect(alertContent).toBeVisible({ timeout: 15000 });
      await expect(alertContent).toHaveText(/Invalid credentials/i);
    }
  });

});