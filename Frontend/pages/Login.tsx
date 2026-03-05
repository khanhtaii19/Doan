
import React, { useState } from 'react';
// Added X to the import list to fix "Cannot find name 'X'" error
import { Mail, Lock, User as UserIcon, ArrowRight, Github, Chrome, X } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication logic
    if (isRegister) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        name,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${name}&background=ff5c62&color=fff`
      };
      onLogin(newUser);
    } else {
      // Check for hardcoded accounts
      if (email === 'admin@shop.com' && password === 'admin123') {
        onLogin({
          id: 'admin-1',
          email: 'admin@shop.com',
          name: 'Phạm Khánh Tài',
          role: 'admin',
          avatar: 'https://picsum.photos/id/64/100/100'
        });
      } else if (email === 'user@shop.com' && password === 'user123') {
        onLogin({
          id: 'user-1',
          email: 'user@shop.com',
          name: 'Khách hàng 01',
          role: 'user'
        });
      } else {
        alert('Thông tin đăng nhập không chính xác!\nAdmin: admin@shop.com / admin123\nUser: user@shop.com / user123');
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Decorative Content */}
        <div className="md:w-1/2 bg-[#0b1221] p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5c62] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-1 mb-12">
              <span className="text-2xl font-extrabold">ShopWeb</span>
              <span className="text-2xl font-extrabold text-[#ff5c62]">Store</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              Tham gia cùng <br /> cộng đồng <br /> <span className="text-[#ff5c62]">Thực Thần</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Đăng nhập để nhận ưu đãi đặc biệt và lưu lại những món ăn yêu thích của bạn.
            </p>
          </div>

          <div className="relative z-10 pt-10 border-t border-slate-800">
             <div className="flex -space-x-3 mb-4">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">+2k</div>
             </div>
             <p className="text-sm text-slate-500 font-medium italic">Hơn 2,000+ thành viên đã đăng ký</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:w-1/2 p-12 lg:p-16">
          <div className="mb-10 flex justify-between items-center">
             <div>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">
                 {isRegister ? 'Tạo tài khoản' : 'Chào mừng trở lại!'}
               </h2>
               <p className="text-slate-400 font-medium">Vui lòng điền thông tin bên dưới.</p>
             </div>
             <button onClick={onBack} className="text-slate-400 hover:text-slate-900 transition-colors">
               <X />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">Họ và tên</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#ff5c62] focus:ring-1 focus:ring-red-100 font-medium transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#ff5c62] focus:ring-1 focus:ring-red-100 font-medium transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#ff5c62] focus:ring-1 focus:ring-red-100 font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isRegister && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-bold text-[#ff5c62] hover:underline">Quên mật khẩu?</button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#ff5c62] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#ee4b51] transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3 group"
            >
              {isRegister ? 'Đăng ký ngay' : 'Đăng nhập'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 relative">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
             <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold"><span className="bg-white px-4 text-slate-400">Hoặc tiếp tục với</span></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-3 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-600">
               <Chrome size={20} className="text-red-500" /> Google
             </button>
             <button className="flex items-center justify-center gap-3 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-600">
               <Github size={20} /> Github
             </button>
          </div>

          <div className="mt-10 text-center">
             <p className="text-slate-500 font-medium">
               {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} {' '}
               <button 
                onClick={() => setIsRegister(!isRegister)}
                className="font-bold text-[#ff5c62] hover:underline"
               >
                 {isRegister ? 'Đăng nhập tại đây' : 'Đăng ký miễn phí'}
               </button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
