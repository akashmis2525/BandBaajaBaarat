import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiUser, ApiVendor, onUnauthorized, userMessage } from '../services/api';
import { clearTokens, getAccessToken, setTokens } from '../services/storage';

export interface UserProfile {
  id: string;
  mobileNumber: string;
  name: string;
  email: string;
  whatsappNumber: string;
  weddingDate: string;
  role: 'Groom' | 'Bride' | 'Family & Host' | 'Event Planner';
  accountRole: 'customer' | 'vendor';
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
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isKycComplete: boolean;
  notificationPrefs: Record<string, boolean>;
  privacyPrefs: Record<string, boolean>;
  darkModeEnabled: boolean;
  gpsAutoDetect: boolean;
}

interface AuthContextType {
  user: UserProfile;
  vendor: ApiVendor | null;
  isReady: boolean;
  login: (phone: string) => void;
  loginWithOtp: (
    phone: string,
    otp: string,
    role?: 'customer' | 'vendor',
  ) => Promise<{ isNewUser: boolean; accountRole: 'customer' | 'vendor'; isProfileComplete: boolean; isKycComplete: boolean }>;
  sendOtp: (phone: string, role?: 'customer' | 'vendor') => Promise<string | undefined>;
  vendorEmailLogin: (email: string, password: string) => Promise<void>;
  completeProfile: (data: {
    name: string;
    email: string;
    whatsappNumber: string;
    referralCode?: string;
  }) => Promise<void>;
  updateProfile: (data: Partial<UserProfile> | Record<string, unknown>) => Promise<void>;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultUser: UserProfile = {
  id: '',
  mobileNumber: '',
  name: '',
  email: '',
  whatsappNumber: '',
  weddingDate: '',
  role: 'Groom',
  accountRole: 'customer',
  dob: '',
  gender: 'Male',
  city: '',
  state: '',
  locationLabel: '',
  language: 'English',
  aboutMe: '',
  interests: [],
  photoUrl: '',
  referralCode: '',
  isAuthenticated: false,
  isProfileComplete: false,
  isKycComplete: false,
  notificationPrefs: {},
  privacyPrefs: {},
  darkModeEnabled: false,
  gpsAutoDetect: true,
};

function fromApi(user: ApiUser): UserProfile {
  return {
    id: user.id,
    mobileNumber: user.phone,
    name: user.name,
    email: user.email,
    whatsappNumber: user.whatsappNumber,
    weddingDate: user.weddingDate,
    role: user.customerRole || 'Groom',
    accountRole: user.role,
    dob: user.dob,
    gender: user.gender,
    city: user.city,
    state: user.state,
    locationLabel: user.locationLabel,
    language: user.language,
    aboutMe: user.aboutMe,
    interests: user.interests || [],
    photoUrl: user.photoUrl,
    referralCode: user.referralCode,
    isAuthenticated: true,
    isProfileComplete: user.isProfileComplete,
    isKycComplete: user.isKycComplete,
    notificationPrefs: user.notificationPrefs || {},
    privacyPrefs: user.privacyPrefs || {},
    darkModeEnabled: user.darkModeEnabled,
    gpsAutoDetect: user.gpsAutoDetect,
  };
}

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  vendor: null,
  isReady: false,
  login: () => {},
  loginWithOtp: async () => ({
    isNewUser: true,
    accountRole: 'customer',
    isProfileComplete: false,
    isKycComplete: false,
  }),
  sendOtp: async () => undefined,
  vendorEmailLogin: async () => undefined,
  completeProfile: async () => undefined,
  updateProfile: async () => undefined,
  refreshMe: async () => undefined,
  logout: async () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [vendor, setVendor] = useState<ApiVendor | null>(null);
  const [isReady, setIsReady] = useState(false);

  const applySession = async (accessToken: string, refreshToken: string, apiUser: ApiUser) => {
    await setTokens(accessToken, refreshToken);
    setUser(fromApi(apiUser));
  };

  const refreshMe = async () => {
    const me = await api.me();
    setUser(fromApi(me.user));
    setVendor((me.vendor as ApiVendor) || null);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors on logout
    }
    await clearTokens();
    setUser(defaultUser);
    setVendor(null);
  };

  useEffect(() => {
    onUnauthorized(() => {
      clearTokens();
      setUser(defaultUser);
      setVendor(null);
    });
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) await refreshMe();
      } catch {
        await clearTokens();
        setUser(defaultUser);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const login = (mobileNumber: string) => {
    setUser((prev) => ({
      ...prev,
      mobileNumber,
      isAuthenticated: true,
    }));
  };

  const sendOtp = async (phone: string, role: 'customer' | 'vendor' = 'customer') => {
    const data = await api.sendOtp(phone, role);
    return data.otp;
  };

  const loginWithOtp = async (
    phone: string,
    otp: string,
    role: 'customer' | 'vendor' = 'customer',
  ) => {
    const data = await api.verifyOtp(phone, otp, role);
    await applySession(data.accessToken, data.refreshToken, data.user);
    if (data.user.role === 'vendor') {
      try {
        await refreshMe();
      } catch {
        // vendor profile may not exist yet
      }
    }
    return {
      isNewUser: data.isNewUser,
      accountRole: data.user.role,
      isProfileComplete: data.user.isProfileComplete,
      isKycComplete: data.user.isKycComplete,
    };
  };

  const vendorEmailLoginFn = async (email: string, password: string) => {
    const data = await api.vendorEmailLogin(email, password);
    await applySession(data.accessToken, data.refreshToken, data.user);
    await refreshMe();
  };

  const completeProfile = async (payload: {
    name: string;
    email: string;
    whatsappNumber: string;
    referralCode?: string;
  }) => {
    const data = await api.completeProfile(payload);
    setUser(fromApi(data.user));
  };

  const updateProfile = async (data: Partial<UserProfile> | Record<string, unknown>) => {
    const body: Record<string, unknown> = { ...data };
    if ('mobileNumber' in body) {
      body.whatsappNumber = body.mobileNumber;
      delete body.mobileNumber;
    }
    if ('role' in body && ['Groom', 'Bride', 'Family & Host', 'Event Planner'].includes(String(body.role))) {
      body.customerRole = body.role;
      delete body.role;
    }
    delete body.isAuthenticated;
    delete body.accountRole;
    delete body.id;
    if (user.isAuthenticated) {
      const res = await api.updateProfile(body);
      setUser(fromApi(res.user));
    } else {
      setUser((prev) => ({ ...prev, ...(data as Partial<UserProfile>) }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        isReady,
        login,
        loginWithOtp,
        sendOtp,
        vendorEmailLogin: vendorEmailLoginFn,
        completeProfile,
        updateProfile,
        refreshMe,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export function authError(err: unknown) {
  return userMessage(err);
}
