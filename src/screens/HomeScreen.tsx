// src/screens/HomeScreen.tsx

import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { colors, getCategoryColor } from "../theme/colors";
import { useGameState } from "../store/useGameState";
import { TopBar } from "../components/TopBar";
import { StatsRow } from "../components/StatsRow";
import { CategoryTile } from "../components/CategoryTile";
import { CardListItem } from "../components/CardListItem";
import { AdBanner } from "../components/AdBanner";
import { CATEGORIES, getCategoryMeta } from "../data/categories";
import { getDailyCard } from "../utils/gamification";
import cardsData from "../data/cards.json";
import { Card } from "../types/card";

const cards = cardsData as Card[];

type RootStackParamList = {
  CardViewer: { cardId: string };
  CategoryDetail: { category: string };
  MainTabs: undefined;
};

type TabParamList = {
  Home: undefined;
  Browse: undefined;
  Search: undefined;
  Profile: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const xp = useGameState((state) => state.xp);
  const streak = useGameState((state) => state.streak);
  const completed = useGameState((state) => state.completed);
  const checkStreak = useGameState((state) => state.checkStreak);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Check streak when refreshing
    checkStreak();
    // Simulate a short delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  }, [checkStreak]);

  // Calculate stats
  const masteredPercent = useMemo(() => {
    if (cards.length === 0) return 0;
    return Math.round((completed.length / cards.length) * 100);
  }, [completed.length]);

  // Get daily challenge card
  const dailyCard = useMemo(() => getDailyCard(cards), []);
  const isDailyCompleted = completed.includes(dailyCard.id);

  // Get category stats (card count and completed count per category)
  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const categoryCards = cards.filter((c) => c.category === cat.name);
      const completedCount = categoryCards.filter((c) => completed.includes(c.id)).length;
      return {
        category: cat,
        totalCards: categoryCards.length,
        completedCount,
      };
    });
  }, [completed]);

  // Top 4 categories by card count
  const topCategories = useMemo(() => {
    return [...categoryStats]
      .sort((a, b) => b.totalCards - a.totalCards)
      .slice(0, 4);
  }, [categoryStats]);

  // Next 3 uncompleted cards
  const continueStudying = useMemo(() => {
    return cards.filter((c) => !completed.includes(c.id)).slice(0, 3);
  }, [completed]);

  const dailyCategoryMeta = getCategoryMeta(dailyCard.category);
  const dailyCategoryColor = getCategoryColor(dailyCard.category);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold}
            colors={[colors.gold]}
          />
        }
      >
        {/* Daily Challenge Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Challenge</Text>
          <TouchableOpacity
            style={[
              styles.dailyCard,
              { borderColor: dailyCategoryColor },
            ]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("CardViewer", { cardId: dailyCard.id })}
          >
            {/* Header */}
            <View style={styles.dailyHeader}>
              <View style={[styles.dailyBadge, { backgroundColor: dailyCategoryColor }]}>
                <Text style={styles.dailyBadgeIcon}>{dailyCategoryMeta.icon}</Text>
              </View>
              <View style={styles.dailyInfo}>
                <Text style={styles.dailyLabel}>TODAY'S CHALLENGE</Text>
                <Text style={styles.dailyCategory}>{dailyCard.category}</Text>
              </View>
              {!isDailyCompleted && (
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusText}>2X</Text>
                </View>
              )}
              {isDailyCompleted && (
                <Text style={styles.completedCheckmark}>✓</Text>
              )}
            </View>

            {/* Card Content */}
            <Text style={styles.dailyTitle} numberOfLines={3}>
              {dailyCard.title}
            </Text>
            <Text style={styles.dailyPoints}>
              {isDailyCompleted ? `Completed` : `${dailyCard.point_value * 2} points`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <StatsRow halos={xp} streak={streak} masteredPercent={masteredPercent} />

        {/* Top Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Browse")}>
              <Text style={styles.seeAll}>See All ›</Text>
            </TouchableOpacity>
          </View>
          {topCategories.map((stat) => (
            <CategoryTile
              key={stat.category.name}
              category={stat.category}
              cardCount={stat.totalCards}
              completedCount={stat.completedCount}
              onPress={() => navigation.navigate("CategoryDetail", { category: stat.category.name })}
            />
          ))}
        </View>

        {/* Continue Studying */}
        {continueStudying.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Studying</Text>
            {continueStudying.map((card) => (
              <CardListItem
                key={card.id}
                card={card}
                onPress={() => navigation.navigate("CardViewer", { cardId: card.id })}
              />
            ))}
          </View>
        )}

        {/* Bottom padding for ad banner */}
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Ad Banner */}
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: "600",
  },
  dailyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  dailyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dailyBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dailyBadgeIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  dailyInfo: {
    flex: 1,
  },
  dailyLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  dailyCategory: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  bonusBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.background,
  },
  completedCheckmark: {
    fontSize: 28,
    color: colors.success,
  },
  dailyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  dailyPoints: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: "600",
  },
});
