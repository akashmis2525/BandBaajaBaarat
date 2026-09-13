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
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const HelpSupportScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs: FaqItem[] = [
    {
      id: 'faq1',
      question: 'How do I book a service?',
      answer:
        'Browse our verified wedding services from the Services tab, select your preferred vendor (e.g. Dhol, Band Baaja, DJ), choose your event date & time window, review pricing and pay securely.',
    },
    {
      id: 'faq2',
      question: 'Can I cancel or reschedule my booking?',
      answer:
        'Yes! You can reschedule or cancel any booking from "My Bookings" -> "Booking Details" with free cancellation up to 48 hours before the event.',
    },
    {
      id: 'faq3',
      question: 'How do I get a refund?',
      answer:
        'Upon cancellation, 100% refund is initiated automatically to your original payment method (UPI/Card/Bank) within 2-4 business hours.',
    },
    {
      id: 'faq4',
      question: 'What payment methods are accepted?',
      answer:
        'We support Google Pay, PhonePe, Paytm, all major UPI apps, Visa, Mastercard, RuPay, Net Banking across 30+ banks, and Wallets.',
    },
    {
      id: 'faq5',
      question: 'How do I contact a vendor?',
      answer:
        'Once booked, you can directly call or live chat with the vendor from the Chat tab or Booking Details page.',
    },
  ];

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('ProfileMain');
    }
  };

  const handleCall = () => {
    Alert.alert(
      'Call Helpdesk',
      'Connecting to Band Baaja Baarat Support at +91 81206 52523...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => {} },
      ]
    );
  };

  const handleWhatsApp = () => {
    Alert.alert(
      'WhatsApp Support',
      'Opening WhatsApp chat with our dedicated wedding concierge...',
      [{ text: 'Open WhatsApp', onPress: () => {} }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleEmail = () => {
    Alert.alert(
      'Email Support',
      'Write to us at support@bandbaajabaarat.in\nWe reply within 24 hours.',
      [{ text: 'Send Email', onPress: () => {} }, { text: 'Cancel', style: 'cancel' }]
    );
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
            Help & <Text style={styles.headerTitleMaroon}>Support</Text>
          </Text>
          <Text style={styles.headerSubtitle}>We're here to help you anytime</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Your</Text>
          <Text style={styles.scriptBadgeMid}>Events</Text>
          <Text style={styles.scriptBadgeSub}>Our</Text>
          <Text style={styles.scriptBadgeBot}>Support ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#8E7C80" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help (e.g. booking, payment, refund...)"
            placeholderTextColor="#A08C90"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#8E7C80" />
            </TouchableOpacity>
          )}
        </View>

        {/* Need Immediate Help? Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Need Immediate Help?</Text>
            <Text style={styles.heroSubtitle}>
              Get quick assistance for your bookings and events.
            </Text>
          </View>

          {/* Support Avatar Visual */}
          <View style={styles.supportGraphicBox}>
            <View style={styles.agentAvatarCircle}>
              <Text style={{ fontSize: 32 }}>👩‍💼</Text>
              <View style={styles.headsetMini}>
                <Ionicons name="headset" size={14} color="#8A072D" />
              </View>
            </View>
            <View style={styles.chatSpeechBubble}>
              <Text style={styles.chatDots}>•••</Text>
            </View>
          </View>
        </View>

        {/* Quick Help Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Quick Help', 'Select any topic to get instant support.')}
          >
            <View style={styles.viewAllRow}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={13} color="#8A072D" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.quickHelpGrid}>
          {/* 1. Booking Related */}
          <TouchableOpacity
            style={styles.quickHelpCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Bookings')}
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="calendar-outline" size={18} color="#8A072D" />
            </View>
            <Text style={styles.quickCardText}>Booking{'\n'}Related</Text>
          </TouchableOpacity>

          {/* 2. Payment Issues */}
          <TouchableOpacity
            style={styles.quickHelpCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('SavedPaymentMethods')}
          >
            <View style={styles.quickIconCircle}>
              <FontAwesome5 name="rupee-sign" size={16} color="#8A072D" />
            </View>
            <Text style={styles.quickCardText}>Payment{'\n'}Issues</Text>
          </TouchableOpacity>

          {/* 3. Cancellation & Refunds */}
          <TouchableOpacity
            style={styles.quickHelpCard}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                'Cancellation & Refunds',
                '100% Free Cancellation up to 48 hours before the event date with instant full refund.'
              )
            }
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="close-circle-outline" size={18} color="#8A072D" />
            </View>
            <Text style={styles.quickCardText}>Cancellation{'\n'}& Refunds</Text>
          </TouchableOpacity>

          {/* 4. Account Support */}
          <TouchableOpacity
            style={styles.quickHelpCard}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('ProfileMain')}
          >
            <View style={styles.quickIconCircle}>
              <Ionicons name="person-outline" size={18} color="#8A072D" />
            </View>
            <Text style={styles.quickCardText}>Account{'\n'}Support</Text>
          </TouchableOpacity>
        </View>

        {/* Frequently Asked Questions Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'All FAQs',
                'Have more questions? Call our 24/7 helpdesk at +91 81206 52523.'
              )
            }
          >
            <View style={styles.viewAllRow}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={13} color="#8A072D" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.faqList}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <TouchableOpacity
                key={faq.id}
                style={styles.faqCard}
                activeOpacity={0.8}
                onPress={() => setExpandedFaq(isExpanded ? null : faq.id)}
              >
                <View style={styles.faqTopRow}>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                    size={16}
                    color="#8A072D"
                  />
                </View>

                {isExpanded && (
                  <View style={styles.faqAnswerWrapper}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contact Us Section */}
        <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Contact Us</Text>

        <View style={styles.contactUsRow}>
          {/* 1. Call Us */}
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.8}
            onPress={handleCall}
          >
            <View style={styles.contactIconCircle}>
              <Ionicons name="call" size={18} color="#8A072D" />
            </View>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactPrimaryText}>+91 81206 52523</Text>
            <Text style={styles.contactSubText}>Mon - Sat, 9 AM - 9 PM</Text>
          </TouchableOpacity>

          {/* 2. WhatsApp */}
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.8}
            onPress={handleWhatsApp}
          >
            <View style={styles.contactIconCircle}>
              <Ionicons name="logo-whatsapp" size={18} color="#8A072D" />
            </View>
            <Text style={styles.contactTitle}>WhatsApp</Text>
            <Text style={styles.contactPrimaryText}>Chat with us</Text>
            <Text style={styles.contactSubText}>Get quick support</Text>
          </TouchableOpacity>

          {/* 3. Email Us */}
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.8}
            onPress={handleEmail}
          >
            <View style={styles.contactIconCircle}>
              <Ionicons name="mail" size={18} color="#8A072D" />
            </View>
            <Text style={styles.contactTitle}>Email Us</Text>
            <Text style={styles.contactPrimaryText} numberOfLines={1}>
              support@bandbaajabaarat.in
            </Text>
            <Text style={styles.contactSubText}>We usually reply within 24 hrs</Text>
          </TouchableOpacity>
        </View>

        {/* We're Always Here for You Banner */}
        <View style={styles.bottomGuaranteeBanner}>
          <View style={styles.guaranteeShieldCircle}>
            <Ionicons name="shield-checkmark" size={22} color="#8A072D" />
          </View>

          <View style={styles.guaranteeTextCol}>
            <Text style={styles.guaranteeTitle}>We're Always Here for You</Text>
            <Text style={styles.guaranteeSubtitle}>
              Our support team is committed to making your event experience smooth and memorable.
            </Text>
          </View>

          <View style={styles.scriptStamp}>
            <Text style={styles.scriptStampLine1}>Happier</Text>
            <Text style={styles.scriptStampLine2}>Events</Text>
            <Text style={styles.scriptStampLine3}>Together ♡</Text>
          </View>
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
  scriptBadgeSub: {
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

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBDCD5',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 11.5,
    color: '#1A040A',
  },

  // Hero Banner
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 14,
    gap: 10,
  },
  heroTextCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 10,
    color: '#6E5C60',
    lineHeight: 14,
  },
  supportGraphicBox: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 55,
  },
  agentAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headsetMini: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  chatSpeechBubble: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#F0D4CB',
  },
  chatDots: {
    fontSize: 9,
    color: '#8A072D',
    fontWeight: '800',
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Quick Help Grid
  quickHelpGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickHelpCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1A040A',
    textAlign: 'center',
    lineHeight: 12,
  },

  // FAQ List
  faqList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    overflow: 'hidden',
  },
  faqCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EAE4',
  },
  faqTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A040A',
    flex: 1,
    marginRight: 8,
  },
  faqAnswerWrapper: {
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#FAF0EB',
  },
  faqAnswerText: {
    fontSize: 10.5,
    color: '#68595D',
    lineHeight: 15,
  },

  // Contact Us
  contactUsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  contactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  contactTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A040A',
  },
  contactPrimaryText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#8A072D',
    textAlign: 'center',
  },
  contactSubText: {
    fontSize: 7.5,
    color: '#736064',
    textAlign: 'center',
    marginTop: 1,
  },

  // Bottom Guarantee
  bottomGuaranteeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5DDD3',
    padding: 12,
    gap: 10,
  },
  guaranteeShieldCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeTextCol: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A072D',
  },
  guaranteeSubtitle: {
    fontSize: 9,
    color: '#6E5C60',
    marginTop: 1,
    lineHeight: 12,
  },
  scriptStamp: {
    alignItems: 'flex-end',
  },
  scriptStampLine1: {
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 10,
  },
  scriptStampLine2: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptStampLine3: {
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 10,
  },
});
