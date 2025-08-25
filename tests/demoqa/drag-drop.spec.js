const { test, expect } = require('@playwright/test');

test('ドラッグアンドドロップ - 基本操作', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable'); //ドロップ可能ページに移動

  const draggable = page.locator('#draggable'); //ドラッグ可能な要素を取得
  const droppable = page.locator('//div[@id="simpleDropContainer"]//div[@id="droppable"]'); //表示中のドロップターゲット要素のみ取得

  // 初期状態の確認
  await expect(droppable).toContainText('Drop here'); //初期テキストを確認
  await expect(droppable).not.toHaveClass(/ui-droppable-hover/); //初期状態でホバークラスがないことを確認

  // ドラッグアンドドロップ実行
  await draggable.dragTo(droppable); //要素をドラッグしてドロップ

  // ドロップ後の状態確認
  await expect(droppable).toContainText('Dropped!'); //ドロップ成功のテキストを確認
  await expect(droppable).toHaveClass('drop-box ui-droppable ui-state-highlight'); //ドロップ後のアクティブクラスを確認
});

test('ドラッグアンドドロップ - Accept タブ', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable'); //ドロップ可能ページに移動

  // Acceptタブに切り替え
  await page.click('#droppableExample-tab-accept'); //Acceptタブをクリック
  
  const acceptableElement = page.locator('#acceptable'); //受け入れ可能な要素を取得
  const notAcceptableElement = page.locator('#notAcceptable'); //受け入れ不可能な要素を取得
  const acceptDroppable = page.locator('//div[@id="acceptDropContainer"]//div[@id="droppable"]'); //表示中のドロップターゲット要素のみ取得

  // 受け入れ可能な要素でのドラッグアンドドロップ
  await acceptableElement.dragTo(acceptDroppable); //受け入れ可能な要素をドロップ
  await expect(acceptDroppable).toContainText('Dropped!'); //ドロップ成功を確認

  // ページをリロードして初期状態に戻す
  await page.reload(); //ページをリロード
  await page.click('#droppableExample-tab-accept'); //再度Acceptタブに切り替え

  // 受け入れ不可能な要素でのドラッグアンドドロップ
  await notAcceptableElement.dragTo(acceptDroppable); //受け入れ不可能な要素をドロップ
  await expect(acceptDroppable).toContainText('Drop here'); //初期テキストのままであることを確認
  await expect(acceptDroppable).not.toContainText('Dropped!'); //ドロップが受け入れられていないことを確認
});

test('ドラッグアンドドロップ - Prevent Propagation', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable'); //ドロップ可能ページに移動

  await page.click('#droppableExample-tab-preventPropogation'); //Prevent Propagationタブに切り替え
  
  const dragBox = page.locator('#dragBox'); //ドラッグボックスを取得
  const notGreedyDropBox = page.locator('#notGreedyDropBox'); //非貪欲ドロップボックスを取得
  const notGreedyInnerDropBox = page.locator('#notGreedyInnerDropBox'); //非貪欲内部ドロップボックスを取得
  const greedyDropBox = page.locator('#greedyDropBox'); //貪欲ドロップボックスを取得
  const greedyDropBoxInner = page.locator('#greedyDropBoxInner'); //貪欲内部ドロップボックスを取得

  // 非貪欲内部ドロップボックスにドロップ
  await dragBox.dragTo(notGreedyInnerDropBox); //非貪欲内部にドロップ
  await expect(notGreedyDropBox).toHaveText(/Dropped!/); //外側もテキスト変更を確認（イベント伝播）
  await expect(notGreedyInnerDropBox).toHaveText(/Dropped!/); //内部のテキスト変更を確認

  // ページをリロードして初期状態に戻す
  await page.reload(); //ページをリロード
  await page.click('#droppableExample-tab-preventPropogation'); //再度タブに切り替え

  // 貪欲内部ドロップボックスにドロップ
  await dragBox.dragTo(greedyDropBoxInner); //貪欲内部にドロップ
  await expect(greedyDropBox).toHaveText(/Outer droppable/); //外側はテキスト変更なし（イベント伝播なし）
  await expect(greedyDropBoxInner).toHaveText(/Dropped!/); //内部のテキスト変更を確認
});

test('ドラッグアンドドロップ - Revert Draggable', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable'); //ドロップ可能ページに移動

  // Revert Draggableタブに切り替え
  await page.click('#droppableExample-tab-revertable'); //Revert Draggableタブをクリック

  const revertableElement = page.locator('#revertable'); //復帰可能な要素を取得
  const nonRevertableElement = page.locator('#notRevertable'); //復帰不可能な要素を取得
  const revertDroppable = page.locator('//div[@id="revertableDropContainer"]//div[@id="droppable"]'); //復帰用ドロップエリアを取得

  // 復帰可能要素の初期位置を記録
  await expect(revertableElement).toBeVisible(); //要素が表示されることを確認
  const revertableInitialBox = await revertableElement.boundingBox(); //初期位置を取得
  if (!revertableInitialBox) throw new Error('復帰可能要素の初期位置取得に失敗');

  // 復帰可能要素でのドラッグアンドドロップ
  await revertableElement.dragTo(revertDroppable); //復帰可能要素をドロップ
  await expect(revertDroppable).toContainText('Dropped!'); //ドロップ成功を確認

  // アニメーション完了を待機して最終位置を確認
  await page.waitForTimeout(3000); //復帰アニメーション完了を待機
  const revertableFinalBox = await revertableElement.boundingBox(); //最終位置を取得
  if (!revertableFinalBox) throw new Error('復帰可能要素の最終位置取得に失敗');

  // 要素が初期位置に戻ったことを確認
  expect(Math.abs(revertableInitialBox.x - revertableFinalBox.x)).toBeLessThan(10); //X座標の復帰を確認
  expect(Math.abs(revertableInitialBox.y - revertableFinalBox.y)).toBeLessThan(10); //Y座標の復帰を確認

  // 復帰不可能要素の初期位置を記録
  await expect(nonRevertableElement).toBeVisible(); //要素が表示されることを確認
  const nonRevertableInitialBox = await nonRevertableElement.boundingBox(); //初期位置を取得
  if (!nonRevertableInitialBox) throw new Error('復帰不可能要素の初期位置取得に失敗');

  // 復帰不可能要素でのドラッグアンドドロップ
  await nonRevertableElement.dragTo(revertDroppable); //復帰不可能要素をドロップ
  await expect(revertDroppable).toContainText('Dropped!'); //ドロップ成功を確認

  // 待機後の位置を確認
  await page.waitForTimeout(3000); //待機（復帰しないことを確認するため）
  const nonRevertableFinalBox = await nonRevertableElement.boundingBox(); //最終位置を取得
  if (!nonRevertableFinalBox) throw new Error('復帰不可能要素の最終位置取得に失敗');

  // 要素が初期位置に戻らなかったことを確認
  const xDifference = Math.abs(nonRevertableInitialBox.x - nonRevertableFinalBox.x); //X座標の差を計算
  const yDifference = Math.abs(nonRevertableInitialBox.y - nonRevertableFinalBox.y); //Y座標の差を計算
  expect(xDifference).toBeGreaterThan(10); //X座標が移動していることを確認
  expect(yDifference).toBeGreaterThan(10); //Y座標が移動していることを確認
});