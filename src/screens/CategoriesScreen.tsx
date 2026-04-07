// src/screens/CategoriesScreen.tsx

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { useGameState } from "../store/useGameState";
import { TopBar } from "../components/TopBar";
import { CategoryTile } from "../components/CategoryTile";
import { AdBanner } from "../components/AdBanner";
import { CATEGORIES } from "../data/categories";
import cardsData from "../data/cards.json";
import { Card } from "../types/card";

const cards = cardsData as Card[];

type RootStackParamList = {
  CategoryDetail: { category: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const completed = useGameState((state) => state.completed);

  // Calculate stats for each category
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Browse Categories</Text>
        <Text style={styles.subtitle}>
          Explore all {cards.length} apologetics cards across 10 topics
        </Text>

        <View style={styles.categoriesGrid}>
          {categoryStats.map((stat) => (
            <CategoryTile
              key={stat.category.name}
              category={stat.category}
              cardCount={stat.totalCards}
              completedCount={stat.completedCount}
              onPress={() =>
                navigation.navigate("CategoryDetail", { category: stat.category.name })
              }
            />
          ))}
        </View>

        {/* Bottom padding for ad banner */}
        <View style={{ height: 60 }} />
      </ScrollView>

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
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  categoriesGrid: {
    gap: 0,
  },
});
