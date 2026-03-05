
import React, { useState } from 'react';
import { User, Order } from '../types';
import { Search, User as UserIcon, Calendar, CreditCard, ChevronRight, Award, History, Filter, ArrowLeft } from 'lucide-react';

interface CRMProps {
  users: User[];
  orders: Order[];
  onBack: () => void;
}

const CRM: React.FC<CRMProps> = ({ users, orders, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>('All');

  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (levelFilter === 'All' || u.memberLevel === levelFilter) &&
    u.role !== 'admin'
  );

  const getUserOrders = (userId: string) => {
    return orders.filter(o => o.userId === userId);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Diamond': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Silver': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Quản Lý Khách Hàng (CRM)</h1>
              <p className="text-slate-500 font-medium">Theo dõi hành vi mua sắm và phân hạng thành viên.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200">
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm tên, email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:border-[#ff5c62] transition-all focus:bg-white"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['All', 'Diamond', 'Gold', 'Silver'].map(level => (
                    <button
                      key={level}
                      onClick={() => setLevelFilter(level)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${levelFilter === level ? 'bg-[#ff5c62] text-white border-[#ff5c62]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#ff5c62]'}`}
                    >
                      {level === 'All' ? 'Tất cả' : level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedUser?.id === user.id ? 'bg-red-50 border-[#ff5c62] shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getLevelColor(user.memberLevel)}`}>
                      {user.memberLevel}
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="py-12 text-center text-slate-400 italic">Không tìm thấy khách hàng nào.</div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Detail & History */}
          <div className="lg:col-span-2 space-y-6">
            {selectedUser ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Profile Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -z-0"></div>
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                      <img src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.name}`} alt={selectedUser.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-3xl font-black text-slate-900">{selectedUser.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${getLevelColor(selectedUser.memberLevel)}`}>
                          {selectedUser.memberLevel} Member
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-slate-500 font-medium">
                        <div className="flex items-center gap-2"><UserIcon size={16} /> {selectedUser.email}</div>
                        <div className="flex items-center gap-2"><CreditCard size={16} /> {selectedUser.phone || 'Chưa cập nhật'}</div>
                        <div className="flex items-center gap-2"><Calendar size={16} /> Tham gia: {selectedUser.joinedAt || '2024-01-01'}</div>
                      </div>
                    </div>
                    <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl min-w-[180px]">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Tổng chi tiêu</div>
                      <div className="text-2xl font-black">{(selectedUser.totalSpent || 0).toLocaleString()}đ</div>
                    </div>
                  </div>
                </div>

                {/* Purchase History */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <History className="text-[#ff5c62]" /> Lịch sử mua hàng
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {getUserOrders(selectedUser.id).length} Đơn hàng
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/80 border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã đơn</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ngày đặt</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng tiền</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {getUserOrders(selectedUser.id).map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 font-bold text-slate-900">#{order.id.split('-')[1]}</td>
                            <td className="px-8 py-6 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td className="px-8 py-6">
                              <div className="text-sm font-medium text-slate-700">
                                {order.items[0]?.product.name} {order.items.length > 1 ? `+${order.items.length - 1}` : ''}
                              </div>
                            </td>
                            <td className="px-8 py-6 font-black text-slate-900">{order.totalAmount.toLocaleString()}đ</td>
                            <td className="px-8 py-6 text-right">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {order.status === 'completed' ? 'Hoàn tất' : order.status === 'processing' ? 'Đang xử lý' : 'Chờ duyệt'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {getUserOrders(selectedUser.id).length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">Chưa có lịch sử mua hàng.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <UserIcon size={40} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Chọn khách hàng</h3>
                <p className="max-w-xs">Chọn một khách hàng từ danh sách bên trái để xem chi tiết thông tin và lịch sử mua hàng.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRM;
