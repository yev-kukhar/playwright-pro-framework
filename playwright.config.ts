import { defineConfig } from '@playwright/test';
import 'dotenv/config';

/**
 * Playwright Configuration
 * Документація: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Тайм-аути */
  timeout: 10000,
  expect: {
    timeout: 5000
  },
  
  /* Паралельність */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  /* REPORTERS - Перемикання між Playwright та Allure */
  reporter: process.env.REPORTER === 'allure' 
    ? [
        ['list'],
        ['allure-playwright', {
          outputFolder: 'allure-results',
          detail: true,
          suiteTitle: true,
          environmentInfo: {
            'Test Environment': process.env.TEST_ENV || 'production',
            'API URL': process.env.API_BASE_URL || 'https://api.privatbank.ua',
            'Node Version': process.version,
            'OS': process.platform
          }
        }]
      ]
    : [
        ['list'],
        ['html', { 
          outputFolder: 'playwright-report',
          open: 'never'
        }],
        ['json', { 
          outputFile: 'test-results/results.json' 
        }],
        ['junit', { 
          outputFile: 'test-results/junit.xml' 
        }]
      ],
  
  /* Глобальні налаштування для API тестів */
  use: {
    baseURL: process.env.API_BASE_URL || 'https://api.privatbank.ua',
    
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    ignoreHTTPSErrors: true
  },

  /* Проекти */
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api.privatbank.ua'
      }
    }
  ],

  /* Вихідні директорії */
  outputDir: 'test-results/',
});