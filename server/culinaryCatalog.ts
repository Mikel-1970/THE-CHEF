import {previewSession,type PreviewEnv} from './previewSession';
type Statement={bind(...values:unknown[]):Statement;all<T>():Promise<{results:T[]}>;first<T>():Promise<T|null>;run():Promise<unknown>};
export type CatalogEnv=PreviewEnv&{CHEF_CATALOG?:{prepare(sql:string):Statement}};
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
export async function culinaryApi(request:Request,env:CatalogEnv,authenticate=previewSession):Promise<Response>{
 const auth=await authenticate(request,env);if(!auth.ok)return auth;
 const identity=await auth.json() as {user:{email:string}};
 if(!env.CHEF_CATALOG)return json({error:'Catálogo central no disponible.'},503);
 const db=env.CHEF_CATALOG;
 if(request.method==='GET'){
  const [techniques,tips,reviews]=await Promise.all([db.prepare('SELECT payload FROM culinary_techniques ORDER BY id').all<{payload:string}>(),db.prepare('SELECT payload FROM culinary_tips ORDER BY id').all<{payload:string}>(),db.prepare('SELECT tip_id, state FROM tip_reviews WHERE user_id = ?').bind(identity.user.email).all<{tip_id:string;state:string}>()]);
  return json({techniques:techniques.results.map(r=>JSON.parse(r.payload)),tips:tips.results.map(r=>JSON.parse(r.payload)),reviews:Object.fromEntries(reviews.results.filter(r=>r.state!=='pending').map(r=>[r.tip_id,r.state]))});
 }
 if(request.method!=='PUT')return json({error:'Método no permitido.'},405);
 if(request.headers.get('Origin')!==new URL(request.url).origin||!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'Origen no válido.'},403);
 const raw=await request.text();if(raw.length>512)return json({error:'Solicitud demasiado grande.'},413);
 let body:{id?:unknown;state?:unknown};try{body=JSON.parse(raw)}catch{return json({error:'Solicitud no válida.'},400)}
 if(!body||typeof body.id!=='string'||!/^tip-\d{1,4}$/.test(body.id)||!['keep','hide','pending'].includes(String(body.state)))return json({error:'Valoración no válida.'},400);
 if(!await db.prepare('SELECT id FROM culinary_tips WHERE id = ?').bind(body.id).first())return json({error:'Consejo no encontrado.'},404);
 await db.prepare("INSERT INTO tip_reviews (user_id,tip_id,state) VALUES (?,?,?) ON CONFLICT(user_id,tip_id) DO UPDATE SET state=excluded.state, updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')").bind(identity.user.email,body.id,body.state).run();
 return json({saved:true,id:body.id,state:body.state});
}
