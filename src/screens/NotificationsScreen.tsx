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
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';

interface RecentNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isUnread: boolean;
  iconType: 'calendar' | 'gift' | 'bell' | 'star' | 'tag';
  targetScreen?: string;
}

export const NotificationsScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  // Notification Preferences toggles
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [offersDiscounts, setOffersDiscounts] = useState(true);
  const [recommendations, setRecommendations] = useState(false);
  const [promotionalEmails, setPromotionalEmails] = useState(false);

  // Recent notifications list
  const [recentNotifications, setRecentNotifications] = useState<RecentNotification[]>([
    {
      id: 'rn1',
      title: 'Booking Confirmed',
      description: 'Your booking with Royal Beats Dhol Group for 15 Nov 2026 is confirmed!',
      timestamp: '10:15 AM',
      isUnread: true,
      iconType: 'calendar',
      targetScreen: 'BookingDetails',
    },
    {
      id: 'rn2',
      title: 'Special Offer',
      description: 'Get 10% off on your next booking. Use code FESTIVE10',
      timestamp: 'Yesterday',
      isUnread: false,
      iconType: 'gift',
      targetScreen: 'Services',
    },
    {
      id: 'rn3',
      title: 'Event Reminder',
      description: 'Your event is tomorrow at 5:00 PM. Get ready!',
      timestamp: '1 day ago',
      isUnread: false,
      iconType: 'bell',
      targetScreen: 'BookingDetails',
    },
    {
      id: 'rn4',
      title: 'New Vendor Available',
      description: 'Check out new dhol groups in your city.',
      timestamp: '2 days ago',
      isUnread: false,
      iconType: 'star',
      targetScreen: 'Services',
    },
    {
      id: 'rn5',
      title: 'Exclusive Deal',
      description: 'Book now and get free LED dhol with your package!',
      timestamp: '3 days ago',
      isUnread: false,
      iconType: 'tag',
      targetScreen: 'Services',
    },
  ]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
    }
  };

  const handleEnableAll = () => {
    setBookingUpdates(true);
    setReminders(true);
    setOffersDiscounts(true);
    setRecommendations(true);
    setPromotionalEmails(true);
    Alert.alert('All Notifications Enabled', 'You will receive all updates, offers, and recommendations.');
  };

  const handleMarkAllAsRead = () => {
    setRecentNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    Alert.alert('Notifications', 'All recent notifications marked as read.');
  };

  const handleNotificationPress = (item: RecentNotification) => {
    setRecentNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n))
    );
    if (item.targetScreen) {
      navigation?.navigate(item.targetScreen);
    }
  };

  const renderRecentIcon = (type: RecentNotification['iconType']) => {
    switch (type) {
      case 'calendar':
        return <Ionicons name="calendar-outline" size={18} color="#8A072D" />;
      case 'gift':
        return <Ionicons name="gift-outline" size={18} color="#8A072D" />;
      case 'bell':
        return <Ionicons name="notifications-outline" size={18} color="#8A072D" />;
      case 'star':
        return <Ionicons name="star-outline" size={18} color="#8A072D" />;
      case 'tag':
        return <MaterialCommunityIcons name="tag-outline" size={18} color="#8A072D" />;
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
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Noti<Text style={styles.headerTitleMaroon}>fications</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Stay updated with your bookings and offers</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Never</Text>
          <Text style={styles.scriptBadgeMid}>Miss</Text>
          <Text style={styles.scriptBadgeSub}>What</Text>
          <Text style={styles.scriptBadgeBot}>Matters ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Banner: Get Notified */}
        <View style={styles.getNotifiedBanner}>
          <View style={styles.bellIconCircle}>
            <Ionicons name="notifications" size={20} color="#8A072D" />
          </View>

          <View style={styles.getNotifiedTextCol}>
            <Text style={styles.getNotifiedTitle}>Get Notified</Text>
            <Text style={styles.getNotifiedSubtitle}>
              Enable notifications to receive important updates, offers and reminders.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.enableAllBtn}
            activeOpacity={0.85}
            onPress={handleEnableAll}
          >
            <Text style={styles.enableAllBtnText}>Enable All</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Preferences Section */}
        <View style={styles.preferencesCard}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <Text style={styles.sectionSubtitle}>Choose what you want to be notified about</Text>

          <View style={styles.preferenceList}>
            {/* 1. Booking Updates */}
            <View style={styles.preferenceRow}>
              <View style={styles.prefIconCircle}>
                <Ionicons name="calendar-outline" size={17} color="#8A072D" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Booking Updates</Text>
                <Text style={styles.prefSubtitle}>
                  Get notified about booking confirmations, changes and cancellations
                </Text>
              </View>
              <Switch
                trackColor={{ false: '#D1C4C7', true: '#8A072D' }}
                thumbColor="#FFFFFF"
                value={bookingUpdates}
                onValueChange={setBookingUpdates}
              />
            </View>

            {/* 2. Reminders */}
            <View style={styles.preferenceRow}>
              <View style={styles.prefIconCircle}>
                <Ionicons name="notifications-outline" size={17} color="#8A072D" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Reminders</Text>
                <Text style={styles.prefSubtitle}>Receive reminders before your event</Text>
              </View>
              <Switch
                trackColor={{ false: '#D1C4C7', true: '#8A072D' }}
                thumbColor="#FFFFFF"
                value={reminders}
                onValueChange={setReminders}
              />
            </View>

            {/* 3. Offers & Discounts */}
            <View style={styles.preferenceRow}>
              <View style={styles.prefIconCircle}>
                <MaterialCommunityIcons name="tag-outline" size={17} color="#8A072D" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Offers & Discounts</Text>
                <Text style={styles.prefSubtitle}>Be the first to know about exclusive offers</Text>
              </View>
              <Switch
                trackColor={{ false: '#D1C4C7', true: '#8A072D' }}
                thumbColor="#FFFFFF"
                value={offersDiscounts}
                onValueChange={setOffersDiscounts}
              />
            </View>

            {/* 4. Recommendations */}
            <View style={styles.preferenceRow}>
              <View style={styles.prefIconCircle}>
                <Ionicons name="star-outline" size={17} color="#8A072D" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Recommendations</Text>
                <Text style={styles.prefSubtitle}>Get suggestions based on your interests</Text>
              </View>
              <Switch
                trackColor={{ false: '#D1C4C7', true: '#8A072D' }}
                thumbColor="#FFFFFF"
                value={recommendations}
                onValueChange={setRecommendations}
              />
            </View>

            {/* 5. Promotional Emails */}
            <View style={[styles.preferenceRow, { borderBottomWidth: 0 }]}>
              <View style={styles.prefIconCircle}>
                <Ionicons name="mail-outline" size={17} color="#8A072D" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Promotional Emails</Text>
                <Text style={styles.prefSubtitle}>Receive updates and offers via email</Text>
              </View>
              <Switch
                trackColor={{ false: '#D1C4C7', true: '#8A072D' }}
                thumbColor="#FFFFFF"
                value={promotionalEmails}
                onValueChange={setPromotionalEmails}
              />
            </View>
          </View>
        </View>

        {/* Recent Notifications Section */}
        <View style={styles.recentSectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Mark All as Read</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Notifications List */}
        <View style={styles.recentList}>
          {recentNotifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.recentCard,
                item.isUnread && styles.recentCardUnread,
              ]}
              activeOpacity={0.85}
              onPress={() => handleNotificationPress(item)}
            >
              {/* Icon */}
              <View style={styles.recentIconWrapper}>
                <View style={styles.recentIconCircle}>{renderRecentIcon(item.iconType)}</View>
                {item.isUnread && <View style={styles.unreadDot} />}
              </View>

              {/* Text Info */}
              <View style={styles.recentTextCol}>
                <View style={styles.recentTitleRow}>
                  <Text style={styles.recentTitleText}>{item.title}</Text>
                  <Text style={styles.recentTimestampText}>{item.timestamp}</Text>
                </View>

                <Text style={styles.recentDescText} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={16} color="#8A072D" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>
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

  // Get Notified Top Banner
  getNotifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    gap: 10,
  },
  bellIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getNotifiedTextCol: {
    flex: 1,
  },
  getNotifiedTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  getNotifiedSubtitle: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 2,
    lineHeight: 13,
  },
  enableAllBtn: {
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  enableAllBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },

  // Preferences Card
  preferencesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  sectionSubtitle: {
    fontSize: 10,
    color: '#736064',
    marginTop: 1,
    marginBottom: 8,
  },
  preferenceList: {
    gap: 2,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
    gap: 10,
  },
  prefIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTextCol: {
    flex: 1,
    gap: 1,
  },
  prefTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  prefSubtitle: {
    fontSize: 9,
    color: '#736064',
    lineHeight: 12,
  },

  // Recent Section
  recentSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
  },

  recentList: {
    gap: 8,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 10,
    elevation: 1,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  recentCardUnread: {
    backgroundColor: '#FFF8F6',
    borderColor: '#F5DDD3',
  },
  recentIconWrapper: {
    position: 'relative',
  },
  recentIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8A072D',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  recentTextCol: {
    flex: 1,
    gap: 2,
  },
  recentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTitleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  recentTimestampText: {
    fontSize: 9,
    color: '#8E7C80',
  },
  recentDescText: {
    fontSize: 9.5,
    color: '#554246',
    lineHeight: 13,
  },
});
