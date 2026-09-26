import {test,expect} from '@playwright/test';
import {inferTechniqueIdsFromText,getTechniquesForRecipe} from '../src/services/techniqueResolver';
import {mockRecipes} from '../src/data/mockRecipes';

test('ingredients alone do not invent culinary techniques',()=>{
 expect(inferTechniqueIdsFromText('Pon agua y aceite en un bol.')).toEqual([]);
 expect(inferTechniqueIdsFromText('Pelar la cebolla.')).toContain('TEC-PREP-001');
 expect(getTechniquesForRecipe(mockRecipes[0]).length).toBeGreaterThan(0);
});
test.beforeEach(async({page})=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.addInitScript(()=>{
  for(const k of ['chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2','chef:home-greeted:v2'])sessionStorage.setItem(k,'1');
 });
});
test('four primary shortcuts and one culinary module in the menu',async({page},info)=>{
 await page.goto('./');
 await expect(page.locator('.reference-quick-grid strong')).toHaveText(['Favoritos','Mis recetas','Técnicas','Lista de la compra']);
 await page.screenshot({path:info.outputPath('home.png'),fullPage:true});
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
 await expect(page.locator('.chef-menu-grid').getByRole('button',{name:'Técnicas y tips',exact:true})).toHaveCount(1);
 await expect(page.locator('.chef-menu-grid').getByRole('button',{name:'Tips',exact:true})).toHaveCount(0);
 await page.locator('.chef-menu-grid').getByRole('button',{name:'Técnicas y tips',exact:true}).click();
 await expect(page.locator('.technique-photo-card')).toHaveCount(180);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('techniques.png'),fullPage:true});
});
test('technique detail restores filters, reloads and returns from subpanel',async({page})=>{
 await page.goto('./#/tecnicas');
 await page.getByLabel('Buscar técnica o uso').fill('emulsion');
 await expect(page.locator('.technique-photo-card')).toHaveCount(2);
 await page.locator('.technique-photo-open').first().click();
 await expect(page.locator('.technique-card')).toBeVisible();
 await expect(page.locator('.technique-photo-grid')).toHaveCount(0);
 await page.reload();await expect(page.locator('.technique-card')).toBeVisible();
 await page.getByRole('button',{name:/Puntos críticos/}).click();
 await page.getByRole('button',{name:'Volver',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Volver a la biblioteca',exact:true}).click();
 await expect(page.getByLabel('Buscar técnica o uso')).toHaveValue('emulsion');
 await expect(page.locator('.technique-photo-card')).toHaveCount(2);
});
test('techniques and tips switch without a back-button loop',async({page},info)=>{
 await page.goto('./#/tecnicas');
 await page.getByRole('link',{name:'Tips',exact:true}).click();
 await expect(page.locator('.tip-review-card')).toHaveCount(150);
 await expect(page.getByLabel('Filtrar tips por categoría').locator('option')).toHaveCount(15);
 await page.getByLabel('Buscar tip').fill('TIP-001');
 await expect(page.locator('.tip-review-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Me interesa',exact:true}).click();
 await page.reload();await page.getByLabel('Buscar tip').fill('TIP-001');
 await expect(page.getByRole('button',{name:'Me interesa',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.screenshot({path:info.outputPath('tip.png'),fullPage:true});
 await page.getByRole('button',{name:'Volver',exact:true}).click();
 await expect(page).toHaveURL(/#\/tecnicas$/);
 await page.getByRole('button',{name:'Volver',exact:true}).click();
 await expect(page.locator('.reference-quick-grid')).toBeVisible();
});
test('recipe uses real technique cards and returns to the same recipe',async({page})=>{
 await page.goto('./#/receta/arroz-pollo-calabacin');
 await page.locator('.recipe-technique-chips button').first().click();
 await expect(page.locator('.technique-card')).toBeVisible();
 await page.getByRole('button',{name:'Volver a la receta',exact:true}).click();
 await expect(page).toHaveURL(/#\/receta\/arroz-pollo-calabacin$/);
});
test('optional manual timer and cooking step survive technique round trip',async({page},info)=>{
 await page.goto('./#/cocinar/arroz-pollo-calabacin?servings=2');
 const backBox=await page.locator('.cook-return-recipe').boundingBox();
 const titleBox=await page.locator('.cook-header>div').boundingBox();
 expect(backBox!.y+backBox!.height).toBeLessThanOrEqual(titleBox!.y);
 await expect(page.getByRole('button',{name:'Volver',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Abrir temporizador',exact:true}).click();
 await expect(page.getByLabel('Minutos del temporizador')).toBeVisible();
 await page.getByLabel('Minutos del temporizador').fill('3');
 await page.getByLabel('Segundos del temporizador').fill('0');
 await page.getByRole('button',{name:'Iniciar',exact:true}).click();
 await expect(page.getByRole('button',{name:'Pausar',exact:true})).toBeVisible();
 const step=await page.locator('.cook-step-label').textContent();
 await page.locator('.cook-technique-context .cook-tool-toggle').click();
 await page.getByRole('button',{name:'Aprender técnica completa'}).click();
 await page.getByRole('button',{name:'Volver a elaboración',exact:true}).click();
 await expect(page.locator('.cook-step-label')).toHaveText(step!);
 await expect(page.getByRole('button',{name:'Pausar',exact:true})).toBeVisible();
 await expect(page.locator('.cook-serving')).toContainText('2 personas');
 await page.screenshot({path:info.outputPath('cooking.png'),fullPage:true});
});


test('every technique step exposes an editable timer',async({page})=>{
 await page.goto('./#/tecnicas');
 await page.locator('.technique-photo-open').first().click();
 await page.getByRole('button',{name:/Empezar técnica/}).click();
 await expect(page.getByRole('button',{name:'Abrir temporizador',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Abrir temporizador',exact:true}).click();
 await expect(page.getByLabel('Minutos del temporizador')).toBeVisible();
 await expect(page.getByLabel('Segundos del temporizador')).toBeVisible();
});

test('proposal route is retired and entry points search the library',async({page})=>{
 await page.goto('./#/antojo');
 await expect(page.getByRole('button',{name:'Buscar receta',exact:true})).toBeVisible();
 await page.goto('./#/cocina-despensa');
 await expect(page.getByRole('button',{name:'Buscar receta',exact:true})).toBeVisible();
 await page.goto('./#/propuestas');
 await expect(page).toHaveURL(/#\/$/);
});
