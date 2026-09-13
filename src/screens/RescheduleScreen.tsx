import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

interface RescheduleScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const RescheduleScreen: React.FC<RescheduleScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(15);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = November
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedTime, setSelectedTime] = useState('5:00 PM');
  const [reasonText, setReasonText] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar dates matrix for Nov 2026 (starts on Sunday Nov 1)
  const calendarDays = [
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
    { day: 4, isCurrentMonth: false },
    { day: 5, isCurrentMonth: false },
  ];

  const timeSlots = [
    '9:00 AM',
    '11:00 AM',
    '1:00 PM',
    '3:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
  ];

  const getDayName = (day: number) => {
    const d = new Date(currentYear, currentMonthIndex, day);
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      d.getDay()
    ];
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('BookingDetails');
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Reschedule Request Submitted! 🎉',
      `Your request to reschedule to ${selectedDay} ${months[currentMonthIndex]} ${currentYear} (${selectedTime}) has been sent to Royal Beats Dhol Group for confirmation.\n\nYou will receive an SMS and WhatsApp notification once confirmed.`,
      [
        {
          text: 'View Bookings',
          onPress: () => navigation?.navigate('BookingsList'),
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
                ? insets.top + 4
                : 20,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Reschedule <Text style={styles.headerTitleMaroon}>Booking</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Choose a new date and time for your event</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Flexible</Text>
          <Text style={styles.scriptBadgeMid}>For Your</Text>
          <Text style={styles.scriptBadgeBot}>Special Day ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Vendor Snapshot Card */}
        <View style={styles.vendorCard}>
          <View style={styles.cardImgWrapper}>
            <Image source={Assets.serviceBrassBand} style={styles.cardImg} />
            <View style={styles.photoCountBadge}>
              <Ionicons name="camera-outline" size={10} color="#FFFFFF" />
              <Text style={styles.photoCountText}>5 Photos</Text>
            </View>
          </View>

          <View style={styles.cardDetailsCol}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>Dhol Services</Text>
            </View>

            <Text style={styles.vendorHeading} numberOfLines={1}>
              Royal Beats Dhol Group
            </Text>

            <View style={styles.ratingAndExpRow}>
              <Ionicons name="star" size={11} color="#E59819" />
              <Text style={styles.ratingScore}>4.6</Text>
              <Text style={styles.reviewsCountText}>(210 reviews)</Text>
              <Text style={styles.dividerPipe}>|</Text>
              <Text style={styles.expText}>5+ Years</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>15 Nov 2026, Sunday</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>5:00 PM - 9:00 PM (4 Hours)</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={11.5} color="#8A072D" />
              <Text style={styles.metaText} numberOfLines={1}>
                Indore, Madhya Pradesh
              </Text>
            </View>
          </View>
        </View>

        {/* Select New Date Card */}
        <View style={styles.sectionCard}>
          {/* Header & Month Selector */}
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Select New Date</Text>

            <View style={styles.monthNavRow}>
              <Text style={styles.monthNavText}>
                {months[currentMonthIndex]} {currentYear}
              </Text>
              <TouchableOpacity
                style={styles.navArrowBtn}
                onPress={() => {
                  if (currentMonthIndex > 0) {
                    setCurrentMonthIndex(currentMonthIndex - 1);
                  }
                }}
              >
                <Ionicons name="chevron-back" size={14} color="#8A072D" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navArrowBtn}
                onPress={() => {
                  if (currentMonthIndex < 11) {
                    setCurrentMonthIndex(currentMonthIndex + 1);
                  }
                }}
              >
                <Ionicons name="chevron-forward" size={14} color="#8A072D" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Days of Week Header */}
          <View style={styles.weekDaysRow}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Dates Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => {
              const isSelected = item.isCurrentMonth && item.day === selectedDay;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                  ]}
                  activeOpacity={0.8}
                  disabled={!item.isCurrentMonth}
                  onPress={() => {
                    if (item.isCurrentMonth) {
                      setSelectedDay(item.day);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      !item.isCurrentMonth && styles.dayCellTextMuted,
                      isSelected && styles.dayCellTextSelected,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Date Callout */}
          <View style={styles.selectedDateBanner}>
            <Ionicons name="calendar" size={18} color="#8A072D" />
            <View style={styles.selectedDateTextCol}>
              <Text style={styles.selectedDateLabel}>Selected Date</Text>
              <Text style={styles.selectedDateVal}>
                {selectedDay} {months[currentMonthIndex]} {currentYear}, {getDayName(selectedDay)}
              </Text>
            </View>
          </View>
        </View>

        {/* Select New Time Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Text style={styles.sectionTitle}>Select New Time</Text>
            <Text style={styles.durationHint}>
              Event Duration: <Text style={styles.durationHintBold}>4 Hours</Text>
            </Text>
          </View>

          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.timeChip, isSelected && styles.timeChipActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      isSelected && styles.timeChipTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reason for Rescheduling Input */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reason for Rescheduling (Optional)</Text>

          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Tell us the reason..."
              placeholderTextColor="#A08C90"
              multiline
              numberOfLines={3}
              maxLength={200}
              value={reasonText}
              onChangeText={setReasonText}
              textAlignVertical="top"
            />
            <Text style={styles.charCountText}>{reasonText.length}/200</Text>
          </View>
        </View>

        {/* Note Callout */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={20} color="#8A072D" />
          <View style={styles.noteTextCol}>
            <Text style={styles.noteTitle}>Note:</Text>
            <Text style={styles.noteBody}>
              Your reschedule request will be sent to the vendor for confirmation. You will be
              notified once it's confirmed.
            </Text>
          </View>
        </View>

        {/* Request Reschedule Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>Request Reschedule</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>

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
    fontSize: 9,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 11,
  },
  scriptBadgeMid: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeBot: {
    fontSize: 9,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 11,
  },

  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // Vendor Card
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardImgWrapper: {
    width: 100,
    height: 118,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FDECE6',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '600',
  },
  cardDetailsCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTagText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  vendorHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
    marginTop: 2,
  },
  ratingAndExpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsCountText: {
    fontSize: 9,
    color: '#736064',
  },
  dividerPipe: {
    fontSize: 9,
    color: '#CBB2A9',
    marginHorizontal: 2,
  },
  expText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#554246',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 9.5,
    color: '#554246',
    flex: 1,
  },

  // Section Card
  sectionCard: {
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
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthNavText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
  },
  navArrowBtn: {
    padding: 3,
  },

  // Calendar
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F6EAE4',
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: '#736064',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  dayCell: {
    width: '14.28%',
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: '#8A072D',
    borderRadius: 17,
  },
  dayCellText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A040A',
  },
  dayCellTextMuted: {
    color: '#CBB8BE',
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Selected Date Banner
  selectedDateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1EC',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F7D7CA',
  },
  selectedDateTextCol: {
    flex: 1,
  },
  selectedDateLabel: {
    fontSize: 9,
    color: '#736064',
  },
  selectedDateVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A072D',
    marginTop: 1,
  },

  // Time Slots
  durationHint: {
    fontSize: 10,
    color: '#736064',
  },
  durationHintBold: {
    color: '#8A072D',
    fontWeight: '800',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  timeChip: {
    width: '23%',
    backgroundColor: '#FDF1EC',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F7D7CA',
  },
  timeChipActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  timeChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  timeChipTextActive: {
    color: '#FFFFFF',
  },

  // Reason Input
  textInputWrapper: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 10,
    backgroundColor: '#FCFAF9',
    padding: 10,
  },
  textInput: {
    fontSize: 11,
    color: '#1A040A',
    minHeight: 50,
  },
  charCountText: {
    alignSelf: 'flex-end',
    fontSize: 9,
    color: '#9C888D',
    marginTop: 4,
  },

  // Note Box
  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#FDF1EC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F7D7CA',
    padding: 12,
    gap: 10,
    alignItems: 'flex-start',
  },
  noteTextCol: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A072D',
    marginBottom: 2,
  },
  noteBody: {
    fontSize: 10,
    color: '#554246',
    lineHeight: 14,
  },

  // Submit Button
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
