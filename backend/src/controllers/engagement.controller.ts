import { Response } from 'express';
import { Favorite } from '../models/Favorite';
import { Address } from '../models/Address';
import { PaymentMethod } from '../models/PaymentMethod';
import { Conversation, Message } from '../models/Chat';
import { Notification } from '../models/Notification';
import { Review } from '../models/Review';
import { SupportTicket } from '../models/SupportTicket';
import { VendorProfile } from '../models/VendorProfile';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { AppError } from '../utils/errors';
import { paginate, parsePagination, success } from '../utils/response';
import { detectCardBrand, generateTicketId, maskCard } from '../utils/crypto';
import { publicVendor } from '../utils/serializers';
import { AuthedRequest } from '../middleware/auth';
import { getIo } from '../config/socket';

export async function listFavorites(req: AuthedRequest, res: Response) {
  const type = req.query.type as string | undefined;
  const filter: Record<string, unknown> = { user: req.userId };
  if (type && type !== 'All' && type !== 'all') {
    const map: Record<string, string> = { Venues: 'Venue', Vendors: 'Vendor', Services: 'Service' };
    filter.type = map[type] || type;
  }
  const rows = await Favorite.find(filter).populate('vendorProfile').sort({ createdAt: -1 });
  const items = rows
    .filter((r) => r.vendorProfile)
    .map((r) => {
      const v = r.vendorProfile as unknown as InstanceType<typeof VendorProfile>;
      return {
        ...publicVendor(v),
        favoriteId: String(r._id),
        type: r.type,
        title: v.businessName,
        subtitle: `${v.category}, ${v.city}`,
        isFavorite: true,
      };
    });
  return success(res, 'Favorites fetched', { items });
}

export async function toggleFavorite(req: AuthedRequest, res: Response) {
  const vendorProfileId = req.body.vendorProfileId || req.params.id;
  const vendor = await VendorProfile.findById(vendorProfileId);
  if (!vendor) throw new AppError('Vendor not found', 404);
  const existing = await Favorite.findOne({ user: req.userId, vendorProfile: vendor._id });
  if (existing) {
    await existing.deleteOne();
    return success(res, 'Removed from wishlist', { isFavorite: false, vendorProfileId: String(vendor._id) });
  }
  const type = req.body.type || (vendor.category.toLowerCase().includes('venue') ? 'Venue' : 'Vendor');
  await Favorite.create({ user: req.userId, vendorProfile: vendor._id, type });
  return success(res, 'Saved to wishlist', { isFavorite: true, vendorProfileId: String(vendor._id) });
}

export async function listAddresses(req: AuthedRequest, res: Response) {
  const items = await Address.find({ user: req.userId }).sort({ isDefault: -1, createdAt: -1 });
  return success(res, 'Addresses fetched', { items });
}

export async function createAddress(req: AuthedRequest, res: Response) {
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.userId }, { isDefault: false });
  }
  const item = await Address.create({ ...req.body, user: req.userId });
  return success(res, 'Address saved', { item }, 201);
}

export async function updateAddress(req: AuthedRequest, res: Response) {
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.userId }, { isDefault: false });
  }
  const item = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true },
  );
  if (!item) throw new AppError('Address not found', 404);
  return success(res, 'Address updated', { item });
}

export async function deleteAddress(req: AuthedRequest, res: Response) {
  const result = await Address.deleteOne({ _id: req.params.id, user: req.userId });
  if (!result.deletedCount) throw new AppError('Address not found', 404);
  return success(res, 'Address deleted', {});
}

export async function listPaymentMethods(req: AuthedRequest, res: Response) {
  const items = await PaymentMethod.find({ user: req.userId }).sort({ isDefault: -1, createdAt: -1 });
  return success(res, 'Payment methods fetched', { items });
}

export async function createPaymentMethod(req: AuthedRequest, res: Response) {
  if (req.body.isDefault) {
    await PaymentMethod.updateMany({ user: req.userId }, { isDefault: false });
  }
  let brand = req.body.brand;
  let subtitle = req.body.subtitle || req.body.upiId || req.body.walletNumber || '';
  let last4: string | undefined;
  if (req.body.type === 'card' && req.body.cardNumber) {
    brand = detectCardBrand(req.body.cardNumber);
    subtitle = maskCard(req.body.cardNumber);
    last4 = req.body.cardNumber.replace(/\D/g, '').slice(-4);
  }
  if (req.body.type === 'upi') brand = brand || 'gpay';
  if (req.body.type === 'wallet') brand = brand || 'paytm';
  const item = await PaymentMethod.create({
    user: req.userId,
    type: req.body.type,
    brand: brand || 'visa',
    title: req.body.title,
    subtitle,
    expiry: req.body.expiry ? `Valid till ${req.body.expiry}` : undefined,
    last4,
    holderName: req.body.holderName,
    isDefault: Boolean(req.body.isDefault),
  });
  return success(res, 'Payment method saved', { item }, 201);
}

export async function deletePaymentMethod(req: AuthedRequest, res: Response) {
  const result = await PaymentMethod.deleteOne({ _id: req.params.id, user: req.userId });
  if (!result.deletedCount) throw new AppError('Payment method not found', 404);
  return success(res, 'Payment method removed', {});
}

export async function setDefaultPaymentMethod(req: AuthedRequest, res: Response) {
  await PaymentMethod.updateMany({ user: req.userId }, { isDefault: false });
  const item = await PaymentMethod.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { isDefault: true },
    { new: true },
  );
  if (!item) throw new AppError('Payment method not found', 404);
  return success(res, 'Default payment method updated', { item });
}

export async function listConversations(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  const filter = user?.role === 'vendor' ? { vendor: req.userId } : { customer: req.userId };
  const items = await Conversation.find(filter)
    .populate('vendorProfile')
    .populate('customer', 'name phone')
    .sort({ updatedAt: -1 });
  return success(res, 'Conversations fetched', { items });
}

export async function getOrCreateConversation(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user || user.role !== 'customer') throw new AppError('Only customers can start a conversation', 403);
  const vendorProfile = await VendorProfile.findById(req.body.vendorProfileId || req.params.vendorProfileId);
  if (!vendorProfile) throw new AppError('Vendor not found', 404);
  const convo = await Conversation.findOneAndUpdate(
    { customer: req.userId, vendor: vendorProfile.user },
    {
      customer: req.userId,
      vendor: vendorProfile.user,
      vendorProfile: vendorProfile._id,
    },
    { upsert: true, new: true },
  );
  return success(res, 'Conversation ready', {
    conversation: convo,
    vendor: publicVendor(vendorProfile),
  });
}

export async function listMessages(req: AuthedRequest, res: Response) {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const convo = await Conversation.findById(req.params.id).populate('vendorProfile');
  if (!convo) throw new AppError('Conversation not found', 404);
  if (String(convo.customer) !== req.userId && String(convo.vendor) !== req.userId) {
    throw new AppError('Not authorized', 403);
  }
  const [rows, total] = await Promise.all([
    Message.find({ conversation: convo._id }).sort({ createdAt: 1 }).skip(skip).limit(limit),
    Message.countDocuments({ conversation: convo._id }),
  ]);
  const user = await User.findById(req.userId);
  if (user?.role === 'vendor') {
    convo.vendorUnread = 0;
  } else {
    convo.customerUnread = 0;
  }
  await convo.save();
  await Message.updateMany(
    { conversation: convo._id, sender: { $ne: req.userId }, read: false },
    { read: true },
  );
  return success(res, 'Messages fetched', {
    conversation: convo,
    items: rows.map((m) => ({
      id: String(m._id),
      sender: m.senderRole,
      text: m.text,
      time: m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: m.read,
      hasMeetingAction: m.hasMeetingAction,
      hasQuotationAction: m.hasQuotationAction,
      createdAt: m.createdAt,
    })),
    pagination: paginate(page, limit, total),
  });
}

export async function sendMessage(req: AuthedRequest, res: Response) {
  const convo = await Conversation.findById(req.params.id);
  if (!convo) throw new AppError('Conversation not found', 404);
  if (String(convo.customer) !== req.userId && String(convo.vendor) !== req.userId) {
    throw new AppError('Not authorized', 403);
  }
  const user = await User.findById(req.userId);
  const senderRole = user?.role === 'vendor' ? 'vendor' : 'user';
  const message = await Message.create({
    conversation: convo._id,
    sender: req.userId,
    senderRole,
    text: req.body.text,
    read: false,
  });
  convo.lastMessage = req.body.text;
  convo.lastMessageAt = new Date();
  if (senderRole === 'vendor') convo.customerUnread += 1;
  else convo.vendorUnread += 1;
  await convo.save();

  const other = senderRole === 'vendor' ? convo.customer : convo.vendor;
  await Notification.create({
    user: other,
    title: 'New message',
    body: req.body.text.slice(0, 80),
    type: 'message',
    data: { conversationId: String(convo._id) },
  });

  const io = getIo();
  io?.to(`conversation:${String(convo._id)}`).emit('message:new', {
    conversationId: String(convo._id),
    message: {
      id: String(message._id),
      sender: senderRole,
      text: message.text,
      time: message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    },
  });

  return success(res, 'Message sent', {
    message: {
      id: String(message._id),
      sender: senderRole,
      text: message.text,
      time: message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    },
  }, 201);
}

export async function listNotifications(req: AuthedRequest, res: Response) {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const [items, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ user: req.userId }),
    Notification.countDocuments({ user: req.userId, isRead: false }),
  ]);
  return success(res, 'Notifications fetched', {
    items,
    unreadCount,
    pagination: paginate(page, limit, total),
  });
}

export async function markNotificationRead(req: AuthedRequest, res: Response) {
  await Notification.updateOne({ _id: req.params.id, user: req.userId }, { isRead: true });
  return success(res, 'Notification marked as read', {});
}

export async function markAllNotificationsRead(req: AuthedRequest, res: Response) {
  await Notification.updateMany({ user: req.userId, isRead: false }, { isRead: true });
  return success(res, 'All notifications marked as read', {});
}

export async function createReview(req: AuthedRequest, res: Response) {
  const vendor = await VendorProfile.findById(req.body.vendorProfileId);
  if (!vendor) throw new AppError('Vendor not found', 404);
  if (!req.body.bookingId) throw new AppError('A completed booking is required to leave a review', 400);
  const booking = await Booking.findOne({
    _id: req.body.bookingId,
    customer: req.userId,
    vendorProfile: vendor._id,
  });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'Completed') {
    throw new AppError('You can only review a completed booking', 400);
  }
  const existing = await Review.findOne({ booking: booking._id, customer: req.userId });
  if (existing) throw new AppError('You have already reviewed this booking', 409);
  const review = await Review.create({
    customer: req.userId,
    vendor: vendor.user,
    vendorProfile: vendor._id,
    booking: booking._id,
    rating: req.body.rating,
    tags: req.body.tags || [],
    text: req.body.text || '',
    photos: req.body.photos || [],
  });
  const agg = await Review.aggregate([
    { $match: { vendorProfile: vendor._id } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (agg[0]) {
    vendor.rating = Number(agg[0].avg.toFixed(1));
    vendor.reviewsCount = agg[0].count;
    await vendor.save();
  }
  return success(res, 'Review submitted', { review }, 201);
}

export async function listTickets(req: AuthedRequest, res: Response) {
  const items = await SupportTicket.find({ user: req.userId }).sort({ createdAt: -1 });
  return success(res, 'Tickets fetched', {
    items: items.map((t) => ({
      id: t.ticketCode,
      _id: String(t._id),
      bookingId: t.bookingId,
      vendorName: t.vendorName,
      issueType: t.issueType,
      subject: t.subject,
      description: t.description,
      status: t.status,
      createdAt: t.createdAt.toLocaleString('en-IN'),
      lastReply: t.lastReply,
    })),
  });
}

export async function createTicket(req: AuthedRequest, res: Response) {
  const ticket = await SupportTicket.create({
    user: req.userId,
    ticketCode: generateTicketId(),
    bookingId: req.body.bookingId,
    vendorName: req.body.vendorName,
    issueType: req.body.issueType,
    subject: req.body.subject,
    description: req.body.description,
    isUrgent: Boolean(req.body.isUrgent),
    status: 'Open',
  });
  return success(res, 'Support ticket created', { ticket }, 201);
}
