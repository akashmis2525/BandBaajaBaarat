import React, { useState } from 'react';
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
  Share,
  Modal,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';

interface InvoicePaymentScreenProps {
  route?: any;
  navigation?: any;
  onBack?: () => void;
}

export const InvoicePaymentScreen: React.FC<InvoicePaymentScreenProps> = ({
  route,
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paidAmount, setPaidAmount] = useState(25000);
  const [remainingAmount, setRemainingAmount] = useState(50000);
  const [isPaymentSuccessModalVisible, setIsPaymentSuccessModalVisible] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: '1',
      date: '16 Sep 2026',
      mode: 'UPI (PhonePe)',
      amount: 25000,
      status: 'Paid',
      txnId: 'TXN12345678',
    },
  ]);

  const bookingId = route?.params?.bookingId || 'BBBD126789';
  const vendorName = route?.params?.vendorName || 'Royal Events & Decor';
  const totalAmount = 75000;

  const invoiceItems = [
    { id: '1', name: 'Stage Decoration (Premium)', qty: 1, unitPrice: 25000, amount: 25000 },
    { id: '2', name: 'Entry Gate Decoration', qty: 1, unitPrice: 12000, amount: 12000 },
    { id: '3', name: 'Flower Setup', qty: 1, unitPrice: 15000, amount: 15000 },
    { id: '4', name: 'Lighting Setup', qty: 1, unitPrice: 10000, amount: 10000 },
    { id: '5', name: 'Welcome Board', qty: 1, unitPrice: 5000, amount: 5000 },
    { id: '6', name: 'Additional Flower Stands', qty: 2, unitPrice: 4000, amount: 8000 },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      await Share.share({
        message: `📄 INVOICE & RECEIPT - Band Baaja Baarat\n\nBooking ID: ${bookingId}\nVendor: ${vendorName}\nTotal Amount: ₹75,000\nAmount Paid: ₹${paidAmount.toLocaleString('en-IN')}\nRemaining Balance: ₹${remainingAmount.toLocaleString('en-IN')}\nEvent Date: 25 Nov 2026\nStatus: Active Confirmed Booking`,
        title: `Invoice_${bookingId}.pdf`,
      });
    } catch (error) {
      Alert.alert('Invoice Download', `Invoice for Booking #${bookingId} downloaded successfully!`);
    }
  };

  const handleMakeRemainingPayment = () => {
    if (remainingAmount === 0) {
      Alert.alert('Payment Completed', 'Total amount is already fully settled for this booking.');
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate('MakePayment', {
        bookingId: bookingId,
        vendorName: vendorName,
        totalAmount: totalAmount,
        advancePaid: paidAmount,
        amount: remainingAmount,
        eventDate: '25 Nov 2026 (Wednesday)',
        guestCount: '300 - 400',
      });
    } else {
      Alert.alert('Make Payment', 'Navigating to Make Payment screen...');
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
              Invoice & <Text style={styles.screenTitleHighlight}>Payment</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Your booking invoice and payment details
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.receiptGraphicBox}>
            <Ionicons name="receipt" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Transparent</Text>
            <Text style={styles.decorativeLine2}>Pricing</Text>
            <Text style={styles.decorativeLine3}>Happier</Text>
            <Text style={styles.decorativeLine4}>Celebrations ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Header Card */}
        <View style={styles.vendorCard}>
          <View style={styles.vendorTopRow}>
            <Image
              source={Assets.weddingMandapArt || { uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' }}
              style={styles.vendorImage}
              resizeMode="cover"
            />

            <View style={styles.vendorDetailsCol}>
              <Text style={styles.vendorName} numberOfLines={1}>
                {vendorName}
              </Text>

              <View style={styles.vendorRatingRow}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.vendorRatingScore}>4.8</Text>
                <Text style={styles.vendorReviewsCount}>(320 reviews)</Text>
              </View>

              <View style={styles.vendorLocationRow}>
                <Ionicons name="location-sharp" size={12} color="#D81B60" />
                <Text style={styles.vendorLocationText} numberOfLines={1}>
                  Indore, Madhya Pradesh
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewProfileBtn}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('RateReview')}
            >
              <Text style={styles.viewProfileBtnText}>View Profile</Text>
              <Ionicons name="chevron-forward" size={13} color="#D81B60" />
            </TouchableOpacity>
          </View>

          <View style={styles.badgesRow}>
            <View style={styles.badgePill}>
              <Ionicons name="shield-checkmark" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>

            <View style={styles.badgePill}>
              <Ionicons name="trophy" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Top Rated</Text>
            </View>

            <View style={styles.badgePill}>
              <Ionicons name="headset" size={13} color="#D81B60" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>Quick Response</Text>
            </View>
          </View>
        </View>

        {/* Booking Metadata Bar (4 Pills) */}
        <View style={styles.metaPillsRow}>
          <View style={styles.metaPillItem}>
            <View style={styles.metaIconCircle}>
              <Ionicons name="document-text" size={14} color="#E53935" />
            </View>
            <View>
              <Text style={styles.metaLabel}>Booking ID</Text>
              <Text style={styles.metaValue}>{bookingId}</Text>
            </View>
          </View>

          <View style={styles.metaPillItem}>
            <View style={styles.metaIconCircle}>
              <Ionicons name="calendar" size={14} color="#E53935" />
            </View>
            <View>
              <Text style={styles.metaLabel}>Event Date</Text>
              <Text style={styles.metaValue}>25 Nov 2026 (Wed)</Text>
            </View>
          </View>

          <View style={styles.metaPillItem}>
            <View style={styles.metaIconCircle}>
              <Ionicons name="people" size={14} color="#E53935" />
            </View>
            <View>
              <Text style={styles.metaLabel}>Event Type</Text>
              <Text style={styles.metaValue} numberOfLines={1}>Wedding Ceremony</Text>
            </View>
          </View>

          <View style={styles.metaPillItem}>
            <View style={styles.metaIconCircle}>
              <Ionicons name="people-circle" size={14} color="#E53935" />
            </View>
            <View>
              <Text style={styles.metaLabel}>Guests</Text>
              <Text style={styles.metaValue}>300 - 400</Text>
            </View>
          </View>
        </View>

        {/* 1. Invoice Details Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="document-text" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Invoice Details</Text>
            </View>

            <View style={styles.statusPillsHeaderRow}>
              <View style={styles.paidHeaderPill}>
                <Text style={styles.paidHeaderPillText}>Paid  ₹ {paidAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.remainingHeaderPill}>
                <Text style={styles.remainingHeaderPillText}>Remaining  ₹ {remainingAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          {/* Invoice Table */}
          <View style={styles.invoiceTable}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeadCol, { width: 22 }]}>#</Text>
              <Text style={[styles.tableHeadCol, { flex: 2 }]}>Service Name</Text>
              <Text style={[styles.tableHeadCol, { width: 34, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.tableHeadCol, { width: 66, textAlign: 'right' }]}>Unit Price</Text>
              <Text style={[styles.tableHeadCol, { width: 68, textAlign: 'right' }]}>Amount</Text>
            </View>

            {/* Table Rows */}
            {invoiceItems.map((item) => (
              <View key={item.id} style={styles.tableBodyRow}>
                <Text style={[styles.tableBodyCol, { width: 22, color: '#64748B' }]}>{item.id}</Text>
                <Text style={[styles.tableBodyCol, { flex: 2, fontWeight: '500' }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.tableBodyCol, { width: 34, textAlign: 'center', color: '#64748B' }]}>
                  {item.qty}
                </Text>
                <Text style={[styles.tableBodyCol, { width: 66, textAlign: 'right', color: '#334155' }]}>
                  ₹ {item.unitPrice.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.tableBodyCol, { width: 68, textAlign: 'right', fontWeight: '600' }]}>
                  ₹ {item.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}

            {/* Subtotal & Discount */}
            <View style={styles.invoiceCalculationArea}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Subtotal</Text>
                <Text style={styles.calcValue}>₹ {totalAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Discount</Text>
                <Text style={[styles.calcValue, { color: '#E53935' }]}>- ₹ 0</Text>
              </View>
            </View>

            {/* Total Amount Strip */}
            <View style={styles.totalAmountStrip}>
              <Text style={styles.totalAmountLabel}>Total Amount</Text>
              <Text style={styles.totalAmountValue}>₹ {totalAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* 2. Payment History Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="card" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Payment History</Text>
            </View>

            <TouchableOpacity
              style={styles.downloadInvoiceBtn}
              activeOpacity={0.7}
              onPress={handleDownloadInvoice}
            >
              <Ionicons name="download-outline" size={13} color="#E53935" style={{ marginRight: 3 }} />
              <Text style={styles.downloadInvoiceText}>Download Invoice</Text>
            </TouchableOpacity>
          </View>

          {/* Payment History Table */}
          <View style={styles.historyTable}>
            <View style={styles.historyHeadRow}>
              <Text style={[styles.historyHeadCol, { width: 18 }]}>#</Text>
              <Text style={[styles.historyHeadCol, { width: 75 }]}>Date</Text>
              <Text style={[styles.historyHeadCol, { flex: 1.2 }]}>Payment Mode</Text>
              <Text style={[styles.historyHeadCol, { width: 65, textAlign: 'right' }]}>Amount</Text>
              <Text style={[styles.historyHeadCol, { width: 55, textAlign: 'center' }]}>Status</Text>
              <Text style={[styles.historyHeadCol, { flex: 1, textAlign: 'right' }]}>Transaction ID</Text>
            </View>

            {paymentHistory.map((item) => (
              <View key={item.id} style={styles.historyBodyRow}>
                <Text style={[styles.historyBodyCol, { width: 18, color: '#64748B' }]}>{item.id}</Text>
                <Text style={[styles.historyBodyCol, { width: 75, fontSize: 10 }]}>{item.date}</Text>
                <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.phonePeMiniLogo}>
                    <Text style={styles.phonePeLogoText}>P</Text>
                  </View>
                  <Text style={[styles.historyBodyCol, { fontSize: 10 }]} numberOfLines={1}>{item.mode}</Text>
                </View>
                <Text style={[styles.historyBodyCol, { width: 65, textAlign: 'right', fontWeight: '700' }]}>
                  ₹ {item.amount.toLocaleString('en-IN')}
                </Text>
                <View style={{ width: 55, alignItems: 'center' }}>
                  <View style={styles.paidMiniPill}>
                    <Ionicons name="checkmark-circle" size={9} color="#15803D" style={{ marginRight: 2 }} />
                    <Text style={styles.paidMiniPillText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={[styles.historyBodyCol, { flex: 1, textAlign: 'right', fontSize: 9.5, color: '#0284C7' }]}>
                  {item.txnId}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3. Remaining Payment Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="time" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Remaining Payment</Text>
            </View>
          </View>

          <View style={styles.remainingCardContent}>
            <View style={styles.remainingAmountCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.redDocMini}>
                  <Ionicons name="document-text" size={14} color="#E53935" />
                </View>
                <View>
                  <Text style={styles.remainingLabel}>Amount to be Paid</Text>
                  <Text style={styles.remainingBigValue}>₹ {remainingAmount.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.dueDateCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar-outline" size={14} color="#E53935" style={{ marginRight: 4 }} />
                <View>
                  <Text style={styles.dueDateLabel}>Due Date</Text>
                  <Text style={styles.dueDateValue}>Before 20 Nov 2026</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.makePaymentBtn, remainingAmount === 0 && { backgroundColor: '#16A34A' }]}
              activeOpacity={0.88}
              onPress={handleMakeRemainingPayment}
            >
              <Text style={styles.makePaymentBtnText}>
                {remainingAmount === 0 ? 'All Paid ✓' : 'Make Payment →'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Payment Methods Selector */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="card-outline" size={15} color="#E53935" />
              </View>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
            </View>
          </View>

          <View style={styles.methodsRow}>
            {/* 1. UPI */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedPaymentMethod === 'upi' && styles.methodCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedPaymentMethod('upi')}
            >
              <View style={styles.methodCardTop}>
                <Text style={styles.upiBrandText}>UPI</Text>
                <View
                  style={[
                    styles.radioCircle,
                    selectedPaymentMethod === 'upi' && styles.radioCircleActive,
                  ]}
                >
                  {selectedPaymentMethod === 'upi' && <View style={styles.radioDot} />}
                </View>
              </View>
              <Text style={styles.methodCardTitle}>UPI</Text>
              <Text style={styles.methodCardSub}>Google Pay, PhonePe, Paytm</Text>
            </TouchableOpacity>

            {/* 2. Credit/Debit Card */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedPaymentMethod === 'card' && styles.methodCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <View style={styles.methodCardTop}>
                <Ionicons name="card" size={18} color="#0284C7" />
                <View
                  style={[
                    styles.radioCircle,
                    selectedPaymentMethod === 'card' && styles.radioCircleActive,
                  ]}
                >
                  {selectedPaymentMethod === 'card' && <View style={styles.radioDot} />}
                </View>
              </View>
              <Text style={styles.methodCardTitle}>Credit / Debit Card</Text>
              <Text style={styles.methodCardSub}>Visa, Mastercard, RuPay</Text>
            </TouchableOpacity>

            {/* 3. Net Banking */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedPaymentMethod === 'netbanking' && styles.methodCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedPaymentMethod('netbanking')}
            >
              <View style={styles.methodCardTop}>
                <Ionicons name="business" size={18} color="#1E293B" />
                <View
                  style={[
                    styles.radioCircle,
                    selectedPaymentMethod === 'netbanking' && styles.radioCircleActive,
                  ]}
                >
                  {selectedPaymentMethod === 'netbanking' && <View style={styles.radioDot} />}
                </View>
              </View>
              <Text style={styles.methodCardTitle}>Net Banking</Text>
              <Text style={styles.methodCardSub}>All major banks</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. 100% Secure Payments Banner */}
        <View style={styles.securityBanner}>
          <View style={styles.securityIconBox}>
            <Ionicons name="shield-checkmark" size={20} color="#15803D" />
          </View>
          <View style={styles.securityTextCol}>
            <Text style={styles.securityTitle}>100% Secure Payments</Text>
            <Text style={styles.securitySub}>Your payment information is safe with bank-level security.</Text>
          </View>

          <View style={styles.securityBadgesCol}>
            <View style={styles.secBadgeItem}>
              <Ionicons name="checkmark-circle" size={11} color="#15803D" style={{ marginRight: 2 }} />
              <Text style={styles.secBadgeText}>PCI DSS</Text>
            </View>
            <View style={styles.secBadgeItem}>
              <Ionicons name="checkmark-circle" size={11} color="#15803D" style={{ marginRight: 2 }} />
              <Text style={styles.secBadgeText}>SSL Secured</Text>
            </View>
            <View style={styles.secBadgeItem}>
              <Ionicons name="checkmark-circle" size={11} color="#15803D" style={{ marginRight: 2 }} />
              <Text style={styles.secBadgeText}>Razorpay</Text>
            </View>
          </View>
        </View>

        {/* 6. Celebration Footer Banner */}
        <View style={styles.celebrationFooterBanner}>
          <Text style={styles.celebrationFooterText}>
            ❤️  Thank you for being a part of our celebration journey!  ❤️
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Payment Success Confirmation Modal */}
      <Modal
        visible={isPaymentSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPaymentSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalBox}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.successModalTitle}>Payment Successful!</Text>
            <Text style={styles.successModalSub}>
              Remaining balance of ₹50,000 has been paid successfully. Your event invoice is now fully settled!
            </Text>

            <TouchableOpacity
              style={styles.successModalBtn}
              activeOpacity={0.88}
              onPress={() => setIsPaymentSuccessModalVisible(false)}
            >
              <Text style={styles.successModalBtnText}>View Updated Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: '#D81B60',
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: '#556987',
    marginTop: 2,
    fontWeight: '400',
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
  receiptGraphicBox: {
    marginRight: 4,
  },
  tagTextCol: {
    alignItems: 'flex-start',
  },
  decorativeLine1: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D81B60',
    lineHeight: 10,
  },
  decorativeLine2: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D81B60',
    lineHeight: 10,
  },
  decorativeLine3: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#D81B60',
    lineHeight: 10,
  },
  decorativeLine4: {
    fontSize: 8,
    fontWeight: '500',
    color: '#D81B60',
    lineHeight: 9,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Vendor Card
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  vendorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorImage: {
    width: 68,
    height: 52,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#FDECEF',
  },
  vendorDetailsCol: {
    flex: 1,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  vendorRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  vendorRatingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 3,
  },
  vendorReviewsCount: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  vendorLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorLocationText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 3,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D81B60',
    marginRight: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    justifyContent: 'space-between',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1E293B',
  },

  // Booking Meta Pills Bar
  metaPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 4,
  },
  metaIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  metaLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  metaValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusPillsHeaderRow: {
    flexDirection: 'row',
    gap: 6,
  },
  paidHeaderPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  paidHeaderPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  remainingHeaderPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  remainingHeaderPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },

  // Invoice Table
  invoiceTable: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableHeadCol: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  tableBodyCol: {
    fontSize: 11,
    color: '#1E293B',
  },
  invoiceCalculationArea: {
    paddingTop: 6,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    paddingVertical: 2,
  },
  calcLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  calcValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    minWidth: 60,
    textAlign: 'right',
  },
  totalAmountStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  totalAmountLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E53935',
  },
  totalAmountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E53935',
  },

  // Payment History
  downloadInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadInvoiceText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E53935',
  },
  historyTable: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  historyHeadRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyHeadCol: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  historyBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  historyBodyCol: {
    fontSize: 10.5,
    color: '#1E293B',
  },
  phonePeMiniLogo: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5F259F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
  },
  phonePeLogoText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  paidMiniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paidMiniPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },

  // Remaining Card
  remainingCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F7',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  remainingAmountCol: {
    flex: 1.2,
  },
  redDocMini: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  remainingLabel: {
    fontSize: 9.5,
    color: '#64748B',
  },
  remainingBigValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E53935',
  },
  dueDateCol: {
    flex: 1.1,
  },
  dueDateLabel: {
    fontSize: 9.5,
    color: '#64748B',
  },
  dueDateValue: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  makePaymentBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  makePaymentBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Payment Methods
  methodsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  methodCardActive: {
    borderColor: '#E5093A',
    backgroundColor: '#FFF1F2',
  },
  methodCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  upiBrandText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#E5093A',
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5093A',
  },
  methodCardTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  methodCardSub: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 1,
  },

  // Security Banner
  securityBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  securityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  securityTextCol: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
  },
  securitySub: {
    fontSize: 9.5,
    color: '#166534',
    marginTop: 1,
  },
  securityBadgesCol: {
    alignItems: 'flex-start',
    gap: 2,
    paddingLeft: 4,
  },
  secBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#15803D',
  },

  // Celebration Footer Banner
  celebrationFooterBanner: {
    backgroundColor: '#FFF1F2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  celebrationFooterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E5093A',
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  successModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  successModalSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  successModalBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  successModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
