import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { useLocation } from '../context/LocationContext';
import { ManualLocationModal } from '../components/ManualLocationModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LocationAccessScreenProps {
  onSuccess: () => void;
  onSkip?: () => void;
}

export const LocationAccessScreen: React.FC<LocationAccessScreenProps> = ({
  onSuccess,
  onSkip,
}) => {
  const insets = useSafeAreaInsets();
  const { location, isLoading, errorMessage, fetchLiveLocation, setManualLocation } = useLocation();
  const [showManualModal, setShowManualModal] = useState(false);
  const [detectedToast, setDetectedToast] = useState<string | null>(null);

  const steps = [
    { id: 1, label: 'Welcome', status: 'completed' },
    { id: 2, label: 'Intro', status: 'completed' },
    { id: 3, label: 'Location', status: 'active' },
    { id: 4, label: 'Login', status: 'pending' },
    { id: 5, label: 'Profile', status: 'pending' },
  ];

  const handleAllowLocation = async () => {
    const success = await fetchLiveLocation();
    if (success) {
      setDetectedToast(`📍 Location detected: ${location.city}! Fetching nearby artists...`);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    }
  };

  const handleSelectManual = (city: string, locality?: string, pincode?: string) => {
    setManualLocation(city, locality, pincode);
    setDetectedToast(`🏰 Set location to ${city}! Loading royal services...`);
    setTimeout(() => {
      onSuccess();
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF7F4" />

      {/* Top Skip Button */}
      <View style={[styles.skipRow, { top: insets.top > 0 ? insets.top + 8 : 28 }]}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
          <Text style={styles.skipArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

        {/* 5-Step Stepper Component */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperLineBackground}>
            <View style={styles.stepperLineProgress} />
          </View>

          <View style={styles.stepsRow}>
            {steps.map((step) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <View key={step.id} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      isCompleted && styles.stepCircleCompleted,
                      isActive && styles.stepCircleActive,
                      !isCompleted && !isActive && styles.stepCirclePending,
                    ]}
                  >
                    {isCompleted ? (
                      <Text style={styles.stepCheckmark}>✓</Text>
                    ) : (
                      <Text
                        style={[
                          styles.stepNumber,
                          isActive && styles.stepNumberActive,
                        ]}
                      >
                        {step.id}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.stepLabelActive,
                      isCompleted && styles.stepLabelCompleted,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            Allow <Text style={styles.mainTitleMaroon}>Location Access</Text>
          </Text>
          <Text style={styles.subtitle}>
            Find the best wedding vendors near you – from dhol to decorators, all within your area.
          </Text>
        </View>

        {/* Feedback / Toast Message */}
        {detectedToast && (
          <View style={styles.toastCard}>
            <Text style={styles.toastText}>{detectedToast}</Text>
          </View>
        )}

        {errorMessage && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* 3D Isometric Map Graphic with Floating Pins */}
        <View style={styles.mapGraphicWrapper}>
          {/* Isometric Map Board */}
          <View style={styles.isometricMap}>
            {/* Map Terrain Elements */}
            <View style={styles.mapGreenArea} />
            <View style={styles.mapRiver} />
            <View style={styles.mapRoadH} />
            <View style={styles.mapRoadV} />
            <View style={styles.mapRoadDiag} />

            {/* Center Pulsing Radar and Pin */}
            <View style={styles.radarWaveOuter}>
              <View style={styles.radarWaveInner}>
                <View style={styles.centerPinMarker}>
                  <View style={styles.centerPinDot} />
                </View>
              </View>
            </View>

            {/* Floating Service Badge: Photographers (Top-Left) */}
            <View style={[styles.floatingBadge, styles.badgePhotographers]}>
              <View style={styles.badgeIconCircle}>
                <Image source={Assets.servicePhotography} style={styles.badgeImg} />
              </View>
              <Text style={styles.badgeLabel}>Photographers</Text>
            </View>

            {/* Floating Service Badge: Decorators (Top-Right) */}
            <View style={[styles.floatingBadge, styles.badgeDecorators]}>
              <View style={styles.badgeIconCircle}>
                <Image source={Assets.serviceDecorators} style={styles.badgeImg} />
              </View>
              <Text style={styles.badgeLabel}>Decorators</Text>
            </View>

            {/* Floating Service Badge: Dhol & Band (Mid-Left) */}
            <View style={[styles.floatingBadge, styles.badgeDhol]}>
              <View style={styles.badgeIconCircle}>
                <Image source={Assets.serviceDhol} style={styles.badgeImg} />
              </View>
              <Text style={styles.badgeLabel}>Dhol & Band</Text>
            </View>

            {/* Floating Service Badge: Jewellery (Mid-Right) */}
            <View style={[styles.floatingBadge, styles.badgeJewellery]}>
              <View style={styles.badgeIconCircle}>
                <Image source={Assets.serviceJewellery} style={styles.badgeImg} />
              </View>
              <Text style={styles.badgeLabel}>Jewellery</Text>
            </View>

            {/* Floating Service Badge: Wedding Dresses (Bottom-Left) */}
            <View style={[styles.floatingBadge, styles.badgeDresses]}>
              <View style={styles.badgeIconCircle}>
                <Image source={Assets.serviceDresses} style={styles.badgeImg} />
              </View>
              <Text style={styles.badgeLabel}>Wedding Dresses</Text>
            </View>

            {/* Floating Service Badge: DJ Services (Bottom-Right) */}
            <View style={[styles.floatingBadge, styles.badgeDJ]}>
              <View style={styles.badgeIconCircle}>
                <Image source={Assets.serviceDj} style={styles.badgeImg} />
              </View>
              <Text style={styles.badgeLabel}>DJ Services</Text>
            </View>
          </View>
        </View>

        {/* 3-Pillar Highlight Feature Box */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitCol}>
            <View style={styles.benefitIconCircle}>
              <Text style={styles.benefitEmoji}>📍</Text>
            </View>
            <Text style={styles.benefitTitle}>Get Nearby{'\n'}Vendors</Text>
          </View>

          <View style={styles.benefitDivider} />

          <View style={styles.benefitCol}>
            <View style={styles.benefitIconCircle}>
              <Text style={styles.benefitEmoji}>⏰</Text>
            </View>
            <Text style={styles.benefitTitle}>Save Time</Text>
          </View>

          <View style={styles.benefitDivider} />

          <View style={styles.benefitCol}>
            <View style={styles.benefitIconCircle}>
              <Text style={styles.benefitEmoji}>⭐</Text>
            </View>
            <Text style={styles.benefitTitle}>Better Deals{'\n'}in Your Area</Text>
          </View>
        </View>

        {/* Action Buttons with Business Logic */}
        <View style={styles.buttonContainer}>
          {/* Allow Location Primary Button */}
          <TouchableOpacity
            onPress={handleAllowLocation}
            disabled={isLoading}
            activeOpacity={0.85}
            style={styles.primaryBtnWrapper}
          >
            <LinearGradient
              colors={['#8A072D', '#5E041E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGradient}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.primaryBtnText}>Detecting GPS Location...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.primaryBtnIcon}>🧭</Text>
                  <Text style={styles.primaryBtnText}>Allow Location</Text>
                  <Text style={styles.primaryBtnArrow}>→</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Enter Location Manually Secondary Button */}
          <TouchableOpacity
            onPress={() => setShowManualModal(true)}
            activeOpacity={0.75}
            style={styles.manualBtn}
          >
            <Text style={styles.manualBtnIcon}>🗺️</Text>
            <Text style={styles.manualBtnText}>Enter Location Manually</Text>
            <Text style={styles.manualBtnArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Safe & Secure Privacy Notice */}
        <View style={styles.privacyRow}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Your location is safe with us and will only be used to show nearby wedding services.
          </Text>
        </View>

        {/* Brand Tagline & Palace Watermark Motif */}
        <View style={styles.footerBranding}>
          <View style={styles.footerDividerRow}>
            <View style={styles.footerGoldLine} />
            <Text style={styles.footerTagline}>HAPPY PEOPLE</Text>
            <View style={styles.footerGoldLine} />
          </View>
          <Text style={styles.footerSubTagline}>HAPPIER WEDDINGS</Text>
          <Text style={styles.palaceSilhouette}>🏛️ 🏰 🕌 🏰 🏛️</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Manual Location Selection Modal */}
      <ManualLocationModal
        visible={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSelectLocation={handleSelectManual}
      />
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    alignItems: 'center',
  },
  topHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoLight: {
    width: 170,
    height: 90,
  },
  taglineText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4A1220',
    letterSpacing: 1.8,
    marginTop: -8,
  },
  taglineOrnamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  taglineSubText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 1.5,
  },
  goldLine: {
    width: 20,
    height: 1,
    backgroundColor: '#D19C74',
  },
  stepperContainer: {
    width: '100%',
    marginVertical: 10,
    position: 'relative',
  },
  stepperLineBackground: {
    position: 'absolute',
    top: 13,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#E5D0C9',
  },
  stepperLineProgress: {
    width: '50%',
    height: 2,
    backgroundColor: '#8A072D',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 48) / 5,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    marginBottom: 4,
  },
  stepCircleCompleted: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  stepCircleActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  stepCirclePending: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D4C0B8',
  },
  stepCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C7A7E',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#7D6A70',
  },
  stepLabelActive: {
    fontWeight: '800',
    color: '#8A072D',
  },
  stepLabelCompleted: {
    fontWeight: '600',
    color: '#4A1220',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: Spacing.sm,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A040A',
    marginBottom: 4,
    textAlign: 'center',
  },
  mainTitleMaroon: {
    color: '#8A072D',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    color: '#5E4E52',
    textAlign: 'center',
    lineHeight: 17,
  },
  toastCard: {
    backgroundColor: '#E6F4EA',
    borderWidth: 1,
    borderColor: '#B7E1CD',
    borderRadius: Spacing.borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    marginVertical: 4,
    width: '100%',
  },
  toastText: {
    color: '#137333',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: '#FCE8E6',
    borderWidth: 1,
    borderColor: '#F5C6CB',
    borderRadius: Spacing.borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    marginVertical: 4,
    width: '100%',
  },
  errorText: {
    color: '#D93025',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  mapGraphicWrapper: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  isometricMap: {
    width: SCREEN_WIDTH - 48,
    height: 210,
    backgroundColor: '#F5EFEB',
    borderRadius: Spacing.borderRadius.xl,
    borderWidth: 2,
    borderColor: '#E8D5C8',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  mapGreenArea: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 90,
    height: 70,
    backgroundColor: '#E3EBD7',
    borderRadius: 20,
  },
  mapRiver: {
    position: 'absolute',
    top: 60,
    right: -10,
    width: 140,
    height: 90,
    backgroundColor: '#D1E6EF',
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 80,
  },
  mapRoadH: {
    position: 'absolute',
    top: '48%',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2D4CC',
  },
  mapRoadV: {
    position: 'absolute',
    left: '48%',
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2D4CC',
  },
  mapRoadDiag: {
    position: 'absolute',
    top: 20,
    left: 40,
    width: 180,
    height: 6,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '35deg' }],
  },
  radarWaveOuter: {
    position: 'absolute',
    top: '48%',
    left: '48%',
    marginLeft: -45,
    marginTop: -45,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(138, 7, 45, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(138, 7, 45, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarWaveInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(138, 7, 45, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(138, 7, 45, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPinMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8A072D',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  centerPinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  floatingBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 3,
    paddingHorizontal: 7,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F0DFD8',
    gap: 4,
  },
  badgeIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2A0713',
  },
  badgePhotographers: {
    top: 14,
    left: 12,
  },
  badgeDecorators: {
    top: 14,
    right: 12,
  },
  badgeDhol: {
    top: '46%',
    left: 8,
  },
  badgeJewellery: {
    top: '46%',
    right: 8,
  },
  badgeDresses: {
    bottom: 12,
    left: 14,
  },
  badgeDJ: {
    bottom: 12,
    right: 14,
  },
  benefitsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.borderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  benefitCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  benefitIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  benefitEmoji: {
    fontSize: 16,
  },
  benefitTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
    textAlign: 'center',
    lineHeight: 14,
  },
  benefitDivider: {
    width: 1,
    backgroundColor: '#F5E4DE',
    marginVertical: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  primaryBtnWrapper: {
    width: '100%',
    borderRadius: Spacing.borderRadius.round,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  primaryBtnIcon: {
    fontSize: 16,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  primaryBtnArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.borderRadius.round,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#8A072D',
    gap: 8,
  },
  manualBtnIcon: {
    fontSize: 16,
  },
  manualBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A072D',
    flex: 1,
    textAlign: 'center',
  },
  manualBtnArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8A072D',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    marginTop: 4,
    marginBottom: 12,
  },
  lockIcon: {
    fontSize: 12,
  },
  privacyText: {
    fontSize: 9.5,
    color: '#7D6A70',
    textAlign: 'center',
    lineHeight: 13,
    flex: 1,
  },
  footerBranding: {
    alignItems: 'center',
    marginTop: 2,
  },
  footerDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerGoldLine: {
    width: 24,
    height: 1,
    backgroundColor: '#D19C74',
  },
  footerTagline: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 1.5,
  },
  footerSubTagline: {
    fontSize: 8,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  palaceSilhouette: {
    fontSize: 18,
    opacity: 0.25,
    marginTop: 4,
  },
});
