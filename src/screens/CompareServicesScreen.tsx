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
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

export interface CompareItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  experience: string;
  date: string;
  rating: number;
  reviewsCount: number;
  price: string;
  priceUnit: string;
  image: any;
  keyFeatures: string[];
}

export const CompareServicesScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const [compareList, setCompareList] = useState<CompareItem[]>([
    {
      id: '1',
      title: 'The Grand Palace',
      subtitle: 'Banquet Hall, Indore',
      category: 'Banquet Hall',
      location: 'Indore, Madhya Pradesh',
      experience: '5+ Years',
      date: '20 Dec 2026',
      rating: 4.8,
      reviewsCount: 320,
      price: '₹75,000',
      priceUnit: 'Starting Price',
      image: Assets.serviceDecorators,
      keyFeatures: [
        'Spacious Hall',
        'Modern Amenities',
        'Custom Decor',
        'Parking Available',
      ],
    },
    {
      id: '2',
      title: 'Royal Beats Dhol Group',
      subtitle: 'Dhol & Music, Indore',
      category: 'Dhol & Music',
      location: 'Indore, Madhya Pradesh',
      experience: '8+ Years',
      date: '15 Nov 2026',
      rating: 4.9,
      reviewsCount: 250,
      price: '₹5,999',
      priceUnit: 'Starting Price',
      image: Assets.weddingMandapArt,
      keyFeatures: [
        'Professional Team',
        'Multiple Dhol Players',
        'LED Setup',
        'Custom Songs',
      ],
    },
    {
      id: '3',
      title: 'Shivam Car Rentals',
      subtitle: 'Wedding Car, Indore',
      category: 'Wedding Car',
      location: 'Indore, Madhya Pradesh',
      experience: '4+ Years',
      date: '05 Oct 2026',
      rating: 4.6,
      reviewsCount: 95,
      price: '₹8,000',
      priceUnit: 'Starting Price',
      image: Assets.serviceBuggi,
      keyFeatures: [
        'Well Maintained',
        'Decorated Vehicles',
        'Professional Driver',
        'On-Time Service',
      ],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  const availableServicesToAdd: CompareItem[] = [
    {
      id: '4',
      title: 'Glam Look Makeup Studio',
      subtitle: 'Bridal Makeup, Indore',
      category: 'Bridal Makeup',
      location: 'Indore, Madhya Pradesh',
      experience: '6+ Years',
      date: '10 Oct 2026',
      rating: 4.7,
      reviewsCount: 180,
      price: '₹12,000',
      priceUnit: 'Starting Price',
      image: Assets.serviceMehndi,
      keyFeatures: [
        'HD Airbrush Makeup',
        'Hair Styling & Draping',
        'International Cosmetics',
        'On-Venue Support',
      ],
    },
    {
      id: '5',
      title: 'Shree Caterers',
      subtitle: 'Catering Service, Indore',
      category: 'Catering Service',
      location: 'Indore, Madhya Pradesh',
      experience: '10+ Years',
      date: '18 Nov 2026',
      rating: 4.5,
      reviewsCount: 210,
      price: '₹600',
      priceUnit: 'Per Plate',
      image: Assets.serviceClothes,
      keyFeatures: [
        '50+ Pure Veg Delicacies',
        'Live Chaat Counters',
        'Royal Crockery',
        'Trained Uniformed Staff',
      ],
    },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('SavedItems');
    }
  };

  const handleRemoveItem = (id: string) => {
    if (compareList.length <= 1) {
      Alert.alert('Cannot Remove', 'You need at least 1 service in comparison.');
      return;
    }
    const item = compareList.find((i) => i.id === id);
    setCompareList((prev) => prev.filter((i) => i.id !== id));
    Alert.alert('Removed', `"${item?.title}" removed from comparison.`);
  };

  const handleAddService = (item: CompareItem) => {
    if (compareList.some((i) => i.id === item.id)) {
      Alert.alert('Already Added', 'This service is already in the comparison table.');
      return;
    }
    if (compareList.length >= 4) {
      Alert.alert('Limit Reached', 'You can compare maximum 4 services at a time.');
      return;
    }
    setCompareList((prev) => [...prev, item]);
    setShowAddModal(false);
    Alert.alert('Added to Comparison ✨', `"${item.title}" added to comparison.`);
  };

  const handleViewDetails = (item: CompareItem) => {
    navigation?.navigate('VenueBookingDetails', { serviceTitle: item.title, category: item.category, item });
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
            Compare <Text style={styles.headerTitleMaroon}>Services</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Find the best option for your special day</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Compare</Text>
          <Text style={styles.scriptBadgeMid}>Choose</Text>
          <Text style={styles.scriptBadgeBot}>Celebrate Better ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner: Make the Right Choice */}
        <View style={styles.heroBanner}>
          <View style={styles.scaleCircleBadge}>
            <MaterialCommunityIcons name="scale-balance" size={24} color="#8A072D" />
          </View>

          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Make the Right Choice</Text>
            <Text style={styles.heroSubText}>
              Compare features, prices and reviews to find the perfect match for your celebration.
            </Text>
          </View>

          <View style={styles.checklistArtContainer}>
            <Ionicons name="clipboard" size={36} color="#F2A6B4" />
            <Ionicons
              name="heart"
              size={14}
              color="#8A072D"
              style={{ position: 'absolute', bottom: 4, right: 2 }}
            />
          </View>
        </View>

        {/* Side-by-Side Horizontal Comparison Table */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCompareContainer}
        >
          {compareList.map((item) => (
            <View key={item.id} style={styles.compareCard}>
              {/* Image with Remove (X) Button */}
              <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.cardImage} />
                <TouchableOpacity
                  style={styles.closeBtnBadge}
                  activeOpacity={0.8}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Ionicons name="close" size={14} color="#1A040A" />
                </TouchableOpacity>
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>

              {/* Rating */}
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>({item.reviewsCount} reviews)</Text>
              </View>

              {/* Price */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{item.price}</Text>
                <Text style={styles.priceUnitText}>{item.priceUnit}</Text>
              </View>

              {/* Feature Matrix Rows */}
              <View style={styles.featureMatrix}>
                {/* 1. Category */}
                <View style={styles.matrixRow}>
                  <View style={styles.matrixRowHeader}>
                    <Ionicons name="document-text-outline" size={14} color="#DC2626" />
                    <Text style={styles.matrixLabel}>Category</Text>
                  </View>
                  <Text style={styles.matrixValue}>{item.category}</Text>
                </View>

                {/* 2. Location */}
                <View style={styles.matrixRow}>
                  <View style={styles.matrixRowHeader}>
                    <Ionicons name="location-sharp" size={14} color="#DC2626" />
                    <Text style={styles.matrixLabel}>Location</Text>
                  </View>
                  <Text style={styles.matrixValue}>{item.location}</Text>
                </View>

                {/* 3. Experience */}
                <View style={styles.matrixRow}>
                  <View style={styles.matrixRowHeader}>
                    <Ionicons name="ribbon-outline" size={14} color="#DC2626" />
                    <Text style={styles.matrixLabel}>Experience</Text>
                  </View>
                  <Text style={styles.matrixValue}>{item.experience}</Text>
                </View>

                {/* 4. Date */}
                <View style={styles.matrixRow}>
                  <View style={styles.matrixRowHeader}>
                    <Ionicons name="calendar" size={14} color="#DC2626" />
                  </View>
                  <Text style={styles.matrixValue}>{item.date}</Text>
                </View>

                {/* 5. Rating Row */}
                <View style={styles.matrixRow}>
                  <View style={styles.matrixRowHeader}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.matrixLabel}>Rating</Text>
                  </View>
                  <Text style={styles.matrixValue}>
                    {item.rating} ({item.reviewsCount})
                  </Text>
                </View>

                {/* 6. Key Features */}
                <View style={styles.keyFeaturesBlock}>
                  <View style={styles.matrixRowHeader}>
                    <Ionicons name="list" size={14} color="#DC2626" />
                    <Text style={styles.matrixLabel}>Key Features</Text>
                  </View>
                  <View style={styles.featuresList}>
                    {item.keyFeatures.map((f, fIdx) => (
                      <View key={fIdx} style={styles.featureItemRow}>
                        <Ionicons name="checkmark-circle" size={13} color="#16A34A" />
                        <Text style={styles.featureItemText} numberOfLines={1}>
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 7. Total Reviews */}
                <View style={styles.matrixRow}>
                  <View style={styles.matrixRowHeader}>
                    <Ionicons name="chatbox-ellipses-outline" size={14} color="#DC2626" />
                    <Text style={styles.matrixLabel}>Total Reviews</Text>
                  </View>
                  <Text style={styles.matrixValue}>{item.reviewsCount} Reviews</Text>
                </View>
              </View>

              {/* View Details Action Button */}
              <TouchableOpacity
                style={styles.viewDetailsBtn}
                activeOpacity={0.7}
                onPress={() => handleViewDetails(item)}
              >
                <Text style={styles.viewDetailsBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Add Another Service Card */}
        <TouchableOpacity
          style={styles.addServiceCard}
          activeOpacity={0.8}
          onPress={() => setShowAddModal(true)}
        >
          <View style={styles.plusIconCircle}>
            <Ionicons name="add" size={24} color="#8A072D" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addServiceTitle}>Add Another Service</Text>
            <Text style={styles.addServiceSub}>Compare up to 4 services at a time</Text>
          </View>
        </TouchableOpacity>

        {/* Find the Best for Me Primary Action */}
        <TouchableOpacity
          style={styles.findBestBtn}
          activeOpacity={0.88}
          onPress={() => setShowRecommendationModal(true)}
        >
          <MaterialCommunityIcons name="chart-bar" size={20} color="#FFFFFF" />
          <Text style={styles.findBestBtnText}>Find the Best for Me</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{ height: 35 }} />
      </ScrollView>

      {/* Add Service Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Service to Compare</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {availableServicesToAdd.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.addServiceOptionRow}
                  activeOpacity={0.7}
                  onPress={() => handleAddService(service)}
                >
                  <Image source={service.image} style={styles.addServiceThumb} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.addOptionTitle}>{service.title}</Text>
                    <Text style={styles.addOptionSub}>{service.subtitle}</Text>
                    <Text style={styles.addOptionPrice}>
                      {service.price} {service.priceUnit}
                    </Text>
                  </View>
                  <View style={styles.addPlusBtn}>
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Smart AI Recommendation Modal */}
      <Modal visible={showRecommendationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>AI Wedding Match 🏆</Text>
                <Text style={styles.modalSubtitle}>Based on reviews, pricing & popularity</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRecommendationModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            {/* Recommendation Result Card */}
            <View style={styles.recHeroCard}>
              <View style={styles.recBadge}>
                <Ionicons name="trophy" size={14} color="#FFFFFF" />
                <Text style={styles.recBadgeText}>Top Value Pick</Text>
              </View>
              <Text style={styles.recVendorTitle}>Royal Beats Dhol Group</Text>
              <Text style={styles.recReasonText}>
                Highest customer rating (4.9 ⭐ with 250+ 5-star reviews), 8+ years experience, and lowest starting price (₹5,999).
              </Text>

              <View style={styles.recMetricsRow}>
                <View style={styles.recMetricCol}>
                  <Text style={styles.recMetricNum}>4.9 ★</Text>
                  <Text style={styles.recMetricLabel}>Top Rated</Text>
                </View>
                <View style={styles.recMetricDivider} />
                <View style={styles.recMetricCol}>
                  <Text style={styles.recMetricNum}>₹5,999</Text>
                  <Text style={styles.recMetricLabel}>Best Price</Text>
                </View>
                <View style={styles.recMetricDivider} />
                <View style={styles.recMetricCol}>
                  <Text style={styles.recMetricNum}>8+ Yrs</Text>
                  <Text style={styles.recMetricLabel}>Experience</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.recBookBtn}
                onPress={() => {
                  setShowRecommendationModal(false);
                  navigation?.navigate('ServiceDetail', { serviceTitle: 'Royal Beats Dhol Group' });
                }}
              >
                <Text style={styles.recBookBtnText}>Book Top Pick Now</Text>
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
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeMid: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeBot: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },

  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // Hero Banner
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    gap: 10,
  },
  scaleCircleBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextCol: {
    flex: 1,
    gap: 2,
  },
  heroTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
  },
  heroSubText: {
    fontSize: 9.5,
    color: '#6E5C60',
    lineHeight: 13,
  },
  checklistArtContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Comparison Cards
  horizontalCompareContainer: {
    gap: 10,
    paddingVertical: 4,
  },
  compareCard: {
    width: 205,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 4,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  imageWrapper: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5E6DF',
    marginBottom: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeBtnBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  cardSubtitle: {
    fontSize: 9.5,
    color: '#736064',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsText: {
    fontSize: 9,
    color: '#736064',
  },
  priceContainer: {
    marginVertical: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8A072D',
  },
  priceUnitText: {
    fontSize: 8.5,
    color: '#736064',
  },

  // Feature Matrix
  featureMatrix: {
    backgroundColor: '#FFF7F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 8,
    gap: 8,
    marginVertical: 6,
  },
  matrixRow: {
    gap: 2,
  },
  matrixRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matrixLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  matrixValue: {
    fontSize: 9,
    color: '#554246',
    marginLeft: 18,
  },

  keyFeaturesBlock: {
    gap: 4,
  },
  featuresList: {
    gap: 3,
    marginLeft: 18,
    marginTop: 2,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureItemText: {
    fontSize: 8.5,
    color: '#4A353A',
  },

  viewDetailsBtn: {
    borderWidth: 1,
    borderColor: '#8A072D',
    borderRadius: 16,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  viewDetailsBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Add Service Card
  addServiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    borderStyle: 'dashed',
    padding: 12,
    gap: 12,
  },
  plusIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addServiceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
  addServiceSub: {
    fontSize: 9,
    color: '#736064',
    marginTop: 1,
  },

  // Find the Best Button
  findBestBtn: {
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
  },
  findBestBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  addServiceOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
    gap: 10,
  },
  addServiceThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  addOptionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A040A',
  },
  addOptionSub: {
    fontSize: 9.5,
    color: '#736064',
  },
  addOptionPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A072D',
  },
  addPlusBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8A072D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recommendation Card
  recHeroCard: {
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 14,
    gap: 8,
    alignItems: 'center',
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A072D',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  recBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  recVendorTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A040A',
  },
  recReasonText: {
    fontSize: 10,
    color: '#6E5C60',
    textAlign: 'center',
    lineHeight: 14,
  },
  recMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#F2DDD3',
  },
  recMetricCol: {
    alignItems: 'center',
    gap: 1,
  },
  recMetricNum: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8A072D',
  },
  recMetricLabel: {
    fontSize: 8.5,
    color: '#736064',
  },
  recMetricDivider: {
    width: 1,
    backgroundColor: '#F2DDD3',
  },
  recBookBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 10,
    paddingVertical: 11,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  recBookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
