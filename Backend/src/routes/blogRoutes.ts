import express from 'express';
import {
  getBlogPosts,
  getBlogPostById,
  createBlogPost
} from '../controllers/blogController';

const router = express.Router();

// Routes
router.get('/', getBlogPosts);
router.get('/:id', getBlogPostById);
router.post('/', createBlogPost);

export default router;
