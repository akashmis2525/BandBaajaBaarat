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
  Alert,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

interface BookingDetailsScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('18 Nov 2026, Wednesday');
  const [selectedTime, setSelectedTime] = useState('5:00 PM - 9:00 PM');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const booking = {
    bookingId: 'TI1265089',
    serviceCategory: 'Dhol Services',
    vendorName: 'Royal Beats Dhol Group',
    rating: 4.6,
    reviewsCount: 210,
    experience: '5+ Years',
    eventDate: '15 Nov 2026, Sunday',
    eventTime: '5:00 PM - 9:00 PM',
    duration: '4 Hours',
    location: 'Indore, Madhya Pradesh',
    bookingDate: '11 Nov 2026, 09:41 AM',
    vendorNotifiedDate: '11 Nov, 10:15 AM',
    photosCount: 5,
    image: Assets.serviceBrassBand,
    vendorPhone: '+91 98765 43210',
    basePrice: 8000,
    artistCharges: 2000,
    travelCharges: 1000,
    totalAmount: 11000,
    status: 'Upcoming',
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Bookings');
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
                ? insets.top + 4
                : 20,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Booking <Text style={styles.headerTitleMaroon}>Details</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Here's everything about your booking</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Celebrations</Text>
          <Text style={styles.scriptBadgeMid}>Made</Text>
          <Text style={styles.scriptBadgeBot}>Easy ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Vendor Card */}
        <View style={styles.vendorSnapshotCard}>
          <View style={styles.cardImgWrapper}>
            <Image source={booking.image} style={styles.cardImg} />
            <View style={styles.photoCountBadge}>
              <Ionicons name="camera-outline" size={10} color="#FFFFFF" />
              <Text style={styles.photoCountText}>{booking.photosCount} Photos</Text>
            </View>
          </View>

          <View style={styles.cardDetailsCol}>
            <View style={styles.categoryAndStatusRow}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{booking.serviceCategory}</Text>
              </View>

              <View style={styles.upcomingBadge}>
                <Ionicons name="time" size={11} color="#16A34A" />
                <Text style={styles.upcomingBadgeText}>Upcoming</Text>
              </View>
            </View>

            <Text style={styles.vendorHeading} numberOfLines={1}>
              {booking.vendorName}
            </Text>

            <View style={styles.ratingAndExpRow}>
              <Ionicons name="star" size={12} color="#E59819" />
              <Text style={styles.ratingScore}>{booking.rating}</Text>
              <Text style={styles.reviewsCountText}>({booking.reviewsCount} reviews)</Text>
              <Text style={styles.dividerPipe}>|</Text>
              <Text style={styles.expText}>{booking.experience}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>{booking.eventDate}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>
                {booking.eventTime} ({booking.duration})
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={11.5} color="#8A072D" />
              <Text style={styles.metaText} numberOfLines={1}>
                {booking.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Stepper / Timeline Progress Bar */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperRow}>
            {/* Step 1: Confirmed */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCircleActive]}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={[styles.stepLabel, styles.stepLabelActive]}>
                Booking{'\n'}Confirmed
              </Text>
              <Text style={styles.stepTimeText}>11 Nov, 09:41 AM</Text>
            </View>

            {/* Connecting Line 1 */}
            <View style={[styles.stepLine, styles.stepLineActive]} />

            {/* Step 2: Vendor Notified */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCircleActive]}>
                <Ionicons name="notifications" size={13} color="#FFFFFF" />
              </View>
              <Text style={[styles.stepLabel, styles.stepLabelActive]}>
                Vendor{'\n'}Notified
              </Text>
              <Text style={styles.stepTimeText}>11 Nov, 10:15 AM</Text>
            </View>

            {/* Connecting Line 2 */}
            <View style={styles.stepLine} />

            {/* Step 3: Vendor Will Contact */}
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Ionicons name="calendar-outline" size={13} color="#8E7C80" />
              </View>
              <Text style={styles.stepLabel}>
                Vendor Will{'\n'}Contact You
              </Text>
            </View>

            {/* Connecting Line 3 */}
            <View style={styles.stepLine} />

            {/* Step 4: Event in Progress */}
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}>
                <Ionicons name="person-outline" size={13} color="#8E7C80" />
              </View>
              <Text style={styles.stepLabel}>
                Event{'\n'}In Progress
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Booking Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Booking ID</Text>
            <Text style={styles.bookingIdValue}>{booking.bookingId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Booking Date</Text>
            <Text style={styles.infoValue}>{booking.bookingDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Event Date</Text>
            <Text style={styles.infoValue}>{booking.eventDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Event Time</Text>
            <Text style={styles.infoValue}>{booking.eventTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Event Location</Text>
            <Text style={styles.infoValue}>{booking.location}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Service Duration</Text>
            <Text style={styles.infoValue}>{booking.duration}</Text>
          </View>
        </View>

        {/* Price Details Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Price Details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Dhol Services <Text style={styles.priceSubLabel}>(Basic Package)</Text>
            </Text>
            <Text style={styles.priceVal}>₹{booking.basePrice.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Artist Charges</Text>
            <Text style={styles.priceVal}>₹{booking.artistCharges.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Travel & Setup Charges</Text>
            <Text style={styles.priceVal}>₹{booking.travelCharges.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.totalAmountBanner}>
            <Text style={styles.totalAmountLabel}>Total Amount</Text>
            <Text style={styles.totalAmountVal}>₹{booking.totalAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Vendor Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Vendor Information</Text>

          <View style={styles.vendorMainRow}>
            {/* Vendor Circular Logo */}
            <View style={styles.vendorLogoBadge}>
              <FontAwesome5 name="crown" size={13} color="#FBBF24" style={{ marginBottom: 2 }} />
              <FontAwesome5 name="drum" size={18} color="#FBBF24" />
              <Text style={styles.vendorLogoText}>Royal Beats</Text>
              <Text style={styles.vendorLogoSubText}>DHOL GROUP</Text>
            </View>

            {/* Vendor Details */}
            <View style={styles.vendorTextCol}>
              <View style={styles.vendorNameVerifiedRow}>
                <Text style={styles.vendorNameTitle}>{booking.vendorName}</Text>
                <Ionicons name="checkmark-circle" size={15} color="#8A072D" />
              </View>

              <View style={styles.vendorRatingRow}>
                <Ionicons name="star" size={11} color="#E59819" />
                <Text style={styles.vendorRatingScore}>{booking.rating}</Text>
                <Text style={styles.vendorReviewCount}>({booking.reviewsCount} reviews)</Text>
                <Text style={styles.dividerPipe}>|</Text>
                <Text style={styles.expText}>{booking.experience}</Text>
              </View>

              <View style={styles.vendorLocationRow}>
                <Ionicons name="location-sharp" size={11.5} color="#8A072D" />
                <Text style={styles.vendorLocationText}>{booking.location}</Text>
              </View>

              <View style={styles.vendorPhoneRow}>
                <Ionicons name="call" size={11} color="#8A072D" />
                <Text style={styles.vendorPhoneText}>{booking.vendorPhone}</Text>
              </View>
            </View>

            {/* Vendor Quick Actions: Call & Chat */}
            <View style={styles.vendorActionsCol}>
              <TouchableOpacity
                style={styles.callVendorBtn}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    'Call Vendor',
                    `Connecting you to ${booking.vendorName} at ${booking.vendorPhone}...`,
                    [{ text: 'Cancel', style: 'cancel' }, { text: 'Call Now' }]
                  )
                }
              >
                <Ionicons name="call" size={12} color="#8A072D" />
                <Text style={styles.callVendorBtnText}>Call Vendor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatVendorBtn}
                activeOpacity={0.8}
                onPress={() => {
                  navigation?.navigate('Chat');
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={12} color="#8A072D" />
                <Text style={styles.chatVendorBtnText}>Chat with Vendor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4 Bottom Quick Action Cards */}
        <View style={styles.bottomActionsGrid}>
          {/* 1. Reschedule */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Reschedule', { booking })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="calendar" size={18} color="#8A072D" />
            </View>
            <Text style={styles.actionCardText}>Reschedule</Text>
          </TouchableOpacity>

          {/* 2. Cancel Booking */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('CancelBooking', { booking })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="close-circle" size={18} color="#8A072D" />
            </View>
            <Text style={styles.actionCardText}>Cancel Booking</Text>
          </TouchableOpacity>

          {/* 3. Download Invoice */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('DownloadInvoice', { booking })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="document-text" size={18} color="#8A072D" />
            </View>
            <Text style={styles.actionCardText}>Download Invoice</Text>
          </TouchableOpacity>

          {/* 4. Need Help? */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('HelpSupport')}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="headset" size={18} color="#8A072D" />
            </View>
            <Text style={styles.actionCardText}>Need Help?</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Reschedule Modal */}
      <Modal visible={showRescheduleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reschedule Booking</Text>
              <TouchableOpacity onPress={() => setShowRescheduleModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select new date & time slot for {booking.vendorName}
            </Text>

            <Text style={styles.modalSectionLabel}>Available Dates</Text>
            <View style={styles.dateOptionsRow}>
              {['18 Nov 2026, Wed', '19 Nov 2026, Thu', '22 Nov 2026, Sun'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dateChip, selectedDate.startsWith(d.split(' ')[0]) && styles.dateChipActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      selectedDate.startsWith(d.split(' ')[0]) && styles.dateChipTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionLabel}>Select Time Window</Text>
            <View style={styles.dateOptionsRow}>
              {['4:00 PM - 8:00 PM', '5:00 PM - 9:00 PM', '7:00 PM - 11:00 PM'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.dateChip, selectedTime === t && styles.dateChipActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      selectedTime === t && styles.dateChipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmRescheduleBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowRescheduleModal(false);
                Alert.alert(
                  'Reschedule Requested 🎉',
                  `Your reschedule request for ${selectedDate} (${selectedTime}) has been sent to the vendor for instant confirmation.`
                );
              }}
            >
              <Text style={styles.confirmRescheduleBtnText}>Confirm Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal visible={showCancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#C5221F' }]}>Cancel Booking</Text>
              <TouchableOpacity onPress={() => setShowCancelModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Are you sure you want to cancel booking #{booking.bookingId}?
            </Text>

            <View style={styles.refundPolicyBox}>
              <Ionicons name="information-circle" size={18} color="#8A072D" />
              <Text style={styles.refundPolicyText}>
                100% Full Refund of ₹{booking.totalAmount.toLocaleString('en-IN')} will be credited
                back to your source payment method within 2-4 hours.
              </Text>
            </View>

            <View style={styles.cancelModalActions}>
              <TouchableOpacity
                style={styles.cancelKeepBtn}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.cancelKeepBtnText}>Keep Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelConfirmBtn}
                onPress={() => {
                  setShowCancelModal(false);
                  Alert.alert(
                    'Booking Cancelled',
                    `Booking #${booking.bookingId} has been cancelled. ₹${booking.totalAmount.toLocaleString(
                      'en-IN'
                    )} refund initiated.`,
                    [{ text: 'OK', onPress: handleBack }]
                  );
                }}
              >
                <Text style={styles.cancelConfirmBtnText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 9.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 11,
  },
  scriptBadgeMid: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 10,
  },
  scriptBadgeBot: {
    fontSize: 9.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 11,
  },

  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // Vendor Snapshot Card
  vendorSnapshotCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardImgWrapper: {
    width: 100,
    height: 125,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FDECE6',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '600',
  },
  cardDetailsCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryAndStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTag: {
    backgroundColor: '#FDECE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTagText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  upcomingBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  vendorHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
    marginTop: 2,
  },
  ratingAndExpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsCountText: {
    fontSize: 9,
    color: '#736064',
  },
  dividerPipe: {
    fontSize: 9,
    color: '#CBB2A9',
    marginHorizontal: 2,
  },
  expText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#554246',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 9.5,
    color: '#554246',
    flex: 1,
  },

  // Stepper
  stepperContainer: {
    backgroundColor: '#FDF1EC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F7D7CA',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6D7D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: '#8A072D',
  },
  stepLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#736064',
    textAlign: 'center',
    lineHeight: 11,
  },
  stepLabelActive: {
    color: '#1A040A',
    fontWeight: '700',
  },
  stepTimeText: {
    fontSize: 7.5,
    color: '#8A072D',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  stepLine: {
    height: 2,
    backgroundColor: '#E6D7D3',
    flex: 0.6,
    marginTop: 13,
  },
  stepLineActive: {
    backgroundColor: '#8A072D',
  },

  // Info Cards
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 10.5,
    color: '#736064',
  },
  infoValue: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#1A040A',
  },
  bookingIdValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A072D',
  },

  // Price Card
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 10.5,
    color: '#554246',
  },
  priceSubLabel: {
    color: '#8E7C80',
    fontSize: 9.5,
  },
  priceVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A040A',
  },
  totalAmountBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FDF1EC',
    marginHorizontal: -12,
    marginBottom: -12,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    borderTopWidth: 1,
    borderTopColor: '#F7D7CA',
  },
  totalAmountLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  totalAmountVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8A072D',
  },

  // Vendor Information
  vendorMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vendorLogoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#5D0D10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderWidth: 1.5,
    borderColor: '#FBBF24',
  },
  vendorLogoText: {
    color: '#FBBF24',
    fontSize: 7.5,
    fontWeight: '800',
    lineHeight: 9,
    marginTop: 2,
  },
  vendorLogoSubText: {
    color: '#FFFFFF',
    fontSize: 5,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  vendorTextCol: {
    flex: 1,
    gap: 2,
  },
  vendorNameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendorNameTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  vendorRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  vendorRatingScore: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  vendorReviewCount: {
    fontSize: 8.5,
    color: '#736064',
  },
  vendorLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  vendorLocationText: {
    fontSize: 9,
    color: '#554246',
  },
  vendorPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  vendorPhoneText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#554246',
  },
  vendorActionsCol: {
    gap: 6,
  },
  callVendorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8A072D',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.round,
    gap: 3,
  },
  callVendorBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  chatVendorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8A072D',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Spacing.borderRadius.round,
    gap: 3,
  },
  chatVendorBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#8A072D',
  },

  // 4 Bottom Action Cards
  bottomActionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FDF1EC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F7D7CA',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5CFC0',
  },
  actionCardText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#1A040A',
    textAlign: 'center',
    lineHeight: 11,
  },

  // Modals
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
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#736064',
    marginBottom: 14,
  },
  modalSectionLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
    marginTop: 8,
    marginBottom: 6,
  },
  dateOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  dateChip: {
    backgroundColor: '#FDF1EC',
    borderWidth: 1,
    borderColor: '#F7D7CA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateChipActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  dateChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8A072D',
  },
  dateChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  confirmRescheduleBtn: {
    backgroundColor: '#8A072D',
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.round,
    alignItems: 'center',
    marginTop: 14,
  },
  confirmRescheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  refundPolicyBox: {
    flexDirection: 'row',
    backgroundColor: '#FDF1EC',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginVertical: 12,
    alignItems: 'center',
  },
  refundPolicyText: {
    flex: 1,
    fontSize: 10,
    color: '#8A072D',
    fontWeight: '600',
    lineHeight: 14,
  },
  cancelModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  cancelKeepBtn: {
    flex: 1,
    backgroundColor: '#F5EAE6',
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.round,
    alignItems: 'center',
  },
  cancelKeepBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#554246',
  },
  cancelConfirmBtn: {
    flex: 1,
    backgroundColor: '#C5221F',
    paddingVertical: 10,
    borderRadius: Spacing.borderRadius.round,
    alignItems: 'center',
  },
  cancelConfirmBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
