// src/screens/CardViewerScreen.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { colors } from "../theme/colors";
import { useGameState } from "../store/useGameState";
import { showInterstitialIfNeeded } from "../utils/interstitialAd";
import { CardFront } from "../components/CardFront";
import { CardBack } from "../components/CardBack";
import { TierTabs } from "../components/TierTabs";
import { Card, ResponseTier } from "../types/card";
import cardsData from "../data/cards.json";
import { useRevenueCat } from "../hooks/useRevenueCat";

// Conditionally import haptics only on native platforms
let Haptics: any = null;
if (Platform.OS !== 'web') {
  Haptics = require("expo-haptics");
}

const cards = cardsData as Card[];

type RootStackParamList = {
  CardViewer: { cardId: string };
};

type CardViewerRouteProp = RouteProp<RootStackParamList, "CardViewer">;
type CardViewerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CardViewerScreen: React.FC = () => {
  const route = useRoute<CardViewerRouteProp>();
  const navigation = useNavigation<CardViewerNavigationProp>();
  const { cardId } = route.params;

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ResponseTier>(2); // Default to Tier 2
  const flipRotation = useSharedValue(0);

  const completed = useGameState((state) => state.completed);
  const favorites = useGameState((state) => state.favorites);
  const isPremium = useGameState((state) => state.isPremium);
  const completeCard = useGameState((state) => state.completeCard);
  const toggleFavorite = useGameState((state) => state.toggleFavorite);
  const shouldShowInterstitial = useGameState((state) => state.shouldShowInterstitial);
  const { purchaseRemoveAds } = useRevenueCat();

  const card = useMemo(() => cards.find((c) => c.id === cardId), [cardId]);

  // Animate flip rotation when isFlipped changes
  useEffect(() => {
    flipRotation.value = withTiming(isFlipped ? 180 : 0, { duration: 300 });
  }, [isFlipped]);

  if (!card) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Card not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = completed.includes(card.id);
  const isFavorite = favorites.includes(card.id);

  // Determine which tiers are disabled (empty content)
  const disabledTiers = useMemo(() => {
    const disabled: ResponseTier[] = [];
    if (!card.tier1_summary && !card.tier1_verses) disabled.push(1);
    if (!card.tier3_discussion) disabled.push(3);
    return disabled;
  }, [card]);

  // Animated styles for front and back
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    const opacity = interpolate(flipRotation.value, [0, 90, 90.1, 180], [1, 1, 0, 0]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    const opacity = interpolate(flipRotation.value, [0, 89.9, 90, 180], [0, 0, 1, 1]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
    };
  });

  const handleFlip = () => {
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    if (!isCompleted) {
      if (Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      completeCard(card);
      // Show interstitial after mastering (fires when navigating away, not on this screen)
      const shouldShow = shouldShowInterstitial();
      if (shouldShow) {
        // Small delay so user sees the "MASTERED" confirmation before ad appears
        setTimeout(() => showInterstitialIfNeeded(true, isPremium, purchaseRemoveAds), 800);
      }
    }
  };

  const handleToggleFavorite = () => {
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(card.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>{isFavorite ? "★" : "☆"}</Text>
        </TouchableOpacity>
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        {/* Flip Button */}
        <TouchableOpacity style={styles.flipButton} onPress={handleFlip} activeOpacity={0.7}>
          <Text style={styles.flipButtonText}>
            {isFlipped ? "← See Objection" : "See Response →"}
          </Text>
        </TouchableOpacity>

        {/* Card with flip animation */}
        <View style={styles.cardWrapper}>
          {/* Front side */}
          <Animated.View style={[styles.card, styles.cardSide, frontAnimatedStyle]}>
            <CardFront card={card} />
          </Animated.View>

          {/* Back side */}
          <Animated.View style={[styles.card, styles.cardSide, backAnimatedStyle]}>
            <TierTabs
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              disabledTiers={disabledTiers}
            />
            <CardBack card={card} selectedTier={selectedTier} />
          </Animated.View>
        </View>
      </View>

      {/* Bottom Actions */}
      {isFlipped && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.masteredButton, isCompleted && styles.masteredButtonCompleted]}
            onPress={handleMastered}
            disabled={isCompleted}
          >
            <Text style={[styles.masteredButtonText, isCompleted && styles.masteredButtonTextCompleted]}>
              {isCompleted ? "✓ MASTERED" : "MARK AS MASTERED"}
            </Text>
            {!isCompleted && (
              <Text style={styles.masteredButtonPoints}>+{card.point_value} XP</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.gold,
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 28,
    color: colors.gold,
  },
  cardContainer: {
    flex: 1,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.goldBorder,
    overflow: "hidden",
  },
  cardSide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  masteredButton: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  masteredButtonCompleted: {
    backgroundColor: colors.success,
  },
  masteredButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
  },
  masteredButtonTextCompleted: {
    color: colors.textPrimary,
  },
  masteredButtonPoints: {
    fontSize: 13,
    color: colors.background,
    marginTop: 4,
    opacity: 0.8,
  },
  flipButton: {
    backgroundColor: colors.gold,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.goldBorder,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  flipButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.textMuted,
  },
});
