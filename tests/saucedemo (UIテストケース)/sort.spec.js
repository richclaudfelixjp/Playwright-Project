const { test, expect } = require('@playwright/test');

test('商品を価格の安い順に正しく並び替えできます', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'lohi'); //商品を価格の安い順が選択されています
  const prices = await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat(e.textContent.replace('$', '')))); //商品の価格を取得して、安い順に並んでいるか確認されています
  for (let i = 0; i < prices.length - 1; i++) { 
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]); // 価格が安い順に並んでいることを確認されています
  }
  console.log(prices); //デバッグ用に価格がコンソールに出力されています
});

test('商品を価格の高い順に正しく並び替えできます', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'hilo');　 //商品を価格の高い順が選択されています
  const prices = await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat(e.textContent.replace('$', ''))));　//商品の価格を取得して、高い順に並んでいるか確認されています
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);　//価格が高い順に並んでいることを確認されています
  }
  console.log(prices);　//デバッグ用に価格がコンソールに出力されています
});

test('商品をアルファベット順に正しく並び替えできます', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'az');　//商品をアルファベット順が選択されています
  const names = await page.$$eval('.inventory_item_name', els => els.map(e => e.textContent));　//商品の名前を取得して、アルファベット順に並んでいるか確認されています
  for (let i = 0; i < names.length - 1; i++) {
    expect(names[i].localeCompare(names[i + 1])).toBeLessThanOrEqual(0);　//名前がアルファベット順に並んでいることを確認されています
  }
  console.log(names);　//デバッグ用に名前がコンソールに出力されています
});

test('商品を逆アルファベット順に正しく並び替えできます', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.selectOption('.product_sort_container', 'za');　//商品を逆アルファベット順が選択されています
  const names = await page.$$eval('.inventory_item_name', els => els.map(e => e.textContent));　//商品の名前を取得して、逆アルファベット順に並んでいるか確認されています
  for (let i = 0; i < names.length - 1; i++) {
    expect(names[i].localeCompare(names[i + 1])).toBeGreaterThanOrEqual(0);　//名前が逆アルファベット順に並んでいることを確認されています
  }
  console.log(names);　//デバッグ用に名前がコンソールに出力されています
});