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
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';

export interface BookingItem {
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
  image: any;
  phone: string;
  actions: ('reschedule' | 'cancel' | 'view_details' | 'rebook' | 'review' | 'book_again')[];
}

export const BookingsScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');

  const bookings: BookingItem[] = [
    {
      id: '1',
      bookingId: '#BB20261220',
      badge: 'Upcoming',
      vendorName: 'The Grand Palace',
      category: 'Banquet Hall, Indore',
      date: '20 Dec 2026',
      time: '7:00 PM - 11:00 PM',
      location: '123, AB Road, Vijay Nagar, Indore',
      price: '₹88,500',
      priceNum: 88500,
      image: Assets.serviceDecorators,
      phone: '+91 98265 99887',
      actions: ['reschedule', 'cancel', 'view_details'],
    },
    {
      id: '2',
      bookingId: '#BB20261115',
      badge: 'Upcoming',
      vendorName: 'Royal Beats Dhol Group',
      category: 'Dhol & Music, Indore',
      date: '15 Nov 2026',
      time: '6:00 PM - 10:00 PM',
      location: 'Indore, Madhya Pradesh',
      price: '₹5,999',
      priceNum: 5999,
      image: Assets.weddingMandapArt,
      phone: '+91 98260 12345',
      actions: ['reschedule', 'cancel', 'view_details'],
    },
    {
      id: '3',
      bookingId: '#BB20261005',
      badge: 'Completed',
      vendorName: 'Shivam Car Rentals',
      category: 'Wedding Car, Indore',
      date: '05 Oct 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Indore, Madhya Pradesh',
      price: '₹8,000',
      priceNum: 8000,
      image: Assets.serviceBuggi,
      phone: '+91 98261 44556',
      actions: ['rebook', 'view_details', 'review'],
    },
    {
      id: '4',
      bookingId: '#BB20260928',
      badge: 'Completed',
      vendorName: 'Glam Look Makeup Studio',
      category: 'Bridal Makeup, Indore',
      date: '28 Sep 2026',
      time: '10:00 AM - 2:00 PM',
      location: 'Indore, Madhya Pradesh',
      price: '₹12,000',
      priceNum: 12000,
      image: Assets.serviceMehndi,
      phone: '+91 94250 11223',
      actions: ['rebook', 'view_details', 'review'],
    },
    {
      id: '5',
      bookingId: '#BB20260812',
      badge: 'Cancelled',
      vendorName: 'Shree Caterers',
      category: 'Catering Service, Indore',
      date: '12 Aug 2026',
      time: '7:00 PM - 11:00 PM',
      location: 'Indore, Madhya Pradesh',
      price: '₹600',
      priceNum: 600,
      image: Assets.serviceClothes,
      phone: '+91 98262 77889',
      actions: ['book_again', 'view_details'],
    },
  ];

  const filterTabs = [
    { key: 'All', label: 'All (5)' },
    { key: 'Upcoming', label: 'Upcoming (2)' },
    { key: 'Completed', label: 'Completed (2)' },
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
      navigation?.navigate('Home');
    }
  };

  const handleViewDetails = (booking: BookingItem) => {
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

  const handleReschedule = (booking: BookingItem) => {
    navigation?.navigate('Reschedule', { booking });
  };

  const handleCancelBooking = (booking: BookingItem) => {
    navigation?.navigate('CancelBooking', { booking });
  };

  const handleRebook = (booking: BookingItem) => {
    navigation?.navigate('ServiceDetail', { category: booking.category });
  };

  const handleWriteReview = (booking: BookingItem) => {
    navigation?.navigate('RateReview', { booking });
  };

  const handleBookAgain = (booking: BookingItem) => {
    navigation?.navigate('ServiceDetail', { category: booking.category });
  };

  const renderBadge = (badge: BookingItem['badge']) => {
    if (badge === 'Upcoming') {
      return (
        <View style={styles.badgeUpcoming}>
          <Text style={styles.badgeUpcomingText}>Upcoming</Text>
        </View>
      );
    }
    if (badge === 'Completed') {
      return (
        <View style={styles.badgeCompleted}>
          <Text style={styles.badgeCompletedText}>Completed</Text>
        </View>
      );
    }
    if (badge === 'Cancelled') {
      return (
        <View style={styles.badgeCancelled}>
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

        {/* Script Brand Stamp */}
        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Moments</Text>
          <Text style={styles.scriptBadgeMid}>Booked</Text>
          <Text style={styles.scriptBadgeBot}>Memories</Text>
          <Text style={styles.scriptBadgeEnd}>Ahead ♡</Text>
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

        {/* 5 Bookings List Cards */}
        {filteredBookings.map((item) => (
          <View key={item.id} style={styles.bookingCard}>
            {/* Top Main Section */}
            <TouchableOpacity
              style={styles.cardMainRow}
              activeOpacity={0.88}
              onPress={() => handleViewDetails(item)}
            >
              {/* Left Image with Status Badge */}
              <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.badgeContainer}>
                  {renderBadge(item.badge)}
                </View>
              </View>

              {/* Middle & Right Content */}
              <View style={styles.contentCol}>
                {/* Header Row: Vendor Name, Price & Chevron */}
                <View style={styles.vendorHeaderRow}>
                  <View style={{ flex: 1, paddingRight: 4 }}>
                    <Text style={styles.vendorNameText} numberOfLines={1}>
                      {item.vendorName}
                    </Text>
                    <Text style={styles.categorySubText}>{item.category}</Text>
                  </View>

                  <View style={styles.priceCol}>
                    <Text style={styles.priceText}>{item.price}</Text>
                    <Text style={styles.bookingIdText}>
                      Booking ID{'\n'}{item.bookingId}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color="#DC2626" style={{ marginTop: 2 }} />
                </View>

                {/* Details list */}
                <View style={styles.detailsList}>
                  <View style={styles.detailItemRow}>
                    <Ionicons name="calendar-outline" size={12} color="#DC2626" />
                    <Text style={styles.detailItemText}>{item.date}</Text>
                  </View>
                  <View style={styles.detailItemRow}>
                    <Ionicons name="time-outline" size={12} color="#DC2626" />
                    <Text style={styles.detailItemText}>{item.time}</Text>
                  </View>
                  <View style={styles.detailItemRow}>
                    <Ionicons name="location-outline" size={12} color="#DC2626" />
                    <Text style={styles.detailItemText} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Bottom Actions Bar */}
            <View style={styles.cardActionsRow}>
              {item.badge === 'Upcoming' && (
                <>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleReschedule(item)}
                  >
                    <Ionicons name="calendar-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleCancelBooking(item)}
                  >
                    <Ionicons name="close-circle-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>Cancel Booking</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleViewDetails(item)}
                  >
                    <Ionicons name="document-text-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>View Details</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.badge === 'Completed' && (
                <>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleRebook(item)}
                  >
                    <Ionicons name="star-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>Rebook</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleViewDetails(item)}
                  >
                    <Ionicons name="document-text-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>View Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleWriteReview(item)}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>Write a Review</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.badge === 'Cancelled' && (
                <>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleBookAgain(item)}
                  >
                    <Ionicons name="refresh-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>Book Again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.7}
                    onPress={() => handleViewDetails(item)}
                  >
                    <Ionicons name="document-text-outline" size={13} color="#DC2626" />
                    <Text style={styles.actionBtnText}>View Details</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}

        {filteredBookings.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={48} color="#C5B4B8" />
            <Text style={styles.emptyTitle}>No {selectedFilter} Bookings</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any bookings in this section.
            </Text>
          </View>
        )}

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
  scriptBadge: {
    alignItems: 'flex-start',
    marginLeft: 4,
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

  // Filter Pills
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

  // Booking Card
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardMainRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  imageWrapper: {
    width: 95,
    height: 95,
    borderRadius: 8,
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
    top: 4,
    left: 4,
  },
  badgeUpcoming: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeUpcomingText: {
    color: '#16A34A',
    fontSize: 8,
    fontWeight: '800',
  },
  badgeCompleted: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeCompletedText: {
    color: '#0284C7',
    fontSize: 8,
    fontWeight: '800',
  },
  badgeCancelled: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeCancelledText: {
    color: '#DC2626',
    fontSize: 8,
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
    gap: 2,
  },
  vendorNameText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  categorySubText: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  priceCol: {
    alignItems: 'flex-end',
    marginRight: 2,
  },
  priceText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#DC2626',
  },
  bookingIdText: {
    fontSize: 7.5,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'right',
    marginTop: 1,
    lineHeight: 9.5,
  },

  detailsList: {
    gap: 2,
    marginVertical: 2,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailItemText: {
    fontSize: 9.5,
    color: '#334155',
  },

  // Bottom 3 / 2 Action Buttons Row
  cardActionsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF7F5',
    borderTopWidth: 1,
    borderTopColor: '#F5E4DE',
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  actionBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#DC2626',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A040A',
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#736064',
  },
});
