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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { Assets } from '../constants/assets';

interface ScheduleMeetingScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const ScheduleMeetingScreen: React.FC<ScheduleMeetingScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  // Meeting Form State
  const [selectedDate, setSelectedDate] = useState('16 September 2026 (Wednesday)');
  const [selectedTime, setSelectedTime] = useState('10:00 AM – 11:00 AM');
  const [meetingType, setMeetingType] = useState<'in_person' | 'video' | 'phone'>('in_person');
  const [location, setLocation] = useState(
    '301, Shekhar Central, MG Road, Indore, Madhya Pradesh 452001'
  );
  const [meetingPurpose, setMeetingPurpose] = useState(
    'Discuss decoration, pricing and customization for wedding event'
  );

  const datesList = [
    { label: 'Today', dateStr: '15 Sep 2026', day: 'Tuesday' },
    { label: 'Tomorrow', dateStr: '16 Sep 2026', day: 'Wednesday', full: '16 September 2026 (Wednesday)' },
    { label: 'Thu, 17 Sep', dateStr: '17 Sep 2026', day: 'Thursday', full: '17 September 2026 (Thursday)' },
    { label: 'Fri, 18 Sep', dateStr: '18 Sep 2026', day: 'Friday', full: '18 September 2026 (Friday)' },
    { label: 'Sat, 19 Sep', dateStr: '19 Sep 2026', day: 'Saturday', full: '19 September 2026 (Saturday)' },
  ];

  const timeSlots = [
    '10:00 AM – 11:00 AM',
    '11:30 AM – 12:30 PM',
    '02:00 PM – 03:00 PM',
    '04:30 PM – 05:30 PM',
    '06:00 PM – 07:00 PM',
  ];

  const purposeSuggestions = [
    'Decoration & Themes',
    'Pricing & Quotation',
    'Custom Packages',
    'Venue Walkthrough',
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ChatMain');
    }
  };

  const handleConfirmMeeting = () => {
    if (!meetingPurpose.trim()) {
      Alert.alert('Missing Purpose', 'Please enter a brief purpose for the meeting.');
      return;
    }

    // Navigate to Meeting Scheduled screen with meeting details
    if (navigation?.navigate) {
      navigation.navigate('MeetingScheduled', {
        meetingDetails: {
          date: selectedDate,
          time: selectedTime,
          type:
            meetingType === 'in_person'
              ? 'In-Person Meeting'
              : meetingType === 'video'
              ? 'Video Call Meeting'
              : 'Phone Call Meeting',
          location:
            meetingType === 'in_person'
              ? location
              : meetingType === 'video'
              ? 'Google Meet / Zoom (Link will be shared)'
              : '+91 97133 32997',
          purpose: meetingPurpose,
        },
      });
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
              Schedule <Text style={styles.screenTitleHighlight}>Meeting</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Select date and time with the vendor
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
        {/* Vendor Header Card */}
        <View style={styles.vendorCard}>
          <Image
            source={Assets.weddingMandapArt}
            style={styles.vendorThumbImg}
            resizeMode="cover"
          />
          <View style={styles.vendorDetailsCol}>
            <Text style={styles.vendorName}>Royal Events & Decor</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.reviewsText}>(320 reviews)</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color="#D81B60" />
              <Text style={styles.locationText}>Indore, Madhya Pradesh</Text>
            </View>
          </View>
        </View>

        {/* 1. Select Date */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScroll}
          >
            {datesList.map((item) => {
              const isSelected =
                selectedDate === (item.full || `${item.dateStr} (${item.day})`);
              return (
                <TouchableOpacity
                  key={item.dateStr}
                  style={[
                    styles.dateTile,
                    isSelected && styles.dateTileActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() =>
                    setSelectedDate(item.full || `${item.dateStr} (${item.day})`)
                  }
                >
                  <Text
                    style={[
                      styles.dateTileLabel,
                      isSelected && styles.dateTileLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.dateTileNum,
                      isSelected && styles.dateTileNumActive,
                    ]}
                  >
                    {item.dateStr.split(' ')[0]}
                  </Text>
                  <Text
                    style={[
                      styles.dateTileMonth,
                      isSelected && styles.dateTileMonthActive,
                    ]}
                  >
                    {item.dateStr.split(' ')[1]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. Select Time Slot */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.timeSlotsWrap}>
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeChip,
                    isSelected && styles.timeChipActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color={isSelected ? '#D81B60' : '#475569'}
                    style={{ marginRight: 6 }}
                  />
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

        {/* 3. Meeting Type */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Meeting Type</Text>
          <View style={styles.meetingTypeRow}>
            {[
              { id: 'in_person', label: 'In-Person', icon: 'people-outline' },
              { id: 'video', label: 'Video Call', icon: 'videocam-outline' },
              { id: 'phone', label: 'Phone Call', icon: 'call-outline' },
            ].map((type) => {
              const isSelected = meetingType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeOptionCard,
                    isSelected && styles.typeOptionCardActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setMeetingType(type.id as any)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={20}
                    color={isSelected ? '#D81B60' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.typeOptionLabel,
                      isSelected && styles.typeOptionLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Location / Meeting Address */}
        {meetingType === 'in_person' && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Meeting Location</Text>
            <View style={styles.locationInputBox}>
              <Ionicons name="location-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.locationTextInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter meeting venue or address"
                placeholderTextColor="#94A3B8"
                multiline
              />
            </View>
          </View>
        )}

        {/* 5. Meeting Purpose / Note */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Meeting Purpose & Notes</Text>
          <View style={styles.purposeBox}>
            <TextInput
              style={styles.purposeInput}
              value={meetingPurpose}
              onChangeText={setMeetingPurpose}
              placeholder="What would you like to discuss with the vendor?"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Quick Suggestions */}
          <View style={styles.suggestionsWrap}>
            {purposeSuggestions.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.suggestionChip}
                onPress={() =>
                  setMeetingPurpose((prev) =>
                    prev.includes(item) ? prev : `${prev} | ${item}`
                  )
                }
              >
                <Text style={styles.suggestionChipText}>+ {item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Confirm Meeting Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.85}
          onPress={handleConfirmMeeting}
        >
          <Text style={styles.confirmButtonText}>Confirm Meeting</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  vendorThumbImg: {
    width: 64,
    height: 64,
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
    marginTop: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1B1F',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 3,
  },
  sectionBox: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 10,
  },
  datesScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTile: {
    width: 80,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTileActive: {
    borderColor: '#D81B60',
    backgroundColor: '#FFF1F4',
  },
  dateTileLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  dateTileLabelActive: {
    color: '#D81B60',
    fontWeight: '700',
  },
  dateTileNum: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1B1F',
    marginVertical: 2,
  },
  dateTileNumActive: {
    color: '#D81B60',
  },
  dateTileMonth: {
    fontSize: 11,
    color: '#64748B',
  },
  dateTileMonthActive: {
    color: '#D81B60',
    fontWeight: '600',
  },
  timeSlotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeChipActive: {
    borderColor: '#D81B60',
    backgroundColor: '#FFF1F4',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  timeChipTextActive: {
    color: '#D81B60',
    fontWeight: '700',
  },
  meetingTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOptionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  typeOptionCardActive: {
    borderColor: '#D81B60',
    backgroundColor: '#FFF1F4',
  },
  typeOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6,
  },
  typeOptionLabelActive: {
    color: '#D81B60',
  },
  locationInputBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  inputIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#1C1B1F',
    lineHeight: 18,
    padding: 0,
  },
  purposeBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    minHeight: 70,
  },
  purposeInput: {
    fontSize: 13,
    color: '#1C1B1F',
    lineHeight: 18,
    padding: 0,
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  suggestionChip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  suggestionChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#D81B60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
