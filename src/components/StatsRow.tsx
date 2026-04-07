// src/components/StatsRow.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    {icon && <Text style={styles.statIcon}>{icon}</Text>}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface StatsRowProps {
  halos: number;
  streak: number;
  masteredPercent: number;
}

export const StatsRow: React.FC<StatsRowProps> = ({ halos, streak, masteredPercent }) => {
  return (
    <View style={styles.container}>
      <StatItem icon="✨" label="Halos" value={halos.toLocaleString()} />
      <View style={styles.divider} />
      <StatItem icon="🔥" label="Day Streak" value={streak} />
      <View style={styles.divider} />
      <StatItem icon="⭐" label="Mastered" value={`${masteredPercent}%`} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    backgroundColor: colors.goldBorder,
    marginHorizontal: 8,
  },
});
