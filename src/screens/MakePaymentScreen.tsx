import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';
import { api, userMessage } from '../services/api';

interface MakePaymentScreenProps {
  route?: any;
  navigation?: any;
  onBack?: () => void;
}

export const MakePaymentScreen: React.FC<MakePaymentScreenProps> = ({
  route,
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const bookingId = route?.params?.bookingId || 'BBBD126789';
  const vendorName = route?.params?.vendorName || 'Royal Events & Decor';
  const totalAmount = route?.params?.totalAmount || 75000;
  const advancePaid = route?.params?.advancePaid || 25000;
  const remainingAmount = route?.params?.amount || 50000;
  const eventDate = route?.params?.eventDate || '25 Nov 2026 (Wednesday)';
  const guestCount = route?.params?.guestCount || '300 - 400';

  // Payment states
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'emi'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('InvoicePayment');
    }
  };

  const handlePayNow = () => {
    const mongoId = route?.params?.bookingMongoId || route?.params?.id;
    setIsProcessing(true);

    const finishSuccess = () => {
      setIsProcessing(false);
      setIsSuccessModalVisible(true);
    };

    if (!mongoId) {
      setIsProcessing(false);
      Alert.alert('Payment', 'No booking was found to collect payment for.');
      return;
    }

    api
      .confirmPayment(String(mongoId), selectedMethod)
      .then(finishSuccess)
      .catch((err) => {
        setIsProcessing(false);
        Alert.alert('Payment', userMessage(err, 'Payment could not be completed.'));
      });
  };

  const handleSuccessDone = () => {
    setIsSuccessModalVisible(false);
    if (navigation?.navigate) {
      navigation.navigate('BookingConfirmed', {
        bookingId: bookingId,
        vendorName: vendorName,
        amount: totalAmount,
        paymentMethod:
          selectedMethod === 'upi'
            ? `Paid via UPI (${selectedUpiApp.toUpperCase()})`
            : selectedMethod === 'card'
            ? 'Paid via Credit Card'
            : 'Paid via Net Banking',
        date: eventDate,
        location: 'Indore, Madhya Pradesh',
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
        <View style={styles.headerLeftContainer}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
          </TouchableOpacity>

          <View style={styles.titleColumn}>
            <Text style={styles.screenTitle}>
              Make <Text style={styles.screenTitleHighlight}>Payment</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Complete your payment to confirm your booking
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.cardGraphicBox}>
            <Ionicons name="card" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Secure</Text>
            <Text style={styles.decorativeLine2}>Simple</Text>
            <Text style={styles.decorativeLine3}>Seamless</Text>
            <Text style={styles.decorativeLine4}>Celebrations ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Header Card */}
        <View style={styles.vendorCard}>
          <View style={styles.vendorTopRow}>
            <Image
              source={Assets.weddingMandapArt || { uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' }}
              style={styles.vendorImage}
              resizeMode="cover"
            />

            <View style={styles.vendorDetailsCol}>
              <Text style={styles.vendorName} numberOfLines={1}>
                {vendorName}
              </Text>

              <View style={styles.vendorRatingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.vendorRatingScore}>4.8</Text>
                <Text style={styles.vendorReviewsCount}>(320 reviews)</Text>
              </View>

              <View style={styles.vendorLocationRow}>
                <Ionicons name="location-sharp" size={12} color="#D81B60" />
                <Text style={styles.vendorLocationText} numberOfLines={1}>
                  Indore, Madhya Pradesh
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewProfileBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('BookingSummary')}
            >
              <Text style={styles.viewProfileBtnText}>View Details</Text>
              <Ionicons name="chevron-forward" size={13} color="#D81B60" />
            </TouchableOpacity>
          </View>

          <View style={styles.badgesRow}>
            <View style={styles.badgePill}>
              <Ionicons name="shield-checkmark" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>

            <View style={styles.badgePill}>
              <Ionicons name="trophy" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Top Rated</Text>
            </View>

            <View style={styles.badgePill}>
              <Ionicons name="headset" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Quick Response</Text>
            </View>
          </View>
        </View>

        {/* Booking Info Strip (3 Items) */}
        <View style={styles.metaPillsRow}>
          <View style={styles.metaPillItem}>
            <View style={styles.metaIconCircle}>
              <Ionicons name="calendar" size={14} color="#E53935" />
            </View>
            <View>
              <Text style={styles.metaLabel}>Event Date</Text>
              <Text style={styles.metaValue}>{eventDate}</Text>
            </View>
          </View>

          <View style={styles.metaPillItem}>
            <View style={styles.metaIconCircle}>
              <Ionicons name="people" size={14} color="#E53935" />
            </View>
            <View>
              <Text style={styles.metaLabel}>Guests</Text>
              <Text style={styles.metaValue}>{guestCount}</Text>
            </View>
          </View>

          <View style={styles.metaPillItem}>
            <View style={styles.metaIconCircle}>
              <Ionicons name="document-text" size={14} color="#E53935" />
            </View>
            <View>
              <Text style={styles.metaLabel}>Booking ID</Text>
              <Text style={styles.metaValue}>{bookingId}</Text>
            </View>
          </View>
        </View>

        {/* 1. Payment Summary Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="card" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Payment Summary</Text>
            </View>
          </View>

          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={styles.summaryVal}>₹ {totalAmount.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Advance Paid</Text>
              <Text style={[styles.summaryVal, { color: '#16A34A', fontWeight: '700' }]}>
                - ₹ {advancePaid.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.remainingStrip}>
              <Text style={styles.remainingStripLabel}>Remaining Amount</Text>
              <Text style={styles.remainingStripVal}>₹ {remainingAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* 2. Select Payment Method Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="card-outline" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Select Payment Method</Text>
            </View>
          </View>

          <View style={styles.paymentMethodsCol}>
            {/* Method 1: UPI (Recommended) */}
            <TouchableOpacity
              style={[
                styles.methodBlock,
                selectedMethod === 'upi' && styles.methodBlockActive,
              ]}
              activeOpacity={0.88}
              onPress={() => setSelectedMethod('upi')}
            >
              <View style={styles.methodHeaderRow}>
                <View style={styles.methodLeftInfo}>
                  <Text style={styles.upiLogoText}>UPI</Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.methodMainTitle}>
                      UPI <Text style={styles.recommendedTag}>(Recommended)</Text>
                    </Text>
                    <Text style={styles.methodSubtitleText}>Google Pay, PhonePe, Paytm, BHIM etc.</Text>
                  </View>
                </View>

                <View style={[styles.circleRadio, selectedMethod === 'upi' && styles.circleRadioActive]}>
                  {selectedMethod === 'upi' && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </View>
              </View>

              {/* UPI Sub-Apps Row */}
              {selectedMethod === 'upi' && (
                <View style={styles.upiAppsRow}>
                  {/* Google Pay */}
                  <TouchableOpacity
                    style={[styles.upiAppBtn, selectedUpiApp === 'gpay' && styles.upiAppBtnActive]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedUpiApp('gpay')}
                  >
                    <View style={styles.gpayLogoBox}>
                      <Ionicons name="logo-google" size={12} color="#4285F4" />
                    </View>
                    <Text style={styles.upiAppName}>Google Pay</Text>
                  </TouchableOpacity>

                  {/* PhonePe */}
                  <TouchableOpacity
                    style={[styles.upiAppBtn, selectedUpiApp === 'phonepe' && styles.upiAppBtnActive]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedUpiApp('phonepe')}
                  >
                    <View style={styles.phonepeLogoBox}>
                      <Text style={styles.phonepeLogoTxt}>पे</Text>
                    </View>
                    <Text style={styles.upiAppName}>PhonePe</Text>
                  </TouchableOpacity>

                  {/* Paytm */}
                  <TouchableOpacity
                    style={[styles.upiAppBtn, selectedUpiApp === 'paytm' && styles.upiAppBtnActive]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedUpiApp('paytm')}
                  >
                    <View style={styles.paytmLogoBox}>
                      <Text style={styles.paytmLogoTxt}>Paytm</Text>
                    </View>
                    <Text style={styles.upiAppName}>Paytm</Text>
                  </TouchableOpacity>

                  {/* BHIM */}
                  <TouchableOpacity
                    style={[styles.upiAppBtn, selectedUpiApp === 'bhim' && styles.upiAppBtnActive]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedUpiApp('bhim')}
                  >
                    <View style={styles.bhimLogoBox}>
                      <Text style={styles.bhimLogoTxt}>BHIM</Text>
                    </View>
                    <Text style={styles.upiAppName}>BHIM</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>

            {/* Method 2: Credit / Debit Card */}
            <TouchableOpacity
              style={[
                styles.methodBlock,
                selectedMethod === 'card' && styles.methodBlockActive,
              ]}
              activeOpacity={0.88}
              onPress={() => setSelectedMethod('card')}
            >
              <View style={styles.methodHeaderRow}>
                <View style={styles.methodLeftInfo}>
                  <Ionicons name="card" size={20} color="#0284C7" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.methodMainTitle}>Credit / Debit Card</Text>
                    <Text style={styles.methodSubtitleText}>Visa, Mastercard, Rupay, American Express</Text>
                  </View>
                </View>

                <View style={[styles.circleRadio, selectedMethod === 'card' && styles.circleRadioActive]}>
                  {selectedMethod === 'card' && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </View>
              </View>
            </TouchableOpacity>

            {/* Method 3: Net Banking */}
            <TouchableOpacity
              style={[
                styles.methodBlock,
                selectedMethod === 'netbanking' && styles.methodBlockActive,
              ]}
              activeOpacity={0.88}
              onPress={() => setSelectedMethod('netbanking')}
            >
              <View style={styles.methodHeaderRow}>
                <View style={styles.methodLeftInfo}>
                  <Ionicons name="business" size={20} color="#1E293B" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.methodMainTitle}>Net Banking</Text>
                    <Text style={styles.methodSubtitleText}>All major banks</Text>
                  </View>
                </View>

                <View style={[styles.circleRadio, selectedMethod === 'netbanking' && styles.circleRadioActive]}>
                  {selectedMethod === 'netbanking' && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </View>
              </View>
            </TouchableOpacity>

            {/* Method 4: Wallet */}
            <TouchableOpacity
              style={[
                styles.methodBlock,
                selectedMethod === 'wallet' && styles.methodBlockActive,
              ]}
              activeOpacity={0.88}
              onPress={() => setSelectedMethod('wallet')}
            >
              <View style={styles.methodHeaderRow}>
                <View style={styles.methodLeftInfo}>
                  <Ionicons name="wallet" size={20} color="#475569" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.methodMainTitle}>Wallet</Text>
                    <Text style={styles.methodSubtitleText}>Paytm, Amazon Pay, Mobikwik etc.</Text>
                  </View>
                </View>

                <View style={[styles.circleRadio, selectedMethod === 'wallet' && styles.circleRadioActive]}>
                  {selectedMethod === 'wallet' && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </View>
              </View>
            </TouchableOpacity>

            {/* Method 5: EMI (Optional) */}
            <View style={styles.methodBlock}>
              <View style={styles.methodHeaderRow}>
                <View style={styles.methodLeftInfo}>
                  <Ionicons name="calendar-outline" size={20} color="#64748B" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.methodMainTitle}>EMI <Text style={{ fontSize: 11, fontWeight: '400', color: '#64748B' }}>(Optional)</Text></Text>
                    <Text style={styles.methodSubtitleText}>Convert to easy EMIs</Text>
                  </View>
                </View>

                <View style={styles.comingSoonPill}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3. 100% Secure Payments Banner */}
        <View style={styles.securityBanner}>
          <View style={styles.securityIconBox}>
            <Ionicons name="shield-checkmark" size={20} color="#15803D" />
          </View>
          <View style={styles.securityTextCol}>
            <Text style={styles.securityTitle}>100% Secure Payments</Text>
            <Text style={styles.securitySub}>Your payment information is safe with bank-level security.</Text>
          </View>

          <View style={styles.securityBadgesCol}>
            <View style={styles.secBadgeItem}>
              <Ionicons name="checkmark-circle" size={11} color="#15803D" style={{ marginRight: 2 }} />
              <Text style={styles.secBadgeText}>PCI DSS</Text>
            </View>
            <View style={styles.secBadgeItem}>
              <Ionicons name="checkmark-circle" size={11} color="#15803D" style={{ marginRight: 2 }} />
              <Text style={styles.secBadgeText}>SSL Secured</Text>
            </View>
            <View style={styles.secBadgeItem}>
              <Ionicons name="checkmark-circle" size={11} color="#15803D" style={{ marginRight: 2 }} />
              <Text style={styles.secBadgeText}>Razorpay</Text>
            </View>
          </View>
        </View>

        {/* 4. Bottom Pay Button */}
        <TouchableOpacity
          style={styles.payNowBtn}
          activeOpacity={0.9}
          onPress={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payNowBtnText}>Pay ₹ {remainingAmount.toLocaleString('en-IN')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        {/* Terms subtext with lock */}
        <View style={styles.termsSubtextRow}>
          <Ionicons name="lock-closed" size={12} color="#64748B" style={{ marginRight: 4 }} />
          <Text style={styles.termsSubtext}>
            By proceeding, you agree to our{' '}
            <Text
              style={styles.termsSublink}
              onPress={() => navigation?.navigate('TermsConditions')}
            >
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text
              style={styles.termsSublink}
              onPress={() => navigation?.navigate('TermsConditions')}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Payment Processing & Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalBox}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.successModalTitle}>Payment Successful!</Text>
            <Text style={styles.successModalSub}>
              ₹{remainingAmount.toLocaleString('en-IN')} has been received. Your event booking is officially confirmed!
            </Text>

            <TouchableOpacity
              style={styles.successModalBtn}
              activeOpacity={0.88}
              onPress={handleSuccessDone}
            >
              <Text style={styles.successModalBtnText}>View Confirmed Booking</Text>
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
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    color: '#D81B60',
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: '#556987',
    marginTop: 2,
    fontWeight: '400',
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
  cardGraphicBox: {
    marginRight: 4,
  },
  tagTextCol: {
    alignItems: 'flex-start',
  },
  decorativeLine1: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D81B60',
    lineHeight: 10,
  },
  decorativeLine2: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D81B60',
    lineHeight: 10,
  },
  decorativeLine3: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#D81B60',
    lineHeight: 10,
  },
  decorativeLine4: {
    fontSize: 8,
    fontWeight: '500',
    color: '#D81B60',
    lineHeight: 9,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Vendor Card
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  vendorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorImage: {
    width: 68,
    height: 52,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#FDECEF',
  },
  vendorDetailsCol: {
    flex: 1,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  vendorRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  vendorRatingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 3,
  },
  vendorReviewsCount: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  vendorLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorLocationText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 3,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D81B60',
    marginRight: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    justifyContent: 'space-between',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1E293B',
  },

  // Booking Meta Pills Bar
  metaPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 4,
  },
  metaIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  metaLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  metaValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Summary Table
  summaryTable: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12.5,
    color: '#556987',
  },
  summaryVal: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  remainingStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  remainingStripLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E53935',
  },
  remainingStripVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E53935',
  },

  // Payment Methods
  paymentMethodsCol: {
    gap: 8,
  },
  methodBlock: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  methodBlockActive: {
    borderColor: '#E5093A',
    backgroundColor: '#FFF7F8',
  },
  methodHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upiLogoText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
  },
  methodMainTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  recommendedTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E53935',
  },
  methodSubtitleText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  circleRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleRadioActive: {
    backgroundColor: '#E5093A',
    borderColor: '#E5093A',
  },
  comingSoonPill: {
    backgroundColor: '#FFE4E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E53935',
  },

  // UPI Apps Row
  upiAppsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#FFE4E8',
  },
  upiAppBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  upiAppBtnActive: {
    borderColor: '#E5093A',
    backgroundColor: '#FFFFFF',
  },
  gpayLogoBox: {
    marginRight: 4,
  },
  phonepeLogoBox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5F259F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  phonepeLogoTxt: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  paytmLogoBox: {
    marginRight: 4,
  },
  paytmLogoTxt: {
    color: '#002E6E',
    fontSize: 8,
    fontWeight: '900',
  },
  bhimLogoBox: {
    marginRight: 4,
  },
  bhimLogoTxt: {
    color: '#15803D',
    fontSize: 8,
    fontWeight: '900',
  },
  upiAppName: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#1E293B',
  },

  // Security Banner
  securityBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  securityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  securityTextCol: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
  },
  securitySub: {
    fontSize: 9.5,
    color: '#166534',
    marginTop: 1,
  },
  securityBadgesCol: {
    alignItems: 'flex-start',
    gap: 2,
    paddingLeft: 4,
  },
  secBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#15803D',
  },

  // Pay Button
  payNowBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E5093A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  payNowBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Terms subtext
  termsSubtextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  termsSubtext: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
  },
  termsSublink: {
    color: '#E5093A',
    fontWeight: '600',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  successModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  successModalSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  successModalBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  successModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
