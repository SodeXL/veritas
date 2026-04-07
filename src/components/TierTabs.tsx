// src/components/TierTabs.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { ResponseTier } from "../types/card";
import { TIER_LABELS } from "../utils/gamification";

interface TierTabsProps {
  selectedTier: ResponseTier;
  onSelectTier: (tier: ResponseTier) => void;
  disabledTiers?: ResponseTier[];
}

export const TierTabs: React.FC<TierTabsProps> = ({
  selectedTier,
  onSelectTier,
  disabledTiers = [],
}) => {
  const tiers: ResponseTier[] = [1, 2, 3];

  return (
    <View style={styles.container}>
      {tiers.map((tier) => {
        const isSelected = selectedTier === tier;
        const isDisabled = disabledTiers.includes(tier);

        return (
          <TouchableOpacity
            key={tier}
            style={[
              styles.tab,
              isSelected && styles.tabSelected,
              isDisabled && styles.tabDisabled,
            ]}
            onPress={() => !isDisabled && onSelectTier(tier)}
            activeOpacity={isDisabled ? 1 : 0.7}
            disabled={isDisabled}
          >
            <Text
              style={[
                styles.tabText,
                isSelected && styles.tabTextSelected,
                isDisabled && styles.tabTextDisabled,
              ]}
            >
              {TIER_LABELS[tier]}
            </Text>
            {isSelected && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabSelected: {
    backgroundColor: colors.goldDim,
  },
  tabDisabled: {
    opacity: 0.3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  tabTextSelected: {
    color: colors.gold,
  },
  tabTextDisabled: {
    color: colors.textMuted,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 2,
    left: "25%",
    right: "25%",
    height: 2,
    backgroundColor: colors.gold,
    borderRadius: 1,
  },
});
