import type { IngredientInput } from '../domain/types';

const UNIT_PATTERN = '(kg|kilos?|kilogramos?|g|gr|gramos?|l|litros?|ml|mililitros?|cl|centilitros?|ud|uds|u|unidad|unidades|paquete|paquetes|bote|botes|lata|latas|manojo|manojos)';
const WORD_NUMBERS: Record<string, number> = { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };

export function parseIngredientInput(value: string): IngredientInput {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) return { name: '' };

  const normalizedWords = replaceLeadingWordNumber(clean);

  const quantityFirst = normalizedWords.match(new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*${UNIT_PATTERN}?\\s+(?:de\\s+)?(.+)$`, 'i'));
  if (quantityFirst) {
    const quantity = parseNumber(quantityFirst[1]);
    const rawUnit = quantityFirst[2];
    const name = cleanName(quantityFirst[3]);
    const unit = normalizeUnit(rawUnit) ?? inferCountUnit(name) ?? 'ud';
    return normalizeQuantity({ name, quantity, unit });
  }

  const quantityLast = normalizedWords.match(new RegExp(`^(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s*${UNIT_PATTERN}$`, 'i'));
  if (quantityLast) {
    const name = cleanName(quantityLast[1]);
    return normalizeQuantity({ name, quantity: parseNumber(quantityLast[2]), unit: normalizeUnit(quantityLast[3]) });
  }

  const countLast = normalizedWords.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)$/i);
  if (countLast) {
    const name = cleanName(countLast[1]);
    return { name, quantity: parseNumber(countLast[2]), unit: inferCountUnit(name) ?? 'ud' };
  }

  return { name: cleanName(clean) };
}

function replaceLeadingWordNumber(value: string): string {
  const match = value.match(/^([\p{L}áéíóúüñ]+)\b\s*(.*)$/iu);
  if (!match) return value;
  const quantity = WORD_NUMBERS[match[1].toLocaleLowerCase('es')];
  return quantity ? `${quantity} ${match[2]}`.trim() : value;
}

function parseNumber(value: string): number { return Number(value.replace(',', '.')); }

function cleanName(value: string): string {
  const clean = value.replace(/^de\s+/i, '').trim();
  return clean ? clean.charAt(0).toLocaleUpperCase('es') + clean.slice(1) : clean;
}

function normalizeUnit(unit?: string): string | undefined {
  if (!unit) return undefined;
  const normalized = unit.toLocaleLowerCase('es');
  if (['g', 'gr', 'gramo', 'gramos'].includes(normalized)) return 'g';
  if (['kg', 'kilo', 'kilos', 'kilogramo', 'kilogramos'].includes(normalized)) return 'kg';
  if (['ml', 'mililitro', 'mililitros'].includes(normalized)) return 'ml';
  if (['cl', 'centilitro', 'centilitros'].includes(normalized)) return 'cl';
  if (['l', 'litro', 'litros'].includes(normalized)) return 'l';
  if (['ud', 'uds', 'u', 'unidad', 'unidades'].includes(normalized)) return 'ud';
  if (['paquete', 'paquetes'].includes(normalized)) return 'paquete';
  if (['bote', 'botes'].includes(normalized)) return 'bote';
  if (['lata', 'latas'].includes(normalized)) return 'lata';
  if (['manojo', 'manojos'].includes(normalized)) return 'manojo';
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
  const countable = ['huevo','huevos','limon','limones','lima','limas','cebolla','cebollas','ajo','ajos','patata','patatas','tomate','tomates','pimiento','pimientos','calabacin','calabacines','berenjena','berenjenas','aguacate','aguacates','pechuga','pechugas','muslo','muslos','zanca','zancas'];
  return countable.some(item => normalized === item || normalized.startsWith(`${item} `)) ? 'ud' : undefined;
}
