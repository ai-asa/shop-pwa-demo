import type { Order } from '@shared/types'

// 管理画面用の拡張型定義
export interface AdminOrder extends Order {
  customerInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  statusHistory: {
    status: Order['status'];
    timestamp: Date;
    staffId?: string;
  }[];
  preparationTime?: number; // 分
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'admin' | 'staff';
  email: string;
  lastLogin?: Date;
}

export interface SalesData {
  date: Date;
  totalAmount: number;
  orderCount: number;
  itemsSold: {
    itemId: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  averageOrderValue: number;
  previousDayComparison: {
    sales: number; // パーセント
    orders: number; // パーセント
  };
}

export interface InventoryAlert {
  itemId: string;
  itemName: string;
  currentStock: number;
  alertType: 'out-of-stock' | 'low-stock';
}