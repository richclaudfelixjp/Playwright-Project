const { test, expect, request } = require('@playwright/test');
require('dotenv').config();

test('有効なAPIキーを使用しているAPIリクエスト', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/login', { //リクエスト先のエンドポイント
    headers: { //APIリクエストのヘッダー
      'x-api-key': `${process.env.API_KEY}`,　//APIキーを入力用のフィールド
      'Content-Type': 'application/json',　//APIリクエストのボディーはどんなデーターか入力されます
    },
    data: { //APIリクエストのボディー
      email: 'eve.holt@reqres.in', //ユーザーを入力用のフィールド
      password: 'cityslicka', //パスワードを入力用のフィールド
    },
  });

  expect(response.status()).toBe(200); //APIレスポンスのステータスが検証されます
  const body = await response.json(); //APIレスポンスのボディーが定義されます
  expect(body).toHaveProperty('token'); //APIレスポンスのボディーにこんなプロパティがあるかどうか確認されます
});

test('無効なAPIキーを使用しているAPIリクエスト', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/login', {　//リクエスト先のエンドポイント
    headers: {　//APIリクエストのヘッダー
      'x-api-key': '1111',　//APIキーを入力用のフィールド、意図的に違ったAPIキーが入力されます
      'Content-Type': 'application/json',　//APIリクエストのボディーはどんなデーターか入力されます
    },
    data: {　//APIリクエストのボディー
      email: 'eve.holt@reqres.in',　//ユーザーを入力用のフィールド
      password: 'cityslicka'　//パスワードを入力用のフィールド
    },
  });

  const body = await response.json();　//APIレスポンスのボディーが定義されます
  expect(response.status()).toBe(401);　//APIレスポンスのステータスが検証されます
  expect(body.error).toBe('Invalid API key.');　//APIレスポンスのボディー内のエラーメッセージがアサートされます
});