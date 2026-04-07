// src/components/CardBack.tsx

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card, ResponseTier } from "../types/card";
import { colors } from "../theme/colors";

interface CardBackProps {
  card: Card;
  selectedTier: ResponseTier;
}

export const CardBack: React.FC<CardBackProps> = ({ card, selectedTier }) => {
  const renderTier1 = () => {
    if (!card.tier1_summary && !card.tier1_verses) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Quick Answer content is being developed for this card.
          </Text>
        </View>
      );
    }

    return (
      <View>
        {card.tier1_summary && (
          <>
            <Text style={styles.sectionLabel}>QUICK ANSWER</Text>
            <Text style={styles.bodyText}>{card.tier1_summary}</Text>
          </>
        )}

        {card.tier1_verses && (
          <>
            <View style={styles.versesHeader}>
              <Text style={styles.versesLabel}>Our Scripture:</Text>
              <Text style={styles.versesRef}>{card.tier1_verses}</Text>
            </View>
            {card.tier1_verses_text && (
              <View style={styles.versesTextContainer}>
                <Text style={styles.versesText}>{card.tier1_verses_text}</Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const renderTier2 = () => {
    return (
      <View>
        {card.tier2_short && (
          <>
            <Text style={styles.sectionLabel}>SUMMARY</Text>
            <Text style={styles.bodyText}>{card.tier2_short}</Text>
          </>
        )}

        {card.tier2_explanation && (
          <>
            <Text style={styles.sectionLabel}>FULL EXPLANATION</Text>
            <Text style={styles.bodyText}>{card.tier2_explanation}</Text>
          </>
        )}

        {/* Catechism References */}
        {card.ccc_refs && (
          <View style={styles.referenceBox}>
            <Text style={styles.referenceLabel}>Catechism:</Text>
            <Text style={styles.referenceText}>{card.ccc_refs}</Text>
          </View>
        )}

        {/* Patristic References */}
        {card.patristic_refs && (
          <View style={styles.referenceBox}>
            <Text style={styles.referenceLabel}>Church Fathers:</Text>
            <Text style={styles.referenceText}>{card.patristic_refs}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTier3 = () => {
    if (!card.tier3_discussion) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Discussion prompts are being developed for this card.
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.sectionLabel}>DISCUSSION QUESTION</Text>
        <Text style={styles.bodyText}>{card.tier3_discussion}</Text>

        <View style={styles.discussionHint}>
          <Text style={styles.discussionHintText}>
            💡 Use this to deepen the conversation or explore related topics.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {selectedTier === 1 && renderTier1()}
      {selectedTier === 2 && renderTier2()}
      {selectedTier === 3 && renderTier3()}
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
  },
  bodyText: {
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
    marginTop: 8,
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
  referenceBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginBottom: 12,
  },
  referenceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gold,
    marginBottom: 6,
  },
  referenceText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  discussionHint: {
    backgroundColor: colors.goldSubtle,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginTop: 8,
  },
  discussionHintText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
});
