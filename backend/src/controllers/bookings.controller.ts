import { Response } from 'express';
import { Types } from 'mongoose';
import { Booking } from '../models/Booking';
import { VendorProfile } from '../models/VendorProfile';
import { User } from '../models/User';
import { Coupon } from '../models/Coupon';
import { CouponRedemption } from '../models/CouponRedemption';
import { WalletTransaction } from '../models/WalletTransaction';
import { Notification } from '../models/Notification';
import { Conversation } from '../models/Chat';
import { CalendarBlock } from '../models/Misc';
import { AppError } from '../utils/errors';
import { paginate, parsePagination, success } from '../utils/response';
import { generateBookingCode } from '../utils/crypto';
import { resolveCoupon } from '../utils/coupons';
import { ownerVendor } from '../utils/serializers';
import { env } from '../config/env';
import { AuthedRequest } from '../middleware/auth';

function bookingPayload(b: InstanceType<typeof Booking>) {
  const badge =
    b.status === 'in_progress' ? 'Upcoming' : b.status;
  const actions =
    badge === 'Upcoming'
      ? ['reschedule', 'cancel', 'view_details']
      : badge === 'Completed'
        ? ['rebook', 'view_details', 'review']
        : ['book_again', 'view_details'];
  return {
    id: String(b._id),
    bookingId: b.bookingCode.startsWith('#') ? b.bookingCode : `#${b.bookingCode}`,
    bookingCode: b.bookingCode,
    badge,
    status: b.status,
    vendorName: b.vendorName,
    category: b.category,
    date: b.eventDate,
    time: b.eventTime,
    eventTitle: b.eventTitle,
    eventType: b.eventType,
    location: b.location,
    guestCount: b.guestCount,
    price: `₹${b.price.toLocaleString('en-IN')}`,
    priceNum: b.price,
    imageKey: b.imageKey,
    phone: b.vendorPhone,
    vendorPhone: b.vendorPhone,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    duration: b.duration,
    basePrice: b.basePrice,
    artistCharges: b.artistCharges,
    travelCharges: b.travelCharges,
    discountAmount: b.discountAmount,
    couponCode: b.couponCode,
    advanceAmount: b.advanceAmount,
    advanceReceived: b.advanceReceived,
    balanceDue: b.balanceDue,
    paymentStatus: b.paymentStatus,
    executionStep: b.executionStep,
    notes: b.notes,
    vendorId: String(b.vendor),
    vendorProfileId: String(b.vendorProfile),
    actions,
    createdAt: b.createdAt,
  };
}

function parseEventDay(eventDate: string): { month: string; day: number } | null {
  const match = String(eventDate).match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!match) return null;
  const short = match[2].slice(0, 3);
  const full: Record<string, string> = {
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December',
  };
  const monthName = full[short] || match[2];
  return { month: `${monthName} ${match[3]}`, day: Number(match[1]) };
}

async function assertSlotAvailable(
  vendorUserId: string,
  eventDate: string,
  eventTime: string,
  excludeId?: string,
) {
  const clash = await Booking.findOne({
    vendor: vendorUserId,
    eventDate,
    eventTime,
    status: { $in: ['Upcoming', 'in_progress'] },
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });
  if (clash) {
    throw new AppError('This vendor is already booked for the selected date and time', 409);
  }
  const parts = parseEventDay(eventDate);
  if (parts) {
    const block = await CalendarBlock.findOne({ vendor: vendorUserId, month: parts.month });
    if (block?.blockedDates.includes(parts.day)) {
      throw new AppError('The vendor is unavailable on the selected date', 409);
    }
  }
}

async function creditVendorWallet(
  vendorProfile: InstanceType<typeof VendorProfile>,
  booking: InstanceType<typeof Booking>,
  amount: number,
  title: string,
) {
  if (amount <= 0) return;
  const existing = await WalletTransaction.findOne({ booking: booking._id, title, status: 'credit' });
  if (existing) return;
  const commission = Math.round(amount * 0.05);
  const net = amount - commission;
  await VendorProfile.updateOne({ _id: vendorProfile._id }, { $inc: { walletBalance: net, totalEarned: net } });
  vendorProfile.walletBalance += net;
  vendorProfile.totalEarned += net;
  await WalletTransaction.create({
    vendor: vendorProfile.user,
    booking: booking._id,
    bookingCode: booking.bookingCode,
    title,
    grossAmount: amount,
    commission,
    netAmount: net,
    status: 'credit',
  });
}

export async function listBookings(req: AuthedRequest, res: Response) {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const status = req.query.status as string | undefined;
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);

  const filter: Record<string, unknown> =
    user.role === 'vendor' ? { vendor: user._id } : { customer: user._id };
  if (status && status !== 'All' && status !== 'all') {
    if (status === 'Upcoming') filter.status = { $in: ['Upcoming', 'in_progress'] };
    else filter.status = status;
  }

  const [rows, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Booking.countDocuments(filter),
  ]);

  const counts = {
    all: await Booking.countDocuments(user.role === 'vendor' ? { vendor: user._id } : { customer: user._id }),
    upcoming: await Booking.countDocuments({
      ...(user.role === 'vendor' ? { vendor: user._id } : { customer: user._id }),
      status: { $in: ['Upcoming', 'in_progress'] },
    }),
    completed: await Booking.countDocuments({
      ...(user.role === 'vendor' ? { vendor: user._id } : { customer: user._id }),
      status: 'Completed',
    }),
    cancelled: await Booking.countDocuments({
      ...(user.role === 'vendor' ? { vendor: user._id } : { customer: user._id }),
      status: 'Cancelled',
    }),
  };

  return success(res, 'Bookings fetched successfully', {
    items: rows.map(bookingPayload),
    counts,
    pagination: paginate(page, limit, total),
  });
}

export async function getBooking(req: AuthedRequest, res: Response) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.customer) !== req.userId && String(booking.vendor) !== req.userId) {
    throw new AppError('Not authorized to view this booking', 403);
  }
  return success(res, 'Booking fetched successfully', { booking: bookingPayload(booking) });
}

export async function createBooking(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  if (user.role !== 'customer') throw new AppError('Only customers can create bookings', 403);
  const vendorProfile = await VendorProfile.findById(req.body.vendorProfileId);
  if (!vendorProfile) throw new AppError('Vendor not found', 404);

  const listedPrice = Number(req.body.price);
  if (!Number.isFinite(listedPrice) || listedPrice <= 0) {
    throw new AppError('Invalid booking amount', 400);
  }

  let discountAmount = 0;
  let couponCode: string | undefined;
  let couponDoc: InstanceType<typeof Coupon> | null = null;
  if (req.body.couponCode) {
    const resolved = await resolveCoupon(String(req.body.couponCode), listedPrice, String(user._id));
    discountAmount = resolved.discount;
    couponCode = resolved.coupon.code;
    couponDoc = resolved.coupon;
  }

  const price = Math.max(listedPrice - discountAmount, 0);
  const advanceAmount = Math.min(25000, price);
  await assertSlotAvailable(String(vendorProfile.user), req.body.eventDate, req.body.eventTime);

  const booking = await Booking.create({
    bookingCode: generateBookingCode(),
    customer: user._id,
    vendor: vendorProfile.user,
    vendorProfile: vendorProfile._id,
    vendorName: vendorProfile.businessName,
    category: vendorProfile.category,
    eventTitle: req.body.eventTitle || vendorProfile.businessName,
    eventType: req.body.eventType || 'Wedding Ceremony',
    eventDate: req.body.eventDate,
    eventTime: req.body.eventTime,
    duration: req.body.duration,
    location: req.body.location,
    guestCount: req.body.guestCount,
    price,
    basePrice: req.body.basePrice || listedPrice,
    artistCharges: req.body.artistCharges || 0,
    travelCharges: req.body.travelCharges || 0,
    discountAmount,
    couponCode,
    advanceAmount,
    advanceReceived: 0,
    balanceDue: price,
    status: 'Upcoming',
    imageKey: vendorProfile.imageKey,
    vendorPhone: vendorProfile.displayPhone,
    customerName: user.name,
    customerPhone: user.phone,
    notes: req.body.notes,
    paymentStatus: 'pending',
    executionStep: 1,
  });

  if (couponDoc) {
    await CouponRedemption.create({
      user: user._id,
      coupon: couponDoc._id,
      code: couponDoc.code,
      booking: booking._id,
    });
    await Coupon.updateOne({ _id: couponDoc._id }, { $inc: { usedCount: 1 } });
  }

  await Conversation.findOneAndUpdate(
    { customer: user._id, vendor: vendorProfile.user },
    {
      customer: user._id,
      vendor: vendorProfile.user,
      vendorProfile: vendorProfile._id,
      lastMessage: 'Booking created — awaiting advance payment',
      lastMessageAt: new Date(),
    },
    { upsert: true },
  );

  await Notification.create([
    {
      user: user._id,
      title: 'Booking created',
      body: `Your booking with ${vendorProfile.businessName} is awaiting advance payment.`,
      type: 'booking',
      data: { bookingId: String(booking._id) },
    },
    {
      user: vendorProfile.user,
      title: 'New booking',
      body: `${user.name || 'A customer'} booked ${vendorProfile.businessName}.`,
      type: 'booking',
      data: { bookingId: String(booking._id) },
    },
  ]);

  return success(res, 'Booking created successfully', { booking: bookingPayload(booking) }, 201);
}

export async function confirmPayment(req: AuthedRequest, res: Response) {
  if (env.isProduction && !env.paymentGateway) {
    throw new AppError(
      'Payment gateway is not configured. Set PAYMENT_GATEWAY before collecting live payments.',
      503,
    );
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.customer) !== req.userId) throw new AppError('Not authorized', 403);
  if (booking.status === 'Cancelled') throw new AppError('Cancelled bookings cannot be paid', 400);
  if (booking.paymentStatus === 'paid') throw new AppError('Booking is already paid', 409);

  const vendorProfile = await VendorProfile.findById(booking.vendorProfile);
  if (!vendorProfile) throw new AppError('Vendor not found', 404);

  const mode = String(req.body.paymentMode || 'recorded');
  if (booking.paymentStatus === 'pending') {
    booking.paymentStatus = 'advance_paid';
    booking.advanceReceived = booking.advanceAmount;
    booking.balanceDue = Math.max(booking.price - booking.advanceAmount, 0);
    await creditVendorWallet(
      vendorProfile,
      booking,
      booking.advanceAmount,
      `Advance Token — ${booking.customerName || 'Customer'}`,
    );
  } else if (booking.paymentStatus === 'advance_paid') {
    const remaining = booking.balanceDue;
    booking.paymentStatus = 'paid';
    booking.advanceReceived = booking.price;
    booking.balanceDue = 0;
    await creditVendorWallet(
      vendorProfile,
      booking,
      remaining,
      `Balance settlement — ${booking.customerName || 'Customer'}`,
    );
  }
  booking.notes = [booking.notes, `Payment recorded (${mode})`].filter(Boolean).join(' | ');
  await booking.save();
  await Notification.create({
    user: booking.vendor,
    title: 'Payment received',
    body: `Payment recorded for booking ${booking.bookingCode}.`,
    type: 'booking',
    data: { bookingId: String(booking._id) },
  });
  return success(res, 'Payment recorded', { booking: bookingPayload(booking) });
}

export async function cancelBooking(req: AuthedRequest, res: Response) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.customer) !== req.userId) throw new AppError('Not authorized', 403);
  if (booking.status === 'Cancelled') throw new AppError('Booking already cancelled', 409);
  if (booking.status === 'Completed') throw new AppError('Completed bookings cannot be cancelled', 400);
  if (booking.paymentStatus === 'advance_paid' || booking.paymentStatus === 'paid') {
    const credits = await WalletTransaction.find({ booking: booking._id, status: 'credit' });
    const totalNet = credits.reduce((sum, tx) => sum + tx.netAmount, 0);
    if (totalNet > 0) {
      const vendor = await VendorProfile.findOne({ user: booking.vendor });
      const clawback = Math.min(vendor?.walletBalance || 0, totalNet);
      if (clawback > 0) {
        await VendorProfile.updateOne({ _id: vendor!._id }, { $inc: { walletBalance: -clawback } });
        await WalletTransaction.create({
          vendor: booking.vendor,
          booking: booking._id,
          bookingCode: booking.bookingCode,
          title: `Refund clawback — ${booking.bookingCode}`,
          grossAmount: clawback,
          commission: 0,
          netAmount: clawback,
          status: 'debit',
        });
      }
    }
  }
  booking.status = 'Cancelled';
  booking.cancelReason = req.body.reason || '';
  booking.paymentStatus = 'refunded';
  await booking.save();
  await Notification.create({
    user: booking.vendor,
    title: 'Booking cancelled',
    body: `${booking.customerName} cancelled booking ${booking.bookingCode}.`,
    type: 'booking',
    data: { bookingId: String(booking._id) },
  });
  return success(res, 'Booking cancelled', { booking: bookingPayload(booking) });
}

export async function rescheduleBooking(req: AuthedRequest, res: Response) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.customer) !== req.userId) throw new AppError('Not authorized', 403);
  if (booking.status === 'Cancelled') throw new AppError('Cancelled bookings cannot be rescheduled', 400);
  if (booking.status === 'Completed') throw new AppError('Completed bookings cannot be rescheduled', 400);
  const eventDate = req.body.eventDate || booking.eventDate;
  const eventTime = req.body.eventTime || booking.eventTime;
  await assertSlotAvailable(String(booking.vendor), eventDate, eventTime, String(booking._id));
  booking.eventDate = eventDate;
  booking.eventTime = eventTime;
  booking.rescheduleReason = req.body.reason || '';
  await booking.save();
  await Notification.create({
    user: booking.vendor,
    title: 'Reschedule requested',
    body: `${booking.customerName} requested a new slot for ${booking.bookingCode}.`,
    type: 'booking',
    data: { bookingId: String(booking._id) },
  });
  return success(res, 'Booking rescheduled', { booking: bookingPayload(booking) });
}

export async function updateExecution(req: AuthedRequest, res: Response) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.vendor) !== req.userId) throw new AppError('Not authorized', 403);
  if (booking.status === 'Cancelled') throw new AppError('Cancelled bookings cannot be updated', 400);
  const step = Number(req.body.executionStep || booking.executionStep);
  if (!Number.isInteger(step) || step < 1 || step > 4) {
    throw new AppError('Execution step must be between 1 and 4', 400);
  }
  if (step < booking.executionStep) {
    throw new AppError('Execution cannot move backwards', 400);
  }
  booking.executionStep = step;
  if (step >= 2 && booking.status !== 'Completed') booking.status = 'in_progress';
  if (step >= 4) {
    booking.status = 'Completed';
    if (booking.paymentStatus !== 'refunded') booking.paymentStatus = 'paid';
    booking.advanceReceived = booking.price;
    booking.balanceDue = 0;
  }
  await booking.save();
  return success(res, 'Order execution updated', { booking: bookingPayload(booking) });
}

export async function vendorDashboard(req: AuthedRequest, res: Response) {
  const vendor = await VendorProfile.findOne({ user: new Types.ObjectId(req.userId) });
  if (!vendor) throw new AppError('Vendor profile not found', 404);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const [newLeads, upcomingMeetings, upcomingBookings, monthAgg] = await Promise.all([
    (await import('../models/Lead')).Lead.countDocuments({ vendor: req.userId, status: 'new' }),
    (await import('../models/Meeting')).Meeting.countDocuments({
      vendor: req.userId,
      status: { $in: ['pending', 'confirmed'] },
    }),
    Booking.countDocuments({ vendor: req.userId, status: { $in: ['Upcoming', 'in_progress'] } }),
    WalletTransaction.aggregate([
      {
        $match: {
          vendor: new Types.ObjectId(req.userId),
          status: 'credit',
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$netAmount' } } },
    ]),
  ]);
  const monthEarned = monthAgg[0]?.total || 0;
  return success(res, 'Dashboard fetched', {
    vendor: ownerVendor(vendor),
    metrics: {
      walletBalance: vendor.walletBalance,
      totalEarned: vendor.totalEarned,
      monthEarned,
      rating: vendor.rating,
      reviewsCount: vendor.reviewsCount,
      newLeads,
      upcomingMeetings,
      upcomingBookings,
      isOnline: vendor.isOnline,
    },
  });
}
