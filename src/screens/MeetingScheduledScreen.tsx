import React from 'react';
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { Assets } from '../constants/assets';

interface MeetingScheduledScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const MeetingScheduledScreen: React.FC<MeetingScheduledScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const meetingDetails = route?.params?.meetingDetails || {
    date: '16 September 2026 (Wednesday)',
    time: '10:00 AM – 11:00 AM',
    type: 'In-Person Meeting',
    location: '301, Shekhar Central,\nMG Road, Indore, Madhya Pradesh\n452001',
    purpose: 'Discuss decoration, pricing and customization for wedding event',
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ChatMain');
    }
  };

  const handleAddToCalendar = () => {
    Alert.alert(
      'Calendar Synced 📅',
      `Meeting with Royal Events & Decor on ${meetingDetails.date} at ${meetingDetails.time} has been added to your calendar.`
    );
  };

  const handleGetDirections = () => {
    Alert.alert(
      'Opening Maps 🗺️',
      'Navigating to 301, Shekhar Central, MG Road, Indore.'
    );
  };

  const handleCallVendor = () => {
    Alert.alert('Calling Vendor 📞', 'Connecting to Royal Events & Decor (+91 97133 32997)...');
  };

  const handleVideoCall = () => {
    Alert.alert('Video Call 🎥', 'Opening secure video meeting room...');
  };

  const handleReschedule = () => {
    if (navigation?.navigate) {
      navigation.navigate('ScheduleMeeting');
    }
  };

  const handleCancelMeeting = () => {
    Alert.alert(
      'Cancel Meeting',
      'Are you sure you want to cancel this scheduled meeting with Royal Events & Decor?',
      [
        { text: 'Keep Meeting', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Meeting Cancelled',
              'Your meeting has been cancelled. The vendor has been notified.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    if (navigation?.navigate) {
                      navigation.navigate('ChatMain');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
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
              Meeting <Text style={styles.screenTitleHighlight}>Scheduled</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Your meeting with the vendor is confirmed
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.calendarGraphicBox}>
            <Ionicons name="calendar" size={16} color="#D81B60" />
            <View style={styles.checkMiniBadge}>
              <Ionicons name="checkmark-sharp" size={7} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>One Step</Text>
            <Text style={styles.decorativeLine2}>Closer To</Text>
            <Text style={styles.decorativeLine3}>Your Perfect Day ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vendor Profile Card with Call/Video Actions */}
        <View style={styles.vendorCard}>
          <Image
            source={Assets.weddingMandapArt}
            style={styles.vendorThumbImg}
            resizeMode="cover"
          />

          <View style={styles.vendorDetailsCol}>
            <Text style={styles.vendorName}>Royal Events & Decor</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.reviewsText}>(320 reviews)</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color="#D81B60" />
              <Text style={styles.locationText}>Indore, Madhya Pradesh</Text>
            </View>

            <TouchableOpacity
              style={styles.viewProfileBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate?.('ServiceDetail')}
            >
              <Text style={styles.viewProfileBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Call & Video Call Quick Actions */}
          <View style={styles.vendorActionsCol}>
            <TouchableOpacity
              style={styles.actionCircleBtn}
              activeOpacity={0.8}
              onPress={handleCallVendor}
            >
              <Ionicons name="call" size={16} color="#D81B60" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCircleBtn}
              activeOpacity={0.8}
              onPress={handleVideoCall}
            >
              <Ionicons name="videocam" size={16} color="#D81B60" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Meeting Confirmed Banner */}
        <View style={styles.confirmedBannerCard}>
          <View style={styles.popperIconWrap}>
            <Text style={styles.popperEmoji}>🎉</Text>
          </View>
          <View style={styles.confirmedTextCol}>
            <Text style={styles.confirmedTitle}>Meeting Confirmed!</Text>
            <Text style={styles.confirmedSubtitle}>
              Your meeting has been successfully scheduled with Royal Events & Decor.
            </Text>
          </View>
        </View>

        {/* Meeting Details Card */}
        <View style={styles.detailsCard}>
          {/* Row 1: Date */}
          <View style={styles.detailItemRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="calendar-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.detailLabelCol}>
              <Text style={styles.detailLabel}>Date</Text>
            </View>
            <View style={styles.detailValueCol}>
              <Text style={styles.detailValueText}>{meetingDetails.date}</Text>
            </View>
            <TouchableOpacity
              style={styles.addToCalendarBtn}
              activeOpacity={0.7}
              onPress={handleAddToCalendar}
            >
              <Ionicons name="calendar-outline" size={13} color="#E53E3E" style={{ marginRight: 4 }} />
              <Text style={styles.addToCalendarText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Time */}
          <View style={styles.detailItemRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="time-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.detailLabelCol}>
              <Text style={styles.detailLabel}>Time</Text>
            </View>
            <View style={styles.detailValueCol}>
              <Text style={styles.detailValueText}>{meetingDetails.time}</Text>
            </View>
          </View>

          {/* Row 3: Meeting Type */}
          <View style={styles.detailItemRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="people" size={18} color="#D81B60" />
            </View>
            <View style={styles.detailLabelCol}>
              <Text style={styles.detailLabel}>Meeting Type</Text>
            </View>
            <View style={styles.detailValueCol}>
              <Text style={styles.detailValueText}>{meetingDetails.type}</Text>
            </View>
          </View>

          {/* Row 4: Location */}
          <View style={styles.detailItemRow}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="location-sharp" size={18} color="#D81B60" />
            </View>
            <View style={styles.detailLabelCol}>
              <Text style={styles.detailLabel}>Location</Text>
            </View>
            <View style={styles.detailValueCol}>
              <Text style={styles.detailValueText}>{meetingDetails.location}</Text>
            </View>
            <TouchableOpacity
              style={styles.getDirectionsBtn}
              activeOpacity={0.7}
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate" size={13} color="#E53E3E" style={{ marginRight: 4 }} />
              <Text style={styles.getDirectionsText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          {/* Row 5: Meeting Purpose */}
          <View style={[styles.detailItemRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.detailIconCircle}>
              <Ionicons name="document-text-outline" size={18} color="#D81B60" />
            </View>
            <View style={styles.detailLabelCol}>
              <Text style={styles.detailLabel}>Meeting Purpose</Text>
            </View>
            <View style={styles.detailValueCol}>
              <Text style={styles.detailValueText}>{meetingDetails.purpose}</Text>
            </View>
          </View>
        </View>

        {/* Section: Before Your Meeting */}
        <View style={styles.beforeMeetingSection}>
          <Text style={styles.beforeMeetingHeading}>Before Your Meeting</Text>

          <View style={styles.tipsGridRow}>
            {/* 1. Prepare Your Requirements */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <Ionicons name="document-text-outline" size={18} color="#D81B60" />
              </View>
              <Text style={styles.tipCardTitle}>Prepare Your Requirements</Text>
              <Text style={styles.tipCardSubtitle}>
                Event details, guest count, theme, etc.
              </Text>
            </View>

            {/* 2. Set Your Budget */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <FontAwesome5 name="rupee-sign" size={15} color="#D81B60" />
              </View>
              <Text style={styles.tipCardTitle}>Set Your Budget</Text>
              <Text style={styles.tipCardSubtitle}>
                Helps in getting better suggestions
              </Text>
            </View>

            {/* 3. Check Their Portfolio */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <Ionicons name="images-outline" size={18} color="#D81B60" />
              </View>
              <Text style={styles.tipCardTitle}>Check Their Portfolio</Text>
              <Text style={styles.tipCardSubtitle}>
                View their previous work
              </Text>
            </View>

            {/* 4. Prepare Questions */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconCircle}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#D81B60" />
              </View>
              <Text style={styles.tipCardTitle}>Prepare Questions</Text>
              <Text style={styles.tipCardSubtitle}>
                Ask about packages, inclusions and customization
              </Text>
            </View>
          </View>
        </View>

        {/* Meeting Tip Info Card */}
        <View style={styles.meetingTipCard}>
          <View style={styles.infoIconCircle}>
            <Ionicons name="information" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.meetingTipTextCol}>
            <Text style={styles.meetingTipTitle}>Meeting Tip</Text>
            <Text style={styles.meetingTipSubtitle}>
              Be clear about your requirements and budget to get the best quotation from the vendor.
            </Text>
          </View>
        </View>

        {/* Next Step: View Quotation & Negotiate Price CTA */}
        <TouchableOpacity
          style={styles.negotiateCtaBtn}
          activeOpacity={0.88}
          onPress={() => navigation?.navigate('NegotiatePrice')}
        >
          <View style={styles.negotiateCtaLeft}>
            <View style={styles.negotiateIconBox}>
              <Ionicons name="pricetags" size={20} color="#D81B60" />
            </View>
            <View>
              <Text style={styles.negotiateCtaTitle}>Vendor Quotation Ready</Text>
              <Text style={styles.negotiateCtaSub}>View ₹85,000 quote & negotiate best deal</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#D81B60" />
        </TouchableOpacity>

        {/* Bottom Action Buttons: Reschedule & Cancel Meeting */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.rescheduleBtn}
            activeOpacity={0.8}
            onPress={handleReschedule}
          >
            <Ionicons name="calendar-outline" size={18} color="#E53E3E" style={{ marginRight: 6 }} />
            <Text style={styles.rescheduleBtnText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelMeetingBtn}
            activeOpacity={0.85}
            onPress={handleCancelMeeting}
          >
            <Ionicons name="close-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.cancelMeetingBtnText}>Cancel Meeting</Text>
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
  calendarGraphicBox: {
    position: 'relative',
    marginRight: 6,
  },
  checkMiniBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
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
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderWidth: 1,
    borderColor: '#FCE7EB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  vendorThumbImg: {
    width: 78,
    height: 78,
    borderRadius: 10,
    marginRight: 12,
  },
  vendorDetailsCol: {
    flex: 1,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1B1F',
    marginLeft: 3,
  },
  reviewsText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 11,
    color: '#475569',
    marginLeft: 3,
  },
  viewProfileBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  viewProfileBtnText: {
    fontSize: 11,
    color: '#D81B60',
    fontWeight: '600',
  },
  vendorActionsCol: {
    gap: 8,
    marginLeft: 8,
  },
  actionCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmedBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderWidth: 1,
    borderColor: '#FCE7EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  popperIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  popperEmoji: {
    fontSize: 22,
  },
  confirmedTextCol: {
    flex: 1,
  },
  confirmedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 3,
  },
  confirmedSubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  detailLabelCol: {
    width: 90,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1B1F',
    marginTop: 2,
  },
  detailValueCol: {
    flex: 1,
    paddingRight: 6,
  },
  detailValueText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    fontWeight: '500',
  },
  addToCalendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E53E3E',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  addToCalendarText: {
    fontSize: 10,
    color: '#E53E3E',
    fontWeight: '600',
  },
  getDirectionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F4',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  getDirectionsText: {
    fontSize: 10,
    color: '#E53E3E',
    fontWeight: '600',
  },
  beforeMeetingSection: {
    marginBottom: 16,
  },
  beforeMeetingHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 12,
  },
  tipsGridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipCard: {
    flex: 1,
    backgroundColor: '#FFF7F8',
    borderWidth: 1,
    borderColor: '#FCE7EB',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 125,
  },
  tipIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1B1F',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 14,
  },
  tipCardSubtitle: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 12,
  },
  meetingTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  infoIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  meetingTipTextCol: {
    flex: 1,
  },
  meetingTipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  meetingTipSubtitle: {
    fontSize: 11,
    color: '#3B82F6',
    lineHeight: 15,
  },
  negotiateCtaBtn: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1.2,
    borderColor: '#FECDD3',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  negotiateCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  negotiateIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  negotiateCtaTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#D81B60',
  },
  negotiateCtaSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E53E3E',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rescheduleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E53E3E',
  },
  cancelMeetingBtn: {
    flex: 1,
    flexDirection: 'row',
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
  cancelMeetingBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
