import { Response } from 'express';
import { User } from '../models/User';
import { Otp } from '../models/Otp';
import { VendorProfile } from '../models/VendorProfile';
import { Referral } from '../models/Referral';
import { compareHash, generateOtp, generateReferralCode, hashValue } from '../utils/crypto';
import { tokenPair, verifyRefreshToken } from '../utils/tokens';
import { AppError } from '../utils/errors';
import { success } from '../utils/response';
import { publicUser } from '../utils/serializers';
import { env } from '../config/env';
import { deliverOtpSms } from '../utils/sms';
import { AuthedRequest } from '../middleware/auth';

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '').slice(-10);
}

async function issueSession(user: InstanceType<typeof User>) {
  const tokens = tokenPair({
    sub: String(user._id),
    role: user.role,
    phone: user.phone,
  });
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), tokens.refreshToken];
  user.lastLoginAt = new Date();
  await user.save();
  return tokens;
}

export async function sendOtp(req: AuthedRequest, res: Response) {
  const phone = normalizePhone(String(req.body.phone));
  const role = (req.body.role || 'customer') as 'customer' | 'vendor';
  const code = generateOtp();
  const codeHash = await hashValue(code);
  await Otp.updateMany({ phone, role, consumed: false }, { consumed: true });
  await Otp.create({
    phone,
    role,
    codeHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const payload: Record<string, unknown> = {
    phone,
    expiresInSeconds: 300,
  };
  if (env.exposeOtp) {
    payload.otp = code;
  } else {
    await deliverOtpSms(phone, code);
  }

  return success(res, 'OTP sent successfully', payload);
}

export async function verifyOtp(req: AuthedRequest, res: Response) {
  const phone = normalizePhone(String(req.body.phone));
  const role = (req.body.role || 'customer') as 'customer' | 'vendor';
  const otp = String(req.body.otp);

  const record = await Otp.findOne({ phone, role, consumed: false }).sort({ createdAt: -1 });
  if (!record) throw new AppError('OTP not found. Please request a new one.', 400);
  if (record.expiresAt.getTime() < Date.now()) throw new AppError('OTP has expired', 400);
  if (record.attempts >= 5) throw new AppError('Too many attempts. Request a new OTP.', 429);

  const ok = await compareHash(otp, record.codeHash);
  if (!ok) {
    record.attempts += 1;
    await record.save();
    throw new AppError('Incorrect OTP', 400);
  }
  record.consumed = true;
  await record.save();

  let user = await User.findOne({ phone, role });
  let isNewUser = false;
  if (!user) {
    isNewUser = true;
    user = await User.create({
      role,
      phone,
      name: '',
      referralCode: generateReferralCode(phone),
      isProfileComplete: false,
      isKycComplete: false,
    });
  }
  if (user.isBlocked) throw new AppError('This account has been deactivated', 403);

  const tokens = await issueSession(user);
  return success(res, 'Login successful', {
    ...tokens,
    user: publicUser(user),
    isNewUser,
  });
}

export async function vendorEmailLogin(req: AuthedRequest, res: Response) {
  const email = String(req.body.email).toLowerCase();
  const password = String(req.body.password);
  const user = await User.findOne({ email, role: 'vendor' });
  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password', 401);
  }
  if (user.isBlocked) throw new AppError('This account has been deactivated', 403);
  const ok = await compareHash(password, user.passwordHash);
  if (!ok) throw new AppError('Invalid email or password', 401);
  const tokens = await issueSession(user);
  return success(res, 'Login successful', {
    ...tokens,
    user: publicUser(user),
    isNewUser: false,
  });
}

export async function refresh(req: AuthedRequest, res: Response) {
  const refreshToken = String(req.body.refreshToken);
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user || user.isBlocked || !user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Invalid refresh token', 401);
    }
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const tokens = await issueSession(user);
    return success(res, 'Token refreshed', { ...tokens, user: publicUser(user) });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Invalid refresh token', 401);
  }
}

export async function logout(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (user) {
    const token = req.body?.refreshToken;
    user.refreshTokens = token
      ? user.refreshTokens.filter((t) => t !== token)
      : [];
    await user.save();
  }
  return success(res, 'Logged out successfully', {});
}

export async function me(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  const vendor =
    user.role === 'vendor' ? await VendorProfile.findOne({ user: user._id }) : null;
  return success(res, 'Current user fetched', {
    user: publicUser(user),
    vendor,
  });
}

export async function completeProfile(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);

  user.name = req.body.name;
  user.email = req.body.email;
  user.whatsappNumber = req.body.whatsappNumber;
  user.isProfileComplete = true;

  if (req.body.referralCode) {
    const referrer = await User.findOne({
      referralCode: String(req.body.referralCode).toUpperCase(),
    });
    if (referrer && String(referrer._id) !== String(user._id) && !user.referredBy) {
      user.referredBy = referrer._id;
      await Referral.create({
        referrer: referrer._id,
        referee: user._id,
        refereeName: user.name,
        status: 'Pending',
        reward: 0,
      });
    }
  }

  await user.save();
  return success(res, 'Profile completed', { user: publicUser(user) });
}

export async function applyReferral(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  const code = String(req.body.referralCode || '').toUpperCase();
  const referrer = await User.findOne({ referralCode: code });
  if (!referrer) throw new AppError('Invalid referral code', 404);
  if (String(referrer._id) === String(user._id)) {
    throw new AppError('You cannot use your own referral code', 400);
  }
  if (user.referredBy) throw new AppError('Referral already applied', 409);
  user.referredBy = referrer._id;
  await user.save();
  await Referral.create({
    referrer: referrer._id,
    referee: user._id,
    refereeName: user.name,
    status: 'Pending',
    reward: 0,
  });
  return success(res, 'Referral applied', { user: publicUser(user) });
}
