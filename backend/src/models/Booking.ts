import mongoose, { Schema, Document, Types } from 'mongoose';

export type BookingStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'in_progress';

export interface IBooking extends Document {
  bookingCode: string;
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  vendorProfile: Types.ObjectId;
  vendorName: string;
  category: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  duration?: string;
  location: string;
  guestCount?: string;
  price: number;
  basePrice: number;
  artistCharges: number;
  travelCharges: number;
  discountAmount: number;
  couponCode?: string;
  advanceAmount: number;
  advanceReceived: number;
  balanceDue: number;
  status: BookingStatus;
  imageKey: string;
  vendorPhone: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  cancelReason?: string;
  rescheduleReason?: string;
  executionStep: number;
  paymentStatus: 'pending' | 'advance_paid' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IBooking>(
  {
    bookingCode: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vendorProfile: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
    vendorName: { type: String, required: true },
    category: { type: String, required: true },
    eventTitle: { type: String, default: '' },
    eventType: { type: String, default: 'Wedding Ceremony' },
    eventDate: { type: String, required: true, index: true },
    eventTime: { type: String, required: true },
    duration: { type: String },
    location: { type: String, required: true },
    guestCount: { type: String },
    price: { type: Number, required: true },
    basePrice: { type: Number, default: 0 },
    artistCharges: { type: Number, default: 0 },
    travelCharges: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    advanceAmount: { type: Number, default: 0 },
    advanceReceived: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled', 'in_progress'],
      default: 'Upcoming',
      index: true,
    },
    imageKey: { type: String, default: 'serviceDecorators' },
    vendorPhone: { type: String, default: '' },
    customerName: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    notes: String,
    cancelReason: String,
    rescheduleReason: String,
    executionStep: { type: Number, default: 1 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'advance_paid', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

schema.index({ customer: 1, status: 1, createdAt: -1 });
schema.index({ vendor: 1, status: 1, createdAt: -1 });
schema.index(
  { vendor: 1, eventDate: 1, eventTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['Upcoming', 'in_progress'] } },
  },
);

export const Booking = mongoose.model<IBooking>('Booking', schema);
