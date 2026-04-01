import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Routes
router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
