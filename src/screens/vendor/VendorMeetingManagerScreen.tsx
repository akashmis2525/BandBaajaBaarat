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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalDialog } from '../../components/RoyalDialog';
import { api, ApiMeeting } from '../../services/api';

interface VendorMeetingManagerProps {
  navigation?: any;
  onBack?: () => void;
}

interface MeetingRequest {
  id: string;
  customerName: string;
  phone: string;
  meetingDate: string;
  meetingTime: string;
  meetingLocation: string;
  eventType: string;
  status: 'pending' | 'confirmed' | 'rescheduled';
  notes: string;
}

export const VendorMeetingManagerScreen: React.FC<VendorMeetingManagerProps> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);

  React.useEffect(() => {
    api
      .meetings()
      .then((res) => {
        setMeetingRequests(
          res.items.map((m: ApiMeeting) => ({
            id: m._id,
            customerName: m.customerName,
            phone: m.phone,
            meetingDate: m.meetingDate,
            meetingTime: m.meetingTime,
            meetingLocation: m.meetingLocation,
            eventType: m.eventType,
            status: m.status === 'cancelled' || m.status === 'completed' ? 'confirmed' : m.status,
            notes: m.notes,
          })),
        );
      })
      .catch(() => undefined);
  }, []);

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
      navigation?.navigate('VendorDashboard');
    }
  };

  const handleAcceptMeeting = (id: string, customerName: string) => {
    setMeetingRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'confirmed' } : m))
    );
    showDialog({
      type: 'success',
      title: 'Meeting Confirmed! 🤝',
      message: `Consultation appointment with ${customerName} has been locked on your calendar. Customer has been notified.`,
      confirmText: 'Done',
      highlightText: '📍 Reminder scheduled 1 hour before meeting',
      onConfirm: hideDialog,
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
            Meeting <Text style={styles.screenTitleHighlight}>Requests</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Manage face-to-face and venue appointments with couples
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="calendar" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Client</Text>
            <Text style={styles.decorativeLine2}>Meetings</Text>
            <Text style={styles.decorativeLine3}>Schedule ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerBox}>
          <View style={styles.bannerIconBox}>
            <Ionicons name="people" size={20} color="#8A072D" />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerHeading}>2 Active Appointments Scheduled</Text>
            <Text style={styles.bannerSub}>
              Confirm customer availability to lock discussions
            </Text>
          </View>
        </View>

        {/* Meetings List */}
        <View style={styles.meetingsList}>
          {meetingRequests.map((meeting) => (
            <View key={meeting.id} style={styles.meetingCard}>
              <View style={styles.meetingCardHeader}>
                <View style={styles.customerAvatarBox}>
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
                <View style={styles.customerInfoCol}>
                  <Text style={styles.customerName}>{meeting.customerName}</Text>
                  <Text style={styles.eventTypeSub}>{meeting.eventType}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    meeting.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      meeting.status === 'confirmed'
                        ? styles.statusConfirmedText
                        : styles.statusPendingText,
                    ]}
                  >
                    {meeting.status === 'confirmed' ? '✓ CONFIRMED' : '⏳ PENDING'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.meetingDetailsList}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={15} color="#8A072D" style={{ marginRight: 8 }} />
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{meeting.meetingDate}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={15} color="#8A072D" style={{ marginRight: 8 }} />
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>{meeting.meetingTime}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={15} color="#8A072D" style={{ marginRight: 8 }} />
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{meeting.meetingLocation}</Text>
                </View>
              </View>

              <View style={styles.notesBox}>
                <Text style={styles.notesText}>Note: "{meeting.notes}"</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Alert.alert('Call Customer', `Calling ${meeting.phone}...`)}
                >
                  <Ionicons name="call-outline" size={15} color="#8A072D" style={{ marginRight: 4 }} />
                  <Text style={styles.callBtnText}>Call</Text>
                </TouchableOpacity>

                {meeting.status === 'pending' ? (
                    <TouchableOpacity
                      style={styles.acceptBtn}
                      activeOpacity={0.85}
                      onPress={() => handleAcceptMeeting(meeting.id, meeting.customerName)}
                    >
                      <Ionicons name="checkmark-circle" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.acceptBtnText}>Accept Meeting</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.confirmedStateBtn}
                      onPress={() => {
                        if (navigation?.navigate) {
                          navigation.navigate('VendorCreateQuotation');
                        }
                      }}
                    >
                      <Text style={styles.confirmedStateBtnText}>Create Quotation →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>

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
    paddingBottom: 24,
  },

  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
    marginBottom: 16,
  },
  bannerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  bannerSub: {
    fontSize: 11,
    color: '#9F1239',
    marginTop: 1,
  },

  meetingsList: {
    gap: 14,
  },
  meetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  meetingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  customerInfoCol: {
    flex: 1,
  },
  customerName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  eventTypeSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusPendingText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
  },
  statusConfirmed: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusConfirmedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  meetingDetailsList: {
    gap: 6,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    width: 65,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  notesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  notesText: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A072D',
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: 10,
    paddingVertical: 9,
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  confirmedStateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 9,
  },
  confirmedStateBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
