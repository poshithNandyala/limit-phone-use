# 📱 Digital Wellbeing — Screen Time Reduction App

> Reclaim your time. Put your phone down with smart, offline-first reminders and 100+ curated quotes.

[![Latest Release](https://img.shields.io/github/v/release/poshithNandyala/limit-phone-use?label=latest%20release&color=4A90E2)](https://github.com/poshithNandyala/limit-phone-use/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/poshithNandyala/limit-phone-use/total?color=2ECC71)](https://github.com/poshithNandyala/limit-phone-use/releases/latest)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

<p align="center">
  <a href="https://github.com/poshithNandyala/limit-phone-use/releases/latest">
    <strong>⬇️ Download the latest APK</strong>
  </a>
  &nbsp;•&nbsp;
  <a href="https://github.com/poshithNandyala/limit-phone-use/issues/new?template=bug_report.yml">🐛 Report a Bug</a>
  &nbsp;•&nbsp;
  <a href="https://github.com/poshithNandyala/limit-phone-use/issues/new?template=feature_request.yml">✨ Request a Feature</a>
</p>

---

## 🌟 Features

- **100+ Curated Quotes** across 10 categories — Health, Relationships, Productivity, Mindfulness, Sleep, Nature, Family, Focus, Creativity, Growth
- **Works Fully Offline** — the entire quote library ships inside the app, no backend or account required
- **Optional AI Reminders** — plug in your own backend URL for AI-generated personalized reasons, or mix AI with quotes; falls back to the local library automatically if the backend is unreachable
- **Quote Library Tab** — search and filter every quote by category
- **Favorites** — heart any quote and revisit it anytime
- **Share Quotes** — send a quote to any app in one tap
- **Configurable Reminders** — pick an interval from 5 to 60 minutes and which categories to draw from
- **Daily Streaks** — tracks consecutive days you've used the app
- **Stats Dashboard** — screen time, reminders sent, and a 7-day activity chart
- **Dark Mode** — full light/dark theme support
- **Manual Reminders** — an instant "Send Reminder Now" button for when you need it right away

## 📸 Screenshots

*Add screenshots of the Home, Quotes, Stats, and Settings tabs here.*

## 🚀 Quick Start for Users

### Install the APK (Android)

1. Go to **[Releases](https://github.com/poshithNandyala/limit-phone-use/releases/latest)**
2. Download the latest `digital-wellbeing-vX.Y.Z.apk`
3. Open the downloaded file and allow "Install from unknown sources" if prompted
4. Open the app — no setup, no account, no backend needed. It works completely offline.

Every release is built and published automatically by GitHub Actions
(see [`.github/workflows/release.yml`](.github/workflows/release.yml)) — no manual APK building required.

> This build is signed with the default Android debug keystore, which is fine for direct installs.
> If you want a Play Store-ready build, use `eas build` with your own signing credentials (see below).

### Test with Expo Go (developers/testers)

1. Install **Expo Go** from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) or the [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Run `expo start` from the `frontend` directory (see [For Developers](#-for-developers) below)
3. Scan the QR code shown in your terminal

## 🐛 Found a bug? Have an idea?

Please open an issue — it takes less than a minute:

- **[🐛 Report a Bug](https://github.com/poshithNandyala/limit-phone-use/issues/new?template=bug_report.yml)** — something broken, crashing, or not working as expected
- **[✨ Request a Feature](https://github.com/poshithNandyala/limit-phone-use/issues/new?template=feature_request.yml)** — a new quote category, a new setting, anything you wish the app did
- **[💬 All Issues](https://github.com/poshithNandyala/limit-phone-use/issues)** — browse existing reports and requests

You can also reach these forms from inside the app: **Settings → About → Report a Bug / Request a Feature**.

## 💻 For Developers

### Prerequisites

- Node.js 18+ and Yarn
- Expo CLI (`npx expo`, no global install needed)
- MongoDB (optional — only needed if you're running the AI backend)
- EAS CLI (optional — only needed for custom signed builds: `npm install -g eas-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/poshithNandyala/limit-phone-use.git
cd limit-phone-use

# Install frontend dependencies
cd frontend
yarn install

# Start the app (works fully offline, no backend required)
expo start
```

### Optional: running the AI backend

The app works completely offline without a backend. If you want AI-generated reminders too:

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URL and LLM key

# Start MongoDB
mongod

# Start the backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Then point the frontend at it:

```
# frontend/.env
EXPO_PUBLIC_BACKEND_URL=http://your-backend-url:8001
```

**Backend `.env`**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=digital_wellbeing
EMERGENT_LLM_KEY=your_llm_key_here
```

### Building your own APK/IPA

**Automatic (recommended):** push a version tag and let GitHub Actions build and publish the release for you:

```bash
git tag v1.2.0
git push origin v1.2.0
```

**Manual, with your own signing (e.g. for the Play Store):**

```bash
cd frontend
eas build:configure
eas build --platform android --profile production
eas build --platform ios --profile production   # requires an Apple Developer account
```

## 🏗️ Tech Stack

- **Frontend**
  - React Native + Expo SDK 54, TypeScript
  - Expo Router (tabbed navigation: Home / Quotes / Stats / Settings)
  - Expo Notifications, AsyncStorage for local persistence
- **Backend** (optional, only used for AI-generated reminders)
  - FastAPI (Python), MongoDB
  - OpenAI GPT-5.2 via the Emergent LLM integration library
- **CI/CD**
  - GitHub Actions: `expo prebuild` + Gradle build → GitHub Release with the APK attached

## 📱 How It Works

1. **App State Detection** — tracks when you're actively using your phone
2. **Timer System** — every N minutes (configurable, 5–60) of active use triggers a reminder
3. **Smart Reasons** — picks a quote from the built-in, categorized library (fully offline), optionally mixed with AI-generated messages from your own backend, with automatic fallback if that backend is unreachable
4. **Local Notifications** — native push notifications on your device
5. **Stats Tracking** — screen time, reminders sent, streaks, and a 7-day chart, all stored locally on-device

## 🎯 Use Cases

- Reduce phone addiction and mindless scrolling
- Improve work-life balance and focus
- Better sleep hygiene (less screen time before bed)
- Increase face-to-face interactions
- Encourage outdoor activities and mindfulness

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

If you're not sure where to start, check the [open issues](https://github.com/poshithNandyala/limit-phone-use/issues) — especially ones labeled `enhancement` or `good first issue`.

## 📝 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

## 📧 Support

- **[Download the latest release](https://github.com/poshithNandyala/limit-phone-use/releases/latest)**
- **[Report a bug](https://github.com/poshithNandyala/limit-phone-use/issues/new?template=bug_report.yml)** or **[request a feature](https://github.com/poshithNandyala/limit-phone-use/issues/new?template=feature_request.yml)**
- Star ⭐ this repo if you find it helpful!

---

**Made with 💚 for a healthier digital life**
