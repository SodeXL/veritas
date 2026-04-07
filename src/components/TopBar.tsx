// src/components/TopBar.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { useGameState } from "../store/useGameState";
import { getLevel, getLevelProgress } from "../utils/gamification";

export const TopBar: React.FC = () => {
  const xp = useGameState((state) => state.xp);
  const streak = useGameState((state) => state.streak);

  const levelInfo = getLevel(xp);
  const progress = getLevelProgress(xp);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Level Badge */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{levelInfo.level}</Text>
        </View>

        {/* Level Name & XP Bar */}
        <View style={styles.levelInfo}>
          <Text style={styles.levelName}>{levelInfo.name}</Text>
          <View style={styles.xpBarContainer}>
            <View style={[styles.xpBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.xpText}>
            {xp} / {levelInfo.nextThreshold === 99999 ? "MAX" : levelInfo.nextThreshold}
          </Text>
        </View>
      </View>

      {/* Streak Counter */}
      {streak > 0 && (
        <View style={styles.streakContainer}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>{streak}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.background,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  xpBarContainer: {
    height: 6,
    backgroundColor: colors.goldDim,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 2,
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  xpText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.goldDim,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.gold,
  },
});
