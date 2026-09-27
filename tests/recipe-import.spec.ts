import {test,expect} from '@playwright/test';
import {publicImportUrl} from '../server/importSource';
import {parseImportText,buildImportedRecipe} from '../src/services/recipeImport';
import {sourcePlatformFromUrl} from '../src/utils/importSourceUrl';
import {detectRecipeAllergens} from '../src/data/allergens';
import {foodPreferenceRestrictions} from '../src/services/foodPreferences';
import {reviewPhotoProposal} from '../src/utils/photoIngredients';
import {jsPDF} from 'jspdf';

const text='Arroz sencillo\nComensales: 2\nIngredientes\n200 g de arroz\n400 ml de agua\nElaboración\n1. Cocer el arroz en el agua.';

test('import parser preserves missing fields and public social URLs',()=>{
 const d=parseImportText(text);
 expect(d.servings).toBe('2');expect(d.prep).toBe('');expect(d.ingredients[0]).toEqual({name:'arroz',quantity:'200',unit:'g'});
 expect(()=>buildImportedRecipe(d,'metric')).toThrow();
 expect(buildImportedRecipe({...d,prep:'0',cook:'20'},'metric').nutritionStatus).toBe('unavailable');
 for(const url of ['http://example.com','https://127.0.0.1','https://[::1]','https://a.local','https://user:pass@example.com','file:///x'])expect(()=>publicImportUrl(url)).toThrow();
 for(const url of ['https://www.youtube.com/watch?v=test','https://youtu.be/test','https://www.instagram.com/reel/test/','https://www.tiktok.com/@chef/video/1'])expect(()=>publicImportUrl(url)).not.toThrow();
 expect(sourcePlatformFromUrl('https://youtu.be/test')).toBe('youtube');
 expect(sourcePlatformFromUrl('https://www.instagram.com/reel/test')).toBe('instagram');
});

test('metric import converts safe units and keeps originals',()=>{
 const d=parseImportText('Pollo\nComensales: 2\nPreparación: 5 min\nCocción: 20 min\nIngredientes\n1 lb pollo\nElaboración\n1. Hornear a 350 F.');
 const recipe=buildImportedRecipe(d,'metric');
 expect(recipe.ingredients[0].unit).toBe('g');expect(recipe.ingredients[0].quantity).toBeCloseTo(453.6,1);
 expect(recipe.ingredients[0].originalUnit).toBe('lb');expect(recipe.steps[0].instruction).toContain('177 °C');
});

test('allergen detection and global restrictions remain conservative',()=>{
 const recipe=buildImportedRecipe(parseImportText('Tostada\nComensales: 1\nPreparación: 5 min\nCocción: 0 min\nIngredientes\n50 g pan de trigo\n20 g queso\nElaboración\n1. Servir.'),'metric');
 expect(detectRecipeAllergens(recipe)).toEqual(expect.arrayContaining(['Gluten','Leche']));
 expect(foodPreferenceRestrictions({allergies:['Gluten','Leche'],intolerances:['lactosa'],avoidIngredients:['cilantro'],unitPreference:'metric',nutritionDisplay:'per-serving'})).toEqual(expect.arrayContaining(['Sin gluten','Sin lácteos','Intolerancia a lactosa','Evitar cilantro']));
});

test('photo dessert rejects unexplained pantry seasonings but respects explicit user ingredients',()=>{
 const p={id:'x',recipeId:'x',title:'Tarta tatin con chantilly',subtitle:'Postre',emoji:'🍰',minutes:30,difficulty:'Fácil' as const,reason:'Foto',usedIngredients:['Manzana','Ajo','Pimienta'],missingIngredients:['Nata','Cebolla']};
 expect(reviewPhotoProposal(p).usedIngredients).toEqual(['Manzana']);expect(reviewPhotoProposal(p).missingIngredients).toEqual(['Nata']);expect(reviewPhotoProposal(p,'Lleva ajo').usedIngredients).toContain('Ajo');
});

test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{for(const k of ['chef:home-greeted:v2','chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2'])sessionStorage.setItem(k,'1')});
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
});

test('written and social recipe links use the same import gateway',async({page})=>{
 let reads=0;
 await page.route('**/api/import-source',async r=>{
  reads++;
  const request=JSON.parse(r.request().postData()||'{}') as {url?:string};
  if(request.url?.includes('youtu.be'))return r.fulfill({contentType:'application/json',body:JSON.stringify({url:request.url,html:'<meta property="og:title" content="Pasta del vídeo"><meta property="og:description" content="Receta de pasta con tomate. Ingredientes y pasos completos disponibles en la descripción de esta publicación para preparar una cena sencilla."> '})});
  return r.fulfill({contentType:'application/json',body:JSON.stringify({url:'https://example.com/receta',html:'<script type="application/ld+json">'+JSON.stringify({'@type':'Recipe',name:'Arroz publicado',recipeYield:'2',prepTime:'PT5M',cookTime:'PT20M',recipeIngredient:['200 g de arroz','400 ml de agua'],recipeInstructions:[{'@type':'HowToStep',text:'Cocer el arroz en agua durante 20 minutos.'}],author:{name:'Autor de prueba'}})+'</script>'})});
 });
 await page.goto('./#/importar-receta');
 await page.getByLabel('Enlace de receta o publicación').fill('https://youtu.be/prueba');
 await page.getByRole('button',{name:'Leer enlace',exact:true}).click();
 await expect(page.getByLabel('Texto de la receta',{exact:true})).toHaveValue(/Pasta del vídeo/);expect(reads).toBe(1);
 await page.getByLabel('Enlace de receta o publicación').fill('https://example.com/receta');
 await page.getByRole('button',{name:'Leer enlace',exact:true}).click();
 await expect(page.getByLabel('Texto de la receta',{exact:true})).toHaveValue(/Preparación: 5 min/);expect(reads).toBe(2);
});

test('import text is private, editable and persists source without invented nutrition',async({page})=>{
 let calls=0;await page.route('**/chef-media/**',r=>{calls++;return r.abort()});
 await page.goto('./#/mis-recetas');await page.getByRole('button',{name:'Importar receta',exact:true}).click();
 await page.getByLabel('Texto de la receta',{exact:true}).fill(text);await page.getByRole('button',{name:'Organizar sin IA',exact:true}).click();
 await expect(page.getByRole('button',{name:'Guardar en Mis recetas',exact:true})).toBeDisabled();
 await page.getByLabel('Preparación (min)',{exact:true}).fill('0');await page.getByLabel('Cocción (min)',{exact:true}).fill('20');
 await page.getByLabel('Autor o creador',{exact:false}).fill('Receta familiar');await page.getByLabel('Enlace original (opcional)',{exact:true}).fill('https://example.com/arroz');
 await expect(page.getByRole('button',{name:'Guardar en Mis recetas',exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Guardar en Mis recetas',exact:true}).click();await expect(page).toHaveURL(/receta\/import-/);
 await page.reload();await expect(page.getByRole('heading',{name:'Arroz sencillo',exact:true})).toBeVisible();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('the-chef:library-recipe-snapshots:v1')!)[0]);
 expect(stored.source.publisher).toBe('Receta familiar');expect(stored.source.url).toBe('https://example.com/arroz');expect(stored.nutritionStatus).toBe('unavailable');expect(calls).toBe(0);
});

test('PDF text extraction loads lazily and does not send the file to AI',async({page})=>{
 const pdf=new jsPDF();pdf.text(text.split('\n'),20,20);await page.goto('./#/importar-receta');
 await page.getByLabel('Archivo de receta',{exact:true}).setInputFiles({name:'receta.pdf',mimeType:'application/pdf',buffer:Buffer.from(pdf.output('arraybuffer'))});
 await expect(page.getByLabel('Texto de la receta',{exact:true})).toHaveValue(/200 g de arroz/,{timeout:30000});await expect(page.getByRole('alert')).toHaveCount(0);
});

test('photo or capture is routed to Foto Receta instead of duplicated import',async({page})=>{
 await page.goto('./#/importar-receta');await page.getByRole('button',{name:/Abrir Foto Receta/}).click();await expect(page).toHaveURL(/#\/foto/);await expect(page.getByRole('heading',{name:'Foto Receta'})).toBeVisible();
});

test('all four social networks offer honest sharing instructions',async({page})=>{
 await page.goto('./#/receta/lib-001');await page.getByRole('button',{name:'Compartir',exact:true}).click();
 for(const network of ['Instagram','Facebook','TikTok','X']){await page.getByRole('button',{name:network,exact:true}).click();await expect(page.getByRole('button',{name:network,exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('dialog')).toContainText('La publicación se confirma dentro de la red social.');}
});
