import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  vendorProfile: Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  customerUnread: number;
  vendorUnread: number;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendorProfile: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
    lastMessage: String,
    lastMessageAt: Date,
    customerUnread: { type: Number, default: 0 },
    vendorUnread: { type: Number, default: 0 },
  },
  { timestamps: true },
);

conversationSchema.index({ customer: 1, vendor: 1 }, { unique: true });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  senderRole: 'vendor' | 'user';
  text: string;
  read: boolean;
  hasMeetingAction?: boolean;
  hasQuotationAction?: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['vendor', 'user'], required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
    hasMeetingAction: { type: Boolean, default: false },
    hasQuotationAction: { type: Boolean, default: false },
  },
  { timestamps: true },
);

messageSchema.index({ conversation: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
