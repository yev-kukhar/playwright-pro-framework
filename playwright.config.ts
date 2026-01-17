import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',

  timeout: 10000,
  expect: { timeout: 5000 },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.REPORTER === 'allure'
    ? [
      ['list'],
      ['allure-playwright', {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          'Test Environment': process.env.TEST_ENV || 'production',
          'UI URL': process.env.BASE_URL || 'https://www.saucedemo.com',
          'API URL': process.env.API_BASE_URL || 'https://api.privatbank.ua',
          'Node Version': process.version,
          'OS': process.platform
        }
      }]
    ]
    : [
      ['list'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['json', { outputFile: 'test-results/results.json' }],
      ['junit', { outputFile: 'test-results/junit.xml' }]
    ],


  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true
  },

  projects: [
    {
      name: 'UI',
      testDir: './tests/ui',
      use: {
        baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
      }
    },
    {
      name: 'API',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api.privatbank.ua',
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
  ],

  outputDir: 'test-results/',
});
