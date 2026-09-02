const genericAlternatives: Array<{ match: string[]; alternatives: string[] }> = [
  { match: ['pechuga de pollo', 'pollo'], alternatives: ['Pavo en piezas equivalentes', 'Tofu firme si quieres una variante vegetal'] },
  { match: ['arroz'], alternatives: ['Cuscús o bulgur si aceptas cambiar la técnica', 'Quinoa para una variante distinta'] },
  { match: ['calabacín'], alternatives: ['Berenjena', 'Champiñón o setas'] },
  { match: ['cebolla'], alternatives: ['Puerro', 'Chalota'] },
  { match: ['caldo de pollo'], alternatives: ['Caldo de verduras', 'Agua con un fondo de verduras bien ajustado de sal'] },
  { match: ['aceite de oliva'], alternatives: ['Aceite de girasol alto oleico para cocinar', 'Otro aceite neutro adecuado a la técnica'] },
  { match: ['parmesano'], alternatives: ['Grana Padano', 'Queso curado de sabor similar'] },
  { match: ['huevos', 'huevo'], alternatives: ['Tofu firme desmigado en salteados', 'Otra proteína solo si la receta se adapta a su función'] },
  { match: ['salsa de soja'], alternatives: ['Tamari', 'Aminos de coco, ajustando el dulzor y la sal'] },
  { match: ['limón'], alternatives: ['Lima', 'Vinagre suave en pequeñas cantidades si solo se busca acidez'] },
  { match: ['ajo'], alternatives: ['Ajo granulado, ajustando cantidad', 'Omitirlo si no es estructural en la receta'] },
  { match: ['pasta'], alternatives: ['Otra pasta de formato similar', 'Pasta sin gluten si necesitas esa adaptación'] },
  { match: ['tomate triturado'], alternatives: ['Passata de tomate', 'Tomate fresco rallado y cocinado algo más'] },
  { match: ['burrata'], alternatives: ['Mozzarella fresca', 'Stracciatella'] },
  { match: ['albahaca'], alternatives: ['Perejil fresco para un perfil distinto', 'Orégano en menor cantidad'] },
  { match: ['tortillas de maíz'], alternatives: ['Tortillas de trigo', 'Hojas firmes de lechuga para una versión sin tortilla'] },
  { match: ['pimiento'], alternatives: ['Otro pimiento de sabor suave', 'Calabacín si aceptas cambiar el perfil del plato'] },
  { match: ['lima'], alternatives: ['Limón'] },
  { match: ['comino'], alternatives: ['Cilantro molido con una pequeña cantidad de pimentón', 'Omitirlo y reajustar el resto de especias'] },
  { match: ['garbanzos'], alternatives: ['Lentejas cocidas', 'Alubias blancas cocidas'] },
  { match: ['tomate'], alternatives: ['Tomate cherry', 'Pimiento asado si aceptas cambiar el perfil'] },
  { match: ['vinagre'], alternatives: ['Zumo de limón', 'Otro vinagre suave'] },
  { match: ['sal'], alternatives: ['No tiene una sustitución culinaria universal; conviene ajustar la receta sin reemplazarla directamente'] },
  { match: ['aceite'], alternatives: ['Aceite de oliva', 'Aceite de girasol alto oleico'] }
];

export function getIngredientAlternatives(ingredientName: string, recipeSubstitutions: string[], optional = false): string[] {
  const normalizedName = normalize(ingredientName);
  const significantWords = normalizedName.split(/\s+/).filter(word => word.length > 3);

  const specific = recipeSubstitutions.filter(sentence => {
    const normalizedSentence = normalize(sentence);
    return significantWords.some(word => normalizedSentence.includes(word));
  });

  const generic = genericAlternatives.find(rule => rule.match.some(term => {
    const normalizedTerm = normalize(term);
    return normalizedName.includes(normalizedTerm) || normalizedTerm.includes(normalizedName);
  }))?.alternatives ?? [];

  const results = Array.from(new Set([...specific, ...generic])).slice(0, 3);
  if (results.length) return results;
  if (optional) return ['Es opcional: puedes omitirlo sin sustituirlo.'];
  return ['No hay una sustitución directa fiable; es preferible comprarlo o elegir una variante de receta que no lo necesite.'];
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
