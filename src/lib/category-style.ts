import { FoodCategory, RecipeCategory } from "@/types";

export const CATEGORY_EMOJI: Record<FoodCategory, string> = {
  Gemüse: "🥦",
  Obst: "🍎",
  Fleisch: "🥩",
  Fisch: "🐟",
  Milchprodukte: "🥛",
  Getränke: "🥤",
  Tiefkühl: "🧊",
  Vorrat: "🥫",
  Sonstiges: "🍽️",
};

export const CATEGORY_COLOR: Record<FoodCategory, string> = {
  Gemüse: "bg-brand-100 text-brand-700",
  Obst: "bg-accent-100 text-accent-600",
  Fleisch: "bg-rose-100 text-rose-600",
  Fisch: "bg-sky-100 text-sky-600",
  Milchprodukte: "bg-amber-100 text-amber-700",
  Getränke: "bg-indigo-100 text-indigo-600",
  Tiefkühl: "bg-cyan-100 text-cyan-700",
  Vorrat: "bg-stone-100 text-stone-600",
  Sonstiges: "bg-gray-100 text-gray-600",
};

export const RECIPE_CATEGORY_COLOR: Record<RecipeCategory, string> = {
  "Schnell & einfach": "bg-brand-100 text-brand-700",
  Gesund: "bg-emerald-100 text-emerald-700",
  "Für Kinder geeignet": "bg-amber-100 text-amber-700",
  "High Protein": "bg-rose-100 text-rose-600",
  "Wenig Kalorien": "bg-sky-100 text-sky-600",
  Resteverwertung: "bg-stone-100 text-stone-600",
};

export function daysUntil(dateIso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateIso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
