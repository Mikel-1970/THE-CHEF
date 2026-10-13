import {test,expect} from '@playwright/test';
import {mockRecipes} from '../src/data/mockRecipes';
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{for(const key of ['chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2'])sessionStorage.setItem(key,'1')});
 await page.route('**/*',r=>{
 const path=new URL(r.request().url()).pathname;
 if(path.endsWith('/evaluate-dish'))return r.fulfill({json:{evaluation:{score:0,summary:'Arroz con verduras. Cantidades desconocidas.',verdict:'bien',strengths:[],improvements:[]}}});
 if(path.endsWith('/transcribe'))return r.fulfill({json:{text:'Añade 200 gramos de arroz y cocina veinte minutos.'}});
 if(path.endsWith('/recipes/suggest'))return r.fulfill({json:{proposals:[{id:'source',recipeId:'source',title:'Arroz con verduras',subtitle:'Arroz visible, sal propuesta.',emoji:'🍚',minutes:30,difficulty:'Fácil',usedIngredients:['Arroz'],missingIngredients:['Sal'],reason:'Fuente aportada'}]}});
 if(path.endsWith('/recipes/generate'))return r.fulfill({json:{recipes:[{...mockRecipes[0],id:'ai-media-reviewed',title:'Arroz con verduras',source:{kind:'ai',label:'Prueba'}}]}});
 if(path.endsWith('/api/import-source'))return r.fulfill({json:{url:'https://example.com/receta',html:'<article><h1>Arroz con verduras</h1><p>Ingredientes: 200 g de arroz, verduras y aceite.</p><p>Mezcla y cocina 20 minutos a fuego suave hasta que esté tierno.</p></article>'}});
 return new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort();
 });
});
for(const source of ['foto','vídeo','enlace'])test(source+' requires explicit draft confirmation before saving',async({page},info)=>{
 await page.goto('./#/foto');
 if(source==='foto')await page.locator('input[type=file]').last().setInputFiles('public/home-photo-recipe.png');
 if(source==='enlace')await page.getByLabel('Enlace de vídeo o receta').fill('https://example.com/receta');
 if(source==='vídeo'){
 const bytes=await page.evaluate(async()=>{
 const canvas=document.createElement('canvas');canvas.width=320;canvas.height=240;const ctx=canvas.getContext('2d')!;ctx.fillStyle='orange';ctx.fillRect(0,0,320,240);
 const stream=canvas.captureStream(10),recorder=new MediaRecorder(stream,{mimeType:'video/webm'}),parts:Blob[]=[];
 recorder.ondataavailable=e=>parts.push(e.data);
 const stopped=new Promise<void>(resolve=>recorder.onstop=()=>resolve());recorder.start();
 const timer=setInterval(()=>{ctx.fillStyle='orange';ctx.fillRect(0,0,320,240);},100);
 await new Promise(r=>setTimeout(r,1200));recorder.stop();await stopped;clearInterval(timer);stream.getTracks().forEach(t=>t.stop());
 return Array.from(new Uint8Array(await new Blob(parts).arrayBuffer()));
 });
 await page.locator('input[type=file]').last().setInputFiles({name:'receta.webm',mimeType:'video/webm',buffer:Buffer.from(bytes)});
 }
 await page.getByRole('button',{name:'Analizar el plato',exact:true}).click();
 await page.getByRole('button',{name:'Sí, adelante'}).click();
 await expect(page.getByRole('button',{name:/Sal.*Por confirmar/})).toContainText('—');
 await page.getByRole('button',{name:'Preparar borrador',exact:true}).click();
 const save=page.getByRole('button',{name:'Confirmar e incorporar receta',exact:true});await expect(save).toBeDisabled();
 expect(await page.evaluate(()=>Object.values(localStorage).join('').includes('ai-media-reviewed'))).toBe(false);
 await page.getByRole('checkbox',{name:/He revisado y acepto/}).check();
 await page.getByLabel('Título',{exact:true}).fill('Arroz revisado');await expect(save).toBeDisabled();
 await page.getByRole('checkbox',{name:/He revisado y acepto/}).check();
 if(source==='vídeo')await expect(page.getByRole('status').filter({hasText:'6 fotogramas'})).toContainText('Audio transcrito');
 if(source==='enlace')await expect(page.getByText(/No se han visto ni oído/)).toBeVisible();
 await page.screenshot({path:info.outputPath('revision.png'),fullPage:true});
 await save.click();await expect(page).toHaveURL(/receta\/ai-media-reviewed/);
});
