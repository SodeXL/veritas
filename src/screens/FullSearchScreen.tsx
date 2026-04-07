// src/screens/FullSearchScreen.tsx

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { useGameState } from "../store/useGameState";
import { TopBar } from "../components/TopBar";
import { CardListItem } from "../components/CardListItem";
import { AdBanner } from "../components/AdBanner";
import { searchCards, QUICK_FILTER_TAGS } from "../utils/search";
import cardsData from "../data/cards.json";
import { Card } from "../types/card";

const cards = cardsData as Card[];

type RootStackParamList = {
  CardViewer: { cardId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FullSearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuickTag, setSelectedQuickTag] = useState<string | null>(null);
  const completed = useGameState((state) => state.completed);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && !selectedQuickTag) return [];

    let results = cards;

    // Apply quick tag filter
    if (selectedQuickTag) {
      results = results.filter((card) =>
        card.opponent_tags.includes(selectedQuickTag)
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      results = searchCards(results, searchQuery);
    }

    return results;
  }, [searchQuery, selectedQuickTag]);

  const handleQuickTagPress = (tag: string) => {
    setSelectedQuickTag((prev) => (prev === tag ? null : tag));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedQuickTag(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <Text style={styles.title}>Quick Reference</Text>
          <Text style={styles.subtitle}>
            Search {cards.length} apologetics responses
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search title, objection, response..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {(searchQuery || selectedQuickTag) && (
            <TouchableOpacity onPress={handleClearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Filter Tags */}
        <View style={styles.quickFilters}>
          <Text style={styles.quickFiltersLabel}>Quick filters:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFiltersScroll}
          >
            {QUICK_FILTER_TAGS.map((tag) => {
              const isSelected = selectedQuickTag === tag;
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.quickTag, isSelected && styles.quickTagSelected]}
                  onPress={() => handleQuickTagPress(tag)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.quickTagText,
                      isSelected && styles.quickTagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results */}
        <ScrollView
          style={styles.resultsContainer}
          contentContainerStyle={styles.resultsContent}
        >
          {searchResults.length > 0 ? (
            <>
              <Text style={styles.resultsCount}>
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </Text>
              {searchResults.map((card) => (
                <View key={card.id} style={styles.cardItem}>
                  <CardListItem
                    card={card}
                    onPress={() => navigation.navigate("CardViewer", { cardId: card.id })}
                  />
                  {completed.includes(card.id) && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓</Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          ) : (searchQuery || selectedQuickTag) ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No cards found</Text>
              <Text style={styles.emptyStateHint}>
                Try different search terms or filters
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Start typing or select a quick filter
              </Text>
              <Text style={styles.emptyStateHint}>
                Search across titles, objections, and responses
              </Text>
            </View>
          )}

          {/* Bottom padding for ad banner */}
          <View style={{ height: 60 }} />
        </ScrollView>
      </View>

      <AdBanner />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 20,
    color: colors.textMuted,
  },
  quickFilters: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  quickFiltersLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 10,
  },
  quickFiltersScroll: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 16,
  },
  quickTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  quickTagSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  quickTagText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  quickTagTextSelected: {
    color: colors.background,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateHint: {
    fontSize: 14,
    color: colors.textDim,
    textAlign: "center",
  },
});
