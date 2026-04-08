// App.tsx

import React, { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import Navigation from "./src/navigation";
import { useGameState } from "./src/store/useGameState";
import { preloadInterstitial } from "./src/utils/interstitialAd";
import { initRevenueCat } from "./src/hooks/useRevenueCat";

// Dynamic require — AdMob has no web support
let MobileAds: any = null;
let MaxAdContentRating: any = null;

if (Platform.OS !== "web") {
  const ads = require("react-native-google-mobile-ads");
  MobileAds = ads.default;
  MaxAdContentRating = ads.MaxAdContentRating;
}

export default function App() {
  const checkStreak = useGameState((s) => s.checkStreak);
  const setPremium = useGameState((s) => s.setPremium);

  useEffect(() => {
    checkStreak();
    initAds();
    initRevenueCat(setPremium);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ flex: 1, backgroundColor: "#12100D" }}>
      <StatusBar barStyle="light-content" backgroundColor="#12100D" />
      <Navigation />
    </View>
  );
}

async function initAds() {
  if (Platform.OS === "web" || !MobileAds) return;

  try {
    // Set G-rated content filter before initializing
    await MobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    await MobileAds().initialize();

    // Preload the first interstitial so it's ready when needed
    preloadInterstitial();
  } catch {
    // Non-blocking — ads gracefully degrade on failure
  }
}
