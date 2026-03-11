
import React, { useState, useMemo } from 'react';
// Added RefreshCw to the import list to fix "Cannot find name 'RefreshCw'" error
import { Plus, Edit2, Trash2, Tag, Layers, Settings as SettingsIcon, Monitor, Box, Bell, Mail, TrendingUp, DollarSign, PieChart, ShoppingBag, AlertTriangle, Search, ArrowUpRight, BarChart3, RefreshCw, Users as UserIcon, LayoutDashboard, Calendar, ShoppingCart } from 'lucide-react';
import { Product, Category, Coupon, AppSettings, Order } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

interface AdminProps {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  settings: AppSettings;
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onNavigateCRM: () => void;
}

const Admin: React.FC<AdminProps> = ({ products, categories, coupons, settings, orders, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateSettings, onNavigateCRM }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'coupons' | 'settings'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    categoryId: categories[0]?.id || '',
    description: '',
    details: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop',
    promotionText: ''
  });

  const handleEdit = (p: Product) => {
    setFormData(p);
    setEditingId(p.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      details: '',
      price: 0,
      costPrice: 0,
      stock: 0,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop',
      promotionText: ''
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.price <= 0) {
      alert('Vui lòng điền đầy đủ thông tin và giá món ăn hợp lệ');
      return;
    }

    if (editingId) {
      onUpdateProduct({ ...formData, id: editingId } as Product);
    } else {
      onAddProduct({ ...formData, id: `p-${Date.now()}`, totalSold: 0 } as Product);
    }
    handleResetForm();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dashboard Calculations
  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue by Day (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const revenueByDay = last7Days.map(date => {
      const dayTotal = orders
        .filter(o => o.createdAt.startsWith(date))
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { 
        name: new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' }),
        revenue: dayTotal 
      };
    });

    // Status Distribution
    const statusCounts = orders.reduce((acc: any, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = [
      { name: 'Đang xử lý', value: statusCounts['processing'] || 0, color: '#3b82f6' },
      { name: 'Đã giao', value: statusCounts['shipped'] || 0, color: '#f59e0b' },
      { name: 'Hoàn tất', value: statusCounts['completed'] || 0, color: '#10b981' },
      { name: 'Chờ duyệt', value: statusCounts['pending'] || 0, color: '#94a3b8' },
    ].filter(s => s.value > 0);

    // Top Products
    const productSales = orders.reduce((acc: any, o) => {
      o.items.forEach(item => {
        acc[item.product.name] = (acc[item.product.name] || 0) + item.quantity;
      });
      return acc;
    }, {});

    const topProductsData = Object.entries(productSales)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { totalRevenue, totalOrders, uniqueCustomers, aov, revenueByDay, statusData, topProductsData };
  }, [orders]);

  // Financial Metrics
  const totalStockCostValue = products.reduce((sum, p) => sum + (p.costPrice || 0) * (p.stock || 0), 0);
  const totalRevenuePotential = products.reduce((sum, p) => sum + (p.salePrice || p.price) * (p.stock || 0), 0);
  const totalRealizedProfit = products.reduce((sum, p) => {
    const profitPerItem = (p.salePrice || p.price) - (p.costPrice || 0);
    return sum + (profitPerItem * (p.totalSold || 0));
  }, 0);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Quản Trị Hệ Thống</h1>
            <p className="text-slate-500 font-medium">Trung tâm điều phối hàng hóa, giá cả và lợi nhuận kinh doanh.</p>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200">
          
             <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#ff5c62] text-white shadow-lg shadow-red-100' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <LayoutDashboard size={18} /> Dashboard
             </button>
             <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-[#ff5c62] text-white shadow-lg shadow-red-100' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <Layers size={18} /> Kho & Sản phẩm
             </button>
             <button 
                onClick={() => setActiveTab('coupons')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'coupons' ? 'bg-[#ff5c62] text-white shadow-lg shadow-red-100' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <Tag size={18} /> Khuyến mãi
             </button>
             <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-[#ff5c62] text-white shadow-lg shadow-red-100' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <SettingsIcon size={18} /> Cấu hình
             </button>
             <button 
                onClick={onNavigateCRM}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-slate-500 hover:bg-slate-50 border-l border-slate-100 ml-2"
             >
                <UserIcon size={18} /> CRM Khách hàng
             </button>
          </div>
        </div>
        <iframe title="test1" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=ef6a9611-07bc-4d37-90e5-babe832debba&autoAuth=true&ctid=3011a54b-0a5d-4929-bf02-a00787877c6a" frameborder="0" allowFullScreen="true"></iframe>
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-red-50 text-[#ff5c62] rounded-2xl flex items-center justify-center mb-6"><DollarSign size={24} /></div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tổng doanh thu</div>
                  <div className="text-3xl font-black text-slate-900">{dashboardStats.totalRevenue.toLocaleString()}đ</div>
                  <div className="text-xs text-[#ff5c62] font-bold mt-2 flex items-center gap-1">Từ tất cả đơn hàng <ArrowUpRight size={12}/></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6"><ShoppingCart size={24} /></div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tổng đơn hàng</div>
                  <div className="text-3xl font-black text-slate-900">{dashboardStats.totalOrders}</div>
                  <div className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">Đã được ghi nhận <ArrowUpRight size={12}/></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6"><UserIcon size={24} /></div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Khách hàng</div>
                  <div className="text-3xl font-black text-slate-900">{dashboardStats.uniqueCustomers}</div>
                  <div className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">Khách hàng đã mua sắm <ArrowUpRight size={12}/></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={24} /></div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Giá trị TB đơn</div>
                  <div className="text-3xl font-black text-slate-900">{Math.round(dashboardStats.aov).toLocaleString()}đ</div>
                  <div className="text-xs text-purple-500 font-bold mt-2 flex items-center gap-1">Average Order Value <ArrowUpRight size={12}/></div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Area Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <Calendar className="text-[#ff5c62]" /> Doanh thu 7 ngày qua
                  </h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardStats.revenueByDay}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff5c62" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#ff5c62" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        formatter={(val: number) => [`${val.toLocaleString()}đ`, 'Doanh thu']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#ff5c62" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Pie Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <PieChart className="text-blue-500" /> Trạng thái đơn hàng
                  </h3>
                </div>
                <div className="h-[300px] w-full flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={dashboardStats.statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dashboardStats.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products Bar Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <BarChart3 className="text-green-500" /> Top 5 sản phẩm bán chạy
                  </h3>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardStats.topProductsData} layout="vertical" margin={{ left: 40, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} width={150} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        formatter={(val: number) => [val, 'Đã bán']}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[0, 10, 10, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-10">
            {/* Financial Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={24} /></div>
                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tổng vốn tồn kho</div>
                    <div className="text-3xl font-black text-slate-900">{totalStockCostValue.toLocaleString()}đ</div>
                    <div className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">Giá trị nhập kho hiện tại <ArrowUpRight size={12}/></div>
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6"><DollarSign size={24} /></div>
                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Dự thu bán lẻ</div>
                    <div className="text-3xl font-black text-slate-900">{totalRevenuePotential.toLocaleString()}đ</div>
                    <div className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">Nếu bán hết số món hiện có <ArrowUpRight size={12}/></div>
                  </div>
               </div>
               <div className="bg-[#0b1221] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ff5c62]/10 rounded-full group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-[#ff5c62] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/20"><BarChart3 size={24} /></div>
                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Lợi nhuận thực tế</div>
                    <div className="text-3xl font-black text-[#ff5c62]">{totalRealizedProfit.toLocaleString()}đ</div>
                    <div className="text-xs text-slate-500 font-bold mt-2 flex items-center gap-1">Dựa trên số lượng đã bán <ArrowUpRight size={12}/></div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Central Control Panel (Add/Edit Form) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 sticky top-28">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${isEditing ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-[#ff5c62]'}`}>
                      {isEditing ? <Edit2 size={24} /> : <Plus size={24} />}
                    </div>
                    {isEditing ? 'Cập nhật món' : 'Thêm món ăn'}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tên món ăn</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#ff5c62] font-bold text-slate-700 transition-all focus:bg-white"
                        placeholder="Ví dụ: Steak Thăn Nội Bò Mỹ"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Giá nhập (Vốn)</label>
                        <input 
                          type="number" 
                          required
                          value={formData.costPrice}
                          onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#ff5c62] font-black text-blue-600 transition-all focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Giá niêm yết</label>
                        <input 
                          type="number" 
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#ff5c62] font-black text-[#ff5c62] transition-all focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Số lượng nhập</label>
                          <div className="relative">
                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input 
                              type="number" 
                              required
                              value={formData.stock}
                              onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-[#ff5c62] font-black text-slate-700 transition-all focus:bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Danh mục</label>
                          <select 
                            value={formData.categoryId}
                            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-[#ff5c62] font-bold text-slate-600 appearance-none bg-no-repeat bg-[right_1rem_center] transition-all focus:bg-white"
                            style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundSize: '1rem'}}
                          >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-grow bg-[#ff5c62] text-white py-4 rounded-2xl font-black hover:bg-[#ee4b51] transition-all shadow-xl shadow-red-100 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                        {isEditing ? <><RefreshCw size={18} /> Cập nhật</> : <><Plus size={18} /> Lưu món mới</>}
                      </button>
                      {isEditing && (
                        <button type="button" onClick={handleResetForm} className="bg-slate-100 text-slate-500 px-6 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Hủy</button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Inventory Table & Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                               <ShoppingBag size={24} />
                            </div>
                            <div>
                               <h3 className="text-xl font-bold text-slate-900">Danh Sách Thực Đơn</h3>
                               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hiển thị {filteredProducts.length} món ăn</p>
                            </div>
                        </div>
                        <div className="relative">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <input 
                            type="text" 
                            placeholder="Tìm kiếm món ăn..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-3 text-sm font-medium outline-none focus:border-[#ff5c62] w-full sm:w-64 transition-all focus:bg-white"
                           />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/80 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin món</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đơn giá (Vốn/Bán)</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Tồn kho</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Đã bán</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Lợi nhuận gộp</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map(p => {
                                    const profitPerItem = (p.salePrice || p.price) - (p.costPrice || 0);
                                    const isLowStock = (p.stock || 0) < 10;
                                    const isOutOfStock = (p.stock || 0) <= 0;
                                    
                                    return (
                                        <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-slate-200 group-hover:scale-105 transition-transform">
                                                      <img src={p.image} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                      <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                                                      <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                            {categories.find(c => c.id === p.categoryId)?.name}
                                                        </span>
                                                        {isOutOfStock && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase">Hết hàng</span>}
                                                      </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-400 line-through">{(p.costPrice || 0).toLocaleString()}đ</span>
                                                    <span className="text-base font-black text-[#ff5c62]">{(p.salePrice || p.price).toLocaleString()}đ</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black ${isOutOfStock ? 'bg-red-600 text-white' : isLowStock ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                                    {(isLowStock || isOutOfStock) && <AlertTriangle size={12} />}
                                                    {p.stock || 0} phần
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                               <div className="text-base font-black text-slate-800">{p.totalSold || 0}</div>
                                               <div className="text-[10px] font-bold text-slate-400 uppercase">Phần</div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-sm font-black text-green-600">{(profitPerItem * (p.totalSold || 0)).toLocaleString()}đ</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Lãi: {profitPerItem.toLocaleString()}đ/món</div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button 
                                                      onClick={() => handleEdit(p)}
                                                      className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                      title="Chỉnh sửa"
                                                    >
                                                      <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                      onClick={() => onDeleteProduct(p.id)}
                                                      className="w-10 h-10 rounded-xl bg-red-50 text-[#ff5c62] flex items-center justify-center hover:bg-[#ff5c62] hover:text-white transition-all shadow-sm"
                                                      title="Xóa món"
                                                    >
                                                      <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredProducts.length === 0 && (
                          <div className="p-24 text-center">
                            <Box className="mx-auto mb-4 text-slate-200" size={64} />
                            <p className="text-slate-400 font-bold italic">Không tìm thấy món ăn nào khớp với yêu cầu của bạn.</p>
                          </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3"><Monitor className="text-[#ff5c62]" /> Hiển thị cửa hàng</h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <span className="font-bold text-slate-800 block">Bình luận công khai</span>
                            <span className="text-xs text-slate-400 font-medium">Cho phép khách hàng để lại nhận xét</span>
                        </div>
                        <button 
                            onClick={() => onUpdateSettings({...settings, product: {...settings.product, allowComments: !settings.product.allowComments}})}
                            className={`w-14 h-7 rounded-full transition-all relative ${settings.product.allowComments ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${settings.product.allowComments ? 'left-8' : 'left-1'}`} />
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Đơn vị đo lường chung</label>
                        <input 
                            type="text" 
                            value={settings.product.unit}
                            onChange={(e) => onUpdateSettings({...settings, product: {...settings.product, unit: e.target.value}})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#ff5c62] font-bold text-slate-700" 
                        />
                    </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3"><Bell className="text-orange-500" /> Cảnh báo tồn kho</h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <span className="font-bold text-slate-800 block">Thông báo tự động</span>
                            <span className="text-xs text-slate-400 font-medium">Gửi email khi món ăn sắp hết (dưới 10 phần)</span>
                        </div>
                        <button 
                            onClick={() => onUpdateSettings({...settings, inventory: {...settings.inventory, lowStockAlert: !settings.inventory.lowStockAlert}})}
                            className={`w-14 h-7 rounded-full transition-all relative ${settings.inventory.lowStockAlert ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${settings.inventory.lowStockAlert ? 'left-8' : 'left-1'}`} />
                        </button>
                    </div>
                    {settings.inventory.lowStockAlert && (
                         <div className="animate-in fade-in slide-in-from-top-4">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email nhận báo cáo</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="email" 
                                    value={settings.inventory.alertEmail}
                                    onChange={(e) => onUpdateSettings({...settings, inventory: {...settings.inventory, alertEmail: e.target.value}})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#ff5c62] font-bold text-slate-700" 
                                />
                            </div>
                        </div>
                    )}
                </div>
              </div>
           </div>
        )}

        {activeTab === 'coupons' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.map(c => (
                <div key={c.code} className="bg-white rounded-[2.5rem] p-10 border-2 border-dashed border-slate-200 shadow-sm relative group hover:border-[#ff5c62] transition-all">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50/50 rounded-full group-hover:scale-125 transition-transform"></div>
                    <div className="relative z-10">
                      <div className="text-4xl font-black text-[#ff5c62] mb-3">{c.discountPercent}% <span className="text-lg uppercase">Giảm</span></div>
                      <div className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Tag className="text-slate-300" size={18} />
                        <span className="tracking-widest uppercase">{c.code}</span>
                      </div>
                      <div className="flex flex-col gap-2 pt-6 border-t border-slate-50">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                            <span>Lượt sử dụng</span>
                            <span className="text-slate-900">{c.usedCount}/{c.limit}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                            <span>Ngày hết hạn</span>
                            <span className="text-slate-900">{c.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                </div>
              ))}
              <button className="bg-slate-100 rounded-[2.5rem] p-10 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-[#ff5c62] hover:text-[#ff5c62] hover:bg-white transition-all group">
                  <Plus className="mb-3 group-hover:scale-125 transition-transform" size={32} />
                  <span className="font-black uppercase tracking-widest text-sm">Tạo chiến dịch mới</span>
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
