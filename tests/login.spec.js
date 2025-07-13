const { test, expect } = require('@playwright/test');

test('ログインが成功しました', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html'); //URLが期待通りになったかどうかを確認されています
  await expect(page.locator('.inventory_list')).toBeVisible(); //ウェブサイト内の要素をアサートされています
});

test('ログインが失敗しました', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.fill('#user-name', 'locked_out_user');
  await page.fill('#password', 'wrong_password');
  await page.click('#login-button');

  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface'); //ログイン失敗のエラーメッセージがアサートされています
});