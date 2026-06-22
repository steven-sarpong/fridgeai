// Einfache, abhängigkeitsfreie Persistenzschicht auf Basis von localStorage.
// Läuft komplett im Browser – es werden keine Nutzerdaten an einen Server gesendet
// (außer den Bildern/Texten, die bewusst zur KI-Analyse an OpenRouter geschickt werden).

import { v4 as uuidv4 } from "uuid";
import { FridgeItem, Meal } from "@/types";

const FRIDGE_KEY = "fridgeai_items";
const MEALS_KEY = "fridgeai_meals";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Kühlschrank-Items ----------

export function getFridgeItems(): FridgeItem[] {
  return readJson<FridgeItem[]>(FRIDGE_KEY, []);
}

export function saveFridgeItems(items: FridgeItem[]) {
  writeJson(FRIDGE_KEY, items);
}

export function addFridgeItem(item: Omit<FridgeItem, "id" | "addedAt">): FridgeItem {
  const newItem: FridgeItem = {
    ...item,
    id: uuidv4(),
    addedAt: new Date().toISOString(),
  };
  const items = getFridgeItems();
  items.unshift(newItem);
  saveFridgeItems(items);
  return newItem;
}

export function updateFridgeItem(id: string, updates: Partial<FridgeItem>) {
  const items = getFridgeItems().map((it) => (it.id === id ? { ...it, ...updates } : it));
  saveFridgeItems(items);
}

export function deleteFridgeItem(id: string) {
  const items = getFridgeItems().filter((it) => it.id !== id);
  saveFridgeItems(items);
}

export function getExpiringItems(withinDays = 3): FridgeItem[] {
  const now = Date.now();
  const limit = now + withinDays * 24 * 60 * 60 * 1000;
  return getFridgeItems().filter((it) => {
    if (!it.expiryDate) return false;
    const t = new Date(it.expiryDate).getTime();
    return t <= limit;
  });
}

// ---------- Mahlzeiten ----------

export function getMeals(): Meal[] {
  return readJson<Meal[]>(MEALS_KEY, []);
}

export function saveMeals(meals: Meal[]) {
  writeJson(MEALS_KEY, meals);
}

export function addMeal(meal: Omit<Meal, "id">): Meal {
  const newMeal: Meal = { ...meal, id: uuidv4() };
  const meals = getMeals();
  meals.unshift(newMeal);
  saveMeals(meals);
  return newMeal;
}

export function deleteMeal(id: string) {
  const meals = getMeals().filter((m) => m.id !== id);
  saveMeals(meals);
}

export function getTodaysMeals(): Meal[] {
  const today = new Date().toDateString();
  return getMeals().filter((m) => new Date(m.eatenAt).toDateString() === today);
}

export function getTodaysTotals() {
  const meals = getTodaysMeals();
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

// ---------- Reset (Einstellungen) ----------

export function resetAllData() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(FRIDGE_KEY);
  window.localStorage.removeItem(MEALS_KEY);
}
