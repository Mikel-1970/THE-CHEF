import type { CookingRequest, Proposal, Recipe } from '../domain/types';
import { fetchExternalRecommendations, isExternalRecipeApiConfigured } from './externalRecipeGateway';
import { getMockProposals } from './mockRecommendationEngine';
import { evaluateRecipePantry, formatInsufficientIngredient } from './pantryEvaluation';
import { registerExternalRecipes } from './recipeCatalog';

export const HYBRID_NOTICE_STORAGE_KEY = 'the-chef:last-hybrid-notice';

export type HybridRecommendationResult = {
  proposals: Proposal[];
  mode: 'local' | 'hybrid';
  externalRecipesAdded: number;
  externalError?: string;
};

export async function getHybridProposals(
  request: CookingRequest,
  excludeRecipeIds: string[] = []
): Promise<HybridRecommendationResult> {
  let externalRecipesAdded = 0;
  let externalError: string | undefined;
  let externalProposals: Proposal[] = [];

  if (isExternalRecipeApiConfigured()) {
    try {
      const externalRecipes = await fetchExternalRecommendations(request);
      const accepted = registerExternalRecipes(externalRecipes)
        .filter(recipe => !excludeRecipeIds.includes(recipe.id));
      externalRecipesAdded = accepted.length;
      externalProposals = accepted.slice(0, 3).map((recipe, index) => toExternalProposal(recipe, request, index));
    } catch (error) {
      externalError = error instanceof Error && error.message
        ? error.message
        : 'No se han podido consultar las fuentes externas. Se muestran recetas del catálogo local.';
    }
  }

  persistEngineNotice(externalError);

  if (externalProposals.length) {
    return {
      proposals: externalProposals,
      mode: 'hybrid',
      externalRecipesAdded,
      externalError
    };
  }

  return {
    proposals: getMockProposals(request, excludeRecipeIds).slice(0, 3),
    mode: 'local',
    externalRecipesAdded,
    externalError
  };
}

function toExternalProposal(recipe: Recipe, request: CookingRequest, index: number): Proposal {
  if (request.mode === 'desire') {
    return {
      id: `proposal-${recipe.id}`,
      title: recipe.title,
      subtitle: recipe.description,
      emoji: recipe.emoji,
      minutes: recipe.prepMinutes + recipe.cookMinutes,
      difficulty: recipe.difficulty,
      usedIngredients: recipe.ingredients.filter(item => !item.optional).slice(0, 5).map(item => item.name),
      missingIngredients: [],
      reason: index === 0
        ? 'Propuesta generada por IA especialmente para tu petición.'
        : 'Alternativa generada por IA con un enfoque diferente y compatible con tus criterios.',
      recipeId: recipe.id
    };
  }

  const evaluations = evaluateRecipePantry(recipe, request).filter(entry => !entry.ingredient.optional);
  const available = evaluations.filter(entry => entry.status === 'available');
  const substituted = evaluations.filter(entry => entry.status === 'substituted');
  const insufficient = evaluations.filter(entry => entry.status === 'insufficient');
  const missing = evaluations.filter(entry => entry.status === 'missing');
  const issueCount = insufficient.length + missing.length;
  const classification = issueCount === 0
    ? 'Con lo que tienes' as const
    : issueCount === 1
      ? 'Te falta muy poco' as const
      : 'Buena opción si compras algunas cosas' as const;

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
    reason: 'Propuesta generada por IA a partir de los ingredientes y condiciones que has indicado.',
    recipeId: recipe.id
  };
}

function persistEngineNotice(message?: string) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    if (message) sessionStorage.setItem(HYBRID_NOTICE_STORAGE_KEY, message);
    else sessionStorage.removeItem(HYBRID_NOTICE_STORAGE_KEY);
  } catch {
    // El aviso es informativo; no debe bloquear la búsqueda si el almacenamiento está restringido.
  }
}
