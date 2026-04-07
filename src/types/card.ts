// src/types/card.ts

export interface Card {
  id: string;
  title: string;
  objection_text: string;
  their_verses: string;
  their_verses_text: string;
  tier1_summary: string;
  tier1_verses: string;
  tier1_verses_text: string;
  tier2_short: string;
  tier2_explanation: string;
  tier3_discussion: string;
  category: CategoryName;
  opponent_tags: string[];
  ccc_refs: string;
  patristic_refs: string;
  tradition_type: string;
  difficulty_level: DifficultyLevel;
  age_group: AgeGroup;
  skill_category: string;
  point_value: number;
  card_tier: CardTier;
}

export type CategoryName =
  | "Salvation"
  | "Scripture & Authority"
  | "Mary & Saints & Images"
  | "Eucharist"
  | "Marriage"
  | "Baptism"
  | "Confession"
  | "Anointing"
  | "Holy Orders"
  | "Confirmation";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type AgeGroup =
  | "Child+"
  | "Teen"
  | "Teen+"
  | "Adult Beginner"
  | "Adult Intermediate"
  | "Adult Advanced"
  | "Adult";

export type CardTier = "Beginner" | "Core" | "Intermediate" | "Advanced";

export type ResponseTier = 1 | 2 | 3;

export interface GameState {
  xp: number;
  streak: number;
  lastDate: string | null;
  completed: string[];
  favorites: string[];
  dailyDone: boolean;
  isPremium: boolean;
  cardsStudiedSinceAd: number;
  familyMode: boolean;
}

export interface LevelInfo {
  level: number;
  name: string;
  currentThreshold: number;
  nextThreshold: number;
}

export interface CategoryMeta {
  name: CategoryName;
  icon: string;
  color: string;
}
