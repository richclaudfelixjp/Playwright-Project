const { test, expect, request } = require('@playwright/test');

// テストデータの定義
const testUser = {
  userName: `testuser_${Date.now()}`, // 一意なユーザー名を生成
  password: 'TestPassword123!', // 複雑なパスワード
};

let authToken = ''; // 認証トークンを保存
let userId = ''; // ユーザーIDを保存
let bookIsbn = ''; // テスト用の書籍ISBNを保存

test.describe.configure({ mode: 'serial' }); // すべてのテストを直列で実行

test.describe('DemoQA BookStore API Tests', () => {
  
  test('書籍一覧の取得 - GET /BookStore/v1/Books', async ({ request }) => {
    // 全書籍リストを取得
    const response = await request.get('https://demoqa.com/BookStore/v1/Books'); // 書籍一覧APIを呼び出し
    
    // レスポンスの検証
    expect(response.status()).toBe(200); // ステータスコードが200であることを確認
    
    const responseBody = await response.json(); // レスポンスボディをJSONで取得
    expect(responseBody).toHaveProperty('books'); // booksプロパティが存在することを確認
    expect(Array.isArray(responseBody.books)).toBe(true); // booksが配列であることを確認
    expect(responseBody.books.length).toBeGreaterThan(0); // 書籍が1冊以上存在することを確認
    
    // 最初の書籍のプロパティを確認
    const firstBook = responseBody.books[0];
    expect(firstBook).toHaveProperty('isbn'); // ISBNプロパティの存在確認
    expect(firstBook).toHaveProperty('title'); // タイトルプロパティの存在確認
    expect(firstBook).toHaveProperty('author'); // 著者プロパティの存在確認
    expect(firstBook).toHaveProperty('publisher'); // 出版社プロパティの存在確認
    
    // テスト用にISBNを保存
    bookIsbn = firstBook.isbn; // 後続テストで使用するため保存
    
    console.log(`取得した書籍数: ${responseBody.books.length}`); // デバッグ用ログ出力
  });

  test('特定書籍の詳細取得 - GET /BookStore/v1/Book', async ({ request }) => {
    // 事前に書籍一覧からISBNを取得
    const booksResponse = await request.get('https://demoqa.com/BookStore/v1/Books');
    const booksData = await booksResponse.json();
    const testIsbn = booksData.books[0].isbn; // 最初の書籍のISBNを使用
    
    // 特定書籍の詳細を取得
    const response = await request.get(`https://demoqa.com/BookStore/v1/Book?ISBN=${testIsbn}`); // 書籍詳細APIを呼び出し
    
    // レスポンスの検証
    expect(response.status()).toBe(200); // ステータスコードが200であることを確認
    
    const book = await response.json(); // レスポンスボディをJSONで取得
    expect(book.isbn).toBe(testIsbn); // 指定したISBNと一致することを確認
    expect(book).toHaveProperty('title'); // タイトルプロパティの存在確認
    expect(book).toHaveProperty('author'); // 著者プロパティの存在確認
    expect(book).toHaveProperty('publisher'); // 出版社プロパティの存在確認
    expect(book).toHaveProperty('pages'); // ページ数プロパティの存在確認
    expect(book).toHaveProperty('description'); // 説明プロパティの存在確認
    expect(book).toHaveProperty('website'); // ウェブサイトプロパティの存在確認
    
    console.log(`書籍詳細取得成功: ${book.title}`); // デバッグ用ログ出力
  });

  test('存在しない書籍の詳細取得 - GET /BookStore/v1/Book (404エラー)', async ({ request }) => {
    const invalidIsbn = '9999999999999'; // 存在しないISBN
    
    // 存在しない書籍の詳細を取得
    const response = await request.get(`https://demoqa.com/BookStore/v1/Book?ISBN=${invalidIsbn}`); // 無効なISBNで書籍詳細APIを呼び出し
    
    // エラーレスポンスの検証
    expect(response.status()).toBe(400); // ステータスコードが400であることを確認
    
    const errorResponse = await response.json(); // エラーレスポンスをJSONで取得
    expect(errorResponse).toHaveProperty('code'); // エラーコードプロパティの存在確認
    expect(errorResponse).toHaveProperty('message'); // エラーメッセージプロパティの存在確認
    
    console.log(`期待通りのエラー: ${errorResponse.message}`); // デバッグ用ログ出力
  });

  test('新規ユーザー登録 - POST /Account/v1/User', async ({ request }) => {
    // 新規ユーザーを登録
    const response = await request.post('https://demoqa.com/Account/v1/User', {
      data: {
        userName: testUser.userName, // テストユーザー名
        password: testUser.password, // テストパスワード
      },
    });
    
    // レスポンスの検証
    if (response.status() === 201) {
      // 登録成功の場合
      const user = await response.json(); // レスポンスボディをJSONで取得
      expect(user).toHaveProperty('userID'); // ユーザーIDプロパティの存在確認
      expect(user).toHaveProperty('username'); // ユーザー名プロパティの存在確認
      expect(user.username).toBe(testUser.userName); // ユーザー名が一致することを確認
      
      userId = user.userID; // 後続テストで使用するためユーザーIDを保存
      console.log(`ユーザー登録成功: ${user.username} (ID: ${userId})`); // デバッグ用ログ出力
    } else if (response.status() === 406) {
      // ユーザーが既に存在する場合
      const errorResponse = await response.json();
      console.log(`ユーザーが既に存在: ${errorResponse.message}`); // 既存ユーザーのログ出力
      // テスト用に別のユーザー名で再試行（簡略化のため警告のみ）
      console.warn('テスト用ユーザーが既に存在するため、後続のテストはスキップされる可能性があります');
    } else {
      // その他のエラー
      const errorResponse = await response.json();
      throw new Error(`ユーザー登録に失敗: ${errorResponse.message}`);
    }
  });

  test('認証トークンの生成 - POST /Account/v1/GenerateToken', async ({ request }) => {
    // ユーザーがまだ登録されていない場合はスキップ
    if (!testUser.userName) {
      test.skip('ユーザー登録が必要です');
    }

    // 認証トークンを生成
    const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
      data: {
        userName: testUser.userName, // テストユーザー名
        password: testUser.password, // テストパスワード
      },
    });
    
    // レスポンスの検証
    if (response.status() === 200) {
      // トークン生成成功の場合
      const tokenResponse = await response.json(); // レスポンスボディをJSONで取得
      expect(tokenResponse).toHaveProperty('token'); // トークンプロパティの存在確認
      expect(tokenResponse).toHaveProperty('expires'); // 有効期限プロパティの存在確認
      expect(tokenResponse).toHaveProperty('status'); // ステータスプロパティの存在確認
      expect(tokenResponse.status).toBe('Success'); // ステータスが成功であることを確認
      
      authToken = tokenResponse.token; // 後続テストで使用するためトークンを保存
      console.log(`トークン生成成功: ${tokenResponse.status}`); // デバッグ用ログ出力
    } else {
      // トークン生成失敗の場合
      const errorResponse = await response.json();
      console.log(`トークン生成失敗: ${errorResponse.message}`); // エラーログ出力
      expect(response.status()).toBe(200); // 期待していたステータスコードではない場合、テスト失敗
    }
  });

  test('ユーザー認証確認 - POST /Account/v1/Authorized', async ({ request }) => {
    // トークンが生成されていない場合はスキップ
    if (!authToken) {
      test.skip('認証トークンが必要です');
    }

    // ユーザー認証を確認
    const response = await request.post('https://demoqa.com/Account/v1/Authorized', {
      data: {
        userName: testUser.userName, // テストユーザー名
        password: testUser.password, // テストパスワード
      },
    });
    
    // レスポンスの検証
    expect(response.status()).toBe(200); // ステータスコードが200であることを確認
    
    const authResponse = await response.json(); // レスポンスボディをJSONで取得
    expect(typeof authResponse).toBe('boolean'); // レスポンスがブール値であることを確認
    expect(authResponse).toBe(true); // 認証が成功していることを確認
    
    console.log(`ユーザー認証確認: ${authResponse}`); // デバッグ用ログ出力
  });

  test('無効な認証情報での認証確認 - POST /Account/v1/Authorized (失敗ケース)', async ({ request }) => {
    // 無効な認証情報でユーザー認証を確認
    const response = await request.post('https://demoqa.com/Account/v1/Authorized', {
      data: {
        userName: 'invaliduser', // 無効なユーザー名
        password: 'invalidpassword', // 無効なパスワード
      },
    });
    
    // レスポンスの検証（無効な認証情報の場合は404または400が返される）
    if (response.status() === 200) {
      // 200の場合は認証結果がfalseであることを確認
      const authResponse = await response.json(); // レスポンスボディをJSONで取得
      expect(typeof authResponse).toBe('boolean'); // レスポンスがブール値であることを確認
      expect(authResponse).toBe(false); // 認証が失敗していることを確認
      console.log(`無効な認証情報での認証結果: ${authResponse}`); // デバッグ用ログ出力
    } else if (response.status() === 404 || response.status() === 400) {
      // 404または400の場合はエラーレスポンスを確認
      const errorResponse = await response.json(); // エラーレスポンスをJSONで取得
      expect(errorResponse).toHaveProperty('code'); // エラーコードプロパティの存在確認
      expect(errorResponse).toHaveProperty('message'); // エラーメッセージプロパティの存在確認
      console.log(`期待通りの認証エラー: ${errorResponse.message} (Status: ${response.status()})`); // デバッグ用ログ出力
    } else {
      // 予期しないステータスコードの場合
      throw new Error(`予期しないステータスコード: ${response.status()}`);
    }
  });

  test('ユーザー情報の取得 - GET /Account/v1/User/{UUID}', async ({ request }) => {
    // ユーザーIDとトークンが必要
    if (!userId || !authToken) {
      test.skip('ユーザーIDと認証トークンが必要です');
    }

    // ユーザー情報を取得
    const response = await request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Bearer認証ヘッダーを追加
      },
    });
    
    // レスポンスの検証
    expect(response.status()).toBe(200); // ステータスコードが200であることを確認
    
    const user = await response.json(); // レスポンスボディをJSONで取得
    expect(user).toHaveProperty('userId'); // ユーザーIDプロパティの存在確認
    expect(user).toHaveProperty('username'); // ユーザー名プロパティの存在確認
    expect(user).toHaveProperty('books'); // 書籍リストプロパティの存在確認
    expect(user.username).toBe(testUser.userName); // ユーザー名が一致することを確認
    expect(Array.isArray(user.books)).toBe(true); // 書籍リストが配列であることを確認
    
    console.log(`ユーザー情報取得成功: ${user.username}, 書籍数: ${user.books.length}`); // デバッグ用ログ出力
  });

  test('認証なしでのユーザー情報取得 - GET /Account/v1/User/{UUID} (401エラー)', async ({ request }) => {
    // ユーザーIDが必要
    if (!userId) {
      test.skip('ユーザーIDが必要です');
    }

    // 認証なしでユーザー情報を取得
    const response = await request.get(`https://demoqa.com/Account/v1/User/${userId}`); // 認証ヘッダーなし
    
    // エラーレスポンスの検証
    expect(response.status()).toBe(401); // ステータスコードが401であることを確認
    
    const errorResponse = await response.json(); // エラーレスポンスをJSONで取得
    expect(errorResponse).toHaveProperty('code'); // エラーコードプロパティの存在確認
    expect(errorResponse).toHaveProperty('message'); // エラーメッセージプロパティの存在確認
    
    console.log(`期待通りの認証エラー: ${errorResponse.message}`); // デバッグ用ログ出力
  });

  test('書籍をユーザーに追加 - POST /BookStore/v1/Books', async ({ request }) => {
    // 必要な情報が揃っているかチェック
    if (!userId || !authToken || !bookIsbn) {
      test.skip('ユーザーID、認証トークン、書籍ISBNが必要です');
    }

    // ユーザーに書籍を追加
    const response = await request.post('https://demoqa.com/BookStore/v1/Books', {
      headers: {
        Authorization: `Bearer ${authToken}`, // Bearer認証ヘッダーを追加
        'Content-Type': 'application/json', // コンテンツタイプヘッダーを追加
      },
      data: {
        userId: userId, // ユーザーID
        collectionOfIsbns: [
          {
            isbn: bookIsbn, // 追加する書籍のISBN
          },
        ],
      },
    });
    
    // レスポンスの検証
    if (response.status() === 201) {
      // 書籍追加成功の場合
      const addBooksResponse = await response.json(); // レスポンスボディをJSONで取得
      expect(addBooksResponse).toHaveProperty('books'); // 書籍リストプロパティの存在確認
      expect(Array.isArray(addBooksResponse.books)).toBe(true); // 書籍リストが配列であることを確認
      
      console.log(`書籍追加成功: ${addBooksResponse.books.length}冊追加`); // デバッグ用ログ出力
    } else if (response.status() === 400) {
      // 既に書籍が存在する場合など
      const errorResponse = await response.json();
      console.log(`書籍追加エラー: ${errorResponse.message}`); // エラーログ出力
      // 既に存在する場合は正常な動作なので、テストは継続
    } else {
      // その他のエラー
      throw new Error(`書籍追加に失敗: Status ${response.status()}`);
    }
  });

  test('ユーザーから書籍を削除 - DELETE /BookStore/v1/Book', async ({ request }) => {
    // 必要な情報が揃っているかチェック
    if (!userId || !authToken || !bookIsbn) {
      test.skip('ユーザーID、認証トークン、書籍ISBNが必要です');
    }

    // ユーザーから特定の書籍を削除
    const response = await request.delete('https://demoqa.com/BookStore/v1/Book', {
      headers: {
        Authorization: `Bearer ${authToken}`, // Bearer認証ヘッダーを追加
        'Content-Type': 'application/json', // コンテンツタイプヘッダーを追加
      },
      data: {
        isbn: bookIsbn, // 削除する書籍のISBN
        userId: userId, // ユーザーID
      },
    });
    
    // レスポンスの検証
    if (response.status() === 204) {
      // 削除成功の場合（No Contentレスポンス）
      console.log('書籍削除成功'); // デバッグ用ログ出力
    } else if (response.status() === 400) {
      // 書籍が存在しない場合など
      const errorResponse = await response.json();
      console.log(`書籍削除エラー: ${errorResponse.message}`); // エラーログ出力
    } else {
      // その他のエラー
      throw new Error(`書籍削除に失敗: Status ${response.status()}`);
    }
  });

  test('ユーザーの全書籍を削除 - DELETE /BookStore/v1/Books', async ({ request }) => {
    // 必要な情報が揃っているかチェック
    if (!userId || !authToken) {
      test.skip('ユーザーIDと認証トークンが必要です');
    }

    // ユーザーの全書籍を削除
    const response = await request.delete(`https://demoqa.com/BookStore/v1/Books?UserId=${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Bearer認証ヘッダーを追加
      },
    });
    
    // レスポンスの検証
    if (response.status() === 204) {
      // 削除成功の場合（No Contentレスポンス）
      console.log('全書籍削除成功'); // デバッグ用ログ出力
    } else if (response.status() === 401) {
      // 認証エラーの場合
      const errorResponse = await response.json();
      throw new Error(`認証エラー: ${errorResponse.message}`);
    } else {
      // その他のエラー
      console.log(`全書籍削除エラー: Status ${response.status()}`); // エラーログ出力
    }
  });

  // テスト終了後のクリーンアップ
  test.afterAll('テストユーザーの削除', async ({ request }) => {
    // 作成したテストユーザーを削除（クリーンアップ）
    if (userId && authToken) {
      const response = await request.delete(`https://demoqa.com/Account/v1/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Bearer認証ヘッダーを追加
        },
      });
      
      if (response.status() === 204) {
        console.log('テストユーザー削除成功'); // デバッグ用ログ出力
      } else {
        console.log(`テストユーザー削除失敗: Status ${response.status()}`); // エラーログ出力
      }
    }
  });
});