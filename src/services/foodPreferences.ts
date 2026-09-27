export type UnitPreference='metric'|'original';
export type NutritionDisplay='per-serving'|'whole-recipe'|'per-100g';
export type FoodPreferences={allergies:string[];intolerances:string[];avoidIngredients:string[];unitPreference:UnitPreference;nutritionDisplay:NutritionDisplay};
const KEY='chef:food-preferences:v1';
export const DEFAULT_FOOD_PREFERENCES:FoodPreferences={allergies:[],intolerances:[],avoidIngredients:[],unitPreference:'metric',nutritionDisplay:'per-serving'};
export function loadFoodPreferences():FoodPreferences{
 try{const raw=localStorage.getItem(KEY);const p=raw?JSON.parse(raw) as Partial<FoodPreferences>:{};return{
  allergies:Array.isArray(p.allergies)?p.allergies.filter((v):v is string=>typeof v==='string'):[],
  intolerances:Array.isArray(p.intolerances)?p.intolerances.filter((v):v is string=>typeof v==='string'):[],
  avoidIngredients:Array.isArray(p.avoidIngredients)?p.avoidIngredients.filter((v):v is string=>typeof v==='string'):[],
  unitPreference:p.unitPreference==='original'?'original':'metric',
  nutritionDisplay:p.nutritionDisplay==='whole-recipe'||p.nutritionDisplay==='per-100g'?p.nutritionDisplay:'per-serving'
 };}catch{return DEFAULT_FOOD_PREFERENCES;}
}
export function saveFoodPreferences(value:FoodPreferences){localStorage.setItem(KEY,JSON.stringify(value));window.dispatchEvent(new CustomEvent('chef:food-preferences'))}

const ALLERGY_RESTRICTIONS:Record<string,string>={
 Gluten:'Sin gluten',Crustáceos:'Sin crustáceos',Huevos:'Sin huevo',Pescado:'Sin pescado',Cacahuetes:'Sin cacahuete',Soja:'Sin soja',Leche:'Sin lácteos','Frutos de cáscara':'Sin frutos secos',Apio:'Sin apio',Mostaza:'Sin mostaza',Sésamo:'Sin sésamo',Sulfitos:'Sin sulfitos',Altramuces:'Sin altramuces',Moluscos:'Sin moluscos'
};
export function foodPreferenceRestrictions(value:FoodPreferences=loadFoodPreferences()):string[]{
 return Array.from(new Set([
  ...value.allergies.map(a=>ALLERGY_RESTRICTIONS[a]??`Alergia a ${a}`),
  ...value.intolerances.map(v=>`Intolerancia a ${v}`),
  ...value.avoidIngredients.map(v=>`Evitar ${v}`)
 ]));
}
