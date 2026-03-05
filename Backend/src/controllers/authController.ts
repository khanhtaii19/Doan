import { Request, Response } from 'express';
import User from '../models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ADMIN_EMAIL, JWT_EXPIRE, JWT_SECRET } from '../config';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'user';

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      phone,
      role
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
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
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error
    });
  }
};
