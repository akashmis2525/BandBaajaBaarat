import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VendorBookingsProps {
  navigation?: any;
  onBack?: () => void;
}

interface VendorBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  phone: string;
  eventTitle: string;
  eventDate: string;
  venueAddress: string;
  totalAmount: number;
  advanceReceived: number;
  balanceDue: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
}

export const VendorBookingsScreen: React.FC<VendorBookingsProps> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'in_progress' | 'completed'>('all');

  const [bookings, setBookings] = useState<VendorBooking[]>([
    {
      id: 'B1',
      bookingCode: 'BBBD126789',
      customerName: 'Rahul Verma & Priya Jain',
      phone: '+91 98930 11223',
      eventTitle: 'Wedding Ceremony Mandap & Stage Setup',
      eventDate: '25 Nov 2026 (Wednesday)',
      venueAddress: 'Royal Greens, Indore, Madhya Pradesh',
      totalAmount: 75000,
      advanceReceived: 25000,
      balanceDue: 50000,
      status: 'upcoming',
    },
    {
      id: 'B2',
      bookingCode: 'BBBD126750',
      customerName: 'Ananya & Siddharth',
      phone: '+91 94250 11998',
      eventTitle: 'Sangeet Stage & DJ Truss Lighting Setup',
      eventDate: '12 Nov 2026 (Thursday)',
      venueAddress: 'Brilliant Convention Centre, Indore',
      totalAmount: 45000,
      advanceReceived: 15000,
      balanceDue: 30000,
      status: 'in_progress',
    },
    {
      id: 'B3',
      bookingCode: 'BBBD126500',
      customerName: 'Kapoor Family',
      phone: '+91 97550 44332',
      eventTitle: 'Reception Entrance & Carved Mandap',
      eventDate: '28 Oct 2026',
      venueAddress: 'Sayaji Hotel, Indore',
      totalAmount: 85000,
      advanceReceived: 85000,
      balanceDue: 0,
      status: 'completed',
    },
  ]);

  const filteredBookings =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboard');
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
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Active <Text style={styles.screenTitleHighlight}>Bookings ({bookings.length})</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Track confirmed wedding contracts & fulfillment
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="calendar" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Orders</Text>
            <Text style={styles.decorativeLine2}>Tracker</Text>
            <Text style={styles.decorativeLine3}>Fulfillment ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              All ({bookings.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'upcoming' && styles.tabBtnTextActive]}>
              Upcoming (1)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'in_progress' && styles.tabBtnActive]}
            onPress={() => setActiveTab('in_progress')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'in_progress' && styles.tabBtnTextActive]}>
              In-Progress (1)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'completed' && styles.tabBtnTextActive]}>
              Done (1)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <View style={styles.bookingsList}>
          {filteredBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeaderRow}>
                <View style={styles.codePill}>
                  <Text style={styles.codePillText}>{booking.bookingCode}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    booking.status === 'upcoming'
                      ? styles.statusUpcoming
                      : booking.status === 'in_progress'
                      ? styles.statusInProgress
                      : styles.statusCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      booking.status === 'upcoming'
                        ? styles.statusUpcomingText
                        : booking.status === 'in_progress'
                        ? styles.statusInProgressText
                        : styles.statusCompletedText,
                    ]}
                  >
                    {booking.status === 'upcoming'
                      ? 'UPCOMING EVENT'
                      : booking.status === 'in_progress'
                      ? '⚡ SETUP IN PROGRESS'
                      : '✓ COMPLETED'}
                  </Text>
                </View>
              </View>

              <Text style={styles.customerNameTitle}>{booking.customerName}</Text>
              <Text style={styles.eventTitleDesc}>{booking.eventTitle}</Text>

              <View style={styles.detailsBox}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{booking.eventDate}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.detailLabel}>Venue:</Text>
                  <Text style={styles.detailValue}>{booking.venueAddress}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={14} color="#16A34A" style={{ marginRight: 6 }} />
                  <Text style={styles.detailLabel}>Advance Paid:</Text>
                  <Text style={[styles.detailValue, { color: '#16A34A', fontWeight: '800' }]}>
                    ₹ {booking.advanceReceived.toLocaleString('en-IN')} (Token Confirmed)
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color="#D97706" style={{ marginRight: 6 }} />
                  <Text style={styles.detailLabel}>Balance Due:</Text>
                  <Text style={[styles.detailValue, { color: '#D97706', fontWeight: '800' }]}>
                    ₹ {booking.balanceDue.toLocaleString('en-IN')} (On Event Completion)
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.manageExecutionBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (navigation?.navigate) {
                    navigation.navigate('VendorOrderExecution', {
                      bookingId: booking.bookingCode,
                      customerName: booking.customerName,
                      eventTitle: booking.eventTitle,
                      eventDate: booking.eventDate,
                      totalAmount: booking.totalAmount,
                      advanceReceived: booking.advanceReceived,
                      balanceDue: booking.balanceDue,
                    });
                  }
                }}
              >
                <Text style={styles.manageExecutionBtnText}>Manage Live Event Execution →</Text>
              </TouchableOpacity>
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
    color: '#8A072D',
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: '#556987',
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
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine2: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine3: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#8A072D',
    lineHeight: 10,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#8A072D',
  },
  tabBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#8A072D',
    fontWeight: '700',
  },

  bookingsList: {
    gap: 14,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  bookingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  codePillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  statusUpcoming: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  statusUpcomingText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  statusInProgress: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusInProgressText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
  },
  statusCompleted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusCompletedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
  },

  customerNameTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  eventTitleDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 10,
  },

  detailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    width: 90,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },

  manageExecutionBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  manageExecutionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
