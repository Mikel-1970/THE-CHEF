import type { IngredientInput } from '../domain/types';

export const PANTRY_CATEGORIES = [
  'Básicos',
  'Especias y condimentos',
  'Pastas, arroces y cereales',
  'Legumbres',
  'Conservas',
  'Lácteos y huevos',
  'Carnes y charcutería',
  'Pescados y mariscos',
  'Verduras y hortalizas',
  'Frutas',
  'Panadería y bollería',
  'Ingredientes para postres',
  'Congelados',
  'Bebidas',
  'Otros'
] as const;

export type PantryCategory = typeof PANTRY_CATEGORIES[number];

const RULES: Array<[PantryCategory, string[]]> = [
  ['Básicos', ['sal','aceite','vinagre','harina','azucar','miel','caldo','pan rallado']],
  ['Especias y condimentos', ['pimienta','pimenton','oregano','tomillo','romero','comino','curry','canela','nuez moscada','mostaza','salsa','soja']],
  ['Pastas, arroces y cereales', ['pasta','espagueti','macarron','arroz','cuscus','quinoa','avena','fideo','noodle','cereal']],
  ['Legumbres', ['lenteja','garbanzo','alubia','judia','frijol','soja seca']],
  ['Conservas', ['conserva','lata','atun','bonito','maiz','tomate triturado','tomate frito','anchoa','aceituna']],
  ['Lácteos y huevos', ['leche','mantequilla','queso','yogur','nata','huevo','requeson','mozzarella']],
  ['Carnes y charcutería', ['pollo','pavo','cerdo','ternera','vacuno','cordero','jamon','chorizo','salchicha','bacon','carne']],
  ['Pescados y mariscos', ['pescado','merluza','bacalao','salmon','sardina','caballa','trucha','rape','gamba','langostino','marisco','calamar','pulpo','mejillon']],
  ['Verduras y hortalizas', ['patata','cebolla','ajo','tomate','pimiento','calabacin','berenjena','zanahoria','lechuga','espinaca','brocoli','coliflor','puerro','apio','pepino','verdura']],
  ['Frutas', ['manzana','pera','platano','banana','naranja','mandarina','limon','lima','fresa','frambuesa','arandano','uva','melon','sandia','mango','piña','aguacate','fruta']],
  ['Panadería y bollería', ['pan','tortilla','wrap','croissant','brioche','bollo']],
  ['Ingredientes para postres', ['chocolate','cacao','levadura','vainilla','gelatina','maicena','almendra','nuez','avellana','coco']],
  ['Congelados', ['congelado','helado']],
  ['Bebidas', ['agua','zumo','refresco','cerveza','vino','sidra','bebida']],
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

export function groupPantry(items: IngredientInput[]): Array<[PantryCategory, IngredientInput[]]> {
  const groups = new Map<PantryCategory, IngredientInput[]>();
  PANTRY_CATEGORIES.forEach(category => groups.set(category, []));
  items.forEach(item => groups.get(getPantryCategory(item))!.push(item));
  return PANTRY_CATEGORIES.map(category => [category, (groups.get(category) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'es'))] as [PantryCategory, IngredientInput[]]).filter(([, values]) => values.length > 0);
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
