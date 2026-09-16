import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'flat' | 'cashback';
  discountText: string;
  title: string;
  description: string;
  minBookingAmount: number;
  maxDiscount?: number;
  discountValue: number;
  expiryDate: string;
  expiresAt?: Date;
  category: 'all' | 'wedding' | 'cashback' | 'vendor' | 'first';
  isPopular: boolean;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

const schema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    discountType: { type: String, enum: ['percentage', 'flat', 'cashback'], required: true },
    discountText: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    minBookingAmount: { type: Number, default: 0 },
    maxDiscount: Number,
    discountValue: { type: Number, required: true },
    expiryDate: { type: String, required: true },
    expiresAt: Date,
    category: {
      type: String,
      enum: ['all', 'wedding', 'cashback', 'vendor', 'first'],
      default: 'all',
      index: true,
    },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Coupon = mongoose.model<ICoupon>('Coupon', schema);
