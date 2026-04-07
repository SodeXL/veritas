// src/components/CardListItem.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../types/card";
import { colors, getCategoryColor } from "../theme/colors";
import { getCategoryMeta } from "../data/categories";

interface CardListItemProps {
  card: Card;
  onPress: () => void;
  showCategory?: boolean;
}

export const CardListItem: React.FC<CardListItemProps> = ({
  card,
  onPress,
  showCategory = true,
}) => {
  const categoryMeta = getCategoryMeta(card.category);
  const categoryColor = getCategoryColor(card.category);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Category Badge */}
      {showCategory && (
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryIcon}>{categoryMeta.icon}</Text>
        </View>
      )}

      {/* Card Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {card.title}
        </Text>
        {showCategory && (
          <Text style={styles.category}>{card.category}</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.points}>{card.point_value} pts</Text>
          {card.difficulty_level && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.difficulty}>
                Level {card.difficulty_level}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  points: {
    fontSize: 11,
    color: colors.gold,
    fontWeight: "600",
  },
  dot: {
    fontSize: 11,
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  difficulty: {
    fontSize: 11,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
    marginLeft: 8,
  },
});
