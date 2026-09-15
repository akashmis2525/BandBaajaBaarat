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
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);

  // User details state
  const [userName, setUserName] = useState(user.name || 'Aakash Mishra');
  const [userEmail, setUserEmail] = useState('aakashmishra@email.com');
  const [userPhone, setUserPhone] = useState(
    user.mobileNumber ? `+91 ${user.mobileNumber}` : '+91 97133 32997'
  );
  const [userCity, setUserCity] = useState('Indore, Madhya Pradesh');

  const menuItems = [
    {
      id: 'bookings',
      icon: 'calendar-outline',
      title: 'My Bookings',
      subtitle: 'View and manage your bookings',
      onPress: () => {
        if (navigation?.navigate) {
          navigation.navigate('BookingsList');
        }
      },
    },
    {
      id: 'favourites',
      icon: 'heart-outline',
      title: 'My Favourites',
      subtitle: 'Your saved vendors and services',
      onPress: () => navigation?.navigate('SavedItems'),
    },
    {
      id: 'addresses',
      icon: 'location-outline',
      title: 'My Addresses',
      subtitle: 'Manage your saved addresses for events',
      onPress: () => navigation?.navigate('MyAddresses'),
    },
    {
      id: 'payments',
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your saved payment options',
      onPress: () => navigation?.navigate('SavedPaymentMethods'),
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => navigation?.navigate('Notifications'),
    },
    {
      id: 'support',
      icon: 'headset-outline',
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      onPress: () => navigation?.navigate('HelpSupport'),
    },
    {
      id: 'refer',
      icon: 'gift-outline',
      title: 'Refer & Earn',
      subtitle: 'Invite friends and earn rewards',
      onPress: () => navigation?.navigate('ReferEarn'),
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App settings and privacy',
      onPress: () => navigation?.navigate('Settings'),
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      title: 'About Us',
      subtitle: 'Version 1.0.0',
      onPress: () =>
        Alert.alert(
          'Band Baaja Baarat',
          'Version 1.0.0 (Build 2026.11)\n\nIndia\'s #1 Premium Wedding Services Marketplace.\nCrafted with ❤️ in Indore.'
        ),
    },
  ];

  const handleLogout = () => {
    if (navigation?.navigate) {
      navigation.navigate('Logout');
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out of your Band Baaja Baarat account?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Logout',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Logged Out', 'You have been logged out successfully.');
            },
          },
        ]
      );
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
                ? insets.top + 4
                : 20,
          },
        ]}
      >
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Pro<Text style={styles.headerTitleMaroon}>file</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Same</Text>
          <Text style={styles.scriptBadgeMid}>User</Text>
          <Text style={styles.scriptBadgeMid2}>Bigger</Text>
          <Text style={styles.scriptBadgeBot}>Celebrations ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={styles.userProfileCard}>
          {/* Avatar with edit badge */}
          <View style={styles.avatarWrapper}>
            <Image source={Assets.groomBaarat} style={styles.avatarImg} />
            <TouchableOpacity
              style={styles.cameraIconBadge}
              activeOpacity={0.8}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('EditProfile');
                } else {
                  setShowEditModal(true);
                }
              }}
            >
              <Ionicons name="camera" size={11} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* User Text Info */}
          <View style={styles.userInfoCol}>
            <Text style={styles.userNameText}>{userName}</Text>
            <Text style={styles.userEmailText}>{userEmail}</Text>
            <Text style={styles.userPhoneText}>{userPhone}</Text>

            <TouchableOpacity
              style={styles.userLocationRow}
              activeOpacity={0.7}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('MyAddresses');
                }
              }}
            >
              <Ionicons name="location-sharp" size={11} color="#8A072D" />
              <Text style={styles.userLocationText}>{userCity}</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            activeOpacity={0.8}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('EditProfile');
              } else {
                setShowEditModal(true);
              }
            }}
          >
            <Ionicons name="pencil" size={11} color="#8A072D" />
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Statistics / Metrics Card */}
        <View style={styles.metricsCard}>
          {/* 1. Total Bookings */}
          <TouchableOpacity
            style={styles.metricCol}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('BookingsList')}
          >
            <View style={styles.metricIconCircle}>
              <Ionicons name="calendar-outline" size={15} color="#8A072D" />
            </View>
            <Text style={styles.metricNumber}>4</Text>
            <Text style={styles.metricLabel}>Total Bookings</Text>
          </TouchableOpacity>

          <View style={styles.metricDivider} />

          {/* 2. Completed */}
          <TouchableOpacity
            style={styles.metricCol}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('BookingsList')}
          >
            <View style={styles.metricIconCircle}>
              <Ionicons name="checkmark-circle-outline" size={15} color="#8A072D" />
            </View>
            <Text style={styles.metricNumber}>3</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </TouchableOpacity>

          <View style={styles.metricDivider} />

          {/* 3. Upcoming */}
          <TouchableOpacity
            style={styles.metricCol}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('BookingsList')}
          >
            <View style={styles.metricIconCircle}>
              <Ionicons name="time-outline" size={15} color="#8A072D" />
            </View>
            <Text style={styles.metricNumber}>1</Text>
            <Text style={styles.metricLabel}>Upcoming</Text>
          </TouchableOpacity>

          <View style={styles.metricDivider} />

          {/* 4. Favourites */}
          <TouchableOpacity
            style={styles.metricCol}
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('SavedItems')}
          >
            <View style={styles.metricIconCircle}>
              <Ionicons name="heart-outline" size={15} color="#8A072D" />
            </View>
            <Text style={styles.metricNumber}>5</Text>
            <Text style={styles.metricLabel}>Favourites</Text>
          </TouchableOpacity>
        </View>

        {/* 8 Navigation Menu Cards */}
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              activeOpacity={0.8}
              onPress={item.onPress}
            >
              <View style={styles.menuIconCircle}>
                <Ionicons name={item.icon as any} size={18} color="#8A072D" />
              </View>

              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitleText}>{item.title}</Text>
                <Text style={styles.menuSubtitleText}>{item.subtitle}</Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#8A072D" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              value={userName}
              onChangeText={setUserName}
              placeholder="Your Name"
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.modalInput}
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
              placeholder="Your Email"
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.modalInput}
              value={userPhone}
              onChangeText={setUserPhone}
              keyboardType="phone-pad"
              placeholder="Your Phone"
            />

            <Text style={styles.inputLabel}>City & State</Text>
            <TextInput
              style={styles.modalInput}
              value={userCity}
              onChangeText={setUserCity}
              placeholder="Your City"
            />

            <TouchableOpacity
              style={styles.saveProfileBtn}
              onPress={() => {
                setShowEditModal(false);
                Alert.alert('Profile Updated', 'Your profile details have been saved.');
              }}
            >
              <Text style={styles.saveProfileBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Payment Methods</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentMethodItem}>
              <Ionicons name="qr-code-outline" size={20} color="#8A072D" />
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentMethodTitle}>Google Pay / PhonePe UPI</Text>
                <Text style={styles.paymentMethodSub}>amitsharma@okhdfcbank (Primary)</Text>
              </View>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
            </View>

            <View style={styles.paymentMethodItem}>
              <Ionicons name="card-outline" size={20} color="#8A072D" />
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentMethodTitle}>HDFC Bank Regalia Visa</Text>
                <Text style={styles.paymentMethodSub}>•••• •••• •••• 4592 (Exp 08/29)</Text>
              </View>
              <Ionicons name="radio-button-off" size={18} color="#C5B4B8" />
            </View>

            <TouchableOpacity
              style={styles.addPaymentBtn}
              onPress={() => {
                setShowPaymentModal(false);
                Alert.alert('Add New Payment', 'UPI / Card setup flow initiated.');
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color="#8A072D" />
              <Text style={styles.addPaymentBtnText}>Add New Payment Option</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Refer & Earn Modal */}
      <Modal visible={showReferModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refer & Earn ₹500</Text>
              <TouchableOpacity onPress={() => setShowReferModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.referSubtitle}>
              Invite friends planning their wedding. When they complete their first booking, both of
              you get ₹500 wedding credits!
            </Text>

            <View style={styles.referralCodeBox}>
              <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
              <Text style={styles.referralCodeText}>BAND-AMIT500</Text>
            </View>

            <TouchableOpacity
              style={styles.shareReferralBtn}
              onPress={() => {
                setShowReferModal(false);
                Alert.alert(
                  'Referral Link Copied! 🎁',
                  'Share this with your friends on WhatsApp:\nhttps://bandbaajabaarat.com/refer/BAND-AMIT500'
                );
              }}
            >
              <Ionicons name="share-social" size={16} color="#FFFFFF" />
              <Text style={styles.shareReferralBtnText}>Share on WhatsApp</Text>
            </TouchableOpacity>
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
    fontSize: 7,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 8,
  },
  scriptBadgeMid2: {
    fontSize: 7,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 8,
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

  // User Profile Card
  userProfileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    alignItems: 'center',
    gap: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  avatarWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FDECE6',
    borderWidth: 1.5,
    borderColor: '#F0D4CB',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    resizeMode: 'cover',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1A040A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userInfoCol: {
    flex: 1,
    gap: 1.5,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A040A',
  },
  userEmailText: {
    fontSize: 9.5,
    color: '#554246',
  },
  userPhoneText: {
    fontSize: 9.5,
    color: '#554246',
    fontWeight: '600',
  },
  userLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 1,
  },
  userLocationText: {
    fontSize: 9,
    color: '#554246',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  editProfileBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#8A072D',
  },

  // 4 Metrics Card
  metricsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  metricIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  metricLabel: {
    fontSize: 8.5,
    color: '#736064',
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F3E4DC',
  },

  // Menu List
  menuList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
    gap: 12,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    flex: 1,
    gap: 1,
  },
  menuTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A040A',
  },
  menuSubtitleText: {
    fontSize: 9.5,
    color: '#736064',
  },

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#F7D7CA',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    marginTop: 2,
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
    marginTop: 8,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 11.5,
    color: '#1A040A',
  },
  saveProfileBtn: {
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1EC',
    borderWidth: 1,
    borderColor: '#F7D7CA',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    marginVertical: 4,
  },
  paymentMethodTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A040A',
  },
  paymentMethodSub: {
    fontSize: 9.5,
    color: '#736064',
  },
  addPaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 10,
    gap: 6,
    marginTop: 10,
  },
  addPaymentBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
  },
  referSubtitle: {
    fontSize: 11,
    color: '#554246',
    lineHeight: 16,
    marginBottom: 12,
  },
  referralCodeBox: {
    backgroundColor: '#FDF1EC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#8A072D',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  referralCodeLabel: {
    fontSize: 9,
    color: '#736064',
  },
  referralCodeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#8A072D',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  shareReferralBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 12,
    gap: 6,
    marginTop: 12,
  },
  shareReferralBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
