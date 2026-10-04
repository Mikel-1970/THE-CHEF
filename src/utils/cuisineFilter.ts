import {CUISINES} from '../data/cookingOptions';
const normalized=(value:string)=>value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
export function canonicalCuisine(value:string):string{
 const name=normalized(value).replace(/^cocina\s+/,'');
 const aliases:Record<string,string>={thailandesa:'Tailandesa',thai:'Tailandesa',euskadi:'Vasca',euskera:'Vasca',galicia:'Gallega',asturias:'Asturiana'};
 return aliases[name]??CUISINES.find(c=>normalized(c)===name)??'Otras cocinas';
}
export function matchesCuisineFilter(actual:string,filter:string){
 return !filter||canonicalCuisine(actual)===filter;
}
