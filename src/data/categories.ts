// src/data/categories.ts

import { CategoryMeta, CategoryName } from "../types/card";

export const CATEGORIES: CategoryMeta[] = [
  { name: "Salvation", icon: "✚", color: "#B84A4A" },
  { name: "Scripture & Authority", icon: "✐", color: "#2E7D5B" },
  { name: "Mary & Saints & Images", icon: "✡", color: "#4A7FC7" },
  { name: "Eucharist", icon: "✠", color: "#C7894A" },
  { name: "Marriage", icon: "♡", color: "#C75A6E" },
  { name: "Baptism", icon: "♒", color: "#3AA8C1" },
  { name: "Confession", icon: "☘", color: "#7A5FA0" },
  { name: "Holy Orders", icon: "☦", color: "#8B6914" },
  { name: "Confirmation", icon: "❁", color: "#E8873A" },
  { name: "Anointing", icon: "☣", color: "#5AAF6A" },
];

export const getCategoryMeta = (name: string): CategoryMeta => {
  return (
    CATEGORIES.find((c) => c.name === name) || {
      name: name as CategoryName,
      icon: "•",
      color: "#D4A843",
    }
  );
};
