import { Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { VendorProfile } from '../models/VendorProfile';
import { Lead } from '../models/Lead';
import { Quotation, Negotiation } from '../models/Quotation';
import { Meeting } from '../models/Meeting';
import { PortfolioItem, CalendarBlock } from '../models/Misc';
import { WalletTransaction } from '../models/WalletTransaction';
import { Notification } from '../models/Notification';
import { Review } from '../models/Review';
import { AppError } from '../utils/errors';
import { paginate, parsePagination, success } from '../utils/response';
import { ownerVendor, publicVendor } from '../utils/serializers';
import { AuthedRequest } from '../middleware/auth';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parsePrice(text?: string) {
  if (!text) return 0;
  const n = Number(String(text).replace(/[^\d]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

export async function submitKyc(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  const startingPrice = parsePrice(req.body.startingPrice);
  const experienceYears = parsePrice(req.body.experience);
  const payload = {
    user: user._id,
    businessName: req.body.businessName,
    category: req.body.category,
    categorySlug: slugify(req.body.category),
    city: (req.body.city || '').split(',')[0].trim() || 'Indore',
    state: 'Madhya Pradesh',
    address: req.body.address || '',
    experienceYears: experienceYears || 1,
    experienceText: req.body.experience || '1+ Years',
    startingPrice,
    startingPriceText: req.body.startingPrice || `₹${startingPrice.toLocaleString('en-IN')} onwards`,
    displayPhone: user.phone,
    bio: req.body.bio || '',
    imageKey: 'serviceDecorators',
    isVerified: false,
    kyc: {
      panNumber: req.body.panNumber,
      gstNumber: req.body.gstNumber,
      bankAccount: req.body.bankAccount,
      ifscCode: req.body.ifscCode,
      upiId: req.body.upiId,
      payoutMethod: req.body.payoutMethod || 'bank',
      docsUploaded: Boolean(req.body.docsUploaded),
      status: 'submitted' as const,
    },
  };

  const vendor = await VendorProfile.findOneAndUpdate({ user: user._id }, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  user.isKycComplete = true;
  user.name = user.name || req.body.businessName;
  await user.save();
  return success(res, 'KYC submitted successfully', { vendor: ownerVendor(vendor!) });
}

export async function updateVendorProfile(req: AuthedRequest, res: Response) {
  const vendor = await VendorProfile.findOne({ user: req.userId });
  if (!vendor) throw new AppError('Vendor profile not found', 404);
  const map: Record<string, string> = {
    businessName: 'businessName',
    category: 'category',
    address: 'address',
    city: 'city',
    bio: 'bio',
    displayPhone: 'displayPhone',
    openTime: 'openTime',
    closeTime: 'closeTime',
    operatingDays: 'operatingDays',
  };
  for (const [bodyKey, field] of Object.entries(map)) {
    if (req.body[bodyKey] !== undefined) {
      (vendor as unknown as Record<string, unknown>)[field] = req.body[bodyKey];
    }
  }
  if (req.body.phone) vendor.displayPhone = req.body.phone;
  if (req.body.location) vendor.address = req.body.location;
  if (req.body.category) vendor.categorySlug = slugify(req.body.category);
  if (typeof req.body.isOnline === 'boolean') vendor.isOnline = req.body.isOnline;
  await vendor.save();
  return success(res, 'Vendor profile updated', { vendor: ownerVendor(vendor) });
}

export async function listLeads(req: AuthedRequest, res: Response) {
  const status = req.query.status as string | undefined;
  const filter: Record<string, unknown> = { vendor: req.userId };
  if (status && status !== 'all') filter.status = status;
  const items = await Lead.find(filter).sort({ createdAt: -1 });
  return success(res, 'Leads fetched successfully', {
    items: items.map((l) => ({
      id: String(l._id),
      customerName: l.customerName,
      phone: l.phone,
      eventType: l.eventType,
      eventDate: l.eventDate,
      venueCity: l.venueCity,
      guestCount: l.guestCount,
      budgetRange: l.budgetRange,
      status: l.status,
      notes: l.notes,
      timeAgo: timeAgo(l.createdAt),
    })),
  });
}

export async function createLead(req: AuthedRequest, res: Response) {
  let vendorId = req.body.vendorId;
  if (req.body.vendorProfileId) {
    const vp = await VendorProfile.findById(req.body.vendorProfileId);
    if (!vp) throw new AppError('Vendor not found', 404);
    vendorId = vp.user;
  }
  const lead = await Lead.create({
    customer: req.userId,
    vendor: vendorId,
    vendorProfile: req.body.vendorProfileId,
    customerName: req.body.customerName,
    phone: req.body.phone,
    eventType: req.body.eventType,
    eventDate: req.body.eventDate,
    venueCity: req.body.venueCity,
    guestCount: req.body.guestCount || '',
    budgetRange: req.body.budgetRange || '',
    notes: req.body.notes || '',
    category: req.body.category || '',
    status: 'new',
  });
  if (vendorId) {
    await Notification.create({
      user: vendorId,
      title: 'New lead',
      body: `${lead.customerName} posted a requirement for ${lead.eventType}.`,
      type: 'lead',
      data: { leadId: String(lead._id) },
    });
  }
  return success(res, 'Requirement posted successfully', { lead }, 201);
}

export async function updateLeadStatus(req: AuthedRequest, res: Response) {
  const lead = await Lead.findOne({ _id: req.params.id, vendor: req.userId });
  if (!lead) throw new AppError('Lead not found', 404);
  const allowed = ['new', 'contacted', 'quoted', 'closed'];
  if (req.body.status && !allowed.includes(req.body.status)) {
    throw new AppError('Invalid lead status', 400);
  }
  lead.status = req.body.status || lead.status;
  await lead.save();
  return success(res, 'Lead updated', { lead });
}

export async function createQuotation(req: AuthedRequest, res: Response) {
  const items = req.body.items || [];
  const subtotal = items.reduce((s: number, i: { price: number }) => s + Number(i.price || 0), 0);
  const discount = Number(req.body.discountApplied || 0);
  if (discount < 0) throw new AppError('Discount cannot be negative', 400);
  const total = Math.max(subtotal - discount, 0);
  let customerId = req.body.customerId;
  if (req.body.leadId) {
    const lead = await Lead.findOne({ _id: req.body.leadId, vendor: req.userId });
    if (!lead) throw new AppError('Lead not found', 404);
    customerId = lead.customer;
    lead.status = 'quoted';
    await lead.save();
  }
  if (!customerId && !req.body.customerName) throw new AppError('Customer is required', 400);
  const quotation = await Quotation.create({
    vendor: req.userId,
    customer: customerId,
    lead: req.body.leadId,
    customerName: req.body.customerName,
    eventDate: req.body.eventDate || '',
    packageName: req.body.packageName,
    items,
    advanceRequirement: Number(req.body.advanceRequirement || 0),
    discountApplied: discount,
    total,
    status: 'sent',
  });
  if (customerId) {
    await Notification.create({
      user: customerId,
      title: 'New quotation',
      body: `A quotation of ₹${total.toLocaleString('en-IN')} is ready.`,
      type: 'booking',
      data: { quotationId: String(quotation._id) },
    });
  }
  return success(res, 'Quotation sent', { quotation }, 201);
}

export async function createNegotiation(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  let customerId = req.userId;
  let vendorId = req.body.vendorId;
  if (user.role === 'vendor') {
    vendorId = req.userId;
    customerId = req.body.customerId;
  } else if (req.body.vendorProfileId && !vendorId) {
    const vp = await VendorProfile.findById(req.body.vendorProfileId);
    if (!vp) throw new AppError('Vendor not found', 404);
    vendorId = String(vp.user);
  }
  if (!vendorId || !customerId) throw new AppError('Customer and vendor are required', 400);
  const vendorUser = await User.findById(vendorId);
  if (!vendorUser || vendorUser.role !== 'vendor') throw new AppError('Vendor not found', 404);
  const negotiation = await Negotiation.create({
    customer: customerId,
    vendor: vendorId,
    quotation: req.body.quotationId,
    originalAmount: Number(req.body.originalAmount),
    counterOfferAmount: Number(req.body.counterOfferAmount),
    status: 'open',
  });
  return success(res, 'Counter offer submitted', { negotiation }, 201);
}

export async function agreeNegotiation(req: AuthedRequest, res: Response) {
  const negotiation = await Negotiation.findById(req.params.id);
  if (!negotiation) throw new AppError('Negotiation not found', 404);
  if (String(negotiation.vendor) !== req.userId && String(negotiation.customer) !== req.userId) {
    throw new AppError('Not authorized', 403);
  }
  negotiation.status = 'agreed';
  negotiation.agreedAmount = Number(req.body.agreedAmount || negotiation.counterOfferAmount);
  await negotiation.save();
  return success(res, 'Deal agreed', { negotiation });
}

export async function listMeetings(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  const filter = user?.role === 'vendor' ? { vendor: req.userId } : { customer: req.userId };
  const items = await Meeting.find(filter).sort({ createdAt: -1 });
  return success(res, 'Meetings fetched', { items });
}

export async function createMeeting(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  let vendorId = req.body.vendorId;
  if (req.body.vendorProfileId) {
    const vp = await VendorProfile.findById(req.body.vendorProfileId);
    if (!vp) throw new AppError('Vendor not found', 404);
    vendorId = String(vp.user);
  }
  if (!vendorId) throw new AppError('Vendor is required', 400);
  const meeting = await Meeting.create({
    customer: user._id,
    vendor: vendorId,
    customerName: user.name || 'Customer',
    phone: user.phone,
    meetingDate: req.body.meetingDate,
    meetingTime: req.body.meetingTime,
    meetingType: req.body.meetingType || 'in_person',
    meetingLocation: req.body.meetingLocation || '',
    eventType: req.body.eventType || '',
    purpose: req.body.purpose || '',
    notes: req.body.notes || req.body.purpose || '',
    status: 'pending',
  });
  await Notification.create({
    user: vendorId,
    title: 'Meeting request',
    body: `${user.name || 'A customer'} requested a meeting on ${meeting.meetingDate}.`,
    type: 'meeting',
    data: { meetingId: String(meeting._id) },
  });
  return success(res, 'Meeting scheduled', { meeting }, 201);
}

export async function updateMeeting(req: AuthedRequest, res: Response) {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) throw new AppError('Meeting not found', 404);
  if (String(meeting.vendor) !== req.userId && String(meeting.customer) !== req.userId) {
    throw new AppError('Not authorized', 403);
  }
  if (req.body.status) meeting.status = req.body.status;
  if (req.body.meetingDate) meeting.meetingDate = req.body.meetingDate;
  if (req.body.meetingTime) meeting.meetingTime = req.body.meetingTime;
  await meeting.save();
  return success(res, 'Meeting updated', { meeting });
}

export async function listPortfolio(req: AuthedRequest, res: Response) {
  const requested = String(req.query.vendorId || req.userId);
  const vendorId = requested;
  const items = await PortfolioItem.find({ vendor: vendorId }).sort({ createdAt: -1 });
  return success(res, 'Portfolio fetched', { items });
}

export async function addPortfolio(req: AuthedRequest, res: Response) {
  const vendor = await VendorProfile.findOne({ user: req.userId });
  if (!vendor) throw new AppError('Vendor profile not found', 404);
  const item = await PortfolioItem.create({
    vendor: req.userId,
    vendorProfile: vendor._id,
    title: req.body.title,
    uri: req.body.uri,
    views: 0,
  });
  vendor.photosCount += 1;
  await vendor.save();
  return success(res, 'Portfolio item added', { item }, 201);
}

export async function deletePortfolio(req: AuthedRequest, res: Response) {
  const result = await PortfolioItem.deleteOne({ _id: req.params.id, vendor: req.userId });
  if (!result.deletedCount) throw new AppError('Portfolio item not found', 404);
  return success(res, 'Portfolio item removed', {});
}

export async function getCalendar(req: AuthedRequest, res: Response) {
  const month = String(req.query.month || '');
  const block = await CalendarBlock.findOne({ vendor: req.userId, month });
  return success(res, 'Calendar fetched', {
    month,
    blockedDates: block?.blockedDates || [],
  });
}

export async function updateCalendar(req: AuthedRequest, res: Response) {
  const month = String(req.body.month);
  const blockedDates: number[] = req.body.blockedDates || [];
  const block = await CalendarBlock.findOneAndUpdate(
    { vendor: req.userId, month },
    { blockedDates },
    { upsert: true, new: true },
  );
  return success(res, 'Calendar updated', { month, blockedDates: block.blockedDates });
}

export async function wallet(req: AuthedRequest, res: Response) {
  const vendor = await VendorProfile.findOne({ user: req.userId });
  if (!vendor) throw new AppError('Vendor profile not found', 404);
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const [items, total] = await Promise.all([
    WalletTransaction.find({ vendor: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    WalletTransaction.countDocuments({ vendor: req.userId }),
  ]);
  return success(res, 'Wallet fetched', {
    availableBalance: vendor.walletBalance,
    items,
    pagination: paginate(page, limit, total),
  });
}

export async function withdraw(req: AuthedRequest, res: Response) {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('Invalid withdrawal amount', 400);
  }
  const vendor = await VendorProfile.findOneAndUpdate(
    { user: req.userId, walletBalance: { $gte: amount } },
    { $inc: { walletBalance: -amount } },
    { new: true },
  );
  if (!vendor) {
    throw new AppError('Insufficient wallet balance', 400);
  }
  const tx = await WalletTransaction.create({
    vendor: req.userId,
    title: 'Payout withdrawal',
    grossAmount: amount,
    commission: 0,
    netAmount: amount,
    status: 'debit',
  });
  return success(res, 'Withdrawal requested', { transaction: tx, availableBalance: vendor.walletBalance });
}

export async function vendorReviews(req: AuthedRequest, res: Response) {
  const items = await Review.find({ vendor: req.userId }).sort({ createdAt: -1 });
  return success(res, 'Reviews fetched', { items });
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}
