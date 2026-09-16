import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IKyc {
  panNumber?: string;
  gstNumber?: string;
  bankAccount?: string;
  ifscCode?: string;
  upiId?: string;
  payoutMethod: 'bank' | 'upi';
  docsUploaded: boolean;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
}

export interface IVendorPackage {
  name: string;
  price: number;
  inclusions: string[];
  isPopular: boolean;
}

export interface IVendorProfile extends Document {
  user: Types.ObjectId;
  businessName: string;
  category: string;
  categorySlug: string;
  city: string;
  state: string;
  address: string;
  pincode?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  experienceYears: number;
  experienceText: string;
  startingPrice: number;
  startingPriceText: string;
  priceUnit: string;
  type: 'Professional Group' | 'Individual Artist';
  isVerified: boolean;
  isOnline: boolean;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  photosCount: number;
  imageKey: string;
  features: string[];
  bio: string;
  displayPhone: string;
  openTime: string;
  closeTime: string;
  operatingDays: string;
  kyc: IKyc;
  walletBalance: number;
  totalEarned: number;
  monthEarned: number;
  packages: IVendorPackage[];
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendorProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    businessName: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    state: { type: String, default: 'Madhya Pradesh' },
    address: { type: String, default: '' },
    pincode: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [75.8577, 22.7196] },
    },
    experienceYears: { type: Number, default: 1 },
    experienceText: { type: String, default: '1+ Years' },
    startingPrice: { type: Number, default: 0, index: true },
    startingPriceText: { type: String, default: '₹0 onwards' },
    priceUnit: { type: String, default: 'Starting Price' },
    type: {
      type: String,
      enum: ['Professional Group', 'Individual Artist'],
      default: 'Professional Group',
    },
    isVerified: { type: Boolean, default: false, index: true },
    isOnline: { type: Boolean, default: true, index: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, index: true },
    reviewsCount: { type: Number, default: 0 },
    photosCount: { type: Number, default: 0 },
    imageKey: { type: String, default: 'serviceDecorators' },
    features: { type: [String], default: [] },
    bio: { type: String, default: '' },
    displayPhone: { type: String, default: '' },
    openTime: { type: String, default: '09:00 AM' },
    closeTime: { type: String, default: '09:00 PM' },
    operatingDays: { type: String, default: 'Monday – Sunday (7 Days)' },
    kyc: {
      panNumber: String,
      gstNumber: String,
      bankAccount: String,
      ifscCode: String,
      upiId: String,
      payoutMethod: { type: String, enum: ['bank', 'upi'], default: 'bank' },
      docsUploaded: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ['pending', 'submitted', 'verified', 'rejected'],
        default: 'pending',
      },
    },
    walletBalance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    monthEarned: { type: Number, default: 0 },
    packages: [
      {
        name: String,
        price: Number,
        inclusions: [String],
        isPopular: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

vendorSchema.index({ location: '2dsphere' });
vendorSchema.index({ categorySlug: 1, city: 1, rating: -1 });
vendorSchema.index({ businessName: 'text', category: 'text', city: 'text', bio: 'text' });

export const VendorProfile = mongoose.model<IVendorProfile>('VendorProfile', vendorSchema);
