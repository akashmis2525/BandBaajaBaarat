import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAddress extends Document {
  user: Types.ObjectId;
  type: 'home' | 'work' | 'other' | 'parents';
  title: string;
  isDefault: boolean;
  addressLine1: string;
  cityStatePincode: string;
  landmark: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['home', 'work', 'other', 'parents'], default: 'home' },
    title: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    addressLine1: { type: String, required: true },
    cityStatePincode: { type: String, required: true },
    landmark: { type: String, default: '' },
  },
  { timestamps: true },
);

schema.index({ user: 1, isDefault: -1 });

export const Address = mongoose.model<IAddress>('Address', schema);
