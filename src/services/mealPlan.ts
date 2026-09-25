import type {IngredientInput, Recipe, ShoppingListItem} from '../domain/types';
import foodsJson from '../data/library/nutrition-ingredients.json' with {type:'json'};
import {recipeViolatesRestrictions} from './restrictionGuard';
import {matchesChosenCuisine} from '../utils/chefChoice';
import {scaleQuantity} from '../utils/scaling';
import {normalizeShoppingItem} from '../utils/shoppingQuantity';

export const MEALS = ['Desayuno','Comida','Merienda','Cena'] as const;
export type Meal = typeof MEALS[number];
export const NUTRIENTS = ['kcal','proteinG','carbsG','fatG','fiberG'] as const;
export type Nutrients = Record<typeof NUTRIENTS[number],number|null>;
export type Goal = {kcal:number; proteinG?:number; carbsG?:number; fatG?:number; origin:string; confirmedAt:string};
export type Maintenance = {rest:number;low:number;high:number;method:string;calculatedAt:string};
export type PlanOptions = {weeks:number;servings:number;meals:Meal[];shares:Record<Meal,number>;goal?:Goal;restrictions:string[];cuisine:string;style:string;likes:string;maxMinutes?:number;preferred:string[]};
export type PlanSlot = {day:number;meal:Meal;recipe?:Recipe};
export type Plan = {options:PlanOptions;slots:PlanSlot[];createdAt:string};
export type WeightEntry = {date:string;kg:number};
export type PlanData = {version:1;plan?:Plan;maintenance?:Maintenance;weights:WeightEntry[]};
export const emptyData = ():PlanData=>({version:1,weights:[]});
export const normalize=(s:string)=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const positive=(n:number)=>Number.isFinite(n)&&n>0;
export const ACTIVITY = [
 {label:'Ligera · trabajo sentado y desplazamientos suaves',range:[1.4,1.69]},
 {label:'Moderada · actividad cotidiana y ejercicio habitual',range:[1.7,1.99]},
 {label:'Intensa · trabajo físico o ejercicio intenso habitual',range:[2,2.4]}
] as const;
export function estimateMaintenance(weight:number,height:number,age:number,sex:'female'|'male',activity:number,eligible:boolean):Maintenance {
 if(!eligible||!Number.isInteger(age)||age<19||age>78||!positive(weight)||!positive(height)||!ACTIVITY[activity]||!['female','male'].includes(sex))throw Error('Calculadora limitada a adultos de 19–78 años sin situaciones especiales. Puedes planificar sin calculadora.');
 // Unit/input sanity limits, not clinical eligibility or recommended weight ranges.
 if(height<50||height>250||weight<20||weight>500)throw Error('Revisa las unidades: peso en kg y altura en cm. Puedes continuar sin calculadora.');
 const rest=9.99*weight+6.25*height-4.92*age+(sex==='male'?5:-161);
 if(!positive(rest))throw Error('Revisa los datos de la calculadora.');
 const [lo,hi]=ACTIVITY[activity].range;
 return {rest:Math.round(rest),low:Math.round(rest*lo),high:Math.round(rest*hi),method:`Mifflin–St Jeor 1990 (REE); aproximación REE × intervalo PAL FAO 2004 (${lo}–${hi}). PAL se define sobre BMR, no REE: aproximación orientativa. No se añade ejercicio otra vez.`,calculatedAt:new Date().toISOString()};
}
export function validateOptions(o:PlanOptions){
 if(!Number.isInteger(o.weeks)||o.weeks<1||o.weeks>4||!Number.isInteger(o.servings)||o.servings<1||o.servings>24)throw Error('Elige 1–4 semanas y 1–24 comensales.');
 if(!o.meals.length||new Set(o.meals).size!==o.meals.length||o.meals.some(m=>!MEALS.includes(m)))throw Error('Selecciona las comidas que quieres planificar.');
 if(o.maxMinutes!==undefined&&!positive(o.maxMinutes))throw Error('Revisa el tiempo disponible.');
 if(o.goal){
  if(!positive(o.goal.kcal)||!['Lo he decidido yo','Me lo ha indicado un profesional','Otro'].includes(o.goal.origin)||!Number.isFinite(Date.parse(o.goal.confirmedAt)))throw Error('Confirma un objetivo energético válido y su origen.');
  for(const k of ['proteinG','carbsG','fatG'] as const)if(o.goal[k]!==undefined&&(!Number.isFinite(o.goal[k])||o.goal[k]!<0))throw Error('Los macronutrientes deben ser números no negativos.');
  const macroEnergy=(o.goal.proteinG??0)*4+(o.goal.carbsG??0)*4+(o.goal.fatG??0)*9;
  if(macroEnergy>o.goal.kcal*1.05)throw Error('Los macros introducidos superan la energía elegida. Revisa ambos objetivos.');
  const coverage=o.meals.reduce((sum,m)=>sum+o.shares[m],0);
  if(o.meals.some(m=>!positive(o.shares[m]))||coverage>100.001)throw Error('Indica porcentajes positivos que sumen como máximo 100 %.');
 }
}
type Food={basis:string;per100:Partial<Record<typeof NUTRIENTS[number],number>>;gramsPerUnitEstimate?:number;densityEstimate?:number;edibleFractionEstimate:number};
const foods=foodsJson as Record<string,Food>;
const foodNames=Object.fromEntries(Object.entries(foods).map(([name,food])=>[normalize(name),food]));
// Recompute the actual culinary quantities, including rounding, rather than multiplying rounded label values.
export function recipeNutrition(recipe:Recipe,servings:number):Nutrients {
 const totals:Nutrients={kcal:0,proteinG:0,carbsG:0,fatG:0,fiberG:0};
 for(const i of recipe.ingredients.filter(i=>!i.optional)){
  const food=foodNames[normalize(i.name)];let q=scaleQuantity(i,recipe.baseServings,servings),known=!!food;
  if(food){
   if(i.unit==='unidad') {if(food.gramsPerUnitEstimate)q*=food.gramsPerUnitEstimate;else known=false;}
   else if(i.unit==='ml'&&food.basis!=='100ml'){if(food.densityEstimate)q*=food.densityEstimate;else known=false;}
   else if(!['g','ml'].includes(i.unit))known=false;
   q*=food.edibleFractionEstimate;
   if(i.name.includes('freír')||(['lib-051','lib-055'].includes(recipe.id)&&i.name==='aceite de oliva'))q=Math.min(q,servings*10);
  }
  for(const k of NUTRIENTS){const v=food?.per100[k];if(!known||typeof v!=='number'||!Number.isFinite(v))totals[k]=null;else if(totals[k]!==null)totals[k]!+=v*q/100/servings;}
 }
 return totals;
}
export function sumNutrition(values:Nutrients[]):Nutrients {
 return Object.fromEntries(NUTRIENTS.map(k=>[k,!values.length||values.some(v=>v[k]===null)?null:values.reduce((s,v)=>s+v[k]!,0)])) as Nutrients;
}
export const unknownNutrition=():Nutrients=>({kcal:null,proteinG:null,carbsG:null,fatG:null,fiberG:null});
const extraAllergens:Record<string,string[]>={
 'Sin gluten':['avena','centeno','cebada','malta','espelta','seitan'],
 'Sin leche':['leche','queso','nata','mantequilla','yogur','suero','caseina','lactosa','parmesano'],
 'Sin crustáceos':['gamba','langostino','camaron','cangrejo','bogavante','langosta','carabinero'],
 'Sin moluscos':['calamar','sepia','pulpo','mejillon','almeja','ostra','berberecho','vieira','caracol'],
 'Sin altramuces':['altramuz','altramuces','lupino'],
 'Sin sulfitos':['vino','vinagre','sidra','cerveza','sulfito'],
 'Sin frutos secos':['nueces','nuez','almendra','avellana','pistacho','anacardo','pecana','macadamia','castana'],
};
export const ALLERGENS=['Sin gluten','Sin lácteos','Sin huevo','Sin cacahuete','Sin frutos secos','Sin pescado','Sin crustáceos','Sin moluscos','Sin soja','Sin sésamo','Sin apio','Sin mostaza','Sin altramuces','Sin sulfitos'];
export function compatible(r:Recipe,o:PlanOptions,meal:Meal){
 if(!r.ingredients.length||r.recipeKind==='cocktail'||r.alcohol)return false;
 if((meal==='Comida'||meal==='Cena')&&/\b(tarta|tartaleta|bizcocho|brownie|helado|flan|natillas|tiramis[uú]|postre|cocktail|coctel)\b/.test(normalize(r.title)))return false;
 if((meal==='Comida'||meal==='Cena')?(r.recipeKind==='dessert'||!['Comida','Cena','Brunch'].includes(r.mealType)):!([meal,'Brunch'] as string[]).includes(r.mealType))return false;
 if(!matchesChosenCuisine(r.cuisine,o.cuisine)||o.maxMinutes&&r.prepMinutes+r.cookMinutes>o.maxMinutes)return false;
 if(o.style&&normalize(r.style)!==normalize(o.style))return false;
 if(recipeViolatesRestrictions(r,o.restrictions))return false;
 const hay=normalize(r.ingredients.map(i=>i.name).join(' '));
 if(o.restrictions.some(a=>extraAllergens[a]?.some(t=>hay.includes(t))))return false;
 // Composite ingredients have no complete allergen declarations: fail closed when an allergy is selected.
 if(o.restrictions.some(a=>ALLERGENS.includes(a))&&(/caldo|salsa|masa|embutido|chorizo|morcilla|surimi|pesto|curry|mayonesa|pan rallado/.test(hay)||r.ingredients.some(i=>!foodNames[normalize(i.name)])))return false;
 return true;
}
export function chooseRecipe(catalog:Recipe[],o:PlanOptions,meal:Meal,used:string[],exclude?:string):Recipe|undefined {
 const target=o.goal?o.goal.kcal*o.shares[meal]/100:undefined;
 const rank=(r:Recipe)=>{
  const n=recipeNutrition(r,o.servings);let score=used.filter(id=>id===r.id).length*8+(n.kcal===null?100:0);
  if(r.libraryCategory){score+=used.filter(id=>catalog.find(item=>item.id===id)?.libraryCategory===r.libraryCategory).length*.6;if(catalog.find(item=>item.id===used.at(-1))?.libraryCategory===r.libraryCategory)score+=1;}
  if(target)score+=n.kcal===null?100:Math.abs(n.kcal-target)/target;
  if(o.goal)for(const k of ['proteinG','carbsG','fatG'] as const){const t=o.goal[k];if(t&&n[k]!==null)score+=Math.abs(n[k]!-t*o.shares[meal]/100)/t;}
  if(o.preferred.includes(r.id))score-=.3;
  if(o.likes&&normalize(r.title+' '+r.ingredients.map(i=>i.name).join(' ')).includes(normalize(o.likes)))score-=.2;
  return score;
 };
 return catalog.filter(r=>r.id!==exclude&&compatible(r,o,meal)&&(!['Comida','Cena'].includes(meal)||r.recipeKind==='dish')).map(r=>({r,score:rank(r)})).sort((a,b)=>a.score-b.score||a.r.id.localeCompare(b.r.id))[0]?.r;
}
export function makePlan(o:PlanOptions,catalog:Recipe[]):Plan {
 validateOptions(o);const slots:PlanSlot[]=[];
 for(let day=0;day<o.weeks*7;day++)for(const meal of o.meals)slots.push({day,meal,recipe:chooseRecipe(catalog,o,meal,slots.flatMap(s=>s.recipe?[s.recipe.id]:[]))});
 return {options:structuredClone(o),slots,createdAt:new Date().toISOString()};
}
function quantity(q:number,u:string){const unit=normalize(u).replace(/\.$/,'');if(['kg','kilogramo','kilogramos'].includes(unit))return {q:q*1000,u:'g'};if(['l','litro','litros'].includes(unit))return{q:q*1000,u:'ml'};if(['u','ud','uds','unidad','unidades'].includes(unit))return{q,u:'unidad'};return{q,u:unit};}
export function planShopping(plan:Plan,stock:IngredientInput[]=[],subtract=false):ShoppingListItem[]{
 const rows=new Map<string,ShoppingListItem>();
 for(const slot of plan.slots)if(slot.recipe)for(const i of slot.recipe.ingredients.filter(i=>!i.optional)){
  const v=quantity(scaleQuantity(i,slot.recipe.baseServings,plan.options.servings),i.unit),key=normalize(i.name)+'|'+v.u;
  const old=rows.get(key);rows.set(key,{id:'meal-plan:'+key,name:i.name,unit:v.u,quantity:(old?.quantity??0)+v.q,checked:false});
 }
 if(subtract)for(const s of stock){if(s.quantity===undefined||!s.unit)continue;const v=quantity(s.quantity,s.unit),key=normalize(s.name)+'|'+v.u,old=rows.get(key);if(old)old.quantity=Math.max(0,old.quantity!-v.q);}
 return [...rows.values()].filter(i=>i.quantity!>0).map(normalizeShoppingItem);
}
export function validateWeight(date:string,kg:number){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date>new Date().toISOString().slice(0,10)||!positive(kg))throw Error('Indica una fecha válida no futura y un peso positivo en kg.');}
