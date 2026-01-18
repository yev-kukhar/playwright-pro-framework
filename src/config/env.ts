function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

/**
 * ENV
 *
 * Backward-compatible access for existing UI tests.
 * IMPORTANT: Must NOT throw on import. Validation should happen only when a field is read.
 */
export const ENV = {
  UI: {
    get USERNAME(): string {
      return required("UI_USERNAME");
    },
    get PASSWORD(): string {
      return required("UI_PASSWORD");
    },
    get BASE_URL(): string {
      return required("BASE_URL");
    },
  },

  API: {
    get BASE_URL(): string {
      return required("API_BASE_URL");
    },
  },
} as const;
