
import React, { useState } from 'react';
import { CreditCard, Truck, User, MapPin, Phone, ChevronLeft, ShieldCheck, ShoppingBag, Mail, Smartphone, Building2, Home, Plus, Minus, Trash2, AlertCircle } from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface CheckoutProps {
  items: CartItem[];
  user: UserType | null;
  onBack: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onComplete: (customerInfo: any, paymentMethod: any) => void;
}

// Mock data for provinces/districts/wards
const VIETNAM_PROVINCES = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
const MOCK_DISTRICTS: Record<string, string[]> = {
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Tân Bình"],
  "Hà Nội": ["Quận Hoàn Kiếm", "Quận Đống Đa", "Quận Ba Đình", "Quận Cầu Giấy"],
  "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn"]
};
const MOCK_WARDS: Record<string, string[]> = {
  "Quận 1": ["Phường Bến Nghé", "Phường Đa Kao", "Phường Tân Định"],
  "Quận 3": ["Phường 1", "Phường 2", "Phường 5"],
  "Quận Hoàn Kiếm": ["Phường Tràng Tiền", "Phường Hàng Đào", "Phường Lý Thái Tổ"]
};

const Checkout: React.FC<CheckoutProps> = ({ items, user, onBack, onUpdateQuantity, onRemoveItem, onComplete }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    province: '',
    district: '',
    ward: '',
    addressDetail: '',
    paymentMethod: 'cod' as 'cod' | 'transfer' | 'momo' | 'zalopay'
  });

  const subtotal = items.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const shipping = items.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống. Vui lòng thêm món trước khi thanh toán.');
      return;
    }
    if (!formData.name || !formData.phone || !formData.email || !formData.province || !formData.district || !formData.ward || !formData.addressDetail) {
      alert('Vui lòng điền đầy đủ thông tin nhận hàng và địa chỉ chi tiết');
      return;
    }
    onComplete(
      { 
        name: formData.name, 
        phone: formData.phone, 
        email: formData.email, 
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        addressDetail: formData.addressDetail
      }, 
      formData.paymentMethod
    );
  };

  const paymentOptions = [
    { id: 'cod', label: 'Tiền mặt (COD)', desc: 'Thanh toán khi nhận hàng', icon: <Truck size={20} /> },
    { id: 'transfer', label: 'Chuyển khoản', desc: 'Ngân hàng nội địa', icon: <CreditCard size={20} /> },
    { id: 'momo', label: 'Ví MoMo', desc: 'Thanh toán qua app MoMo', icon: <Smartphone size={20} className="text-[#A50064]" /> },
    { id: 'zalopay', label: 'ZaloPay', desc: 'Ví điện tử ZaloPay', icon: <Smartphone size={20} className="text-blue-500" /> },
  ];

  const handleProvinceChange = (val: string) => {
    setFormData({ ...formData, province: val, district: '', ward: '' });
  };

  const handleDistrictChange = (val: string) => {
    setFormData({ ...formData, district: val, ward: '' });
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-[#ff5c62]">
          <ChevronLeft size={20} /> Quay lại cửa hàng
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* 1. XÁC NHẬN MÓN ĂN (Review Items Moved to Top) */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
               <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                  <ShoppingBag className="text-[#ff5c62]" /> Xác nhận món ăn
               </h2>
               <div className="space-y-6">
                 {items.length === 0 ? (
                   <div className="flex flex-col items-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <AlertCircle className="text-slate-300 mb-4" size={48} />
                      <p className="text-slate-500 font-bold">Chưa có món ăn nào để xác nhận.</p>
                      <button onClick={onBack} className="mt-4 text-[#ff5c62] font-black uppercase text-xs tracking-widest hover:underline">Quay lại mua sắm</button>
                   </div>
                 ) : (
                   items.map((item) => {
                     const stock = item.product.stock || 0;
                     const isMax = item.quantity >= stock;
                     const isMin = item.quantity <= 1;

                     return (
                       <div key={item.product.id} className="flex items-center gap-6 p-4 rounded-3xl border border-slate-50 hover:border-red-50 transition-all bg-slate-50/50">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-white">
                             <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex-grow">
                             <h4 className="font-bold text-slate-900 line-clamp-1 mb-1">{item.product.name}</h4>
                             <div className="flex items-center justify-between">
                                <div className="text-[#ff5c62] font-black text-sm">{(item.product.salePrice || item.product.price).toLocaleString()}đ</div>
                                <div className="flex items-center gap-2">
                                   <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                                      <button 
                                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                                        disabled={isMin}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isMin ? 'text-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                                      >
                                        <Minus size={14} />
                                      </button>
                                      <span className="w-10 text-center font-black text-slate-900 text-sm">{item.quantity}</span>
                                      <button 
                                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                                        disabled={isMax}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isMax ? 'text-slate-200' : 'text-[#ff5c62] hover:bg-red-50'}`}
                                      >
                                        <Plus size={14} />
                                      </button>
                                   </div>
                                   <button 
                                    onClick={() => onRemoveItem(item.product.id)}
                                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                             </div>
                             {isMax && (
                               <div className="text-[9px] font-black text-orange-500 uppercase tracking-tighter mt-1">Đã đạt tối đa kho ({stock})</div>
                             )}
                          </div>
                       </div>
                     );
                   })
                 )}
               </div>
            </div>

            {/* 2. THÔNG TIN ĐỊA CHỈ (Shipping Info Moved Second) */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <MapPin className="text-[#ff5c62]" /> Thông tin nhận hàng
              </h2>
              <form className="space-y-8">
                {/* Cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" 
                        placeholder="Nguyễn Văn A" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" 
                        placeholder="0901234567" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email (Để nhận hóa đơn)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" 
                      placeholder="example@gmail.com" 
                    />
                  </div>
                </div>

                {/* Phân cấp địa chỉ */}
                <div className="pt-6 border-t border-slate-50">
                   <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                     <Building2 size={16} className="text-[#ff5c62]" /> Địa chỉ giao hàng
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tỉnh / Thành phố</label>
                        <select 
                          value={formData.province}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 focus:border-[#ff5c62] outline-none font-bold text-slate-700 appearance-none transition-all cursor-pointer"
                        >
                          <option value="">Chọn Tỉnh/Thành</option>
                          {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quận / Huyện</label>
                        <select 
                          disabled={!formData.province}
                          value={formData.district}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 focus:border-[#ff5c62] outline-none font-bold text-slate-700 appearance-none transition-all cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Chọn Quận/Huyện</option>
                          {(MOCK_DISTRICTS[formData.province] || []).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phường / Xã</label>
                        <select 
                          disabled={!formData.district}
                          value={formData.ward}
                          onChange={(e) => setFormData({...formData, ward: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 focus:border-[#ff5c62] outline-none font-bold text-slate-700 appearance-none transition-all cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Chọn Phường/Xã</option>
                          {(MOCK_WARDS[formData.district] || ["Phường 1", "Phường 2", "Phường Tân Định"]).map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                   </div>
                   <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số nhà, tên đường</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        value={formData.addressDetail}
                        onChange={(e) => setFormData({...formData, addressDetail: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" 
                        placeholder="Số 123, Đường Nguyễn Huệ..." 
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <CreditCard className="text-[#ff5c62]" /> Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentOptions.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => setFormData({...formData, paymentMethod: opt.id as any})}
                    className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${formData.paymentMethod === opt.id ? 'border-[#ff5c62] bg-red-50/50 shadow-md translate-y-[-2px]' : 'border-slate-50 bg-slate-50 hover:border-red-100'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === opt.id ? 'border-[#ff5c62]' : 'border-slate-300'}`}>
                      {formData.paymentMethod === opt.id && <div className="w-3 h-3 bg-[#ff5c62] rounded-full" />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900">{opt.label}</span>
                        <span className="text-slate-400">{opt.icon}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl sticky top-28 border border-white/10">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#ff5c62]" /> Tóm tắt đơn hàng
              </h3>
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium line-clamp-1 flex-grow pr-4">x{item.quantity} {item.product.name}</span>
                    <span className="font-bold whitespace-nowrap">{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-800 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tạm tính</span>
                  <span className="font-bold">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Phí vận chuyển</span>
                  <span className="font-bold">{shipping.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4 text-[#ff5c62]">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={items.length === 0}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl uppercase tracking-widest ${
                  items.length === 0 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none border border-slate-700' 
                  : 'bg-[#ff5c62] text-white hover:bg-[#ee4b51] shadow-red-900/20'
                }`}
              >
                {items.length === 0 ? 'Vui lòng thêm món' : 'Xác nhận đặt hàng'}
              </button>
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-green-500" /> Hệ thống bảo mật 100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
