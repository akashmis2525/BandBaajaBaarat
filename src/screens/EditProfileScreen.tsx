import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { Assets } from '../constants/assets';
import { useAuth } from '../context/AuthContext';

interface EditProfileScreenProps {
  navigation?: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(user.name || 'Aakash Mishra');
  const [mobileNumber, setMobileNumber] = useState(
    user.mobileNumber ? `+91 ${user.mobileNumber}` : '+91 97133 32997'
  );
  const [emailAddress, setEmailAddress] = useState('aakashmishra@email.com');
  const [dob, setDob] = useState('12 May 1995');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [location, setLocation] = useState('Indore, Madhya Pradesh');
  const [language, setLanguage] = useState('English');
  const [aboutMe, setAboutMe] = useState(
    'I love to plan memorable events for my family and friends.'
  );

  // Interests multi-select state
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Wedding']);

  // Modals state
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDobModal, setShowDobModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Available options
  const interestOptions = [
    'Wedding',
    'Birthday',
    'Corporate Event',
    'Engagement',
    'Baby Shower',
    'Anniversary',
    'Other',
  ];

  const languageOptions = ['English', 'Hindi', 'Hinglish', 'Gujarati', 'Marathi', 'Bengali'];
  const locationOptions = [
    'Indore, Madhya Pradesh',
    'Bhopal, Madhya Pradesh',
    'Ujjain, Madhya Pradesh',
    'Mumbai, Maharashtra',
    'Delhi NCR',
    'Jaipur, Rajasthan',
    'Ahmedabad, Gujarat',
    'Bangalore, Karnataka',
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== item));
      }
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleSaveChanges = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return;
    }

    // Update global auth context
    updateProfile({
      name: fullName.trim(),
    });

    Alert.alert(
      'Profile Updated',
      'Your profile information has been successfully saved!',
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

  const handleUpdatePhoto = () => {
    Alert.alert(
      'Update Profile Photo',
      'Choose an option to update your profile photo',
      [
        { text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Camera opened successfully') },
        { text: 'Choose from Gallery', onPress: () => Alert.alert('Gallery', 'Photo selected successfully') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
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
              Edit <Text style={styles.screenTitleHighlight}>Profile</Text>
            </Text>
            <Text style={styles.screenSubtitle}>Keep your information up to date</Text>
          </View>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <Text style={styles.decorativeLine1}>Better</Text>
          <Text style={styles.decorativeLine2}>Events</Text>
          <Text style={styles.decorativeLine3}>Happier You ♡</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={Assets.groomBaarat}
                style={styles.avatarImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.cameraButton}
                activeOpacity={0.8}
                onPress={handleUpdatePhoto}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleUpdatePhoto}>
              <Text style={styles.updatePhotoText}>Update your photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.fieldBox}>
              <View style={styles.fieldIconWrapper}>
                <Ionicons name="person-outline" size={20} color="#4A5568" />
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.fieldBox}>
              <View style={styles.fieldIconWrapper}>
                <Ionicons name="call-outline" size={20} color="#4A5568" />
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.fieldBox}>
              <View style={styles.fieldIconWrapper}>
                <Ionicons name="mail-outline" size={20} color="#4A5568" />
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="Enter email address"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              </View>
            </View>

            {/* Date of Birth */}
            <TouchableOpacity
              style={styles.fieldBox}
              activeOpacity={0.8}
              onPress={() => setShowDobModal(true)}
            >
              <View style={styles.fieldIconWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#4A5568" />
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <Text style={styles.fieldValueText}>{dob}</Text>
              </View>
              <Ionicons name="calendar-outline" size={20} color="#4A5568" />
            </TouchableOpacity>

            {/* Gender */}
            <View style={styles.fieldBox}>
              <View style={styles.fieldIconWrapper}>
                <Ionicons name="person-outline" size={20} color="#4A5568" />
              </View>
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderPillsRow}>
                {(['Male', 'Female', 'Other'] as const).map((item) => {
                  const isSelected = gender === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.genderPill,
                        isSelected && styles.genderPillActive,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => setGender(item)}
                    >
                      <Text
                        style={[
                          styles.genderPillText,
                          isSelected && styles.genderPillTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Location */}
            <TouchableOpacity
              style={styles.fieldBox}
              activeOpacity={0.8}
              onPress={() => setShowLocationModal(true)}
            >
              <View style={styles.fieldIconWrapper}>
                <Ionicons name="location-outline" size={20} color="#4A5568" />
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>Location</Text>
                <Text style={styles.fieldValueText}>{location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#718096" />
            </TouchableOpacity>

            {/* Preferred Language */}
            <TouchableOpacity
              style={styles.fieldBox}
              activeOpacity={0.8}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={styles.fieldIconWrapper}>
                <MaterialIcons name="translate" size={20} color="#4A5568" />
              </View>
              <View style={styles.fieldInputCol}>
                <Text style={styles.fieldLabel}>Preferred Language</Text>
                <Text style={styles.fieldValueText}>{language}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#718096" />
            </TouchableOpacity>
          </View>

          {/* Interests Section */}
          <View style={styles.interestsSection}>
            <Text style={styles.interestsHeading}>Interests</Text>
            <Text style={styles.interestsSubheading}>
              Select the types of services you are interested in
            </Text>

            <View style={styles.interestsWrap}>
              {interestOptions.map((item) => {
                const isSelected = selectedInterests.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.interestChip,
                      isSelected && styles.interestChipActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => toggleInterest(item)}
                  >
                    <Text
                      style={[
                        styles.interestChipText,
                        isSelected && styles.interestChipTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* About Me Section */}
          <View style={styles.aboutMeCard}>
            <View style={styles.aboutMeHeader}>
              <Ionicons name="document-text-outline" size={18} color="#4A5568" />
              <Text style={styles.aboutMeLabel}>About Me (Optional)</Text>
            </View>

            <TextInput
              style={styles.aboutMeInput}
              multiline
              numberOfLines={3}
              value={aboutMe}
              onChangeText={(text) => {
                if (text.length <= 200) {
                  setAboutMe(text);
                }
              }}
              placeholder="Tell us a little bit about yourself..."
              placeholderTextColor="#A0AEC0"
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{aboutMe.length}/200</Text>
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity
            style={styles.saveChangesButton}
            activeOpacity={0.85}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveChangesButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Preferred Language</Text>
            {languageOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.modalOption,
                  language === item && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setLanguage(item);
                  setShowLanguageModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    language === item && styles.modalOptionTextActive,
                  ]}
                >
                  {item}
                </Text>
                {language === item && (
                  <Ionicons name="checkmark-sharp" size={18} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Location</Text>
            {locationOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.modalOption,
                  location === item && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setLocation(item);
                  setShowLocationModal(false);
                }}
              >
                <Ionicons name="location-sharp" size={18} color="#8A072D" />
                <Text
                  style={[
                    styles.modalOptionText,
                    { marginLeft: 8 },
                    location === item && styles.modalOptionTextActive,
                  ]}
                >
                  {item}
                </Text>
                {location === item && (
                  <Ionicons name="checkmark-sharp" size={18} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date of Birth Selection Modal */}
      <Modal
        visible={showDobModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDobModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDobModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Date of Birth</Text>
            {[
              '12 May 1995',
              '15 August 1996',
              '24 November 1994',
              '10 January 1998',
              '05 October 1993',
            ].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.modalOption, dob === item && styles.modalOptionActive]}
                onPress={() => {
                  setDob(item);
                  setShowDobModal(false);
                }}
              >
                <Ionicons name="calendar-outline" size={18} color="#8A072D" />
                <Text
                  style={[
                    styles.modalOptionText,
                    { marginLeft: 8 },
                    dob === item && styles.modalOptionTextActive,
                  ]}
                >
                  {item}
                </Text>
                {dob === item && (
                  <Ionicons name="checkmark-sharp" size={18} color="#8A072D" />
                )}
              </TouchableOpacity>
            ))}
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
  keyboardContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
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
    color: '#8A072D',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#556987',
    marginTop: 2,
    fontWeight: '400',
  },
  decorativeTag: {
    backgroundColor: '#FDECEF',
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeLine1: {
    fontSize: 11,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 13,
  },
  decorativeLine2: {
    fontSize: 11,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 13,
  },
  decorativeLine3: {
    fontSize: 10,
    color: '#C2185B',
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 13,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarWrapper: {
    position: 'relative',
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  updatePhotoText: {
    marginTop: 8,
    fontSize: 13,
    color: '#4A6FA5',
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 8,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  fieldIconWrapper: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fieldInputCol: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '400',
    marginBottom: 2,
  },
  fieldInput: {
    fontSize: 14,
    color: '#1C1B1F',
    fontWeight: '600',
    padding: 0,
    margin: 0,
  },
  fieldValueText: {
    fontSize: 14,
    color: '#1C1B1F',
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
    marginRight: 4,
  },
  genderLabel: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '500',
    marginRight: 8,
  },
  genderPillsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
  },
  genderPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPillActive: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  genderPillText: {
    fontSize: 12,
    color: '#2D3748',
    fontWeight: '500',
  },
  genderPillTextActive: {
    color: '#E53E3E',
    fontWeight: '600',
  },
  interestsSection: {
    marginTop: 10,
    marginBottom: 12,
  },
  interestsHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  interestsSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    marginBottom: 10,
  },
  interestsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#F0E2E5',
    marginBottom: 4,
  },
  interestChipActive: {
    backgroundColor: '#C2185B',
    borderColor: '#C2185B',
  },
  interestChipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  interestChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  aboutMeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 18,
  },
  aboutMeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutMeLabel: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
    marginLeft: 6,
  },
  aboutMeInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#2D3748',
    minHeight: 70,
    backgroundColor: '#FAFCFE',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: '#718096',
    marginTop: 6,
  },
  saveChangesButton: {
    backgroundColor: '#C2185B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C2185B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveChangesButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
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
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 14,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionActive: {
    backgroundColor: '#FFF5F7',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  modalOptionText: {
    fontSize: 14,
    color: '#334155',
  },
  modalOptionTextActive: {
    color: '#8A072D',
    fontWeight: '700',
  },
});
