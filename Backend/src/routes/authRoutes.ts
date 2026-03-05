import express from 'express';
import {
  register,
  login,
  getUsers
} from '../controllers/authController';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);

export default router;
