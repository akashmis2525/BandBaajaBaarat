import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalDialog } from '../../components/RoyalDialog';

interface VendorPortfolioManagerProps {
  navigation?: any;
  onBack?: () => void;
}

export const VendorPortfolioManagerScreen: React.FC<VendorPortfolioManagerProps> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'photos' | 'packages'>('photos');

  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<{
    visible: boolean;
    type?: 'success' | 'warning' | 'info' | 'error' | 'royal';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    highlightText?: string;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showDialog = (config: {
    type?: 'success' | 'warning' | 'info' | 'error' | 'royal';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    highlightText?: string;
  }) => {
    setDialogConfig({ ...config, visible: true });
  };

  const hideDialog = () => {
    setDialogConfig((prev) => ({ ...prev, visible: false }));
  };

  const [photos, setPhotos] = useState([
    { id: '1', title: 'Grand Royal Carved Mandap', uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', views: 420 },
    { id: '2', title: 'Floral Archway Entrance', uri: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80', views: 310 },
    { id: '3', title: 'LED Fairy Light Canopy', uri: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&q=80', views: 550 },
    { id: '4', title: 'Ambient Stage Backdrop', uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80', views: 280 },
    { id: '5', title: 'Mirror Welcome Acrylic Easel', uri: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500&q=80', views: 190 },
    { id: '6', title: 'VIP Royal Maharaja Sofas', uri: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', views: 380 },
  ]);

  const [packages, setPackages] = useState([
    {
      id: 'P1',
      name: 'Silver Celebration Package',
      price: 45000,
      inclusions: ['Classic Mandap Setup', 'Basic Entrance Arch', 'Warm LED Stage Lighting'],
      isPopular: false,
    },
    {
      id: 'P2',
      name: 'Grand Royal Mandap & Decor',
      price: 75000,
      inclusions: ['Rajwada Carved Mandap', 'Exotic Floral Entry Arch', 'Fairy Light Canopy', 'Welcome Board', 'VIP Sofa Set'],
      isPopular: true,
    },
    {
      id: 'P3',
      name: 'Palace Luxury Imperial Setup',
      price: 125000,
      inclusions: ['Crystal Chandelier Mandap', 'Tunnel Flower Entry', 'Full Ambient Wash Lights', 'Glass Aisle Pathway'],
      isPopular: false,
    },
  ]);

  const handleUploadPhoto = () => {
    showDialog({
      type: 'royal',
      title: 'Upload Showcase Photo 📸',
      message: 'Choose high-resolution photos of your recent wedding stage or mandap setup to attract premium couples in Indore.',
      confirmText: 'Choose from Gallery',
      cancelText: 'Cancel',
      onCancel: hideDialog,
      onConfirm: () => {
        const newP = {
          id: Date.now().toString(),
          title: 'Latest Wedding Setup Showcase',
          uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80',
          views: 1,
        };
        setPhotos([newP, ...photos]);
        showDialog({
          type: 'success',
          title: 'Photo Uploaded! 🎉',
          message: 'New photo has been added to your public storefront portfolio.',
          confirmText: 'Great!',
          onConfirm: hideDialog,
        });
      },
    });
  };

  const handleEditPackage = (pkgName: string) => {
    showDialog({
      type: 'royal',
      title: 'Edit Package Details 📦',
      message: `Modify deliverables, photos and pricing for "${pkgName}".`,
      confirmText: 'Save Package',
      cancelText: 'Cancel',
      onCancel: hideDialog,
      onConfirm: () => {
        showDialog({
          type: 'success',
          title: 'Package Saved! ✨',
          message: `Changes to "${pkgName}" are live for all upcoming inquiries.`,
          confirmText: 'Done',
          onConfirm: hideDialog,
        });
      },
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboard');
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
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Portfolio & <Text style={styles.screenTitleHighlight}>Packages</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Showcase your best wedding work to attract top couples
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="images" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Gallery</Text>
            <Text style={styles.decorativeLine2}>Showcase</Text>
            <Text style={styles.decorativeLine3}>Packages ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Selector */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'photos' && styles.tabBtnActive]}
            onPress={() => setActiveTab('photos')}
          >
            <Ionicons
              name="images-outline"
              size={15}
              color={activeTab === 'photos' ? '#8A072D' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabBtnText, activeTab === 'photos' && styles.tabBtnTextActive]}>
              Photo Gallery ({photos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'packages' && styles.tabBtnActive]}
            onPress={() => setActiveTab('packages')}
          >
            <Ionicons
              name="pricetags-outline"
              size={15}
              color={activeTab === 'packages' ? '#8A072D' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabBtnText, activeTab === 'packages' && styles.tabBtnTextActive]}>
              Standard Packages ({packages.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'photos' ? (
          <>
            {/* Upload Action Strip */}
            <TouchableOpacity
              style={styles.uploadCard}
              activeOpacity={0.85}
              onPress={handleUploadPhoto}
            >
              <View style={styles.uploadIconCircle}>
                <Ionicons name="cloud-upload" size={20} color="#8A072D" />
              </View>
              <View style={styles.uploadTextCol}>
                <Text style={styles.uploadHeading}>+ Upload New Setup Photos</Text>
                <Text style={styles.uploadSub}>Add high-resolution photos of recent mandap & decor</Text>
              </View>
            </TouchableOpacity>

            {/* 2-Column Photo Grid */}
            <View style={styles.photoGrid}>
              {photos.map((item) => (
                <View key={item.id} style={styles.photoCard}>
                  <Image source={{ uri: item.uri }} style={styles.photoImg} />
                  <View style={styles.photoMeta}>
                    <Text style={styles.photoTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.viewsRow}>
                      <Ionicons name="eye-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.viewsText}>{item.views} views</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          /* Packages List */
          <View style={styles.packagesList}>
            {packages.map((pkg) => (
              <View key={pkg.id} style={styles.pkgCard}>
                {pkg.isPopular && (
                  <View style={styles.popularRibbon}>
                    <Text style={styles.popularRibbonText}>★ MOST POPULAR AMONG COUPLES</Text>
                  </View>
                )}
                <View style={styles.pkgHeader}>
                  <Text style={styles.pkgTitle}>{pkg.name}</Text>
                  <Text style={styles.pkgPrice}>₹ {pkg.price.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.inclusionsList}>
                  {pkg.inclusions.map((inc, i) => (
                    <View key={i} style={styles.incItem}>
                      <Ionicons name="checkmark-circle" size={14} color="#16A34A" style={{ marginRight: 6 }} />
                      <Text style={styles.incText}>{inc}</Text>
                    </View>
                  ))}
                </View>

                  <TouchableOpacity
                    style={styles.editPkgBtn}
                    onPress={() => handleEditPackage(pkg.name)}
                  >
                    <Text style={styles.editPkgBtnText}>Edit Package Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* Royal Themed Custom Dialog */}
        <RoyalDialog {...dialogConfig} />
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
    color: '#8A072D',
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: '#556987',
    marginTop: 2,
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
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine2: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine3: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#8A072D',
    lineHeight: 10,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#8A072D',
    fontWeight: '700',
  },

  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  uploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  uploadTextCol: {
    flex: 1,
  },
  uploadHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
  },
  uploadSub: {
    fontSize: 10.5,
    color: '#9F1239',
    marginTop: 1,
  },

  // Photo Grid
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  photoImg: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
  },
  photoMeta: {
    padding: 8,
  },
  photoTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  viewsText: {
    fontSize: 10,
    color: '#64748B',
  },

  // Packages List
  packagesList: {
    gap: 12,
  },
  pkgCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  popularRibbon: {
    backgroundColor: '#F59E0B',
    paddingVertical: 3,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 8,
    marginBottom: 8,
  },
  popularRibbonText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  pkgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pkgTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  pkgPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8A072D',
  },
  inclusionsList: {
    gap: 4,
    marginBottom: 12,
  },
  incItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incText: {
    fontSize: 11.5,
    color: '#475569',
  },
  editPkgBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editPkgBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
});
