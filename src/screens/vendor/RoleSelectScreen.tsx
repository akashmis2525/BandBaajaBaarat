import React from 'react';
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
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../../constants/assets';

const { width } = Dimensions.get('window');

interface RoleSelectScreenProps {
  onSelectCustomer: () => void;
  onSelectVendor: () => void;
  onSkip?: () => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  onSelectCustomer,
  onSelectVendor,
  onSkip,
}) => {
  const insets = useSafeAreaInsets();

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onSelectCustomer();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBFB" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:
              Platform.OS === 'android'
                ? (StatusBar.currentHeight || 24) + 6
                : insets.top > 0
                ? insets.top + 2
                : 12,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* 1. TOP HERO SECTION (Logo on Left, Bride-Groom on Right) */}
        {/* ========================================================= */}
        <View style={styles.topHeroRow}>
          {/* Left Column: Brand Logo & Tagline */}
          <View style={styles.topLeftCol}>
            {/* Interlocking Rings with Heart Logo Icon */}
            <View style={styles.ringsLogoWrapper}>
              <View style={styles.ringLeft}>
                <View style={styles.ringInner} />
              </View>
              <View style={styles.ringRight}>
                <View style={styles.ringInner} />
              </View>
              <View style={styles.heartMini}>
                <Ionicons name="heart" size={13} color="#D81B60" />
              </View>
            </View>

            {/* Brand Title */}
            <Text style={styles.brandTitleLine1}>Band Baaja</Text>
            <Text style={styles.brandTitleLine2}>Baarat</Text>
            <Text style={styles.brandSubtitleTracker}>PLAN • BOOK • CELEBRATE</Text>

            {/* Cursive Stylish Tagline */}
            <View style={styles.cursiveTaglineBox}>
              <Text style={styles.cursiveTaglineText}>
                Your Dream Wedding{'\n'}Starts Here ♡
              </Text>
              {/* Subtle curved underline accent */}
              <View style={styles.cursiveUnderline} />
            </View>
          </View>

          {/* Right Column: Organic Cutout Bride & Groom Image */}
          <View style={styles.topRightCol}>
            <View style={styles.organicCutoutFrame}>
              <Image
                source={
                  Assets.brideGroom || {
                    uri: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
                  }
                }
                style={styles.heroBrideGroomImage}
                resizeMode="cover"
              />

              {/* Floating "More Than Just Events ♡" Note Tag */}
              <View style={styles.moreThanEventsTag}>
                <Text style={styles.moreThanEventsText}>
                  More{'\n'}Than{'\n'}Just{'\n'}Events ♡
                </Text>
              </View>
            </View>

            {/* Floating "Skip >" Button on Top Right */}
            <TouchableOpacity
              style={styles.skipPillBtn}
              activeOpacity={0.8}
              onPress={handleSkip}
            >
              <Text style={styles.skipText}>Skip</Text>
              <Ionicons name="chevron-forward" size={12} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. CHOOSE YOUR ROLE HEADER */}
        {/* ========================================================= */}
        <View style={styles.roleHeaderSection}>
          <Text style={styles.chooseRoleTitle}>Choose Your Role</Text>
          <Text style={styles.chooseRoleSubtitle}>
            Same celebrations. Different journeys.
          </Text>

          {/* Decorative Divider with Small Heart */}
          <View style={styles.heartDividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerHeart}>♡</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* ========================================================= */}
        {/* 3. TWO SIDE-BY-SIDE INTERACTIVE ROLE CARDS */}
        {/* ========================================================= */}
        <View style={styles.roleCardsRow}>
          {/* ----------------- CARD 1: FOR FAMILIES ----------------- */}
          <TouchableOpacity
            style={styles.roleCardFamilies}
            activeOpacity={0.9}
            onPress={onSelectCustomer}
          >
            {/* Top Row: Icon Circle + "FOR FAMILIES" Badge */}
            <View style={styles.cardTopRow}>
              <View style={styles.iconCirclePink}>
                <MaterialCommunityIcons name="account-group" size={20} color="#BE185D" />
              </View>
              <View style={styles.badgePink}>
                <Text style={styles.badgePinkText}>FOR FAMILIES</Text>
              </View>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.cardHeading}>Plan My Wedding</Text>
            <Text style={styles.cardDescription}>
              Book trusted vendors in one place
            </Text>

            {/* Mandap Decor Image with Bottom-Right Floating Arrow */}
            <View style={styles.cardImageContainer}>
              <Image
                source={
                  Assets.weddingMandapArt || {
                    uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
                  }
                }
                style={styles.cardCoverImage}
                resizeMode="cover"
              />

              {/* Maroon Circular Floating Arrow Button */}
              <View style={styles.floatingArrowBtnMaroon}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* ----------------- CARD 2: FOR VENDORS ------------------ */}
          <TouchableOpacity
            style={styles.roleCardVendors}
            activeOpacity={0.9}
            onPress={onSelectVendor}
          >
            {/* Top Row: Icon Circle + "FOR VENDORS" Badge */}
            <View style={styles.cardTopRow}>
              <View style={styles.iconCircleYellow}>
                <Ionicons name="storefront-outline" size={20} color="#B45309" />
              </View>
              <View style={styles.badgeYellow}>
                <Text style={styles.badgeYellowText}>FOR VENDORS</Text>
              </View>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.cardHeading}>Grow Your Business</Text>
            <Text style={styles.cardDescription}>
              Get quality leads and bookings
            </Text>

            {/* Camera / Vendor Photography Image with Bottom-Right Floating Arrow */}
            <View style={styles.cardImageContainer}>
              <Image
                source={
                  Assets.servicePhotography || {
                    uri: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80',
                  }
                }
                style={styles.cardCoverImage}
                resizeMode="cover"
              />

              {/* Gold/Brown Circular Floating Arrow Button */}
              <View style={styles.floatingArrowBtnBrown}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* 4. TRUST BADGES STRIP */}
        {/* ========================================================= */}
        <View style={styles.trustBadgeStrip}>
          <View style={styles.trustItem}>
            <Ionicons name="checkmark-circle" size={16} color="#E11D48" style={{ marginRight: 5 }} />
            <Text style={styles.trustItemText}>Verified Vendors</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={15} color="#BE185D" style={{ marginRight: 5 }} />
            <Text style={styles.trustItemText}>Secure & Safe</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.trustItem}>
            <Ionicons name="star" size={16} color="#F59E0B" style={{ marginRight: 5 }} />
            <Text style={styles.trustItemText}>4.9/5 Rating</Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 5. FOOTER TEXT & TRADITIONAL PALACE BAARAT ARTWORK */}
        {/* ========================================================= */}
        <View style={styles.footerSection}>
          <Text style={styles.footerLine1}>Beautiful People</Text>
          <Text style={styles.footerLine2}>Beautiful Celebrations</Text>

          <View style={styles.footerHeartRow}>
            <View style={styles.footerLineMini} />
            <Ionicons name="heart" size={10} color="#D81B60" style={{ marginHorizontal: 4 }} />
            <View style={styles.footerLineMini} />
          </View>

          {/* Traditional Baarat Elephant & Palace Silhouette Illustration */}
          {Assets.elephantBaaratArt && (
            <Image
              source={Assets.elephantBaaratArt}
              style={styles.baaratSilhouetteImage}
              resizeMode="contain"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // =========================================================
  // 1. TOP HERO SECTION
  // =========================================================
  topHeroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    position: 'relative',
  },
  topLeftCol: {
    flex: 1,
    paddingRight: 6,
    paddingTop: 6,
  },

  // Rings Logo
  ringsLogoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    position: 'relative',
    height: 32,
    width: 60,
  },
  ringLeft: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.2,
    borderColor: '#BE185D',
    position: 'absolute',
    left: 0,
    top: 6,
  },
  ringRight: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.2,
    borderColor: '#BE185D',
    position: 'absolute',
    left: 14,
    top: 6,
  },
  ringInner: {
    flex: 1,
  },
  heartMini: {
    position: 'absolute',
    top: 0,
    left: 11,
  },

  // Brand Name
  brandTitleLine1: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: -0.4,
    lineHeight: 25,
  },
  brandTitleLine2: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8A072D',
    letterSpacing: -0.5,
    lineHeight: 27,
  },
  brandSubtitleTracker: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginTop: 3,
    marginBottom: 10,
  },

  // Cursive Tagline
  cursiveTaglineBox: {
    position: 'relative',
    marginTop: 4,
  },
  cursiveTaglineText: {
    fontSize: 16,
    color: '#8A072D',
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 21,
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
  },
  cursiveUnderline: {
    height: 1.5,
    width: '80%',
    backgroundColor: '#F59E0B',
    marginTop: 4,
    borderRadius: 1,
  },

  // Right Column: Organic Cutout
  topRightCol: {
    width: width * 0.46,
    height: 190,
    position: 'relative',
  },
  organicCutoutFrame: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 80,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#8A072D',
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  heroBrideGroomImage: {
    width: '100%',
    height: '100%',
  },
  moreThanEventsTag: {
    position: 'absolute',
    top: 24,
    left: 8,
    backgroundColor: 'rgba(254, 243, 199, 0.92)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 0.8,
    borderColor: '#FDE68A',
  },
  moreThanEventsText: {
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#78350F',
    lineHeight: 12,
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
  },
  skipPillBtn: {
    position: 'absolute',
    top: 6,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  skipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginRight: 2,
  },

  // =========================================================
  // 2. CHOOSE YOUR ROLE HEADER
  // =========================================================
  roleHeaderSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  chooseRoleTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  chooseRoleSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  heartDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    width: 120,
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FECDD3',
  },
  dividerHeart: {
    fontSize: 11,
    color: '#D81B60',
    marginHorizontal: 6,
  },

  // =========================================================
  // 3. TWO SIDE-BY-SIDE ROLE CARDS
  // =========================================================
  roleCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  // Card 1: Families
  roleCardFamilies: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    padding: 12,
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCirclePink: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgePink: {
    backgroundColor: '#FCE7F3',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgePinkText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#BE185D',
    letterSpacing: 0.4,
  },

  // Card 2: Vendors
  roleCardVendors: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    padding: 12,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircleYellow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeYellow: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeYellowText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.4,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
    minHeight: 28,
    marginBottom: 10,
  },

  cardImageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardCoverImage: {
    width: '100%',
    height: '100%',
  },
  floatingArrowBtnMaroon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#8A072D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingArrowBtnBrown: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#B45309',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // =========================================================
  // 4. TRUST BADGES STRIP
  // =========================================================
  trustBadgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustItemText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  verticalDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
  },

  // =========================================================
  // 5. FOOTER ARTWORK & TEXT
  // =========================================================
  footerSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  footerLine1: {
    fontSize: 12,
    color: '#8A072D',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
  },
  footerLine2: {
    fontSize: 12,
    color: '#8A072D',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
    marginTop: 1,
  },
  footerHeartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    width: 80,
    justifyContent: 'center',
  },
  footerLineMini: {
    flex: 1,
    height: 0.8,
    backgroundColor: '#FECDD3',
  },
  baaratSilhouetteImage: {
    width: width - 32,
    height: 70,
    opacity: 0.35,
    marginTop: 2,
  },
});
