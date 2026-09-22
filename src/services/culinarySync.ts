import {cookingTips} from '../data/cookingTips';
import {techniqueBasics} from '../data/techniqueBasics';
const endpoint=()=>new URL('api/culinary-catalog',new URL(import.meta.env.BASE_URL,location.origin));
const pendingKey='chef:tip-reviews-outbox:v1';
let inFlight:Promise<void>|undefined;
function pending():Record<string,'keep'|'hide'|'pending'>{try{return JSON.parse(localStorage.getItem(pendingKey)||'{}')}catch{return {}}}
export function queueTipReview(id:string,state:'keep'|'hide'|'pending'){const outbox=pending();outbox[id]=state;localStorage.setItem(pendingKey,JSON.stringify(outbox));void synchronizeCulinaryCatalog();}
export function synchronizeCulinaryCatalog():Promise<void>{
 if(!__PRIVATE_PREVIEW__)return Promise.resolve();
 if(inFlight)return inFlight;
 let retry=false;inFlight=(async()=>{try{
  for(const [id,state] of Object.entries(pending())){const response=await fetch(endpoint(),{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,state}),signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error('No se ha sincronizado');const outbox=pending();if(outbox[id]===state){delete outbox[id];localStorage.setItem(pendingKey,JSON.stringify(outbox))}}
  const response=await fetch(endpoint(),{credentials:'same-origin',signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error('Sin conexión al catálogo');const data=await response.json();
  if(!Array.isArray(data.tips)||!Array.isArray(data.techniques)||typeof data.reviews!=='object')throw new Error('Catálogo no válido');
  if(data.tips.length&&data.tips.every((t:any)=>typeof t.id==='string'&&typeof t.text==='string'&&typeof t.source==='string'))cookingTips.splice(0,cookingTips.length,...data.tips);
  if(data.techniques.length&&data.techniques.every((t:any)=>typeof t.id==='string'&&Array.isArray(t.steps)))techniqueBasics.splice(0,techniqueBasics.length,...data.techniques);
  const reviews={...data.reviews};for(const[id,state]of Object.entries(pending())){if(state==='pending')delete reviews[id];else reviews[id]=state;}localStorage.setItem('chef:tip-reviews:v1',JSON.stringify(reviews));
  retry=Object.keys(pending()).length>0;window.dispatchEvent(new CustomEvent('chef:catalog-sync',{detail:retry?'pending':'synced'}));
 }catch{window.dispatchEvent(new CustomEvent('chef:catalog-sync',{detail:'pending'}))}})().finally(()=>{inFlight=undefined;if(retry)void synchronizeCulinaryCatalog()});return inFlight;
}
