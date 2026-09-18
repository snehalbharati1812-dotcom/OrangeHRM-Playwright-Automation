import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  /* Overall timeout for a single test run (increased from default 30s) */
  timeout: 60000,

  /* Timeout for individual expect assertions */
  expect: {
    timeout: 15000,
  },

  /* Run tests sequentially in CI / parallel locally */
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker avoids database/state collision on shared demo apps

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    /* Base URL for the target web application */
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    /* Timeout for action calls like click(), fill(), waitFor() */
    actionTimeout: 15000,
    navigationTimeout: 30000,

    /* Collect trace and screenshot when retrying a failed test */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});