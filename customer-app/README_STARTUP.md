# 起動方法

## Windows (PowerShell/コマンドプロンプト)

### 方法1: npmスクリプトを使う
```powershell
cd C:\Users\pirok\Desktop\repo\demos\shop-pwa-demo\customer-app
npm run dev
```

### 方法2: npxを使う
```powershell
cd C:\Users\pirok\Desktop\repo\demos\shop-pwa-demo\customer-app
npx vite
```

### 方法3: バッチファイルを使う
`start.bat` をダブルクリックして実行

### 方法4: node_modulesから直接実行
```powershell
cd C:\Users\pirok\Desktop\repo\demos\shop-pwa-demo\customer-app
.\node_modules\.bin\vite
```

## トラブルシューティング

### エラー: 'vite' は認識されていません
1. Node.jsがインストールされているか確認
   ```powershell
   node --version
   npm --version
   ```

2. 依存関係を再インストール
   ```powershell
   npm install
   ```

3. グローバルにviteをインストール（推奨しません）
   ```powershell
   npm install -g vite
   ```

### エラー: スクリプトの実行がブロックされています
PowerShellの実行ポリシーを一時的に変更：
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## アクセス方法
開発サーバーが起動したら、ブラウザで以下にアクセス：
- http://localhost:5173/