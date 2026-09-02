import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CookingRequest, HistoryEntry, Proposal, ShoppingListItem } from './domain/types';
import {
  loadFavorites,
  loadHistory,
  loadSettings,
  loadShoppingList,
  saveFavorites,
  saveHistory,
  saveSettings,
  saveShoppingList,
  type AppSettings
} from './services/storage';

interface AppState {
  currentRequest: CookingRequest | null;
  proposals: Proposal[];
  favorites: string[];
  history: HistoryEntry[];
  settings: AppSettings;
  shoppingList: ShoppingListItem[];
  setSearch: (request: CookingRequest, proposals: Proposal[]) => void;
  replaceProposals: (proposals: Proposal[]) => void;
  toggleFavorite: (recipeId: string) => void;
  updateSettings: (next: Partial<AppSettings>) => void;
  upsertShoppingItem: (item: ShoppingListItem) => void;
  removeShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRequest, setCurrentRequest] = useState<CookingRequest | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
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
    const label = request.mode === 'pantry'
      ? (request.pantryIngredients ?? []).map(i => i.name).join(', ')
      : request.desireText || 'Búsqueda por preferencias';
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      label,
      mode: request.mode
    };
    const next = [entry, ...history].slice(0, 30);
    setHistory(next);
    saveHistory(next);
  };

  const replaceProposals = (nextProposals: Proposal[]) => setProposals(nextProposals);

  const toggleFavorite = (recipeId: string) => {
    const next = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [recipeId, ...favorites];
    setFavorites(next);
    saveFavorites(next);
  };

  const updateSettings = (next: Partial<AppSettings>) => {
    const merged = { ...settings, ...next };
    setSettings(merged);
    saveSettings(merged);
  };

  const upsertShoppingItem = (item: ShoppingListItem) => {
    setShoppingList(current => {
      const next = [item, ...current.filter(existing => existing.id !== item.id)];
      saveShoppingList(next);
      return next;
    });
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(current => {
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
    history,
    settings,
    shoppingList,
    setSearch,
    replaceProposals,
    toggleFavorite,
    updateSettings,
    upsertShoppingItem,
    removeShoppingItem,
    toggleShoppingItem,
    clearShoppingList
  }), [currentRequest, proposals, favorites, history, settings, shoppingList]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
