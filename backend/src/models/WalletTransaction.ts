import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWalletTransaction extends Document {
  vendor: Types.ObjectId;
  booking?: Types.ObjectId;
  bookingCode?: string;
  title: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: 'credit' | 'debit' | 'pending';
  createdAt: Date;
}

const schema = new Schema<IWalletTransaction>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    bookingCode: String,
    title: { type: String, required: true },
    grossAmount: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    status: { type: String, enum: ['credit', 'debit', 'pending'], default: 'credit', index: true },
  },
  { timestamps: true },
);

schema.index({ vendor: 1, createdAt: -1 });

export const WalletTransaction = mongoose.model<IWalletTransaction>('WalletTransaction', schema);
