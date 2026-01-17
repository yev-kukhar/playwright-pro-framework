import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { InventoryPage } from '../../src/pages/inventory.page';

test('user can login and see inventory items', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.waitForLoad();

  const itemsCount = await inventoryPage.getItemsCount();
  expect(itemsCount).toBeGreaterThan(0);
});

test('debug env', async () => {
  console.log('BASE_URL:', process.env.BASE_URL);
  console.log('API_BASE_URL:', process.env.API_BASE_URL);
});

