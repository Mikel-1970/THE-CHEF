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
 if(request.mode!=='desire')return true;
 const query=(request.desireText??'').split('\n')[0].trim();
 if(!query)return true;
 const roots=meaningfulRoots(query);
 if(!roots.length)return true;
 const candidateRoots=expandedRoots(candidateText);
 const matched=roots.filter(token=>candidateRoots.has(token)).length;
 // Una petición concreta debe conservar al menos su núcleo culinario.
 // Con dos o más términos significativos exigimos dos coincidencias para evitar sustituciones ajenas.
 return roots.length===1?matched>=1:matched>=2;
}

function meaningfulRoots(value:string){
 const tokens=normalize(value).split(/\s+/).filter(Boolean);
 const roots=[...new Set(tokens.filter(token=>token.length>=3&&!STOP.has(token)).map(root))];
 return expandAliases(roots);
}

function expandedRoots(value:string){
 const base=new Set(normalize(value).split(/\s+/).filter(token=>token.length>=3).map(root));
 for(const group of GROUPS){
  if(group.some(token=>base.has(token)))group.forEach(token=>base.add(token));
 }
 return base;
}

function expandAliases(roots:string[]){
 const result=new Set(roots);
 for(const group of GROUPS){
  if(group.some(token=>result.has(token)))group.forEach(token=>result.add(token));
 }
 return [...result];
}

function normalize(value:string){
 return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ]+/g,' ').trim();
}

function root(value:string){return value.length>5?value.slice(0,5):value}
