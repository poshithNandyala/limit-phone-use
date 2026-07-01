# 📦 Complete GitHub Setup & Distribution Guide

## 🎯 Goal
Push this app to GitHub so users can download and install the APK directly.

---

## ⚡ Fastest Path: Automated Release Workflow (Recommended)

This repo includes [`.github/workflows/release.yml`](.github/workflows/release.yml), which
builds an installable Android APK and publishes it as a GitHub Release automatically —
no local Android setup, no EAS account needed.

**To cut a release:**

```bash
git tag v1.1.0
git push origin v1.1.0
```

That's it. GitHub Actions will:
1. Check out the code and install dependencies
2. Generate the native Android project (`expo prebuild`)
3. Build the APK with Gradle
4. Create a GitHub Release tagged `v1.1.0` with the APK attached

You can also trigger it manually from the **Actions** tab using "Run workflow" (workflow_dispatch).

Optionally, set a repository variable `EXPO_PUBLIC_BACKEND_URL` (Settings → Secrets and
variables → Actions → Variables) if you're running the optional AI backend and want release
builds to point at it. The app works fully offline without it.

The rest of this guide covers the manual/EAS path if you want more control (e.g. Play Store
signing, iOS builds).

---

## Step 1️⃣: Push Code to GitHub

### Option A: Using Emergent Dashboard (Easiest)

1. **In your Emergent dashboard**, click the **"Save to GitHub"** button
2. Follow the prompts to connect your GitHub account
3. Choose repository name (e.g., `digital-wellbeing-app`)
4. Click **Push** - Done! ✅

### Option B: Manual Git Push

```bash
# Initialize git (if not already done)
cd /path/to/your/app
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Digital Wellbeing App"

# Create GitHub repo and connect
git remote add origin https://github.com/YOUR_USERNAME/digital-wellbeing-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2️⃣: Build the APK File

You need to build the APK on your local machine or via Expo's cloud service.

### Prerequisites
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Install Expo CLI (if not already installed)
npm install -g expo-cli
```

### Build Process

```bash
# 1. Clone your repo (or use the existing code)
git clone https://github.com/YOUR_USERNAME/digital-wellbeing-app.git
cd digital-wellbeing-app/frontend

# 2. Install dependencies
yarn install

# 3. Login to Expo
eas login
# (Create a free account if you don't have one)

# 4. Build the APK
eas build --platform android --profile production
```

**What happens:**
- Expo builds your app in the cloud (takes 10-20 minutes)
- You'll get a download link when complete
- Download the `.apk` file (e.g., `digital-wellbeing-v1.0.0.apk`)

**Important:** Before building, update the backend URL in `frontend/eas.json`:
```json
"production": {
  "env": {
    "EXPO_PUBLIC_BACKEND_URL": "https://your-actual-backend-url.com"
  }
}
```

---

## Step 3️⃣: Create GitHub Release with APK

### Via GitHub Website (Recommended)

1. **Go to your GitHub repository**
   - Navigate to `https://github.com/YOUR_USERNAME/digital-wellbeing-app`

2. **Click on "Releases"** (right sidebar)

3. **Click "Create a new release"**

4. **Fill in release details:**
   - **Tag version**: `v1.0.0`
   - **Release title**: `Digital Wellbeing v1.0.0 - Initial Release`
   - **Description**: 
     ```markdown
     ## 🎉 First Release!
     
     **Digital Wellbeing** - Reduce your screen time with smart AI-powered reminders.
     
     ### 📱 Installation (Android)
     1. Download `digital-wellbeing.apk` below
     2. Install on your Android device
     3. Enable "Install from Unknown Sources" if prompted
     4. Open the app and start your wellbeing journey!
     
     ### ✨ Features
     - Configurable reminders (5-60 minutes), fully offline
     - 100+ curated quotes across 10 categories
     - Favorites, search, and sharing
     - Optional AI-generated personalized reasons
     - Screen time tracking, streaks, and stats
     - Dark mode + beautiful modern UI
     
     ### 📖 Full Instructions
     See [INSTALLATION.md](./INSTALLATION.md) for detailed setup guide.
     
     ### 🐛 Issues?
     Report bugs in [Issues](../../issues)
     ```

5. **Upload the APK file**
   - Drag and drop your `digital-wellbeing.apk` file
   - Or click "Attach binaries" and select the file

6. **Click "Publish release"** ✅

---

## Step 4️⃣: Users Can Now Download!

### Direct Download Link

Your APK will be available at:
```
https://github.com/YOUR_USERNAME/digital-wellbeing-app/releases/download/v1.0.0/digital-wellbeing.apk
```

### Users Install Like This:

1. Visit: `https://github.com/YOUR_USERNAME/digital-wellbeing-app/releases`
2. Click on the latest release
3. Download the `.apk` file
4. Install on Android device
5. Done! 🎉

---

## 📝 Update Your README

Make sure your main README.md has clear download instructions. Already included in the repo!

Key sections:
- ✅ Download link to releases
- ✅ Installation instructions
- ✅ Feature list
- ✅ Screenshots (you should add these!)
- ✅ Support info

---

## 🔄 Updating the App (Future Releases)

### When you make changes:

1. **Update version** in `frontend/app.json`:
   ```json
   "version": "1.0.1"
   ```

2. **Rebuild APK**:
   ```bash
   cd frontend
   eas build --platform android --profile production
   ```

3. **Create new GitHub release**:
   - Tag: `v1.0.1`
   - Upload new APK
   - Add changelog

---

## 🌐 Deploy Backend (Required!)

**Important:** Your app needs a live backend! Current backend URL is for development only.

### Quick Backend Deploy Options:

#### Option 1: Railway (Recommended - Free Tier Available)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
cd backend
railway login
railway init
railway add mongodb
railway up

# Copy the deployment URL and update frontend/eas.json
```

#### Option 2: Heroku
```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

cd backend
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

#### Option 3: DigitalOcean, AWS, GCP
See `DEPLOYMENT.md` for detailed guides.

---

## ✅ Complete Checklist

### Before First Release:
- [ ] Code pushed to GitHub
- [ ] Backend deployed to production server
- [ ] Backend URL updated in `frontend/eas.json`
- [ ] APK built with production backend URL
- [ ] README.md updated with your repo details
- [ ] Screenshots added to README (optional but recommended)
- [ ] GitHub release created with APK attached
- [ ] Installation instructions verified
- [ ] Tested APK on real Android device

### Your Repository Should Include:
- [ ] ✅ README.md - Main documentation
- [ ] ✅ INSTALLATION.md - User install guide
- [ ] ✅ DEPLOYMENT.md - Developer deploy guide
- [ ] ✅ LICENSE - MIT License
- [ ] ✅ .gitignore - Ignore sensitive files
- [ ] ✅ .env.example - Environment template
- [ ] ✅ frontend/eas.json - Build configuration
- [ ] ✅ Complete source code

---

## 🎯 Quick Summary

**For You (Developer):**
1. Push code to GitHub ✅
2. Deploy backend to cloud
3. Build APK with EAS Build
4. Create GitHub Release with APK

**For Users:**
1. Visit your GitHub releases page
2. Download APK
3. Install on Android
4. Use the app!

---

## 💡 Pro Tips

1. **Add Screenshots**: Take mobile screenshots and add to README
2. **Update Backend URL**: Don't forget to deploy backend and update URL
3. **Version Tracking**: Use semantic versioning (v1.0.0, v1.1.0, etc.)
4. **Changelog**: Always include what's new in each release
5. **Test Before Release**: Install APK on real device before publishing

---

## 🆘 Need Help?

- **Building Issues**: Check [Expo Docs](https://docs.expo.dev/build/introduction/)
- **GitHub Issues**: Enable issues in your repo for user support
- **EAS Build Help**: [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

## 📊 Example Repository Structure

```
digital-wellbeing-app/
├── README.md                    ← Main docs (download links here!)
├── INSTALLATION.md              ← User installation guide
├── DEPLOYMENT.md                ← Developer deployment guide
├── GITHUB_SETUP.md              ← This file
├── LICENSE                      ← MIT License
├── .gitignore                   ← Git ignore rules
├── .env.example                 ← Environment template
├── backend/
│   ├── server.py                ← FastAPI backend
│   ├── requirements.txt         ← Python dependencies
│   └── .env.example             ← Backend env template
└── frontend/
    ├── app/                     ← React Native code
    ├── app.json                 ← Expo configuration
    ├── eas.json                 ← Build configuration
    ├── package.json             ← Dependencies
    └── .env.example             ← Frontend env template
```

---

**Ready to share your app with the world! 🚀**

Your app will be open source and users can:
- ⭐ Star your repository
- 🍴 Fork and customize
- 📥 Download APK directly
- 🐛 Report issues
- 🤝 Contribute improvements
