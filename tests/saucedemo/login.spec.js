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