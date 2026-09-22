import {test,expect} from '@playwright/test';
test('photo library has two columns, favorites and recipe navigation',async({page},info)=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.addInitScript(()=>{sessionStorage.setItem('chef:auth:session:v1','1');sessionStorage.setItem('chef:entry-tutorial:seen-session:v1','1');sessionStorage.setItem('chef:tutorial:invite-dismissed-session:v2','1');localStorage.setItem('chef:saved-recipes',JSON.stringify(['arroz-pollo-calabacin','pasta-tomate-burrata']))});
 await page.goto('./#/mis-recetas');
 await page.evaluate(async()=>{const response=await fetch('/THE-CHEF/home-photo-recipe.png');const blob=await response.blob();const cache=await caches.open('chef-recipe-thumbnails-v1');for(const id of ['arroz-pollo-calabacin','pasta-tomate-burrata'])await cache.put('https://the-chef.local/recipe-thumbnails/'+id,new Response(blob))});await page.reload();
 await expect(page.locator('.library-photo-card')).toHaveCount(2);await expect(page.locator('.library-photo-card img')).toHaveCount(2);
 const boxes=await page.locator('.library-photo-card').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));expect(boxes[0].y).toBe(boxes[1].y);expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
 await page.screenshot({path:info.outputPath('library.png'),fullPage:true});
 await page.locator('.library-photo-heart').first().click();await page.getByRole('button',{name:'Favoritas',exact:true}).click();await expect(page.locator('.library-photo-card')).toHaveCount(1);
 await page.locator('.library-photo-open').click();await expect(page).toHaveURL(/receta\/arroz-pollo-calabacin$/);
});
