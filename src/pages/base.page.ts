import { Page, Locator, test } from "@playwright/test";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await test.step(`Maps to ${path}`, async () => {
      await this.page.goto(path);
    });
  }

  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: "visible" });
  }

  getUrl() {
    return this.page.url();
  }
}
