import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFavorite extends Document {
  user: Types.ObjectId;
  vendorProfile: Types.ObjectId;
  type: 'Venue' | 'Vendor' | 'Service';
  createdAt: Date;
}

const schema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendorProfile: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
    type: { type: String, enum: ['Venue', 'Vendor', 'Service'], default: 'Vendor' },
  },
  { timestamps: true },
);

schema.index({ user: 1, vendorProfile: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', schema);
