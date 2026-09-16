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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { ServiceDetailScreen } from './ServiceDetailScreen';
import { api, ApiService } from '../services/api';
import { resolveImage } from '../utils/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 12;
const GAP = 8;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GAP * 2) / 3;

interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  vendors: string;
  image?: any;
  category: 'Wedding Services' | 'Shopping' | 'Essentials' | 'Entertainment' | 'All';
  isMore?: boolean;
}

export const ServicesScreen: React.FC<{ navigation?: any; onSelectService?: (service: ServiceItem) => void }> = ({
  navigation,
  onSelectService,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);

  React.useEffect(() => {
    api
      .services()
      .then((res) => {
        const items: ServiceItem[] = res.items.map((s: ApiService) => ({
          id: s._id || s.slug,
          name: s.name,
          tagline: s.tagline,
          vendors: `${s.vendorsCount}+ Vendors`,
          image: resolveImage(s.imageKey),
          category: s.category,
        }));
        items.push({
          id: 'more',
          name: 'More Services',
          tagline: 'Explore All Categories',
          vendors: '',
          category: 'All',
          isMore: true,
        });
        setAllServices(items);
      })
      .catch(() => undefined);
  }, []);

  const filterTabs = ['All', 'Wedding Services', 'Shopping', 'Essentials', 'Entertainment'];

  const filteredServices = allServices.filter((item) => {
    const matchesTab = selectedTab === 'All' || item.category === selectedTab || item.isMore;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF7F4" />

      {/* Top Header Row with Status Bar Protection */}
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
          onPress={() => navigation?.navigate('Home')}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            All <Text style={styles.headerTitleMaroon}>Services</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Everything you need for a perfect wedding</Text>
        </View>

        <View style={styles.headerRightActions}>
          <View style={styles.scriptBadge}>
            <Text style={styles.scriptBadgeText}>Shaadi</Text>
            <Text style={styles.scriptBadgeSub}>Made</Text>
            <Text style={styles.scriptBadgeText}>Simple ♡</Text>
          </View>
          <TouchableOpacity style={styles.searchIconBtn}>
            <Ionicons name="search-outline" size={22} color="#1A040A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#8C7A7E" style={styles.searchIcon} />
        <TextInput
          placeholder="Search services (e.g. Dhol, Photographer, Jewellery...)"
          placeholderTextColor="#8C7A7E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color="#8C7A7E" />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Filter Pills */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {filterTabs.map((tab) => {
            const isSelected = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                activeOpacity={0.8}
                style={[styles.tabPill, isSelected && styles.tabPillActive]}
              >
                <Text style={[styles.tabPillText, isSelected && styles.tabPillTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3-Column Services Cards Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.85}
              style={styles.serviceCard}
              onPress={() => {
                if (!service.isMore) {
                  navigation?.navigate('ServiceDetail', {
                    serviceName: service.name,
                    serviceTagline: service.tagline,
                    serviceImage: service.image,
                  });
                }
              }}
            >
              {service.isMore ? (
                <View style={styles.moreCardCover}>
                  <View style={styles.moreGridDots}>
                    <View style={styles.mDot} />
                    <View style={styles.mDot} />
                    <View style={styles.mDot} />
                    <View style={styles.mDot} />
                  </View>
                </View>
              ) : (
                <View style={styles.cardImageWrapper}>
                  <Image source={service.image} style={styles.cardCoverImg} />
                </View>
              )}

              {/* Card Bottom Body */}
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {service.name}
                </Text>
                <Text style={styles.cardTagline} numberOfLines={2}>
                  {service.tagline}
                </Text>

                <View style={styles.cardBottomRow}>
                  {service.vendors ? (
                    <Text style={styles.cardVendors} numberOfLines={1}>
                      {service.vendors}
                    </Text>
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                  <View style={styles.arrowCircle}>
                    <Ionicons name="arrow-forward" size={10} color="#8A072D" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sticky Promotional Shahi Booking Banner */}
        <LinearGradient
          colors={['#8A072D', '#5E041E', '#3D0212']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shahiBookingBanner}
        >
          <View style={styles.shahiLeftCol}>
            <MaterialCommunityIcons name="ring" size={26} color="#F3D09C" />
            <View>
              <Text style={styles.shahiTitle}>
                Har <Text style={styles.shahiTitleGold}>Wedding Ki Zarurat</Text>
              </Text>
              <Text style={styles.shahiSubtitle}>Ek Jagah</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.bookNowBtn}
            onPress={() => {
              navigation?.navigate('ServiceDetail', {
                serviceName: 'Dhol',
                serviceTagline: 'Make every beat special with professional Dhol artists for your wedding celebrations.',
                serviceImage: Assets.serviceDhol,
              });
            }}
          >
            <Text style={styles.bookNowText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={13} color="#8A072D" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF7F4',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GRID_PADDING,
    paddingBottom: 6,
    backgroundColor: '#FDF7F4',
  },
  backBtn: {
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
    color: '#7A686C',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scriptBadge: {
    alignItems: 'flex-end',
  },
  scriptBadgeText: {
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 12,
  },
  scriptBadgeSub: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#8A072D',
    lineHeight: 10,
  },
  searchIconBtn: {
    padding: 4,
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: GRID_PADDING,
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: Spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    height: 42,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#1A040A',
  },

  // Filter Pills
  tabsWrapper: {
    marginBottom: 10,
  },
  tabsScroll: {
    paddingHorizontal: GRID_PADDING,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.round,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F5CFC0',
  },
  tabPillActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  tabPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8A072D',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // 3-Column Services Grid
  scrollContent: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: GAP,
  },
  serviceCard: {
    width: CARD_WIDTH,
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
  cardImageWrapper: {
    width: '100%',
    height: 64,
    backgroundColor: '#FDECE6',
    overflow: 'hidden',
  },
  cardCoverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moreCardCover: {
    width: '100%',
    height: 64,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreGridDots: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8A072D',
  },
  cardBody: {
    padding: 6,
  },
  cardName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A040A',
    marginBottom: 2,
  },
  cardTagline: {
    fontSize: 8.5,
    color: '#7A686C',
    lineHeight: 11,
    height: 22,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardVendors: {
    fontSize: 8,
    fontWeight: '700',
    color: '#8A072D',
    flex: 1,
  },
  arrowCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#E8BCAB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom Sticky Shahi Banner
  shahiBookingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  shahiLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  shahiTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shahiTitleGold: {
    color: '#F3D09C',
    fontWeight: '800',
  },
  shahiSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F6D6CB',
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Spacing.borderRadius.round,
    gap: 4,
  },
  bookNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
});
