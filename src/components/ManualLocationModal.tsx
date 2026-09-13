import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import { RoyalButton } from './RoyalButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ManualLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (city: string, locality?: string, pincode?: string) => void;
}

export const ManualLocationModal: React.FC<ManualLocationModalProps> = ({
  visible,
  onClose,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [validationError, setValidationError] = useState<string | null>(null);

  const topWeddingCities = [
    { city: 'Jaipur', state: 'Rajasthan', tag: 'Royal Palace Baarats', vendors: '220+ Bands & Artists', emoji: '🏰' },
    { city: 'Delhi NCR', state: 'Delhi', tag: 'Grand Farmhouse Hub', vendors: '480+ Bands & Artists', emoji: '🏛️' },
    { city: 'Udaipur', state: 'Rajasthan', tag: 'Lakeside Destination', vendors: '160+ Bands & Artists', emoji: '🌊' },
    { city: 'Mumbai', state: 'Maharashtra', tag: 'Luxury Banquets', vendors: '390+ Bands & Artists', emoji: '🌆' },
    { city: 'Lucknow', state: 'Uttar Pradesh', tag: 'Nawabi Baarat Style', vendors: '195+ Bands & Artists', emoji: '🕌' },
    { city: 'Chandigarh', state: 'Punjab', tag: 'Dhol & Symphony Hub', vendors: '210+ Bands & Artists', emoji: '🥁' },
    { city: 'Ahmedabad', state: 'Gujarat', tag: 'Shahi Shehnai & Band', vendors: '175+ Bands & Artists', emoji: '✨' },
    { city: 'Indore', state: 'Madhya Pradesh', tag: 'Heritage Baarat Hub', vendors: '140+ Bands & Artists', emoji: '🎺' },
  ];

  const filteredCities = topWeddingCities.filter(
    (item) =>
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (pincode.length > 0 && pincode.length !== 6) {
      setValidationError('Please enter a valid 6-digit Indian Pincode');
      return;
    }
    setValidationError(null);
    onSelectLocation(selectedCity, 'Main Wedding Zone', pincode);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.sheetContainer}>
            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.dragHandle} />
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.modalTitle}>Choose Your Wedding City</Text>
                  <Text style={styles.modalSubtitle}>Discover vendors available in your location</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Input Bar */}
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                placeholder="Search city (e.g., Jaipur, Delhi, Mumbai)..."
                placeholderTextColor={Colors.textMuted}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Pincode & Locality input row */}
            <View style={styles.pincodeRow}>
              <View style={styles.pincodeBox}>
                <Text style={styles.pincodePrefix}>📮 Pincode:</Text>
                <TextInput
                  placeholder="302001 (Optional)"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  maxLength={6}
                  value={pincode}
                  onChangeText={(val) => {
                    setPincode(val);
                    if (validationError) setValidationError(null);
                  }}
                  style={styles.pincodeInput}
                />
              </View>
            </View>

            {validationError && <Text style={styles.errorText}>{validationError}</Text>}

            {/* Section Header */}
            <Text style={styles.sectionHeading}>Top Wedding Destinations</Text>

            {/* City List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cityList}
            >
              {filteredCities.map((item) => {
                const isSelected = selectedCity === item.city;
                return (
                  <TouchableOpacity
                    key={item.city}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCity(item.city)}
                    style={[styles.cityCard, isSelected && styles.cityCardSelected]}
                  >
                    <View style={styles.cityIconCircle}>
                      <Text style={styles.cityEmoji}>{item.emoji}</Text>
                    </View>
                    <View style={styles.cityInfo}>
                      <View style={styles.cityNameRow}>
                        <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                          {item.city}, {item.state}
                        </Text>
                        <View style={styles.tagBadge}>
                          <Text style={styles.tagText}>{item.tag}</Text>
                        </View>
                      </View>
                      <Text style={styles.vendorCount}>⚜️ {item.vendors}</Text>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Confirm Button */}
            <View style={styles.footer}>
              <RoyalButton
                title={`Set Location: ${selectedCity}`}
                variant="primary"
                onPress={handleConfirm}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 6, 12, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  dragHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#DEC2B8',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  header: {
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    ...Typography.title,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  modalSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blushPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7F4',
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8BCAB',
    height: 46,
    marginBottom: Spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.textDark,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.textMuted,
    padding: 4,
  },
  pincodeRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  pincodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7F4',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    flex: 1,
    height: 40,
  },
  pincodePrefix: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginRight: Spacing.sm,
  },
  pincodeInput: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.textDark,
  },
  errorText: {
    color: '#D93025',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sectionHeading: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  cityList: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: '#FDF7F4',
    borderWidth: 1,
    borderColor: '#F0D4CB',
  },
  cityCardSelected: {
    backgroundColor: '#FDECE6',
    borderColor: Colors.primary,
  },
  cityIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8BCAB',
  },
  cityEmoji: {
    fontSize: 18,
  },
  cityInfo: {
    flex: 1,
  },
  cityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  cityName: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: Colors.textDark,
  },
  cityNameSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tagBadge: {
    backgroundColor: Colors.blushPink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  vendorCount: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DEC2B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  footer: {
    marginTop: Spacing.md,
  },
});
