const { test, expect } = require('@playwright/test');

test('ログインが成功しました', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/'); //ウェブサイトを開きます

  await page.fill('#user-name', 'standard_user'); //正しいユーザーが入力されます
  await page.fill('#password', 'secret_sauce'); //正しいパスワードが入力されます
  await page.click('#login-button'); //ログインボタンがクリックされます

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html'); //URLが期待通りになったかどうか確認されます
  await expect(page.locator('.inventory_list')).toBeVisible(); //ログイン成功後、ウェブサイト内の要素がアサートされます
});

test('ログインが失敗しました', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/'); ////ウェブサイトを開きます

  await page.fill('#user-name', 'locked_out_user'); //意図的に違ったユーザーが入力されます
  await page.fill('#password', 'wrong_password'); //意図的に違ったパスワードが入力されます
  await page.click('#login-button'); //ログインボタンがクリックされます

  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface'); //ログイン失敗のエラーメッセージがアサートされます
});