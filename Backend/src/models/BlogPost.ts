import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: Date;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    readTime: string;
  };
  tags: string[];
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: [String], required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    image: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      readTime: { type: String, required: true }
    },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
