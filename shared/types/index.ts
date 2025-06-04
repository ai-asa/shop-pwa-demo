// メニューアイテムの型定義
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'ドリンク' | 'フード' | 'デザート' | 'グッズ';
  image: string;
  description: string;
  allergens?: string[];
  customizations?: Customization[];
  inStock: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface Customization {
  type: 'size' | 'sweetness' | 'milk' | 'topping';
  options: CustomizationOption[];
}

export interface CustomizationOption {
  name: string;
  priceModifier: number;
}

// 注文関連の型定義
export interface Order {
  id: string;
  items: OrderItem[];
  type: 'dine-in' | 'takeout';
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number; // 分単位
  pickupTime?: string;
  customerName: string;
  customerPhone?: string;
  note?: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: { [key: string]: string };
  subtotal: number;
}

// カート関連
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: { [key: string]: string };
}

// ユーザー関連
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  points: number;
  favoriteItems: string[];
  addresses?: Address[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  postalCode: string;
  isDefault: boolean;
}

// ポイントカード
export interface PointCard {
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  qrCode: string;
}