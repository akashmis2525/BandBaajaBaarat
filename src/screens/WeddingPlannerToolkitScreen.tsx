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
  Modal,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WeddingPlannerToolkitScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

interface ChecklistTask {
  id: string;
  phase: string;
  task: string;
  completed: boolean;
}

interface GuestItem {
  id: string;
  name: string;
  side: "Bride's Side" | "Groom's Side" | "Friends";
  rsvp: 'Confirmed' | 'Pending' | 'Declined';
  count: number;
}

export const WeddingPlannerToolkitScreen: React.FC<WeddingPlannerToolkitScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'budget' | 'checklist' | 'guests'>('budget');

  // Budget State
  const [totalBudget, setTotalBudget] = useState(1500000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Venue & Mandap', allocated: 600000, spent: 450000, icon: 'business', color: '#8A072D' },
    { id: '2', category: 'Decor & Lighting', allocated: 250000, spent: 180000, icon: 'sparkles', color: '#D81B60' },
    { id: '3', category: 'Dhol, Band & DJ', allocated: 120000, spent: 75000, icon: 'musical-notes', color: '#F59E0B' },
    { id: '4', category: 'Catering & Food', allocated: 350000, spent: 50000, icon: 'restaurant', color: '#10B981' },
    { id: '5', category: 'Bridal Makeup & Mehndi', allocated: 80000, spent: 45000, icon: 'color-palette', color: '#8B5CF6' },
    { id: '6', category: 'Photography & Film', allocated: 100000, spent: 30000, icon: 'camera', color: '#0284C7' },
  ]);

  // Checklist State
  const [checklistTasks, setChecklistTasks] = useState<ChecklistTask[]>([
    { id: 't1', phase: '6 Months Before', task: 'Finalize wedding date and auspicious Muhurat', completed: true },
    { id: 't2', phase: '6 Months Before', task: 'Book dream venue & banquet hall', completed: true },
    { id: 't3', phase: '3 Months Before', task: 'Hire Top Rated Dhol Group & Brass Band', completed: true },
    { id: 't4', phase: '3 Months Before', task: 'Finalize Stage & Mandap floral theme with Decorator', completed: true },
    { id: 't5', phase: '1 Month Before', task: 'Complete bridal lehenga and groom sherwani trials', completed: false },
    { id: 't6', phase: '1 Month Before', task: 'Send digital WhatsApp wedding invitations to all guests', completed: false },
    { id: 't7', phase: '1 Week Before', task: 'Reconfirm entry timings with Dhol & Sound team', completed: false },
    { id: 't8', phase: 'Day of Event', task: 'Final venue inspection & welcome guest management', completed: false },
  ]);

  // Guests State
  const [guests, setGuests] = useState<GuestItem[]>([
    { id: 'g1', name: 'Sharma Family (Chachaji)', side: "Groom's Side", rsvp: 'Confirmed', count: 5 },
    { id: 'g2', name: 'Verma Family (Mausaji)', side: "Bride's Side", rsvp: 'Confirmed', count: 4 },
    { id: 'g3', name: 'College Friends Group', side: 'Friends', rsvp: 'Pending', count: 8 },
    { id: 'g4', name: 'Gupta Family (Colleagues)', side: "Groom's Side", rsvp: 'Confirmed', count: 3 },
    { id: 'g5', name: 'Joshi Family', side: "Bride's Side", rsvp: 'Declined', count: 2 },
  ]);

  const totalSpent = budgetItems.reduce((acc, curr) => acc + curr.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const completedTasksCount = checklistTasks.filter((t) => t.completed).length;

  const toggleTask = (id: string) => {
    setChecklistTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Home');
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
              Wedding <Text style={styles.screenTitleHighlight}>Planner</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Budget tracker, checklist & guest RSVP manager
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="sparkles" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Smart</Text>
            <Text style={styles.decorativeLine2}>Planning</Text>
            <Text style={styles.decorativeLine3}>Zero Stress ♡</Text>
          </View>
        </View>
      </View>

      {/* Wedding Countdown Strip */}
      <View style={styles.countdownBanner}>
        <View style={styles.countdownLeft}>
          <Text style={styles.countdownDays}>70</Text>
          <Text style={styles.countdownDaysLabel}>Days to Go</Text>
        </View>
        <View style={styles.countdownDivider} />
        <View style={styles.countdownRight}>
          <Text style={styles.countdownDateTitle}>Aayush & Priya's Wedding</Text>
          <Text style={styles.countdownDateSub}>25 November 2026 • Indore, MP</Text>
        </View>
      </View>

      {/* 3 Hub Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.hubTab, activeTab === 'budget' && styles.hubTabActive]}
          onPress={() => setActiveTab('budget')}
        >
          <Ionicons
            name="wallet"
            size={14}
            color={activeTab === 'budget' ? '#E5093A' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.hubTabText, activeTab === 'budget' && styles.hubTabTextActive]}>
            Budget Tracker
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hubTab, activeTab === 'checklist' && styles.hubTabActive]}
          onPress={() => setActiveTab('checklist')}
        >
          <Ionicons
            name="checkbox"
            size={14}
            color={activeTab === 'checklist' ? '#E5093A' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.hubTabText, activeTab === 'checklist' && styles.hubTabTextActive]}>
            Checklist ({completedTasksCount}/{checklistTasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hubTab, activeTab === 'guests' && styles.hubTabActive]}
          onPress={() => setActiveTab('guests')}
        >
          <Ionicons
            name="people"
            size={14}
            color={activeTab === 'guests' ? '#E5093A' : '#64748B'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.hubTabText, activeTab === 'guests' && styles.hubTabTextActive]}>
            Guest RSVP
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: BUDGET TRACKER */}
        {activeTab === 'budget' && (
          <View>
            {/* Total Budget Card */}
            <View style={styles.budgetMasterCard}>
              <View style={styles.budgetMasterTop}>
                <View>
                  <Text style={styles.budgetMasterLabel}>Total Wedding Budget</Text>
                  <Text style={styles.budgetMasterAmount}>₹ {totalBudget.toLocaleString('en-IN')}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editBudgetBtn}
                  onPress={() =>
                    Alert.alert('Edit Budget', 'Enter new total wedding budget:', [
                      { text: 'Cancel' },
                      { text: 'Set ₹20,00,000', onPress: () => setTotalBudget(2000000) },
                    ])
                  }
                >
                  <Ionicons name="pencil" size={13} color="#E5093A" />
                  <Text style={styles.editBudgetBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarWrapper}>
                <View style={[styles.progressBarFill, { width: `${spentPercent}%` }]} />
              </View>

              <View style={styles.budgetMasterStats}>
                <View>
                  <Text style={styles.budgetStatLabel}>Total Spent</Text>
                  <Text style={[styles.budgetStatValue, { color: '#E5093A' }]}>
                    ₹ {totalSpent.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.budgetStatLabel}>Remaining Balance</Text>
                  <Text style={[styles.budgetStatValue, { color: '#15803D' }]}>
                    ₹ {remainingBudget.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Category Expenses Breakdown */}
            <Text style={styles.sectionHeaderTitle}>Vendor Category Breakdown</Text>

            <View style={styles.categoriesList}>
              {budgetItems.map((item) => {
                const itemPercent = Math.min(100, Math.round((item.spent / item.allocated) * 100));
                return (
                  <View key={item.id} style={styles.budgetItemCard}>
                    <View style={styles.budgetItemTop}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.categoryIconCircle, { backgroundColor: item.color + '15' }]}>
                          <Ionicons name={item.icon as any} size={16} color={item.color} />
                        </View>
                        <Text style={styles.budgetItemCategory}>{item.category}</Text>
                      </View>
                      <Text style={styles.budgetItemSpent}>
                        ₹ {item.spent.toLocaleString('en-IN')}{' '}
                        <Text style={styles.budgetItemAllocated}>/ ₹{item.allocated.toLocaleString('en-IN')}</Text>
                      </Text>
                    </View>

                    <View style={styles.itemProgressWrapper}>
                      <View style={[styles.itemProgressFill, { width: `${itemPercent}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 2: CHECKLIST TIMELINE */}
        {activeTab === 'checklist' && (
          <View>
            <View style={styles.checklistSummaryBox}>
              <Ionicons name="checkmark-done-circle" size={24} color="#15803D" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.checklistSummaryTitle}>
                  {completedTasksCount} of {checklistTasks.length} Tasks Completed
                </Text>
                <Text style={styles.checklistSummarySub}>
                  Stay on track with your wedding preparation timeline
                </Text>
              </View>
            </View>

            <View style={styles.tasksList}>
              {checklistTasks.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.taskCard, t.completed && styles.taskCardCompleted]}
                  activeOpacity={0.8}
                  onPress={() => toggleTask(t.id)}
                >
                  <View style={[styles.taskCheckbox, t.completed && styles.taskCheckboxActive]}>
                    {t.completed && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskPhaseBadge}>{t.phase}</Text>
                    <Text style={[styles.taskText, t.completed && styles.taskTextCompleted]}>
                      {t.task}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: GUEST LIST & RSVP */}
        {activeTab === 'guests' && (
          <View>
            {/* Guest RSVP Stats Grid */}
            <View style={styles.rsvpStatsGrid}>
              <View style={styles.rsvpStatBox}>
                <Text style={styles.rsvpStatNum}>320</Text>
                <Text style={[styles.rsvpStatLabel, { color: '#15803D' }]}>Confirmed</Text>
              </View>
              <View style={styles.rsvpStatBox}>
                <Text style={styles.rsvpStatNum}>110</Text>
                <Text style={[styles.rsvpStatLabel, { color: '#D97706' }]}>Pending</Text>
              </View>
              <View style={styles.rsvpStatBox}>
                <Text style={styles.rsvpStatNum}>20</Text>
                <Text style={[styles.rsvpStatLabel, { color: '#DC2626' }]}>Declined</Text>
              </View>
            </View>

            <View style={styles.guestsListHeader}>
              <Text style={styles.sectionHeaderTitle}>Guest Entries</Text>
              <TouchableOpacity
                style={styles.addGuestBtn}
                onPress={() => Alert.alert('Add Guest', 'Enter guest name & side to send WhatsApp invite.')}
              >
                <Ionicons name="add-circle" size={16} color="#E5093A" style={{ marginRight: 4 }} />
                <Text style={styles.addGuestBtnText}>Add Guest</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.guestsList}>
              {guests.map((g) => (
                <View key={g.id} style={styles.guestCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.guestName}>{g.name}</Text>
                    <Text style={styles.guestSide}>
                      {g.side} • {g.count} Members
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.rsvpBadge,
                      g.rsvp === 'Confirmed'
                        ? styles.rsvpConfirmed
                        : g.rsvp === 'Pending'
                        ? styles.rsvpPending
                        : styles.rsvpDeclined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rsvpBadgeText,
                        g.rsvp === 'Confirmed'
                          ? { color: '#15803D' }
                          : g.rsvp === 'Pending'
                          ? { color: '#D97706' }
                          : { color: '#DC2626' },
                      ]}
                    >
                      {g.rsvp}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
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

  // Countdown Banner
  countdownBanner: {
    backgroundColor: '#8A072D',
    marginHorizontal: 14,
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownLeft: {
    alignItems: 'center',
    paddingRight: 12,
  },
  countdownDays: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FBBF24',
    lineHeight: 26,
  },
  countdownDaysLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  countdownDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
  },
  countdownRight: {
    flex: 1,
  },
  countdownDateTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  countdownDateSub: {
    fontSize: 10.5,
    color: '#FFE4E8',
    marginTop: 2,
  },

  // Hub Tabs
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  hubTab: {
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
  hubTabActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E5093A',
  },
  hubTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  hubTabTextActive: {
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

  // Master Budget Card
  budgetMasterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  budgetMasterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  budgetMasterLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  budgetMasterAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  editBudgetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editBudgetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E5093A',
    marginLeft: 3,
  },
  progressBarWrapper: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E5093A',
    borderRadius: 4,
  },
  budgetMasterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetStatLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  budgetStatValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },

  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  categoriesList: {
    gap: 8,
  },
  budgetItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  budgetItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  budgetItemCategory: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  budgetItemSpent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  budgetItemAllocated: {
    fontSize: 10.5,
    fontWeight: '400',
    color: '#64748B',
  },
  itemProgressWrapper: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  itemProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Checklist
  checklistSummaryBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 12,
  },
  checklistSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  checklistSummarySub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 1,
  },
  tasksList: {
    gap: 8,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  taskCheckboxActive: {
    backgroundColor: '#15803D',
    borderColor: '#15803D',
  },
  taskPhaseBadge: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#E5093A',
    marginBottom: 2,
  },
  taskText: {
    fontSize: 12.5,
    color: '#1E293B',
    fontWeight: '500',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },

  // Guests
  rsvpStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  rsvpStatBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  rsvpStatNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  rsvpStatLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
  },
  guestsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addGuestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addGuestBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E5093A',
  },
  guestsList: {
    gap: 8,
  },
  guestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  guestName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  guestSide: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  rsvpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  rsvpConfirmed: {
    backgroundColor: '#DCFCE7',
  },
  rsvpPending: {
    backgroundColor: '#FEF3C7',
  },
  rsvpDeclined: {
    backgroundColor: '#FEE2E2',
  },
  rsvpBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
