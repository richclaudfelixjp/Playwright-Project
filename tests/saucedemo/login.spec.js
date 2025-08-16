const { test, expect } = require('@playwright/test');

test('ログイン成功', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/'); //ウェブサイトに移動

  await page.fill('#user-name', 'standard_user'); //正しいユーザーを入力
  await page.fill('#password', 'secret_sauce'); //正しいパスワードを入力
  await page.click('#login-button'); //ログインボタンをクリック

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html'); //URLを期待通りになったかどうか確認
  await expect(page.locator('.inventory_list')).toBeVisible(); //ログイン成功後、ウェブサイト内の要素をアサート
});

test('ログイン失敗', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/'); //ウェブサイトに移動

  await page.fill('#user-name', 'locked_out_user'); //意図的に違ったユーザーを入力
  await page.fill('#password', 'wrong_password'); //意図的に違ったパスワードを入力
  await page.click('#login-button'); //ログインボタンをクリック

  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface'); //ログイン失敗のエラーメッセージをアサート
});

test('ログアウト機能の確認', async ({ page }) => {
  // ログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  await page.click('#react-burger-menu-btn'); //ハンバーガーメニューをクリック
  await expect(page.locator('.bm-menu')).toBeVisible(); //メニューが表示されることを確認

  await page.click('#logout_sidebar_link'); //ログアウトリンクをクリック
  
  await expect(page).toHaveURL('https://www.saucedemo.com/'); //URLがログイン画面に戻ったことを確認
  await expect(page.locator('#login-button')).toBeVisible(); //ログインボタンが表示されることを確認
  await expect(page.locator('.inventory_list')).not.toBeVisible(); //インベントリが非表示になることを確認
});

test('異なるユーザータイプでのログイン確認', async ({ page }) => {
  // problem_userでのログイン
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'problem_user'); 
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.inventory_list')).toBeVisible();

  // ログアウト
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');
  await expect(page).toHaveURL('https://www.saucedemo.com/');

  // performance_glitch_userでのログイン
  await page.fill('#user-name', 'performance_glitch_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.inventory_list')).toBeVisible();

  // ログアウト
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('空フィールドバリデーション', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // 空のユーザー名でログイン試行
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toContainText('Username is required'); //ユーザー名必須エラーの確認

  // エラーをクリア
  await page.click('.error-button'); //エラークリアボタンをクリック
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();

  // 空のパスワードでログイン試行
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', '');
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toContainText('Password is required'); //パスワード必須エラーの確認

  // エラーをクリア
  await page.click('.error-button');
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();

  // 両方空でログイン試行
  await page.fill('#user-name', '');
  await page.fill('#password', '');
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
});

test('ロックされたユーザーのログイン確認', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  
  // locked_out_userで正しいパスワードを使用
  await page.fill('#user-name', 'locked_out_user');
  await page.fill('#password', 'secret_sauce'); //正しいパスワードを使用
  await page.click('#login-button');
  
  // ロックされたユーザーのエラーメッセージを確認
  await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out'); //ロックアウトエラーの確認
  await expect(page).toHaveURL('https://www.saucedemo.com/'); //ログイン画面に留まることを確認
});