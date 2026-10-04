import {foodTextMatches} from './recipeSearch';
import {isChefChoice,matchesChosenCuisine,desireFoodText} from './chefChoice';
import type { CookingRequest, Proposal, Recipe } from '../domain/types';

export function recipeMatchesDesireIntent(recipe:Recipe,request:CookingRequest){
 if(isChefChoice(request)&&!matchesChosenCuisine(recipe.cuisine,request.cuisine))return false;
 return textMatchesDesireIntent([
  recipe.title,recipe.description,recipe.cuisine,recipe.style,recipe.mealType,recipe.libraryCategory??'',
  ...recipe.ingredients.map(item=>item.name)
 ].join(' '),request);
}

export function proposalMatchesDesireIntent(proposal:Proposal,request:CookingRequest){
 return textMatchesDesireIntent([
  proposal.reason,proposal.title,proposal.subtitle,proposal.style??'',
  ...proposal.usedIngredients,...proposal.missingIngredients
 ].join(' '),request);
}

export function textMatchesDesireIntent(candidateText:string,request:CookingRequest){
 if(request.mode!=='desire'||isChefChoice(request))return true;
 let query=desireFoodText(request);
 if(request.generationMode==='ai'){
  const soften=(text:string)=>text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/sous[ -]?vide|al vacio/g,'baja temperatura').replace(/guarnicion/g,'acompanamiento');
  query=soften(query).replace(/\b(alguna?s?|algun|especial|especiales|tecnicas?|alta cocina|alta|aderezo|acompanamiento|creativo|creativa|original|sofisticado|sofisticada|toque|diferente)\b/g,' ');
  candidateText=soften(candidateText);
 }
 if(!query)return true;
 return foodTextMatches(candidateText,query);
}

