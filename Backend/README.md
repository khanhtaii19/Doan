# 🍽️ Gourmet Shop Backend API

Backend cho ứng dụng web bán hàng & blog Gourmet Food using **Express.js**, **MongoDB**, và **TypeScript**.

## 📋 Tính Năng

- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Xác thực người dùng (Register/Login)
- ✅ Quản lý bài viết blog
- ✅ Hỗ trợ mã giảm giá

## 🛠️ Cài Đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gourmet-shop
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@shop.com
```

### 3. Chạy server ở chế độ development
```bash
npm run dev
```

Server sẽ khởi động tại: `http://localhost:5000`

## 📚 API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn (Admin)

### Auth
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/users` - Lấy danh sách người dùng (Admin)

### Blog
- `GET /api/blog` - Lấy danh sách bài viết
- `GET /api/blog/:id` - Lấy bài viết chi tiết
- `POST /api/blog` - Tạo bài viết (Admin)

## 🏗️ Cấu Trúc Thư Mục

```
Backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── services/        # Business services
│   └── server.ts        # Entry point
├── dist/                # Compiled JavaScript
├── .env                 # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Scripts

- `npm run dev` - Chạy ở chế độ development
- `npm run build` - Biên dịch TypeScript
- `npm start` - Chạy server production

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS handling
- **dotenv** - Environment variables

## ⚙️ Tiếp Theo

    - [ ] Thêm authentication middleware
    - [ ] Thêm validation schemas
    - [ ] Thêm error handling
    - [ ] Thêm logging
- [ ] Deploy lên production

## 📝 Ghi Chú

- Thay đổi `MONGODB_URI` trong `.env` để kết nối với MongoDB Atlas
- Luôn thay đổi `JWT_SECRET` khi deploy
- Đặt `ADMIN_EMAIL` trong `.env` để email này luôn đăng nhập với quyền `admin`
- Thêm authentication middleware cho các route cần bảo vệ
