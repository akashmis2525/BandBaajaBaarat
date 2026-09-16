import { IUser } from '../models/User';
import { IVendorProfile } from '../models/VendorProfile';

export function publicUser(user: IUser) {
  return {
    id: String(user._id),
    role: user.role,
    phone: user.phone,
    email: user.email || '',
    name: user.name,
    whatsappNumber: user.whatsappNumber || '',
    weddingDate: user.weddingDate || '',
    customerRole: user.customerRole || 'Groom',
    dob: user.dob || '',
    gender: user.gender || 'Male',
    city: user.city || '',
    state: user.state || '',
    locationLabel: user.locationLabel || '',
    language: user.language,
    aboutMe: user.aboutMe || '',
    interests: user.interests,
    photoUrl: user.photoUrl || '',
    referralCode: user.referralCode,
    isProfileComplete: user.isProfileComplete,
    isKycComplete: user.isKycComplete,
    notificationPrefs: user.notificationPrefs,
    privacyPrefs: user.privacyPrefs,
    darkModeEnabled: user.darkModeEnabled,
    gpsAutoDetect: user.gpsAutoDetect,
    createdAt: user.createdAt,
  };
}

export function publicVendor(vendor: IVendorProfile, extra?: Record<string, unknown>) {
  const [lng, lat] = vendor.location?.coordinates || [75.8577, 22.7196];
  return {
    id: String(vendor._id),
    userId: String(vendor.user),
    businessName: vendor.businessName,
    name: vendor.businessName,
    category: vendor.category,
    categorySlug: vendor.categorySlug,
    city: vendor.city,
    state: vendor.state,
    address: vendor.address,
    pincode: vendor.pincode || '',
    latitude: lat,
    longitude: lng,
    experienceYears: vendor.experienceYears,
    experienceText: vendor.experienceText,
    startingPrice: vendor.startingPrice,
    startingPriceText: vendor.startingPriceText,
    price: vendor.startingPriceText,
    priceUnit: vendor.priceUnit,
    type: vendor.type,
    isVerified: vendor.isVerified,
    verified: vendor.isVerified,
    isOnline: vendor.isOnline,
    isAvailable: vendor.isAvailable,
    rating: vendor.rating,
    reviewsCount: vendor.reviewsCount,
    reviews: String(vendor.reviewsCount),
    photosCount: vendor.photosCount,
    imageKey: vendor.imageKey,
    features: vendor.features,
    bio: vendor.bio,
    displayPhone: vendor.displayPhone,
    phone: vendor.displayPhone,
    openTime: vendor.openTime,
    closeTime: vendor.closeTime,
    operatingDays: vendor.operatingDays,
    kycStatus: vendor.kyc?.status,
    packages: vendor.packages,
    ...extra,
  };
}

export function ownerVendor(vendor: IVendorProfile, extra?: Record<string, unknown>) {
  return {
    ...publicVendor(vendor, extra),
    walletBalance: vendor.walletBalance,
    totalEarned: vendor.totalEarned,
    monthEarned: vendor.monthEarned,
    kyc: {
      status: vendor.kyc?.status,
      payoutMethod: vendor.kyc?.payoutMethod,
      docsUploaded: vendor.kyc?.docsUploaded,
      panNumber: vendor.kyc?.panNumber,
      gstNumber: vendor.kyc?.gstNumber,
      bankAccount: vendor.kyc?.bankAccount,
      ifscCode: vendor.kyc?.ifscCode,
      upiId: vendor.kyc?.upiId,
    },
  };
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Number((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}
