import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', //テストディレクトリを指定
  fullyParallel: true, //全てのテストを並列実行
  forbidOnly: !!process.env.CI, //CI環境では.only()テストを禁止
  retries: process.env.CI ? 2 : 0, //CI環境では失敗時に2回再試行、ローカルでは再試行なし
  workers: process.env.CI ? 1 : undefined, //CI環境では1つのワーカー、ローカルでは自動設定
  reporter: [['html', { open: 'never' }]], //HTMLレポートを生成（自動で開かない）
  use: {
    headless: true, //テストが失敗した場合、詳細を見えるためブラウザのUIを表示
    screenshot: 'only-on-failure', //テストが失敗した場合、スクリーンショットを取得
    video: 'retain-on-failure', //テストが失敗した場合、録画を行い
    trace: 'retain-on-failure', //テストが失敗した場合、痕跡を取材
    ignoreHTTPSErrors: true, //SSL証明書エラーを無視
    navigationTimeout: 60000, //ページナビゲーションのタイムアウトを60秒に延長
    actionTimeout: 30000, //アクションのタイムアウトを30秒に設定
  },

  projects: [
    {
      name: 'chromium', //Chromiumブラウザでテストを実行
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox', //Firefoxブラウザでテストを実行
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit', //WebKit（Safari）ブラウザでテストを実行
      use: { ...devices['Desktop Safari'] },
    }
  ],
});

