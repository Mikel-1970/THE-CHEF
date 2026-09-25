import {test,expect} from '@playwright/test';
import {chefLibrary} from '../src/data/library';
import {planBreakfasts} from '../src/data/planBreakfasts';
import {compatible,estimateMaintenance,makePlan,planShopping,recipeNutrition,sumNutrition,unknownNutrition,validateOptions,type PlanOptions} from '../src/services/mealPlan';
const options=():PlanOptions=>({weeks:1,servings:4,meals:['Comida','Cena'],shares:{Desayuno:0,Comida:40,Merienda:0,Cena:30},restrictions:[],cuisine:'',style:'',likes:'',preferred:[]});

test('maintenance is an interval, units and population are checked',()=>{
 const m=estimateMaintenance(80,180,40,'male',0,true);
 expect(m.rest).toBe(1732);expect(m.low).toBe(2425);expect(m.high).toBe(2928);
 expect(()=>estimateMaintenance(80,180,16,'male',0,true)).toThrow();
 expect(()=>estimateMaintenance(80,1.8,40,'male',0,true)).toThrow();
 expect(()=>estimateMaintenance(80,180,40,'male',0,false)).toThrow();
 expect(estimateMaintenance(80,180,40,'female',0,true).rest).toBe(1566);
});
test('plans cover 1 to 4 weeks with strict allergies and no unrelated gap filler',()=>{
 for(const weeks of [1,2,3,4]){const p=makePlan({...options(),weeks,restrictions:['Sin huevo','Sin lácteos']},[...chefLibrary,...planBreakfasts]);expect(p.slots).toHaveLength(weeks*14);expect(p.slots.some(s=>s.recipe)).toBeTruthy();for(const s of p.slots)if(s.recipe)expect(compatible(s.recipe,p.options,s.meal)).toBeTruthy();}
 const unavailable=makePlan({...options(),cuisine:'Inexistente'},chefLibrary);expect(unavailable.slots.every(s=>!s.recipe)).toBeTruthy();
 const unknown={...chefLibrary[0],ingredients:[{name:'mezcla secreta',quantity:10,unit:'g',scalingMode:'linear' as const}]};expect(compatible(unknown,{...options(),restrictions:['Sin huevo']},'Comida')).toBe(false);
 expect(()=>makePlan({...options(),weeks:5},chefLibrary)).toThrow();
});
test('nutrition uses actual scaled quantities and never turns missing values into zero',()=>{
 const r=chefLibrary[0];expect(recipeNutrition(r,4).kcal).toBeCloseTo(r.nutritionPerServing!.kcal,0);
 expect(recipeNutrition({...r,ingredients:[{name:'desconocido',quantity:100,unit:'g',scalingMode:'linear'}]},4).kcal).toBeNull();
 expect(sumNutrition([recipeNutrition(r,4),unknownNutrition()]).kcal).toBeNull();
 const scaled=recipeNutrition(planBreakfasts[0],4);expect(scaled.kcal).toBeGreaterThan(100);expect(scaled.kcal).toBeLessThan(500);
 const goal={kcal:2000,origin:'Lo he decidido yo',confirmedAt:new Date().toISOString()};
 expect(()=>validateOptions({...options(),goal,shares:{Desayuno:0,Comida:80,Cena:40,Merienda:0}})).toThrow();
 expect(()=>validateOptions({...options(),goal:{...goal,proteinG:1000}})).toThrow();
});
test('shopping aggregates weeks, converts compatible units, subtracts stock once and keeps count units whole',()=>{
 const r={...planBreakfasts[0],ingredients:[{name:'arroz',quantity:100,unit:'g',scalingMode:'linear' as const},{name:'arroz',quantity:.1,unit:'kg',scalingMode:'linear' as const},{name:'huevo',quantity:.2,unit:'unidad',scalingMode:'linear' as const}]};
 const p={options:{...options(),servings:2},slots:[{day:0,meal:'Comida' as const,recipe:r},{day:0,meal:'Cena' as const,recipe:r}],createdAt:new Date().toISOString()};
 const rows=planShopping(p,[{name:'arroz',quantity:.2,unit:'kg'}],true);expect(rows.find(i=>i.name==='arroz')?.quantity).toBe(600);expect(rows.find(i=>i.name==='huevo')?.quantity).toBe(1);
 expect(planShopping(p,[{name:'arroz'}],true).find(i=>i.name==='arroz')?.quantity).toBe(800);
});

test.beforeEach(async({page})=>{await page.addInitScript(()=>{for(const k of ['chef:home-greeted:v2','chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2'])sessionStorage.setItem(k,'1')});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());});
test('menu opens planner, no-goal plan survives navigation and shopping updates without duplicates',async({page},info)=>{
 await page.goto('./#/');await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.getByRole('button',{name:'Mi plan de comidas',exact:true}).click();
 await page.getByLabel('Duración',{exact:true}).selectOption('4');await page.getByLabel('Comensales',{exact:true}).selectOption('5');await page.getByRole('button',{name:'Crear plan de comidas',exact:true}).click();
 await expect(page.getByText('Tu plan · 4 semanas',{exact:true})).toBeVisible();await page.getByLabel('Semana',{exact:true}).selectOption('3');await expect(page.getByRole('heading',{name:'Día 28',exact:true})).toBeVisible();
 const title=await page.locator('.plan-recipe-title strong').first().textContent();await page.getByRole('button',{name:'Otra de la biblioteca',exact:true}).first().click();await expect(page.locator('.plan-recipe-title strong').first()).not.toHaveText(title!);
 await page.getByRole('button',{name:'Actualizar lista de la compra',exact:true}).click();const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('chef:shopping-list')!));await page.getByRole('button',{name:'Actualizar lista de la compra',exact:true}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('chef:shopping-list')!))).toEqual(first);
 await page.getByRole('link',{name:'Ver lista de la compra',exact:true}).click();await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.getByRole('button',{name:'Mi plan de comidas',exact:true}).click();await expect(page.getByText('Tu plan · 4 semanas',{exact:true})).toBeVisible();
 await expect(page.getByLabel('Peso (kg)',{exact:true})).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.screenshot({path:info.outputPath('plan.png'),fullPage:false});
});
test('calculation never adopts a goal; partial-day plan and weight remain independent',async({page})=>{
 await page.goto('./#/plan-semanal');await page.getByLabel('Objetivo energético',{exact:true}).selectOption('goal');await page.getByText('Calcular mantenimiento estimado (opcional)',{exact:true}).click();
 await page.getByLabel('Peso (kg)',{exact:true}).fill('80');await page.getByLabel('Altura (cm)',{exact:true}).fill('180');await page.getByLabel('Edad (años)',{exact:true}).fill('40');await page.getByLabel('He leído el ámbito',{exact:false}).check();await page.getByRole('button',{name:'Calcular estimación',exact:true}).click();
 await expect(page.getByLabel('Mi objetivo (kcal/día por persona)',{exact:true})).toHaveValue('');await page.getByRole('button',{name:'Crear plan de comidas',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Confirma expresamente');
 await page.getByLabel('Mi objetivo (kcal/día por persona)',{exact:true}).fill('2000');await page.getByRole('button',{name:'Confirmar mi objetivo',exact:true}).click();await page.getByLabel('Comida (%)',{exact:true}).fill('40');await page.getByLabel('Cena (%)',{exact:true}).fill('30');await page.getByRole('button',{name:'Crear plan de comidas',exact:true}).click();await expect(page.getByText(/Planificas el 70 %: 1400 kcal/)).toBeVisible();
 await page.getByText('Seguimiento voluntario del peso',{exact:true}).click();await page.getByLabel('Quiero registrar mi peso',{exact:false}).check();await page.getByLabel('Peso del registro (kg)',{exact:true}).fill('80');await page.getByRole('button',{name:'Guardar o corregir peso de esta fecha',exact:true}).click();await page.getByLabel('Peso del registro (kg)',{exact:true}).fill('79');await page.getByRole('button',{name:'Guardar o corregir peso de esta fecha',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(1);await expect(page.locator('tbody')).toContainText('79');await expect(page.getByText('2000 kcal/día',{exact:true})).toBeVisible();
 const storage=await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));expect(storage).not.toContain('confirmedAt');expect(storage).not.toContain('calculatedAt');
 await page.getByRole('button',{name:'Eliminar',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(0);
});
test('encrypted backup rejects wrong password, restores and deletes without plaintext persistence',async({page})=>{
 await page.goto('./#/plan-semanal');await page.getByRole('button',{name:'Crear plan de comidas',exact:true}).click();await page.getByText('Guardar, recuperar o borrar mis datos',{exact:true}).click();await page.getByLabel('Contraseña de la copia',{exact:true}).fill('Una clave larga de prueba');await page.getByLabel('Repetir contraseña para guardar',{exact:true}).fill('Una clave larga de prueba');
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar copia cifrada',exact:true}).click();const download=await pending;const path=await download.path();const fs=await import('node:fs/promises');const raw=await fs.readFile(path!,'utf8');expect(raw).not.toContain('Paella');expect(raw).not.toContain('slots');expect(JSON.parse(raw).cipher.length).toBeGreaterThan(100);
 await page.getByLabel('Quiero borrar el plan',{exact:false}).check();await page.getByRole('button',{name:'Borrar datos de esta sesión',exact:true}).click();await expect(page.getByText('Tu plan · 1 semana',{exact:true})).toHaveCount(0);
 await page.getByLabel('Archivo de copia cifrada',{exact:true}).setInputFiles(path!);await page.getByLabel('Contraseña de la copia',{exact:true}).fill('Otra clave larga incorrecta');await page.getByRole('button',{name:'Recuperar copia y sustituir sesión',exact:true}).click();await expect(page.getByRole('alert')).toContainText('No se ha podido abrir');
 await page.getByLabel('Contraseña de la copia',{exact:true}).fill('Una clave larga de prueba');await page.getByRole('button',{name:'Recuperar copia y sustituir sesión',exact:true}).click();await expect(page.getByText('Tu plan · 1 semana',{exact:true})).toBeVisible();
 await page.reload();await expect(page.getByText('Tu plan · 1 semana',{exact:true})).toHaveCount(0);
});
test('AI is explicit, excludes personal data and rejects incompatible recipes',async({page})=>{
 let payload:any;await page.route('**/recipes/generate',async r=>{payload=r.request().postDataJSON();await r.fulfill({status:200,json:{recipes:[{...chefLibrary[0],source:{kind:'ai',label:'test'},cuisine:'Española'}]}})});
 await page.goto('./#/plan-semanal');await page.getByLabel('Tipo de cocina',{exact:true}).selectOption('Peruana');await page.getByRole('button',{name:'Crear plan de comidas',exact:true}).click();await expect(page.getByRole('button',{name:'Pedir alternativa con IA',exact:true}).first()).toBeDisabled();await page.getByLabel('Autorizo enviar al servicio de IA',{exact:false}).check();await page.getByRole('button',{name:'Pedir alternativa con IA',exact:true}).first().click();await expect(page.getByRole('alert')).toContainText('no cumple las condiciones');
 expect(payload.request.cuisine).toBe('Peruana');for(const field of ['weight','height','age','sex','maintenance','goal','weights'])expect(payload.request).not.toHaveProperty(field);
});

 test('legacy unclassified desserts cannot displace classified meals with known nutrition',()=>{
 const dessert={...chefLibrary[0],id:'aaa-old',title:'Tarta Sacher clásica',recipeKind:undefined};
 expect(compatible(dessert,options(),'Comida')).toBe(false);
 const unknown={...chefLibrary[0],id:'aaa-unknown',ingredients:[{name:'mezcla secreta',quantity:100,unit:'g',scalingMode:'linear' as const}]};
 const plan=makePlan(options(),[dessert,unknown,...chefLibrary]);
 expect(plan.slots.every(s=>s.recipe?.recipeKind==='dish'&&recipeNutrition(s.recipe,4).kcal!==null)).toBe(true);
 expect(new Set(plan.slots.map(s=>s.recipe?.libraryCategory)).size).toBeGreaterThanOrEqual(5);
 for(let day=0;day<7;day++)expect(plan.slots[day*2].recipe?.libraryCategory).not.toBe(plan.slots[day*2+1].recipe?.libraryCategory);
 const capitalized={...chefLibrary[0],ingredients:chefLibrary[0].ingredients.map(i=>({...i,name:i.name.toUpperCase()}))};expect(recipeNutrition(capitalized,4)).toEqual(recipeNutrition(chefLibrary[0],4));
 });
