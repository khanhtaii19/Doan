import { BlogPost, Category, Coupon, Product, User } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const toId = (value: any) => value?.id || value?._id || '';

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  const payload: ApiResponse<T> = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'API request failed');
  }

  return payload.data;
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const data = await request<any[]>('/products');
    return data.map((item) => ({ ...item, id: toId(item) }));
  },

  async createProduct(product: Product): Promise<Product> {
    const data = await request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    return { ...data, id: toId(data) };
  },

  async updateProduct(product: Product): Promise<Product> {
    const data = await request<any>(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
    return { ...data, id: toId(data) };
  },

  async deleteProduct(id: string): Promise<void> {
    await request(`/products/${id}`, { method: 'DELETE' });
  },

  async getCategories(): Promise<Category[]> {
    const data = await request<any[]>('/categories');
    return data.map((item) => ({ ...item, id: toId(item) }));
  },

  async getCoupons(): Promise<Coupon[]> {
    const data = await request<any[]>('/coupons');
    return data.map((item) => ({
      code: item.code,
      discountPercent: item.discountPercent,
      limit: item.limit,
      usedCount: item.usedCount,
      expiryDate: new Date(item.expiryDate).toISOString().slice(0, 10)
    }));
  },

  async getUsers(): Promise<User[]> {
    const data = await request<any[]>('/auth/users');
    return data.map((item) => ({
      id: toId(item),
      email: item.email,
      name: item.name,
      role: item.role,
      phone: item.phone,
      memberLevel: item.memberLevel,
      totalSpent: item.totalSpent,
      joinedAt: item.createdAt,
      avatar: item.avatar
    }));
  },

  async login(email: string, password: string): Promise<{ token: string; data: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Login failed');
    }

    return {
      token: payload.token,
      data: { ...payload.data, id: toId(payload.data) }
    };
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<User> {
    const data = await request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });

    return { ...data, id: toId(data), role: data.role || 'user' };
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    const data = await request<any[]>('/blog');
    return data.map((item) => ({
      id: toId(item),
      title: item.title,
      excerpt: item.excerpt,
      date: formatDate(item.date),
      category: item.category,
      image: item.image,
      author: item.author
        ? {
            ...item.author,
            date: formatDate(item.date)
          }
        : undefined,
      content: item.content,
      tags: item.tags
    }));
  }
};
