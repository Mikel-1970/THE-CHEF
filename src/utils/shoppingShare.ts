import type { ShoppingListItem } from '../domain/types';
import { avatarName } from '../data/avatarNames';
import { formatQuantity } from './scaling';
const avatarIcons:Record<string,string>={shrimp:'🦐',dachshund:'🐶',tomato:'🍅','chef-woman':'👩‍🍳','chef-man':'👨‍🍳',avocado:'🥑',teapot:'🫖',chili:'🌶️',banana:'🍌',mushroom:'🍄',lemon:'🍋',crab:'🦀',moka:'☕',potato:'🥔',cupcake:'🧁',pan:'🍳'};
export function shoppingIcon(name:string):string {
 const n=name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const rules:[RegExp,string][]=[[/chocolate|cacao/,'🍫'],[/leche|nata|yogur/,'🥛'],[/huevo/,'🥚'],[/queso/,'🧀'],[/pan\b/,'🍞'],[/arroz/,'🍚'],[/pasta|espagueti|macarron/,'🍝'],[/pollo|pavo/,'🍗'],[/carne|ternera|cerdo/,'🥩'],[/pescado|salmon|merluza|atun/,'🐟'],[/gamba|langostino/,'🦐'],[/champi|seta/,'🍄'],[/tomate/,'🍅'],[/patata/,'🥔'],[/zanahoria/,'🥕'],[/cebolla/,'🧅'],[/ajo/,'🧄'],[/limon/,'🍋'],[/manzana/,'🍎'],[/platano/,'🍌'],[/aceite/,'🫒'],[/sal\b/,'🧂'],[/agua/,'💧']];
 return rules.find(([pattern])=>pattern.test(n))?.[1]??'🛒';
}
export function buildShoppingShareText(items:ShoppingListItem[],avatar?:string):string {
 return [`${avatarIcons[avatar??'chef-man']??'👨‍🍳'} ${avatarName(avatar)} · The Chef`,'','¡Hola! ¿Me ayudas con la compra? Para ponernos a cocinar, necesitamos:','',...items.filter(i=>!i.checked).map(i=>`${shoppingIcon(i.name)} ${i.name} — ${i.quantity!==undefined?`${formatQuantity(i.quantity)} ${i.unit??''}`.trim():'cantidad por confirmar'}`),'','¡Gracias! Yo me encargo de los fogones. 🍳'].join('\n');
}
export function isDefaultWater(name:string):boolean {return /^agua(?:\s+(?:potable|del grifo|fria|caliente|templada|hirviendo))?$/i.test(name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim());}
