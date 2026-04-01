
import React, { useState } from 'react';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, Star, Plus, Minus, Ticket, AlertTriangle } from 'lucide-react';
import { Product, Coupon, ProductSize } from '../types';

interface ProductDetailViewProps {
  product: Product;
  coupons: Coupon[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, size: ProductSize, unitPrice: number) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, coupons, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('medium');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  
  const basePrice = product.salePrice || product.price;
  const mediumPrice = product.sizePrices ? product.sizePrices.medium : basePrice;
  const largePrice = product.sizePrices ? product.sizePrices.large : Math.round(basePrice * 1.25);
  const finalPrice = selectedSize === 'large' ? largePrice : mediumPrice;
  const discountAmount = appliedCoupon ? (finalPrice * appliedCoupon.discountPercent / 100) : 0;
  const totalPrice = (finalPrice - discountAmount) * quantity;

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
       if (coupon.usedCount < coupon.limit) {
         setAppliedCoupon(coupon);
         alert(`Áp dụng mã ${coupon.code} thành công!`);
       } else {
         alert('Mã này đã hết lượt sử dụng!');
       }
    } else {
      alert('Mã giảm giá không hợp lệ.');
    }
  };

  const incrementQty = () => {
    if (quantity >= stock) {
      setError(`Chỉ có thể mua tối đa ${stock} phần món này`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    setQuantity(prev => prev + 1);
    setError(null);
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      setError(null);
    }
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;
    if (quantity > stock) {
      alert(`Rất tiếc, hiện chỉ còn ${stock} phần.`);
      return;
    }
    onAddToCart(product, quantity, selectedSize, finalPrice);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold mb-10 hover:text-[#ff5c62]">
          <ChevronLeft size={20} /> Quay lại cửa hàng
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square bg-gray-50 border-4 border-white relative">
              <img src={product.image} className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-50' : ''}`} alt={product.name} />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                   <div className="bg-white px-8 py-3 rounded-2xl shadow-2xl">
                      <span className="text-xl font-black text-red-500 uppercase tracking-widest">Đã hết món</span>
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff5c62] uppercase tracking-widest mb-4">
               <Star size={14} fill="currentColor" /> {product.promotionText || 'Được đề xuất nhiều nhất'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 font-medium mb-1">Giá ưu đãi</span>
                <span className={`text-4xl font-extrabold ${isOutOfStock ? 'text-slate-300' : 'text-[#ff5c62]'}`}>{finalPrice.toLocaleString()}đ</span>
              </div>
              {product.salePrice && (
                 <div className="flex flex-col">
                    <span className="text-sm text-slate-400 font-medium mb-1">Giá gốc</span>
                    <span className="text-xl text-slate-300 line-through">{product.price.toLocaleString()}đ</span>
                 </div>
              )}
              {!isOutOfStock && (
                <div className="ml-auto bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-bold border border-green-100">
                  Còn {stock} phần trong kho
                </div>
              )}
            </div>

            <p className="text-slate-500 text-lg leading-relaxed mb-10">{product.description}</p>

            {!isOutOfStock && (
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Chọn size</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedSize('medium')}
                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                      selectedSize === 'medium'
                        ? 'border-[#ff5c62] bg-red-50 text-[#ff5c62]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-widest">Size vừa</div>
                    <div className="font-bold text-base">
                      {mediumPrice.toLocaleString()}đ
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedSize('large')}
                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                      selectedSize === 'large'
                        ? 'border-[#ff5c62] bg-red-50 text-[#ff5c62]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-widest">Size lớn</div>
                    <div className="font-bold text-base">
                      {largePrice.toLocaleString()}đ
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message for Stock */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 animate-bounce border border-red-100">
                <AlertTriangle size={20} />
                <span className="font-bold text-sm">{error}</span>
              </div>
            )}

            {!isOutOfStock && (
              <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Ticket size={18} className="text-[#ff5c62]" /> Mã giảm giá</h4>
                <div className="flex gap-2">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Nhập mã coupon" className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#ff5c62] font-bold" />
                  <button onClick={handleApplyCoupon} className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-[#ff5c62] transition-colors">Áp dụng</button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch gap-6 mb-10">
               {!isOutOfStock && (
                 <div className="flex items-center bg-slate-100 rounded-2xl p-1.5">
                    <button 
                      onClick={decrementQty}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:text-[#ff5c62] disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={incrementQty}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center hover:text-[#ff5c62] disabled:opacity-30"
                      disabled={quantity >= stock}
                    >
                      <Plus size={18} />
                    </button>
                 </div>
               )}
               <button 
                onClick={handleAddToCartClick}
                disabled={isOutOfStock}
                className={`flex-grow py-4 px-8 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                  isOutOfStock 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-[#ff5c62] text-white hover:bg-[#ee4b51]'
                }`}
               >
                  {isOutOfStock ? (
                    <>Đã hết món</>
                  ) : (
                    <>
                      <ShoppingCart size={24} /> 
                      Thêm vào giỏ - {totalPrice.toLocaleString()}đ
                    </>
                  )}
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3"><Truck size={20} className="text-[#ff5c62]" /><span className="text-sm font-bold text-slate-700">Giao nhanh 30p</span></div>
               <div className="flex items-center gap-3"><ShieldCheck size={20} className="text-green-500" /><span className="text-sm font-bold text-slate-700">Chính hãng</span></div>
               <div className="flex items-center gap-3"><RefreshCw size={20} className="text-blue-500" /><span className="text-sm font-bold text-slate-700">Đổi trả 7 ngày</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
