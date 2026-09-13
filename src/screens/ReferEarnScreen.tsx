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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

export const ReferEarnScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const referralCode = 'BAND2026';
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const referralHistory = [
    { name: 'Rohit Verma', date: '08 Nov 2026', service: 'Royal Beats Dhol', reward: '₹100', status: 'Completed' },
    { name: 'Pooja Jain', date: '02 Nov 2026', service: 'Click Studio Photography', reward: '₹100', status: 'Completed' },
    { name: 'Vikas Sharma', date: '28 Oct 2026', service: 'Sharma Dhol Group', reward: '₹100', status: 'Completed' },
    { name: 'Ananya Mehta', date: '21 Oct 2026', service: 'Mehndi Artist', reward: '₹100', status: 'Completed' },
    { name: 'Kunal Patel', date: '15 Oct 2026', service: 'DJ Services', reward: '₹100', status: 'Completed' },
    { name: 'Siddharth Rao', date: '12 Nov 2026', service: 'Pending First Booking', reward: '₹0', status: 'Pending' },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ProfileMain');
    }
  };

  const handleCopyCode = () => {
    Alert.alert('Referral Code Copied! 📋', `Referral code '${referralCode}' copied to clipboard.`);
  };

  const handleShare = async (channel?: string) => {
    const shareMessage = `Hey! Plan your wedding with Band Baaja Baarat - India's #1 Wedding Services App. Use my invite code ${referralCode} to get ₹100 OFF on your first Dhol, Band or DJ booking!\n\nDownload: https://bandbaajabaarat.in/refer/${referralCode}`;
    try {
      if (channel === 'whatsapp') {
        Alert.alert('Share on WhatsApp', `Opening WhatsApp with message:\n\n${shareMessage}`);
      } else if (channel === 'sms') {
        Alert.alert('Share via SMS', `Opening SMS draft with code ${referralCode}`);
      } else if (channel === 'email') {
        Alert.alert('Share via Email', `Opening Email composer with invite code ${referralCode}`);
      } else {
        await Share.share({
          message: shareMessage,
          title: 'Band Baaja Baarat Referral Code',
        });
      }
    } catch (error) {
      Alert.alert('Share', `Invite code ${referralCode}`);
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
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1A040A" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>
            Refer & <Text style={styles.headerTitleMaroon}>Earn</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Invite your friends and earn rewards</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Bigger</Text>
          <Text style={styles.scriptBadgeMid}>Celebrations</Text>
          <Text style={styles.scriptBadgeBot}>Together ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Celebration Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextCol}>
            <Text style={styles.shareJoyTag}>SHARE THE JOY ›</Text>
            <Text style={styles.heroMainTitle}>
              Refer Friends{'\n'}& <Text style={styles.heroMainTitleMaroon}>Earn Rewards!</Text>
            </Text>
            <Text style={styles.heroSubText}>
              Let your friends discover amazing wedding services and you both get exciting rewards.
            </Text>
          </View>

          {/* Right Illustration Graphics */}
          <View style={styles.heroVisualCol}>
            <View style={styles.giftIconFloat}>
              <Ionicons name="gift" size={18} color="#8A072D" />
            </View>
            <Image source={Assets.brideGroom} style={styles.heroIllustration} />
            <View style={styles.scriptQuoteBubble}>
              <Text style={styles.scriptQuoteText}>Friends Make{'\n'}Celebrations{'\n'}Brighter ♡</Text>
            </View>
          </View>
        </View>

        {/* Your Referral Code Card */}
        <View style={styles.referralCodeCard}>
          <Text style={styles.cardHeaderLabel}>Your Referral Code</Text>

          {/* Code Container */}
          <View style={styles.codeBoxContainer}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity
              style={styles.copyBtn}
              activeOpacity={0.7}
              onPress={handleCopyCode}
            >
              <Ionicons name="copy-outline" size={16} color="#8A072D" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.shareHintText}>Share this code with your friends</Text>

          {/* Share Now Main Button */}
          <TouchableOpacity
            style={styles.shareNowBtn}
            activeOpacity={0.85}
            onPress={() => handleShare()}
          >
            <Ionicons name="share-social" size={16} color="#FFFFFF" />
            <Text style={styles.shareNowBtnText}>Share Now</Text>
          </TouchableOpacity>

          {/* 5 Quick Share Channel Icons */}
          <View style={styles.quickChannelsRow}>
            {/* WhatsApp */}
            <TouchableOpacity
              style={styles.channelItem}
              activeOpacity={0.8}
              onPress={() => handleShare('whatsapp')}
            >
              <View style={[styles.channelCircle, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.channelLabel}>WhatsApp</Text>
            </TouchableOpacity>

            {/* Share Link */}
            <TouchableOpacity
              style={styles.channelItem}
              activeOpacity={0.8}
              onPress={() => handleShare()}
            >
              <View style={[styles.channelCircle, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="share-social" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.channelLabel}>Share Link</Text>
            </TouchableOpacity>

            {/* SMS */}
            <TouchableOpacity
              style={styles.channelItem}
              activeOpacity={0.8}
              onPress={() => handleShare('sms')}
            >
              <View style={[styles.channelCircle, { backgroundColor: '#EF4444' }]}>
                <Ionicons name="chatbox" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.channelLabel}>SMS</Text>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.channelItem}
              activeOpacity={0.8}
              onPress={() => handleShare('email')}
            >
              <View style={[styles.channelCircle, { backgroundColor: '#64748B' }]}>
                <Ionicons name="mail" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.channelLabel}>Email</Text>
            </TouchableOpacity>

            {/* More */}
            <TouchableOpacity
              style={styles.channelItem}
              activeOpacity={0.8}
              onPress={() => handleShare()}
            >
              <View style={[styles.channelCircle, { backgroundColor: '#E2E8F0' }]}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#475569" />
              </View>
              <Text style={styles.channelLabel}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Rewards Section */}
        <View style={styles.rewardsCard}>
          <Text style={styles.sectionTitle}>Your Rewards</Text>

          <View style={styles.rewardsRow}>
            {/* 1. ₹100 */}
            <View style={styles.rewardCol}>
              <View style={styles.rewardIconCircle}>
                <Ionicons name="gift-outline" size={18} color="#8A072D" />
              </View>
              <Text style={styles.rewardValueText}>₹100</Text>
              <Text style={styles.rewardDescText}>For every successful referral</Text>
            </View>

            {/* 2. Exclusive Offers */}
            <View style={styles.rewardCol}>
              <View style={styles.rewardIconCircle}>
                <MaterialCommunityIcons name="percent-outline" size={18} color="#8A072D" />
              </View>
              <Text style={styles.rewardValueText}>Exclusive Offers</Text>
              <Text style={styles.rewardDescText}>Early access to deals & discounts</Text>
            </View>

            {/* 3. Help Friends */}
            <View style={styles.rewardCol}>
              <View style={styles.rewardIconCircle}>
                <FontAwesome5 name="crown" size={14} color="#8A072D" />
              </View>
              <Text style={styles.rewardValueText}>Help Friends</Text>
              <Text style={styles.rewardDescText}>Make their special day more memorable</Text>
            </View>
          </View>
        </View>

        {/* Your Referral Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Referral Summary</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDetailsModal(true)}
            >
              <View style={styles.viewDetailsRow}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={12} color="#8A072D" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            {/* Friends Invited */}
            <View style={styles.summaryCol}>
              <View style={styles.summaryIconCircle}>
                <Ionicons name="people" size={16} color="#8A072D" />
              </View>
              <View>
                <Text style={styles.summaryValue}>8</Text>
                <Text style={styles.summaryLabel}>Friends Invited</Text>
              </View>
            </View>

            {/* Successful Referrals */}
            <View style={styles.summaryCol}>
              <View style={styles.summaryIconCircle}>
                <Ionicons name="checkmark-circle" size={16} color="#8A072D" />
              </View>
              <View>
                <Text style={styles.summaryValue}>5</Text>
                <Text style={styles.summaryLabel}>Successful{'\n'}Referrals</Text>
              </View>
            </View>

            {/* Total Earned */}
            <View style={styles.summaryCol}>
              <View style={styles.summaryIconCircle}>
                <Ionicons name="gift" size={16} color="#8A072D" />
              </View>
              <View>
                <Text style={styles.summaryValue}>₹500</Text>
                <Text style={styles.summaryLabel}>Total Earned</Text>
              </View>
            </View>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepCol}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Ionicons name="people-outline" size={18} color="#8A072D" style={{ marginVertical: 4 }} />
              <Text style={styles.stepTitle}>Invite</Text>
              <Text style={styles.stepDesc}>Share your code with friends</Text>
            </View>

            <Ionicons name="chevron-forward" size={14} color="#C5B4B8" style={{ marginTop: 22 }} />

            {/* Step 2 */}
            <View style={styles.stepCol}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Ionicons name="checkbox-outline" size={18} color="#8A072D" style={{ marginVertical: 4 }} />
              <Text style={styles.stepTitle}>They Book</Text>
              <Text style={styles.stepDesc}>Your friend completes a booking</Text>
            </View>

            <Ionicons name="chevron-forward" size={14} color="#C5B4B8" style={{ marginTop: 22 }} />

            {/* Step 3 */}
            <View style={styles.stepCol}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Ionicons name="gift-outline" size={18} color="#8A072D" style={{ marginVertical: 4 }} />
              <Text style={styles.stepTitle}>You Earn</Text>
              <Text style={styles.stepDesc}>Get rewards instantly after their booking</Text>
            </View>
          </View>
        </View>

        {/* Bottom Banner: More Friends, More Celebrations */}
        <View style={styles.bottomCelebrationBanner}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={18} color="#8A072D" />
          </View>

          <View style={styles.celebrationTextCol}>
            <Text style={styles.celebrationTitle}>More Friends, More Celebrations!</Text>
            <Text style={styles.celebrationSub}>
              Spread the word and be a part of their special moments.
            </Text>
          </View>

          <View style={styles.scriptCelebrationStamp}>
            <Text style={styles.scriptStampLineA}>Celebrate</Text>
            <Text style={styles.scriptStampLineB}>Together</Text>
            <Text style={styles.scriptStampLineC}>Always ♡</Text>
          </View>
        </View>

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* Referral History Details Modal */}
      <Modal visible={showDetailsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Referral History</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Ionicons name="close" size={24} color="#1A040A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {referralHistory.map((item, idx) => (
                <View key={idx} style={styles.historyRowItem}>
                  <View style={styles.historyIconCircle}>
                    <Ionicons
                      name={item.status === 'Completed' ? 'checkmark-circle' : 'time'}
                      size={18}
                      color={item.status === 'Completed' ? '#16A34A' : '#8A072D'}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 1 }}>
                    <Text style={styles.historyName}>{item.name}</Text>
                    <Text style={styles.historyService}>{item.service}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.historyReward, item.status === 'Completed' && { color: '#16A34A' }]}>
                      +{item.reward}
                    </Text>
                    <Text style={styles.historyStatus}>{item.status}</Text>
                  </View>
                </View>
              ))}
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
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeMid: {
    fontSize: 7,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 8,
  },
  scriptBadgeBot: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },

  scrollContent: {
    padding: 12,
    gap: 12,
  },

  // Hero Banner
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 14,
    overflow: 'hidden',
  },
  heroTextCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  shareJoyTag: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#8A072D',
    letterSpacing: 0.5,
  },
  heroMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
    lineHeight: 20,
  },
  heroMainTitleMaroon: {
    color: '#8A072D',
  },
  heroSubText: {
    fontSize: 9.5,
    color: '#6E5C60',
    lineHeight: 13,
    marginTop: 2,
  },
  heroVisualCol: {
    width: 105,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroIllustration: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
  },
  giftIconFloat: {
    position: 'absolute',
    top: 0,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scriptQuoteBubble: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    alignItems: 'flex-end',
  },
  scriptQuoteText: {
    fontSize: 6.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    textAlign: 'right',
    lineHeight: 8,
  },

  // Referral Code Card
  referralCodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 14,
    gap: 8,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A040A',
  },
  codeBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#F5DDD3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  codeText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#8A072D',
    letterSpacing: 1.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A072D',
  },
  shareHintText: {
    fontSize: 9.5,
    color: '#736064',
    textAlign: 'center',
    marginTop: 2,
  },
  shareNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 12,
    gap: 6,
    marginVertical: 4,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  shareNowBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  quickChannelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  channelItem: {
    alignItems: 'center',
    gap: 4,
  },
  channelCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#554246',
  },

  // Rewards Card
  rewardsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 14,
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
    marginBottom: 8,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  rewardCol: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  rewardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  rewardValueText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A072D',
    textAlign: 'center',
  },
  rewardDescText: {
    fontSize: 8,
    color: '#736064',
    textAlign: 'center',
    lineHeight: 11,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 14,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#1A040A',
  },
  summaryLabel: {
    fontSize: 7.5,
    color: '#736064',
    lineHeight: 9,
  },

  // How It Works
  howItWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 14,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
  },
  stepNumberCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 7.5,
    color: '#736064',
    textAlign: 'center',
    lineHeight: 10,
  },

  // Bottom Celebration Banner
  bottomCelebrationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    gap: 10,
  },
  heartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationTextCol: {
    flex: 1,
  },
  celebrationTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A072D',
  },
  celebrationSub: {
    fontSize: 8.5,
    color: '#6E5C60',
    marginTop: 1,
  },
  scriptCelebrationStamp: {
    alignItems: 'flex-end',
  },
  scriptStampLineA: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptStampLineB: {
    fontSize: 7,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 8,
  },
  scriptStampLineC: {
    fontSize: 8,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 9,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A040A',
  },
  historyRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
    gap: 10,
  },
  historyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  historyService: {
    fontSize: 9.5,
    color: '#554246',
  },
  historyDate: {
    fontSize: 8.5,
    color: '#8E7C80',
  },
  historyReward: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A072D',
  },
  historyStatus: {
    fontSize: 8.5,
    color: '#736064',
  },
});
