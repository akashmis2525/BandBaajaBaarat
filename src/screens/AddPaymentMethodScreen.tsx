import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';

interface AddPaymentMethodScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const AddPaymentMethodScreen: React.FC<AddPaymentMethodScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'card' | 'upi' | 'netbanking' | 'wallets'>('card');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  // UPI form state
  const [upiId, setUpiId] = useState('');

  // Wallet form state
  const [walletPhone, setWalletPhone] = useState('+91 91234 56789');

  // Net banking selected bank
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('SavedPaymentMethods');
    }
  };

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setExpiryDate(cleaned);
    }
  };

  const handleSaveCard = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Invalid Card Number', 'Please enter a complete 16-digit card number.');
      return;
    }
    if (expiryDate.length < 5) {
      Alert.alert('Invalid Expiry Date', 'Please enter expiry date in MM/YY format.');
      return;
    }
    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid 3-digit CVV.');
      return;
    }
    if (!cardholderName.trim()) {
      Alert.alert('Name Required', 'Please enter the cardholder name.');
      return;
    }

    Alert.alert(
      'Card Saved Successfully! 🎉',
      `Your card ending in ${cardNumber.slice(-4)} has been verified and added to your saved payment methods.`,
      [
        {
          text: 'OK',
          onPress: handleBack,
        },
      ]
    );
  };

  const handleSaveUpi = () => {
    if (!upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@okhdfcbank)');
      return;
    }
    Alert.alert(
      'UPI Account Linked! 🎉',
      `Your UPI ID ${upiId} has been verified and linked successfully.`,
      [{ text: 'OK', onPress: handleBack }]
    );
  };

  const handleSaveWallet = () => {
    Alert.alert(
      'Wallet Linked! 🎉',
      `Your wallet for ${walletPhone} has been verified via OTP and linked.`,
      [{ text: 'OK', onPress: handleBack }]
    );
  };

  const handleSaveBank = () => {
    Alert.alert(
      'Bank Account Linked! 🎉',
      `Your ${selectedBank} account has been linked for seamless net banking transactions.`,
      [{ text: 'OK', onPress: handleBack }]
    );
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
            Add <Text style={styles.headerTitleMaroon}>Payment Method</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Choose a payment method and add your details</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Secure</Text>
          <Text style={styles.scriptBadgeMid}>Simple</Text>
          <Text style={styles.scriptBadgeSub}>Faster</Text>
          <Text style={styles.scriptBadgeBot}>Payments ♡</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top 4 Category Selector Tabs */}
          <View style={styles.categoryTabsRow}>
            {/* 1. Credit / Debit Card */}
            <TouchableOpacity
              style={[
                styles.categoryTabCard,
                activeTab === 'card' && styles.categoryTabCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('card')}
            >
              <Ionicons
                name="card"
                size={22}
                color={activeTab === 'card' ? '#8A072D' : '#68595D'}
              />
              <Text
                style={[
                  styles.categoryTabLabel,
                  activeTab === 'card' && styles.categoryTabLabelActive,
                ]}
              >
                Credit / Debit Card
              </Text>
            </TouchableOpacity>

            {/* 2. UPI */}
            <TouchableOpacity
              style={[
                styles.categoryTabCard,
                activeTab === 'upi' && styles.categoryTabCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('upi')}
            >
              <View style={styles.upiIconRow}>
                <Text
                  style={[
                    styles.upiIconText,
                    activeTab === 'upi' && { color: '#8A072D' },
                  ]}
                >
                  UPI
                </Text>
                <View style={styles.upiIconDots}>
                  <View style={styles.upiGreenDot} />
                  <View style={styles.upiOrangeDot} />
                </View>
              </View>
              <Text
                style={[
                  styles.categoryTabLabel,
                  activeTab === 'upi' && styles.categoryTabLabelActive,
                ]}
              >
                UPI
              </Text>
            </TouchableOpacity>

            {/* 3. Net Banking */}
            <TouchableOpacity
              style={[
                styles.categoryTabCard,
                activeTab === 'netbanking' && styles.categoryTabCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('netbanking')}
            >
              <MaterialCommunityIcons
                name="bank-outline"
                size={22}
                color={activeTab === 'netbanking' ? '#8A072D' : '#68595D'}
              />
              <Text
                style={[
                  styles.categoryTabLabel,
                  activeTab === 'netbanking' && styles.categoryTabLabelActive,
                ]}
              >
                Net Banking
              </Text>
            </TouchableOpacity>

            {/* 4. Wallets */}
            <TouchableOpacity
              style={[
                styles.categoryTabCard,
                activeTab === 'wallets' && styles.categoryTabCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('wallets')}
            >
              <Ionicons
                name="wallet-outline"
                size={22}
                color={activeTab === 'wallets' ? '#8A072D' : '#68595D'}
              />
              <Text
                style={[
                  styles.categoryTabLabel,
                  activeTab === 'wallets' && styles.categoryTabLabelActive,
                ]}
              >
                Wallets
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Content Depending on Selected Tab */}
          {activeTab === 'card' && (
            <View style={styles.formSection}>
              {/* Card Details Header & Supported Card Logos */}
              <View style={styles.formHeaderRow}>
                <Text style={styles.formTitle}>Card Details</Text>
                <View style={styles.cardLogosRow}>
                  {/* Visa */}
                  <Text style={styles.visaLogo}>VISA</Text>
                  {/* Mastercard */}
                  <View style={styles.mcMini}>
                    <View style={styles.mcRed} />
                    <View style={styles.mcYellow} />
                  </View>
                  {/* RuPay */}
                  <Text style={styles.rupayLogo}>RuPay❯</Text>
                  {/* Amex */}
                  <View style={styles.amexBox}>
                    <Text style={styles.amexText}>AMEX</Text>
                  </View>
                </View>
              </View>

              {/* Card Number */}
              <Text style={styles.fieldLabel}>Card Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={18} color="#8A072D" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInputField}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#A08C90"
                  keyboardType="numeric"
                  maxLength={19}
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                />
              </View>

              {/* Expiry Date & CVV Row */}
              <View style={styles.twoFieldsRow}>
                {/* Expiry Date */}
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Expiry Date</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#8A072D"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInputField}
                      placeholder="MM / YY"
                      placeholderTextColor="#A08C90"
                      keyboardType="numeric"
                      maxLength={5}
                      value={expiryDate}
                      onChangeText={handleExpiryChange}
                    />
                  </View>
                </View>

                {/* CVV */}
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>CVV</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color="#8A072D"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInputField}
                      placeholder="123"
                      placeholderTextColor="#A08C90"
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      value={cvv}
                      onChangeText={setCvv}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        Alert.alert(
                          'CVV Number',
                          '3 or 4-digit security code on the back of your card.'
                        )
                      }
                    >
                      <Ionicons name="information-circle-outline" size={16} color="#8E7C80" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Cardholder Name */}
              <Text style={styles.fieldLabel}>Cardholder Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#8A072D"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInputField}
                  placeholder="Name as on card"
                  placeholderTextColor="#A08C90"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="words"
                />
              </View>

              {/* Default Payment Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                activeOpacity={0.8}
                onPress={() => setIsDefault(!isDefault)}
              >
                <View style={[styles.checkboxSquare, isDefault && styles.checkboxSquareActive]}>
                  {isDefault && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Set as default payment method</Text>
              </TouchableOpacity>

              {/* Save Card Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.85}
                onPress={handleSaveCard}
              >
                <Text style={styles.submitBtnText}>Save Card</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'upi' && (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Add UPI ID</Text>
              <Text style={styles.fieldLabel}>Virtual Payment Address (VPA)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="qr-code-outline" size={18} color="#8A072D" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInputField}
                  placeholder="e.g. amit.sharma@okicici"
                  placeholderTextColor="#A08C90"
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.85}
                onPress={handleSaveUpi}
              >
                <Text style={styles.submitBtnText}>Verify & Save UPI</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'netbanking' && (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Select Your Bank</Text>
              <View style={styles.banksGrid}>
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(
                  (b) => (
                    <TouchableOpacity
                      key={b}
                      style={[styles.bankChip, selectedBank === b && styles.bankChipActive]}
                      onPress={() => setSelectedBank(b)}
                    >
                      <Text
                        style={[
                          styles.bankChipText,
                          selectedBank === b && styles.bankChipTextActive,
                        ]}
                      >
                        {b}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.85}
                onPress={handleSaveBank}
              >
                <Text style={styles.submitBtnText}>Link {selectedBank}</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'wallets' && (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Link Wallet</Text>
              <Text style={styles.fieldLabel}>Mobile Number Linked with Wallet</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={18} color="#8A072D" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInputField}
                  placeholder="+91 91234 56789"
                  placeholderTextColor="#A08C90"
                  keyboardType="phone-pad"
                  value={walletPhone}
                  onChangeText={setWalletPhone}
                />
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.85}
                onPress={handleSaveWallet}
              >
                <Text style={styles.submitBtnText}>Link Wallet via OTP</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Card Information Secure Notice */}
          <View style={styles.securityNoticeCard}>
            <View style={styles.shieldRedCircle}>
              <Ionicons name="shield-checkmark" size={20} color="#8A072D" />
            </View>
            <View style={styles.securityNoticeCol}>
              <Text style={styles.securityNoticeTitle}>Your card information is secure</Text>
              <Text style={styles.securityNoticeSubtitle}>
                We use industry-standard encryption to keep your details safe.
              </Text>
            </View>
          </View>

          {/* 4 Security Badges Row */}
          <View style={styles.badgesRow}>
            {/* 1. 100% Secure */}
            <View style={styles.badgeCol}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#8A072D" />
              <Text style={styles.badgeText}>100% Secure</Text>
            </View>

            {/* 2. Encrypted Payments */}
            <View style={styles.badgeCol}>
              <Ionicons name="lock-closed-outline" size={20} color="#8A072D" />
              <Text style={styles.badgeText}>Encrypted{'\n'}Payments</Text>
            </View>

            {/* 3. PCI DSS Compliant */}
            <View style={styles.badgeCol}>
              <Ionicons name="shield-outline" size={20} color="#8A072D" />
              <Text style={styles.badgeText}>PCI DSS{'\n'}Compliant</Text>
            </View>

            {/* 4. Trusted by Millions */}
            <View style={styles.badgeCol}>
              <Ionicons name="card-outline" size={20} color="#8A072D" />
              <Text style={styles.badgeText}>Trusted by{'\n'}Millions</Text>
            </View>
          </View>

          <View style={{ height: 25 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 22,
    fontWeight: '800',
    color: '#1A040A',
  },
  headerTitleMaroon: {
    color: '#8A072D',
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#736064',
    marginTop: 1,
  },
  scriptBadge: {
    alignItems: 'flex-end',
    marginLeft: 4,
  },
  scriptBadgeTop: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeMid: {
    fontSize: 7,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 8,
  },
  scriptBadgeSub: {
    fontSize: 7,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 8,
  },
  scriptBadgeBot: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },

  scrollContent: {
    padding: 12,
    gap: 14,
  },

  // Top 4 Category Tabs
  categoryTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryTabCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFE2DC',
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  categoryTabCardActive: {
    backgroundColor: '#FFF8F6',
    borderWidth: 1.5,
    borderColor: '#8A072D',
  },
  categoryTabLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#68595D',
    textAlign: 'center',
    lineHeight: 12,
  },
  categoryTabLabelActive: {
    color: '#8A072D',
    fontWeight: '800',
  },
  upiIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  upiIconText: {
    fontSize: 13,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#68595D',
  },
  upiIconDots: {
    gap: 1,
  },
  upiGreenDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#16A34A',
  },
  upiOrangeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#EA580C',
  },

  // Form Section
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 14,
    gap: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  formHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A040A',
  },
  cardLogosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  visaLogo: {
    fontSize: 13,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#1A1F71',
    letterSpacing: 0.5,
  },
  mcMini: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcRed: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EB001B',
    marginRight: -5,
  },
  mcYellow: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F79E1B',
    opacity: 0.9,
  },
  rupayLogo: {
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#097938',
  },
  amexBox: {
    backgroundColor: '#006FCF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  amexText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },

  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8D2CB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInputField: {
    flex: 1,
    fontSize: 12,
    color: '#1A040A',
    fontWeight: '600',
  },
  twoFieldsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
    gap: 6,
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#C5B4B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSquareActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  checkboxLabel: {
    fontSize: 10.5,
    color: '#554246',
    fontWeight: '600',
  },

  // Submit Button
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Banks Grid
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  bankChip: {
    width: '48%',
    backgroundColor: '#FDF1EC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F7D7CA',
  },
  bankChipActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  bankChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A040A',
    textAlign: 'center',
  },
  bankChipTextActive: {
    color: '#FFFFFF',
  },

  // Security Notice Card
  securityNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    gap: 10,
  },
  shieldRedCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityNoticeCol: {
    flex: 1,
  },
  securityNoticeTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  securityNoticeSubtitle: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 1,
  },

  // 4 Badges Row
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 2,
  },
  badgeCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#736064',
    textAlign: 'center',
    lineHeight: 11,
  },
});
