import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPortfolioItem extends Document {
  vendor: Types.ObjectId;
  vendorProfile: Types.ObjectId;
  title: string;
  uri: string;
  views: number;
  createdAt: Date;
}

const schema = new Schema<IPortfolioItem>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendorProfile: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
    title: { type: String, required: true },
    uri: { type: String, required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const PortfolioItem = mongoose.model<IPortfolioItem>('PortfolioItem', schema);

export interface ICalendarBlock extends Document {
  vendor: Types.ObjectId;
  month: string;
  blockedDates: number[];
  updatedAt: Date;
}

const calendarSchema = new Schema<ICalendarBlock>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    blockedDates: { type: [Number], default: [] },
  },
  { timestamps: true },
);

calendarSchema.index({ vendor: 1, month: 1 }, { unique: true });

export const CalendarBlock = mongoose.model<ICalendarBlock>('CalendarBlock', calendarSchema);

export interface IFaq extends Document {
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Faq = mongoose.model<IFaq>('Faq', faqSchema);
