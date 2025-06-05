import type { MenuItem } from '../types';

export const mockMenuItems: MenuItem[] = [
  // ドリンク
  {
    id: '1',
    name: 'カフェラテ',
    price: 450,
    category: 'ドリンク',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400',
    description: '濃厚なエスプレッソとクリーミーなミルクの絶妙なハーモニー',
    allergens: ['乳'],
    customizations: [
      {
        type: 'size',
        options: [
          { name: 'S', priceModifier: -50 },
          { name: 'M', priceModifier: 0 },
          { name: 'L', priceModifier: 50 }
        ]
      },
      {
        type: 'sweetness',
        options: [
          { name: '無糖', priceModifier: 0 },
          { name: '微糖', priceModifier: 0 },
          { name: '普通', priceModifier: 0 }
        ]
      },
      {
        type: 'milk',
        options: [
          { name: '通常', priceModifier: 0 },
          { name: '豆乳', priceModifier: 50 },
          { name: 'オーツミルク', priceModifier: 50 }
        ]
      }
    ],
    inStock: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'アイスコーヒー',
    price: 380,
    category: 'ドリンク',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    description: 'すっきりとした味わいの本格アイスコーヒー',
    customizations: [
      {
        type: 'size',
        options: [
          { name: 'S', priceModifier: -50 },
          { name: 'M', priceModifier: 0 },
          { name: 'L', priceModifier: 50 }
        ]
      }
    ],
    inStock: true,
    isNew: true
  },
  {
    id: '3',
    name: '抹茶ラテ',
    price: 500,
    category: 'ドリンク',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
    description: '京都産の上質な抹茶を使用した本格抹茶ラテ',
    allergens: ['乳'],
    customizations: [
      {
        type: 'size',
        options: [
          { name: 'S', priceModifier: -50 },
          { name: 'M', priceModifier: 0 },
          { name: 'L', priceModifier: 50 }
        ]
      },
      {
        type: 'sweetness',
        options: [
          { name: '無糖', priceModifier: 0 },
          { name: '微糖', priceModifier: 0 },
          { name: '普通', priceModifier: 0 }
        ]
      }
    ],
    inStock: true,
    isPopular: true
  },
  
  // フード
  {
    id: '4',
    name: 'クロワッサンサンド',
    price: 580,
    category: 'フード',
    image: 'https://images.unsplash.com/photo-1523905330026-b8bd1f5f320e?w=400',
    description: 'サクサクのクロワッサンにハムとチーズをサンド',
    allergens: ['小麦', '乳', '卵'],
    inStock: true
  },
  {
    id: '5',
    name: 'ベーグルサンド',
    price: 620,
    category: 'フード',
    image: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=400',
    description: 'もちもちベーグルにクリームチーズとサーモン',
    allergens: ['小麦', '乳', '魚'],
    inStock: true
  },
  {
    id: '6',
    name: 'キッシュプレート',
    price: 980,
    category: 'フード',
    image: 'https://images.unsplash.com/photo-1565299715199-866c917206bb?w=400',
    description: '日替わりキッシュとサラダのセット',
    allergens: ['小麦', '乳', '卵'],
    inStock: true,
    isPopular: true
  },
  
  // デザート
  {
    id: '7',
    name: 'チーズケーキ',
    price: 480,
    category: 'デザート',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    description: '濃厚でクリーミーなニューヨークチーズケーキ',
    allergens: ['乳', '卵', '小麦'],
    inStock: true,
    isPopular: true
  },
  {
    id: '8',
    name: 'ティラミス',
    price: 520,
    category: 'デザート',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    description: '本場イタリアンスタイルのティラミス',
    allergens: ['乳', '卵', '小麦'],
    inStock: true
  },
  {
    id: '9',
    name: 'シフォンケーキ',
    price: 420,
    category: 'デザート',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400',
    description: 'ふわふわ食感の手作りシフォンケーキ',
    allergens: ['卵', '小麦'],
    inStock: false
  },
  
  // グッズ
  {
    id: '10',
    name: 'オリジナルマグカップ',
    price: 1800,
    category: 'グッズ',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
    description: 'カフェロゴ入りオリジナルマグカップ',
    inStock: true
  },
  {
    id: '11',
    name: 'コーヒー豆（ブレンド）',
    price: 1200,
    category: 'グッズ',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    description: 'オリジナルブレンドコーヒー豆 200g',
    inStock: true,
    isNew: true
  },
  {
    id: '12',
    name: 'ドリップバッグセット',
    price: 980,
    category: 'グッズ',
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400',
    description: '手軽に楽しめるドリップバッグ10個入り',
    inStock: true
  }
];