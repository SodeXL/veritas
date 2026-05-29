// src/store/useGameState.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState, Card } from "../types/card";
import { calculateStreak, isStreakBroken, INTERSTITIAL_INTERVAL, getDailyCard } from "../utils/gamification";
import cardsData from "../data/cards.json";

interface GameActions {
  completeCard: (card: Card) => void;
  toggleFavorite: (cardId: string) => void;
  setPremium: (isPremium: boolean) => void;
  setFamilyMode: (enabled: boolean) => void;
  resetProgress: () => void;
  checkStreak: () => void;
  shouldShowInterstitial: () => boolean;
}

const initialState: GameState = {
  xp: 0,
  streak: 0,
  lastDate: null,
  completed: [],
  favorites: [],
  dailyDone: false,
  isPremium: false,
  cardsStudiedSinceAd: 0,
  familyMode: false,
};

export const useGameState = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeCard: (card: Card) => {
        const state = get();
        if (state.completed.includes(card.id)) return;

        const dailyCard = getDailyCard(cardsData as Card[]);
        const isDailyChallenge = card.id === dailyCard.id;
        const xpEarned = isDailyChallenge ? card.point_value * 2 : card.point_value;

        const today = new Date().toDateString();
        const newStreak = calculateStreak(state.streak, state.lastDate);

        set({
          xp: state.xp + xpEarned,
          completed: [...state.completed, card.id],
          streak: newStreak,
          lastDate: today,
          dailyDone: true,
          cardsStudiedSinceAd: state.cardsStudiedSinceAd + 1,
        });
      },

      toggleFavorite: (cardId: string) => {
        const state = get();
        set({
          favorites: state.favorites.includes(cardId)
            ? state.favorites.filter((id) => id !== cardId)
            : [...state.favorites, cardId],
        });
      },

      setPremium: (isPremium: boolean) => set({ isPremium }),

      setFamilyMode: (enabled: boolean) => set({ familyMode: enabled }),

      resetProgress: () =>
        set({
          ...initialState,
          isPremium: get().isPremium, // preserve purchase
          familyMode: get().familyMode,
        }),

      checkStreak: () => {
        const state = get();
        if (isStreakBroken(state.lastDate)) {
          set({ streak: 0 });
        }
      },

      shouldShowInterstitial: () => {
        const state = get();
        if (state.isPremium) return false;
        if (state.cardsStudiedSinceAd >= INTERSTITIAL_INTERVAL) {
          set({ cardsStudiedSinceAd: 0 });
          return true;
        }
        return false;
      },
    }),
    {
      name: "veritas-game-state",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
