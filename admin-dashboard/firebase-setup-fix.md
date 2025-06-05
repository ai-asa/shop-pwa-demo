# Firebase Hosting サイト作成手順

デプロイエラー「Requested entity was not found」を解決するための手順です。

## エラーの原因
Firebase Hostingに`shop-pwa-demo-admin`というサイトが存在しないため、デプロイに失敗しています。

## 解決方法

### オプション1: Firebase CLIでサイトを作成（推奨）

1. Firebase CLIをインストール（まだの場合）:
```bash
npm install -g firebase-tools
```

2. Firebaseにログイン:
```bash
firebase login
```

3. 新しいホスティングサイトを作成:
```bash
firebase hosting:sites:create shop-pwa-demo-admin --project line-bot-407102
```

4. 作成が成功したら、再度GitHub Actionsを実行するか、手動デプロイを試す:
```bash
cd admin-dashboard
npm run deploy
```

### オプション2: Firebaseコンソールから作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト「LINE-BOT」を選択
3. 左メニューから「Hosting」を選択
4. 「別のサイトを追加」をクリック
5. サイトID: `shop-pwa-demo-admin`を入力
6. 「サイトを追加」をクリック

### オプション3: デフォルトサイトを使用（一時的な解決策）

既存のデフォルトサイトを使用する場合は、以下のファイルを修正します：

**admin-dashboard/.firebaserc**:
```json
{
  "projects": {
    "default": "line-bot-407102"
  },
  "targets": {
    "line-bot-407102": {
      "hosting": {
        "admin": [
          "line-bot-407102"
        ]
      }
    }
  }
}
```

**admin-dashboard/firebase.json**:
```json
{
  "hosting": {
    "target": "admin",
    // ... rest of config
  }
}
```

**GitHub Actionsファイルも修正が必要です**。

## 推奨される解決方法

オプション1のCLIでのサイト作成が最も簡単で確実です。これにより、顧客用PWAと管理ダッシュボードが別々のURLでホストされます：

- 顧客用PWA: https://shop-pwa-demo-customer.web.app
- 管理ダッシュボード: https://shop-pwa-demo-admin.web.app