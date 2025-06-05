import type { Order, MenuItem, User } from '@shared/types'
import type { AdminOrder, DashboardStats, InventoryAlert, SalesData } from '@/types'

// 遅延を追加する関数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// LocalStorageのキー
const STORAGE_KEYS = {
  ORDERS: 'cafe_orders',
  MENU_ITEMS: 'cafe_menu_items',
  USERS: 'cafe_users',
  SALES_DATA: 'cafe_sales_data'
}

// 管理画面用のMock API
export const adminMockApi = {
  // ダッシュボード統計情報を取得
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300)
    
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as AdminOrder[]
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })
    
    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const todayOrderCount = todayOrders.length
    const averageOrderValue = todayOrderCount > 0 ? todaySales / todayOrderCount : 0
    
    // 前日比較（モック）
    const previousDayComparison = {
      sales: Math.random() * 40 - 20, // -20% to +20%
      orders: Math.random() * 30 - 15 // -15% to +15%
    }
    
    return {
      todaySales,
      todayOrders: todayOrderCount,
      averageOrderValue,
      previousDayComparison
    }
  },

  // 在庫アラートを取得
  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    await delay(200)
    
    const menuItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '[]') as MenuItem[]
    const alerts: InventoryAlert[] = []
    
    menuItems.forEach(item => {
      if (!item.inStock) {
        alerts.push({
          itemId: item.id,
          itemName: item.name,
          currentStock: 0,
          alertType: 'out-of-stock'
        })
      } else {
        // ランダムに低在庫アラートを生成（デモ用）
        if (Math.random() < 0.2) {
          alerts.push({
            itemId: item.id,
            itemName: item.name,
            currentStock: Math.floor(Math.random() * 5) + 1,
            alertType: 'low-stock'
          })
        }
      }
    })
    
    return alerts
  },

  // 注文一覧を取得（管理画面用の詳細情報付き）
  async getAdminOrders(): Promise<AdminOrder[]> {
    await delay(400)
    
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as Order[]
    
    // 管理画面用の詳細情報を追加
    return orders.map(order => ({
      ...order,
      customerInfo: {
        name: order.customerName || `ゲスト${order.id.slice(-4)}`,
        phone: order.customerPhone,
        email: `customer${order.id.slice(-4)}@example.com`
      },
      statusHistory: [
        {
          status: 'pending' as const,
          timestamp: new Date(order.createdAt),
          staffId: 'system'
        },
        ...(order.status !== 'pending' ? [{
          status: order.status,
          timestamp: new Date(order.updatedAt),
          staffId: 'staff001'
        }] : [])
      ],
      preparationTime: 15,
      notes: order.note
    }))
  },

  // 注文ステータスを更新
  async updateOrderStatus(orderId: string, newStatus: Order['status']): Promise<AdminOrder> {
    await delay(300)
    
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as AdminOrder[]
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      throw new Error('Order not found')
    }
    
    const updatedOrder = {
      ...orders[orderIndex],
      status: newStatus,
      updatedAt: new Date(),
      statusHistory: [
        ...orders[orderIndex].statusHistory || [],
        {
          status: newStatus,
          timestamp: new Date(),
          staffId: 'staff001'
        }
      ]
    }
    
    orders[orderIndex] = updatedOrder
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
    
    // 通知音を再生（実装時）
    // playNotificationSound()
    
    return updatedOrder
  },

  // 在庫状態を更新
  async updateInventoryStatus(itemId: string, inStock: boolean): Promise<MenuItem> {
    await delay(200)
    
    const menuItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '[]') as MenuItem[]
    const itemIndex = menuItems.findIndex(item => item.id === itemId)
    
    if (itemIndex === -1) {
      throw new Error('Menu item not found')
    }
    
    menuItems[itemIndex] = {
      ...menuItems[itemIndex],
      inStock
    }
    
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems))
    
    return menuItems[itemIndex]
  },

  // 売上データを取得
  async getSalesData(dateRange: { from: Date; to: Date }): Promise<SalesData[]> {
    await delay(500)
    
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as AdminOrder[]
    const salesByDate: { [date: string]: SalesData } = {}
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      if (orderDate >= dateRange.from && orderDate <= dateRange.to && order.status === 'completed') {
        const dateKey = orderDate.toISOString().split('T')[0]
        
        if (!salesByDate[dateKey]) {
          salesByDate[dateKey] = {
            date: new Date(dateKey),
            totalAmount: 0,
            orderCount: 0,
            itemsSold: []
          }
        }
        
        salesByDate[dateKey].totalAmount += order.totalAmount
        salesByDate[dateKey].orderCount += 1
        
        // 商品別集計
        order.items.forEach(item => {
          const existingItem = salesByDate[dateKey].itemsSold.find(
            sold => sold.itemId === item.menuItem.id
          )
          
          if (existingItem) {
            existingItem.quantity += item.quantity
            existingItem.revenue += item.subtotal
          } else {
            salesByDate[dateKey].itemsSold.push({
              itemId: item.menuItem.id,
              quantity: item.quantity,
              revenue: item.subtotal
            })
          }
        })
      }
    })
    
    return Object.values(salesByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  },

  // 人気商品ランキングを取得
  async getTopSellingItems(limit: number = 5): Promise<{ item: MenuItem; soldCount: number }[]> {
    await delay(300)
    
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as AdminOrder[]
    const menuItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '[]') as MenuItem[]
    const itemCounts: { [itemId: string]: number } = {}
    
    // 本日の完了済み注文から集計
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      
      if (orderDate.getTime() === today.getTime() && order.status === 'completed') {
        order.items.forEach(item => {
          itemCounts[item.menuItem.id] = (itemCounts[item.menuItem.id] || 0) + item.quantity
        })
      }
    })
    
    // ランキング作成
    const ranking = Object.entries(itemCounts)
      .map(([itemId, count]) => {
        const item = menuItems.find(m => m.id === itemId)
        return item ? { item, soldCount: count } : null
      })
      .filter(Boolean)
      .sort((a, b) => b!.soldCount - a!.soldCount)
      .slice(0, limit) as { item: MenuItem; soldCount: number }[]
    
    return ranking
  },

  // ポイント付与
  async addPoints(userId: string, points: number, _reason: string): Promise<void> {
    await delay(200)
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const userIndex = users.findIndex((u: any) => u.id === userId)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    users[userIndex].points += points
    
    // ポイント履歴に追加（実装時）
    // addPointHistory(userId, points, reason)
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  },

  // 顧客一覧を取得
  async getCustomers(): Promise<(User & { lastVisit: Date | null })[]> {
    await delay(300)
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[]
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as Order[]
    
    // 各ユーザーの最終来店日を計算
    return users.map(user => {
      const userOrders = orders.filter(order => order.customerName === user.name)
      const lastOrderDate = userOrders.length > 0 
        ? new Date(Math.max(...userOrders.map(o => new Date(o.createdAt).getTime())))
        : null
      
      return {
        ...user,
        lastVisit: lastOrderDate
      }
    })
  },

  // 顧客の注文履歴を取得
  async getCustomerOrders(userId: string): Promise<Order[]> {
    await delay(300)
    
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as Order[]
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[]
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // ユーザー名で注文をフィルタリング
    return orders
      .filter(order => order.customerName === user.name)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10) // 直近10件
  },

  // 顧客のお気に入り商品を取得
  async getCustomerFavorites(userId: string): Promise<MenuItem[]> {
    await delay(200)
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[]
    const menuItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '[]') as MenuItem[]
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return menuItems.filter(item => user.favoriteItems.includes(item.id))
  }
}