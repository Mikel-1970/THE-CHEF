import { cookingTips, loadBundledCookingTips } from '../data/cookingTips';
import { techniqueBasics } from '../data/techniqueBasics';
// Catálogo editorial versionado. Los datos personales no se mezclan con estas tablas.
export async function initializeCulinaryCatalog():Promise<void>{
 await loadBundledCookingTips();
 if(!('indexedDB' in window))return;
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('the-chef-culinary-catalog',1);request.onupgradeneeded=()=>{const database=request.result;database.createObjectStore('techniques',{keyPath:'id'});database.createObjectStore('tips',{keyPath:'id'});database.createObjectStore('metadata');};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Catálogo ocupado'));});
 try{
  const revision=await new Promise<unknown>((resolve,reject)=>{const r=db.transaction('metadata').objectStore('metadata').get('revision');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
  if(revision!=='2026-09-23.2')await new Promise<void>((resolve,reject)=>{const tx=db.transaction(['techniques','tips','metadata'],'readwrite');tx.objectStore('techniques').clear();tx.objectStore('tips').clear();techniqueBasics.forEach(t=>tx.objectStore('techniques').put(t));cookingTips.forEach(t=>tx.objectStore('tips').put(t));tx.objectStore('metadata').put('2026-09-23.2','revision');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});
  const [techniques,tips]=await Promise.all(['techniques','tips'].map(store=>new Promise<any[]>((resolve,reject)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})));
  if(techniques.length===techniqueBasics.length&&tips.length===cookingTips.length){techniqueBasics.splice(0,techniqueBasics.length,...techniques);cookingTips.splice(0,cookingTips.length,...tips);}
 }finally{db.close()}
}
