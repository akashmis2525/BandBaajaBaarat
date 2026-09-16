import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILead extends Document {
  customer: Types.ObjectId;
  vendor?: Types.ObjectId;
  vendorProfile?: Types.ObjectId;
  customerName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venueCity: string;
  guestCount: string;
  budgetRange: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  notes: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ILead>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    vendorProfile: { type: Schema.Types.ObjectId, ref: 'VendorProfile' },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDate: { type: String, required: true },
    venueCity: { type: String, required: true },
    guestCount: { type: String, default: '' },
    budgetRange: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'closed'],
      default: 'new',
      index: true,
    },
    notes: { type: String, default: '' },
    category: { type: String, default: '' },
  },
  { timestamps: true },
);

schema.index({ vendor: 1, status: 1, createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', schema);
