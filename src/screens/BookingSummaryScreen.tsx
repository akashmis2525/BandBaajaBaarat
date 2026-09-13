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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { useLocation } from '../context/LocationContext';

interface BookingSummaryProps {
  route?: {
    params?: {
      vendor?: {
        id: string;
        name: string;
        category: string;
        rating: number;
        reviewsCount: number;
        experienceYears: number;
        distanceKm: number;
        startingPrice: number;
        image: any;
        photosCount: number;
        isVerified: boolean;
        type: string;
      };
      serviceName?: string;
    };
  };
  navigation?: any;
  onBack?: () => void;
}

export const BookingSummaryScreen: React.FC<BookingSummaryProps> = ({
  route,
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const { location } = useLocation();

  const vendorData = route?.params?.vendor || {
    id: 'v2',
    name: 'Royal Beats Dhol Group',
    category: 'Dhol',
    rating: 4.6,
    reviewsCount: 210,
    experienceYears: 5,
    distanceKm: 3.1,
    startingPrice: 8000,
    image: Assets.serviceBrassBand,
    photosCount: 8,
    isVerified: true,
    type: 'Professional Group',
  };

  const serviceName = route?.params?.serviceName || 'Dhol Services';

  // Event Details State
  const [eventDate, setEventDate] = useState('15 Nov 2026, Sunday');
  const [eventTimeSlot, setEventTimeSlot] = useState('Evening (5:00 PM - 9:00 PM)');
  const [eventLocation, setEventLocation] = useState(
    `${location?.city || 'Indore'}, ${location?.state || 'Madhya Pradesh'}`
  );

  // Modals State
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  // Financial Breakdown Calculations
  const basePrice = vendorData.startingPrice || 8000;
  const artistCharges = 2000;
  const travelSetupCharges = 1000;
  const totalAmount = basePrice + artistCharges + travelSetupCharges;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const handleContinuePayment = () => {
    navigation?.navigate('Payment', {
      vendor: vendorData,
      eventDate,
      eventTime: eventTimeSlot,
      eventLocation,
      totalAmount,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF7F4" />

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
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.headerBackBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Booking <Text style={styles.headerTitleMaroon}>Summary</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Check your details before you proceed</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeText}>Dhol Ki</Text>
          <Text style={styles.scriptBadgeText}>Dhamak, Shaadi</Text>
          <Text style={styles.scriptBadgeText}>Ki Raunak ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Service Summary Card */}
        <View style={styles.serviceSummaryCard}>
          <Image source={Assets.groomBaarat} style={styles.serviceImg} />

          <View style={styles.serviceInfoCol}>
            <View style={styles.serviceTagPriceRow}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>Dhol</Text>
              </View>

              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeAmount}>₹{basePrice.toLocaleString('en-IN')}</Text>
                <Text style={styles.priceBadgeOnwards}>onwards</Text>
              </View>
            </View>

            <Text style={styles.serviceHeading}>Dhol Services</Text>
            <Text style={styles.serviceTaglineText}>
              Traditional Dhol beats to make your special moments more grand and lively.
            </Text>

            {/* 3 Circular Feature Badges */}
            <View style={styles.featuresRow}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name="musical-notes" size={13} color="#8A072D" />
                </View>
                <Text style={styles.featureLabel}>Live{'\n'}Performance</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name="people" size={13} color="#8A072D" />
                </View>
                <Text style={styles.featureLabel}>Professional{'\n'}Artists</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name="shield-checkmark" size={13} color="#8A072D" />
                </View>
                <Text style={styles.featureLabel}>Verified{'\n'}Vendor</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Selected Vendor Card */}
        <TouchableOpacity
          style={styles.vendorCard}
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert(vendorData.name, `Rating: ${vendorData.rating} ⭐ • Verified Wedding Partner`)
          }
        >
          {/* Vendor Logo Emblem */}
          <LinearGradient
            colors={['#8A072D', '#5E041E', '#3D0212']}
            style={styles.vendorEmblem}
          >
            <FontAwesome5 name="crown" size={12} color="#F3D09C" style={{ marginBottom: 2 }} />
            <Text style={styles.emblemText1}>Royal Beats</Text>
            <Text style={styles.emblemText2}>— DHOL GROUP —</Text>
          </LinearGradient>

          <View style={styles.vendorDetailsCol}>
            <View style={styles.vendorNameRow}>
              <Text style={styles.vendorNameText} numberOfLines={1}>
                {vendorData.name}
              </Text>
              <Ionicons name="checkmark-circle" size={15} color="#8A072D" />
            </View>

            <View style={styles.vendorRatingRow}>
              <Ionicons name="star" size={12} color="#E59819" />
              <Text style={styles.ratingText}>{vendorData.rating}</Text>
              <Text style={styles.reviewsText}>({vendorData.reviewsCount} reviews)</Text>
              <Text style={styles.pipeText}>|</Text>
              <Text style={styles.expText}>{vendorData.experienceYears}+ Years</Text>
            </View>

            <View style={styles.vendorDistanceRow}>
              <Ionicons name="location-outline" size={12} color="#8A072D" />
              <Text style={styles.distanceText}>{vendorData.distanceKm} KM away</Text>
            </View>

            <View style={styles.badgesRow}>
              <View style={styles.badgePill}>
                <Ionicons name="shield-outline" size={10} color="#8A072D" />
                <Text style={styles.badgePillText}>{vendorData.type || 'Professional Group'}</Text>
              </View>
              <View style={styles.badgePill}>
                <Ionicons name="calendar-outline" size={10} color="#8A072D" />
                <Text style={styles.badgePillText}>Available on your date</Text>
              </View>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#9C8B8E" />
        </TouchableOpacity>

        {/* Event Date & Time Card */}
        <View style={styles.infoCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar" size={18} color="#8A072D" />
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoCardTitle}>Event Date & Time</Text>
            <View style={styles.infoDetailRow}>
              <Ionicons name="calendar-outline" size={13} color="#8A072D" />
              <Text style={styles.infoDetailText}>{eventDate}</Text>
            </View>
            <View style={styles.infoDetailRow}>
              <Ionicons name="time-outline" size={13} color="#8A072D" />
              <Text style={styles.infoDetailText}>{eventTimeSlot}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => setShowDateModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={12} color="#8A072D" />
            <Text style={styles.editPillBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Event Location Card */}
        <TouchableOpacity
          style={styles.infoCard}
          onPress={() => setShowLocationModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={18} color="#8A072D" />
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoCardTitle}>Event Location</Text>
            <Text style={styles.infoLocationText}>{eventLocation}</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#9C8B8E" />
        </TouchableOpacity>

        {/* Price Breakup Card */}
        <View style={styles.priceBreakupCard}>
          <Text style={styles.priceBreakupTitle}>Price Breakup</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Dhol Services (Basic Package)</Text>
            <Text style={styles.priceValue}>₹{basePrice.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Artist Charges</Text>
            <Text style={styles.priceValue}>₹{artistCharges.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Travel & Setup Charges</Text>
            <Text style={styles.priceValue}>₹{travelSetupCharges.toLocaleString('en-IN')}</Text>
          </View>

          {/* Highlighted Total Amount Row */}
          <View style={styles.totalAmountBox}>
            <Text style={styles.totalAmountLabel}>Total Amount</Text>
            <Text style={styles.totalAmountValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* 100% Safe & Secure Booking Banner */}
        <View style={styles.safeSecureBanner}>
          <View style={styles.shieldIconWrapper}>
            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.safeSecureTextCol}>
            <Text style={styles.safeSecureTitle}>100% Safe & Secure Booking</Text>
            <Text style={styles.safeSecureSubtitle}>
              Your payment and personal details are always protected.
            </Text>
          </View>
        </View>

        {/* Continue to Payment CTA */}
        <TouchableOpacity
          style={styles.continuePaymentBtn}
          activeOpacity={0.85}
          onPress={handleContinuePayment}
        >
          <Text style={styles.continuePaymentBtnText}>Continue to Payment</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.secureGatewayRow}>
          <Ionicons name="lock-closed" size={13} color="#6E5C60" />
          <Text style={styles.secureGatewayText}>Secure Payment Gateway</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Date & Time Picker Modal */}
      <Modal visible={showDateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Wedding Event Date</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {[
              { date: '15 Nov 2026, Sunday', time: 'Evening (5:00 PM - 9:00 PM)' },
              { date: '22 Nov 2026, Sunday', time: 'Night (7:00 PM - 11:00 PM)' },
              { date: '04 Dec 2026, Friday', time: 'Evening (4:30 PM - 8:30 PM)' },
              { date: '12 Dec 2026, Saturday', time: 'Morning (10:00 AM - 2:00 PM)' },
            ].map((slot) => (
              <TouchableOpacity
                key={slot.date}
                style={[
                  styles.slotOptionRow,
                  eventDate === slot.date && styles.slotOptionRowActive,
                ]}
                onPress={() => {
                  setEventDate(slot.date);
                  setEventTimeSlot(slot.time);
                  setShowDateModal(false);
                }}
              >
                <View>
                  <Text
                    style={[
                      styles.slotOptionDate,
                      eventDate === slot.date && styles.slotOptionDateActive,
                    ]}
                  >
                    {slot.date}
                  </Text>
                  <Text style={styles.slotOptionTime}>{slot.time}</Text>
                </View>
                {eventDate === slot.date && (
                  <Ionicons name="checkmark-circle" size={18} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Location Picker Modal */}
      <Modal visible={showLocationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Wedding Venue City</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {[
              'Indore, Madhya Pradesh',
              'Jaipur, Rajasthan',
              'Udaipur, Rajasthan',
              'Bhopal, Madhya Pradesh',
              'Delhi NCR',
              'Mumbai, Maharashtra',
            ].map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.slotOptionRow,
                  eventLocation === loc && styles.slotOptionRowActive,
                ]}
                onPress={() => {
                  setEventLocation(loc);
                  setShowLocationModal(false);
                }}
              >
                <Text
                  style={[
                    styles.slotOptionDate,
                    eventLocation === loc && styles.slotOptionDateActive,
                  ]}
                >
                  {loc}
                </Text>
                {eventLocation === loc && (
                  <Ionicons name="checkmark-circle" size={18} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Payment Success Dialog */}
      <Modal visible={showPaymentSuccessModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Booking Confirmed! 🎉</Text>
            <Text style={styles.successSubtitle}>
              Your wedding booking with {vendorData.name} has been placed successfully.
            </Text>

            <View style={styles.successSummaryBox}>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Booking ID:</Text>
                <Text style={styles.successVal}>#BBB-2026-9044</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Event Date:</Text>
                <Text style={styles.successVal}>{eventDate}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Advance Paid:</Text>
                <Text style={styles.successValGreen}>₹{(totalAmount * 0.4).toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Balance on Event:</Text>
                <Text style={styles.successVal}>₹{(totalAmount * 0.6).toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewMyBookingsBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowPaymentSuccessModal(false);
                navigation?.navigate('Bookings');
              }}
            >
              <Text style={styles.viewMyBookingsBtnText}>Go to My Bookings</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
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
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2E4DE',
  },
  headerBackBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A040A',
  },
  headerTitleMaroon: {
    color: '#8A072D',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#736064',
    marginTop: 1,
  },
  scriptBadge: {
    alignItems: 'flex-end',
    marginLeft: 2,
  },
  scriptBadgeText: {
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 10.5,
  },
  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // Service Summary Card
  serviceSummaryCard: {
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
  serviceImg: {
    width: 100,
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#FDECE6',
  },
  serviceInfoCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceTagPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: '#FDECE6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  priceBadge: {
    alignItems: 'flex-end',
  },
  priceBadgeAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
  },
  priceBadgeOnwards: {
    fontSize: 8,
    color: '#7A686C',
    lineHeight: 10,
  },
  serviceHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A040A',
    marginTop: 2,
  },
  serviceTaglineText: {
    fontSize: 9,
    color: '#6E5C60',
    lineHeight: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F5CFC0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  featureLabel: {
    fontSize: 7,
    fontWeight: '700',
    color: '#4A3B3E',
    textAlign: 'center',
    lineHeight: 8.5,
  },

  // Vendor Card
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  vendorEmblem: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  emblemText1: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emblemText2: {
    fontSize: 5.5,
    fontWeight: '700',
    color: '#F3D09C',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  vendorDetailsCol: {
    flex: 1,
    gap: 2,
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendorNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  vendorRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsText: {
    fontSize: 9.5,
    color: '#736064',
  },
  pipeText: {
    fontSize: 9.5,
    color: '#D0BDBE',
  },
  expText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#736064',
  },
  vendorDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distanceText: {
    fontSize: 9.5,
    color: '#736064',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FDECE6',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  badgePillText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#8A072D',
  },

  // Info Cards (Date & Location)
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    gap: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
    marginBottom: 2,
  },
  infoDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  infoDetailText: {
    fontSize: 10.5,
    color: '#554246',
  },
  infoLocationText: {
    fontSize: 11,
    color: '#554246',
    marginTop: 1,
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8A072D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.borderRadius.round,
    gap: 3,
  },
  editPillBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#8A072D',
  },

  // Price Breakup Card
  priceBreakupCard: {
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
  priceBreakupTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1A040A',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 11,
    color: '#554246',
  },
  priceValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  totalAmountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDECE6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  totalAmountLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  totalAmountValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8A072D',
  },

  // Safe & Secure Banner
  safeSecureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF0EB',
    borderWidth: 1,
    borderColor: '#F5CFC0',
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  shieldIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8A072D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeSecureTextCol: {
    flex: 1,
  },
  safeSecureTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A072D',
  },
  safeSecureSubtitle: {
    fontSize: 9,
    color: '#6E5C60',
    marginTop: 1,
  },

  // Continue to Payment CTA
  continuePaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    paddingVertical: 13,
    borderRadius: Spacing.borderRadius.round,
    marginTop: 4,
    gap: 6,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
  },
  continuePaymentBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  secureGatewayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  secureGatewayText: {
    fontSize: 10,
    color: '#6E5C60',
    fontWeight: '600',
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A040A',
  },
  slotOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7E9E3',
  },
  slotOptionRowActive: {
    backgroundColor: '#FDECE6',
    borderRadius: 8,
  },
  slotOptionDate: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1A040A',
  },
  slotOptionDateActive: {
    color: '#8A072D',
    fontWeight: '800',
  },
  slotOptionTime: {
    fontSize: 10,
    color: '#7A686C',
    marginTop: 1,
  },

  // Success Modal
  successModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#27A844',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A040A',
  },
  successSubtitle: {
    fontSize: 11,
    color: '#6E5C60',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 15,
  },
  successSummaryBox: {
    width: '100%',
    backgroundColor: '#FAF5F2',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    marginBottom: 16,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successLabel: {
    fontSize: 11,
    color: '#736064',
  },
  successVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  successValGreen: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#27A844',
  },
  viewMyBookingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    width: '100%',
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.round,
    gap: 6,
  },
  viewMyBookingsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
