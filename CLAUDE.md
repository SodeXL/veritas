# Veritas — Catholic Apologetics Mobile App

## What This Is
A mobile app (iOS + Android + Web) built with Expo + React Native. Users study Catholic apologetics through gamified flashcards. They flip objection cards, unlock deeper theological response tiers, earn "Halos" (XP), and build daily streaks. Free with ads, $4.99 one-time IAP to remove ads.

## Working Title
"Veritas" — may change. App name is configured in `app.json` only.

## Tech Stack
- **Framework:** Expo SDK (React Native, TypeScript)
- **State:** Zustand + AsyncStorage persistence
- **Navigation:** React Navigation (bottom tabs + native stack)
- **Animations:** react-native-reanimated + react-native-gesture-handler
- **Ads:** react-native-google-mobile-ads (G-rated filter, category blocks)
- **IAP:** react-native-purchases (RevenueCat) — $4.99 "Remove Ads"
- **Fonts:** Cormorant Garamond (display), system serif (body)
- **Data:** Bundled JSON (330+ cards), offline-first, no backend for MVP

## Data Source
- Google Sheets (collaborative, Sean manages): https://docs.google.com/spreadsheets/d/1P68jjSC2oG5tHJxX3Dgkyf5O-8WY9oTt/edit
- Export as CSV/JSON for bundling into the app
- 330+ cards across 10 categories
- ~122 cards missing tier1 and tier3 content (tier2 is complete) — app handles gracefully
- Bible translation: Douay-Rheims (open source)

## Card Schema
```typescript
interface Card {
  id: string;                  // e.g. "MARY_001", "SALVATION_042"
  title: string;               // Card title
  objection_text: string;      // The objection/challenge
  their_verses: string;        // Opponent's scripture refs
  their_verses_text: string;   // Opponent's verse context
  tier1_summary: string;       // Quick Answer (may be empty)
  tier1_verses: string;        // Supporting verse refs
  tier1_verses_text: string;   // Verse text
  tier2_short: string;         // Go Deeper summary
  tier2_explanation: string;   // Full explanation
  tier3_discussion: string;    // Discussion question (may be empty)
  category: string;            // One of 10 categories
  opponent_tags: string[];     // ["Protestant", "Evangelical", etc.]
  ccc_refs: string;            // Catechism references
  patristic_refs: string;      // Church Father references
  tradition_type: string;
  difficulty_level: number;    // 1-5
  age_group: string;
  skill_category: string;
  point_value: number;         // 10/20/30/40/50
  card_tier: string;           // Beginner/Core/Intermediate/Advanced
}
```

## Categories (10)
| Category | Color | Icon |
|---|---|---|
| Salvation | #B84A4A | ✚ |
| Scripture & Authority | #2E7D5B | ✐ |
| Mary & Saints & Images | #4A7FC7 | ✡ |
| Eucharist | #C7894A | ✠ |
| Marriage | #C75A6E | ♡ |
| Baptism | #3AA8C1 | ♒ |
| Confession | #7A5FA0 | ☘ |
| Holy Orders | #8B6914 | ☦ |
| Confirmation | #E8873A | ❁ |
| Anointing | #5AAF6A | ☣ |

## Screens (6 MVP)
1. **Home** — Daily challenge, stats row (Halos/Streak/Mastered%), category tiles, "Continue Studying" feed
2. **Categories** — Grid of 10 categories with progress bars → taps into Category Detail
3. **Category Detail** — Card list for a category, opponent tag filter pills
4. **Card Viewer** — THE core screen. Front: objection + their verses. Back: 3-tier tabs (Quick Answer / Go Deeper / Discussion). Flip animation. "MASTERED" button awards XP.
5. **Search** — Full-text search + opponent tag quick-filters. Quick Reference mode for real conversations.
6. **Profile** — Level badge, XP bar, stats grid, category progress breakdown, favorites list

## Gamification
### Levels
| Level | Name | XP |
|---|---|---|
| 1 | Seeker | 0 |
| 2 | Learner | 100 |
| 3 | Defender | 300 |
| 4 | Apologist | 600 |
| 5 | Guardian | 1,000 |
| 6 | Scholar | 1,600 |
| 7 | Doctor | 2,500 |
| 8 | Doctor of the Church | 4,000 |

### Rules
- XP = card's point_value (10-50 based on difficulty)
- Daily challenge = 2x points, deterministic card based on day of year
- Streak = consecutive days with 1+ card mastered, resets on missed day
- Cards can only be "mastered" once for XP

## Ad Placement Rules
- Banner: Home screen, Categories screen, Search screen (above bottom nav)
- Interstitial: every 6 cards studied
- **NEVER on Card Viewer screen** — sacred learning space
- All ads hidden when user is premium (RevenueCat entitlement check)
- AdMob settings: max_ad_content_rating = G, block dating/sexual/gambling/alcohol/cosmetic/astrology

## Design System
- **Background:** #12100D (near-black)
- **Surface:** rgba(42, 36, 30, 0.6)
- **Gold accent:** #D4A843
- **Text primary:** #F0E8D4
- **Text secondary:** #C4B896
- **Text muted:** #8A7E6E
- Dark theme only. Premium, scholarly Catholic aesthetic. Gold-on-dark.
- Font: Cormorant Garamond for headings, Georgia/system serif for body.

## Project Structure
```
src/
  navigation/index.tsx        — React Navigation (tabs + stacks)
  screens/                    — One file per screen
  components/                 — Reusable UI (TopBar, CardFront, CardBack, TierTabs, TagFilter, AdBanner, etc.)
  data/cards.json             — Bundled card dataset
  data/categories.ts          — Category metadata
  store/useGameState.ts       — Zustand store (XP, streak, completed, favorites, premium)
  theme/colors.ts             — Color tokens
  utils/gamification.ts       — Level calc, streak logic, daily challenge
  utils/search.ts             — Full-text search, tag filtering
  types/card.ts               — TypeScript interfaces
```

## Build Commands
```bash
npx expo start                    # Dev server
npx expo start --web              # Web preview
eas build --platform ios          # iOS production build
eas build --platform android      # Android production build
eas submit --platform ios         # Submit to App Store
eas submit --platform android     # Submit to Google Play
```

## Key Principles
- Offline-first: everything works without internet
- Speed over polish for MVP: ship fast, iterate
- Card Viewer is the heart of the app — invest animation time here
- Incomplete cards (missing tier1/tier3) show gracefully, not broken
- Opponent tag filtering is critical for real-world "Quick Reference" use
- No backend for MVP — bundled JSON only
- Phase 2 adds Supabase backend + Next.js admin panel for Sean

## Reference
- Interactive prototype: `veritas-prototype.html` (open in browser for visual reference)
- Full build plan: `VERITAS_Build_Plan.md`
