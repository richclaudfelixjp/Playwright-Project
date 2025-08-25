const { test, expect } = require('@playwright/test');
const path = require('path');

test.skip('ファイルアップロード - 単一ファイル', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download'); //アップロードダウンロードページに移動

  // テスト用のファイルパスを設定
  const testFilePath = path.join(__dirname, '..', '..', 'package.json'); //プロジェクトのpackage.jsonを使用

  // ファイル選択
  await page.setInputFiles('#uploadFile', testFilePath); //ファイルをアップロード

  // アップロードされたファイル名が表示されることを確認
  const uploadedPath = await page.textContent('#uploadedFilePath'); //アップロードされたファイルパスを取得
  expect(uploadedPath).toContain('package.json'); //ファイル名が含まれていることを確認
});

test.skip('ファイルアップロード - 複数ファイルの処理', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download'); //アップロードダウンロードページに移動

  // 複数のテストファイルパスを設定
  const testFiles = [
    path.join(__dirname, '..', '..', 'package.json'), //package.jsonファイル
    path.join(__dirname, '..', '..', 'playwright.config.js') //playwright設定ファイル
  ];

  // 最初のファイルをアップロード
  await page.setInputFiles('#uploadFile', testFiles[0]); //最初のファイルをアップロード
  let uploadedPath = await page.textContent('#uploadedFilePath'); //アップロードされたファイルパスを取得
  expect(uploadedPath).toContain('package.json'); //最初のファイル名を確認

  // 二番目のファイルをアップロード
  await page.setInputFiles('#uploadFile', testFiles[1]); //二番目のファイルをアップロード
  uploadedPath = await page.textContent('#uploadedFilePath'); //再度ファイルパスを取得
  expect(uploadedPath).toContain('playwright.config.js'); //二番目のファイル名を確認
});

test.skip('ファイルアップロード - ファイル選択のクリア', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download'); //アップロードダウンロードページに移動

  const testFilePath = path.join(__dirname, '..', '..', 'package.json'); //テストファイルパスを設定

  // ファイルをアップロード
  await page.setInputFiles('#uploadFile', testFilePath); //ファイルをアップロード
  let uploadedPath = await page.textContent('#uploadedFilePath'); //アップロードされたファイルパスを取得
  expect(uploadedPath).toContain('package.json'); //ファイル名が表示されていることを確認

  // ファイル選択をクリア
  await page.setInputFiles('#uploadFile', []); //ファイル選択をクリア

  // ファイルパスが空になることを確認
  uploadedPath = await page.textContent('#uploadedFilePath'); //ファイルパスを再取得
  expect(uploadedPath).toBe(''); //ファイルパスが空であることを確認
});

test.skip('ダウンロード機能の確認', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download'); //アップロードダウンロードページに移動

  // ダウンロード処理を監視
  const downloadPromise = page.waitForEvent('download'); //ダウンロードイベントを待機
  
  // ダウンロードボタンをクリック
  await page.click('#downloadButton'); //ダウンロードボタンをクリック
  
  // ダウンロードが開始されることを確認
  const download = await downloadPromise; //ダウンロードオブジェクトを取得
  
  // ダウンロードされたファイル名を確認
  expect(download.suggestedFilename()).toBe('sampleFile.jpeg'); //期待されるファイル名を確認
  
  // ダウンロードファイルを保存
  const downloadPath = path.join(__dirname, '..', '..', 'test-results', download.suggestedFilename()); //保存パスを設定
  await download.saveAs(downloadPath); //ファイルを保存
});
