import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { api, ApiPaymentMethod } from '../services/api';

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  brand: 'mastercard' | 'visa' | 'gpay' | 'paytm';
  title: string;
  subtitle: string;
  expiry?: string;
  isDefault: boolean;
}

const initialPaymentMethods: SavedPaymentMethod[] = [
  {
    id: 'pay-1',
    type: 'card',
    brand: 'mastercard',
    title: 'HDFC Bank',
    subtitle: '**** **** **** 4521',
    expiry: 'Valid till 09/27',
    isDefault: true,
  },
  {
    id: 'pay-2',
    type: 'card',
    brand: 'visa',
    title: 'ICICI Bank',
    subtitle: '**** **** **** 7810',
    expiry: 'Valid till 11/26',
    isDefault: false,
  },
  {
    id: 'pay-3',
    type: 'upi',
    brand: 'gpay',
    title: 'Google Pay',
    subtitle: 'aakashmishra@okaxis',
    isDefault: false,
  },
  {
    id: 'pay-4',
    type: 'wallet',
    brand: 'paytm',
    title: 'Paytm',
    subtitle: '97133 32997',
    isDefault: false,
  },
];

export const SavedPaymentMethodsScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);

  React.useEffect(() => {
    api
      .paymentMethods()
      .then((res) => {
        setPaymentMethods(
          res.items.map((p: ApiPaymentMethod) => ({
            id: p._id,
            type: p.type === 'netbanking' ? 'wallet' : p.type,
            brand: p.brand,
            title: p.title,
            subtitle: p.subtitle,
            expiry: p.expiry,
            isDefault: p.isDefault,
          })),
        );
      })
      .catch(() => undefined);
  }, []);
  const [activeMenuMethod, setActiveMenuMethod] = useState<SavedPaymentMethod | null>(null);

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
    setActiveMenuMethod(null);
    setPaymentMethods((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }))
    );
    Alert.alert('Success', 'Default payment method updated.');
  };

  const handleDelete = (id: string) => {
    setActiveMenuMethod(null);
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const handleAddNew = (type: 'card' | 'upi' | 'wallet' | 'netbanking') => {
    if (navigation?.navigate) {
      navigation.navigate('AddPaymentMethod', { initialTab: type });
    }
  };

  const renderBrandLogo = (brand: SavedPaymentMethod['brand']) => {
    switch (brand) {
      case 'mastercard':
        return (
          <View style={styles.brandLogoBox}>
            <View style={styles.mastercardWrap}>
              <View style={[styles.mcCircle, { backgroundColor: '#EB001B', zIndex: 1 }]} />
              <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', marginLeft: -10 }]} />
            </View>
          </View>
        );
      case 'visa':
        return (
          <View style={styles.brandLogoBox}>
            <Text style={styles.visaText}>VISA</Text>
          </View>
        );
      case 'gpay':
        return (
          <View style={styles.brandLogoBox}>
            <View style={styles.upiLogoBox}>
              <Text style={styles.upiText}>UPI</Text>
              <View style={styles.upiStripe} />
            </View>
          </View>
        );
      case 'paytm':
      default:
        return (
          <View style={styles.brandLogoBox}>
            <Text style={styles.paytmText}>pay<Text style={{ color: '#00BAF2' }}>tm</Text></Text>
          </View>
        );
    }
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
              Payment <Text style={styles.screenTitleHighlight}>Methods</Text>
            </Text>
            <Text style={styles.screenSubtitle}>Manage your cards, UPI and wallets</Text>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Saved Payment Methods */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          <Text style={styles.sectionSubtitle}>Your saved cards and payment options</Text>
        </View>

        <View style={styles.savedMethodsList}>
          {paymentMethods.map((item) => {
            const isDefault = item.isDefault;
            return (
              <View
                key={item.id}
                style={[
                  styles.paymentCard,
                  isDefault && styles.paymentCardDefault,
                ]}
              >
                {/* Brand Logo Box */}
                {renderBrandLogo(item.brand)}

                {/* Details */}
                <View style={styles.paymentDetailsCol}>
                  <View style={styles.paymentTitleRow}>
                    <Text style={styles.paymentTitle}>{item.title}</Text>
                    {isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.paymentSubtitle}>{item.subtitle}</Text>
                  {item.expiry ? (
                    <Text style={styles.paymentExpiryText}>{item.expiry}</Text>
                  ) : null}
                </View>

                {/* Right side: Checkmark for default or 3 dots for others */}
                {isDefault ? (
                  <View style={styles.defaultCheckmarkCircle}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.dotsButton}
                    activeOpacity={0.6}
                    onPress={() => setActiveMenuMethod(item)}
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Section 2: Add New Payment Method */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Add New Payment Method</Text>
          <Text style={styles.sectionSubtitle}>Choose a payment option to add</Text>
        </View>

        <View style={styles.addGridRow}>
          {/* Card */}
          <TouchableOpacity
            style={styles.addGridTile}
            activeOpacity={0.7}
            onPress={() => handleAddNew('card')}
          >
            <View style={styles.addTileIconCircle}>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color="#D81B60" />
            </View>
            <Text style={styles.addTileTitle}>Credit / Debit{'\n'}Card</Text>
          </TouchableOpacity>

          {/* UPI */}
          <TouchableOpacity
            style={styles.addGridTile}
            activeOpacity={0.7}
            onPress={() => handleAddNew('upi')}
          >
            <View style={styles.addTileIconCircle}>
              <View style={styles.miniUpiLogo}>
                <Text style={styles.miniUpiText}>UPI</Text>
                <View style={styles.miniUpiStripe} />
              </View>
            </View>
            <Text style={styles.addTileTitle}>UPI</Text>
            <Text style={styles.addTileSubtitle}>Google Pay, PhonePe,{'\n'}Paytm, etc.</Text>
          </TouchableOpacity>

          {/* Wallet */}
          <TouchableOpacity
            style={styles.addGridTile}
            activeOpacity={0.7}
            onPress={() => handleAddNew('wallet')}
          >
            <View style={styles.addTileIconCircle}>
              <Ionicons name="wallet-outline" size={24} color="#D81B60" />
            </View>
            <Text style={styles.addTileTitle}>Wallet</Text>
            <Text style={styles.addTileSubtitle}>Add wallet account</Text>
          </TouchableOpacity>

          {/* Net Banking */}
          <TouchableOpacity
            style={styles.addGridTile}
            activeOpacity={0.7}
            onPress={() => handleAddNew('netbanking')}
          >
            <View style={styles.addTileIconCircle}>
              <FontAwesome5 name="university" size={20} color="#D81B60" />
            </View>
            <Text style={styles.addTileTitle}>Net Banking</Text>
            <Text style={styles.addTileSubtitle}>All major banks</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Safe Payments Security Banner */}
        <View style={styles.securityBannerCard}>
          <View style={styles.shieldIconBadge}>
            <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.securityTextCol}>
            <Text style={styles.securityBannerTitle}>Your Payments are Safe with Us</Text>
            <Text style={styles.securityBannerSubtitle}>
              We use industry-standard encryption to keep your information secure.
            </Text>
          </View>
          <View style={styles.securityIllustrationWrap}>
            <View style={styles.securityShieldGraphic}>
              <Ionicons name="shield-checkmark-outline" size={32} color="#F472B6" />
              <View style={styles.securityLockBadge}>
                <Ionicons name="lock-closed" size={10} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: Payment Settings */}
        <View style={[styles.sectionHeader, { marginTop: 22 }]}>
          <Text style={styles.sectionTitle}>Payment Settings</Text>
        </View>

        <TouchableOpacity
          style={styles.settingsRowCard}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(
              'Default Payment Method',
              'Select any of your saved cards or UPI accounts to be used automatically during bookings.'
            );
          }}
        >
          <View style={styles.settingsIconCircle}>
            <Ionicons name="settings-outline" size={22} color="#4A5568" />
          </View>
          <View style={styles.settingsTextCol}>
            <Text style={styles.settingsRowTitle}>Set as Default Payment Method</Text>
            <Text style={styles.settingsRowSubtitle}>
              Choose your preferred payment option
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#718096" />
        </TouchableOpacity>
      </ScrollView>

      {/* Action Menu Modal */}
      <Modal
        visible={!!activeMenuMethod}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveMenuMethod(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveMenuMethod(null)}
        >
          <View style={styles.actionSheetContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.actionSheetTitle}>
              {activeMenuMethod?.title} ({activeMenuMethod?.subtitle})
            </Text>

            <TouchableOpacity
              style={styles.actionSheetRow}
              onPress={() => activeMenuMethod && handleSetDefault(activeMenuMethod.id)}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
              <Text style={styles.actionSheetText}>Set as Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionSheetRow, { borderBottomWidth: 0 }]}
              onPress={() => activeMenuMethod && handleDelete(activeMenuMethod.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionSheetText, { color: '#EF4444' }]}>
                Remove Payment Method
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  savedMethodsList: {
    gap: 10,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  paymentCardDefault: {
    borderColor: '#F87171',
    borderWidth: 1.2,
  },
  brandLogoBox: {
    width: 48,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mastercardWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    opacity: 0.9,
  },
  visaText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A1F71',
    fontStyle: 'italic',
  },
  upiLogoBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    fontStyle: 'italic',
  },
  upiStripe: {
    width: 20,
    height: 2,
    backgroundColor: '#16A34A',
    marginTop: 1,
  },
  paytmText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#002E6E',
  },
  paymentDetailsCol: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#FDECEF',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: '#D81B60',
    fontWeight: '600',
  },
  paymentSubtitle: {
    fontSize: 13,
    color: '#334155',
    marginTop: 2,
    fontWeight: '500',
  },
  paymentExpiryText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  defaultCheckmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  dotsButton: {
    padding: 6,
    marginRight: -2,
  },
  addGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  addGridTile: {
    flex: 1,
    backgroundColor: '#FAFCFE',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 102,
  },
  addTileIconCircle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  miniUpiLogo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniUpiText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    fontStyle: 'italic',
  },
  miniUpiStripe: {
    width: 22,
    height: 2.5,
    backgroundColor: '#16A34A',
    marginTop: 1,
  },
  addTileTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1B1F',
    textAlign: 'center',
    lineHeight: 14,
  },
  addTileSubtitle: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 11,
  },
  securityBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 12,
    marginTop: 20,
  },
  shieldIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  securityTextCol: {
    flex: 1,
  },
  securityBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 2,
  },
  securityBannerSubtitle: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  securityIllustrationWrap: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityShieldGraphic: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityLockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  settingsIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsTextCol: {
    flex: 1,
  },
  settingsRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  settingsRowSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  actionSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 16,
  },
  actionSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionSheetText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
    marginLeft: 12,
  },
});
