import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.addInitScript(()=>{sessionStorage.setItem('chef:auth:session:v1','1');sessionStorage.setItem('chef:entry-tutorial:seen-session:v1','1');sessionStorage.setItem('chef:tutorial:invite-dismissed-session:v2','1')});
});
test('theme follows system, persists explicit selection and profile editing works',async({page},info)=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('./#/ajustes');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.getByRole('button',{name:'Claro',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.getByRole('button',{name:'Editar perfil',exact:true}).click();await page.getByPlaceholder('Tu nombre',{exact:true}).fill('Mikel prueba');
 await page.getByRole('button',{name:'Terminar edición',exact:true}).click();await page.reload();await expect(page.getByText('Mikel prueba',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Oscuro',exact:true}).click();await page.screenshot({path:info.outputPath('settings-dark.png'),fullPage:true});
 await page.getByRole('button',{name:'Automático',exact:true}).click();await page.emulateMedia({colorScheme:'light'});await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.getByRole('button',{name:'Calificar la app',exact:true}).click();await page.getByRole('button',{name:'4 estrellas',exact:true}).click();await expect(page.getByText('Valoración guardada en este dispositivo.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Enviar comentarios',exact:true}).click();await page.getByLabel('¿Qué mejorarías?').fill('Prueba');await expect(page.getByRole('button',{name:'Compartir comentario',exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Eliminar datos de este dispositivo',exact:true}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('chef:settings'))).toContain('Mikel prueba');
});
test('home greeting lasts 3.5 seconds, fixed avatar opens settings, collage remains',async({page},info)=>{
 await page.clock.install();await page.clock.pauseAt(new Date());await page.goto('./');
 await expect(page.locator('.welcome-entry')).toBeVisible();await page.clock.runFor(3200);await expect(page.locator('.welcome-entry')).toBeVisible();await page.clock.runFor(400);
 await expect(page.locator('.reference-home')).toBeVisible();await expect(page.locator('.reference-home .food-collage')).toBeVisible();await page.screenshot({path:info.outputPath('home-collage.png'),fullPage:true});
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.getByRole('button',{name:'Perfil y ajustes',exact:true}).click();await expect(page.getByRole('button',{name:'Salir',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Volver',exact:true}).click();await expect(page.locator('.welcome-entry')).toHaveCount(0);
});

test('recipe photograph precedes content and is twenty percent shorter',async({page},info)=>{
 await page.route('**/chef-media/image',r=>r.fulfill({json:{imageUrl:'http://127.0.0.1:4175/THE-CHEF/home-photo-recipe.png'}}));
 await page.emulateMedia({colorScheme:'dark'});await page.goto('./#/receta/arroz-pollo-calabacin');
 await expect(page.locator('.recipe-hero img')).toBeVisible();
 const image=await page.locator('.recipe-hero').boundingBox(),title=await page.locator('.recipe-title-block').boundingBox();
 expect(image!.height).toBe(208);expect(image!.y).toBeLessThan(title!.y);expect(title!.y).toBeGreaterThan(image!.y+image!.height-30);
 await page.screenshot({path:info.outputPath('recipe-dark.png'),fullPage:true});
 await page.getByRole('button',{name:'Ingredientes Lo que necesitas',exact:true}).click();await expect(page.getByRole('heading',{name:'Ingredientes',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
