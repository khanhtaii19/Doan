
import React from 'react';
import { CheckCircle, Package, ArrowLeft, Download, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessProps {
  order: Order;
  onGoHome: () => void;
  onGoOrders: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ order, onGoHome, onGoOrders }) => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Đặt hàng thành công!</h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          Cảm ơn bạn đã tin tưởng NghienFood. <br /> Mã đơn hàng của bạn là <span className="text-slate-900 font-bold">#{order.id.slice(-8).toUpperCase()}</span>
        </p>

        <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-10 border border-slate-100 text-left">
           <div className="flex justify-between items-start mb-6">
             <h3 className="font-bold text-slate-900 flex items-center gap-2">
               <Package size={20} className="text-[#ff5c62]" /> Tóm tắt đơn hàng
             </h3>
             <div className="text-[10px] bg-[#ff5c62] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
               Đang xử lý
             </div>
           </div>
           
           <div className="space-y-4 mb-8 border-b border-slate-200 pb-8">
              {order.items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">{item.quantity}x {item.product.name}</span>
                  <span className="font-bold">{(item.product.salePrice || item.product.price).toLocaleString()}đ</span>
                </div>
              ))}
           </div>

           <div className="mb-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <MapPin size={12} className="text-[#ff5c62]" /> Địa chỉ nhận hàng
              </h4>
              <div className="text-sm">
                 <p className="font-bold text-slate-900">{order.customerInfo.name} • {order.customerInfo.phone}</p>
                 <p className="text-slate-500 leading-relaxed mt-1">
                   {order.customerInfo.addressDetail}, {order.customerInfo.ward}, {order.customerInfo.district}, {order.customerInfo.province}
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-900">Tổng thanh toán</span>
              <span className="text-2xl font-black text-[#ff5c62]">{order.totalAmount.toLocaleString()}đ</span>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onGoOrders}
            className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            Quản lý đơn hàng
          </button>
          <button 
            onClick={onGoHome}
            className="flex-grow bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Tiếp tục mua sắm
          </button>
        </div>
        
        <button className="mt-8 text-sm font-bold text-slate-400 hover:text-[#ff5c62] flex items-center justify-center gap-2 mx-auto">
          <Download size={16} /> Tải hóa đơn (PDF)
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
