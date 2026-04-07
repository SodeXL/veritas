// src/components/AdBanner.tsx
//
// Wraps AdMob banner ad. Hides when user is premium.
// Install: npm install react-native-google-mobile-ads
//
// SETUP REQUIRED:
// 1. Create AdMob account at https://admob.google.com
// 2. Create app + ad units (banner + interstitial)
// 3. Add AdMob app ID to app.json:
//    "react-native-google-mobile-ads": {
//      "android_app_id": "ca-app-pub-xxxxx~xxxxx",
//      "ios_app_id": "ca-app-pub-xxxxx~xxxxx"
//    }
// 4. Replace test ad unit IDs below with real ones

import React from "react";
import { View, Platform } from "react-native";
import { useGameState } from "../store/useGameState";

// TODO: Uncomment when react-native-google-mobile-ads is installed
// import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const AD_UNIT_IDS = {
  banner: {
    ios: "ca-app-pub-xxxxx/xxxxx", // Replace with real ID
    android: "ca-app-pub-xxxxx/xxxxx", // Replace with real ID
  },
  interstitial: {
    ios: "ca-app-pub-xxxxx/xxxxx",
    android: "ca-app-pub-xxxxx/xxxxx",
  },
};

// Use test IDs during development
const USE_TEST_IDS = __DEV__;

export function AdBanner() {
  const isPremium = useGameState((s) => s.isPremium);

  if (isPremium) return null;

  // TODO: Replace this placeholder with real BannerAd when SDK is installed
  return (
    <View
      style={{
        height: 50,
        backgroundColor: "rgba(42, 36, 30, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "rgba(212, 168, 67, 0.1)",
      }}
    >
      {/* Uncomment when ready:
      <BannerAd
        unitId={USE_TEST_IDS ? TestIds.BANNER : Platform.select(AD_UNIT_IDS.banner)}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          maxAdContentRating: MaxAdContentRating.G,
        }}
      />
      */}
    </View>
  );
}

// Interstitial ad helper
// Call this after card completion: if (shouldShowInterstitial()) showInterstitial();
export async function showInterstitial() {
  // TODO: Implement when SDK is installed
  // const interstitial = InterstitialAd.createForAdRequest(
  //   USE_TEST_IDS ? TestIds.INTERSTITIAL : Platform.select(AD_UNIT_IDS.interstitial),
  //   { requestNonPersonalizedAdsOnly: false }
  // );
  // interstitial.load();
  // interstitial.show();
}
