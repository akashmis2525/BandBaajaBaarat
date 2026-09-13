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
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

interface PaymentScreenProps {
  route?: {
    params?: {
      vendor?: {
        id: string;
        name: string;
        category: string;
        rating: number;
        reviewsCount: number;
        experienceYears: number;
        distanceKm: number;
        startingPrice: number;
        image: any;
      };
      eventDate?: string;
      eventTime?: string;
      eventLocation?: string;
      totalAmount?: number;
    };
  };
  navigation?: any;
  onBack?: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  route,
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const vendor = route?.params?.vendor || {
    id: 'v2',
    name: 'Royal Beats Dhol Group',
    category: 'Dhol Services',
    rating: 4.6,
    reviewsCount: 210,
    experienceYears: 5,
    startingPrice: 8000,
    image: Assets.serviceBrassBand,
  };

  const eventDate = route?.params?.eventDate || '15 Nov 2026, Sunday';
  const eventTime = route?.params?.eventTime || '5:00 PM - 9:00 PM (4 Hours)';
  const eventLocation = route?.params?.eventLocation || 'Indore, Madhya Pradesh';

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'wallet' | 'netbanking' | 'paylater'>('upi');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'manual'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [upiVerifiedName, setUpiVerifiedName] = useState('');

  // 2. Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // 3. Wallet State
  const [selectedWallet, setSelectedWallet] = useState<'amazon' | 'paytm' | 'phonepe' | 'mobikwik'>('amazon');

  // 4. Net Banking State
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [showAllBanksModal, setShowAllBanksModal] = useState(false);

  // 5. Pay Later State
  const [selectedPayLater, setSelectedPayLater] = useState<'simpl' | 'lazypay' | 'icicipaylater'>('simpl');
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<'full' | '3months' | '6months'>('3months');

  // Price Calculation
  const basicPrice = vendor.startingPrice || 8000;
  const artistCharges = 2000;
  const travelCharges = 1000;
  const grossTotal = basicPrice + artistCharges + travelCharges;
  const finalTotal = grossTotal - appliedDiscount;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  // UPI verification logic
  const handleVerifyUpi = () => {
    if (!upiIdInput || !upiIdInput.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@okhdfcbank or 9826012345@ybl)');
      return;
    }
    setIsUpiVerified(true);
    setUpiVerifiedName('Rahul Sharma (Verified)');
    Alert.alert('UPI ID Verified ✓', `Account Holder: Rahul Sharma\nReady to pay ₹${finalTotal.toLocaleString('en-IN')}`);
  };

  // Card Number Formatter
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 16);
    const parts = cleaned.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : cleaned);
  };

  // Card Expiry Formatter
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length >= 2) {
      setCardExpiry(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  // Detect Card Brand
  const getCardBrand = (num: string) => {
    const cleaned = num.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'VISA';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('6')) return 'RuPay';
    return '';
  };

  const applyCoupon = (code: string) => {
    if (code.toUpperCase() === 'SHAADI1000' || code.toUpperCase() === 'ROYALWEDDING') {
      setAppliedDiscount(1000);
      setCouponCode(code.toUpperCase());
      setShowCouponModal(false);
      Alert.alert('Coupon Applied! 🎉', '₹1,000 instant wedding discount applied successfully!');
    } else {
      Alert.alert('Invalid Coupon', 'Please enter a valid coupon code like ROYALWEDDING or SHAADI1000');
    }
  };

  // Final Payment Processing with Validation
  const handlePayNow = () => {
    if (!agreeTerms) {
      Alert.alert('Terms & Conditions', 'Please agree to the Terms & Conditions and Cancellation Policy to proceed.');
      return;
    }

    // Validation per method
    if (selectedMethod === 'upi') {
      if (selectedUpiApp === 'manual' && (!upiIdInput || !upiIdInput.includes('@'))) {
        Alert.alert('UPI Validation', 'Please enter and verify your UPI ID before proceeding.');
        return;
      }
    } else if (selectedMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Card Validation', 'Please enter a valid 16-digit Debit/Credit card number.');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        Alert.alert('Card Validation', 'Please enter valid Expiry Date (MM/YY).');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        Alert.alert('Card Validation', 'Please enter 3-digit CVV from back of card.');
        return;
      }
    } else if (selectedMethod === 'netbanking') {
      if (!selectedBank) {
        Alert.alert('Net Banking', 'Please select your bank to continue.');
        return;
      }
    }

    // Process payment simulation
    setIsProcessing(true);
    const bookingPayload = {
      bookingId: 'TI1265089',
      transactionId: 'TID1265089123',
      vendorName: vendor.name,
      category: vendor.category,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      amount: finalTotal,
      paymentMethod:
        selectedMethod === 'upi'
          ? `UPI (${selectedUpiApp === 'gpay' ? 'PhonePe' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'UPI'})`
          : selectedMethod === 'card'
          ? 'Credit / Debit Card'
          : selectedMethod === 'wallet'
          ? 'Wallet'
          : selectedMethod === 'netbanking'
          ? `Net Banking (${selectedBank})`
          : 'Pay Later',
      image: vendor.image || Assets.serviceBrassBand,
    };

    setTimeout(() => {
      setIsProcessing(false);
      if (navigation?.navigate) {
        navigation.navigate('BookingConfirmed', bookingPayload);
      } else if (navigation?.replace) {
        navigation.replace('BookingConfirmed', bookingPayload);
      }
    }, 300);
  };

  const topBanks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'];
  const allBanks = [
    'HDFC Bank',
    'State Bank of India',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'IndusInd Bank',
    'IDFC FIRST Bank',
    'Union Bank of India',
    'Yes Bank',
    'Federal Bank',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF5F2" />

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
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.headerBackBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerTitleMaroon}>Pay</Text>ment
          </Text>
          <Text style={styles.headerSubtitle}>Complete your payment to confirm booking</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeText}>Shaadi</Text>
          <Text style={styles.scriptBadgeSub}>Made</Text>
          <Text style={styles.scriptBadgeText}>Simple ♡</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Vendor / Event Snapshot Card */}
        <View style={styles.vendorCard}>
          <Image source={vendor.image || Assets.serviceBrassBand} style={styles.vendorImg} />

          <View style={styles.vendorInfoCol}>
            <View style={styles.vendorNameRow}>
              <Text style={styles.vendorNameText} numberOfLines={1}>
                {vendor.name}
              </Text>
              <Ionicons name="checkmark-circle" size={14} color="#8A072D" />
            </View>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={11} color="#E59819" />
              <Text style={styles.ratingScore}>{vendor.rating}</Text>
              <Text style={styles.reviewsCount}>({vendor.reviewsCount} reviews)</Text>
              <Text style={styles.pipeText}>|</Text>
              <Text style={styles.expText}>{vendor.experienceYears}+ Years</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color="#8A072D" />
              <Text style={styles.metaText} numberOfLines={1}>
                {eventLocation}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color="#8A072D" />
              <Text style={styles.metaText}>{eventDate}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={12} color="#8A072D" />
              <Text style={styles.metaText}>{eventTime}</Text>
            </View>

            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>Dhol Services</Text>
            </View>
          </View>
        </View>

        {/* Amount Details Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountHeaderRow}>
            <Text style={styles.amountHeaderTitle}>Amount Details</Text>
            <TouchableOpacity style={styles.viewDetailsToggle}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons name="chevron-down" size={12} color="#8A072D" />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Dhol Services (Basic Package)</Text>
            <Text style={styles.priceVal}>₹{basicPrice.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Artist Charges</Text>
            <Text style={styles.priceVal}>₹{artistCharges.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Travel & Setup Charges</Text>
            <Text style={styles.priceVal}>₹{travelCharges.toLocaleString('en-IN')}</Text>
          </View>

          {appliedDiscount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.discountLabel}>Coupon Discount ({couponCode})</Text>
              <Text style={styles.discountVal}>- ₹{appliedDiscount.toLocaleString('en-IN')}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalVal}>₹{finalTotal.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Have a Coupon Code Card */}
        <TouchableOpacity
          style={styles.couponCard}
          activeOpacity={0.85}
          onPress={() => setShowCouponModal(true)}
        >
          <View style={styles.couponIconBox}>
            <MaterialCommunityIcons name="ticket-percent" size={22} color="#8A072D" />
          </View>
          <View style={styles.couponTextCol}>
            <Text style={styles.couponTitle}>
              {appliedDiscount > 0 ? `Coupon Applied: ${couponCode}` : 'Have a Coupon Code?'}
            </Text>
            <Text style={styles.couponSubtitle}>
              {appliedDiscount > 0 ? '₹1,000 saved on your booking' : 'Apply coupon to get instant discount'}
            </Text>
          </View>
          <View style={styles.applyBtnCol}>
            <Text style={styles.applyBtnText}>{appliedDiscount > 0 ? 'Change' : 'Apply'}</Text>
            <Ionicons name="chevron-forward" size={14} color="#8A072D" />
          </View>
        </TouchableOpacity>

        {/* Choose Payment Method Section */}
        <View style={styles.methodsSection}>
          <View style={styles.methodsHeaderRow}>
            <Text style={styles.methodsHeaderTitle}>Choose Payment Method</Text>
            <View style={styles.secureBadgeRow}>
              <Ionicons name="shield-checkmark" size={13} color="#27A844" />
              <Text style={styles.secureBadgeText}>100% Secure Payments</Text>
            </View>
          </View>

          {/* ================= 1. UPI ================= */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'upi' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('upi')}
          >
            <View style={styles.methodHeaderRow}>
              <View style={[styles.radioCircle, selectedMethod === 'upi' && styles.radioCircleActive]}>
                {selectedMethod === 'upi' && <View style={styles.radioInnerDot} />}
              </View>

              <View style={styles.methodIconWrapper}>
                <Text style={styles.upiIconText}>UPI</Text>
              </View>

              <View style={styles.methodInfoCol}>
                <Text style={styles.methodTitle}>UPI</Text>
                <Text style={styles.methodSubtitle}>Pay using any UPI app (PhonePe, GPay, Paytm, etc.)</Text>
              </View>

              <View style={styles.brandLogosRow}>
                <View style={styles.brandLogoCirclePurple}>
                  <Text style={styles.brandLetter}>पे</Text>
                </View>
                <View style={styles.gpayLogo}>
                  <View style={styles.gDot1} />
                  <View style={styles.gDot2} />
                </View>
                <Text style={styles.paytmText}>Paytm</Text>
              </View>
            </View>

            {/* Expanded UPI Interactive Sub-Panel */}
            {selectedMethod === 'upi' && (
              <View style={styles.expandedSubPanel}>
                <Text style={styles.subPanelLabel}>Choose UPI App or Enter VPA:</Text>

                <View style={styles.upiAppsGrid}>
                  {[
                    { id: 'gpay', name: 'Google Pay', icon: 'logo-google' },
                    { id: 'phonepe', name: 'PhonePe', label: 'पे' },
                    { id: 'paytm', name: 'Paytm UPI', label: 'Paytm' },
                    { id: 'manual', name: 'Enter UPI ID', icon: 'at' },
                  ].map((app) => (
                    <TouchableOpacity
                      key={app.id}
                      style={[styles.upiAppPill, selectedUpiApp === app.id && styles.upiAppPillActive]}
                      onPress={() => setSelectedUpiApp(app.id as any)}
                    >
                      <Text style={[styles.upiAppPillText, selectedUpiApp === app.id && styles.upiAppPillTextActive]}>
                        {app.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedUpiApp === 'manual' ? (
                  <View style={styles.upiInputWrapper}>
                    <TextInput
                      style={styles.upiTextInput}
                      placeholder="e.g. 9826012345@ybl or username@okhdfc"
                      placeholderTextColor="#8C7A7E"
                      autoCapitalize="none"
                      value={upiIdInput}
                      onChangeText={(t) => {
                        setUpiIdInput(t);
                        setIsUpiVerified(false);
                      }}
                    />
                    <TouchableOpacity style={styles.upiVerifyBtn} onPress={handleVerifyUpi}>
                      <Text style={styles.upiVerifyBtnText}>Verify</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.upiAppNotice}>
                    <Ionicons name="flash" size={14} color="#8A072D" />
                    <Text style={styles.upiAppNoticeText}>
                      We will launch {selectedUpiApp.toUpperCase()} directly on your device to approve ₹{finalTotal.toLocaleString('en-IN')}.
                    </Text>
                  </View>
                )}

                {isUpiVerified && (
                  <View style={styles.verifiedSuccessRow}>
                    <Ionicons name="checkmark-circle" size={14} color="#27A844" />
                    <Text style={styles.verifiedSuccessText}>{upiVerifiedName}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* ================= 2. Credit / Debit Card ================= */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'card' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('card')}
          >
            <View style={styles.methodHeaderRow}>
              <View style={[styles.radioCircle, selectedMethod === 'card' && styles.radioCircleActive]}>
                {selectedMethod === 'card' && <View style={styles.radioInnerDot} />}
              </View>

              <View style={styles.methodIconWrapper}>
                <Ionicons name="card" size={20} color="#8A072D" />
              </View>

              <View style={styles.methodInfoCol}>
                <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                <Text style={styles.methodSubtitle}>Visa, Mastercard, RuPay & more</Text>
              </View>

              <View style={styles.brandLogosRow}>
                <Text style={styles.visaText}>VISA</Text>
                <View style={styles.mcCircles}>
                  <View style={styles.mc1} />
                  <View style={styles.mc2} />
                </View>
                <Text style={styles.rupayText}>RuPay</Text>
              </View>
            </View>

            {/* Expanded Card Interactive Sub-Panel */}
            {selectedMethod === 'card' && (
              <View style={styles.expandedSubPanel}>
                <Text style={styles.subPanelLabel}>Card Number</Text>
                <View style={styles.cardInputWrapper}>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="XXXX XXXX XXXX XXXX"
                    placeholderTextColor="#8C7A7E"
                    keyboardType="number-pad"
                    maxLength={19}
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                  />
                  {getCardBrand(cardNumber) ? (
                    <View style={styles.cardBrandBadge}>
                      <Text style={styles.cardBrandBadgeText}>{getCardBrand(cardNumber)}</Text>
                    </View>
                  ) : (
                    <Ionicons name="card-outline" size={18} color="#8C7A7E" />
                  )}
                </View>

                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subPanelLabel}>Valid Thru</Text>
                    <TextInput
                      style={styles.cardInput}
                      placeholder="MM/YY"
                      placeholderTextColor="#8C7A7E"
                      keyboardType="number-pad"
                      maxLength={5}
                      value={cardExpiry}
                      onChangeText={handleExpiryChange}
                    />
                  </View>

                  <View style={{ width: 110 }}>
                    <Text style={styles.subPanelLabel}>CVV / CVC</Text>
                    <TextInput
                      style={styles.cardInput}
                      placeholder="•••"
                      placeholderTextColor="#8C7A7E"
                      keyboardType="number-pad"
                      maxLength={4}
                      secureTextEntry
                      value={cardCvv}
                      onChangeText={setCardCvv}
                    />
                  </View>
                </View>

                <Text style={styles.subPanelLabel}>Name on Card</Text>
                <TextInput
                  style={styles.cardInput}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor="#8C7A7E"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                />

                <TouchableOpacity
                  style={styles.saveCardCheckboxRow}
                  onPress={() => setSaveCard(!saveCard)}
                >
                  <View style={[styles.miniCheck, saveCard && styles.miniCheckActive]}>
                    {saveCard && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.saveCardText}>Save card securely as per RBI guidelines</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* ================= 3. Wallet ================= */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'wallet' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('wallet')}
          >
            <View style={styles.methodHeaderRow}>
              <View style={[styles.radioCircle, selectedMethod === 'wallet' && styles.radioCircleActive]}>
                {selectedMethod === 'wallet' && <View style={styles.radioInnerDot} />}
              </View>

              <View style={styles.methodIconWrapper}>
                <Ionicons name="wallet" size={20} color="#8A072D" />
              </View>

              <View style={styles.methodInfoCol}>
                <Text style={styles.methodTitle}>Wallet</Text>
                <Text style={styles.methodSubtitle}>Paytm, Amazon Pay, PhonePe Wallet & more</Text>
              </View>

              <View style={styles.brandLogosRow}>
                <Text style={styles.paytmTextSmall}>Paytm</Text>
                <FontAwesome5 name="amazon-pay" size={18} color="#1A040A" />
                <View style={styles.brandLogoCirclePurpleSmall}>
                  <Text style={styles.brandLetterSmall}>पे</Text>
                </View>
              </View>
            </View>

            {/* Expanded Wallet Interactive Sub-Panel */}
            {selectedMethod === 'wallet' && (
              <View style={styles.expandedSubPanel}>
                <Text style={styles.subPanelLabel}>Select Digital Wallet:</Text>

                {[
                  { id: 'amazon', name: 'Amazon Pay Balance', balance: '₹12,500', isSufficient: true },
                  { id: 'paytm', name: 'Paytm Wallet', balance: '₹4,500', isSufficient: false },
                  { id: 'phonepe', name: 'PhonePe Wallet', balance: '₹2,100', isSufficient: false },
                  { id: 'mobikwik', name: 'MobiKwik Zip / Wallet', balance: '₹15,000', isSufficient: true },
                ].map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    style={[styles.walletOptionRow, selectedWallet === w.id && styles.walletOptionRowActive]}
                    onPress={() => setSelectedWallet(w.id as any)}
                  >
                    <View style={styles.walletLeft}>
                      <View style={[styles.miniRadio, selectedWallet === w.id && styles.miniRadioActive]}>
                        {selectedWallet === w.id && <View style={styles.miniRadioDot} />}
                      </View>
                      <Text style={styles.walletNameText}>{w.name}</Text>
                    </View>

                    <Text style={[styles.walletBalanceText, w.isSufficient ? styles.balanceGreen : styles.balanceAmber]}>
                      Available: {w.balance}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </TouchableOpacity>

          {/* ================= 4. Net Banking ================= */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'netbanking' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('netbanking')}
          >
            <View style={styles.methodHeaderRow}>
              <View style={[styles.radioCircle, selectedMethod === 'netbanking' && styles.radioCircleActive]}>
                {selectedMethod === 'netbanking' && <View style={styles.radioInnerDot} />}
              </View>

              <View style={styles.methodIconWrapper}>
                <FontAwesome5 name="university" size={17} color="#8A072D" />
              </View>

              <View style={styles.methodInfoCol}>
                <Text style={styles.methodTitle}>Net Banking</Text>
                <Text style={styles.methodSubtitle}>All major banks supported</Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#9C8B8E" />
            </View>

            {/* Expanded Net Banking Interactive Sub-Panel */}
            {selectedMethod === 'netbanking' && (
              <View style={styles.expandedSubPanel}>
                <Text style={styles.subPanelLabel}>Popular Banks:</Text>

                <View style={styles.banksGrid}>
                  {topBanks.map((bank) => (
                    <TouchableOpacity
                      key={bank}
                      style={[styles.bankPill, selectedBank === bank && styles.bankPillActive]}
                      onPress={() => setSelectedBank(bank)}
                    >
                      <Text style={[styles.bankPillText, selectedBank === bank && styles.bankPillTextActive]}>
                        {bank}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.moreBanksBtn}
                  onPress={() => setShowAllBanksModal(true)}
                >
                  <Text style={styles.moreBanksBtnText}>
                    {selectedBank && !topBanks.includes(selectedBank)
                      ? `Selected: ${selectedBank}`
                      : 'Select From All Indian Banks (30+) ➔'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* ================= 5. Pay Later ================= */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'paylater' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('paylater')}
          >
            <View style={styles.methodHeaderRow}>
              <View style={[styles.radioCircle, selectedMethod === 'paylater' && styles.radioCircleActive]}>
                {selectedMethod === 'paylater' && <View style={styles.radioInnerDot} />}
              </View>

              <View style={styles.methodIconWrapper}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color="#8A072D" />
              </View>

              <View style={styles.methodInfoCol}>
                <Text style={styles.methodTitle}>Pay Later / No Cost EMI</Text>
                <Text style={styles.methodSubtitle}>Book now, pay in easy 0% interest monthly installments</Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#9C8B8E" />
            </View>

            {/* Expanded Pay Later Sub-Panel */}
            {selectedMethod === 'paylater' && (
              <View style={styles.expandedSubPanel}>
                <Text style={styles.subPanelLabel}>Select Provider & Plan:</Text>

                <View style={styles.payLaterProvidersRow}>
                  {[
                    { id: 'simpl', name: 'Simpl PayLater', limit: 'Limit: ₹25,000' },
                    { id: 'lazypay', name: 'LazyPay', limit: 'Limit: ₹18,000' },
                    { id: 'icicipaylater', name: 'ICICI PayLater', limit: 'Pre-Approved' },
                  ].map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.payLaterPill, selectedPayLater === p.id && styles.payLaterPillActive]}
                      onPress={() => setSelectedPayLater(p.id as any)}
                    >
                      <Text style={[styles.payLaterPillName, selectedPayLater === p.id && styles.payLaterPillNameActive]}>
                        {p.name}
                      </Text>
                      <Text style={styles.payLaterPillLimit}>{p.limit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.emiOptionsContainer}>
                  <TouchableOpacity
                    style={[styles.emiOptionRow, selectedEmiTenure === '3months' && styles.emiOptionRowActive]}
                    onPress={() => setSelectedEmiTenure('3months')}
                  >
                    <View>
                      <Text style={styles.emiTenureTitle}>3 Months No-Cost EMI</Text>
                      <Text style={styles.emiTenureSub}>₹{Math.round(finalTotal / 3).toLocaleString('en-IN')} / month • 0% Interest</Text>
                    </View>
                    <View style={styles.zeroCostTag}>
                      <Text style={styles.zeroCostTagText}>0% Interest</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.emiOptionRow, selectedEmiTenure === '6months' && styles.emiOptionRowActive]}
                    onPress={() => setSelectedEmiTenure('6months')}
                  >
                    <View>
                      <Text style={styles.emiTenureTitle}>6 Months Wedding EMI</Text>
                      <Text style={styles.emiTenureSub}>₹{Math.round(finalTotal / 6).toLocaleString('en-IN')} / month • 0% Interest</Text>
                    </View>
                    <View style={styles.zeroCostTag}>
                      <Text style={styles.zeroCostTagText}>0% Interest</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Terms & Conditions Checkbox */}
        <TouchableOpacity
          style={styles.termsRow}
          activeOpacity={0.8}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkboxBox, agreeTerms && styles.checkboxBoxActive]}>
            {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Cancellation Policy</Text>
          </Text>
        </TouchableOpacity>

        {/* Pay Now Button */}
        <TouchableOpacity
          style={styles.payNowBtn}
          activeOpacity={0.85}
          onPress={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.payNowBtnText}>Pay Now ₹{finalTotal.toLocaleString('en-IN')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.secureFooterRow}>
          <Ionicons name="shield-checkmark" size={14} color="#27A844" />
          <Text style={styles.secureFooterText}>Your payment is 100% secure and encrypted</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* All Banks Modal for Net Banking */}
      <Modal visible={showAllBanksModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Bank</Text>
              <TouchableOpacity onPress={() => setShowAllBanksModal(false)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }}>
              {allBanks.map((bank) => (
                <TouchableOpacity
                  key={bank}
                  style={[styles.bankListRow, selectedBank === bank && styles.bankListRowActive]}
                  onPress={() => {
                    setSelectedBank(bank);
                    setShowAllBanksModal(false);
                  }}
                >
                  <Text style={[styles.bankListText, selectedBank === bank && styles.bankListTextActive]}>
                    {bank}
                  </Text>
                  {selectedBank === bank && <Ionicons name="checkmark-circle" size={18} color="#8A072D" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Coupon Modal */}
      <Modal visible={showCouponModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply Wedding Coupon</Text>
              <TouchableOpacity onPress={() => setShowCouponModal(false)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <View style={styles.couponInputRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter promo code (e.g. ROYALWEDDING)"
                placeholderTextColor="#8C7A7E"
                autoCapitalize="characters"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity
                style={styles.couponApplyBtn}
                onPress={() => applyCoupon(couponCode)}
              >
                <Text style={styles.couponApplyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Available Coupons */}
            <TouchableOpacity
              style={styles.couponPresetBox}
              onPress={() => applyCoupon('ROYALWEDDING')}
            >
              <View style={styles.presetTop}>
                <Text style={styles.presetCode}>ROYALWEDDING</Text>
                <Text style={styles.presetSave}>SAVE ₹1,000</Text>
              </View>
              <Text style={styles.presetDesc}>Flat ₹1,000 instant discount on all Dhol & Baarat bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.couponPresetBox}
              onPress={() => applyCoupon('SHAADI1000')}
            >
              <View style={styles.presetTop}>
                <Text style={styles.presetCode}>SHAADI1000</Text>
                <Text style={styles.presetSave}>SAVE ₹1,000</Text>
              </View>
              <Text style={styles.presetDesc}>Special Shahi celebration discount on full wedding package</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Success Confirmation Modal */}
      <Modal visible={showSuccessModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={38} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
            <Text style={styles.successSubtitle}>
              Booking confirmed with {vendor.name} for {eventDate}!
            </Text>

            <View style={styles.successReceiptBox}>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Transaction ID:</Text>
                <Text style={styles.successVal}>TXN-2026-98124</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Amount Paid:</Text>
                <Text style={styles.successValGreen}>₹{finalTotal.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Payment Mode:</Text>
                <Text style={styles.successVal}>
                  {selectedMethod === 'upi' ? `UPI (${selectedUpiApp.toUpperCase()})` : selectedMethod.toUpperCase()}
                </Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Security Start OTP:</Text>
                <Text style={styles.successValOTP}>5892</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.goToBookingsBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccessModal(false);
                navigation?.navigate('Bookings');
              }}
            >
              <Text style={styles.goToBookingsBtnText}>View in My Bookings</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2E4DE',
  },
  headerBackBtn: {
    padding: 4,
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
    fontSize: 10,
    color: '#736064',
    marginTop: 1,
  },
  scriptBadge: {
    alignItems: 'flex-end',
    marginLeft: 2,
  },
  scriptBadgeText: {
    fontSize: 9.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 11,
  },
  scriptBadgeSub: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#8A072D',
    lineHeight: 9,
  },
  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // Vendor Card
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  vendorImg: {
    width: 90,
    height: 112,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#FDECE6',
  },
  vendorInfoCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendorNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  ratingScore: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsCount: {
    fontSize: 9.5,
    color: '#736064',
  },
  pipeText: {
    fontSize: 9.5,
    color: '#D0BDBE',
  },
  expText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#736064',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  metaText: {
    fontSize: 10,
    color: '#554246',
    flex: 1,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECE6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  categoryPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Amount Details
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  amountHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amountHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  viewDetailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewDetailsText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#554246',
  },
  priceVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  discountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#137333',
  },
  discountVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#137333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0D4CB',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
  },
  totalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8A072D',
  },

  // Coupon Card
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 10,
  },
  couponIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponTextCol: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
  couponSubtitle: {
    fontSize: 9.5,
    color: '#7A686C',
    marginTop: 1,
  },
  applyBtnCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  applyBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A072D',
  },

  // Choose Payment Method
  methodsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    gap: 10,
  },
  methodsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  methodsHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  secureBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  secureBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#27A844',
  },
  methodCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  methodCardActive: {
    borderColor: '#8A072D',
    backgroundColor: '#FAF0EB',
  },
  methodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#9E8B8F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#8A072D',
  },
  radioInnerDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#8A072D',
  },
  methodIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiIconText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8A072D',
    fontStyle: 'italic',
  },
  methodInfoCol: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A040A',
  },
  methodSubtitle: {
    fontSize: 9,
    color: '#736064',
    marginTop: 1,
  },
  brandLogosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandLogoCirclePurple: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#5F259F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLetter: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  brandLogoCirclePurpleSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#5F259F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLetterSmall: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gpayLogo: {
    flexDirection: 'row',
    gap: 2,
  },
  gDot1: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#4285F4',
  },
  gDot2: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EA4335',
  },
  paytmText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00BAF2',
  },
  paytmTextSmall: {
    fontSize: 9,
    fontWeight: '900',
    color: '#00BAF2',
  },
  visaText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1A1F71',
    fontStyle: 'italic',
  },
  mcCircles: {
    flexDirection: 'row',
  },
  mc1: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EB001B',
  },
  mc2: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F79E1B',
    marginLeft: -4,
  },
  rupayText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F75BC',
  },

  // Expanded Sub Panels
  expandedSubPanel: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0D4CB',
    gap: 8,
  },
  subPanelLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
    marginBottom: 2,
  },

  // UPI Sub Panel
  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  upiAppPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.round,
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
  },
  upiAppPillActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  upiAppPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#68595D',
  },
  upiAppPillTextActive: {
    color: '#FFFFFF',
  },
  upiInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  upiTextInput: {
    flex: 1,
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11.5,
    color: '#1A040A',
  },
  upiVerifyBtn: {
    backgroundColor: '#8A072D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upiVerifyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  upiAppNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FDECE6',
    padding: 6,
    borderRadius: 6,
  },
  upiAppNoticeText: {
    fontSize: 9.5,
    color: '#8A072D',
    flex: 1,
  },
  verifiedSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  verifiedSuccessText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#27A844',
  },

  // Card Sub Panel
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  cardInput: {
    flex: 1,
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11.5,
    color: '#1A040A',
  },
  cardBrandBadge: {
    backgroundColor: '#8A072D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardBrandBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveCardCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  miniCheck: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.2,
    borderColor: '#8A072D',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCheckActive: {
    backgroundColor: '#8A072D',
  },
  saveCardText: {
    fontSize: 9.5,
    color: '#68595D',
  },

  // Wallet Sub Panel
  walletOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FAF5F2',
  },
  walletOptionRowActive: {
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F5CFC0',
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniRadio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: '#9E8B8F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRadioActive: {
    borderColor: '#8A072D',
  },
  miniRadioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8A072D',
  },
  walletNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A040A',
  },
  walletBalanceText: {
    fontSize: 10,
    fontWeight: '600',
  },
  balanceGreen: {
    color: '#137333',
    fontWeight: '700',
  },
  balanceAmber: {
    color: '#B06000',
  },

  // Net Banking Sub Panel
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bankPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.round,
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
  },
  bankPillActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  bankPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#554246',
  },
  bankPillTextActive: {
    color: '#FFFFFF',
  },
  moreBanksBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  moreBanksBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#8A072D',
  },

  // Pay Later Sub Panel
  payLaterProvidersRow: {
    flexDirection: 'row',
    gap: 6,
  },
  payLaterPill: {
    flex: 1,
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  payLaterPillActive: {
    backgroundColor: '#FDECE6',
    borderColor: '#8A072D',
  },
  payLaterPillName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  payLaterPillNameActive: {
    color: '#8A072D',
    fontWeight: '800',
  },
  payLaterPillLimit: {
    fontSize: 8.5,
    color: '#27A844',
    fontWeight: '700',
    marginTop: 1,
  },
  emiOptionsContainer: {
    gap: 6,
    marginTop: 4,
  },
  emiOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5F2',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0D4CB',
  },
  emiOptionRowActive: {
    backgroundColor: '#FDECE6',
    borderColor: '#8A072D',
  },
  emiTenureTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A040A',
  },
  emiTenureSub: {
    fontSize: 9.5,
    color: '#6E5C60',
    marginTop: 1,
  },
  zeroCostTag: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  zeroCostTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#137333',
  },

  // Terms & Conditions
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 2,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#8A072D',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxActive: {
    backgroundColor: '#8A072D',
  },
  termsText: {
    fontSize: 10.5,
    color: '#554246',
    flex: 1,
  },
  termsLink: {
    fontWeight: '700',
    color: '#8A072D',
    textDecorationLine: 'underline',
  },

  // Pay Now CTA
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    paddingVertical: 14,
    borderRadius: Spacing.borderRadius.round,
    marginTop: 6,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secureFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  secureFooterText: {
    fontSize: 9.5,
    color: '#6E5C60',
    fontWeight: '600',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A040A',
  },
  bankListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F7E9E3',
  },
  bankListRowActive: {
    backgroundColor: '#FDECE6',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  bankListText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A040A',
  },
  bankListTextActive: {
    color: '#8A072D',
    fontWeight: '800',
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
  },
  couponApplyBtn: {
    backgroundColor: '#8A072D',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  couponApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  couponPresetBox: {
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F5CFC0',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  presetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  presetCode: {
    fontSize: 12,
    fontWeight: '900',
    color: '#8A072D',
    letterSpacing: 0.5,
  },
  presetSave: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#137333',
  },
  presetDesc: {
    fontSize: 9.5,
    color: '#6E5C60',
    marginTop: 2,
  },

  // Success Modal
  successModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#27A844',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A040A',
  },
  successSubtitle: {
    fontSize: 11,
    color: '#6E5C60',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 15,
  },
  successReceiptBox: {
    width: '100%',
    backgroundColor: '#FAF5F2',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    marginBottom: 16,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successLabel: {
    fontSize: 11,
    color: '#736064',
  },
  successVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  successValGreen: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#27A844',
  },
  successValOTP: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#8A072D',
    letterSpacing: 1.5,
  },
  goToBookingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    width: '100%',
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.round,
    gap: 6,
  },
  goToBookingsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
