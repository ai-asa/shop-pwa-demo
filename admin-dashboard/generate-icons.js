import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svgBuffer = readFileSync(join(__dirname, 'public', 'admin-icon.svg'));

// アイコンサイズの定義
const sizes = [
  { size: 192, name: 'admin-icon-192.png' },
  { size: 512, name: 'admin-icon-512.png' }
];

// 各サイズのアイコンを生成
for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, 'public', name));
  
  console.log(`Generated ${name}`);
}

console.log('All icons generated successfully!');