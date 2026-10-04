import type { ShoppingListItem } from '../domain/types';
import { formatQuantity } from './scaling';

export function shoppingIcon(name:string):string {
 const n=name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const rules:[RegExp,string][]=[[/chocolate|cacao/,'🍫'],[/leche|nata|yogur/,'🥛'],[/huevo/,'🥚'],[/queso/,'🧀'],[/pan\b/,'🍞'],[/arroz/,'🍚'],[/pasta|espagueti|macarron/,'🍝'],[/pollo|pavo/,'🍗'],[/carne|ternera|cerdo/,'🥩'],[/pescado|salmon|merluza|atun/,'🐟'],[/gamba|langostino/,'🦐'],[/champi|seta/,'🍄'],[/tomate/,'🍅'],[/patata/,'🥔'],[/zanahoria/,'🥕'],[/cebolla/,'🧅'],[/ajo/,'🧄'],[/limon/,'🍋'],[/manzana/,'🍎'],[/platano/,'🍌'],[/aceite/,'🫒'],[/sal\b/,'🧂'],[/agua/,'💧']];
 return rules.find(([pattern])=>pattern.test(n))?.[1]??'🛒';
}

export function buildShoppingShareText(items:ShoppingListItem[],_avatar?:string):string {
 const pending=items.filter(i=>!i.checked);
 return [
  '¡A la mesa!',
  'Lista de la compra',
  '',
  ...pending.map(i=>`${shoppingIcon(i.name)} ${i.name} — ${i.quantity!==undefined?`${formatQuantity(i.quantity)} ${i.unit??''}`.trim():'cantidad por confirmar'}`)
 ].join('\n');
}

export async function buildShoppingShareImage(items:ShoppingListItem[]):Promise<File|undefined>{
 if(typeof document==='undefined')return undefined;
 const pending=items.filter(i=>!i.checked);
 const width=1080,pad=72,rowH=74;
 const height=Math.max(760,360+pending.length*rowH+pad);
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d');if(!ctx)return undefined;
 ctx.fillStyle='#f9f6ef';ctx.fillRect(0,0,width,height);
 ctx.fillStyle='#fffdf8';roundRect(ctx,42,42,width-84,height-84,34);ctx.fill();
 const logo=await loadImage(`${import.meta.env.BASE_URL}brand/a-la-mesa-logo.png`).catch(()=>undefined);
 if(logo){
  const maxW=410,maxH=250,scale=Math.min(maxW/logo.naturalWidth,maxH/logo.naturalHeight);
  const w=logo.naturalWidth*scale,h=logo.naturalHeight*scale;
  ctx.drawImage(logo,(width-w)/2,78,w,h);
 }
 ctx.fillStyle='#0f3d2e';ctx.textAlign='center';ctx.font='700 56px Georgia, serif';ctx.fillText('Lista de la compra',width/2,325);
 ctx.strokeStyle='rgba(15,61,46,.14)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pad,355);ctx.lineTo(width-pad,355);ctx.stroke();
 ctx.textAlign='left';let y=410;
 for(const item of pending){
  ctx.fillStyle='#eef1e2';roundRect(ctx,pad,y-40,width-pad*2,rowH-10,18);ctx.fill();
  ctx.fillStyle='#0f3d2e';ctx.font='600 34px system-ui, sans-serif';
  ctx.fillText(`${shoppingIcon(item.name)}  ${item.name}`,pad+24,y);
  ctx.textAlign='right';ctx.fillStyle='#68736d';ctx.font='500 28px system-ui, sans-serif';
  ctx.fillText(item.quantity!==undefined?`${formatQuantity(item.quantity)} ${item.unit??''}`.trim():'—',width-pad-24,y);
  ctx.textAlign='left';y+=rowH;
 }
 ctx.fillStyle='#68736d';ctx.textAlign='center';ctx.font='500 25px system-ui, sans-serif';ctx.fillText('¡A la mesa! · Todo lo que necesitas, a un toque',width/2,height-86);
 const blob=await new Promise<Blob|undefined>(resolve=>canvas.toBlob(value=>resolve(value??undefined),'image/png',.96));
 return blob?new File([blob],'a-la-mesa-lista-compra.png',{type:'image/png'}):undefined;
}

function loadImage(src:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('No se ha podido cargar el logo'));img.src=src})}
function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
export function isDefaultWater(name:string):boolean {return /^agua(?:\s+(?:potable|del grifo|fria|caliente|templada|hirviendo))?$/i.test(name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim());}
