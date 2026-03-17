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
      },
      {
        categoryId: categories[0]._id.toString(),
        name: 'Phở Bò Wagyu',
        description: 'Nước dùng thanh ngọt hầm từ xương bò 24h, kèm thịt bò Wagyu thái mỏng.',
        details: 'Sử dụng bánh phở tươi làm thủ công trong ngày.',
        price: 250000,
        costPrice: 150000,
        stock: 30,
        totalSold: 85,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=2000&auto=format&fit=crop'
  },
  {
        categoryId: categories[0]._id.toString(),
        name: 'Cơm Tấm Sườn Bẹ Nướng',
        description: 'Sườn bẹ nướng mật ong thơm lừng, ăn kèm chả trứng và bì thính.',
        details: 'Gạo tấm thơm đặc sản miền Tây.',
        price: 95000,
        costPrice: 45000,
        stock: 100,
        totalSold: 450,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop'
  },
  {
        categoryId: categories[0]._id.toString(),
        name: 'Mì Ý Carbonara',
        description: 'Sốt kem trứng béo ngậy, thịt xông khói giòn rụm và phô mai Parmesan.',
        details: 'Mì Ý nhập khẩu trực tiếp từ Ý.',
        price: 165000,
        costPrice: 80000,
        stock: 40,
        totalSold: 112,
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2071&auto=format&fit=crop'
  },
  {
        categoryId: categories[0]._id.toString(),
        name: 'Burger Bò Truffle',
        description: 'Thịt bò Angus nướng, sốt nấm Truffle đen và phô mai Brie.',
        details: 'Bánh mì Brioche nướng bơ thơm ngậy.',
        price: 215000,
        costPrice: 110000,
        stock: 25,
        totalSold: 67,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop'
  },
  {
        categoryId: categories[0]._id.toString(),
        name: 'Cá Hồi Áp Chảo',
        description: 'Cá hồi Na Uy áp chảo, sốt chanh dây chua ngọt và măng tây.',
        details: 'Cá hồi tươi nhập khẩu hàng ngày.',
        price: 320000,
        costPrice: 180000,
        stock: 20,
        totalSold: 34,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1974&auto=format&fit=crop'
  },
  {
        categoryId: categories[0]._id.toString(),
        name: 'Gà Nướng Thảo Mộc',
        description: 'Gà ta nướng chậm với lá hương thảo và tỏi, da giòn thịt mềm.',
        details: 'Gà được ướp thảo mộc trong 12h.',
        price: 280000,
        costPrice: 140000,
        stock: 15,
        totalSold: 28,
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=1976&auto=format&fit=crop'
  },
  {

        categoryId: categories[0]._id.toString(),
        name: 'Bún Chả Hà Nội',
        description: 'Chả miếng và chả viên nướng than hoa, nước mắm đu đủ xanh.',
        details: 'Công thức gia truyền từ phố cổ Hà Nội.',
        price: 85000,
        costPrice: 35000,
        stock: 60,
        totalSold: 320,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=2000&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Gỏi Cuốn Tôm Thịt',
        description: 'Tôm tươi, thịt ba chỉ, bún và rau sống cuốn trong bánh tráng.',
        details: 'Phục vụ kèm sốt tương đậu phộng béo ngậy.',
        price: 65000,
        costPrice: 25000,
        stock: 80,
        totalSold: 156,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Salad Caesar Gà',
        description: 'Xà lách Romaine, gà nướng, bánh mì giòn và sốt Caesar đặc trưng.',
        details: 'Phô mai Parmesan bào nhuyễn bên trên.',
        price: 125000,
        costPrice: 55000,
        stock: 45,
        totalSold: 89,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Súp Nấm Truffle',
        description: 'Súp kem nấm tổng hợp, dầu Truffle và kem tươi.',
        details: 'Phục vụ kèm bánh mì bơ tỏi.',
        price: 115000,
        costPrice: 50000,
        stock: 30,
        totalSold: 42,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Nem Rán Hà Nội',
        description: 'Nhân thịt lợn, mộc nhĩ, miến và tôm nõn, chiên giòn rụm.',
        details: 'Bánh đa nem loại đặc biệt giòn lâu.',
        price: 75000,
        costPrice: 30000,
        stock: 70,
        totalSold: 210,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Khoai Tây Chiên Phô Mai',
        description: 'Khoai tây sợi lớn chiên giòn, lắc bột phô mai mặn ngọt.',
        details: 'Khoai tây nhập khẩu từ Bỉ.',
        price: 55000,
        costPrice: 20000,
        stock: 120,
        totalSold: 540,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1974&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Cánh Gà Chiên Mắm',
        description: 'Cánh gà chiên giòn xóc sốt nước mắm tỏi ớt đậm đà.',
        details: 'Nước mắm Phú Quốc thượng hạng.',
        price: 135000,
        costPrice: 60000,
        stock: 40,
        totalSold: 187,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1980&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Bruschetta Cà Chua',
        description: 'Bánh mì nướng giòn, cà chua tươi, tỏi và lá húng tây.',
        details: 'Dầu oliu Extra Virgin.',
        price: 85000,
        costPrice: 35000,
        stock: 35,
        totalSold: 56,
        image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Chả Giò Hải Sản',
        description: 'Nhân tôm, mực và sốt mayonnaise, chiên xù giòn tan.',
        details: 'Lớp vỏ xù giòn rụm đặc biệt.',
        price: 95000,
        costPrice: 40000,
        stock: 50,
        totalSold: 134,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Salad Bơ Hạt Điều',
        description: 'Bơ sáp, hạt điều rang, rau mầm và sốt dầu giấm chanh dây.',
        details: 'Bơ sáp Đắk Lắk chọn lọc.',
        price: 110000,
        costPrice: 45000,
        stock: 30,
        totalSold: 72,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[1]._id.toString(),
        name: 'Súp Hải Sản Chua Cay',
        description: 'Tôm, mực, nấm và nước dùng chua cay kiểu Thái.',
        details: 'Gia vị Tomyum nhập khẩu.',
        price: 145000,
        costPrice: 65000,
        stock: 25,
        totalSold: 48,
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Mousse Chanh Dây',
        description: 'Lớp mousse mịn màng, vị chua thanh của chanh dây tươi.',
        details: 'Cốt bánh bông lan mềm mại.',
        price: 75000,
        costPrice: 30000,
        stock: 20,
        totalSold: 95,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1965&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Kem Dừa Côn Đảo',
        description: 'Kem dừa béo ngậy phục vụ trong gáo dừa, kèm xôi và lạc rang.',
        details: 'Dừa xiêm tươi Côn Đảo.',
        price: 65000,
        costPrice: 25000,
        stock: 40,
        totalSold: 280,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1944&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Bánh Flan Cốt Dừa',
        description: 'Bánh flan mềm mịn, nước cốt dừa béo và caramel đắng nhẹ.',
        details: 'Trứng gà ta tươi sạch.',
        price: 45000,
        costPrice: 15000,
        stock: 60,
        totalSold: 410,
        image: 'https://images.unsplash.com/photo-1590080873978-973a21728fbe?q=80&w=2018&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Chè Khúc Bạch',
        description: 'Khúc bạch phô mai, hạnh nhân lát và vải tươi.',
        details: 'Nước đường phèn thanh mát.',
        price: 55000,
        costPrice: 20000,
        stock: 50,
        totalSold: 320,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1944&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Brownie Socola',
        description: 'Bánh brownie socola đậm đà, hạt hạnh nhân giòn tan.',
        details: 'Socola đen 70% cacao.',
        price: 85000,
        costPrice: 35000,
        stock: 25,
        totalSold: 115,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1974&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Hộp Macaron Pháp',
        description: 'Hộp 6 cái macaron đa dạng hương vị: dâu, trà xanh, socola...',
        details: 'Bột hạnh nhân cao cấp.',
        price: 180000,
        costPrice: 80000,
        stock: 15,
        totalSold: 42,
        image: 'https://images.unsplash.com/photo-1569864358642-9d1619702663?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Panna Cotta Dâu',
        description: 'Kem nấu kiểu Ý, sốt dâu tây tươi mát lạnh.',
        details: 'Gelatin thực vật an toàn.',
        price: 70000,
        costPrice: 25000,
        stock: 30,
        totalSold: 126,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Cheesecake Việt Quất',
        description: 'Bánh phô mai nướng kiểu New York, sốt việt quất tươi.',
        details: 'Cream cheese Philadelphia.',
        price: 95000,
        costPrice: 45000,
        stock: 20,
        totalSold: 84,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Trái Cây Tươi',
        description: 'Đĩa trái cây tươi theo mùa: dưa hấu, xoài, thanh long, dứa.',
        details: 'Trái cây sạch VietGAP.',
        price: 120000,
        costPrice: 50000,
        stock: 15,
        totalSold: 56,
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070&auto=format&fit=crop'
  },
  {

        categoryId: categories[2]._id.toString(),
        name: 'Bánh Sừng Bò',
        description: 'Bánh sừng bò ngàn lớp, nhân trứng muối tan chảy.',
        details: 'Bơ lạt nhập khẩu từ Pháp.',
        price: 65000,
        costPrice: 25000,
        stock: 40,
        totalSold: 195,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1926&auto=format&fit=crop'
  },
  {

        categoryId: categories[0]._id.toString(),
        name: 'Sườn Cừu Nướng',
        description: 'Sườn cừu nướng sốt bạc hà, phục vụ kèm rau củ nướng.',
        details: 'Sườn cừu Úc thượng hạng.',
        price: 480000,
        costPrice: 300000,
        stock: 10,
        totalSold: 12,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop'
  },
  {

        categoryId: categories[0]._id.toString(),
        name: 'Pad Thai Tôm Càng',
        description: 'Hủ tiếu xào kiểu Thái với tôm càng xanh, trứng và lạc rang.',
        details: 'Sốt me gia truyền.',
        price: 195000,
        costPrice: 90000,
        stock: 35,
        totalSold: 145,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop'
  },
  {

        categoryId: categories[0]._id.toString(),
        name: 'Curry Gà Cay',
        description: 'Cà ri gà kiểu Ấn Độ, nước dùng béo ngậy từ cốt dừa và gia vị cay nồng.',
        details: 'Phục vụ kèm bánh mì hoặc cơm trắng.',
        price: 155000,
        costPrice: 70000,
        stock: 40,
        totalSold: 98,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1968&auto=format&fit=crop'
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
        title: 'Nghệ Thuật Thưởng Thức Ẩm Thực Chậm (Slow Food)',
        excerpt: 'Trong thế giới hối hả ngày nay, việc dành thời gian để thực sự thưởng thức một bữa ăn đã trở thành một xa xỉ phẩm...',
        content: ["Trong thế giới hối hả ngày nay, việc dành thời gian để thực sự thưởng thức một bữa ăn đã trở thành một xa xỉ phẩm. Phong trào Slow Food (Ẩm thực chậm) ra đời không chỉ để đối lập với Fast Food, mà còn để nhắc nhở chúng ta về giá trị của sự kết nối giữa con người, thực phẩm và trái đất.",
                  "Slow Food bắt đầu từ việc lựa chọn nguyên liệu. Đó là những nguyên liệu được nuôi trồng bền vững, không hóa chất, và tôn trọng mùa vụ. Khi chúng ta chọn một quả cà chua chín mọng từ vườn thay vì một quả cà chua công nghiệp, chúng ta đang thưởng thức hương vị thực sự của thiên nhiên.",
                  "\"Ăn chậm không chỉ là việc nhai kỹ, mà là việc cảm nhận câu chuyện đằng sau mỗi món ăn.\"",
                  "Nấu ăn cũng là một phần của nghệ thuật này. Thay vì sử dụng lò vi sóng hay những gói gia vị pha sẵn, hãy thử tự tay chuẩn bị nước dùng từ xương hầm, tự tay băm tỏi và cảm nhận mùi hương lan tỏa trong căn bếp. Quá trình chuẩn bị món ăn chính là lúc chúng ta gửi gắm tình cảm vào đó.",
                  "Cuối cùng, hãy thưởng thức bữa ăn cùng những người thân yêu. Một bữa tối không điện thoại, chỉ có tiếng cười và những câu chuyện sẻ chia sẽ làm món ăn trở nên ngon hơn gấp bội. Đó chính là ý nghĩa thực sự của ẩm thực - sự gắn kết và yêu thương."],
        date: new Date('05-3-2024'),
        category: 'Lối sống',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop',
        author: {
          name: 'Phạm Khánh Tài',
          avatar: 'https://picsum.photos/id/64/100/100',
          readTime: '10 phút đọc'
        },
        tags: ['#SlowFood', '#Lifestyle', '#CulinaryArt']
      },
      {
        title: 'Hành Trình Khám Phá Hương Vị Việt Qua Những Món Ăn Truyền Thống',
        excerpt: 'Ẩm thực Việt Nam không chỉ là những món ăn, mà là cả một kho tàng văn hóa được đúc kết qua hàng ngàn năm lịch sử...',
        content: ["Ẩm thực Việt Nam là một bức tranh đa sắc màu, phản ánh sự tinh tế và khéo léo của người Việt trong việc kết hợp các nguyên liệu tự nhiên. Từ bát Phở nóng hổi ở Hà Nội đến đĩa Cơm Tấm đậm đà ở Sài Gòn, mỗi món ăn đều mang trong mình một câu chuyện về vùng đất và con người nơi đó.",
                  "Triết lý âm dương ngũ hành được thể hiện rõ nét trong cách chế biến. Sự cân bằng giữa chua, cay, mặn, ngọt và đắng không chỉ tạo nên hương vị hài hòa mà còn rất tốt cho sức khỏe. Người Việt coi trọng rau xanh và các loại thảo mộc, biến chúng thành linh hồn của nhiều món ăn.",
                  "\"Món ăn Việt Nam là sự giao thoa tuyệt vời giữa truyền thống và sự sáng tạo không ngừng nghỉ.\"",
                  "Chúng ta không thể không nhắc đến nước mắm - 'quốc hồn quốc túy' của ẩm thực Việt. Một bát nước mắm tỏi ớt pha khéo có thể nâng tầm bất kỳ món ăn nào. Nó là sợi dây liên kết các thành viên trong mâm cơm, nơi mọi người cùng chấm chung một bát nước mắm, thể hiện sự đoàn kết và gắn bó.",
                  "Khám phá ẩm thực Việt là một hành trình không bao giờ kết thúc. Mỗi vùng miền lại có những đặc sản riêng, những cách chế biến riêng mà nếu chỉ nếm thử một lần, bạn sẽ khó lòng quên được. Hãy cùng chúng tôi gìn giữ và phát huy những giá trị trân quý này."],
        date: new Date('05-3-2024'),
        category: 'Văn hóa',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=2000&auto=format&fit=crop',
        author: {
          name: 'Phạm Khánh Tài',
          avatar: 'https://picsum.photos/id/64/100/100',
          readTime: '12 phút đọc'
        },
        tags: ['#VietnameseFood', '#Culture', '#Tradition']
      },
      {
    title: 'Bí Quyết Xây Dựng Lối Sống Lành Mạnh Bắt Đầu Từ Căn Bếp',
    excerpt: 'Sức khỏe không đến từ phòng gym, nó bắt đầu từ những gì bạn chọn cho vào giỏ hàng và chế biến trong căn bếp của mình...',
    date: new Date('05-3-2024'),
    category: 'Sức khỏe',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
    author: {
      name: 'Trần Thanh Mai',
      avatar: 'https://i.pravatar.cc/150?u=author3',
      readTime: '15 phút đọc'
    },
    content: [
      "Nhiều người lầm tưởng rằng lối sống lành mạnh là những gì đó rất cao siêu và khó thực hiện. Thực tế, nó bắt đầu từ những thay đổi nhỏ nhất ngay trong căn bếp của bạn. Một chế độ ăn uống cân bằng là nền tảng vững chắc cho một cơ thể khỏe mạnh và một tinh thần minh mẫn.",
      "Nguyên tắc đầu tiên là ưu tiên thực phẩm nguyên bản (Whole Foods). Hãy hạn chế tối đa các loại thực phẩm chế biến sẵn, chứa nhiều chất bảo quản và đường tinh luyện. Thay vào đó, hãy lấp đầy tủ lạnh bằng rau củ tươi, trái cây mọng nước và các loại hạt ngũ cốc.",
      "\"Căn bếp là nơi khởi nguồn của sức khỏe, hãy biến nó thành một hiệu thuốc tự nhiên cho gia đình bạn.\"",
      "Cách chế biến cũng quan trọng không kém nguyên liệu. Thay vì chiên xào nhiều dầu mỡ, hãy thử các phương pháp như hấp, luộc hoặc nướng áp chảo để giữ lại tối đa chất dinh dưỡng. Việc sử dụng các loại gia vị tự nhiên như gừng, nghệ, tỏi không chỉ tăng hương vị mà còn giúp tăng cường hệ miễn dịch.",
      "Cuối cùng, hãy học cách lắng nghe cơ thể. Ăn khi đói và dừng lại khi vừa đủ no. Việc ăn uống có ý thức (Mindful Eating) giúp bạn thưởng thức món ăn trọn vẹn hơn và tránh được tình trạng ăn quá mức. Hãy bắt đầu hành trình chăm sóc sức khỏe của bạn ngay hôm nay, từ chính căn bếp thân yêu."
    ],
    tags: ['#HealthyEating', '#Wellness', '#KitchenTips']
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
