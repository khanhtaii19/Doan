
import React, { useState } from 'react';
import { ShoppingBag, Star, Tag, ChevronRight } from 'lucide-react';
import { Product, Category } from '../types';

interface ShopProps {
  products: Product[];
  categories: Category[];
  onViewDetail: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ products, categories, onViewDetail }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.categoryId === selectedCategoryId)
    : products;

  const currentCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Banner */}
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative p-12 lg:p-20 mb-16">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover" 
              alt="Banner"
            />
          </div>
          <div className="relative z-10 max-w-lg">
            <span className="bg-[#ff5c62] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">
              Ưu đãi tháng 5
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Giảm ngay 20% cho <br /> thực đơn Hải Sản
            </h1>
            <button className="bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold hover:bg-[#ff5c62] hover:text-white transition-all">
              Săn mã ngay
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Khám phá danh mục</h2>
            <button 
                onClick={() => setSelectedCategoryId(null)}
                className={`text-sm font-bold ${!selectedCategoryId ? 'text-[#ff5c62]' : 'text-slate-400'}`}
            >
              Tất cả sản phẩm
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`group cursor-pointer rounded-3xl p-6 transition-all border-2 ${
                  selectedCategoryId === cat.id 
                  ? 'border-[#ff5c62] bg-red-50/50' 
                  : 'border-gray-100 hover:border-red-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                    <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#ff5c62] transition-colors">{cat.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{cat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Listing */}
        <div>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                {currentCategory ? currentCategory.name : 'Tất cả thực đơn'}
              </h2>
              <p className="text-slate-400">Chúng tôi luôn sẵn sàng phục vụ bạn tốt nhất</p>
            </div>
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
               <button className="px-4 py-2 bg-white rounded-lg text-xs font-bold shadow-sm">Phổ biến nhất</button>
               <button className="px-4 py-2 text-xs font-bold text-slate-400">Mới nhất</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div 
                key={p.id} 
                className="group bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div 
                    className="relative aspect-square rounded-[2rem] overflow-hidden mb-6 cursor-pointer"
                    onClick={() => onViewDetail(p)}
                >
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                  {p.salePrice && (
                    <div className="absolute top-4 left-4 bg-[#ff5c62] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Tag size={12} /> SALE
                    </div>
                  )}
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-[#ff5c62] shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <ShoppingBag size={20} />
                  </button>
                </div>
                
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <span className="text-slate-400 text-[10px] font-bold ml-1">5.0</span>
                  </div>
                  <h3 
                    className="text-xl font-bold text-slate-900 mb-2 hover:text-[#ff5c62] transition-colors cursor-pointer"
                    onClick={() => onViewDetail(p)}
                  >
                    {p.name}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-extrabold text-[#ff5c62]">
                        {(p.salePrice || p.price).toLocaleString()}đ
                      </span>
                      {p.salePrice && (
                        <span className="text-sm text-slate-300 line-through decoration-slate-300">
                          {p.price.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onViewDetail(p)}
                      className="text-slate-900 font-bold text-sm flex items-center gap-1 hover:text-[#ff5c62] transition-colors"
                    >
                      Chi tiết <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-slate-400 font-medium italic">Hiện chưa có sản phẩm nào trong danh mục này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
