import { test, expect } from '../fixtures/custom-fixtures';

test.describe('PIM - Employee Management @smoke @regression', () => {
  test('Add new employee with dynamic ID and automated fixture setup', async ({
    authenticatedAdminPage: page,
    createdEmployeeIds,
  }) => {
    await page.goto('/web/index.php/pim/addEmployee', { waitUntil: 'domcontentloaded' });
    await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => null);

    const dynamicId = `EMP${Date.now().toString().slice(-5)}`;
    createdEmployeeIds.push(dynamicId);

    await page.getByPlaceholder('First Name').fill('Automation');
    await page.getByPlaceholder('Last Name').fill('User');

    const idInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
    await idInput.waitFor({ state: 'visible', timeout: 15000 });
    await idInput.fill(dynamicId);

    // Click Save and wait for page URL change
    await Promise.all([
      page.waitForURL(/.*\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: 45000 }),
      page.getByRole('button', { name: 'Save' }).click()
    ]);

    await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => null);

    // Verify presence of employee profile header
    const userHeader = page.locator('.orangehrm-edit-employee-name');
    await expect(userHeader).toBeVisible({ timeout: 20000 });
  });
});