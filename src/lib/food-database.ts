// Lokale Lebensmittel-Datenbank für Autocomplete und automatische Nährwerte.
// Werte sind Richtwerte pro 100g/100ml aus allgemein bekannten Nährwerttabellen.

import { FoodCategory, NutritionPer100g } from "@/types";

export interface FoodDbEntry {
  id: string;
  name: string;
  category: FoodCategory;
  defaultUnit: string;
  nutritionPer100g: NutritionPer100g;
}

export const FOOD_DATABASE: FoodDbEntry[] = [
  // Gemüse
  { id: "tomato", name: "Tomate", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6 } },
  { id: "cucumber", name: "Gurke", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7 } },
  { id: "paprika", name: "Paprika", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1, sugar: 4.2 } },
  { id: "carrot", name: "Karotte", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, sugar: 4.7 } },
  { id: "onion", name: "Zwiebel", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2 } },
  { id: "broccoli", name: "Brokkoli", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4, fiber: 2.6, sugar: 1.7 } },
  { id: "spinach", name: "Spinat", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 } },
  { id: "potato", name: "Kartoffel", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 77, protein: 2.0, carbs: 17.0, fat: 0.1, fiber: 2.2, sugar: 0.8 } },
  { id: "zucchini", name: "Zucchini", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1.0, sugar: 2.5 } },
  { id: "garlic", name: "Knoblauch", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 149, protein: 6.4, carbs: 33.1, fat: 0.5, fiber: 2.1, sugar: 1.0 } },
  { id: "mushroom", name: "Champignons", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1.0, sugar: 1.7 } },
  { id: "salad", name: "Salat", category: "Gemüse", defaultUnit: "g", nutritionPer100g: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, sugar: 0.8 } },

  // Obst
  { id: "banana", name: "Banane", category: "Obst", defaultUnit: "Stück", nutritionPer100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2 } },
  { id: "apple", name: "Apfel", category: "Obst", defaultUnit: "Stück", nutritionPer100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, sugar: 10.4 } },
  { id: "orange", name: "Orange", category: "Obst", defaultUnit: "Stück", nutritionPer100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, sugar: 9.4 } },
  { id: "grapes", name: "Weintrauben", category: "Obst", defaultUnit: "g", nutritionPer100g: { calories: 69, protein: 0.7, carbs: 18.1, fat: 0.2, fiber: 0.9, sugar: 15.5 } },
  { id: "strawberry", name: "Erdbeeren", category: "Obst", defaultUnit: "g", nutritionPer100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2.0, sugar: 4.9 } },
  { id: "lemon", name: "Zitrone", category: "Obst", defaultUnit: "Stück", nutritionPer100g: { calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8, sugar: 2.5 } },
  { id: "avocado", name: "Avocado", category: "Obst", defaultUnit: "Stück", nutritionPer100g: { calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7 } },
  { id: "pear", name: "Birne", category: "Obst", defaultUnit: "Stück", nutritionPer100g: { calories: 57, protein: 0.4, carbs: 15.2, fat: 0.1, fiber: 3.1, sugar: 9.8 } },

  // Fleisch
  { id: "chicken-breast", name: "Hähnchenbrust", category: "Fleisch", defaultUnit: "g", nutritionPer100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6 } },
  { id: "ground-beef", name: "Hackfleisch", category: "Fleisch", defaultUnit: "g", nutritionPer100g: { calories: 250, protein: 17.0, carbs: 0, fat: 20.0 } },
  { id: "beef-steak", name: "Rindersteak", category: "Fleisch", defaultUnit: "g", nutritionPer100g: { calories: 271, protein: 25.0, carbs: 0, fat: 19.0 } },
  { id: "pork", name: "Schweinefleisch", category: "Fleisch", defaultUnit: "g", nutritionPer100g: { calories: 242, protein: 27.0, carbs: 0, fat: 14.0 } },
  { id: "bacon", name: "Speck", category: "Fleisch", defaultUnit: "g", nutritionPer100g: { calories: 541, protein: 37.0, carbs: 1.4, fat: 42.0 } },
  { id: "sausage", name: "Wurst", category: "Fleisch", defaultUnit: "g", nutritionPer100g: { calories: 300, protein: 13.0, carbs: 2.0, fat: 27.0 } },
  { id: "turkey", name: "Putenbrust", category: "Fleisch", defaultUnit: "g", nutritionPer100g: { calories: 110, protein: 24.0, carbs: 0, fat: 1.0 } },

  // Fisch
  { id: "salmon", name: "Lachs", category: "Fisch", defaultUnit: "g", nutritionPer100g: { calories: 208, protein: 20.0, carbs: 0, fat: 13.0 } },
  { id: "tuna", name: "Thunfisch", category: "Fisch", defaultUnit: "g", nutritionPer100g: { calories: 144, protein: 23.3, carbs: 0, fat: 4.9 } },
  { id: "shrimp", name: "Garnelen", category: "Fisch", defaultUnit: "g", nutritionPer100g: { calories: 99, protein: 24.0, carbs: 0.2, fat: 0.3 } },
  { id: "cod", name: "Kabeljau", category: "Fisch", defaultUnit: "g", nutritionPer100g: { calories: 82, protein: 18.0, carbs: 0, fat: 0.7 } },

  // Milchprodukte
  { id: "milk", name: "Milch", category: "Milchprodukte", defaultUnit: "ml", nutritionPer100g: { calories: 64, protein: 3.4, carbs: 4.8, fat: 3.6 } },
  { id: "eggs", name: "Eier", category: "Milchprodukte", defaultUnit: "Stück", nutritionPer100g: { calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0 } },
  { id: "cheese", name: "Käse", category: "Milchprodukte", defaultUnit: "g", nutritionPer100g: { calories: 350, protein: 25.0, carbs: 1.3, fat: 28.0 } },
  { id: "mozzarella", name: "Mozzarella", category: "Milchprodukte", defaultUnit: "g", nutritionPer100g: { calories: 280, protein: 22.0, carbs: 2.2, fat: 22.0 } },
  { id: "yogurt", name: "Joghurt", category: "Milchprodukte", defaultUnit: "g", nutritionPer100g: { calories: 59, protein: 3.5, carbs: 4.7, fat: 3.3 } },
  { id: "quark", name: "Quark", category: "Milchprodukte", defaultUnit: "g", nutritionPer100g: { calories: 67, protein: 12.0, carbs: 4.0, fat: 0.3 } },
  { id: "butter", name: "Butter", category: "Milchprodukte", defaultUnit: "g", nutritionPer100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81.0 } },
  { id: "cream", name: "Sahne", category: "Milchprodukte", defaultUnit: "ml", nutritionPer100g: { calories: 292, protein: 2.4, carbs: 3.4, fat: 30.0 } },

  // Getränke
  { id: "orange-juice", name: "Orangensaft", category: "Getränke", defaultUnit: "ml", nutritionPer100g: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 } },
  { id: "cola", name: "Cola", category: "Getränke", defaultUnit: "ml", nutritionPer100g: { calories: 42, protein: 0, carbs: 10.6, fat: 0 } },
  { id: "beer", name: "Bier", category: "Getränke", defaultUnit: "ml", nutritionPer100g: { calories: 43, protein: 0.5, carbs: 3.6, fat: 0 } },
  { id: "water", name: "Wasser", category: "Getränke", defaultUnit: "ml", nutritionPer100g: { calories: 0, protein: 0, carbs: 0, fat: 0 } },

  // Vorrat / Getreide
  { id: "rice", name: "Reis", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, fiber: 0.4 } },
  { id: "pasta", name: "Nudeln", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 131, protein: 5.0, carbs: 25.0, fat: 1.1, fiber: 1.8 } },
  { id: "bread", name: "Brot", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 265, protein: 9.0, carbs: 49.0, fat: 3.2, fiber: 2.7 } },
  { id: "oats", name: "Haferflocken", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 379, protein: 13.5, carbs: 67.0, fat: 7.0, fiber: 10.0 } },
  { id: "flour", name: "Mehl", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 364, protein: 10.0, carbs: 76.0, fat: 1.0, fiber: 2.7 } },
  { id: "lentils", name: "Linsen", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 116, protein: 9.0, carbs: 20.0, fat: 0.4, fiber: 8.0 } },
  { id: "chickpeas", name: "Kichererbsen", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6 } },
  { id: "sugar", name: "Zucker", category: "Vorrat", defaultUnit: "g", nutritionPer100g: { calories: 387, protein: 0, carbs: 100.0, fat: 0, sugar: 100.0 } },
  { id: "olive-oil", name: "Olivenöl", category: "Vorrat", defaultUnit: "ml", nutritionPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100.0 } },

  // Tiefkühl
  { id: "frozen-peas", name: "Tiefkühl-Erbsen", category: "Tiefkühl", defaultUnit: "g", nutritionPer100g: { calories: 79, protein: 5.4, carbs: 12.6, fat: 0.6, fiber: 4.5 } },
  { id: "frozen-pizza", name: "Tiefkühlpizza", category: "Tiefkühl", defaultUnit: "g", nutritionPer100g: { calories: 250, protein: 10.0, carbs: 30.0, fat: 10.0 } },
  { id: "ice-cream", name: "Eis", category: "Tiefkühl", defaultUnit: "g", nutritionPer100g: { calories: 207, protein: 3.5, carbs: 24.0, fat: 11.0, sugar: 21.0 } },
];

/**
 * Schnelle, fallunabhängige Präfix/Teilstring-Suche über die lokale Datenbank.
 * exclude: bereits im Kühlschrank vorhandene Namen (case-insensitive), damit
 * keine Vorschläge für schon erfasste Lebensmittel erscheinen.
 */
export function searchFoodDatabase(query: string, exclude: string[] = [], limit = 6): FoodDbEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const excludeSet = new Set(exclude.map((n) => n.toLowerCase()));

  const startsWith: FoodDbEntry[] = [];
  const contains: FoodDbEntry[] = [];

  for (const entry of FOOD_DATABASE) {
    const name = entry.name.toLowerCase();
    if (excludeSet.has(name)) continue;
    if (name.startsWith(q)) startsWith.push(entry);
    else if (name.includes(q)) contains.push(entry);
  }

  return [...startsWith, ...contains].slice(0, limit);
}

export function findFoodByName(name: string): FoodDbEntry | undefined {
  const n = name.trim().toLowerCase();
  return FOOD_DATABASE.find((entry) => entry.name.toLowerCase() === n);
}

// Realistischer Durchschnittswert, falls ein Lebensmittel nicht in der Datenbank
// gefunden wird – grobe Schätzung über alle Kategorien hinweg.
const CATEGORY_FALLBACK_NUTRITION: Record<FoodCategory, NutritionPer100g> = {
  Gemüse: { calories: 30, protein: 1.5, carbs: 5.0, fat: 0.3, fiber: 2.0, sugar: 2.5 },
  Obst: { calories: 55, protein: 0.7, carbs: 13.0, fat: 0.3, fiber: 2.2, sugar: 10.0 },
  Fleisch: { calories: 220, protein: 24.0, carbs: 0.5, fat: 14.0 },
  Fisch: { calories: 140, protein: 21.0, carbs: 0, fat: 5.0 },
  Milchprodukte: { calories: 150, protein: 9.0, carbs: 5.0, fat: 10.0 },
  Getränke: { calories: 35, protein: 0.2, carbs: 8.0, fat: 0 },
  Tiefkühl: { calories: 180, protein: 6.0, carbs: 20.0, fat: 7.0 },
  Vorrat: { calories: 250, protein: 7.0, carbs: 45.0, fat: 3.0, fiber: 3.0 },
  Sonstiges: { calories: 150, protein: 5.0, carbs: 20.0, fat: 5.0 },
};

export function getFallbackNutrition(category: FoodCategory): NutritionPer100g {
  return CATEGORY_FALLBACK_NUTRITION[category];
}
