import type {ShoppingListItem} from '../domain/types';
export function isCountUnit(unit?:string){return /^(ud|uds|u|unidad|unidades|paquetes?|botes?|latas?|manojos?|piezas?|dientes?|huevos?)\.?$/i.test(unit?.trim()??'');}
export function normalizeShoppingItem(item:ShoppingListItem):ShoppingListItem{return isCountUnit(item.unit)?{...item,quantity:Math.max(1,Math.ceil(item.quantity??1))}:item;}
