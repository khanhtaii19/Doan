import express from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);          // ← mới: lấy user từ token
router.get('/users', getUsers);

export default router;