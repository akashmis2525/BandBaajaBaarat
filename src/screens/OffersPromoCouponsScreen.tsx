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
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OffersPromoCouponsScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat' | 'cashback';
  discountText: string;
  title: string;
  description: string;
  minBookingAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  category: 'all' | 'wedding' | 'cashback' | 'vendor' | 'first';
  isPopular?: boolean;
}

export const OffersPromoCouponsScreen: React.FC<OffersPromoCouponsScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wedding' | 'cashback' | 'vendor' | 'first'>('all');
  const [customCode, setCustomCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons: Coupon[] = [
    {
      id: 'c1',
      code: 'SHUBHVIVAH',
      discountType: 'percentage',
      discountText: '20% OFF',
      title: 'Grand Wedding Season Special',
      description: 'Get 20% instant discount up to ₹10,000 on Mandap, Decor & Catering bookings.',
      minBookingAmount: 50000,
      maxDiscount: 10000,
      expiryDate: 'Valid till 30 Nov 2026',
      category: 'wedding',
      isPopular: true,
    },
    {
      id: 'c2',
      code: 'FIRSTBAARAT',
      discountType: 'flat',
      discountText: 'FLAT ₹2,500',
      title: 'Welcome New Couple Offer',
      description: 'Flat ₹2,500 off on your first vendor booking with Band Baaja Baarat.',
      minBookingAmount: 15000,
      expiryDate: 'Valid till 31 Dec 2026',
      category: 'first',
      isPopular: true,
    },
    {
      id: 'c3',
      code: 'ROYALDHOL',
      discountType: 'flat',
      discountText: '₹1,500 OFF',
      title: 'Dhol & Brass Band Bonanza',
      description: 'Exclusive discount on Top Rated Dhol Groups & Luxury Buggi bookings.',
      minBookingAmount: 10000,
      expiryDate: 'Valid till 15 Nov 2026',
      category: 'vendor',
    },
    {
      id: 'c4',
      code: 'CASHBACK5000',
      discountType: 'cashback',
      discountText: '₹5,000 BACK',
      title: 'UPI Payment Cashback Reward',
      description: 'Get ₹5,000 wallet cashback on full advance payment via Google Pay or PhonePe.',
      minBookingAmount: 60000,
      expiryDate: 'Valid till 20 Nov 2026',
      category: 'cashback',
    },
    {
      id: 'c5',
      code: 'GLAMMAKEUP',
      discountType: 'percentage',
      discountText: '15% OFF',
      title: 'Bridal Makeup & Mehndi Combo',
      description: 'Special 15% discount when booking Bridal Makeup and Mehndi artists together.',
      minBookingAmount: 20000,
      maxDiscount: 4000,
      expiryDate: 'Valid till 25 Nov 2026',
      category: 'wedding',
    },
  ];

  const filteredCoupons =
    selectedCategory === 'all'
      ? coupons
      : coupons.filter((c) => c.category === selectedCategory);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
    }
  };

  const handleApplyCoupon = (code: string) => {
    setCopiedCode(code);
    Alert.alert(
      'Coupon Applied! 🎉',
      `Coupon code "${code}" has been applied to your celebration booking!`,
      [
        {
          text: 'Proceed to Booking',
          onPress: () => {
            if (navigation?.navigate) {
              navigation.navigate('BookingSummary', { appliedCoupon: code });
            }
          },
        },
      ]
    );
  };

  const handleApplyCustomCode = () => {
    if (!customCode.trim()) {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
      return;
    }
    handleApplyCoupon(customCode.trim().toUpperCase());
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
              Offers & <Text style={styles.screenTitleHighlight}>Coupons</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Save extra on your wedding celebration bookings
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="pricetags" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Best</Text>
            <Text style={styles.decorativeLine2}>Deals</Text>
            <Text style={styles.decorativeLine3}>Extra Savings ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Custom Coupon Input Box */}
        <View style={styles.customCodeCard}>
          <View style={styles.inputWrapper}>
            <Ionicons name="ticket-outline" size={20} color="#D81B60" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon or promo code"
              placeholderTextColor="#94A3B8"
              value={customCode}
              onChangeText={setCustomCode}
              autoCapitalize="characters"
            />
          </View>
          <TouchableOpacity
            style={[styles.applyCustomBtn, !customCode.trim() && styles.applyCustomBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleApplyCustomCode}
            disabled={!customCode.trim()}
          >
            <Text style={styles.applyCustomBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Top Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoBannerLeft}>
            <View style={styles.fireBadge}>
              <Ionicons name="flame" size={13} color="#FFFFFF" style={{ marginRight: 3 }} />
              <Text style={styles.fireBadgeText}>Wedding Season Bonanza</Text>
            </View>
            <Text style={styles.promoBannerTitle}>Save up to ₹15,000 on Grand Packages!</Text>
            <Text style={styles.promoBannerSub}>Valid across Top Verified Indore & MP Vendors</Text>
          </View>
          <View style={styles.percentCircle}>
            <Text style={styles.percentNumber}>20%</Text>
            <Text style={styles.percentOff}>OFF</Text>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'all' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'all' && styles.categoryTabTextActive]}>
              All Offers ({coupons.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'wedding' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('wedding')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'wedding' && styles.categoryTabTextActive]}>
              💍 Wedding Specials
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'first' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('first')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'first' && styles.categoryTabTextActive]}>
              🎉 First Booking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'cashback' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('cashback')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'cashback' && styles.categoryTabTextActive]}>
              💰 Cashback
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'vendor' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('vendor')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'vendor' && styles.categoryTabTextActive]}>
              🥁 Vendor Deals
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Coupons List */}
        <View style={styles.couponsList}>
          {filteredCoupons.map((coupon) => (
            <View key={coupon.id} style={styles.couponCard}>
              {coupon.isPopular && (
                <View style={styles.popularRibbon}>
                  <Text style={styles.popularRibbonText}>★ MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.couponMainRow}>
                {/* Left Discount Badge */}
                <View style={styles.discountBadgeCol}>
                  <Text style={styles.discountBadgeNumber}>{coupon.discountText}</Text>
                  <View style={styles.dashedDivider} />
                </View>

                {/* Middle Info */}
                <View style={styles.couponInfoCol}>
                  <View style={styles.codePillRow}>
                    <View style={styles.codePillBox}>
                      <Text style={styles.codePillText}>{coupon.code}</Text>
                    </View>
                    <Text style={styles.expiryText}>{coupon.expiryDate}</Text>
                  </View>

                  <Text style={styles.couponTitle}>{coupon.title}</Text>
                  <Text style={styles.couponDesc}>{coupon.description}</Text>

                  <View style={styles.minAmountRow}>
                    <Ionicons name="information-circle-outline" size={12} color="#64748B" style={{ marginRight: 3 }} />
                    <Text style={styles.minAmountText}>
                      Min. booking value: ₹{coupon.minBookingAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bottom Card Action Strip */}
              <View style={styles.couponBottomStrip}>
                <TouchableOpacity
                  style={styles.termsLinkBtn}
                  onPress={() =>
                    Alert.alert(
                      `${coupon.code} Terms`,
                      `1. Valid on selected verified vendors.\n2. Applicable on bookings above ₹${coupon.minBookingAmount.toLocaleString('en-IN')}.\n3. Cannot be clubbed with another offer.`
                    )
                  }
                >
                  <Text style={styles.termsLinkBtnText}>View T&C</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.applyBtn, copiedCode === coupon.code && styles.applyBtnActive]}
                  activeOpacity={0.85}
                  onPress={() => handleApplyCoupon(coupon.code)}
                >
                  <Text style={styles.applyBtnText}>
                    {copiedCode === coupon.code ? 'Applied ✓' : 'APPLY CODE'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
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
  tagGraphicBox: {
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

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Custom Input
  customCodeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  couponInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    paddingVertical: 6,
  },
  applyCustomBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  applyCustomBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  applyCustomBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Promo Banner
  promoBanner: {
    backgroundColor: '#8A072D',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    overflow: 'hidden',
  },
  promoBannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  fireBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  fireBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  promoBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 2,
  },
  promoBannerSub: {
    fontSize: 10.5,
    color: '#FFE4E8',
  },
  percentCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  percentNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
    lineHeight: 15,
  },
  percentOff: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 10,
  },

  // Category Tabs
  categoriesScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  categoryTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryTabActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E5093A',
  },
  categoryTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTabTextActive: {
    color: '#E5093A',
    fontWeight: '700',
  },

  // Coupons List
  couponsList: {
    gap: 12,
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  popularRibbon: {
    backgroundColor: '#F59E0B',
    paddingVertical: 3,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 8,
  },
  popularRibbonText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  couponMainRow: {
    flexDirection: 'row',
    padding: 12,
  },
  discountBadgeCol: {
    width: 72,
    backgroundColor: '#FFF1F2',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    marginRight: 10,
  },
  discountBadgeNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#E5093A',
    textAlign: 'center',
  },
  dashedDivider: {
    height: 1,
    width: '80%',
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: '#FECDD3',
    marginTop: 4,
  },
  couponInfoCol: {
    flex: 1,
  },
  codePillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  codePillBox: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  expiryText: {
    fontSize: 9.5,
    color: '#64748B',
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  couponDesc: {
    fontSize: 10.5,
    color: '#556987',
    lineHeight: 14,
    marginBottom: 6,
  },
  minAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minAmountText: {
    fontSize: 9.5,
    color: '#64748B',
  },
  couponBottomStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  termsLinkBtn: {
    paddingVertical: 2,
  },
  termsLinkBtnText: {
    fontSize: 11,
    color: '#64748B',
    textDecorationLine: 'underline',
  },
  applyBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  applyBtnActive: {
    backgroundColor: '#16A34A',
  },
  applyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
