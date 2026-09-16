import { z } from 'zod';

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Mobile number must be a valid 10-digit Indian number');

export const otpSchema = z.string().regex(/^\d{4}$/, 'OTP must be 4 digits');

export const sendOtpSchema = z.object({
  phone: phoneSchema,
  role: z.enum(['customer', 'vendor']).default('customer'),
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
  role: z.enum(['customer', 'vendor']).default('customer'),
});

export const emailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const completeProfileSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  whatsappNumber: phoneSchema,
  referralCode: z.string().max(32).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().max(120).optional(),
  whatsappNumber: phoneSchema.optional(),
  weddingDate: z.string().max(80).optional(),
  customerRole: z.enum(['Groom', 'Bride', 'Family & Host', 'Event Planner']).optional(),
  dob: z.string().max(40).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  locationLabel: z.string().max(160).optional(),
  language: z.string().max(40).optional(),
  aboutMe: z.string().max(2000).optional(),
  interests: z.array(z.string().max(40)).max(30).optional(),
  photoUrl: z.string().max(500).optional(),
  darkModeEnabled: z.boolean().optional(),
  gpsAutoDetect: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6),
});

export const notificationPrefsSchema = z.object({
  pushMaster: z.boolean().optional(),
  bookingUpdates: z.boolean().optional(),
  offersDeals: z.boolean().optional(),
  newServices: z.boolean().optional(),
  reminders: z.boolean().optional(),
  marketingUpdates: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  whatsappNotifications: z.boolean().optional(),
  leadAlerts: z.boolean().optional(),
  whatsappUpdates: z.boolean().optional(),
  smsPayoutAlerts: z.boolean().optional(),
});

export const privacyPrefsSchema = z.object({
  twoFactorAuth: z.boolean().optional(),
  profileVisibleToVendors: z.boolean().optional(),
  activityStatusVisible: z.boolean().optional(),
});

export const addressSchema = z.object({
  type: z.enum(['home', 'work', 'other', 'parents']).default('home'),
  title: z.string().min(1),
  isDefault: z.boolean().optional(),
  addressLine1: z.string().min(3),
  cityStatePincode: z.string().min(3),
  landmark: z.string().optional(),
});

export const paymentMethodSchema = z.object({
  type: z.enum(['card', 'upi', 'wallet', 'netbanking']),
  brand: z.enum(['mastercard', 'visa', 'gpay', 'paytm']).optional(),
  title: z.string().min(1).max(80),
  cardNumber: z.string().max(19).optional(),
  expiry: z.string().max(20).optional(),
  cvv: z.string().max(4).optional(),
  holderName: z.string().max(80).optional(),
  upiId: z.string().max(80).optional(),
  walletNumber: z.string().max(20).optional(),
  isDefault: z.boolean().optional(),
});

export const bookingCreateSchema = z.object({
  vendorProfileId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  eventTitle: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().min(1),
  eventTime: z.string().min(1),
  duration: z.string().optional(),
  location: z.string().min(1),
  guestCount: z.string().optional(),
  price: z.number().positive(),
  basePrice: z.number().optional(),
  artistCharges: z.number().optional(),
  travelCharges: z.number().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethodId: z.string().optional(),
  paymentMode: z.string().optional(),
});

export const leadSchema = z.object({
  vendorProfileId: z.string().regex(/^[a-fA-F0-9]{24}$/).optional(),
  customerName: z.string().min(2),
  phone: phoneSchema,
  eventType: z.string().min(1),
  eventDate: z.string().min(1),
  venueCity: z.string().min(1),
  guestCount: z.string().optional(),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
});

export const vendorKycSchema = z.object({
  businessName: z.string().min(2),
  category: z.string().min(2),
  city: z.string().min(2),
  address: z.string().optional(),
  experience: z.string().optional(),
  startingPrice: z.string().optional(),
  payoutMethod: z.enum(['bank', 'upi']).optional(),
  bankAccount: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional(),
  panNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  docsUploaded: z.boolean().optional(),
  bio: z.string().optional(),
});

export const messageSchema = z.object({
  text: z.string().min(1).max(4000),
});

export const meetingSchema = z.object({
  vendorId: z.string().regex(/^[a-fA-F0-9]{24}$/).optional(),
  vendorProfileId: z.string().regex(/^[a-fA-F0-9]{24}$/).optional(),
  meetingDate: z.string().min(1),
  meetingTime: z.string().min(1),
  meetingType: z.enum(['in_person', 'video', 'phone']).optional(),
  meetingLocation: z.string().optional(),
  eventType: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  vendorProfileId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  bookingId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  rating: z.number().int().min(1).max(5),
  tags: z.array(z.string()).optional(),
  text: z.string().max(2000).optional(),
  photos: z.array(z.string()).optional(),
});

export const quotationSchema = z.object({
  leadId: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().min(1),
  eventDate: z.string().optional(),
  packageName: z.string().min(1),
  items: z.array(z.object({ serviceName: z.string(), price: z.number().nonnegative() })),
  advanceRequirement: z.number().optional(),
  discountApplied: z.number().optional(),
});

export const ticketSchema = z.object({
  bookingId: z.string().optional(),
  vendorName: z.string().optional(),
  issueType: z.string().min(1),
  subject: z.string().min(2).max(160),
  description: z.string().min(5).max(4000),
  isUrgent: z.boolean().optional(),
});

export const applyCouponSchema = z.object({
  code: z.string().min(3).max(32),
  amount: z.number().nonnegative().max(100000000),
});

export const rescheduleSchema = z.object({
  eventDate: z.string().min(1).max(80),
  eventTime: z.string().min(1).max(80),
  reason: z.string().max(500).optional(),
});

export const executionSchema = z.object({
  executionStep: z.number().int().min(1).max(4),
});

export const withdrawSchema = z.object({
  amount: z.number().positive().max(10000000),
});

export const leadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'quoted', 'closed']),
});
