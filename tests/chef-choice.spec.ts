import {test,expect} from '@playwright/test';
import {isChefChoice,prepareDesireRequest,CUISINE_REQUIRED} from '../src/utils/chefChoice';
import {textMatchesDesireIntent,recipeMatchesDesireIntent} from '../src/utils/desireIntent';
import {mockRecipes} from '../src/data/mockRecipes';
for(const text of ['', 'Lo que tú quieras.', 'Lo que el chef quiera', 'Sorpréndeme', 'Algo peruano', 'Cocina peruana para cinco personas'])test('chef choice: '+text,()=>{
 const request={mode:'desire' as const,desireText:text,cuisine:'Peruana',servings:5,restrictions:['Sin gluten']};expect(isChefChoice(request)).toBe(true);const prepared=prepareDesireRequest(request);expect(prepared.desireText).toContain('plato típico');expect(prepared.servings).toBe(5);expect(prepared.restrictions).toEqual(['Sin gluten']);expect(textMatchesDesireIntent('Lomo saltado con arroz',prepared)).toBe(true);
});
test('unspecified cuisine asks before generating',()=>{expect(()=>prepareDesireRequest({mode:'desire',desireText:'Lo que tú quieras',servings:5})).toThrow(CUISINE_REQUIRED)});
test('explicit products remain constraints and cuisine fallback cannot change origin',()=>{
 const request={mode:'desire' as const,desireText:'Sorpréndeme con pollo',servings:5,cuisine:'Peruana'};expect(isChefChoice(request)).toBe(false);expect(textMatchesDesireIntent('Pollo asado',request)).toBe(true);expect(textMatchesDesireIntent('Tarta de chocolate',request)).toBe(false);
 expect(recipeMatchesDesireIntent({...mockRecipes[0],cuisine:'Italiana'},{...request,desireText:'Lo que tú quieras'})).toBe(false);
 expect(textMatchesDesireIntent('Arroz cremoso',{...request,desireText:'Tarta de chocolate'})).toBe(false);
});
test.beforeEach(async({page})=>{await page.addInitScript(()=>{for(const key of ['chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2'])sessionStorage.setItem(key,'1')});});
test('empty request asks for cuisine without calling AI',async({page})=>{let external=0;await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname==='127.0.0.1')return r.continue();if(url.pathname.includes('/recipes/')||url.pathname.includes('/chef-media/'))external++;return r.abort()});await page.goto('./#/antojo');await page.getByRole('button',{name:'Generar receta',exact:true}).click();await expect(page.getByRole('alert')).toHaveText(CUISINE_REQUIRED);await expect(page.getByLabel('Tipo de cocina',{exact:true})).toBeVisible();expect(external).toBe(0)});

test('chef choice opens a Peruvian library recipe for five without AI',async({page})=>{
 const external:string[]=[];await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname==='127.0.0.1')return r.continue();external.push(url.pathname);return r.abort()});
 await page.goto('./#/antojo');await page.getByLabel('Tu petición').fill('Lo que tú quieras.');await page.getByRole('button',{name:'Confirmar petición'}).click();await page.getByRole('button',{name:'Personalizar',exact:true}).click();await page.getByLabel('Tipo de cocina',{exact:true}).selectOption('Peruana');await page.getByRole('button',{name:'Aumentar',exact:true}).click();
 await page.getByRole('button',{name:'Generar receta',exact:true}).click();await expect(page).toHaveURL(/receta\/lib-\d+\?servings=5/);await expect(page.getByLabel('Comensales',{exact:true})).toHaveValue('5');await expect(page.locator('.hero-meta')).toContainText('Peruana');expect(external.filter(path=>path.includes('/recipes/')||path.includes('/chef-media/'))).toEqual([]);
});
