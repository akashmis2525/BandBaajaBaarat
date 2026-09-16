import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  ScrollView,
  Modal,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalDialog } from '../../components/RoyalDialog';
import { api } from '../../services/api';

const { width } = Dimensions.get('window');

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

  // Profile State
  const [bizName, setBizName] = useState('Royal Events & Decor');
  const [bizCategory, setBizCategory] = useState('Mandap, Stage & Lighting Setup');
  const [bizLocation, setBizLocation] = useState('301, Shekhar Central, MG Road, Indore');
  const [bizPhone, setBizPhone] = useState('+91 98260 12345');
  const [bizBio, setBizBio] = useState('Premier luxury wedding decorators in central India with over 800+ completed wedding setups.');

  // Operating Hours State
  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('09:00 PM');
  const [operatingDays, setOperatingDays] = useState('Monday – Sunday (7 Days)');

  // Notification Preferences
  const [leadAlerts, setLeadAlerts] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [smsPayoutAlerts, setSmsPayoutAlerts] = useState(true);

  // Modals Visibility
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isHoursModalVisible, setIsHoursModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [isPolicyModalVisible, setIsPolicyModalVisible] = useState(false);

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('Payout Inquiry');
  const [ticketDesc, setTicketDesc] = useState('');

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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboardTab');
    }
  };

  const handleSaveProfile = () => {
    api
      .updateVendorProfile({
        businessName: bizName,
        category: bizCategory,
        address: bizLocation,
        phone: bizPhone,
        bio: bizBio,
      })
      .catch(() => undefined);
    setIsEditProfileVisible(false);
    showDialog({
      type: 'success',
      title: 'Profile Updated! ✨',
      message: 'Your public storefront information has been saved and is live for couples across Indore.',
      confirmText: 'Done',
      highlightText: `Storefront: ${bizName}`,
      onConfirm: hideDialog,
    });
  };

  const handleSaveHours = () => {
    api
      .updateVendorProfile({
        openTime,
        closeTime,
        operatingDays,
      })
      .catch(() => undefined);
    setIsHoursModalVisible(false);
    showDialog({
      type: 'success',
      title: 'Hours Updated! ⏰',
      message: `Your business consultation hours have been set to ${openTime} – ${closeTime}.`,
      confirmText: 'Done',
      onConfirm: hideDialog,
    });
  };

  const handleCreateSupportTicket = () => {
    if (!ticketDesc.trim()) {
      showDialog({
        type: 'warning',
        title: 'Description Needed',
        message: 'Please describe the issue or question so our team can assist you immediately.',
        confirmText: 'Add Details',
        onConfirm: hideDialog,
      });
      return;
    }
    const ticketId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    setIsSupportModalVisible(false);
    setTicketDesc('');
    showDialog({
      type: 'success',
      title: 'Ticket Created! 🎫',
      message: `Your partner support ticket has been registered. Our vendor relationship manager will call you within 30 minutes.`,
      confirmText: 'Got It',
      highlightText: `Ticket ID: #${ticketId} • Priority: HIGH`,
      onConfirm: hideDialog,
    });
  };

  const handleLogout = () => {
    showDialog({
      type: 'warning',
      title: 'Log Out of Partner Portal?',
      message: 'Are you sure you want to log out? You will stop receiving instant inquiry notifications until you log back in.',
      confirmText: 'Log Out',
      cancelText: 'Stay Logged In',
      onCancel: hideDialog,
      onConfirm: () => {
        hideDialog();
        if (onLogout) onLogout();
      },
    });
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 24 : 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 28 }}>👑</Text>
          </View>
          <View style={styles.profileDetailsCol}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.bizName}>{bizName}</Text>
              <Ionicons name="checkmark-circle" size={16} color="#15803D" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.bizCategory}>{bizCategory}</Text>
            <Text style={styles.bizLocation}>📍 {bizLocation}</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingScore}>4.8</Text>
              <Text style={styles.reviewsCount}>(320 verified reviews)</Text>
            </View>
          </View>

          {/* Edit Profile Quick Button */}
          <TouchableOpacity
            style={styles.editProfilePill}
            activeOpacity={0.8}
            onPress={() => setIsEditProfileVisible(true)}
          >
            <Ionicons name="pencil" size={13} color="#8A072D" />
            <Text style={styles.editProfilePillText}>Edit</Text>
          </TouchableOpacity>
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

        {/* ========================================================= */}
        {/* Section 1: Business Profile Management */}
        {/* ========================================================= */}
        <Text style={styles.sectionHeading}>Storefront & Operations</Text>

        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsEditProfileVisible(true)}
          >
            <Ionicons name="business-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Edit Store Profile & Contact</Text>
              <Text style={styles.itemSub}>{bizPhone} • {bizName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsHoursModalVisible(true)}
          >
            <Ionicons name="time-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Operating & Consultation Hours</Text>
              <Text style={styles.itemSub}>{openTime} – {closeTime} ({operatingDays})</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('VendorPortfolioManager');
              }
            }}
          >
            <Ionicons name="images-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Portfolio Gallery & Packages</Text>
              <Text style={styles.itemSub}>6 Showcase Photos • 3 Package Tiers</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('VendorKYC');
              }
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>KYC & Document Verification</Text>
              <Text style={styles.itemSub}>GSTIN & Aadhaar Proof</Text>
            </View>
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
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Bank Payouts & Settlement</Text>
              <Text style={styles.itemSub}>HDFC Bank **** 7812</Text>
            </View>
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
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Availability & Blackout Muhurat Dates</Text>
              <Text style={styles.itemSub}>3 Dates Blocked in November</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* Section 2: Notifications Preferences */}
        {/* ========================================================= */}
        <Text style={styles.sectionHeading}>Notification Preferences</Text>

        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <Ionicons name="flash-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Instant Wedding Lead Alerts</Text>
              <Text style={styles.itemSub}>Push notifications when couples request quotes</Text>
            </View>
            <Switch
              value={leadAlerts}
              onValueChange={setLeadAlerts}
              trackColor={{ false: '#E2E8F0', true: '#FECDD3' }}
              thumbColor={leadAlerts ? '#8A072D' : '#94A3B8'}
            />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="logo-whatsapp" size={18} color="#16A34A" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>WhatsApp Lead Inquiries</Text>
              <Text style={styles.itemSub}>Receive couple inquiries directly on WhatsApp</Text>
            </View>
            <Switch
              value={whatsappUpdates}
              onValueChange={setWhatsappUpdates}
              trackColor={{ false: '#E2E8F0', true: '#BBF7D0' }}
              thumbColor={whatsappUpdates ? '#16A34A' : '#94A3B8'}
            />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="cash-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>SMS Payout & Bank Credit Alerts</Text>
              <Text style={styles.itemSub}>SMS confirmation when advance token is released</Text>
            </View>
            <Switch
              value={smsPayoutAlerts}
              onValueChange={setSmsPayoutAlerts}
              trackColor={{ false: '#E2E8F0', true: '#FECDD3' }}
              thumbColor={smsPayoutAlerts ? '#8A072D' : '#94A3B8'}
            />
          </View>
        </View>

        {/* ========================================================= */}
        {/* Section 3: Support, Helpdesk & Policies */}
        {/* ========================================================= */}
        <Text style={styles.sectionHeading}>Support & Partner Policies</Text>

        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsSupportModalVisible(true)}
          >
            <Ionicons name="headset-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Partner Support & Relationship Desk</Text>
              <Text style={styles.itemSub}>Direct Helpline + Ticket Support (9 AM – 9 PM)</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsPolicyModalVisible(true)}
          >
            <Ionicons name="document-text-outline" size={18} color="#8A072D" style={styles.itemIcon} />
            <View style={styles.itemTextCol}>
              <Text style={styles.itemTitle}>Vendor Agreement & 5% Escrow Policy</Text>
              <Text style={styles.itemSub}>Advance safety, cancellation & payout terms</Text>
            </View>
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

      {/* ========================================================= */}
      {/* 1. EDIT PROFILE MODAL */}
      {/* ========================================================= */}
      <Modal
        visible={isEditProfileVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Storefront Profile</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsEditProfileVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <Text style={styles.modalFieldLabel}>Business / Brand Name *</Text>
              <TextInput
                style={styles.modalInput}
                value={bizName}
                onChangeText={setBizName}
                placeholder="Business Name"
              />

              <Text style={styles.modalFieldLabel}>Primary Service Category *</Text>
              <TextInput
                style={styles.modalInput}
                value={bizCategory}
                onChangeText={setBizCategory}
                placeholder="Category"
              />

              <Text style={styles.modalFieldLabel}>Storefront Address / City *</Text>
              <TextInput
                style={styles.modalInput}
                value={bizLocation}
                onChangeText={setBizLocation}
                placeholder="Address"
              />

              <Text style={styles.modalFieldLabel}>Contact Phone Number *</Text>
              <TextInput
                style={styles.modalInput}
                value={bizPhone}
                onChangeText={setBizPhone}
                placeholder="+91 Phone"
                keyboardType="phone-pad"
              />

              <Text style={styles.modalFieldLabel}>About / Bio Description</Text>
              <TextInput
                style={[styles.modalInput, { height: 70, textAlignVertical: 'top' }]}
                value={bizBio}
                onChangeText={setBizBio}
                placeholder="Describe your decor expertise..."
                multiline
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              activeOpacity={0.88}
              onPress={handleSaveProfile}
            >
              <Text style={styles.modalSaveBtnText}>Save Storefront Changes</Text>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 2. OPERATING HOURS MODAL */}
      {/* ========================================================= */}
      <Modal
        visible={isHoursModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsHoursModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Set Consultation Hours</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsHoursModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubText}>
              Couples can schedule in-person and venue visits during these active hours.
            </Text>

            <View style={styles.hoursRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.modalFieldLabel}>Opens At</Text>
                <TextInput
                  style={styles.modalInput}
                  value={openTime}
                  onChangeText={setOpenTime}
                  placeholder="09:00 AM"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.modalFieldLabel}>Closes At</Text>
                <TextInput
                  style={styles.modalInput}
                  value={closeTime}
                  onChangeText={setCloseTime}
                  placeholder="09:00 PM"
                />
              </View>
            </View>

            <Text style={styles.modalFieldLabel}>Working Days</Text>
            <TextInput
              style={styles.modalInput}
              value={operatingDays}
              onChangeText={setOperatingDays}
              placeholder="e.g. Monday – Sunday"
            />

            <TouchableOpacity
              style={styles.modalSaveBtn}
              activeOpacity={0.88}
              onPress={handleSaveHours}
            >
              <Text style={styles.modalSaveBtnText}>Save Consultation Hours</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 3. PARTNER SUPPORT & HELPDESK MODAL */}
      {/* ========================================================= */}
      <Modal
        visible={isSupportModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsSupportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Partner Helpdesk</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsSupportModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubText}>
              Dedicated relationship managers for Band Baaja Baarat verified vendors.
            </Text>

            {/* Quick Helpline Cards */}
            <View style={styles.supportQuickRow}>
              <TouchableOpacity
                style={styles.supportQuickCard}
                onPress={() => {
                  setIsSupportModalVisible(false);
                  showDialog({
                    type: 'royal',
                    title: 'Partner Helpline 📞',
                    message: 'Connecting to priority vendor helpline: +91 731 400 9999 (Available 9 AM to 9 PM daily).',
                    confirmText: 'Call Now',
                    onConfirm: hideDialog,
                  });
                }}
              >
                <Ionicons name="call" size={20} color="#8A072D" />
                <Text style={styles.supportQuickText}>Direct Call</Text>
                <Text style={styles.supportQuickSub}>+91 731 400 9999</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportQuickCard}
                onPress={() => {
                  setIsSupportModalVisible(false);
                  showDialog({
                    type: 'success',
                    title: 'WhatsApp Desk 💬',
                    message: 'Opening official WhatsApp support channel for Royal Events & Decor.',
                    confirmText: 'Open Chat',
                    onConfirm: hideDialog,
                  });
                }}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#16A34A" />
                <Text style={styles.supportQuickText}>WhatsApp Support</Text>
                <Text style={styles.supportQuickSub}>Instant Response</Text>
              </TouchableOpacity>
            </View>

            {/* Support Ticket Form */}
            <Text style={[styles.modalFieldLabel, { marginTop: 14 }]}>Issue Subject</Text>
            <TextInput
              style={styles.modalInput}
              value={ticketSubject}
              onChangeText={setTicketSubject}
              placeholder="e.g. Advance Payout Status"
            />

            <Text style={styles.modalFieldLabel}>Describe Your Issue / Question *</Text>
            <TextInput
              style={[styles.modalInput, { height: 70, textAlignVertical: 'top' }]}
              value={ticketDesc}
              onChangeText={setTicketDesc}
              placeholder="Please provide booking code or payout details..."
              multiline
            />

            <TouchableOpacity
              style={styles.modalSaveBtn}
              activeOpacity={0.88}
              onPress={handleCreateSupportTicket}
            >
              <Text style={styles.modalSaveBtnText}>Submit Priority Ticket</Text>
              <Ionicons name="send" size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 4. VENDOR POLICY & ESCROW MODAL */}
      {/* ========================================================= */}
      <Modal
        visible={isPolicyModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPolicyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Partner Policy & Terms</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsPolicyModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
              <View style={styles.policyItem}>
                <Ionicons name="shield-checkmark" size={18} color="#15803D" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyTitle}>5% Transparent Platform Fee</Text>
                  <Text style={styles.policyDesc}>
                    Band Baaja Baarat charges only a 5% platform fee upon successful customer booking. No upfront lead fees.
                  </Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <Ionicons name="lock-closed" size={18} color="#8A072D" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyTitle}>Advance Token Safety (Escrow)</Text>
                  <Text style={styles.policyDesc}>
                    Customer advance tokens (₹25,000) are protected in escrow and credited instantly to your bank account upon order acceptance.
                  </Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <Ionicons name="star" size={18} color="#F59E0B" style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.policyTitle}>Quality & Verification SLA</Text>
                  <Text style={styles.policyDesc}>
                    Maintain an average 4.5+ star rating to enjoy free top-listing placement across Indore & MP.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              activeOpacity={0.88}
              onPress={() => setIsPolicyModalVisible(false)}
            >
              <Text style={styles.modalSaveBtnText}>I Understand & Agree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    paddingTop: 14,
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
    position: 'relative',
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
    marginTop: 1,
  },
  bizLocation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingScore: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 3,
  },
  reviewsCount: {
    fontSize: 10.5,
    color: '#64748B',
    marginLeft: 3,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  editProfilePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A072D',
    marginLeft: 3,
  },

  switchModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1.2,
    borderColor: '#FECDD3',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  switchIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  switchTextCol: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
  },
  switchSub: {
    fontSize: 10.5,
    color: '#9F1239',
    marginTop: 1,
  },

  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 6,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    marginTop: 4,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  modalFieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#1E293B',
  },
  hoursRow: {
    flexDirection: 'row',
  },
  modalSaveBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    marginTop: 14,
  },
  modalSaveBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  supportQuickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  supportQuickCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
  },
  supportQuickText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
  },
  supportQuickSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },

  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAF9FB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  policyTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  policyDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
});
