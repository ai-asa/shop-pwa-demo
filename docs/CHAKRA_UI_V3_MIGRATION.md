# Chakra UI v3 移行ガイド

## 概要
このドキュメントは、Chakra UI v3を使用する際の注意点と、よくあるエラーの解決方法をまとめたものです。

## 主な変更点

### 1. ChakraProviderの初期化
Chakra UI v3では、ChakraProviderに`value`プロパティが必須になりました。

**エラー例:**
```
TypeError: Cannot read properties of undefined (reading '_config')
```

**解決方法:**
```tsx
// ❌ 古い書き方
<ChakraProvider>
  <App />
</ChakraProvider>

// ✅ v3の書き方
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

<ChakraProvider value={defaultSystem}>
  <App />
</ChakraProvider>
```

### 2. Cardコンポーネントの変更
v3では、CardとCardBodyの使い方が大きく変更されました。

**エラー例:**
```
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
```

**解決方法:**
```tsx
// ❌ v2の書き方
import { Card, CardBody } from '@chakra-ui/react'

<Card>
  <CardBody>
    <Text>Content</Text>
  </CardBody>
</Card>

// ✅ v3の代替案（Boxを使用）
import { Box } from '@chakra-ui/react'

<Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" p={4}>
  <Text>Content</Text>
</Box>

// ✅ または、v3の新しいCard API
import { Card } from '@chakra-ui/react'

<Card.Root>
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
</Card.Root>
```

### 3. VStackのspacing属性
v3では、`spacing`の代わりに`gap`を使用することが推奨されています。

```tsx
// ❌ 古い書き方（動作しない場合がある）
<VStack spacing={4}>

// ✅ v3の書き方
<VStack gap={4}>
```

### 4. SimpleGridのspacing属性
同様に、SimpleGridでも`gap`を使用します。

```tsx
// ❌ 古い書き方
<SimpleGrid columns={2} spacing={4}>

// ✅ v3の書き方
<SimpleGrid columns={2} gap={4}>
```

### 5. IconButtonのicon属性
v3では、icon属性の使い方が変更されている可能性があります。

```tsx
// ❌ エラーが出る場合
<IconButton icon={<FiTrash />} />

// ✅ 代替案
<IconButton>
  <FiTrash />
</IconButton>
```

## TypeScriptの型エラー対策

Chakra UI v3の型定義が不完全な場合があるため、以下の対策を検討してください：

1. **一時的な型チェックの緩和**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

2. **型アサーションの使用**
```tsx
// 必要に応じて as any を使用
<Component {...props as any} />
```

## 開発環境の問題

### WSL と Windows の互換性
WSL環境で作成したプロジェクトをWindows PowerShellで実行する場合、node_modulesの再インストールが必要です。

```powershell
# Windows PowerShellで実行
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### パスの解決
Viteの設定で、共有フォルダへのパスは相対パスを使用してください。

```ts
// vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared')
    }
  }
})
```

## まとめ

Chakra UI v3への移行時は、以下の点に注意してください：

1. ChakraProviderには必ず`value={defaultSystem}`を指定
2. CardコンポーネントはBoxで代替するか、新しいCard.Root APIを使用
3. spacing属性の代わりにgap属性を使用
4. 型エラーが多い場合は、一時的にTypeScriptのチェックを緩和

これらの対策により、多くの互換性問題を解決できます。