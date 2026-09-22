import type {StockLocation} from '../domain/types';
export function inferStockLocation(name:string):StockLocation {
 const n=name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 if(/\b(abiert[oa]s?|cocid[oa]s?|sobras|fresc[oa]s?|refrigerad[oa]s?)\b/.test(n))return 'fridge';
 if(/\b(harina|arroz|pasta|macarrones|espaguetis|fideos|quinoa|avena|cereales|semola|almendras|nueces|avellanas|pistachos|aceite|vinagre|sal|azucar|cafe|te|cacao|chocolate|conservas?|latas?|galletas?|pan|lentejas|garbanzos|alubias|especias|pimienta|patata|patatas|cebolla|cebollas|ajo|ajos)\b/.test(n))return 'pantry';
 if(/\b(uht|esterilizada)\b/.test(n)&&/sin abrir|cerrad/.test(n))return 'pantry';
 return 'fridge';
}
