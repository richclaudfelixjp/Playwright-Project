const { test, expect } = require('@playwright/test');

test('アラート - シンプルアラート', async ({ page }) => {
  await page.goto('https://demoqa.com/alerts'); //アラートページに移動

  // アラートイベントリスナーを設定
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('alert'); //アラートタイプであることを確認
    expect(dialog.message()).toBe('You clicked a button'); //アラートメッセージを確認
    await dialog.accept(); //アラートを受け入れ
  });

  // アラートボタンをクリック
  await page.click('#alertButton'); //アラートボタンをクリック
});

test('アラート - 遅延アラート', async ({ page }) => {
  await page.goto('https://demoqa.com/alerts'); //アラートページに移動

  // アラートイベントリスナーを設定
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('alert'); //アラートタイプであることを確認
    expect(dialog.message()).toBe('This alert appeared after 5 seconds'); //遅延アラートメッセージを確認
    await dialog.accept(); //アラートを受け入れ
  });

  // 遅延アラートボタンをクリック
  await page.click('#timerAlertButton'); //遅延アラートボタンをクリック

  // 5秒以内にアラートが表示されることを待機
  await page.waitForEvent('dialog', { timeout: 6000 }); //6秒のタイムアウトでアラートを待機
});

test('アラート - 確認アラート（OK）', async ({ page }) => {
  await page.goto('https://demoqa.com/alerts'); //アラートページに移動

  // 確認アラートイベントリスナーを設定
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm'); //確認ダイアログタイプであることを確認
    expect(dialog.message()).toBe('Do you confirm action?'); //確認メッセージを確認
    await dialog.accept(); //OKを選択
  });

  // 確認アラートボタンをクリック
  await page.click('#confirmButton'); //確認アラートボタンをクリック

  // 結果メッセージを確認
  await expect(page.locator('#confirmResult')).toContainText('You selected Ok'); //OK選択の結果メッセージを確認
});

test('アラート - 確認アラート（Cancel）', async ({ page }) => {
  await page.goto('https://demoqa.com/alerts'); //アラートページに移動

  // 確認アラートイベントリスナーを設定
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm'); //確認ダイアログタイプであることを確認
    expect(dialog.message()).toBe('Do you confirm action?'); //確認メッセージを確認
    await dialog.dismiss(); //Cancelを選択
  });

  // 確認アラートボタンをクリック
  await page.click('#confirmButton'); //確認アラートボタンをクリック

  // 結果メッセージを確認
  await expect(page.locator('#confirmResult')).toContainText('You selected Cancel'); //Cancel選択の結果メッセージを確認
});

test('アラート - プロンプトアラート', async ({ page }) => {
  await page.goto('https://demoqa.com/alerts'); //アラートページに移動

  const testName = 'テスト太郎'; //入力するテスト名

  // プロンプトアラートイベントリスナーを設定
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('prompt'); //プロンプトダイアログタイプであることを確認
    expect(dialog.message()).toBe('Please enter your name'); //プロンプトメッセージを確認
    await dialog.accept(testName); //名前を入力してOKを選択
  });

  // プロンプトアラートボタンをクリック
  await page.click('#promtButton'); //プロンプトアラートボタンをクリック

  // 結果メッセージを確認
  await expect(page.locator('#promptResult')).toContainText(`You entered ${testName}`); //入力した名前が結果に表示されることを確認
});

test('アラート - プロンプトアラートキャンセル', async ({ page }) => {
  await page.goto('https://demoqa.com/alerts'); //アラートページに移動

  // プロンプトアラートイベントリスナーを設定
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('prompt'); //プロンプトダイアログタイプであることを確認
    expect(dialog.message()).toBe('Please enter your name'); //プロンプトメッセージを確認
    await dialog.dismiss(); //キャンセルを選択
  });

  // プロンプトアラートボタンをクリック
  await page.click('#promtButton'); //プロンプトアラートボタンをクリック

  // キャンセル時の結果は特に表示されないことを確認
  const promptResult = page.locator('#promptResult'); //結果要素を取得
  await expect(promptResult).toBeHidden(); //結果が非表示であることを確認
});

test('アラート - 複数アラートの連続処理', async ({ page }) => {
  await page.goto('https://demoqa.com/alerts'); //アラートページに移動

  let alertCount = 0; //アラートカウンター

  // アラートイベントリスナーを設定
  page.on('dialog', async dialog => {
    alertCount++; //アラートカウントを増加
    if (alertCount === 1) {
      expect(dialog.message()).toBe('You clicked a button'); //最初のアラートメッセージを確認
      await dialog.accept(); //アラートを受け入れ
    } else if (alertCount === 2) {
      expect(dialog.message()).toBe('Do you confirm action?'); //2番目の確認メッセージを確認
      await dialog.accept(); //確認を受け入れ
    }
  });

  // 複数のアラートを順次実行
  await page.click('#alertButton'); //最初のアラートボタンをクリック
  await page.click('#confirmButton'); //確認アラートボタンをクリック

  // 結果を確認
  await expect(page.locator('#confirmResult')).toContainText('You selected Ok'); //確認結果を確認
  expect(alertCount).toBe(2); //2つのアラートが処理されたことを確認
});
