import type {Recipe} from '../domain/types';
export const DISH_CATEGORIES=['Todos','Arroces','Pastas','Panes','Carnes','Pescados y mariscos','Guisos','Verduras y ensaladas','Tapas y huevos','Sopas y cremas','Alta cocina','Bizcochos, muffins y donuts','Postres','Cócteles','Otros'];
const normalized=(s:string)=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export function dishCategory(recipe:Recipe):string {
 const title=normalized(recipe.title);
 if(/\b(bizcocho\w*|muffin\w*|donut\w*|donas?|magdalena\w*)\b/.test(title))return 'Bizcochos, muffins y donuts';
 if(/^(pan\b|panes\b|panecillo\w*|baguette\w*|focaccia\w*|brioche\w*|chapata\w*)/.test(title))return 'Panes';
 if(recipe.libraryCategory)return ({Pescados:'Pescados y mariscos',Verduras:'Verduras y ensaladas'} as Record<string,string>)[recipe.libraryCategory]??recipe.libraryCategory;
 if(recipe.recipeKind==='cocktail')return 'Cócteles';
 if(recipe.recipeKind==='dessert')return 'Postres';
 if(/arroz|paella|risotto/.test(title))return 'Arroces';
 if(/pasta|espagueti|macarron|tallarin|lasana|ravioli/.test(title))return 'Pastas';
 if(/ensalada|verdura|pisto|ratatouille/.test(title))return 'Verduras y ensaladas';
 if(/sopa|crema de (calab|verdura|zanahoria|puerro)|gazpacho|salmorejo/.test(title))return 'Sopas y cremas';
 if(/guiso|cocido|estofado|potaje|lenteja|garbanzo/.test(title))return 'Guisos';
 if(/pescado|lubina|salmon|merluza|bacalao|atun|dorada|marisco|gamba|langostino|mejillon|almeja|calamar|sepia|pulpo|bonito|bogavante/.test(title))return 'Pescados y mariscos';
 if(/pollo|ternera|cerdo|cordero|carne|pavo/.test(title))return 'Carnes';
 if(/tortilla|huevo|tapa|croqueta/.test(title))return 'Tapas y huevos';
 if(/postre|tarta|helado|chocolate|flan|natillas/.test(title))return 'Postres';
 return 'Otros';
}
export function matchesDishCategory(recipe:Recipe,category:string){return category==='Todos'||(category==='Alta cocina'?(normalized(recipe.style)==='alta cocina'||recipe.libraryCategory==='Alta cocina'):dishCategory(recipe)===category);}
