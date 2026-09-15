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
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';

export interface AddressItem {
  id: string;
  type: 'home' | 'work' | 'other' | 'parents';
  title: string;
  isDefault: boolean;
  addressLine1: string;
  cityStatePincode: string;
  landmark: string;
}

const initialAddresses: AddressItem[] = [
  {
    id: 'addr-1',
    type: 'home',
    title: 'Home',
    isDefault: true,
    addressLine1: '123, AB Road, Vijay Nagar',
    cityStatePincode: 'Indore, Madhya Pradesh - 452010',
    landmark: 'Near C21 Mall',
  },
  {
    id: 'addr-2',
    type: 'work',
    title: 'Work',
    isDefault: false,
    addressLine1: '456, Scheme No. 78',
    cityStatePincode: 'Vijay Nagar, Indore, Madhya Pradesh - 452010',
    landmark: 'Near Brilliant Convention Centre',
  },
  {
    id: 'addr-3',
    type: 'other',
    title: 'Other',
    isDefault: false,
    addressLine1: '789, Ring Road',
    cityStatePincode: 'Indore, Madhya Pradesh - 452001',
    landmark: 'Near Phoenix Citadel Mall',
  },
  {
    id: 'addr-4',
    type: 'parents',
    title: "Parents' Home",
    isDefault: false,
    addressLine1: '321, MG Road',
    cityStatePincode: 'Indore, Madhya Pradesh - 452003',
    landmark: 'Near Rajwada',
  },
];

export const MyAddressesScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);

  // Add / Edit Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);

  // Form State
  const [formType, setFormType] = useState<'home' | 'work' | 'other' | 'parents'>('home');
  const [formTitle, setFormTitle] = useState('Home');
  const [formLine1, setFormLine1] = useState('');
  const [formCityStatePin, setFormCityStatePin] = useState('Indore, Madhya Pradesh - 452010');
  const [formLandmark, setFormLandmark] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Action Sheet Modal state
  const [activeMenuAddress, setActiveMenuAddress] = useState<AddressItem | null>(null);

  const handleOpenAdd = () => {
    if (navigation?.navigate) {
      navigation.navigate('AddNewAddress', {
        onSave: (newAddr: AddressItem) => {
          if (newAddr.isDefault) {
            setAddresses((prev) => [
              ...prev.map((a) => ({ ...a, isDefault: false })),
              newAddr,
            ]);
          } else {
            setAddresses((prev) => [...prev, newAddr]);
          }
        },
      });
      return;
    }
    setEditingAddress(null);
    setFormType('home');
    setFormTitle('Home');
    setFormLine1('');
    setFormCityStatePin('Indore, Madhya Pradesh - 452010');
    setFormLandmark('');
    setFormIsDefault(false);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: AddressItem) => {
    setActiveMenuAddress(null);
    if (navigation?.navigate) {
      navigation.navigate('AddNewAddress', {
        address: item,
        onSave: (updatedAddr: AddressItem) => {
          setAddresses((prev) =>
            prev.map((a) => {
              if (a.id === updatedAddr.id) {
                return updatedAddr;
              }
              if (updatedAddr.isDefault) {
                return { ...a, isDefault: false };
              }
              return a;
            })
          );
        },
      });
      return;
    }
    setEditingAddress(item);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormLine1(item.addressLine1);
    setFormCityStatePin(item.cityStatePincode);
    setFormLandmark(item.landmark);
    setFormIsDefault(item.isDefault);
    setShowAddModal(true);
  };

  const handleSetDefault = (id: string) => {
    setActiveMenuAddress(null);
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    Alert.alert('Success', 'Default address updated successfully.');
  };

  const handleDelete = (id: string) => {
    setActiveMenuAddress(null);
    Alert.alert(
      'Delete Address',
      'Are you sure you want to remove this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses((prev) => prev.filter((a) => a.id !== id));
          },
        },
      ]
    );
  };

  const handleSaveAddress = () => {
    if (!formLine1.trim()) {
      Alert.alert('Validation Error', 'Please enter flat / building / street details');
      return;
    }

    if (editingAddress) {
      // Update
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingAddress.id) {
            return {
              ...a,
              type: formType,
              title: formTitle,
              addressLine1: formLine1.trim(),
              cityStatePincode: formCityStatePin.trim(),
              landmark: formLandmark.trim(),
              isDefault: formIsDefault,
            };
          }
          if (formIsDefault) {
            return { ...a, isDefault: false };
          }
          return a;
        })
      );
      Alert.alert('Success', 'Address updated successfully!');
    } else {
      // Add new
      const newAddr: AddressItem = {
        id: `addr-${Date.now()}`,
        type: formType,
        title: formTitle,
        isDefault: formIsDefault || addresses.length === 0,
        addressLine1: formLine1.trim(),
        cityStatePincode: formCityStatePin.trim(),
        landmark: formLandmark.trim(),
      };

      if (formIsDefault) {
        setAddresses((prev) => [
          ...prev.map((a) => ({ ...a, isDefault: false })),
          newAddr,
        ]);
      } else {
        setAddresses((prev) => [...prev, newAddr]);
      }
      Alert.alert('Success', 'New address added successfully!');
    }

    setShowAddModal(false);
  };

  const renderIcon = (type: AddressItem['type'], isDefault: boolean) => {
    switch (type) {
      case 'home':
        return (
          <View style={[styles.iconCircle, styles.iconCircleHome]}>
            <Ionicons name="home" size={20} color="#D81B60" />
          </View>
        );
      case 'work':
        return (
          <View style={[styles.iconCircle, styles.iconCircleWork]}>
            <Ionicons name="briefcase-outline" size={20} color="#3B5998" />
          </View>
        );
      case 'parents':
        return (
          <View style={[styles.iconCircle, styles.iconCircleParents]}>
            <Ionicons name="heart-outline" size={20} color="#D81B60" />
          </View>
        );
      case 'other':
      default:
        return (
          <View style={[styles.iconCircle, styles.iconCircleOther]}>
            <Ionicons name="location-outline" size={20} color="#3B5998" />
          </View>
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
            onPress={() => {
              if (navigation?.goBack) {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
          </TouchableOpacity>

          <View style={styles.titleColumn}>
            <Text style={styles.screenTitle}>
              My <Text style={styles.screenTitleHighlight}>Addresses</Text>
            </Text>
            <Text style={styles.screenSubtitle}>Manage your saved addresses</Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.mapPinGraphic}>
            <Ionicons name="location-sharp" size={16} color="#D81B60" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Events</Text>
            <Text style={styles.decorativeLine2}>Everywhere</Text>
            <Text style={styles.decorativeLine3}>With You ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* + Add New Address Button */}
        <TouchableOpacity
          style={styles.addAddressButton}
          activeOpacity={0.8}
          onPress={handleOpenAdd}
        >
          <Ionicons name="add" size={20} color="#D81B60" style={styles.addIcon} />
          <Text style={styles.addAddressButtonText}>Add New Address</Text>
        </TouchableOpacity>

        {/* Saved Addresses List */}
        <View style={styles.addressList}>
          {addresses.map((item) => {
            const isHomeDefault = item.isDefault;
            return (
              <View
                key={item.id}
                style={[
                  styles.addressCard,
                  isHomeDefault && styles.addressCardDefault,
                ]}
              >
                {/* Left Icon */}
                {renderIcon(item.type, isHomeDefault)}

                {/* Center Content */}
                <View style={styles.addressDetailsCol}>
                  <View style={styles.addressTitleRow}>
                    <Text style={styles.addressTitle}>{item.title}</Text>
                    {item.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.addressTextLine}>{item.addressLine1}</Text>
                  <Text style={styles.addressTextLine}>{item.cityStatePincode}</Text>

                  {item.landmark ? (
                    <Text style={styles.landmarkText}>{item.landmark}</Text>
                  ) : null}
                </View>

                {/* Right 3 dots */}
                <TouchableOpacity
                  style={styles.dotsButton}
                  activeOpacity={0.6}
                  onPress={() => setActiveMenuAddress(item)}
                >
                  <Ionicons name="ellipsis-vertical" size={18} color="#4A5568" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Bottom Promotional Info Card */}
        <View style={styles.promoBannerCard}>
          <View style={styles.promoIllustrationWrapper}>
            <View style={styles.promoMapBase}>
              <View style={styles.promoBuilding1} />
              <View style={styles.promoBuilding2} />
              <View style={styles.promoBuilding3} />
              <View style={styles.promoPin}>
                <Ionicons name="location-sharp" size={22} color="#D81B60" />
              </View>
            </View>
          </View>
          <View style={styles.promoTextCol}>
            <Text style={styles.promoTitle}>Add multiple addresses</Text>
            <Text style={styles.promoSubtitle}>
              Save home, work or any other location for faster bookings.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Three-dots Action Menu Modal */}
      <Modal
        visible={!!activeMenuAddress}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveMenuAddress(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveMenuAddress(null)}
        >
          <View style={styles.actionSheetContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.actionSheetTitle}>
              {activeMenuAddress?.title || 'Address Options'}
            </Text>

            {!activeMenuAddress?.isDefault && (
              <TouchableOpacity
                style={styles.actionSheetRow}
                onPress={() =>
                  activeMenuAddress && handleSetDefault(activeMenuAddress.id)
                }
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
                <Text style={styles.actionSheetText}>Set as Default Address</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionSheetRow}
              onPress={() => activeMenuAddress && handleOpenEdit(activeMenuAddress)}
            >
              <Ionicons name="pencil-outline" size={20} color="#3B82F6" />
              <Text style={styles.actionSheetText}>Edit Address</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionSheetRow, { borderBottomWidth: 0 }]}
              onPress={() =>
                activeMenuAddress && handleDelete(activeMenuAddress.id)
              }
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionSheetText, { color: '#EF4444' }]}>
                Delete Address
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add / Edit Address Form Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.addModalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.addModalHeaderRow}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Address Type Selectors */}
            <Text style={styles.inputGroupLabel}>Address Type</Text>
            <View style={styles.typePillsRow}>
              {[
                { type: 'home', label: 'Home', icon: 'home' },
                { type: 'work', label: 'Work', icon: 'briefcase' },
                { type: 'parents', label: "Parents' Home", icon: 'heart' },
                { type: 'other', label: 'Other', icon: 'location' },
              ].map((item) => {
                const isSelected = formType === item.type;
                return (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.typePill,
                      isSelected && styles.typePillActive,
                    ]}
                    onPress={() => {
                      setFormType(item.type as any);
                      setFormTitle(item.label);
                    }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={14}
                      color={isSelected ? '#D81B60' : '#64748B'}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.typePillText,
                        isSelected && styles.typePillTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Address Line 1 */}
            <Text style={styles.inputGroupLabel}>Flat / Building / Street Address</Text>
            <TextInput
              style={styles.formInput}
              value={formLine1}
              onChangeText={setFormLine1}
              placeholder="e.g. 123, AB Road, Vijay Nagar"
              placeholderTextColor="#94A3B8"
            />

            {/* City, State & Pincode */}
            <Text style={styles.inputGroupLabel}>City, State & Pincode</Text>
            <TextInput
              style={styles.formInput}
              value={formCityStatePin}
              onChangeText={setFormCityStatePin}
              placeholder="e.g. Indore, Madhya Pradesh - 452010"
              placeholderTextColor="#94A3B8"
            />

            {/* Landmark */}
            <Text style={styles.inputGroupLabel}>Landmark (Optional)</Text>
            <TextInput
              style={styles.formInput}
              value={formLandmark}
              onChangeText={setFormLandmark}
              placeholder="e.g. Near C21 Mall / Brilliant Convention"
              placeholderTextColor="#94A3B8"
            />

            {/* Set as Default Switch Row */}
            <TouchableOpacity
              style={styles.defaultToggleRow}
              activeOpacity={0.8}
              onPress={() => setFormIsDefault(!formIsDefault)}
            >
              <View style={styles.defaultToggleTextCol}>
                <Text style={styles.defaultToggleTitle}>Set as Default Address</Text>
                <Text style={styles.defaultToggleSubtitle}>
                  Used as default for future event and venue bookings
                </Text>
              </View>
              <Ionicons
                name={formIsDefault ? 'checkbox' : 'square-outline'}
                size={24}
                color={formIsDefault ? '#D81B60' : '#94A3B8'}
              />
            </TouchableOpacity>

            {/* Save Address Button */}
            <TouchableOpacity
              style={styles.saveAddressBtn}
              activeOpacity={0.85}
              onPress={handleSaveAddress}
            >
              <Text style={styles.saveAddressBtnText}>
                {editingAddress ? 'Save Changes' : 'Save Address'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  mapPinGraphic: {
    marginRight: 4,
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
    paddingTop: 12,
    paddingBottom: 36,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E53E3E',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  addIcon: {
    marginRight: 6,
  },
  addAddressButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53E3E',
  },
  addressList: {
    gap: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  addressCardDefault: {
    borderColor: '#F87171',
    borderWidth: 1.2,
    backgroundColor: '#FFFFFF',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  iconCircleHome: {
    backgroundColor: '#FDECEF',
  },
  iconCircleWork: {
    backgroundColor: '#EDF2F7',
  },
  iconCircleParents: {
    backgroundColor: '#FDECEF',
  },
  iconCircleOther: {
    backgroundColor: '#EDF2F7',
  },
  addressDetailsCol: {
    flex: 1,
    paddingRight: 6,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1B1F',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#FDECEF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: '#D81B60',
    fontWeight: '600',
  },
  addressTextLine: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    fontWeight: '400',
  },
  landmarkText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  dotsButton: {
    padding: 6,
    marginRight: -4,
    marginTop: -2,
  },
  promoBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCE7EB',
    padding: 14,
    marginTop: 24,
  },
  promoIllustrationWrapper: {
    width: 68,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoMapBase: {
    position: 'relative',
    width: 58,
    height: 42,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoBuilding1: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    width: 12,
    height: 22,
    backgroundColor: '#FBCFE8',
    borderRadius: 2,
  },
  promoBuilding2: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    width: 14,
    height: 26,
    backgroundColor: '#FBCFE8',
    borderRadius: 2,
  },
  promoBuilding3: {
    position: 'absolute',
    left: 20,
    bottom: 6,
    width: 10,
    height: 16,
    backgroundColor: '#F472B6',
    borderRadius: 2,
  },
  promoPin: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    elevation: 3,
  },
  promoTextCol: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D81B60',
    marginBottom: 3,
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  actionSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 16,
  },
  actionSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionSheetText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
    marginLeft: 12,
  },
  addModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  addModalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  closeBtn: {
    padding: 4,
  },
  inputGroupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 10,
    marginBottom: 6,
  },
  typePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  typePillActive: {
    borderColor: '#D81B60',
    backgroundColor: '#FFF1F4',
  },
  typePillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  typePillTextActive: {
    color: '#D81B60',
    fontWeight: '600',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1B1F',
    backgroundColor: '#FAFCFE',
  },
  defaultToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7F8',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    marginBottom: 18,
  },
  defaultToggleTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  defaultToggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1B1F',
  },
  defaultToggleSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  saveAddressBtn: {
    backgroundColor: '#D81B60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveAddressBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
