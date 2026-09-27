import {prepareDesireRequest,matchesChosenCuisine} from '../utils/chefChoice';
import type { CookingRequest, Proposal, Recipe } from '../domain/types';
import { fetchAiProposals, generateAiRecipe } from './aiProposalGateway';
import { getHybridProposals, type HybridRecommendationResult } from './hybridRecommendationEngine';
import { getRecipeImage } from './mediaGateway';
import { getRecipeById, registerExternalRecipes, rememberActiveRecipe, rememberLibraryRecipe } from './recipeCatalog';
import {foodPreferenceRestrictions} from './foodPreferences';

const DIFFICULTY_RANK:Record<Recipe['difficulty'],number>={'Fácil':1,'Media':2,'Avanzada':3};

export type DirectRecipeResult={
  recipe:Recipe;
  proposal:Proposal;
  recommendation:HybridRecommendationResult;
};

export async function generateDirectRecipe(request:CookingRequest,onProgress?:(message:string)=>void):Promise<DirectRecipeResult>{
  request={...request,restrictions:Array.from(new Set([...(request.restrictions??[]),...foodPreferenceRestrictions()]))};
  request=prepareDesireRequest(request);
  onProgress?.('Buscando una propuesta para el plato principal…');
  const recommendation=await getHybridProposals(request);
  const proposal=recommendation.proposals[0];
  if(!proposal)throw new Error('No se ha encontrado una receta que cumpla tus criterios.');

  let recipe=request.generationMode==='ai'?undefined:getRecipeById(proposal.recipeId);
  if(!recipe){
    const phases:string[]=[];
    const text=(request.desireText??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(request.mode==='desire'&&/\b(salsa|aderezo)\b/.test(text))phases.push('salsa o aderezo');
    if(request.mode==='desire'&&/\b(guarnicion|acompanamiento)\b/.test(text))phases.push('guarnición y técnica de presentación');
    const plans:string[]=[];
    for(const phase of phases){
      onProgress?.('Preparando por separado: '+phase+'…');
      const parts=await fetchAiProposals({...request,desireText:(request.desireText??'')+'\nFASE DE PLANIFICACIÓN: desarrolla únicamente '+phase+' para acompañar '+proposal.title+'. Propón ingredientes y técnica compatibles con la petición original y todas sus restricciones. No redactes el plato principal de nuevo.'});
      if(!parts.length)throw new Error('No se ha podido completar la fase de '+phase+'. Tu petición se conserva.');
      plans.push(phase+': '+JSON.stringify(parts[0]));
    }
    const integratedRequest=plans.length?{...request,desireText:(request.desireText??'')+'\nIntegra estas elaboraciones en UNA sola receta: '+plans.join('\n')+'\nOrganiza los ingredientes por section y los pasos por fases identificadas en instruction: preparación, plato principal, salsa, guarnición y emplatado, solo las que procedan. Coordina las tareas simultáneas y las temperaturas; no sumes mecánicamente tiempos de tareas paralelas. Unifica cantidades para los mismos comensales, evita duplicados y comprueba que cada ingrediente se usa. Los planes son propuestas, corrige incompatibilidades sin alterar la petición ni las restricciones.'}:request;
    onProgress?.('Integrando ingredientes, cantidades y fases de elaboración…');
    const generated=await generateAiRecipe(integratedRequest,proposal);
    const accepted=registerExternalRecipes([generated]);
    recipe=accepted[0];
    if(!recipe)throw new Error('La receta generada no ha podido validarse.');
  }

  if(!matchesChosenCuisine(recipe.cuisine,request.cuisine))throw new Error('La receta generada no corresponde a la cocina elegida. Vuelve a intentarlo.');
  assertRecipeLimits(recipe,request);
  if(request.excludeRecipeIds?.some(id=>getRecipeById(id)?.title.toLocaleLowerCase('es')===recipe.title.toLocaleLowerCase('es')))throw new Error('La IA ha repetido el plato. Vuelve a intentarlo para obtener otra opción.');
  rememberActiveRecipe(recipe);
  rememberLibraryRecipe(recipe);

  // Mantiene el criterio vigente de abrir la ficha completa con su imagen ya preparada.
  onProgress?.('Preparando la imagen de tu receta…');
  await getRecipeImage(recipe).catch(()=>undefined);

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
