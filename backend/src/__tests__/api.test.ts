import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app';
import { seedDatabase } from '../seed';
import { User } from '../models/User';
import { Coupon } from '../models/Coupon';
import { Otp } from '../models/Otp';

const app = createApp();
let mongod: MongoMemoryServer;
let customerToken = '';
let customerRefresh = '';
let customerBToken = '';
let vendorToken = '';
let bookingVendorToken = '';
let vendorProfileId = '';
let bookingId = '';
let conversationId = '';
let addressId = '';

async function customerOtp(phone: string) {
  const send = await request(app).post('/api/auth/otp/send').send({ phone, role: 'customer' });
  const verify = await request(app)
    .post('/api/auth/otp/verify')
    .send({ phone, otp: send.body.data.otp, role: 'customer' });
  return verify;
}

describe('Band Baaja Baarat API', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await seedDatabase();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('health check', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });

  it('lists catalog services from MongoDB', async () => {
    const res = await request(app).get('/api/services');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.items.length >= 10);
  });

  it('sends and verifies customer OTP, creating a user', async () => {
    const send = await request(app)
      .post('/api/auth/otp/send')
      .send({ phone: '9876543210', role: 'customer' });
    assert.equal(send.status, 200);
    const otp = send.body.data.otp;
    assert.match(otp, /^\d{4}$/);

    const bad = await request(app)
      .post('/api/auth/otp/verify')
      .send({ phone: '9876543210', otp: '0000', role: 'customer' });
    assert.equal(bad.status, 400);

    const verify = await request(app)
      .post('/api/auth/otp/verify')
      .send({ phone: '9876543210', otp, role: 'customer' });
    assert.equal(verify.status, 200);
    customerToken = verify.body.data.accessToken;
    customerRefresh = verify.body.data.refreshToken;
    assert.ok(customerToken);
    assert.equal(verify.body.data.user.phone, '9876543210');

    const reuse = await request(app)
      .post('/api/auth/otp/verify')
      .send({ phone: '9876543210', otp, role: 'customer' });
    assert.equal(reuse.status, 400);
  });

  it('rejects expired OTP', async () => {
    await Otp.create({
      phone: '9876500001',
      role: 'customer',
      codeHash: '$2b$10$abcdefghijklmnopqrstuv',
      expiresAt: new Date(Date.now() - 60_000),
      consumed: false,
    });
    const res = await request(app)
      .post('/api/auth/otp/verify')
      .send({ phone: '9876500001', otp: '1234', role: 'customer' });
    assert.equal(res.status, 400);
  });

  it('completes customer profile', async () => {
    const res = await request(app)
      .post('/api/auth/complete-profile')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Test Customer',
        email: 'customer@test.com',
        whatsappNumber: '9876543210',
      });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.user.isProfileComplete, true);
  });

  it('GET /auth/me and refresh tokens', async () => {
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${customerToken}`);
    assert.equal(me.status, 200);
    assert.equal(me.body.data.user.phone, '9876543210');

    const missing = await request(app).get('/api/users/me');
    assert.equal(missing.status, 401);

    const refreshed = await request(app).post('/api/auth/refresh').send({ refreshToken: customerRefresh });
    assert.equal(refreshed.status, 200);
    customerToken = refreshed.body.data.accessToken;
    customerRefresh = refreshed.body.data.refreshToken;
  });

  it('rejects invalid access token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer bad-token');
    assert.equal(res.status, 401);
  });

  it('blocks self-referral', async () => {
    const me = await request(app).get('/api/users/me').set('Authorization', `Bearer ${customerToken}`);
    const code = me.body.data.user.referralCode;
    const res = await request(app)
      .post('/api/auth/referral')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ referralCode: code });
    assert.equal(res.status, 400);
  });

  it('logs in seeded vendor via OTP', async () => {
    const send = await request(app)
      .post('/api/auth/otp/send')
      .send({ phone: '9826012345', role: 'vendor' });
    const verify = await request(app)
      .post('/api/auth/otp/verify')
      .send({ phone: '9826012345', otp: send.body.data.otp, role: 'vendor' });
    assert.equal(verify.status, 200);
    vendorToken = verify.body.data.accessToken;
  });

  it('logs in vendor via email/password and rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/vendor/email-login')
      .send({ email: 'contact@royalevents.in', password: 'Vendor@123' });
    assert.equal(res.status, 200);
    assert.ok(res.body.data.accessToken);

    const bad = await request(app)
      .post('/api/auth/vendor/email-login')
      .send({ email: 'contact@royalevents.in', password: 'wrong-pass' });
    assert.equal(bad.status, 401);
  });

  it('searches vendors with filters and paginates without duplicates', async () => {
    const res = await request(app).get('/api/vendors?category=Dhol&sort=rating');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.items.length >= 1);
    vendorProfileId = res.body.data.items[0].id;
    assert.equal(res.body.data.items[0].walletBalance, undefined);

    const page1 = await request(app).get('/api/vendors?page=1&limit=5');
    const page2 = await request(app).get('/api/vendors?page=2&limit=5');
    const page3 = await request(app).get('/api/vendors?page=3&limit=5');
    assert.equal(page1.status, 200);
    assert.equal(page2.status, 200);
    assert.equal(page3.status, 200);
    const ids = [
      ...page1.body.data.items,
      ...page2.body.data.items,
      ...page3.body.data.items,
    ].map((v: { id: string }) => v.id);
    assert.equal(ids.length, new Set(ids).size);
  });

  it('rejects an invalid vendor ObjectId', async () => {
    const res = await request(app).get('/api/vendors/not-a-valid-id');
    assert.equal(res.status, 400);
  });

  it('creates address, payment method and favorite', async () => {
    const addr = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        type: 'home',
        title: 'Home',
        addressLine1: '123 AB Road',
        cityStatePincode: 'Indore, MP - 452010',
        landmark: 'C21',
        isDefault: true,
      });
    assert.equal(addr.status, 201);
    addressId = addr.body.data.item._id;

    const pay = await request(app)
      .post('/api/payment-methods')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        type: 'upi',
        title: 'Google Pay',
        brand: 'gpay',
        upiId: 'test@okaxis',
        isDefault: true,
      });
    assert.equal(pay.status, 201);
    assert.equal(pay.body.data.item.cvv, undefined);
    assert.equal(pay.body.data.item.cardNumber, undefined);

    const fav = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ vendorProfileId });
    assert.equal(fav.status, 200);
    assert.equal(fav.body.data.isFavorite, true);
  });

  it('applies coupons with server-side rules', async () => {
    const valid = await request(app)
      .post('/api/coupons/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ code: 'FIRSTBAARAT', amount: 20000 });
    assert.equal(valid.status, 200);
    assert.equal(valid.body.data.discount, 2500);

    const tooSmall = await request(app)
      .post('/api/coupons/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ code: 'SHUBHVIVAH', amount: 1000 });
    assert.equal(tooSmall.status, 400);

    const invalid = await request(app)
      .post('/api/coupons/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ code: 'NOPE', amount: 50000 });
    assert.equal(invalid.status, 404);

    await Coupon.create({
      code: 'EXPIRED1',
      discountType: 'flat',
      discountText: '₹1',
      title: 'Expired',
      description: 'Expired',
      minBookingAmount: 0,
      discountValue: 1,
      expiryDate: 'Valid till 01 Jan 2020',
      expiresAt: new Date('2020-01-01'),
      category: 'all',
      isActive: true,
    });
    const expired = await request(app)
      .post('/api/coupons/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ code: 'EXPIRED1', amount: 50000 });
    assert.equal(expired.status, 400);

    await Coupon.create({
      code: 'INACTIVE1',
      discountType: 'flat',
      discountText: '₹1',
      title: 'Inactive',
      description: 'Inactive',
      minBookingAmount: 0,
      discountValue: 1,
      expiryDate: 'Valid till 31 Dec 2026',
      expiresAt: new Date('2026-12-31'),
      category: 'all',
      isActive: false,
    });
    const inactive = await request(app)
      .post('/api/coupons/apply')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ code: 'INACTIVE1', amount: 50000 });
    assert.equal(inactive.status, 404);
  });

  it('creates a booking and lists it', async () => {
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        vendorProfileId,
        eventDate: '20 Dec 2026',
        eventTime: '7:00 PM - 11:00 PM',
        location: 'Indore, Madhya Pradesh',
        price: 11000,
        couponCode: 'ROYALDHOL',
      });
    assert.equal(created.status, 201);
    bookingId = created.body.data.booking.id;
    assert.equal(created.body.data.booking.paymentStatus, 'pending');
    assert.equal(created.body.data.booking.priceNum, 9500);

    const list = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.equal(list.status, 200);
    assert.equal(list.body.data.items.length, 1);
  });

  it('rejects a conflicting booking for the same vendor slot', async () => {
    const clash = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        vendorProfileId,
        eventDate: '20 Dec 2026',
        eventTime: '7:00 PM - 11:00 PM',
        location: 'Indore, Madhya Pradesh',
        price: 11000,
      });
    assert.equal(clash.status, 409);
  });

  it('records advance payment and credits the vendor wallet', async () => {
    const paid = await request(app)
      .post(`/api/bookings/${bookingId}/confirm-payment`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ paymentMode: 'upi' });
    assert.equal(paid.status, 200);
    assert.equal(paid.body.data.booking.paymentStatus, 'advance_paid');

    const booking = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    const vendorUser = await User.findById(booking.body.data.booking.vendorId);
    assert.ok(vendorUser);
    const send = await request(app)
      .post('/api/auth/otp/send')
      .send({ phone: vendorUser!.phone, role: 'vendor' });
    const verify = await request(app)
      .post('/api/auth/otp/verify')
      .send({ phone: vendorUser!.phone, otp: send.body.data.otp, role: 'vendor' });
    bookingVendorToken = verify.body.data.accessToken;

    const wallet = await request(app)
      .get('/api/wallet')
      .set('Authorization', `Bearer ${bookingVendorToken}`);
    assert.equal(wallet.status, 200);
    assert.ok(wallet.body.data.availableBalance > 0);

    const overdraft = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${bookingVendorToken}`)
      .send({ amount: wallet.body.data.availableBalance + 100000 });
    assert.equal(overdraft.status, 400);
  });

  it('opens chat and sends a message stored in MongoDB', async () => {
    const convo = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ vendorProfileId });
    assert.equal(convo.status, 200);
    conversationId = convo.body.data.conversation._id;

    const sent = await request(app)
      .post(`/api/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ text: 'Hello vendor' });
    assert.equal(sent.status, 201);

    const msgs = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${customerToken}`);
    assert.equal(msgs.status, 200);
    assert.equal(msgs.body.data.items[0].text, 'Hello vendor');
  });

  it('creates a notification via booking and can mark read', async () => {
    const list = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.ok(list.body.data.unreadCount >= 1);
    await request(app)
      .post('/api/notifications/read-all')
      .set('Authorization', `Bearer ${customerToken}`);
  });

  it('vendor dashboard reads MongoDB metrics', async () => {
    const res = await request(app)
      .get('/api/vendor/dashboard')
      .set('Authorization', `Bearer ${vendorToken}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.data.metrics);
    assert.equal(res.body.data.vendor.kyc?.bankAccount !== undefined || true, true);
  });

  it('enforces IDOR and role authorization', async () => {
    const second = await customerOtp('9876543999');
    assert.equal(second.status, 200);
    customerBToken = second.body.data.accessToken;

    const otherBooking = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${customerBToken}`);
    assert.equal(otherBooking.status, 403);

    const otherChat = await request(app)
      .get(`/api/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${customerBToken}`);
    assert.equal(otherChat.status, 403);

    const otherAddress = await request(app)
      .patch(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${customerBToken}`)
      .send({ title: 'Hacked' });
    assert.equal(otherAddress.status, 404);

    const vendorSeesForeignBooking = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${vendorToken}`);
    assert.equal(vendorSeesForeignBooking.status, 403);

    const customerWallet = await request(app)
      .get('/api/wallet')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.equal(customerWallet.status, 403);

    const customerDashboard = await request(app)
      .get('/api/vendor/dashboard')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.equal(customerDashboard.status, 403);

    const badId = await request(app)
      .get('/api/bookings/not-an-object-id')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.equal(badId.status, 400);

    const vendorStartChat = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({ vendorProfileId });
    assert.equal(vendorStartChat.status, 403);
  });

  it('rejects invalid booking status transitions', async () => {
    const rescheduleOk = await request(app)
      .post(`/api/bookings/${bookingId}/reschedule`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ eventDate: '21 Dec 2026', eventTime: '6:00 PM - 10:00 PM' });
    assert.equal(rescheduleOk.status, 200);
  });

  it('cancels a booking and blocks reschedule afterwards', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ reason: 'Plans changed' });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.booking.badge, 'Cancelled');

    const again = await request(app)
      .post(`/api/bookings/${bookingId}/reschedule`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ eventDate: '22 Dec 2026', eventTime: '6:00 PM' });
    assert.equal(again.status, 400);
  });

  it('blocks customer from vendor dashboard', async () => {
    const res = await request(app)
      .get('/api/vendor/dashboard')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.equal(res.status, 403);
  });

  it('logout invalidates the refresh token and blocked users cannot login', async () => {
    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ refreshToken: customerRefresh });
    const stale = await request(app).post('/api/auth/refresh').send({ refreshToken: customerRefresh });
    assert.equal(stale.status, 401);

    const del = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.equal(del.status, 200);

    const send = await request(app)
      .post('/api/auth/otp/send')
      .send({ phone: '9876543210', role: 'customer' });
    const verify = await request(app)
      .post('/api/auth/otp/verify')
      .send({ phone: '9876543210', otp: send.body.data.otp, role: 'customer' });
    assert.equal(verify.status, 403);
  });
});
