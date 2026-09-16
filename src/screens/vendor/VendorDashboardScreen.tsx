import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VendorDashboardProps {
  navigation?: any;
  onNavigate?: (screen: string, params?: any) => void;
  onSwitchToCustomer?: () => void;
}

export const VendorDashboardScreen: React.FC<VendorDashboardProps> = ({
  navigation,
  onNavigate,
  onSwitchToCustomer,
}) => {
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);

  const navigateTo = (screenName: string, params?: any) => {
    if (onNavigate) {
      onNavigate(screenName, params);
    } else if (navigation?.navigate) {
      navigation.navigate(screenName, params);
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
          <View style={styles.vendorAvatarBox}>
            <Text style={{ fontSize: 20 }}>👑</Text>
          </View>
          <View style={styles.vendorTitleCol}>
            <View style={styles.vendorNameRow}>
              <Text style={styles.vendorNameText} numberOfLines={1}>
                Royal Events & Decor
              </Text>
              <View style={styles.verifiedIconBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#15803D" />
              </View>
            </View>
            <Text style={styles.vendorSubtitleText}>
              Mandap & Decor Partner • Indore, MP
            </Text>
          </View>
        </View>

        {/* Online / Offline Toggle */}
        <TouchableOpacity
          style={[styles.statusToggleBtn, isOnline ? styles.statusOnline : styles.statusOffline]}
          activeOpacity={0.8}
          onPress={() => {
            setIsOnline(!isOnline);
            Alert.alert(
              isOnline ? 'Switched to Offline' : 'Switched to Online',
              isOnline
                ? 'You are now offline. You will not receive instant inquiry alerts.'
                : 'You are now online and available to receive instant wedding leads!'
            );
          }}
        >
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#22C55E' : '#94A3B8' }]} />
          <Text style={styles.statusToggleText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Revenue & Metrics Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueTopRow}>
            <View>
              <Text style={styles.revenueSubTitle}>Available Wallet Balance</Text>
              <Text style={styles.revenueMainAmount}>₹ 71,250</Text>
            </View>
            <TouchableOpacity
              style={styles.withdrawBtn}
              activeOpacity={0.85}
              onPress={() => navigateTo('VendorWalletPayout')}
            >
              <Ionicons name="wallet-outline" size={14} color="#8A072D" style={{ marginRight: 4 }} />
              <Text style={styles.withdrawBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.revenueDivider} />

          <View style={styles.metricsTripleRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>₹ 2.45L</Text>
              <Text style={styles.metricLabel}>Total Earned</Text>
            </View>
            <View style={styles.metricColDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>₹ 65,000</Text>
              <Text style={styles.metricLabel}>This Month</Text>
            </View>
            <View style={styles.metricColDivider} />
            <View style={styles.metricCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={13} color="#F59E0B" style={{ marginRight: 2 }} />
                <Text style={styles.metricVal}>4.8</Text>
              </View>
              <Text style={styles.metricLabel}>320 Reviews</Text>
            </View>
          </View>
        </View>

        {/* 4 Quick Stat Tiles */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statTile}
            activeOpacity={0.8}
            onPress={() => navigateTo('VendorLeads')}
          >
            <View style={[styles.statTileIcon, { backgroundColor: '#FFF1F2' }]}>
              <Ionicons name="flash" size={18} color="#D81B60" />
            </View>
            <Text style={styles.statTileNumber}>7</Text>
            <Text style={styles.statTileLabel}>New Leads</Text>
            <View style={styles.statTileAction}>
              <Text style={styles.statTileActionText}>View Leads →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statTile}
            activeOpacity={0.8}
            onPress={() => navigateTo('VendorMeetingManager')}
          >
            <View style={[styles.statTileIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="people" size={18} color="#D97706" />
            </View>
            <Text style={styles.statTileNumber}>2</Text>
            <Text style={styles.statTileLabel}>Meetings</Text>
            <View style={styles.statTileAction}>
              <Text style={styles.statTileActionText}>Schedule →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statTile}
            activeOpacity={0.8}
            onPress={() => navigateTo('VendorBookings')}
          >
            <View style={[styles.statTileIcon, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="calendar" size={18} color="#16A34A" />
            </View>
            <Text style={styles.statTileNumber}>4</Text>
            <Text style={styles.statTileLabel}>Active Orders</Text>
            <View style={styles.statTileAction}>
              <Text style={styles.statTileActionText}>Track →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statTile}
            activeOpacity={0.8}
            onPress={() => navigateTo('VendorCalendar')}
          >
            <View style={[styles.statTileIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="today" size={18} color="#2563EB" />
            </View>
            <Text style={styles.statTileNumber}>18</Text>
            <Text style={styles.statTileLabel}>Open Dates</Text>
            <View style={styles.statTileAction}>
              <Text style={styles.statTileActionText}>Calendar →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Wedding Event Highlight */}
        <View style={styles.upcomingEventCard}>
          <View style={styles.upcomingTopRow}>
            <View style={styles.eventBadge}>
              <Ionicons name="sparkles" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.eventBadgeText}>NEXT WEDDING EVENT</Text>
            </View>
            <Text style={styles.countdownPill}>In 70 Days</Text>
          </View>

          <Text style={styles.eventName}>Priya & Rahul's Grand Wedding</Text>
          <Text style={styles.eventDetails}>
            Mandap, Stage Decoration, Entrance Flowers & Lighting Setup
          </Text>

          <View style={styles.eventMetaRow}>
            <View style={styles.eventMetaItem}>
              <Ionicons name="calendar-outline" size={14} color="#D81B60" />
              <Text style={styles.eventMetaText}>25 Nov 2026</Text>
            </View>
            <View style={styles.eventMetaItem}>
              <Ionicons name="location-outline" size={14} color="#D81B60" />
              <Text style={styles.eventMetaText}>Royal Greens, Indore</Text>
            </View>
            <View style={styles.eventMetaItem}>
              <Ionicons name="cash-outline" size={14} color="#16A34A" />
              <Text style={styles.eventMetaText}>₹ 75,000</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.eventActionBtn}
            activeOpacity={0.85}
            onPress={() => navigateTo('VendorOrderExecution')}
          >
            <Text style={styles.eventActionBtnText}>Manage Event Execution & Status</Text>
            <Ionicons name="arrow-forward" size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Quick Tools & Management */}
        <Text style={styles.sectionHeaderTitle}>Business Management Tools</Text>
        <View style={styles.toolsList}>
          <TouchableOpacity
            style={styles.toolItem}
            activeOpacity={0.7}
            onPress={() => navigateTo('VendorCreateQuotation')}
          >
            <View style={[styles.toolIconBox, { backgroundColor: '#FFF1F2' }]}>
              <Ionicons name="document-text-outline" size={20} color="#8A072D" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Quotation Generator</Text>
              <Text style={styles.toolSub}>Create & send custom wedding packages to leads</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolItem}
            activeOpacity={0.7}
            onPress={() => navigateTo('VendorPortfolioManager')}
          >
            <View style={[styles.toolIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="images-outline" size={20} color="#D97706" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Portfolio & Gallery Uploader</Text>
              <Text style={styles.toolSub}>Manage past decor photos, packages & prices</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolItem}
            activeOpacity={0.7}
            onPress={() => navigateTo('VendorCalendar')}
          >
            <View style={[styles.toolIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="calendar-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Availability Calendar</Text>
              <Text style={styles.toolSub}>Block booked dates & prevent double-booking</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolItem}
            activeOpacity={0.7}
            onPress={() => navigateTo('VendorWalletPayout')}
          >
            <View style={[styles.toolIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="card-outline" size={20} color="#16A34A" />
            </View>
            <View style={styles.toolTextCol}>
              <Text style={styles.toolTitle}>Wallet & Bank Settlements</Text>
              <Text style={styles.toolSub}>Direct transfers to HDFC Bank **** 7812</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Switch to Customer Option */}
        {onSwitchToCustomer && (
          <TouchableOpacity
            style={styles.switchModeCard}
            activeOpacity={0.8}
            onPress={onSwitchToCustomer}
          >
            <Ionicons name="swap-horizontal" size={18} color="#8A072D" style={{ marginRight: 8 }} />
            <Text style={styles.switchModeText}>
              Switch to <Text style={{ fontWeight: '800' }}>Customer Mode</Text> 💍
            </Text>
          </TouchableOpacity>
        )}

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
    borderBottomColor: '#F1F5F9',
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vendorAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  vendorTitleCol: {
    flex: 1,
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 4,
  },
  verifiedIconBadge: {
    marginTop: 1,
  },
  vendorSubtitleText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusOnline: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  statusOffline: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  statusToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },

  // Revenue Card
  revenueCard: {
    backgroundColor: '#8A072D',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  revenueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueSubTitle: {
    fontSize: 11.5,
    color: '#FFE4E8',
    fontWeight: '600',
  },
  revenueMainAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  withdrawBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  withdrawBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
  revenueDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 12,
  },
  metricsTripleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricColDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 10.5,
    color: '#FFE4E8',
    marginTop: 2,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  statTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statTileIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statTileNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  statTileLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  statTileAction: {
    marginTop: 6,
  },
  statTileActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Upcoming Event Card
  upcomingEventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFE4E8',
    padding: 14,
    marginBottom: 16,
  },
  upcomingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A072D',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  eventBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  countdownPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D81B60',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  eventName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  eventDetails: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  eventMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventMetaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  eventActionBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  eventActionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Tools List
  sectionHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  toolsList: {
    gap: 8,
    marginBottom: 14,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toolIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  toolTextCol: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  toolSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  switchModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E8',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 6,
  },
  switchModeText: {
    fontSize: 13,
    color: '#8A072D',
    fontWeight: '600',
  },
});
