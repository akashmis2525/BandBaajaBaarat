import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId;
  title: string;
  body: string;
  type: 'booking' | 'offer' | 'message' | 'lead' | 'meeting' | 'system' | 'payment';
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

const schema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ['booking', 'offer', 'message', 'lead', 'meeting', 'system', 'payment'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false, index: true },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

schema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', schema);
