# Playwright QA自動化ポートフォリオ

こちらは、Playwrightを使用したエンドツーエンドのUIおよびAPIテストのポートフォリオです。

## 技術スタック
- Playwright
- JavaScript
- GitHub ActionsでのContinuous Integration
- HTMLレポート

## テスト範囲
- UIテストケース　(https://www.saucedemo.com/)
- API認証テストケース　(https://reqres.in/api/)
- 先進テストケース　(https://demoqa.com/)

## 実行方法
1. 「.env.example」ファイルの名前を「.env」に変更してください。

2. 「.env」ファイルに正しいAPIキーを入力してください。
API_KEY=reqres-free-v1

3. フォルダのディレクトリでこのコマンドを実行してください。
```bash
npm install
npx playwright test
npx playwright show-report