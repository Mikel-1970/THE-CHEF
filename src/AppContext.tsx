import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CookingRequest, HistoryEntry, Proposal, ShoppingListItem } from './domain/types';
import {
  loadActiveSearch,
  loadFavorites,
  loadHistory,
  loadSavedRecipes,
  loadSettings,
  loadShoppingList,
  saveActiveSearch,
  saveFavorites,
  saveHistory,
  saveSavedRecipes,
  saveSettings,
  saveShoppingList,
  type AppSettings
} from './services/storage';

interface AppState {
  currentRequest: CookingRequest | null;
  proposals: Proposal[];
  favorites: string[];
  savedRecipes: string[];
  history: HistoryEntry[];
  settings: AppSettings;
  shoppingList: ShoppingListItem[];
  setSearch: (request: CookingRequest, proposals: Proposal[]) => void;
  replaceProposals: (proposals: Proposal[]) => void;
  toggleFavorite: (recipeId: string) => void;
  toggleSavedRecipe: (recipeId: string) => void;
  recordRecipeView: (recipeId: string, recipeTitle: string) => void;
  removeHistoryEntry: (entryId: string) => void;
  removeRecipeFromLibrary: (recipeId: string) => void;
  updateSettings: (next: Partial<AppSettings>) => void;
  upsertShoppingItem: (item: ShoppingListItem) => void;
  removeShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialSearch = useMemo(() => loadActiveSearch(), []);
  const [currentRequest, setCurrentRequest] = useState<CookingRequest | null>(initialSearch.request);
  const [proposals, setProposals] = useState<Proposal[]>(initialSearch.proposals);
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [savedRecipes, setSavedRecipes] = useState<string[]>(() => loadSavedRecipes());
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => loadShoppingList());

  useEffect(() => {
    const fontSizes: Record<AppSettings['fontScale'], string> = {
      normal: '16px',
      large: '18px',
      xlarge: '20px'
    };
    document.documentElement.style.fontSize = fontSizes[settings.fontScale];
  }, [settings.fontScale]);

  const setSearch = (request: CookingRequest, nextProposals: Proposal[]) => {
    setCurrentRequest(request);
    setProposals(nextProposals);
    saveActiveSearch(request, nextProposals);
    const label = request.mode === 'pantry'
      ? (request.pantryIngredients ?? []).map(i => i.name).join(', ')
      : request.desireText || 'Búsqueda por preferencias';
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      label,
      kind: 'search',
      mode: request.mode,
      request
    };
    setHistory(current => {
      const next = [entry, ...current].slice(0, 30);
      saveHistory(next);
      return next;
    });
  };

  const replaceProposals = (nextProposals: Proposal[]) => {
    setProposals(nextProposals);
    saveActiveSearch(currentRequest, nextProposals);
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(current => {
      const next = current.includes(recipeId)
        ? current.filter(id => id !== recipeId)
        : [recipeId, ...current];
      saveFavorites(next);
      return next;
    });
  };

  const toggleSavedRecipe = (recipeId: string) => {
    setSavedRecipes(current => {
      const next = current.includes(recipeId)
        ? current.filter(id => id !== recipeId)
        : [recipeId, ...current];
      saveSavedRecipes(next);
      return next;
    });
  };

  const recordRecipeView = (recipeId: string, recipeTitle: string) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      label: recipeTitle,
      kind: 'recipe',
      recipeId,
      mode: currentRequest?.mode
    };
    setHistory(current => {
      const next = [
        entry,
        ...current.filter(item => !(item.kind === 'recipe' && item.recipeId === recipeId))
      ].slice(0, 30);
      saveHistory(next);
      return next;
    });
  };

  const removeHistoryEntry = (entryId: string) => {
    setHistory(current => {
      const next = current.filter(item => item.id !== entryId);
      saveHistory(next);
      return next;
    });
  };

  const removeRecipeFromLibrary = (recipeId: string) => {
    setSavedRecipes(current => {
      const next = current.filter(id => id !== recipeId);
      saveSavedRecipes(next);
      return next;
    });
    setFavorites(current => {
      const next = current.filter(id => id !== recipeId);
      saveFavorites(next);
      return next;
    });
  };

  const updateSettings = (next: Partial<AppSettings>) => {
    const merged = { ...settings, ...next };
    setSettings(merged);
    saveSettings(merged);
  };

  const upsertShoppingItem = (item: ShoppingListItem) => {
    setShoppingList(current => {
      const index = current.findIndex(entry => entry.id === item.id);
      if (index >= 0) {
        const existing = current[index];
        if (existing.name === item.name && existing.quantity === item.quantity && existing.unit === item.unit && existing.recipeId === item.recipeId && existing.recipeTitle === item.recipeTitle && existing.checked === item.checked) {
          return current;
        }
        const next = [...current];
        next[index] = item;
        saveShoppingList(next);
        return next;
      }
      const next = [item, ...current];
      saveShoppingList(next);
      return next;
    });
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(current => {
      if (!current.some(item => item.id === id)) return current;
      const next = current.filter(item => item.id !== id);
      saveShoppingList(next);
      return next;
    });
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(current => {
      const next = current.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      saveShoppingList(next);
      return next;
    });
  };

  const clearShoppingList = () => {
    setShoppingList([]);
    saveShoppingList([]);
  };

  const value = useMemo(() => ({
    currentRequest,
    proposals,
    favorites,
    savedRecipes,
    history,
    settings,
    shoppingList,
    setSearch,
    replaceProposals,
    toggleFavorite,
    toggleSavedRecipe,
    recordRecipeView,
    removeHistoryEntry,
    removeRecipeFromLibrary,
    updateSettings,
    upsertShoppingItem,
    removeShoppingItem,
    toggleShoppingItem,
    clearShoppingList
  }), [currentRequest, proposals, favorites, savedRecipes, history, settings, shoppingList]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
