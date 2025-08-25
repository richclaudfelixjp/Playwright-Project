const { test, expect } = require('@playwright/test');

test.skip('ツールチップ - ホバーでツールチップ表示', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得

  // ボタンにホバー
  await hoverButton.hover(); //ボタンにマウスホバー

  // ツールチップが表示されることを確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible(); //ツールチップが表示されることを確認
  await expect(tooltip).toContainText('You hovered over the Button'); //ツールチップのテキストを確認
});

test.skip('ツールチップ - テキストフィールドのツールチップ', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const textField = page.locator('#toolTipTextField'); //テキストフィールドを取得

  // テキストフィールドにホバー
  await textField.hover(); //テキストフィールドにマウスホバー

  // ツールチップが表示されることを確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible(); //ツールチップが表示されることを確認
  await expect(tooltip).toContainText('You hovered over the text field'); //ツールチップのテキストを確認
});

test.skip('ツールチップ - リンクのツールチップ', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const contraryLink = page.locator('text=Contrary'); //Contraryリンクを取得

  // リンクにホバー
  await contraryLink.hover(); //リンクにマウスホバー

  // ツールチップが表示されることを確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible(); //ツールチップが表示されることを確認
  await expect(tooltip).toContainText('You hovered over the Contrary'); //ツールチップのテキストを確認
});

test.skip('ツールチップ - 数字リンクのツールチップ', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const numberLink = page.locator('text=1.10.32'); //数字リンクを取得

  // 数字リンクにホバー
  await numberLink.hover(); //数字リンクにマウスホバー

  // ツールチップが表示されることを確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible(); //ツールチップが表示されることを確認
  await expect(tooltip).toContainText('You hovered over the 1.10.32'); //ツールチップのテキストを確認
});

test.skip('ツールチップ - ホバー解除でツールチップ非表示', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得

  // ボタンにホバーしてツールチップを表示
  await hoverButton.hover(); //ボタンにマウスホバー
  await expect(tooltip).toBeVisible(); //ツールチップが表示されることを確認

  // 別の場所にマウスを移動してツールチップを非表示
  await page.locator('h1').hover(); //ページのタイトルにマウスを移動

  // ツールチップが非表示になることを確認
  await expect(tooltip).not.toBeVisible(); //ツールチップが非表示になることを確認
});

test.skip('ツールチップ - 複数要素の連続ホバー', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得
  const textField = page.locator('#toolTipTextField'); //テキストフィールドを取得
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得

  // 最初の要素にホバー
  await hoverButton.hover(); //ボタンにマウスホバー
  await expect(tooltip).toContainText('You hovered over the Button'); //ボタンのツールチップを確認

  // 短い待機時間を設けてから次の要素にホバー
  await page.waitForTimeout(500); //500ms待機

  // 2番目の要素にホバー
  await textField.hover(); //テキストフィールドにマウスホバー
  await expect(tooltip).toContainText('You hovered over the text field'); //テキストフィールドのツールチップを確認

  // ツールチップの内容が正しく切り替わったことを確認
  await expect(tooltip).not.toContainText('You hovered over the Button'); //前のツールチップテキストが残っていないことを確認
});

test.skip('ツールチップ - アクセシビリティ属性の確認', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得

  // aria属性の確認
  await expect(hoverButton).toHaveAttribute('aria-describedby'); //aria-describedby属性があることを確認

  // ボタンにホバーしてツールチップを表示
  await hoverButton.hover(); //ボタンにマウスホバー

  // ツールチップのrole属性を確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible(); //ツールチップが表示されることを確認
});
