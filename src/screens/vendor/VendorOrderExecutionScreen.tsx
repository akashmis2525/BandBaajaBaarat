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
import { api } from '../../services/api';

interface VendorOrderExecutionProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const VendorOrderExecutionScreen: React.FC<VendorOrderExecutionProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const bookingId = route?.params?.bookingId || 'BBBD126789';
  const mongoId = route?.params?.bookingMongoId || route?.params?.id;
  const customerName = route?.params?.customerName || 'Rahul Verma & Priya Jain';
  const eventTitle = route?.params?.eventTitle || 'Wedding Ceremony Mandap & Stage Setup';
  const eventDate = route?.params?.eventDate || '25 Nov 2026 (Wednesday)';
  const totalAmount = route?.params?.totalAmount || 75000;
  const advanceReceived = route?.params?.advanceReceived || 25000;
  const balanceDue = route?.params?.balanceDue || 50000;

  const [currentStep, setCurrentStep] = useState(2); // 1 to 4

  React.useEffect(() => {
    if (!mongoId || !/^[a-fA-F0-9]{24}$/.test(String(mongoId))) return;
    api
      .booking(String(mongoId))
      .then((res) => {
        if (res.booking.executionStep) setCurrentStep(res.booking.executionStep);
      })
      .catch(() => undefined);
  }, [mongoId]);

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

  const steps = [
    {
      step: 1,
      title: 'Advance Token Received (₹25,000)',
      desc: 'Customer paid advance token. Contract locked.',
      time: '16 Sep 2026, 11:30 AM',
      completed: true,
    },
    {
      step: 2,
      title: 'Staff & Decor Material Dispatched',
      desc: 'Loading trucks with pillars, flowers & lighting trusses.',
      time: '24 Nov 2026, 06:00 PM',
      completed: currentStep >= 2,
    },
    {
      step: 3,
      title: 'Setup In Progress at Venue',
      desc: 'Team installing mandap & entrance arch at Royal Greens.',
      time: '25 Nov 2026, 08:00 AM',
      completed: currentStep >= 3,
    },
    {
      step: 4,
      title: 'Event Successfully Completed & Handover',
      desc: 'Celebration concluded. Requesting remaining balance of ₹50,000.',
      time: '25 Nov 2026, 11:30 PM',
      completed: currentStep >= 4,
    },
  ];

  const handleNextStep = () => {
    if (currentStep < 4) {
      const next = currentStep + 1;
      const apply = () => {
        setCurrentStep(next);
        showDialog({
          type: 'success',
          title: 'Status Updated! 🚀',
          message: `Event execution milestone has been updated to: "${steps[next - 1].title}". Customer is tracking live on their app.`,
          confirmText: 'Continue Tracking',
          highlightText: `Step ${next} of 4 Complete`,
          onConfirm: hideDialog,
        });
      };
      if (mongoId && /^[a-fA-F0-9]{24}$/.test(String(mongoId))) {
        api.updateExecution(String(mongoId), next).then(apply).catch(() => apply());
        return;
      }
      apply();
    } else {
      showDialog({
        type: 'royal',
        title: 'Event Completed! 🎉',
        message: 'Wedding celebration has been fulfilled successfully. The remaining settlement of ₹50,000 has been credited to your wallet ledger.',
        confirmText: 'View Wallet Payouts',
        highlightText: '✓ Direct IMPS withdrawal ready',
        onConfirm: () => {
          hideDialog();
          if (navigation?.navigate) {
            navigation.navigate('VendorWalletPayout');
          }
        },
      });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorBookings');
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
            Event <Text style={styles.screenTitleHighlight}>Fulfillment</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Live order execution tracker • {bookingId}
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="construct" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Live</Text>
            <Text style={styles.decorativeLine2}>Setup</Text>
            <Text style={styles.decorativeLine3}>Status ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Header Banner */}
        <View style={styles.eventHeaderCard}>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.eventTitle}>{eventTitle}</Text>
          <Text style={styles.eventDateText}>📅 {eventDate}</Text>

          <View style={styles.amountStrip}>
            <View style={styles.amountCol}>
              <Text style={styles.amountLabel}>Total Value</Text>
              <Text style={styles.amountVal}>₹ {totalAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountCol}>
              <Text style={styles.amountLabel}>Advance Received</Text>
              <Text style={[styles.amountVal, { color: '#16A34A' }]}>
                ₹ {advanceReceived.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountCol}>
              <Text style={styles.amountLabel}>Balance Due</Text>
              <Text style={[styles.amountVal, { color: '#D97706' }]}>
                ₹ {balanceDue.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline Status */}
        <Text style={styles.timelineSectionHeading}>Event Execution Timeline</Text>

        <View style={styles.timelineCard}>
          {steps.map((item, index) => {
            const isCurrent = currentStep === item.step;
            return (
              <View key={item.step} style={styles.timelineStepRow}>
                <View style={styles.timelineIndicatorCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      item.completed ? styles.stepCircleCompleted : styles.stepCirclePending,
                      isCurrent && styles.stepCircleCurrent,
                    ]}
                  >
                    {item.completed ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.stepNum}>{item.step}</Text>
                    )}
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        item.completed ? styles.connectorCompleted : styles.connectorPending,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.stepContentCol}>
                  <Text
                    style={[
                      styles.stepTitle,
                      item.completed && styles.stepTitleCompleted,
                      isCurrent && styles.stepTitleCurrent,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.stepDesc}>{item.desc}</Text>
                  <Text style={styles.stepTime}>{item.time}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Status Update Button */}
        <TouchableOpacity
          style={styles.updateStatusBtn}
          activeOpacity={0.88}
          onPress={handleNextStep}
        >
          <Ionicons name="arrow-forward-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.updateStatusBtnText}>
            {currentStep === 4
              ? 'Request Final Payout & Settlement (₹50k)'
              : `Advance to Next Step: ${steps[currentStep]?.title || 'Done'}`}
          </Text>
        </TouchableOpacity>

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

  eventHeaderCard: {
    backgroundColor: '#8A072D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  eventTitle: {
    fontSize: 12,
    color: '#FFE4E8',
    marginTop: 2,
  },
  eventDateText: {
    fontSize: 11.5,
    color: '#FED7AA',
    fontWeight: '700',
    marginTop: 6,
  },
  amountStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  amountCol: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 10,
    color: '#FFE4E8',
  },
  amountVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  amountDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  timelineSectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  timelineStepRow: {
    flexDirection: 'row',
  },
  timelineIndicatorCol: {
    alignItems: 'center',
    width: 30,
    marginRight: 10,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleCompleted: {
    backgroundColor: '#16A34A',
  },
  stepCirclePending: {
    backgroundColor: '#E2E8F0',
  },
  stepCircleCurrent: {
    backgroundColor: '#8A072D',
    borderWidth: 2,
    borderColor: '#FECDD3',
  },
  stepNum: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  stepConnector: {
    width: 2,
    flex: 1,
    minHeight: 36,
    marginVertical: 4,
  },
  connectorCompleted: {
    backgroundColor: '#16A34A',
  },
  connectorPending: {
    backgroundColor: '#E2E8F0',
  },

  stepContentCol: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  stepTitleCompleted: {
    color: '#0F172A',
  },
  stepTitleCurrent: {
    color: '#8A072D',
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  stepTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },

  updateStatusBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  updateStatusBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
