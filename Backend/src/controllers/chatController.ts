import { Response } from 'express';
import ChatMessage from '../models/ChatMessage';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const getAdminUser = async () => User.findOne({ role: 'admin' }).lean();

const normalizeUser = (user: any) => ({
  id: String(user?._id || user?.id || ''),
  name: user?.name || '',
  email: user?.email || '',
  role: user?.role || 'user',
  avatar: user?.avatar || ''
});

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let peerUserId = String(req.query.withUserId || '');

    if (req.role !== 'admin') {
      const admin = await getAdminUser();
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin user not found' });
      }
      peerUserId = String(admin._id);
    } else if (!peerUserId) {
      return res.status(400).json({ success: false, message: 'withUserId is required for admin' });
    }

    const messages = await ChatMessage.find({
      $or: [
        { senderId: req.userId, receiverId: peerUserId },
        { senderId: peerUserId, receiverId: req.userId }
      ]
    })
      .sort({ createdAt: 1 })
      .lean();

    const peerUser = await User.findById(peerUserId).lean();
    return res.json({
      success: true,
      data: messages,
      peerUser: peerUser ? normalizeUser(peerUser) : null
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching messages', error });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const text = String(req.body.text || '').trim();
    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let receiverId = String(req.body.toUserId || '');

    if (req.role !== 'admin') {
      const admin = await getAdminUser();
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin user not found' });
      }
      receiverId = String(admin._id);
    } else if (!receiverId) {
      return res.status(400).json({ success: false, message: 'toUserId is required for admin' });
    }

    const message = new ChatMessage({
      senderId: req.userId,
      receiverId,
      text
    });
    await message.save();

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error sending message', error });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const messages = await ChatMessage.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }]
    })
      .sort({ createdAt: -1 })
      .lean();

    const map = new Map<string, any>();
    for (const msg of messages) {
      const senderId = String(msg.senderId);
      const receiverId = String(msg.receiverId);
      const peerId = senderId === req.userId ? receiverId : senderId;
      if (!map.has(peerId)) {
        map.set(peerId, msg);
      }
    }

    const peerIds = Array.from(map.keys());
    const users = peerIds.length
      ? await User.find({ _id: { $in: peerIds } }).lean()
      : [];
    const userMap = new Map(users.map((u: any) => [String(u._id), normalizeUser(u)]));

    const data = peerIds.map((peerId) => {
      const lastMessage = map.get(peerId);
      return {
        peerUser: userMap.get(peerId) || { id: peerId, name: 'Unknown user', email: '', role: 'user', avatar: '' },
        lastMessage
      };
    });

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching conversations', error });
  }
};
