import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICouponRedemption extends Document {
  user: Types.ObjectId;
  coupon: Types.ObjectId;
  code: string;
  booking?: Types.ObjectId;
  createdAt: Date;
}

const schema = new Schema<ICouponRedemption>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    code: { type: String, required: true, uppercase: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true },
);

schema.index({ user: 1, code: 1 }, { unique: true });

export const CouponRedemption = mongoose.model<ICouponRedemption>('CouponRedemption', schema);
