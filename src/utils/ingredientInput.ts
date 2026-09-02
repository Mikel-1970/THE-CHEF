import type { IngredientInput } from '../domain/types';

const UNIT_PATTERN = '(kg|g|gr|gramos?|l|ml|cl|ud|uds|u|unidad|unidades)';

export function parseIngredientInput(value: string): IngredientInput {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) return { name: '' };

  const quantityFirst = clean.match(new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*${UNIT_PATTERN}?\\s+(?:de\\s+)?(.+)$`, 'i'));
  if (quantityFirst) {
    const quantity = parseNumber(quantityFirst[1]);
    const rawUnit = quantityFirst[2];
    const name = cleanName(quantityFirst[3]);
    const unit = normalizeUnit(rawUnit) ?? inferCountUnit(name);
    return normalizeQuantity({ name, quantity, unit });
  }

  const quantityLast = clean.match(new RegExp(`^(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s*${UNIT_PATTERN}$`, 'i'));
  if (quantityLast) {
    const name = cleanName(quantityLast[1]);
    return normalizeQuantity({
      name,
      quantity: parseNumber(quantityLast[2]),
      unit: normalizeUnit(quantityLast[3])
    });
  }

  const countLast = clean.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)$/i);
  if (countLast) {
    const name = cleanName(countLast[1]);
    const unit = inferCountUnit(name);
    if (unit) {
      return { name, quantity: parseNumber(countLast[2]), unit };
    }
  }

  return { name: cleanName(clean) };
}

function parseNumber(value: string): number {
  return Number(value.replace(',', '.'));
}

function cleanName(value: string): string {
  const clean = value.replace(/^de\s+/i, '').trim();
  return clean ? clean.charAt(0).toLocaleUpperCase('es') + clean.slice(1) : clean;
}

function normalizeUnit(unit?: string): string | undefined {
  if (!unit) return undefined;
  const normalized = unit.toLocaleLowerCase('es');
  if (['g', 'gr', 'gramo', 'gramos'].includes(normalized)) return 'g';
  if (normalized === 'kg') return 'kg';
  if (normalized === 'ml') return 'ml';
  if (normalized === 'cl') return 'cl';
  if (normalized === 'l') return 'l';
  if (['ud', 'uds', 'u', 'unidad', 'unidades'].includes(normalized)) return 'ud';
  return unit;
}

function normalizeQuantity(input: IngredientInput): IngredientInput {
  if (input.quantity === undefined || !input.unit) return input;
  if (input.unit === 'kg') return { ...input, quantity: input.quantity * 1000, unit: 'g' };
  if (input.unit === 'l') return { ...input, quantity: input.quantity * 1000, unit: 'ml' };
  if (input.unit === 'cl') return { ...input, quantity: input.quantity * 10, unit: 'ml' };
  return input;
}

function inferCountUnit(name: string): string | undefined {
  const normalized = name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const countable = [
    'huevo', 'huevos', 'limon', 'limones', 'lima', 'limas', 'cebolla', 'cebollas',
    'ajo', 'ajos', 'patata', 'patatas', 'tomate', 'tomates', 'pimiento', 'pimientos',
    'calabacin', 'calabacines', 'berenjena', 'berenjenas', 'aguacate', 'aguacates'
  ];
  return countable.some(item => normalized === item) ? 'ud' : undefined;
}
