import type { CookingRequest, IngredientInput, Recipe, RecipeIngredient } from '../domain/types';
import { formatQuantity, scaleQuantity } from '../utils/scaling';
import { findAvailableSubstitute } from './substitutions';

export type PantryIngredientStatus = 'available' | 'substituted' | 'insufficient' | 'missing';

export type PantryIngredientEvaluation = {
  ingredient: RecipeIngredient;
  status: PantryIngredientStatus;
  requiredQuantity: number;
  pantryItem?: IngredientInput;
  substitute?: string;
  shortage?: number;
};

export function evaluateRecipePantry(recipe: Recipe, request: CookingRequest): PantryIngredientEvaluation[] {
  const pantryItems: IngredientInput[] = [
    ...(request.pantryIngredients ?? []),
    ...(request.pantryBasics ?? []).map(name => ({ name }))
  ];
  const pantryNames = pantryItems.map(item => item.name);

  return recipe.ingredients.map(ingredient => {
    const requiredQuantity = scaleQuantity(ingredient, recipe.baseServings, request.servings);
    const pantryItem = pantryItems.find(item => ingredientMatch(ingredient.name, item.name));

    if (pantryItem) {
      const shortage = getShortage(pantryItem, ingredient, requiredQuantity);
      if (shortage !== undefined && shortage > 0) {
        return { ingredient, status: 'insufficient' as const, requiredQuantity, pantryItem, shortage };
      }
      return { ingredient, status: 'available' as const, requiredQuantity, pantryItem };
    }

    const substitute = findAvailableSubstitute(ingredient.name, pantryNames);
    if (substitute) {
      return { ingredient, status: 'substituted' as const, requiredQuantity, substitute };
    }

    return { ingredient, status: 'missing' as const, requiredQuantity };
  });
}

export function formatInsufficientIngredient(entry: PantryIngredientEvaluation): string {
  const available = entry.pantryItem?.quantity;
  const unit = entry.ingredient.unit;
  if (available === undefined || entry.shortage === undefined) return entry.ingredient.name;
  return `${entry.ingredient.name}: tienes ${formatQuantity(available)} ${entry.pantryItem?.unit ?? unit}; necesitas ${formatQuantity(entry.requiredQuantity)} ${unit}; faltan ${formatQuantity(entry.shortage)} ${unit}`;
}

export function ingredientMatch(a: string, b: string): boolean {
  const x = normalize(a);
  const y = normalize(b);
  return x.includes(y) || y.includes(x);
}

function getShortage(pantryItem: IngredientInput, ingredient: RecipeIngredient, requiredQuantity: number): number | undefined {
  if (pantryItem.quantity === undefined || !pantryItem.unit) return undefined;
  const available = comparableQuantity(pantryItem.quantity, pantryItem.unit);
  const required = comparableQuantity(requiredQuantity, ingredient.unit);
  if (!available || !required || available.kind !== required.kind) return undefined;
  if (available.value >= required.value) return 0;

  const shortageBase = required.value - available.value;
  return fromBaseQuantity(shortageBase, ingredient.unit);
}

function comparableQuantity(quantity: number, unit: string): { kind: 'mass' | 'volume' | 'count'; value: number } | undefined {
  const normalizedUnit = normalize(unit);
  if (['g', 'gr', 'gramo', 'gramos'].includes(normalizedUnit)) return { kind: 'mass', value: quantity };
  if (normalizedUnit === 'kg') return { kind: 'mass', value: quantity * 1000 };
  if (normalizedUnit === 'ml') return { kind: 'volume', value: quantity };
  if (normalizedUnit === 'cl') return { kind: 'volume', value: quantity * 10 };
  if (normalizedUnit === 'l') return { kind: 'volume', value: quantity * 1000 };
  if (['ud', 'uds', 'u', 'unidad', 'unidades'].includes(normalizedUnit)) return { kind: 'count', value: quantity };
  return undefined;
}

function fromBaseQuantity(quantity: number, unit: string): number {
  const normalizedUnit = normalize(unit);
  if (normalizedUnit === 'kg') return quantity / 1000;
  if (normalizedUnit === 'l') return quantity / 1000;
  if (normalizedUnit === 'cl') return quantity / 10;
  return quantity;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
