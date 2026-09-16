import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Customer Screens
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LocationAccessScreen } from '../screens/LocationAccessScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CompleteProfileScreen } from '../screens/CompleteProfileScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { BookingSummaryScreen } from '../screens/BookingSummaryScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { BookingConfirmedScreen } from '../screens/BookingConfirmedScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { BookingDetailsScreen } from '../screens/BookingDetailsScreen';
import { RescheduleScreen } from '../screens/RescheduleScreen';
import { CancelBookingScreen } from '../screens/CancelBookingScreen';
import { DownloadInvoiceScreen } from '../screens/DownloadInvoiceScreen';
import { InvoicePaymentScreen } from '../screens/InvoicePaymentScreen';
import { MakePaymentScreen } from '../screens/MakePaymentScreen';
import { OffersPromoCouponsScreen } from '../screens/OffersPromoCouponsScreen';
import { PhotoGalleryScreen } from '../screens/PhotoGalleryScreen';
import { WeddingPlannerToolkitScreen } from '../screens/WeddingPlannerToolkitScreen';
import { SupportTicketScreen } from '../screens/SupportTicketScreen';
import { FilterSortModal } from '../screens/FilterSortModal';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { RateReviewScreen } from '../screens/RateReviewScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ScheduleMeetingScreen } from '../screens/ScheduleMeetingScreen';
import { MeetingScheduledScreen } from '../screens/MeetingScheduledScreen';
import { NegotiatePriceScreen } from '../screens/NegotiatePriceScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { MyAddressesScreen } from '../screens/MyAddressesScreen';
import { AddNewAddressScreen } from '../screens/AddNewAddressScreen';
import { SavedPaymentMethodsScreen } from '../screens/SavedPaymentMethodsScreen';
import { AddPaymentMethodScreen } from '../screens/AddPaymentMethodScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { ReferEarnScreen } from '../screens/ReferEarnScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TermsConditionsScreen } from '../screens/TermsConditionsScreen';
import { LogoutScreen } from '../screens/LogoutScreen';
import { SavedItemsScreen } from '../screens/SavedItemsScreen';
import { CompareServicesScreen } from '../screens/CompareServicesScreen';
import { VenueBookingDetailsScreen } from '../screens/VenueBookingDetailsScreen';
import { PaymentBookingScreen } from '../screens/PaymentBookingScreen';
import { BookingTrackingScreen } from '../screens/BookingTrackingScreen';

// Vendor Screens
import { RoleSelectScreen } from '../screens/vendor/RoleSelectScreen';
import { VendorLoginScreen } from '../screens/vendor/VendorLoginScreen';
import { VendorKYCScreen } from '../screens/vendor/VendorKYCScreen';
import { VendorDashboardScreen } from '../screens/vendor/VendorDashboardScreen';
import { VendorLeadsScreen } from '../screens/vendor/VendorLeadsScreen';
import { VendorMeetingManagerScreen } from '../screens/vendor/VendorMeetingManagerScreen';
import { VendorCalendarScreen } from '../screens/vendor/VendorCalendarScreen';
import { VendorCreateQuotationScreen } from '../screens/vendor/VendorCreateQuotationScreen';
import { VendorNegotiateScreen } from '../screens/vendor/VendorNegotiateScreen';
import { VendorBookingsScreen } from '../screens/vendor/VendorBookingsScreen';
import { VendorOrderExecutionScreen } from '../screens/vendor/VendorOrderExecutionScreen';
import { VendorWalletPayoutScreen } from '../screens/vendor/VendorWalletPayoutScreen';
import { VendorPortfolioManagerScreen } from '../screens/vendor/VendorPortfolioManagerScreen';
import { VendorProfileSettingsScreen } from '../screens/vendor/VendorProfileSettingsScreen';

import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Customer Home Navigator
const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
      <Stack.Screen name="CompareServices" component={CompareServicesScreen} />
      <Stack.Screen name="OffersPromoCoupons" component={OffersPromoCouponsScreen} />
      <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
      <Stack.Screen name="WeddingPlannerToolkit" component={WeddingPlannerToolkitScreen} />
      <Stack.Screen name="SupportTicket" component={SupportTicketScreen} />
      <Stack.Screen name="FilterSort" component={FilterSortModal} />
      <Stack.Screen name="NegotiatePrice" component={NegotiatePriceScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="PaymentBooking" component={PaymentBookingScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <Stack.Screen name="InvoicePayment" component={InvoicePaymentScreen} />
      <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
    </Stack.Navigator>
  );
};

// Customer Services Navigator
const ServicesNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllServices" component={ServicesScreen} />
      <Stack.Screen name="FilterSort" component={FilterSortModal} />
      <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
      <Stack.Screen name="OffersPromoCoupons" component={OffersPromoCouponsScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="NegotiatePrice" component={NegotiatePriceScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="PaymentBooking" component={PaymentBookingScreen} />
      <Stack.Screen name="InvoicePayment" component={InvoicePaymentScreen} />
      <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <Stack.Screen name="CompareServices" component={CompareServicesScreen} />
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
    </Stack.Navigator>
  );
};

// Customer Bookings Navigator
const BookingsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="WeddingPlannerToolkit" component={WeddingPlannerToolkitScreen} />
      <Stack.Screen name="SupportTicket" component={SupportTicketScreen} />
      <Stack.Screen name="OffersPromoCoupons" component={OffersPromoCouponsScreen} />
      <Stack.Screen name="NegotiatePrice" component={NegotiatePriceScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="PaymentBooking" component={PaymentBookingScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <Stack.Screen name="InvoicePayment" component={InvoicePaymentScreen} />
      <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="DownloadInvoice" component={DownloadInvoiceScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="ChatMain" component={ChatScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    </Stack.Navigator>
  );
};

// Customer Chat Navigator
const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatMain" component={ChatScreen} />
      <Stack.Screen name="ScheduleMeeting" component={ScheduleMeetingScreen} />
      <Stack.Screen name="MeetingScheduled" component={MeetingScheduledScreen} />
      <Stack.Screen name="NegotiatePrice" component={NegotiatePriceScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="InvoicePayment" component={InvoicePaymentScreen} />
      <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
      <Stack.Screen name="OffersPromoCoupons" component={OffersPromoCouponsScreen} />
      <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
      <Stack.Screen name="SupportTicket" component={SupportTicketScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="PaymentBooking" component={PaymentBookingScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
    </Stack.Navigator>
  );
};

// Customer Notifications Navigator
const NotificationsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />
    </Stack.Navigator>
  );
};

// Customer Profile Navigator
const ProfileNavigator: React.FC<{ onLogout?: () => void; onSwitchToVendor?: () => void }> = ({
  onLogout,
  onSwitchToVendor,
}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain">
        {(props) => <ProfileScreen {...props} onSwitchToVendor={onSwitchToVendor} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyAddresses" component={MyAddressesScreen} />
      <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
      <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
      <Stack.Screen name="CompareServices" component={CompareServicesScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="PaymentBooking" component={PaymentBookingScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
      <Stack.Screen name="SavedPaymentMethods" component={SavedPaymentMethodsScreen} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="ReferEarn" component={ReferEarnScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="Logout">
        {(props) => <LogoutScreen {...props} onConfirmLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

// Vendor Bottom Tab Navigator
const VendorTabNavigator: React.FC<{ onSwitchToCustomer?: () => void; onLogout?: () => void }> = ({
  onSwitchToCustomer,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + (insets.bottom > 0 ? insets.bottom - 6 : 4),
            paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          },
        ],
        tabBarActiveTintColor: '#8A072D',
        tabBarInactiveTintColor: '#68595D',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'business';

          if (route.name === 'VendorDashboardTab') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'VendorLeadsTab') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'VendorBookingsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'VendorSettingsTab') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="VendorDashboardTab"
        options={{ title: 'Dashboard' }}
      >
        {(props) => (
          <VendorDashboardScreen
            {...props}
            onNavigate={(screen, params) => props.navigation.navigate(screen, params)}
            onSwitchToCustomer={onSwitchToCustomer}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="VendorLeadsTab"
        component={VendorLeadsScreen}
        options={{ title: 'Leads' }}
      />
      <Tab.Screen
        name="VendorBookingsTab"
        component={VendorBookingsScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="VendorSettingsTab"
        options={{ title: 'Settings' }}
      >
        {(props) => (
          <VendorProfileSettingsScreen
            {...props}
            onSwitchToCustomer={onSwitchToCustomer}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Vendor Root Stack Navigator
const VendorStackNavigator: React.FC<{ onSwitchToCustomer?: () => void; onLogout?: () => void }> = ({
  onSwitchToCustomer,
  onLogout,
}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VendorMainTabs">
        {(props) => (
          <VendorTabNavigator
            {...props}
            onSwitchToCustomer={onSwitchToCustomer}
            onLogout={onLogout}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="VendorLeads" component={VendorLeadsScreen} />
      <Stack.Screen name="VendorMeetingManager" component={VendorMeetingManagerScreen} />
      <Stack.Screen name="VendorCalendar" component={VendorCalendarScreen} />
      <Stack.Screen name="VendorCreateQuotation" component={VendorCreateQuotationScreen} />
      <Stack.Screen name="VendorNegotiate" component={VendorNegotiateScreen} />
      <Stack.Screen name="VendorBookings" component={VendorBookingsScreen} />
      <Stack.Screen name="VendorOrderExecution" component={VendorOrderExecutionScreen} />
      <Stack.Screen name="VendorWalletPayout" component={VendorWalletPayoutScreen} />
      <Stack.Screen name="VendorPortfolioManager" component={VendorPortfolioManagerScreen} />
      <Stack.Screen name="VendorKYC" component={VendorKYCScreen} />
      <Stack.Screen name="ChatMain" component={ChatScreen} />
    </Stack.Navigator>
  );
};

// Root App Navigator
export const AppNavigator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<
    | 'splash'
    | 'onboarding'
    | 'role_select'
    | 'location'
    | 'login'
    | 'profile'
    | 'main'
    | 'vendor_login'
    | 'vendor_kyc'
    | 'vendor_main'
  >('splash');

  const [appMode, setAppMode] = useState<'customer' | 'vendor'>('customer');
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  if (currentStep === 'splash') {
    return (
      <SplashScreen
        onFinish={() => setCurrentStep('role_select')}
      />
    );
  }

  if (currentStep === 'role_select') {
    return (
      <RoleSelectScreen
        onSelectCustomer={() => {
          setAppMode('customer');
          setCurrentStep('onboarding');
        }}
        onSelectVendor={() => {
          setAppMode('vendor');
          setCurrentStep('vendor_login');
        }}
      />
    );
  }

  // Customer Onboarding Flow
  if (currentStep === 'onboarding') {
    return (
      <OnboardingScreen
        onFinish={() => setCurrentStep('location')}
      />
    );
  }

  if (currentStep === 'location') {
    return (
      <LocationAccessScreen
        onSuccess={() => setCurrentStep('login')}
        onSkip={() => setCurrentStep('login')}
      />
    );
  }

  if (currentStep === 'login') {
    return (
      <LoginScreen
        onSuccess={(phone) => {
          login(phone);
          setCurrentStep('profile');
        }}
        onBack={() => setCurrentStep('location')}
        onSkip={() => setCurrentStep('main')}
      />
    );
  }

  if (currentStep === 'profile') {
    return (
      <CompleteProfileScreen
        onSuccess={() => setCurrentStep('main')}
        onBack={() => setCurrentStep('login')}
        onSkip={() => setCurrentStep('main')}
      />
    );
  }

  // Vendor Auth & KYC Flow
  if (currentStep === 'vendor_login') {
    return (
      <VendorLoginScreen
        onSuccess={() => setCurrentStep('vendor_kyc')}
        onBack={() => setCurrentStep('role_select')}
        onSwitchToCustomer={() => {
          setAppMode('customer');
          setCurrentStep('main');
        }}
      />
    );
  }

  if (currentStep === 'vendor_kyc') {
    return (
      <VendorKYCScreen
        onSuccess={() => {
          setAppMode('vendor');
          setCurrentStep('vendor_main');
        }}
        onBack={() => setCurrentStep('vendor_login')}
      />
    );
  }

  // Vendor Main Portal
  if (appMode === 'vendor' || currentStep === 'vendor_main') {
    return (
      <NavigationContainer>
        <VendorStackNavigator
          onSwitchToCustomer={() => {
            setAppMode('customer');
            setCurrentStep('main');
          }}
          onLogout={() => {
            setAppMode('customer');
            setCurrentStep('role_select');
          }}
        />
      </NavigationContainer>
    );
  }

  // Customer Main App
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              height: 60 + (insets.bottom > 0 ? insets.bottom - 6 : 4),
              paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
            },
          ],
          tabBarActiveTintColor: '#8A072D',
          tabBarInactiveTintColor: '#68595D',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Services') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Bookings') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <Ionicons name={iconName} size={22} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeNavigator} options={{ title: 'Home' }} />
        <Tab.Screen name="Services" component={ServicesNavigator} options={{ title: 'Services' }} />
        <Tab.Screen name="Bookings" component={BookingsNavigator} options={{ title: 'My Bookings' }} />
        <Tab.Screen name="Notifications" component={NotificationsNavigator} options={{ title: 'Notifications' }} />
        <Tab.Screen name="Chat" component={ChatNavigator} options={{ title: 'Chat' }} />
        <Tab.Screen name="Profile" options={{ title: 'Profile' }}>
          {(props) => (
            <ProfileNavigator
              {...props}
              onLogout={() => setCurrentStep('role_select')}
              onSwitchToVendor={() => {
                setAppMode('vendor');
                setCurrentStep('vendor_main');
              }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0D4CB',
    paddingTop: 6,
    elevation: 10,
    shadowColor: '#8A072D',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
});
