import type { CookingRequest, Proposal } from '../domain/types';
import { fetchAiProposals, isAiProposalApiConfigured } from './aiProposalGateway';
import { getMockProposals } from './mockRecommendationEngine';

export const HYBRID_NOTICE_STORAGE_KEY = 'the-chef:last-hybrid-notice';
const PROPOSAL_COUNT = 2;

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
  let externalError: string | undefined;

  if (isAiProposalApiConfigured()) {
    try {
      const proposals = await fetchAiProposals(request);
      if (proposals.length) {
        persistEngineNotice(undefined);
        return {
          proposals: proposals.slice(0, PROPOSAL_COUNT),
          mode: 'hybrid',
          externalRecipesAdded: 0
        };
      }
      externalError = 'La IA no ha devuelto propuestas válidas. Se muestran recetas del catálogo local.';
    } catch (error) {
      externalError = error instanceof Error && error.message
        ? error.message
        : 'No se ha podido consultar la IA. Se muestran recetas del catálogo local.';
    }
  }

  persistEngineNotice(externalError);
  return {
    proposals: getMockProposals(request, excludeRecipeIds).slice(0, PROPOSAL_COUNT),
    mode: 'local',
    externalRecipesAdded: 0,
    externalError
  };
}

function persistEngineNotice(message?: string) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    if (message) sessionStorage.setItem(HYBRID_NOTICE_STORAGE_KEY, message);
    else sessionStorage.removeItem(HYBRID_NOTICE_STORAGE_KEY);
  } catch {
    // El aviso es informativo; no debe bloquear la búsqueda.
  }
}
