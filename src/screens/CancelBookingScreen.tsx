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
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { api, userMessage } from '../services/api';

interface CancelBookingScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

interface CancelReason {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'ionicons' | 'material' | 'fontawesome';
  iconName: string;
}

export const CancelBookingScreen: React.FC<CancelBookingScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<string>('change_plans');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');

  const booking = route?.params?.booking || {
    id: '1',
    bookingId: '#BB20261220',
    vendorName: 'The Grand Palace',
    category: 'Banquet Hall, Indore',
    date: '20 Dec 2026',
    time: '7:00 PM - 11:00 PM',
    location: '123, AB Road, Vijay Nagar, Indore',
    price: '₹88,500',
    priceNum: 88500,
    image: Assets.serviceDecorators,
    rating: 4.8,
    reviewsCount: 340,
    experience: '8+ Years',
  };

  const reasons: CancelReason[] = [
    {
      id: 'change_plans',
      title: 'Change in Plans',
      subtitle: 'My plans have changed',
      iconType: 'material',
      iconName: 'calendar-remove',
    },
    {
      id: 'found_another',
      title: 'Found Another Service',
      subtitle: 'I found another service provider',
      iconType: 'ionicons',
      iconName: 'search',
    },
    {
      id: 'budget_constraints',
      title: 'Budget Constraints',
      subtitle: "It's out of my budget",
      iconType: 'fontawesome',
      iconName: 'rupee-sign',
    },
    {
      id: 'personal_reason',
      title: 'Personal Reason',
      subtitle: 'Personal or family reason',
      iconType: 'ionicons',
      iconName: 'person-outline',
    },
    {
      id: 'other',
      title: 'Other',
      subtitle: 'Any other reason',
      iconType: 'ionicons',
      iconName: 'ellipsis-horizontal',
    },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('BookingsList');
    }
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Confirm Cancellation',
      `Are you sure you want to cancel your booking with ${booking.vendorName}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            if (booking.id && booking.id.length === 24) {
              api
                .cancelBooking(booking.id, selectedReason)
                .then(() => {
                  Alert.alert(
                    'Booking Cancelled',
                    `Your booking ${booking.bookingId} with ${booking.vendorName} has been cancelled successfully. Refund of ${booking.price || '₹88,500'} has been initiated to your original payment method.`,
                    [{ text: 'OK', onPress: () => navigation?.navigate('BookingsList') }],
                  );
                })
                .catch((err) => Alert.alert('Cancellation failed', userMessage(err)));
              return;
            }
            Alert.alert(
              'Booking Cancelled',
              `Your booking ${booking.bookingId} with ${booking.vendorName} has been cancelled successfully. Refund of ${booking.price || '₹88,500'} has been initiated to your original payment method.`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation?.navigate('BookingsList'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const renderReasonIcon = (reason: CancelReason) => {
    if (reason.iconType === 'material') {
      return <MaterialCommunityIcons name={reason.iconName as any} size={20} color="#8A072D" />;
    }
    if (reason.iconType === 'fontawesome') {
      return <FontAwesome5 name={reason.iconName as any} size={18} color="#8A072D" />;
    }
    return <Ionicons name={reason.iconName as any} size={20} color="#8A072D" />;
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
            Cancel <Text style={styles.headerTitleMaroon}>Booking</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            We're sorry to see you go. Please tell us the reason for cancelling this booking.
          </Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Plans</Text>
          <Text style={styles.scriptBadgeMid}>Can Change</Text>
          <Text style={styles.scriptBadgeBot}>It's Okay ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Vendor Snapshot Card */}
        <View style={styles.vendorCard}>
          <View style={styles.cardImgWrapper}>
            <Image source={booking.image || Assets.serviceDecorators} style={styles.cardImg} />
          </View>

          <View style={styles.cardDetailsCol}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{booking.category}</Text>
            </View>

            <Text style={styles.vendorHeading} numberOfLines={1}>
              {booking.vendorName}
            </Text>

            <View style={styles.ratingAndExpRow}>
              <Ionicons name="star" size={11} color="#E59819" />
              <Text style={styles.ratingScore}>{booking.rating || 4.8}</Text>
              <Text style={styles.reviewsCountText}>({booking.reviewsCount || 340} reviews)</Text>
              <Text style={styles.dividerPipe}>|</Text>
              <Text style={styles.expText}>{booking.experience || '5+ Years'}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>{booking.date}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>{booking.time}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={11.5} color="#8A072D" />
              <Text style={styles.metaText} numberOfLines={1}>
                {booking.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Why are you cancelling? Section */}
        <View style={styles.reasonsContainer}>
          <Text style={styles.sectionTitle}>Why are you cancelling?</Text>
          <Text style={styles.sectionSubtitle}>Please select a reason to help us improve.</Text>

          <View style={styles.reasonsList}>
            {reasons.map((reason) => {
              const isSelected = selectedReason === reason.id;
              return (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonOptionCard,
                    isSelected && styles.reasonOptionCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedReason(reason.id)}
                >
                  {/* Radio Circle */}
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>

                  {/* Icon */}
                  <View style={styles.reasonIconWrapper}>
                    {renderReasonIcon(reason)}
                  </View>

                  {/* Text Description */}
                  <View style={styles.reasonTextCol}>
                    <Text
                      style={[
                        styles.reasonTitle,
                        isSelected && styles.reasonTitleSelected,
                      ]}
                    >
                      {reason.title}
                    </Text>
                    <Text style={styles.reasonSubtitle}>{reason.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Additional Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Additional Details (Optional)</Text>

          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Tell us more about the reason..."
              placeholderTextColor="#A08C90"
              multiline
              numberOfLines={3}
              maxLength={200}
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              textAlignVertical="top"
            />
            <Text style={styles.charCountText}>{additionalDetails.length}/200</Text>
          </View>
        </View>

        {/* Please Note Box */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={20} color="#8A072D" />
          <View style={styles.noteTextCol}>
            <Text style={styles.noteTitle}>Please Note:</Text>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                If you cancel, any advance payment (if applicable) may not be refundable as per our
                cancellation policy.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                The vendor will be notified about the cancellation.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>You can always book again anytime!</Text>
            </View>
          </View>
        </View>

        {/* Cancel Booking Button */}
        <TouchableOpacity
          style={styles.cancelBtn}
          activeOpacity={0.85}
          onPress={handleCancelBooking}
        >
          <Text style={styles.cancelBtnText}>Cancel Booking</Text>
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
    fontSize: 10,
    color: '#736064',
    marginTop: 2,
    lineHeight: 14,
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

  // Vendor Snapshot Card
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

  // Why are you cancelling
  reasonsContainer: {
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  sectionSubtitle: {
    fontSize: 10.5,
    color: '#736064',
    marginTop: 2,
    marginBottom: 10,
  },
  reasonsList: {
    gap: 8,
  },
  reasonOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE3DE',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
  },
  reasonOptionCardSelected: {
    backgroundColor: '#FDF1EC',
    borderColor: '#F7D7CA',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#C5B4B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#8A072D',
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#8A072D',
  },
  reasonIconWrapper: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonTextCol: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  reasonTitleSelected: {
    color: '#8A072D',
    fontWeight: '800',
  },
  reasonSubtitle: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 1,
  },

  // Additional Details
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
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginVertical: 1,
  },
  bulletDot: {
    fontSize: 11,
    color: '#8A072D',
    lineHeight: 14,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#554246',
    lineHeight: 14,
  },

  // Cancel Button
  cancelBtn: {
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
  cancelBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
