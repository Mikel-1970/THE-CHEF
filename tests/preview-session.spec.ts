import { test, expect } from '@playwright/test';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import { previewSession } from '../server/previewSession';
const env={CHEF_ACCESS_ISSUER:'https://chef-test.cloudflareaccess.com',CHEF_ACCESS_AUD:'preview-audience',CHEF_ADMIN_EMAIL:'admin@example.test',CHEF_ADMIN_NAME:'Mikel'};
let pair: Awaited<ReturnType<typeof generateKeyPair>>;
let keys: ReturnType<typeof createLocalJWKSet>;
test.beforeAll(async()=>{pair=await generateKeyPair('RS256');keys=createLocalJWKSet({keys:[{...await exportJWK(pair.publicKey),kid:'test',alg:'RS256'}]})});
async function token(claims:Record<string,unknown>={}) {return new SignJWT({email:'admin@example.test',sub:'owner',iss:env.CHEF_ACCESS_ISSUER,aud:env.CHEF_ACCESS_AUD,exp:Math.floor(Date.now()/1000)+300,...claims}).setProtectedHeader({alg:'RS256',kid:'test'}).sign(pair.privateKey)}
const request=(jwt?:string)=>new Request('https://preview.example.test/api/session',{headers:jwt?{'Cf-Access-Jwt-Assertion':jwt}:{}});
test('verified owner gets admin identity without a stored registration',async()=>{
 const response=await previewSession(request(await token()),env,keys);
 expect(response.status).toBe(200);expect(response.headers.get('Cache-Control')).toContain('no-store');
 expect((await response.json()).user).toEqual({id:'access:owner',email:'admin@example.test',name:'Mikel',role:'admin'});
});
for(const [name,claims,status] of [
 ['different email',{email:'other@example.test'},403],
 ['wrong audience',{aud:'another-app'},401],
 ['wrong issuer',{iss:'https://other.cloudflareaccess.com'},401],
 ['expired token',{exp:1},401],
 ['missing expiry',{exp:undefined},401],
 ['missing subject',{sub:undefined},401]
] as const)test(`rejects ${name}`,async()=>expect((await previewSession(request(await token(claims)),env,keys)).status).toBe(status));
test('rejects missing token, forged email header and invalid signature',async()=>{
 const noToken=new Request('https://preview.example.test/api/session',{headers:{'Cf-Access-Authenticated-User-Email':'admin@example.test'}});
 expect((await previewSession(noToken,env,keys)).status).toBe(401);
 const other=await generateKeyPair('RS256');const jwt=await new SignJWT({email:'admin@example.test'}).setProtectedHeader({alg:'RS256',kid:'test'}).setSubject('owner').setIssuer(env.CHEF_ACCESS_ISSUER).setAudience(env.CHEF_ACCESS_AUD).setExpirationTime('5m').sign(other.privateKey);
 expect((await previewSession(request(jwt),env,keys)).status).toBe(401);
 expect((await previewSession(request(),{},keys)).status).toBe(503);
});
