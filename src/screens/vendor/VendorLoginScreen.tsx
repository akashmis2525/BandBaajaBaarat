import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalDialog } from '../../components/RoyalDialog';
import { useAuth, authError } from '../../context/AuthContext';

interface VendorLoginScreenProps {
  onSuccess: (isKycComplete?: boolean) => void;
  onBack: () => void;
  onSwitchToCustomer?: () => void;
}

export const VendorLoginScreen: React.FC<VendorLoginScreenProps> = ({
  onSuccess,
  onBack,
  onSwitchToCustomer,
}) => {
  const insets = useSafeAreaInsets();
  const { sendOtp, loginWithOtp, vendorEmailLogin } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [businessEmail, setBusinessEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'mobile' | 'email'>('mobile');

  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<{
    visible: boolean;
    type?: 'success' | 'warning' | 'info' | 'error' | 'royal';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    highlightText?: string;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showDialog = (config: {
    type?: 'success' | 'warning' | 'info' | 'error' | 'royal';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    highlightText?: string;
  }) => {
    setDialogConfig({ ...config, visible: true });
  };

  const hideDialog = () => {
    setDialogConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleSendOtp = async () => {
    if (mobileNumber.length < 10) {
      showDialog({
        type: 'warning',
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid 10-digit mobile number to receive your OTP.',
        confirmText: 'Check Number',
        onConfirm: hideDialog,
      });
      return;
    }
    try {
      const code = await sendOtp(mobileNumber.replace(/\D/g, '').slice(-10), 'vendor');
      setIsOtpSent(true);
      if (code) setOtp(code);
      showDialog({
        type: 'success',
        title: 'OTP Sent Successfully! 📩',
        message: `A 4-digit OTP has been dispatched to +91 ${mobileNumber}.`,
        confirmText: code ? `Auto-Fill ${code}` : 'OK',
        highlightText: code ? `🔑 Partner OTP: ${code}` : undefined,
        onConfirm: hideDialog,
      });
    } catch (err) {
      showDialog({
        type: 'error',
        title: 'OTP Failed',
        message: authError(err),
        confirmText: 'Try Again',
        onConfirm: hideDialog,
      });
    }
  };

  const handleVerifyLogin = async () => {
    try {
      if (activeTab === 'email') {
        await vendorEmailLogin(businessEmail.trim(), password);
        onSuccess(true);
        return;
      }
      if (!isOtpSent) {
        showDialog({
          type: 'warning',
          title: 'OTP Required',
          message: 'Please request and enter the OTP sent to your mobile number.',
          confirmText: 'OK',
          onConfirm: hideDialog,
        });
        return;
      }
      const result = await loginWithOtp(mobileNumber.replace(/\D/g, '').slice(-10), otp, 'vendor');
      onSuccess(result.isKycComplete);
    } catch (err) {
      showDialog({
        type: 'error',
        title: 'Login Failed',
        message: authError(err),
        confirmText: 'Try Again',
        onConfirm: hideDialog,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={[
          styles.headerRow,
          {
            paddingTop:
              Platform.OS === 'android'
                ? (StatusBar.currentHeight || 24) + 6
                : insets.top > 0
                ? insets.top + 2
                : 16,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Partner <Text style={styles.screenTitleHighlight}>Portal</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Log in to manage wedding inquiries & bookings
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="business" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Vendor</Text>
            <Text style={styles.decorativeLine2}>Access</Text>
            <Text style={styles.decorativeLine3}>B2B Portal ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
        <View style={styles.partnerBanner}>
          <View style={styles.badgeGold}>
            <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.badgeGoldText}>Verified Partner Network</Text>
          </View>
          <Text style={styles.bannerHeading}>Welcome Back, Wedding Creator!</Text>
          <Text style={styles.bannerSub}>
            Connect with 50,000+ couples planning celebrations in Indore & MP
          </Text>
        </View>

        {/* Tabs: Phone vs Email */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'mobile' && styles.tabBtnActive]}
            onPress={() => setActiveTab('mobile')}
          >
            <Ionicons
              name="phone-portrait-outline"
              size={16}
              color={activeTab === 'mobile' ? '#8A072D' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'mobile' && styles.tabBtnTextActive,
              ]}
            >
              Mobile OTP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'email' && styles.tabBtnActive]}
            onPress={() => setActiveTab('email')}
          >
            <Ionicons
              name="mail-outline"
              size={16}
              color={activeTab === 'email' ? '#8A072D' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'email' && styles.tabBtnTextActive,
              ]}
            >
              Business Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          {activeTab === 'mobile' ? (
            <>
              <Text style={styles.inputLabel}>Registered Mobile Number</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter 10-digit number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              {isOtpSent ? (
                <View style={{ marginTop: 14 }}>
                  <View style={styles.otpHeaderRow}>
                    <Text style={styles.inputLabel}>Enter 4-Digit OTP</Text>
                    <Text style={styles.demoOtpHint}>Demo OTP: 1234</Text>
                  </View>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="1234"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <TouchableOpacity
                    style={styles.resendOtpBtn}
                    onPress={handleSendOtp}
                  >
                    <Text style={styles.resendOtpText}>Resend OTP in 25s</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.mainSubmitBtn}
                activeOpacity={0.85}
                onPress={isOtpSent ? handleVerifyLogin : handleSendOtp}
              >
                <Text style={styles.mainSubmitBtnText}>
                  {isOtpSent ? 'Verify OTP & Enter Dashboard' : 'Send OTP to Login'}
                </Text>
                <Ionicons name="arrow-forward" size={17} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Business Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="name@business.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={businessEmail}
                onChangeText={setBusinessEmail}
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.mainSubmitBtn}
                activeOpacity={0.85}
                onPress={handleVerifyLogin}
              >
                <Text style={styles.mainSubmitBtnText}>Log In with Password</Text>
                <Ionicons name="arrow-forward" size={17} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </>
          )}

          <View style={styles.quickDemoCard}>
            <Ionicons name="bulb-outline" size={16} color="#D81B60" style={{ marginRight: 6 }} />
            <Text style={styles.quickDemoText}>
              Pre-filled with demo vendor: <Text style={{ fontWeight: '700' }}>Royal Events & Decor</Text>
            </Text>
          </View>
        </View>

        {/* Switch to Customer Link */}
        {onSwitchToCustomer && (
          <TouchableOpacity
            style={styles.switchToCustomerBtn}
            activeOpacity={0.8}
            onPress={onSwitchToCustomer}
          >
            <Text style={styles.switchText}>
              Planning a wedding instead?{' '}
              <Text style={styles.switchHighlight}>Switch to Customer Mode 💍</Text>
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Royal Themed Custom Dialog */}
      <RoyalDialog {...dialogConfig} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  titleColumn: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1C1B1F',
    letterSpacing: -0.3,
  },
  screenTitleHighlight: {
    color: '#8A072D',
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: '#556987',
    marginTop: 2,
  },
  decorativeTag: {
    backgroundColor: '#FFF1F2',
    borderRadius: 22,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: '#FFE4E6',
  },
  tagGraphicBox: {
    marginRight: 4,
  },
  tagTextCol: {
    alignItems: 'flex-start',
  },
  decorativeLine1: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine2: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine3: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#8A072D',
    lineHeight: 10,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  partnerBanner: {
    backgroundColor: '#8A072D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  badgeGold: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeGoldText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerHeading: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 11.5,
    color: '#FFE4E8',
    lineHeight: 16,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#8A072D',
    fontWeight: '700',
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#1E293B',
  },
  otpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoOtpHint: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D81B60',
  },
  otpInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 4,
  },
  resendOtpBtn: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  resendOtpText: {
    fontSize: 11,
    color: '#64748B',
  },
  mainSubmitBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 16,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  mainSubmitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  quickDemoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  quickDemoText: {
    fontSize: 11.5,
    color: '#8A072D',
    flex: 1,
  },

  switchToCustomerBtn: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  switchText: {
    fontSize: 12.5,
    color: '#64748B',
  },
  switchHighlight: {
    color: '#D81B60',
    fontWeight: '700',
  },
});
