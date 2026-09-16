import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMeeting extends Document {
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  customerName: string;
  phone: string;
  meetingDate: string;
  meetingTime: string;
  meetingType: 'in_person' | 'video' | 'phone';
  meetingLocation: string;
  eventType: string;
  purpose: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IMeeting>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerName: { type: String, required: true },
    phone: { type: String, default: '' },
    meetingDate: { type: String, required: true },
    meetingTime: { type: String, required: true },
    meetingType: { type: String, enum: ['in_person', 'video', 'phone'], default: 'in_person' },
    meetingLocation: { type: String, default: '' },
    eventType: { type: String, default: '' },
    purpose: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true },
);

schema.index({ vendor: 1, status: 1, createdAt: -1 });
schema.index({ customer: 1, createdAt: -1 });

export const Meeting = mongoose.model<IMeeting>('Meeting', schema);
