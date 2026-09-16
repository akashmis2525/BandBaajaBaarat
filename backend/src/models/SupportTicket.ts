import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISupportTicket extends Document {
  user: Types.ObjectId;
  ticketCode: string;
  bookingId?: string;
  vendorName?: string;
  issueType: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  isUrgent: boolean;
  lastReply: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ISupportTicket>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ticketCode: { type: String, required: true, unique: true, index: true },
    bookingId: String,
    vendorName: String,
    issueType: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
      index: true,
    },
    isUrgent: { type: Boolean, default: false },
    lastReply: { type: String, default: 'Our team will respond shortly.' },
  },
  { timestamps: true },
);

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', schema);
