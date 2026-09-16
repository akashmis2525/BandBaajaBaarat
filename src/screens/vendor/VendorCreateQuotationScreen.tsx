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

interface VendorCreateQuotationProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

interface QuotationItem {
  id: string;
  serviceName: string;
  price: number;
}

export const VendorCreateQuotationScreen: React.FC<VendorCreateQuotationProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const customerName = route?.params?.customerName || 'Rahul Verma & Priya Jain';
  const eventDate = route?.params?.eventDate || '25 Nov 2026';

  const [packageName, setPackageName] = useState('Grand Royal Wedding Mandap & Decor');
  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', serviceName: 'Grand Carved Mandap Setup with Rajwada Pillars', price: 40000 },
    { id: '2', serviceName: 'Floral Entry Grand Arch with Jasmine & Roses', price: 20000 },
    { id: '3', serviceName: 'Ambient Fairy Light Canopy & LED Wash Stage Lights', price: 15000 },
    { id: '4', serviceName: 'Royal Welcome Board with Acrylic Mirror Easel', price: 10000 },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [advanceRequirement, setAdvanceRequirement] = useState('25000');
  const [discountApplied, setDiscountApplied] = useState('0');

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountVal = parseInt(discountApplied) || 0;
  const grandTotal = Math.max(subtotal - discountVal, 0);

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPrice.trim()) {
      Alert.alert('Missing Info', 'Please enter service name and price.');
      return;
    }
    const priceNum = parseInt(newItemPrice) || 0;
    setItems([...items, { id: Date.now().toString(), serviceName: newItemName.trim(), price: priceNum }]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSendQuotation = () => {
    Alert.alert(
      'Quotation Sent! 📄',
      `Itemized quotation of ₹${grandTotal.toLocaleString('en-IN')} has been sent to ${customerName}.`,
      [
        {
          text: 'Open Price Negotiation Stream',
          onPress: () => {
            if (navigation?.navigate) {
              navigation.navigate('VendorNegotiate', {
                quotationAmount: grandTotal,
                customerName: customerName,
                packageName: packageName,
              });
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate('VendorDashboard');
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
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1B1F" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.screenTitle}>
            Create <Text style={styles.screenTitleHighlight}>Quotation</Text>
          </Text>
          <Text style={styles.screenSubtitle}>
            Build itemized package quote for {customerName}
          </Text>
        </View>

        {/* Top Right Decorative Tag */}
        <View style={styles.decorativeTag}>
          <View style={styles.tagGraphicBox}>
            <Ionicons name="document-text" size={16} color="#8A072D" />
          </View>
          <View style={styles.tagTextCol}>
            <Text style={styles.decorativeLine1}>Contract</Text>
            <Text style={styles.decorativeLine2}>Builder</Text>
            <Text style={styles.decorativeLine3}>Itemized ♡</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Header Info */}
        <View style={styles.clientCard}>
          <View style={styles.clientIconBox}>
            <Ionicons name="person" size={18} color="#8A072D" />
          </View>
          <View style={styles.clientInfoCol}>
            <Text style={styles.clientName}>{customerName}</Text>
            <Text style={styles.clientEventDate}>Event Date: {eventDate} • Royal Greens, Indore</Text>
          </View>
        </View>

        {/* Package Title */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Package / Setup Title</Text>
          <TextInput
            style={styles.input}
            value={packageName}
            onChangeText={setPackageName}
            placeholder="e.g. Grand Royal Wedding Mandap & Decor"
          />
        </View>

        {/* Itemized Services Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Itemized Service Breakdown</Text>
          <Text style={styles.sectionSub}>All included services with pricing</Text>

          <View style={styles.itemsList}>
            {items.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemIndexBox}>
                  <Text style={styles.itemIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemNameText}>{item.serviceName}</Text>
                  <Text style={styles.itemPriceText}>₹ {item.price.toLocaleString('en-IN')}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.deleteItemBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#E11D48" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add New Item Row */}
          <View style={styles.addNewItemCard}>
            <Text style={styles.addLabel}>+ Add Another Service / Inclusions</Text>
            <TextInput
              style={[styles.input, { marginBottom: 6 }]}
              placeholder="Service Name (e.g. VIP Sofa Seating)"
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Price ₹"
                keyboardType="number-pad"
                value={newItemPrice}
                onChangeText={setNewItemPrice}
              />
              <TouchableOpacity
                style={styles.addItemBtn}
                onPress={handleAddItem}
              >
                <Text style={styles.addItemBtnText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Pricing Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>₹ {subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Special Seasonal Discount</Text>
            <Text style={[styles.summaryVal, { color: '#16A34A' }]}>- ₹ {discountVal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRowTotal}>
            <Text style={styles.totalLabel}>Total Quotation Price</Text>
            <Text style={styles.totalVal}>₹ {grandTotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.advanceRow}>
            <Text style={styles.advanceLabel}>Required Advance Token</Text>
            <Text style={styles.advanceVal}>₹ {parseInt(advanceRequirement).toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={styles.sendQuoteBtn}
          activeOpacity={0.88}
          onPress={handleSendQuotation}
        >
          <Text style={styles.sendQuoteBtnText}>Send Quotation to Customer (₹{grandTotal.toLocaleString('en-IN')})</Text>
          <Ionicons name="paper-plane" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
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

  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
    marginBottom: 14,
  },
  clientIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clientInfoCol: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8A072D',
  },
  clientEventDate: {
    fontSize: 11,
    color: '#9F1239',
    marginTop: 1,
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1E293B',
  },

  itemsList: {
    gap: 8,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemIndexBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#8A072D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  itemIndexText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  itemTextCol: {
    flex: 1,
  },
  itemNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemPriceText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#8A072D',
    marginTop: 2,
  },
  deleteItemBtn: {
    padding: 4,
  },

  addNewItemCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  addLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A072D',
    marginBottom: 6,
  },
  addItemBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#8A072D',
  },
  advanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  advanceLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
  },
  advanceVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },

  sendQuoteBtn: {
    backgroundColor: '#8A072D',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  sendQuoteBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
