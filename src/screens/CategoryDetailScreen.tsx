// src/screens/CategoryDetailScreen.tsx

import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, getCategoryColor } from "../theme/colors";
import { useGameState } from "../store/useGameState";
import { CardListItem } from "../components/CardListItem";
import { TagFilter } from "../components/TagFilter";
import { getCategoryMeta } from "../data/categories";
import cardsData from "../data/cards.json";
import { Card } from "../types/card";

const cards = cardsData as Card[];

type RootStackParamList = {
  CategoryDetail: { category: string };
  CardViewer: { cardId: string };
};

type CategoryDetailRouteProp = RouteProp<RootStackParamList, "CategoryDetail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CategoryDetailScreen: React.FC = () => {
  const route = useRoute<CategoryDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { category } = route.params;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const completed = useGameState((state) => state.completed);

  const categoryMeta = getCategoryMeta(category);
  const categoryColor = getCategoryColor(category);

  // Get all cards for this category
  const categoryCards = useMemo(() => {
    return cards.filter((c) => c.category === category);
  }, [category]);

  // Get all unique opponent tags for this category
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    categoryCards.forEach((card) => {
      card.opponent_tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [categoryCards]);

  // Filter cards by selected tags
  const filteredCards = useMemo(() => {
    if (selectedTags.length === 0) return categoryCards;
    return categoryCards.filter((card) =>
      selectedTags.some((tag) => card.opponent_tags?.includes(tag))
    );
  }, [categoryCards, selectedTags]);

  const completedCount = categoryCards.filter((c) => completed.includes(c.id)).length;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Category Info */}
      <View style={[styles.categoryHeader, { backgroundColor: categoryColor + "20" }]}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryIcon}>{categoryMeta.icon}</Text>
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.categoryStats}>
            {completedCount} / {categoryCards.length} mastered
          </Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <TagFilter
            tags={availableTags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
          />
        )}

        {/* Results Count */}
        {selectedTags.length > 0 && (
          <Text style={styles.resultsCount}>
            Showing {filteredCards.length} of {categoryCards.length} cards
          </Text>
        )}

        {/* Card List */}
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <View key={card.id} style={styles.cardItem}>
              <CardListItem
                card={card}
                onPress={() => navigation.navigate("CardViewer", { cardId: card.id })}
                showCategory={false}
              />
              {completed.includes(card.id) && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No cards match the selected filters
            </Text>
          </View>
        )}
      </ScrollView>
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
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
  },
  categoryBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  categoryIcon: {
    fontSize: 32,
    color: colors.textPrimary,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  categoryStats: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsCount: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
  },
  cardItem: {
    position: "relative",
  },
  completedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  completedText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
  },
});
