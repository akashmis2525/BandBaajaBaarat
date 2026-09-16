import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReferral extends Document {
  referrer: Types.ObjectId;
  referee?: Types.ObjectId;
  refereeName: string;
  service?: string;
  reward: number;
  status: 'Pending' | 'Completed';
  createdAt: Date;
}

const schema = new Schema<IReferral>(
  {
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referee: { type: Schema.Types.ObjectId, ref: 'User' },
    refereeName: { type: String, default: '' },
    service: String,
    reward: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  },
  { timestamps: true },
);

export const Referral = mongoose.model<IReferral>('Referral', schema);
