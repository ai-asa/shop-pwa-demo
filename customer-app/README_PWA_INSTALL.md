# PWAインストール促進ガイド

## 📱 QRコードでの配布方法

PWAは直接QRコードでインストールすることはできませんが、以下の方法でスムーズなインストール体験を提供できます。

### 1. インストール促進機能

#### 自動インストールプロンプト
- `src/components/InstallPrompt.tsx` を実装済み
- 初回アクセス時に自動的にインストール案内を表示
- Android/iOS それぞれに最適化された説明を表示

### 2. QRコード活用方法

#### 店舗用ポスター
```
https://your-domain.web.app/qr-poster.html
```
- A4サイズの印刷用ポスター
- QRコードと簡単な説明付き
- 店内掲示用に最適化

#### インストール専用ページ
```
https://your-domain.web.app/install.html
```
- PC向けのQRコード表示ページ
- モバイルアクセス時は自動的にアプリへリダイレクト

### 3. 実装されている機能

1. **InstallPrompt コンポーネント**
   - beforeinstallprompt イベントをキャッチ
   - iOS Safari の場合は手動インストール手順を表示
   - インストール済みの場合は表示しない

2. **デバイス別対応**
   - Android: ネイティブインストールボタン
   - iOS: Safari の「ホーム画面に追加」手順
   - デスクトップ: Chrome のインストール機能

### 4. カスタマイズ方法

#### インストール促進のタイミング変更
```typescript
// 例: 3回目のアクセス時に表示
useEffect(() => {
  const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1
  localStorage.setItem('visitCount', visitCount.toString())
  
  if (visitCount === 3) {
    onOpen() // インストールプロンプトを表示
  }
}, [])
```

#### デザインのカスタマイズ
`InstallPrompt.tsx` のスタイルを変更して、ブランドに合わせたデザインに調整できます。

### 5. 使用方法

1. **QRコードの生成**
   - `/qr-poster.html` にアクセスして印刷
   - 店舗のレジ横やテーブルに設置

2. **スタッフ向け説明**
   - お客様にQRコードを読み取ってもらう
   - 「ホーム画面に追加」の操作をサポート

3. **効果測定**
   - インストール率の計測
   - Google Analytics等でイベントトラッキング

## 📊 インストール率向上のヒント

1. **初回特典の提供**
   - アプリインストールで500ポイントプレゼント等

2. **限定機能の訴求**
   - アプリ限定メニューやクーポン

3. **スタッフによる案内**
   - レジでの声かけ
   - インストールサポート

## 🔧 技術的な注意点

- HTTPSが必須（Firebase Hostingは自動でHTTPS）
- manifest.json が正しく設定されていること
- Service Worker が登録されていること
- アイコンが適切なサイズで用意されていること

これらの機能により、QRコードを使った効果的なPWA配布が可能になります。