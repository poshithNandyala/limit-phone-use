# 📱 Digital Wellbeing - Screen Time Reduction App

> Reclaim your time. Reduce your screen time to almost zero with smart, personalized reminders.

![Digital Wellbeing](https://img.shields.io/badge/Expo-SDK%2054-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

- **Smart Notifications**: Automatic reminders every 10 minutes while using your phone
- **Dual Reminder System**: 
  - 30+ Pre-defined motivational messages
  - AI-generated personalized reasons (powered by GPT-5.2)
  - Mix mode for variety
- **Screen Time Tracking**: Real-time monitoring of phone usage
- **Statistics Dashboard**: Visual insights into your daily screen time
- **Manual Reminders**: Instant notification button when you need motivation
- **Customizable**: Toggle notifications on/off, choose reminder types

## 📸 Screenshots

*Add screenshots of your app here*

## 🚀 Quick Start for Users

### Option 1: Install APK (Android) - **Easiest**

1. Go to [Releases](../../releases)
2. Download the latest `digital-wellbeing.apk`
3. Install on your Android device
4. Enable "Install from Unknown Sources" if prompted
5. Open the app and start your wellbeing journey!

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

- **Backend**:
  - FastAPI (Python)
  - MongoDB for data storage
  - OpenAI GPT-5.2 integration
  - CORS enabled for cross-origin requests

- **AI Integration**:
  - Emergent LLM integration library
  - OpenAI GPT-5.2 for personalized motivation

## 📱 How It Works

1. **App State Detection**: Tracks when you're actively using your phone
2. **Timer System**: Every 10 minutes of active use triggers a reminder
3. **Smart Reasons**: Fetches motivational messages from backend
   - Pre-defined: Curated collection of 30+ powerful reasons
   - AI-generated: Real-time personalized messages from GPT-5.2
4. **Local Notifications**: Native push notifications on your device
5. **Stats Tracking**: Monitors and displays your screen time progress

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
