
import React from 'react';
import { Facebook, Instagram, Send, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1221] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-1 mb-6">
            <span className="text-2xl font-extrabold">ShopWeb</span>
            <span className="text-2xl font-extrabold text-[#ff5c62]">Store</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-6">
            Chuyên cung cấp các dịch vụ ẩm thực chất lượng cao, mang đến những bữa ăn ngon miệng và an toàn cho gia đình bạn.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#ff5c62] transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#ff5c62] transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#ff5c62] transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Liên kết nhanh</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Trang chủ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Thực đơn</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Khuyến mãi</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Hỗ trợ</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Liên hệ hỗ trợ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Bản tin</h4>
          <p className="text-slate-400 mb-6">Đăng ký để nhận ưu đãi mới nhất.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email của bạn"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff5c62] transition-colors"
            />
            <button className="absolute right-2 top-2 bg-[#ff5c62] p-2 rounded-lg hover:bg-[#ee4b51] transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2024 ShopWebStore. All rights reserved. Designed with ❤️
      </div>
    </footer>
  );
};

export default Footer;
