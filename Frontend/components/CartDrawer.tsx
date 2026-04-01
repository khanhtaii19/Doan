
import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemKey: string, delta: number) => void;
  onRemoveItem: (cartItemKey: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleIncrement = (item: CartItem) => {
    const stock = item.product.stock ?? 0;
    if (item.quantity >= stock) {
      alert(`Xin lỗi, chúng tôi chỉ có ${stock} phần món ${item.product.name} này thôi.`);
      return;
    }
    onUpdateQuantity(`${item.product.id}-${item.size}`, 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 text-[#ff5c62] rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Giỏ hàng ({items.length})</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ShoppingBag size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">Giỏ hàng của bạn đang trống</p>
                <button onClick={onClose} className="mt-4 text-[#ff5c62] font-bold hover:underline">Tiếp tục mua sắm</button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-bold text-slate-900 line-clamp-1">{item.product.name}</h3>
                      <button onClick={() => onRemoveItem(`${item.product.id}-${item.size}`)} className="text-slate-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[#ff5c62] font-bold text-sm mb-3">
                      {item.unitPrice.toLocaleString()}đ
                    </p>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Size {item.size === 'large' ? 'Lớn' : 'Vừa'}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-50 rounded-lg p-1">
                        <button onClick={() => onUpdateQuantity(`${item.product.id}-${item.size}`, -1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-white rounded transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncrement(item)} 
                          className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${item.quantity >= (item.product.stock ?? 0) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-white'}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Tổng: {(item.unitPrice * item.quantity).toLocaleString()}đ
                      </span>
                    </div>
                    {item.quantity >= (item.product.stock ?? 0) && (
                      <div className="mt-2 text-[10px] font-bold text-red-400 flex items-center gap-1 uppercase tracking-tighter">
                         <AlertTriangle size={10} /> Đã đạt giới hạn tồn kho
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 font-medium">Tạm tính:</span>
                <span className="text-2xl font-black text-slate-900">{subtotal.toLocaleString()}đ</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-[#ff5c62] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#ee4b51] transition-all shadow-xl shadow-red-100"
              >
                Thanh toán ngay <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
