import { mockRecipes } from '../data/mockRecipes';
import type { Recipe, RecipeSource } from '../domain/types';
import { validRecipes } from './recipeValidator';

const STORAGE_KEY = 'the-chef:external-recipes:v1';
const SESSION_RECIPE_KEY = 'the-chef:active-recipe:v1';
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

export function rememberActiveRecipe(recipe: Recipe): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_RECIPE_KEY, JSON.stringify(recipe));
  } catch {
    // El modo cocina seguirá intentando resolver la receta desde el catálogo persistente.
  }
}

export function getActiveRecipe(id?: string): Recipe | undefined {
  if (!id || typeof sessionStorage === 'undefined') return undefined;
  try {
    const raw = sessionStorage.getItem(SESSION_RECIPE_KEY);
    if (!raw) return undefined;
    const recipe = JSON.parse(raw) as Recipe;
    return recipe?.id === id && Array.isArray(recipe.steps) && recipe.steps.length > 0 ? recipe : undefined;
  } catch {
    return undefined;
  }
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

export function removeExternalRecipe(recipeId: string): boolean {
  if (typeof localStorage === 'undefined') return false;
  const current = loadExternalRecipes();
  const next = current.filter(recipe => recipe.id !== recipeId);
  if (next.length === current.length) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    const active = getActiveRecipe(recipeId);
    if (active && typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_RECIPE_KEY);
    return true;
  } catch {
    return false;
  }
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
