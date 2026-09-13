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
  Share,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

interface DownloadInvoiceScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const DownloadInvoiceScreen: React.FC<DownloadInvoiceScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const invoiceData = {
    bookingId: 'TI1265089',
    invoiceDate: '11 Nov 2026',
    vendor: {
      name: 'Royal Beats Dhol Group',
      location: 'Indore, Madhya Pradesh',
      phone: '+91 98765 43210',
      email: 'royalbeats@gmail.com',
    },
    customer: {
      name: 'Amit Sharma',
      phone: '+91 91234 56789',
      email: 'amit.sharma@gmail.com',
      location: 'Indore, Madhya Pradesh',
    },
    event: {
      date: '15 Nov 2026, Sunday',
      time: '5:00 PM - 9:00 PM (4 Hours)',
      location: 'Indore, Madhya Pradesh',
      serviceType: 'Dhol Services',
    },
    pricing: {
      basePackage: 8000,
      artistCharges: 2000,
      travelSetup: 1000,
      totalAmount: 11000,
    },
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

  const handleDownloadPDF = () => {
    Alert.alert(
      'Invoice Downloaded 📄',
      `Invoice #${invoiceData.bookingId} has been saved to your device's Downloads folder as 'Invoice_${invoiceData.bookingId}.pdf'.`,
      [{ text: 'Open PDF' }, { text: 'Done', style: 'cancel' }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Band Baaja Baarat - Official Tax Invoice #${invoiceData.bookingId}\nAmount: ₹${invoiceData.pricing.totalAmount.toLocaleString(
          'en-IN'
        )}\nEvent: ${invoiceData.event.serviceType} on ${invoiceData.event.date}\nVendor: ${invoiceData.vendor.name}`,
        title: `Invoice #${invoiceData.bookingId}`,
      });
    } catch (error) {
      // Fallback
      Alert.alert('Share Invoice', `Sharing invoice #${invoiceData.bookingId}`);
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Download <Text style={styles.headerTitleMaroon}>Invoice</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Your booking invoice is ready</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Memories</Text>
          <Text style={styles.scriptBadgeMid}>Deserve</Text>
          <Text style={styles.scriptBadgeBot}>a Receipt ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Payment Successful Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successCheckCircle}>
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <View style={styles.successTextCol}>
            <Text style={styles.successTitle}>Payment Successful</Text>
            <Text style={styles.successSubtitle}>
              Your payment has been received. You can now download your invoice.
            </Text>
          </View>
        </View>

        {/* Top Vendor Snapshot Card */}
        <View style={styles.vendorCard}>
          <View style={styles.cardImgWrapper}>
            <Image source={Assets.serviceBrassBand} style={styles.cardImg} />
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

        {/* Printable Official Invoice Card */}
        <View style={styles.invoicePaperCard}>
          {/* Invoice Header */}
          <View style={styles.invoiceTopRow}>
            {/* Logo */}
            <View style={styles.invoiceBrandCol}>
              <View style={styles.brandRow}>
                <View style={styles.brandIconMini}>
                  <FontAwesome5 name="drum" size={15} color="#8A072D" />
                </View>
                <View>
                  <Text style={styles.brandTitleText}>Band</Text>
                  <Text style={styles.brandTitleText}>Baaja</Text>
                  <Text style={styles.brandTitleText}>Baarat</Text>
                </View>
              </View>
              <Text style={styles.brandTagline}>Your Celebration Partner</Text>
            </View>

            {/* Invoice Stamp Details */}
            <View style={styles.invoiceMetaRight}>
              <Text style={styles.invoiceWordTitle}>INVOICE</Text>
              <Text style={styles.invoiceBookingId}>
                Booking ID: <Text style={styles.invoiceBookingIdBold}>{invoiceData.bookingId}</Text>
              </Text>
              <Text style={styles.invoiceDateText}>Invoice Date: {invoiceData.invoiceDate}</Text>
            </View>
          </View>

          <View style={styles.invoiceDivider} />

          {/* Vendor & Customer Details Two Columns */}
          <View style={styles.twoColSection}>
            {/* Vendor Col */}
            <View style={styles.colHalf}>
              <Text style={styles.sectionHeaderTitle}>Vendor Details</Text>
              <Text style={styles.entityNameBold}>{invoiceData.vendor.name}</Text>

              <View style={styles.miniDetailRow}>
                <Ionicons name="location-sharp" size={10} color="#8A072D" />
                <Text style={styles.miniDetailText} numberOfLines={1}>
                  {invoiceData.vendor.location}
                </Text>
              </View>

              <View style={styles.miniDetailRow}>
                <Ionicons name="call" size={10} color="#8A072D" />
                <Text style={styles.miniDetailText}>{invoiceData.vendor.phone}</Text>
              </View>

              <View style={styles.miniDetailRow}>
                <Ionicons name="mail" size={10} color="#8A072D" />
                <Text style={styles.miniDetailText} numberOfLines={1}>
                  {invoiceData.vendor.email}
                </Text>
              </View>
            </View>

            {/* Customer Col */}
            <View style={styles.colHalf}>
              <Text style={styles.sectionHeaderTitle}>Customer Details</Text>
              <Text style={styles.entityNameBold}>{invoiceData.customer.name}</Text>

              <View style={styles.miniDetailRow}>
                <Ionicons name="call" size={10} color="#8A072D" />
                <Text style={styles.miniDetailText}>{invoiceData.customer.phone}</Text>
              </View>

              <View style={styles.miniDetailRow}>
                <Ionicons name="mail" size={10} color="#8A072D" />
                <Text style={styles.miniDetailText} numberOfLines={1}>
                  {invoiceData.customer.email}
                </Text>
              </View>

              <View style={styles.miniDetailRow}>
                <Ionicons name="location-sharp" size={10} color="#8A072D" />
                <Text style={styles.miniDetailText} numberOfLines={1}>
                  {invoiceData.customer.location}
                </Text>
              </View>
            </View>
          </View>

          {/* Booking Details Box */}
          <View style={styles.invoiceDetailsBox}>
            <Text style={styles.boxSectionTitle}>Booking Details</Text>

            <View style={styles.boxDetailRow}>
              <Text style={styles.boxLabel}>Event Date</Text>
              <Text style={styles.boxValue}>{invoiceData.event.date}</Text>
            </View>

            <View style={styles.boxDetailRow}>
              <Text style={styles.boxLabel}>Event Time</Text>
              <Text style={styles.boxValue}>{invoiceData.event.time}</Text>
            </View>

            <View style={styles.boxDetailRow}>
              <Text style={styles.boxLabel}>Event Location</Text>
              <Text style={styles.boxValue}>{invoiceData.event.location}</Text>
            </View>

            <View style={styles.boxDetailRow}>
              <Text style={styles.boxLabel}>Service Type</Text>
              <Text style={styles.boxValue}>{invoiceData.event.serviceType}</Text>
            </View>

            <View style={[styles.boxDetailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.boxLabel}>Booking ID</Text>
              <Text style={styles.boxValue}>{invoiceData.bookingId}</Text>
            </View>
          </View>

          {/* Price Breakdown Box */}
          <View style={styles.invoiceDetailsBox}>
            <Text style={styles.boxSectionTitle}>Price Breakdown</Text>

            <View style={styles.boxDetailRow}>
              <Text style={styles.boxLabel}>Dhol Services (Basic Package)</Text>
              <Text style={styles.boxValue}>
                ₹{invoiceData.pricing.basePackage.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.boxDetailRow}>
              <Text style={styles.boxLabel}>Artist Charges</Text>
              <Text style={styles.boxValue}>
                ₹{invoiceData.pricing.artistCharges.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.boxDetailRow}>
              <Text style={styles.boxLabel}>Travel & Setup Charges</Text>
              <Text style={styles.boxValue}>
                ₹{invoiceData.pricing.travelSetup.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmountNumber}>
                ₹{invoiceData.pricing.totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Thank you note & watermark at bottom */}
          <View style={styles.invoiceFooterRow}>
            <View>
              <Text style={styles.thankYouScript}>Thank You ♡</Text>
              <Text style={styles.thankYouSub}>For being a part of our journey!</Text>
            </View>

            <View style={styles.footerBrandRight}>
              <Text style={styles.footerTaglineTop}>Har Celebration</Text>
              <Text style={styles.footerTaglineBot}>TaskIndore Ke Saath ♡</Text>
              <View style={styles.yellowFlourishLine} />
            </View>
          </View>

          {/* Perforated Edge Circles at Bottom */}
          <View style={styles.perforatedRow}>
            {[...Array(16)].map((_, i) => (
              <View key={i} style={styles.perforationHole} />
            ))}
          </View>
        </View>

        {/* Bottom Actions: Share & Download PDF */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.shareBtn}
            activeOpacity={0.85}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={18} color="#8A072D" />
            <Text style={styles.shareBtnText}>Share Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.downloadPdfBtn}
            activeOpacity={0.85}
            onPress={handleDownloadPDF}
          >
            <Ionicons name="download-outline" size={18} color="#FFFFFF" />
            <Text style={styles.downloadPdfBtnText}>Download PDF</Text>
          </TouchableOpacity>
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

  // Payment Successful Banner
  successBanner: {
    flexDirection: 'row',
    backgroundColor: '#E8F8EE',
    borderWidth: 1,
    borderColor: '#C2ECCC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 10,
  },
  successCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTextCol: {
    flex: 1,
  },
  successTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  successSubtitle: {
    fontSize: 9.5,
    color: '#4B6B55',
    marginTop: 1,
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
    backgroundColor: '#FDECE6',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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

  // Printable Invoice Card
  invoicePaperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBD8D0',
    padding: 14,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  invoiceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceBrandCol: {
    gap: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandIconMini: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8A072D',
    lineHeight: 11,
  },
  brandTagline: {
    fontSize: 7.5,
    color: '#8A072D',
    fontWeight: '600',
    marginTop: 2,
  },
  invoiceMetaRight: {
    alignItems: 'flex-end',
  },
  invoiceWordTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '900',
    color: '#8A072D',
    letterSpacing: 1,
  },
  invoiceBookingId: {
    fontSize: 9.5,
    color: '#554246',
    marginTop: 2,
  },
  invoiceBookingIdBold: {
    fontWeight: '800',
    color: '#8A072D',
  },
  invoiceDateText: {
    fontSize: 9,
    color: '#736064',
    marginTop: 1,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#F3E4DC',
    marginVertical: 12,
  },

  // 2 Columns
  twoColSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  colHalf: {
    flex: 1,
    gap: 3,
  },
  sectionHeaderTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  entityNameBold: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A072D',
    marginBottom: 2,
  },
  miniDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniDetailText: {
    fontSize: 8.5,
    color: '#554246',
    flex: 1,
  },

  // Details Boxes inside Invoice
  invoiceDetailsBox: {
    backgroundColor: '#FAF2EE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F5DDD3',
  },
  boxSectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#8A072D',
    marginBottom: 6,
  },
  boxDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  boxLabel: {
    fontSize: 9.5,
    color: '#554246',
  },
  boxValue: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#1A040A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EBD4CA',
    paddingTop: 6,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A072D',
  },
  totalAmountNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8A072D',
  },

  // Invoice Footer
  invoiceFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 14,
  },
  thankYouScript: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
  },
  thankYouSub: {
    fontSize: 8,
    color: '#736064',
    marginTop: 1,
  },
  footerBrandRight: {
    alignItems: 'flex-end',
    position: 'relative',
  },
  footerTaglineTop: {
    fontSize: 8,
    fontWeight: '700',
    color: '#8A072D',
  },
  footerTaglineBot: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
  },
  yellowFlourishLine: {
    width: 60,
    height: 1.5,
    backgroundColor: '#F59E0B',
    borderRadius: 1,
    marginTop: 2,
  },

  // Perforated Bottom
  perforatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: -6,
    left: 4,
    right: 4,
  },
  perforationHole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FAF5F2',
  },

  // Bottom Buttons
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF1EC',
    borderWidth: 1,
    borderColor: '#F7D7CA',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 13,
    gap: 6,
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
  downloadPdfBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 13,
    gap: 6,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  downloadPdfBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
