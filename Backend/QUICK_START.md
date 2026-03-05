# 🚀 Backend Setup Guide

## 📋 Bước 1: Cài Đặt Dependencies

```bash
cd Backend
npm install
```

## 🔧 Bước 2: Cấu Hình MongoDB

### Tùy chọn A: MongoDB Local (Recommended for Development)

1. Tải MongoDB Community từ: https://www.mongodb.com/try/download/community
2. Cài đặt và khởi động MongoDB
3. Kiểm tra kết nối: `mongosh`

### Tùy chọn B: MongoDB Atlas (Cloud)

1. Đăng ký tài khoản tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster và lấy connection string
3. Cập nhật `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gourmet-shop
```

## ⚙️ Bước 3: Cấu Hình Environment

File `.env` đã được tạo sẵn. Kiểm tra các giá trị:

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gourmet-shop
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@shop.com
```

**⚠️ Lưu ý:** 
- Đổi `JWT_SECRET` trước khi deploy
- Đảm bảo `CORS_ORIGIN` khớp với port của Frontend

## 🌱 Bước 4: Seed Database (Tạo Dữ Liệu Mẫu)

```bash
npm run seed
```

Lệnh này sẽ:
- ✅ Kết nối MongoDB
- ✅ Xóa dữ liệu cũ
- ✅ Thêm dữ liệu mẫu (Users, Products, Orders, Coupons, Blog Posts)

**Output:**
```
✅ Connected to MongoDB
🧹 Cleared existing data
✅ Seeded 3 users
✅ Seeded 3 categories
✅ Seeded 3 products
✅ Seeded 2 coupons
✅ Seeded 2 blog posts
🎉 Database seeding completed successfully!
```

## 🎯 Bước 5: Chạy Server

### Development Mode (với auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## ✅ Kiểm Tra Server

Mở browser hoặc Postman:

```
GET http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 🔐 Test Đăng Nhập

### Register User
```bash
POST http://localhost:5000/api/auth/register
Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "0987654321"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "admin@shop.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "id": "...",
    "email": "admin@shop.com",
    "name": "Quản Trị Viên",
    "role": "admin"
  }
}
```

## 📦 Test API Endpoints

### Get Products
```bash
GET http://localhost:5000/api/products
```

### Get Orders
```bash
GET http://localhost:5000/api/orders
```

### Get Blog Posts
```bash
GET http://localhost:5000/api/blog
```

## 🔗 Kết Nối Frontend

Trong Frontend project, cập nhật API base URL:

```typescript
// Frontend/src/api/client.ts
const API_URL = 'http://localhost:5000/api';
```

## 📝 Dữ Liệu Mẫu Sau Seed

### Users
| Email | Password | Role |
|-------|----------|------|
| vana@example.com | 123456 | user |
| thib@example.com | 123456 | user |
| admin@shop.com | 123456 | admin |

### Products
- Pizza Hải Sản Pesto - 185.000₫
- Steak Thăn Nội Bò Mỹ - 450.000₫
- Tiramisu Cổ Điển - 75.000₫

### Coupons
- `HELLO2026` - Giảm 10%
- `WELCOME50` - Giảm 50%

## 🐛 Troubleshooting

### MongoDB không kết nối
```bash
# Check MongoDB service
mongosh

# Nếu lỗi, restart MongoDB service
# Windows: mongo --version hoặc check Windows Services
```

### Port 5000 đã được sử dụng
```bash
# Thay đổi PORT trong .env
PORT=5001
```

### CORS Error
- Kiểm tra `CORS_ORIGIN` trong `.env`
- Đảm bảo Frontend chạy trên đúng port

## 🎉 Hoàn Tất!

Backend API đã sẵn sàng. Bạn có thể:
1. ✅ Gọi API từ Frontend
2. ✅ Quản lý sản phẩm, đơn hàng, blog
3. ✅ Xác thực người dùng

**Tiếp theo:**
- [ ] Thêm validation middleware
- [ ] Thêm error handling
- [ ] Deploy lên server production
- [ ] Cấu hình HTTPS/SSL
