import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CookingRequest, HistoryEntry, Proposal } from './domain/types';
import { loadFavorites, loadHistory, loadSettings, saveFavorites, saveHistory, saveSettings, type AppSettings } from './services/storage';

interface AppState {
  currentRequest: CookingRequest | null;
  proposals: Proposal[];
  favorites: string[];
  history: HistoryEntry[];
  settings: AppSettings;
  setSearch: (request: CookingRequest, proposals: Proposal[]) => void;
  replaceProposals: (proposals: Proposal[]) => void;
  toggleFavorite: (recipeId: string) => void;
  updateSettings: (next: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRequest, setCurrentRequest] = useState<CookingRequest | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

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

  const value = useMemo(() => ({
    currentRequest,
    proposals,
    favorites,
    history,
    settings,
    setSearch,
    replaceProposals,
    toggleFavorite,
    updateSettings
  }), [currentRequest, proposals, favorites, history, settings]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
