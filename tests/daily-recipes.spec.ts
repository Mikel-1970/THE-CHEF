import {test,expect} from '@playwright/test';
import {chefLibrary} from '../src/data/library';
import {mockRecipes} from '../src/data/mockRecipes';
import {getMyRecipes} from '../src/services/recipeCatalog';
import {formatDuration} from '../src/utils/time';

const curry=mockRecipes.find(recipe=>recipe.id==='pollo-curry-arroz')!;
const risotto=mockRecipes.find(recipe=>recipe.id==='risotto-setas')!;

test('Mis recetas excludes demo recipes unless saved or favorited and respects removals',()=>{
  const defaults=getMyRecipes([],[],[]);
  expect(defaults.map(recipe=>recipe.id)).toEqual(chefLibrary.map(recipe=>recipe.id));
  const personalized=getMyRecipes([curry.id],[risotto.id,curry.id],[chefLibrary[0].id]);
  expect(personalized.filter(recipe=>recipe.id===curry.id)).toHaveLength(1);
  expect(personalized.some(recipe=>recipe.id===risotto.id)).toBe(true);
  expect(personalized.some(recipe=>recipe.id===chefLibrary[0].id)).toBe(false);
});

test.describe('daily proposal browser regressions',()=>{
test.beforeEach(async({page})=>{
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.addInitScript(()=>{
    for(const key of ['chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2','chef:home-greeted:v2'])sessionStorage.setItem(key,'1');
  });
});

test('daily proposals use the visible library with matching metadata and recipe photos',async({page},info)=>{
  const retained=chefLibrary.slice(0,2);
  await page.addInitScript(({removed,curryId,risottoId,transient})=>{
    localStorage.setItem('chef:removed-library-recipes:v1',JSON.stringify(removed));
    localStorage.setItem('chef:saved-recipes',JSON.stringify([curryId]));
    localStorage.setItem('chef:favorites',JSON.stringify([risottoId]));
    localStorage.setItem('the-chef:external-recipes:v1',JSON.stringify([transient]));
  },{removed:chefLibrary.slice(2).map(recipe=>recipe.id),curryId:curry.id,risottoId:risotto.id,transient:{...curry,id:'search-only',title:'Resultado sin guardar',source:{kind:'ai',label:'Búsqueda'}}});
  await page.goto('./');
  const cards=page.locator('.alm-daily-card');
  await expect(cards).toHaveCount(4);
  const displayed=await cards.locator('.alm-daily-copy strong').allTextContents();
  expect(displayed.sort()).toEqual([...retained,curry,risotto].map(recipe=>recipe.title).sort());
  for(const recipe of [...retained,curry,risotto]){
    const card=cards.filter({has:page.locator('.alm-daily-copy strong',{hasText:recipe.title})});
    await expect(card.locator('.alm-daily-meta')).toContainText(recipe.difficulty);
    await expect(card.locator('.alm-daily-meta')).toContainText(formatDuration(recipe.prepMinutes+recipe.cookMinutes));
    if(retained.includes(recipe)){
      await expect(card.locator('img')).toHaveAttribute('src',new RegExp(`/library/${recipe.id}_min.webp`));
      await expect.poll(()=>card.locator('img').evaluate((image:HTMLImageElement)=>image.naturalWidth)).toBeGreaterThan(0);
    }else{
      await expect(card.locator('img')).toHaveCount(0);
      await expect(card.getByRole('img',{name:`Sin foto de ${recipe.title}`})).toBeVisible();
    }
  }
  await page.screenshot({path:info.outputPath('daily-recipes.png'),fullPage:true});
  await page.getByRole('button',{name:'Mis recetas',exact:true}).click();
  await expect(page.locator('.library-photo-card')).toHaveCount(4);
  expect((await page.locator('.library-photo-caption strong').allTextContents()).sort()).toEqual(displayed);
  await page.getByRole('button',{name:`Abrir ${retained[0].title}`,exact:true}).click();
  await expect(page).toHaveURL(new RegExp(`/receta/${retained[0].id}`));
  await expect(page.locator('.recipe-title-block')).toContainText(retained[0].title);
});

test('missing or failed photos stay neutral, cached photos belong to their recipe',async({page})=>{
  await page.addInitScript(({removed,curryId})=>{
    localStorage.setItem('chef:removed-library-recipes:v1',JSON.stringify(removed));
    localStorage.setItem('chef:saved-recipes',JSON.stringify([curryId]));
  },{removed:chefLibrary.slice(1).map(recipe=>recipe.id),curryId:curry.id});
  await page.route(`**/library/${chefLibrary[0].id}_min.webp*`,route=>route.abort());
  await page.goto('./');
  await expect(page.locator('.alm-daily-card')).toHaveCount(2);
  await expect(page.locator('.alm-daily-card img')).toHaveCount(0);
  await expect(page.locator('.recipe-photo-unavailable')).toHaveCount(2);
  await page.evaluate(async(id)=>{
    const cache=await caches.open('chef-recipe-thumbnails-v1');
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="orange"/></svg>';
    await cache.put(`https://the-chef.local/recipe-thumbnails/${id}`,new Response(svg,{headers:{'Content-Type':'image/svg+xml'}}));
  },curry.id);
  await page.reload();
  const curryCard=page.locator('.alm-daily-card').filter({hasText:curry.title});
  await expect(curryCard.locator('img')).toHaveAttribute('src',/^blob:/);
  await expect.poll(()=>curryCard.locator('img').evaluate((image:HTMLImageElement)=>image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('.recipe-photo-unavailable')).toHaveCount(1);
});

test('empty Mis recetas does not invent daily proposals',async({page})=>{
  await page.addInitScript(ids=>localStorage.setItem('chef:removed-library-recipes:v1',JSON.stringify(ids)),chefLibrary.map(recipe=>recipe.id));
  await page.goto('./');
  await expect(page.locator('.alm-daily-card')).toHaveCount(0);
  await expect(page.getByText('No tienes recetas disponibles.')).toBeVisible();
});
});
