import React from 'react';
import { ChevronLeft, Package, Clock, MapPin, Mail, Phone, Smartphone, CreditCard, Truck, ExternalLink, Printer, CheckCircle2, Navigation, Loader2, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  canUpdateStatus?: boolean;
}

// --- Config tr?ng th�i � 1 ch? duy nh?t, d�ng ? c? badge l?n n�t -----------
const STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  badgeClass: string;
  icon: React.ReactNode;
}> = {
  pending: {
    label: 'Ch? x�c nh?n',
    badgeClass: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    icon: <Clock size={18} />
  },
  processing: {
    label: 'Đang chế biến',
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: <Loader2 size={18} className="animate-spin" />
  },
  shipped: {
    label: '�Đang giao hàng',
    badgeClass: 'bg-purple-50 text-purple-600 border-purple-100',
    icon: <Navigation size={18} />
  },
  delivered: {
    label: '�� giao thành công',
    badgeClass: 'bg-green-50 text-green-600 border-green-100',
    icon: <CheckCircle2 size={18} />
  },
  cancelled: {
    label: '�� huỷ',
    badgeClass: 'bg-red-50 text-red-500 border-red-100',
    icon: <XCircle size={18} />
  }
};

// C�c n�t admin c� th? b?m d? chuy?n tr?ng th�i
const STATUS_ACTIONS: { status: OrderStatus; label: string; activeClass: string; hoverClass: string }[] = [
  { status: 'processing', label: 'Chế biến',   activeClass: 'bg-blue-600 text-white shadow-lg shadow-blue-100',   hoverClass: 'hover:bg-blue-50 hover:text-blue-500' },
  { status: 'shipped',    label: 'Giao hàng',  activeClass: 'bg-purple-600 text-white shadow-lg shadow-purple-100', hoverClass: 'hover:bg-purple-50 hover:text-purple-500' },
  { status: 'delivered',  label: 'Hoàn tất',   activeClass: 'bg-green-600 text-white shadow-lg shadow-green-100',  hoverClass: 'hover:bg-green-50 hover:text-green-500' },
  { status: 'cancelled',  label: 'Huỷ don',   activeClass: 'bg-red-500 text-white shadow-lg shadow-red-100',      hoverClass: 'hover:bg-red-50 hover:text-red-500' },
];

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBack, onUpdateStatus, canUpdateStatus = false }) => {
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'momo':     return <Smartphone size={18} className="text-[#A50064]" />;
      case 'zalopay':  return <Smartphone size={18} className="text-blue-500" />;
      case 'transfer': return <CreditCard size={18} className="text-slate-500" />;
      case 'cod':      return <Truck size={18} className="text-slate-500" />;
      default:         return null;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'momo':     return 'Ví MoMo';
      case 'zalopay':  return 'ZaloPay';
      case 'transfer': return 'Chuyển khoản ngân hàng';
      case 'cod':      return 'Thanh toán khi nhận hàng (COD)';
      default:         return method;
    }
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity, 0
  );

  const statusInfo = STATUS_CONFIG[order.status] ?? STATUS_CONFIG['pending'];

  return (
    <div className="pt-24 pb-20 bg-slate-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">

        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#ff5c62] transition-colors">
            <ChevronLeft size={20} /> Quay lại danh sách hơn
          </button>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Printer size={16} /> In hóa đơn
            </button>
            <button className="flex items-center gap-2 bg-[#ff5c62] px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-red-100 hover:bg-[#ee4b51] transition-all">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>

        {/* Status Controller Bar */}
        {canUpdateStatus && (
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                <Navigation size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Quản lí trạng thái</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Bấm để cập nhật tiến độ đơn hàng</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_ACTIONS.map(({ status, label, activeClass, hoverClass }) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(order.id, status)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${order.status === status
                      ? activeClass
                      : `bg-slate-50 text-slate-400 ${hoverClass}`
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50" />
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8 relative z-10">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Mã đơn hàng</div>
                  <h1 className="text-3xl font-black text-slate-900">#{order.id.slice(-8).toUpperCase()}</h1>
                </div>
                <div className={`px-6 py-2.5 rounded-2xl border font-black uppercase text-xs tracking-widest flex items-center gap-2 ${statusInfo.badgeClass}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-50">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Ngày đặt</div>
                  <div className="font-bold text-slate-900 text-sm">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Giờ đặt</div>
                  <div className="font-bold text-slate-900 text-sm">{new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Thanh toán</div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {getPaymentIcon(order.paymentMethod)}
                    {order.paymentMethod.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Vận chuyển</div>
                  <div className="font-bold text-green-600 text-sm">Giao hoàn tất</div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Package className="text-[#ff5c62]" size={24} /> Danh sách món ăn
              </h3>
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 group">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                      {item.product.image
                        ? <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                        : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">No img</div>
                      }
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1 group-hover:text-[#ff5c62] transition-colors">
                            {item.product.name || `S?n ph?m #${item.product.id?.slice(-4)}`}
                          </h4>
                          {item.product.description && (
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">{item.product.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">{item.unitPrice.toLocaleString()}d</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase">Size {item.size === 'large' ? 'L?n' : 'V?a'}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase">x {item.quantity}</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thành tiền</span>
                        <span className="text-sm font-bold text-slate-900">
                          {(item.unitPrice * item.quantity).toLocaleString()}d
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Customer Info */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl border border-white/5">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                <MapPin size={20} className="text-[#ff5c62]" /> Thông tin nhận hàng
              </h3>
              {order.customerInfo?.name ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Người nhận</label>
                    <div className="font-bold text-white flex items-center gap-2">
                      {order.customerInfo.name}
                      <ExternalLink size={14} className="text-slate-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Liên hệc</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                        <Phone size={14} className="text-[#ff5c62]" />
                        {order.customerInfo.phone || '�'}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                        <Mail size={14} className="text-[#ff5c62]" />
                        {order.customerInfo.email || '�'}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-800">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Địa chỉ giao hàng</label>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      {order.customerInfo.addressDetail && <>{order.customerInfo.addressDetail},<br /></>}
                      {order.customerInfo.ward && <>{order.customerInfo.ward}, </>}
                      {order.customerInfo.district && <>{order.customerInfo.district},<br /></>}
                      {order.customerInfo.province}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">Chưa có thông tin nhận hàng.</p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-500" /> Thanh toán
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-400">T?m t�nh ({order.items.length} m�n)</span>
                  <span className="text-slate-900">{subtotal.toLocaleString()}d</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-400">Phí vận chuyển</span>
                  <span className="text-slate-900">30.000d</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-400">Giảm giá</span>
                  <span className="text-green-600">0d</span>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center mb-8">
                <span className="font-black text-slate-900">Tổng cộng</span>
                <span className="text-2xl font-black text-[#ff5c62]">{order.totalAmount.toLocaleString()}d</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                {getPaymentIcon(order.paymentMethod)}
                <div className="text-[11px] font-bold text-slate-500 leading-tight">
                  Phương thức:<br />
                  <span className="text-slate-900 uppercase tracking-tighter">{getPaymentLabel(order.paymentMethod)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
