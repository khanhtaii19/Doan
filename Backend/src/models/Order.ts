import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  id: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    size?: 'medium' | 'large';
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  // ─── Thông tin khách hàng đầy đủ ───────────────────────────────
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    addressDetail: string;
  };
  // ─── Địa chỉ giao hàng (giữ lại để tương thích) ─────────────────
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'cash' | 'bank_transfer';
  originalPaymentMethod?: string;
  notes?: string;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, default: '' },   // ← tên sản phẩm lúc đặt hàng
        productImage: { type: String, default: '' },  // ← ảnh sản phẩm lúc đặt hàng
        size: { type: String, enum: ['medium', 'large'], default: 'medium' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    couponCode: { type: String },
    // ─── customerInfo ────────────────────────────────────────────
    customerInfo: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      province: { type: String, default: '' },
      district: { type: String, default: '' },
      ward: { type: String, default: '' },
      addressDetail: { type: String, default: '' }
    },
    // ─── shippingAddress (giữ lại) ───────────────────────────────
    shippingAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'cash', 'bank_transfer'],
      required: true
    },
    originalPaymentMethod: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
