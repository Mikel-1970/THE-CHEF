import {test,expect} from '@playwright/test';
import {isChefChoice,prepareDesireRequest,CUISINE_REQUIRED} from '../src/utils/chefChoice';
import {textMatchesDesireIntent,recipeMatchesDesireIntent} from '../src/utils/desireIntent';
import {mockRecipes} from '../src/data/mockRecipes';
import {chefLibrary} from '../src/data/library';
import {getMockProposals} from '../src/services/mockRecommendationEngine';
import {foodTextMatches} from '../src/utils/recipeSearch';
import {cleanRecipeAdvice} from '../src/utils/recipeAdvice';

test('pil pil variants select the actual cod dish and never substitute another fish',()=>{
 for(const text of ['bacalao al pilpil','bacalao al pil pil','bacalao al pil-pil']){
  const matches=getMockProposals({mode:'desire',desireText:text,servings:4},[],true);
  expect(matches[0].title).toBe('Bacalao al pilpil');
 }
 expect(foodTextMatches('Merluza con patatas','bacalao')).toBe(false);
 expect(foodTextMatches('Arroz con bacalao','bacalao al pil pil')).toBe(false);
 expect(getMockProposals({mode:'desire',desireText:'Tengo huevos, arroz, bonito y yogur griego',servings:4},[],true)).toHaveLength(0);
 expect(chefLibrary.some(r=>r.title==='Bacalao al pilpil')).toBe(true);
});

test('advice is deduplicated across sections while distinct safety temperatures remain',()=>{
 const clean=cleanRecipeAdvice({...mockRecipes[0],criticalPoints:['No superes 60 °C.','No superes 70 °C.'],miseEnPlace:['Corta el ajo en láminas.','Corta el ajo en láminas.'],substitutions:['Corta el ajo en láminas.','Puedes usar patata en lugar de arroz.','Usar patata en lugar de arroz.','No superes 60 °C.']});
 expect(clean.criticalPoints).toHaveLength(2);expect(clean.miseEnPlace).toEqual(['Corta el ajo en láminas.']);expect(clean.substitutions).toEqual(['Puedes usar patata en lugar de arroz.']);
 expect(cleanRecipeAdvice(clean)).toEqual(clean);
});

test('search finds pil pil despite default difficulty and never calls AI first',async({page})=>{
 let calls=0;await page.route('**/recipes/**',r=>{calls++;return r.abort()});
 await page.addInitScript(()=>localStorage.setItem('chef:settings',JSON.stringify({defaultDifficulty:'Fácil'})));
 await page.goto('./#/antojo');await expect(page.getByRole('button',{name:'Personalizar',exact:true})).toHaveCount(0);
 await page.getByLabel('Tu petición').fill('bacalao al pil pil');await page.getByRole('button',{name:'Confirmar petición'}).click();await page.getByRole('button',{name:'Buscar receta',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Bacalao al pilpil',exact:true})).toBeVisible();expect(calls).toBe(0);
 await page.goto('./#/buscar');await page.getByPlaceholder('Ej. pasta pollo, italiana, calabacín…').fill('bacalao al pil pil');await expect(page.locator('.library-photo-card')).toHaveCount(1);await expect(page.locator('.library-photo-card')).toContainText('Bacalao al pilpil');
});
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
test('empty request asks for cuisine without calling AI',async({page})=>{let external=0;await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname==='127.0.0.1')return r.continue();if(url.pathname.includes('/recipes/')||url.pathname.includes('/chef-media/'))external++;return r.abort()});await page.goto('./#/antojo');await page.getByRole('button',{name:'Buscar receta',exact:true}).click();await expect(page.getByRole('alert')).toHaveText(CUISINE_REQUIRED);await expect(page.getByLabel('Tipo de cocina',{exact:true})).toBeVisible();expect(external).toBe(0)});

test('chef choice opens a Peruvian library recipe for five without AI',async({page})=>{
 const external:string[]=[];await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname==='127.0.0.1')return r.continue();external.push(url.pathname);return r.abort()});
 await page.goto('./#/antojo');await page.getByLabel('Tu petición').fill('Cocina peruana para 5 personas');await page.getByRole('button',{name:'Confirmar petición'}).click();await expect(page.getByRole('button',{name:'Personalizar',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Buscar receta',exact:true}).click();await expect(page).toHaveURL(/receta\/lib-\d+\?servings=5/);await expect(page.locator('.hero-meta')).toContainText('5 comensales');await expect(page.locator('.hero-meta')).toContainText('Peruana');expect(external.filter(path=>path.includes('/recipes/')||path.includes('/chef-media/'))).toEqual([]);
});
