# Playwright QA自動化ポートフォリオ

PlaywrightとCI/CD連携を実装したエンドツーエンドUIおよびAPIテスト自動化ポートフォリオ

## 🧪 テスト対象

- **UIテスト**: [SauceDemo](https://www.saucedemo.com/)のEコマースフロー
- **APIテスト**: [ReqRes](https://reqres.in/api/)の認証フロー
- **高度なUI**: [DemoQA](https://demoqa.com/)の複雑な操作
- **ポートフォリオテスト**: [cloud.jp](https://cloudjp.netlify.app)の自動テスト

## 🔄 CI/CD連携

[cloud.jpポートフォリオサイト](https://github.com/richclaudfelixjp/cloud.jp)のCI/CDパイプラインと連携:

- **自動トリガー**: デプロイ時に自動テスト実行
- **ステータスレポート**: テスト結果をGitHubステータスチェックとして報告
- **デプロイゲート**: テスト失敗時に本番デプロイをブロック
- **成果物公開**: テストレポートをGitHubアーティファクトとして公開

## 🔧 技術スタック

- **フレームワーク**: Playwright
- **言語**: JavaScript
- **CI/CD**: GitHub Actions
- **レポーティング**: HTMLレポート、GitHubステータス連携

## 🚀 ローカルでのテスト実行

1. `.env.example`を`.env`にリネームしAPI_KEY=reqres-free-v1を追加
2. 依存関係をインストール:
   ```bash
   npm install
   ```
3. ターミナルで実行:
   ```bash
   npm run external
   npx playwright show-report
   ```