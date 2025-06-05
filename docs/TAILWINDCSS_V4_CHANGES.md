# TailwindCSS v4 主な変更点

このドキュメントは、TailwindCSS v3からv4への移行時に注意すべき主な変更点をまとめたものです。

**重要**: TailwindCSS v4では`tailwind.config.js`ファイルは完全に無視されます。すべての設定はCSSファイル内で行う必要があります。

## 1. CSSファーストのアプローチ

TailwindCSS v4では、設定ファイル（tailwind.config.js）ではなく、CSSファイル内でカスタマイズを行う「CSSファースト」という新しい方法が導入されました。

### v3（JavaScript設定）:
```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: {
        500: '#0ea5e9',
        // ...
      }
    }
  }
}
```

### v4（CSS設定）:
```css
/* styles.css */
@theme {
  --color-primary-500: #0ea5e9;
  /* ... */
}
```

## 2. インポート構文の変更

TailwindCSS v4では、CSSファイル内でのインポート構文が変更されました。

### v3:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### v4:
```css
@import "tailwindcss";
```

## 3. @themeレイヤーの導入

カスタムカラーを含むすべてのデザインに関する設定は、CSSファイル内の@themeレイヤーで行います。

```css
@theme {
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  /* ... */
}
```

## 4. CSS変数によるカラー定義

カスタムカラーは、@themeブロック内で標準のCSS変数（カスタムプロパティ）として定義します。色の変数の命名規則は通常`--color-{名前}-{濃さ}`の形式です。

```css
@theme {
  --color-primary-500: #0ea5e9;
  --color-white: #ffffff;
  --color-gray-700: #374151;
  /* ... */
}
```

## 5. PostCSSプラグインの分離

PostCSSプラグインが別のパッケージに移動しました。

### v3:
```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

### v4:
```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  }
}
```

## 6. Viteとの統合

TailwindCSS v4では、Viteと統合するための専用プラグイン（@tailwindcss/vite）が提供されています。

```js
// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // ...
    tailwindcss()
  ],
})
```

## 7. @themeブロックの制約

@themeブロック内には、カスタムプロパティ（CSS変数）または@keyframesのみを含めることができます。セレクタ（:rootなど）は使用できません。

### 誤った使用方法:
```css
@theme {
  :root {
    --color-primary-500: #0ea5e9;
  }
}
```

### 正しい使用方法:
```css
@theme {
  --color-primary-500: #0ea5e9;
}
```

## 8. 基本カラーの定義

TailwindCSS v4では、基本カラー（white、gray、redなど）も@themeブロック内でCSS変数として定義する必要があります。

```css
@theme {
  --color-white: #ffffff;
  --color-gray-700: #374151;
  --color-red-500: #ef4444;
  /* ... */
}
```

## 9. セマンティックカラーの定義

TailwindCSS v4では、UIコンポーネントで使用するセマンティックカラー（background、foreground、primary、secondary等）も@themeブロック内で定義する必要があります。これらを定義しないと、shadcn/uiなどのコンポーネントライブラリでカラーが正しく表示されません。

### 必須のセマンティックカラー:
```css
@theme {
  /* セマンティックカラー */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-card: #ffffff;
  --color-card-foreground: #0a0a0a;
  --color-popover: #ffffff;
  --color-popover-foreground: #0a0a0a;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #8b5cf6;
  --color-secondary-foreground: #ffffff;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #737373;
  --color-accent: #f59e0b;
  --color-accent-foreground: #ffffff;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-border: #e5e5e5;
  --color-input: #e5e5e5;
  --color-ring: #3b82f6;
}
```

## 10. ダークモードの実装

### CSS変数での実装（推奨）
ダークモードは`@layer base`内でCSS変数をオーバーライドすることで実装します。@themeブロック内ではセレクタが使用できないため、以下のように実装します：

```css
@layer base {
  :root {
    /* ライトモードのCSS変数 */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    /* ... */
  }
  
  html.dark {
    /* ダークモードのCSS変数 */
    --background: 222 47% 11%;
    --foreground: 0 0% 98%;
    /* ... */
  }
}
```

**注意**: @themeブロック内でダークモードのセレクタ（html.dark）を使用することはできません。

## 11. トラブルシューティング

### カラーが表示されない場合のチェックリスト

1. **tailwind.config.jsの確認**
   - v4では`tailwind.config.js`は無視されます
   - すべてのカラー定義を`@theme`ブロックに移動してください

2. **@themeブロックの配置**
   - `@import "tailwindcss";`の後に配置する
   - セレクタを含めていないか確認する

3. **カラー変数の命名規則**
   - `--color-`プレフィックスを使用する
   - 例: `--color-primary-500`、`--color-background`

4. **必要なカラーの定義漏れ**
   - 基本カラー（white、black、gray等）
   - セマンティックカラー（background、foreground等）
   - カスタムカラーとその各シェード

## 12. Next.js + TailwindCSS v4の実装例

### globals.css の完全な例:
```css
@import "tailwindcss";

@theme {
  /* プライマリカラー */
  --color-primary: #3b82f6;
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;
  --color-primary-foreground: #ffffff;
  
  /* セカンダリカラー */
  --color-secondary: #8b5cf6;
  /* ... その他のカラー定義 ... */
  
  /* グレースケール */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  /* ... gray-200～gray-950 ... */
  
  /* セマンティックカラー */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  /* ... その他のセマンティックカラー ... */
  
  /* その他の設定 */
  --radius: 0.5rem;
}

@layer base {
  :root {
    /* CSS変数でのカラー定義（HSL形式） */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    /* ... */
  }
  
  html.dark {
    /* ダークモードのオーバーライド */
    --background: 222 47% 11%;
    --foreground: 0 0% 98%;
    /* ... */
  }
}
```

### postcss.config.js:
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  }
}
```

### package.json の依存関係:
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "autoprefixer": "latest"
  }
}
```

## 13. v3からv4への移行ステップ

1. **依存関係の更新**
   ```bash
   npm uninstall tailwindcss postcss
   npm install -D tailwindcss@4 @tailwindcss/postcss@4
   ```

2. **PostCSS設定の更新**
   - `tailwindcss` → `@tailwindcss/postcss`に変更

3. **CSSファイルの更新**
   - `@tailwind` → `@import "tailwindcss"`に変更
   - `@theme`ブロックを追加

4. **カラー定義の移行**
   - `tailwind.config.js`から`@theme`ブロックへ
   - 命名規則を`--color-`プレフィックスに統一

5. **tailwind.config.jsの削除**
   - v4では不要なので削除

6. **ビルドとテスト**
   - カラーが正しく表示されるか確認
   - 必要に応じてカラー定義を追加

## 参考リンク

- [TailwindCSS v4 公式ドキュメント](https://tailwindcss.com/)
- [TailwindCSS v4 移行ガイド](https://tailwindcss.com/docs/migration-guide)
- [TailwindCSS v4 Alpha ブログ記事](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [shadcn/ui + TailwindCSS v4](https://ui.shadcn.com/docs/installation/next)
