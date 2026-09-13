# 🎺 Band Baaja Baarat (बैंड बाजा बारात) - React Native Mobile Application

> Premium Royal Wedding & Baarat Experience Mobile App Built with React Native & Expo

---

## 🎨 Theme & Brand Identity
- **Royal Maroon** (`#8A072D`) - Primary Brand & CTAs
- **Deep Burgundy** (`#5D0D10`) - Dark Backgrounds, Headers & Splash
- **Champagne Gold** (`#E5A580`) - Gold Accents & Highlights
- **Ivory Cream** (`#FBF3EF`) - Main App Background
- **Blush Pink** (`#F6D6CB`) - Icon Circles & Highlights
- **Soft Peach** (`#ECBFAB`) - Cards & Decorative UI

---

## 📁 Project Structure
```
BandBaajaBaarat/
├── assets/
│   └── images/
│       ├── logo-light.jpg       # Logo for Light Mode
│       ├── logo-dark.jpg        # Logo for Dark Mode / Splash
│       ├── app-icon.jpg         # App Icon (Royal Gold Border)
│       ├── app-store-icon.jpg   # iOS App Store Icon
│       └── play-store-icon.jpg  # Android Play Store Icon
├── src/
│   ├── components/              # RoyalButton, RoyalCard, RoyalHeader
│   ├── constants/               # Assets mapping & static data
│   ├── navigation/              # AppNavigator & Bottom Tabs
│   ├── screens/                 # SplashScreen, HomeScreen, ServicesScreen, BookingsScreen, ProfileScreen
│   ├── theme/                   # Colors, Typography, Spacing
│   └── types/                   # Navigation & Data TypeScript interfaces
├── App.tsx                      # Root App Entry
├── app.json                     # Expo & App Configuration
└── package.json
```

---

## 📱 How to Run & Test on Mobile Device

### Method 1: Live Testing with Expo Go (Instant on Real Phone)
1. Install **Expo Go** app on your Android phone from Google Play Store or iOS from App Store.
2. In the terminal inside this project folder:
   ```bash
   npx expo start
   ```
3. A QR code will appear in your terminal.
4. Open the **Expo Go** app on your phone and **Scan the QR Code** (or use Camera on iPhone).
5. The full app will load immediately on your physical device with live reload!

---

### Method 2: Build APK (Installable Android APK)
To generate a standalone `.apk` file for your Android phone:
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Login to Expo:
   ```bash
   eas login
   ```
3. Configure build:
   ```bash
   eas build:configure
   ```
4. Build the APK:
   ```bash
   eas build -p android --profile preview
   ```
5. Once completed, EAS gives you a direct download link to install the `.apk` on any phone.
