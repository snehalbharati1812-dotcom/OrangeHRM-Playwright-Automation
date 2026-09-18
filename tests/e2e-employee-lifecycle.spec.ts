import { test, expect } from '@playwright/test';
import employeeData from '../test-data/employee.json';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';

test('Full Employee Lifecycle: Login -> Add -> Search -> Update -> API Check -> Delete -> Logout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const pimPage = new PIMPage(page);
  const addEmployeePage = new AddEmployeePage(page);
  const employeeDetailsPage = new EmployeeDetailsPage(page);

  const dynamicEmployeeId = `EMP${Date.now().toString().slice(-6)}`;
  
  // Directly point to the test asset relative to project root
  const profilePicPath = './test-assets/profile.jpg';
  const updatedOtherId = 'OTH-9988';

  // 1. Login
  await loginPage.navigateToLoginPage();
  await loginPage.login('Admin', 'admin123');
  await dashboardPage.verifyDashboard();

  // 2. Add Employee
  await pimPage.navigateToPIM();
  await pimPage.navigateToAddEmployee();
  await addEmployeePage.addEmployee({
    firstName: employeeData.firstName,
    lastName: employeeData.lastName,
    employeeId: dynamicEmployeeId,
  });
  await addEmployeePage.uploadProfilePicture(profilePicPath);
  await addEmployeePage.saveEmployee();
  await addEmployeePage.verifyEmployeeCreated(dynamicEmployeeId);

  // 3. Edit Employee
  await pimPage.navigateToEmployeeList();
  await employeeDetailsPage.searchByEmployeeId(dynamicEmployeeId);
  await employeeDetailsPage.clickEditEmployee();
  await employeeDetailsPage.updateOtherId(updatedOtherId);
  await employeeDetailsPage.verifyOtherIdUpdated(updatedOtherId);

  // 4. Validate Employee via API using page.request
  const apiResponse = await page.request.get(
    `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?employeeId=${dynamicEmployeeId}`
  );
  expect(apiResponse.status(), 'API response status should be 200 OK').toBe(200);

  const responseBody = await apiResponse.json();
  expect(responseBody.data.length, 'Employee record should exist in API payload').toBeGreaterThan(0);
  expect(responseBody.data[0].employeeId, 'API employeeId should match UI created ID').toBe(dynamicEmployeeId);

  // 5. Delete Employee
  await pimPage.navigateToEmployeeList();
  await employeeDetailsPage.searchByEmployeeId(dynamicEmployeeId);
  await employeeDetailsPage.deleteEmployee();

  // Re-verify deletion via API query
  const postDeleteApiResponse = await page.request.get(
    `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?employeeId=${dynamicEmployeeId}`
  );
  const postDeleteResponseBody = await postDeleteApiResponse.json();
  expect(postDeleteResponseBody.data.length, 'Deleted employee should no longer exist in API data').toBe(0);

  // 6. Logout
  await employeeDetailsPage.logout();
  await expect(page, 'User should be redirected to Login page after logout').toHaveURL(/.*auth\/login/);
});
