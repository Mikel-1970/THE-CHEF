import { mockRecipes } from '../data/mockRecipes';
import type { Recipe, RecipeSource } from '../domain/types';
import { validRecipes } from './recipeValidator';

const STORAGE_KEY = 'the-chef:external-recipes:v1';
const MAX_EXTERNAL_RECIPES = 80;
const localSource: RecipeSource = {
  kind: 'local',
  label: 'Catálogo El Chef'
};

const localRecipes = validRecipes(mockRecipes).map(recipe => ({
  ...recipe,
  source: recipe.source ?? localSource
}));

export function getAllRecipes(): Recipe[] {
  const merged = new Map<string, Recipe>();
  localRecipes.forEach(recipe => merged.set(recipe.id, recipe));
  loadExternalRecipes().forEach(recipe => merged.set(recipe.id, recipe));
  return [...merged.values()];
}

export function getRecipeById(id?: string): Recipe | undefined {
  if (!id) return undefined;
  return getAllRecipes().find(recipe => recipe.id === id);
}

export function registerExternalRecipes(recipes: Recipe[]): Recipe[] {
  const accepted = validRecipes(recipes)
    .filter(recipe => recipe.source?.kind === 'web' || recipe.source?.kind === 'ai')
    .map(recipe => ({
      ...recipe,
      source: normalizeExternalSource(recipe.source)
    }));

  if (!accepted.length || typeof localStorage === 'undefined') return accepted;

  const current = loadExternalRecipes();
  const merged = new Map<string, Recipe>();
  accepted.forEach(recipe => merged.set(recipe.id, recipe));
  current.forEach(recipe => {
    if (!merged.has(recipe.id)) merged.set(recipe.id, recipe);
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...merged.values()].slice(0, MAX_EXTERNAL_RECIPES)));
  } catch {
    // Si el almacenamiento está lleno o bloqueado, la sesión sigue funcionando con el catálogo local.
  }

  return accepted;
}

export function externalRecipeCount(): number {
  return loadExternalRecipes().length;
}

function loadExternalRecipes(): Recipe[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return validRecipes(parsed as Recipe[])
      .filter(recipe => recipe.source?.kind === 'web' || recipe.source?.kind === 'ai')
      .slice(0, MAX_EXTERNAL_RECIPES);
  } catch {
    return [];
  }
}

function normalizeExternalSource(source: RecipeSource | undefined): RecipeSource {
  if (!source || (source.kind !== 'web' && source.kind !== 'ai')) {
    return {
      kind: 'ai',
      label: 'Motor externo The Chef',
      retrievedAt: new Date().toISOString(),
      adapted: true
    };
  }

  return {
    ...source,
    label: source.label.trim() || (source.kind === 'web' ? 'Fuente web' : 'Motor externo The Chef'),
    retrievedAt: source.retrievedAt ?? new Date().toISOString()
  };
}
