
import React from 'react';
import { Moon, Menu, X, ShoppingCart, User as UserIcon, LogOut, Package } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (page: any) => void;
  currentPage: string;
  currentUser: User | null;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, currentUser, onLogout, cartCount, onOpenCart }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Trang chủ', id: 'home', minRole: 'guest' },
    { label: 'Cửa hàng', id: 'shop', minRole: 'guest' },
    { label: 'Blog', id: 'blog', minRole: 'guest' },
    { label: 'Đơn hàng', id: 'orders', minRole: 'guest' },
    { label: 'Quản trị', id: 'admin', minRole: 'admin' },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.minRole === 'admin') return currentUser?.role === 'admin';
    return true;
  });

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => onNavigate('home')}>
          <span className="text-2xl font-extrabold text-slate-800">Nghien</span>
          <span className="text-2xl font-extrabold text-[#ff5c62]">Food</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`text-[15px] font-bold transition-all ${
                currentPage === item.id ? 'text-[#ff5c62]' : 'text-slate-600 hover:text-[#ff5c62]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button onClick={onOpenCart} className="relative text-slate-600 hover:text-slate-900 transition-colors p-2">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff5c62] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-100">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900 leading-none mb-1">{currentUser.name}</div>
                <div className="text-[10px] font-bold text-[#ff5c62] uppercase tracking-wider">{currentUser.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</div>
              </div>
              <div className="relative group">
                <img 
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&background=ff5c62&color=fff`} 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer" alt="avatar" 
                />
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 w-48">
                    <button onClick={() => onNavigate('orders')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors mb-1">
                      <Package size={16} /> Đơn hàng
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-[#ff5c62] rounded-lg transition-colors">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} className="bg-[#ff5c62] text-white px-7 py-2.5 rounded-full font-semibold hover:bg-[#ee4b51] transition-all shadow-lg shadow-red-200 flex items-center gap-2">
              <UserIcon size={18} /> Đăng nhập
            </button>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 absolute w-full top-20 left-0 py-4 px-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            {visibleNavItems.map((item) => (
              <button key={item.id} onClick={() => { onNavigate(item.id as any); setIsMenuOpen(false); }} className="text-left py-2 font-medium text-slate-600 hover:text-[#ff5c62]">
                {item.label}
              </button>
            ))}
            <button onClick={onOpenCart} className="text-left py-2 font-medium text-slate-600 flex items-center gap-2">
               <ShoppingCart size={18} /> Giỏ hàng ({cartCount})
            </button>
            {currentUser ? (
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-left py-2 font-medium text-red-500 flex items-center gap-2">
                <LogOut size={18} /> Đăng xuất
              </button>
            ) : (
              <button onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} className="bg-[#ff5c62] text-white py-3 rounded-xl font-bold">Đăng nhập</button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
