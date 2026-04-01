import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getMessages, sendMessage, getConversations } from '../controllers/chatController';

const router = express.Router();

router.get('/messages', authMiddleware, getMessages);
router.post('/messages', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);

export default router;
