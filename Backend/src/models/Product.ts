import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  details: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
  totalSold: number;
  image: string;
  promotionText?: string;
}

const productSchema = new Schema<IProduct>(
  {
    categoryId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    costPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    totalSold: { type: Number, default: 0 },
    image: { type: String, required: true },
    promotionText: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
