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
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalDialog } from '../../components/RoyalDialog';

const { width } = Dimensions.get('window');

interface VendorKYCScreenProps {
  navigation?: any;
  onSuccess?: () => void;
  onBack?: () => void;
}

export const VendorKYCScreen: React.FC<VendorKYCScreenProps> = ({
  navigation,
  onSuccess,
  onBack,
  }) => {
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState('Royal Events & Decor');
  const [selectedCategory, setSelectedCategory] = useState('Mandap & Stage Decor');
  const [city, setCity] = useState('Indore, Madhya Pradesh');
  const [experience, setExperience] = useState('8+ Years');
  const [startingPrice, setStartingPrice] = useState('₹45,000');
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'upi'>('bank');
  const [bankAccount, setBankAccount] = useState('50100234567812');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('royalevents@hdfcbank');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [gstNumber, setGstNumber] = useState('23ABCDE1234F1Z5');
  const [isDocUploaded, setIsDocUploaded] = useState(true);

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

  const categories = [
    {
      id: '1',
      name: 'Mandap & Stage Decor',
      icon: 'sparkles',
      desc: 'Floral, thematic & luxury mandaps',
      starting: '₹45,000',
    },
    {
      id: '2',
      name: 'Dhol & Brass Band',
      icon: 'musical-notes',
      desc: 'Punjabi Dhol, vintage buggi & brass',
      starting: '₹25,000',
    },
    {
      id: '3',
      name: 'Royal Catering',
      icon: 'restaurant',
      desc: 'Multi-cuisine, live counters & sweets',
      starting: '₹1,200/plate',
    },
    {
      id: '4',
      name: 'Bridal Makeup & Mehndi',
      icon: 'color-palette',
      desc: 'HD airbrush bridal & organic mehndi',
      starting: '₹15,000',
    },
    {
      id: '5',
      name: 'Wedding Photography',
      icon: 'camera',
      desc: 'Cinematic 4K, Drone & pre-wedding',
      starting: '₹60,000',
    },
    {
      id: '6',
      name: 'Luxury Buggi & Ghodi',
      icon: 'car-sport',
      desc: 'Royal chariot, decorated ghodi & lights',
      starting: '₹35,000',
    },
  ];

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboardTab');
    }
  };

  const handleNextOrSubmit = () => {
    if (currentStep === 1) {
      if (!selectedCategory) {
        showDialog({
          type: 'warning',
          title: 'Category Required',
          message: 'Please select your primary wedding service category to continue.',
          confirmText: 'Choose Category',
          onConfirm: hideDialog,
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!businessName.trim() || !city.trim()) {
        showDialog({
          type: 'warning',
          title: 'Missing Details',
          message: 'Please enter your Business Name and operating City to continue.',
          confirmText: 'Fill Information',
          onConfirm: hideDialog,
        });
        return;
      }
      setCurrentStep(3);
    } else {
      if (payoutMethod === 'bank' && (!bankAccount.trim() || !ifscCode.trim())) {
        showDialog({
          type: 'warning',
          title: 'Bank Account Required',
          message: 'Please provide Bank Account Number and Bank IFSC Code for advance payouts.',
          confirmText: 'Enter Details',
          onConfirm: hideDialog,
        });
        return;
      }
      if (payoutMethod === 'upi' && !upiId.trim()) {
        showDialog({
          type: 'warning',
          title: 'UPI ID Required',
          message: 'Please enter a valid Vendor UPI ID to receive instant customer tokens.',
          confirmText: 'Enter UPI ID',
          onConfirm: hideDialog,
        });
        return;
      }

      showDialog({
        type: 'success',
        title: 'Verification Complete! 🎉',
        message: `Congratulations! "${businessName}" is now officially registered & verified as an elite Partner in ${city.split(',')[0]}.`,
        confirmText: 'Enter Partner Dashboard',
        highlightText: '✓ Verified & Top Rated Storefront Active',
        onConfirm: () => {
          hideDialog();
          if (onSuccess) {
            onSuccess();
          } else if (navigation?.navigate) {
            navigation.navigate('VendorDashboardTab');
          }
        },
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
                : 14,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Business <Text style={styles.screenTitleHighlight}>KYC & Payout</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Step {currentStep} of 3 • {currentStep === 1 ? 'Category' : currentStep === 2 ? 'Storefront Info' : 'Bank Payouts'}
          </Text>
        </View>

        {/* Verification Pill Tag */}
        <View style={styles.decorativeTag}>
          <Ionicons name="shield-checkmark" size={14} color="#8A072D" style={{ marginRight: 4 }} />
          <Text style={styles.decorativeTagText}>Verified Partner</Text>
        </View>
      </View>

      {/* 3-Step Visual Progress Bar */}
      <View style={styles.stepProgressContainer}>
        <View style={styles.stepRow}>
          {/* Step 1 */}
          <TouchableOpacity
            style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}
            onPress={() => setCurrentStep(1)}
            activeOpacity={0.8}
          >
            {currentStep > 1 ? (
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            ) : (
              <Text style={[styles.stepDotNum, currentStep === 1 && styles.stepDotNumActive]}>1</Text>
            )}
          </TouchableOpacity>
          <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />

          {/* Step 2 */}
          <TouchableOpacity
            style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}
            onPress={() => setCurrentStep(2)}
            activeOpacity={0.8}
          >
            {currentStep > 2 ? (
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            ) : (
              <Text style={[styles.stepDotNum, currentStep === 2 && styles.stepDotNumActive]}>2</Text>
            )}
          </TouchableOpacity>
          <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />

          {/* Step 3 */}
          <TouchableOpacity
            style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}
            onPress={() => setCurrentStep(3)}
            activeOpacity={0.8}
          >
            <Text style={[styles.stepDotNum, currentStep === 3 && styles.stepDotNumActive]}>3</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepLabelsRow}>
          <Text style={[styles.stepLabelText, currentStep === 1 && styles.stepLabelTextActive]}>Category</Text>
          <Text style={[styles.stepLabelText, currentStep === 2 && styles.stepLabelTextActive]}>Profile</Text>
          <Text style={[styles.stepLabelText, currentStep === 3 && styles.stepLabelTextActive]}>Payout & KYC</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* STEP 1: SERVICE CATEGORY SELECTION */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <View>
            <View style={styles.stepHeaderCard}>
              <Text style={styles.stepSectionHeading}>Select Your Business Category</Text>
              <Text style={styles.stepSectionSub}>
                Choose the primary service your team delivers for weddings
              </Text>
            </View>

            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catCard, isSelected && styles.catCardSelected]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedCategory(cat.name);
                      setStartingPrice(cat.starting);
                    }}
                  >
                    <View style={[styles.catIconCircle, isSelected && styles.catIconCircleSelected]}>
                      <Ionicons
                        name={cat.icon as any}
                        size={20}
                        color={isSelected ? '#8A072D' : '#64748B'}
                      />
                    </View>

                    <Text style={[styles.catTitle, isSelected && styles.catTitleSelected]}>
                      {cat.name}
                    </Text>
                    <Text style={styles.catDesc} numberOfLines={2}>
                      {cat.desc}
                    </Text>

                    <View style={styles.catFooterRow}>
                      <Text style={styles.catStartingLabel}>Starts from</Text>
                      <Text style={[styles.catStartingPrice, isSelected && styles.catStartingPriceSelected]}>
                        {cat.starting}
                      </Text>
                    </View>

                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#8A072D" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 2: BUSINESS STOREFRONT INFORMATION */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <View>
            {/* Live Customer Preview Card */}
            <View style={styles.previewContainer}>
              <View style={styles.previewHeaderRow}>
                <Ionicons name="eye-outline" size={14} color="#8A072D" style={{ marginRight: 4 }} />
                <Text style={styles.previewHeaderTitle}>Live Customer App Preview</Text>
              </View>
              <View style={styles.previewCard}>
                <View style={styles.previewIconBox}>
                  <Ionicons name="business" size={22} color="#8A072D" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.previewName}>{businessName || 'Your Business Name'}</Text>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                  </View>
                  <Text style={styles.previewCategory}>{selectedCategory}</Text>
                  <View style={styles.previewMetaRow}>
                    <Ionicons name="location" size={12} color="#64748B" />
                    <Text style={styles.previewMetaText}>{city || 'City'}</Text>
                    <Text style={styles.previewDot}>•</Text>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.previewRating}>4.9 (New Partner)</Text>
                  </View>
                </View>
                <View style={styles.previewBadgePill}>
                  <Text style={styles.previewBadgeText}>VERIFIED</Text>
                </View>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Business / Storefront Name *</Text>
              <TextInput
                style={styles.textInput}
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="e.g. Royal Events & Decor"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.fieldLabel}>Operating City & State *</Text>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Indore, Madhya Pradesh"
                placeholderTextColor="#94A3B8"
              />

              <View style={styles.twoColRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.fieldLabel}>Years of Experience</Text>
                  <TextInput
                    style={styles.textInput}
                    value={experience}
                    onChangeText={setExperience}
                    placeholder="e.g. 8+ Years"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.fieldLabel}>Starting Package</Text>
                  <TextInput
                    style={styles.textInput}
                    value={startingPrice}
                    onChangeText={setStartingPrice}
                    placeholder="e.g. ₹45,000"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 3: BANK PAYOUT & KYC DOCUMENTS */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <View>
            {/* Payout Mechanism Selector */}
            <View style={styles.payoutCard}>
              <Text style={styles.stepSectionHeading}>Direct Advance Payouts</Text>
              <Text style={styles.stepSectionSub}>
                Customer booking advances (₹25,000 token) will be credited directly to this account
              </Text>

              {/* Mode Tabs: Bank vs UPI */}
              <View style={styles.payoutTabsRow}>
                <TouchableOpacity
                  style={[styles.payoutTabBtn, payoutMethod === 'bank' && styles.payoutTabBtnActive]}
                  onPress={() => setPayoutMethod('bank')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="card"
                    size={16}
                    color={payoutMethod === 'bank' ? '#8A072D' : '#64748B'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.payoutTabText, payoutMethod === 'bank' && styles.payoutTabTextActive]}>
                    Bank Transfer (IMPS)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.payoutTabBtn, payoutMethod === 'upi' && styles.payoutTabBtnActive]}
                  onPress={() => setPayoutMethod('upi')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="qr-code"
                    size={16}
                    color={payoutMethod === 'upi' ? '#8A072D' : '#64748B'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.payoutTabText, payoutMethod === 'upi' && styles.payoutTabTextActive]}>
                    Instant UPI
                  </Text>
                </TouchableOpacity>
              </View>

              {payoutMethod === 'bank' ? (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.fieldLabel}>Bank Account Number *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={bankAccount}
                    onChangeText={setBankAccount}
                    placeholder="e.g. 50100234567812"
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                  />

                  <Text style={styles.fieldLabel}>Bank IFSC Code *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    placeholder="e.g. HDFC0001234"
                    autoCapitalize="characters"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              ) : (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.fieldLabel}>Vendor UPI VPA *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={upiId}
                    onChangeText={setUpiId}
                    placeholder="e.g. royalevents@okhdfcbank"
                    autoCapitalize="none"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              )}

              {/* Tax Information */}
              <View style={[styles.twoColRow, { marginTop: 4 }]}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.fieldLabel}>PAN Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={panNumber}
                    onChangeText={setPanNumber}
                    placeholder="ABCDE1234F"
                    autoCapitalize="characters"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.fieldLabel}>GSTIN (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={gstNumber}
                    onChangeText={setGstNumber}
                    placeholder="23ABCDE1234F1Z5"
                    autoCapitalize="characters"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Document Upload Simulation Card */}
            <View style={styles.docUploadCard}>
              <View style={styles.docUploadHeader}>
                <Ionicons name="document-text" size={18} color="#8A072D" style={{ marginRight: 6 }} />
                <Text style={styles.docUploadTitle}>Identity & Business Proof</Text>
              </View>
              <Text style={styles.docUploadSub}>
                Upload Aadhaar Card / Shop License / Registration certificate
              </Text>

              <TouchableOpacity
                style={styles.docUploadBox}
                activeOpacity={0.8}
                onPress={() => setIsDocUploaded(!isDocUploaded)}
              >
                {isDocUploaded ? (
                  <View style={styles.uploadedStateRow}>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.uploadedDocName}>Business_Registration_Doc.pdf</Text>
                      <Text style={styles.uploadedDocMeta}>Verified 2.4 MB • Complete</Text>
                    </View>
                    <Ionicons name="refresh" size={18} color="#8A072D" />
                  </View>
                ) : (
                  <View style={styles.emptyUploadRow}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#8A072D" />
                    <Text style={styles.uploadPromptText}>Tap to choose document / capture photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Security / Trust Strip */}
        <View style={styles.trustBanner}>
          <Ionicons name="lock-closed" size={14} color="#15803D" style={{ marginRight: 6 }} />
          <Text style={styles.trustBannerText}>
            Bank-grade 256-bit encryption • 100% Secure Vendor Payouts
          </Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.primaryActionButton}
          activeOpacity={0.88}
          onPress={handleNextOrSubmit}
        >
          <Text style={styles.primaryActionButtonText}>
            {currentStep === 1
              ? 'Continue to Business Profile'
              : currentStep === 2
              ? 'Continue to Bank & Payouts'
              : 'Complete Verification & Open Dashboard'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <View style={{ height: 28 }} />
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
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  screenTitleHighlight: {
    color: '#8A072D',
  },
  screenSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  decorativeTag: {
    backgroundColor: '#FFF1F2',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  decorativeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A072D',
  },

  // 3-Step Progress Bar
  stepProgressContainer: {
    backgroundColor: '#FAF9FB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#8A072D',
  },
  stepDotNum: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  stepDotNumActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#8A072D',
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  stepLabelText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stepLabelTextActive: {
    color: '#8A072D',
    fontWeight: '800',
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

  // Step Header
  stepHeaderCard: {
    marginBottom: 12,
  },
  stepSectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  stepSectionSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },

  // Category Grid (Step 1)
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catCard: {
    width: (width - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  catCardSelected: {
    borderColor: '#8A072D',
    backgroundColor: '#FFF9FA',
    shadowColor: '#8A072D',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  catIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catIconCircleSelected: {
    backgroundColor: '#FFF1F2',
  },
  catTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  catTitleSelected: {
    color: '#8A072D',
    fontWeight: '800',
  },
  catDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 13,
    minHeight: 26,
    marginBottom: 8,
  },
  catFooterRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  catStartingLabel: {
    fontSize: 8.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  catStartingPrice: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  catStartingPriceSelected: {
    color: '#8A072D',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Live Customer Preview (Step 2)
  previewContainer: {
    marginBottom: 14,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  previewHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  previewIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  previewCategory: {
    fontSize: 10.5,
    color: '#8A072D',
    fontWeight: '600',
    marginTop: 1,
  },
  previewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  previewMetaText: {
    fontSize: 10,
    color: '#64748B',
    marginLeft: 2,
  },
  previewDot: {
    fontSize: 10,
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  previewRating: {
    fontSize: 10,
    color: '#0F172A',
    fontWeight: '700',
    marginLeft: 2,
  },
  previewBadgePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  previewBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#15803D',
  },

  // Form Cards
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 14,
  },
  payoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 14,
  },
  payoutTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  payoutTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  payoutTabBtnActive: {
    borderColor: '#8A072D',
    backgroundColor: '#FFF1F2',
  },
  payoutTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  payoutTabTextActive: {
    color: '#8A072D',
    fontWeight: '800',
  },

  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    marginBottom: 5,
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
  twoColRow: {
    flexDirection: 'row',
  },

  // Document Upload Card
  docUploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 14,
  },
  docUploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docUploadTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  docUploadSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  docUploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  uploadedStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadedDocName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  uploadedDocMeta: {
    fontSize: 10,
    color: '#15803D',
    fontWeight: '600',
    marginTop: 2,
  },
  emptyUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  uploadPromptText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 8,
  },

  // Trust Banner
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  trustBannerText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },

  // Primary Action Button
  primaryActionButton: {
    backgroundColor: '#8A072D',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

