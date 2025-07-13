const { test, expect } = require('@playwright/test');

test('ログインが成功しました', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/'); //ウェブサイトを開きます

  await page.fill('#user-name', 'standard_user'); //正しいユーザーが入力されています
  await page.fill('#password', 'secret_sauce'); //正しいパスワードが入力されています
  await page.click('#login-button'); //ログインボタンがクリークされています

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html'); //URLが期待通りになったかどうか確認されています
  await expect(page.locator('.inventory_list')).toBeVisible(); //ログイン成功後、ウェブサイト内の要素がアサートされています
});

test('ログインが失敗しました', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/'); ////ウェブサイトを開きます

  await page.fill('#user-name', 'locked_out_user'); //意図的に違ったユーザーが入力されています
  await page.fill('#password', 'wrong_password'); //意図的にパスワードが入力されています
  await page.click('#login-button'); //ログインボタンがクリークされています

  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface'); //ログイン失敗のエラーメッセージがアサートされています
});