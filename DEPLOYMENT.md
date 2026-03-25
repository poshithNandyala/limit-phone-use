# 🚀 Deployment & Distribution Guide

## Overview

This guide covers how to build, deploy, and distribute the Digital Wellbeing mobile app.

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo account (free): https://expo.dev
- EAS CLI: `npm install -g eas-cli`
- MongoDB instance (local or cloud like MongoDB Atlas)

## Backend Deployment

### Option 1: Deploy to Any Cloud Platform

The backend is a standard FastAPI application that can be deployed to:

- **Heroku**
- **Railway**
- **DigitalOcean**
- **AWS EC2**
- **Google Cloud Run**
- **Azure App Service**

### Example: Deploy to Railway

1. Create account at https://railway.app
2. Install Railway CLI: `npm i -g @railway/cli`
3. Login: `railway login`
4. Initialize: `railway init`
5. Add MongoDB: `railway add mongodb`
6. Deploy: `railway up`
7. Set environment variables in Railway dashboard

### Environment Variables for Backend

```bash
MONGO_URL=your_mongodb_connection_string
DB_NAME=digital_wellbeing
EMERGENT_LLM_KEY=your_llm_api_key
```

## Frontend - Building Mobile App

### Step 1: Configure EAS Build

```bash
cd frontend
eas login
eas build:configure
```

This creates `eas.json` (already included in this repo).

### Step 2: Update Backend URL

Edit `frontend/eas.json` and update production backend URL:

```json
"production": {
  "env": {
    "EXPO_PUBLIC_BACKEND_URL": "https://your-actual-backend-url.com"
  }
}
```

### Step 3: Build APK for Android

```bash
cd frontend
eas build --platform android --profile production
```

- This builds in Expo's cloud (free tier available)
- Takes 10-20 minutes
- Downloads APK file when complete

### Step 4: Build for iOS (Optional)

```bash
eas build --platform ios --profile production
```

**Requirements:**
- Apple Developer account ($99/year)
- Valid iOS distribution certificate
- Provisioning profile

### Step 5: Download Built Files

Once build completes:
```bash
# Build URL will be displayed
# Download the APK/IPA file
```

Or check builds at: https://expo.dev/accounts/[your-account]/projects/digital-wellbeing/builds

## Distribution Options

### Option 1: GitHub Releases (Recommended for Open Source)

1. **Create Release**
   ```bash
   git tag -a v1.0.0 -m "Initial release"
   git push origin v1.0.0
   ```

2. **Upload APK**
   - Go to GitHub repository → Releases
   - Click "Create a new release"
   - Choose tag `v1.0.0`
   - Upload `digital-wellbeing.apk`
   - Add release notes
   - Publish release

3. **Users can now download**
   - Direct download link: `https://github.com/[username]/[repo]/releases/download/v1.0.0/digital-wellbeing.apk`

### Option 2: Expo Publish (Quick Testing)

```bash
cd frontend
eas update --branch production
```

Share link or QR code with testers.

### Option 3: App Stores (Production)

#### Google Play Store

1. Create Google Play Developer account ($25 one-time)
2. Build AAB instead of APK:
   ```bash
   eas build --platform android --profile production
   ```
   Update `eas.json` to use `aab` format
3. Upload to Play Console
4. Fill in app details, screenshots
5. Submit for review

#### Apple App Store

1. Apple Developer account ($99/year)
2. Build IPA:
   ```bash
   eas build --platform ios --profile production
   ```
3. Use `eas submit --platform ios`
4. Fill in App Store Connect details
5. Submit for review

### Option 4: TestFlight (iOS Beta Testing)

```bash
eas build --platform ios --profile preview
eas submit --platform ios --latest
```

Invite testers via TestFlight.

## Custom Domain for Backend

### Using Your Own Domain

1. Deploy backend to your preferred platform
2. Get deployment URL (e.g., `https://api.yourapp.com`)
3. Update `frontend/eas.json`:
   ```json
   "EXPO_PUBLIC_BACKEND_URL": "https://api.yourapp.com"
   ```
4. Rebuild the app with new backend URL

## Environment Setup Checklist

### Backend
- [ ] MongoDB database created
- [ ] MONGO_URL set
- [ ] EMERGENT_LLM_KEY or OpenAI API key set
- [ ] Backend deployed and accessible
- [ ] CORS configured for frontend origin
- [ ] API endpoints tested

### Frontend
- [ ] EXPO_PUBLIC_BACKEND_URL updated
- [ ] App icons and splash screen customized
- [ ] app.json configured (name, slug, bundle ID)
- [ ] EAS account created
- [ ] Build profile configured

## Security Best Practices

1. **Never commit secrets**
   - Use `.env` files (already in `.gitignore`)
   - Use environment variables in CI/CD

2. **Backend Security**
   - Use HTTPS only
   - Implement rate limiting
   - Validate all inputs
   - Use MongoDB Atlas with IP whitelisting

3. **API Keys**
   - Rotate keys regularly
   - Use separate keys for dev/prod
   - Monitor usage

## Monitoring & Analytics

### Backend Monitoring
- Use Sentry for error tracking
- Monitor API response times
- Set up uptime monitoring (UptimeRobot, Pingdom)

### App Analytics
- Consider adding:
  - Expo Analytics
  - Firebase Analytics
  - Mixpanel

## Updating the App

### OTA Updates (Over-The-Air)

For minor updates without rebuilding:

```bash
cd frontend
eas update --branch production --message "Bug fixes"
```

Users get updates automatically on next app open.

### Full Rebuild

For major changes or native code updates:

1. Update version in `app.json`
2. Rebuild: `eas build --platform android --profile production`
3. Create new GitHub release
4. Or submit to app stores

## Cost Breakdown

### Free Tier
- **Expo**: Free builds available
- **MongoDB Atlas**: 512MB free tier
- **Railway/Heroku**: Free/hobby tiers available
- **GitHub**: Free hosting and releases

### Paid Options
- **Expo**: $29/month for faster builds
- **Google Play**: $25 one-time
- **Apple Developer**: $99/year
- **Backend hosting**: $5-20/month
- **MongoDB Atlas**: $9/month for production

## Troubleshooting Builds

### Build Fails

1. Check `eas build` logs
2. Verify `app.json` configuration
3. Ensure all dependencies are compatible
4. Check Expo SDK version compatibility

### Runtime Errors

1. Check backend is accessible from mobile network
2. Verify EXPO_PUBLIC_BACKEND_URL is correct
3. Test API endpoints manually
4. Check MongoDB connection

## Support Resources

- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- Expo Forums: https://forums.expo.dev
- React Native Docs: https://reactnative.dev

---

**Ready to deploy? Start with building the APK for Android! 🚀**
