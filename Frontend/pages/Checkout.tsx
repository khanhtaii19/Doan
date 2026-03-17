import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, User, MapPin, Phone, ChevronLeft, ShieldCheck, ShoppingBag, Mail, Smartphone, Building2, Home, Plus, Minus, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface CheckoutProps {
  items: CartItem[];
  user: UserType | null;
  onBack: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onComplete: (customerInfo: any, paymentMethod: any) => void;
}

// ─── Types cho API provinces ─────────────────────────────────────────────────
interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward     { code: number; name: string; }

const API = 'https://provinces.open-api.vn/api/v1';

const Checkout: React.FC<CheckoutProps> = ({
  items, user, onBack, onUpdateQuantity, onRemoveItem, onComplete
}) => {
  const [formData, setFormData] = useState({
    name:          user?.name  || '',
    phone:         '',
    email:         user?.email || '',
    province:      '',   // tên tỉnh
    provinceCode:  0,
    district:      '',   // tên quận
    districtCode:  0,
    ward:          '',   // tên phường
    addressDetail: '',
    paymentMethod: 'cod' as 'cod' | 'transfer' | 'momo' | 'zalopay'
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards,     setWards]     = useState<Ward[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards,     setLoadingWards]     = useState(false);

  // ─── Load tỉnh/thành khi mount ─────────────────────────────────────────────
  useEffect(() => {
    setLoadingProvinces(true);
    fetch(`${API}/`)
      .then(r => r.json())
      .then((data: Province[]) => setProvinces(data))
      .catch(() => setProvinces([]))
      .finally(() => setLoadingProvinces(false));
  }, []);

  // ─── Load quận/huyện khi chọn tỉnh ─────────────────────────────────────────
  useEffect(() => {
    if (!formData.provinceCode) { setDistricts([]); setWards([]); return; }
    setLoadingDistricts(true);
    setDistricts([]);
    setWards([]);
    fetch(`${API}/p/${formData.provinceCode}?depth=2`)
      .then(r => r.json())
      .then((data: any) => setDistricts(data.districts || []))
      .catch(() => setDistricts([]))
      .finally(() => setLoadingDistricts(false));
  }, [formData.provinceCode]);

  // ─── Load phường/xã khi chọn quận ──────────────────────────────────────────
  useEffect(() => {
    if (!formData.districtCode) { setWards([]); return; }
    setLoadingWards(true);
    setWards([]);
    fetch(`${API}/d/${formData.districtCode}?depth=2`)
      .then(r => r.json())
      .then((data: any) => setWards(data.wards || []))
      .catch(() => setWards([]))
      .finally(() => setLoadingWards(false));
  }, [formData.districtCode]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const name = provinces.find(p => p.code === code)?.name || '';
    setFormData(f => ({ ...f, provinceCode: code, province: name, districtCode: 0, district: '', ward: '' }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const name = districts.find(d => d.code === code)?.name || '';
    setFormData(f => ({ ...f, districtCode: code, district: name, ward: '' }));
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    const name = wards.find(w => w.code === code)?.name || '';
    setFormData(f => ({ ...f, ward: name }));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0
  );
  const shipping = items.length > 0 ? 30000 : 0;
  const total    = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { alert('Giỏ hàng đang trống.'); return; }
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và email.'); return;
    }
    if (!formData.province || !formData.district || !formData.ward) {
      alert('Vui lòng chọn đầy đủ Tỉnh / Quận / Phường.'); return;
    }
    if (!formData.addressDetail) {
      alert('Vui lòng nhập số nhà, tên đường.'); return;
    }
    onComplete(
      {
        name:          formData.name,
        phone:         formData.phone,
        email:         formData.email,
        province:      formData.province,
        district:      formData.district,
        ward:          formData.ward,
        addressDetail: formData.addressDetail,
      },
      formData.paymentMethod
    );
  };

  const paymentOptions = [
    { id: 'cod',      label: 'Tiền mặt (COD)',  desc: 'Thanh toán khi nhận hàng',   icon: <Truck size={20} /> },
    { id: 'transfer', label: 'Chuyển khoản',     desc: 'Ngân hàng nội địa',           icon: <CreditCard size={20} /> },
    { id: 'momo',     label: 'Ví MoMo',          desc: 'Thanh toán qua app MoMo',     icon: <Smartphone size={20} className="text-[#A50064]" /> },
    { id: 'zalopay',  label: 'ZaloPay',          desc: 'Ví điện tử ZaloPay',          icon: <Smartphone size={20} className="text-blue-500" /> },
  ];

  // ─── Select helper ───────────────────────────────────────────────────────────
  const SelectField = ({
    label, value, onChange, disabled, loading, placeholder, children
  }: {
    label: string; value: string | number; onChange: React.ChangeEventHandler<HTMLSelectElement>;
    disabled?: boolean; loading?: boolean; placeholder: string; children: React.ReactNode;
  }) => (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled || loading}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 focus:border-[#ff5c62] outline-none font-bold text-slate-700 appearance-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value={0}>{loading ? 'Đang tải...' : placeholder}</option>
          {children}
        </select>
        {loading && (
          <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-[#ff5c62]">
          <ChevronLeft size={20} /> Quay lại cửa hàng
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">

            {/* 1. Xác nhận món ăn */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <ShoppingBag className="text-[#ff5c62]" /> Xác nhận món ăn
              </h2>
              <div className="space-y-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <AlertCircle className="text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-bold">Chưa có món ăn nào.</p>
                    <button onClick={onBack} className="mt-4 text-[#ff5c62] font-black uppercase text-xs tracking-widest hover:underline">Quay lại mua sắm</button>
                  </div>
                ) : items.map((item) => {
                  const stock = item.product.stock || 0;
                  const isMax = item.quantity >= stock;
                  return (
                    <div key={item.product.id} className="flex items-center gap-6 p-4 rounded-3xl border border-slate-50 bg-slate-50/50 hover:border-red-50 transition-all">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-white">
                        <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{item.product.name}</h4>
                        <div className="flex items-center justify-between">
                          <div className="text-[#ff5c62] font-black text-sm">{(item.product.salePrice || item.product.price).toLocaleString()}đ</div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                              <button onClick={() => onUpdateQuantity(item.product.id, -1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:text-slate-200 text-slate-500 hover:bg-slate-100">
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center font-black text-slate-900 text-sm">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.product.id, 1)} disabled={isMax} className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:text-slate-200 text-[#ff5c62] hover:bg-red-50">
                                <Plus size={14} />
                              </button>
                            </div>
                            <button onClick={() => onRemoveItem(item.product.id)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        {isMax && <div className="text-[9px] font-black text-orange-500 uppercase tracking-tighter mt-1">Đã đạt tối đa ({stock})</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Thông tin nhận hàng */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <MapPin className="text-[#ff5c62]" /> Thông tin nhận hàng
              </h2>
              <div className="space-y-6">
                {/* Họ tên + SĐT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" placeholder="Nguyễn Văn A" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="tel" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" placeholder="0901234567" />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email (nhận hóa đơn)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" placeholder="example@gmail.com" />
                  </div>
                </div>

                {/* Địa chỉ phân cấp */}
                <div className="pt-6 border-t border-slate-50">
                  <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <Building2 size={16} className="text-[#ff5c62]" /> Địa chỉ giao hàng
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Tỉnh/thành */}
                    <SelectField
                      label="Tỉnh / Thành phố"
                      value={formData.provinceCode}
                      onChange={handleProvinceChange}
                      loading={loadingProvinces}
                      placeholder="Chọn Tỉnh/Thành"
                    >
                      {provinces.map(p => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </SelectField>

                    {/* Quận/huyện */}
                    <SelectField
                      label="Quận / Huyện"
                      value={formData.districtCode}
                      onChange={handleDistrictChange}
                      disabled={!formData.provinceCode}
                      loading={loadingDistricts}
                      placeholder="Chọn Quận/Huyện"
                    >
                      {districts.map(d => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </SelectField>

                    {/* Phường/xã */}
                    <SelectField
                      label="Phường / Xã"
                      value={formData.ward ? wards.find(w => w.name === formData.ward)?.code ?? 0 : 0}
                      onChange={handleWardChange}
                      disabled={!formData.districtCode}
                      loading={loadingWards}
                      placeholder="Chọn Phường/Xã"
                    >
                      {wards.map(w => (
                        <option key={w.code} value={w.code}>{w.name}</option>
                      ))}
                    </SelectField>
                  </div>

                  {/* Số nhà, tên đường */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số nhà, tên đường</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" value={formData.addressDetail} onChange={e => setFormData(f => ({ ...f, addressDetail: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:border-[#ff5c62] outline-none font-medium transition-all" placeholder="Số 123, Đường Nguyễn Huệ..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Phương thức thanh toán */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <CreditCard className="text-[#ff5c62]" /> Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFormData(f => ({ ...f, paymentMethod: opt.id as any }))}
                    className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${formData.paymentMethod === opt.id ? 'border-[#ff5c62] bg-red-50/50 shadow-md -translate-y-0.5' : 'border-slate-50 bg-slate-50 hover:border-red-100'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.paymentMethod === opt.id ? 'border-[#ff5c62]' : 'border-slate-300'}`}>
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

          {/* Sidebar tóm tắt */}
          <div>
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl sticky top-28 border border-white/10">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#ff5c62]" /> Tóm tắt đơn hàng
              </h3>
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
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
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl uppercase tracking-widest ${items.length === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none border border-slate-700' : 'bg-[#ff5c62] text-white hover:bg-[#ee4b51] shadow-red-900/20'}`}
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