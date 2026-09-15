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
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';

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
  const initialTab = route?.params?.initialTab || 'card';
  const [activeTab, setActiveTab] = useState<'card' | 'upi' | 'wallet' | 'netbanking'>(initialTab);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('Aakash Mishra');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [isDefault, setIsDefault] = useState(true);

  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');

  // Wallet Form State
  const [walletNumber, setWalletNumber] = useState('+91 97133 32997');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // Net Banking Form State
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
    let cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    setExpiryDate(cleaned);
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setCvv(cleaned);
  };

  const handleSaveCard = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Incomplete Card Number', 'Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardHolderName.trim()) {
      Alert.alert('Missing Name', 'Please enter the cardholder name.');
      return;
    }
    if (expiryDate.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter expiry date in MM/YY format.');
      return;
    }
    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a 3 or 4 digit CVV code.');
      return;
    }

    Alert.alert(
      'Card Saved Successfully',
      'Your card has been securely saved and encrypted for fast checkout.',
      [
        {
          text: 'Done',
          onPress: () => {
            if (navigation?.goBack) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const handleSaveUpi = () => {
    if (!upiId.trim() || !upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI VPA (e.g., username@okhdfcbank).');
      return;
    }
    Alert.alert('UPI Added', 'Your UPI ID has been verified and saved.', [
      {
        text: 'Done',
        onPress: () => navigation?.goBack?.(),
      },
    ]);
  };

  const handleSaveWallet = () => {
    Alert.alert('Wallet Linked', `${selectedWallet} has been linked to your account.`, [
      {
        text: 'Done',
        onPress: () => navigation?.goBack?.(),
      },
    ]);
  };

  const handleSaveNetBanking = () => {
    Alert.alert('Bank Selected', `${selectedBank} saved as your preferred net banking option.`, [
      {
        text: 'Done',
        onPress: () => navigation?.goBack?.(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
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
              Add New{' '}
              <Text style={styles.screenTitleHighlight}>
                {activeTab === 'card'
                  ? 'Card'
                  : activeTab === 'upi'
                  ? 'UPI'
                  : activeTab === 'wallet'
                  ? 'Wallet'
                  : 'Net Banking'}
              </Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              {activeTab === 'card'
                ? 'Enter your card details securely'
                : activeTab === 'upi'
                ? 'Enter your UPI VPA to link'
                : activeTab === 'wallet'
                ? 'Link your mobile wallet'
                : 'Choose your preferred bank'}
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.cardGraphicBox}>
            <Ionicons name="card" size={16} color="#D81B60" />
            <View style={styles.cardCheckBadge}>
              <Ionicons name="checkmark-sharp" size={8} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Secure</Text>
            <Text style={styles.decorativeLine2}>Payments</Text>
            <Text style={styles.decorativeLine3}>Happier Events ♡</Text>
          </View>
        </View>
      </View>

      {/* Payment Type Tabs */}
      <View style={styles.tabBarContainer}>
        {[
          { id: 'card', label: 'Card', icon: 'card-outline' },
          { id: 'upi', label: 'UPI', icon: 'flash-outline' },
          { id: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
          { id: 'netbanking', label: 'Net Banking', icon: 'business-outline' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, isSelected && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabItemText, isSelected && styles.tabItemTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* TAB 1: CREDIT / DEBIT CARD */}
          {activeTab === 'card' && (
            <View>
              {/* We Accept Banner */}
              <View style={styles.weAcceptCard}>
                <View style={styles.weAcceptTextCol}>
                  <Text style={styles.weAcceptTitle}>We Accept</Text>
                  <Text style={styles.weAcceptSubtitle}>
                    All major debit and credit cards
                  </Text>
                </View>

                <View style={styles.cardLogosRow}>
                  {/* VISA */}
                  <View style={styles.logoPill}>
                    <Text style={styles.visaPillText}>VISA</Text>
                  </View>

                  {/* Mastercard */}
                  <View style={styles.logoPill}>
                    <View style={styles.mcCirclesWrap}>
                      <View style={[styles.mcCircleMini, { backgroundColor: '#EB001B' }]} />
                      <View style={[styles.mcCircleMini, { backgroundColor: '#F79E1B', marginLeft: -6 }]} />
                    </View>
                  </View>

                  {/* RuPay */}
                  <View style={styles.logoPill}>
                    <Text style={styles.rupayText}>RuPay</Text>
                  </View>

                  {/* Amex */}
                  <View style={[styles.logoPill, { backgroundColor: '#006FCF', borderColor: '#006FCF' }]}>
                    <Text style={styles.amexText}>AMERICAN{'\n'}EXPRESS</Text>
                  </View>
                </View>
              </View>

              {/* Field 1: Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={styles.inputFieldBox}>
                  <Ionicons name="card-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
                  <TextInput
                    style={styles.textInputMain}
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    placeholder="Enter card number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={19}
                  />
                  {!cardNumber && (
                    <Text style={styles.placeholderSample}>1234 5678 9012 3456</Text>
                  )}
                </View>
              </View>

              {/* Field 2: Card Holder Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Holder Name</Text>
                <View style={styles.inputFieldBox}>
                  <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
                  <TextInput
                    style={styles.textInputMain}
                    value={cardHolderName}
                    onChangeText={setCardHolderName}
                    placeholder="Enter name on card"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Fields 3 & 4: Expiry Date & CVV (Side by Side) */}
              <View style={styles.rowTwoCols}>
                {/* Expiry Date */}
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <View style={styles.inputFieldBox}>
                    <Ionicons name="calendar-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
                    <TextInput
                      style={styles.textInputMain}
                      value={expiryDate}
                      onChangeText={handleExpiryChange}
                      placeholder="MM / YY"
                      placeholderTextColor="#94A3B8"
                      keyboardType="number-pad"
                      maxLength={5}
                    />
                  </View>
                </View>

                {/* CVV */}
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputFieldBox}>
                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
                    <TextInput
                      style={styles.textInputMain}
                      value={cvv}
                      onChangeText={handleCvvChange}
                      placeholder="Enter CVV"
                      placeholderTextColor="#94A3B8"
                      keyboardType="number-pad"
                      secureTextEntry={!showCvv}
                      maxLength={4}
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowCvv(!showCvv)}
                    >
                      <Ionicons
                        name={showCvv ? 'eye-outline' : 'eye-off-outline'}
                        size={18}
                        color="#94A3B8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Set as Default Checkbox */}
              <TouchableOpacity
                style={styles.defaultCheckboxRow}
                activeOpacity={0.8}
                onPress={() => setIsDefault(!isDefault)}
              >
                <View
                  style={[
                    styles.radioCheckCircle,
                    isDefault && styles.radioCheckCircleActive,
                  ]}
                >
                  {isDefault && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>

                <View style={styles.defaultTextCol}>
                  <Text style={styles.defaultMainText}>
                    Set as Default Payment Method
                  </Text>
                  <Text style={styles.defaultSubText}>
                    This card will be used for future bookings
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Save Card Button */}
              <TouchableOpacity
                style={styles.saveCardButton}
                activeOpacity={0.85}
                onPress={handleSaveCard}
              >
                <Text style={styles.saveCardButtonText}>Save Card</Text>
              </TouchableOpacity>

              {/* Encryption Assurance */}
              <View style={styles.encryptionRow}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#4A5568" />
                <Text style={styles.encryptionText}>
                  Your card details are encrypted and secure
                </Text>
              </View>

              {/* Bottom Security Card */}
              <View style={styles.safeBannerCard}>
                <View style={styles.safeShieldGraphicBox}>
                  <Ionicons name="shield-checkmark" size={44} color="#F43F5E" />
                  <View style={styles.lockInsideShield}>
                    <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.safeTextCol}>
                  <Text style={styles.safeTitle}>Safe. Secure. Hassle-Free.</Text>
                  <Text style={styles.safeSubtitle}>
                    Your payment information is protected with industry-standard encryption.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: UPI */}
          {activeTab === 'upi' && (
            <View>
              <Text style={styles.subSectionTitle}>Popular UPI Apps</Text>
              <View style={styles.upiAppsRow}>
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                  <TouchableOpacity
                    key={app}
                    style={[
                      styles.upiAppTile,
                      selectedUpiApp === app && styles.upiAppTileActive,
                    ]}
                    onPress={() => setSelectedUpiApp(app)}
                  >
                    <Ionicons
                      name="flash"
                      size={20}
                      color={selectedUpiApp === app ? '#D81B60' : '#475569'}
                    />
                    <Text
                      style={[
                        styles.upiAppText,
                        selectedUpiApp === app && styles.upiAppTextActive,
                      ]}
                    >
                      {app}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Enter UPI ID / VPA</Text>
                <View style={styles.inputFieldBox}>
                  <Ionicons name="at-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
                  <TextInput
                    style={styles.textInputMain}
                    value={upiId}
                    onChangeText={setUpiId}
                    placeholder="e.g. mobile@okhdfcbank"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Popular UPI Handles */}
              <View style={styles.handlesWrap}>
                {['@okhdfcbank', '@okaxis', '@okicici', '@paytm', '@ybl'].map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={styles.handleChip}
                    onPress={() => {
                      const prefix = upiId.split('@')[0] || '9713332997';
                      setUpiId(`${prefix}${h}`);
                    }}
                  >
                    <Text style={styles.handleChipText}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveCardButton, { marginTop: 24 }]}
                activeOpacity={0.85}
                onPress={handleSaveUpi}
              >
                <Text style={styles.saveCardButtonText}>Verify & Save UPI</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 3: WALLET */}
          {activeTab === 'wallet' && (
            <View>
              <Text style={styles.subSectionTitle}>Select Wallet</Text>
              <View style={styles.walletsList}>
                {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik'].map((w) => (
                  <TouchableOpacity
                    key={w}
                    style={[
                      styles.walletItemCard,
                      selectedWallet === w && styles.walletItemCardActive,
                    ]}
                    onPress={() => setSelectedWallet(w)}
                  >
                    <Ionicons
                      name="wallet-outline"
                      size={22}
                      color={selectedWallet === w ? '#D81B60' : '#475569'}
                    />
                    <Text style={styles.walletItemText}>{w}</Text>
                    <Ionicons
                      name={
                        selectedWallet === w
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={20}
                      color={selectedWallet === w ? '#D81B60' : '#CBD5E1'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Registered Mobile Number</Text>
                <View style={styles.inputFieldBox}>
                  <Ionicons name="call-outline" size={20} color="#64748B" style={styles.inputLeftIcon} />
                  <TextInput
                    style={styles.textInputMain}
                    value={walletNumber}
                    onChangeText={setWalletNumber}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveCardButton, { marginTop: 24 }]}
                activeOpacity={0.85}
                onPress={handleSaveWallet}
              >
                <Text style={styles.saveCardButtonText}>Link {selectedWallet}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 4: NET BANKING */}
          {activeTab === 'netbanking' && (
            <View>
              <Text style={styles.subSectionTitle}>Popular Banks</Text>
              <View style={styles.banksGrid}>
                {[
                  'HDFC Bank',
                  'ICICI Bank',
                  'State Bank of India',
                  'Axis Bank',
                  'Kotak Mahindra Bank',
                  'Punjab National Bank',
                ].map((bank) => (
                  <TouchableOpacity
                    key={bank}
                    style={[
                      styles.bankTile,
                      selectedBank === bank && styles.bankTileActive,
                    ]}
                    onPress={() => setSelectedBank(bank)}
                  >
                    <FontAwesome5
                      name="university"
                      size={18}
                      color={selectedBank === bank ? '#D81B60' : '#475569'}
                    />
                    <Text
                      style={[
                        styles.bankTileText,
                        selectedBank === bank && styles.bankTileTextActive,
                      ]}
                    >
                      {bank}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveCardButton, { marginTop: 24 }]}
                activeOpacity={0.85}
                onPress={handleSaveNetBanking}
              >
                <Text style={styles.saveCardButtonText}>Continue with {selectedBank}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 12,
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
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1B1F',
    letterSpacing: -0.3,
  },
  screenTitleHighlight: {
    color: '#D81B60',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#556987',
    marginTop: 2,
    fontWeight: '400',
  },
  decorativeTag: {
    backgroundColor: '#FDECEF',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardGraphicBox: {
    position: 'relative',
    marginRight: 6,
  },
  cardCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tagTextCol: {
    alignItems: 'center',
  },
  decorativeLine1: {
    fontSize: 10,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 12,
  },
  decorativeLine2: {
    fontSize: 10,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 12,
  },
  decorativeLine3: {
    fontSize: 9,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 11,
  },
  tabBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    paddingVertical: 10,
    marginRight: 18,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#D81B60',
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  tabItemTextActive: {
    color: '#D81B60',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },
  weAcceptCard: {
    backgroundColor: '#FDF2F4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  weAcceptTextCol: {
    marginBottom: 10,
  },
  weAcceptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  weAcceptSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardLogosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
  },
  visaPillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1A1F71',
    fontStyle: 'italic',
  },
  mcCirclesWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircleMini: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  rupayText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0059B2',
  },
  amexText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 7,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1B1F',
    marginBottom: 6,
  },
  inputFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 48,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInputMain: {
    flex: 1,
    fontSize: 14,
    color: '#1C1B1F',
    fontWeight: '500',
  },
  placeholderSample: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  rowTwoCols: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    padding: 6,
  },
  defaultCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  radioCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCheckCircleActive: {
    backgroundColor: '#D81B60',
    borderColor: '#D81B60',
  },
  defaultTextCol: {
    flex: 1,
  },
  defaultMainText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1B1F',
  },
  defaultSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  saveCardButton: {
    backgroundColor: '#D81B60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 6,
  },
  saveCardButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  encryptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 20,
    gap: 6,
  },
  encryptionText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  safeBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
  },
  safeShieldGraphicBox: {
    position: 'relative',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lockInsideShield: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9F1239',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeTextCol: {
    flex: 1,
  },
  safeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 3,
  },
  safeSubtitle: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 12,
  },
  upiAppsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  upiAppTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiAppTileActive: {
    borderColor: '#D81B60',
    backgroundColor: '#FFF1F4',
  },
  upiAppText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 4,
  },
  upiAppTextActive: {
    color: '#D81B60',
  },
  handlesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  handleChip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  handleChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  walletsList: {
    gap: 8,
    marginBottom: 16,
  },
  walletItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  walletItemCardActive: {
    borderColor: '#D81B60',
    backgroundColor: '#FFF7F8',
  },
  walletItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1B1F',
  },
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankTile: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankTileActive: {
    borderColor: '#D81B60',
    backgroundColor: '#FFF1F4',
  },
  bankTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
  },
  bankTileTextActive: {
    color: '#D81B60',
  },
});
