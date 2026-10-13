import ts from 'typescript';
import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync('supabase/functions/recipes-preview/index.ts','utf8').replace(/^import .*;\s*/,'');
let handler,calls=0;
const context={Response,Request,URL,console,Deno:{env:{get:()=> 'test-only'},serve:h=>handler=h},fetch:async()=>{
 calls++;
 return new Response(JSON.stringify({output_text:calls===1?'{"proposals":[{"title":"truncated"}':JSON.stringify({proposals:[{title:'Solomillo'}]})}),{status:200});
}};
vm.runInNewContext(ts.transpile(source,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}),context);
const response=await handler(new Request('https://example.test/recipes-preview/suggest',{method:'POST',headers:{apikey:'sb_publishable_b08-tfZCh2pEBGK0lBH-1g_oB3RwvV8','Content-Type':'application/json'},body:'{"request":{}}'}));
assert.equal(response.status,200);assert.equal(calls,2);assert.equal((await response.json()).proposals.length,1);
console.log('PASS: malformed structured output retries successfully; one proposal returned.');
