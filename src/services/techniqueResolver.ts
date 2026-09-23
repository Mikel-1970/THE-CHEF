import { techniqueMaster, techniqueMasterById } from '../data/techniqueMaster';
import type { Recipe, RecipeStep } from '../domain/types';
import type { Technique } from './techniqueGateway';

type SearchEntry={technique:Technique;terms:string[]};

const searchIndex:SearchEntry[]=techniqueMaster.map(technique=>({
  technique,
  terms:Array.from(new Set([technique.title,...(technique.aliases||[]),...(technique.keywords||[])].map(normalize).filter(Boolean))).sort((a,b)=>b.length-a.length)
}));

export function getTechniqueById(id?:string):Technique|undefined{
  return id?techniqueMasterById.get(id):undefined;
}

export function resolveTechnique(input:string):Technique|undefined{
  const value=normalize(input);
  if(!value)return undefined;
  const byId=techniqueMasterById.get(input);
  if(byId)return byId;
  const exact=searchIndex.find(entry=>entry.terms.includes(value));
  if(exact)return exact.technique;
  return searchIndex.find(entry=>entry.terms.some(term=>term.length>=4&&value.includes(term)))?.technique;
}

export function getTechniquesForStep(step:RecipeStep):Technique[]{
  const explicit=(step.techniqueIds||[]).map(getTechniqueById).filter((value):value is Technique=>Boolean(value));
  if(explicit.length)return unique(explicit);
  return inferTechniquesFromText(step.instruction,3);
}

export function getTechniquesForRecipe(recipe:Recipe):Technique[]{
  const explicit=[
    ...(recipe.techniqueIds||[]),
    ...recipe.steps.flatMap(step=>step.techniqueIds||[])
  ].map(getTechniqueById).filter((value):value is Technique=>Boolean(value));
  if(explicit.length)return unique(explicit);
  return unique(recipe.steps.flatMap(step=>inferTechniquesFromText(step.instruction,2))).slice(0,10);
}

export function inferTechniqueIdsFromText(text:string,limit=3):string[]{
  return inferTechniquesFromText(text,limit).map(item=>item.id);
}

export function enrichRecipeTechniques(recipe:Recipe):Recipe{
  const steps=recipe.steps.map(step=>{
    const techniqueIds=(step.techniqueIds?.length?step.techniqueIds:inferTechniqueIdsFromText(step.instruction,3));
    const techniques=techniqueIds.map(getTechniqueById).filter((value):value is Technique=>Boolean(value));
    return {
      ...step,
      techniqueIds,
      timerLabel:step.timerLabel||techniques.find(item=>item.timerRecommended)?.timerTitle,
      successSignals:step.successSignals?.length?step.successSignals:techniques.flatMap(item=>item.successSignals||[]).slice(0,3),
      criticalPoint:step.criticalPoint||techniques.map(item=>item.criticalPoints[0]).find(Boolean)
    };
  });
  const techniqueIds=Array.from(new Set([...(recipe.techniqueIds||[]),...steps.flatMap(step=>step.techniqueIds||[])]));
  return {...recipe,steps,techniqueIds};
}

export function inferTechniquesFromText(text:string,limit=3):Technique[]{
  const value=normalize(text);
  if(!value)return [];
  const tokens=value.split(/[^a-z0-9]+/).filter(Boolean);
  const matches:Technique[]=[];
  for(const entry of searchIndex){
    if(matches.length>=limit)break;
    if(entry.terms.some(term=>matchesTerm(value,tokens,term)))matches.push(entry.technique);
  }
  return unique(matches).slice(0,limit);
}

function matchesTerm(text:string,tokens:string[],term:string){
  if(term.length>=4&&text.includes(term))return true;
  if(term.includes(' '))return false;
  const stem=infinitiveStem(term);
  return Boolean(stem&&tokens.some(token=>token.startsWith(stem)));
}

function infinitiveStem(term:string){
  if(term.length<7)return '';
  if(term.endsWith('ar')||term.endsWith('er')||term.endsWith('ir'))return term.slice(0,-2);
  return '';
}

function unique(items:Technique[]){
  const seen=new Set<string>();
  return items.filter(item=>!seen.has(item.id)&&(seen.add(item.id),true));
}

function normalize(value:string){
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[«»"'’]/g,'').trim();
}
