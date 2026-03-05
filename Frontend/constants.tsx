
import { Category, Product, Coupon, FoodItem, BlogPost, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Nguyễn Văn A',
    email: 'vana@example.com',
    phone: '0901234567',
    role: 'user',
    memberLevel: 'Diamond',
    totalSpent: 15000000,
    joinedAt: '2023-01-15',
    avatar: 'https://i.pravatar.cc/150?u=u1'
  },
  {
    id: 'u-2',
    name: 'Trần Thị B',
    email: 'thib@example.com',
    phone: '0912345678',
    role: 'user',
    memberLevel: 'Gold',
    totalSpent: 5500000,
    joinedAt: '2023-05-20',
    avatar: 'https://i.pravatar.cc/150?u=u2'
  },
  {
    id: 'u-3',
    name: 'Lê Văn C',
    email: 'vanc@example.com',
    phone: '0987654321',
    role: 'user',
    memberLevel: 'Silver',
    totalSpent: 1200000,
    joinedAt: '2023-11-10',
    avatar: 'https://i.pravatar.cc/150?u=u3'
  },
  {
    id: 'admin-1',
    name: 'Quản Trị Viên',
    email: 'admin@shop.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Món Chính',
    description: 'Các món ăn no nê, đậm đà hương vị truyền thống và hiện đại.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop'
  },
  {
    id: 'cat-2',
    name: 'Khai Vị',
    description: 'Bắt đầu bữa tiệc với những món nhẹ nhàng, kích thích vị giác.',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'cat-3',
    name: 'Tráng Miệng',
    description: 'Kết thúc ngọt ngào với các loại bánh và kem đặc sắc.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1944&auto=format&fit=crop'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    categoryId: 'cat-1',
    name: 'Pizza Hải Sản Pesto',
    description: 'Sự kết hợp hoàn hảo giữa tôm, mực tươi và sốt pesto xanh mướt.',
    details: 'Được làm từ bột tươi ủ 24h, nướng trong lò gạch truyền thống.',
    price: 220000,
    salePrice: 185000,
    costPrice: 120000,
    stock: 50,
    totalSold: 124,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    promotionText: 'Giảm giá 15% cho thành viên mới'
  },
  {
    id: 'p-2',
    categoryId: 'cat-1',
    name: 'Steak Thăn Nội Bò Mỹ',
    description: 'Thịt thăn mềm tan, phục vụ kèm khoai tây nghiền và sốt vang đỏ.',
    details: 'Thịt bò Black Angus được chọn lọc kỹ lưỡng.',
    price: 450000,
    costPrice: 280000,
    stock: 20,
    totalSold: 45,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop',
    promotionText: 'Tặng 1 ly vang đỏ kèm theo'
  },
  {
    id: 'p-3',
    categoryId: 'cat-3',
    name: 'Tiramisu Cổ Điển',
    description: 'Hương vị cà phê nồng nàn quyện cùng lớp kem béo ngậy.',
    details: 'Bánh được làm theo công thức truyền thống từ vùng Treviso.',
    price: 85000,
    salePrice: 75000,
    costPrice: 40000,
    stock: 15,
    totalSold: 210,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1974&auto=format&fit=crop'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'HELLO2026',
    discountPercent: 10,
    limit: 100,
    usedCount: 5,
    expiryDate: '2026-12-31'
  }
];

export const FEATURED_FOODS: FoodItem[] = [
  {
    id: '1',
    name: 'Pizza Hải Sản ',
    description: 'Tươi ngon từ biển cả, phô mai tan chảy',
    price: '185.000đ',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    isBestSeller: true
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Bí quyết chọn nguyên liệu tươi sạch cho bữa ăn gia đình',
    excerpt: 'Việc chọn lựa nguyên liệu đầu vào quyết định 80% độ ngon của món ăn...',
    date: '12 Tháng 10, 2023',
    category: 'Mẹo nấu ăn',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974&auto=format&fit=crop'
  }
];

export const DETAILED_POST: BlogPost = {
  id: '10-cach-an-uong',
  title: '10 Cách Ăn Uống Lành Mạnh Mỗi Ngày Để Duy Trì Vóc Dáng',
  excerpt: 'Xây dựng một chế độ ăn uống lành mạnh không có nghĩa là bạn phải từ bỏ hoàn toàn những món ăn yêu thích.',
  date: '22 Tháng 5, 2024',
  category: 'Sống khỏe',
  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
  author: {
    name: 'Phạm Khánh Tai',
    avatar: 'https://picsum.photos/id/64/100/100',
    date: '22 Tháng 5, 2024',
    readTime: '8 phút đọc'
  },
  content: [
    "Xây dựng một chế độ ăn uống lành mạnh không có nghĩa là bạn phải từ bỏ hoàn toàn những món ăn yêu thích."
  ],
  tags: ['#HealthyLife', '#Nutrition', '#FoodTips']
};
