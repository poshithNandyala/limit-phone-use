# 📱 Digital Wellbeing - Screen Time Reduction App

> Reclaim your time. Reduce your screen time to almost zero with smart, personalized reminders.

![Digital Wellbeing](https://img.shields.io/badge/Expo-SDK%2054-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

- **100+ Curated Quotes**: Hand-picked motivational quotes across 10 categories (Health,
  Relationships, Productivity, Mindfulness, Sleep, Nature, Family, Focus, Creativity, Growth)
- **Works Fully Offline**: The quote library ships inside the app — no backend required
- **Smart Notifications**: Configurable reminders (5–60 min) while using your phone
- **Optional AI Reminders**: Plug in a backend URL for AI-generated personalized reasons, or mix AI + quotes
- **Favorites**: Heart any quote to save it, browse your favorites anytime
- **Quote Library Tab**: Search and filter all quotes by category
- **Share Quotes**: Share any quote to your favorite apps
- **Daily Streaks**: Tracks consecutive days you've used the app
- **Stats Dashboard**: Screen time, reminders sent, and a 7-day activity chart
- **Dark Mode**: Full light/dark theme support
- **Manual Reminders**: Instant notification button when you need motivation
- **Customizable**: Toggle notifications on/off, choose reminder interval, type, and categories

## 📸 Screenshots

*Add screenshots of your app here*

## 🚀 Quick Start for Users

### Option 1: Install APK (Android) - **Easiest**

1. Go to [Releases](../../releases)
2. Download the latest `digital-wellbeing-vX.Y.Z.apk`
3. Install on your Android device
4. Enable "Install from Unknown Sources" if prompted
5. Open the app and start your wellbeing journey! No setup, no backend, no account needed —
   it works completely offline.

Every release APK is built and published automatically by GitHub Actions
(see [`.github/workflows/release.yml`](.github/workflows/release.yml)) whenever a new
version tag is pushed.

### Option 2: Test with Expo Go

1. Install **Expo Go** from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) or [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Scan this QR code or use the link provided in releases
3. App loads instantly for testing

## 💻 For Developers

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or cloud)
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for building): `npm install -g eas-cli`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd digital-wellbeing

# Install backend dependencies
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration

# Install frontend dependencies
cd ../frontend
yarn install
cp .env.example .env
# Edit .env with your backend URL

# Start MongoDB
mongod

# Start backend (in backend directory)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Start frontend (in frontend directory)
expo start
```

### Environment Variables

**Backend (.env)**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=digital_wellbeing
EMERGENT_LLM_KEY=your_llm_key_here
```

**Frontend (.env)**
```
EXPO_PUBLIC_BACKEND_URL=http://your-backend-url:8001
```

### Building APK/IPA

```bash
cd frontend

# Configure EAS (first time only)
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

## 🏗️ Tech Stack

- **Frontend**: 
  - React Native with Expo SDK 54
  - TypeScript
  - Expo Notifications
  - AsyncStorage for local data
  - Expo Router for navigation

- **Backend (optional, for AI reminders only)**:
  - FastAPI (Python)
  - MongoDB for data storage
  - OpenAI GPT-5.2 integration
  - CORS enabled for cross-origin requests

- **AI Integration** (optional):
  - Emergent LLM integration library
  - OpenAI GPT-5.2 for personalized motivation

## 📱 How It Works

1. **App State Detection**: Tracks when you're actively using your phone
2. **Timer System**: Every N minutes (configurable, 5–60) of active use triggers a reminder
3. **Smart Reasons**: Picks a quote from the 100+ built-in, categorized quote library — completely
   offline, no backend required. If a backend URL is configured, it can also fetch AI-generated
   messages and mix them in, with an automatic fallback to the local library if the backend is
   unreachable.
4. **Local Notifications**: Native push notifications on your device
5. **Stats Tracking**: Screen time, reminders sent, streaks, and a 7-day chart — all stored locally

## 🎯 Use Cases

- Reduce phone addiction
- Improve work-life balance
- Better sleep hygiene (less screen time before bed)
- Increase face-to-face interactions
- Boost productivity and focus
- Improve mental health
- Encourage outdoor activities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Expo and React Native
- AI-powered by OpenAI GPT-5.2
- Inspired by the digital wellbeing movement

## 📧 Support

For issues, questions, or suggestions:
- Open an [Issue](../../issues)
- Star ⭐ this repo if you find it helpful!

---

**Made with 💚 for a healthier digital life**
