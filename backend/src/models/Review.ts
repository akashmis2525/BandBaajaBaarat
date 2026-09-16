import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  vendorProfile: Types.ObjectId;
  booking?: Types.ObjectId;
  rating: number;
  tags: string[];
  text: string;
  photos: string[];
  createdAt: Date;
}

const schema = new Schema<IReview>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorProfile: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    tags: { type: [String], default: [] },
    text: { type: String, default: '' },
    photos: { type: [String], default: [] },
  },
  { timestamps: true },
);

schema.index({ booking: 1, customer: 1 }, { unique: true, sparse: true });

export const Review = mongoose.model<IReview>('Review', schema);
