import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FilterSortModalProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
  onApply?: (filters: any) => void;
}

export const FilterSortModal: React.FC<FilterSortModalProps> = ({
  navigation,
  route,
  onBack,
  onApply,
}) => {
  const insets = useSafeAreaInsets();

  // Filter States
  const [selectedSort, setSelectedSort] = useState<string>('rating_high');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('50k_100k');
  const [selectedRating, setSelectedRating] = useState<number>(4.5);
  const [selectedDistance, setSelectedDistance] = useState<string>('15km');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Decorators',
    'Dhol',
    'Brass Band',
  ]);

  const categories = [
    { id: 'Decorators', name: 'Mandap & Decor' },
    { id: 'Dhol', name: 'Royal Dhol' },
    { id: 'Brass Band', name: 'Brass Band' },
    { id: 'Dj', name: 'DJ & Sound' },
    { id: 'Photography', name: 'Photography' },
    { id: 'Mehndi', name: 'Bridal Mehndi' },
    { id: 'Buggi', name: 'Wedding Buggi' },
    { id: 'Catering', name: 'Catering' },
  ];

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleReset = () => {
    setSelectedSort('popular');
    setSelectedPriceRange('all');
    setSelectedRating(4.0);
    setSelectedDistance('any');
    setOnlyVerified(false);
    setSelectedCategories([]);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('AllServices');
    }
  };

  const handleApply = () => {
    const filterData = {
      sort: selectedSort,
      priceRange: selectedPriceRange,
      rating: selectedRating,
      distance: selectedDistance,
      onlyVerified,
      categories: selectedCategories,
    };
    if (onApply) {
      onApply(filterData);
    } else if (route?.params?.returnScreen && navigation?.navigate) {
      navigation.navigate(route.params.returnScreen, { appliedFilters: filterData });
    }
    handleBack();
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
            <Ionicons name="close" size={24} color="#1C1B1F" />
          </TouchableOpacity>

          <View style={styles.titleColumn}>
            <Text style={styles.screenTitle}>
              Filter & <Text style={styles.screenTitleHighlight}>Sort</Text>
            </Text>
            <Text style={styles.screenSubtitle}>Refine wedding vendors & pricing</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.resetHeaderBtn} onPress={handleReset}>
          <Text style={styles.resetHeaderText}>Reset All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Sort Options */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.optionsWrap}>
            {[
              { id: 'popular', label: '🔥 Most Popular' },
              { id: 'rating_high', label: '★ Highest Rated (4.5+)' },
              { id: 'price_low', label: 'Price: Low to High' },
              { id: 'price_high', label: 'Price: High to Low' },
              { id: 'distance_near', label: '📍 Nearest First' },
            ].map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.pillBtn, selectedSort === s.id && styles.pillBtnActive]}
                onPress={() => setSelectedSort(s.id)}
              >
                <Text style={[styles.pillText, selectedSort === s.id && styles.pillTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2. Budget / Price Range */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Budget / Price Range</Text>
          <View style={styles.optionsWrap}>
            {[
              { id: 'under_15k', label: 'Under ₹15,000' },
              { id: '15k_50k', label: '₹15,000 - ₹50,000' },
              { id: '50k_100k', label: '₹50,000 - ₹1,00,000' },
              { id: 'above_100k', label: '₹1,00,000+' },
            ].map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.pillBtn, selectedPriceRange === p.id && styles.pillBtnActive]}
                onPress={() => setSelectedPriceRange(p.id)}
              >
                <Text style={[styles.pillText, selectedPriceRange === p.id && styles.pillTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Service Categories Multi-select */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <View style={styles.optionsWrap}>
            {categories.map((c) => {
              const isSelected = selectedCategories.includes(c.id);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.pillBtn, isSelected && styles.pillBtnActive]}
                  onPress={() => toggleCategory(c.id)}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                    {isSelected ? '✓ ' : '+ '}
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Minimum Star Rating */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Minimum Star Rating</Text>
          <View style={styles.optionsWrap}>
            {[4.5, 4.0, 3.5].map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.pillBtn, selectedRating === r && styles.pillBtnActive]}
                onPress={() => setSelectedRating(r)}
              >
                <Ionicons
                  name="star"
                  size={12}
                  color={selectedRating === r ? '#E5093A' : '#F59E0B'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.pillText, selectedRating === r && styles.pillTextActive]}>
                  {r} ★ & Above
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5. Distance Radius */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Distance Radius</Text>
          <View style={styles.optionsWrap}>
            {[
              { id: '5km', label: 'Within 5 km' },
              { id: '15km', label: 'Within 15 km' },
              { id: '30km', label: 'Within 30 km' },
              { id: 'any', label: 'Anywhere in Indore / MP' },
            ].map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[styles.pillBtn, selectedDistance === d.id && styles.pillBtnActive]}
                onPress={() => setSelectedDistance(d.id)}
              >
                <Text style={[styles.pillText, selectedDistance === d.id && styles.pillTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 6. Verified Badge Toggle */}
        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="shield-checkmark" size={16} color="#D81B60" style={{ marginRight: 6 }} />
              <Text style={styles.toggleTitle}>Verified & Top Rated Only</Text>
            </View>
            <Text style={styles.toggleSubtitle}>Only show background-checked & licensed wedding vendors</Text>
          </View>
          <Switch
            value={onlyVerified}
            onValueChange={setOnlyVerified}
            trackColor={{ false: '#CBD5E1', true: '#FECDD3' }}
            thumbColor={onlyVerified ? '#E5093A' : '#F1F5F9'}
          />
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Bottom Sticky Action Buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
        <TouchableOpacity style={styles.clearBtn} activeOpacity={0.8} onPress={handleReset}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyBtn} activeOpacity={0.9} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply Filters (38 Vendors)</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
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
  resetHeaderBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  resetHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E5093A',
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

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#E5093A',
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#E5093A',
    fontWeight: '700',
  },

  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  toggleSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },

  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  clearBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5093A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E5093A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
