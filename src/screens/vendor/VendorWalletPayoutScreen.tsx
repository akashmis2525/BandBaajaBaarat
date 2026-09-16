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

interface VendorWalletPayoutProps {
  navigation?: any;
  onBack?: () => void;
}

export const VendorWalletPayoutScreen: React.FC<VendorWalletPayoutProps> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const [availableBalance, setAvailableBalance] = useState(71250);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

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

  const transactions = [
    {
      id: 'TX1',
      bookingId: 'BBBD126789',
      title: 'Advance Token — Rahul & Priya Wedding',
      date: '16 Sep 2026, 11:30 AM',
      grossAmount: 25000,
      commission: 1250, // 5% platform fee
      netAmount: 23750,
      status: 'credit',
    },
    {
      id: 'TX2',
      bookingId: 'BBBD126750',
      title: 'Advance Token — Sangeet Stage Lighting',
      date: '12 Sep 2026, 04:15 PM',
      grossAmount: 15000,
      commission: 750,
      netAmount: 14250,
      status: 'credit',
    },
    {
      id: 'TX3',
      bookingId: 'BBBD126500',
      title: 'Final Settlement — Kapoor Family Reception',
      date: '28 Aug 2026, 08:45 PM',
      grossAmount: 35000,
      commission: 1750,
      netAmount: 33250,
      status: 'credit',
    },
  ];

  const handleWithdrawAll = () => {
    if (availableBalance <= 0) {
      showDialog({
        type: 'warning',
        title: 'Zero Balance',
        message: 'You currently do not have any available balance to withdraw.',
        confirmText: 'Understood',
        onConfirm: hideDialog,
      });
      return;
    }

    showDialog({
      type: 'royal',
      title: 'Confirm IMPS Transfer 💸',
      message: `Transfer ₹${availableBalance.toLocaleString('en-IN')} directly to your verified HDFC Bank A/C **** 7812?`,
      confirmText: 'Confirm & Transfer',
      cancelText: 'Cancel',
      highlightText: '⚡ Instant IMPS settlement • 0% transfer charge',
      onCancel: hideDialog,
      onConfirm: () => {
        setIsProcessingWithdrawal(true);
        setTimeout(() => {
          setIsProcessingWithdrawal(false);
          const transferredAmount = availableBalance;
          setAvailableBalance(0);
          showDialog({
            type: 'success',
            title: 'Payout Initiated! 🎉',
            message: `₹${transferredAmount.toLocaleString('en-IN')} has been transferred to your HDFC Bank account successfully.`,
            confirmText: 'Great!',
            highlightText: `Reference ID: IMPS${Date.now().toString().slice(-8)}`,
            onConfirm: hideDialog,
          });
        }, 600);
      },
    });
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
            Wallet & <Text style={styles.screenTitleHighlight}>Payouts</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Direct settlements to verified bank account
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="wallet" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Bank</Text>
            <Text style={styles.decorativeLine2}>Payouts</Text>
            <Text style={styles.decorativeLine3}>Direct ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Balance Hero Card */}
        <View style={styles.balanceHeroCard}>
          <Text style={styles.balanceHeroSub}>Available for Instant Withdrawal</Text>
          <Text style={styles.balanceHeroAmount}>₹ {availableBalance.toLocaleString('en-IN')}</Text>

          {/* Bank Destination Strip */}
          <View style={styles.bankDestinationBox}>
            <View style={styles.bankIconCircle}>
              <Ionicons name="business" size={16} color="#8A072D" />
            </View>
            <View style={styles.bankInfoCol}>
              <Text style={styles.bankNameText}>HDFC Bank • Savings A/C</Text>
              <Text style={styles.bankNumberText}>Account: **** **** 7812 • IFSC: HDFC0001234</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color="#15803D" />
          </View>

          <TouchableOpacity
            style={[styles.withdrawHeroBtn, availableBalance === 0 && styles.withdrawHeroBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleWithdrawAll}
            disabled={availableBalance === 0 || isProcessingWithdrawal}
          >
            <Ionicons name="arrow-down-circle" size={18} color="#8A072D" style={{ marginRight: 6 }} />
            <Text style={styles.withdrawHeroBtnText}>
              {isProcessingWithdrawal
                ? 'Processing IMPS Transfer...'
                : availableBalance === 0
                ? 'No Balance to Withdraw'
                : 'Withdraw ₹' + availableBalance.toLocaleString('en-IN') + ' to Bank'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₹ 2,45,000</Text>
            <Text style={styles.statLabel}>Lifetime Gross</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#16A34A' }]}>₹ 2,32,750</Text>
            <Text style={styles.statLabel}>Net Settled (95%)</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#E11D48' }]}>₹ 12,250</Text>
            <Text style={styles.statLabel}>Platform Fee (5%)</Text>
          </View>
        </View>

        {/* Transaction History */}
        <Text style={styles.historyHeading}>Settlement History</Text>

        <View style={styles.txList}>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txTopRow}>
                <View style={styles.txIconBox}>
                  <Ionicons name="arrow-down" size={16} color="#16A34A" />
                </View>
                <View style={styles.txTextCol}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txDate}>{tx.date} • {tx.bookingId}</Text>
                </View>
                <View style={styles.txAmountCol}>
                  <Text style={styles.txNetAmount}>+ ₹{tx.netAmount.toLocaleString('en-IN')}</Text>
                  <Text style={styles.txFeeText}>Fee: -₹{tx.commission}</Text>
                </View>
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

  balanceHeroCard: {
    backgroundColor: '#8A072D',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  balanceHeroSub: {
    fontSize: 11.5,
    color: '#FFE4E8',
    fontWeight: '600',
  },
  balanceHeroAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    marginBottom: 12,
  },
  bankDestinationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  bankIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bankInfoCol: {
    flex: 1,
  },
  bankNameText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bankNumberText: {
    fontSize: 10.5,
    color: '#FFE4E8',
    marginTop: 1,
  },
  withdrawHeroBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  withdrawHeroBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  withdrawHeroBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statVal: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  historyHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  txList: {
    gap: 10,
  },
  txCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  txTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  txTextCol: {
    flex: 1,
  },
  txTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  txDate: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txNetAmount: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  txFeeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
