import type { Order } from '../types';
import { mockMenuItems } from './menu';

export const mockOrders: Order[] = [
  {
    id: 'ORDER-001',
    items: [
      {
        menuItem: mockMenuItems[0], // カフェラテ
        quantity: 2,
        customizations: { size: 'M', sweetness: '普通', milk: '通常' },
        subtotal: 900
      },
      {
        menuItem: mockMenuItems[6], // チーズケーキ
        quantity: 1,
        customizations: {},
        subtotal: 480
      }
    ],
    type: 'dine-in',
    status: 'preparing',
    totalAmount: 1380,
    createdAt: new Date('2024-06-04T10:30:00'),
    updatedAt: new Date('2024-06-04T10:32:00'),
    estimatedTime: 10,
    customerName: '山田太郎',
    customerPhone: '090-1234-5678'
  },
  {
    id: 'ORDER-002',
    items: [
      {
        menuItem: mockMenuItems[1], // アイスコーヒー
        quantity: 1,
        customizations: { size: 'L' },
        subtotal: 430
      },
      {
        menuItem: mockMenuItems[4], // ベーグルサンド
        quantity: 1,
        customizations: {},
        subtotal: 620
      }
    ],
    type: 'takeout',
    status: 'ready',
    totalAmount: 1050,
    createdAt: new Date('2024-06-04T10:15:00'),
    updatedAt: new Date('2024-06-04T10:25:00'),
    estimatedTime: 15,
    pickupTime: '11:00',
    customerName: '佐藤花子',
    note: 'ベーグルはトーストしてください'
  },
  {
    id: 'ORDER-003',
    items: [
      {
        menuItem: mockMenuItems[2], // 抹茶ラテ
        quantity: 3,
        customizations: { size: 'M', sweetness: '微糖' },
        subtotal: 1500
      }
    ],
    type: 'dine-in',
    status: 'completed',
    totalAmount: 1500,
    createdAt: new Date('2024-06-04T09:45:00'),
    updatedAt: new Date('2024-06-04T10:00:00'),
    customerName: '鈴木一郎'
  }
];