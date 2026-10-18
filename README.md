# 🎺 Band Baaja Baarat (बैंड बाजा बारात) - React Native Mobile Application

> Premium Royal Wedding & Baarat Experience Mobile App Built with React Native CLI

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
├── backend/                     # Express + MongoDB API
│   ├── src/
│   └── docs/API.md
├── src/
│   ├── services/api.ts          # Frontend API client
│   ├── screens/
│   └── ...
├── App.tsx
└── package.json
```

---

## 🔌 Backend + MongoDB

1. Start MongoDB locally (`mongod`) or Docker:
   ```bash
   docker run -d --name bbb-mongo -p 27017:27017 mongo:7
   ```
2. Copy env and install:
   ```bash
   cd backend
   copy .env.example .env   # Windows
   npm install
   npm run seed
   npm run dev
   ```
3. API: `http://localhost:4000/api`  
   Docs: `backend/docs/API.md`

Frontend env (project root `.env`):
```
API_URL=http://localhost:4000
```
On a physical phone, use your computer's LAN IP, e.g. `http://192.168.1.10:4000`. Restart Metro after changing it.

Seeded vendor login:
- Phone OTP: `9826012345` (OTP is returned by the API in development)
- Email: `contact@royalevents.in` / password `Vendor@123`

---

## 📱 How to Run (React Native CLI)

Prerequisites: Node 22+, JDK 17, Android Studio (SDK 36), and for iOS a Mac with Xcode + CocoaPods.

```bash
npm install
```

Start Metro, then run a native build in a second terminal:

```bash
npm start
npm run android
# macOS only:
npm run ios
```

Android emulator can use `API_URL=http://10.0.2.2:4000` to reach the host machine. A physical device must use your LAN IP.

Debug APK (after a successful Gradle setup):

```bash
cd android
./gradlew assembleDebug
```

The APK is written to `android/app/build/outputs/apk/debug/`.
