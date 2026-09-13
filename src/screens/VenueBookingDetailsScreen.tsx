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
  Share,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const VenueBookingDetailsScreen: React.FC<{ navigation?: any; route?: any; onBack?: () => void }> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const [isFavorite, setIsFavorite] = useState(true);
  const [selectedDate, setSelectedDate] = useState('20 Dec 2026');
  const [selectedTime, setSelectedTime] = useState('7:00 PM - 11:00 PM');
  const [showFullAbout, setShowFullAbout] = useState(false);

  // Modals state
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  const venueImages = [
    Assets.serviceDecorators,
    Assets.weddingMandapArt,
    Assets.serviceDhol,
    Assets.serviceDj,
    Assets.serviceBrassBand,
    Assets.serviceBuggi,
    Assets.serviceClothes,
    Assets.serviceMehndi,
    Assets.serviceJewellery,
    Assets.serviceShoes,
  ];

  const timeSlots = [
    '10:00 AM - 2:00 PM (Morning Slot)',
    '3:00 PM - 6:00 PM (Evening Baarat)',
    '7:00 PM - 11:00 PM (Grand Reception)',
    'Full Day Access (10:00 AM - 11:00 PM)',
  ];

  const calendarDates = [
    { day: 'Sun', date: '20 Dec 2026', available: true },
    { day: 'Mon', date: '21 Dec 2026', available: true },
    { day: 'Tue', date: '22 Dec 2026', available: false },
    { day: 'Wed', date: '23 Dec 2026', available: true },
    { day: 'Thu', date: '24 Dec 2026', available: true },
    { day: 'Fri', date: '25 Dec 2026', available: true },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('CompareServices');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Check out The Grand Palace Banquet Hall in Indore on Band Baaja Baarat app! Starting at ₹75,000 per event.\nhttps://bandbaajabaarat.in/venue/the-grand-palace',
        title: 'The Grand Palace Banquet Hall',
      });
    } catch (e) {
      Alert.alert('Share', 'Sharing The Grand Palace');
    }
  };

  const handleContactVendor = () => {
    Alert.alert(
      'Contact The Grand Palace Events',
      'Phone: +91 98265 99887\nAddress: 123, AB Road, Vijay Nagar, Indore',
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Chat on App',
          onPress: () => navigation?.navigate('ChatMain', { vendorName: 'The Grand Palace Events' }),
        },
        {
          text: 'Call Now',
          onPress: () => Alert.alert('Calling Vendor', 'Connecting call to +91 98265 99887...'),
        },
      ]
    );
  };

  const handleBookNow = () => {
    navigation?.navigate('PaymentBooking', {
      serviceTitle: 'The Grand Palace',
      category: 'Banquet Hall',
      price: 75000,
      date: selectedDate,
      time: selectedTime,
      location: '123, AB Road, Vijay Nagar, Indore, Madhya Pradesh',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
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
            Booking <Text style={styles.headerTitleMaroon}>Details</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Complete information about your selected service</Text>
        </View>

        <View style={styles.headerIconsRow}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              setIsFavorite(!isFavorite);
              Alert.alert(
                !isFavorite ? 'Saved to Favorites ❤️' : 'Removed from Favorites',
                !isFavorite
                  ? 'The Grand Palace has been added to your wishlist.'
                  : 'Removed from wishlist.'
              );
            }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? '#DC2626' : '#1A040A'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerIconBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color="#1A040A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Banner with Badges */}
        <View style={styles.heroImageWrapper}>
          <Image source={venueImages[selectedGalleryIdx]} style={styles.heroImage} />

          {/* Top-Left Top Rated Badge */}
          <View style={styles.topRatedBadge}>
            <Ionicons name="star-outline" size={12} color="#FFFFFF" />
            <Text style={styles.topRatedBadgeText}>Top Rated</Text>
          </View>

          {/* Top-Right 1/10 Counter */}
          <View style={styles.photoCountBadge}>
            <Text style={styles.photoCountText}>{selectedGalleryIdx + 1} / 10</Text>
          </View>

          {/* Bottom-Right View Gallery Button */}
          <TouchableOpacity
            style={styles.viewGalleryBtn}
            activeOpacity={0.85}
            onPress={() => setShowGalleryModal(true)}
          >
            <Ionicons name="images-outline" size={15} color="#1A040A" />
            <Text style={styles.viewGalleryBtnText}>View Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Title, Category & Price Header Card */}
        <View style={styles.titlePriceRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.venueTitle}>The Grand Palace</Text>
            <Text style={styles.venueCategory}>Banquet Hall</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.reviewsCountText}>(320 reviews)</Text>
            </View>
          </View>

          <View style={styles.priceCol}>
            <Text style={styles.priceAmount}>₹75,000</Text>
            <Text style={styles.priceStartingLabel}>Starting Price</Text>
            <Text style={styles.pricePerEventLabel}>(Per Event)</Text>
          </View>
        </View>

        {/* 5 Key Feature Highlights */}
        <View style={styles.featuresRow}>
          {/* 1. Guest Capacity */}
          <View style={styles.featurePill}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="people" size={16} color="#8A072D" />
            </View>
            <Text style={styles.featureValText}>500+</Text>
            <Text style={styles.featureDescText}>Guest Capacity</Text>
          </View>

          {/* 2. Spacious Hall */}
          <View style={styles.featurePill}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="business" size={16} color="#8A072D" />
            </View>
            <Text style={styles.featureValText}>Spacious</Text>
            <Text style={styles.featureDescText}>Hall</Text>
          </View>

          {/* 3. Parking */}
          <View style={styles.featurePill}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="car" size={16} color="#8A072D" />
            </View>
            <Text style={styles.featureValText}>Parking</Text>
            <Text style={styles.featureDescText}>Available</Text>
          </View>

          {/* 4. In-house Catering */}
          <View style={styles.featurePill}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="restaurant" size={16} color="#8A072D" />
            </View>
            <Text style={styles.featureValText}>In-house</Text>
            <Text style={styles.featureDescText}>Catering</Text>
          </View>

          {/* 5. Fully AC */}
          <View style={styles.featurePill}>
            <View style={styles.featureIconCircle}>
              <Ionicons name="snow" size={16} color="#8A072D" />
            </View>
            <Text style={styles.featureValText}>Fully</Text>
            <Text style={styles.featureDescText}>Air Conditioned</Text>
          </View>
        </View>

        {/* About This Venue Card */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeaderTitle}>About This Venue</Text>
          <Text style={styles.aboutBodyText}>
            The Grand Palace is a premium banquet hall in Indore, perfect for weddings, receptions, engagement ceremonies and other special occasions. With luxurious interiors, modern amenities and a professional team, we make your celebrations truly memorable.
          </Text>
          {showFullAbout && (
            <Text style={[styles.aboutBodyText, { marginTop: 6 }]}>
              • 15,000 sq.ft. carpet area pillarless grand ballroom.{'\n'}
              • 2 Complimentary luxury green rooms for bride & groom.{'\n'}
              • 100% power backup with dual industrial generators.{'\n'}
              • Valet parking management for up to 300 cars.
            </Text>
          )}
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={() => setShowFullAbout(!showFullAbout)}
          >
            <Text style={styles.readMoreText}>
              {showFullAbout ? 'Show Less ∧' : 'Read More ∨'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Select Date & Time Selectors Row */}
        <View style={styles.dateTimeRow}>
          {/* Select Date Card */}
          <TouchableOpacity
            style={styles.dateTimeCard}
            activeOpacity={0.75}
            onPress={() => setShowDatePickerModal(true)}
          >
            <View style={styles.dateTimeIconCircle}>
              <Ionicons name="calendar-outline" size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dateTimeLabel}>Select Date</Text>
              <Text style={styles.dateTimeVal}>{selectedDate}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#8A072D" />
          </TouchableOpacity>

          {/* Select Time Card */}
          <TouchableOpacity
            style={styles.dateTimeCard}
            activeOpacity={0.75}
            onPress={() => setShowTimePickerModal(true)}
          >
            <View style={styles.dateTimeIconCircle}>
              <Ionicons name="time-outline" size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dateTimeLabel}>Select Time</Text>
              <Text style={styles.dateTimeVal}>{selectedTime}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#8A072D" />
          </TouchableOpacity>
        </View>

        {/* Location & Map Snapshot */}
        <View style={styles.locationContainer}>
          {/* Left Address Column */}
          <View style={styles.addressLeftCol}>
            <View style={styles.locPinCircle}>
              <Ionicons name="location-sharp" size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationTitle}>Location</Text>
              <Text style={styles.locationAddressText}>
                123, AB Road, Vijay Nagar,{'\n'}Indore, Madhya Pradesh
              </Text>
            </View>
          </View>

          {/* Right Interactive Map Snapshot */}
          <TouchableOpacity
            style={styles.mapSnapshotCard}
            activeOpacity={0.8}
            onPress={() => setShowMapModal(true)}
          >
            <Ionicons name="location" size={20} color="#DC2626" style={{ alignSelf: 'center' }} />
            <View style={styles.viewOnMapBadge}>
              <Ionicons name="open-outline" size={11} color="#8A072D" />
              <Text style={styles.viewOnMapText}>View on Map</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Managed By Vendor Row */}
        <View style={styles.managedByCard}>
          <Image source={Assets.serviceDecorators} style={styles.vendorAvatar} />
          <View style={{ flex: 1, gap: 1 }}>
            <Text style={styles.managedByLabel}>Managed by</Text>
            <Text style={styles.vendorNameBold}>The Grand Palace Events</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.vendorRatingNum}>4.8</Text>
              <Text style={styles.vendorReviewsCount}>(320 reviews)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.contactVendorBtn}
            activeOpacity={0.8}
            onPress={handleContactVendor}
          >
            <Ionicons name="call" size={12} color="#8A072D" />
            <Text style={styles.contactVendorBtnText}>Contact Vendor</Text>
          </TouchableOpacity>
        </View>

        {/* Policies Section */}
        <View style={styles.policiesCard}>
          <Text style={styles.sectionHeaderTitle}>Policies</Text>
          <View style={styles.policiesRow}>
            {/* Policy 1 */}
            <View style={styles.policyCol}>
              <View style={styles.policyIconCircle}>
                <Ionicons name="card-outline" size={16} color="#DC2626" />
              </View>
              <Text style={styles.policyTitle}>50% Advance</Text>
              <Text style={styles.policySub}>To confirm booking</Text>
            </View>

            {/* Policy 2 */}
            <View style={styles.policyCol}>
              <View style={styles.policyIconCircle}>
                <Ionicons name="calendar-outline" size={16} color="#DC2626" />
              </View>
              <Text style={styles.policyTitle}>Free Cancellation</Text>
              <Text style={styles.policySub}>Up to 7 days before</Text>
            </View>

            {/* Policy 3 */}
            <View style={styles.policyCol}>
              <View style={styles.policyIconCircle}>
                <Ionicons name="shield-checkmark" size={16} color="#DC2626" />
              </View>
              <Text style={styles.policyTitle}>Secure Booking</Text>
              <Text style={styles.policySub}>100% Safe & Secure</Text>
            </View>
          </View>
        </View>

        {/* Full-width Book Now Action Button */}
        <TouchableOpacity
          style={styles.bookNowActionBtn}
          activeOpacity={0.88}
          onPress={handleBookNow}
        >
          <Ionicons name="calendar" size={18} color="#FFFFFF" />
          <Text style={styles.bookNowActionBtnText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* Gallery Modal */}
      <Modal visible={showGalleryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Venue Photo Gallery</Text>
                <Text style={styles.modalSubtitle}>10 Photos of The Grand Palace</Text>
              </View>
              <TouchableOpacity onPress={() => setShowGalleryModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <Image source={venueImages[selectedGalleryIdx]} style={styles.modalHeroGalleryImage} />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
              {venueImages.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.galleryThumbWrapper,
                    selectedGalleryIdx === idx && styles.galleryThumbSelected,
                  ]}
                  onPress={() => setSelectedGalleryIdx(idx)}
                >
                  <Image source={img} style={styles.galleryThumbImg} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => setShowGalleryModal(false)}
            >
              <Text style={styles.primaryModalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePickerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Event Date</Text>
              <TouchableOpacity onPress={() => setShowDatePickerModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {calendarDates.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.pickerOptionRow,
                  selectedDate === item.date && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setSelectedDate(item.date);
                  setShowDatePickerModal(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name="calendar-outline" size={18} color="#8A072D" />
                  <Text style={styles.pickerOptionText}>{item.date} ({item.day})</Text>
                </View>
                {selectedDate === item.date && (
                  <Ionicons name="checkmark-circle" size={20} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePickerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time Slot</Text>
              <TouchableOpacity onPress={() => setShowTimePickerModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {timeSlots.map((slot, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.pickerOptionRow,
                  selectedTime === slot.split(' (')[0] && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setSelectedTime(slot.split(' (')[0]);
                  setShowTimePickerModal(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name="time-outline" size={18} color="#8A072D" />
                  <Text style={styles.pickerOptionText}>{slot}</Text>
                </View>
                {selectedTime === slot.split(' (')[0] && (
                  <Ionicons name="checkmark-circle" size={20} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Map View Modal */}
      <Modal visible={showMapModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Venue Location Map</Text>
                <Text style={styles.modalSubtitle}>123, AB Road, Vijay Nagar, Indore</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMapModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <View style={styles.mapSimulationBox}>
              <Ionicons name="location" size={36} color="#DC2626" />
              <Text style={styles.mapSimulationTitle}>The Grand Palace</Text>
              <Text style={styles.mapSimulationSub}>Vijay Nagar Square, AB Road, Indore</Text>
              <Text style={styles.mapDistanceBadge}>📍 4.2 km from your current location</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => {
                setShowMapModal(false);
                Alert.alert('Directions', 'Opening GPS directions to The Grand Palace Indore...');
              }}
            >
              <Text style={styles.primaryModalBtnText}>Get Directions</Text>
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
    fontSize: 10,
    color: '#736064',
    marginTop: 1,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    padding: 4,
  },

  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // Hero Image Banner
  heroImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5E6DF',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topRatedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A072D',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  topRatedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  photoCountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  viewGalleryBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
    elevation: 3,
  },
  viewGalleryBtnText: {
    color: '#1A040A',
    fontSize: 10.5,
    fontWeight: '800',
  },

  // Title Price Row
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
  },
  venueTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A040A',
  },
  venueCategory: {
    fontSize: 11,
    color: '#736064',
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsCountText: {
    fontSize: 10,
    color: '#736064',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#8A072D',
  },
  priceStartingLabel: {
    fontSize: 9.5,
    color: '#736064',
  },
  pricePerEventLabel: {
    fontSize: 9,
    color: '#8E7C80',
  },

  // 5 Features Row
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 4,
  },
  featurePill: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  featureIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  featureValText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A040A',
    textAlign: 'center',
  },
  featureDescText: {
    fontSize: 7.5,
    color: '#736064',
    textAlign: 'center',
    lineHeight: 9,
  },

  // About Section Card
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  aboutBodyText: {
    fontSize: 10.5,
    color: '#554246',
    lineHeight: 15,
  },
  readMoreBtn: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  readMoreText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Date & Time Row
  dateTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTimeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 6,
  },
  dateTimeIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTimeLabel: {
    fontSize: 8.5,
    color: '#736064',
  },
  dateTimeVal: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
    marginTop: 1,
  },

  // Location Snapshot
  locationContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 8,
    alignItems: 'center',
  },
  addressLeftCol: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  locPinCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
  },
  locationAddressText: {
    fontSize: 9,
    color: '#554246',
    lineHeight: 12,
    marginTop: 1,
  },
  mapSnapshotCard: {
    flex: 0.9,
    height: 58,
    backgroundColor: '#EBF4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2E3E8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  viewOnMapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  viewOnMapText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Managed By Row
  managedByCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 8,
  },
  vendorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5E6DF',
  },
  managedByLabel: {
    fontSize: 8.5,
    color: '#8E7C80',
  },
  vendorNameBold: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  vendorRatingNum: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A040A',
  },
  vendorReviewsCount: {
    fontSize: 9,
    color: '#736064',
  },
  contactVendorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8A072D',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
    backgroundColor: '#FFFFFF',
  },
  contactVendorBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Policies Card
  policiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    gap: 8,
  },
  policiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  policyCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  policyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  policyTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A040A',
    textAlign: 'center',
  },
  policySub: {
    fontSize: 7.5,
    color: '#736064',
    textAlign: 'center',
  },

  // Book Now Button
  bookNowActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 13,
    gap: 8,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 4,
  },
  bookNowActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
  },
  modalSubtitle: {
    fontSize: 10,
    color: '#736064',
    marginTop: 1,
  },
  modalHeroGalleryImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  galleryThumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  galleryThumbSelected: {
    borderColor: '#8A072D',
  },
  galleryThumbImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pickerOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
  },
  pickerOptionSelected: {
    backgroundColor: '#FFF7F5',
    borderRadius: 8,
  },
  pickerOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
  },
  mapSimulationBox: {
    height: 140,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 8,
  },
  mapSimulationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A040A',
  },
  mapSimulationSub: {
    fontSize: 10,
    color: '#554246',
  },
  mapDistanceBadge: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },
  primaryModalBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
