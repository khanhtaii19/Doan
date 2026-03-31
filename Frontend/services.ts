const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('shop_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
};

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    return handleResponse(res);
  },

  getUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/users`, { headers: authHeaders() });
    const data = await handleResponse(res);
    return data.data.map((u: any) => ({ ...u, id: u._id || u.id }));
  },

  getProducts: async () => {
    const res = await fetch(`${API_BASE}/products`);
    const data = await handleResponse(res);
    return data.data.map((p: any) => ({ ...p, id: p._id || p.id }));
  },

  createProduct: async (product: any) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(product)
    });
    const data = await handleResponse(res);
    return { ...data.data, id: data.data._id || data.data.id };
  },

  updateProduct: async (product: any) => {
    const res = await fetch(`${API_BASE}/products/${product.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(product)
    });
    const data = await handleResponse(res);
    return { ...data.data, id: data.data._id || data.data.id };
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return handleResponse(res);
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await handleResponse(res);
    return data.data.map((c: any) => ({ ...c, id: c._id || c.id }));
  },

  getCoupons: async () => {
    const res = await fetch(`${API_BASE}/coupons`);
    const data = await handleResponse(res);
    return data.data.map((c: any) => ({
      ...c,
      id: c._id || c.id,
      expiryDate: c.expiryDate?.split('T')[0] ?? c.expiryDate
    }));
  },

  getOrders: async (userId?: string) => {
    const url = userId
      ? `${API_BASE}/orders?userId=${userId}`
      : `${API_BASE}/orders`;
    const res = await fetch(url, { headers: authHeaders() });
    const data = await handleResponse(res);
    // Trả về raw data để App.tsx dùng mapDbOrderToFrontend
    return data.data;
  },

  createOrder: async (order: any) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(order)
    });
    const data = await handleResponse(res);
    // Trả về raw data từ DB (có _id, createdAt, customerInfo đầy đủ)
    return data.data;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await handleResponse(res);
    return { ...data.data, id: data.data._id || data.data.id };
  },

  getBlogPosts: async () => {
    const res = await fetch(`${API_BASE}/blog`);
    const data = await handleResponse(res);
    return data.data.map((p: any) => ({
      ...p,
      id: p._id || p.id,
      date: p.date?.split('T')[0] ?? p.date
    }));
  }
};