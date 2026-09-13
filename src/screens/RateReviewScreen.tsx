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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Assets } from '../constants/assets';

interface RateReviewScreenProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

export const RateReviewScreen: React.FC<RateReviewScreenProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Performance',
    'Professionalism',
    'On-time',
    'Overall Experience',
  ]);
  const [reviewText, setReviewText] = useState(
    'The team was amazing! They arrived on time, performed really well and made our event special. Highly recommended!'
  );
  const [photos, setPhotos] = useState<any[]>([
    Assets.serviceBrassBand,
    Assets.serviceDj,
    Assets.serviceDhol,
  ]);

  const tags = [
    { id: 'Performance', label: 'Performance', icon: 'musical-notes', type: 'ionicons' },
    { id: 'Professionalism', label: 'Professionalism', icon: 'person-outline', type: 'ionicons' },
    { id: 'On-time', label: 'On-time', icon: 'time-outline', type: 'ionicons' },
    { id: 'Value for Money', label: 'Value for Money', icon: 'rupee-sign', type: 'fontawesome' },
    { id: 'Behaviour', label: 'Behaviour', icon: 'people-outline', type: 'ionicons' },
    { id: 'Overall Experience', label: 'Overall Experience', icon: 'star', type: 'ionicons' },
  ];

  const getRatingFeedback = () => {
    switch (rating) {
      case 5:
        return 'Excellent!';
      case 4:
        return 'Very Good!';
      case 3:
        return 'Good!';
      case 2:
        return 'Needs Improvement';
      case 1:
        return 'Poor Experience';
      default:
        return 'Tap a star to rate';
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleAddPhoto = () => {
    Alert.alert('Add Photos', 'Select photos from your event gallery to attach with your review.', [
      {
        text: 'Add Sample Photo',
        onPress: () => setPhotos([...photos, Assets.weddingMandapArt]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Chat');
    }
  };

  const handleSubmitReview = () => {
    Alert.alert(
      'Review Submitted! 🎉',
      'Thank you for rating Royal Beats Dhol Group. Your review and photos have been posted to help other families find top vendors!',
      [
        {
          text: 'Back to Chat',
          onPress: handleBack,
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
            Rate & <Text style={styles.headerTitleMaroon}>Review</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Your feedback helps us improve</Text>
        </View>

        <View style={styles.scriptBadge}>
          <Text style={styles.scriptBadgeTop}>Good</Text>
          <Text style={styles.scriptBadgeMid}>Experiences</Text>
          <Text style={styles.scriptBadgeMid2}>Create</Text>
          <Text style={styles.scriptBadgeBot}>Happier Events ♡</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Vendor Snapshot Card */}
        <View style={styles.vendorCard}>
          <View style={styles.cardImgWrapper}>
            <Image source={Assets.serviceBrassBand} style={styles.cardImg} />
          </View>

          <View style={styles.cardDetailsCol}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>Dhol Services</Text>
            </View>

            <Text style={styles.vendorHeading} numberOfLines={1}>
              Royal Beats Dhol Group
            </Text>

            <View style={styles.ratingAndExpRow}>
              <Ionicons name="star" size={11} color="#E59819" />
              <Text style={styles.ratingScore}>4.6</Text>
              <Text style={styles.reviewsCountText}>(210 reviews)</Text>
              <Text style={styles.dividerPipe}>|</Text>
              <Text style={styles.expText}>5+ Years</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>15 Nov 2026, Sunday</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={11.5} color="#8A072D" />
              <Text style={styles.metaText}>5:00 PM - 9:00 PM (4 Hours)</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={11.5} color="#8A072D" />
              <Text style={styles.metaText} numberOfLines={1}>
                Indore, Madhya Pradesh
              </Text>
            </View>
          </View>
        </View>

        {/* 5-Star Rating Card */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>How was your overall experience?</Text>
          <Text style={styles.ratingSub}>Tap a star to rate</Text>

          {/* Stars Row */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                activeOpacity={0.8}
                onPress={() => setRating(star)}
                style={styles.starBtn}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={star <= rating ? '#F59E0B' : '#D1C4C7'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingFeedbackText}>{getRatingFeedback()}</Text>
        </View>

        {/* What did you like the most? Tags */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>What did you like the most?</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>

          <View style={styles.tagsGrid}>
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.tagPill, isSelected && styles.tagPillActive]}
                  activeOpacity={0.8}
                  onPress={() => toggleTag(tag.id)}
                >
                  {tag.type === 'fontawesome' ? (
                    <FontAwesome5
                      name={tag.icon as any}
                      size={12}
                      color={isSelected ? '#FFFFFF' : '#8A072D'}
                    />
                  ) : (
                    <Ionicons
                      name={tag.icon as any}
                      size={14}
                      color={isSelected ? '#FFFFFF' : '#8A072D'}
                    />
                  )}
                  <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Write a review Input */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Write a review (Optional)</Text>

          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Share your experience with this vendor..."
              placeholderTextColor="#A08C90"
              multiline
              numberOfLines={4}
              maxLength={500}
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />
            <Text style={styles.charCountText}>{reviewText.length}/500</Text>
          </View>
        </View>

        {/* Add Photos Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
          <Text style={styles.sectionSubtitle}>Share some moments from your event</Text>

          <View style={styles.photosRow}>
            {photos.map((img, idx) => (
              <View key={idx} style={styles.photoItem}>
                <Image source={img} style={styles.photoImg} />
                <TouchableOpacity
                  style={styles.deletePhotoBtn}
                  activeOpacity={0.8}
                  onPress={() => handleRemovePhoto(idx)}
                >
                  <Ionicons name="close-circle" size={18} color="#1A040A" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add More Photos Dotted Box */}
            <TouchableOpacity
              style={styles.addPhotoDottedBox}
              activeOpacity={0.8}
              onPress={handleAddPhoto}
            >
              <Ionicons name="camera-outline" size={22} color="#8A072D" />
              <Text style={styles.addPhotoText}>Add More{'\n'}Photos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Review Button */}
        <TouchableOpacity
          style={styles.submitReviewBtn}
          activeOpacity={0.85}
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitReviewBtnText}>Submit Review</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>

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
  scriptBadgeMid2: {
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

  // Vendor Snapshot Card
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 10,
    gap: 10,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardImgWrapper: {
    width: 100,
    height: 118,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FDECE6',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardDetailsCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTagText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#8A072D',
  },
  vendorHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A040A',
    marginTop: 2,
  },
  ratingAndExpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A040A',
  },
  reviewsCountText: {
    fontSize: 9,
    color: '#736064',
  },
  dividerPipe: {
    fontSize: 9,
    color: '#CBB2A9',
    marginHorizontal: 2,
  },
  expText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#554246',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 9.5,
    color: '#554246',
    flex: 1,
  },

  // 5 Star Card
  ratingCard: {
    backgroundColor: '#FDF1EC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F7D7CA',
    padding: 16,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  ratingSub: {
    fontSize: 10,
    color: '#736064',
    marginTop: 2,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  starBtn: {
    padding: 2,
  },
  ratingFeedbackText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A072D',
    marginTop: 6,
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    padding: 12,
    elevation: 2,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1A040A',
  },
  sectionSubtitle: {
    fontSize: 9.5,
    color: '#736064',
    marginTop: 1,
    marginBottom: 8,
  },

  // Tags Grid
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF1EC',
    borderWidth: 1,
    borderColor: '#F7D7CA',
    borderRadius: Spacing.borderRadius.round,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
    width: '48%',
  },
  tagPillActive: {
    backgroundColor: '#8A072D',
    borderColor: '#8A072D',
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1A040A',
  },
  tagTextActive: {
    color: '#FFFFFF',
  },

  // Text Input
  textInputWrapper: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0D4CB',
    borderRadius: 10,
    backgroundColor: '#FCFAF9',
    padding: 10,
  },
  textInput: {
    fontSize: 11,
    color: '#1A040A',
    minHeight: 60,
    lineHeight: 16,
  },
  charCountText: {
    alignSelf: 'flex-end',
    fontSize: 9,
    color: '#9C888D',
    marginTop: 4,
  },

  // Photos
  photosRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  photoItem: {
    width: 68,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FDECE6',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
  },
  addPhotoDottedBox: {
    width: 68,
    height: 68,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E8B6A8',
    backgroundColor: '#FFF9F7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addPhotoText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#8A072D',
    textAlign: 'center',
    lineHeight: 9,
  },

  // Submit Button
  submitReviewBtn: {
    flexDirection: 'row',
    backgroundColor: '#8A072D',
    borderRadius: Spacing.borderRadius.round,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  submitReviewBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
