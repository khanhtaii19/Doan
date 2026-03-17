import { Request, Response } from 'express';
import User from '../models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_EXPIRE, JWT_SECRET } from '../config';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const shouldAllowEnvAdminPassword = (email: string) =>
  email === ADMIN_EMAIL && Boolean(ADMIN_PASSWORD);

const isBcryptHash = (value: string) => /^\$2[aby]\$\d{2}\$/.test(value);


export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user';

    const user = new User({ email: normalizedEmail, password: hashedPassword, name, phone, role });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const inputPassword = String(password ?? '');

    // Hỗ trợ dữ liệu cũ có thể lưu password dạng plain text trong DB.
    // Nếu đăng nhập thành công với plain text thì tự động nâng cấp sang bcrypt hash.
    let isPasswordValidByDb = false;
    if (typeof user.password === 'string' && user.password.length > 0) {
      if (isBcryptHash(user.password)) {
        isPasswordValidByDb = await bcryptjs.compare(inputPassword, user.password);
      } else {
        isPasswordValidByDb = inputPassword === user.password;
        if (isPasswordValidByDb) {
          user.password = await bcryptjs.hash(inputPassword, 10);
          await user.save();
        }
      }
    }

    // Với tài khoản admin, cho phép thêm 1 đường đăng nhập bằng ADMIN_PASSWORD trong .env
    // nhưng không override kết quả kiểm tra mật khẩu lưu trong DB.
    const isPasswordValidByEnvAdmin = shouldAllowEnvAdminPassword(normalizedEmail)
      ? inputPassword === ADMIN_PASSWORD
      : false;

    const isPasswordValid = isPasswordValidByDb || isPasswordValidByEnvAdmin;
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Sai mat khau' });
    }

    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : user.role;

    if (role === 'admin' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE as jwt.SignOptions['expiresIn'] }
    );
    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: { id: user._id, email: user.email, name: user.name, role, avatar: user.avatar }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Error logging in', error });
  }
};

// GET /api/auth/me — dùng token để lấy thông tin user hiện tại
export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        memberLevel: user.memberLevel,
        totalSpent: user.totalSpent
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error });
  }
};

