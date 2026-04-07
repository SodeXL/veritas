// src/theme/colors.ts

export const colors = {
  // Base
  background: "#12100D",
  backgroundAlt: "#1A1612",
  surface: "rgba(42, 36, 30, 0.6)",
  surfaceLight: "rgba(42, 36, 30, 0.4)",

  // Gold/Accent
  gold: "#D4A843",
  goldLight: "#E8C860",
  goldDim: "rgba(212, 168, 67, 0.2)",
  goldSubtle: "rgba(212, 168, 67, 0.08)",
  goldBorder: "rgba(212, 168, 67, 0.15)",

  // Text
  textPrimary: "#F0E8D4",
  textSecondary: "#C4B896",
  textMuted: "#8A7E6E",
  textDim: "#6B5E4E",
  textDark: "#4A433A",

  // Status
  success: "#5AAF6A",
  warning: "#E8873A",
  error: "#B84A4A",

  // Category colors
  categories: {
    "Mary & Saints & Images": "#4A7FC7",
    "Baptism": "#3AA8C1",
    "Eucharist": "#C7894A",
    "Confession": "#7A5FA0",
    "Marriage": "#C75A6E",
    "Anointing": "#5AAF6A",
    "Holy Orders": "#8B6914",
    "Confirmation": "#E8873A",
    "Salvation": "#B84A4A",
    "Scripture & Authority": "#2E7D5B",
  } as Record<string, string>,

  // Tier colors
  tiers: {
    1: "#D4A843",
    2: "#A07030",
    3: "#6B4423",
  } as Record<number, string>,
};

export const getCategoryColor = (category: string): string => {
  return colors.categories[category] || colors.gold;
};
