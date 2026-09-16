import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalDialog } from '../../components/RoyalDialog';
import { api, ApiLead } from '../../services/api';

interface VendorLeadsScreenProps {
  navigation?: any;
  onBack?: () => void;
}

interface Lead {
  id: string;
  customerName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venueCity: string;
  guestCount: string;
  budgetRange: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  timeAgo: string;
  notes: string;
}

export const VendorLeadsScreen: React.FC<VendorLeadsScreenProps> = ({
  navigation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'all' | 'new' | 'contacted' | 'quoted'>('all');

  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<{
    visible: boolean;
    type?: 'success' | 'warning' | 'info' | 'error' | 'royal';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    highlightText?: string;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showDialog = (config: {
    type?: 'success' | 'warning' | 'info' | 'error' | 'royal';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    highlightText?: string;
  }) => {
    setDialogConfig({ ...config, visible: true });
  };

  const hideDialog = () => {
    setDialogConfig((prev) => ({ ...prev, visible: false }));
  };

  const [leads, setLeads] = useState<Lead[]>([]);

  React.useEffect(() => {
    api
      .vendorLeads(selectedTab === 'all' ? undefined : selectedTab)
      .then((res) => {
        setLeads(
          res.items.map((l: ApiLead) => ({
            id: l.id,
            customerName: l.customerName,
            phone: l.phone,
            eventType: l.eventType,
            eventDate: l.eventDate,
            venueCity: l.venueCity,
            guestCount: l.guestCount,
            budgetRange: l.budgetRange,
            status: l.status,
            timeAgo: l.timeAgo,
            notes: l.notes,
          })),
        );
      })
      .catch(() => undefined);
  }, [selectedTab]);

  const filteredLeads =
    selectedTab === 'all'
      ? leads
      : leads.filter((l) => l.status === selectedTab);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboard');
    }
  };

  const handleAcceptLead = (lead: Lead) => {
    showDialog({
      type: 'royal',
      title: 'Lead Accepted! ⚡',
      message: `You are connected with ${lead.customerName} for their ${lead.eventDate} wedding (${lead.venueCity}).`,
      confirmText: 'Create Custom Quote',
      cancelText: 'View Details',
      highlightText: `Estimated Budget: ${lead.budgetRange}`,
      onCancel: hideDialog,
      onConfirm: () => {
        hideDialog();
        if (navigation?.navigate) {
          navigation.navigate('VendorCreateQuotation', {
            leadId: lead.id,
            customerName: lead.customerName,
            eventDate: lead.eventDate,
            budget: lead.budgetRange,
          });
        }
      },
    });
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
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Customer <Text style={styles.screenTitleHighlight}>Leads ({leads.length})</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Verified inquiries in Indore & MP matching your category
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="flash" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Live</Text>
            <Text style={styles.decorativeLine2}>Leads</Text>
            <Text style={styles.decorativeLine3}>Verified ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <View style={styles.filterTabsRow}>
          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[styles.filterTabText, selectedTab === 'all' && styles.filterTabTextActive]}>
              All ({leads.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'new' && styles.filterTabActive]}
            onPress={() => setSelectedTab('new')}
          >
            <Text style={[styles.filterTabText, selectedTab === 'new' && styles.filterTabTextActive]}>
              ⚡ New (2)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'contacted' && styles.filterTabActive]}
            onPress={() => setSelectedTab('contacted')}
          >
            <Text style={[styles.filterTabText, selectedTab === 'contacted' && styles.filterTabTextActive]}>
              💬 In Chat (1)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'quoted' && styles.filterTabActive]}
            onPress={() => setSelectedTab('quoted')}
          >
            <Text style={[styles.filterTabText, selectedTab === 'quoted' && styles.filterTabTextActive]}>
              📄 Quoted (1)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Leads List */}
        <View style={styles.leadsList}>
          {filteredLeads.map((lead) => (
            <View key={lead.id} style={styles.leadCard}>
              <View style={styles.leadCardHeader}>
                <View style={styles.leadAvatarCircle}>
                  <Text style={{ fontSize: 16 }}>💍</Text>
                </View>
                <View style={styles.leadNameCol}>
                  <Text style={styles.leadCustomerName}>{lead.customerName}</Text>
                  <Text style={styles.leadTimeText}>{lead.timeAgo} • {lead.venueCity}</Text>
                </View>
                <View
                  style={[
                    styles.leadStatusPill,
                    lead.status === 'new'
                      ? styles.statusNew
                      : lead.status === 'quoted'
                      ? styles.statusQuoted
                      : styles.statusContacted,
                  ]}
                >
                  <Text
                    style={[
                      styles.leadStatusPillText,
                      lead.status === 'new'
                        ? styles.statusNewText
                        : lead.status === 'quoted'
                        ? styles.statusQuotedText
                        : styles.statusContactedText,
                    ]}
                  >
                    {lead.status === 'new' ? '★ NEW INQUIRY' : lead.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.leadDivider} />

              <View style={styles.leadInfoGrid}>
                <View style={styles.leadInfoRow}>
                  <Ionicons name="sparkles-outline" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.leadInfoLabel}>Event:</Text>
                  <Text style={styles.leadInfoValue}>{lead.eventType}</Text>
                </View>

                <View style={styles.leadInfoRow}>
                  <Ionicons name="calendar-outline" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.leadInfoLabel}>Date:</Text>
                  <Text style={styles.leadInfoValue}>{lead.eventDate}</Text>
                </View>

                <View style={styles.leadInfoRow}>
                  <Ionicons name="cash-outline" size={14} color="#16A34A" style={{ marginRight: 6 }} />
                  <Text style={styles.leadInfoLabel}>Budget:</Text>
                  <Text style={[styles.leadInfoValue, { color: '#16A34A', fontWeight: '800' }]}>
                    {lead.budgetRange}
                  </Text>
                </View>

                <View style={styles.leadInfoRow}>
                  <Ionicons name="people-outline" size={14} color="#8A072D" style={{ marginRight: 6 }} />
                  <Text style={styles.leadInfoLabel}>Guests:</Text>
                  <Text style={styles.leadInfoValue}>{lead.guestCount}</Text>
                </View>
              </View>

              <View style={styles.leadNotesBox}>
                <Text style={styles.leadNotesText}>"{lead.notes}"</Text>
              </View>

              <View style={styles.leadActionsRow}>
                <TouchableOpacity
                  style={styles.chatActionBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (navigation?.navigate) {
                      navigation.navigate('ChatMain');
                    }
                  }}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={15} color="#8A072D" style={{ marginRight: 4 }} />
                  <Text style={styles.chatActionBtnText}>Chat with Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quoteActionBtn}
                  activeOpacity={0.85}
                  onPress={() => handleAcceptLead(lead)}
                >
                  <Ionicons name="document-text" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.quoteActionBtnText}>Send Quote</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

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
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
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
    color: '#8A072D',
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: '#556987',
    marginTop: 2,
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
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine2: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8A072D',
    lineHeight: 10,
  },
  decorativeLine3: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#8A072D',
    lineHeight: 10,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9FB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Filter Tabs
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#8A072D',
  },
  filterTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#8A072D',
    fontWeight: '700',
  },

  // Leads List
  leadsList: {
    gap: 14,
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  leadCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  leadNameCol: {
    flex: 1,
  },
  leadCustomerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  leadTimeText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  leadStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  leadStatusPillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  statusNew: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  statusNewText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D81B60',
  },
  statusContacted: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statusContactedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  statusQuoted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  statusQuotedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
  },

  leadDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  leadInfoGrid: {
    gap: 6,
    marginBottom: 8,
  },
  leadInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadInfoLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    width: 60,
  },
  leadInfoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  leadNotesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  leadNotesText: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
  },

  leadActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  chatActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  chatActionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  quoteActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A072D',
    borderRadius: 10,
    paddingVertical: 9,
  },
  quoteActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
