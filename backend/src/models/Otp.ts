import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  role: 'customer' | 'vendor';
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  consumed: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true },
    role: { type: String, enum: ['customer', 'vendor'], required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    consumed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

otpSchema.index({ phone: 1, role: 1, createdAt: -1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
