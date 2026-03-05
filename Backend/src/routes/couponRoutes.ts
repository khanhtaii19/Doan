import express from 'express';
import { getCoupons } from '../controllers/couponController';

const router = express.Router();

router.get('/', getCoupons);

export default router;
