// src/components/CategoryTile.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CategoryMeta } from "../types/card";
import { colors } from "../theme/colors";

interface CategoryTileProps {
  category: CategoryMeta;
  cardCount: number;
  completedCount: number;
  onPress: () => void;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  category,
  cardCount,
  completedCount,
  onPress,
}) => {
  const progress = cardCount > 0 ? (completedCount / cardCount) * 100 : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Icon Circle */}
      <View style={[styles.iconCircle, { backgroundColor: category.color }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>

      {/* Category Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {category.name}
        </Text>
        <Text style={styles.count}>
          {completedCount} / {cardCount} cards
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: category.color }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.goldDim,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
});
