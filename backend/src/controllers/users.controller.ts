import { Response } from 'express';
import { User } from '../models/User';
import { Referral } from '../models/Referral';
import { AppError } from '../utils/errors';
import { success } from '../utils/response';
import { publicUser } from '../utils/serializers';
import { AuthedRequest } from '../middleware/auth';
import { compareHash, hashValue } from '../utils/crypto';

export async function getProfile(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  return success(res, 'Profile fetched successfully', { user: publicUser(user) });
}

export async function updateProfile(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  const allowed = [
    'name',
    'email',
    'whatsappNumber',
    'weddingDate',
    'customerRole',
    'dob',
    'gender',
    'city',
    'state',
    'locationLabel',
    'language',
    'aboutMe',
    'interests',
    'photoUrl',
    'darkModeEnabled',
    'gpsAutoDetect',
  ] as const;
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      (user as unknown as Record<string, unknown>)[key] = req.body[key];
    }
  }
  if (user.name && user.email) user.isProfileComplete = true;
  await user.save();
  return success(res, 'Profile updated successfully', { user: publicUser(user) });
}

export async function changePassword(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  if (user.passwordHash) {
    if (!req.body.currentPassword) throw new AppError('Current password is required', 400);
    const ok = await compareHash(req.body.currentPassword, user.passwordHash);
    if (!ok) throw new AppError('Current password is incorrect', 400);
  }
  user.passwordHash = await hashValue(req.body.newPassword);
  await user.save();
  return success(res, 'Password updated successfully', {});
}

export async function updateNotificationPrefs(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  user.notificationPrefs = { ...user.notificationPrefs, ...req.body };
  await user.save();
  return success(res, 'Notification preferences saved', {
    notificationPrefs: user.notificationPrefs,
  });
}

export async function updatePrivacyPrefs(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  user.privacyPrefs = { ...user.privacyPrefs, ...req.body };
  await user.save();
  return success(res, 'Privacy settings saved', { privacyPrefs: user.privacyPrefs });
}

export async function getReferral(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  const history = await Referral.find({ referrer: user._id }).sort({ createdAt: -1 });
  const earned = history
    .filter((r) => r.status === 'Completed')
    .reduce((sum, r) => sum + r.reward, 0);
  return success(res, 'Referral details fetched', {
    referralCode: user.referralCode,
    earned,
    history: history.map((r) => ({
      id: String(r._id),
      name: r.refereeName,
      date: r.createdAt.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      service: r.service || '',
      reward: r.reward ? `₹${r.reward}` : '₹0',
      status: r.status,
    })),
  });
}

export async function deleteAccount(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', 404);
  user.isBlocked = true;
  user.refreshTokens = [];
  await user.save();
  return success(res, 'Account deactivated', {});
}
