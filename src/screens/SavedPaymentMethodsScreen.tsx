import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';

interface SavedPaymentItem {
  id: string;
  type: 'upi' | 'wallet' | 'card';
  title: string;
  subtitle: string;
  expiry?: string;
  isDefault?: boolean;
}

export const SavedPaymentMethodsScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [newVpa, setNewVpa] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');

  const [savedMethods, setSavedMethods] = useState<SavedPaymentItem[]>([
    {
      id: 'p1',
      type: 'upi',
      title: 'Google Pay',
      subtitle: 'amit.sharma@okicici',
      isDefault: true,
    },
    {
      id: 'p2',
      type: 'wallet',
      title: 'Paytm',
      subtitle: '+91 91234 56789',
      isDefault: false,
    },
    {
      id: 'p3',
      type: 'card',
      title: 'HDFC Bank Credit Card',
      subtitle: '**** **** **** 1234',
      expiry: 'Valid Thru 12/28',
      isDefault: false,
    },
  ]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ProfileMain');
    }
  };

  const handleSetDefault = (id: string) => {
    setSavedMethods((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }))
    );
    Alert.alert('Default Updated', 'Primary payment method has been updated.');
  };

  const handleDelete = (id: string) => {
    setSavedMethods((prev) => prev.filter((item) => item.id !== id));
    Alert.alert('Removed', 'Payment method has been removed.');
  };

  const handleOpenMenu = (item: SavedPaymentItem) => {
    Alert.alert(
      item.title,
      `${item.subtitle}`,
      [
        !item.isDefault
          ? {
              text: 'Set as Default',
              onPress: () => handleSetDefault(item.id),
            }
          : { text: 'Default Payment Option', style: 'cancel' },
        {
          text: 'Remove Payment Method',
          style: 'destructive',
          onPress: () => handleDelete(item.id),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAddPayment = () => {
    if (addType === 'upi' && !newVpa.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@okhdfcbank)');
      return;
    }
    if (addType === 'card' && newCardNumber.length < 16) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number');
      return;
    }

    const newItem: SavedPaymentItem = {
      id: Date.now().toString(),
      type: addType,
      title: addType === 'upi' ? 'UPI Account' : 'Debit/Credit Card',
      subtitle: addType === 'upi' ? newVpa : `**** **** **** ${newCardNumber.slice(-4)}`,
      expiry: addType === 'card' ? `Valid Thru ${newCardExpiry || '10/30'}` : undefined,
      isDefault: false,
    };

    setSavedMethods([...savedMethods, newItem]);
    setShowAddModal(false);
    setNewVpa('');
    setNewCardNumber('');
    Alert.alert('Payment Method Added! 🎉', 'Your new payment method is saved and verified.');
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
            Payment <Text style={styles.headerTitleMaroon}>Methods</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Manage your saved payment options</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Safe</Text>
          <Text style={styles.scriptBadgeMid}>Payments</Text>
          <Text style={styles.scriptBadgeSub}>Happier</Text>
          <Text style={styles.scriptBadgeBot}>Celebrations ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Security Banner */}
        <View style={styles.securityBanner}>
          <View style={styles.shieldIconCircle}>
            <Ionicons name="shield-checkmark" size={20} color="#8A072D" />
          </View>
          <View style={styles.securityTextCol}>
            <Text style={styles.securityTitle}>Your Payments are Secure</Text>
            <Text style={styles.securitySubtitle}>
              We use industry-standard encryption to keep your information safe.
            </Text>
          </View>
        </View>

        {/* Saved Payment Methods Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          <Text style={styles.countText}>{savedMethods.length}/5</Text>
        </View>

        {/* Saved Cards List */}
        <View style={styles.savedList}>
          {savedMethods.map((item) => (
            <View key={item.id} style={styles.savedCard}>
              {/* Icon */}
              {item.type === 'upi' ? (
                <View style={styles.upiLogoBox}>
                  <Text style={styles.upiLogoText}>UPI</Text>
                  <View style={styles.upiArrows}>
                    <View style={styles.upiArrowGreen} />
                    <View style={styles.upiArrowOrange} />
                  </View>
                </View>
              ) : item.type === 'wallet' ? (
                <View style={styles.paytmLogoBox}>
                  <Text style={styles.paytmTextDark}>pay</Text>
                  <Text style={styles.paytmTextBlue}>tm</Text>
                </View>
              ) : (
                <View style={styles.mastercardBox}>
                  <View style={styles.mcRedCircle} />
                  <View style={styles.mcYellowCircle} />
                </View>
              )}

              {/* Text Info */}
              <View style={styles.savedInfoCol}>
                <Text style={styles.savedTitleText}>{item.title}</Text>
                <Text style={styles.savedSubtitleText}>{item.subtitle}</Text>
                {item.expiry && <Text style={styles.savedExpiryText}>{item.expiry}</Text>}
              </View>

              {/* Default Badge if active */}
              {item.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}

              {/* 3 Dots Menu Button */}
              <TouchableOpacity
                style={styles.moreBtn}
                activeOpacity={0.7}
                onPress={() => handleOpenMenu(item)}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#736064" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Payment Method Dotted Card */}
        <TouchableOpacity
          style={styles.addMethodDottedCard}
          activeOpacity={0.85}
          onPress={() => navigation?.navigate('AddPaymentMethod')}
        >
          <View style={styles.plusIconCircle}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.addMethodTitle}>Add Payment Method</Text>
          <Text style={styles.addMethodSubtitle}>
            UPI, Debit/Credit Card, Net Banking and more
          </Text>
        </TouchableOpacity>

        {/* Supported Payment Methods Section */}
        <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Supported Payment Methods</Text>

        <View style={styles.supportedRow}>
          {/* UPI */}
          <TouchableOpacity
            style={styles.supportedCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddPaymentMethod', { initialTab: 'upi' })}
          >
            <View style={styles.miniUpiIcon}>
              <Text style={styles.miniUpiText}>UPI</Text>
              <View style={styles.miniUpiDot} />
            </View>
            <Text style={styles.supportedLabel}>UPI</Text>
          </TouchableOpacity>

          {/* Cards */}
          <TouchableOpacity
            style={styles.supportedCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddPaymentMethod', { initialTab: 'card' })}
          >
            <Ionicons name="card-outline" size={20} color="#8A072D" />
            <Text style={styles.supportedLabel}>Cards</Text>
          </TouchableOpacity>

          {/* Net Banking */}
          <TouchableOpacity
            style={styles.supportedCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddPaymentMethod', { initialTab: 'netbanking' })}
          >
            <MaterialCommunityIcons name="bank-outline" size={20} color="#8A072D" />
            <Text style={styles.supportedLabel}>Net Banking</Text>
          </TouchableOpacity>

          {/* Wallets */}
          <TouchableOpacity
            style={styles.supportedCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AddPaymentMethod', { initialTab: 'wallets' })}
          >
            <Ionicons name="wallet-outline" size={20} color="#8A072D" />
            <Text style={styles.supportedLabel}>Wallets</Text>
          </TouchableOpacity>
        </View>

        {/* 100% Secure Payments Callout */}
        <View style={styles.guaranteeBox}>
          <View style={styles.lockSquare}>
            <Ionicons name="lock-closed-outline" size={24} color="#8A072D" />
          </View>
          <View style={styles.guaranteeTextCol}>
            <Text style={styles.guaranteeTitle}>100% Secure Payments</Text>
            <Text style={styles.guaranteeSubtitle}>
              Your payment information is always encrypted and protected.
            </Text>
          </View>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* Add Payment Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {/* Type selector tabs */}
            <View style={styles.typeSelectorRow}>
              {(['upi', 'card', 'wallet'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeTab, addType === t && styles.typeTabActive]}
                  onPress={() => setAddType(t)}
                >
                  <Text style={[styles.typeTabText, addType === t && styles.typeTabTextActive]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {addType === 'upi' ? (
              <>
                <Text style={styles.inputLabel}>UPI ID / VPA</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. rahul@okaxis, 9876543210@paytm"
                  placeholderTextColor="#A08C90"
                  value={newVpa}
                  onChangeText={setNewVpa}
                />
              </>
            ) : addType === 'card' ? (
              <>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#A08C90"
                  keyboardType="numeric"
                  maxLength={19}
                  value={newCardNumber}
                  onChangeText={setNewCardNumber}
                />
                <Text style={styles.inputLabel}>Valid Thru (MM/YY)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="MM/YY"
                  placeholderTextColor="#A08C90"
                  maxLength={5}
                  value={newCardExpiry}
                  onChangeText={setNewCardExpiry}
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Registered Mobile Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#A08C90"
                  keyboardType="phone-pad"
                />
              </>
            )}

            <TouchableOpacity
              style={styles.saveBtn}
              activeOpacity={0.85}
              onPress={handleAddPayment}
            >
              <Text style={styles.saveBtnText}>Save Payment Method</Text>
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
    gap: 12,
  },

  // Security Banner
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    gap: 10,
  },
  shieldIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTextCol: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A040A',
  },
  securitySubtitle: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 1,
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  countText: {
    fontSize: 11,
    color: '#736064',
    fontWeight: '600',
  },

  // Saved List
  savedList: {
    gap: 10,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    gap: 12,
    elevation: 1,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  upiLogoBox: {
    width: 46,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8D2CB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FAFAF9',
  },
  upiLogoText: {
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#284666',
  },
  upiArrows: {
    position: 'absolute',
    right: 3,
    top: 6,
    gap: 1,
  },
  upiArrowGreen: {
    width: 4,
    height: 4,
    backgroundColor: '#16A34A',
    borderRadius: 1,
  },
  upiArrowOrange: {
    width: 4,
    height: 4,
    backgroundColor: '#EA580C',
    borderRadius: 1,
  },
  paytmLogoBox: {
    width: 46,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8D2CB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FAFAF9',
  },
  paytmTextDark: {
    fontSize: 11,
    fontWeight: '900',
    color: '#002E6E',
  },
  paytmTextBlue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00BAF2',
  },
  mastercardBox: {
    width: 46,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8D2CB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FAFAF9',
  },
  mcRedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EB001B',
    marginRight: -6,
  },
  mcYellowCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F79E1B',
    opacity: 0.9,
  },

  savedInfoCol: {
    flex: 1,
    gap: 1,
  },
  savedTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
  },
  savedSubtitleText: {
    fontSize: 10,
    color: '#736064',
  },
  savedExpiryText: {
    fontSize: 9.5,
    color: '#8E7C80',
    marginTop: 1,
  },
  defaultBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.borderRadius.round,
  },
  defaultBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  moreBtn: {
    padding: 4,
  },

  // Add Method Dotted Card
  addMethodDottedCard: {
    backgroundColor: '#FFF8F6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E5A596',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginVertical: 4,
  },
  plusIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8A072D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  addMethodTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  addMethodSubtitle: {
    fontSize: 10,
    color: '#736064',
  },

  // Supported Methods
  supportedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  supportedCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  miniUpiIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  miniUpiText: {
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#8A072D',
  },
  miniUpiDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#16A34A',
  },
  supportedLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#554246',
  },

  // Guarantee Box
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    gap: 10,
  },
  lockSquare: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeTextCol: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
  guaranteeSubtitle: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 1,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
  },
  typeTabActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  typeTabText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#736064',
  },
  typeTabTextActive: {
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
    marginTop: 8,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 11.5,
    color: '#1A040A',
  },
  saveBtn: {
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
