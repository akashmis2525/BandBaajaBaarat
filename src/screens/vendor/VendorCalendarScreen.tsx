import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VendorCalendarProps {
  navigation?: any;
  onBack?: () => void;
}

export const VendorCalendarScreen: React.FC<VendorCalendarProps> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedMonth, setSelectedMonth] = useState('November 2026');
  const [blockedDates, setBlockedDates] = useState<number[]>([12, 25, 26]);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleToggleDate = (day: number) => {
    if (blockedDates.includes(day)) {
      setBlockedDates(blockedDates.filter((d) => d !== day));
      Alert.alert('Date Unblocked', `Nov ${day}, 2026 is now marked as AVAILABLE for inquiries.`);
    } else {
      setBlockedDates([...blockedDates, day]);
      Alert.alert('Date Blocked 🔒', `Nov ${day}, 2026 is now BLOCKED. Couples will see you as booked.`);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboard');
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
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Availability <Text style={styles.screenTitleHighlight}>Calendar</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Block dates to prevent double-booking during peak muhurat
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="today" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Wedding</Text>
            <Text style={styles.decorativeLine2}>Dates</Text>
            <Text style={styles.decorativeLine3}>Schedule ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Selector */}
        <View style={styles.monthHeaderRow}>
          <TouchableOpacity style={styles.monthArrowBtn}>
            <Ionicons name="chevron-back" size={18} color="#8A072D" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{selectedMonth}</Text>
          <TouchableOpacity style={styles.monthArrowBtn}>
            <Ionicons name="chevron-forward" size={18} color="#8A072D" />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Available (Open)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E5093A' }]} />
            <Text style={styles.legendText}>Booked / Blocked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Peak Muhurat</Text>
          </View>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarCard}>
          {/* Weekday headers */}
          <View style={styles.weekdayRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <Text key={idx} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {daysInMonth.map((day) => {
              const isBlocked = blockedDates.includes(day);
              const isPeak = day === 25 || day === 26 || day === 12;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isBlocked && styles.dayCellBlocked,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleToggleDate(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isBlocked && styles.dayTextBlocked,
                    ]}
                  >
                    {day}
                  </Text>
                  {isBlocked ? (
                    <View style={styles.blockedBadge}>
                      <Ionicons name="lock-closed" size={8} color="#FFFFFF" />
                    </View>
                  ) : isPeak ? (
                    <View style={styles.peakDot} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Booked Events on Calendar */}
        <Text style={styles.sectionTitle}>Confirmed Bookings This Month</Text>

        <View style={styles.eventsList}>
          <View style={styles.eventItemCard}>
            <View style={styles.eventDateBadge}>
              <Text style={styles.eventDateDay}>25</Text>
              <Text style={styles.eventDateMonth}>NOV</Text>
            </View>
            <View style={styles.eventInfoCol}>
              <Text style={styles.eventTitle}>Rahul & Priya's Wedding</Text>
              <Text style={styles.eventVenue}>Royal Greens, Indore • ₹75,000</Text>
              <Text style={styles.eventTiming}>Full Day Mandap & Stage Decor</Text>
            </View>
            <View style={styles.confirmedPill}>
              <Text style={styles.confirmedPillText}>CONFIRMED</Text>
            </View>
          </View>

          <View style={styles.eventItemCard}>
            <View style={[styles.eventDateBadge, { backgroundColor: '#F1F5F9' }]}>
              <Text style={[styles.eventDateDay, { color: '#0F172A' }]}>12</Text>
              <Text style={styles.eventDateMonth}>NOV</Text>
            </View>
            <View style={styles.eventInfoCol}>
              <Text style={styles.eventTitle}>Sangeet Stage Lighting</Text>
              <Text style={styles.eventVenue}>Brilliant Convention Centre • ₹45,000</Text>
              <Text style={styles.eventTiming}>Evening 5:00 PM – 11:30 PM</Text>
            </View>
            <View style={styles.confirmedPill}>
              <Text style={styles.confirmedPillText}>CONFIRMED</Text>
            </View>
          </View>
        </View>

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

  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  monthArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayCellBlocked: {
    backgroundColor: '#8A072D',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  dayTextBlocked: {
    color: '#FFFFFF',
  },
  blockedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  peakDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  eventsList: {
    gap: 10,
  },
  eventItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eventDateBadge: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  eventDateDay: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8A072D',
  },
  eventDateMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A072D',
  },
  eventInfoCol: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  eventVenue: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
    marginTop: 1,
  },
  eventTiming: {
    fontSize: 10.5,
    color: '#64748B',
  },
  confirmedPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  confirmedPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
});
