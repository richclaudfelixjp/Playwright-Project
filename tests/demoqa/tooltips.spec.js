const { test, expect } = require('@playwright/test');

test('ツールチップ - ホバーでツールチップ表示', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得

  // 要素が完全に読み込まれるまで待機
  await expect(hoverButton).toBeVisible(); //ボタンが表示されることを確認

  // ボタンにホバー
  await hoverButton.hover(); //ボタンにマウスホバー

  // ツールチップが表示されることを確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが表示されることを確認（タイムアウト延長）
  await expect(tooltip).toContainText('You hovered over the Button', { timeout: 3000 }); //ツールチップのテキストを確認
});

test('ツールチップ - テキストフィールドのツールチップ', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const textField = page.locator('#toolTipTextField'); //テキストフィールドを取得

  // 要素が完全に読み込まれるまで待機
  await expect(textField).toBeVisible(); //テキストフィールドが表示されることを確認

  // テキストフィールドにホバー
  await textField.hover(); //テキストフィールドにマウスホバー

  // ツールチップが表示されることを確認（ポーリングで待機）
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが表示されることを確認（タイムアウト延長）
  
  // ツールチップのテキスト内容を確認
  await expect(tooltip).toContainText('You hovered over the text field', { timeout: 3000 }); //ツールチップのテキストを確認
});

test('ツールチップ - リンクのツールチップ', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const contraryLink = page.locator('text=Contrary'); //Contraryリンクを取得

  // 要素が完全に読み込まれるまで待機
  await expect(contraryLink).toBeVisible(); //リンクが表示されることを確認

  // リンクにホバー
  await contraryLink.hover(); //リンクにマウスホバー

  // ツールチップが表示されることを確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが表示されることを確認（タイムアウト延長）
  await expect(tooltip).toContainText('You hovered over the Contrary', { timeout: 3000 }); //ツールチップのテキストを確認
});

test('ツールチップ - 数字リンクのツールチップ', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const numberLink = page.locator('text=1.10.32'); //数字リンクを取得

  // 要素が完全に読み込まれるまで待機
  await expect(numberLink).toBeVisible(); //数字リンクが表示されることを確認

  // 数字リンクにホバー
  await numberLink.hover(); //数字リンクにマウスホバー

  // ツールチップが表示されることを確認
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが表示されることを確認（タイムアウト延長）
  await expect(tooltip).toContainText('You hovered over the 1.10.32', { timeout: 3000 }); //ツールチップのテキストを確認
});

test('ツールチップ - ホバー解除でツールチップ非表示', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得

  // 要素が完全に読み込まれるまで待機
  await expect(hoverButton).toBeVisible(); //ボタンが表示されることを確認

  // ボタンにホバーしてツールチップを表示
  await hoverButton.hover(); //ボタンにマウスホバー
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが表示されることを確認

  // 別の場所にマウスを移動してツールチップを非表示
  await page.locator('h1').hover(); //ページのタイトルにマウスを移動

  // ツールチップが非表示になることを確認（タイムアウト延長）
  await expect(tooltip).not.toBeVisible({ timeout: 5000 }); //ツールチップが非表示になることを確認
});

test('ツールチップ - 複数要素の連続ホバー', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得
  const textField = page.locator('#toolTipTextField'); //テキストフィールドを取得
  const tooltip = page.locator('.tooltip-inner'); //共通のツールチップ要素を使用

  // 要素が完全に読み込まれるまで待機
  await expect(hoverButton).toBeVisible(); //ボタンが表示されることを確認
  await expect(textField).toBeVisible(); //テキストフィールドが表示されることを確認

  // 最初の要素にホバー
  await hoverButton.hover(); //ボタンにマウスホバー
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが表示されることを確認
  await expect(tooltip).toContainText('You hovered over the Button', { timeout: 3000 }); //ボタンのツールチップを確認

  // ツールチップをクリアするため別の場所にホバー
  await page.locator('h1').hover(); //ページタイトルにマウスを移動してツールチップをクリア
  await expect(tooltip).not.toBeVisible({ timeout: 3000 }); //ツールチップが非表示になることを確認

  // 少し待機してから2番目の要素にホバー
  await page.waitForTimeout(500); //500ms待機

  // 2番目の要素にホバー
  await textField.hover(); //テキストフィールドにマウスホバー
  
  // 新しいツールチップが表示されることを確認
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが再表示されることを確認
  await expect(tooltip).toContainText('You hovered over the text field', { timeout: 5000 }); //テキストフィールドのツールチップを確認
});

test('ツールチップ - アクセシビリティ属性の確認', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips'); //ツールチップページに移動

  const hoverButton = page.locator('#toolTipButton'); //ホバーボタンを取得
  const tooltip = page.locator('.tooltip-inner'); //ツールチップ要素を取得

  // 要素が完全に読み込まれるまで待機
  await expect(hoverButton).toBeVisible(); //ボタンが表示されることを確認

  // ボタンにホバーしてツールチップを表示
  await hoverButton.hover(); //ボタンにマウスホバー

  // ツールチップが表示されることを確認
  await expect(tooltip).toBeVisible({ timeout: 5000 }); //ツールチップが表示されることを確認

  // aria属性の確認（ツールチップ表示後に確認）
  await expect(hoverButton).toHaveAttribute('aria-describedby'); //aria-describedby属性があることを確認
});