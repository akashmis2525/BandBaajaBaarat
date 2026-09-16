import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, authError } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LoginScreenProps {
  onSuccess: (phone: string, extras?: { isProfileComplete?: boolean }) => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onBack,
  onSkip,
}) => {
  const insets = useSafeAreaInsets();
  const { sendOtp, loginWithOtp } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpView, setShowOtpView] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  // 5-Step Stepper Data
  const steps = [
    { id: 1, label: 'Welcome', status: 'completed' },
    { id: 2, label: 'Intro', status: 'completed' },
    { id: 3, label: 'Location', status: 'completed' },
    { id: 4, label: 'Login', status: 'active' },
    { id: 5, label: 'Profile', status: 'pending' },
  ];

  // Resend OTP Countdown Timer
  useEffect(() => {
    let interval: any;
    if (showOtpView && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpView, timer]);

  // Mobile Validation Logic
  const handleContinue = async () => {
    const cleaned = mobileNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!/^[6-9]/.test(cleaned)) {
      setErrorMessage('Mobile number must start with 6, 7, 8, or 9');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const otp = await sendOtp(cleaned, 'customer');
      setIsLoading(false);
      setShowOtpView(true);
      setTimer(30);
      setCanResend(false);
      if (otp) setOtpValues(otp.split(''));
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(authError(err));
    }
  };

  // OTP Change Handler
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otpValues];
    newOtp[index] = text;
    setOtpValues(newOtp);

    if (text && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Verify OTP & Proceed
  const handleVerifyOtp = () => {
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 4) {
      setErrorMessage('Please enter the 4-digit OTP');
      return;
    }

    setIsLoading(true);
    loginWithOtp(mobileNumber.replace(/\D/g, '').slice(-10), enteredOtp, 'customer')
      .then((result) => {
        setIsLoading(false);
        onSuccess(mobileNumber.replace(/\D/g, '').slice(-10), {
          isProfileComplete: result.isProfileComplete,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMessage(authError(err));
      });
  };

  const handleResendOtp = async () => {
    setTimer(30);
    setCanResend(false);
    setOtpValues(['', '', '', '']);
    setErrorMessage(null);
    try {
      const otp = await sendOtp(mobileNumber.replace(/\D/g, '').slice(-10), 'customer');
      if (otp) setOtpValues(otp.split(''));
    } catch (err) {
      setErrorMessage(authError(err));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF7F4" />

      {/* Top Bar with Back & Skip */}
      <View style={[styles.topBar, { paddingTop: insets.top > 0 ? insets.top + 4 : 24 }]}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}

        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
          <Text style={styles.skipArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Header Logo */}
          <View style={styles.topHeader}>
            <Image source={Assets.logoLight} style={styles.logoLight} resizeMode="contain" />
            <Text style={styles.taglineText}>SHAADI KI HAR ZARURAT</Text>
            <View style={styles.taglineOrnamentRow}>
              <View style={styles.goldLine} />
              <Text style={styles.taglineSubText}>EK JAGAH</Text>
              <View style={styles.goldLine} />
            </View>
          </View>

          {/* 5-Step Stepper Component */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperLineBackground}>
              <View style={styles.stepperLineProgress} />
            </View>

            <View style={styles.stepsRow}>
              {steps.map((step) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <View key={step.id} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        isCompleted && styles.stepCircleCompleted,
                        isActive && styles.stepCircleActive,
                        !isCompleted && !isActive && styles.stepCirclePending,
                      ]}
                    >
                      {isCompleted ? (
                        <Text style={styles.stepCheckmark}>✓</Text>
                      ) : (
                        <Text
                          style={[
                            styles.stepNumber,
                            isActive && styles.stepNumberActive,
                          ]}
                        >
                          {step.id}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        isActive && styles.stepLabelActive,
                        isCompleted && styles.stepLabelCompleted,
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Title & Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>
              Login / <Text style={styles.mainTitleMaroon}>Sign Up</Text>
            </Text>
            <Text style={styles.subtitle}>
              {showOtpView
                ? `Enter 4-digit code sent to +91 ${mobileNumber || '98765 43210'}`
                : 'Enter your mobile number to continue'}
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            {!showOtpView ? (
              // Step 4A: Mobile Number Input
              <>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardHeaderTitle}>Mobile Number</Text>
                  <TouchableOpacity
                    onPress={() => setShowWhyModal(true)}
                    activeOpacity={0.7}
                    style={styles.whyLink}
                  >
                    <Text style={styles.whyText}>Why do we need this?</Text>
                    <Text style={styles.infoIcon}>ⓘ</Text>
                  </TouchableOpacity>
                </View>

                {/* Mobile Input Field */}
                <View style={styles.inputContainer}>
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <View style={styles.inputDivider} />
                  <TextInput
                    placeholder="Enter your mobile number"
                    placeholderTextColor="#A08D93"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobileNumber}
                    onChangeText={(val) => {
                      setMobileNumber(val.replace(/\D/g, ''));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    style={styles.phoneTextInput}
                  />
                </View>

                {errorMessage && (
                  <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
                )}

                {/* Continue CTA Button */}
                <TouchableOpacity
                  onPress={handleContinue}
                  disabled={isLoading}
                  activeOpacity={0.85}
                  style={styles.continueBtnWrapper}
                >
                  <LinearGradient
                    colors={['#8A072D', '#5E041E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.continueBtnGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.continueBtnText}>Continue</Text>
                        <Text style={styles.continueBtnArrow}>→</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Security Assurance */}
                <View style={styles.privacyNoteRow}>
                  <Text style={styles.lockEmoji}>🔒</Text>
                  <Text style={styles.privacyNoteText}>
                    We'll send you an OTP to verify your number.{'\n'}Your number is safe with us.
                  </Text>
                </View>
              </>
            ) : (
              // Step 4B: OTP Verification View
              <>
                <View style={styles.otpHeaderRow}>
                  <Text style={styles.cardHeaderTitle}>Enter OTP</Text>
                  <TouchableOpacity
                    onPress={() => setShowOtpView(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.editNumberText}>Change Number ✏️</Text>
                  </TouchableOpacity>
                </View>

                {/* 4 OTP Input Boxes */}
                <View style={styles.otpBoxesRow}>
                  {[0, 1, 2, 3].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        otpInputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.otpBox,
                        otpValues[index] ? styles.otpBoxFilled : null,
                      ]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otpValues[index]}
                      onChangeText={(val) => handleOtpChange(val, index)}
                    />
                  ))}
                </View>

                {/* Timer & Resend */}
                <View style={styles.resendRow}>
                  {canResend ? (
                    <TouchableOpacity onPress={handleResendOtp}>
                      <Text style={styles.resendActiveText}>Resend OTP</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.resendTimerText}>
                      Resend OTP in <Text style={styles.timerBold}>{timer}s</Text>
                    </Text>
                  )}
                </View>

                {errorMessage && (
                  <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
                )}

                {/* Verify CTA Button */}
                <TouchableOpacity
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                  activeOpacity={0.85}
                  style={styles.continueBtnWrapper}
                >
                  <LinearGradient
                    colors={['#8A072D', '#5E041E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.continueBtnGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.continueBtnText}>Verify & Proceed</Text>
                        <Text style={styles.continueBtnArrow}>→</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Social Divider */}
          <View style={styles.socialDividerRow}>
            <View style={styles.socialLine} />
            <Text style={styles.socialDividerText}>OR CONTINUE WITH</Text>
            <View style={styles.socialLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialButtonsRow}>
            {/* Google Button */}
            <TouchableOpacity
              onPress={() => onSuccess('9876543210')}
              activeOpacity={0.75}
              style={styles.socialBtn}
            >
              <Text style={styles.googleIconText}>G</Text>
              <Text style={styles.socialBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Apple Button */}
            <TouchableOpacity
              onPress={() => onSuccess('9876543210')}
              activeOpacity={0.75}
              style={styles.socialBtn}
            >
              <Text style={styles.appleIconText}></Text>
              <Text style={styles.socialBtnText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Romantic Wedding Quotes & Mandap Art Artwork */}
          <View style={styles.bottomArtContainer}>
            <View style={styles.quotesRow}>
              <Text style={styles.romanticQuoteLeft}>
                Bade Sapno Ki{'\n'}Badi Taiyaari... ♡
              </Text>
              <Text style={styles.romanticQuoteRight}>
                Har Shaadi{'\n'}Khaas Hai ♡
              </Text>
            </View>

            <Image
              source={Assets.weddingMandapArt}
              style={styles.mandapArtImage}
              resizeMode="contain"
            />
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Why Do We Need This Modal */}
      <Modal visible={showWhyModal} transparent animationType="fade" onRequestClose={() => setShowWhyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.whyModalContent}>
            <Text style={styles.whyModalTitle}>👑 Why We Need Your Number</Text>
            <Text style={styles.whyModalBody}>
              • Direct SMS & WhatsApp booking updates from verified wedding artists.{'\n\n'}
              • Real-time schedule tracking for Band, Baarat, and Dhol troupes on your event day.{'\n\n'}
              • 100% verified authentic accounts to avoid fake inquiries.
            </Text>
            <TouchableOpacity
              onPress={() => setShowWhyModal(false)}
              style={styles.whyModalBtn}
            >
              <Text style={styles.whyModalBtnText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF7F4',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    zIndex: 10,
  },
  backBtn: {
    padding: 6,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  skipArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 16,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  topHeader: {
    alignItems: 'center',
    marginTop: -4,
    marginBottom: 8,
  },
  logoLight: {
    width: 170,
    height: 90,
  },
  taglineText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4A1220',
    letterSpacing: 1.8,
    marginTop: -8,
  },
  taglineOrnamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  taglineSubText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 1.5,
  },
  goldLine: {
    width: 20,
    height: 1,
    backgroundColor: '#D19C74',
  },

  // 5-Step Stepper
  stepperContainer: {
    width: '100%',
    marginVertical: 10,
    position: 'relative',
  },
  stepperLineBackground: {
    position: 'absolute',
    top: 13,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#E5D0C9',
  },
  stepperLineProgress: {
    width: '75%',
    height: 2,
    backgroundColor: '#8A072D',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 48) / 5,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    marginBottom: 4,
  },
  stepCircleCompleted: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  stepCircleActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  stepCirclePending: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D4C0B8',
  },
  stepCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C7A7E',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#7D6A70',
  },
  stepLabelActive: {
    fontWeight: '800',
    color: '#8A072D',
  },
  stepLabelCompleted: {
    fontWeight: '600',
    color: '#4A1220',
  },

  // Title Section
  titleContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A040A',
    marginBottom: 4,
    textAlign: 'center',
  },
  mainTitleMaroon: {
    color: '#8A072D',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    color: '#5E4E52',
    textAlign: 'center',
  },

  // Login Card
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A072D',
  },
  whyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  whyText: {
    fontSize: 11,
    color: '#7A686C',
    textDecorationLine: 'underline',
  },
  infoIcon: {
    fontSize: 12,
    color: '#7A686C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#E8D5CD',
    height: 48,
    paddingHorizontal: Spacing.sm,
    marginBottom: 6,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: Spacing.xs,
  },
  flagEmoji: {
    fontSize: 18,
  },
  dropdownArrow: {
    fontSize: 8,
    color: '#7A686C',
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A040A',
    marginLeft: 2,
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#DEC2B8',
    marginHorizontal: Spacing.sm,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A040A',
    fontWeight: '600',
  },
  errorText: {
    color: '#D93025',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
  continueBtnWrapper: {
    width: '100%',
    borderRadius: Spacing.borderRadius.round,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  continueBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  continueBtnArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  privacyNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  lockEmoji: {
    fontSize: 12,
  },
  privacyNoteText: {
    fontSize: 10,
    color: '#7D6A70',
    textAlign: 'center',
    lineHeight: 14,
  },

  // OTP Styles
  otpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  editNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A072D',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: Spacing.md,
  },
  otpBox: {
    width: 52,
    height: 52,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E0CDC5',
    backgroundColor: '#FDF7F4',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#8A072D',
  },
  otpBoxFilled: {
    borderColor: '#8A072D',
    backgroundColor: '#FFFFFF',
  },
  resendRow: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  resendActiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A072D',
  },
  resendTimerText: {
    fontSize: 12,
    color: '#7A686C',
  },
  timerBold: {
    fontWeight: '700',
    color: '#8A072D',
  },

  // Social Login
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    gap: 10,
  },
  socialLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D19C74',
  },
  socialDividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2A0713',
    letterSpacing: 1.2,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginBottom: 14,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#E8D5CD',
    gap: 6,
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EA4335',
  },
  appleIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  socialBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2A0713',
  },

  // Bottom Artwork & Quotes
  bottomArtContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  quotesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.sm,
    marginBottom: 6,
  },
  romanticQuoteLeft: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 18,
  },
  romanticQuoteRight: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    textAlign: 'right',
    lineHeight: 18,
  },
  mandapArtImage: {
    width: SCREEN_WIDTH - 32,
    height: 120,
    opacity: 0.85,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  whyModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#8A072D',
  },
  whyModalTitle: {
    ...Typography.title,
    color: '#8A072D',
    marginBottom: Spacing.md,
  },
  whyModalBody: {
    ...Typography.bodyMedium,
    color: '#333333',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  whyModalBtn: {
    backgroundColor: '#8A072D',
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  whyModalBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
