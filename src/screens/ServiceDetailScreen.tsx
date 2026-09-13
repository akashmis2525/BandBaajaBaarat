import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { useLocation } from '../context/LocationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface VendorItem {
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
  type: 'Professional Group' | 'Individual Artist';
  isAvailable: boolean;
}

interface ServiceDetailScreenProps {
  route?: {
    params?: {
      serviceName?: string;
      serviceTagline?: string;
      serviceImage?: any;
    };
  };
  navigation?: any;
  onBack?: () => void;
}

export const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({
  route,
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const { location } = useLocation();
  const currentCity = location?.city || 'Indore';
  const currentState = location?.state || 'Madhya Pradesh';

  const serviceName = route?.params?.serviceName || 'Dhol';
  const serviceTagline =
    route?.params?.serviceTagline ||
    'Make every beat special with professional Dhol artists for your wedding celebrations.';

  const [selectedDate, setSelectedDate] = useState('15 Nov 2026');
  const [activeSort, setActiveSort] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance'>('recommended');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  
  // Modals state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPostRequirementModal, setShowPostRequirementModal] = useState(false);

  // Post Requirement Form State
  const [reqName, setReqName] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqDate, setReqDate] = useState(selectedDate);
  const [reqBudget, setReqBudget] = useState('₹8,000 - ₹15,000');
  const [reqDetails, setReqDetails] = useState('');
  const [reqDholCount, setReqDholCount] = useState('2 Dhol + 1 Tasha');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Book top verified ${serviceName} artists in ${currentCity} on Band Baaja Baarat! Shaadi Ki Har Zarurat Ek Jagah.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const rawVendors: VendorItem[] = [
    {
      id: 'v1',
      name: 'Sharma Dhol Group',
      category: 'Dhol',
      rating: 4.8,
      reviewsCount: 320,
      experienceYears: 8,
      distanceKm: 2.4,
      startingPrice: 8000,
      image: Assets.serviceDhol,
      photosCount: 5,
      isVerified: true,
      type: 'Professional Group',
      isAvailable: true,
    },
    {
      id: 'v2',
      name: 'Royal Beats Dhol Party',
      category: 'Dhol',
      rating: 4.6,
      reviewsCount: 210,
      experienceYears: 5,
      distanceKm: 3.1,
      startingPrice: 10000,
      image: Assets.serviceBrassBand,
      photosCount: 8,
      isVerified: true,
      type: 'Professional Group',
      isAvailable: true,
    },
    {
      id: 'v3',
      name: 'Maa Narmada Dhol Group',
      category: 'Dhol',
      rating: 4.9,
      reviewsCount: 486,
      experienceYears: 12,
      distanceKm: 4.2,
      startingPrice: 12000,
      image: Assets.serviceDhol,
      photosCount: 6,
      isVerified: true,
      type: 'Professional Group',
      isAvailable: true,
    },
    {
      id: 'v4',
      name: 'Indore Dhol Artist',
      category: 'Dhol',
      rating: 4.5,
      reviewsCount: 132,
      experienceYears: 3,
      distanceKm: 1.8,
      startingPrice: 5000,
      image: Assets.serviceDj,
      photosCount: 4,
      isVerified: true,
      type: 'Individual Artist',
      isAvailable: true,
    },
  ];

  // Apply sorting
  const vendors = [...rawVendors].sort((a, b) => {
    if (activeSort === 'price_low') return a.startingPrice - b.startingPrice;
    if (activeSort === 'price_high') return b.startingPrice - a.startingPrice;
    if (activeSort === 'rating') return b.rating - a.rating;
    if (activeSort === 'distance') return a.distanceKm - b.distanceKm;
    return 0; // recommended
  });

  const handleRequirementSubmit = () => {
    if (!reqPhone || reqPhone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    Alert.alert(
      'Requirement Posted Successfully! 🎉',
      `Thank you! Top ${serviceName} vendors in ${currentCity} will contact you shortly with personalized wedding packages.`,
      [
        {
          text: 'Great!',
          onPress: () => {
            setShowPostRequirementModal(false);
            setReqDetails('');
          },
        },
      ]
    );
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
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        {/* Brand Logo & Tagline */}
        <View style={styles.headerBrandCol}>
          <Image source={Assets.logoLight} style={styles.headerLogoImg} />
          <View style={styles.headerBrandTaglines}>
            <Text style={styles.headerBrandTagline1}>SHAADI KI HAR</Text>
            <Text style={styles.headerBrandTagline1}>ZARURAT</Text>
            <Text style={styles.headerBrandTagline2}>EK JAGAH ➔</Text>
          </View>
        </View>

        {/* Header Right: Wishlist, Share, & Quote */}
        <View style={styles.headerRightCol}>
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => Alert.alert('Wishlist', 'Saved to your favorites!')}
          >
            <Ionicons name="heart-outline" size={22} color="#1A040A" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIconBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={21} color="#1A040A" />
          </TouchableOpacity>

          <View style={styles.scriptBadge}>
            <Text style={styles.scriptBadgeText}>Baarat</Text>
            <Text style={styles.scriptBadgeText}>Bina Dhol</Text>
            <Text style={styles.scriptBadgeText}>Adhuri Hai ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Hero Banner with Dhol Visual */}
        <View style={styles.heroBanner}>
          <Image source={Assets.groomBaarat} style={styles.heroBackgroundImg} />
          <LinearGradient
            colors={['rgba(255,248,245,0.92)', 'rgba(255,248,245,0.75)', 'rgba(255,248,245,0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              <Text style={styles.heroTitleMaroon}>{serviceName}</Text> Services
            </Text>
            <Text style={styles.heroSubtitle}>{serviceTagline}</Text>

            {/* 4 Feature Pills */}
            <View style={styles.uspFeaturesRow}>
              <View style={styles.uspItem}>
                <View style={styles.uspIconCircle}>
                  <Ionicons name="musical-notes" size={14} color="#8A072D" />
                </View>
                <Text style={styles.uspText}>Live{'\n'}Performance</Text>
              </View>

              <View style={styles.uspItem}>
                <View style={styles.uspIconCircle}>
                  <Ionicons name="people" size={14} color="#8A072D" />
                </View>
                <Text style={styles.uspText}>Professional{'\n'}Artists</Text>
              </View>

              <View style={styles.uspItem}>
                <View style={styles.uspIconCircle}>
                  <Ionicons name="shield-checkmark" size={14} color="#8A072D" />
                </View>
                <Text style={styles.uspText}>Verified{'\n'}Vendors</Text>
              </View>

              <View style={styles.uspItem}>
                <View style={styles.uspIconCircle}>
                  <FontAwesome5 name="rupee-sign" size={12} color="#8A072D" />
                </View>
                <Text style={styles.uspText}>For Every{'\n'}Budget</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location & Wedding Date Selector Bar */}
        <View style={styles.locationDateBar}>
          <TouchableOpacity
            style={styles.locationSelectorBtn}
            onPress={() => Alert.alert('Change Location', `Currently browsing in ${currentCity}`)}
            activeOpacity={0.8}
          >
            <Ionicons name="location" size={16} color="#8A072D" />
            <Text style={styles.locationSelectorText} numberOfLines={1}>
              {currentCity}, {currentState}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#665357" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateSelectorBtn}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={15} color="#8A072D" />
            <Text style={styles.dateSelectorText}>{selectedDate}</Text>
            <Ionicons name="chevron-down" size={14} color="#665357" />
          </TouchableOpacity>
        </View>

        {/* Filter & Sort Horizontal Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsScroll}
        >
          <TouchableOpacity
            style={[styles.filterPill, activeFilter !== 'All' && styles.filterPillActive]}
            onPress={() => setShowFilterModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="options-outline"
              size={14}
              color={activeFilter !== 'All' ? '#FFFFFF' : '#8A072D'}
            />
            <Text
              style={[
                styles.filterPillText,
                activeFilter !== 'All' && styles.filterPillTextActive,
              ]}
            >
              Filters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeSort !== 'recommended' && styles.filterPillActive]}
            onPress={() => setShowSortModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="swap-vertical-outline"
              size={14}
              color={activeSort !== 'recommended' ? '#FFFFFF' : '#8A072D'}
            />
            <Text
              style={[
                styles.filterPillText,
                activeSort !== 'recommended' && styles.filterPillTextActive,
              ]}
            >
              Sort
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => {
              setActiveSort(activeSort === 'price_low' ? 'price_high' : 'price_low');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.filterPillRupee}>₹</Text>
            <Text style={styles.filterPillText}>Price ⌄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => {
              setActiveSort('distance');
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="location-outline" size={13} color="#8A072D" />
            <Text style={styles.filterPillText}>Distance ⌄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => {
              setActiveSort('rating');
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="star" size={13} color="#8A072D" />
            <Text style={styles.filterPillText}>Rating ⌄</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Vendors Near You Section Header */}
        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionTitle}>{serviceName} Vendors Near You</Text>
            <Text style={styles.sectionSubtitle}>
              Best {serviceName} artists within 5 KM from your location
            </Text>
          </View>
          <Text style={styles.vendorCountText}>{vendors.length} Vendors Found</Text>
        </View>

        {/* Vendor Listing Cards */}
        <View style={styles.vendorListContainer}>
          {vendors.map((vendor) => {
            const isFav = !!favorites[vendor.id];
            return (
              <TouchableOpacity
                key={vendor.id}
                style={styles.vendorCard}
                activeOpacity={0.85}
                onPress={() => {
                  navigation?.navigate('BookingSummary', {
                    vendor,
                    serviceName,
                  });
                }}
              >
                {/* Left Card Photo */}
                <View style={styles.vendorImgWrapper}>
                  <Image source={vendor.image} style={styles.vendorImg} />

                  {vendor.isVerified && (
                    <View style={styles.verifiedTag}>
                      <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
                      <Text style={styles.verifiedTagText}>Verified</Text>
                    </View>
                  )}

                  <View style={styles.photoCountBadge}>
                    <Ionicons name="camera-outline" size={11} color="#FFFFFF" />
                    <Text style={styles.photoCountText}>{vendor.photosCount} Photos</Text>
                  </View>
                </View>

                {/* Right Card Content */}
                <View style={styles.vendorInfoCol}>
                  <View style={styles.vendorNameRow}>
                    <Text style={styles.vendorName} numberOfLines={1}>
                      {vendor.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(vendor.id)}
                      style={styles.favBtn}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={18}
                        color={isFav ? '#8A072D' : '#8A072D'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Rating, Reviews, Exp */}
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#E59819" />
                    <Text style={styles.ratingScore}>{vendor.rating}</Text>
                    <Text style={styles.reviewCount}>({vendor.reviewsCount} reviews)</Text>
                    <Text style={styles.dividerPipe}>|</Text>
                    <Text style={styles.expText}>{vendor.experienceYears}+ Years</Text>
                  </View>

                  {/* Distance */}
                  <View style={styles.distanceRow}>
                    <Ionicons name="location-outline" size={12} color="#8A072D" />
                    <Text style={styles.distanceText}>{vendor.distanceKm} KM away</Text>
                  </View>

                  {/* Pricing */}
                  <Text style={styles.pricingText}>
                    <Text style={styles.priceRupee}>₹ </Text>₹
                    {vendor.startingPrice.toLocaleString('en-IN')}
                    <Text style={styles.priceOnwards}> onwards</Text>
                  </Text>

                  {/* Badges: Group Type & Availability */}
                  <View style={styles.badgesRow}>
                    <View style={styles.badgePill}>
                      <Ionicons
                        name={vendor.type === 'Professional Group' ? 'shield-outline' : 'person-outline'}
                        size={10}
                        color="#8A072D"
                      />
                      <Text style={styles.badgePillText}>{vendor.type}</Text>
                    </View>

                    {vendor.isAvailable && (
                      <View style={styles.badgePill}>
                        <Ionicons name="calendar-outline" size={10} color="#8A072D" />
                        <Text style={styles.badgePillText}>Available on your date</Text>
                      </View>
                    )}
                  </View>

                  {/* View Details Action Button */}
                  <TouchableOpacity
                    style={styles.viewDetailsBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      navigation?.navigate('BookingSummary', {
                        vendor,
                        serviceName,
                      });
                    }}
                  >
                    <Text style={styles.viewDetailsBtnText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Business Lead Generation Banner */}
        <View style={styles.postRequirementBanner}>
          <View style={styles.leadDholIconWrapper}>
            <Image source={Assets.serviceDhol} style={styles.leadDholIcon} />
          </View>
          <View style={styles.leadTextCol}>
            <Text style={styles.leadTitle}>Can't find the right vendor?</Text>
            <Text style={styles.leadSubtitle}>
              Post your requirement and let vendors come to you!
            </Text>
          </View>
          <TouchableOpacity
            style={styles.postReqBtn}
            activeOpacity={0.85}
            onPress={() => setShowPostRequirementModal(true)}
          >
            <Text style={styles.postReqBtnText}>Post Requirement</Text>
            <Ionicons name="arrow-forward" size={13} color="#8A072D" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Wedding Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {['15 Nov 2026', '22 Nov 2026', '04 Dec 2026', '12 Dec 2026', '18 Jan 2027'].map(
              (date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.modalOptionRow,
                    selectedDate === date && styles.modalOptionRowActive,
                  ]}
                  onPress={() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedDate === date && styles.modalOptionTextActive,
                    ]}
                  >
                    {date}
                  </Text>
                  {selectedDate === date && (
                    <Ionicons name="checkmark-circle" size={18} color="#8A072D" />
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort Vendors By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {[
              { id: 'recommended', label: 'Recommended (Popularity)' },
              { id: 'price_low', label: 'Price: Low to High' },
              { id: 'price_high', label: 'Price: High to Low' },
              { id: 'rating', label: 'Customer Rating (High to Low)' },
              { id: 'distance', label: 'Distance (Nearest to Me)' },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.modalOptionRow,
                  activeSort === option.id && styles.modalOptionRowActive,
                ]}
                onPress={() => {
                  setActiveSort(option.id as any);
                  setShowSortModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    activeSort === option.id && styles.modalOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {activeSort === option.id && (
                  <Ionicons name="checkmark-circle" size={18} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Filters Modal */}
      <Modal visible={showFilterModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter {serviceName} Vendors</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {['All', 'Professional Group', 'Individual Artist', 'Verified Only', 'Under ₹8,000'].map(
              (filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.modalOptionRow,
                    activeFilter === filter && styles.modalOptionRowActive,
                  ]}
                  onPress={() => {
                    setActiveFilter(filter);
                    setShowFilterModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      activeFilter === filter && styles.modalOptionTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                  {activeFilter === filter && (
                    <Ionicons name="checkmark-circle" size={18} color="#8A072D" />
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </Modal>

      {/* Post Requirement Lead Generation Business Modal */}
      <Modal visible={showPostRequirementModal} transparent animationType="slide">
        <View style={styles.leadModalOverlay}>
          <View style={styles.leadModalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Post Wedding Requirement</Text>
                <Text style={styles.modalSubtitle}>
                  Get customized quotes directly from top verified {serviceName} artists
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowPostRequirementModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.leadFormScroll}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Rahul Sharma"
                value={reqName}
                onChangeText={setReqName}
                placeholderTextColor="#8C7A7E"
              />

              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={reqPhone}
                onChangeText={setReqPhone}
                placeholderTextColor="#8C7A7E"
              />

              <Text style={styles.inputLabel}>Wedding Event Date</Text>
              <TextInput
                style={styles.formInput}
                value={reqDate}
                onChangeText={setReqDate}
                placeholderTextColor="#8C7A7E"
              />

              <Text style={styles.inputLabel}>Requirement Type / Artist Count</Text>
              <TextInput
                style={styles.formInput}
                value={reqDholCount}
                onChangeText={setReqDholCount}
                placeholderTextColor="#8C7A7E"
              />

              <Text style={styles.inputLabel}>Estimated Budget</Text>
              <TextInput
                style={styles.formInput}
                value={reqBudget}
                onChangeText={setReqBudget}
                placeholderTextColor="#8C7A7E"
              />

              <Text style={styles.inputLabel}>Special Instructions / Notes</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="e.g. Need Punjabi Dhol for Groom Baarat entry for 2 hours..."
                multiline
                numberOfLines={3}
                value={reqDetails}
                onChangeText={setReqDetails}
                placeholderTextColor="#8C7A7E"
              />

              <TouchableOpacity
                style={styles.submitReqBtn}
                activeOpacity={0.85}
                onPress={handleRequirementSubmit}
              >
                <Text style={styles.submitReqBtnText}>Submit & Receive Quotes</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F7E9E3',
  },
  headerBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerBrandCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLogoImg: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  headerBrandTaglines: {
    justifyContent: 'center',
  },
  headerBrandTagline1: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#381C20',
    letterSpacing: 0.5,
    lineHeight: 9,
  },
  headerBrandTagline2: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  headerRightCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionIconBtn: {
    padding: 4,
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
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: '#FAF5F2',
  },

  // Hero Banner
  heroBanner: {
    height: 180,
    backgroundColor: '#FDECE6',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  heroBackgroundImg: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '65%',
    resizeMode: 'cover',
  },
  heroContent: {
    paddingHorizontal: 14,
    width: '78%',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A040A',
    marginBottom: 4,
  },
  heroTitleMaroon: {
    color: '#8A072D',
  },
  heroSubtitle: {
    fontSize: 10,
    color: '#554246',
    lineHeight: 14,
    marginBottom: 10,
  },
  uspFeaturesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uspItem: {
    alignItems: 'center',
  },
  uspIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2D0C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    elevation: 1,
  },
  uspText: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#3B2B2E',
    textAlign: 'center',
    lineHeight: 9.5,
  },

  // Location & Date Selector
  locationDateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E4DC',
  },
  locationSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationSelectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
    maxWidth: 160,
  },
  dateSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateSelectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
  },

  // Filter & Sort Pills
  filterPillsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAF5F2',
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.round,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F5CFC0',
    gap: 4,
  },
  filterPillActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  filterPillRupee: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
  filterPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Section Heading
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A040A',
  },
  sectionSubtitle: {
    fontSize: 10,
    color: '#736064',
    marginTop: 2,
  },
  vendorCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#736064',
  },

  // Vendor Listing
  vendorListContainer: {
    paddingHorizontal: 12,
    gap: 10,
  },
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    overflow: 'hidden',
    padding: 8,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  vendorImgWrapper: {
    width: 112,
    height: 124,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FDECE6',
  },
  vendorImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#27A844',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '700',
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '600',
  },

  // Vendor Info
  vendorInfoCol: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vendorName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1A040A',
    flex: 1,
  },
  favBtn: {
    padding: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewCount: {
    fontSize: 10,
    color: '#736064',
  },
  dividerPipe: {
    fontSize: 10,
    color: '#D4C2B8',
  },
  expText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#736064',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  distanceText: {
    fontSize: 10,
    color: '#736064',
  },
  pricingText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#8A072D',
    marginTop: 3,
  },
  priceRupee: {
    fontSize: 11,
    color: '#8A072D',
  },
  priceOnwards: {
    fontSize: 10,
    fontWeight: '500',
    color: '#736064',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FDECE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePillText: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#8A072D',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Spacing.borderRadius.round,
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  viewDetailsBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },

  // Business Post Requirement Banner
  postRequirementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECE6',
    marginHorizontal: 12,
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5CFC0',
    gap: 8,
  },
  leadDholIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0D4CB',
  },
  leadDholIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  leadTextCol: {
    flex: 1,
  },
  leadTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  leadSubtitle: {
    fontSize: 9,
    color: '#6E5C60',
    marginTop: 1,
  },
  postReqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Spacing.borderRadius.round,
    borderWidth: 1,
    borderColor: '#8A072D',
    gap: 3,
  },
  postReqBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A072D',
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
  },
  modalSubtitle: {
    fontSize: 10.5,
    color: '#736064',
    marginTop: 2,
    maxWidth: '90%',
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7E9E3',
  },
  modalOptionRowActive: {
    backgroundColor: '#FDECE6',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B2B2E',
  },
  modalOptionTextActive: {
    color: '#8A072D',
    fontWeight: '800',
  },

  // Lead Generation Modal
  leadModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  leadModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '85%',
  },
  leadFormScroll: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A040A',
    marginTop: 8,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1A040A',
  },
  formTextArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  submitReqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.round,
    marginTop: 16,
    marginBottom: 20,
    gap: 6,
  },
  submitReqBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
