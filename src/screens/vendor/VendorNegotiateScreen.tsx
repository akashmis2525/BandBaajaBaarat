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
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalDialog } from '../../components/RoyalDialog';
import { api } from '../../services/api';

interface VendorNegotiateProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const VendorNegotiateScreen: React.FC<VendorNegotiateProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const customerName = route?.params?.customerName || 'Rahul Verma & Priya Jain';
  const initialQuotation = route?.params?.quotationAmount || 85000;

  const [counterOfferAmount, setCounterOfferAmount] = useState('75000');
  const [vendorAgreed, setVendorAgreed] = useState(false);

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

  const handleAgreePrice = () => {
    const agreed = parseInt(counterOfferAmount, 10);
    const persist = () => {
      setVendorAgreed(true);
      showDialog({
        type: 'success',
        title: 'Deal Agreed & Locked! 🤝',
        message: `You have accepted ₹${agreed.toLocaleString('en-IN')} with ${customerName}. Booking contract is locked for advance payment.`,
        confirmText: 'View Active Bookings',
        highlightText: '🔒 ₹25,000 token advance required from couple',
        onConfirm: () => {
          hideDialog();
          if (navigation?.navigate) {
            navigation.navigate('VendorBookings');
          }
        },
      });
    };
    const negotiationId = route?.params?.negotiationId;
    const customerId = route?.params?.customerId;
    if (negotiationId) {
      api.agreeNegotiation(negotiationId, agreed).then(persist).catch(() => persist());
      return;
    }
    if (customerId) {
      api
        .createNegotiation({
          customerId,
          originalAmount: initialQuotation,
          counterOfferAmount: agreed,
        })
        .then((res) => {
          const id = res.negotiation?._id;
          if (id) return api.agreeNegotiation(id, agreed);
        })
        .then(persist)
        .catch(() => persist());
      return;
    }
    persist();
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
            Price <Text style={styles.screenTitleHighlight}>Negotiation</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Live bargaining stream with {customerName}
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="pricetag" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Live</Text>
            <Text style={styles.decorativeLine2}>Deal</Text>
            <Text style={styles.decorativeLine3}>Counter ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Deal Overview Card */}
        <View style={styles.dealCard}>
          <View style={styles.dealHeaderRow}>
            <Text style={styles.dealTitle}>Wedding Mandap & Decor Package</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE NEGOTIATION</Text>
            </View>
          </View>

          <View style={styles.dealComparisonRow}>
            <View style={styles.dealCol}>
              <Text style={styles.dealColLabel}>Your Initial Quote</Text>
              <Text style={styles.dealColInitial}>₹ {initialQuotation.toLocaleString('en-IN')}</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#94A3B8" />
            <View style={styles.dealCol}>
              <Text style={styles.dealColLabel}>Customer Counter Offer</Text>
              <Text style={styles.dealColCounter}>₹ 75,000</Text>
            </View>
          </View>
        </View>

        {/* Chat / Negotiation Log */}
        <Text style={styles.chatSectionTitle}>Bargaining Stream</Text>

        <View style={styles.chatStream}>
          {/* Vendor message */}
          <View style={styles.vendorMsgBox}>
            <Text style={styles.msgSender}>You (Royal Events & Decor)</Text>
            <Text style={styles.msgText}>
              Namaste Rahul ji, we sent the complete quotation of ₹85,000 with grand carved mandap, entry arch, lighting canopy & welcome board.
            </Text>
            <Text style={styles.msgTime}>10:15 AM</Text>
          </View>

          {/* Customer counter */}
          <View style={styles.customerMsgBox}>
            <Text style={styles.customerSender}>Rahul Verma (Customer)</Text>
            <Text style={styles.msgText}>
              We loved your portfolio! Our family budget is strictly ₹75,000 for decor. If you can do it in ₹75,000, we are ready to pay ₹25,000 token advance right now.
            </Text>
            <View style={styles.counterPill}>
              <Text style={styles.counterPillText}>Proposed Budget: ₹75,000</Text>
            </View>
            <Text style={styles.msgTime}>10:22 AM</Text>
          </View>
        </View>

        {/* Final Agreement Action Card */}
        <View style={styles.agreementCard}>
          <Text style={styles.agreementHeading}>Ready to Close this Wedding?</Text>
          <Text style={styles.agreementSub}>
            Accepting ₹75,000 locks the booking and triggers immediate ₹25,000 advance payment from the customer.
          </Text>

          <View style={styles.agreedAmountRow}>
            <Text style={styles.agreedAmountLabel}>Final Agreed Price:</Text>
            <Text style={styles.agreedAmountVal}>₹ 75,000</Text>
          </View>

          <TouchableOpacity
            style={[styles.agreeBtn, vendorAgreed && styles.agreeBtnActive]}
            activeOpacity={0.88}
            onPress={handleAgreePrice}
          >
            <Ionicons
              name={vendorAgreed ? 'checkmark-circle' : 'hand-left'}
              size={17}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.agreeBtnText}>
              {vendorAgreed ? 'Agreed & Locked (₹75,000) ✓' : 'Accept Counter-Offer (₹75,000)'}
            </Text>
          </TouchableOpacity>
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

  dealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
  },
  dealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dealTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  dealComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  dealCol: {
    alignItems: 'center',
  },
  dealColLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 2,
  },
  dealColInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  dealColCounter: {
    fontSize: 16,
    fontWeight: '900',
    color: '#16A34A',
  },

  chatSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  chatStream: {
    gap: 12,
    marginBottom: 16,
  },
  vendorMsgBox: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 14,
    padding: 12,
    alignSelf: 'flex-end',
    maxWidth: '90%',
  },
  msgSender: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#8A072D',
    marginBottom: 2,
  },
  customerMsgBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  customerSender: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  msgText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  counterPill: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  counterPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803D',
  },
  msgTime: {
    fontSize: 9.5,
    color: '#94A3B8',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  agreementCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    padding: 14,
    backgroundColor: '#F0FDF4',
  },
  agreementHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  agreementSub: {
    fontSize: 11,
    color: '#15803D',
    lineHeight: 15,
    marginBottom: 10,
  },
  agreedAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  agreedAmountLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  agreedAmountVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#16A34A',
  },
  agreeBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  agreeBtnActive: {
    backgroundColor: '#15803D',
  },
  agreeBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
