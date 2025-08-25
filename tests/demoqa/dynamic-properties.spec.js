const { test, expect } = require('@playwright/test');

test.skip('動的プロパティ - 有効化ボタンの待機', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties'); //動的プロパティページに移動

  const enableAfterButton = page.locator('#enableAfter'); //5秒後に有効になるボタンを取得
  
  // 初期状態では無効化されていることを確認
  await expect(enableAfterButton).toBeDisabled(); //ボタンが無効化されていることをアサート
  
  // 5秒待ってボタンが有効になることを確認
  await expect(enableAfterButton).toBeEnabled({ timeout: 6000 }); //6秒のタイムアウトでボタンが有効になることを待機
  
  // 有効になったボタンをクリック
  await enableAfterButton.click(); //有効になったボタンをクリック
});

test.skip('動的プロパティ - 色の変化確認', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties'); //動的プロパティページに移動

  const colorChangeButton = page.locator('#colorChange'); //色が変わるボタンを取得
  
  // 初期の色を確認（白色）
  await expect(colorChangeButton).toHaveCSS('color', 'rgb(255, 255, 255)'); //初期色が白であることを確認
  
  // 5秒後に色が赤に変わることを確認
  await expect(colorChangeButton).toHaveCSS('color', 'rgb(220, 53, 69)', { timeout: 6000 }); //6秒のタイムアウトで色が赤に変わることを待機
});

test.skip('動的プロパティ - 要素の表示確認', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties'); //動的プロパティページに移動

  const visibleAfterButton = page.locator('#visibleAfter'); //5秒後に表示されるボタンを取得
  
  // 初期状態では非表示であることを確認
  await expect(visibleAfterButton).not.toBeVisible(); //ボタンが非表示であることをアサート
  
  // 5秒後にボタンが表示されることを確認
  await expect(visibleAfterButton).toBeVisible({ timeout: 6000 }); //6秒のタイムアウトでボタンが表示されることを待機
  
  // 表示されたボタンをクリック
  await visibleAfterButton.click(); //表示されたボタンをクリック
});

test.skip('動的プロパティ - 複数の変化の同時確認', async ({ page }) => {
  await page.goto('https://demoqa.com/dynamic-properties'); //動的プロパティページに移動

  const enableAfterButton = page.locator('#enableAfter'); //有効化ボタンを取得
  const colorChangeButton = page.locator('#colorChange'); //色変更ボタンを取得
  const visibleAfterButton = page.locator('#visibleAfter'); //表示ボタンを取得
  
  // すべての初期状態を確認
  await expect(enableAfterButton).toBeDisabled(); //有効化ボタンが無効であることを確認
  await expect(colorChangeButton).toHaveCSS('color', 'rgb(255, 255, 255)'); //色変更ボタンが白色であることを確認
  await expect(visibleAfterButton).not.toBeVisible(); //表示ボタンが非表示であることを確認
  
  // 5秒後のすべての変化を並行して待機
  await Promise.all([
    expect(enableAfterButton).toBeEnabled({ timeout: 6000 }), //有効化を待機
    expect(colorChangeButton).toHaveCSS('color', 'rgb(220, 53, 69)', { timeout: 6000 }), //色変更を待機
    expect(visibleAfterButton).toBeVisible({ timeout: 6000 }) //表示を待機
  ]);
  
  // すべての変化後のボタンをクリック
  await enableAfterButton.click(); //有効化されたボタンをクリック
  await colorChangeButton.click(); //色が変わったボタンをクリック
  await visibleAfterButton.click(); //表示されたボタンをクリック
});
