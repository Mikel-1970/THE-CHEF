import type { Recipe, RecipeStep } from '../domain/types';

export type CookingTipPriority='P1'|'P2'|'P3';
export type CookingTipLevel='básico'|'intermedio'|'avanzado';
export type CookingTip={
 id:string;
 code:string;
 icon:string;
 title:string;
 category:string;
 primaryType:string;
 secondaryType:string;
 priority:CookingTipPriority;
 text:string;
 shortTip:string;
 explanation:string;
 whyItWorks:string;
 appliesTo:string[];
 techniques:string[];
 useMoment:string[];
 level:CookingTipLevel;
 commonError:string;
 sensorySignal:string;
 chefQuickTip:string;
 tags:string[];
 source?:string;
 triggers:{
  ingredients:string[];
  techniques:string[];
  actions:string[];
  equipment:string[];
  situations:string[];
 };
};

// Biblioteca editorial v2: 150 fichas estructuradas y preparadas para selección contextual.
export const cookingTips:CookingTip[]=[];
let bundledTipsLoaded=false;
export async function loadBundledCookingTips():Promise<void>{
 if(bundledTipsLoaded||cookingTips.length>=150){bundledTipsLoaded=true;return;}
 const {cookingTipsCatalog}=await import('./cookingTipsCatalog');
 cookingTips.splice(0,cookingTips.length,...cookingTipsCatalog);
 bundledTipsLoaded=true;
}


type TipReviews=Record<string,'keep'|'hide'>;
const REVIEW_KEY='chef:tip-reviews:v2';
export function getTipReviews():TipReviews{
 try{
  const data=JSON.parse(localStorage.getItem(REVIEW_KEY)||'{}');
  return Object.fromEntries(Object.entries(data).filter(([,v])=>v==='keep'||v==='hide')) as TipReviews;
 }catch{return {}}
}
export function setTipReview(id:string,value:'keep'|'hide'|'pending'){
 const reviews=getTipReviews();
 if(value==='pending')delete reviews[id];else reviews[id]=value;
 localStorage.setItem(REVIEW_KEY,JSON.stringify(reviews));
 return reviews;
}

let remaining:number[]=[];
let last=-1;
export function nextCookingTip(){
 const reviews=getTipReviews();
 remaining=remaining.filter(i=>reviews[cookingTips[i]?.id]!=='hide');
 if(!remaining.length){
  remaining=cookingTips.map((_,i)=>i).filter(i=>reviews[cookingTips[i].id]!=='hide');
  for(let i=remaining.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [remaining[i],remaining[j]]=[remaining[j],remaining[i]];
  }
  if(remaining.length>1&&remaining[remaining.length-1]===last){
   [remaining[0],remaining[remaining.length-1]]=[remaining[remaining.length-1],remaining[0]];
  }
 }
 const next=remaining.pop();
 if(next===undefined)return undefined;
 last=next;
 return cookingTips[last];
}

const PRIORITY_SCORE:Record<CookingTipPriority,number>={P1:6,P2:3,P3:1};
const LEXICAL_STOP=new Set(['antes','despues','cuando','para','como','solo','poco','unos','unas','esto','esta','este','debe','deben','puede','pueden','tiene','tienen','entre','sobre','hasta','desde','todo','toda','todos','todas','algo','otro','otra','otros','otras','cada','mismo','misma','mientras','cocinar','cocina','coccion','minuto','minutos','anade','anadir','incorpora']);
const ACTION_ALIASES:Array<[string,string[]]>=[
 ['sofri',['sofreir','saltear']],['rehog',['rehogar','sofreir','tostar']],['dora',['dorar','marcar']],
 ['tost',['tostar','dorar']],['cocina',['cocer','cocinar']],['cocci',['cocer','cocinar']],['cuec',['cocer']],
 ['herv',['hervir','cocer']],['remov',['remover']],['repos',['reposar']],['horne',['hornear','asar']],
 ['gratin',['gratinar']],['frit',['freir']],['saltea',['saltear']],['reduce',['reducir']],
 ['desglas',['desglasar']],['tritura',['triturar']],['emulsion',['emulsionar']],['mezcla',['mezclar']],
 ['bate',['batir']],['monta',['montar']],['escalf',['escalfar']],['vapor',['cocer al vapor']],
 ['ajusta de sal',['sazonar']],['sazona',['sazonar']]
];

function normalize(value:string){
 return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ]+/g,' ').trim();
}
function rootKey(value:string){
 const x=normalize(value);return x.length>=5?x.slice(0,5):x;
}
function lexicalRoots(value:string){
 return new Set(normalize(value).split(/\s+/).filter(x=>x.length>=4&&!LEXICAL_STOP.has(x)).map(rootKey));
}
function lexicalOverlap(a:string,b:string){
 const aa=lexicalRoots(a),bb=lexicalRoots(b);let shared=0;for(const x of aa)if(bb.has(x))shared++;return shared;
}
function canonicalStepContext(value:string){
 const base=normalize(value),extra:string[]=[];
 for(const [needle,aliases] of ACTION_ALIASES)if(base.includes(normalize(needle)))extra.push(...aliases);
 return normalize(base+' '+extra.join(' '));
}
function exactActionMatch(context:string,value:string){
 const trigger=normalize(value);if(!trigger)return false;
 if(trigger.includes(' '))return context.includes(trigger);
 return context.split(/\s+/).includes(trigger);
}
function ingredientLikeMatch(context:string,value:string){
 const trigger=normalize(value);if(!trigger)return false;
 if(context.includes(trigger))return true;
 const contextRoots=new Set(context.split(/\s+/).filter(x=>x.length>=3).map(rootKey));
 const triggerRoots=trigger.split(/\s+/).filter(x=>x.length>=3&&!['para','con','sin','del'].includes(x)).map(rootKey);
 return triggerRoots.length>0&&triggerRoots.every(x=>contextRoots.has(x));
}
function ingredientMentioned(name:string,text:string){
 const ingredient=normalize(name),context=normalize(text);if(context.includes(ingredient))return true;
 const tokens=ingredient.split(/\s+/).filter(x=>!['de','del','la','el'].includes(x));if(!tokens.length)return false;
 const contextTokens=context.split(/\s+/);
 if(['caldo','fondo','aceite','agua'].includes(tokens[0]))return contextTokens.includes(tokens[0]);
 const generic=new Set(['pechuga','filete','carne','fresco','fresca','triturado','triturada','curado','curada']);
 const meaningful=tokens.filter(x=>x.length>=4&&!generic.has(x));
 const roots=new Set(contextTokens.filter(x=>x.length>=4).map(rootKey));
 return meaningful.some(x=>roots.has(rootKey(x)));
}
function expandIngredientContext(names:string[]){
 const parts=[...names],value=normalize(names.join(' '));const add=(...items:string[])=>parts.push(...items);
 if(['pollo','pavo'].some(x=>value.includes(x)))add('carne','carnes','ave','aves');
 if(['ternera','vacuno','cerdo','cordero','filete'].some(x=>value.includes(x)))add('carne','carnes');
 if(['merluza','salmon','lubina','dorada','atun','pescado'].some(x=>value.includes(x)))add('pescado','pescados');
 if(['gamba','langostino','vieira','almeja','mejillon','marisco'].some(x=>value.includes(x)))add('marisco','mariscos');
 if(['cebolla','ajo','puerro','calabacin','zanahoria','pimiento','patata','brocoli','coliflor','tomate'].some(x=>value.includes(x)))add('verdura','verduras','hortaliza','hortalizas');
 if(['cebolla','ajo','puerro'].some(x=>value.includes(x)))add('aromatico','aromaticos');
 if(['arroz','quinoa','bulgur','cuscus'].some(x=>value.includes(x)))add('arroz','arroces','cereal','cereales','grano','granos');
 if(['pasta','espagueti','macarron','penne'].some(x=>value.includes(x)))add('pasta');
 if(['huevo','yema','clara'].some(x=>value.includes(x)))add('huevo','huevos');
 if(['caldo','fondo','fumet'].some(x=>value.includes(x)))add('caldo','caldos','fondo','fondos');
 if(value.includes('salsa'))add('salsa','salsas');
 if(['harina','masa','pan','pizza'].some(x=>value.includes(x)))add('masa','masas','pan','reposteria');
 return normalize(parts.join(' '));
}
function uniqueNormalized(values:string[]){
 const seen=new Set<string>();return values.filter(value=>{const key=normalize(value);if(!key||seen.has(key))return false;seen.add(key);return true});
}
function duplicatesRecipeAdvice(tip:CookingTip,recipe:Recipe,step:RecipeStep){
 const candidate=tip.title+' '+tip.shortTip;
 return [...recipe.criticalPoints,...recipe.substitutions,...recipe.miseEnPlace,step.cue||''].some(advice=>advice&&lexicalOverlap(candidate,advice)>=2);
}
function conflictsWithCue(tip:CookingTip,cue?:string){
 const c=normalize(cue||''),text=normalize(tip.title+' '+tip.shortTip+' '+tip.explanation);
 if((c.includes('sin tost')||c.includes('sin dora'))&&['dora','tost','costr','maillard'].some(x=>text.includes(x)))return true;
 if(c.includes('sin herv')&&text.includes('herv'))return true;
 return false;
}
function scoreTip(tip:CookingTip,recipe:Recipe,step:RecipeStep,stepIndex:number,reviews:TipReviews){
 const rawStep=[step.instruction,step.cue||''].join(' ');
 const stepContext=canonicalStepContext(rawStep);
 const stepIngredients=recipe.ingredients.map(i=>i.name).filter(name=>ingredientMentioned(name,rawStep));
 const stepIngredientContext=expandIngredientContext(stepIngredients);
 const recipeIngredientContext=expandIngredientContext(recipe.ingredients.map(i=>i.name));
 const actionValues=uniqueNormalized([...tip.triggers.techniques,...tip.triggers.actions]);
 const applicableValues=uniqueNormalized([...tip.triggers.ingredients,...tip.appliesTo]);
 const actionMatches=actionValues.filter(x=>exactActionMatch(stepContext,x)).length;
 const directOverlap=lexicalOverlap(tip.title+' '+tip.shortTip,rawStep);
 const stepApplicability=applicableValues.filter(x=>ingredientLikeMatch(stepIngredientContext,x)).length;
 const recipeApplicability=applicableValues.filter(x=>ingredientLikeMatch(recipeIngredientContext,x)).length;
 if(actionMatches===0&&directOverlap<2)return -1000;
 let score=PRIORITY_SCORE[tip.priority];
 if(reviews[tip.id]==='keep')score+=2;
 score+=actionMatches*8;
 score+=Math.min(directOverlap,3)*4;
 score+=Math.min(stepApplicability,2)*7;
 score+=Math.min(recipeApplicability,2);
 if(stepIngredients.length&&stepApplicability===0)score-=14;
 const moments=new Set(tip.useMoment.map(normalize));
 if(stepIndex>0&&moments.size&&[...moments].every(x=>x==='antes de cocinar'||x==='durante la preparacion'))score-=8;
 if(moments.has('conservacion'))score-=20;
 if(moments.has('durante la coccion'))score+=2;
 if(stepIndex===0&&['antes de cocinar','inicio de coccion','durante la preparacion'].some(x=>moments.has(x)))score+=3;
 if(stepIndex===recipe.steps.length-1&&['final de coccion','antes de servir'].some(x=>moments.has(x)))score+=4;
 if(conflictsWithCue(tip,step.cue))score-=30;
 if(duplicatesRecipeAdvice(tip,recipe,step))score-=14;
 return score;
}

export function selectContextualCookingTip(
 recipe:Recipe,
 step:RecipeStep,
 stepIndex:number,
 excludedIds:ReadonlySet<string>=new Set()
){
 const reviews=getTipReviews();
 const ranked=cookingTips
  .filter(t=>reviews[t.id]!=='hide'&&!excludedIds.has(t.id))
  .map(t=>({tip:t,score:scoreTip(t,recipe,step,stepIndex,reviews)}))
  .filter(x=>x.score>=24)
  .sort((a,b)=>b.score-a.score||PRIORITY_SCORE[b.tip.priority]-PRIORITY_SCORE[a.tip.priority]||a.tip.id.localeCompare(b.tip.id));
 return ranked[0]?.tip;
}

export function selectContextualCookingTips(recipe:Recipe){
 const used=new Set<string>();
 return recipe.steps.map((step,index)=>{
  const tip=selectContextualCookingTip(recipe,step,index,used);
  if(tip)used.add(tip.id);
  return tip;
 });
}
