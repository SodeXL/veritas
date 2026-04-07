# Veritas — MVP Build Plan
## The Single Source of Truth for Building This App

---

## What We're Building

A mobile app (iOS + Android) that helps Catholics learn and practice apologetics through gamified flashcards. Users swipe through objection cards, unlock deeper theological tiers, earn "Halos" (XP), and build streaks. Free with ads, $4.99 one-time purchase to remove ads.

**Working title:** Veritas (subject to change — single config swap when decided)

---

## Decisions Made

| Decision | Answer |
|---|---|
| Tech stack | Expo + React Native |
| Data strategy | Bundled JSON for MVP → Supabase sync in Phase 2 |
| Monetization | Google AdMob (G-rated, category-filtered) + $4.99 IAP to remove ads |
| IAP provider | RevenueCat (wraps Apple/Google IAP) |
| Bible translation | Douay-Rheims (open source, no licensing needed) |
| Backend | Phase 2 — Supabase (Postgres + Auth + API) |
| Admin panel | Phase 2 — Next.js web app for Sean |
| Store accounts | Apple Developer + Google Play both submitted |
| Offline support | Yes — all card data bundled, no internet required |
| Age filtering | Settings toggle to hide mature content |

---

## Data Overview

- **330 cards** across 10 categories
- **122 cards (37%)** missing Tier 1 + Tier 3 content (Tier 2 is complete)
- **36 opponent tags**, 4 difficulty levels, 4 card tiers
- Full production JSON: `veritas_cards_full_330.json`

### Categories
| Category | Cards |
|---|---|
| Salvation | 156 |
| Scripture & Authority | 60 |
| Mary & Saints & Images | 34 |
| Eucharist | 31 |
| Marriage | 18 |
| Baptism | 10 |
| Confession | 8 |
| Anointing | 5 |
| Holy Orders | 5 |
| Confirmation | 3 |

---

## Week 1: Core Build

### Day 1-2: Project Setup + Home Screen
```
CURSOR TASKS:
1. npx create-expo-app veritas --template blank-typescript
2. Install dependencies (see package list below)
3. Set up file structure (see project structure below)
4. Import card data JSON
5. Build theme/design system (colors, fonts, spacing)
6. Set up React Navigation (bottom tabs + stack)
7. Build Home screen:
   - Daily challenge card
   - Stats row (Halos, Streak, Mastered %)
   - Category tiles (top 4)
   - "Continue Studying" feed
8. Build TopBar component (level, XP bar, streak)
9. Build BottomNav component
```

### Day 3-4: Card Viewer (THE critical screen)
```
CURSOR TASKS:
1. Build CardViewer screen with flip animation
   - Front: category badge, opponent tags, objection text, their verses
   - Back: 3-tier tab system (Quick Answer / Go Deeper / Discussion)
2. Implement tier content switching with animations
3. "MASTERED" button with XP award animation
4. Favorite (star) toggle
5. Handle incomplete cards gracefully (missing Tier 1/3)
6. Wire up XP award → state update → persist to AsyncStorage
7. CCC reference display
8. Difficulty badge + points display
```

### Day 5-6: Browse + Search
```
CURSOR TASKS:
1. Categories screen — grid of all 10 categories with:
   - Icon, name, card count, progress bar
   - Tap → category detail
2. Category Detail screen:
   - Card list for that category
   - Opponent tag filter pills
   - Completion indicators per card
3. Search / Quick Reference screen:
   - Full-text search (title, objection, response text)
   - Opponent tag quick-filter buttons
   - Results with category badges
   - Instant filtering (no API call)
```

### Day 7: Profile + Gamification + Deploy Web Preview
```
CURSOR TASKS:
1. Profile screen:
   - Level badge + name (Seeker → Doctor of the Church)
   - XP bar with progress to next level
   - Stats grid (cards mastered, streak, total halos, favorites)
   - Category progress breakdown
   - Favorites list
   - Reset progress button
2. Verify gamification logic:
   - XP awards correctly per card difficulty
   - Streak increments on consecutive days
   - Streak resets after missed day
   - Daily challenge rotates deterministically
   - Level thresholds work (see table below)
3. Deploy Expo web export to Vercel for shareable preview URL
```

---

## Week 2: Ads, IAP, Polish, Ship

### Day 8-9: AdMob + RevenueCat Integration
```
CURSOR TASKS:
1. Set up AdMob account + create ad units:
   - Banner ad unit
   - Interstitial ad unit
2. Configure AdMob category blocks:
   - Block: Dating, Sexual content, Gambling, Alcohol,
     Cosmetic procedures, Astrology, Political
   - Set max_ad_content_rating to "G"
3. Install expo-ads-admob or react-native-google-mobile-ads
4. Place banner ad on Home screen (above bottom nav)
5. Place banner ad on Categories screen
6. Interstitial ad every 5-8 cards studied
7. NEVER show ads on Card Viewer screen
8. Set up RevenueCat account + products:
   - Apple: $4.99 non-consumable "Remove Ads"
   - Google: $4.99 non-consumable "Remove Ads"
9. Build paywall/upgrade prompt
10. Gate ad display behind RevenueCat entitlement check
11. Add "Remove Ads" button in Profile + occasional prompt
```

### Day 10-11: Animations + Polish
```
CURSOR TASKS:
1. Screen transition animations (React Navigation)
2. Card flip animation refinement (react-native-reanimated)
3. XP award floating animation
4. Tier tab switch animation
5. Progress bar fill animations
6. Category tile tap feedback
7. Loading states and empty states
8. Haptic feedback on card mastery
9. Pull-to-refresh on Home screen
10. Dark theme refinement — test on real devices
```

### Day 12-13: Testing + Store Prep
```
CURSOR TASKS:
1. Test on physical iPhone + Android device via Expo Go
2. Fix platform-specific layout issues
3. Test offline mode (airplane mode)
4. Test ad display + "Remove Ads" purchase flow
5. Create app icon (1024x1024)
6. Create splash screen
7. Take App Store screenshots (6.7" and 5.5" iPhone, Android)
8. Write store listing:
   - Title, subtitle, description, keywords
   - Privacy policy URL (required)
   - Support URL
9. Configure EAS Build for production:
   - eas build --platform ios
   - eas build --platform android
```

### Day 14: Submit
```
CURSOR TASKS:
1. Submit iOS build to App Store Connect
2. Submit Android build to Google Play Console
3. Fill in store metadata, screenshots, review notes
4. Submit for review
5. Apple review: typically 24-48 hours
6. Google review: typically same-day to 24 hours
```

---

## Project Structure

```
veritas/
├── app.json                    # Expo config (name, icons, splash, etc.)
├── App.tsx                     # Root component, providers
├── package.json
├── tsconfig.json
├── eas.json                    # EAS Build config
│
├── src/
│   ├── navigation/
│   │   └── index.tsx           # React Navigation setup (tabs + stacks)
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   ├── CategoryDetailScreen.tsx
│   │   ├── CardViewerScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── components/
│   │   ├── TopBar.tsx
│   │   ├── CardFront.tsx
│   │   ├── CardBack.tsx
│   │   ├── TierTabs.tsx
│   │   ├── CategoryTile.tsx
│   │   ├── CardListItem.tsx
│   │   ├── TagFilter.tsx
│   │   ├── StatsRow.tsx
│   │   ├── HaloIcon.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── AdBanner.tsx         # Wraps AdMob, respects premium status
│   │   └── PaywallPrompt.tsx    # RevenueCat upgrade UI
│   │
│   ├── data/
│   │   ├── cards.json           # All 330 cards (bundled)
│   │   └── categories.ts        # Category metadata (icons, colors)
│   │
│   ├── store/
│   │   ├── useGameState.ts      # Zustand store (XP, streak, completed, favorites)
│   │   └── useAdsState.ts       # Premium status from RevenueCat
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   ├── utils/
│   │   ├── gamification.ts      # Level calc, streak logic, daily challenge
│   │   ├── search.ts            # Full-text search over cards
│   │   └── storage.ts           # AsyncStorage wrapper
│   │
│   └── types/
│       └── card.ts              # TypeScript interfaces
│
└── assets/
    ├── icon.png                 # App icon (1024x1024)
    ├── splash.png               # Splash screen
    └── fonts/
        └── CormorantGaramond-*.ttf
```

---

## Dependencies to Install

```bash
# Core
npx create-expo-app veritas --template blank-typescript
cd veritas

# Navigation
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context

# State + Storage
npm install zustand
npx expo install @react-native-async-storage/async-storage

# Animations
npx expo install react-native-reanimated react-native-gesture-handler

# Ads (pick one — react-native-google-mobile-ads is more maintained)
npm install react-native-google-mobile-ads

# In-App Purchases
npm install react-native-purchases

# Fonts
npx expo install expo-font

# Haptics
npx expo install expo-haptics

# Build
npx expo install expo-dev-client
npm install -g eas-cli
eas login
eas build:configure
```

---

## Gamification Reference

### Levels
| Level | Name | XP Threshold |
|---|---|---|
| 1 | Seeker | 0 |
| 2 | Learner | 100 |
| 3 | Defender | 300 |
| 4 | Apologist | 600 |
| 5 | Guardian | 1,000 |
| 6 | Scholar | 1,600 |
| 7 | Doctor | 2,500 |
| 8 | Doctor of the Church | 4,000 |

### Points by Difficulty
| Difficulty | Points |
|---|---|
| 1 (Beginner) | 10 |
| 2 (Easy) | 20 |
| 3 (Intermediate) | 30 |
| 4 (Advanced) | 40 |
| 5 (Expert) | 50 |

### Daily Challenge
- 2x point bonus
- Card selection: deterministic based on day of year
- Resets at midnight local time

### Streaks
- +1 for each consecutive day with at least 1 card mastered
- Resets to 0 if a full calendar day is missed
- Displayed as fire emoji + count

---

## Ad Placement Rules

| Screen | Ad Type | Placement |
|---|---|---|
| Home | Banner | Above bottom nav |
| Categories | Banner | Above bottom nav |
| Category Detail | None | — |
| Card Viewer | **NEVER** | Sacred learning space |
| Search | Banner | Above bottom nav |
| Profile | None | — |
| Between cards | Interstitial | Every 5-8 cards studied |

---

## AdMob Category Blocks

Block these in the AdMob dashboard → Blocking Controls:

**Sensitive categories to BLOCK:**
- Dating
- References to Sex
- Sexual Reproductive Health
- Cosmetic Procedures & Body Modification
- Consumer Lending
- Significant Skin Exposure → use "Swimwear" and "Underwear" sub-blocks
- Sensationalist & Shocking

**Content rating:**
- Set `max_ad_content_rating` to `G` in SDK config

**General categories to consider blocking:**
- Gambling
- Alcohol
- Weight Loss
- Get Rich Quick

---

## Phase 2: Backend + Admin Panel (Week 3+)

### Supabase Setup
```
Tables:
- cards (mirrors JSON schema)
- categories (id, name, icon, color, sort_order)
- tags (id, name)
- card_tags (card_id, tag_id)

Auth:
- Email/password for Sean (admin)
- Row Level Security: read-only for app, write for admin

API:
- Auto-generated REST API from Supabase
- App calls GET /cards on launch, caches locally
- Falls back to bundled JSON if offline
```

### Admin Panel (Next.js)
```
Screens:
- Dashboard (card counts, incomplete cards, stats)
- Card List (searchable, filterable, color-coded by completeness)
- Card Editor (full form — all tiers, verses, tags, metadata)
- Categories Manager
- Tags Manager

Auth:
- Supabase Auth login
- Single admin user (Sean)
```

### App Sync Update
```
On app launch:
1. Check Supabase for cards updated since last sync
2. If new data, download and merge with local cache
3. If offline or error, use cached/bundled data
4. Never block the UI waiting for sync
```

---

## Key Files from This Project

Take these to Cursor:
1. `veritas_cards_full_330.json` — production card dataset
2. `veritas-prototype.html` — working UI reference (open in browser)
3. This build plan document

---

## Quick Reference: App Config Values

```typescript
// app.json overrides
const APP_CONFIG = {
  name: "Veritas",           // CHANGE WHEN NAME IS DECIDED
  slug: "veritas",
  scheme: "veritas",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: { image: "./assets/splash.png", backgroundColor: "#12100D" },
  ios: { bundleIdentifier: "com.yourcompany.veritas", supportsTablet: true },
  android: { package: "com.yourcompany.veritas", adaptiveIcon: { backgroundColor: "#12100D" } },
};

// AdMob IDs (replace with real ones)
const ADMOB_IDS = {
  ios: {
    banner: "ca-app-pub-xxxxx/xxxxx",
    interstitial: "ca-app-pub-xxxxx/xxxxx",
  },
  android: {
    banner: "ca-app-pub-xxxxx/xxxxx",
    interstitial: "ca-app-pub-xxxxx/xxxxx",
  },
};

// RevenueCat
const REVENUECAT_API_KEY = {
  ios: "appl_xxxxx",
  android: "goog_xxxxx",
};
const REMOVE_ADS_PRODUCT_ID = "remove_ads";
```
