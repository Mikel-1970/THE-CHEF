import type { CookingRequest, Difficulty, Proposal, Recipe } from '../domain/types';
import { mockRecipes } from '../data/mockRecipes';

const difficultyRank: Record<Difficulty, number> = { 'Fácil': 1, 'Media': 2, 'Avanzada': 3 };

export function getMockProposals(request: CookingRequest, excludeRecipeIds: string[] = []): Proposal[] {
  const pantryNames = request.mode === 'pantry'
    ? [...(request.pantryIngredients ?? []).map(i => i.name), ...(request.pantryBasics ?? [])].map(normalize)
    : [];
  const priorities = (request.pantryIngredients ?? []).filter(i => i.priority).map(i => normalize(i.name));
  const query = normalize(request.desireText ?? '');

  const candidates = mockRecipes.filter(recipe => !excludeRecipeIds.includes(recipe.id));
  const pool = candidates.length >= 3 ? candidates : mockRecipes;

  const ranked = pool.map(recipe => {
    const required = recipe.ingredients.filter(i => !i.optional);
    const matched = required.filter(i => matchesAny(i.name, pantryNames));
    const missing = required.filter(i => !matchesAny(i.name, pantryNames));
    let score = 0;

    if (request.mode === 'pantry') {
      score += matched.length * 9;
      score -= missing.length * 5;
      score += priorities.filter(p => recipe.ingredients.some(i => ingredientMatch(i.name, p))).length * 14;
      if (request.maxExtraPurchases !== undefined && missing.length <= request.maxExtraPurchases) score += 13;
    } else {
      score += textAffinity(recipe, query) * 10;
    }

    if (request.maxMinutes) {
      const total = recipe.prepMinutes + recipe.cookMinutes;
      score += total <= request.maxMinutes ? 10 : -Math.min(18, (total - request.maxMinutes) * 1.2);
    }
    if (request.mealType) score += recipe.mealType === request.mealType ? 7 : 0;
    if (request.cuisine) score += normalize(recipe.cuisine) === normalize(request.cuisine) ? 11 : 0;
    if (request.style) score += normalize(recipe.style) === normalize(request.style) ? 9 : 0;
    if (request.difficulty) {
      score += difficultyRank[recipe.difficulty] <= difficultyRank[request.difficulty] ? 6 : -8;
    }

    return { recipe, score, matched, missing };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  return ranked.map((item, index) => toProposal(item.recipe, item.matched.map(i => i.name), item.missing.map(i => i.name), request, index));
}

function normalize(value: string) {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function ingredientMatch(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  return x.includes(y) || y.includes(x);
}

function matchesAny(name: string, pantry: string[]) {
  return pantry.some(p => ingredientMatch(name, p));
}

function textAffinity(recipe: Recipe, query: string) {
  if (!query) return 0;
  const words = query.split(/\s+/).filter(w => w.length > 3);
  const haystack = normalize([
    recipe.title,
    recipe.description,
    recipe.cuisine,
    recipe.style,
    recipe.mealType,
    ...recipe.ingredients.map(i => i.name)
  ].join(' '));
  return words.filter(word => haystack.includes(word)).length;
}

function toProposal(recipe: Recipe, used: string[], missing: string[], request: CookingRequest, index: number): Proposal {
  const relevantMissing = missing.slice(0, 3);
  const classification = request.mode === 'desire'
    ? 'Buena opción si compras algunas cosas'
    : relevantMissing.length === 0
      ? 'Con lo que tienes'
      : relevantMissing.length <= 1
        ? 'Te falta muy poco'
        : 'Buena opción si compras algunas cosas';

  const reasons = request.mode === 'pantry'
    ? [
        'Es la que mejor aprovecha los ingredientes que has indicado.',
        'Aporta una alternativa distinta manteniendo pocas compras.',
        'Equilibra bien aprovechamiento, tiempo y dificultad.'
      ]
    : [
        'Es la que mejor encaja con lo que has pedido.',
        'Te da una alternativa diferente sin alejarse de tus criterios.',
        'Completa las opciones con otro enfoque de cocina y técnica.'
      ];

  return {
    id: `proposal-${recipe.id}`,
    title: recipe.title,
    subtitle: recipe.description,
    emoji: recipe.emoji,
    minutes: recipe.prepMinutes + recipe.cookMinutes,
    difficulty: recipe.difficulty,
    classification,
    usedIngredients: used.slice(0, 4),
    missingIngredients: relevantMissing,
    reason: reasons[index] ?? reasons[0],
    recipeId: recipe.id
  };
}
