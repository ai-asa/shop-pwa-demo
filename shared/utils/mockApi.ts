import type { MenuItem, Order, User, PointCard } from '../types';
import { mockMenuItems } from '../mock-data/menu';
import { mockOrders } from '../mock-data/orders';

// 遅延を追加してリアルなAPI通信を模擬
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorageのキー
const STORAGE_KEYS = {
  ORDERS: 'cafe_orders',
  CART: 'cafe_cart',
  USER: 'cafe_user',
  FAVORITES: 'cafe_favorites'
};

// ランダムIDの生成
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const mockApi = {
  // メニュー関連
  async getMenuItems(): Promise<{ data: MenuItem[] }> {
    await delay(300);
    return { data: mockMenuItems };
  },

  async getMenuItem(id: string): Promise<{ data: MenuItem | null }> {
    await delay(200);
    const item = mockMenuItems.find(item => item.id === id);
    return { data: item || null };
  },

  // 注文関連
  async getOrders(): Promise<{ data: Order[] }> {
    await delay(400);
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders = storedOrders ? JSON.parse(storedOrders) : mockOrders;
    return { data: orders };
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Order }> {
    await delay(500);
    
    const newOrder: Order = {
      ...orderData,
      id: `ORDER-${generateId()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
      estimatedTime: Math.floor(Math.random() * 15) + 10 // 10-25分のランダム
    };

    // LocalStorageに保存
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders = storedOrders ? JSON.parse(storedOrders) : [];
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    return { data: newOrder };
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<{ data: Order | null }> {
    await delay(300);
    
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = storedOrders ? JSON.parse(storedOrders) : mockOrders;
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return { data: null };

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date()
    };

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return { data: orders[orderIndex] };
  },

  // カート関連
  async getCart(): Promise<{ data: any[] }> {
    await delay(100);
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return { data: cart ? JSON.parse(cart) : [] };
  },

  async saveCart(cartItems: any[]): Promise<{ success: boolean }> {
    await delay(100);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    return { success: true };
  },

  // ユーザー関連
  async getCurrentUser(): Promise<{ data: User | null }> {
    await delay(200);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (!user) {
      const mockUser: User = {
        id: 'user-1',
        name: 'ゲストユーザー',
        email: 'guest@example.com',
        points: 1250,
        favoriteItems: []
      };
      return { data: mockUser };
    }
    return { data: JSON.parse(user) };
  },

  async updateUser(userData: Partial<User>): Promise<{ data: User }> {
    await delay(300);
    const currentUser = await this.getCurrentUser();
    const updatedUser = { ...currentUser.data!, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return { data: updatedUser };
  },

  // ポイントカード
  async getPointCard(userId: string): Promise<{ data: PointCard }> {
    await delay(200);
    const user = await this.getCurrentUser();
    const pointCard: PointCard = {
      userId,
      points: user.data?.points || 0,
      tier: user.data?.points! >= 5000 ? 'gold' : user.data?.points! >= 2000 ? 'silver' : 'bronze',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CAFE-USER-${userId}`
    };
    return { data: pointCard };
  },

  // お気に入り
  async toggleFavorite(itemId: string): Promise<{ data: string[] }> {
    await delay(200);
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    let favoriteItems: string[] = favorites ? JSON.parse(favorites) : [];
    
    if (favoriteItems.includes(itemId)) {
      favoriteItems = favoriteItems.filter(id => id !== itemId);
    } else {
      favoriteItems.push(itemId);
    }
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteItems));
    return { data: favoriteItems };
  },

  async getFavorites(): Promise<{ data: string[] }> {
    await delay(100);
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return { data: favorites ? JSON.parse(favorites) : [] };
  }
};