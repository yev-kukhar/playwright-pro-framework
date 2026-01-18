import * as fs from "node:fs";
import * as path from "node:path";
import dotenv from "dotenv";

/**
 * Single source of truth for env loading.
 *
 * Convention:
 *  - .env (base)
 *  - .env.<TEST_ENV> (overlay) where TEST_ENV=dev|stage|ci|local
 */
export function loadEnv(): void {
  // Keep console output clean in tests
  process.env.DOTENV_CONFIG_QUIET ??= "true";

  const root = process.cwd();

  const base = path.join(root, ".env");
  if (fs.existsSync(base)) {
    dotenv.config({ path: base, override: false });
  }

  const envName = process.env.TEST_ENV?.trim();
  if (!envName) return;

  const overlay = path.join(root, `.env.${envName}`);
  if (fs.existsSync(overlay)) {
    dotenv.config({ path: overlay, override: true });
  }
}
