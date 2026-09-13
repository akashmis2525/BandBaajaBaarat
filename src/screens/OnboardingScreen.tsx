import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  // Render Onboarding Screen 1 (Groom Baarat & Perfection Quote)
  const renderScreenOne = () => {
    return (
      <View style={styles.slideContainer}>
        {/* Top Header Logo */}
        <View style={styles.topHeader}>
          <Image source={Assets.logoLight} style={styles.logoLight} resizeMode="contain" />
          <Text style={styles.taglineText}>SHAADI KI HAR ZARURAT</Text>
          <View style={styles.taglineOrnamentRow}>
            <View style={styles.goldLine} />
            <Text style={styles.taglineSubText}>EK JAGAH</Text>
            <View style={styles.goldLine} />
          </View>
        </View>

        {/* 3 Pillar Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.featurePinIcon}>📍</Text>
            </View>
            <Text style={styles.featureTitle}>Find Nearby{'\n'}Vendors</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.featureRupeeIcon}>₹</Text>
            </View>
            <Text style={styles.featureTitle}>Compare{'\n'}Price & Quality</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.featureShieldIcon}>🛡️</Text>
            </View>
            <Text style={styles.featureTitle}>Book With{'\n'}Confidence</Text>
          </View>
        </View>

        {/* Romantic Script Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            Because Every Wedding{'\n'}Deserves Perfection ♡
          </Text>
        </View>

        {/* Big Majestic Baarat Cutout Illustration */}
        <View style={styles.groomBaaratVisualWrapper}>
          <Image
            source={Assets.groomBaarat}
            style={styles.groomBaaratImage}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  };

  // Render Onboarding Screen 2 (Bride & Groom + Detailed Card + 5 Services)
  const renderScreenTwo = () => {
    return (
      <View style={styles.slideContainer}>
        {/* Top Header Logo */}
        <View style={styles.topHeader}>
          <Image source={Assets.logoLight} style={styles.logoLightSmall} resizeMode="contain" />
          <Text style={styles.taglineTextSmall}>SHAADI KI HAR ZARURAT</Text>
          <View style={styles.taglineOrnamentRow}>
            <View style={styles.goldLineSmall} />
            <Text style={styles.taglineSubTextSmall}>EK JAGAH</Text>
            <View style={styles.goldLineSmall} />
          </View>
        </View>

        {/* Header Content with Bride & Groom Visual */}
        <View style={styles.screenTwoHeroRow}>
          <View style={styles.screenTwoTextCol}>
            <Text style={styles.heroTitleLarge}>
              Your{'\n'}
              <Text style={styles.heroTitleMaroon}>Perfect Wedding</Text>{'\n'}
              Starts Here
            </Text>
            <Text style={styles.heroDescription}>
              From dhol to decoration, photographers to jewellery – everything you need for your special day, at one place.
            </Text>
          </View>
          <View style={styles.brideGroomImageWrapper}>
            <Image
              source={Assets.brideGroom}
              style={styles.brideGroomImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* 3 Pillar Features Detailed Card */}
        <View style={styles.screenTwoFeaturesCard}>
          <View style={styles.featureDetailItem}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.featurePinIcon}>📍</Text>
            </View>
            <Text style={styles.featureDetailTitle}>Find Nearby{'\n'}Vendors</Text>
            <Text style={styles.featureDetailDesc}>
              Discover trusted wedding vendors near you.
            </Text>
          </View>

          <View style={styles.cardColDivider} />

          <View style={styles.featureDetailItem}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.featureRupeeIcon}>₹</Text>
            </View>
            <Text style={styles.featureDetailTitle}>Compare{'\n'}Price & Quality</Text>
            <Text style={styles.featureDetailDesc}>
              Explore multiple options within your budget.
            </Text>
          </View>

          <View style={styles.cardColDivider} />

          <View style={styles.featureDetailItem}>
            <View style={styles.featureIconCircle}>
              <Text style={styles.featureShieldIcon}>🛡️</Text>
            </View>
            <Text style={styles.featureDetailTitle}>Book With{'\n'}Confidence</Text>
            <Text style={styles.featureDetailDesc}>
              Verified vendors, safe payments and real reviews.
            </Text>
          </View>
        </View>

        {/* Heart Line Divider */}
        <View style={styles.heartDividerContainer}>
          <View style={styles.goldLineLong} />
          <Text style={styles.heartSymbol}>♥</Text>
          <View style={styles.goldLineLong} />
        </View>

        {/* 5 Circular Service Icons */}
        <View style={styles.servicesRow}>
          <View style={styles.serviceItem}>
            <View style={styles.serviceCircle}>
              <Image source={Assets.serviceDhol} style={styles.serviceImg} />
            </View>
            <Text style={styles.serviceLabel}>Dhol</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceCircle}>
              <Image source={Assets.servicePhotography} style={styles.serviceImg} />
            </View>
            <Text style={styles.serviceLabel}>Photography</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceCircle}>
              <Image source={Assets.serviceDresses} style={styles.serviceImg} />
            </View>
            <Text style={styles.serviceLabel}>Dresses</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceCircle}>
              <Image source={Assets.serviceJewellery} style={styles.serviceImg} />
            </View>
            <Text style={styles.serviceLabel}>Jewellery</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceCircle}>
              <Image source={Assets.serviceBuggi} style={styles.serviceImg} />
            </View>
            <Text style={styles.serviceLabel}>Buggi</Text>
          </View>
        </View>

        {/* Bottom Tagline */}
        <Text style={styles.andManyMoreText}>And Many More Wedding Services...</Text>
      </View>
    );
  };

  const slides = [renderScreenOne, renderScreenTwo];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF7F4" />

      {/* Skip Button at Top Right */}
      <View style={styles.skipRow}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
          <Text style={styles.skipArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(newIndex);
        }}
        renderItem={({ item }) => item()}
      />

      {/* Bottom CTA & Pagination */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          style={styles.ctaButtonWrapper}
        >
          <LinearGradient
            colors={['#8A072D', '#6B0522']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 4 Pagination Dots */}
        <View style={styles.paginationRow}>
          {[0, 1, 2, 3].map((dotIndex) => (
            <View
              key={dotIndex}
              style={[
                styles.dot,
                currentIndex === dotIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF7F4',
  },
  skipRow: {
    position: 'absolute',
    top: 48,
    right: Spacing.lg,
    zIndex: 10,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  skipArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 16,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  topHeader: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  logoLight: {
    width: 220,
    height: 120,
  },
  logoLightSmall: {
    width: 170,
    height: 90,
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A1220',
    letterSpacing: 2,
    marginTop: -8,
  },
  taglineTextSmall: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4A1220',
    letterSpacing: 1.5,
    marginTop: -6,
  },
  taglineOrnamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  taglineSubText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 2,
  },
  taglineSubTextSmall: {
    fontSize: 8,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 1.5,
  },
  goldLine: {
    width: 24,
    height: 1.5,
    backgroundColor: '#D19C74',
  },
  goldLineSmall: {
    width: 18,
    height: 1,
    backgroundColor: '#D19C74',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.xs,
    marginTop: 6,
    marginBottom: 12,
  },
  featureItem: {
    alignItems: 'center',
    width: '32%',
  },
  featureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#F5CFC0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featurePinIcon: {
    fontSize: 18,
  },
  featureRupeeIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8A072D',
  },
  featureShieldIcon: {
    fontSize: 18,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A0713',
    textAlign: 'center',
    lineHeight: 16,
  },
  quoteContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#8A072D',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  groomBaaratVisualWrapper: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  groomBaaratImage: {
    width: '100%',
    height: '100%',
  },

  // Screen 2 Specific Styles
  screenTwoHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
    marginBottom: 8,
  },
  screenTwoTextCol: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  heroTitleLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A040A',
    lineHeight: 26,
    marginBottom: 4,
  },
  heroTitleMaroon: {
    color: '#8A072D',
    fontWeight: '800',
  },
  heroDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: '#5E4E52',
    lineHeight: 15,
  },
  brideGroomImageWrapper: {
    width: 130,
    height: 140,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#F0D4CB',
  },
  brideGroomImage: {
    width: '100%',
    height: '100%',
  },
  screenTwoFeaturesCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    width: '100%',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  cardColDivider: {
    width: 1,
    backgroundColor: '#F5E4DE',
    marginVertical: 4,
  },
  featureDetailItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  featureDetailTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2A0713',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 4,
  },
  featureDetailDesc: {
    fontSize: 9,
    color: '#7A686C',
    textAlign: 'center',
    lineHeight: 12,
  },
  heartDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
    gap: 8,
  },
  goldLineLong: {
    flex: 1,
    height: 1,
    backgroundColor: '#D19C74',
  },
  heartSymbol: {
    fontSize: 14,
    color: '#8A072D',
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
    marginBottom: 6,
  },
  serviceItem: {
    alignItems: 'center',
    width: '18%',
  },
  serviceCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDECE6',
    borderWidth: 1,
    borderColor: '#E8BCAB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  serviceImg: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  serviceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2A0713',
    textAlign: 'center',
  },
  andManyMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A072D',
    textAlign: 'center',
    marginTop: 4,
  },

  // Bottom Fixed CTA and Dots
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ctaButtonWrapper: {
    width: '100%',
    borderRadius: Spacing.borderRadius.round,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginBottom: 12,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  ctaArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paginationRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    backgroundColor: '#8A072D',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#DEC2B8',
  },
});
