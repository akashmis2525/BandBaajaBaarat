import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { asyncHandler } from '../utils/errors';
import { validate } from '../utils/validate';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth';
import { validateObjectIdParam } from '../middleware/objectId';
import { databaseStatus, pingDatabase } from '../config/db';
import * as auth from '../controllers/auth.controller';
import * as users from '../controllers/users.controller';
import * as catalog from '../controllers/catalog.controller';
import * as bookings from '../controllers/bookings.controller';
import * as vendor from '../controllers/vendor.controller';
import * as engagement from '../controllers/engagement.controller';
import {
  sendOtpSchema,
  verifyOtpSchema,
  emailLoginSchema,
  refreshSchema,
  completeProfileSchema,
  updateProfileSchema,
  changePasswordSchema,
  notificationPrefsSchema,
  privacyPrefsSchema,
  addressSchema,
  paymentMethodSchema,
  bookingCreateSchema,
  leadSchema,
  vendorKycSchema,
  messageSchema,
  meetingSchema,
  reviewSchema,
  quotationSchema,
  ticketSchema,
  applyCouponSchema,
  rescheduleSchema,
  executionSchema,
  withdrawSchema,
  leadStatusSchema,
} from '../validators/schemas';
import { success } from '../utils/response';

const uploadDir = path.resolve(process.cwd(), env.uploadDir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(jpeg|jpg|png|webp)/.test(file.mimetype);
    if (!ok) {
      cb(new Error('Only JPEG, PNG and WebP images are allowed'));
      return;
    }
    cb(null, true);
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many refresh attempts. Please try again later.' },
});

function assertImageMagic(filePath: string) {
  const buf = fs.readFileSync(filePath);
  const jpeg = buf.length > 2 && buf[0] === 0xff && buf[1] === 0xd8;
  const png = buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const webp =
    buf.length > 12 &&
    buf.slice(0, 4).toString() === 'RIFF' &&
    buf.slice(8, 12).toString() === 'WEBP';
  if (!jpeg && !png && !webp) {
    fs.unlinkSync(filePath);
    throw new Error('Invalid image file');
  }
}

export function buildRouter(): Router {
  const api = Router();

  api.get('/health', async (_req, res) => {
    const database = databaseStatus();
    const reachable = database === 'connected' ? await pingDatabase() : false;
    return success(res, 'OK', {
      status: 'ok',
      environment: env.nodeEnv,
      database: reachable ? 'connected' : database,
    });
  });

  // Auth
  api.post('/auth/otp/send', authLimiter, validate(sendOtpSchema), asyncHandler(auth.sendOtp));
  api.post('/auth/otp/verify', authLimiter, validate(verifyOtpSchema), asyncHandler(auth.verifyOtp));
  api.post('/auth/vendor/email-login', authLimiter, validate(emailLoginSchema), asyncHandler(auth.vendorEmailLogin));
  api.post('/auth/refresh', refreshLimiter, validate(refreshSchema), asyncHandler(auth.refresh));
  api.post('/auth/logout', requireAuth, asyncHandler(auth.logout));
  api.get('/auth/me', requireAuth, asyncHandler(auth.me));
  api.post('/auth/complete-profile', requireAuth, validate(completeProfileSchema), asyncHandler(auth.completeProfile));
  api.post('/auth/referral', requireAuth, asyncHandler(auth.applyReferral));

  // Users / profile
  api.get('/users/me', requireAuth, asyncHandler(users.getProfile));
  api.patch('/users/me', requireAuth, validate(updateProfileSchema), asyncHandler(users.updateProfile));
  api.post('/users/me/password', requireAuth, validate(changePasswordSchema), asyncHandler(users.changePassword));
  api.patch('/users/me/notifications', requireAuth, validate(notificationPrefsSchema), asyncHandler(users.updateNotificationPrefs));
  api.patch('/users/me/privacy', requireAuth, validate(privacyPrefsSchema), asyncHandler(users.updatePrivacyPrefs));
  api.get('/users/me/referral', requireAuth, asyncHandler(users.getReferral));
  api.delete('/users/me', requireAuth, asyncHandler(users.deleteAccount));

  // Catalog
  api.get('/services', asyncHandler(catalog.listServices));
  api.get('/vendors', optionalAuth, asyncHandler(catalog.listVendors));
  api.get('/vendors/:id', optionalAuth, validateObjectIdParam('id'), asyncHandler(catalog.getVendor));
  api.get('/location/stats', asyncHandler(catalog.locationStats));
  api.get('/coupons', asyncHandler(catalog.listCoupons));
  api.post('/coupons/apply', requireAuth, validate(applyCouponSchema), asyncHandler(catalog.applyCoupon));
  api.get('/faqs', asyncHandler(catalog.listFaqs));

  // Bookings
  api.get('/bookings', requireAuth, asyncHandler(bookings.listBookings));
  api.post('/bookings', requireAuth, requireRole('customer'), validate(bookingCreateSchema), asyncHandler(bookings.createBooking));
  api.get('/bookings/:id', requireAuth, validateObjectIdParam('id'), asyncHandler(bookings.getBooking));
  api.post('/bookings/:id/cancel', requireAuth, requireRole('customer'), validateObjectIdParam('id'), asyncHandler(bookings.cancelBooking));
  api.post('/bookings/:id/reschedule', requireAuth, requireRole('customer'), validateObjectIdParam('id'), validate(rescheduleSchema), asyncHandler(bookings.rescheduleBooking));
  api.post('/bookings/:id/confirm-payment', requireAuth, requireRole('customer'), validateObjectIdParam('id'), asyncHandler(bookings.confirmPayment));
  api.patch('/bookings/:id/execution', requireAuth, requireRole('vendor'), validateObjectIdParam('id'), validate(executionSchema), asyncHandler(bookings.updateExecution));

  // Vendor
  api.get('/vendor/dashboard', requireAuth, requireRole('vendor'), asyncHandler(bookings.vendorDashboard));
  api.post('/vendor/kyc', requireAuth, requireRole('vendor'), validate(vendorKycSchema), asyncHandler(vendor.submitKyc));
  api.patch('/vendor/profile', requireAuth, requireRole('vendor'), asyncHandler(vendor.updateVendorProfile));
  api.get('/vendor/leads', requireAuth, requireRole('vendor'), asyncHandler(vendor.listLeads));
  api.patch('/vendor/leads/:id', requireAuth, requireRole('vendor'), validateObjectIdParam('id'), validate(leadStatusSchema), asyncHandler(vendor.updateLeadStatus));
  api.post('/leads', requireAuth, requireRole('customer'), validate(leadSchema), asyncHandler(vendor.createLead));
  api.post('/quotations', requireAuth, requireRole('vendor'), validate(quotationSchema), asyncHandler(vendor.createQuotation));
  api.post('/negotiations', requireAuth, asyncHandler(vendor.createNegotiation));
  api.post('/negotiations/:id/agree', requireAuth, validateObjectIdParam('id'), asyncHandler(vendor.agreeNegotiation));
  api.get('/meetings', requireAuth, asyncHandler(vendor.listMeetings));
  api.post('/meetings', requireAuth, validate(meetingSchema), asyncHandler(vendor.createMeeting));
  api.patch('/meetings/:id', requireAuth, validateObjectIdParam('id'), asyncHandler(vendor.updateMeeting));
  api.get('/portfolio', requireAuth, asyncHandler(vendor.listPortfolio));
  api.post('/portfolio', requireAuth, requireRole('vendor'), asyncHandler(vendor.addPortfolio));
  api.delete('/portfolio/:id', requireAuth, requireRole('vendor'), validateObjectIdParam('id'), asyncHandler(vendor.deletePortfolio));
  api.get('/calendar', requireAuth, requireRole('vendor'), asyncHandler(vendor.getCalendar));
  api.put('/calendar', requireAuth, requireRole('vendor'), asyncHandler(vendor.updateCalendar));
  api.get('/wallet', requireAuth, requireRole('vendor'), asyncHandler(vendor.wallet));
  api.post('/wallet/withdraw', requireAuth, requireRole('vendor'), validate(withdrawSchema), asyncHandler(vendor.withdraw));
  api.get('/vendor/reviews', requireAuth, requireRole('vendor'), asyncHandler(vendor.vendorReviews));

  // Favorites
  api.get('/favorites', requireAuth, asyncHandler(engagement.listFavorites));
  api.post('/favorites', requireAuth, asyncHandler(engagement.toggleFavorite));
  api.post('/favorites/:id', requireAuth, asyncHandler(engagement.toggleFavorite));

  // Addresses
  api.get('/addresses', requireAuth, asyncHandler(engagement.listAddresses));
  api.post('/addresses', requireAuth, validate(addressSchema), asyncHandler(engagement.createAddress));
  api.patch('/addresses/:id', requireAuth, validateObjectIdParam('id'), asyncHandler(engagement.updateAddress));
  api.delete('/addresses/:id', requireAuth, validateObjectIdParam('id'), asyncHandler(engagement.deleteAddress));

  // Payment methods
  api.get('/payment-methods', requireAuth, asyncHandler(engagement.listPaymentMethods));
  api.post('/payment-methods', requireAuth, validate(paymentMethodSchema), asyncHandler(engagement.createPaymentMethod));
  api.delete('/payment-methods/:id', requireAuth, validateObjectIdParam('id'), asyncHandler(engagement.deletePaymentMethod));
  api.post('/payment-methods/:id/default', requireAuth, validateObjectIdParam('id'), asyncHandler(engagement.setDefaultPaymentMethod));

  // Chat
  api.get('/conversations', requireAuth, asyncHandler(engagement.listConversations));
  api.post('/conversations', requireAuth, asyncHandler(engagement.getOrCreateConversation));
  api.get('/conversations/:id/messages', requireAuth, validateObjectIdParam('id'), asyncHandler(engagement.listMessages));
  api.post('/conversations/:id/messages', requireAuth, validateObjectIdParam('id'), validate(messageSchema), asyncHandler(engagement.sendMessage));

  // Notifications
  api.get('/notifications', requireAuth, asyncHandler(engagement.listNotifications));
  api.post('/notifications/read-all', requireAuth, asyncHandler(engagement.markAllNotificationsRead));
  api.post('/notifications/:id/read', requireAuth, validateObjectIdParam('id'), asyncHandler(engagement.markNotificationRead));

  // Reviews & support
  api.post('/reviews', requireAuth, validate(reviewSchema), asyncHandler(engagement.createReview));
  api.get('/support/tickets', requireAuth, asyncHandler(engagement.listTickets));
  api.post('/support/tickets', requireAuth, validate(ticketSchema), asyncHandler(engagement.createTicket));

  // Uploads
  api.post('/uploads', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    try {
      assertImageMagic(req.file.path);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid image file' });
    }
    const url = `${env.publicBaseUrl}/uploads/${req.file.filename}`;
    return success(res, 'File uploaded', { url, filename: req.file.filename });
  });

  return api;
}
