import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuotationItem {
  serviceName: string;
  price: number;
}

export interface IQuotation extends Document {
  vendor: Types.ObjectId;
  customer?: Types.ObjectId;
  lead?: Types.ObjectId;
  customerName: string;
  eventDate: string;
  packageName: string;
  items: IQuotationItem[];
  advanceRequirement: number;
  discountApplied: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IQuotation>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    lead: { type: Schema.Types.ObjectId, ref: 'Lead' },
    customerName: { type: String, required: true },
    eventDate: { type: String, default: '' },
    packageName: { type: String, required: true },
    items: [{ serviceName: String, price: Number }],
    advanceRequirement: { type: Number, default: 0 },
    discountApplied: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected'],
      default: 'sent',
    },
  },
  { timestamps: true },
);

export const Quotation = mongoose.model<IQuotation>('Quotation', schema);

export interface INegotiation extends Document {
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  quotation?: Types.ObjectId;
  originalAmount: number;
  counterOfferAmount: number;
  agreedAmount?: number;
  status: 'open' | 'agreed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const negotiationSchema = new Schema<INegotiation>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quotation: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    originalAmount: { type: Number, required: true },
    counterOfferAmount: { type: Number, required: true },
    agreedAmount: Number,
    status: { type: String, enum: ['open', 'agreed', 'rejected'], default: 'open' },
  },
  { timestamps: true },
);

export const Negotiation = mongoose.model<INegotiation>('Negotiation', negotiationSchema);
