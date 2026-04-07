// src/utils/search.ts

import { Card } from "../types/card";

export function searchCards(cards: Card[], query: string): Card[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return cards
    .map((card) => {
      let score = 0;
      const searchable = [
        card.title,
        card.objection_text,
        card.tier1_summary,
        card.tier2_short,
        card.tier2_explanation,
        card.tier3_discussion,
        card.category,
        card.their_verses,
        card.ccc_refs,
        ...card.opponent_tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      for (const term of terms) {
        if (card.title.toLowerCase().includes(term)) score += 10;
        else if (card.objection_text.toLowerCase().includes(term)) score += 5;
        else if (card.category.toLowerCase().includes(term)) score += 4;
        else if (card.opponent_tags.some((t) => t.toLowerCase().includes(term)))
          score += 3;
        else if (searchable.includes(term)) score += 1;
      }

      return { card, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.card);
}

export function filterByTag(cards: Card[], tag: string | null): Card[] {
  if (!tag) return cards;
  return cards.filter((c) => c.opponent_tags.includes(tag));
}

export function filterByCategory(cards: Card[], category: string): Card[] {
  return cards.filter((c) => c.category === category);
}

export function filterByAge(cards: Card[], familyMode: boolean): Card[] {
  if (!familyMode) return cards;
  const allowed = ["Child+", "Teen", "Teen+", "Adult Beginner"];
  return cards.filter((c) => allowed.includes(c.age_group));
}

export function getUniqueTagsForCards(cards: Card[]): string[] {
  const tags = new Set<string>();
  cards.forEach((c) => c.opponent_tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
}

export const QUICK_FILTER_TAGS = [
  "Protestant",
  "Evangelical",
  "Baptist",
  "Reformed",
  "JW",
  "Muslim",
  "Secular",
  "Lapsed Catholic",
];
