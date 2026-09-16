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
  TextInput,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';

interface BookingSummaryProps {
  route?: any;
  navigation?: any;
  onBack?: () => void;
}

export const BookingSummaryScreen: React.FC<BookingSummaryProps> = ({
  route,
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  // Booking Data States
  const [eventType, setEventType] = useState('Wedding Ceremony');
  const [eventDate, setEventDate] = useState('25 November 2026 (Wednesday)');
  const [eventTime, setEventTime] = useState('6:00 PM – 11:00 PM');
  const [eventLocation, setEventLocation] = useState('Royal Greens, Indore, Madhya Pradesh');
  const [guestCount, setGuestCount] = useState('300 – 400 Guests');

  // Meeting Details
  const [meetingDate, setMeetingDate] = useState('16 September 2026');
  const [meetingTime, setMeetingTime] = useState('10:00 AM – 11:00 AM');
  const [meetingLocation, setMeetingLocation] = useState('301, Shekhar Central, MG Road, Indore – 452001');

  // Agreed Price
  const agreedAmount = route?.params?.amount || 75000;
  const vendorName = route?.params?.vendorName || 'Royal Events & Decor';
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    route?.params?.appliedCoupon || 'SHUBHVIVAH'
  );

  // Discount Calculation
  const calculateDiscount = (code: string | null, base: number) => {
    if (!code) return 0;
    const upper = code.toUpperCase();
    if (upper === 'SHUBHVIVAH') {
      return Math.min(base * 0.2, 10000); // 20% max 10k
    } else if (upper === 'FIRSTBAARAT') {
      return 2500;
    } else if (upper === 'ROYALDHOL') {
      return 1500;
    } else if (upper === 'GLAMMAKEUP') {
      return Math.min(base * 0.15, 4000);
    } else if (upper === 'CASHBACK5000') {
      return 0; // Cashback reward
    }
    return 2000;
  };

  const discountAmount = calculateDiscount(appliedCouponCode, agreedAmount);
  const finalPayableAmount = Math.max(agreedAmount - discountAmount, 0);
  const advanceAmount = 25000;
  const remainingAtEvent = Math.max(finalPayableAmount - advanceAmount, 0);

  // Terms Agreement
  const [isTermsAgreed, setIsTermsAgreed] = useState(true);

  // Modals for Editing
  const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);
  const [isEditMeetingModalVisible, setIsEditMeetingModalVisible] = useState(false);
  const [isEditServicesModalVisible, setIsEditServicesModalVisible] = useState(false);

  // Selected Services List
  const [selectedServices, setSelectedServices] = useState([
    { id: '1', name: 'Stage Decoration', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80' },
    { id: '2', name: 'Entry Gate', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80' },
    { id: '3', name: 'Flower Setup', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=200&q=80' },
    { id: '4', name: 'Lighting', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80' },
    { id: '5', name: 'Welcome Board', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=200&q=80' },
  ]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('NegotiatePrice');
    }
  };

  const handleConfirmBooking = () => {
    if (!isTermsAgreed) {
      Alert.alert(
        'Terms & Conditions',
        'Please agree to the Terms & Conditions and Cancellation Policy before confirming the booking.'
      );
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate('MakePayment', {
        bookingId: 'BBBD126789',
        vendorName: vendorName,
        serviceName: eventType + ' - Decoration & Setup',
        totalAmount: finalPayableAmount,
        baseAmount: agreedAmount,
        discountAmount: discountAmount,
        appliedCoupon: appliedCouponCode,
        advancePaid: advanceAmount,
        amount: remainingAtEvent,
        eventDate: eventDate,
        eventLocation: eventLocation,
        guestCount: guestCount,
      });
    } else {
      Alert.alert(
        'Booking Confirmed!',
        `Your booking with ${vendorName} for ₹${finalPayableAmount.toLocaleString('en-IN')} has been confirmed successfully.`
      );
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
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
          </TouchableOpacity>

          <View style={styles.titleColumn}>
            <Text style={styles.screenTitle}>
              Booking <Text style={styles.screenTitleHighlight}>Summary</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Review your booking details before confirmation
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.calendarGraphicBox}>
            <Ionicons name="calendar" size={16} color="#D81B60" />
            <View style={styles.checkMiniBadge}>
              <Ionicons name="checkmark" size={7} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Almost</Text>
            <Text style={styles.decorativeLine2}>There!</Text>
            <Text style={styles.decorativeLine3}>Let's Make Your</Text>
            <Text style={styles.decorativeLine4}>Celebration Special ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Header Card */}
        <View style={styles.vendorCard}>
          <View style={styles.vendorTopRow}>
            <Image
              source={Assets.weddingMandapArt || { uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' }}
              style={styles.vendorImage}
              resizeMode="cover"
            />

            <View style={styles.vendorDetailsCol}>
              <Text style={styles.vendorName} numberOfLines={1}>
                {vendorName}
              </Text>

              <View style={styles.vendorRatingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.vendorRatingScore}>4.8</Text>
                <Text style={styles.vendorReviewsCount}>(320 reviews)</Text>
              </View>

              <View style={styles.vendorLocationRow}>
                <Ionicons name="location-sharp" size={12} color="#D81B60" />
                <Text style={styles.vendorLocationText} numberOfLines={1}>
                  Indore, Madhya Pradesh
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewProfileBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('RateReview')}
            >
              <Text style={styles.viewProfileBtnText}>View Profile</Text>
              <Ionicons name="chevron-forward" size={13} color="#D81B60" />
            </TouchableOpacity>
          </View>

          <View style={styles.badgesRow}>
            <View style={styles.badgePill}>
              <Ionicons name="shield-checkmark" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>

            <View style={styles.badgePill}>
              <Ionicons name="trophy" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Top Rated</Text>
            </View>

            <View style={styles.badgePill}>
              <Ionicons name="headset" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Quick Response</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Event Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="calendar-outline" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Event Details</Text>
            </View>
            <TouchableOpacity
              style={styles.editLinkBtn}
              activeOpacity={0.7}
              onPress={() => setIsEditEventModalVisible(true)}
            >
              <Ionicons name="pencil" size={12} color="#E53935" style={{ marginRight: 2 }} />
              <Text style={styles.editLinkText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Event Type</Text>
              <Text style={styles.detailValue}>{eventType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Event Date</Text>
              <Text style={styles.detailValue}>{eventDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Event Time</Text>
              <Text style={styles.detailValue}>{eventTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Event Location</Text>
              <Text style={styles.detailValue}>{eventLocation}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guest Count</Text>
              <Text style={styles.detailValue}>{guestCount}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Selected Services */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="list-outline" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Selected Services</Text>
            </View>
            <TouchableOpacity
              style={styles.editLinkBtn}
              activeOpacity={0.7}
              onPress={() => setIsEditServicesModalVisible(true)}
            >
              <Ionicons name="pencil" size={12} color="#E53935" style={{ marginRight: 2 }} />
              <Text style={styles.editLinkText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScrollRow}
          >
            {selectedServices.map((service) => (
              <View key={service.id} style={styles.serviceItemCard}>
                <Image source={{ uri: service.image }} style={styles.serviceItemImg} />
                <Text style={styles.serviceItemName} numberOfLines={2}>
                  {service.name}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.moreServicesCard}
              activeOpacity={0.8}
              onPress={() => setIsEditServicesModalVisible(true)}
            >
              <Text style={styles.moreServicesPlus}>+2</Text>
              <Text style={styles.moreServicesText}>More Services</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Section 3: Meeting Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="people-outline" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Meeting Details</Text>
            </View>
            <TouchableOpacity
              style={styles.editLinkBtn}
              activeOpacity={0.7}
              onPress={() => setIsEditMeetingModalVisible(true)}
            >
              <Ionicons name="pencil" size={12} color="#E53935" style={{ marginRight: 2 }} />
              <Text style={styles.editLinkText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.meetingDetailsCol}>
            <View style={styles.meetingDetailItem}>
              <Ionicons name="calendar-outline" size={15} color="#E53935" style={styles.meetingItemIcon} />
              <Text style={styles.meetingLabel}>Meeting Date</Text>
              <Text style={styles.meetingValue}>{meetingDate}</Text>
            </View>

            <View style={styles.meetingDetailItem}>
              <Ionicons name="time-outline" size={15} color="#E53935" style={styles.meetingItemIcon} />
              <Text style={styles.meetingLabel}>Meeting Time</Text>
              <Text style={styles.meetingValue}>{meetingTime}</Text>
            </View>

            <View style={styles.meetingDetailItem}>
              <Ionicons name="location-outline" size={15} color="#E53935" style={styles.meetingItemIcon} />
              <Text style={styles.meetingLabel}>Meeting Location</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.meetingValue}>At Vendor's Office</Text>
                <Text style={styles.meetingSubAddress}>{meetingLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: Offers & Coupons Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="pricetag" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Offers & Promo Code</Text>
            </View>
            <TouchableOpacity
              style={styles.editLinkBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('OffersPromoCoupons')}
            >
              <Text style={styles.editLinkText}>
                {appliedCouponCode ? 'Change Coupon' : 'View Offers'}
              </Text>
            </TouchableOpacity>
          </View>

          {appliedCouponCode ? (
            <View style={styles.appliedCouponRow}>
              <View style={styles.couponTagLeft}>
                <Ionicons name="checkmark-circle" size={18} color="#16A34A" style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.appliedCouponName}>{appliedCouponCode} Applied</Text>
                  <Text style={styles.appliedCouponSavings}>
                    You save ₹{discountAmount.toLocaleString('en-IN')} on this booking!
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeCouponMiniBtn}
                onPress={() => setAppliedCouponCode(null)}
              >
                <Text style={styles.removeCouponMiniBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.emptyCouponRow}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('OffersPromoCoupons')}
            >
              <Ionicons name="ticket-outline" size={18} color="#D81B60" style={{ marginRight: 8 }} />
              <Text style={styles.emptyCouponText}>Apply Coupon (SHUBHVIVAH, FIRSTBAARAT)</Text>
              <Ionicons name="chevron-forward" size={16} color="#D81B60" />
            </TouchableOpacity>
          )}
        </View>

        {/* Section 5: Price Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconCircle}>
                <FontAwesome5 name="rupee-sign" size={13} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Price Details</Text>
            </View>
            <TouchableOpacity
              style={styles.editLinkBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('NegotiatePrice')}
            >
              <Ionicons name="pencil" size={12} color="#E53935" style={{ marginRight: 2 }} />
              <Text style={styles.editLinkText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceBreakdownList}>
            <View style={styles.priceBreakdownRow}>
              <Text style={styles.priceBreakdownLabel}>Agreed Package Amount</Text>
              <Text style={styles.priceBreakdownVal}>₹ {agreedAmount.toLocaleString('en-IN')}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.priceBreakdownRow}>
                <Text style={styles.priceDiscountLabel}>
                  Coupon Discount ({appliedCouponCode})
                </Text>
                <Text style={styles.priceDiscountVal}>- ₹ {discountAmount.toLocaleString('en-IN')}</Text>
              </View>
            )}

            <View style={styles.priceDivider} />

            <View style={styles.priceBreakdownRowTotal}>
              <Text style={styles.priceTotalLabel}>Final Total Amount</Text>
              <Text style={styles.priceTotalVal}>₹ {finalPayableAmount.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.priceAdvanceRow}>
              <Text style={styles.priceAdvanceLabel}>Advance to Confirm Now</Text>
              <Text style={styles.priceAdvanceVal}>₹ {advanceAmount.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.priceRemainingRow}>
              <Text style={styles.priceRemainingLabel}>Balance Due on Event Day</Text>
              <Text style={styles.priceRemainingVal}>₹ {remainingAtEvent.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Section 5: Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconCircle}>
                <Ionicons name="card-outline" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <TouchableOpacity
              style={styles.editLinkBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('SavedPaymentMethods')}
            >
              <Ionicons name="pencil" size={12} color="#E53935" style={{ marginRight: 2 }} />
              <Text style={styles.editLinkText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentMethodCard}>
            <View style={styles.cardLogoBox}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
            <View style={styles.paymentCardInfo}>
              <Text style={styles.paymentCardName}>HDFC Bank **** 7812</Text>
              <Text style={styles.paymentCardExpiry}>Expires 09/29</Text>
            </View>
          </View>
        </View>

        {/* Section 6: Terms & Conditions Checkbox */}
        <TouchableOpacity
          style={styles.termsRow}
          activeOpacity={0.8}
          onPress={() => setIsTermsAgreed(!isTermsAgreed)}
        >
          <View style={[styles.checkbox, isTermsAgreed && styles.checkboxActive]}>
            {isTermsAgreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text
              style={styles.termsLink}
              onPress={() => navigation?.navigate('TermsConditions')}
            >
              Terms & Conditions and Cancellation Policy
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Section 7: Bottom Action Buttons (Edit Details + Confirm Booking) */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.editDetailsBtn}
            activeOpacity={0.8}
            onPress={() => setIsEditEventModalVisible(true)}
          >
            <Ionicons name="pencil" size={16} color="#E5093A" style={{ marginRight: 6 }} />
            <Text style={styles.editDetailsBtnText}>Edit Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmBookingBtn}
            activeOpacity={0.9}
            onPress={handleConfirmBooking}
          >
            <Text style={styles.confirmBookingBtnText}>Confirm Booking</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Edit Event Details Modal */}
      <Modal
        visible={isEditEventModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditEventModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Event Details</Text>
              <TouchableOpacity onPress={() => setIsEditEventModalVisible(false)}>
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <Text style={styles.inputLabel}>Event Type</Text>
              <TextInput
                style={styles.modalInput}
                value={eventType}
                onChangeText={setEventType}
                placeholder="e.g. Wedding Ceremony, Reception"
              />

              <Text style={styles.inputLabel}>Event Date</Text>
              <TextInput
                style={styles.modalInput}
                value={eventDate}
                onChangeText={setEventDate}
                placeholder="e.g. 25 November 2026 (Wednesday)"
              />

              <Text style={styles.inputLabel}>Event Time</Text>
              <TextInput
                style={styles.modalInput}
                value={eventTime}
                onChangeText={setEventTime}
                placeholder="e.g. 6:00 PM – 11:00 PM"
              />

              <Text style={styles.inputLabel}>Event Location</Text>
              <TextInput
                style={styles.modalInput}
                value={eventLocation}
                onChangeText={setEventLocation}
                placeholder="e.g. Royal Greens, Indore, MP"
              />

              <Text style={styles.inputLabel}>Guest Count</Text>
              <TextInput
                style={styles.modalInput}
                value={guestCount}
                onChangeText={setGuestCount}
                placeholder="e.g. 300 – 400 Guests"
              />

              <TouchableOpacity
                style={styles.saveModalBtn}
                onPress={() => {
                  setIsEditEventModalVisible(false);
                  Alert.alert('Updated', 'Event details saved successfully!');
                }}
              >
                <Text style={styles.saveModalBtnText}>Save Event Details</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Meeting Details Modal */}
      <Modal
        visible={isEditMeetingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditMeetingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Meeting Details</Text>
              <TouchableOpacity onPress={() => setIsEditMeetingModalVisible(false)}>
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 350 }}>
              <Text style={styles.inputLabel}>Meeting Date</Text>
              <TextInput
                style={styles.modalInput}
                value={meetingDate}
                onChangeText={setMeetingDate}
              />

              <Text style={styles.inputLabel}>Meeting Time</Text>
              <TextInput
                style={styles.modalInput}
                value={meetingTime}
                onChangeText={setMeetingTime}
              />

              <Text style={styles.inputLabel}>Office Address</Text>
              <TextInput
                style={styles.modalInput}
                value={meetingLocation}
                onChangeText={setMeetingLocation}
              />

              <TouchableOpacity
                style={styles.saveModalBtn}
                onPress={() => {
                  setIsEditMeetingModalVisible(false);
                  Alert.alert('Updated', 'Meeting details saved successfully!');
                }}
              >
                <Text style={styles.saveModalBtnText}>Save Meeting Details</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Services Modal */}
      <Modal
        visible={isEditServicesModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditServicesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selected Package Services</Text>
              <TouchableOpacity onPress={() => setIsEditServicesModalVisible(false)}>
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 350 }}>
              {selectedServices.map((s, idx) => (
                <View key={s.id} style={styles.modalServiceRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  <Text style={styles.modalServiceName}>{s.name}</Text>
                  <Text style={styles.modalServiceIncluded}>Included</Text>
                </View>
              ))}
              <View style={styles.modalServiceRow}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text style={styles.modalServiceName}>2x Extra Flower Stands</Text>
                <Text style={styles.modalServiceIncluded}>Included</Text>
              </View>
              <View style={styles.modalServiceRow}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text style={styles.modalServiceName}>On-site Team Coordination</Text>
                <Text style={styles.modalServiceIncluded}>Included</Text>
              </View>

              <TouchableOpacity
                style={styles.saveModalBtn}
                onPress={() => setIsEditServicesModalVisible(false)}
              >
                <Text style={styles.saveModalBtnText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
  calendarGraphicBox: {
    position: 'relative',
    marginRight: 4,
  },
  checkMiniBadge: {
    position: 'absolute',
    bottom: -1,
    right: -2,
    backgroundColor: '#D81B60',
    borderRadius: 5,
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  decorativeLine4: {
    fontSize: 8,
    fontWeight: '500',
    color: '#D81B60',
    lineHeight: 9,
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

  // Vendor Card
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  vendorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorImage: {
    width: 68,
    height: 52,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#FDECEF',
  },
  vendorDetailsCol: {
    flex: 1,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  vendorRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  vendorRatingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 3,
  },
  vendorReviewsCount: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  vendorLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorLocationText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 3,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D81B60',
    marginRight: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    justifyContent: 'space-between',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1E293B',
  },

  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  editLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E53935',
  },

  // Event Details Grid
  detailsGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#556987',
    flex: 1,
  },
  detailValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1.5,
    textAlign: 'right',
  },

  // Services Scroll
  servicesScrollRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  serviceItemCard: {
    width: 72,
    alignItems: 'center',
  },
  serviceItemImg: {
    width: 70,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#FDECEF',
    marginBottom: 4,
  },
  serviceItemName: {
    fontSize: 9.5,
    color: '#1E293B',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 12,
  },
  moreServicesCard: {
    width: 70,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  moreServicesPlus: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E53935',
  },
  moreServicesText: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
    textAlign: 'center',
  },

  // Meeting Details Col
  meetingDetailsCol: {
    gap: 8,
  },
  meetingDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  meetingItemIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  meetingLabel: {
    fontSize: 12,
    color: '#556987',
    width: 110,
  },
  meetingValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  meetingSubAddress: {
    fontSize: 11,
    color: '#556987',
    marginTop: 1,
  },

  // Price Details
  priceDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  priceAmountCol: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: '#556987',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E53935',
  },
  priceBadgeCol: {
    alignItems: 'flex-end',
  },
  priceGreenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 2,
  },
  priceGreenText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  priceIncludedText: {
    fontSize: 9.5,
    color: '#64748B',
  },

  // Payment Method
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardLogoBox: {
    backgroundColor: '#1A1F71',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  visaText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  paymentCardInfo: {
    flex: 1,
  },
  paymentCardName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  paymentCardExpiry: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },

  // Terms Row
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#E5093A',
    borderColor: '#E5093A',
  },
  termsText: {
    fontSize: 11,
    color: '#334155',
    flex: 1,
    lineHeight: 16,
  },
  termsLink: {
    color: '#E5093A',
    fontWeight: '600',
  },

  // Bottom Buttons Container
  bottomButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  editDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5093A',
  },
  editDetailsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E5093A',
  },
  confirmBookingBtn: {
    flex: 1.6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5093A',
    shadowColor: '#E5093A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBookingBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  saveModalBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalServiceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginLeft: 8,
  },
  modalServiceIncluded: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },

  // Applied Coupon Row
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 10,
  },
  couponTagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedCouponName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  appliedCouponSavings: {
    fontSize: 10.5,
    color: '#166534',
    marginTop: 1,
  },
  removeCouponMiniBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
  },
  removeCouponMiniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },

  // Empty Coupon Row
  emptyCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E8',
    borderRadius: 10,
    padding: 10,
  },
  emptyCouponText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D81B60',
    flex: 1,
  },

  // Price Breakdown List
  priceBreakdownList: {
    paddingVertical: 4,
  },
  priceBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  priceBreakdownLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  priceBreakdownVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  priceDiscountLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#16A34A',
  },
  priceDiscountVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  priceBreakdownRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceTotalLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  priceTotalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#D81B60',
  },
  priceAdvanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  priceAdvanceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9F1239',
  },
  priceAdvanceVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E5093A',
  },
  priceRemainingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  priceRemainingLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  priceRemainingVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});
