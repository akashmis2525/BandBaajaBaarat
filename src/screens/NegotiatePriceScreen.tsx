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
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';

interface NegotiatePriceProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const NegotiatePriceScreen: React.FC<NegotiatePriceProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ChatMain');
    }
  };

  const handleProceedToBooking = () => {
    if (navigation?.navigate) {
      navigation.navigate('BookingSummary', {
        vendorName: 'Royal Events & Decor',
        serviceName: 'Grand Stage & Wedding Decoration',
        amount: 75000,
        originalAmount: 85000,
        discount: 10000,
        date: '16 Sep 2026',
        isNegotiated: true,
      });
    } else {
      Alert.alert(
        'Proceeding to Booking Summary',
        'Navigating to Booking Summary with agreed final amount of ₹75,000.'
      );
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
              Negotiate <Text style={styles.screenTitleHighlight}>Price</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Discuss and get the best deal with your vendor
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.handshakeGraphicBox}>
            <Ionicons name="heart-circle" size={28} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Better</Text>
            <Text style={styles.decorativeLine2}>Talks</Text>
            <Text style={styles.decorativeLine3}>Brighter</Text>
            <Text style={styles.decorativeLine4}>Celebrations ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Vendor Profile Card */}
        <View style={styles.vendorCard}>
          <View style={styles.vendorTopRow}>
            {/* Vendor Image */}
            <Image
              source={Assets.weddingMandapArt || { uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' }}
              style={styles.vendorImage}
              resizeMode="cover"
            />

            {/* Vendor Info */}
            <View style={styles.vendorDetailsCol}>
              <Text style={styles.vendorName} numberOfLines={1}>
                Royal Events & Decor
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

            {/* View Profile Button */}
            <TouchableOpacity
              style={styles.viewProfileBtn}
              activeOpacity={0.7}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('RateReview');
                } else {
                  Alert.alert('Vendor Profile', 'Royal Events & Decor - ★ 4.8 Rating');
                }
              }}
            >
              <Text style={styles.viewProfileBtnText}>View Profile</Text>
              <Ionicons name="chevron-forward" size={13} color="#D81B60" />
            </TouchableOpacity>
          </View>

          {/* 3 Badges Row */}
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

        {/* 2. Meeting Completed Status Pill Bar */}
        <View style={styles.meetingStatusBar}>
          {/* Left: Meeting Completed */}
          <View style={styles.statusSectionLeft}>
            <View style={styles.statusIconCircle}>
              <Ionicons name="calendar" size={16} color="#E53935" />
            </View>
            <View style={styles.statusTextCol}>
              <Text style={styles.statusTitle}>Meeting Completed</Text>
              <Text style={styles.statusSubtitle}>16 Sep 2026, 10:00 AM</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.statusDivider} />

          {/* Right: Location */}
          <View style={styles.statusSectionRight}>
            <View style={styles.statusIconCircle}>
              <Ionicons name="location-sharp" size={16} color="#E53935" />
            </View>
            <View style={styles.statusTextCol}>
              <Text style={styles.statusTitle}>At Vendor's Office</Text>
              <Text style={styles.statusSubtitle} numberOfLines={1}>
                301, Shekhar Central, MG Road, Indore
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Vendor's Quotation Card */}
        <View style={styles.quotationCard}>
          <View style={styles.quotationHeaderRow}>
            <Text style={styles.quotationHeaderTitle}>Vendor's Quotation</Text>
            <Text style={styles.quotationDateText}>Received on 16 Sep 2026</Text>
          </View>

          <View style={styles.quotationAmountRow}>
            <View style={styles.docIconBox}>
              <Ionicons name="document-text" size={22} color="#E53935" />
            </View>
            <View style={styles.quotationAmountCol}>
              <Text style={styles.quotationAmountLabel}>Total Quotation Amount</Text>
              <Text style={styles.quotationAmountValue}>₹ 85,000</Text>
            </View>

            <TouchableOpacity
              style={styles.viewDetailsBtn}
              activeOpacity={0.8}
              onPress={handleProceedToBooking}
            >
              <Text style={styles.viewDetailsBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inclusionsWrapper}>
            <Text style={styles.inclusionsLabel}>Inclusions:</Text>
            <View style={styles.inclusionsList}>
              <View style={styles.inclusionItem}>
                <Ionicons name="checkmark-circle" size={14} color="#1E293B" />
                <Text style={styles.inclusionText}>Stage Decoration</Text>
              </View>
              <View style={styles.inclusionItem}>
                <Ionicons name="checkmark-circle" size={14} color="#1E293B" />
                <Text style={styles.inclusionText}>Entry Gate</Text>
              </View>
              <View style={styles.inclusionItem}>
                <Ionicons name="checkmark-circle" size={14} color="#1E293B" />
                <Text style={styles.inclusionText}>Flower Setup</Text>
              </View>
              <View style={styles.inclusionItem}>
                <Ionicons name="checkmark-circle" size={14} color="#1E293B" />
                <Text style={styles.inclusionText}>Lighting</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsDetailsModalVisible(true)}
              >
                <Text style={styles.plusMoreText}>+2 more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. Negotiation Chat History Stream */}
        <View style={styles.chatStreamContainer}>
          {/* Message 1: Vendor */}
          <View style={styles.chatMessageRowLeft}>
            <View style={styles.vendorAvatarBubble}>
              <FontAwesome5 name="crown" size={9} color="#F59E0B" />
              <Text style={styles.vendorAvatarBubbleText}>ROYAL</Text>
              <Text style={styles.vendorAvatarBubbleSub}>EVENTS</Text>
            </View>
            <View style={styles.messageBubbleLeft}>
              <Text style={styles.messageTextLeft}>
                Hello! Here's the quotation as per our discussion during the meeting. Please check and let us know your thoughts.
              </Text>
              <Text style={styles.messageTimeLeft}>11:30 AM</Text>
            </View>
          </View>

          {/* Message 2: User */}
          <View style={styles.chatMessageRowRight}>
            <View style={styles.messageBubbleRight}>
              <Text style={styles.messageTextRight}>
                Thank you! The setup looks great. Can you reduce the price a bit? Our budget is around ₹ 70,000.
              </Text>
              <View style={styles.messageMetaRight}>
                <Text style={styles.messageTimeRight}>11:45 AM</Text>
                <Ionicons name="checkmark-done" size={13} color="#E53935" style={{ marginLeft: 3 }} />
              </View>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' }}
              style={styles.userAvatarBubble}
            />
          </View>

          {/* Message 3: Vendor */}
          <View style={styles.chatMessageRowLeft}>
            <View style={styles.vendorAvatarBubble}>
              <FontAwesome5 name="crown" size={9} color="#F59E0B" />
              <Text style={styles.vendorAvatarBubbleText}>ROYAL</Text>
              <Text style={styles.vendorAvatarBubbleSub}>EVENTS</Text>
            </View>
            <View style={styles.messageBubbleLeft}>
              <Text style={styles.messageTextLeft}>
                We can do ₹ 78,000 for you, including all the items. This is our best possible price.
              </Text>
              <Text style={styles.messageTimeLeft}>12:10 PM</Text>
            </View>
          </View>

          {/* Message 4: User */}
          <View style={styles.chatMessageRowRight}>
            <View style={styles.messageBubbleRight}>
              <Text style={styles.messageTextRight}>
                That's better. Can you include a welcome board and 2 extra flower stands in this price?
              </Text>
              <View style={styles.messageMetaRight}>
                <Text style={styles.messageTimeRight}>12:25 PM</Text>
                <Ionicons name="checkmark-done" size={13} color="#E53935" style={{ marginLeft: 3 }} />
              </View>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' }}
              style={styles.userAvatarBubble}
            />
          </View>

          {/* Message 5: Vendor */}
          <View style={styles.chatMessageRowLeft}>
            <View style={styles.vendorAvatarBubble}>
              <FontAwesome5 name="crown" size={9} color="#F59E0B" />
              <Text style={styles.vendorAvatarBubbleText}>ROYAL</Text>
              <Text style={styles.vendorAvatarBubbleSub}>EVENTS</Text>
            </View>
            <View style={styles.messageBubbleLeft}>
              <Text style={styles.messageTextLeft}>
                Sure! We can include the welcome board and 2 flower stands at ₹ 75,000. Let me know if this works for you.
              </Text>
              <Text style={styles.messageTimeLeft}>12:40 PM</Text>
            </View>
          </View>
        </View>

        {/* 5. Final Agreed Amount Card */}
        <View style={styles.finalAgreedCard}>
          <View style={styles.finalDocIconBox}>
            <Ionicons name="document-text" size={22} color="#E53935" />
          </View>
          <View style={styles.finalAmountCol}>
            <Text style={styles.finalAmountLabel}>Final Agreed Amount</Text>
            <Text style={styles.finalAmountValue}>₹ 75,000</Text>
          </View>

          <View style={styles.agreedBadgeContainer}>
            <View style={styles.agreedGreenPill}>
              <Ionicons name="checkmark-circle" size={13} color="#16A34A" style={{ marginRight: 3 }} />
              <Text style={styles.agreedGreenText}>Agreed by Both</Text>
            </View>
            <Text style={styles.agreedTimestampText}>16 Sep 2026, 12:40 PM</Text>
          </View>
        </View>

        {/* 6. Proceed to Booking Big Button */}
        <TouchableOpacity
          style={styles.proceedBtn}
          activeOpacity={0.9}
          onPress={handleProceedToBooking}
        >
          <Text style={styles.proceedBtnText}>Proceed to Booking</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Quotation Details Modal */}
      <Modal
        visible={isDetailsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quotation Itemized Details</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsDetailsModalVisible(false)}
              >
                <Ionicons name="close" size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <Text style={styles.modalVendorName}>Royal Events & Decor</Text>
              <Text style={styles.modalEventDate}>Event Date: 16 Sep 2026 • Indore</Text>

              <View style={styles.modalDivider} />

              <View style={styles.itemizedRow}>
                <Text style={styles.itemizedName}>Grand Floral Stage Backdrop</Text>
                <Text style={styles.itemizedPrice}>₹ 35,000</Text>
              </View>
              <View style={styles.itemizedRow}>
                <Text style={styles.itemizedName}>Royal Entry Arch Gate with Flowers</Text>
                <Text style={styles.itemizedPrice}>₹ 18,000</Text>
              </View>
              <View style={styles.itemizedRow}>
                <Text style={styles.itemizedName}>Pathway Chandeliers & Fairy Lighting</Text>
                <Text style={styles.itemizedPrice}>₹ 12,000</Text>
              </View>
              <View style={styles.itemizedRow}>
                <Text style={styles.itemizedName}>Customized LED Welcome Board</Text>
                <Text style={styles.itemizedPrice}>₹ 4,000</Text>
              </View>
              <View style={styles.itemizedRow}>
                <Text style={styles.itemizedName}>2x Extra Brass Flower Pillars</Text>
                <Text style={styles.itemizedPrice}>₹ 6,000</Text>
              </View>
              <View style={styles.itemizedRow}>
                <Text style={styles.itemizedName}>On-site Team Coordination & Setup</Text>
                <Text style={styles.itemizedPrice}>₹ 10,000</Text>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Original Quotation</Text>
                <Text style={styles.summaryValue}>₹ 85,000</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryDiscountLabel}>Negotiated Discount</Text>
                <Text style={styles.summaryDiscountValue}>- ₹ 10,000</Text>
              </View>
              <View style={[styles.summaryRow, styles.finalAgreedSummaryRow]}>
                <Text style={styles.finalSummaryLabel}>Final Negotiated Price</Text>
                <Text style={styles.finalSummaryValue}>₹ 75,000</Text>
              </View>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setIsDetailsModalVisible(false);
                  handleProceedToBooking();
                }}
              >
                <Text style={styles.modalConfirmBtnText}>Accept & Proceed to Book (₹ 75,000)</Text>
              </TouchableOpacity>
            </ScrollView>
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
  handshakeGraphicBox: {
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

  // 1. Vendor Profile Card
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

  // 2. Meeting Status Bar
  meetingStatusBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 6,
  },
  statusSectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
    paddingLeft: 6,
  },
  statusDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  statusIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  statusTextCol: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusSubtitle: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },

  // 3. Vendor's Quotation Card
  quotationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  quotationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quotationHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  quotationDateText: {
    fontSize: 11,
    color: '#64748B',
  },
  quotationAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  quotationAmountCol: {
    flex: 1,
  },
  quotationAmountLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  quotationAmountValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E53935',
    letterSpacing: -0.2,
  },
  viewDetailsBtn: {
    borderWidth: 1.2,
    borderColor: '#E53935',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E53935',
  },
  inclusionsWrapper: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  inclusionsLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  inclusionsList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  inclusionText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  plusMoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E53935',
    marginLeft: 2,
  },

  // 4. Negotiation Chat History Stream
  chatStreamContainer: {
    marginBottom: 14,
    gap: 12,
  },
  chatMessageRowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 40,
  },
  vendorAvatarBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#320B16',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  vendorAvatarBubbleText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#FBBF24',
    lineHeight: 7,
  },
  vendorAvatarBubbleSub: {
    fontSize: 4.5,
    fontWeight: '700',
    color: '#FBBF24',
    lineHeight: 5,
  },
  messageBubbleLeft: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
  },
  messageTextLeft: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1E293B',
  },
  messageTimeLeft: {
    fontSize: 10,
    color: '#64748B',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  chatMessageRowRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: 40,
  },
  messageBubbleRight: {
    backgroundColor: '#FFE4E8',
    borderRadius: 16,
    borderTopRightRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
  },
  messageTextRight: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1E293B',
  },
  messageMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageTimeRight: {
    fontSize: 10,
    color: '#64748B',
  },
  userAvatarBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
    marginTop: 2,
    backgroundColor: '#E2E8F0',
  },

  // 5. Final Agreed Amount Card
  finalAgreedCard: {
    backgroundColor: '#FFF5F7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFE4E8',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  finalDocIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#FFE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  finalAmountCol: {
    flex: 1,
  },
  finalAmountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  finalAmountValue: {
    fontSize: 21,
    fontWeight: '800',
    color: '#E53935',
    letterSpacing: -0.3,
  },
  agreedBadgeContainer: {
    alignItems: 'flex-end',
  },
  agreedGreenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 3,
  },
  agreedGreenText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  agreedTimestampText: {
    fontSize: 9.5,
    color: '#64748B',
  },

  // 6. Proceed to Booking Button
  proceedBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E5093A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    marginTop: 4,
  },
  modalVendorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalEventDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  itemizedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemizedName: {
    fontSize: 13,
    color: '#334155',
  },
  itemizedPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  summaryDiscountLabel: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
  },
  summaryDiscountValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  finalAgreedSummaryRow: {
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  finalSummaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  finalSummaryValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#E53935',
  },
  modalConfirmBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
