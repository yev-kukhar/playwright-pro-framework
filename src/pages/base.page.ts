import { Page, Locator, test } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  // Метод для переходу на сторінку з логуванням
  async navigate(path: string) {
    await test.step(`Maps to ${path}`, async () => {
      await this.page.goto(path);
    });
  }

  // Спільний метод для очікування елемента (демонструє стабільність тестів)
  async waitForElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
  }

  // Гетер для отримання URL (використовується в багатьох тестах для перевірок)
  getUrl() {
    return this.page.url();
  }
}