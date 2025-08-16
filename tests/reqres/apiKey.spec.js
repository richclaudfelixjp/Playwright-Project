const { test, expect, request } = require('@playwright/test');
require('dotenv').config();

test('APIキーは有効', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/login', { //リクエスト先のエンドポイント
    headers: { //APIリクエストのヘッダー
      'x-api-key': `${process.env.API_KEY}`,　//APIキーを入力用のフィールド
      'Content-Type': 'application/json',　//APIリクエストのボディーはどんなデーターかを入力
    },
    data: { //APIリクエストのボディー
      email: 'eve.holt@reqres.in', //ユーザーを入力用のフィールド
      password: 'cityslicka', //パスワードを入力用のフィールド
    },
  });

  expect(response.status()).toBe(200); //APIレスポンスのステータスを検証
  const body = await response.json(); //APIレスポンスのボディーを定義
  expect(body).toHaveProperty('token'); //APIレスポンスのボディーにこんなプロパティがあるかどうかを確認
});

test('APIキーは無効', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/login', {　//リクエスト先のエンドポイント
    headers: {　//APIリクエストのヘッダー
      'x-api-key': '1111',　//APIキーを入力用のフィールド、意図的に違ったAPIキーを入力
      'Content-Type': 'application/json',　//APIリクエストのボディーはどんなデーターかを入力
    },
    data: {　//APIリクエストのボディー
      email: 'eve.holt@reqres.in',　//ユーザーを入力用のフィールド
      password: 'cityslicka'　//パスワードを入力用のフィールド
    },
  });

  const body = await response.json();　//APIレスポンスのボディーを定義
  expect(response.status()).toBe(403);　//APIレスポンスのステータスを検証
  expect(body.error).toBe('Invalid or inactive API key');　//APIレスポンスのボディー内のエラーメッセージをアサート
});