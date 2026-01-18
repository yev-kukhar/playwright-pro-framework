/**
 * UI_ENV
 *
 * UI-only environment variables.
 * Keep API and UI env validation separated to avoid breaking API-only runs.
 */
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export const UI_ENV = {
  BASE_URL: required("BASE_URL"),
  USERNAME: required("UI_USERNAME"),
  PASSWORD: required("UI_PASSWORD"),
};
