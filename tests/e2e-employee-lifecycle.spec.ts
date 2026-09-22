import { test, expect } from '../fixtures/custom-fixtures';
import { APIClient } from '../utils/api-client';

test.describe.serial('PIM - Employee Lifecycle Management @regression', () => {
  let createdEmpNumber: string; // Internal DB ID (e.g. 72)
  const customEmpId = `EMP${Date.now().toString().slice(-5)}`; // UI Custom ID

  test('Phase 1: Create Employee via UI @smoke', async ({
    authenticatedAdminPage: page,
    createdEmployeeIds,
  }) => {
    await page.goto('/web/index.php/pim/addEmployee', { waitUntil: 'domcontentloaded' });
    await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => null);

    await page.getByPlaceholder('First Name').fill('Lifecycle');
    await page.getByPlaceholder('Last Name').fill('User');

    const idInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
    await idInput.waitFor({ state: 'visible', timeout: 15000 });
    await idInput.fill(customEmpId);

    await Promise.all([
      page.waitForURL(/.*\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: 45000 }),
      page.getByRole('button', { name: 'Save' }).click()
    ]);

    await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => null);

    // Extract internal database ID from URL parameter
    const url = page.url();
    const match = url.match(/empNumber\/(\d+)/);
    if (match && match[1]) {
      createdEmpNumber = match[1];
      createdEmployeeIds.push(createdEmpNumber);
    }

    expect(createdEmpNumber, 'empNumber must be extracted from URL').toBeTruthy();
  });

  test('Phase 2: Verify Employee via API Backend', async ({ authenticatedAdminPage: page }) => {
    test.skip(!createdEmpNumber, 'Employee creation failed in Phase 1');
    const apiClient = new APIClient(page);

    await expect.poll(async () => {
      return await apiClient.getEmployeeStatus(createdEmpNumber);
    }, {
      timeout: 20000,
      intervals: [1000, 2000],
    }).toBe(200);
  });

  test('Phase 3: Search and Delete Employee via UI with Deletion Verification', async ({
    authenticatedAdminPage: page,
  }) => {
    test.skip(!createdEmpNumber, 'Employee creation failed in Phase 1');
    const apiClient = new APIClient(page);

    // 1. Delete via API for speed & absolute reliability
    const deleteStatus = await apiClient.deleteEmployee(createdEmpNumber);
    expect(deleteStatus).toBe(200);

    // 2. Verify in UI that the deleted record no longer appears in search
    await page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'domcontentloaded' });
    await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => null);

    const searchIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
    await searchIdInput.fill(customEmpId);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-form-loader, .oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30000 }).catch(() => null);

    // Assert UI confirms "No Records Found"
    await expect(page.getByText(/No Records Found/i).first()).toBeVisible({ timeout: 20000 });

    // 3. Confirm API backend status returns non-200
    await expect.poll(async () => {
      const status = await apiClient.getEmployeeStatus(createdEmpNumber);
      return status !== 200;
    }, {
      timeout: 20000,
      intervals: [1000, 2000],
    }).toBe(true);
  });
});