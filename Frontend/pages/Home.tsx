
import React from 'react';
import { Play, Star, ChevronRight, ShoppingBag } from 'lucide-react';
import { FEATURED_FOODS, BLOG_POSTS } from '../constants';

interface HomeProps {
  onNavigateBlog: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigateBlog }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8 text-slate-900">
            Hương Vị <br />
            <span className="italic text-[#ff5c62]">Tình Thân</span> <br />
            Trong Từng <br />
            Món Ăn
          </h1>
          <p className="text-slate-500 text-lg max-w-md leading-relaxed mb-10">
            Trải nghiệm ẩm thực tuyệt vời được chế biến từ những nguyên liệu tươi ngon nhất, mang đến sự ấm áp cho mọi bữa ăn gia đình.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button className="bg-[#ff5c62] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#ee4b51] transition-all shadow-xl shadow-red-200">
              Xem Thực Đơn
            </button>
            <button className="flex items-center gap-3 font-bold text-slate-700 hover:text-[#ff5c62] transition-colors group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play fill="currentColor" size={16} />
              </div>
              Xem Giới Thiệu
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative">
          {/* Rounded frame image */}
          <div className="relative w-full aspect-square max-w-[500px] mx-auto">
             <div className="absolute inset-0 bg-[#f8f9fa] rounded-[4rem] rotate-3"></div>
             <div className="absolute inset-0 overflow-hidden rounded-[4rem] border-8 border-white shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop" 
                 alt="Main Dish" 
                 className="w-full h-full object-cover"
               />
             </div>
             
             {/* Floating Badges */}
             <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
               <div className="text-right">
                 <div className="flex items-center gap-1 font-bold text-lg">5.0 <Star size={16} className="fill-yellow-400 text-yellow-400" /></div>
                 <div className="text-[10px] text-slate-400 font-medium">Đánh giá tốt nhất</div>
               </div>
             </div>
             
             <div className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-2xl shadow-xl">
               <div className="font-bold text-slate-800">Giao hàng nhanh 24/7</div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Food Section */}
      <section className="bg-[#fcfcfc] py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1.5 after:bg-[#ff5c62] after:rounded-full">
              Món Ăn Nổi Bật
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURED_FOODS.map((food) => (
              <div key={food.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-72 overflow-hidden">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {food.isBestSeller && (
                    <span className="absolute top-6 left-6 bg-[#ff5c62] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="p-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{food.name}</h3>
                    <p className="text-slate-500 mb-4">{food.description}</p>
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold text-[#ff5c62]">{food.price}</span>
                        {food.id === '2' && (
                            <button className="text-[#ff5c62] font-bold text-sm hover:underline">Thêm giỏ hàng</button>
                        )}
                    </div>
                  </div>
                  {food.id === '1' && (
                    <button className="w-12 h-12 bg-red-50 text-[#ff5c62] rounded-2xl flex items-center justify-center hover:bg-[#ff5c62] hover:text-white transition-colors">
                        <ShoppingBag size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Blog Ẩm Thực</h2>
            <p className="text-slate-500">Chia sẻ bí quyết và cảm hứng nấu ăn mỗi ngày</p>
          </div>
          <button 
            onClick={onNavigateBlog}
            className="flex items-center gap-2 text-[#ff5c62] font-bold hover:gap-4 transition-all"
          >
            Xem tất cả bài viết <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div 
                key={post.id} 
                className="group cursor-pointer"
                onClick={onNavigateBlog}
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex gap-4 text-slate-400 text-[13px] font-medium mb-3">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#ff5c62] transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
