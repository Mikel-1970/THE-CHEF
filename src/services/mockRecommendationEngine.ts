import type { CookingRequest, Difficulty, Proposal, Recipe } from '../domain/types';
import {
  evaluateRecipePantry,
  formatInsufficientIngredient,
  ingredientMatch,
  type PantryIngredientEvaluation
} from './pantryEvaluation';
import { getAllRecipes } from './recipeCatalog';

const difficultyRank: Record<Difficulty, number> = { 'Fácil': 1, 'Media': 2, 'Avanzada': 3 };

type RankedRecipe = {
  recipe: Recipe;
  score: number;
  evaluations: PantryIngredientEvaluation[];
};

export function getMockProposals(request: CookingRequest, excludeRecipeIds: string[] = []): Proposal[] {
  const query = normalize(request.desireText ?? '');
  const priorities = (request.pantryIngredients ?? []).filter(item => item.priority);
  const catalog = getAllRecipes();
  const candidates = catalog.filter(recipe => !excludeRecipeIds.includes(recipe.id));
  const pool = candidates.length >= 3 ? candidates : catalog;

  const ranked: RankedRecipe[] = pool.map(recipe => {
    const evaluations = request.mode === 'pantry'
      ? evaluateRecipePantry(recipe, request).filter(entry => !entry.ingredient.optional)
      : [];
    let score = 0;

    if (request.mode === 'pantry') {
      const available = evaluations.filter(item => item.status === 'available').length;
      const substituted = evaluations.filter(item => item.status === 'substituted').length;
      const insufficient = evaluations.filter(item => item.status === 'insufficient').length;
      const missing = evaluations.filter(item => item.status === 'missing').length;
      const priorityUsed = priorities.filter(priority => recipe.ingredients.some(ingredient => ingredientMatch(ingredient.name, priority.name))).length;
      const priorityNotUsed = Math.max(0, priorities.length - priorityUsed);
      const coverage = evaluations.length
        ? (available + substituted * 0.75 + insufficient * 0.35) / evaluations.length
        : 0;

      score += available * 10;
      score += substituted * 5;
      score += insufficient;
      score -= missing * 8;
      score += coverage * 12;
      score += priorityUsed * 24;
      score -= priorityNotUsed * 12;
    } else {
      score += textAffinity(recipe, query) * 10;
    }

    if (request.maxMinutes) {
      const total = recipe.prepMinutes + recipe.cookMinutes;
      score += total <= request.maxMinutes ? 10 : -Math.min(40, (total - request.maxMinutes) * 1.6);
    }
    if (request.cuisine) score += normalize(recipe.cuisine) === normalize(request.cuisine) ? 11 : -2;
    if (request.style) score += normalize(recipe.style) === normalize(request.style) ? 9 : -1;
    if (request.difficulty) {
      score += difficultyRank[recipe.difficulty] <= difficultyRank[request.difficulty] ? 6 : -12;
    }

    return { recipe, score, evaluations };
  }).sort((a, b) => b.score - a.score);

  return selectDiverse(ranked, 3).map((item, index) => toProposal(item, request, index));
}

function selectDiverse(ranked: RankedRecipe[], limit: number): RankedRecipe[] {
  const selected: RankedRecipe[] = [];
  const remaining = [...ranked];

  while (selected.length < limit && remaining.length) {
    let bestIndex = 0;
    let bestAdjustedScore = -Infinity;

    remaining.forEach((candidate, index) => {
      const penalty = selected.reduce((sum, chosen) => sum + similarityPenalty(candidate.recipe, chosen.recipe), 0);
      const adjustedScore = candidate.score - penalty;
      if (adjustedScore > bestAdjustedScore) {
        bestAdjustedScore = adjustedScore;
        bestIndex = index;
      }
    });

    selected.push(remaining.splice(bestIndex, 1)[0]);
  }

  return selected;
}

function similarityPenalty(a: Recipe, b: Recipe): number {
  let penalty = 0;
  if (normalize(a.cuisine) === normalize(b.cuisine)) penalty += 3;
  if (normalize(a.style) === normalize(b.style)) penalty += 2;

  const aIngredients = new Set(a.ingredients.filter(item => !item.optional).map(item => normalize(item.name)));
  const bIngredients = new Set(b.ingredients.filter(item => !item.optional).map(item => normalize(item.name)));
  const intersection = [...aIngredients].filter(item => bIngredients.has(item)).length;
  const union = new Set([...aIngredients, ...bIngredients]).size;
  const overlap = union ? intersection / union : 0;

  if (overlap >= 0.65) penalty += 10;
  else if (overlap >= 0.45) penalty += 5;
  return penalty;
}

function toProposal(item: RankedRecipe, request: CookingRequest, index: number): Proposal {
  const { recipe, evaluations } = item;

  if (request.mode === 'desire') {
    return {
      id: `proposal-${recipe.id}`,
      title: recipe.title,
      subtitle: recipe.description,
      emoji: recipe.emoji,
      minutes: recipe.prepMinutes + recipe.cookMinutes,
      difficulty: recipe.difficulty,
      usedIngredients: [],
      missingIngredients: [],
      reason: desireReason(index),
      recipeId: recipe.id
    };
  }

  const available = evaluations.filter(entry => entry.status === 'available');
  const substituted = evaluations.filter(entry => entry.status === 'substituted');
  const insufficient = evaluations.filter(entry => entry.status === 'insufficient');
  const missing = evaluations.filter(entry => entry.status === 'missing');
  const issueCount = insufficient.length + missing.length;
  const priorities = (request.pantryIngredients ?? []).filter(priority => priority.priority);
  const prioritiesUsed = priorities.filter(priority => recipe.ingredients.some(ingredient => ingredientMatch(ingredient.name, priority.name)));

  const classification = issueCount === 0
    ? 'Con lo que tienes'
    : issueCount === 1
      ? 'Te falta muy poco'
      : 'Buena opción si compras algunas cosas';

  return {
    id: `proposal-${recipe.id}`,
    title: recipe.title,
    subtitle: recipe.description,
    emoji: recipe.emoji,
    minutes: recipe.prepMinutes + recipe.cookMinutes,
    difficulty: recipe.difficulty,
    classification,
    usedIngredients: available.map(entry => entry.pantryItem?.name ?? entry.ingredient.name).slice(0, 5),
    missingIngredients: missing.map(entry => entry.ingredient.name).slice(0, 4),
    insufficientIngredients: insufficient.map(formatInsufficientIngredient).slice(0, 3),
    substitutionNotes: substituted.map(entry => `${entry.substitute} en lugar de ${entry.ingredient.name}`).slice(0, 3),
    reason: pantryReason(prioritiesUsed.map(item => item.name), substituted.length, issueCount, index),
    recipeId: recipe.id
  };
}

function pantryReason(prioritiesUsed: string[], substitutionCount: number, issueCount: number, index: number): string {
  if (prioritiesUsed.length) return `Prioriza ${prioritiesUsed.slice(0, 2).join(' y ')}, que has marcado para aprovechar.`;
  if (issueCount === 0 && substitutionCount > 0) return 'Encaja con lo que tienes gracias a una sustitución culinaria razonable.';
  if (issueCount === 0) return 'Aprovecha bien lo disponible sin necesitar compras adicionales.';
  if (issueCount === 1) return 'Necesita un ajuste pequeño y aprovecha bien el resto de tus ingredientes.';
  const alternatives = [
    'Es una opción gastronómicamente coherente aunque requiere completar algunos ingredientes.',
    'Aporta una alternativa distinta equilibrando aprovechamiento, tiempo y dificultad.',
    'Completa las propuestas con un enfoque diferente y un uso razonable de lo disponible.'
  ];
  return alternatives[index] ?? alternatives[0];
}

function desireReason(index: number): string {
  const reasons = [
    'Es la que mejor encaja con lo que has pedido.',
    'Te da una alternativa diferente sin alejarse de tus criterios.',
    'Completa las opciones con otro enfoque de cocina y técnica.'
  ];
  return reasons[index] ?? reasons[0];
}

function textAffinity(recipe: Recipe, query: string) {
  if (!query) return 0;
  const words = query.split(/\s+/).filter(word => word.length > 3);
  const haystack = normalize([
    recipe.title,
    recipe.description,
    recipe.cuisine,
    recipe.style,
    ...recipe.ingredients.map(ingredient => ingredient.name)
  ].join(' '));
  return words.filter(word => haystack.includes(word)).length;
}

function normalize(value: string) {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
