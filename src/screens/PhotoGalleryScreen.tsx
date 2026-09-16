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
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';

const { width, height } = Dimensions.get('window');

interface PhotoGalleryScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

interface GalleryPhoto {
  id: string;
  title: string;
  category: 'mandap' | 'lighting' | 'entry' | 'real_weddings';
  vendor: string;
  location: string;
  rating: number;
  uri: any;
  likesCount: number;
}

export const PhotoGalleryScreen: React.FC<PhotoGalleryScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mandap' | 'lighting' | 'entry' | 'real_weddings'>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  const photos: GalleryPhoto[] = [
    {
      id: 'p1',
      title: 'Grand Royal Rajputana Mandap',
      category: 'mandap',
      vendor: 'Royal Events & Decor',
      location: 'Indore, MP',
      rating: 4.8,
      uri: Assets.weddingMandapArt,
      likesCount: 142,
    },
    {
      id: 'p2',
      title: 'Fairy Tale Crystal Chandelier Lighting',
      category: 'lighting',
      vendor: 'Royal Events & Decor',
      location: 'Bhopal, MP',
      rating: 4.9,
      uri: { uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80' },
      likesCount: 98,
    },
    {
      id: 'p3',
      title: 'Royal Rose & Jasmine Floral Entry Arch',
      category: 'entry',
      vendor: 'Divine Flower Decorators',
      location: 'Indore, MP',
      rating: 4.7,
      uri: { uri: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80' },
      likesCount: 215,
    },
    {
      id: 'p4',
      title: 'Bride & Groom Royal Baarat Procession',
      category: 'real_weddings',
      vendor: 'Royal Beats Dhol Group',
      location: 'Ujjain, MP',
      rating: 4.9,
      uri: Assets.elephantBaaratArt,
      likesCount: 310,
    },
    {
      id: 'p5',
      title: 'Outdoor Garden Mandap with Water Fountain',
      category: 'mandap',
      vendor: 'Shree Krishna Wedding Planners',
      location: 'Indore, MP',
      rating: 4.8,
      uri: { uri: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80' },
      likesCount: 167,
    },
    {
      id: 'p6',
      title: 'LED Tunnel & Fireworks Pathway Entry',
      category: 'lighting',
      vendor: 'Glow Lights & Sound Pro',
      location: 'Indore, MP',
      rating: 4.6,
      uri: { uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' },
      likesCount: 88,
    },
  ];

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const toggleLike = (id: string) => {
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSharePhoto = async (photo: GalleryPhoto) => {
    try {
      await Share.share({
        message: `✨ Check out this wedding decoration inspiration on Band Baaja Baarat!\n\n${photo.title} by ${photo.vendor} (${photo.location})`,
        title: photo.title,
      });
    } catch (e) {
      Alert.alert('Shared', 'Photo link copied!');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
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
              Wedding <Text style={styles.screenTitleHighlight}>Gallery</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Real wedding themes, mandap & stage decor ideas
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="images" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Real</Text>
            <Text style={styles.decorativeLine2}>Weddings</Text>
            <Text style={styles.decorativeLine3}>Decor Ideas ♡</Text>
          </View>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'all' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'all' && styles.categoryTabTextActive]}>
              All Photos ({photos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'mandap' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('mandap')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'mandap' && styles.categoryTabTextActive]}>
              🎪 Mandap & Stage
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'lighting' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('lighting')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'lighting' && styles.categoryTabTextActive]}>
              ✨ Lighting & Chandeliers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'entry' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('entry')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'entry' && styles.categoryTabTextActive]}>
              🌸 Entry Gates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'real_weddings' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('real_weddings')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'real_weddings' && styles.categoryTabTextActive]}>
              🎉 Real Baarat & Entry
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 2-Column Photo Grid */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoGrid}>
          {filteredPhotos.map((photo, index) => {
            const isLiked = likedPhotos[photo.id];
            return (
              <TouchableOpacity
                key={photo.id}
                style={styles.gridCard}
                activeOpacity={0.9}
                onPress={() => setActivePhotoIndex(index)}
              >
                <Image source={photo.uri} style={styles.gridImage} resizeMode="cover" />

                <TouchableOpacity
                  style={styles.likeFloatingBtn}
                  activeOpacity={0.8}
                  onPress={() => toggleLike(photo.id)}
                >
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={16}
                    color={isLiked ? '#E5093A' : '#FFFFFF'}
                  />
                </TouchableOpacity>

                <View style={styles.gridCardOverlay}>
                  <Text style={styles.photoCardTitle} numberOfLines={1}>
                    {photo.title}
                  </Text>
                  <View style={styles.vendorRow}>
                    <Text style={styles.vendorNameText} numberOfLines={1}>
                      {photo.vendor}
                    </Text>
                    <View style={styles.ratingBox}>
                      <Ionicons name="star" size={10} color="#FBBF24" />
                      <Text style={styles.ratingText}>{photo.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoIndex !== null && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setActivePhotoIndex(null)}>
          <View style={styles.lightboxContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Top Lightbox Bar */}
            <View style={[styles.lightboxHeader, { paddingTop: insets.top + 8 }]}>
              <TouchableOpacity style={styles.lightboxCloseBtn} onPress={() => setActivePhotoIndex(null)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.lightboxCounter}>
                {activePhotoIndex + 1} / {filteredPhotos.length}
              </Text>

              <TouchableOpacity
                style={styles.lightboxActionBtn}
                onPress={() => handleSharePhoto(filteredPhotos[activePhotoIndex])}
              >
                <Ionicons name="share-social" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Main Lightbox Image */}
            <View style={styles.lightboxImageWrapper}>
              <Image
                source={filteredPhotos[activePhotoIndex].uri}
                style={styles.lightboxImage}
                resizeMode="contain"
              />
            </View>

            {/* Bottom Lightbox Controls & Vendor Info */}
            <View style={[styles.lightboxBottomBar, { paddingBottom: insets.bottom + 12 }]}>
              <View style={styles.lightboxInfoRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lightboxTitle}>{filteredPhotos[activePhotoIndex].title}</Text>
                  <Text style={styles.lightboxVendor}>
                    By {filteredPhotos[activePhotoIndex].vendor} • {filteredPhotos[activePhotoIndex].location}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.lightboxLikeBtn}
                  onPress={() => toggleLike(filteredPhotos[activePhotoIndex].id)}
                >
                  <Ionicons
                    name={likedPhotos[filteredPhotos[activePhotoIndex].id] ? 'heart' : 'heart-outline'}
                    size={24}
                    color={likedPhotos[filteredPhotos[activePhotoIndex].id] ? '#E5093A' : '#FFFFFF'}
                  />
                </TouchableOpacity>
              </View>

              {/* Action Buttons: Prev/Next & Inquire */}
              <View style={styles.lightboxActionsRow}>
                <TouchableOpacity
                  style={[styles.navArrowBtn, activePhotoIndex === 0 && { opacity: 0.3 }]}
                  disabled={activePhotoIndex === 0}
                  onPress={() => setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
                >
                  <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.inquireBookBtn}
                  activeOpacity={0.88}
                  onPress={() => {
                    setActivePhotoIndex(null);
                    if (navigation?.navigate) {
                      navigation.navigate('ChatMain');
                    }
                  }}
                >
                  <Ionicons name="chatbubble-ellipses" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.inquireBookBtnText}>Inquire / Book This Decor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navArrowBtn, activePhotoIndex === filteredPhotos.length - 1 && { opacity: 0.3 }]}
                  disabled={activePhotoIndex === filteredPhotos.length - 1}
                  onPress={() =>
                    setActivePhotoIndex((prev) =>
                      prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : prev
                    )
                  }
                >
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    paddingBottom: 8,
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
  tagGraphicBox: {
    marginRight: 4,
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

  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  categoryTab: {
    backgroundColor: '#FAF9FB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryTabActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E5093A',
  },
  categoryTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTabTextActive: {
    color: '#E5093A',
    fontWeight: '700',
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  gridContent: {
    padding: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 34) / 2,
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  likeFloatingBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  photoCardTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  vendorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorNameText: {
    fontSize: 9.5,
    color: '#E2E8F0',
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Lightbox
  lightboxContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  lightboxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  lightboxCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxCounter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lightboxActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: width,
    height: height * 0.6,
  },
  lightboxBottomBar: {
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  lightboxInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  lightboxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  lightboxVendor: {
    fontSize: 12,
    color: '#94A3B8',
  },
  lightboxLikeBtn: {
    padding: 8,
  },
  lightboxActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  navArrowBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inquireBookBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5093A',
    borderRadius: 12,
    height: 44,
  },
  inquireBookBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
