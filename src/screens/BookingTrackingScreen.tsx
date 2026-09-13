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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';

export interface TrackingBookingItem {
  id: string;
  bookingId: string;
  badge: 'Upcoming' | 'Completed' | 'Cancelled';
  vendorName: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  priceNum: number;
  priceSubtitle?: string;
  image: any;
  phone: string;
  hasStepper?: boolean;
}

export const BookingTrackingScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');

  const bookings: TrackingBookingItem[] = [
    {
      id: '1',
      bookingId: '#BB20261220',
      badge: 'Upcoming',
      vendorName: 'The Grand Palace',
      category: 'Banquet Hall, Indore',
      date: '20 Dec 2026',
      time: '7:00 PM - 11:00 PM',
      location: '123, AB Road, Vijay Nagar, Indore',
      price: '₹75,000',
      priceNum: 75000,
      priceSubtitle: '(Per Event)',
      image: Assets.serviceDecorators,
      phone: '+91 98265 99887',
      hasStepper: true,
    },
    {
      id: '2',
      bookingId: '#BB20261115',
      badge: 'Completed',
      vendorName: 'Royal Beats Dhol Group',
      category: 'Dhol & Music, Indore',
      date: '15 Nov 2026',
      time: '6:00 PM - 9:00 PM',
      location: 'Indore, Madhya Pradesh',
      price: '₹5,999',
      priceNum: 5999,
      image: Assets.weddingMandapArt,
      phone: '+91 98260 12345',
      hasStepper: false,
    },
    {
      id: '3',
      bookingId: '#BB20261005',
      badge: 'Cancelled',
      vendorName: 'Shivam Car Rentals',
      category: 'Wedding Car, Indore',
      date: '05 Oct 2026',
      time: '10:00 AM - 6:00 PM',
      location: 'Indore, Madhya Pradesh',
      price: '₹8,000',
      priceNum: 8000,
      image: Assets.serviceBuggi,
      phone: '+91 98261 44556',
      hasStepper: false,
    },
    {
      id: '4',
      bookingId: '#BB20260114',
      badge: 'Upcoming',
      vendorName: 'Glam Look Makeup Studio',
      category: 'Bridal Makeup, Indore',
      date: '14 Jan 2026',
      time: '9:00 AM - 1:00 PM',
      location: 'Indore, Madhya Pradesh',
      price: '₹12,000',
      priceNum: 12000,
      image: Assets.serviceMehndi,
      phone: '+91 94250 11223',
      hasStepper: false,
    },
  ];

  const filterTabs = [
    { key: 'All', label: 'All (4)' },
    { key: 'Upcoming', label: 'Upcoming (2)' },
    { key: 'Completed', label: 'Completed (1)' },
    { key: 'Cancelled', label: 'Cancelled (1)' },
  ] as const;

  const filteredBookings = bookings.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.badge === selectedFilter;
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('BookingsList');
    }
  };

  const handleViewDetails = (booking: TrackingBookingItem) => {
    if (booking.vendorName.includes('Grand Palace') || booking.id === '1') {
      navigation?.navigate('VenueBookingDetails', {
        serviceTitle: 'The Grand Palace',
        category: 'Banquet Hall',
        price: 75000,
        date: '20 Dec 2026',
        time: '7:00 PM - 11:00 PM',
        location: '123, AB Road, Vijay Nagar, Indore',
      });
    } else {
      navigation?.navigate('BookingDetails', { booking });
    }
  };

  const renderBadge = (badge: TrackingBookingItem['badge']) => {
    if (badge === 'Upcoming') {
      return (
        <View style={styles.badgeUpcoming}>
          <Ionicons name="calendar" size={10} color="#FFFFFF" />
          <Text style={styles.badgeUpcomingText}>Upcoming</Text>
        </View>
      );
    }
    if (badge === 'Completed') {
      return (
        <View style={styles.badgeCompleted}>
          <Ionicons name="checkmark-circle" size={10} color="#FFFFFF" />
          <Text style={styles.badgeCompletedText}>Completed</Text>
        </View>
      );
    }
    if (badge === 'Cancelled') {
      return (
        <View style={styles.badgeCancelled}>
          <Ionicons name="close-circle-outline" size={10} color="#DC2626" />
          <Text style={styles.badgeCancelledText}>Cancelled</Text>
        </View>
      );
    }
    return null;
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
            My <Text style={styles.headerTitleRed}>Bookings</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Manage all your bookings in one place</Text>
        </View>

        <View style={styles.headerRightBadge}>
          <Ionicons name="calendar" size={22} color="#DC2626" />
          <View style={styles.scriptBadge}>
            <Text style={styles.scriptBadgeTop}>Good</Text>
            <Text style={styles.scriptBadgeMid}>Plans</Text>
            <Text style={styles.scriptBadgeBot}>Better</Text>
            <Text style={styles.scriptBadgeEnd}>Memories ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter Pills Row */}
        <View style={styles.filterPillsRow}>
          {filterTabs.map((tab) => {
            const isSelected = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterPill,
                  isSelected ? styles.filterPillActive : styles.filterPillInactive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(tab.key)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected ? styles.filterPillTextActive : styles.filterPillTextInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bookings List Cards */}
        {filteredBookings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.bookingCard}
            activeOpacity={0.92}
            onPress={() => handleViewDetails(item)}
          >
            {/* Top Main Section */}
            <View style={styles.cardMainRow}>
              {/* Left Image with Status Badge */}
              <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.badgeContainer}>
                  {renderBadge(item.badge)}
                </View>
              </View>

              {/* Right Content */}
              <View style={styles.contentCol}>
                {/* Header Row: Vendor Name & Booking ID */}
                <View style={styles.vendorHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vendorNameText} numberOfLines={1}>
                      {item.vendorName}
                    </Text>
                    <Text style={styles.categorySubText}>{item.category}</Text>
                  </View>
                  <View style={styles.bookingIdBadgeCol}>
                    <Text style={styles.bookingIdLabel}>Booking ID</Text>
                    <Text style={styles.bookingIdText}>{item.bookingId}</Text>
                  </View>
                </View>

                {/* Details list */}
                <View style={styles.detailsList}>
                  <View style={styles.detailItemRow}>
                    <Ionicons name="calendar-outline" size={13} color="#DC2626" />
                    <Text style={styles.detailItemText}>{item.date}</Text>
                  </View>
                  <View style={styles.detailItemRow}>
                    <Ionicons name="time-outline" size={13} color="#DC2626" />
                    <Text style={styles.detailItemText}>{item.time}</Text>
                  </View>
                  <View style={styles.detailItemRow}>
                    <Ionicons name="location-outline" size={13} color="#DC2626" />
                    <Text style={styles.detailItemText} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                </View>

                {/* Price & View Details Row */}
                <View style={styles.priceAndActionRow}>
                  <View>
                    <Text style={styles.priceText}>{item.price}</Text>
                    {item.priceSubtitle ? (
                      <Text style={styles.priceSubText}>{item.priceSubtitle}</Text>
                    ) : null}
                  </View>

                  <View style={styles.viewDetailsPill}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={13} color="#DC2626" />
                  </View>
                </View>
              </View>
            </View>

            {/* Stepper Timeline */}
            {item.hasStepper && (
              <View style={styles.stepperContainer}>
                <View style={styles.stepperDivider} />
                <View style={styles.stepperRow}>
                  {/* Step 1: Booked */}
                  <View style={styles.stepItem}>
                    <View style={styles.stepCircleActive}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                    <Text style={styles.stepTitleActive}>Booked</Text>
                    <Text style={styles.stepDateSub}>12 Nov 2026</Text>
                  </View>

                  {/* Line 1 */}
                  <View style={styles.stepLineActive} />

                  {/* Step 2: Payment Done */}
                  <View style={styles.stepItem}>
                    <View style={styles.stepCircleActive}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                    <Text style={styles.stepTitleActive}>Payment Done</Text>
                    <Text style={styles.stepDateSub}>12 Nov 2026</Text>
                  </View>

                  {/* Line 2 */}
                  <View style={styles.stepLineInactive} />

                  {/* Step 3: Event Date */}
                  <View style={styles.stepItem}>
                    <View style={styles.stepCircleInactive} />
                    <Text style={styles.stepTitleInactive}>Event Date</Text>
                    <Text style={styles.stepDateSub}>20 Dec 2026</Text>
                  </View>

                  {/* Line 3 */}
                  <View style={styles.stepLineInactive} />

                  {/* Step 4: Completed */}
                  <View style={styles.stepItem}>
                    <View style={styles.stepCircleInactive} />
                    <Text style={styles.stepTitleInactive}>Completed</Text>
                    <Text style={styles.stepDateSub}>Pending</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Book a New Service Dashed Card */}
        <TouchableOpacity
          style={styles.bookNewServiceCard}
          activeOpacity={0.85}
          onPress={() => navigation?.navigate('Services')}
        >
          <View style={styles.plusIconCircle}>
            <Ionicons name="add" size={20} color="#DC2626" />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.bookNewTitle}>Book a New Service</Text>
            <Text style={styles.bookNewSub}>Make your next celebration special</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 35 }} />
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    fontSize: 21,
    fontWeight: '800',
    color: '#1A040A',
  },
  headerTitleRed: {
    color: '#DC2626',
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#736064',
    marginTop: 2,
  },
  headerRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 4,
  },
  scriptBadge: {
    alignItems: 'flex-start',
  },
  scriptBadgeTop: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#DC2626',
    lineHeight: 8.5,
  },
  scriptBadgeMid: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#DC2626',
    lineHeight: 8.5,
  },
  scriptBadgeBot: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#DC2626',
    lineHeight: 8.5,
  },
  scriptBadgeEnd: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#DC2626',
    lineHeight: 8.5,
  },

  scrollContent: {
    padding: 12,
    gap: 12,
  },

  filterPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#DC2626',
  },
  filterPillInactive: {
    backgroundColor: '#F5F5F5',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillTextInactive: {
    color: '#4A353A',
  },

  bookingCard: {
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
  cardMainRow: {
    flexDirection: 'row',
    gap: 10,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5E6DF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  badgeUpcoming: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
  },
  badgeUpcomingText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  badgeCompleted: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
  },
  badgeCompletedText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
  badgeCancelled: {
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
  },
  badgeCancelledText: {
    color: '#DC2626',
    fontSize: 8.5,
    fontWeight: '800',
  },

  contentCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  vendorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  vendorNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  categorySubText: {
    fontSize: 9.5,
    color: '#5E718D',
    marginTop: 1,
  },
  bookingIdBadgeCol: {
    alignItems: 'flex-end',
  },
  bookingIdLabel: {
    fontSize: 7.5,
    color: '#5E718D',
  },
  bookingIdText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#5E718D',
  },

  detailsList: {
    gap: 2,
    marginVertical: 3,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailItemText: {
    fontSize: 9.5,
    color: '#334155',
  },

  priceAndActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626',
  },
  priceSubText: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: -1,
  },
  viewDetailsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF1F0',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#DC2626',
  },

  stepperContainer: {
    marginTop: 6,
    paddingTop: 8,
  },
  stepperDivider: {
    height: 1,
    backgroundColor: '#F3E8E2',
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepItem: {
    alignItems: 'center',
    width: 60,
  },
  stepCircleActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepCircleInactive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBD5E1',
    marginBottom: 3,
  },
  stepTitleActive: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  stepTitleInactive: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  stepDateSub: {
    fontSize: 7.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 1,
  },
  stepLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: '#DC2626',
    marginBottom: 16,
  },
  stepLineInactive: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },

  bookNewServiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#F87171',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  plusIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNewTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  bookNewSub: {
    fontSize: 9.5,
    color: '#736064',
  },
});
