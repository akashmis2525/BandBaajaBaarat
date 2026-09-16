import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './storage';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
};

let unauthorizedHandler: (() => void) | null = null;

export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler;
}

async function parseJson(res: Response) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text };
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const json = (await parseJson(res)) as ApiEnvelope<{ accessToken: string; refreshToken: string }>;
  if (!res.ok || !json.success) {
    await clearTokens();
    unauthorizedHandler?.();
    return null;
  }
  await setTokens(json.data.accessToken, json.data.refreshToken);
  return json.data.accessToken;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean; retry?: boolean } = {},
): Promise<T> {
  const { auth = true, retry = true, headers, ...rest } = options;
  const token = auth ? await getAccessToken() : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (res.status === 401 && auth && retry) {
    const next = await refreshAccessToken();
    if (next) {
      return apiRequest<T>(path, { ...options, retry: false });
    }
  }

  const json = (await parseJson(res)) as ApiEnvelope<T>;
  if (!res.ok || json.success === false) {
    if (res.status === 401) unauthorizedHandler?.();
    throw new ApiError(json.message || 'Request failed', res.status, json.error || json);
  }
  return json.data;
}

export const api = {
  sendOtp: (phone: string, role: 'customer' | 'vendor' = 'customer') =>
    apiRequest<{ phone: string; expiresInSeconds: number; otp?: string }>('/api/auth/otp/send', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ phone, role }),
    }),
  verifyOtp: (phone: string, otp: string, role: 'customer' | 'vendor' = 'customer') =>
    apiRequest<{
      accessToken: string;
      refreshToken: string;
      user: ApiUser;
      isNewUser: boolean;
    }>('/api/auth/otp/verify', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ phone, otp, role }),
    }),
  vendorEmailLogin: (email: string, password: string) =>
    apiRequest<{ accessToken: string; refreshToken: string; user: ApiUser }>(
      '/api/auth/vendor/email-login',
      { method: 'POST', auth: false, body: JSON.stringify({ email, password }) },
    ),
  me: () => apiRequest<{ user: ApiUser; vendor?: ApiVendor }>('/api/auth/me'),
  logout: () => apiRequest('/api/auth/logout', { method: 'POST' }),
  completeProfile: (body: { name: string; email: string; whatsappNumber: string; referralCode?: string }) =>
    apiRequest<{ user: ApiUser }>('/api/auth/complete-profile', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateProfile: (body: Record<string, unknown>) =>
    apiRequest<{ user: ApiUser }>('/api/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  changePassword: (body: { currentPassword?: string; newPassword: string }) =>
    apiRequest('/api/users/me/password', { method: 'POST', body: JSON.stringify(body) }),
  updateNotificationPrefs: (body: Record<string, unknown>) =>
    apiRequest('/api/users/me/notifications', { method: 'PATCH', body: JSON.stringify(body) }),
  updatePrivacyPrefs: (body: Record<string, unknown>) =>
    apiRequest('/api/users/me/privacy', { method: 'PATCH', body: JSON.stringify(body) }),
  getReferral: () => apiRequest<{ referralCode: string; earned: number; history: ReferralRow[] }>('/api/users/me/referral'),
  services: (params?: Record<string, string>) =>
    apiRequest<{ items: ApiService[] }>(`/api/services${qs(params)}`, { auth: false }),
  vendors: (params?: Record<string, string>) =>
    apiRequest<{ items: ApiVendor[]; pagination: Pagination }>(`/api/vendors${qs(params)}`),
  vendor: (id: string) => apiRequest<{ vendor: ApiVendor }>(`/api/vendors/${id}`),
  locationStats: (city: string) =>
    apiRequest<{ city: string; activeVendorsCount: number }>(
      `/api/location/stats?city=${encodeURIComponent(city)}`,
      { auth: false },
    ),
  coupons: (category?: string) =>
    apiRequest<{ items: ApiCoupon[] }>(`/api/coupons${category ? `?category=${category}` : ''}`, {
      auth: false,
    }),
  applyCoupon: (code: string, amount: number) =>
    apiRequest<{ coupon: ApiCoupon; discount: number; payable: number }>('/api/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    }),
  faqs: () => apiRequest<{ items: { _id: string; question: string; answer: string }[] }>('/api/faqs', { auth: false }),
  bookings: (status?: string) =>
    apiRequest<{ items: ApiBooking[]; counts: Record<string, number> }>(
      `/api/bookings${status ? `?status=${encodeURIComponent(status)}` : ''}`,
    ),
  booking: (id: string) => apiRequest<{ booking: ApiBooking }>(`/api/bookings/${id}`),
  createBooking: (body: Record<string, unknown>) =>
    apiRequest<{ booking: ApiBooking }>('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  cancelBooking: (id: string, reason: string) =>
    apiRequest(`/api/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  rescheduleBooking: (id: string, body: Record<string, unknown>) =>
    apiRequest(`/api/bookings/${id}/reschedule`, { method: 'POST', body: JSON.stringify(body) }),
  confirmPayment: (id: string, paymentMode?: string) =>
    apiRequest<{ booking: ApiBooking }>(`/api/bookings/${id}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentMode }),
    }),
  updateExecution: (id: string, executionStep: number) =>
    apiRequest(`/api/bookings/${id}/execution`, {
      method: 'PATCH',
      body: JSON.stringify({ executionStep }),
    }),
  favorites: (type?: string) =>
    apiRequest<{ items: ApiVendor[] }>(`/api/favorites${type ? `?type=${type}` : ''}`),
  toggleFavorite: (vendorProfileId: string, type?: string) =>
    apiRequest<{ isFavorite: boolean }>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ vendorProfileId, type }),
    }),
  addresses: () => apiRequest<{ items: ApiAddress[] }>('/api/addresses'),
  createAddress: (body: Record<string, unknown>) =>
    apiRequest<{ item: ApiAddress }>('/api/addresses', { method: 'POST', body: JSON.stringify(body) }),
  updateAddress: (id: string, body: Record<string, unknown>) =>
    apiRequest<{ item: ApiAddress }>(`/api/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAddress: (id: string) => apiRequest(`/api/addresses/${id}`, { method: 'DELETE' }),
  paymentMethods: () => apiRequest<{ items: ApiPaymentMethod[] }>('/api/payment-methods'),
  createPaymentMethod: (body: Record<string, unknown>) =>
    apiRequest<{ item: ApiPaymentMethod }>('/api/payment-methods', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  deletePaymentMethod: (id: string) => apiRequest(`/api/payment-methods/${id}`, { method: 'DELETE' }),
  conversations: () => apiRequest<{ items: ApiConversation[] }>('/api/conversations'),
  openConversation: (vendorProfileId: string) =>
    apiRequest<{ conversation: { _id: string }; vendor: ApiVendor }>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ vendorProfileId }),
    }),
  messages: (id: string) =>
    apiRequest<{ conversation: ApiConversation; items: ApiMessage[] }>(
      `/api/conversations/${id}/messages?limit=50`,
    ),
  sendMessage: (id: string, text: string) =>
    apiRequest<{ message: ApiMessage }>(`/api/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  notifications: () =>
    apiRequest<{ items: ApiNotification[]; unreadCount: number }>('/api/notifications'),
  markAllNotificationsRead: () =>
    apiRequest('/api/notifications/read-all', { method: 'POST' }),
  createLead: (body: Record<string, unknown>) =>
    apiRequest('/api/leads', { method: 'POST', body: JSON.stringify(body) }),
  createMeeting: (body: Record<string, unknown>) =>
    apiRequest('/api/meetings', { method: 'POST', body: JSON.stringify(body) }),
  meetings: () => apiRequest<{ items: ApiMeeting[] }>('/api/meetings'),
  updateMeeting: (id: string, body: Record<string, unknown>) =>
    apiRequest(`/api/meetings/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  createReview: (body: Record<string, unknown>) =>
    apiRequest('/api/reviews', { method: 'POST', body: JSON.stringify(body) }),
  tickets: () => apiRequest<{ items: ApiTicket[] }>('/api/support/tickets'),
  createTicket: (body: Record<string, unknown>) =>
    apiRequest<{ ticket: { ticketCode: string } }>('/api/support/tickets', { method: 'POST', body: JSON.stringify(body) }),
  vendorDashboard: () => apiRequest<{ vendor: ApiVendor; metrics: VendorMetrics }>('/api/vendor/dashboard'),
  vendorKyc: (body: Record<string, unknown>) =>
    apiRequest('/api/vendor/kyc', { method: 'POST', body: JSON.stringify(body) }),
  updateVendorProfile: (body: Record<string, unknown>) =>
    apiRequest('/api/vendor/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  vendorLeads: (status?: string) =>
    apiRequest<{ items: ApiLead[] }>(`/api/vendor/leads${status ? `?status=${status}` : ''}`),
  updateLead: (id: string, status: string) =>
    apiRequest(`/api/vendor/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  createQuotation: (body: Record<string, unknown>) =>
    apiRequest('/api/quotations', { method: 'POST', body: JSON.stringify(body) }),
  agreeNegotiation: (id: string, agreedAmount: number) =>
    apiRequest(`/api/negotiations/${id}/agree`, { method: 'POST', body: JSON.stringify({ agreedAmount }) }),
  createNegotiation: (body: Record<string, unknown>) =>
    apiRequest<{ negotiation: { _id: string } }>('/api/negotiations', { method: 'POST', body: JSON.stringify(body) }),
  portfolio: () => apiRequest<{ items: { _id: string; title: string; uri: string; views: number }[] }>('/api/portfolio'),
  addPortfolio: (body: { title: string; uri: string }) =>
    apiRequest('/api/portfolio', { method: 'POST', body: JSON.stringify(body) }),
  deletePortfolio: (id: string) => apiRequest(`/api/portfolio/${id}`, { method: 'DELETE' }),
  calendar: (month: string) =>
    apiRequest<{ month: string; blockedDates: number[] }>(`/api/calendar?month=${encodeURIComponent(month)}`),
  updateCalendar: (month: string, blockedDates: number[]) =>
    apiRequest('/api/calendar', { method: 'PUT', body: JSON.stringify({ month, blockedDates }) }),
  wallet: () =>
    apiRequest<{ availableBalance: number; items: WalletTx[] }>('/api/wallet'),
  withdraw: (amount?: number) =>
    apiRequest('/api/wallet/withdraw', { method: 'POST', body: JSON.stringify({ amount }) }),
};

function qs(params?: Record<string, string>) {
  if (!params) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiUser {
  id: string;
  role: 'customer' | 'vendor';
  phone: string;
  email: string;
  name: string;
  whatsappNumber: string;
  weddingDate: string;
  customerRole: 'Groom' | 'Bride' | 'Family & Host' | 'Event Planner';
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  state: string;
  locationLabel: string;
  language: string;
  aboutMe: string;
  interests: string[];
  photoUrl: string;
  referralCode: string;
  isProfileComplete: boolean;
  isKycComplete: boolean;
  notificationPrefs: Record<string, boolean>;
  privacyPrefs: Record<string, boolean>;
  darkModeEnabled: boolean;
  gpsAutoDetect: boolean;
}

export interface ApiVendor {
  id: string;
  userId: string;
  businessName: string;
  name: string;
  category: string;
  categorySlug: string;
  city: string;
  state: string;
  address: string;
  startingPrice: number;
  startingPriceText: string;
  price: string;
  priceUnit: string;
  rating: number;
  reviewsCount: number;
  reviews: string;
  experienceYears: number;
  experienceText: string;
  imageKey: string;
  isVerified: boolean;
  verified: boolean;
  isOnline: boolean;
  isAvailable: boolean;
  type: string;
  photosCount: number;
  features: string[];
  bio: string;
  displayPhone: string;
  phone: string;
  distanceKm?: number;
  distance?: string;
  isFavorite?: boolean;
  walletBalance?: number;
  totalEarned?: number;
  monthEarned?: number;
  openTime?: string;
  closeTime?: string;
  operatingDays?: string;
  title?: string;
  subtitle?: string;
}

export interface ApiService {
  _id: string;
  slug: string;
  name: string;
  tagline: string;
  vendorsCount: number;
  imageKey: string;
  category: 'Wedding Services' | 'Shopping' | 'Essentials' | 'Entertainment' | 'All';
}

export interface ApiCoupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat' | 'cashback';
  discountText: string;
  title: string;
  description: string;
  minBookingAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  category: 'all' | 'wedding' | 'cashback' | 'vendor' | 'first';
  isPopular?: boolean;
}

export interface ApiBooking {
  id: string;
  bookingId: string;
  bookingCode: string;
  badge: 'Upcoming' | 'Completed' | 'Cancelled';
  status: string;
  vendorName: string;
  category: string;
  date: string;
  time: string;
  eventTitle: string;
  eventType: string;
  location: string;
  guestCount?: string;
  price: string;
  priceNum: number;
  imageKey: string;
  phone: string;
  vendorPhone: string;
  customerName: string;
  customerPhone: string;
  duration?: string;
  basePrice: number;
  artistCharges: number;
  travelCharges: number;
  discountAmount: number;
  couponCode?: string;
  advanceAmount: number;
  advanceReceived: number;
  balanceDue: number;
  paymentStatus: string;
  executionStep: number;
  vendorId: string;
  vendorProfileId: string;
  actions: string[];
}

export interface ApiAddress {
  _id: string;
  type: 'home' | 'work' | 'other' | 'parents';
  title: string;
  isDefault: boolean;
  addressLine1: string;
  cityStatePincode: string;
  landmark: string;
}

export interface ApiPaymentMethod {
  _id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking';
  brand: 'mastercard' | 'visa' | 'gpay' | 'paytm';
  title: string;
  subtitle: string;
  expiry?: string;
  isDefault: boolean;
}

export interface ApiConversation {
  _id: string;
  vendorProfile?: ApiVendor;
  lastMessage?: string;
  customerUnread: number;
  vendorUnread: number;
}

export interface ApiMessage {
  id: string;
  sender: 'vendor' | 'user';
  text: string;
  time: string;
  read?: boolean;
  hasMeetingAction?: boolean;
  hasQuotationAction?: boolean;
}

export interface ApiNotification {
  _id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiMeeting {
  _id: string;
  customerName: string;
  phone: string;
  meetingDate: string;
  meetingTime: string;
  meetingLocation: string;
  eventType: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  notes: string;
  purpose?: string;
}

export interface ApiTicket {
  id: string;
  bookingId?: string;
  vendorName?: string;
  issueType: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  lastReply: string;
}

export interface ApiLead {
  id: string;
  customerName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venueCity: string;
  guestCount: string;
  budgetRange: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  timeAgo: string;
  notes: string;
}

export interface VendorMetrics {
  walletBalance: number;
  totalEarned: number;
  monthEarned: number;
  rating: number;
  reviewsCount: number;
  newLeads: number;
  upcomingMeetings: number;
  upcomingBookings: number;
  isOnline: boolean;
}

export interface ReferralRow {
  id: string;
  name: string;
  date: string;
  service: string;
  reward: string;
  status: string;
}

export interface WalletTx {
  _id: string;
  bookingCode?: string;
  title: string;
  createdAt: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: string;
}

export function userMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message === 'Network request failed') {
    return 'Unable to reach the server. Check your connection.';
  }
  return fallback;
}
