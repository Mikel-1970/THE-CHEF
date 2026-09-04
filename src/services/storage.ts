import type { Difficulty, HistoryEntry, ShoppingListItem } from '../domain/types';

const FAVORITES_KEY = 'chef:favorites';
const SAVED_RECIPES_KEY = 'chef:saved-recipes';
const HISTORY_KEY = 'chef:history';
const SETTINGS_KEY = 'chef:settings';
const SHOPPING_LIST_KEY = 'chef:shopping-list';

export type CookingLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type SpiceLevel = 'Nada' | 'Suave' | 'Medio' | 'Alto';
export type FontScale = 'normal' | 'large' | 'xlarge';

export type AppSettings = {
  defaultServings: number;
  compactMode: boolean;
  cookingLevel: CookingLevel;
  spiceLevel: SpiceLevel;
  fontScale: FontScale;
  defaultDifficulty?: Difficulty;
  pantryBasics: string[];
};

export const defaultSettings: AppSettings = {
  defaultServings: 4,
  compactMode: false,
  cookingLevel: 'Intermedio',
  spiceLevel: 'Medio',
  fontScale: 'large',
  pantryBasics: ['Aceite de oliva', 'Sal', 'Pimienta', 'Ajo']
};

function parse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function loadFavorites(): string[] {
  return parse<string[]>(FAVORITES_KEY, []);
}

export function saveFavorites(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function loadSavedRecipes(): string[] {
  return parse<string[]>(SAVED_RECIPES_KEY, []);
}

export function saveSavedRecipes(ids: string[]): void {
  localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(ids));
}

export function loadHistory(): HistoryEntry[] {
  return parse<HistoryEntry[]>(HISTORY_KEY, []);
}

export function saveHistory(entries: HistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 30)));
}

export function loadSettings(): AppSettings {
  const saved = parse<Partial<AppSettings>>(SETTINGS_KEY, {});
  return {
    ...defaultSettings,
    ...saved,
    pantryBasics: Array.isArray(saved.pantryBasics) ? saved.pantryBasics : defaultSettings.pantryBasics
  };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadShoppingList(): ShoppingListItem[] {
  return parse<ShoppingListItem[]>(SHOPPING_LIST_KEY, []);
}

export function saveShoppingList(items: ShoppingListItem[]): void {
  localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(items));
}
