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
  TextInput,
  Switch,
  Alert,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';

interface AddNewAddressScreenProps {
  navigation?: any;
  route?: {
    params?: {
      address?: any;
      onSave?: (savedAddress: any) => void;
    };
  };
}

const { width } = Dimensions.get('window');

export const AddNewAddressScreen: React.FC<AddNewAddressScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const existingAddress = route?.params?.address;

  // Form states
  const [addressType, setAddressType] = useState<'home' | 'work' | 'parents' | 'other'>(
    existingAddress?.type || 'home'
  );
  const [fullAddress, setFullAddress] = useState(existingAddress?.addressLine1 || '');
  const [landmark, setLandmark] = useState(existingAddress?.landmark || '');
  const [city, setCity] = useState(existingAddress?.city || 'Indore');
  const [stateName, setStateName] = useState(existingAddress?.state || 'Madhya Pradesh');
  const [pincode, setPincode] = useState(existingAddress?.pincode || '452010');
  const [isDefault, setIsDefault] = useState<boolean>(
    existingAddress?.isDefault !== undefined ? existingAddress.isDefault : true
  );

  // Modal states
  const [showStateModal, setShowStateModal] = useState(false);

  // States list
  const stateOptions = [
    'Madhya Pradesh',
    'Maharashtra',
    'Rajasthan',
    'Gujarat',
    'Delhi NCR',
    'Uttar Pradesh',
    'Karnataka',
    'Tamil Nadu',
    'Telangana',
    'Punjab',
    'Haryana',
  ];

  // Address Type Options
  const addressTypes = [
    { id: 'home', label: 'Home', icon: 'home', iconFamily: 'Ionicons' },
    { id: 'work', label: 'Work', icon: 'briefcase', iconFamily: 'Ionicons' },
    { id: 'parents', label: "Parents' Home", icon: 'heart-outline', iconFamily: 'Ionicons' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', iconFamily: 'Ionicons' },
  ];

  const handleUseCurrentLocation = () => {
    Alert.alert(
      'Location Detected',
      'Using your current GPS location:\nVijay Nagar, Near C21 Mall, Indore (452010)',
      [
        {
          text: 'Use This Location',
          onPress: () => {
            setFullAddress('Flat 302, Royal Residency, Vijay Nagar');
            setLandmark('Near C21 Mall');
            setCity('Indore');
            setStateName('Madhya Pradesh');
            setPincode('452010');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSaveAddress = () => {
    if (!fullAddress.trim()) {
      Alert.alert('Validation Error', 'Please enter your house/flat no., building, street or area.');
      return;
    }

    if (!pincode.trim() || pincode.length < 6) {
      Alert.alert('Validation Error', 'Please enter a valid 6-digit pincode.');
      return;
    }

    const newAddressObj = {
      id: existingAddress?.id || `addr-${Date.now()}`,
      type: addressType,
      title:
        addressType === 'home'
          ? 'Home'
          : addressType === 'work'
          ? 'Work'
          : addressType === 'parents'
          ? "Parents' Home"
          : 'Other',
      addressLine1: fullAddress.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      cityStatePincode: `${city.trim()}, ${stateName.trim()} - ${pincode.trim()}`,
      isDefault: isDefault,
    };

    if (route?.params?.onSave) {
      route.params.onSave(newAddressObj);
    }

    Alert.alert(
      'Address Saved',
      'Your address has been saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            if (navigation?.goBack) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
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
        <View style={styles.headerLeftCol}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => {
              if (navigation?.goBack) {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.screenMainTitle}>
              Add New <Text style={styles.screenTitleRed}>Address</Text>
            </Text>
            <Text style={styles.screenSubtitle}>
              Save your location for faster bookings
            </Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.headerTagContainer}>
          <View style={styles.headerTagGraphic}>
            <Ionicons name="location-sharp" size={18} color="#D81B60" />
          </View>
          <View style={styles.headerTagTextCol}>
            <Text style={styles.headerTagTextLine1}>Your</Text>
            <Text style={styles.headerTagTextLine2}>Events</Text>
            <Text style={styles.headerTagTextLine3}>Our Reach ♡</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* 1. Address Type Section */}
          <Text style={styles.sectionHeading}>Address Type</Text>
          <View style={styles.typeCardsRow}>
            {addressTypes.map((item) => {
              const isSelected = addressType === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.typeCard,
                    isSelected ? styles.typeCardSelected : styles.typeCardUnselected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setAddressType(item.id as any)}
                >
                  {isSelected && (
                    <View style={styles.selectedCheckBadge}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                  )}

                  <View style={styles.typeIconWrapper}>
                    {item.id === 'home' ? (
                      <Ionicons
                        name="home"
                        size={22}
                        color={isSelected ? '#D81B60' : '#4B5563'}
                      />
                    ) : item.id === 'work' ? (
                      <Ionicons
                        name="briefcase-outline"
                        size={22}
                        color={isSelected ? '#D81B60' : '#4B5563'}
                      />
                    ) : item.id === 'parents' ? (
                      <Ionicons
                        name="heart-outline"
                        size={22}
                        color={isSelected ? '#D81B60' : '#4B5563'}
                      />
                    ) : (
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={22}
                        color={isSelected ? '#D81B60' : '#4B5563'}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.typeLabel,
                      isSelected && styles.typeLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 2. Form Inputs */}
          <View style={styles.formContainer}>
            {/* Full Address */}
            <View style={styles.inputCard}>
              <View style={styles.inputIconCol}>
                <Ionicons name="location-outline" size={20} color="#475569" />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={styles.fieldLabel}>Full Address</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter house / flat no., building, street, area"
                  placeholderTextColor="#94A3B8"
                  value={fullAddress}
                  onChangeText={setFullAddress}
                />
              </View>
            </View>

            {/* Landmark (Optional) */}
            <View style={styles.inputCard}>
              <View style={styles.inputIconCol}>
                <MaterialCommunityIcons
                  name="home-city-outline"
                  size={20}
                  color="#475569"
                />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={styles.fieldLabel}>Landmark (Optional)</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. Near C21 Mall"
                  placeholderTextColor="#94A3B8"
                  value={landmark}
                  onChangeText={setLandmark}
                />
              </View>
            </View>

            {/* City */}
            <View style={styles.inputCard}>
              <View style={styles.inputIconCol}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={20}
                  color="#475569"
                />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={styles.fieldLabel}>City</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="City"
                  placeholderTextColor="#94A3B8"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>

            {/* State & Pincode 2-Column Row */}
            <View style={styles.twoColumnRow}>
              {/* State Dropdown */}
              <TouchableOpacity
                style={[styles.inputCard, styles.halfColumnCard]}
                activeOpacity={0.7}
                onPress={() => setShowStateModal(true)}
              >
                <View style={styles.inputIconCol}>
                  <Ionicons name="map-outline" size={20} color="#475569" />
                </View>
                <View style={styles.inputTextCol}>
                  <Text style={styles.fieldLabel}>State</Text>
                  <Text style={styles.fieldValueText} numberOfLines={1}>
                    {stateName}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#64748B"
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>

              {/* Pincode Input */}
              <View style={[styles.inputCard, styles.halfColumnCard]}>
                <View style={styles.inputIconCol}>
                  <MaterialCommunityIcons
                    name="numeric"
                    size={20}
                    color="#475569"
                  />
                </View>
                <View style={styles.inputTextCol}>
                  <Text style={styles.fieldLabel}>Pincode</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="452010"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    maxLength={6}
                    value={pincode}
                    onChangeText={setPincode}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 3. Select Location on Map Section */}
          <View style={styles.mapHeaderRow}>
            <Text style={styles.sectionHeading}>Select Location on Map</Text>
            <TouchableOpacity
              style={styles.useCurrentLocationBtn}
              activeOpacity={0.7}
              onPress={handleUseCurrentLocation}
            >
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={16}
                color="#D81B60"
              />
              <Text style={styles.useCurrentLocationText}>
                Use My Current Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Styled Map View Box */}
          <View style={styles.mapContainer}>
            {/* Map Roads & Grid graphics */}
            <View style={styles.mapRoadHorizontal} />
            <View style={styles.mapRoadVertical} />
            <View style={styles.mapRoadDiagonal} />

            {/* Street Names */}
            <View style={styles.streetNameTag1}>
              <Text style={styles.streetText}>AB Road</Text>
            </View>
            <View style={styles.streetNameTag2}>
              <Text style={styles.streetText}>Vijay Nagar</Text>
            </View>

            {/* POI Tag (C21 Mall) */}
            <View style={styles.poiTag}>
              <View style={styles.poiIconBox}>
                <Ionicons name="bag-handle" size={11} color="#FFFFFF" />
              </View>
              <Text style={styles.poiText}>C21 Mall</Text>
            </View>

            {/* Center Pulsing Beacon & Red Pin */}
            <View style={styles.centerBeaconCircle}>
              <View style={styles.centerBeaconInner} />
            </View>
            <View style={styles.centerPinMarker}>
              <Ionicons name="location-sharp" size={32} color="#D81B60" />
            </View>
          </View>

          {/* 4. Save As Default Address Toggle */}
          <View style={styles.defaultAddressRow}>
            <View style={styles.defaultTextCol}>
              <Text style={styles.defaultTitle}>Save As Default Address</Text>
              <Text style={styles.defaultSubtitle}>
                This will be your primary address for bookings
              </Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: '#E2E8F0', true: '#D81B60' }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDefault ? '#FFFFFF' : '#F1F5F9'}
              ios_backgroundColor="#E2E8F0"
            />
          </View>

          {/* 5. Info Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="home" size={16} color="#D81B60" />
            </View>
            <Text style={styles.infoBannerText}>
              Adding multiple addresses makes it easier to book services at different locations.
            </Text>
          </View>

          {/* 6. Save Address Button */}
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.85}
            onPress={handleSaveAddress}
          >
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('HomeMain')}
        >
          <Ionicons name="home-outline" size={22} color="#64748B" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('ServicesMain')}
        >
          <Ionicons name="grid-outline" size={22} color="#64748B" />
          <Text style={styles.navLabel}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('BookingsList')}
        >
          <Ionicons name="calendar-outline" size={22} color="#64748B" />
          <Text style={styles.navLabel}>My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('ChatMain')}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#64748B" />
          <Text style={styles.navLabel}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('ProfileMain')}
        >
          <Ionicons name="person" size={22} color="#D81B60" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* State Selector Modal */}
      <Modal
        visible={showStateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStateModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowStateModal(false)}
        >
          <View style={styles.modalContentCard}>
            <View style={styles.modalHandleBar} />
            <Text style={styles.modalHeaderTitle}>Select State</Text>

            <ScrollView style={{ maxHeight: 320 }}>
              {stateOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.modalOptionRow,
                    stateName === opt && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setStateName(opt);
                    setShowStateModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      stateName === opt && styles.modalOptionTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                  {stateName === opt && (
                    <Ionicons name="checkmark-sharp" size={18} color="#D81B60" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  titleWrapper: {
    flex: 1,
  },
  screenMainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  screenTitleRed: {
    color: '#D81B60',
    fontWeight: '700',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    fontWeight: '500',
  },
  headerTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  headerTagGraphic: {
    marginRight: 4,
  },
  headerTagTextCol: {
    flexDirection: 'column',
  },
  headerTagTextLine1: {
    fontSize: 9,
    color: '#D81B60',
    fontWeight: '600',
    lineHeight: 11,
  },
  headerTagTextLine2: {
    fontSize: 9,
    color: '#D81B60',
    fontWeight: '700',
    lineHeight: 11,
  },
  headerTagTextLine3: {
    fontSize: 8,
    color: '#D81B60',
    fontWeight: '600',
    lineHeight: 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  typeCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  typeCard: {
    flex: 1,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 4,
  },
  typeCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  typeCardSelected: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1.5,
    borderColor: '#D81B60',
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D81B60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconWrapper: {
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: '#111827',
    fontWeight: '700',
  },
  formContainer: {
    gap: 12,
    marginBottom: 18,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  inputIconCol: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  fieldInput: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  fieldValueText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfColumnCard: {
    flex: 1,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  useCurrentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  useCurrentLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D81B60',
  },
  mapContainer: {
    height: 150,
    borderRadius: 14,
    backgroundColor: '#EDF5F7',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  mapRoadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapRoadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 90,
    width: 18,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapRoadDiagonal: {
    position: 'absolute',
    top: -20,
    right: 40,
    bottom: -20,
    width: 14,
    backgroundColor: '#E5EFF2',
    transform: [{ rotate: '45deg' }],
  },
  streetNameTag1: {
    position: 'absolute',
    top: 40,
    left: 30,
    transform: [{ rotate: '-80deg' }],
  },
  streetNameTag2: {
    position: 'absolute',
    top: 55,
    right: 35,
  },
  streetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  poiTag: {
    position: 'absolute',
    top: 45,
    left: 75,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    gap: 4,
  },
  poiIconBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poiText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
  },
  centerBeaconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(216, 27, 96, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  centerBeaconInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(216, 27, 96, 0.22)',
  },
  centerPinMarker: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
  },
  defaultAddressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  defaultTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  defaultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  defaultSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F3',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE4E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#C2185B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C2185B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#D81B60',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  modalOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionSelected: {
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  modalOptionTextSelected: {
    color: '#D81B60',
    fontWeight: '700',
  },
});
