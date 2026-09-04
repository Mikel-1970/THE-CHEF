import { mockRecipes } from '../data/mockRecipes';
import type { Difficulty, MealType, Recipe, RecipeIngredient, RecipeSource, RecipeStep } from '../domain/types';
import { validRecipes } from './recipeValidator';

const STORAGE_KEY = 'the-chef:external-recipes:v1';
const LIBRARY_RECIPES_KEY = 'the-chef:library-recipe-snapshots:v1';
const SESSION_RECIPE_KEY = 'the-chef:active-recipe:v1';
const MAX_EXTERNAL_RECIPES = 80;
const MAX_LIBRARY_RECIPES = 100;
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
  loadLibraryRecipes().forEach(recipe => merged.set(recipe.id, recipe));
  return [...merged.values()];
}

export function getRecipeById(id?: string): Recipe | undefined {
  if (!id) return undefined;
  return getAllRecipes().find(recipe => recipe.id === id) ?? getActiveRecipe(id);
}

export function rememberActiveRecipe(recipe: Recipe): void {
  const normalized = normalizeStoredRecipe(recipe);
  if (!normalized || typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_RECIPE_KEY, JSON.stringify(normalized));
  } catch {
    // El modo cocina seguirá intentando resolver la receta desde el catálogo persistente.
  }
}

export function rememberLibraryRecipe(recipe: Recipe): void {
  const normalized = normalizeStoredRecipe(recipe);
  if (!normalized || !validRecipes([normalized]).length || typeof localStorage === 'undefined') return;

  const current = loadLibraryRecipes();
  const merged = new Map<string, Recipe>();
  merged.set(normalized.id, normalized);
  current.forEach(item => {
    if (!merged.has(item.id)) merged.set(item.id, item);
  });

  try {
    localStorage.setItem(LIBRARY_RECIPES_KEY, JSON.stringify([...merged.values()].slice(0, MAX_LIBRARY_RECIPES)));
  } catch {
    // Esta copia es de recuperación; no debe bloquear el uso normal de la receta.
  }
}

export function getActiveRecipe(id?: string): Recipe | undefined {
  if (!id || typeof sessionStorage === 'undefined') return undefined;
  try {
    const raw = sessionStorage.getItem(SESSION_RECIPE_KEY);
    if (!raw) return undefined;
    const normalized = normalizeStoredRecipe(JSON.parse(raw));
    return normalized?.id === id && normalized.steps.length > 0 ? normalized : undefined;
  } catch {
    return undefined;
  }
}

export function registerExternalRecipes(recipes: Recipe[]): Recipe[] {
  const normalized = (Array.isArray(recipes) ? recipes : [])
    .map(recipe => normalizeStoredRecipe(recipe))
    .filter((recipe): recipe is Recipe => Boolean(recipe));

  const accepted = validRecipes(normalized)
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

  accepted.forEach(rememberLibraryRecipe);
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
  return loadStoredRecipeArray(STORAGE_KEY, MAX_EXTERNAL_RECIPES)
    .filter(recipe => recipe.source?.kind === 'web' || recipe.source?.kind === 'ai');
}

function loadLibraryRecipes(): Recipe[] {
  return loadStoredRecipeArray(LIBRARY_RECIPES_KEY, MAX_LIBRARY_RECIPES);
}

function loadStoredRecipeArray(key: string, limit: number): Recipe[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map(item => normalizeStoredRecipe(item))
      .filter((recipe): recipe is Recipe => Boolean(recipe));

    return validRecipes(normalized).slice(0, limit);
  } catch {
    return [];
  }
}

function normalizeStoredRecipe(value: unknown): Recipe | undefined {
  if (!isRecord(value)) return undefined;
  const id = text(value.id);
  const title = text(value.title);
  if (!id || !title) return undefined;

  const ingredients = normalizeIngredients(value.ingredients);
  const steps = normalizeSteps(value.steps);
  if (!ingredients.length || !steps.length) return undefined;

  const nutrition = normalizeNutrition(value.nutritionPerServing);
  if (!nutrition) return undefined;

  const baseServings = positiveNumber(value.baseServings);
  const prepMinutes = nonNegativeNumber(value.prepMinutes);
  const cookMinutes = nonNegativeNumber(value.cookMinutes);
  const difficulty = asDifficulty(value.difficulty);
  if (baseServings === undefined || prepMinutes === undefined || cookMinutes === undefined || !difficulty) return undefined;

  return {
    id,
    title,
    description: text(value.description) ?? '',
    emoji: text(value.emoji) ?? '🍽️',
    baseServings,
    prepMinutes,
    cookMinutes,
    difficulty,
    mealType: asMealType(value.mealType) ?? 'Comida',
    style: text(value.style) ?? 'Sin especificar',
    cuisine: text(value.cuisine) ?? 'Sin especificar',
    ingredients,
    miseEnPlace: strings(value.miseEnPlace),
    steps,
    criticalPoints: strings(value.criticalPoints),
    substitutions: strings(value.substitutions),
    storage: text(value.storage) ?? '',
    nutritionPerServing: nutrition,
    source: normalizeStoredSource(value.source)
  };
}

function normalizeIngredients(value: unknown): RecipeIngredient[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!isRecord(item)) return [];
    const name = text(item.name);
    const quantity = positiveNumber(item.quantity);
    const unit = text(item.unit);
    if (!name || quantity === undefined || !unit) return [];
    const scalingMode = item.scalingMode === 'discrete' || item.scalingMode === 'culinary' || item.scalingMode === 'fixed'
      ? item.scalingMode
      : 'linear';
    return [{
      name,
      quantity,
      unit,
      section: text(item.section),
      scalingMode,
      optional: typeof item.optional === 'boolean' ? item.optional : undefined
    }];
  });
}

function normalizeSteps(value: unknown): RecipeStep[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const instruction = text(item.instruction);
    if (!instruction) return [];
    const minutes = positiveNumber(item.minutes);
    const temperatureC = typeof item.temperatureC === 'number' && Number.isFinite(item.temperatureC) && item.temperatureC >= 0 && item.temperatureC <= 350
      ? item.temperatureC
      : undefined;
    return [{
      number: index + 1,
      instruction,
      minutes,
      temperatureC,
      cue: text(item.cue)
    }];
  });
}

function normalizeNutrition(value: unknown): Recipe['nutritionPerServing'] | undefined {
  if (!isRecord(value)) return undefined;
  const kcal = nonNegativeNumber(value.kcal);
  const proteinG = nonNegativeNumber(value.proteinG);
  const carbsG = nonNegativeNumber(value.carbsG);
  const fatG = nonNegativeNumber(value.fatG);
  if (kcal === undefined || proteinG === undefined || carbsG === undefined || fatG === undefined) return undefined;
  return { kcal, proteinG, carbsG, fatG };
}

function normalizeStoredSource(value: unknown): RecipeSource {
  if (!isRecord(value)) return { kind: 'ai', label: 'Receta recuperada de El Chef', adapted: true };
  const kind = value.kind === 'local' || value.kind === 'web' || value.kind === 'ai' || value.kind === 'user' ? value.kind : 'ai';
  return {
    kind,
    label: text(value.label) ?? (kind === 'local' ? 'Catálogo El Chef' : 'Receta recuperada de El Chef'),
    url: text(value.url),
    publisher: text(value.publisher),
    retrievedAt: text(value.retrievedAt),
    adapted: typeof value.adapted === 'boolean' ? value.adapted : undefined
  };
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

function asDifficulty(value: unknown): Difficulty | undefined {
  return value === 'Fácil' || value === 'Media' || value === 'Avanzada' ? value : undefined;
}

function asMealType(value: unknown): MealType | undefined {
  return value === 'Desayuno' || value === 'Brunch' || value === 'Comida' || value === 'Merienda' || value === 'Cena' ? value : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter((item): item is string => Boolean(item)) : [];
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function positiveNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined;
}

function nonNegativeNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
