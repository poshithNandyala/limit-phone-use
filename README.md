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

- **200+ Curated Quotes** across 11 categories — Health, Relationships, Productivity, Mindfulness, Sleep, Nature, Family, Focus, Creativity, Growth, and Other
- **Works Fully Offline** — the entire quote library ships inside the app, no backend or account required
- **True Background Reminders** — reminders are scheduled directly with your phone's notification system, so they keep arriving even when the app is closed or killed, not just while it's open
- **Free AI Reminders (BYOK)** — paste your own free [Gemini API key](https://aistudio.google.com/apikey) in Settings for AI-generated personalized reasons, called directly from your device to Google - no backend required. Leave it blank and everything still works great offline
- **Quote Library Tab** — search and filter every quote by category, with all categories always visible
- **Add Your Own Quotes** — write your own reminders and file them under any category, including "Other" for anything that doesn't fit
- **Favorites** — heart any quote and revisit it anytime
- **Share Quotes** — send a quote to any app in one tap
- **Configurable Reminders** — pick an interval from 5 to 60 minutes and which categories to draw from
- **Streaks Tab** — build (or break) any habit you want: daily workouts, coding practice, quitting something, anything. Free-text name and your own icon, a current/best streak counter, a 28-day calendar view, and celebration milestones at day 1, 3, 7, 14, 30, 60, 100, and beyond
- **Daily App Streak** — tracks consecutive days you've used the app
- **Stats Dashboard** — time in app, reminders sent, and a 7-day activity chart
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

### Optional: AI-generated reminders

The app works completely offline without any of this. For AI-generated reminders, the
recommended path is to open **Settings → AI Reminders** in the app and paste in a free
[Gemini API key](https://aistudio.google.com/apikey) - it's called directly from the device to
Google, no backend involved, and nothing breaks if it's left blank.

There's also a legacy optional FastAPI backend (`backend/`) for AI reminders via OpenAI, kept for
backwards compatibility:

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URL and LLM key

mongod
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
  - Expo Router (tabbed navigation: Home / Quotes / Streaks / Stats / Settings)
  - Expo Notifications with date-triggered scheduling for true background delivery, AsyncStorage for local persistence
- **AI** (both optional)
  - Gemini (`gemini-2.0-flash`) called directly from the device with a user-supplied API key - no backend
  - Legacy FastAPI backend (Python, MongoDB, OpenAI) kept for backwards compatibility
- **CI/CD**
  - GitHub Actions: `expo prebuild` + Gradle build → GitHub Release with the APK attached

## 📱 How It Works

1. **Background-Scheduled Reminders** — reminders are scheduled ahead of time directly with the OS notification system (not a JS timer), so they're delivered on schedule whether the app is open, backgrounded, or fully closed
2. **Smart Reasons** — picks a quote from the built-in, categorized library (fully offline) or your own added quotes, optionally mixed with AI-generated messages (Gemini or a configured backend), with automatic fallback to the local library if AI is unavailable
3. **Local Notifications** — native notifications on your device, no push server involved
4. **Stats Tracking** — time in app, reminders sent, streaks, and a 7-day chart, all stored locally on-device
5. **Streaks** — track any habit you want with a daily mark-done button, current/longest streak, and milestone celebrations

> **Note on "Time in App":** this currently measures how long *this app* has been open, not your
> phone's total screen time system-wide - real device-wide screen time requires Android's special
> Usage Access permission plus a native module, which is tracked as a follow-up (see open issues).

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
