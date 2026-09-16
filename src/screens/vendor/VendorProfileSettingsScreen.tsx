import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VendorProfileSettingsProps {
  navigation?: any;
  onBack?: () => void;
  onSwitchToCustomer?: () => void;
  onLogout?: () => void;
}

export const VendorProfileSettingsScreen: React.FC<VendorProfileSettingsProps> = ({
  navigation,
  onBack,
  onSwitchToCustomer,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboard');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out from Partner Portal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          if (onLogout) onLogout();
        },
      },
    ]);
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
            Business <Text style={styles.screenTitleHighlight}>Settings</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Storefront profile & partner preferences
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="settings" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Store</Text>
            <Text style={styles.decorativeLine2}>Profile</Text>
            <Text style={styles.decorativeLine3}>Settings ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 28 }}>👑</Text>
          </View>
          <View style={styles.profileDetailsCol}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.bizName}>Royal Events & Decor</Text>
              <Ionicons name="checkmark-circle" size={16} color="#15803D" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.bizCategory}>Mandap, Stage & Lighting Setup</Text>
            <Text style={styles.bizLocation}>📍 301, Shekhar Central, MG Road, Indore</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingScore}>4.8</Text>
              <Text style={styles.reviewsCount}>(320 verified reviews)</Text>
            </View>
          </View>
        </View>

        {/* Switch Mode Option */}
        {onSwitchToCustomer && (
          <TouchableOpacity
            style={styles.switchModeCard}
            activeOpacity={0.85}
            onPress={onSwitchToCustomer}
          >
            <View style={styles.switchIconBox}>
              <Text style={{ fontSize: 20 }}>💍</Text>
            </View>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Switch to Customer Mode</Text>
              <Text style={styles.switchSub}>Plan a personal wedding & browse other vendors</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#8A072D" />
          </TouchableOpacity>
        )}

        {/* Settings Sections */}
        <Text style={styles.sectionHeading}>Business Information</Text>

        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('VendorKYC');
              }
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <Text style={styles.itemTitle}>KYC & Document Verification</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>VERIFIED ✓</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('VendorWalletPayout');
              }
            }}
          >
            <Ionicons name="card-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <Text style={styles.itemTitle}>Bank Account for Payouts (HDFC ****7812)</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('VendorCalendar');
              }
            }}
          >
            <Ionicons name="calendar-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <Text style={styles.itemTitle}>Availability & Blackout Dates</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>Support & Policies</Text>

        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Partner Help Desk', 'Call Partner Support: +91 731 400 9999 (9 AM – 9 PM)')}
          >
            <Ionicons name="headset-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <Text style={styles.itemTitle}>Partner Support & Helpdesk</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Vendor Terms', 'Band Baaja Baarat Partner Terms & 5% Escrow Policy.')}
          >
            <Ionicons name="document-text-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <Text style={styles.itemTitle}>Vendor Terms & Commission Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#E11D48" style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Log Out from Partner Account</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
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
    paddingTop: 14,
    paddingBottom: 24,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  profileDetailsCol: {
    flex: 1,
  },
  bizName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  bizCategory: {
    fontSize: 11.5,
    color: '#8A072D',
    fontWeight: '600',
    marginTop: 1,
  },
  bizLocation: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 3,
  },
  reviewsCount: {
    fontSize: 10.5,
    color: '#64748B',
    marginLeft: 3,
  },

  switchModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    marginBottom: 16,
  },
  switchIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  switchTextCol: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  switchSub: {
    fontSize: 10.5,
    color: '#9F1239',
    marginTop: 1,
  },

  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 4,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },
});
