import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const getCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error
    });
  }
};
