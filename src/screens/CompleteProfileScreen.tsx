import React, { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CompleteProfileScreenProps {
  onSuccess: () => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({
  onSuccess,
  onBack,
  onSkip,
}) => {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user.name || '');
  const [emailAddress, setEmailAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(user.mobileNumber || '9876543210');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // 6-Step Stepper Data
  const steps = [
    { id: 1, label: 'Welcome', status: 'completed' },
    { id: 2, label: 'Intro', status: 'completed' },
    { id: 3, label: 'Location', status: 'completed' },
    { id: 4, label: 'Login', status: 'completed' },
    { id: 5, label: 'Verify', status: 'completed' },
    { id: 6, label: 'Profile', status: 'active' },
  ];

  const handleValidationAndSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    const cleanWhatsapp = whatsappNumber.replace(/\D/g, '');
    if (!cleanWhatsapp) {
      newErrors.whatsappNumber = 'Please enter your WhatsApp number';
    } else if (cleanWhatsapp.length !== 10) {
      newErrors.whatsappNumber = 'WhatsApp number must be 10 digits';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Please accept Terms & Conditions to proceed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      updateProfile({
        name: fullName.trim(),
        mobileNumber: user.mobileNumber || '9876543210',
      });
      onSuccess();
    }, 800);
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
          {/* Header Slogans and Logo */}
          <View style={styles.headerContainer}>
            <Text style={styles.romanticQuoteLeft}>
              Badi{'\n'}Shaadiyan{'\n'}Badi{'\n'}Kahaniyan ♡
            </Text>

            <View style={styles.logoCenterCol}>
              <Image source={Assets.logoLight} style={styles.logoLight} resizeMode="contain" />
              <Text style={styles.taglineText}>SHAADI KI HAR ZARURAT</Text>
              <View style={styles.taglineOrnamentRow}>
                <View style={styles.goldLine} />
                <Text style={styles.taglineSubText}>EK JAGAH</Text>
                <View style={styles.goldLine} />
              </View>
            </View>

            <Text style={styles.romanticQuoteRight}>
              Almost{'\n'}There! ♡
            </Text>
          </View>

          {/* 6-Step Stepper Component */}
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
              Complete Your <Text style={styles.mainTitleMaroon}>Profile</Text>
            </Text>
            <Text style={styles.subtitle}>
              A few more details to personalize your experience and get the best wedding services for you.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Field 1: Full Name */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldIconCircle}>
                <Text style={styles.fieldIconEmoji}>👤</Text>
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>
                  Full Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#A08D93"
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  style={[styles.inputBox, errors.fullName ? styles.inputError : null]}
                />
                {errors.fullName ? <Text style={styles.fieldErrorText}>{errors.fullName}</Text> : null}
              </View>
            </View>

            {/* Field 2: Email Address */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldIconCircle}>
                <Text style={styles.fieldIconEmoji}>✉️</Text>
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>
                  Email Address <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter your email address"
                  placeholderTextColor="#A08D93"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={emailAddress}
                  onChangeText={(val) => {
                    setEmailAddress(val);
                    if (errors.emailAddress) setErrors({ ...errors, emailAddress: '' });
                  }}
                  style={[styles.inputBox, errors.emailAddress ? styles.inputError : null]}
                />
                {errors.emailAddress ? <Text style={styles.fieldErrorText}>{errors.emailAddress}</Text> : null}
              </View>
            </View>

            {/* Field 3: Mobile Number (Pre-filled / Verified) */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldIconCircle}>
                <Text style={styles.fieldIconEmoji}>📞</Text>
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>
                  Mobile Number <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.disabledInputBox}>
                  <Text style={styles.disabledInputText}>
                    +91 {user.mobileNumber || '98765 43210'}
                  </Text>
                  <Text style={styles.verifiedBadge}>✓ Verified</Text>
                </View>
              </View>
            </View>

            {/* Field 4: WhatsApp Number */}
            <View style={styles.fieldRow}>
              <View style={[styles.fieldIconCircle, styles.whatsappCircle]}>
                <Text style={styles.whatsappEmoji}>💬</Text>
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>
                  WhatsApp Number <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter your WhatsApp number"
                  placeholderTextColor="#A08D93"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={whatsappNumber}
                  onChangeText={(val) => {
                    setWhatsappNumber(val.replace(/\D/g, ''));
                    if (errors.whatsappNumber) setErrors({ ...errors, whatsappNumber: '' });
                  }}
                  style={[styles.inputBox, errors.whatsappNumber ? styles.inputError : null]}
                />
                {errors.whatsappNumber ? <Text style={styles.fieldErrorText}>{errors.whatsappNumber}</Text> : null}
              </View>
            </View>

            {/* Field 5: Referral Code (Optional) */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldIconCircle}>
                <Text style={styles.fieldIconEmoji}>🎁</Text>
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>
                  Referral Code <Text style={styles.optionalText}>(Optional)</Text>
                </Text>
                <TextInput
                  placeholder="Enter referral code (if any)"
                  placeholderTextColor="#A08D93"
                  autoCapitalize="characters"
                  value={referralCode}
                  onChangeText={(val) => setReferralCode(val.toUpperCase())}
                  style={styles.inputBox}
                />
              </View>
            </View>

            {/* Terms & Conditions Checkbox */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAgreeTerms(!agreeTerms)}
              style={styles.termsRow}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text
                  onPress={() => setShowTermsModal(true)}
                  style={styles.termsLink}
                >
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text
                  onPress={() => setShowTermsModal(true)}
                  style={styles.termsLink}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {errors.terms ? <Text style={styles.fieldErrorText}>{errors.terms}</Text> : null}

            {/* Primary Submit CTA Button */}
            <TouchableOpacity
              onPress={handleValidationAndSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
              style={styles.submitBtnWrapper}
            >
              <LinearGradient
                colors={['#8A072D', '#5E041E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtnGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Create Profile & Continue</Text>
                    <Text style={styles.submitBtnArrow}>→</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bottom Royal Elephant Baarat Artwork */}
          <View style={styles.bottomArtContainer}>
            <Text style={styles.journeyQuote}>
              Let's Begin{'\n'}Your Wedding Journey ♡
            </Text>

            <Image
              source={Assets.elephantBaaratArt}
              style={styles.elephantArtImage}
              resizeMode="contain"
            />
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Terms & Conditions Modal */}
      <Modal visible={showTermsModal} transparent animationType="slide" onRequestClose={() => setShowTermsModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.termsModalContent}>
            <Text style={styles.termsModalTitle}>⚜️ Terms & Conditions</Text>
            <ScrollView style={{ maxHeight: 240, marginVertical: 10 }}>
              <Text style={styles.termsModalBody}>
                1. Band Baaja Baarat is a verified marketplace connecting wedding hosts with professional bands, dhol troupes, vintage cars, and wedding artists.{'\n\n'}
                2. All bookings made through our platform are protected under our Booking Assurance Guarantee.{'\n\n'}
                3. Your contact and event details are private and shared only with verified artists for your event execution.
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowTermsModal(false)}
              style={styles.termsModalBtn}
            >
              <Text style={styles.termsModalBtnText}>Accept & Close</Text>
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
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A072D',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: -4,
    marginBottom: 4,
  },
  romanticQuoteLeft: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 16,
    width: 80,
  },
  romanticQuoteRight: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    textAlign: 'right',
    lineHeight: 16,
    width: 80,
  },
  logoCenterCol: {
    alignItems: 'center',
  },
  logoLight: {
    width: 150,
    height: 80,
  },
  taglineText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#4A1220',
    letterSpacing: 1.5,
    marginTop: -8,
  },
  taglineOrnamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  taglineSubText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 1.2,
  },
  goldLine: {
    width: 16,
    height: 1,
    backgroundColor: '#D19C74',
  },

  // 6-Step Stepper
  stepperContainer: {
    width: '100%',
    marginVertical: 10,
    position: 'relative',
  },
  stepperLineBackground: {
    position: 'absolute',
    top: 13,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#E5D0C9',
  },
  stepperLineProgress: {
    width: '100%',
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
    width: (SCREEN_WIDTH - 48) / 6,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    fontSize: 12,
    fontWeight: '800',
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C7A7E',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 9,
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
    marginBottom: 10,
    paddingHorizontal: Spacing.sm,
  },
  mainTitle: {
    fontSize: 22,
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
    fontSize: 11.5,
    color: '#5E4E52',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    gap: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  fieldIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#F5D1C4',
  },
  whatsappCircle: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  fieldIconEmoji: {
    fontSize: 16,
  },
  whatsappEmoji: {
    fontSize: 16,
  },
  fieldInputCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
    marginBottom: 4,
  },
  requiredStar: {
    color: '#D93025',
  },
  optionalText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#7A686C',
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E8D5CD',
    height: 42,
    paddingHorizontal: Spacing.md,
    fontSize: 13,
    color: '#1A040A',
  },
  inputError: {
    borderColor: '#D93025',
  },
  disabledInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7EDE8',
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E8D5CD',
    height: 42,
    paddingHorizontal: Spacing.md,
  },
  disabledInputText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A1220',
  },
  verifiedBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#137333',
  },
  fieldErrorText: {
    fontSize: 10,
    color: '#D93025',
    fontWeight: '600',
    marginTop: 2,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#8A072D',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#8A072D',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  termsText: {
    fontSize: 11,
    color: '#333333',
    flex: 1,
  },
  termsLink: {
    color: '#8A072D',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  submitBtnWrapper: {
    width: '100%',
    borderRadius: Spacing.borderRadius.round,
    overflow: 'hidden',
    marginTop: 8,
    elevation: 4,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  submitBtnArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Bottom Artwork
  bottomArtContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  journeyQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    textAlign: 'right',
    alignSelf: 'flex-end',
    marginBottom: 4,
    lineHeight: 18,
  },
  elephantArtImage: {
    width: SCREEN_WIDTH - 24,
    height: 130,
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
  termsModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#8A072D',
  },
  termsModalTitle: {
    ...Typography.title,
    color: '#8A072D',
  },
  termsModalBody: {
    ...Typography.bodyMedium,
    color: '#333333',
    lineHeight: 20,
  },
  termsModalBtn: {
    backgroundColor: '#8A072D',
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  termsModalBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
