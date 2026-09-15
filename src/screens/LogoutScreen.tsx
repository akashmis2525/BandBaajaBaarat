import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';

export const LogoutScreen: React.FC<{
  navigation?: any;
  onBack?: () => void;
  onConfirmLogout?: () => void;
}> = ({ navigation, onBack, onConfirmLogout }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ProfileMain');
    }
  };

  const handleConfirmLogout = () => {
    logout();
    if (onConfirmLogout) {
      onConfirmLogout();
    } else if (navigation?.navigate) {
      navigation.navigate('Login');
    }
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
              Log<Text style={styles.screenTitleHighlight}>out</Text>
            </Text>
            <Text style={styles.screenSubtitle}>Are you sure you want to logout?</Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.doorGraphicBox}>
            <Ionicons name="exit-outline" size={16} color="#D81B60" />
            <View style={styles.doorArrowBadge}>
              <Ionicons name="arrow-forward-sharp" size={8} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>See You Soon</Text>
            <Text style={styles.decorativeLine2}>For More</Text>
            <Text style={styles.decorativeLine3}>Special Moments ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Center Graphic & Headline */}
        <View style={styles.centerGraphicSection}>
          <View style={styles.circularGlowBg}>
            <Text style={styles.sparkle1}>✦</Text>
            <Text style={styles.sparkle2}>✦</Text>

            {/* Illustration: Open door with arrow & plant */}
            <View style={styles.doorIllustrationWrap}>
              {/* Door Frame */}
              <View style={styles.doorOuterFrame}>
                <View style={styles.doorLeafOpen} />
                <View style={styles.doorArrowWrap}>
                  <Ionicons name="arrow-forward" size={26} color="#D81B60" />
                </View>
              </View>

              {/* Plant */}
              <View style={styles.plantPotWrap}>
                <View style={styles.leaf1} />
                <View style={styles.leaf2} />
                <View style={styles.leaf3} />
                <View style={styles.potBase} />
              </View>
            </View>
          </View>

          <Text style={styles.logoutHeading}>
            Logout from <Text style={styles.logoutHeadingRed}>Band Baaja Baarat</Text>?
          </Text>
          <Text style={styles.logoutSubHeading}>
            You will be logged out from your account on this device.{'\n'}
            You can always login again anytime.
          </Text>
        </View>

        {/* Section: What happens after logout? */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>What happens after logout?</Text>

          {/* 1. Securely signed out */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="person-outline" size={18} color="#D81B60" />
            </View>
            <Text style={styles.infoRowText}>
              Your account will be securely signed out
            </Text>
          </View>

          {/* 2. Bookings safe */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="calendar-outline" size={18} color="#D81B60" />
            </View>
            <Text style={styles.infoRowText}>
              Your bookings and data will remain safe
            </Text>
          </View>

          {/* 3. Login again with phone */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="heart-outline" size={18} color="#D81B60" />
            </View>
            <Text style={styles.infoRowText}>
              You can login again with your mobile number
            </Text>
          </View>

          {/* 4. Stop receiving notifications */}
          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="notifications-outline" size={18} color="#D81B60" />
            </View>
            <Text style={styles.infoRowText}>
              You will stop receiving notifications on this device
            </Text>
          </View>
        </View>

        {/* Card: Your Data is Safe */}
        <View style={styles.safeDataCard}>
          <View style={styles.safeShieldCircle}>
            <Ionicons name="shield-checkmark" size={20} color="#D81B60" />
          </View>
          <View style={styles.safeDataTextCol}>
            <Text style={styles.safeDataTitle}>Your Data is Safe</Text>
            <Text style={styles.safeDataSubtitle}>
              Logging out will not delete your account or any of your bookings. Your data will be saved securely.
            </Text>
          </View>
        </View>

        {/* Bottom Buttons: Cancel & Logout */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            activeOpacity={0.8}
            onPress={handleBack}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.85}
            onPress={handleConfirmLogout}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 12,
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
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1B1F',
    letterSpacing: -0.3,
  },
  screenTitleHighlight: {
    color: '#D81B60',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#556987',
    marginTop: 2,
    fontWeight: '400',
  },
  decorativeTag: {
    backgroundColor: '#FDECEF',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  doorGraphicBox: {
    position: 'relative',
    marginRight: 6,
  },
  doorArrowBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tagTextCol: {
    alignItems: 'center',
  },
  decorativeLine1: {
    fontSize: 10,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 12,
  },
  decorativeLine2: {
    fontSize: 10,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 12,
  },
  decorativeLine3: {
    fontSize: 9,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 11,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  centerGraphicSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  circularGlowBg: {
    position: 'relative',
    width: 190,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sparkle1: {
    position: 'absolute',
    top: 18,
    left: 24,
    color: '#FCA5A5',
    fontSize: 14,
  },
  sparkle2: {
    position: 'absolute',
    top: 14,
    right: 28,
    color: '#FCA5A5',
    fontSize: 16,
  },
  doorIllustrationWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  doorOuterFrame: {
    position: 'relative',
    width: 64,
    height: 84,
    borderWidth: 4,
    borderColor: '#D81B60',
    borderRadius: 6,
    backgroundColor: '#FFF1F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doorLeafOpen: {
    position: 'absolute',
    left: -4,
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: '#FECDD3',
    borderWidth: 2,
    borderColor: '#D81B60',
    borderRadius: 4,
    transform: [{ skewY: '-12deg' }],
  },
  doorArrowWrap: {
    position: 'absolute',
    right: -24,
    top: 24,
    zIndex: 10,
  },
  plantPotWrap: {
    alignItems: 'center',
    marginLeft: 14,
    marginBottom: 2,
  },
  leaf1: {
    width: 10,
    height: 16,
    backgroundColor: '#FB7185',
    borderRadius: 6,
    marginBottom: -4,
    transform: [{ rotate: '-25deg' }],
  },
  leaf2: {
    width: 10,
    height: 16,
    backgroundColor: '#F43F5E',
    borderRadius: 6,
    marginBottom: -4,
    transform: [{ rotate: '25deg' }],
  },
  leaf3: {
    width: 12,
    height: 18,
    backgroundColor: '#E11D48',
    borderRadius: 6,
    marginBottom: 2,
  },
  potBase: {
    width: 22,
    height: 18,
    backgroundColor: '#D81B60',
    borderRadius: 3,
  },
  logoutHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1B1F',
    textAlign: 'center',
    marginBottom: 6,
  },
  logoutHeadingRed: {
    color: '#D81B60',
  },
  logoutSubHeading: {
    fontSize: 12,
    color: '#556987',
    textAlign: 'center',
    lineHeight: 17,
  },
  infoCard: {
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
    marginBottom: 14,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoRowText: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  safeDataCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
    marginBottom: 20,
  },
  safeShieldCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  safeDataTextCol: {
    flex: 1,
  },
  safeDataTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 2,
  },
  safeDataSubtitle: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E53E3E',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E53E3E',
  },
  logoutBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
