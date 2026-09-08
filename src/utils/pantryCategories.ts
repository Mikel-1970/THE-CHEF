import type { IngredientInput, ShoppingListItem } from '../domain/types';

export const PANTRY_CATEGORIES = [
  'Básicos de cocina',
  'Aceites, vinagres y grasas',
  'Salsas y condimentos',
  'Repostería, harinas y preparados especiales',
  'Pastas, arroz y cereales',
  'Legumbres',
  'Productos envasados',
  'Carne y embutidos',
  'Pescado y marisco',
  'Verduras, hortalizas, tubérculos y frutas',
  'Huevos y lácteos',
  'Pan y masas',
  'Caldos, bases y bebidas para cocinar',
  'Productos internacionales',
  'Otros'
] as const;

export type PantryCategory = typeof PANTRY_CATEGORIES[number];

const RULES: Array<[PantryCategory, string[]]> = [
  ['Básicos de cocina', ['sal','azucar','miel','pan rallado','bicarbonato']],
  ['Aceites, vinagres y grasas', ['aceite','vinagre','mantequilla','margarina','manteca','grasa']],
  ['Salsas y condimentos', ['pimienta','pimenton','oregano','tomillo','romero','comino','curry','canela','nuez moscada','mostaza','salsa','soja','perejil','albahaca','cilantro','almendra','nuez','avellana','pistacho','cacahuete','anacardo','semilla']],
  ['Repostería, harinas y preparados especiales', ['harina','chocolate','cacao','levadura','vainilla','gelatina','maicena','coco','preparado','fondant','azucar glas']],
  ['Pastas, arroz y cereales', ['pasta','espagueti','macarron','arroz','cuscus','quinoa','avena','fideo','noodle','cereal','bulgur']],
  ['Legumbres', ['lenteja','garbanzo','alubia','judia','frijol','soja seca']],
  ['Productos envasados', ['conserva','lata','atun','bonito','maiz','tomate triturado','tomate frito','anchoa','aceituna','encurtido','bote','tarro','frasco']],
  ['Carne y embutidos', ['pollo','pavo','cerdo','ternera','vacuno','cordero','jamon','chorizo','salchicha','bacon','carne','embutido']],
  ['Pescado y marisco', ['pescado','merluza','bacalao','salmon','sardina','caballa','trucha','rape','gamba','langostino','marisco','calamar','pulpo','mejillon','centollo','cangrejo']],
  ['Verduras, hortalizas, tubérculos y frutas', ['patata','batata','boniato','cebolla','ajo','tomate','pimiento','calabacin','berenjena','zanahoria','lechuga','espinaca','brocoli','coliflor','puerro','apio','pepino','verdura','hortaliza','tuberculo','manzana','pera','platano','banana','naranja','mandarina','limon','lima','fresa','frambuesa','arandano','uva','melon','sandia','mango','piña','aguacate','fruta']],
  ['Huevos y lácteos', ['huevo','leche','queso','yogur','nata','requeson','mozzarella','kefir']],
  ['Pan y masas', ['pan','tortilla','wrap','croissant','brioche','bollo','masa','pizza','hojaldre']],
  ['Caldos, bases y bebidas para cocinar', ['caldo','fumet','fondo','vino','cerveza','sidra','brandy','jerez','mirin','agua de coco']],
  ['Productos internacionales', ['miso','tahini','harissa','gochujang','kimchi','sriracha','wasabi','nori','wakame','tortilla de maiz','curry paste','leche de coco']]
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
