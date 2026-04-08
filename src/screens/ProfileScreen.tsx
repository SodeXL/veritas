// src/screens/ProfileScreen.tsx

import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, getCategoryColor } from "../theme/colors";
import { TopBar } from "../components/TopBar";
import { CardListItem } from "../components/CardListItem";
import { RemoveAdsButton } from "../components/RemoveAdsButton";
import { useGameState } from "../store/useGameState";
import { getLevel } from "../utils/gamification";
import { CATEGORIES } from "../data/categories";
import cardsData from "../data/cards.json";
import { Card } from "../types/card";

const cards = cardsData as Card[];

type RootStackParamList = {
  CardViewer: { cardId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const xp = useGameState((state) => state.xp);
  const completed = useGameState((state) => state.completed);
  const favorites = useGameState((state) => state.favorites);
  const resetProgress = useGameState((state) => state.resetProgress);

  const levelInfo = getLevel(xp);
  const xpProgress = levelInfo.nextThreshold > levelInfo.currentThreshold
    ? ((xp - levelInfo.currentThreshold) / (levelInfo.nextThreshold - levelInfo.currentThreshold)) * 100
    : 100;

  // Calculate category stats
  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const categoryCards = cards.filter((c) => c.category === cat.name);
      const completedCount = categoryCards.filter((c) => completed.includes(c.id)).length;
      const progress = categoryCards.length > 0 ? (completedCount / categoryCards.length) * 100 : 0;
      return {
        category: cat,
        totalCards: categoryCards.length,
        completedCount,
        progress,
      };
    });
  }, [completed]);

  // Get favorite cards
  const favoriteCards = useMemo(() => {
    return cards.filter((c) => favorites.includes(c.id));
  }, [favorites]);

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This will clear your XP, streak, and all mastered cards. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetProgress();
            Alert.alert("Progress Reset", "Your progress has been reset.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Level Badge */}
        <View style={styles.levelSection}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelIcon}>☆</Text>
            <Text style={styles.levelNumber}>{levelInfo.level}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>{levelInfo.name}</Text>
            <Text style={styles.levelXP}>
              {xp} / {levelInfo.nextThreshold} XP
            </Text>
          </View>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${Math.min(xpProgress, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {levelInfo.nextThreshold < 99999 ? `${Math.round(xpProgress)}% to next level` : "Max Level!"}
        </Text>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completed.length}</Text>
            <Text style={styles.statLabel}>Cards Mastered</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>Total Halos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cards.length}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>
        </View>

        {/* Category Progress */}
        <Text style={styles.sectionTitle}>Category Progress</Text>
        <View style={styles.categoryList}>
          {categoryStats.map((stat) => {
            const categoryColor = getCategoryColor(stat.category.name);
            return (
              <View key={stat.category.name} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryNameRow}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryColor }]}>
                      <Text style={styles.categoryIconText}>{stat.category.icon}</Text>
                    </View>
                    <Text style={styles.categoryName}>{stat.category.name}</Text>
                  </View>
                  <Text style={styles.categoryCount}>
                    {stat.completedCount} / {stat.totalCards}
                  </Text>
                </View>
                <View style={styles.categoryProgressBarContainer}>
                  <View
                    style={[
                      styles.categoryProgressBar,
                      { width: `${stat.progress}%`, backgroundColor: categoryColor },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Favorites List */}
        {favoriteCards.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Favorites ({favoriteCards.length})</Text>
            <View style={styles.favoritesList}>
              {favoriteCards.map((card) => (
                <CardListItem
                  key={card.id}
                  card={card}
                  onPress={() => navigation.navigate("CardViewer", { cardId: card.id })}
                />
              ))}
            </View>
          </>
        )}

        {/* Remove Ads / Premium */}
        <Text style={styles.sectionTitle}>Support Veritas</Text>
        <RemoveAdsButton />

        {/* Reset Progress Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetProgress}>
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  levelSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  levelBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  levelIcon: {
    fontSize: 32,
    color: colors.background,
    position: "absolute",
    top: 12,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.background,
    marginTop: 8,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  levelXP: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.surface,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.gold,
  },
  progressText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.gold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  categoryList: {
    marginBottom: 32,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  categoryIconText: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  categoryCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryProgressBarContainer: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryProgressBar: {
    height: "100%",
  },
  favoritesList: {
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: "rgba(184, 74, 74, 0.3)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B84A4A",
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#B84A4A",
  },
});
