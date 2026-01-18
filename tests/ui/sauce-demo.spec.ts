import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { ENV } from "../../src/config/env";

test("user can login and see inventory items", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(ENV.UI.USERNAME, ENV.UI.PASSWORD);

  await expect(page).toHaveURL(/inventory\.html/);
});
