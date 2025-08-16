const { test, expect } = require('@playwright/test');

test('カートへの商品追加と削除機能', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  await page.click('text=Add to cart', { hasText: 'Sauce Labs Backpack' });　//三つの商品をカートに追加
  await page.click('text=Add to cart', { hasText: 'Sauce Labs Bike Light' });
  await page.click('text=Add to cart', { hasText: 'Sauce Labs Bolt T-Shirt' });

  const cartCount = await page.textContent('.shopping_cart_badge');
  expect(Number(cartCount)).toBe(3);　//カートのバッジカウントを確認

  await page.click('.shopping_cart_link');　//カートページに移動
  await page.click('text=Remove', { hasText: 'Sauce Labs Backpack' });　//二つの商品を削除
  await page.click('text=Remove', { hasText: 'Sauce Labs Bike Light' });

  const cartCountAfterRemove = await page.textContent('.shopping_cart_badge');
  expect(Number(cartCountAfterRemove)).toBe(1);　//カートのバッジカウントが1であることを確認

  const cartItems = await page.$$eval('.inventory_item_name', els => els.map(e => e.textContent));
  expect(cartItems).toContain('Sauce Labs Bolt T-Shirt');　//カートに残っている商品を確認
  expect(cartItems).not.toContain('Sauce Labs Backpack');
  expect(cartItems).not.toContain('Sauce Labs Bike Light');
});
