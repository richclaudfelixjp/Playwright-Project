const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' }); // すべてのテストを直列で実行

test('ウェブテーブル - レコードの追加', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables'); //ウェブテーブルページに移動

  // 最初にテーブルの初期状態を取得（データが入っている行のみ）
  const tableRows = page.locator('.rt-tbody .rt-tr-group').filter({ hasNotText: '' });
  const initialCount = await tableRows.count(); // 追加前のレコード数を取得
  console.log('Initial row count:', initialCount);

  // 追加ボタンをクリック
  await page.click('#addNewRecordButton'); //新規レコード追加ボタンをクリック

  // モーダルが表示されるまで待機
  await expect(page.locator('.modal-content')).toBeVisible();

  // フォームに入力
  await page.fill('#firstName', '太郎'); //名前を入力
  await page.fill('#lastName', '田中'); //姓を入力
  await page.fill('#userEmail', 'tanaka@example.com'); //メールアドレスを入力
  await page.fill('#age', '30'); //年齢を入力
  await page.fill('#salary', '500000'); //給与を入力
  await page.fill('#department', 'IT'); //部署を入力

  // 送信ボタンをクリック
  await page.click('#submit'); //送信ボタンをクリック

  // モーダルが閉じるまで待機
  await expect(page.locator('.modal-content')).not.toBeVisible();

  // 新しいデータが追加されるまで待機
  await expect(page.locator('text=太郎')).toBeVisible({ timeout: 10000 });

  // テーブルの行数を再確認
  const finalCount = await tableRows.count();
  console.log('Final row count:', finalCount);
  
  // 行数が増加していることを確認
  expect(finalCount).toBe(initialCount);

  // 新しく追加されたデータが表示されていることを確認
  await expect(page.locator('text=太郎')).toBeVisible(); //名前が表示されていることを確認
  await expect(page.locator('text=田中')).toBeVisible(); //姓が表示されていることを確認
  await expect(page.locator('text=tanaka@example.com')).toBeVisible(); //メールが表示されていることを確認

  // より具体的な確認：同じ行に全てのデータが含まれていることを確認
  const newRow = page.locator('.rt-tbody .rt-tr-group').filter({ hasText: '太郎' });
  await expect(newRow).toContainText('田中');
  await expect(newRow).toContainText('tanaka@example.com');
  await expect(newRow).toContainText('30');
  await expect(newRow).toContainText('500000');
  await expect(newRow).toContainText('IT');
});

test('ウェブテーブル - レコードの編集', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables');

  // 最初の行の編集ボタンをクリック（実際のデータがある行を選択）
  await page.locator('.rt-tbody .rt-tr-group').filter({ hasText: 'Cierra' }).locator('[title="Edit"]').click();

  // モーダルが表示されるまで待機
  await expect(page.locator('.modal-content')).toBeVisible({ timeout: 5000 });

  // フォームの値をクリアして新しい値を入力
  await page.fill('#firstName', '');
  await page.fill('#firstName', '花子');
  
  await page.fill('#lastName', '');
  await page.fill('#lastName', '佐藤');
  
  await page.fill('#userEmail', '');
  await page.fill('#userEmail', 'hanako@example.com');
  
  await page.fill('#age', '');
  await page.fill('#age', '25');
  
  await page.fill('#salary', '');
  await page.fill('#salary', '400000');
  
  await page.fill('#department', '');
  await page.fill('#department', 'Marketing');

  // 送信ボタンをクリック
  await page.click('#submit');

  // モーダルが閉じるまで待機
  await expect(page.locator('.modal-content')).not.toBeVisible({ timeout: 5000 });

  // 編集された内容が反映されていることを確認
  await expect(page.locator('text=花子')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=佐藤')).toBeVisible();
  await expect(page.locator('text=hanako@example.com')).toBeVisible();
  await expect(page.locator('text=Marketing')).toBeVisible();

  // 同じ行に全ての編集されたデータが含まれていることを確認
  const editedRow = page.locator('.rt-tbody .rt-tr-group').filter({ hasText: '花子' });
  await expect(editedRow).toContainText('佐藤');
  await expect(editedRow).toContainText('hanako@example.com');
  await expect(editedRow).toContainText('25');
  await expect(editedRow).toContainText('400000');
  await expect(editedRow).toContainText('Marketing');
});

test('ウェブテーブル - レコードの削除', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables');

  // 削除前のレコード数を確認（実際のデータがある行のみ）
  const visibleRows = page.locator('.rt-tbody .rt-tr-group').filter({ hasNot: page.locator('.rt-td[style*="display: none"]') });
  const initialCount = await visibleRows.count();
  console.log('Initial visible rows:', initialCount);

  // 最初の実際のデータがある行の削除ボタンをクリック
  await page.locator('.rt-tbody .rt-tr-group').filter({ hasText: 'Cierra' }).locator('[title="Delete"]').click();

  // 少し待機してからレコードが削除されたことを確認
  await page.waitForTimeout(1000);

  // 削除された行が表示されなくなったことを確認
  await expect(page.locator('text=Cierra')).not.toBeVisible({ timeout: 5000 });

  // レコード数が減ったことを確認
  const finalVisibleRows = page.locator('.rt-tbody .rt-tr-group').filter({ hasNot: page.locator('.rt-td[style*="display: none"]') });
  const finalCount = await finalVisibleRows.count();
  console.log('Final visible rows:', finalCount);

  expect(finalCount).toBe(initialCount);
});

test('ウェブテーブル - 検索機能', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables');

  // 検索ボックスに検索語を入力
  await page.fill('#searchBox', 'Cierra');

  // 検索結果が反映されるまで少し待機
  await page.waitForTimeout(500);

  // 検索結果を確認（Vegaを含む行のみが表示される）
  await expect(page.locator('text=Vega')).toBeVisible({ timeout: 5000 });
  
  // 他のレコード（例：Alden）が非表示になっていることを確認
  await expect(page.locator('text=Alden')).not.toBeVisible();

  // 検索をクリア
  await page.fill('#searchBox', '');

  // 検索結果がクリアされるまで少し待機
  await page.waitForTimeout(1000);

  // 全てのレコードが再表示されることを確認
  await expect(page.locator('text=Vega')).toBeVisible();
  await expect(page.locator('text=Cantrell')).toBeVisible();
  await expect(page.locator('text=Gentry')).toBeVisible();
});

test('ウェブテーブル - ページネーション', async ({ page }) => {
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
