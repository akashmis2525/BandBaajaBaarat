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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

interface BookingConfirmedProps {
  route?: {
    params?: {
      bookingId?: string;
      transactionId?: string;
      vendorName?: string;
      category?: string;
      date?: string;
      time?: string;
      location?: string;
      amount?: number;
      paymentMethod?: string;
      image?: any;
    };
  };
  navigation?: any;
}

export const BookingConfirmedScreen: React.FC<BookingConfirmedProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const bookingId = route?.params?.bookingId || '#BB20261220';
  const transactionId = route?.params?.transactionId || 'TID202612200987';
  const vendorName = route?.params?.vendorName || 'The Grand Palace';
  const category = route?.params?.category || 'Banquet Hall';
  const date = route?.params?.date || '20 Dec 2026';
  const time = route?.params?.time || '7:00 PM - 11:00 PM';
  const location = route?.params?.location || '123, AB Road, Vijay Nagar, Indore';
  const amount = route?.params?.amount || 88500;
  const paymentMethod = route?.params?.paymentMethod || 'Paid via UPI (Google Pay)';
  const image = route?.params?.image || Assets.serviceDecorators;

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const recommendations = [
    {
      id: 'rec1',
      title: 'Royal Beats Dhol Group',
      category: 'Dhol & Music',
      price: '₹5,999',
      image: Assets.weddingMandapArt,
    },
    {
      id: 'rec2',
      title: 'Glam Look Makeup Studio',
      category: 'Bridal Makeup',
      price: '₹12,000',
      image: Assets.serviceMehndi,
    },
    {
      id: 'rec3',
      title: 'Shivam Car Rentals',
      category: 'Wedding Car',
      price: '₹8,000',
      image: Assets.serviceBuggi,
    },
    {
      id: 'rec4',
      title: 'Shree Caterers',
      category: 'Catering Service',
      price: '₹600',
      image: Assets.serviceClothes,
    },
  ];

  const handleShareBooking = async () => {
    try {
      await Share.share({
        message: `🎉 Booking Confirmed on Band Baaja Baarat!\n\nService: ${vendorName}\nDate: ${date} (${time})\nLocation: ${location}\nBooking ID: ${bookingId}\nAmount Paid: ₹${amount.toLocaleString()}`,
        title: 'Wedding Service Booking Confirmed',
      });
    } catch (error) {
      Alert.alert('Share', `Booking ${bookingId}`);
    }
  };

  const handleAddToCalendar = () => {
    Alert.alert(
      'Added to Calendar 📅',
      `Event "${vendorName}" on ${date} (${time}) has been added to your calendar with a 24-hour reminder.`
    );
  };

  const handleContactVendor = () => {
    Alert.alert(
      `Contact ${vendorName}`,
      `Venue Manager: +91 98265 99887\nLocation: ${location}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Chat on App',
          onPress: () => navigation?.navigate('ChatMain', { vendorName }),
        },
        {
          text: 'Call Now',
          onPress: () => Alert.alert('Calling Vendor', 'Connecting call to +91 98265 99887...'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
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
        {/* Top Right Script Calligraphy Stamp */}
        <View style={styles.topScriptRow}>
          <View style={styles.scriptBadge}>
            <Text style={styles.scriptBadgeTop}>Good Events</Text>
            <Text style={styles.scriptBadgeMid}>Happier</Text>
            <Text style={styles.scriptBadgeBot}>People ♡</Text>
          </View>
        </View>

        {/* Top Celebration & Checkmark Icon */}
        <View style={styles.celebrationHeader}>
          {/* Confetti Ribbon elements */}
          <View style={styles.confettiWrapper}>
            <Ionicons name="sparkles" size={16} color="#DC2626" style={{ position: 'absolute', top: 0, left: 30 }} />
            <Ionicons name="sparkles" size={14} color="#F59E0B" style={{ position: 'absolute', top: 12, right: 35 }} />
            <Ionicons name="star" size={12} color="#DC2626" style={{ position: 'absolute', bottom: 10, left: 40 }} />
            <Ionicons name="star" size={12} color="#F59E0B" style={{ position: 'absolute', bottom: 14, right: 45 }} />

            {/* Checkmark Circle */}
            <View style={styles.checkCircleLarge}>
              <Ionicons name="checkmark" size={38} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.bookingConfirmedHeading}>Booking Confirmed!</Text>
          <Text style={styles.stepCloserText}>Your celebration is one step closer!</Text>
          <Text style={styles.confirmationNoticeText}>
            A confirmation has been sent to your registered mobile number and email address.
          </Text>
        </View>

        {/* Booking Details Snapshot Card */}
        <TouchableOpacity
          style={styles.bookingCard}
          activeOpacity={0.88}
          onPress={() => {
            if (navigation?.navigate) {
              navigation.navigate('BookingTracking');
            }
          }}
        >
          <View style={styles.cardTopRow}>
            <Image source={image} style={styles.venueThumb} />

            <View style={styles.venueInfoCol}>
              <Text style={styles.venueTitleBold} numberOfLines={1}>
                {vendorName}
              </Text>
              <Text style={styles.venueCategoryText}>{category}</Text>

              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={12} color="#DC2626" />
                <Text style={styles.detailText}>{date}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={12} color="#DC2626" />
                <Text style={styles.detailText}>{time}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={12} color="#DC2626" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            </View>

            {/* Right Booking ID & Confirmed Badge */}
            <View style={styles.cardRightCol}>
              <Text style={styles.bookingIdLabel}>Booking ID</Text>
              <Text style={styles.bookingIdValue}>{bookingId}</Text>
              <View style={styles.confirmedBadge}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                <Text style={styles.confirmedBadgeText}>Confirmed</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Bottom Transaction Details Row */}
          <View style={styles.cardBottomRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.amountPaidLabel}>Total Amount Paid</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.amountPaidValue}>₹{amount.toLocaleString()}</Text>
                <View style={styles.paymentSuccessPill}>
                  <Ionicons name="checkmark" size={10} color="#16A34A" />
                  <Text style={styles.paymentSuccessText}>Payment Successful</Text>
                </View>
              </View>
              <Text style={styles.paymentViaText}>{paymentMethod}</Text>
              <Text style={styles.transactionIdText}>Transaction ID: {transactionId}</Text>
            </View>

            {/* Right Date & Google Pay Branding */}
            <View style={styles.transactionRightCol}>
              <Text style={styles.transDateText}>{date}</Text>
              <Text style={styles.transTimeText}>10:24 AM</Text>
              <View style={styles.googlePayBrandRow}>
                <Ionicons name="logo-google" size={12} color="#4285F4" />
                <Text style={styles.googlePayText}>Google Pay</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* 4 Quick Action Buttons */}
        <View style={styles.quickActionsGrid}>
          {/* 1. View Invoice */}
          <TouchableOpacity
            style={styles.actionGridBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('InvoicePayment', {
              bookingId: bookingId,
              vendorName: vendorName,
            })}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="document-text-outline" size={18} color="#DC2626" />
            </View>
            <Text style={styles.actionBtnLabel}>View{'\n'}Invoice</Text>
          </TouchableOpacity>

          {/* 2. Add to Calendar */}
          <TouchableOpacity
            style={styles.actionGridBtn}
            activeOpacity={0.8}
            onPress={handleAddToCalendar}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="calendar-outline" size={18} color="#DC2626" />
            </View>
            <Text style={styles.actionBtnLabel}>Add to{'\n'}Calendar</Text>
          </TouchableOpacity>

          {/* 3. Share Booking */}
          <TouchableOpacity
            style={styles.actionGridBtn}
            activeOpacity={0.8}
            onPress={handleShareBooking}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="share-social-outline" size={18} color="#DC2626" />
            </View>
            <Text style={styles.actionBtnLabel}>Share{'\n'}Booking</Text>
          </TouchableOpacity>

          {/* 4. Contact Vendor */}
          <TouchableOpacity
            style={styles.actionGridBtn}
            activeOpacity={0.8}
            onPress={handleContactVendor}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#DC2626" />
            </View>
            <Text style={styles.actionBtnLabel}>Contact{'\n'}Vendor</Text>
          </TouchableOpacity>
        </View>

        {/* Thank You Celebration Banner */}
        <View style={styles.thankYouBanner}>
          <View style={styles.envelopeIconCircle}>
            <Ionicons name="mail" size={18} color="#DC2626" />
          </View>

          <View style={{ flex: 1, gap: 1 }}>
            <Text style={styles.thankYouTitle}>
              Thank you for choosing{'\n'}
              <Text style={styles.thankYouBrand}>Band Baaja Baarat!</Text>
            </Text>
            <Text style={styles.thankYouSubtitle}>
              We're excited to be a part of your special day.
            </Text>
          </View>

          <Image source={Assets.brideGroom} style={styles.coupleIllustration} />
        </View>

        {/* You May Also Like Section */}
        <View style={styles.recommendationsSection}>
          <View style={styles.recHeaderRow}>
            <Text style={styles.recSectionHeading}>You May Also Like</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('AllServices')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="arrow-forward" size={13} color="#DC2626" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Horizontal Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recCardsRow}
          >
            {recommendations.map((rec) => {
              const isFav = !!favorites[rec.id];
              return (
                <TouchableOpacity
                  key={rec.id}
                  style={styles.recCard}
                  activeOpacity={0.85}
                  onPress={() => navigation?.navigate('ServiceDetail', { category: rec.category })}
                >
                  <View style={styles.recImageWrapper}>
                    <Image source={rec.image} style={styles.recThumb} />
                    <TouchableOpacity
                      style={styles.recHeartBadge}
                      onPress={() => toggleFavorite(rec.id)}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={14}
                        color={isFav ? '#DC2626' : '#1A040A'}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.recTitleText} numberOfLines={1}>
                    {rec.title}
                  </Text>
                  <Text style={styles.recCategoryText} numberOfLines={1}>
                    {rec.category}
                  </Text>
                  <Text style={styles.recPriceText}>{rec.price}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Back to Home Primary Button */}
        <TouchableOpacity
          style={styles.backToHomeBtn}
          activeOpacity={0.88}
          onPress={() => navigation?.navigate('Home')}
        >
          <Ionicons name="home-outline" size={18} color="#FFFFFF" />
          <Text style={styles.backToHomeBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5F2',
  },
  scrollContent: {
    padding: 12,
    gap: 12,
  },
  topScriptRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 6,
  },
  scriptBadge: {
    alignItems: 'flex-end',
  },
  scriptBadgeTop: {
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#DC2626',
    lineHeight: 10,
  },
  scriptBadgeMid: {
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#DC2626',
    lineHeight: 10,
  },
  scriptBadgeBot: {
    fontSize: 9,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#DC2626',
    lineHeight: 10,
  },

  // Celebration Header
  celebrationHeader: {
    alignItems: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  confettiWrapper: {
    width: 140,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  checkCircleLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  bookingConfirmedHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A040A',
    textAlign: 'center',
  },
  stepCloserText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A040A',
    textAlign: 'center',
  },
  confirmationNoticeText: {
    fontSize: 9.5,
    color: '#736064',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 13,
    marginTop: 2,
  },

  // Booking Card
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    gap: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  venueThumb: {
    width: 85,
    height: 85,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  venueInfoCol: {
    flex: 1,
    gap: 2,
  },
  venueTitleBold: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  venueCategoryText: {
    fontSize: 9.5,
    color: '#736064',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 8.5,
    color: '#4A353A',
  },
  cardRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  bookingIdLabel: {
    fontSize: 7.5,
    color: '#8E7C80',
  },
  bookingIdValue: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  confirmedBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#F7EAE4',
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  amountPaidLabel: {
    fontSize: 8.5,
    color: '#736064',
  },
  amountPaidValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626',
  },
  paymentSuccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    gap: 2,
  },
  paymentSuccessText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#16A34A',
  },
  paymentViaText: {
    fontSize: 8.5,
    color: '#554246',
  },
  transactionIdText: {
    fontSize: 7.5,
    color: '#8E7C80',
  },
  transactionRightCol: {
    alignItems: 'flex-end',
    gap: 1,
  },
  transDateText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  transTimeText: {
    fontSize: 8,
    color: '#736064',
  },
  googlePayBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  googlePayText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#475569',
  },

  // 4 Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  actionGridBtn: {
    flex: 1,
    backgroundColor: '#FFF7F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A040A',
    textAlign: 'center',
    lineHeight: 11,
  },

  // Thank You Banner
  thankYouBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 10,
    gap: 8,
  },
  envelopeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thankYouTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1A040A',
    lineHeight: 13,
  },
  thankYouBrand: {
    color: '#DC2626',
  },
  thankYouSubtitle: {
    fontSize: 8.5,
    color: '#6E5C60',
    marginTop: 1,
  },
  coupleIllustration: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  // Recommendations
  recommendationsSection: {
    gap: 8,
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  recSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  viewAllText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  recCardsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  recCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 6,
    gap: 2,
  },
  recImageWrapper: {
    width: '100%',
    height: 75,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5E6DF',
  },
  recThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recHeartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitleText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A040A',
    marginTop: 2,
  },
  recCategoryText: {
    fontSize: 8,
    color: '#736064',
  },
  recPriceText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#DC2626',
    marginTop: 1,
  },

  // Back to Home Button
  backToHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 13,
    gap: 8,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 4,
  },
  backToHomeBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
