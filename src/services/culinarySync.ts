import {cookingTips} from '../data/cookingTips';
import {techniqueBasics} from '../data/techniqueBasics';
const endpoint=()=>new URL('api/culinary-catalog',new URL(import.meta.env.BASE_URL,location.origin));
const pendingKey='chef:tip-reviews-outbox:v2';
const reviewKey='chef:tip-reviews:v2';
let inFlight:Promise<void>|undefined;
function pending():Record<string,'keep'|'hide'|'pending'>{try{return JSON.parse(localStorage.getItem(pendingKey)||'{}')}catch{return {}}}
export function queueTipReview(id:string,state:'keep'|'hide'|'pending'){
 const outbox=pending();outbox[id]=state;localStorage.setItem(pendingKey,JSON.stringify(outbox));void synchronizeCulinaryCatalog();
}
function validV2Tip(t:any){
 return !!t&&typeof t.id==='string'&&/^tip-v2-\d{3}$/.test(t.id)&&typeof t.title==='string'&&typeof t.text==='string'&&Array.isArray(t.tags)&&t.triggers&&Array.isArray(t.triggers.techniques);
}
export function synchronizeCulinaryCatalog():Promise<void>{
 if(!__PRIVATE_PREVIEW__)return Promise.resolve();
 if(inFlight)return inFlight;
 let retry=false;
 inFlight=(async()=>{try{
  const response=await fetch(endpoint(),{credentials:'same-origin',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('Sin conexión al catálogo');
  const data=await response.json();
  if(!Array.isArray(data.tips)||!Array.isArray(data.techniques)||typeof data.reviews!=='object')throw new Error('Catálogo no válido');
  const remoteV2=data.tips.length>=150&&data.tips.every(validV2Tip);
  if(remoteV2)cookingTips.splice(0,cookingTips.length,...data.tips);
  if(data.techniques.length&&data.techniques.every((t:any)=>typeof t.id==='string'&&Array.isArray(t.steps)))techniqueBasics.splice(0,techniqueBasics.length,...data.techniques);

  if(!remoteV2){
   // La app conserva la biblioteca v2 incluida y las valoraciones locales.
   // La cola se mantiene para sincronizarla cuando D1 reciba el catálogo v2.
   window.dispatchEvent(new CustomEvent('chef:catalog-sync',{detail:'local'}));
   return;
  }

  for(const [id,state] of Object.entries(pending())){
   const saved=await fetch(endpoint(),{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,state}),signal:AbortSignal.timeout(8000)});
   if(!saved.ok)throw new Error('No se ha sincronizado');
   const outbox=pending();
   if(outbox[id]===state){delete outbox[id];localStorage.setItem(pendingKey,JSON.stringify(outbox))}
  }
  const reviews={...data.reviews};
  for(const[id,state]of Object.entries(pending())){if(state==='pending')delete reviews[id];else reviews[id]=state;}
  localStorage.setItem(reviewKey,JSON.stringify({...reviews,...JSON.parse(localStorage.getItem(reviewKey)||'{}')}));
  retry=Object.keys(pending()).length>0;
  window.dispatchEvent(new CustomEvent('chef:catalog-sync',{detail:retry?'pending':'synced'}));
 }catch{window.dispatchEvent(new CustomEvent('chef:catalog-sync',{detail:'pending'}))}})().finally(()=>{
  inFlight=undefined;if(retry)void synchronizeCulinaryCatalog();
 });
 return inFlight;
}
