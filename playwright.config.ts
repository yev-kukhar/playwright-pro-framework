import { defineConfig } from "@playwright/test";
import { loadEnv } from "./src/config/env.loader";

// Load .env and optional .env.<TEST_ENV> before Playwright reads process.env
loadEnv();

const isCI = !!process.env.CI;
const suite = process.env.TEST_SUITE ?? "all";

/**
 * Playwright configuration
 *
 * Key idea:
 * - Do not set a single global baseURL when you have multiple contexts (UI + API).
 * - Use Playwright "projects" to isolate configuration per context.
 */
export default defineConfig({
  testDir: "./tests",

  timeout: 30_000,
  expect: { timeout: 5_000 },

  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,

  reporter: isCI
    ? [
        ["list"],
        ["junit", { outputFile: `test-results/junit-${suite}.xml` }],
        ["html", { open: "never" }],
      ]
    : [
        ["list"],
        ["html", { open: process.env.PW_HTML_REPORT_OPEN ?? "never" }],
      ],

  /**
   * Shared "use" options across all projects.
   * Keep it neutral (no baseURL, no API-specific headers).
   */
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "UI",
      testDir: "./tests/ui",
      use: {
        baseURL: process.env.BASE_URL || "https://www.saucedemo.com",
      },
    },
    {
      name: "API",
      testDir: "./tests/api",
      use: {
        baseURL: process.env.API_BASE_URL || "https://api.privatbank.ua",
        extraHTTPHeaders: {
          Accept: "application/json",
        },
      },
    },
  ],

  outputDir: "test-results/",
});
