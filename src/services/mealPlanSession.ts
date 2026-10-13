import {useSyncExternalStore} from 'react';
import {emptyData,type PlanData,validateOptions,validateWeight,compatible,MEALS} from './mealPlan';
import {validateRecipe} from './recipeValidator';
let state:PlanData=emptyData();
const listeners=new Set<()=>void>();
export function setPlanData(next:PlanData){state=next;listeners.forEach(fn=>fn());}
export function usePlanData(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn)}},()=>state);}
const enc=new TextEncoder();
const to64=(b:Uint8Array)=>btoa(Array.from(b,v=>String.fromCharCode(v)).join(''));
const from64=(s:string)=>Uint8Array.from(atob(s),v=>v.charCodeAt(0));
async function keyFor(password:string,salt:Uint8Array){
 if(password.length<12)throw Error('Usa una contraseña de al menos 12 caracteres. No podemos recuperarla.');
 const material=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:salt as BufferSource,iterations:600000},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function encryptPlan(data:PlanData,password:string){
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await keyFor(password,salt),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(data)));
 return JSON.stringify({format:'the-chef-plan-v1',salt:to64(salt),iv:to64(iv),cipher:to64(new Uint8Array(cipher))});
}
export function validatePlanData(input:unknown):PlanData {
 const data=input as PlanData;
 if(!data||data.version!==1||!Array.isArray(data.weights)||data.weights.length>10000)throw Error('Copia no válida.');
 for(const w of data.weights)validateWeight(w.date,w.kg);
 if(new Set(data.weights.map(w=>w.date)).size!==data.weights.length)throw Error('Fechas de peso duplicadas.');
 if(data.maintenance){const m=data.maintenance;if(![m.rest,m.low,m.high].every(v=>Number.isFinite(v)&&v>0)||m.low>m.high||typeof m.method!=='string'||!Number.isFinite(Date.parse(m.calculatedAt)))throw Error('Estimación no válida.');}
 if(data.plan){const p=data.plan;validateOptions(p.options);
  if(!Array.isArray(p.options.restrictions)||!p.options.restrictions.every(s=>typeof s==='string')||!Array.isArray(p.options.preferred)||!['cuisine','style','likes'].every(k=>typeof p.options[k as 'cuisine']==='string')||!Array.isArray(p.slots)||p.slots.length!==p.options.weeks*7*p.options.meals.length)throw Error('Plan no válido.');
  const keys=new Set<string>();
  for(const s of p.slots){const key=s.day+':'+s.meal;if(!Number.isInteger(s.day)||s.day<0||s.day>=p.options.weeks*7||!MEALS.includes(s.meal)||!p.options.meals.includes(s.meal)||keys.has(key))throw Error('Calendario no válido.');keys.add(key);
   if(s.recipe&&(!validateRecipe(s.recipe).valid||!compatible(s.recipe,p.options,s.meal)))throw Error('La copia contiene una receta incompatible.');
  }
 }
 // Whitelist the envelope; imported HTML is never rendered.
 return {version:1,weights:data.weights,plan:data.plan,maintenance:data.maintenance};
}
export async function decryptPlan(raw:string,password:string):Promise<PlanData>{
 if(raw.length>10_000_000)throw Error('La copia es demasiado grande.');
 try{const file=JSON.parse(raw);if(file.format!=='the-chef-plan-v1'||typeof file.cipher!=='string')throw Error();
 const salt=from64(file.salt),iv=from64(file.iv);if(salt.length!==16||iv.length!==12)throw Error();
 const key=await keyFor(password,salt),plain=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,from64(file.cipher));
 return validatePlanData(JSON.parse(new TextDecoder().decode(plain)));
 }catch{throw Error('No se ha podido abrir la copia. Comprueba la contraseña y el archivo.');}
}
export function downloadPlan(text:string){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='the-chef-plan-cifrado.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
