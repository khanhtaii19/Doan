import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Coupon from './models/Coupon';
import BlogPost from './models/BlogPost';
import bcryptjs from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://phamkhanhtaii_db_user:1234567890a@cluster0.ahzvi1w.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await BlogPost.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Seed Users
    const hashedPassword = await bcryptjs.hash('123456', 10);
    const users = await User.insertMany([
      {
        name: 'Nguyễn Văn A',
        email: 'vana@example.com',
        password: hashedPassword,
        phone: '0901234567',
        role: 'user',
        memberLevel: 'Diamond',
        totalSpent: 15000000,
        avatar: 'https://i.pravatar.cc/150?u=u1'
      },
      {
        name: 'Trần Thị B',
        email: 'thib@example.com',
        password: hashedPassword,
        phone: '0912345678',
        role: 'user',
        memberLevel: 'Gold',
        totalSpent: 5500000,
        avatar: 'https://i.pravatar.cc/150?u=u2'
      },
      {
        name: 'Quản Trị Viên',
        email: 'admin@shop.com',
        password: hashedPassword,
        role: 'admin',
        memberLevel:'Diamond',
        avatar: 'https://i.pravatar.cc/150?u=admin'
      }
    ]);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed Categories
    const categories = await Category.insertMany([
      {
        name: 'Món Chính',
        description: 'Các món ăn no nê, đậm đà hương vị truyền thống và hiện đại.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop'
      },
      {
        name: 'Khai Vị',
        description: 'Bắt đầu bữa tiệc với những món nhẹ nhàng, kích thích vị giác.',
        image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop'
      },
      {
        name: 'Tráng Miệng',
        description: 'Kết thúc ngọt ngào với các loại bánh và kem đặc sắc.',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1944&auto=format&fit=crop'
      }
    ]);
    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed Products
    const products = await Product.insertMany([
      {
        categoryId: categories[0]._id.toString(),
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
        categoryId: categories[0]._id.toString(),
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
        categoryId: categories[2]._id.toString(),
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
    ]);
    console.log(`✅ Seeded ${products.length} products`);

    // Seed Coupons
    const coupons = await Coupon.insertMany([
      {
        code: 'HELLO2026',
        discountPercent: 10,
        limit: 100,
        usedCount: 5,
        expiryDate: new Date('2026-12-31')
      },
      {
        code: 'WELCOME50',
        discountPercent: 50,
        limit: 50,
        usedCount: 0,
        expiryDate: new Date('2026-06-30')
      }
    ]);
    console.log(`✅ Seeded ${coupons.length} coupons`);

    // Seed Blog Posts
    const posts = await BlogPost.insertMany([
      {
        title: 'Bí quyết chọn nguyên liệu tươi sạch cho bữa ăn gia đình',
        excerpt: 'Việc chọn lựa nguyên liệu đầu vào quyết định 80% độ ngon của món ăn...',
        content: ['Việc chọn lựa nguyên liệu đầu vào quyết định 80% độ ngon của món ăn.', 'Hãy chọn những nguyên liệu tươi nhất từ các nhà cung cấp uy tín.'],
        date: new Date('2023-10-12'),
        category: 'Mẹo nấu ăn',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974&auto=format&fit=crop',
        author: {
          name: 'Phạm Khánh Tài',
          avatar: 'https://picsum.photos/id/64/100/100',
          readTime: '5 phút đọc'
        },
        tags: ['#NguyênLiệu', '#CookTips']
      },
      {
        title: '10 Cách Ăn Uống Lành Mạnh Mỗi Ngày Để Duy Trì Vóc Dáng',
        excerpt: 'Xây dựng một chế độ ăn uống lành mạnh không có nghĩa là bạn phải từ bỏ hoàn toàn những món ăn yêu thích.',
        content: ['Xây dựng một chế độ ăn uống lành mạnh không có nghĩa là bạn phải từ bỏ hoàn toàn những món ăn yêu thích.'],
        date: new Date('2024-05-22'),
        category: 'Sống khỏe',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
        author: {
          name: 'Phạm Khánh Tài',
          avatar: 'https://picsum.photos/id/64/100/100',
          readTime: '8 phút đọc'
        },
        tags: ['#HealthyLife', '#Nutrition', '#FoodTips']
      }
    ]);
    console.log(`✅ Seeded ${posts.length} blog posts`);

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
