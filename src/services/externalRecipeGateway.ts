import type {
  CookingRequest,
  Difficulty,
  MealType,
  Recipe,
  RecipeIngredient,
  RecipeSource,
  RecipeStep
} from '../domain/types';

export type ExternalSearchFilters = {
  query?: string;
  cuisine?: string;
  style?: string;
  difficulty?: Difficulty;
  maxMinutes?: number;
};

const DEFAULT_API_URL = 'https://nrtmmepynzczfdddvohh.supabase.co/functions/v1';
const DEFAULT_PUBLIC_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydG1tZXB5bnpjemZkZGR2b2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzODI0MTEsImV4cCI6MjEwMzk1ODQxMX0.tk_MBFTR-DTFBIlX51raW5Ow-S5DgVZ58L_2yF20dWY';
const API_URL = (import.meta.env.VITE_RECIPE_API_URL || DEFAULT_API_URL).trim().replace(/\/+$/, '');
const API_KEY = (import.meta.env.VITE_RECIPE_API_KEY || DEFAULT_PUBLIC_API_KEY).trim();
const REQUEST_TIMEOUT_MS = 45_000;

export function isExternalRecipeApiConfigured(): boolean {
  return Boolean(API_URL && API_KEY);
}

export async function fetchExternalRecommendations(request: CookingRequest): Promise<Recipe[]> {
  if (!isExternalRecipeApiConfigured()) return [];
  return requestRecipes('/recipes/recommend', { request });
}

export async function fetchExternalSearch(filters: ExternalSearchFilters): Promise<Recipe[]> {
  if (!isExternalRecipeApiConfigured()) return [];
  return requestRecipes('/recipes/search', { filters });
}

async function requestRecipes(path: string, body: unknown): Promise<Recipe[]> {
  if (!isExternalRecipeApiConfigured()) return [];

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`Recipe API ${response.status}`);
    const payload: unknown = await response.json();
    const candidates = extractRecipeArray(payload);
    return candidates.map(toRecipe).filter((recipe): recipe is Recipe => Boolean(recipe));
  } finally {
    window.clearTimeout(timeout);
  }
}

function extractRecipeArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  return Array.isArray(payload.recipes) ? payload.recipes : [];
}

function toRecipe(value: unknown): Recipe | undefined {
  if (!isRecord(value)) return undefined;

  const difficulty = asDifficulty(value.difficulty);
  const mealType = asMealType(value.mealType);
  const ingredients = Array.isArray(value.ingredients)
    ? value.ingredients.map(toIngredient).filter((item): item is RecipeIngredient => Boolean(item))
    : [];
  const steps = Array.isArray(value.steps)
    ? value.steps.map(toStep).filter((item): item is RecipeStep => Boolean(item))
    : [];
  const nutrition = isRecord(value.nutritionPerServing) ? value.nutritionPerServing : undefined;

  if (
    !asNonEmptyString(value.id) ||
    !asNonEmptyString(value.title) ||
    !asNonEmptyString(value.description) ||
    !asNonEmptyString(value.emoji) ||
    !positiveNumber(value.baseServings) ||
    !nonNegativeNumber(value.prepMinutes) ||
    !nonNegativeNumber(value.cookMinutes) ||
    !difficulty ||
    !mealType ||
    !asNonEmptyString(value.style) ||
    !asNonEmptyString(value.cuisine) ||
    !ingredients.length ||
    !steps.length ||
    !nutrition ||
    !nonNegativeNumber(nutrition.kcal) ||
    !nonNegativeNumber(nutrition.proteinG) ||
    !nonNegativeNumber(nutrition.carbsG) ||
    !nonNegativeNumber(nutrition.fatG)
  ) return undefined;

  return {
    id: value.id.trim(),
    title: value.title.trim(),
    description: value.description.trim(),
    emoji: value.emoji.trim(),
    baseServings: value.baseServings,
    prepMinutes: value.prepMinutes,
    cookMinutes: value.cookMinutes,
    difficulty,
    mealType,
    style: value.style.trim(),
    cuisine: value.cuisine.trim(),
    ingredients,
    miseEnPlace: stringArray(value.miseEnPlace),
    steps,
    criticalPoints: stringArray(value.criticalPoints),
    substitutions: stringArray(value.substitutions),
    storage: typeof value.storage === 'string' ? value.storage.trim() : '',
    nutritionPerServing: {
      kcal: nutrition.kcal,
      proteinG: nutrition.proteinG,
      carbsG: nutrition.carbsG,
      fatG: nutrition.fatG
    },
    source: toSource(value.source)
  };
}

function toIngredient(value: unknown): RecipeIngredient | undefined {
  if (!isRecord(value)) return undefined;
  const scalingMode = value.scalingMode;
  if (
    !asNonEmptyString(value.name) ||
    !positiveNumber(value.quantity) ||
    !asNonEmptyString(value.unit) ||
    !['linear', 'discrete', 'culinary', 'fixed'].includes(String(scalingMode))
  ) return undefined;

  return {
    name: value.name.trim(),
    quantity: value.quantity,
    unit: value.unit.trim(),
    section: typeof value.section === 'string' ? value.section.trim() : undefined,
    scalingMode: scalingMode as RecipeIngredient['scalingMode'],
    optional: typeof value.optional === 'boolean' ? value.optional : undefined
  };
}

function toStep(value: unknown): RecipeStep | undefined {
  if (!isRecord(value) || !positiveNumber(value.number) || !asNonEmptyString(value.instruction)) return undefined;
  return {
    number: value.number,
    instruction: value.instruction.trim(),
    minutes: positiveNumber(value.minutes) ? value.minutes : undefined,
    temperatureC: nonNegativeNumber(value.temperatureC) ? value.temperatureC : undefined,
    cue: typeof value.cue === 'string' ? value.cue.trim() : undefined
  };
}

function toSource(value: unknown): RecipeSource {
  if (isRecord(value)) {
    const kind = value.kind === 'web' ? 'web' : 'ai';
    const label = typeof value.label === 'string' && value.label.trim()
      ? value.label.trim()
      : kind === 'web' ? 'Fuente web' : 'Motor externo The Chef';
    return {
      kind,
      label,
      url: typeof value.url === 'string' ? value.url : undefined,
      publisher: typeof value.publisher === 'string' ? value.publisher : undefined,
      retrievedAt: typeof value.retrievedAt === 'string' ? value.retrievedAt : new Date().toISOString(),
      adapted: typeof value.adapted === 'boolean' ? value.adapted : true
    };
  }

  return {
    kind: 'ai',
    label: 'Motor externo The Chef',
    retrievedAt: new Date().toISOString(),
    adapted: true
  };
}

function asDifficulty(value: unknown): Difficulty | undefined {
  return value === 'Fácil' || value === 'Media' || value === 'Avanzada' ? value : undefined;
}

function asMealType(value: unknown): MealType | undefined {
  return value === 'Desayuno' || value === 'Brunch' || value === 'Comida' || value === 'Merienda' || value === 'Cena'
    ? value
    : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string').map(item => item.trim()).filter(Boolean) : [];
}

function asNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value.trim());
}

function positiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function nonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
