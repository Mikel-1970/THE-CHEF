import type {Proposal} from '../domain/types';
const normalize=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export const PHOTO_INGREDIENT_RULES='Identifica primero el tipo de plato. La foto no permite saber todos sus ingredientes: distingue lo visible de lo probable por la receta tradicional. En usedIngredients incluye solo ingredientes identificables con suficiente confianza; en missingIngredients, ingredientes plausibles que necesitan confirmación. No incluyas básicos de despensa por defecto. En un postre no supongas ajo, cebolla o pimienta, salvo evidencia clara o confirmación explícita. No inventes condimentos invisibles. Explica la incertidumbre en el subtítulo.';
export function reviewPhotoProposal(proposal:Proposal,correction=''):Proposal {
 const sweet=/postre|tarta|tatin|bizcocho|helado|chantilly|mousse|flan|natillas|pastel|muffin|donut/.test(normalize(proposal.title));
 const confirmed=normalize(correction);
 const allowed=(name:string)=>!sweet||!(/\b(ajo|cebolla|pimienta)\b/.test(normalize(name)))||confirmed.includes(normalize(name));
 return {...proposal,usedIngredients:proposal.usedIngredients.filter(allowed),missingIngredients:proposal.missingIngredients.filter(allowed)};
}

export function assertPhotoSeasonings(title:string,ingredients:string[],confirmed:string[]){const sweet=/postre|tarta|tatin|bizcocho|helado|chantilly|mousse|flan|natillas|pastel|muffin|donut/.test(normalize(title));if(!sweet)return;const extra=ingredients.filter(name=>['ajo','cebolla','pimienta'].some(word=>new RegExp('\\b'+word+'\\b').test(normalize(name))&&!confirmed.some(c=>new RegExp('\\b'+word+'\\b').test(normalize(c)))));if(extra.length)throw Error('La IA añadió condimentos no confirmados ('+extra.join(', ')+'). No se ha guardado la receta. Revisa los ingredientes y vuelve a intentarlo.');}
