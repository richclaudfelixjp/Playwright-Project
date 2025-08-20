import { test, expect } from '@playwright/test';

test('ナビゲーションチェック', async ({ page }) => {
  const baseURL = process.env.BASE_URL || 'https://staging-cloudjp.netlify.app';
  console.log('Testing URL:', baseURL);
  
  // ウェブサイトに移動
  await page.goto(baseURL);
  
  // 自己紹介セクションへのナビゲーション
  await page.getByRole('link', { name: '自己紹介' }).click();
  await expect(page.getByRole('heading', { name: '自己紹介' })).toBeVisible(); // 自己紹介ページが表示されることを確認
  
  // 経歴セクションへのナビゲーション
  await page.getByRole('link', { name: '経歴' }).click();
  await expect(page.getByRole('heading', { name: '経歴' })).toBeVisible(); // 経歴ページが表示されることを確認
  
  // プロジェクトセクションへのナビゲーション
  await page.getByRole('link', { name: 'プロジェクト' }).click();
  await expect(page.getByRole('heading', { name: 'プロジェクト', exact: true })).toBeVisible(); // プロジェクトページが表示されることを確認
  
  // お問い合わせセクションへのナビゲーション
  await page.getByRole('link', { name: 'お問い合わせ' }).click();
  await expect(page.getByRole('heading', { name: 'お問い合わせ' })).toBeVisible(); // お問い合わせページが表示されることを確認
  
  // ホームページへ戻る
  await page.getByRole('link', { name: 'cloud.jp' }).click();
  await expect(page.getByRole('heading', { name: 'フェリックス・リッチクラウド' })).toBeVisible(); // ホームページに戻ったことを確認
});

test('言語設定', async ({ page }) => {
  const baseURL = process.env.BASE_URL || 'https://staging-cloudjp.netlify.app';
  console.log('Testing URL:', baseURL);
  
  // ウェブサイトに移動
  await page.goto(baseURL);
  
  // 日本語から英語への言語切り替え
  await page.getByRole('button', { name: '言語を選択' }).click(); // 言語選択ボタンをクリック
  await page.getByRole('link', { name: '🇺🇸 English' }).click(); // 英語を選択
  await expect(page.locator('h1')).toContainText('Richclaud Felix'); // 英語表示になったことを確認
  
  // 英語から日本語への言語切り替え
  await page.getByRole('button', { name: 'Select Language' }).click(); // 言語選択ボタンをクリック（英語表示）
  await page.getByRole('link', { name: '🇯🇵 日本語' }).click(); // 日本語を選択
  await expect(page.locator('h1')).toContainText('フェリックス・リッチクラウド'); // 日本語表示に戻ったことを確認
});