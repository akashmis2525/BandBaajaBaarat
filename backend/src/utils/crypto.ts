import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export function generateOtp(): string {
  return String(crypto.randomInt(1000, 10000));
}

export async function hashValue(value: string): Promise<string> {
  return bcrypt.hash(value, 10);
}

export async function compareHash(value: string, hash: string): Promise<boolean> {
  return bcrypt.compare(value, hash);
}

export function generateReferralCode(phone: string): string {
  const suffix = phone.slice(-4);
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BAND${suffix}${rand}`;
}

export function generateBookingCode(): string {
  const n = crypto.randomInt(100000, 999999);
  return `BBBD${n}`;
}

export function generateTicketId(): string {
  const n = crypto.randomInt(10000, 99999);
  return `TKT-${n}`;
}

export function maskCard(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `**** **** **** ${last4}`;
}

export function detectCardBrand(cardNumber: string): 'mastercard' | 'visa' | 'gpay' | 'paytm' {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'visa';
  return 'mastercard';
}
