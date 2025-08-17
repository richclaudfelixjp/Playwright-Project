const { test, expect } = require('@playwright/test');

test('商品詳細ページの表示と情報確認', async ({ page }) => {
  // ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // 商品詳細ページに移動
  await page.click('text=Sauce Labs Backpack');
  await expect(page).toHaveURL(/.*inventory-item.html.*/);

  // 商品詳細情報を確認
  await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('.inventory_details_desc')).toContainText('carry.allTheThings()');
  await expect(page.locator('.inventory_details_price')).toHaveText('$29.99');
  
  // 商品画像の表示確認
  await expect(page.locator('.inventory_details_img')).toBeVisible();
  const imageSrc = await page.locator('.inventory_details_img').getAttribute('src');
  expect(imageSrc).toContain('sauce-backpack');

  // Add to cartボタンの機能確認
  await page.click('button:has-text("Add to cart")');
  await expect(page.locator('button:has-text("Remove")')).toBeVisible();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Removeボタンの機能確認
  await page.click('button:has-text("Remove")');
  await expect(page.locator('button:has-text("Add to cart")')).toBeVisible();
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});

test('商品詳細ページからのナビゲーション確認', async ({ page }) => {
  // ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 商品詳細ページに移動
  await page.click('text=Sauce Labs Bike Light');
  await expect(page).toHaveURL(/.*inventory-item.html.*/);

  // Back to productsボタンで戻る
  await page.click('[data-test="back-to-products"]');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 再度商品詳細ページに移動してブラウザの戻るボタンをテスト
  await page.click('text=Sauce Labs Bolt T-Shirt');
  await expect(page).toHaveURL(/.*inventory-item.html.*/);
  
  // ブラウザの戻るボタン
  await page.goBack();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('複数商品の詳細ページ確認', async ({ page }) => {
  // ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // テスト対象の商品リスト
  const products = [
    { name: 'Sauce Labs Backpack', price: '$29.99', id: 'sauce-labs-backpack' },
    { name: 'Sauce Labs Bike Light', price: '$9.99', id: 'sauce-labs-bike-light' },
    { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99', id: 'sauce-labs-bolt-t-shirt' }
  ];

  for (const product of products) {
    // 商品詳細ページに移動
    await page.click(`text=${product.name}`);
    await expect(page).toHaveURL(/.*inventory-item.html.*/);

    // 商品情報を確認
    await expect(page.locator('.inventory_details_name')).toHaveText(product.name);
    await expect(page.locator('.inventory_details_price')).toHaveText(product.price);
    await expect(page.locator('.inventory_details_img')).toBeVisible();

    // 商品リストに戻る
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  }
});

test('商品詳細ページでのカート操作フロー', async ({ page }) => {
  // ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 商品詳細ページに移動
  await page.click('text=Sauce Labs Fleece Jacket');
  await expect(page).toHaveURL(/.*inventory-item.html.*/);

  // カートに追加
  await page.click('button:has-text("Add to cart")');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // カートページに移動して確認
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Fleece Jacket');

  // 商品詳細ページに戻る（商品名をクリック）
  await page.click('.inventory_item_name');
  await expect(page).toHaveURL(/.*inventory-item.html.*/);
  await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Fleece Jacket');

  // Removeボタンが表示されていることを確認
  await expect(page.locator('button:has-text("Remove")')).toBeVisible();
});

test('インベントリ内の全商品表示確認', async ({ page }) => {
  // ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // インベントリページの全商品を取得
  const productItems = await page.locator('.inventory_item').count();
  expect(productItems).toBe(6); // SauceDemoには6つの商品がある

  // 各商品に必要な要素が表示されていることを確認
  for (let i = 0; i < productItems; i++) {
    const item = page.locator('.inventory_item').nth(i);
    
    // 商品名が表示されている
    await expect(item.locator('.inventory_item_name')).toBeVisible();
    
    // 商品説明が表示されている
    await expect(item.locator('.inventory_item_desc')).toBeVisible();
    
    // 価格が表示されている
    await expect(item.locator('.inventory_item_price')).toBeVisible();
    
    // 商品画像が表示されている
    await expect(item.locator('img.inventory_item_img')).toBeVisible();
    
    // Add to cartボタンが表示されている
    await expect(item.locator('button:has-text("Add to cart")')).toBeVisible();
  }

  console.log(`確認完了: ${productItems}個の商品がすべて正しく表示されています`);
});

test('problem_userでの商品画像表示問題の確認', async ({ page }) => {
  // problem_userでログイン（画像表示に問題があることが知られている）
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'problem_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // 商品詳細ページに移動
  await page.click('text=Sauce Labs Backpack');
  await expect(page).toHaveURL(/.*inventory-item.html.*/);

  // 画像が表示されているかチェック（problem_userでは画像に問題がある可能性）
  const image = page.locator('.inventory_details_img');
  await expect(image).toBeVisible();
  
  // 画像のsrc属性を確認
  const imageSrc = await image.getAttribute('src');
  console.log(`Problem User画像src: ${imageSrc}`);
  
  // 画像が正しく読み込まれているかを確認
  const imageNaturalWidth = await image.evaluate(img => img.naturalWidth);
  expect(imageNaturalWidth).toBeGreaterThan(0);

  console.log('Problem userでの画像表示テスト完了');
});