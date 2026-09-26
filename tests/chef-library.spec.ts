import {test,expect} from '@playwright/test';
import {chefLibrary} from '../src/data/library';
import {validateRecipe} from '../src/services/recipeValidator';
import {getMockProposals} from '../src/services/mockRecommendationEngine';
import {recipeViolatesRestrictions} from '../src/services/restrictionGuard';
import {mockRecipes} from '../src/data/mockRecipes';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

test('chef additions are attributed domestic adaptations with separate baking categories',()=>{
 const added=chefLibrary.filter(r=>Number(r.id.slice(4))>=171);
 expect(added).toHaveLength(10);
 expect(added.filter(r=>r.libraryCategory==='Alta cocina')).toHaveLength(6);
 expect(added.filter(r=>r.libraryCategory==='Bizcochos, muffins y donuts')).toHaveLength(4);
 for(const r of added){expect(r.source?.kind).toBe('web');expect(r.source?.adapted).toBe(true);expect(new URL(r.source!.url!).protocol).toBe('https:');expect(r.nutritionPerServing!.kcal).toBeGreaterThan(0);}
});

test('haute cuisine can be found by chef and opens its published source without AI',async({page})=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.goto('./#/mis-recetas');
 await page.getByRole('button',{name:'Alta cocina',exact:true}).click();
 await expect(page.locator('.library-photo-card')).toHaveCount(6);
 await page.getByPlaceholder('Buscar recetas y cócteles…').fill('berASategui');
 await expect(page.locator('.library-photo-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Abrir Crema de coliflor y mascarpone',exact:true}).click();
 await expect(page.locator('.recipe-source-note')).toContainText('Martín Berasategui');
 await expect(page.getByRole('link',{name:'Ver fuente'})).toHaveAttribute('href','https://www.lavozdegalicia.es/xlsemanal/gastronomia/recetas/crema-coliflor-martin-berasategui.html');
});

test('every library item has a distinct lightweight thumbnail and detail image',()=>{
 const hashes=new Set<string>();
 for(const recipe of chefLibrary){for(const suffix of ['','_min']){const bytes=fs.readFileSync(`public/library/${recipe.id}${suffix}.webp`);expect(bytes.subarray(0,4).toString()).toBe('RIFF');expect(bytes.subarray(8,12).toString()).toBe('WEBP');expect(bytes.length).toBeGreaterThan(1000);expect(bytes.length).toBeLessThan(suffix?60000:220000);hashes.add(createHash('sha256').update(bytes).digest('hex'));}}
 expect(hashes.size).toBe(chefLibrary.length*2);
});

test('catalog contains 160 complete recipes and 20 cocktails with unique instructions',()=>{
 expect(chefLibrary).toHaveLength(180);expect(new Set(chefLibrary.map(r=>r.id)).size).toBe(180);
 expect(new Set(chefLibrary.map(r=>r.steps.map(s=>s.instruction).join(' '))).size).toBe(180);
 expect(chefLibrary.filter(r=>r.recipeKind==='cocktail')).toHaveLength(20);
 expect(chefLibrary.filter(r=>r.cuisine==='Española')).toHaveLength(85);
 expect(chefLibrary.filter(r=>r.cuisine==='Italiana')).toHaveLength(15);
 for(const recipe of chefLibrary){expect(validateRecipe(recipe).errors,recipe.title).toEqual([]);expect(recipe.steps.length).toBeGreaterThanOrEqual(4);expect(recipe.ingredients.length).toBeGreaterThan(1);expect(recipe.nutritionStatus).toBe('estimated');expect(recipe.nutritionPerServing!.kcal).toBeGreaterThan(0);}
});
test('catalog selection respects cuisine, limits, exclusions and unknown dishes',()=>{
 const request={mode:'desire' as const,servings:5,cuisine:'Peruana',desireText:''};
 const results=getMockProposals(request,[],true);expect(results.length).toBeGreaterThan(0);
 for(const p of results)expect(chefLibrary.find(r=>r.id===p.recipeId)?.cuisine).toBe('Peruana');
 expect(getMockProposals({...request,maxMinutes:1},[],true)).toHaveLength(0);
 expect(getMockProposals({...request,desireText:'Un plato de unicornio con plutonio'},[],true)).toHaveLength(0);
 const vegan=getMockProposals({...request,cuisine:'Española',restrictions:['Vegana']},[],true);expect(vegan.length).toBeGreaterThan(0);
 for(const p of vegan){const r=chefLibrary.find(r=>r.id===p.recipeId)!;expect(recipeViolatesRestrictions(r,['Vegana'])).toBeUndefined();expect(r.ingredients.some(i=>/pollo|huevo|leche|jamón/.test(i.name))).toBe(false);}
 expect(recipeViolatesRestrictions(chefLibrary.find(r=>r.title==='Espaguetis a la carbonara')!,['Sin gluten'])).toBeTruthy();
 expect(recipeViolatesRestrictions(chefLibrary.find(r=>r.title==='Palak paneer')!,['Sin lácteos'])).toBeTruthy();
});
test.beforeEach(async({page})=>{await page.addInitScript(()=>{for(const key of ['chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2'])sessionStorage.setItem(key,'1')});});
test('general library includes personal recipes once and keeps saved and favorite views separate',async({page})=>{
 const own={...chefLibrary[0],id:'import-family',title:'Arroz de mi familia',cuisine:'Familiar',source:{kind:'user',label:'Receta familiar'}};
 await page.addInitScript(r=>{
  localStorage.setItem('the-chef:library-recipe-snapshots:v1',JSON.stringify([r]));
  localStorage.setItem('chef:saved-recipes',JSON.stringify([r.id,'lib-001']));
  localStorage.setItem('chef:favorites',JSON.stringify([r.id,'lib-002']));
 },own);
 await page.goto('./#/mis-recetas');
 await expect(page.locator('.library-tabs button')).toHaveText(['Biblioteca','Mis recetas','Favoritos','Historial']);
 await expect(page.locator('.library-photo-card')).toHaveCount(181);
 await page.getByLabel('Filtrar por cocina').selectOption('Familiar');
 await expect(page.locator('.library-photo-card')).toHaveCount(1);
 await page.getByLabel('Filtrar por cocina').selectOption('');
 await page.locator('.library-tabs').getByRole('button',{name:'Mis recetas',exact:true}).click();
 await expect(page.locator('.library-photo-card')).toHaveCount(2);
 await expect(page.getByRole('button',{name:'Abrir Arroz del senyoret',exact:true})).toHaveCount(0);
 await page.locator('.library-tabs').getByRole('button',{name:'Favoritos',exact:true}).click();
 await expect(page.locator('.library-photo-card')).toHaveCount(2);
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
 await expect(page.locator('.chef-menu-grid').getByRole('button',{name:'Favoritos',exact:true})).toHaveCount(0);
});
test('library filters, photo, servings and saved recipes work without AI',async({page},info)=>{
 let ai=0;await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname==='127.0.0.1')return r.continue();if(url.pathname.includes('/recipes/')||url.pathname.includes('/chef-media/'))ai++;return r.abort()});
 await page.goto('./#/mis-recetas');await expect(page.locator('.library-photo-card')).toHaveCount(180);
 await page.screenshot({path:info.outputPath('library-home.png')});
 await page.getByLabel('Filtrar por cocina').selectOption('Peruana');await expect(page.locator('.library-photo-card')).toHaveCount(5);
 await page.getByLabel('Filtrar por cocina').selectOption('');await page.getByLabel('Tipo de receta').selectOption('cocktail');await expect(page.locator('.library-photo-card')).toHaveCount(20);
 await page.getByLabel('Filtrar por alcohol').selectOption('no');await expect(page.locator('.library-photo-card')).toHaveCount(3);
 await page.getByLabel('Tipo de receta').selectOption('all');await page.getByPlaceholder('Buscar recetas y cócteles…').fill('Paella valenciana');await page.getByRole('button',{name:'Abrir Paella valenciana',exact:true}).click();
 await expect(page.locator('.recipe-complete-photo img')).toHaveAttribute('src',/lib-001\.webp\?v=plated-20260926$/);
 await expect.poll(()=>page.locator('.recipe-complete-photo img').evaluate((e:HTMLImageElement)=>e.naturalWidth)).toBe(960);
 await page.getByRole('button',{name:'Ingredientes Lo que necesitas',exact:true}).click();await page.getByLabel('Comensales',{exact:true}).selectOption('5');await page.reload();
 await page.getByRole('button',{name:'Ingredientes Lo que necesitas',exact:true}).click();await expect(page.getByLabel('Comensales',{exact:true})).toHaveValue('5');await expect(page.getByRole('dialog')).toContainText('400 g');await page.getByRole('button',{name:'Volver',exact:true}).click();
 await page.getByRole('button',{name:'Guardar en Mis recetas',exact:true}).click();await page.goto('./#/mis-recetas?tab=all');await expect(page.locator('.library-photo-card')).toHaveCount(1);
 expect(ai).toBe(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('library-saved.png')});
});

test('history without a catalog match offers explicit generation and settings explain the policy',async({page})=>{
 let calls=0;await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='127.0.0.1')return r.continue();if(u.pathname.includes('/recipes/'))calls++;return r.abort()});
 await page.addInitScript(()=>localStorage.setItem('chef:history',JSON.stringify([{id:'old-search',kind:'search',createdAt:'2026-09-25T12:00:00Z',label:'Guiso de unicornio',mode:'desire',request:{mode:'desire',desireText:'Un guiso de unicornio',servings:4,generationMode:'ai'}}])));
 await page.goto('./#/mis-recetas?tab=history');await page.getByRole('button',{name:/Guiso de unicornio/}).click();await expect(page.getByRole('alert')).toContainText('biblioteca');await expect(page.getByRole('button',{name:'Crear receta con IA',exact:true})).toBeVisible();expect(calls).toBe(0);
 await page.goto('./#/ajustes');await expect(page.getByText('Biblioteca primero',{exact:true})).toBeVisible();await expect(page.getByLabel('Porcentaje de uso de IA')).toHaveCount(0);
});
test('no match requires an explicit AI action',async({page})=>{
 let calls=0;await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='127.0.0.1')return r.continue();if(u.pathname.endsWith('/recipes/suggest')){calls++;return r.fulfill({status:500,body:'{}',contentType:'application/json'})}return r.abort()});
 await page.goto('./#/antojo');await page.getByLabel('Tu petición').fill('Un guiso de unicornio');await page.getByRole('button',{name:'Confirmar petición'}).click();await page.getByRole('button',{name:'Generar receta',exact:true}).click();await expect(page.getByRole('button',{name:'Crear receta con IA',exact:true})).toBeVisible();expect(calls).toBe(0);
 await page.getByRole('button',{name:'Crear receta con IA',exact:true}).click();await expect.poll(()=>calls).toBe(1);await expect(page.getByRole('alert')).toContainText('fallo temporal');
});

test('another recipe uses AI only after clicking and keeps diners and cuisine',async({page})=>{
 const calls:string[]=[];let request:any;
 const recipe={...mockRecipes[0],id:'ai-library-alternative',title:'Arroz de verduras del chef',cuisine:'Española',source:{kind:'ai',label:'Prueba controlada'}};
 await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname==='127.0.0.1')return r.continue();if(url.pathname.endsWith('/recipes/suggest')){calls.push('suggest');request=r.request().postDataJSON().request;return r.fulfill({contentType:'application/json',body:JSON.stringify({proposals:[{id:'alt',recipeId:recipe.id,title:recipe.title,subtitle:'Una alternativa de arroz',emoji:'🍚',minutes:35,difficulty:'Fácil',usedIngredients:['arroz'],missingIngredients:[],reason:'Alternativa a la paella'}]})})}if(url.pathname.endsWith('/recipes/generate')){calls.push('generate');return r.fulfill({contentType:'application/json',body:JSON.stringify({recipes:[recipe]})})}if(url.pathname.endsWith('/chef-media/image')){calls.push('image');return r.fulfill({contentType:'application/json',body:JSON.stringify({imageUrl:'/THE-CHEF/library/lib-001.webp'})})}return r.abort()});
 await page.goto('./#/receta/lib-001?servings=5');await expect(page.getByRole('button',{name:'Crear otra con IA',exact:true})).toBeVisible();expect(calls).toEqual([]);
 await page.getByRole('button',{name:'Crear otra con IA',exact:true}).click();await expect(page).toHaveURL(/receta\/ai-library-alternative\?servings=5/);expect(request.cuisine).toBe('Española');expect(request.servings).toBe(5);expect(request.desireText).toContain('No repitas: Paella valenciana');expect(calls.filter(c=>c==='suggest')).toHaveLength(1);expect(calls.filter(c=>c==='generate')).toHaveLength(1);
});

test('reviewed library layout and menu keep every group accessible',async({page},info)=>{
 await page.goto('./#/mis-recetas');await expect(page.getByText('Revisar tips de cocina',{exact:true})).toHaveCount(0);
 await expect(page.locator('.library-tabs button')).toHaveCount(4);const positions=await page.locator('.library-tabs button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,font:parseFloat(getComputedStyle(e).fontSize)}}));
 expect(positions[0].y).toBe(positions[1].y);expect(positions[2].y).toBe(positions[3].y);expect(positions[2].y).toBeGreaterThan(positions[0].y);expect(positions[0].font).toBeGreaterThanOrEqual(15);
 expect(await page.locator('.dish-category-row').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
 await page.getByRole('button',{name:'Cócteles',exact:true}).click();await expect(page.locator('.library-photo-card')).toHaveCount(20);
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await expect(page.locator('.chef-menu-grid button')).toHaveText(['Inicio','Mis recetas','Qué cocinar','Abre la despensa','Foto Receta','Técnicas y tips','Lista de la compra','Despensa','Buscar','Perfil y ajustes']);
 await expect(page.getByRole('button',{name:'Mi plan de comidas',exact:true})).toHaveCount(0);await page.screenshot({path:info.outputPath('review-menu.png')});
});

test('history combines food filters, text and approximate dates',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('chef:history',JSON.stringify([
 {id:'recent',kind:'recipe',recipeId:'lib-001',label:'Paella valenciana',createdAt:new Date().toISOString()},
 {id:'old',kind:'recipe',recipeId:'lib-002',label:'Arroz del senyoret',createdAt:new Date(Date.now()-120*86400000).toISOString()},
 {id:'drink',kind:'recipe',recipeId:'lib-151',label:'Negroni',createdAt:new Date().toISOString()}
 ])));
 await page.goto('./#/mis-recetas?tab=history');await expect(page.locator('.history-card')).toHaveCount(3);
 await page.getByLabel('Comida del historial').selectOption('Arroces');await expect(page.locator('.history-card')).toHaveCount(2);
 await page.getByLabel('Periodo del historial').selectOption('7');await expect(page.locator('.history-card')).toHaveCount(1);await expect(page.locator('.history-card')).toContainText('Paella');
 await page.getByLabel('Buscar en el historial').fill('negroni');await expect(page.locator('.history-card')).toHaveCount(0);
 await page.getByLabel('Comida del historial').selectOption('Cócteles');await expect(page.locator('.history-card')).toHaveCount(1);
});

test('diners belong to ingredients and changing them does not request AI',async({page},info)=>{
 await page.goto('./#/receta/lib-001');await expect(page.getByLabel('Comensales',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Ingredientes Lo que necesitas',exact:true}).click();await page.getByLabel('Comensales',{exact:true}).selectOption('5');await expect(page.getByRole('dialog')).toContainText('400 g');
 await page.getByRole('button',{name:'Volver',exact:true}).click();await page.getByRole('button',{name:'Personalizar receta',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Personalizar receta'});await expect(dialog.getByText('Comensales',{exact:true})).toHaveCount(0);await expect(dialog.getByText('Tiempo máximo',{exact:true})).toHaveCount(0);await expect(dialog.getByRole('button',{name:'Crear versión',exact:true})).toBeDisabled();
 await page.getByLabel('Cerrar personalización').click();await expect(page.locator('.nutrition-card')).toBeVisible();await page.getByText('Cómo se estima la nutrición',{exact:true}).click();await expect(page.locator('.library-nutrition-note')).toContainText('CoFID');await page.screenshot({path:info.outputPath('review-recipe.png'),fullPage:true});
});
