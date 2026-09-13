import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { RateReviewScreen } from '../screens/RateReviewScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SavedPaymentMethodsScreen } from '../screens/SavedPaymentMethodsScreen';
import { AddPaymentMethodScreen } from '../screens/AddPaymentMethodScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { ReferEarnScreen } from '../screens/ReferEarnScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SavedItemsScreen } from '../screens/SavedItemsScreen';
import { CompareServicesScreen } from '../screens/CompareServicesScreen';
import { VenueBookingDetailsScreen } from '../screens/VenueBookingDetailsScreen';
import { PaymentBookingScreen } from '../screens/PaymentBookingScreen';
import { BookingTrackingScreen } from '../screens/BookingTrackingScreen';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
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
    </Stack.Navigator>
  );
};

const ServicesNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllServices" component={ServicesScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="PaymentBooking" component={PaymentBookingScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
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

const BookingsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="PaymentBooking" component={PaymentBookingScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
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

const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatMain" component={ChatScreen} />
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

const NotificationsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="VenueBookingDetails" component={VenueBookingDetailsScreen} />
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingTracking" component={BookingTrackingScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />
    </Stack.Navigator>
  );
};

const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
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
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<
    'splash' | 'onboarding' | 'location' | 'login' | 'profile' | 'main'
  >('splash');
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  if (currentStep === 'splash') {
    return <SplashScreen onFinish={() => setCurrentStep('onboarding')} />;
  }

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
          tabBarIcon: ({ focused, color, size }) => {
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
        <Tab.Screen name="Profile" component={ProfileNavigator} options={{ title: 'Profile' }} />
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
