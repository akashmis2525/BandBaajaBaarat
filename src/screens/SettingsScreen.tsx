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
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

export const SettingsScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  // User details state
  const [userName, setUserName] = useState('Amit Sharma');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [userEmail, setUserEmail] = useState('amit.sharma@example.com');
  const [userCity, setUserCity] = useState('Indore, Madhya Pradesh');

  // Edit form state
  const [editName, setEditName] = useState('Amit Sharma');
  const [editPhone, setEditPhone] = useState('+91 98765 43210');
  const [editEmail, setEditEmail] = useState('amit.sharma@example.com');
  const [editCity, setEditCity] = useState('Indore, Madhya Pradesh');

  // App settings state
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'en',
    name: 'English',
    native: 'English',
  });
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [gpsAutoDetect, setGpsAutoDetect] = useState(true);

  // Privacy toggles
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [profileVisibleToVendors, setProfileVisibleToVendors] = useState(true);
  const [activityStatusVisible, setActivityStatusVisible] = useState(true);

  // Modals state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacySecurityModal, setShowPrivacySecurityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const languages = [
    { code: 'en', name: 'English', native: 'English', subtitle: 'Default app language' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', subtitle: 'ऐप की भाषा हिन्दी में बदलें' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', subtitle: 'अ‍ॅपची भाषा मराठीमध्ये बदला' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', subtitle: 'એપ્લિકેશનની ભાષા ગુજરાતીમાં બદલો' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', subtitle: 'ਐਪ ਦੀ ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲੋ' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', subtitle: 'অ্যাপের ভাষা বাংলায় পরিবর্তন করুন' },
  ];

  const popularCities = [
    { name: 'Indore, Madhya Pradesh', state: 'Madhya Pradesh', hub: 'Top Wedding Hub' },
    { name: 'Bhopal, Madhya Pradesh', state: 'Madhya Pradesh', hub: 'Popular Hub' },
    { name: 'Jaipur, Rajasthan', state: 'Rajasthan', hub: 'Royal Wedding City' },
    { name: 'Udaipur, Rajasthan', state: 'Rajasthan', hub: 'Destination Weddings' },
    { name: 'Delhi NCR', state: 'Delhi', hub: 'Grand Weddings' },
    { name: 'Mumbai, Maharashtra', state: 'Maharashtra', hub: 'Metropolitan Hub' },
    { name: 'Ahmedabad, Gujarat', state: 'Gujarat', hub: 'Heritage Weddings' },
    { name: 'Lucknow, Uttar Pradesh', state: 'Uttar Pradesh', hub: 'Nawabi Celebrations' },
    { name: 'Chandigarh, Punjab', state: 'Punjab', hub: 'Punjabi Baarat Hub' },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ProfileMain');
    }
  };

  const handleLogout = () => {
    if (navigation?.navigate) {
      navigation.navigate('Logout');
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out from Band Baaja Baarat?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Logged Out', 'You have been logged out successfully.');
            },
          },
        ]
      );
    }
  };

  const handleOpenEditProfile = () => {
    setEditName(userName);
    setEditPhone(userPhone);
    setEditEmail(userEmail);
    setEditCity(userCity);
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    setUserName(editName.trim());
    setUserPhone(editPhone.trim());
    setUserEmail(editEmail.trim());
    setUserCity(editCity.trim());
    setShowEditProfileModal(false);
    Alert.alert('Profile Updated! ✨', 'Your personal information has been saved successfully.');
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Password Updated 🔒', 'Your account password has been changed successfully.');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Account Deletion Request Submitted',
      'Your account deletion request is initiated. Your profile and booking history will be purged within 14 days.'
    );
  };

  const handleCheckForUpdates = () => {
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
      Alert.alert('Up to Date! 🎉', 'You are using the latest version of Band Baaja Baarat (v1.0.0).');
    }, 1200);
  };

  // Dynamic Theme Colors
  const theme = {
    bg: darkModeEnabled ? '#12070A' : '#FAF5F2',
    headerBg: darkModeEnabled ? '#1C0E12' : '#FFFFFF',
    headerBorder: darkModeEnabled ? '#331B22' : '#F2E4DE',
    cardBg: darkModeEnabled ? '#1F1015' : '#FFFFFF',
    cardBorder: darkModeEnabled ? '#3D2028' : '#F0D4CB',
    userCardBg: darkModeEnabled ? '#2A131B' : '#FFF7F5',
    userCardBorder: darkModeEnabled ? '#4A232E' : '#F5DDD3',
    textMain: darkModeEnabled ? '#FFFFFF' : '#1A040A',
    textSub: darkModeEnabled ? '#B8A1A6' : '#736064',
    textMuted: darkModeEnabled ? '#967F84' : '#554246',
    divider: darkModeEnabled ? '#331921' : '#F8ECE7',
    iconCircleBg: darkModeEnabled ? '#361720' : '#FDF1EC',
    logoutBg: darkModeEnabled ? '#291118' : '#FFF5F3',
    logoutBorder: darkModeEnabled ? '#47202B' : '#FAD8CE',
    modalBg: darkModeEnabled ? '#1F1015' : '#FFFFFF',
    inputBg: darkModeEnabled ? '#2B141C' : '#FFF7F5',
    inputBorder: darkModeEnabled ? '#4A232E' : '#F2DDD3',
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={darkModeEnabled ? 'light-content' : 'dark-content'}
        backgroundColor={theme.headerBg}
      />

      {/* Header */}
      <View
        style={[
          styles.headerRow,
          {
            backgroundColor: theme.headerBg,
            borderBottomColor: theme.headerBorder,
            paddingTop:
              Platform.OS === 'android'
                ? (StatusBar.currentHeight || 24) + 6
                : insets.top > 0
                ? insets.top + 4
                : 20,
          },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.textMain} />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>
            Sett<Text style={styles.headerTitleMaroon}>ings</Text>
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSub }]}>
            Manage your app preferences
          </Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Your</Text>
          <Text style={styles.scriptBadgeMid}>Preferences</Text>
          <Text style={styles.scriptBadgeSub}>A Happier</Text>
          <Text style={styles.scriptBadgeBot}>Experience ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Card */}
        <View
          style={[
            styles.userProfileCard,
            { backgroundColor: theme.userCardBg, borderColor: theme.userCardBorder },
          ]}
        >
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={28} color="#FFFFFF" />
          </View>

          <View style={styles.userInfoCol}>
            <Text style={[styles.userName, { color: theme.textMain }]}>{userName}</Text>
            <Text style={[styles.userPhone, { color: theme.textMuted }]}>{userPhone}</Text>
            <Text style={[styles.userEmail, { color: theme.textSub }]}>{userEmail}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.editProfileBtn,
              { backgroundColor: darkModeEnabled ? '#381621' : '#FFFFFF' },
            ]}
            activeOpacity={0.8}
            onPress={handleOpenEditProfile}
          >
            <Feather name="edit-2" size={12} color="#8A072D" />
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Section 1: App Settings */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: theme.textMain }]}>App Settings</Text>

          <View
            style={[
              styles.cardGroup,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
          >
            {/* 1. Notifications */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('Notifications')}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="notifications-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Notifications</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Manage your notification preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 2. Language */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="globe-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <View style={styles.titleWithBadgeRow}>
                  <Text style={[styles.menuTitle, { color: theme.textMain }]}>Language</Text>
                  <View style={styles.activePillBadge}>
                    <Text style={styles.activePillBadgeText}>
                      {selectedLanguage.name} ({selectedLanguage.native})
                    </Text>
                  </View>
                </View>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Choose your preferred language
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 3. Location */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => setShowLocationModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="location-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <View style={styles.titleWithBadgeRow}>
                  <Text style={[styles.menuTitle, { color: theme.textMain }]}>Location</Text>
                  <View style={styles.activePillBadge}>
                    <Text style={styles.activePillBadgeText}>
                      {userCity.split(',')[0]}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Manage your location preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 4. Dark Mode */}
            <View style={styles.menuItemRow}>
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="moon" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Dark Mode</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  {darkModeEnabled ? 'Dark mode is currently active' : 'Switch between light and dark mode'}
                </Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={(val) => setDarkModeEnabled(val)}
                trackColor={{ false: '#E2E8F0', true: '#8A072D' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Section 2: Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: theme.textMain }]}>Account Settings</Text>

          <View
            style={[
              styles.cardGroup,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
          >
            {/* 1. Personal Information */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={handleOpenEditProfile}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="person-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Personal Information</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  View and update your details
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 2. Change Password */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => setShowPasswordModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="lock-closed-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Change Password</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Keep your account secure
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 3. Privacy & Security */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => setShowPrivacySecurityModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Privacy & Security</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Manage your data and privacy
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 4. Delete Account */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => setShowDeleteModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="trash-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Delete Account</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Permanently delete your account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: Support */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: theme.textMain }]}>Support</Text>

          <View
            style={[
              styles.cardGroup,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
          >
            {/* 1. Help & Support */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('HelpSupport')}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="headset-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Help & Support</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Get help or contact us
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 2. Terms & Conditions */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('TermsConditions');
                } else {
                  setShowTermsModal(true);
                }
              }}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="document-text-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Terms & Conditions</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Read our terms and policies
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 3. Privacy Policy */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => setShowPrivacyModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="shield-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>Privacy Policy</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>
                  Learn how we protect your data
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

            {/* 4. About Us */}
            <TouchableOpacity
              style={styles.menuItemRow}
              activeOpacity={0.7}
              onPress={() => setShowAboutModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.iconCircleBg }]}>
                <Ionicons name="information-circle-outline" size={18} color="#8A072D" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuTitle, { color: theme.textMain }]}>About Us</Text>
                <Text style={[styles.menuSubtitle, { color: theme.textSub }]}>Version 1.0.0</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { backgroundColor: theme.logoutBg, borderColor: theme.logoutBorder },
          ]}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#8A072D" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer Love Note */}
        <Text style={[styles.footerNote, { color: theme.textSub }]}>
          Thank you for being a part of Band Baaja Baarat ❤️
        </Text>

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* 1. Edit Profile / Personal Info Modal */}
      <Modal visible={showEditProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>Personal Information</Text>
              <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: theme.textMain }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textMain },
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your Name"
                placeholderTextColor={theme.textSub}
              />

              <Text style={[styles.inputLabel, { color: theme.textMain }]}>Phone Number</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textMain },
                ]}
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
                placeholder="+91 Phone"
                placeholderTextColor={theme.textSub}
              />

              <Text style={[styles.inputLabel, { color: theme.textMain }]}>Email Address</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textMain },
                ]}
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                placeholder="Your Email"
                placeholderTextColor={theme.textSub}
              />

              <Text style={[styles.inputLabel, { color: theme.textMain }]}>City & State</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textMain },
                ]}
                value={editCity}
                onChangeText={setEditCity}
                placeholder="Your City"
                placeholderTextColor={theme.textSub}
              />

              <TouchableOpacity style={styles.primaryModalBtn} onPress={handleSaveProfile}>
                <Text style={styles.primaryModalBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 2. Language Selector Modal */}
      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.textMain }]}>Choose Language</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSub }]}>
                  Select your preferred app language
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {languages.map((item) => {
                const isSelected = selectedLanguage.code === item.code;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.languageOptionRow,
                      { borderBottomColor: theme.divider },
                      isSelected && [styles.languageOptionRowSelected, { backgroundColor: theme.userCardBg }],
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedLanguage(item);
                      setShowLanguageModal(false);
                      Alert.alert(
                        'Language Changed! 🌐',
                        `App language has been switched to ${item.name} (${item.native}).`
                      );
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.languageNameText, { color: theme.textMain }]}>{item.name}</Text>
                        <Text style={styles.languageNativeBadge}>{item.native}</Text>
                      </View>
                      <Text style={[styles.languageSubInfo, { color: theme.textSub }]}>{item.subtitle}</Text>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={22} color="#8A072D" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={20} color={theme.textSub} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 3. Location Preferences Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg, maxHeight: '88%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.textMain }]}>Location Preferences</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSub }]}>
                  Select your city for wedding vendors
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            {/* GPS Auto Detect Row */}
            <View
              style={[
                styles.gpsAutoDetectCard,
                { backgroundColor: theme.userCardBg, borderColor: theme.userCardBorder },
              ]}
            >
              <View style={styles.gpsIconCircle}>
                <Ionicons name="navigate" size={18} color="#8A072D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.gpsCardTitle, { color: theme.textMain }]}>Auto-Detect GPS Location</Text>
                <Text style={[styles.gpsCardSub, { color: theme.textSub }]}>
                  Find vendors nearest to your current location
                </Text>
              </View>
              <Switch
                value={gpsAutoDetect}
                onValueChange={(val) => {
                  setGpsAutoDetect(val);
                  if (val) {
                    Alert.alert('GPS Enabled', 'Using current GPS location: Indore, Madhya Pradesh');
                  }
                }}
                trackColor={{ false: '#E2E8F0', true: '#8A072D' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Text style={[styles.citiesSectionLabel, { color: theme.textMain }]}>
              Popular Wedding Destinations
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
              {popularCities.map((item, idx) => {
                const isSelected = userCity === item.name;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.cityOptionRow,
                      { borderBottomColor: theme.divider },
                      isSelected && [styles.cityOptionRowSelected, { backgroundColor: theme.userCardBg }],
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setUserCity(item.name);
                      setShowLocationModal(false);
                      Alert.alert(
                        'Location Updated 📍',
                        `Your event location is set to ${item.name}. Showing best local wedding vendors.`
                      );
                    }}
                  >
                    <Ionicons
                      name={isSelected ? 'location' : 'location-outline'}
                      size={18}
                      color="#8A072D"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cityNameText, { color: theme.textMain }]}>{item.name}</Text>
                      <Text style={[styles.cityHubText, { color: theme.textSub }]}>{item.hub}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#8A072D" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 4. Change Password Modal */}
      <Modal visible={showPasswordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textMain }]}>Current Password</Text>
            <View
              style={[
                styles.passwordInputWrapper,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: theme.textMain }]}
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={theme.textSub}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={theme.textSub}
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textMain }]}>New Password</Text>
            <View
              style={[
                styles.passwordInputWrapper,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: theme.textMain }]}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password (min 6 chars)"
                placeholderTextColor={theme.textSub}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={theme.textSub}
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textMain }]}>Confirm New Password</Text>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textMain },
              ]}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={theme.textSub}
            />

            <TouchableOpacity style={styles.primaryModalBtn} onPress={handleSavePassword}>
              <Text style={styles.primaryModalBtnText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. Privacy & Security Settings Modal */}
      <Modal visible={showPrivacySecurityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.textMain }]}>Privacy & Security</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSub }]}>
                  Manage your data, account protection and visibility
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowPrivacySecurityModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 2FA */}
              <View style={[styles.privacyToggleRow, { borderBottomColor: theme.divider }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.privacyToggleTitle, { color: theme.textMain }]}>Two-Factor Authentication (2FA)</Text>
                  <Text style={[styles.privacyToggleSub, { color: theme.textSub }]}>
                    Receive SMS OTP for extra security during login
                  </Text>
                </View>
                <Switch
                  value={twoFactorAuth}
                  onValueChange={(val) => {
                    setTwoFactorAuth(val);
                    Alert.alert('2FA Settings', val ? 'Two-Factor Authentication is now enabled.' : '2FA disabled.');
                  }}
                  trackColor={{ false: '#E2E8F0', true: '#8A072D' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Profile Visibility */}
              <View style={[styles.privacyToggleRow, { borderBottomColor: theme.divider }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.privacyToggleTitle, { color: theme.textMain }]}>Show Profile to Booked Vendors</Text>
                  <Text style={[styles.privacyToggleSub, { color: theme.textSub }]}>
                    Allow booked vendors to see event contact number
                  </Text>
                </View>
                <Switch
                  value={profileVisibleToVendors}
                  onValueChange={setProfileVisibleToVendors}
                  trackColor={{ false: '#E2E8F0', true: '#8A072D' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Online Activity Status */}
              <View style={[styles.privacyToggleRow, { borderBottomColor: theme.divider }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.privacyToggleTitle, { color: theme.textMain }]}>Show Online Status in Chat</Text>
                  <Text style={[styles.privacyToggleSub, { color: theme.textSub }]}>
                    Let artists know when you are actively messaging
                  </Text>
                </View>
                <Switch
                  value={activityStatusVisible}
                  onValueChange={setActivityStatusVisible}
                  trackColor={{ false: '#E2E8F0', true: '#8A072D' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Download Data & Clear Cache Buttons */}
              <TouchableOpacity
                style={[styles.secondaryActionBtn, { backgroundColor: theme.userCardBg, borderColor: theme.userCardBorder }]}
                onPress={() => Alert.alert('Download Data', 'A secure archive of your invoices and bookings has been sent to ' + userEmail)}
              >
                <Ionicons name="download-outline" size={16} color="#8A072D" />
                <Text style={styles.secondaryActionBtnText}>Download My Account Data</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryActionBtn, { backgroundColor: theme.userCardBg, borderColor: theme.userCardBorder }]}
                onPress={() => Alert.alert('Cache Cleared', 'Temporary files and vendor thumbnails have been cleared (42 MB freed).')}
              >
                <Ionicons name="refresh-outline" size={16} color="#8A072D" />
                <Text style={styles.secondaryActionBtnText}>Clear Cache (42 MB)</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 6. Delete Account Modal */}
      <Modal visible={showDeleteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#DC2626' }]}>Delete Account</Text>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color="#DC2626" />
              <Text style={styles.warningText}>
                This action is permanent and cannot be undone. All your bookings, invoices, and saved vendors will be deleted.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryModalBtn, { backgroundColor: '#DC2626' }]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.primaryModalBtnText}>Yes, Delete My Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelModalBtn}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={[styles.cancelModalBtnText, { color: theme.textSub }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 7. Terms & Conditions Modal */}
      <Modal visible={showTermsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>Terms & Conditions</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.legalBodyText, { color: theme.textMuted }]}>
                1. Acceptance of Terms{'\n'}
                By accessing and booking services on Band Baaja Baarat, you agree to comply with our platform policies.{'\n\n'}
                2. Vendor Bookings{'\n'}
                All vendors listed on Band Baaja Baarat are independent service providers verified by our team. Final service execution is subject to mutual agreement on event timing and logistics.{'\n\n'}
                3. Cancellation & Refunds{'\n'}
                Free cancellation is available up to 48 hours before the scheduled event date. Refunds will be processed back to the original payment source within 5-7 business days.{'\n\n'}
                4. Safety & Standards{'\n'}
                Band Baaja Baarat reserves the right to terminate vendor listings or user accounts that violate safety guidelines.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.primaryModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 8. Privacy Policy Modal */}
      <Modal visible={showPrivacyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.legalBodyText, { color: theme.textMuted }]}>
                1. Data Collection{'\n'}
                We collect your name, phone number, email address, and event venue location strictly to facilitate wedding vendor bookings.{'\n\n'}
                2. Data Protection{'\n'}
                All communications and payment transactions on Band Baaja Baarat are encrypted with 256-bit SSL security.{'\n\n'}
                3. Third Party Sharing{'\n'}
                Your contact details are shared only with the specific vendor you choose to book for coordination purposes.{'\n\n'}
                4. Your Rights{'\n'}
                You can download your data or request complete deletion of your account at any time from Settings.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.primaryModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 9. About Us Interactive Modal */}
      <Modal visible={showAboutModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.modalBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>About Band Baaja Baarat</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close" size={24} color={theme.textMain} />
              </TouchableOpacity>
            </View>

            <View style={styles.aboutHeroCard}>
              <View style={styles.aboutLogoBadge}>
                <Ionicons name="musical-notes" size={24} color="#8A072D" />
              </View>
              <Text style={[styles.aboutAppName, { color: theme.textMain }]}>Band Baaja Baarat</Text>
              <Text style={styles.aboutVersionText}>Version 1.0.0 (Build 2026.11)</Text>
              <Text style={[styles.aboutTagline, { color: theme.textSub }]}>
                India's #1 Premium Wedding Services Marketplace
              </Text>
            </View>

            <View style={styles.aboutInfoRows}>
              <View style={[styles.aboutInfoRow, { borderBottomColor: theme.divider }]}>
                <Text style={[styles.aboutInfoLabel, { color: theme.textSub }]}>Crafted with Love in</Text>
                <Text style={[styles.aboutInfoValue, { color: theme.textMain }]}>Indore, Madhya Pradesh</Text>
              </View>
              <View style={[styles.aboutInfoRow, { borderBottomColor: theme.divider }]}>
                <Text style={[styles.aboutInfoLabel, { color: theme.textSub }]}>Customer Support</Text>
                <Text style={[styles.aboutInfoValue, { color: theme.textMain }]}>support@bandbaajabaarat.in</Text>
              </View>
              <View style={[styles.aboutInfoRow, { borderBottomColor: theme.divider }]}>
                <Text style={[styles.aboutInfoLabel, { color: theme.textSub }]}>Website</Text>
                <Text style={[styles.aboutInfoValue, { color: '#8A072D' }]}>www.bandbaajabaarat.in</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkUpdateBtn}
              activeOpacity={0.8}
              onPress={handleCheckForUpdates}
            >
              {checkingUpdate ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="sync" size={16} color="#FFFFFF" />
                  <Text style={styles.checkUpdateBtnText}>Check for Updates</Text>
                </>
              )}
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  headerTitleMaroon: {
    color: '#8A072D',
  },
  headerSubtitle: {
    fontSize: 10.5,
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
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeSub: {
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
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8A072D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoCol: {
    flex: 1,
    gap: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
  },
  userPhone: {
    fontSize: 10.5,
  },
  userEmail: {
    fontSize: 9.5,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8A072D',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  editProfileBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Section
  sectionContainer: {
    gap: 6,
  },
  sectionHeading: {
    fontSize: 12.5,
    fontWeight: '800',
    marginLeft: 2,
  },
  cardGroup: {
    borderRadius: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    flex: 1,
    gap: 1,
  },
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activePillBadge: {
    backgroundColor: '#FDECE6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  activePillBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  menuSubtitle: {
    fontSize: 9,
  },
  itemDivider: {
    height: 1,
    marginLeft: 56,
  },

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 12,
    gap: 6,
    marginTop: 4,
  },
  logoutBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  footerNote: {
    fontSize: 9.5,
    textAlign: 'center',
    marginTop: 4,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '85%',
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
  },
  modalSubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    marginBottom: 3,
    marginTop: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  passwordInput: {
    flex: 1,
    fontSize: 12,
    padding: 0,
  },
  primaryModalBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  cancelModalBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelModalBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Language modal
  languageOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  languageOptionRowSelected: {
    borderRadius: 8,
  },
  languageNameText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  languageNativeBadge: {
    fontSize: 10.5,
    color: '#8A072D',
    fontWeight: '700',
  },
  languageSubInfo: {
    fontSize: 9.5,
    marginTop: 2,
  },

  // Location modal
  gpsAutoDetectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 10,
  },
  gpsIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  gpsCardSub: {
    fontSize: 8.5,
    marginTop: 1,
  },
  citiesSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
    marginTop: 4,
  },
  cityOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  cityOptionRowSelected: {
    borderRadius: 8,
  },
  cityNameText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  cityHubText: {
    fontSize: 8.5,
    marginTop: 1,
  },

  // Privacy & Security
  privacyToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  privacyToggleTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  privacyToggleSub: {
    fontSize: 9,
    marginTop: 2,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
    marginTop: 10,
  },
  secondaryActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
  },

  // About modal
  aboutHeroCard: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 3,
  },
  aboutLogoBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  aboutAppName: {
    fontSize: 15,
    fontWeight: '900',
  },
  aboutVersionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A072D',
  },
  aboutTagline: {
    fontSize: 9.5,
    textAlign: 'center',
    marginTop: 2,
  },
  aboutInfoRows: {
    marginVertical: 10,
  },
  aboutInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  aboutInfoLabel: {
    fontSize: 10.5,
  },
  aboutInfoValue: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  checkUpdateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: 10,
    paddingVertical: 11,
    gap: 6,
    marginTop: 6,
  },
  checkUpdateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 10,
    color: '#991B1B',
    lineHeight: 14,
  },
  legalBodyText: {
    fontSize: 11,
    lineHeight: 16,
  },
});
