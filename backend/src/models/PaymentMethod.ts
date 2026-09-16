import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPaymentMethod extends Document {
  user: Types.ObjectId;
  type: 'card' | 'upi' | 'wallet' | 'netbanking';
  brand: 'mastercard' | 'visa' | 'gpay' | 'paytm';
  title: string;
  subtitle: string;
  expiry?: string;
  last4?: string;
  holderName?: string;
  isDefault: boolean;
  createdAt: Date;
}

const schema = new Schema<IPaymentMethod>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['card', 'upi', 'wallet', 'netbanking'], required: true },
    brand: { type: String, enum: ['mastercard', 'visa', 'gpay', 'paytm'], required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    expiry: String,
    last4: String,
    holderName: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

schema.index({ user: 1, createdAt: -1 });

export const PaymentMethod = mongoose.model<IPaymentMethod>('PaymentMethod', schema);
