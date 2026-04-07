# Veritas - Deployment Guide

## Vercel Deployment

The app is configured for automatic deployment to Vercel.

### Quick Deploy

1. **Push to GitHub** (if using Git):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy"

### Manual Deployment

If you prefer to deploy without Git:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Web Build

The app is automatically built for web using:
```bash
npx expo export --platform web
```

The build output goes to the `dist/` directory, which is configured in `vercel.json`.

### Configuration Files

- **vercel.json**: Vercel deployment configuration
- **.vercelignore**: Files to exclude from deployment
- **dist/**: Web build output directory (generated)

### Environment

- Platform: Web (React Native Web)
- Framework: Expo SDK 54
- Build Command: `npx expo export --platform web`
- Output Directory: `dist`

### Testing Locally

To test the web build locally:

```bash
# Start web dev server
npx expo start --web

# Or build and serve
npx expo export --platform web
npx serve dist
```

## Mobile App Deployment (Future)

For iOS and Android deployment using EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Notes

- The web version works fully offline after initial load
- All 330+ cards are bundled in the app
- AsyncStorage persists state across sessions
- No backend required for MVP
