import type { CookingRequest, Proposal, Recipe } from '../domain/types';
import { generateAiRecipe } from './aiProposalGateway';
import { getHybridProposals, type HybridRecommendationResult } from './hybridRecommendationEngine';
import { getRecipeImage } from './mediaGateway';
import { getRecipeById, registerExternalRecipes, rememberActiveRecipe, rememberLibraryRecipe } from './recipeCatalog';

const DIFFICULTY_RANK:Record<Recipe['difficulty'],number>={'Fácil':1,'Media':2,'Avanzada':3};

export type DirectRecipeResult={
  recipe:Recipe;
  proposal:Proposal;
  recommendation:HybridRecommendationResult;
};

export async function generateDirectRecipe(request:CookingRequest):Promise<DirectRecipeResult>{
  const recommendation=await getHybridProposals(request);
  const proposal=recommendation.proposals[0];
  if(!proposal)throw new Error('No se ha encontrado una receta que cumpla tus criterios.');

  let recipe=getRecipeById(proposal.recipeId);
  if(!recipe){
    const generated=await generateAiRecipe(request,proposal);
    const accepted=registerExternalRecipes([generated]);
    recipe=accepted[0];
    if(!recipe)throw new Error('La receta generada no ha podido validarse.');
  }

  assertRecipeLimits(recipe,request);
  rememberActiveRecipe(recipe);
  rememberLibraryRecipe(recipe);

  // Mantiene el criterio vigente de abrir la ficha completa con su imagen ya preparada.
  await getRecipeImage(recipe);

  return{recipe,proposal,recommendation};
}

function assertRecipeLimits(recipe:Recipe,request:CookingRequest){
  if(request.maxMinutes!==undefined&&recipe.prepMinutes+recipe.cookMinutes>request.maxMinutes){
    throw new Error('La receta generada supera el tiempo máximo elegido. Ajusta las opciones o vuelve a intentarlo.');
  }
  if(request.difficulty&&DIFFICULTY_RANK[recipe.difficulty]>DIFFICULTY_RANK[request.difficulty]){
    throw new Error('La receta generada supera la dificultad elegida. Ajusta las opciones o vuelve a intentarlo.');
  }
}
