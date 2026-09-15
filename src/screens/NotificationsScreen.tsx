import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';

export const NotificationsScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  // Push notification master switch
  const [pushMaster, setPushMaster] = useState(true);

  // Push preferences switches
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [offersDeals, setOffersDeals] = useState(true);
  const [newServices, setNewServices] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  // Communication preferences switches
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
    }
  };

  const handleMasterToggle = (val: boolean) => {
    setPushMaster(val);
    if (!val) {
      setBookingUpdates(false);
      setOffersDeals(false);
      setNewServices(false);
      setReminders(false);
      setMarketingUpdates(false);
    } else {
      setBookingUpdates(true);
      setOffersDeals(true);
      setReminders(true);
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
              Notification <Text style={styles.screenTitleHighlight}>Settings</Text>
            </Text>
            <Text style={styles.screenSubtitle}>Stay updated with what matters to you</Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.bellGraphicBox}>
            <Ionicons name="notifications" size={18} color="#D81B60" />
            <View style={styles.bellSoundLines} />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Never</Text>
            <Text style={styles.decorativeLine2}>Miss Your</Text>
            <Text style={styles.decorativeLine3}>Special Moments ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Promo Banner: Get real-time updates */}
        <View style={styles.topPromoCard}>
          <View style={styles.megaphoneCircle}>
            <Ionicons name="megaphone" size={20} color="#D81B60" />
          </View>
          <View style={styles.topPromoTextCol}>
            <Text style={styles.topPromoTitle}>Get real-time updates</Text>
            <Text style={styles.topPromoSubtitle}>
              Be the first to know about bookings, offers and important updates.
            </Text>
          </View>
        </View>

        {/* SECTION 1: Push Notifications */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderCol}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            <Text style={styles.sectionSubtitle}>
              Receive notifications on your device
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#E2E8F0"
            onValueChange={handleMasterToggle}
            value={pushMaster}
          />
        </View>

        <View style={styles.optionsListCard}>
          {/* 1. Booking Updates */}
          <View style={styles.optionRow}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="calendar" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Booking Updates</Text>
              <Text style={styles.optionSubtitle}>
                Get notified about booking status, confirmations and reminders.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={(val) => {
                setBookingUpdates(val);
                if (val && !pushMaster) setPushMaster(true);
              }}
              value={bookingUpdates}
            />
          </View>

          {/* 2. Offers & Deals */}
          <View style={styles.optionRow}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="pricetag" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Offers & Deals</Text>
              <Text style={styles.optionSubtitle}>
                Receive latest offers, discounts and exclusive deals.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={(val) => {
                setOffersDeals(val);
                if (val && !pushMaster) setPushMaster(true);
              }}
              value={offersDeals}
            />
          </View>

          {/* 3. New Services */}
          <View style={styles.optionRow}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="star-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>New Services</Text>
              <Text style={styles.optionSubtitle}>
                Be notified when new vendors or services are added.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={(val) => {
                setNewServices(val);
                if (val && !pushMaster) setPushMaster(true);
              }}
              value={newServices}
            />
          </View>

          {/* 4. Reminders */}
          <View style={styles.optionRow}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="notifications-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Reminders</Text>
              <Text style={styles.optionSubtitle}>
                Get reminders for upcoming events and bookings.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={(val) => {
                setReminders(val);
                if (val && !pushMaster) setPushMaster(true);
              }}
              value={reminders}
            />
          </View>

          {/* 5. Marketing Updates */}
          <View style={[styles.optionRow, { borderBottomWidth: 0 }]}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="mail-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Marketing Updates</Text>
              <Text style={styles.optionSubtitle}>
                Receive newsletters, tips and event planning ideas.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={(val) => {
                setMarketingUpdates(val);
                if (val && !pushMaster) setPushMaster(true);
              }}
              value={marketingUpdates}
            />
          </View>
        </View>

        {/* SECTION 2: Communication Preferences */}
        <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
          <View style={styles.sectionHeaderCol}>
            <Text style={styles.sectionTitle}>Communication Preferences</Text>
            <Text style={styles.sectionSubtitle}>
              Choose how you want to be notified
            </Text>
          </View>
        </View>

        <View style={styles.optionsListCard}>
          {/* 1. Email Notifications */}
          <View style={styles.optionRow}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="mail-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Email Notifications</Text>
              <Text style={styles.optionSubtitle}>
                Receive important updates via email.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={setEmailNotifications}
              value={emailNotifications}
            />
          </View>

          {/* 2. SMS Notifications */}
          <View style={styles.optionRow}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>SMS Notifications</Text>
              <Text style={styles.optionSubtitle}>
                Get critical updates via SMS.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={setSmsNotifications}
              value={smsNotifications}
            />
          </View>

          {/* 3. WhatsApp Notifications */}
          <View style={[styles.optionRow, { borderBottomWidth: 0 }]}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="logo-whatsapp" size={18} color="#D81B60" />
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>WhatsApp Notifications</Text>
              <Text style={styles.optionSubtitle}>
                Receive booking and chat updates on WhatsApp.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
              onValueChange={setWhatsappNotifications}
              value={whatsappNotifications}
            />
          </View>
        </View>

        {/* SECTION 3: Bottom Control Info Card */}
        <View style={styles.bottomControlCard}>
          <View style={styles.phoneIllustrationWrap}>
            <View style={styles.phoneBaseGraphic}>
              <View style={styles.phoneScreenGraphic} />
              <View style={styles.phoneBellBadge}>
                <Ionicons name="notifications" size={12} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <View style={styles.bottomControlTextCol}>
            <Text style={styles.bottomControlTitle}>You're in Control</Text>
            <Text style={styles.bottomControlSubtitle}>
              You can change these settings anytime to match your preferences.
            </Text>
          </View>
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
  bellGraphicBox: {
    position: 'relative',
    marginRight: 6,
  },
  bellSoundLines: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D81B60',
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
  topPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
    marginBottom: 16,
  },
  megaphoneCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topPromoTextCol: {
    flex: 1,
  },
  topPromoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 3,
  },
  topPromoSubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderCol: {
    flex: 1,
    paddingRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  optionsListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  bottomControlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
    marginTop: 20,
  },
  phoneIllustrationWrap: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phoneBaseGraphic: {
    position: 'relative',
    width: 32,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F43F5E',
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneScreenGraphic: {
    width: 22,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  phoneBellBadge: {
    position: 'absolute',
    top: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  bottomControlTextCol: {
    flex: 1,
  },
  bottomControlTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 3,
  },
  bottomControlSubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
});
