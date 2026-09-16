import React, { useState, useRef } from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';
import { api, ApiMessage, ApiVendor } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'vendor' | 'user';
  text: string;
  time: string;
  read?: boolean;
  hasMeetingAction?: boolean;
  hasQuotationAction?: boolean;
}

export const ChatScreen: React.FC<{ navigation?: any; onBack?: () => void }> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [vendorInfo, setVendorInfo] = useState<{
    name: string;
    rating: string;
    reviews: string;
    experience: string;
  }>({
    name: 'Vendor',
    rating: '4.6',
    reviews: '210',
    experience: '5+ Years',
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await api.conversations();
        let id = list.items[0]?._id;
        if (!id) {
          const vendors = await api.vendors({ limit: '1', sort: 'rating' });
          if (vendors.items[0]) {
            const opened = await api.openConversation(vendors.items[0].id);
            id = opened.conversation._id;
            if (mounted && opened.vendor) {
              setVendorInfo({
                name: opened.vendor.businessName || opened.vendor.name,
                rating: String(opened.vendor.rating),
                reviews: String(opened.vendor.reviewsCount),
                experience: opened.vendor.experienceText,
              });
            }
          }
        } else if (list.items[0].vendorProfile) {
          const v = list.items[0].vendorProfile as ApiVendor;
          setVendorInfo({
            name: v.businessName || v.name,
            rating: String(v.rating),
            reviews: String(v.reviewsCount),
            experience: v.experienceText || '5+ Years',
          });
        }
        if (!id) return;
        setConversationId(id);
        const msgs = await api.messages(id);
        if (mounted) {
          setMessages(
            msgs.items.map((m: ApiMessage) => ({
              id: m.id,
              sender: m.sender,
              text: m.text,
              time: m.time,
              read: m.read,
              hasMeetingAction: m.hasMeetingAction,
              hasQuotationAction: m.hasQuotationAction,
            })),
          );
        }
      } catch {
        // keep empty chat chrome
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    const optimistic: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInputText('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      let id = conversationId;
      if (!id) {
        const vendors = await api.vendors({ limit: '1', sort: 'rating' });
        if (!vendors.items[0]) return;
        const opened = await api.openConversation(vendors.items[0].id);
        id = opened.conversation._id;
        setConversationId(id);
      }
      const saved = await api.sendMessage(id, text);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...saved.message } : m)),
      );
    } catch {
      // keep optimistic message visible
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
            Chat with <Text style={styles.headerTitleMaroon}>Vendor</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            Discuss your event details, requirements and get quick responses
          </Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Better</Text>
          <Text style={styles.scriptBadgeMid}>Conversations</Text>
          <Text style={styles.scriptBadgeSub}>Brighter</Text>
          <Text style={styles.scriptBadgeBot}>Celebrations ♡</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Vendor Profile Card */}
        <View style={styles.vendorTopCard}>
          {/* Vendor Emblem Avatar */}
          <View style={styles.vendorAvatarCircle}>
            <FontAwesome5 name="crown" size={11} color="#FBBF24" style={{ marginBottom: 1 }} />
            <FontAwesome5 name="drum" size={14} color="#FBBF24" />
            <Text style={styles.vendorAvatarText}>Royal Beats</Text>
            <Text style={styles.vendorAvatarSubText}>DHOL GROUP</Text>
          </View>

          {/* Details */}
          <View style={styles.vendorInfoCol}>
            <View style={styles.vendorTitleRow}>
              <Text style={styles.vendorTitleName}>{vendorInfo.name}</Text>
              <Ionicons name="checkmark-circle" size={14} color="#8A072D" />
            </View>

            <View style={styles.ratingAndExpRow}>
              <Ionicons name="star" size={11} color="#E59819" />
              <Text style={styles.ratingScore}>4.6</Text>
              <Text style={styles.reviewsCountText}>(210 reviews)</Text>
              <Text style={styles.dividerPipe}>|</Text>
              <Text style={styles.expText}>5+ Years</Text>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={11} color="#8A072D" />
              <Text style={styles.locationText}>Indore, Madhya Pradesh</Text>
            </View>

            <View style={styles.onlineStatusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online now</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 6, alignItems: 'flex-end' }}>
            <TouchableOpacity
              style={styles.scheduleMeetingTopBtn}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('ScheduleMeeting')}
            >
              <Ionicons name="calendar" size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.scheduleMeetingTopBtnText}>Schedule Meeting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewProfileBtn}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('RateReview')}
            >
              <Text style={styles.viewProfileBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Stream */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatScroll}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {/* Date Pill */}
          <View style={styles.datePillContainer}>
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>11 Nov 2026</Text>
            </View>
          </View>

          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowVendor,
                ]}
              >
                {!isUser && (
                  <View style={styles.vendorMiniAvatar}>
                    <FontAwesome5 name="crown" size={7} color="#FBBF24" />
                    <FontAwesome5 name="drum" size={9} color="#FBBF24" />
                    <Text style={styles.miniAvatarText}>Royal Beats</Text>
                  </View>
                )}

                <View style={styles.bubbleContainer}>
                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.bubbleUser : styles.bubbleVendor,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isUser ? styles.messageTextUser : styles.messageTextVendor,
                      ]}
                    >
                      {msg.text}
                    </Text>

                    {msg.hasMeetingAction && (
                      <TouchableOpacity
                        style={styles.inlineScheduleBtn}
                        activeOpacity={0.85}
                        onPress={() => navigation?.navigate('ScheduleMeeting')}
                      >
                        <Ionicons name="calendar" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.inlineScheduleBtnText}>Schedule Meeting</Text>
                      </TouchableOpacity>
                    )}

                    {msg.hasQuotationAction && (
                      <TouchableOpacity
                        style={[styles.inlineScheduleBtn, { backgroundColor: '#D81B60', marginTop: 8 }]}
                        activeOpacity={0.85}
                        onPress={() => navigation?.navigate('NegotiatePrice')}
                      >
                        <Ionicons name="pricetags" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.inlineScheduleBtnText}>Negotiate Price (₹ 85,000) →</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View
                    style={[
                      styles.metaTimeRow,
                      isUser ? styles.metaTimeRowUser : styles.metaTimeRowVendor,
                    ]}
                  >
                    <Text style={styles.timeText}>{msg.time}</Text>
                    {isUser && (
                      <Ionicons
                        name="checkmark-done"
                        size={13}
                        color={msg.read ? '#3B82F6' : '#8E7C80'}
                        style={{ marginLeft: 3 }}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          })}

          <View style={{ height: 10 }} />
        </ScrollView>

        {/* Quick Action Chips */}
        <View style={styles.quickChipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickChipsScroll}
          >
            {/* Negotiate Price Chip */}
            <TouchableOpacity
              style={[styles.chipBtn, { backgroundColor: '#D81B60', borderColor: '#D81B60' }]}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('NegotiatePrice')}
            >
              <Ionicons name="pricetag" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>Negotiate Price</Text>
            </TouchableOpacity>

            {/* 0. Schedule Meeting */}
            <TouchableOpacity
              style={[styles.chipBtn, styles.chipBtnSchedule]}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('ScheduleMeeting')}
            >
              <Ionicons name="calendar" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.chipTextSchedule}>Schedule Meeting</Text>
            </TouchableOpacity>

            {/* 1. View Booking */}
            <TouchableOpacity
              style={styles.chipBtn}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('BookingDetails')}
            >
              <Ionicons name="calendar-outline" size={13} color="#8A072D" />
              <Text style={styles.chipText}>View Booking</Text>
            </TouchableOpacity>

            {/* 2. Send Images */}
            <TouchableOpacity
              style={styles.chipBtn}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Attach Photos',
                  'Select reference images for decoration or costume style.',
                  [{ text: 'Choose from Gallery' }, { text: 'Cancel', style: 'cancel' }]
                )
              }
            >
              <Ionicons name="images-outline" size={13} color="#8A072D" />
              <Text style={styles.chipText}>Send Images</Text>
            </TouchableOpacity>

            {/* 3. Get Quote */}
            <TouchableOpacity
              style={styles.chipBtn}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Custom Quote Requested',
                  'Request for LED Dhol & special baraat entry songs package sent to Royal Beats Dhol Group.'
                )
              }
            >
              <FontAwesome5 name="rupee-sign" size={11} color="#8A072D" />
              <Text style={styles.chipText}>Get Quote</Text>
            </TouchableOpacity>

            {/* 4. Call Vendor */}
            <TouchableOpacity
              style={styles.chipBtn}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Call Vendor',
                  'Calling Royal Beats Dhol Group at +91 98765 43210...',
                  [{ text: 'Cancel', style: 'cancel' }, { text: 'Call Now' }]
                )
              }
            >
              <Ionicons name="call-outline" size={13} color="#8A072D" />
              <Text style={styles.chipText}>Call Vendor</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bottom Message Input Bar */}
        <View style={styles.inputBarContainer}>
          {/* Paperclip Attachment */}
          <TouchableOpacity
            style={styles.attachmentBtn}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('Share Document / Photo', 'Choose what you want to attach', [
                { text: 'Photo & Video' },
                { text: 'Event Location PDF' },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
          >
            <Ionicons name="attach" size={22} color="#8A072D" />
          </TouchableOpacity>

          {/* Text Input Container */}
          <View style={styles.inputFieldWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="Type your message..."
              placeholderTextColor="#A08C90"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity activeOpacity={0.7} style={styles.emojiBtn}>
              <Ionicons name="happy-outline" size={20} color="#8A072D" />
            </TouchableOpacity>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendBtn}
            activeOpacity={0.85}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 10,
  },
  scriptBadgeMid: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeSub: {
    fontSize: 7.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 9,
  },
  scriptBadgeBot: {
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#8A072D',
    lineHeight: 10,
  },

  // Vendor Profile Card
  vendorTopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0D4CB',
    gap: 10,
  },
  vendorAvatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5D0D10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderWidth: 1.5,
    borderColor: '#FBBF24',
  },
  vendorAvatarText: {
    color: '#FBBF24',
    fontSize: 6.5,
    fontWeight: '800',
    lineHeight: 8,
    marginTop: 1,
  },
  vendorAvatarSubText: {
    color: '#FFFFFF',
    fontSize: 4,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  vendorInfoCol: {
    flex: 1,
    gap: 1.5,
  },
  vendorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendorTitleName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  ratingAndExpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsCountText: {
    fontSize: 8.5,
    color: '#736064',
  },
  dividerPipe: {
    fontSize: 8.5,
    color: '#CBB2A9',
    marginHorizontal: 1,
  },
  expText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#554246',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 9,
    color: '#554246',
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  onlineText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  viewProfileBtn: {
    borderWidth: 1,
    borderColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  viewProfileBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A072D',
  },

  // Chat Scroll
  chatScroll: {
    padding: 12,
    gap: 10,
  },
  datePillContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  datePill: {
    backgroundColor: '#F3E4DC',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  datePillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#736064',
  },

  // Message Bubbles
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowVendor: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  vendorMiniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5D0D10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FBBF24',
    padding: 1,
  },
  miniAvatarText: {
    color: '#FBBF24',
    fontSize: 4,
    fontWeight: '800',
    lineHeight: 5,
  },
  bubbleContainer: {
    maxWidth: '80%',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  bubbleVendor: {
    backgroundColor: '#FDF1EC',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F7DDD2',
  },
  bubbleUser: {
    backgroundColor: '#8A072D',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 11,
    lineHeight: 16,
  },
  messageTextVendor: {
    color: '#1A040A',
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  metaTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaTimeRowVendor: {
    justifyContent: 'flex-start',
  },
  metaTimeRowUser: {
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 8.5,
    color: '#8E7C80',
  },

  // Quick Chips
  quickChipsWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0D4CB',
  },
  quickChipsScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1EC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
    borderWidth: 1,
    borderColor: '#F7D7CA',
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A072D',
  },
  chipBtnSchedule: {
    backgroundColor: '#D81B60',
    borderColor: '#D81B60',
  },
  chipTextSchedule: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scheduleMeetingTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D81B60',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  scheduleMeetingTopBtnText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inlineScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D81B60',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  inlineScheduleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Input Bar
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0D4CB',
    gap: 8,
  },
  attachmentBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F7D7CA',
  },
  inputFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    paddingHorizontal: 12,
  },
  inputField: {
    flex: 1,
    fontSize: 11.5,
    color: '#1A040A',
    paddingVertical: 6,
    maxHeight: 70,
  },
  emojiBtn: {
    padding: 4,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#8A072D',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
