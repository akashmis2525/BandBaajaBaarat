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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

export interface SavedItem {
  id: string;
  type: 'Venue' | 'Vendor' | 'Service';
  title: string;
  subtitle: string;
  rating: number;
  reviewsCount: number;
  price: string;
  priceUnit: string;
  image: any;
  isFavorite: boolean;
  features?: string[];
  capacityOrTeam?: string;
}

export const SavedItemsScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Venues' | 'Vendors' | 'Services'>('All');
  const [items, setItems] = useState<SavedItem[]>([
    {
      id: '1',
      type: 'Venue',
      title: 'The Grand Palace',
      subtitle: 'Banquet Hall, Indore',
      rating: 4.8,
      reviewsCount: 320,
      price: '₹75,000',
      priceUnit: 'Starting Price',
      image: Assets.serviceDecorators,
      isFavorite: true,
      features: ['AC Banquet Hall', '500-1500 Guests', 'In-house Catering', 'Valet Parking'],
      capacityOrTeam: '1200 Guests Capacity',
    },
    {
      id: '2',
      type: 'Vendor',
      title: 'Royal Beats Dhol Group',
      subtitle: 'Dhol & Music, Indore',
      rating: 4.9,
      reviewsCount: 250,
      price: '₹5,999',
      priceUnit: 'Starting Price',
      image: Assets.weddingMandapArt,
      isFavorite: true,
      features: ['4 Punjabi Dhol Players', '2 High-Bass Tashas', 'Rajasthani Poshak', 'Baarat Entry Beats'],
      capacityOrTeam: '6 Artists Team',
    },
    {
      id: '3',
      type: 'Vendor',
      title: 'Glam Look Makeup Studio',
      subtitle: 'Bridal Makeup, Indore',
      rating: 4.7,
      reviewsCount: 180,
      price: '₹12,000',
      priceUnit: 'Starting Price',
      image: Assets.serviceMehndi,
      isFavorite: true,
      features: ['HD Airbrush Makeup', 'Hair Styling & Draping', 'Premium International Brands', 'On-venue Service'],
      capacityOrTeam: 'Master Artist + 2 Assistants',
    },
    {
      id: '4',
      type: 'Service',
      title: 'Shivam Car Rentals',
      subtitle: 'Wedding Car, Indore',
      rating: 4.6,
      reviewsCount: 95,
      price: '₹8,000',
      priceUnit: 'Starting Price',
      image: Assets.serviceBuggi,
      isFavorite: true,
      features: ['Luxury Audi A4 / BMW', 'Fresh Flower Decoration', 'Chauffeur in Uniform', '8 Hours / 80 Km'],
      capacityOrTeam: 'Luxury 4-Seater Sedan',
    },
    {
      id: '5',
      type: 'Service',
      title: 'Shree Caterers',
      subtitle: 'Catering Service, Indore',
      rating: 4.5,
      reviewsCount: 210,
      price: '₹600',
      priceUnit: 'Per Plate',
      image: Assets.serviceClothes,
      isFavorite: true,
      features: ['50+ Pure Veg Delicacies', 'Live Chaat & Dessert Counters', 'Royal Crockery Setup', 'Trained Serving Staff'],
      capacityOrTeam: 'Min 200 - Max 3000 Plates',
    },
  ]);

  const [selectedItemForMenu, setSelectedItemForMenu] = useState<SavedItem | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ProfileMain');
    }
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedState = !item.isFavorite;
          if (!updatedState) {
            Alert.alert('Removed from Wishlist', `"${item.title}" removed from your favorites.`);
          } else {
            Alert.alert('Saved to Wishlist ❤️', `"${item.title}" added to your favorites.`);
          }
          return { ...item, isFavorite: updatedState };
        }
        return item;
      })
    );
  };

  const handleShareItem = async (item: SavedItem) => {
    try {
      await Share.share({
        message: `Check out ${item.title} (${item.subtitle}) on Band Baaja Baarat app! Starting at ${item.price}.\nhttps://bandbaajabaarat.in/item/${item.id}`,
        title: item.title,
      });
    } catch (e) {
      Alert.alert('Share', `Sharing ${item.title}`);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!item.isFavorite) return false;
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Venues') return item.type === 'Venue';
    if (selectedFilter === 'Vendors') return item.type === 'Vendor';
    if (selectedFilter === 'Services') return item.type === 'Service';
    return true;
  });

  const renderTypeTag = (type: SavedItem['type']) => {
    if (type === 'Venue') {
      return (
        <View style={styles.tagVenue}>
          <Text style={styles.tagVenueText}>Venue</Text>
        </View>
      );
    }
    if (type === 'Vendor') {
      return (
        <View style={styles.tagVendor}>
          <Text style={styles.tagVendorText}>Vendor</Text>
        </View>
      );
    }
    if (type === 'Service') {
      return (
        <View style={styles.tagService}>
          <Text style={styles.tagServiceText}>Service</Text>
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
            Saved <Text style={styles.headerTitleMaroon}>Items</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Your favorite services, all in one place</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Your Dream Picks</Text>
          <Text style={styles.scriptBadgeMid}>Always</Text>
          <Text style={styles.scriptBadgeBot}>Saved ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Wishlist Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heartCircleBadge}>
            <Ionicons name="heart" size={22} color="#8A072D" />
          </View>

          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Your Wishlist</Text>
            <Text style={styles.heroSubText}>
              Save your favorite venues, vendors and services to compare and book later.
            </Text>
          </View>

          <View style={styles.giftArtContainer}>
            <Image source={Assets.brideGroom} style={styles.giftIllustration} />
          </View>
        </View>

        {/* Filter Pills Row */}
        <View style={styles.filterPillsRow}>
          {[
            { id: 'All', label: 'All (8)' },
            { id: 'Venues', label: 'Venues (2)' },
            { id: 'Vendors', label: 'Vendors (3)' },
            { id: 'Services', label: 'Services (3)' },
          ].map((tab) => {
            const isSelected = selectedFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterPill,
                  isSelected ? styles.filterPillActive : styles.filterPillInactive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(tab.id as any)}
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

        {/* Saved Cards List */}
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.savedCard}
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('ServiceDetail', { serviceTitle: item.title })}
          >
            {/* Left Image Thumbnail */}
            <Image source={item.image} style={styles.cardImage} />

            {/* Middle Details Col */}
            <View style={styles.cardDetailsCol}>
              {/* Type Tag */}
              <View style={styles.tagRow}>
                {renderTypeTag(item.type)}
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.itemTitleText} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemSubText} numberOfLines={1}>
                {item.subtitle}
              </Text>

              {/* Rating Row */}
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>({item.reviewsCount} reviews)</Text>
              </View>

              {/* Price & Unit */}
              <View style={styles.priceRow}>
                <Text style={styles.priceValueText}>{item.price}</Text>
                <Text style={styles.priceUnitText}>{item.priceUnit}</Text>
              </View>
            </View>

            {/* Right Action Icons Column */}
            <View style={styles.cardActionsCol}>
              {/* Heart Toggle */}
              <TouchableOpacity
                style={styles.heartBtn}
                activeOpacity={0.7}
                onPress={() => handleToggleFavorite(item.id)}
              >
                <Ionicons
                  name={item.isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={item.isFavorite ? '#DC2626' : '#736064'}
                />
              </TouchableOpacity>

              {/* 3 Dots Menu */}
              <TouchableOpacity
                style={styles.menuDotsBtn}
                activeOpacity={0.7}
                onPress={() => setSelectedItemForMenu(item)}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#736064" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={48} color="#C5B4B8" />
            <Text style={styles.emptyTitle}>No Saved Items in {selectedFilter}</Text>
            <Text style={styles.emptySubtitle}>
              Browse wedding services and tap the heart icon to save them here.
            </Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Bottom Compare Button */}
      <View style={styles.bottomFloatingContainer}>
        <TouchableOpacity
          style={styles.compareBtn}
          activeOpacity={0.88}
          onPress={() => navigation?.navigate('CompareServices')}
        >
          <Ionicons name="heart-outline" size={18} color="#FFFFFF" />
          <Text style={styles.compareBtnText}>Compare (3)</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 3-Dots Item Action Modal */}
      <Modal visible={!!selectedItemForMenu} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedItemForMenu(null)}
        >
          <View style={styles.itemActionSheet}>
            <View style={styles.actionSheetHeader}>
              <Text style={styles.actionSheetTitle} numberOfLines={1}>
                {selectedItemForMenu?.title}
              </Text>
              <TouchableOpacity onPress={() => setSelectedItemForMenu(null)}>
                <Ionicons name="close" size={22} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                const item = selectedItemForMenu;
                setSelectedItemForMenu(null);
                if (item) handleShareItem(item);
              }}
            >
              <Ionicons name="share-social-outline" size={18} color="#8A072D" />
              <Text style={styles.actionRowText}>Share with Friends / Family</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                const item = selectedItemForMenu;
                setSelectedItemForMenu(null);
                navigation?.navigate('ServiceDetail', { serviceTitle: item?.title });
              }}
            >
              <Ionicons name="eye-outline" size={18} color="#8A072D" />
              <Text style={styles.actionRowText}>View Full Service Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                const item = selectedItemForMenu;
                setSelectedItemForMenu(null);
                navigation?.navigate('ChatMain', { vendorName: item?.title });
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#8A072D" />
              <Text style={styles.actionRowText}>Chat / Contact Vendor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                if (selectedItemForMenu) {
                  handleToggleFavorite(selectedItemForMenu.id);
                  setSelectedItemForMenu(null);
                }
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text style={[styles.actionRowText, { color: '#DC2626' }]}>Remove from Wishlist</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Side-by-Side Comparison Modal */}
      <Modal visible={showCompareModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.compareHeader}>
              <View>
                <Text style={styles.compareTitle}>Compare Saved Favorites</Text>
                <Text style={styles.compareSub}>Compare features, pricing and ratings side-by-side</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCompareModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 10 }}>
              {items.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.compareCard}>
                  <Image source={item.image} style={styles.compareImage} />
                  {renderTypeTag(item.type)}
                  <Text style={styles.compareCardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.compareCardSub}>{item.subtitle}</Text>
                  
                  <View style={styles.compareMetricBox}>
                    <Text style={styles.comparePrice}>{item.price}</Text>
                    <Text style={styles.compareUnit}>{item.priceUnit}</Text>
                  </View>

                  <View style={styles.compareRatingRow}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.compareRatingText}>{item.rating} ({item.reviewsCount} reviews)</Text>
                  </View>

                  <Text style={styles.compareFeaturesHeader}>Key Highlights:</Text>
                  {item.features?.map((f, idx) => (
                    <View key={idx} style={styles.compareFeatureRow}>
                      <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                      <Text style={styles.compareFeatureText} numberOfLines={1}>{f}</Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.bookNowBtn}
                    onPress={() => {
                      setShowCompareModal(false);
                      navigation?.navigate('ServiceDetail', { serviceTitle: item.title });
                    }}
                  >
                    <Text style={styles.bookNowBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              ))}
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

  // Hero Wishlist Banner
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
  heartCircleBadge: {
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
  giftArtContainer: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftIllustration: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },

  // Filter Pills Row
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
    backgroundColor: '#8A072D',
  },
  filterPillInactive: {
    backgroundColor: '#FFF5F3',
    borderWidth: 1,
    borderColor: '#F5DDD3',
  },
  filterPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillTextInactive: {
    color: '#4A353A',
  },

  // Saved Cards
  savedCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardImage: {
    width: 105,
    height: 95,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#F5E6DF',
  },
  cardDetailsCol: {
    flex: 1,
    gap: 2,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  tagVenue: {
    backgroundColor: '#FCE7F3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  tagVenueText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#BE185D',
  },
  tagVendor: {
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  tagVendorText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#15803D',
  },
  tagService: {
    backgroundColor: '#E0F2FE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  tagServiceText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0369A1',
  },

  itemTitleText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  itemSubText: {
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  priceValueText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#8A072D',
  },
  priceUnitText: {
    fontSize: 8.5,
    color: '#736064',
  },

  cardActionsCol: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    height: 85,
  },
  heartBtn: {
    padding: 4,
  },
  menuDotsBtn: {
    padding: 4,
  },

  // Bottom Floating Compare Button
  bottomFloatingContainer: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
  },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  compareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Item Action Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  itemActionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 6,
  },
  actionSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionSheetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A040A',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
    gap: 12,
  },
  actionRowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
  },

  // Compare Modal
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compareTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
  },
  compareSub: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 1,
  },
  compareCard: {
    width: 200,
    backgroundColor: '#FFF7F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 10,
    gap: 4,
  },
  compareImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 4,
  },
  compareCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A040A',
  },
  compareCardSub: {
    fontSize: 9,
    color: '#736064',
  },
  compareMetricBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 2,
  },
  comparePrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8A072D',
  },
  compareUnit: {
    fontSize: 8.5,
    color: '#736064',
  },
  compareRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compareRatingText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  compareFeaturesHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A072D',
    marginTop: 4,
  },
  compareFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compareFeatureText: {
    fontSize: 8.5,
    color: '#4A353A',
  },
  bookNowBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  bookNowBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
});
