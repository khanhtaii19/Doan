import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  memberLevel?: 'Silver' | 'Gold' | 'Diamond';
  totalSpent: number;
  joinedAt: Date;
  avatar?: string;
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    memberLevel: { type: String, enum: ['Silver', 'Gold', 'Diamond'], default: 'Silver' },
    totalSpent: { type: Number, default: 0 },
    avatar: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
