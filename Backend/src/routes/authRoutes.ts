import express from 'express';
import { register, login, getMe, getUsers, updateUserByAdmin } from '../controllers/authController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);          // ← mới: lấy user từ token
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUserByAdmin);

export default router;
