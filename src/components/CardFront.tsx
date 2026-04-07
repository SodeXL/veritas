// src/components/CardFront.tsx

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card } from "../types/card";
import { colors, getCategoryColor } from "../theme/colors";
import { getCategoryMeta } from "../data/categories";
import { DIFFICULTY_LABELS } from "../utils/gamification";

interface CardFrontProps {
  card: Card;
}

export const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  const categoryMeta = getCategoryMeta(card.category);
  const categoryColor = getCategoryColor(card.category);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Category Badge */}
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryIcon}>{categoryMeta.icon}</Text>
          <Text style={styles.categoryName}>{card.category}</Text>
        </View>
        <View style={styles.metaBadges}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {DIFFICULTY_LABELS[card.difficulty_level]}
            </Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{card.point_value} pts</Text>
          </View>
        </View>
      </View>

      {/* Opponent Tags */}
      {card.opponent_tags && card.opponent_tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {card.opponent_tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Card Title */}
      <Text style={styles.title}>{card.title}</Text>

      {/* Objection Label */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>THE OBJECTION</Text>
      </View>

      {/* Objection Text */}
      <Text style={styles.objectionText}>{card.objection_text}</Text>

      {/* Their Verses */}
      {card.their_verses && (
        <>
          <View style={styles.versesHeader}>
            <Text style={styles.versesLabel}>Their Scripture:</Text>
            <Text style={styles.versesRef}>{card.their_verses}</Text>
          </View>
          {card.their_verses_text && (
            <View style={styles.versesTextContainer}>
              <Text style={styles.versesText}>{card.their_verses_text}</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  metaBadges: {
    gap: 8,
    alignItems: "flex-end",
  },
  difficultyBadge: {
    backgroundColor: colors.goldDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    color: colors.gold,
    fontWeight: "600",
  },
  pointsBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  pointsText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  tagText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 1,
  },
  objectionText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  versesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  versesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  versesRef: {
    fontSize: 13,
    color: colors.gold,
    fontWeight: "600",
  },
  versesTextContainer: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    marginBottom: 20,
  },
  versesText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: "italic",
  },
});
