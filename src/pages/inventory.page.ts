import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
  }

  async waitForLoad() {
    await expect(this.inventoryList).toBeVisible();
  }

  async getItemsCount(): Promise<number> {
    return await this.page.locator('.inventory_item').count();
  }
}
