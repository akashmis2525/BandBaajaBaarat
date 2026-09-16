import mongoose, { Schema, Document, Types } from 'mongoose';

export type UserRole = 'customer' | 'vendor';
export type CustomerRole = 'Groom' | 'Bride' | 'Family & Host' | 'Event Planner';

export interface NotificationPrefs {
  pushMaster: boolean;
  bookingUpdates: boolean;
  offersDeals: boolean;
  newServices: boolean;
  reminders: boolean;
  marketingUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  leadAlerts?: boolean;
  whatsappUpdates?: boolean;
  smsPayoutAlerts?: boolean;
}

export interface PrivacyPrefs {
  twoFactorAuth: boolean;
  profileVisibleToVendors: boolean;
  activityStatusVisible: boolean;
}

export interface IUser extends Document {
  role: UserRole;
  phone: string;
  email?: string;
  passwordHash?: string;
  name: string;
  whatsappNumber?: string;
  weddingDate?: string;
  customerRole?: CustomerRole;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  city?: string;
  state?: string;
  locationLabel?: string;
  language: string;
  aboutMe?: string;
  interests: string[];
  photoUrl?: string;
  referralCode: string;
  referredBy?: Types.ObjectId;
  isProfileComplete: boolean;
  isKycComplete: boolean;
  isBlocked: boolean;
  notificationPrefs: NotificationPrefs;
  privacyPrefs: PrivacyPrefs;
  darkModeEnabled: boolean;
  gpsAutoDetect: boolean;
  refreshTokens: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationPrefsSchema = new Schema<NotificationPrefs>(
  {
    pushMaster: { type: Boolean, default: true },
    bookingUpdates: { type: Boolean, default: true },
    offersDeals: { type: Boolean, default: true },
    newServices: { type: Boolean, default: false },
    reminders: { type: Boolean, default: true },
    marketingUpdates: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    whatsappNotifications: { type: Boolean, default: true },
    leadAlerts: { type: Boolean, default: true },
    whatsappUpdates: { type: Boolean, default: true },
    smsPayoutAlerts: { type: Boolean, default: true },
  },
  { _id: false },
);

const privacyPrefsSchema = new Schema<PrivacyPrefs>(
  {
    twoFactorAuth: { type: Boolean, default: false },
    profileVisibleToVendors: { type: Boolean, default: true },
    activityStatusVisible: { type: Boolean, default: true },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    role: { type: String, enum: ['customer', 'vendor'], required: true, index: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    name: { type: String, default: '' },
    whatsappNumber: { type: String },
    weddingDate: { type: String },
    customerRole: { type: String, enum: ['Groom', 'Bride', 'Family & Host', 'Event Planner'] },
    dob: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    city: { type: String },
    state: { type: String },
    locationLabel: { type: String },
    language: { type: String, default: 'English' },
    aboutMe: { type: String },
    interests: { type: [String], default: [] },
    photoUrl: { type: String },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isProfileComplete: { type: Boolean, default: false },
    isKycComplete: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false, index: true },
    notificationPrefs: { type: notificationPrefsSchema, default: () => ({}) },
    privacyPrefs: { type: privacyPrefsSchema, default: () => ({}) },
    darkModeEnabled: { type: Boolean, default: false },
    gpsAutoDetect: { type: Boolean, default: true },
    refreshTokens: { type: [String], default: [] },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ role: 1, phone: 1 });
userSchema.index({ email: 1, role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
