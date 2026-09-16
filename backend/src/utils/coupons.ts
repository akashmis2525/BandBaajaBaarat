import { Coupon, ICoupon } from '../models/Coupon';
import { CouponRedemption } from '../models/CouponRedemption';
import { AppError } from './errors';

const MONTHS: Record<string, string> = {
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

export function parseExpiryDate(expiryDate?: string, expiresAt?: Date): Date | null {
  if (expiresAt) return expiresAt;
  if (!expiryDate) return null;
  const match = expiryDate.match(/(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
  if (!match) return null;
  const month = MONTHS[match[2].slice(0, 3)] || match[2];
  const parsed = new Date(`${match[1]} ${month} ${match[3]} UTC`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function computeDiscount(coupon: ICoupon, amount: number) {
  if (coupon.discountType === 'percentage') {
    const d = (amount * coupon.discountValue) / 100;
    return coupon.maxDiscount ? Math.min(d, coupon.maxDiscount) : d;
  }
  if (coupon.discountType === 'flat') return coupon.discountValue;
  return 0;
}

export async function resolveCoupon(code: string, amount: number, userId?: string) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) throw new AppError('Coupon code is required', 400);

  const coupon = await Coupon.findOne({ code: normalized });
  if (!coupon || !coupon.isActive) throw new AppError('Invalid coupon code', 404);

  const expiry = parseExpiryDate(coupon.expiryDate, coupon.expiresAt);
  if (expiry && expiry.getTime() < Date.now()) {
    throw new AppError('This coupon has expired', 400);
  }
  if (amount < coupon.minBookingAmount) {
    throw new AppError(
      `Minimum booking amount of ₹${coupon.minBookingAmount.toLocaleString('en-IN')} required`,
      400,
    );
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }
  if (userId) {
    const used = await CouponRedemption.findOne({ user: userId, code: coupon.code });
    if (used) throw new AppError('You have already used this coupon', 409);
  }

  return {
    coupon,
    discount: computeDiscount(coupon, amount),
  };
}
