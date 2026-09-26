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
  proposal.title,proposal.subtitle,proposal.style??'',
  ...proposal.usedIngredients,...proposal.missingIngredients
 ].join(' '),request);
}

export function textMatchesDesireIntent(candidateText:string,request:CookingRequest){
 if(request.mode!=='desire'||isChefChoice(request))return true;
 const query=desireFoodText(request);
 if(!query)return true;
 return foodTextMatches(candidateText,query);
}
