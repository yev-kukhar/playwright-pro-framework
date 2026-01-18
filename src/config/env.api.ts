/**
 * API_ENV
 *
 * API-only environment variables.
 * Keep API and UI env validation separated to avoid breaking API-only runs.
 */
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export const API_ENV = {
  BASE_URL: required("API_BASE_URL"),
  TEST_DATE: process.env.TEST_DATE || "01.12.2023",
};
