import {test,expect} from '@playwright/test';
import path from 'node:path';
const stock=[{name:'Arroz',quantity:500,unit:'g',location:'pantry'},{name:'Pollo',quantity:300,unit:'g',location:'fridge'},{name:'Calabacín',location:'fridge'},{name:'Tomate',location:'fridge'},{name:'Lentejas',location:'pantry'}];
const proposal={id:'ai-proposal-photo',recipeId:'ai-proposal-photo',title:'Arroz con verduras',subtitle:'Plato casero',emoji:'🍚',minutes:30,difficulty:'Fácil',reason:'Con tus ingredientes',usedIngredients:['arroz','tomate'],missingIngredients:[]};
test.beforeEach(async({page})=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.addInitScript(items=>{sessionStorage.setItem('chef:auth:session:v1','1');sessionStorage.setItem('chef:entry-tutorial:seen-session:v1','1');sessionStorage.setItem('chef:tutorial:invite-dismissed-session:v2','1');localStorage.setItem('chef:settings',JSON.stringify({pantryStock:items,aiPreference:100}));},stock);
});
test('inventory tabs, four priorities and remaining available ingredients are preserved',async({page},info)=>{
 let request:any;
 await page.route('**/recipes/suggest',r=>{request=r.request().postDataJSON().request;return r.fulfill({json:{proposals:[proposal]}})});
 await page.goto('./#/cocina-despensa');
 await page.getByRole('button',{name:/^Nevera/}).click();await expect(page.locator('.pantry-ingredient-grid button')).toHaveCount(3);
 await page.getByRole('button',{name:/^Despensa/}).click();await expect(page.locator('.pantry-ingredient-grid button')).toHaveCount(2);
 await page.getByRole('button',{name:/^Todo/}).click();
 for(const name of ['Arroz','Pollo','Calabacín','Tomate'])await page.locator('.pantry-ingredient-grid').getByRole('button',{name:new RegExp(name)}).click();
 await expect(page.locator('.pantry-ingredient-grid').getByRole('button',{name:/Lentejas/})).toBeDisabled();
 await page.getByRole('button',{name:'Personalizar',exact:true}).click();await page.getByRole('combobox',{name:'Picante',exact:true}).selectOption('Nada');
 await page.locator('.visual-multiselect summary').click();await page.getByRole('checkbox',{name:'Sin lácteos',exact:true}).check();await page.locator('.visual-multiselect summary').click();
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('pantry-options.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Generar propuesta',exact:true}).click();await expect(page.locator('.proposal-stack > *')).toHaveCount(1);
 expect(request.pantryIngredients.filter((i:any)=>i.priority)).toHaveLength(4);expect(request.pantryIngredients).toHaveLength(5);expect(request.pantryIngredients[0]).toMatchObject({quantity:500,unit:'g',priority:true});expect(request.spiceLevel).toBe('Nada');expect(request.restrictions).toEqual(['Sin lácteos']);
});
test('same seven option rows in all three cooking modes',async({page})=>{
 let reference:string[]=[];
 for(const route of ['antojo','cocina-despensa','foto']){
  await page.goto('./#/'+route);await page.getByRole('button',{name:'Personalizar',exact:true}).click();
  const labels=await page.locator('.visual-option-title strong').allTextContents();
  if(!reference.length)reference=labels;else expect(labels).toEqual(reference);
  expect(labels).toHaveLength(7);await expect(page.getByRole('combobox',{name:'Picante',exact:true})).toBeVisible();
 }
});
test('photo recognition requires confirmation, supports correction and does not invent quantities',async({page},info)=>{
 await page.route('**/chef-media/evaluate-dish',r=>r.fulfill({json:{evaluation:{score:0,summary:JSON.stringify({ingredients:['Arroz','Huevo','Patata','Cebolla','Quinto']})}}}));
 await page.goto('./#/cocina-despensa');
 await page.getByLabel('Subir foto de nevera o despensa').setInputFiles(path.resolve('public/home-pantry-v2.png'));
 await expect(page.getByRole('region',{name:'Revisar ingredientes de la foto'})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('chef:settings')!).pantryStock.length)).toBe(5);
 await expect(page.getByRole('textbox',{name:'Ingrediente detectado 5'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Generar propuesta',exact:true})).toBeDisabled();
 await page.getByRole('textbox',{name:'Ingrediente detectado 2'}).fill('Huevos');
 await page.getByRole('checkbox',{name:'Usar ingrediente 4'}).uncheck();
 await page.getByRole('combobox',{name:'Guardar ingredientes en'}).selectOption('pantry');
 await page.screenshot({path:info.outputPath('photo-review.png'),fullPage:true});
 await page.getByRole('button',{name:'Guardar y usar'}).click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('chef:settings')!).pantryStock);
 expect(saved.find((i:any)=>i.name==='Arroz')).toMatchObject({quantity:500,unit:'g'});expect(saved.find((i:any)=>i.name==='Huevos')).toEqual({name:'Huevos',location:'pantry'});expect(saved.find((i:any)=>i.name==='Cebolla')).toBeUndefined();
 await expect(page.getByText('3/4 elegidos',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Generar propuesta',exact:true})).toBeEnabled();
});
test('unusable photo response never adds inferred inventory',async({page})=>{
 await page.route('**/chef-media/evaluate-dish',r=>r.fulfill({json:{evaluation:{score:0,summary:'No se puede identificar con claridad.'}}}));
 await page.goto('./#/cocina-despensa');await page.getByLabel('Subir foto de nevera o despensa').setInputFiles(path.resolve('public/home-pantry-v2.png'));
 await expect(page.getByRole('alert')).toContainText('claridad');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('chef:settings')!).pantryStock.length)).toBe(5);
 await expect(page.getByRole('button',{name:'Guardar y usar'})).toHaveCount(0);
});
test('photo recipe sends common options and exclusions to final generation',async({page})=>{
 let final:any;
 await page.route('**/chef-media/evaluate-dish',r=>r.fulfill({json:{evaluation:{score:5,summary:'Arroz con verduras'}}}));
 await page.route('**/recipes/suggest',r=>r.fulfill({json:{proposals:[proposal]}}));
 await page.route('**/recipes/generate',r=>{final=r.request().postDataJSON().request;return r.fulfill({status:503,json:{errorMessage:'Fin de prueba de contrato'}})});
 await page.goto('./#/foto');await page.getByRole('button',{name:'Personalizar',exact:true}).click();
 await page.getByRole('combobox',{name:'Estilo',exact:true}).selectOption('Casera');await page.getByRole('combobox',{name:'Picante',exact:true}).selectOption('Suave');
 await page.locator('.visual-multiselect summary').click();await page.getByRole('textbox',{name:'Otra exclusión'}).fill('cebolla');
 await page.locator('input[type=file]').last().setInputFiles(path.resolve('public/home-pantry-v2.png'));
 await page.getByRole('button',{name:'Analizar el plato',exact:true}).click();await page.getByRole('button',{name:'Sí, adelante',exact:true}).click();
 await page.getByRole('button',{name:'Generar receta',exact:true}).click();await expect.poll(()=>final).toBeTruthy();
 expect(final).toMatchObject({style:'Casera',spiceLevel:'Suave',maxMinutes:60,restrictions:['cebolla']});
});
