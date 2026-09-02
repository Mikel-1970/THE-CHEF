import type { RecipeIngredient } from '../domain/types';

export function scaleQuantity(ingredient: RecipeIngredient, baseServings: number, servings: number): number {
  const ratio = servings / baseServings;
  if (ingredient.scalingMode === 'fixed') return ingredient.quantity;
  if (ingredient.scalingMode === 'discrete') return Math.max(1, Math.round(ingredient.quantity * ratio));
  if (ingredient.scalingMode === 'culinary') {
    const adjusted = ingredient.quantity * Math.pow(ratio, 0.75);
    return roundPractical(adjusted);
  }
  return roundPractical(ingredient.quantity * ratio);
}

function roundPractical(value: number): number {
  if (value >= 100) return Math.round(value / 5) * 5;
  if (value >= 10) return Math.round(value);
  if (value >= 1) return Math.round(value * 2) / 2;
  return Math.round(value * 10) / 10;
}

export function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toLocaleString('es-ES', { maximumFractionDigits: 1 });
}
