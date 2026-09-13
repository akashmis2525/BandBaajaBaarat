export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  ServiceDetails: { id: string; title: string };
  BookingScreen: { serviceId?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Bookings: undefined;
  Favorites: undefined;
  Profile: undefined;
};
