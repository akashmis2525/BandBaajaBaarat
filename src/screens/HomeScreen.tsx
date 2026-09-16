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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { ManualLocationModal } from '../components/ManualLocationModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, ApiVendor } from '../services/api';
import { resolveImage } from '../utils/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { location, setManualLocation } = useLocation();
  const { user } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [topVendors, setTopVendors] = useState<
    {
      id: string;
      name: string;
      image: any;
      rating: string;
      reviews: string;
      distance: string;
      price: string;
      verified: boolean;
    }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    api
      .vendors({ city: location.city || 'Indore', sort: 'rating', limit: '8' })
      .then((res) => {
        setTopVendors(
          res.items.map((v: ApiVendor) => ({
            id: v.id,
            name: v.businessName || v.name,
            image: resolveImage(v.imageKey),
            rating: String(v.rating),
            reviews: String(v.reviewsCount),
            distance: v.distance || `${v.distanceKm || 2.4} KM`,
            price: v.startingPriceText || v.price,
            verified: v.isVerified,
          })),
        );
        const fav: Record<string, boolean> = {};
        res.items.forEach((v) => {
          if (v.isFavorite) fav[v.id] = true;
        });
        setFavorites(fav);
      })
      .catch(() => undefined);
    api
      .notifications()
      .then((res) => setUnreadCount(res.unreadCount))
      .catch(() => undefined);
  }, [location.city]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    api.toggleFavorite(id).catch(() => undefined);
  };

  // 12 Popular Wedding Services Grid
  const popularServices = [
    { id: '1', name: 'Dhol', image: Assets.serviceDhol },
    { id: '2', name: 'Band Baaja', image: Assets.serviceBrassBand },
    { id: '3', name: 'DJ Services', image: Assets.serviceDj },
    { id: '4', name: 'Buggi', image: Assets.serviceBuggi },
    { id: '5', name: 'Mehndi Artist', image: Assets.serviceMehndi },
    { id: '6', name: 'Photographer', image: Assets.servicePhotography },
    { id: '7', name: 'Wedding Dress', image: Assets.serviceDresses },
    { id: '8', name: 'Jewellery', image: Assets.serviceJewellery },
    { id: '9', name: 'Shoes', image: Assets.serviceShoes },
    { id: '10', name: 'Clothes', image: Assets.serviceClothes },
    { id: '11', name: 'Puja Samagri', image: Assets.serviceDecorators, isPuja: true },
    { id: '12', name: 'More', isMore: true },
  ];

  // 12 Popular Wedding Services Grid

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF7F4" />

      {/* Top Header Row with Status Bar Protection */}
      <View
        style={[
          styles.topHeader,
          {
            paddingTop:
              Platform.OS === 'android'
                ? (StatusBar.currentHeight || 24) + 8
                : insets.top > 0
                ? insets.top + 4
                : 20,
          },
        ]}
      >
        {/* Left: Brand Logo & Tagline */}
        <View style={styles.logoCol}>
          <Image source={Assets.logoLight} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTagline}>SHAADI KI HAR ZARURAT EK JAGAH ⟶</Text>
        </View>

        {/* Center: User Greeting & Location Dropdown */}
        <View style={styles.userLocationCol}>
          <View style={styles.userGreetingRow}>
            <View style={styles.userAvatarCircle}>
              <Text style={styles.userAvatarEmoji}>🤵</Text>
            </View>
            <View style={styles.greetingTextCol}>
              <Text style={styles.greetingText} numberOfLines={1}>
                Hi, <Text style={styles.userNameBold}>{user.name || 'Rahul'}</Text> 👋
              </Text>
              <TouchableOpacity
                onPress={() => setShowLocationModal(true)}
                activeOpacity={0.7}
                style={styles.locationDropdown}
              >
                <Text style={styles.locationPin}>📍</Text>
                <Text style={styles.locationCityName} numberOfLines={1}>
                  {location.city || 'Indore'}, {location.state || 'Madhya Pradesh'}
                </Text>
                <Text style={styles.dropdownChevron}>⌵</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right Actions: Notification Bell & Profile Avatar */}
        <View style={styles.rightActionsRow}>
          <TouchableOpacity
            style={styles.notificationBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Notifications')}
          >
            <Text style={styles.bellEmoji}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeCount}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation?.navigate('Profile')}
            activeOpacity={0.8}
            style={styles.profileThumbCircle}
          >
            <Text style={styles.profileThumbEmoji}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search & Filter Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Shaadi ke liye kya chahiye?"
              placeholderTextColor="#8C7A7E"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.micBtn}>
              <Text style={styles.micEmoji}>🎙️</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.filtersBtn} activeOpacity={0.8}>
            <Text style={styles.filterIcon}>🎛️</Text>
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Carousel Banner */}
        <View style={styles.heroBannerContainer}>
          <LinearGradient
            colors={['#FFF1EC', '#FDE4DC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroBanner}
          >
            <View style={styles.heroTextCol}>
              <Text style={styles.heroMainTitle}>
                Make Your{'\n'}
                <Text style={styles.heroTitleMaroon}>Wedding Special</Text>
              </Text>
              <Text style={styles.heroSubText}>
                Find trusted vendors for your dream wedding – all in one place.
              </Text>
              <TouchableOpacity
                onPress={() => navigation?.navigate('Services')}
                activeOpacity={0.85}
                style={styles.heroCta}
              >
                <LinearGradient
                  colors={['#8A072D', '#5E041E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.heroCtaGradient}
                >
                  <Text style={styles.heroCtaText}>Explore Services</Text>
                  <Text style={styles.heroCtaArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.heroVisualWrapper}>
              <Image
                source={Assets.brideGroom}
                style={styles.heroCoupleImage}
                resizeMode="cover"
              />
              <View style={styles.heroScriptBadge}>
                <Text style={styles.heroScriptText}>Shaadi Made Simple ♡</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Carousel Dots */}
          <View style={styles.carouselDotsRow}>
            <View style={[styles.cDot, styles.cDotActive]} />
            <View style={styles.cDot} />
            <View style={styles.cDot} />
            <View style={styles.cDot} />
          </View>
        </View>

        {/* 🔥 Popular Services Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionFireEmoji}>🔥</Text>
            <Text style={styles.sectionTitle}>Popular Services</Text>
          </View>
          <TouchableOpacity onPress={() => navigation?.navigate('Services')}>
            <Text style={styles.viewAllText}>View All ➔</Text>
          </TouchableOpacity>
        </View>

        {/* 12 Services 2x6 Grid */}
        <View style={styles.servicesGrid}>
          {popularServices.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              style={styles.serviceTileCol}
              onPress={() => navigation?.navigate('Services')}
            >
              <View style={styles.serviceSquareTile}>
                {item.isMore ? (
                  <View style={styles.moreIconGrid}>
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                  </View>
                ) : item.isPuja ? (
                  <Text style={{ fontSize: 24 }}>🪔</Text>
                ) : (
                  <Image source={item.image} style={styles.serviceItemImg} resizeMode="contain" />
                )}
              </View>
              <Text style={styles.serviceItemLabel} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Value Proposition Banners Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoCardsScroll}
        >
          {/* Card 1: Every Budget Every Style */}
          <LinearGradient
            colors={['#5D0D10', '#8A072D', '#3D0512']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoCardMaroon}
          >
            <View style={styles.promoLeftCol}>
              <Text style={styles.promoMaroonHeader}>
                Every Budget{'\n'}Every Style{'\n'}Every Wedding
              </Text>

              <View style={styles.promoPillsRow}>
                <View style={styles.promoPill}>
                  <Text style={styles.pillEmoji}>🪙</Text>
                  <Text style={styles.pillText}>Budget Friendly</Text>
                </View>
                <View style={styles.promoPill}>
                  <Text style={styles.pillEmoji}>👑</Text>
                  <Text style={styles.pillText}>Premium Options</Text>
                </View>
                <View style={styles.promoPill}>
                  <Text style={styles.pillEmoji}>🛡️</Text>
                  <Text style={styles.pillText}>Verified Vendors</Text>
                </View>
              </View>
            </View>

            <Image
              source={Assets.weddingMandapArt}
              style={styles.promoMandapArt}
              resizeMode="contain"
            />
          </LinearGradient>

          {/* Card 2: Trusted Vendors Happier Weddings */}
          <View style={styles.promoCardPeach}>
            <View style={styles.promoPeachLeft}>
              <Text style={styles.promoPeachTitle}>
                Trusted Vendors{'\n'}
                <Text style={styles.promoPeachTitleSub}>Happier Weddings</Text>
              </Text>
              <Text style={styles.promoPeachDesc}>
                Real People. Real Reviews.{'\n'}Real Celebrations.
              </Text>
              <View style={styles.polaroidDotsRow}>
                <View style={[styles.pDot, styles.pDotActive]} />
                <View style={styles.pDot} />
                <View style={styles.pDot} />
              </View>
            </View>

            <View style={styles.polaroidFrame}>
              <Image source={Assets.brideGroom} style={styles.polaroidImg} />
            </View>
          </View>
        </ScrollView>

        {/* 📍 Top Vendors Near You Section */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionPinEmoji}>📍</Text>
              <Text style={styles.sectionTitle}>Top Vendors Near You</Text>
            </View>
            <Text style={styles.vendorsSubtitle}>50+ verified vendors within 5 KM</Text>
          </View>
          <TouchableOpacity onPress={() => navigation?.navigate('Services')}>
            <Text style={styles.viewAllText}>View All ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Top Vendors Horizontal List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vendorsScrollList}
        >
          {topVendors.map((vendor) => (
            <View key={vendor.id} style={styles.vendorCard}>
              {/* Vendor Image with Heart & Verified Badge */}
              <View style={styles.vendorImgWrapper}>
                <Image source={vendor.image} style={styles.vendorCoverImg} />
                <TouchableOpacity
                  onPress={() => toggleFavorite(vendor.id)}
                  activeOpacity={0.7}
                  style={styles.favoriteBtn}
                >
                  <Text style={styles.heartEmoji}>
                    {favorites[vendor.id] ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✔ Verified</Text>
                </View>
              </View>

              {/* Vendor Info */}
              <View style={styles.vendorInfoBox}>
                <Text style={styles.vendorName} numberOfLines={1}>
                  {vendor.name}
                </Text>

                <View style={styles.vendorRatingRow}>
                  <Text style={styles.starEmoji}>⭐</Text>
                  <Text style={styles.ratingNumber}>
                    {vendor.rating} <Text style={styles.reviewsText}>({vendor.reviews})</Text>
                  </Text>
                </View>

                <View style={styles.distanceRow}>
                  <Text style={styles.distPin}>📍</Text>
                  <Text style={styles.distText}>{vendor.distance}</Text>
                </View>

                <Text style={styles.vendorPrice}>{vendor.price}</Text>

                {/* View Details Button */}
                <TouchableOpacity
                  onPress={() => navigation?.navigate('Services')}
                  activeOpacity={0.75}
                  style={styles.viewDetailsBtn}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Location Selection Modal */}
      <ManualLocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={(city, locality, pincode) => setManualLocation(city, locality, pincode)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF7F4',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#FDF7F4',
  },
  logoCol: {
    alignItems: 'flex-start',
  },
  headerLogo: {
    width: 120,
    height: 48,
  },
  headerTagline: {
    fontSize: 6.5,
    fontWeight: '800',
    color: '#4A1220',
    letterSpacing: 1,
    marginTop: -4,
  },
  userLocationCol: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },
  userGreetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#E8BCAB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarEmoji: {
    fontSize: 16,
  },
  greetingText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
  },
  userNameBold: {
    fontWeight: '800',
    color: '#1A040A',
  },
  locationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationPin: {
    fontSize: 10,
    color: '#8A072D',
  },
  locationCityName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A072D',
    maxWidth: 110,
  },
  dropdownChevron: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8A072D',
  },
  notificationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellEmoji: {
    fontSize: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#D93025',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCount: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileThumbCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#E8BCAB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileThumbEmoji: {
    fontSize: 16,
  },
  greetingTextCol: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: 4,
  },

  // Search & Filter
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    height: 44,
    paddingHorizontal: Spacing.sm,
    gap: 6,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#1A040A',
  },
  micBtn: {
    padding: 4,
  },
  micEmoji: {
    fontSize: 14,
  },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECE6',
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E8BCAB',
    height: 44,
    paddingHorizontal: Spacing.md,
    gap: 4,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Hero Banner
  heroBannerContainer: {
    marginVertical: 6,
  },
  heroBanner: {
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  heroMainTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A040A',
    lineHeight: 23,
    marginBottom: 4,
  },
  heroTitleMaroon: {
    color: '#8A072D',
    fontWeight: '800',
  },
  heroSubText: {
    fontSize: 10.5,
    color: '#5E4E52',
    lineHeight: 14,
    marginBottom: 10,
  },
  heroCta: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.borderRadius.round,
    overflow: 'hidden',
  },
  heroCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    gap: 6,
  },
  heroCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroCtaArrow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroVisualWrapper: {
    width: 125,
    height: 130,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCoupleImage: {
    width: '100%',
    height: '100%',
  },
  heroScriptBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  heroScriptText: {
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
  },
  carouselDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  cDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DEC2B8',
  },
  cDotActive: {
    backgroundColor: '#8A072D',
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  // Popular Services Grid
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionFireEmoji: {
    fontSize: 16,
  },
  sectionPinEmoji: {
    fontSize: 16,
    color: '#8A072D',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A040A',
  },
  vendorsSubtitle: {
    fontSize: 10.5,
    color: '#7A686C',
    marginTop: 1,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A072D',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginVertical: 4,
  },
  serviceTileCol: {
    width: (SCREEN_WIDTH - 48) / 6,
    alignItems: 'center',
  },
  serviceSquareTile: {
    width: 48,
    height: 48,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F5CFC0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  serviceItemImg: {
    width: 36,
    height: 36,
  },
  moreIconGrid: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8A072D',
  },
  serviceItemLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#2A0713',
    textAlign: 'center',
  },

  // Promo Banners
  promoCardsScroll: {
    gap: 12,
    paddingVertical: 10,
  },
  promoCardMaroon: {
    width: SCREEN_WIDTH * 0.72,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  promoLeftCol: {
    zIndex: 2,
  },
  promoMaroonHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 19,
    marginBottom: 10,
  },
  promoPillsRow: {
    gap: 4,
  },
  promoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pillEmoji: {
    fontSize: 10,
  },
  pillText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#F5D1C4',
  },
  promoMandapArt: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    width: 140,
    height: 100,
    opacity: 0.35,
  },
  promoCardPeach: {
    width: SCREEN_WIDTH * 0.72,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoPeachLeft: {
    flex: 1,
    paddingRight: 6,
  },
  promoPeachTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 16,
  },
  promoPeachTitleSub: {
    fontWeight: '800',
  },
  promoPeachDesc: {
    fontSize: 9,
    color: '#5E4E52',
    lineHeight: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  polaroidDotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  pDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#DEC2B8',
  },
  pDotActive: {
    backgroundColor: '#8A072D',
  },
  polaroidFrame: {
    width: 80,
    height: 90,
    backgroundColor: '#FFFFFF',
    padding: 3,
    paddingBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E8D5CD',
    transform: [{ rotate: '4deg' }],
  },
  polaroidImg: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },

  // Top Vendors
  vendorsScrollList: {
    gap: 12,
    paddingVertical: 8,
  },
  vendorCard: {
    width: 155,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
  },
  vendorImgWrapper: {
    width: '100%',
    height: 100,
    position: 'relative',
    backgroundColor: '#FDECE6',
  },
  vendorCoverImg: {
    width: '100%',
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartEmoji: {
    fontSize: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#137333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vendorInfoBox: {
    padding: Spacing.sm,
  },
  vendorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
    marginBottom: 3,
  },
  vendorRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  starEmoji: {
    fontSize: 10,
  },
  ratingNumber: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  reviewsText: {
    fontWeight: '400',
    color: '#7A686C',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
    marginBottom: 4,
  },
  distPin: {
    fontSize: 9,
    color: '#8A072D',
  },
  distText: {
    fontSize: 10,
    color: '#7A686C',
  },
  vendorPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A072D',
    marginBottom: 8,
  },
  viewDetailsBtn: {
    borderRadius: Spacing.borderRadius.round,
    borderWidth: 1.2,
    borderColor: '#8A072D',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
  },
});
