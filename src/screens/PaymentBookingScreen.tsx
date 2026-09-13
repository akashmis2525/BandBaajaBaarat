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
  Modal,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

export const PaymentBookingScreen: React.FC<{ navigation?: any; route?: any; onBack?: () => void }> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const serviceTitle = route?.params?.serviceTitle || 'The Grand Palace';
  const serviceCategory = route?.params?.category || 'Banquet Hall';
  const bookingDate = route?.params?.date || '20 Dec 2026';
  const bookingTime = route?.params?.time || '7:00 PM - 11:00 PM';
  const bookingLocation = route?.params?.location || '123, AB Road, Vijay Nagar, Indore';
  const passedPrice = route?.params?.price || 75000;

  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'wallet' | 'netbanking'>('card');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoDiscount, setAppliedPromoDiscount] = useState(0);
  const [appliedPromoName, setAppliedPromoName] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showNetBankingModal, setShowNetBankingModal] = useState(false);

  const basePrice = passedPrice;
  const taxAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + taxAmount - appliedPromoDiscount;

  const banks = [
    { name: 'HDFC Bank', popular: true },
    { name: 'State Bank of India (SBI)', popular: true },
    { name: 'ICICI Bank', popular: true },
    { name: 'Axis Bank', popular: true },
    { name: 'Kotak Mahindra Bank', popular: false },
    { name: 'Punjab National Bank', popular: false },
    { name: 'Bank of Baroda', popular: false },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VenueBookingDetails');
    }
  };

  const handleApplyPromo = (code: string) => {
    if (code.toUpperCase() === 'ROYALWEDDING' || code.toUpperCase() === 'BAND2026') {
      setAppliedPromoDiscount(5000);
      setAppliedPromoName(code.toUpperCase());
      setShowPromoModal(false);
      Alert.alert('Promo Code Applied! 🎉', `Code '${code.toUpperCase()}' applied successfully. You saved ₹5,000!`);
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid coupon code like ROYALWEDDING or BAND2026.');
    }
  };

  const handlePayNow = () => {
    const paymentMethodLabel =
      selectedMethod === 'card'
        ? 'Paid via Credit Card'
        : selectedMethod === 'upi'
        ? 'Paid via UPI (Google Pay)'
        : selectedMethod === 'wallet'
        ? 'Paid via Paytm Wallet'
        : 'Paid via Net Banking';

    const bookingPayload = {
      bookingId: '#BB20261220',
      transactionId: 'TID202612200987',
      vendorName: serviceTitle,
      category: serviceCategory,
      date: bookingDate,
      time: bookingTime,
      location: bookingLocation,
      amount: totalAmount,
      paymentMethod: paymentMethodLabel,
      image: Assets.serviceDecorators,
    };

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (navigation?.navigate) {
        navigation.navigate('BookingConfirmed', bookingPayload);
      } else if (navigation?.replace) {
        navigation.replace('BookingConfirmed', bookingPayload);
      }
    }, 250);
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
                ? insets.top + 4
                : 20,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Payment & <Text style={styles.headerTitleMaroon}>Booking</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Review your booking details and make payment</Text>
        </View>

        {/* Top Right Secure Payment Badge */}
        <View style={styles.secureBadgeCol}>
          <View style={styles.secureBadgeRow}>
            <Ionicons name="shield-checkmark" size={14} color="#DC2626" />
            <Text style={styles.secureBadgeTitle}>Secure Payment</Text>
          </View>
          <Text style={styles.secureBadgeSub}>100% Safe & Secure</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 4-Step Booking Stepper */}
        <View style={styles.stepperContainer}>
          {/* Step 1: Details */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircleChecked}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepLabelInactive}>Details</Text>
          </View>

          <View style={styles.stepLineActive} />

          {/* Step 2: Date & Time */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircleChecked}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.stepLabelInactive}>Date & Time</Text>
          </View>

          <View style={styles.stepLineActive} />

          {/* Step 3: Payment (Active) */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircleActive}>
              <Text style={styles.stepCircleActiveText}>3</Text>
            </View>
            <Text style={styles.stepLabelActive}>Payment</Text>
          </View>

          <View style={styles.stepLineInactive} />

          {/* Step 4: Confirmation */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircleInactive}>
              <Text style={styles.stepCircleInactiveText}>4</Text>
            </View>
            <Text style={styles.stepLabelInactive}>Confirmation</Text>
          </View>
        </View>

        {/* Venue Booking Snapshot Card */}
        <View style={styles.venueSnapshotCard}>
          <Image source={Assets.serviceDecorators} style={styles.venueThumb} />

          <View style={styles.venueInfoCol}>
            <Text style={styles.venueNameBold}>The Grand Palace</Text>
            <Text style={styles.venueCategoryText}>Banquet Hall, Indore</Text>

            <View style={styles.venueRatingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.venueRatingNum}>4.8</Text>
              <Text style={styles.venueReviewsNum}>(320 reviews)</Text>
            </View>

            <View style={styles.venueDetailRow}>
              <Ionicons name="calendar-outline" size={12} color="#DC2626" />
              <Text style={styles.venueDetailText}>20 Dec 2026</Text>
            </View>

            <View style={styles.venueDetailRow}>
              <Ionicons name="time-outline" size={12} color="#DC2626" />
              <Text style={styles.venueDetailText}>7:00 PM - 11:00 PM</Text>
            </View>

            <View style={styles.venueDetailRow}>
              <Ionicons name="location-outline" size={12} color="#DC2626" />
              <Text style={styles.venueDetailText} numberOfLines={1}>
                123, AB Road, Vijay Nagar, Indore
              </Text>
            </View>
          </View>

          <View style={styles.venuePriceCol}>
            <Text style={styles.venuePriceAmount}>₹75,000</Text>
            <Text style={styles.venuePerEventText}>(Per Event)</Text>
            <TouchableOpacity
              style={styles.viewDetailsOutlineBtn}
              onPress={() => navigation?.navigate('VenueBookingDetails')}
            >
              <Text style={styles.viewDetailsOutlineBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Details Card */}
        <View style={styles.cardSection}>
          <Text style={styles.cardSectionTitle}>Price Details</Text>

          <View style={styles.priceRowItem}>
            <Text style={styles.priceRowLabel}>Base Price (4 Hours)</Text>
            <Text style={styles.priceRowValue}>₹75,000</Text>
          </View>

          <View style={styles.priceRowItem}>
            <Text style={styles.priceRowLabel}>Taxes & Charges (18%)</Text>
            <Text style={styles.priceRowValue}>₹13,500</Text>
          </View>

          {appliedPromoDiscount > 0 && (
            <View style={styles.priceRowItem}>
              <Text style={[styles.priceRowLabel, { color: '#16A34A', fontWeight: '700' }]}>
                Promo Discount ({appliedPromoName})
              </Text>
              <Text style={[styles.priceRowValue, { color: '#16A34A', fontWeight: '700' }]}>
                -₹{appliedPromoDiscount.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.priceDivider} />

          <View style={styles.totalRowItem}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toLocaleString()}</Text>
          </View>

          {/* Promo Code Strip */}
          <TouchableOpacity
            style={styles.promoCodeStrip}
            activeOpacity={0.8}
            onPress={() => setShowPromoModal(true)}
          >
            <Ionicons name="pricetag" size={16} color="#DC2626" />
            <Text style={styles.promoStripLabel}>
              {appliedPromoName ? `Applied: ${appliedPromoName} (-₹5,000)` : 'Have a Promo Code?'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Text style={styles.promoApplyText}>{appliedPromoName ? 'Change' : 'Apply'}</Text>
              <Ionicons name="chevron-forward" size={13} color="#DC2626" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Select Payment Method */}
        <View style={styles.cardSection}>
          <Text style={styles.cardSectionTitle}>Select Payment Method</Text>

          {/* Option 1: Credit / Debit Card */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedMethod === 'card' && styles.paymentOptionCardSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('card')}
          >
            <View style={styles.radioOuterCircle}>
              {selectedMethod === 'card' && <View style={styles.radioInnerCircle} />}
            </View>

            <View style={styles.methodIconCircle}>
              <Ionicons name="card-outline" size={18} color="#DC2626" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitleText}>Credit / Debit Card</Text>
              <Text style={styles.methodSubtitleText}>Visa, Mastercard, RuPay, Amex</Text>
            </View>

            <View style={styles.logosRow}>
              <Text style={styles.cardLogoVisa}>VISA</Text>
              <View style={styles.cardLogoMcCircle} />
              <Text style={styles.cardLogoRupay}>RuPay</Text>
              <View style={styles.cardLogoAmex}>
                <Text style={styles.cardLogoAmexText}>AMEX</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Option 2: UPI */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedMethod === 'upi' && styles.paymentOptionCardSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('upi')}
          >
            <View style={styles.radioOuterCircle}>
              {selectedMethod === 'upi' && <View style={styles.radioInnerCircle} />}
            </View>

            <View style={styles.methodIconCircle}>
              <MaterialCommunityIcons name="integrated-circuit-chip" size={18} color="#DC2626" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitleText}>UPI</Text>
              <Text style={styles.methodSubtitleText}>Google Pay, PhonePe, Paytm, BHIM</Text>
            </View>

            <View style={styles.logosRow}>
              <Ionicons name="logo-google" size={14} color="#4285F4" />
              <View style={styles.phonePeLogo}>
                <Text style={styles.phonePeLogoText}>पे</Text>
              </View>
              <Text style={styles.paytmLogoText}>Paytm</Text>
              <Ionicons name="triangle" size={12} color="#16A34A" />
            </View>
          </TouchableOpacity>

          {/* Option 3: Wallet */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedMethod === 'wallet' && styles.paymentOptionCardSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedMethod('wallet')}
          >
            <View style={styles.radioOuterCircle}>
              {selectedMethod === 'wallet' && <View style={styles.radioInnerCircle} />}
            </View>

            <View style={styles.methodIconCircle}>
              <Ionicons name="wallet-outline" size={18} color="#DC2626" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitleText}>Wallet</Text>
              <Text style={styles.methodSubtitleText}>Paytm Wallet, Amazon Pay, etc.</Text>
            </View>

            <View style={styles.logosRow}>
              <Text style={styles.paytmLogoText}>Paytm</Text>
              <Text style={styles.amazonPayText}>amazon pay</Text>
            </View>
          </TouchableOpacity>

          {/* Option 4: Net Banking */}
          <TouchableOpacity
            style={[
              styles.paymentOptionCard,
              selectedMethod === 'netbanking' && styles.paymentOptionCardSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedMethod('netbanking');
              setShowNetBankingModal(true);
            }}
          >
            <View style={styles.radioOuterCircle}>
              {selectedMethod === 'netbanking' && <View style={styles.radioInnerCircle} />}
            </View>

            <View style={styles.methodIconCircle}>
              <Ionicons name="business-outline" size={18} color="#DC2626" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitleText}>Net Banking</Text>
              <Text style={styles.methodSubtitleText}>All major banks supported</Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* Agreement Checkbox */}
        <TouchableOpacity
          style={styles.agreementRow}
          activeOpacity={0.8}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkboxSquare, agreeTerms && styles.checkboxSquareChecked]}>
            {agreeTerms && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
          </View>
          <Text style={styles.agreementText}>
            I agree to the{' '}
            <Text
              style={styles.agreementLink}
              onPress={() => setShowTermsModal(true)}
            >
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text
              style={styles.agreementLink}
              onPress={() => setShowTermsModal(true)}
            >
              Cancellation Policy
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payNowBtn, isProcessing && { opacity: 0.7 }]}
          activeOpacity={0.88}
          onPress={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
              <Text style={styles.payNowBtnText}>Pay ₹{totalAmount.toLocaleString()}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        {/* Encrypted Note */}
        <View style={styles.securityNoteRow}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#736064" />
          <Text style={styles.securityNoteText}>
            Your payment information is encrypted and secure.
          </Text>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* Promo Code Modal */}
      <Modal visible={showPromoModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply Promo Code</Text>
              <TouchableOpacity onPress={() => setShowPromoModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <View style={styles.promoInputWrapper}>
              <TextInput
                style={styles.promoInput}
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter Coupon Code"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => handleApplyPromo(promoCode)}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.suggestedPromoCard}
              onPress={() => handleApplyPromo('ROYALWEDDING')}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.suggestedCode}>ROYALWEDDING</Text>
                <Text style={styles.suggestedDesc}>Get ₹5,000 instant discount on venue booking!</Text>
              </View>
              <Text style={styles.applySuggestedText}>APPLY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestedPromoCard}
              onPress={() => handleApplyPromo('BAND2026')}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.suggestedCode}>BAND2026</Text>
                <Text style={styles.suggestedDesc}>Flat ₹5,000 OFF for early bird wedding celebrations.</Text>
              </View>
              <Text style={styles.applySuggestedText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Net Banking Modal */}
      <Modal visible={showNetBankingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
              {banks.map((bank, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.bankRow}
                  onPress={() => {
                    setShowNetBankingModal(false);
                    Alert.alert('Bank Selected', `Selected ${bank.name} for Net Banking.`);
                  }}
                >
                  <Ionicons name="business-outline" size={18} color="#8A072D" />
                  <Text style={styles.bankNameText}>{bank.name}</Text>
                  {bank.popular && <Text style={styles.popularBadge}>POPULAR</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal visible={showTermsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Cancellation Policy</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.termsText}>
                1. Booking Confirmation{'\n'}
                Your booking is secured immediately upon successful authorization of payment.{'\n\n'}
                2. 50% Advance Policy{'\n'}
                Initial deposit confirms your exclusive date reservation with The Grand Palace Events.{'\n\n'}
                3. Cancellation & Refunds{'\n'}
                Free cancellation up to 7 days prior to event. 100% refund credited within 3-5 working days.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.primaryModalBtnText}>I Understand</Text>
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
    backgroundColor: '#FAF5F2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2E4DE',
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A040A',
  },
  headerTitleMaroon: {
    color: '#8A072D',
  },
  headerSubtitle: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 1,
  },
  secureBadgeCol: {
    alignItems: 'flex-end',
    marginLeft: 4,
  },
  secureBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  secureBadgeTitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  secureBadgeSub: {
    fontSize: 7.5,
    color: '#736064',
    marginTop: 1,
  },

  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // 4-Step Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  stepItem: {
    alignItems: 'center',
    gap: 3,
  },
  stepCircleChecked: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActiveText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  stepCircleInactive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleInactiveText: {
    color: '#736064',
    fontSize: 10.5,
    fontWeight: '700',
  },
  stepLabelActive: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  stepLabelInactive: {
    fontSize: 8.5,
    color: '#736064',
  },
  stepLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: '#DC2626',
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepLineInactive: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginBottom: 14,
  },

  // Venue Snapshot Card
  venueSnapshotCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  venueThumb: {
    width: 95,
    height: 95,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  venueInfoCol: {
    flex: 1,
    gap: 2,
  },
  venueNameBold: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  venueCategoryText: {
    fontSize: 9.5,
    color: '#736064',
  },
  venueRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  venueRatingNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
  },
  venueReviewsNum: {
    fontSize: 9,
    color: '#736064',
  },
  venueDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueDetailText: {
    fontSize: 8.5,
    color: '#4A353A',
  },
  venuePriceCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 90,
  },
  venuePriceAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626',
  },
  venuePerEventText: {
    fontSize: 8.5,
    color: '#736064',
  },
  viewDetailsOutlineBtn: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FFF7F5',
  },
  viewDetailsOutlineBtnText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Card Section
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
    marginBottom: 2,
  },
  priceRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRowLabel: {
    fontSize: 10.5,
    color: '#554246',
  },
  priceRowValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#F7EAE4',
    marginVertical: 4,
  },
  totalRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
  },

  // Promo Strip
  promoCodeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#F5DDD3',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
    marginTop: 4,
  },
  promoStripLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#8A072D',
  },
  promoApplyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },

  // Payment Options
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  paymentOptionCardSelected: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF9F7',
  },
  radioOuterCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#DC2626',
  },
  methodIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A040A',
  },
  methodSubtitleText: {
    fontSize: 8.5,
    color: '#736064',
  },
  logosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLogoVisa: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1A1F71',
    fontStyle: 'italic',
  },
  cardLogoMcCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EB001B',
  },
  cardLogoRupay: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#097938',
  },
  cardLogoAmex: {
    backgroundColor: '#006FCF',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  cardLogoAmexText: {
    fontSize: 6.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  phonePeLogo: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5F259F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonePeLogoText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  paytmLogoText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#00BAF2',
  },
  amazonPayText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#FF9900',
  },

  // Agreement Checkbox
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSquareChecked: {
    backgroundColor: '#DC2626',
  },
  agreementText: {
    fontSize: 9.5,
    color: '#4A353A',
    flex: 1,
  },
  agreementLink: {
    color: '#DC2626',
    fontWeight: '700',
  },

  // Pay Now Button
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 13,
    gap: 8,
    elevation: 3,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 4,
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  securityNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 2,
  },
  securityNoteText: {
    fontSize: 8.5,
    color: '#736064',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A040A',
  },
  promoInputWrapper: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    backgroundColor: '#FFF7F5',
  },
  applyBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  suggestedPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#F5DDD3',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  suggestedCode: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#DC2626',
  },
  suggestedDesc: {
    fontSize: 9,
    color: '#736064',
  },
  applySuggestedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
    gap: 8,
  },
  bankNameText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  popularBadge: {
    fontSize: 8,
    fontWeight: '800',
    color: '#DC2626',
    backgroundColor: '#FDECE6',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  termsText: {
    fontSize: 10.5,
    color: '#554246',
    lineHeight: 15,
  },
  primaryModalBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
