const { test, expect } = require('@playwright/test');

test('商品を価格の安い順に正しく並び替えを確認', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'lohi'); //商品を価格の安い順を選択
  const prices = await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat(e.textContent.replace('$', '')))); //商品の価格を取得して、安い順に並んでいるかを確認
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]); // 価格が安い順に並んでいることを確認
  }
  console.log(prices); //デバッグ用に価格はコンソールに出力
});

test('商品を価格の高い順に正しく並び替えを確認', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'hilo');　 //商品を価格の高い順を選択
  const prices = await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat(e.textContent.replace('$', ''))));　//商品の価格を取得して、高い順に並んでいるかを確認
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);　//価格が高い順に並んでいることを確認
  }
  console.log(prices);　//デバッグ用に価格はコンソールに出力
});

test('商品をアルファベット順に正しく並び替えを確認', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'az');　//商品をアルファベット順を選択
  const names = await page.$$eval('.inventory_item_name', els => els.map(e => e.textContent));　//商品の名前を取得して、アルファベット順に並んでいるかを確認
  for (let i = 0; i < names.length - 1; i++) {
    expect(names[i].localeCompare(names[i + 1])).toBeLessThanOrEqual(0);　//名前がアルファベット順に並んでいることを確認
  }
  console.log(names);　//デバッグ用に名前はコンソールに出力
});

test('商品を逆アルファベット順に正しく並び替えを確認', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'za');　//商品を逆アルファベット順を選択
  const names = await page.$$eval('.inventory_item_name', els => els.map(e => e.textContent));　//商品の名前を取得して、逆アルファベット順に並んでいるかを確認
  for (let i = 0; i < names.length - 1; i++) {
    expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);　//名前が逆アルファベット順に並んでいることを確認
  }
  console.log(names);　//デバッグ用に名前はコンソールに出力
});