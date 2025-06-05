import { mockMenuItems } from '@shared/mock-data/menu'
import { mockOrders } from '@shared/mock-data/orders'

export const initializeAdminData = () => {
  // LocalStorageにデータが存在しない場合のみ初期化
  if (!localStorage.getItem('cafe_menu_items')) {
    localStorage.setItem('cafe_menu_items', JSON.stringify(mockMenuItems))
  }
  
  if (!localStorage.getItem('cafe_orders')) {
    localStorage.setItem('cafe_orders', JSON.stringify(mockOrders))
  }
  
  if (!localStorage.getItem('cafe_users')) {
    // デモ用のユーザーデータ
    const demoUsers = [
      {
        id: 'user001',
        name: 'ゲストユーザー',
        email: 'guest@example.com',
        phone: '090-1234-5678',
        points: 1250,
        favoriteItems: ['1', '3', '7'],
        addresses: []
      }
    ]
    localStorage.setItem('cafe_users', JSON.stringify(demoUsers))
  }
}