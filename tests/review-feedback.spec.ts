import {test,expect} from '@playwright/test';
import {getMockProposals} from '../src/services/mockRecommendationEngine';
import {chefLibrary} from '../src/data/library';
import {normalizeShoppingItem} from '../src/utils/shoppingQuantity';

test('pantry rejects unrelated dishes but accepts a close rice recipe',()=>{
 const request=(names:string[])=>({mode:'pantry' as const,servings:4,pantryIngredients:names.map(name=>({name,priority:true})),pantryBasics:['Aceite de oliva','Sal','Pimienta','Ajo']});
 for(const names of [['Huevos','Arroz','Latas de bonito','Yogur griego'],['Latas de bonito','Garbanzos']])expect(getMockProposals(request(names),[],true)).toHaveLength(0);
 const recipe=chefLibrary.find(r=>r.title==='Arroz a banda')!;
 const matched=getMockProposals(request(recipe.ingredients.filter(i=>!i.optional).map(i=>i.name)),[],true);expect(matched.length).toBeGreaterThan(0);
 const seafood=getMockProposals(request(['Arroz','Langostinos','Calamar']),[],true);expect(seafood.length).toBeGreaterThan(0);for(const p of seafood)expect(p.title).toMatch(/arroz|paella/i);
});
test('shopping counts round up without changing mass or volume',()=>{
 for(const unit of ['ud','paquete','lata','bote'])expect(normalizeShoppingItem({id:'x',name:'x',checked:false,unit,quantity:.2}).quantity).toBe(1);
 expect(normalizeShoppingItem({id:'x',name:'x',checked:false,unit:'kg',quantity:.2}).quantity).toBe(.2);
});
test.beforeEach(async({page})=>{await page.addInitScript(()=>{for(const key of ['chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2'])sessionStorage.setItem(key,'1')});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());});
test('recipe back goes to library then home without a loop',async({page})=>{
 await page.goto('./#/buscar');await page.goto('./#/receta/lib-002');await page.getByRole('button',{name:'Volver',exact:true}).click();await expect(page).toHaveURL(/#\/mis-recetas$/);await page.getByRole('button',{name:'Volver',exact:true}).click();await expect(page).toHaveURL(/#\/$/);
});
test('search starts empty, uses shared filters and shows photographed results',async({page},info)=>{
 await page.goto('./#/buscar');await expect(page.locator('.library-photo-card')).toHaveCount(0);await page.getByRole('button',{name:'Filtros',exact:true}).click();await expect(page.getByLabel('Comensales',{exact:true})).toHaveCount(0);await expect(page.getByLabel('Estilo',{exact:true})).toBeVisible();await expect(page.getByLabel('Picante',{exact:true})).toBeVisible();const select=await page.getByLabel('Estilo',{exact:true}).boundingBox();const panel=await page.locator('.visual-options').boundingBox();expect(select!.x+select!.width).toBeLessThanOrEqual(panel!.x+panel!.width);const title=await page.locator('.visual-option-title').filter({hasText:'Estilo'}).boundingBox();expect(select!.y).toBeGreaterThan(title!.y+title!.height);await page.getByPlaceholder('Ej. pasta pollo, italiana, calabacín…').fill('arroz');await expect(page.locator('.library-photo-card').first()).toBeVisible();await expect(page.locator('.library-photo-card img').first()).toBeVisible();await expect(page.getByRole('button',{name:'Generar una receta con IA',exact:true})).toBeVisible();await page.screenshot({path:info.outputPath('search.png'),fullPage:true});
 await page.getByText('Seleccionar',{exact:true}).click();await page.getByLabel('Vegana',{exact:true}).check();await expect(page.locator('.library-photo-card')).not.toContainText(['Arroz con pollo']);
});
test('pantry no match generates with selected products, toggle can disable it',async({page})=>{
 let calls=0;await page.route('**/recipes/suggest',r=>{calls++;expect(r.request().postDataJSON().request.pantryIngredients.map((i:any)=>i.name)).toEqual(['Latas de bonito','Garbanzos']);return r.fulfill({status:503,json:{}})});
 await page.goto('./#/cocina-despensa');await page.getByLabel('Añadir ingredientes',{exact:true}).fill('Latas de bonito, Garbanzos');await page.getByRole('button',{name:'Confirmar ingredientes',exact:true}).click();await page.getByRole('button',{name:'Generar receta',exact:true}).click();await expect.poll(()=>calls).toBe(1);await expect(page.getByRole('alert')).toBeVisible();
 await page.goto('./#/ajustes');await page.getByLabel('Usar IA si no hay una receta adecuada para mis ingredientes').uncheck();await page.goto('./#/cocina-despensa');await page.getByRole('button',{name:'Latas de bonito',exact:true}).click();await page.getByRole('button',{name:'Garbanzos',exact:true}).click();await page.getByRole('button',{name:'Generar receta',exact:true}).click();await expect(page.getByRole('button',{name:'Crear receta con IA',exact:true})).toBeVisible();expect(calls).toBe(1);
});
test('English translates avatar menu and preserves filter values',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('chef:settings',JSON.stringify({language:'en'})));await page.goto('./#/buscar');await page.getByRole('button',{name:'Open menu',exact:true}).click();await expect(page.getByRole('button',{name:'My recipes',exact:true})).toBeVisible();await page.getByRole('button',{name:'Close navigation menu',exact:true}).click();await page.getByRole('button',{name:'Filters',exact:true}).click();await page.getByLabel('Style',{exact:true}).selectOption('Casera');await expect(page.getByLabel('Style',{exact:true})).toHaveValue('Casera');
});
test('recipe has rounded corners and a consistent gap below nutrition',async({page},info)=>{
 await page.goto('./#/receta/lib-001');const radius=await page.locator('.recipe-editorial-intro').evaluate(e=>getComputedStyle(e).borderBottomLeftRadius);expect(radius).toBe('26px');const gap=await page.locator('.recipe-page>.recipe-content').evaluate(e=>getComputedStyle(e).gap);expect(gap).toBe('16px');await page.screenshot({path:info.outputPath('recipe.png'),fullPage:true});
});

test('photo action and identification cards have breathing room',async({page},info)=>{
 await page.goto('./#/foto');await page.locator('input[type=file]').last().setInputFiles('public/home-photo-recipe.png');const a=await page.locator('.photo-recipe-actions').boundingBox();const b=await page.getByRole('button',{name:'Analizar el plato',exact:true}).boundingBox();expect(b!.y-a!.y-a!.height).toBeGreaterThanOrEqual(16);await page.screenshot({path:info.outputPath('photo.png'),fullPage:true});
});
