# Firebase Hosting セットアップ手順

管理ダッシュボードをFirebase Hostingにデプロイするための設定手順です。

## 1. Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

## 2. Firebaseにログイン

```bash
firebase login
```

## 3. Firebase Hostingサイトの追加

既存のFirebaseプロジェクト（line-bot-407102）に新しいホスティングサイトを追加します：

```bash
# プロジェクトディレクトリのルートで実行
firebase hosting:sites:create shop-pwa-demo-admin
```

## 4. ホスティングターゲットの設定

```bash
# 管理ダッシュボードディレクトリで実行
cd admin-dashboard
firebase target:apply hosting shop-pwa-demo-admin shop-pwa-demo-admin
```

## 5. ローカルでのビルドとテスト

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build

# ローカルでプレビュー
firebase serve --only hosting:shop-pwa-demo-admin
```

## 6. 手動デプロイ（初回テスト用）

```bash
firebase deploy --only hosting:shop-pwa-demo-admin
```

## デプロイURL

デプロイが成功すると、以下のURLでアクセスできます：
- https://shop-pwa-demo-admin.web.app
- https://shop-pwa-demo-admin.firebaseapp.com

## GitHub Actions経由の自動デプロイ

設定済みのGitHub Actionsワークフローにより：
- `main`ブランチへのプッシュ時に自動デプロイ
- プルリクエスト時にプレビューデプロイ

## PWA機能

管理ダッシュボードはPWAとして設定されているため：
- タブレットやPCでインストール可能
- オフライン対応（Service Worker）
- ホーム画面に追加可能

### インストール方法
1. Chrome/Edgeでサイトにアクセス
2. アドレスバーの右側にあるインストールアイコンをクリック
3. 「インストール」をクリック

## トラブルシューティング

### "Site not found"エラーが出る場合
1. Firebase ConsoleでHostingサイトが作成されているか確認
2. `.firebaserc`のターゲット設定を確認
3. `firebase target:apply`コマンドを再実行

### デプロイが失敗する場合
1. Firebase CLIが最新版か確認: `firebase --version`
2. 正しいプロジェクトが選択されているか確認: `firebase use`
3. ビルドが成功しているか確認: `npm run build`