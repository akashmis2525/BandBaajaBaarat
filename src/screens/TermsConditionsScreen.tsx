import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';

interface TermSection {
  id: string;
  number: string;
  title: string;
  preview: string;
  details?: string;
}

const termsData: TermSection[] = [
  {
    id: '01',
    number: '01',
    title: 'Acceptance of Terms',
    preview: 'By using Band Baaja Baarat, you agree to these Terms & Conditions.',
    details:
      'By accessing or using our mobile application, website, and associated wedding services, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access or use our services.',
  },
  {
    id: '02',
    number: '02',
    title: 'About the App',
    preview:
      'Band Baaja Baarat is a platform to help you discover, connect and book event service providers.',
    details:
      "Band Baaja Baarat operates as India's premier celebration services marketplace connecting customers with verified vendors including Dhol teams, Brass Bands, DJs, Caterers, Venues, Photographers, and Decorators.",
  },
  {
    id: '03',
    number: '03',
    title: 'User Responsibilities',
    preview:
      'You agree to provide accurate information and use the app for lawful purposes only.',
    details:
      'Users must maintain accurate account information, safeguard account credentials, respect vendors and community members, and ensure all bookings comply with local laws and noise regulations.',
  },
  {
    id: '04',
    number: '04',
    title: 'Bookings & Payments',
    preview:
      'All bookings, payments and cancellations are subject to our policies and vendor terms.',
    details:
      'Bookings require confirmation and advance payment as indicated during checkout. Payment processing is secured with 256-bit encryption. Pricing is transparent and all taxes and service charges are clearly displayed.',
  },
  {
    id: '05',
    number: '05',
    title: 'Cancellations & Refunds',
    preview:
      'Refunds (if applicable) will be processed as per our Cancellation & Refund Policy.',
    details:
      'Cancellations made more than 7 days prior to the event date are eligible for up to 90% refund. Cancellations made 3-7 days prior receive up to 50% refund. Cancellations within 48 hours are non-refundable due to vendor allocation.',
  },
  {
    id: '06',
    number: '06',
    title: 'Intellectual Property',
    preview:
      'All content, logos and branding on the app are the property of Band Baaja Baarat and may not be used without permission.',
    details:
      'All trademarks, service marks, designs, text, graphics, and code are the exclusive intellectual property of Band Baaja Baarat and its licensors.',
  },
  {
    id: '07',
    number: '07',
    title: 'Limitation of Liability',
    preview:
      'We are not liable for any direct or indirect loss arising from the use of our app or third-party services.',
    details:
      'While we thoroughly verify vendors, Band Baaja Baarat is not liable for indirect, incidental, or consequential damages resulting from vendor performance, force majeure events, or unforeseen weather conditions.',
  },
  {
    id: '08',
    number: '08',
    title: 'Changes to Terms',
    preview:
      'We may update these Terms & Conditions from time to time. Continued use of the app means you accept the revised terms.',
    details:
      'We reserve the right to modify these terms at any time. We will notify you of material changes via app notifications or email. Your continued use constitutes acceptance.',
  },
  {
    id: '09',
    number: '09',
    title: 'Contact Us',
    preview:
      'If you have any questions, please contact us at support@bandbaajabaarat.com',
    details:
      'For legal inquiries, dispute resolution, or questions about these terms, reach our support team 24/7 at support@bandbaajabaarat.com or call +91 97133 32997.',
  },
];

export const TermsConditionsScreen: React.FC<{
  navigation?: any;
  onBack?: () => void;
}> = ({ navigation, onBack }) => {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Settings');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
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
              Terms & <Text style={styles.screenTitleHighlight}>Conditions</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Please read our terms before using the app
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.docGraphicBox}>
            <Ionicons name="document-text" size={16} color="#D81B60" />
            <View style={styles.docShieldBadge}>
              <Ionicons name="shield-checkmark-sharp" size={8} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Together</Text>
            <Text style={styles.decorativeLine2}>For Happier</Text>
            <Text style={styles.decorativeLine3}>Events ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Banner */}
        <View style={styles.topBannerCard}>
          <View style={styles.docIconCircle}>
            <Ionicons name="document-text-outline" size={22} color="#D81B60" />
          </View>
          <View style={styles.topBannerTextCol}>
            <Text style={styles.topBannerTitle}>Fair Use. Better Experiences.</Text>
            <Text style={styles.topBannerSubtitle}>
              Our terms help us keep the platform safe, trusted and enjoyable for everyone.
            </Text>
          </View>
        </View>

        {/* 9 Numbered Terms Cards */}
        <View style={styles.termsList}>
          {termsData.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.termCard,
                  isExpanded && styles.termCardExpanded,
                ]}
                activeOpacity={0.8}
                onPress={() => toggleExpand(item.id)}
              >
                <View style={styles.termCardHeader}>
                  {/* Number Badge */}
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberBadgeText}>{item.number}</Text>
                  </View>

                  {/* Title & Preview */}
                  <View style={styles.termTextCol}>
                    <Text style={styles.termTitle}>{item.title}</Text>
                    <Text style={styles.termPreview}>{item.preview}</Text>
                  </View>

                  {/* Chevron Icon */}
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#4A5568"
                    style={styles.chevronIcon}
                  />
                </View>

                {/* Expanded Details */}
                {isExpanded && item.details && (
                  <View style={styles.termDetailsBox}>
                    <Text style={styles.termDetailsText}>{item.details}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Community Card */}
        <View style={styles.bottomCommunityCard}>
          <View style={styles.handshakeCircle}>
            <MaterialCommunityIcons name="handshake" size={24} color="#D81B60" />
          </View>

          <View style={styles.bottomCommunityTextCol}>
            <Text style={styles.communityTitle}>
              Thank you for being a part of our community!
            </Text>
            <Text style={styles.communitySubtitle}>
              Together, we make every celebration special.
            </Text>
          </View>

          <Ionicons
            name="heart-outline"
            size={26}
            color="#FCA5A5"
            style={styles.heartIcon}
          />
        </View>
      </ScrollView>
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
    paddingBottom: 12,
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
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1B1F',
    letterSpacing: -0.3,
  },
  screenTitleHighlight: {
    color: '#D81B60',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#556987',
    marginTop: 2,
    fontWeight: '400',
  },
  decorativeTag: {
    backgroundColor: '#FDECEF',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  docGraphicBox: {
    position: 'relative',
    marginRight: 6,
  },
  docShieldBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tagTextCol: {
    alignItems: 'center',
  },
  decorativeLine1: {
    fontSize: 10,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 12,
  },
  decorativeLine2: {
    fontSize: 10,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 12,
  },
  decorativeLine3: {
    fontSize: 9,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 11,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  topBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
    marginBottom: 16,
  },
  docIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topBannerTextCol: {
    flex: 1,
  },
  topBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 3,
  },
  topBannerSubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  termsList: {
    gap: 10,
  },
  termCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  termCardExpanded: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFC',
  },
  termCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D81B60',
  },
  termTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  termTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 2,
  },
  termPreview: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  termDetailsBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  termDetailsText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    fontWeight: '400',
  },
  bottomCommunityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
    marginTop: 20,
  },
  handshakeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bottomCommunityTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  communityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 3,
    lineHeight: 17,
  },
  communitySubtitle: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  heartIcon: {
    marginLeft: 4,
  },
});
