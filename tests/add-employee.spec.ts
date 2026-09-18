import { test } from '@playwright/test';
import path from 'path';
import employeeData from '../test-data/employee.json';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';

test('Add new employee with dynamic ID and profile picture', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const pimPage = new PIMPage(page);
  const addEmployeePage = new AddEmployeePage(page);

  // Generate dynamic unique Employee ID
  const dynamicEmployeeId = `EMP${Date.now().toString().slice(-6)}`;
  const profilePicPath = path.join(__dirname, '../test-assets/profile.jpg');

  // 1. Log in
  await loginPage.navigateToLoginPage();
  await loginPage.login('Admin', 'admin123');
  await dashboardPage.verifyDashboard();

  // 2. Navigate to PIM -> Add Employee
  await pimPage.navigateToPIM();
  await pimPage.navigateToAddEmployee();

  // 3. Fill Employee details and upload photo
  await addEmployeePage.addEmployee({
    firstName: employeeData.firstName,
    lastName: employeeData.lastName,
    employeeId: dynamicEmployeeId,
  });
  await addEmployeePage.uploadProfilePicture(profilePicPath);

  // 4. Save and verify creation
  await addEmployeePage.saveEmployee();
  await addEmployeePage.verifyEmployeeCreated(dynamicEmployeeId);
});