# PWA設計書 - とあるカフェ デモアプリ

## 目次
1. [概要](#1-概要)
2. [技術スタック](#2-技術スタック)
3. [プロジェクト構成](#3-プロジェクト構成)
4. [PWA固有要素](#4-pwa固有要素)
   - 4.1 [Web App Manifest](#41-web-app-manifest)
   - 4.2 [Service Worker](#42-service-worker)
   - 4.3 [HTTPS・セキュアコンテキスト](#43-https・セキュアコンテキスト)
   - 4.4 [インストール誘導](#44-インストール誘導)
5. [開発手順](#5-開発手順)
6. [バックエンド構成](#6-バックエンド構成)
7. [カフェ向け機能](#7-カフェ向け機能)
8. [テスト・品質保証](#8-テスト・品質保証)
9. [CI/CD・ホスティング](#9-cicd・ホスティング)
10. [参考資料](#10-参考資料)

---

## 1. 概要
とあるカフェのデモアプリをPWAとして構築するための設計書です。
本プロジェクトは営業デモ用として、顧客用PWAと店舗管理ダッシュボードをセットで提供します。
バックエンドとの実通信は行わず、すべてMock実装でフロントエンドの機能を実現します。

## 2. 技術スタック
- フロントエンド
  - React + TypeScript
  - Vite（ビルド／開発サーバ）
  - React Router（ルーティング）
  - ESLint + Prettier
  - Tailwind CSS
  - UIコンポーネント（顧客要望に応じて選択）
    - Chakra UI：カジュアル・ポップなデザイン
    - shadcn/ui：カスタマイズ性重視
    - Mantine：豊富なコンポーネント
    ※すべてMIT Licenseで商用利用可能
- バックエンド
  - TypeScript (Hono)
  - Cloudflare Workers（エッジ環境）
  - CORS 設定
- PWA 関連
  - @vite-pwa/plugin（Vite用プラグイン）
  - Workbox（Service Worker ヘルパー）
- データストレージ
  - IndexedDB（Dexie.js）- オフラインデータ
  - localStorage - 設定値保存
  - Cloudflare KV - セッション管理・APIキャッシュ
  - Firebase Storage - 画像・メディアファイル

## 3. プロジェクト構成
```
shop-pwa-demo/
├── customer-app/        # 顧客用PWA
├── admin-dashboard/     # 店舗管理ダッシュボード  
└── shared/             # 共有コンポーネント・Mock データ
```

## 4. PWA固有要素
### 4.1 Web App Manifest
`public/manifest.json` を作成し、以下を定義:
```json
{
  "name": "とあるカフェ",
  "short_name": "カフェ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#a67c52",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 4.2 Service Worker
- キャッシュ戦略（プリキャッシュ、ランタイムキャッシュ）を設定
- オフラインフォールバックページの提供
- Workbox の場合は `workbox-build` またはプラグイン設定で自動生成

### 4.3 HTTPS・セキュアコンテキスト
- 開発は `localhost` で OK
- 本番環境は HTTPS 配下で配信

### 4.4 インストール誘導
```tsx
// src/main.tsx または index.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    // 後でプロンプトを表示するために保存
    const promptEvent = e;
    // UI ボタン等でトリガー
    someButton.addEventListener('click', () => {
      promptEvent.prompt();
    });
  });
}
```

## 5. 開発手順

### 5.1 デモ版開発（Mock実装）
1. プロジェクト生成
   ```bash
   npm create vite@latest customer-app --template react-ts
   npm create vite@latest admin-dashboard --template react-ts
   ```
2. PWAプラグイン導入（顧客用アプリのみ）
   ```bash
   npm install --save-dev @vite-pwa/plugin
   ```
3. Mock API実装
   - LocalStorageベースのデータ永続化
   - 遅延付きのMockレスポンス
   - Context APIでの状態管理
4. UI実装（Mockデータ使用）
5. PWA機能実装
6. デモ環境へのデプロイ

### 5.2 本番版開発（実API連携）
1. バックエンドAPI実装（Cloudflare Workers）
2. Mock APIを実APIに置き換え
3. 認証・セキュリティ実装
4. 本番環境デプロイ

## 6. バックエンド構成
- API：REST（Hono on Cloudflare Workers）
- 認証：JWT / OAuth2
- データベース：Cloudflare D1（SQLite互換）
- KVストレージ：Cloudflare KV（セッション管理・APIキャッシュ）
- CORS 設定
- エッジ環境での高速レスポンス（50ms以下）

## 7. カフェ向け機能
### 基本機能
- メニュー表示（カテゴリ別、アレルギー情報付き）
- モバイルオーダー（店内・テイクアウト選択）
- デジタルポイントカード
- プッシュ通知（新商品、クーポン配信）

### 差別化機能
- 待ち時間表示（注文状況のリアルタイム更新）
- お気に入り機能（よく頼むメニューの保存）
- カスタマイズ注文（サイズ、甘さ、トッピング選択）
- 混雑状況表示（店内の空席状況）
- 事前決済（Apple Pay/Google Pay統合）

### EC機能
- コーヒー豆・グッズのオンライン販売
- 配送先管理
- 購入履歴
- ギフト機能（eギフトカード）

### モバイルオーダー実装アーキテクチャ
#### コンポーネント構成
1. **顧客用PWA**（Firebase Hosting）
   - 注文作成・送信
   - 注文状況リアルタイム確認
   - プッシュ通知受信

2. **店舗管理ダッシュボード**（Web）
   - 新規注文の受信・通知
   - 注文ステータス管理
   - 調理時間の更新

3. **リアルタイム通信**
   - Cloudflare Durable Objects（WebSocket）
   - 双方向リアルタイム更新
   - 注文状態の即時同期

## 8. テスト・品質保証
- ユニットテスト：Jest + React Testing Library
- E2E テスト：Playwright / Cypress
- PWA 評価：Chrome Lighthouse

## 9. CI/CD・ホスティング
- GitHub Actions でビルド → テスト → デプロイ
- フロントエンド：Firebase Hosting（PWA完全対応）
  - HTTPS自動対応
  - Service Worker サポート
  - グローバルCDN
- バックエンド：Cloudflare Workers（エッジAPI）

## 10. 参考資料
- PWA 公式: https://web.dev/progressive-web-apps/
- Workbox: https://developers.google.com/web/tools/workbox
- Vite PWA Plugin: https://vite-plugin-pwa.netlify.app/ 