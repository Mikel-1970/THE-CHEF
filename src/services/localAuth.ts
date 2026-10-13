const KEY='chef:local-credential:v2';
const ITERATIONS=150000;

type StoredCredential={user:string;salt:string;hash:string;iterations:number};

export function hasLocalCredential(user?:string):boolean{
  const credential=readCredential();
  if(!credential)return false;
  return user?normalize(credential.user)===normalize(user):true;
}

export async function saveLocalCredential(user:string,password:string):Promise<void>{
  const cleanUser=user.trim();
  if(!cleanUser||!password)throw new Error('Usuario y contraseña son obligatorios.');
  if(!globalThis.crypto?.subtle)throw new Error('Este navegador no permite proteger la contraseña localmente.');
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const hash=await derive(password,salt,ITERATIONS);
  const record:StoredCredential={user:cleanUser,salt:toBase64(salt),hash:toBase64(hash),iterations:ITERATIONS};
  localStorage.setItem(KEY,JSON.stringify(record));
}

export async function verifyLocalCredential(user:string,password:string):Promise<boolean>{
  const credential=readCredential();
  if(!credential||normalize(credential.user)!==normalize(user))return false;
  if(!globalThis.crypto?.subtle)return false;
  try{
    const expected=fromBase64(credential.hash);
    const actual=await derive(password,fromBase64(credential.salt),credential.iterations||ITERATIONS);
    return timingSafeEqual(expected,actual);
  }catch{return false}
}

export function clearLocalCredential():void{
  try{localStorage.removeItem(KEY)}catch{/* best effort */}
}

function readCredential():StoredCredential|undefined{
  try{
    const raw=localStorage.getItem(KEY); if(!raw)return;
    const parsed=JSON.parse(raw) as Partial<StoredCredential>;
    if(typeof parsed.user!=='string'||typeof parsed.salt!=='string'||typeof parsed.hash!=='string')return;
    return{user:parsed.user,salt:parsed.salt,hash:parsed.hash,iterations:Number(parsed.iterations)||ITERATIONS};
  }catch{return}
}

async function derive(password:string,salt:Uint8Array,iterations:number):Promise<Uint8Array>{
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new Uint8Array(salt),iterations},key,256);
  return new Uint8Array(bits);
}

function timingSafeEqual(a:Uint8Array,b:Uint8Array):boolean{
  if(a.length!==b.length)return false;
  let diff=0; for(let i=0;i<a.length;i+=1)diff|=a[i]^b[i];
  return diff===0;
}
function toBase64(bytes:Uint8Array):string{let binary='';bytes.forEach(v=>binary+=String.fromCharCode(v));return btoa(binary)}
function fromBase64(value:string):Uint8Array{const binary=atob(value);return Uint8Array.from(binary,c=>c.charCodeAt(0))}
function normalize(value:string){return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
