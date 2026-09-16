import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VendorKYCScreenProps {
  navigation?: any;
  onSuccess?: () => void;
  onBack?: () => void;
}

export const VendorKYCScreen: React.FC<VendorKYCScreenProps> = ({
  navigation,
  onSuccess,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  const [businessName, setBusinessName] = useState('Royal Events & Decor');
  const [selectedCategory, setSelectedCategory] = useState('Mandap & Stage Decor');
  const [city, setCity] = useState('Indore, Madhya Pradesh');
  const [experience, setExperience] = useState('8 Years');
  const [bankAccount, setBankAccount] = useState('50100234567812');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [gstNumber, setGstNumber] = useState('23ABCDE1234F1Z5');

  const categories = [
    { id: '1', name: 'Mandap & Stage Decor', icon: 'sparkles' },
    { id: '2', name: 'Dhol & Brass Band', icon: 'musical-notes' },
    { id: '3', name: 'Royal Catering', icon: 'restaurant' },
    { id: '4', name: 'Bridal Makeup & Mehndi', icon: 'color-palette' },
    { id: '5', name: 'Wedding Photography', icon: 'camera' },
    { id: '6', name: 'Luxury Buggi & Ghodi', icon: 'car-sport' },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboardTab');
    }
  };

  const handleSaveKYC = () => {
    if (!businessName || !city || !bankAccount || !ifscCode) {
      Alert.alert('Missing Details', 'Please fill in all mandatory business and bank fields.');
      return;
    }

    Alert.alert(
      '🎉 Verification Complete!',
      `Congratulations! "${businessName}" has been successfully verified as an Official Partner in Indore.`,
      [
        {
          text: 'Go to Vendor Dashboard',
          onPress: () => {
            if (onSuccess) {
              onSuccess();
            } else if (navigation?.navigate) {
              navigation.navigate('VendorDashboardTab');
            }
          },
        },
      ]
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
                ? insets.top + 2
                : 16,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Business <Text style={styles.screenTitleHighlight}>KYC & Profile</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Complete your vendor verification & payout details
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="shield-checkmark" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>KYC</Text>
            <Text style={styles.decorativeLine2}>Verified</Text>
            <Text style={styles.decorativeLine3}>Partner ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Verification Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusBadgeRow}>
            <Ionicons name="checkmark-circle" size={18} color="#15803D" style={{ marginRight: 6 }} />
            <Text style={styles.statusBadgeText}>Instant Partner Verification Active</Text>
          </View>
          <Text style={styles.statusDesc}>
            Your business profile will be displayed with a "Verified & Top Rated" badge to customers.
          </Text>
        </View>

        {/* Section 1: Primary Business Category */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>1. Primary Service Category</Text>
          <Text style={styles.sectionSub}>Select the primary service your team offers</Text>

          <View style={styles.categoriesGrid}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={20}
                    color={isSelected ? '#8A072D' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.categoryCardText,
                      isSelected && styles.categoryCardTextSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkMini}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Business Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>2. Business Profile</Text>

          <Text style={styles.fieldLabel}>Business / Brand Name *</Text>
          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="e.g. Royal Events & Decor"
          />

          <Text style={styles.fieldLabel}>Service City / Location *</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Indore, Madhya Pradesh"
          />

          <Text style={styles.fieldLabel}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g. 8 Years"
          />
        </View>

        {/* Section 3: Bank Account & Payouts */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>3. Bank Details for Advance Payouts</Text>
          <Text style={styles.sectionSub}>
            Customer booking advance (₹25,000 token) will be credited directly to this bank account
          </Text>

          <Text style={styles.fieldLabel}>Bank Account Number *</Text>
          <TextInput
            style={styles.input}
            value={bankAccount}
            onChangeText={setBankAccount}
            placeholder="e.g. 50100234567812"
            keyboardType="number-pad"
          />

          <Text style={styles.fieldLabel}>Bank IFSC Code *</Text>
          <TextInput
            style={styles.input}
            value={ifscCode}
            onChangeText={setIfscCode}
            placeholder="e.g. HDFC0001234"
            autoCapitalize="characters"
          />

          <View style={styles.twoColRow}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.fieldLabel}>PAN Number</Text>
              <TextInput
                style={styles.input}
                value={panNumber}
                onChangeText={setPanNumber}
                placeholder="ABCDE1234F"
                autoCapitalize="characters"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.fieldLabel}>GSTIN (Optional)</Text>
              <TextInput
                style={styles.input}
                value={gstNumber}
                onChangeText={setGstNumber}
                placeholder="23ABCDE1234F1Z5"
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        {/* Save & Submit Button */}
        <TouchableOpacity
          style={styles.saveKycBtn}
          activeOpacity={0.88}
          onPress={handleSaveKYC}
        >
          <Text style={styles.saveKycBtnText}>Complete Verification & Enter Dashboard</Text>
          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

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
    paddingTop: 14,
    paddingBottom: 24,
  },

  // Status Card
  statusCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  statusDesc: {
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
  },

  // Categories Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  categoryCardSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#8A072D',
  },
  categoryCardText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
    marginTop: 6,
  },
  categoryCardTextSelected: {
    color: '#8A072D',
    fontWeight: '700',
  },
  checkMini: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8A072D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Inputs
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#1E293B',
  },
  twoColRow: {
    flexDirection: 'row',
  },

  saveKycBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveKycBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
