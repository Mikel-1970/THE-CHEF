import type { Recipe } from '../domain/types';
import { formatQuantity, scaleQuantity } from './scaling';

/**
 * Ajusta únicamente cantidades explícitas que coinciden con ingredientes de la receta.
 * No toca tiempos, temperaturas, tamaños de corte ni cifras que no estén ligadas a un ingrediente.
 */
export function scaleStepInstruction(recipe: Recipe, instruction: string, servings: number): string {
  if (!instruction || servings === recipe.baseServings) return instruction;
  let result = instruction;

  for (const ingredient of recipe.ingredients) {
    const base = ingredient.quantity;
    const scaled = scaleQuantity(ingredient, recipe.baseServings, servings);
    if (!Number.isFinite(base) || !Number.isFinite(scaled) || scaled === base) continue;

    const basePattern = numberPattern(base);
    const unitPattern = unitRegex(ingredient.unit);
    const ingredientPattern = escapeRegExp(ingredient.name);

    if (unitPattern) {
      const re = new RegExp(`(^|[^\\d.,])(${basePattern})\\s*(${unitPattern})(?![\\p{L}\\d])`, 'giu');
      result = result.replace(re, (match, prefix, _number, unit, offset) => {
        const local = normalize(result.slice(Math.max(0, Number(offset) - 90), Math.min(result.length, Number(offset) + 120)));
        if (!ingredientMentioned(ingredient.name, local)) return match;
        return `${prefix}${formatQuantity(scaled)} ${unit}`;
      });
    }

    if (isCountUnit(ingredient.unit)) {
      const re = new RegExp(`(^|[^\\d.,])(${basePattern})\\s+(?:uds?\\.?|unidades?\\s+de\\s+)?(${ingredientPattern})(?![\\p{L}\\d])`, 'giu');
      result = result.replace(re, (_match, prefix, _number, name) => `${prefix}${formatQuantity(scaled)} ${name}`);
    }
  }

  return result;
}

function numberPattern(value: number): string {
  const raw = String(value);
  if (!raw.includes('.')) return escapeRegExp(raw);
  const [integer, decimals] = raw.split('.');
  return `${escapeRegExp(integer)}[.,]${escapeRegExp(decimals)}`;
}

function unitRegex(unit: string): string | undefined {
  switch (normalize(unit)) {
    case 'g': return 'g|gr\\.?|gramos?';
    case 'kg': return 'kg|kilos?|kilogramos?';
    case 'ml': return 'ml|mililitros?';
    case 'cl': return 'cl|centilitros?';
    case 'l': return 'l|litros?';
    case 'ud':
    case 'uds':
    case 'u':
    case 'unidad':
    case 'unidades': return 'uds?\\.?|u\\.?|unidades?';
    default: return undefined;
  }
}

function isCountUnit(unit: string): boolean {
  return ['ud','uds','u','unidad','unidades'].includes(normalize(unit));
}

function ingredientMentioned(name: string, text: string): boolean {
  const normalizedName = normalize(name);
  if (text.includes(normalizedName)) return true;
  const significant = normalizedName.split(/\\s+/).filter(token => token.length >= 5);
  return significant.some(token => text.includes(token));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').trim();
}
