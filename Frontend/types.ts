
export type UserRole = 'admin' | 'user';
export type MemberLevel = 'Silver' | 'Gold' | 'Diamond';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  memberLevel?: MemberLevel;
  totalSpent?: number;
  joinedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  details: string;
  price: number;
  salePrice?: number;
  costPrice?: number; // Giá vốn nhập vào
  image: string;
  promotionText?: string;
  stock?: number;
  totalSold?: number; // Số lượng đã bán
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    addressDetail: string;
  };
  paymentMethod: 'cod' | 'transfer' | 'momo' | 'zalopay';
  status: 'pending' | 'processing' | 'shipped' | 'completed';
  createdAt: string;
}

export interface AppSettings {
  product: {
    unit: string;
    allowComments: boolean;
  };
  display: {
    defaultCategory: string;
    imageOrientation: 'portrait' | 'landscape' | 'square';
  };
  inventory: {
    manageStock: boolean;
    lowStockAlert: boolean;
    alertEmail: string;
  };
}

export interface Coupon {
  code: string;
  discountPercent: number;
  limit: number;
  usedCount: number;
  expiryDate: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isBestSeller?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  author?: {
    name: string;
    avatar: string;
    date: string;
    readTime: string;
  };
  content?: string[];
  tags?: string[];
}
