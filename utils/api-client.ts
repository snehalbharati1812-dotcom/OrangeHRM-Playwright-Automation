import { Page } from '@playwright/test';

export class APIClient {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Fetches employee status code using the database primary key empNumber.
   * Leverages authenticated session cookies from the page context.
   */
  async getEmployeeStatus(empNumber: string): Promise<number> {
    const response = await this.page.request.get(`/web/index.php/api/v2/pim/employees/${empNumber}`);
    return response.status();
  }

  /**
   * Deletes employee record directly via backend API endpoint.
   */
  async deleteEmployee(empNumber: string): Promise<number> {
    const response = await this.page.request.delete('/web/index.php/api/v2/pim/employees', {
      data: { ids: [parseInt(empNumber, 10)] }
    });
    return response.status();
  }
}