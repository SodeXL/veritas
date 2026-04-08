// src/components/RemoveAdsButton.tsx
//
// Displays the "Remove Ads" purchase button and "Restore Purchases" link.
// Place on Profile screen. Hides on web (no IAP).

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { colors } from "../theme/colors";
import { useRevenueCat } from "../hooks/useRevenueCat";

export function RemoveAdsButton() {
  const { isPremium, purchaseRemoveAds, restorePurchases } = useRevenueCat();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // No IAP on web
  if (Platform.OS === "web") return null;

  if (isPremium) {
    return (
      <View style={styles.premiumBadge}>
        <Text style={styles.premiumIcon}>✓</Text>
        <Text style={styles.premiumText}>Ads Removed — Thank You!</Text>
      </View>
    );
  }

  const handlePurchase = async () => {
    setPurchasing(true);
    await purchaseRemoveAds();
    setPurchasing(false);
  };

  const handleRestore = async () => {
    setRestoring(true);
    await restorePurchases();
    setRestoring(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={handlePurchase}
        disabled={purchasing}
        activeOpacity={0.8}
      >
        {purchasing ? (
          <ActivityIndicator color={colors.background} size="small" />
        ) : (
          <>
            <Text style={styles.purchaseTitle}>Remove Ads</Text>
            <Text style={styles.purchaseSubtitle}>$4.99 — One-Time Purchase</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={handleRestore}
        disabled={restoring}
        activeOpacity={0.7}
      >
        <Text style={styles.restoreText}>
          {restoring ? "Restoring..." : "Restore Purchases"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 20,
  },
  purchaseButton: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 58,
    justifyContent: "center",
  },
  purchaseTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.background,
    marginBottom: 2,
  },
  purchaseSubtitle: {
    fontSize: 13,
    color: colors.background,
    opacity: 0.8,
  },
  restoreButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  restoreText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(90, 175, 106, 0.15)",
    borderWidth: 1,
    borderColor: "#5AAF6A",
    marginBottom: 20,
  },
  premiumIcon: {
    fontSize: 18,
    color: "#5AAF6A",
  },
  premiumText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5AAF6A",
  },
});
