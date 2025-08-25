const { test, expect } = require('@playwright/test');

test.skip('ウェブテーブル - レコードの追加', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables'); //ウェブテーブルページに移動

  // 追加ボタンをクリック
  await page.click('#addNewRecordButton'); //新規レコード追加ボタンをクリック

  // フォームに入力
  await page.fill('#firstName', '太郎'); //名前を入力
  await page.fill('#lastName', '田中'); //姓を入力
  await page.fill('#userEmail', 'tanaka@example.com'); //メールアドレスを入力
  await page.fill('#age', '30'); //年齢を入力
  await page.fill('#salary', '500000'); //給与を入力
  await page.fill('#department', 'IT'); //部署を入力

  // 送信ボタンをクリック
  await page.click('#submit'); //送信ボタンをクリック

  // テーブルに新しいレコードが追加されたことを確認
  const tableRows = page.locator('.rt-tbody .rt-tr-group'); //テーブル行を取得
  await expect(tableRows).toHaveCount(4); //4行あることを確認（元の3行 + 新規1行）

  // 新しく追加されたデータが表示されていることを確認
  await expect(page.locator('text=太郎')).toBeVisible(); //名前が表示されていることを確認
  await expect(page.locator('text=田中')).toBeVisible(); //姓が表示されていることを確認
  await expect(page.locator('text=tanaka@example.com')).toBeVisible(); //メールが表示されていることを確認
});

test.skip('ウェブテーブル - レコードの編集', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables'); //ウェブテーブルページに移動

  // 最初の行の編集ボタンをクリック
  await page.click('.rt-tbody .rt-tr-group:first-child [title="Edit"]'); //最初の行の編集ボタンをクリック

  // フォームの値をクリアして新しい値を入力
  await page.fill('#firstName', '花子'); //名前を花子に変更
  await page.fill('#lastName', '佐藤'); //姓を佐藤に変更
  await page.fill('#userEmail', 'hanako@example.com'); //メールアドレスを変更
  await page.fill('#age', '25'); //年齢を25に変更
  await page.fill('#salary', '400000'); //給与を400000に変更
  await page.fill('#department', 'Marketing'); //部署をMarketingに変更

  // 送信ボタンをクリック
  await page.click('#submit'); //送信ボタンをクリック

  // 編集された内容が反映されていることを確認
  await expect(page.locator('text=花子')).toBeVisible(); //変更された名前が表示されることを確認
  await expect(page.locator('text=佐藤')).toBeVisible(); //変更された姓が表示されることを確認
  await expect(page.locator('text=hanako@example.com')).toBeVisible(); //変更されたメールが表示されることを確認
  await expect(page.locator('text=25')).toBeVisible(); //変更された年齢が表示されることを確認
});

test.skip('ウェブテーブル - レコードの削除', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables'); //ウェブテーブルページに移動

  // 削除前のレコード数を確認
  const initialRows = page.locator('.rt-tbody .rt-tr-group'); //初期の行数を取得
  const initialCount = await initialRows.count(); //初期のレコード数をカウント

  // 最初の行の削除ボタンをクリック
  await page.click('.rt-tbody .rt-tr-group:first-child [title="Delete"]'); //最初の行の削除ボタンをクリック

  // レコードが削除されたことを確認
  const finalRows = page.locator('.rt-tbody .rt-tr-group'); //削除後の行数を取得
  await expect(finalRows).toHaveCount(initialCount - 1); //レコード数が1つ減ったことを確認
});

test.skip('ウェブテーブル - 検索機能', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables'); //ウェブテーブルページに移動

  // 検索ボックスに検索語を入力
  await page.fill('#searchBox', 'Cierra'); //Cierraで検索

  // 検索結果を確認
  const visibleRows = page.locator('.rt-tbody .rt-tr-group:has(.rt-td:not([style*="display: none"]))'); //表示されている行を取得
  await expect(visibleRows).toHaveCount(1); //1行だけ表示されることを確認
  await expect(page.locator('text=Cierra')).toBeVisible(); //Cierraが表示されていることを確認

  // 検索をクリア
  await page.fill('#searchBox', ''); //検索ボックスをクリア

  // 全ての行が再表示されることを確認
  const allRows = page.locator('.rt-tbody .rt-tr-group'); //全ての行を取得
  await expect(allRows).toHaveCount(3); //元の3行が表示されることを確認
});

test.skip('ウェブテーブル - ページネーション', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables'); //ウェブテーブルページに移動

  // 複数のレコードを追加してページネーションをテスト
  for (let i = 1; i <= 8; i++) {
    await page.click('#addNewRecordButton'); //新規レコード追加ボタンをクリック
    await page.fill('#firstName', `テスト${i}`); //名前を入力
    await page.fill('#lastName', `ユーザー${i}`); //姓を入力
    await page.fill('#userEmail', `test${i}@example.com`); //メールアドレスを入力
    await page.fill('#age', `${20 + i}`); //年齢を入力
    await page.fill('#salary', `${300000 + i * 10000}`); //給与を入力
    await page.fill('#department', 'Test'); //部署を入力
    await page.click('#submit'); //送信ボタンをクリック
  }

  // ページサイズを5に変更
  await page.selectOption('select[aria-label="rows per page"]', '5'); //ページサイズを5に変更

  // 最初のページに5レコードが表示されることを確認
  const firstPageRows = page.locator('.rt-tbody .rt-tr-group:has(.rt-td:not([style*="display: none"]))'); //表示されている行を取得
  await expect(firstPageRows).toHaveCount(5); //5行表示されることを確認

  // 次のページボタンをクリック
  await page.click('button:has-text("Next")'); //次のページボタンをクリック

  // 2ページ目にも5レコードが表示されることを確認
  await expect(firstPageRows).toHaveCount(5); //2ページ目にも5行表示されることを確認

  // 前のページボタンをクリック
  await page.click('button:has-text("Previous")'); //前のページボタンをクリック

  // 1ページ目に戻ることを確認
  await expect(firstPageRows).toHaveCount(5); //1ページ目に戻って5行表示されることを確認
});
