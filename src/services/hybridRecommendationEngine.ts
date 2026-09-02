import type { CookingRequest, Proposal } from '../domain/types';
import { fetchExternalRecommendations, isExternalRecipeApiConfigured } from './externalRecipeGateway';
import { getMockProposals } from './mockRecommendationEngine';
import { registerExternalRecipes } from './recipeCatalog';

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

  if (isExternalRecipeApiConfigured()) {
    try {
      const externalRecipes = await fetchExternalRecommendations(request);
      externalRecipesAdded = registerExternalRecipes(externalRecipes).length;
    } catch {
      externalError = 'No se han podido consultar las fuentes externas. Se han usado las recetas disponibles en El Chef.';
    }
  }

  return {
    proposals: getMockProposals(request, excludeRecipeIds),
    mode: externalRecipesAdded > 0 ? 'hybrid' : 'local',
    externalRecipesAdded,
    externalError
  };
}
