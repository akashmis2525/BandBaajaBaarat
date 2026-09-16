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
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={[
          styles.headerRow,
          {
            paddingTop:
              Platform.OS === 'android'
                ? (StatusBar.currentHeight || 24) + 10
                : insets.top > 0
                ? insets.top + 6
                : 16,
          },
        ]}
      >
        <View style={styles.titleColumn}>
          <Text style={styles.brandTitle}>
            Band Baaja <Text style={styles.brandTitleHighlight}>Baarat</Text>
          </Text>
          <Text style={styles.brandSubtitle}>
            India's Premier Wedding Planning & Vendor Marketplace
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="sparkles" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Choose</Text>
            <Text style={styles.decorativeLine2}>Account</Text>
            <Text style={styles.decorativeLine3}>Your Role ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeHeading}>How would you like to use the app?</Text>
          <Text style={styles.welcomeSubtext}>
            Select your account type to get a personalized wedding experience
          </Text>
        </View>

        {/* Option 1: Customer / Bride & Groom */}
        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.88}
          onPress={onSelectCustomer}
        >
          <View style={styles.cardRibbonCustomer}>
            <Text style={styles.ribbonCustomerText}>FOR BRIDE, GROOM & FAMILIES</Text>
          </View>

          <View style={styles.roleCardContent}>
            <View style={styles.roleIconCircleCustomer}>
              <Text style={{ fontSize: 32 }}>💍</Text>
            </View>

            <View style={styles.roleInfoCol}>
              <Text style={styles.roleTitle}>Plan My Dream Wedding</Text>
              <Text style={styles.roleDesc}>
                Explore 500+ verified wedding vendors in Indore & MP. Book Mandap decor, catering, dhol, photography & get instant discounts.
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#D81B60" style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>Compare prices & negotiate live quotes</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#D81B60" style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>Secure token advance & escrow payments</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#D81B60" style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>Free Wedding Planner budget toolkit</Text>
                </View>
              </View>

              <View style={styles.cardActionRow}>
                <View style={styles.continueBtnCustomer}>
                  <Text style={styles.continueBtnCustomerText}>Continue as Customer</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 2: Vendor Partner / Business */}
        <TouchableOpacity
          style={[styles.roleCard, styles.roleCardVendor]}
          activeOpacity={0.88}
          onPress={onSelectVendor}
        >
          <View style={styles.cardRibbonVendor}>
            <Text style={styles.ribbonVendorText}>★ FOR VENDORS & BUSINESSES</Text>
          </View>

          <View style={styles.roleCardContent}>
            <View style={styles.roleIconCircleVendor}>
              <Text style={{ fontSize: 32 }}>🏢</Text>
            </View>

            <View style={styles.roleInfoCol}>
              <Text style={styles.roleTitle}>Grow My Wedding Business</Text>
              <Text style={styles.roleDesc}>
                Receive genuine wedding inquiries, send itemized quotations, manage calendar bookings & get guaranteed direct bank payouts.
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>Verified Leads stream with customer budget</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>Itemized Quotation & Contract Generator</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.featureText}>Instant Advance Payouts to your Bank Account</Text>
                </View>
              </View>

              <View style={styles.cardActionRow}>
                <View style={styles.continueBtnVendor}>
                  <Text style={styles.continueBtnVendorText}>Enter Partner Portal</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Trust Badges Footer */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={16} color="#D81B60" />
            <Text style={styles.trustText}>100% Verified Vendors</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={16} color="#D81B60" />
            <Text style={styles.trustText}>Safe & Secure Escrow</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.trustText}>4.9/5 Rating</Text>
          </View>
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  titleColumn: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: -0.4,
  },
  brandTitleHighlight: {
    color: '#D81B60',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  welcomeBanner: {
    marginBottom: 16,
  },
  welcomeHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
  },

  // Role Cards
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFE4E8',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  roleCardVendor: {
    borderColor: '#FDE68A',
  },
  cardRibbonCustomer: {
    backgroundColor: '#FFF1F2',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E8',
  },
  ribbonCustomerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D81B60',
    letterSpacing: 0.5,
  },
  cardRibbonVendor: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  ribbonVendorText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  roleCardContent: {
    padding: 16,
  },
  roleIconCircleCustomer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  roleIconCircleVendor: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  roleInfoCol: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 12,
  },
  featuresList: {
    gap: 6,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  cardActionRow: {
    marginTop: 4,
  },
  continueBtnCustomer: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  continueBtnCustomerText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  continueBtnVendor: {
    backgroundColor: '#8A072D',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  continueBtnVendorText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Trust Badges
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
    marginLeft: 4,
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
  },
});
