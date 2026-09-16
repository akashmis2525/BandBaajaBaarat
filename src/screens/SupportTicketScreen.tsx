import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, ApiTicket, userMessage } from '../services/api';

interface SupportTicketScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

interface SupportTicket {
  id: string;
  bookingId: string;
  vendorName: string;
  issueType: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  lastReply: string;
}

export const SupportTicketScreen: React.FC<SupportTicketScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'raise' | 'history'>('raise');

  // Form State
  const [selectedBooking, setSelectedBooking] = useState('BBBD126789 - Royal Events & Decor');
  const [issueType, setIssueType] = useState('Payment / Invoice Inquiry');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Tickets History
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  React.useEffect(() => {
    api
      .tickets()
      .then((res) => {
        setTickets(
          res.items.map((t: ApiTicket) => ({
            id: t.id,
            bookingId: t.bookingId || '',
            vendorName: t.vendorName || '',
            issueType: t.issueType,
            subject: t.subject,
            description: t.description,
            status: t.status,
            createdAt: t.createdAt,
            lastReply: t.lastReply,
          })),
        );
      })
      .catch(() => undefined);
  }, []);

  const issueCategories = [
    'Payment / Invoice Inquiry',
    'Vendor Not Responding',
    'Reschedule / Date Change',
    'Cancel & Refund Assistance',
    'Decoration & Setup Quality',
    'Other Celebration Support',
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('HelpSupport');
    }
  };

  const handleCreateTicket = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Incomplete Form', 'Please enter subject and issue description.');
      return;
    }

    api
      .createTicket({
        bookingId: selectedBooking,
        vendorName: 'Royal Events & Decor',
        issueType,
        subject: subject.trim(),
        description: description.trim(),
        isUrgent,
      })
        .then((res) => {
          const created = res.ticket;
          const newTicket: SupportTicket = {
            id: created?.ticketCode || 'TKT-' + Math.floor(10000 + Math.random() * 90000),
          bookingId: selectedBooking,
          vendorName: 'Royal Events & Decor',
          issueType,
          subject: subject.trim(),
          description: description.trim(),
          status: 'Open',
          createdAt: 'Just now',
          lastReply: 'Assigned to BBB priority support team. Response within 2 hours.',
        };
        setTickets((prev) => [newTicket, ...prev]);
        setSubject('');
        setDescription('');
        setActiveTab('history');
        Alert.alert('Ticket Raised Successfully! 🎫', 'Our support team will respond shortly.');
      })
      .catch((err) => Alert.alert('Could not create ticket', userMessage(err)));
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
              Help & <Text style={styles.screenTitleHighlight}>Tickets</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Raise issue or connect with BBB priority support
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="headset" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>24x7</Text>
            <Text style={styles.decorativeLine2}>Support</Text>
            <Text style={styles.decorativeLine3}>Quick Help ♡</Text>
          </View>
        </View>
      </View>

      {/* 2 Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'raise' && styles.tabBtnActive]}
          onPress={() => setActiveTab('raise')}
        >
          <Ionicons
            name="add-circle"
            size={14}
            color={activeTab === 'raise' ? '#E5093A' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.tabBtnText, activeTab === 'raise' && styles.tabBtnTextActive]}>
            Raise New Ticket
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons
            name="receipt"
            size={14}
            color={activeTab === 'history' ? '#E5093A' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.tabBtnText, activeTab === 'history' && styles.tabBtnTextActive]}>
            My Tickets ({tickets.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'raise' && (
          <View>
            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Related Booking</Text>
              <View style={styles.readOnlyField}>
                <Ionicons name="calendar-outline" size={16} color="#D81B60" style={{ marginRight: 8 }} />
                <Text style={styles.readOnlyText}>{selectedBooking}</Text>
              </View>

              <Text style={styles.fieldLabel}>Issue Category</Text>
              <View style={styles.categoriesPills}>
                {issueCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catPill, issueType === cat && styles.catPillActive]}
                    onPress={() => setIssueType(cat)}
                  >
                    <Text style={[styles.catPillText, issueType === cat && styles.catPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Subject</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Brief summary of your inquiry..."
                placeholderTextColor="#94A3B8"
                value={subject}
                onChangeText={setSubject}
              />

              <Text style={styles.fieldLabel}>Detailed Description</Text>
              <TextInput
                style={[styles.inputField, styles.textArea]}
                placeholder="Explain the problem or assistance required from BBB team..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Urgent Toggle */}
              <TouchableOpacity
                style={styles.urgentRow}
                activeOpacity={0.8}
                onPress={() => setIsUrgent(!isUrgent)}
              >
                <View style={[styles.checkbox, isUrgent && styles.checkboxActive]}>
                  {isUrgent && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.urgentTitle}>Mark as High Priority / Urgent</Text>
                  <Text style={styles.urgentSub}>Event is within 48 hours and requires instant attention</Text>
                </View>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.9}
                onPress={handleCreateTicket}
              >
                <Text style={styles.submitBtnText}>Submit Support Ticket</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>

            {/* Quick Contact Box */}
            <View style={styles.quickContactBox}>
              <Ionicons name="logo-whatsapp" size={20} color="#15803D" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.quickContactTitle}>Need Instant Help on WhatsApp?</Text>
                <Text style={styles.quickContactSub}>Chat with our live wedding advisor at +91 98765 43210</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: MY TICKETS HISTORY */}
        {activeTab === 'history' && (
          <View style={styles.ticketsList}>
            {tickets.map((t) => (
              <View key={t.id} style={styles.ticketCard}>
                <View style={styles.ticketCardTop}>
                  <View style={styles.ticketIdPill}>
                    <Text style={styles.ticketIdText}>{t.id}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      t.status === 'Resolved'
                        ? styles.statusResolved
                        : t.status === 'In Progress'
                        ? styles.statusInProgress
                        : styles.statusOpen,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        t.status === 'Resolved'
                          ? { color: '#15803D' }
                          : t.status === 'In Progress'
                          ? { color: '#0284C7' }
                          : { color: '#D97706' },
                      ]}
                    >
                      {t.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketSubject}>{t.subject}</Text>
                <Text style={styles.ticketMeta}>
                  {t.vendorName} • {t.issueType}
                </Text>

                <View style={styles.lastReplyBox}>
                  <Ionicons name="chatbubble-ellipses" size={13} color="#D81B60" style={{ marginRight: 4, marginTop: 1 }} />
                  <Text style={styles.lastReplyText}>{t.lastReply}</Text>
                </View>

                <View style={styles.ticketBottomRow}>
                  <Text style={styles.ticketDateText}>Created: {t.createdAt}</Text>
                  <TouchableOpacity
                    style={styles.chatSupportBtn}
                    onPress={() =>
                      Alert.alert(
                        `Ticket #${t.id} Chat`,
                        `Live chat with BBB Support Officer Priya regarding "${t.subject}".`
                      )
                    }
                  >
                    <Text style={styles.chatSupportBtnText}>View Updates</Text>
                    <Ionicons name="chevron-forward" size={13} color="#E5093A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
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
    paddingBottom: 8,
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
  tagGraphicBox: {
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

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9FB',
    borderRadius: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E5093A',
  },
  tabBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#E5093A',
    fontWeight: '700',
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

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    marginTop: 8,
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readOnlyText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  categoriesPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  catPill: {
    backgroundColor: '#FAF9FB',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catPillActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E5093A',
  },
  catPillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  catPillTextActive: {
    color: '#E5093A',
    fontWeight: '700',
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 12.5,
    color: '#1E293B',
  },
  textArea: {
    height: 80,
  },
  urgentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#E5093A',
    borderColor: '#E5093A',
  },
  urgentTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  urgentSub: {
    fontSize: 10,
    color: '#64748B',
  },
  submitBtn: {
    backgroundColor: '#E5093A',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  quickContactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  quickContactTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803D',
  },
  quickContactSub: {
    fontSize: 10.5,
    color: '#166534',
    marginTop: 1,
  },

  // History Tab
  ticketsList: {
    gap: 10,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ticketCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketIdPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ticketIdText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusResolved: {
    backgroundColor: '#DCFCE7',
  },
  statusInProgress: {
    backgroundColor: '#E0F2FE',
  },
  statusOpen: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ticketSubject: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  ticketMeta: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  lastReplyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7F8',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  lastReplyText: {
    fontSize: 11,
    color: '#1E293B',
    flex: 1,
  },
  ticketBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  ticketDateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  chatSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatSupportBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#E5093A',
  },
});
