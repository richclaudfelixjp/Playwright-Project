const { test, expect } = require('@playwright/test');

test('完全なチェックアウトプロセス', async ({ page }) => {
  //ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  //商品をカートに追加
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
  
  //カートのバッジ数を確認
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  //カートページに移動
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  //カート内の商品を確認
  await expect(page.locator('.inventory_item_name')).toHaveCount(2);
  await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();

  //チェックアウト開始
  await page.click('[data-test="checkout"]');
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

  //お客様情報を入力
  await page.fill('[data-test="firstName"]', '田中');
  await page.fill('[data-test="lastName"]', '太郎');
  await page.fill('[data-test="postalCode"]', '123-4567');
  await page.click('[data-test="continue"]');

  // チェックアウト概要ページに移動
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

  // 注文概要を確認
  await expect(page.locator('.inventory_item_name')).toHaveCount(2);
  await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();

  // 料金計算を確認
  const itemTotal = await page.locator('.summary_subtotal_label').textContent();
  const tax = await page.locator('.summary_tax_label').textContent();
  const total = await page.locator('.summary_total_label').textContent();
  
  expect(itemTotal).toContain('Item total: $');
  expect(tax).toContain('Tax: $');
  expect(total).toContain('Total: $');

  // 注文完了
  await page.click('[data-test="finish"]');
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

  // 注文完了確認
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  await expect(page.locator('.pony_express')).toBeVisible(); // 配送画像の確認

  // ホームに戻る
  await page.click('[data-test="back-to-products"]');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  
  // カートが空になっていることを確認
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});

test('チェックアウト情報フォームバリデーション', async ({ page }) => {
  // ログインとカートに商品追加
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // 空のフィールドでContinueを押す
  await page.click('[data-test="continue"]');
  
  // エラーメッセージの確認
  await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');

  // 名前だけ入力
  await page.fill('[data-test="firstName"]', '田中');
  await page.click('[data-test="continue"]');
  await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');

  // 名前と苗字を入力
  await page.fill('[data-test="lastName"]', '太郎');
  await page.click('[data-test="continue"]');
  await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');

  // 全て入力して成功
  await page.fill('[data-test="postalCode"]', '123-4567');
  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
});

test('注文概要と税金計算の確認', async ({ page }) => {
  // ログインと商品追加
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 価格が分かる商品を追加
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]'); // $29.99
  await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]'); // $9.99
  
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');
  
  // お客様情報入力
  await page.fill('[data-test="firstName"]', '田中');
  await page.fill('[data-test="lastName"]', '太郎');
  await page.fill('[data-test="postalCode"]', '123-4567');
  await page.click('[data-test="continue"]');

  // 料金計算の詳細確認
  const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
  const taxText = await page.locator('.summary_tax_label').textContent();
  const totalText = await page.locator('.summary_total_label').textContent();

  // 小計の確認 ($29.99 + $9.99 = $39.98)
  const itemTotal = parseFloat(itemTotalText.replace('Item total: $', ''));
  expect(itemTotal).toBe(39.98);

  // 税金の確認
  const tax = parseFloat(taxText.replace('Tax: $', ''));
  expect(tax).toBeGreaterThan(0);

  // 合計の確認
  const total = parseFloat(totalText.replace('Total: $', ''));
  expect(total).toBe(itemTotal + tax);

  console.log(`小計: $${itemTotal}, 税金: $${tax}, 合計: $${total}`);
});

test('カートが空の状態でのチェックアウト確認', async ({ page }) => {
  // ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 空のカートでチェックアウトページにアクセス
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  
  // カートが空であることを確認
  await expect(page.locator('.inventory_item_name')).toHaveCount(0);
  
  // Checkoutボタンが表示されていることを確認（SauceDemoは空カートでもCheckout可能）
  await expect(page.locator('[data-test="checkout"]')).toBeVisible();
});
