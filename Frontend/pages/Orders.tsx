
import React from 'react';
import { Package, Clock, CheckCircle, ChevronRight, Search, Smartphone, CreditCard, Truck } from 'lucide-react';
import { Order } from '../types';

interface OrdersProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
}

const Orders: React.FC<OrdersProps> = ({ orders, onViewDetail }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-yellow-100">Đang chờ</span>;
      case 'processing': return <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-blue-100">Đang xử lý</span>;
      case 'shipped': return <span className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-purple-100">Đang giao</span>;
      case 'completed': return <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-green-100">Đã xong</span>;
      default: return null;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'momo': return <Smartphone size={14} className="text-[#A50064]" />;
      case 'zalopay': return <Smartphone size={14} className="text-blue-500" />;
      case 'transfer': return <CreditCard size={14} className="text-slate-500" />;
      case 'cod': return <Truck size={14} className="text-slate-500" />;
      default: return null;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'momo': return 'Ví MoMo';
      case 'zalopay': return 'ZaloPay';
      case 'transfer': return 'Chuyển khoản';
      case 'cod': return 'Tiền mặt';
      default: return method;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Đơn hàng của bạn</h1>
            <p className="text-slate-500 font-medium">Theo dõi hành trình món ăn của bạn từ bếp đến bàn ăn.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Tìm mã đơn hàng..." className="pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none w-full md:w-64 shadow-sm focus:border-[#ff5c62] transition-all" />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Package size={48} className="text-slate-200" />
             </div>
             <p className="text-slate-400 text-lg font-bold">Bạn chưa có đơn hàng nào.</p>
             <button className="mt-6 text-[#ff5c62] font-black uppercase tracking-widest text-sm hover:underline">Quay lại cửa hàng</button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 group hover:border-red-100 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-red-50 text-[#ff5c62] rounded-2xl flex items-center justify-center shadow-inner">
                      <Package size={28} />
                    </div>
                    <div>
                       <div className="font-black text-slate-900 text-lg tracking-tight">Đơn hàng #{order.id.slice(-8).toUpperCase()}</div>
                       <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                         <Clock size={12} className="text-slate-300" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {getStatusBadge(order.status)}
                    <div className="text-2xl font-black text-slate-900">{order.totalAmount.toLocaleString()}đ</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-8 bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <span className="text-sm text-slate-600 font-bold block">
                      {order.items[0].product.name} {order.items.length > 1 ? `và ${order.items.length - 1} món khác` : ''}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Tổng số lượng: {order.items.reduce((sum, i) => sum + i.quantity, 0)} phần
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     Thanh toán: 
                     <span className="flex items-center gap-1.5 text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                       {getPaymentIcon(order.paymentMethod)}
                       {getPaymentLabel(order.paymentMethod)}
                     </span>
                   </div>
                   <button 
                    onClick={() => onViewDetail(order)}
                    className="text-slate-900 font-black text-sm flex items-center gap-2 group-hover:text-[#ff5c62] transition-colors py-2 px-6 bg-slate-50 rounded-xl group-hover:bg-red-50"
                   >
                     Chi tiết đơn hàng <ChevronRight size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
