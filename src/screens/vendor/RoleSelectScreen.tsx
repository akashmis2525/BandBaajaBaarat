import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../../constants/assets';

interface RoleSelectScreenProps {
  onSelectCustomer: () => void;
  onSelectVendor: () => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  onSelectCustomer,
  onSelectVendor,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#8A072D" />

      {/* Top Royal Brand Splash Header */}
      <View
        style={[
          styles.heroHeader,
          {
            paddingTop:
              Platform.OS === 'android'
                ? (StatusBar.currentHeight || 24) + 12
                : insets.top > 0
                ? insets.top + 8
                : 20,
          },
        ]}
      >
        <View style={styles.topBadgeRow}>
          <View style={styles.goldPill}>
            <Ionicons name="sparkles" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
            <Text style={styles.goldPillText}>INDIA'S #1 WEDDING APP</Text>
          </View>
        </View>

        <Text style={styles.brandTitle}>
          Band Baaja <Text style={styles.brandHighlight}>Baarat</Text>
        </Text>
        <Text style={styles.brandTagline}>
          Shubh Vivah Se Shandar Reception Tak ♡
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeading}>Choose Your Experience</Text>

        {/* Option 1: Customer / Bride & Groom */}
        <TouchableOpacity
          style={styles.choiceCardCustomer}
          activeOpacity={0.88}
          onPress={onSelectCustomer}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircleCustomer}>
              <Text style={{ fontSize: 26 }}>💍</Text>
            </View>
            <View style={styles.cardBadgeCustomer}>
              <Text style={styles.cardBadgeCustomerText}>FOR FAMILIES</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>I'm Planning a Wedding</Text>
          <Text style={styles.cardSub}>
            Book Mandap, Catering, Dhol, Makeup & Venues in Indore & MP
          </Text>

          <View style={styles.actionBtnCustomer}>
            <Text style={styles.actionBtnText}>Continue as Customer</Text>
            <Ionicons name="arrow-forward" size={17} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </View>
        </TouchableOpacity>

        {/* Option 2: Vendor Partner / Business */}
        <TouchableOpacity
          style={styles.choiceCardVendor}
          activeOpacity={0.88}
          onPress={onSelectVendor}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircleVendor}>
              <Text style={{ fontSize: 26 }}>🏢</Text>
            </View>
            <View style={styles.cardBadgeVendor}>
              <Text style={styles.cardBadgeVendorText}>FOR VENDORS</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>I'm a Wedding Vendor</Text>
          <Text style={styles.cardSub}>
            Get verified leads, send quotations & direct bank payouts
          </Text>

          <View style={styles.actionBtnVendor}>
            <Text style={styles.actionBtnText}>Enter Partner Portal</Text>
            <Ionicons name="arrow-forward" size={17} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </View>
        </TouchableOpacity>

        {/* Trust Badges Strip */}
        <View style={styles.trustStrip}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={16} color="#8A072D" />
            <Text style={styles.trustText}>100% Verified</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={16} color="#8A072D" />
            <Text style={styles.trustText}>Secure Escrow</Text>
          </View>
          <View style={styles.trustDot} />
          <View style={styles.trustItem}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.trustText}>4.9/5 Rating</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8A072D',
  },

  // Splash Hero Header
  heroHeader: {
    backgroundColor: '#8A072D',
    paddingHorizontal: 20,
    paddingBottom: 22,
    alignItems: 'center',
  },
  topBadgeRow: {
    marginBottom: 8,
  },
  goldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  goldPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FED7AA',
    letterSpacing: 0.8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: '#FBBF24',
  },
  brandTagline: {
    fontSize: 12,
    color: '#FFE4E8',
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.2,
  },

  // Content Area
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  // Choice Cards
  choiceCardCustomer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  choiceCardVendor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircleCustomer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  iconCircleVendor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  cardBadgeCustomer: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardBadgeCustomerText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D81B60',
    letterSpacing: 0.5,
  },
  cardBadgeVendor: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardBadgeVendorText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 14,
  },
  actionBtnCustomer: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionBtnVendor: {
    backgroundColor: '#8A072D',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Trust Strip
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
});
