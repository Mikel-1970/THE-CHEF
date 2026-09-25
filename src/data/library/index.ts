import type {Recipe} from '../../domain/types';
import data from './recipes.json' with {type:'json'};
export const chefLibrary:Recipe[]=data as Recipe[];
const ids=new Set(chefLibrary.map(recipe=>recipe.id));
export const isLibraryRecipe=(id:string)=>ids.has(id);
// A new revision also refreshes photographs held in the browser HTTP cache.
export function libraryImage(id:string,thumbnail=false){return isLibraryRecipe(id)?`${import.meta.env.BASE_URL}library/${id}${thumbnail?'_min':''}.webp?v=editorial-20260925`:undefined;}
