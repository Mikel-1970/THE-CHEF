import type { IngredientInput, ShoppingListItem } from '../domain/types';

export const PANTRY_CATEGORIES = [
  'Básicos',
  'Aceites, vinagres y grasas',
  'Salsas, condimentos y especias',
  'Repostería y preparados especiales',
  'Pastas, arroces y cereales',
  'Legumbres',
  'Productos envasados',
  'Lácteos y huevos',
  'Carnes y charcutería',
  'Pescados y mariscos',
  'Verduras y hortalizas',
  'Frutas',
  'Panadería y masas',
  'Congelados',
  'Bebidas',
  'Otros'
] as const;

export type PantryCategory = typeof PANTRY_CATEGORIES[number];

const RULES: Array<[PantryCategory, string[]]> = [
  ['Básicos', ['sal','azucar','miel','caldo','pan rallado']],
  ['Aceites, vinagres y grasas', ['aceite','vinagre','mantequilla','margarina','manteca']],
  ['Salsas, condimentos y especias', ['pimienta','pimenton','oregano','tomillo','romero','comino','curry','canela','nuez moscada','mostaza','salsa','soja','perejil','albahaca','cilantro','almendra','nuez','avellana','pistacho','cacahuete']],
  ['Repostería y preparados especiales', ['harina','chocolate','cacao','levadura','vainilla','gelatina','maicena','coco','preparado','fondant']],
  ['Pastas, arroces y cereales', ['pasta','espagueti','macarron','arroz','cuscus','quinoa','avena','fideo','noodle','cereal']],
  ['Legumbres', ['lenteja','garbanzo','alubia','judia','frijol','soja seca']],
  ['Productos envasados', ['conserva','lata','atun','bonito','maiz','tomate triturado','tomate frito','anchoa','aceituna','bote','tarro']],
  ['Lácteos y huevos', ['leche','queso','yogur','nata','huevo','requeson','mozzarella']],
  ['Carnes y charcutería', ['pollo','pavo','cerdo','ternera','vacuno','cordero','jamon','chorizo','salchicha','bacon','carne']],
  ['Pescados y mariscos', ['pescado','merluza','bacalao','salmon','sardina','caballa','trucha','rape','gamba','langostino','marisco','calamar','pulpo','mejillon']],
  ['Verduras y hortalizas', ['patata','cebolla','ajo','tomate','pimiento','calabacin','berenjena','zanahoria','lechuga','espinaca','brocoli','coliflor','puerro','apio','pepino','verdura']],
  ['Frutas', ['manzana','pera','platano','banana','naranja','mandarina','limon','lima','fresa','frambuesa','arandano','uva','melon','sandia','mango','piña','aguacate','fruta']],
  ['Panadería y masas', ['pan','tortilla','wrap','croissant','brioche','bollo','masa','pizza']],
  ['Congelados', ['congelado','helado']],
  ['Bebidas', ['agua','zumo','refresco','cerveza','vino','sidra','bebida']]
];

export function inferPantryCategory(name: string): PantryCategory {
  const normalized = normalize(name);
  for (const [category, words] of RULES) {
    if (words.some(word => normalized.includes(normalize(word)))) return category;
  }
  return 'Otros';
}

export function getPantryCategory(item: IngredientInput): PantryCategory {
  if (item.category && PANTRY_CATEGORIES.includes(item.category as PantryCategory)) return item.category as PantryCategory;
  return inferPantryCategory(item.name);
}

export function getShoppingCategory(item: ShoppingListItem): PantryCategory {
  if (item.category && PANTRY_CATEGORIES.includes(item.category as PantryCategory)) return item.category as PantryCategory;
  return inferPantryCategory(item.name);
}

export function groupPantry(items: IngredientInput[]): Array<[PantryCategory, IngredientInput[]]> {
  return groupByCategory(items, item => getPantryCategory(item));
}

export function groupShopping(items: ShoppingListItem[]): Array<[PantryCategory, ShoppingListItem[]]> {
  return groupByCategory(items, item => getShoppingCategory(item));
}

function groupByCategory<T extends { name: string }>(items: T[], categoryOf: (item: T) => PantryCategory): Array<[PantryCategory, T[]]> {
  const groups = new Map<PantryCategory, T[]>();
  PANTRY_CATEGORIES.forEach(category => groups.set(category, []));
  items.forEach(item => groups.get(categoryOf(item))!.push(item));
  return PANTRY_CATEGORIES.map(category => [category, (groups.get(category) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'es'))] as [PantryCategory, T[]]).filter(([, values]) => values.length > 0);
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
