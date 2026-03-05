import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost';

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const posts = await BlogPost.find().sort({ date: -1 });
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error
    });
  }
};

export const getBlogPostById = async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error
    });
  }
};

export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).json({
      success: true,
      data: post,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating blog post',
      error
    });
  }
};
