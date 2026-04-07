// src/utils/gamification.ts

import { LevelInfo } from "../types/card";

const LEVELS = [
  { level: 1, name: "Seeker", threshold: 0 },
  { level: 2, name: "Learner", threshold: 100 },
  { level: 3, name: "Defender", threshold: 300 },
  { level: 4, name: "Apologist", threshold: 600 },
  { level: 5, name: "Guardian", threshold: 1000 },
  { level: 6, name: "Scholar", threshold: 1600 },
  { level: 7, name: "Doctor", threshold: 2500 },
  { level: 8, name: "Doctor of the Church", threshold: 4000 },
];

export function getLevel(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.threshold) current = lvl;
    else break;
  }
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;

  return {
    level: current.level,
    name: current.name,
    currentThreshold: current.threshold,
    nextThreshold: next ? next.threshold : 99999,
  };
}

export function getLevelProgress(xp: number): number {
  const info = getLevel(xp);
  const range = info.nextThreshold - info.currentThreshold;
  if (range <= 0) return 100;
  return Math.min(((xp - info.currentThreshold) / range) * 100, 100);
}

export function getDailyCard<T>(cards: T[], date?: Date): T {
  const d = date || new Date();
  const seed = d.getDate() + d.getMonth() * 31 + d.getFullYear() * 366;
  return cards[seed % cards.length];
}

export function calculateStreak(
  currentStreak: number,
  lastDate: string | null
): number {
  const today = new Date().toDateString();
  if (lastDate === today) return currentStreak;

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastDate === yesterday) return currentStreak + 1;

  return 1; // streak broken or first day
}

export function isStreakBroken(lastDate: string | null): boolean {
  if (!lastDate) return false;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return lastDate !== today && lastDate !== yesterday;
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Easy",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export const TIER_LABELS: Record<number, string> = {
  1: "Quick Answer",
  2: "Go Deeper",
  3: "Discussion",
};

export const INTERSTITIAL_INTERVAL = 6; // show ad every N cards studied
