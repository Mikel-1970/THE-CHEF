import {isChefChoice,matchesChosenCuisine,desireFoodText} from './chefChoice';
import type { CookingRequest, Proposal, Recipe } from '../domain/types';

const STOP=new Set([
 'quiero','quisiera','apetece','prepara','preparar','hacer','hazme','receta','plato','tipo','estilo','algo',
 'para','personas','persona','comensales','comensal','somos','unos','unas','una','uno','con','sin','que',
 'del','las','los','por','como','muy','mas','menos','facil','sencillo','sencilla','rapido','rapida',
 'moderno','moderna','tradicional','casero','casera','saludable','creativo','creativa','cena','comida',
 'desayuno','brunch','merienda','hoy','manana','esta','este','esto'
]);

const GROUPS=[
 ['tarta','pastel','bizcocho','coulant','fondant'],
 ['arroz','risotto','paella'],
 ['pasta','espagueti','spaghetti','macarron','macarrones','lasana','ravioli','tallarines'],
 ['pescado','merluza','salmon','bacalao','atun','dorada','lubina','rape'],
 ['marisco','gamba','gambas','langostino','langostinos','mejillon','mejillones','almeja','almejas'],
 ['pollo','ave','pavo'],
 ['carne','ternera','vacuno','cerdo','cordero'],
 ['sopa','crema','pure'],
 ['ensalada','ensaladilla'],
 ['pizza','focaccia']
].map(group=>group.map(root));

export function recipeMatchesDesireIntent(recipe:Recipe,request:CookingRequest){
 if(isChefChoice(request)&&!matchesChosenCuisine(recipe.cuisine,request.cuisine))return false;
 return textMatchesDesireIntent([
  recipe.title,recipe.description,recipe.cuisine,recipe.style,recipe.mealType,
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
 const required=[...concepts(query,true)];
 if(!required.length)return true;
 const candidate=concepts(candidateText,false);
 const matched=required.filter(concept=>candidate.has(concept)).length;
 // Una petición concreta debe conservar su núcleo culinario.
 // Con dos o más conceptos significativos exigimos dos coincidencias; con uno, ese concepto debe estar presente.
 return required.length===1?matched===1:matched>=2;
}

function concepts(value:string,removeStopwords:boolean){
 const out=new Set<string>();
 for(const token of normalize(value).split(/\s+/).filter(Boolean)){
  if(token.length<3||(removeStopwords&&STOP.has(token)))continue;
  const r=root(token);
  const groupIndex=GROUPS.findIndex(group=>group.includes(r));
  out.add(groupIndex>=0?`group:${groupIndex}`:`root:${r}`);
 }
 return out;
}

function normalize(value:string){
 return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ]+/g,' ').trim();
}
function root(value:string){return value.length>5?value.slice(0,5):value}
