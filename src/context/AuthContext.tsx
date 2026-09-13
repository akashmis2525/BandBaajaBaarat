import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  mobileNumber: string;
  name: string;
  weddingDate: string;
  role: 'Groom' | 'Bride' | 'Family & Host' | 'Event Planner';
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: UserProfile;
  login: (mobileNumber: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  logout: () => void;
}

const defaultUser: UserProfile = {
  mobileNumber: '',
  name: 'Yuvraj Singh',
  weddingDate: '24 Nov 2026',
  role: 'Groom',
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  login: () => {},
  updateProfile: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const login = (mobileNumber: string) => {
    setUser((prev) => ({
      ...prev,
      mobileNumber,
      isAuthenticated: true,
    }));
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const logout = () => {
    setUser(defaultUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
