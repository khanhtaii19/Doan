import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController';

const router = express.Router();

// Routes
router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);

export default router;
