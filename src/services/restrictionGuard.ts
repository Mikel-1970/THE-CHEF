import type { Recipe } from '../domain/types';

const GROUPS:Record<string,string[]>={
  lacteos:['leche','queso','mantequilla','nata','yogur','lacteo','lacteos','crema de leche','paneer','mascarpone','pecorino','gruyer','mozzarella','parmesano','feta','cheddar'],
  gluten:['trigo','harina de trigo','pan','pasta','cuscus','bulgur','seitan','harina','espagueti','tagliatelle','lasana','penne','trofie','macarron','fideo','noqui','hojaldre','masa filo','galleta','bizcocho','salsa de soja','oblea'],
  huevo:['huevo','huevos','mayonesa','yema','clara pasteurizada'],
  huevos:['huevo','huevos','mayonesa'],
  frutossecos:['almendra','nuez','avellana','pistacho','cacahuete','anacardo','pinon'],
  cacahuete:['cacahuete','mani'],
  marisco:['gamba','langostino','camaron','centollo','cangrejo','mejillon','almeja','ostra','calamar','sepia','pulpo'],
  pescado:['pescado','merluza','salmon','bacalao','atun','bonito','lubina','dorada','sardina','anchoa','ventresca','dashi','worcestershire'],
  soja:['soja','tofu','tamari','miso'],
  sesamo:['sesamo','tahini'],
  apio:['apio'],
  mostaza:['mostaza']
};

export function recipeViolatesRestrictions(recipe:Recipe,restrictions?:string[]):string|undefined{
  if(!restrictions?.length)return;
  const haystack=normalize([recipe.title,recipe.description,...recipe.ingredients.map(i=>i.name)].join(' '));
  const animal=['pollo','ternera','cerdo','cordero','conejo','pato','carne','jamon','beicon','chorizo','morcilla','guanciale','gelatina',...GROUPS.pescado,...GROUPS.marisco];
  for(const raw of restrictions){
    const normalized=normalize(raw);
    if(/vegetarian|vegan/.test(normalized)){const blocked=/vegan/.test(normalized)?[...animal,...GROUPS.lacteos,...GROUPS.huevo,'miel']:animal;if(blocked.some(term=>containsTerm(haystack,term)))return raw;continue;}
    const terms=restrictionTerms(raw);
    if(!terms.length)continue;
    const hit=terms.find(term=>containsTerm(haystack,term));
    if(hit)return raw;
  }
  return;
}

export function assertRecipeRestrictions(recipe:Recipe,restrictions?:string[]):void{
  const violation=recipeViolatesRestrictions(recipe,restrictions);
  if(violation)throw new Error(`La receta generada entra en conflicto con la restricción “${violation}”. Pide otra propuesta.`);
}

function restrictionTerms(raw:string):string[]{
  let value=normalize(raw)
    .replace(/\b(sin|evitar|excluir|excluye|no quiero|no usar|alergia a|alergico a|alergica a|intolerancia a|intolerante a)\b/g,' ')
    .replace(/[^a-z0-9ñ ]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
  if(!value)return[];
  const compact=value.replace(/\s+/g,'');
  const group=GROUPS[compact]??GROUPS[value];
  if(group)return group.map(normalize);
  return value.split(/\s+y\s+|\s+o\s+|,/).map(v=>v.trim()).filter(v=>v.length>=2);
}
function containsTerm(text:string,term:string){
  const clean=normalize(term);
  if(clean.length<2)return false;
  return (` ${text} `).includes(` ${clean} `)||text.includes(clean);
}
function normalize(value:string){return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim()}
