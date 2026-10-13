import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.addInitScript(()=>{sessionStorage.setItem('chef:auth:session:v1','1');sessionStorage.setItem('chef:entry-tutorial:seen-session:v1','1');sessionStorage.setItem('chef:tutorial:invite-dismissed-session:v2','1')});
});
test('theme follows system, persists explicit selection and profile editing works',async({page},info)=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('./#/ajustes');
 await expect(page.locator('.settings-card').filter({hasText:'Picante habitual'}).locator('.settings-card-title svg')).toBeVisible();
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
test('home greeting waits for Login, fixed avatar opens settings, collage remains',async({page},info)=>{
 await page.clock.install();await page.clock.pauseAt(new Date());await page.goto('./');
 await expect(page.locator('.welcome-entry')).toBeVisible();await page.clock.runFor(3200);await expect(page.locator('.welcome-entry')).toBeVisible();await page.clock.runFor(120000);await expect(page.locator('.welcome-entry')).toBeVisible();await page.getByRole('button',{name:'Regístrate',exact:true}).click();await expect(page.getByText('Tu cuenta ya está registrada. Pulsa Login para entrar.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Login',exact:true}).click();
 await expect(page.locator('.reference-home')).toBeVisible();await expect(page.locator('.reference-home .food-collage')).toBeVisible();await page.screenshot({path:info.outputPath('home-collage.png'),fullPage:true});
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.getByRole('button',{name:'Perfil y ajustes',exact:true}).click();await expect(page.getByRole('button',{name:'Guardar cambios',exact:true}).first()).toBeVisible();
 await page.getByRole('button',{name:'Volver',exact:true}).click();await expect(page.locator('.welcome-entry')).toHaveCount(0);
});

test('recipe shows title then a single complete photograph then nutrition',async({page},info)=>{
 await page.route('**/chef-media/image',r=>r.fulfill({json:{imageUrl:'http://127.0.0.1:4175/THE-CHEF/home-photo-recipe.png'}}));
 await page.emulateMedia({colorScheme:'dark'});await page.goto('./#/receta/arroz-pollo-calabacin');
 await expect(page.locator('.recipe-complete-photo img')).toBeVisible();
 const image=await page.locator('.recipe-complete-photo').boundingBox(),title=await page.locator('.recipe-title-block').boundingBox();
 expect(image!.y).toBeGreaterThan(title!.y+title!.height);await expect(page.locator('.generated-recipe-photo')).toHaveCount(0);await expect(page.locator('.servings-card')).toHaveCount(0);expect(await page.locator('.recipe-complete-photo img').evaluate(img=>getComputedStyle(img).objectFit)).toBe('contain');
 await page.screenshot({path:info.outputPath('recipe-dark.png'),fullPage:true});
 await page.getByRole('button',{name:'Ingredientes Lo que necesitas',exact:true}).click();await expect(page.getByRole('heading',{name:'Ingredientes',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});


test('save settings returns to previous screen, persists changes and never logs out',async({page})=>{
 const logout:string[]=[];page.on('request',r=>{if(r.url().includes('/cdn-cgi/access/logout'))logout.push(r.url())});
 await page.goto('./#/cocina-despensa');await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.getByRole('button',{name:'Perfil y ajustes',exact:true}).click();
 await page.getByRole('button',{name:'Editar perfil',exact:true}).click();await page.getByPlaceholder('Tu nombre',{exact:true}).fill('Mikel guardado');await page.getByRole('button',{name:'Oscuro',exact:true}).click();
 await page.getByRole('button',{name:'Guardar cambios',exact:true}).first().click();await expect(page).toHaveURL(/#\/cocina-despensa$/);
 expect(await page.evaluate(()=>sessionStorage.getItem('chef:auth:session:v1'))).toBe('1');expect(logout).toEqual([]);await page.reload();await expect(page.getByRole('heading',{name:'Abre la despensa',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('chef:settings')!).displayName)).toBe('Mikel guardado');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});

test('personalization exposes options, submits without dictation and preserves original on failure',async({page},info)=>{
 let payload:any;
 await page.route('**/recipes/revise',r=>{payload=r.request().postDataJSON();return r.fulfill({status:500,json:{error:'test'}})});
 await page.goto('./#/receta/arroz-pollo-calabacin');
 const title=await page.locator('h1').textContent();
 await page.getByRole('button',{name:'Marcar como favorita',exact:true}).click();await expect(page.getByRole('button',{name:'Quitar de favoritos',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Personalizar receta',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Personalizar receta'});
 await expect(dialog.getByText('Comensales',{exact:true})).toHaveCount(0);await expect(dialog.getByText('Tiempo máximo',{exact:true})).toHaveCount(0);await expect(dialog.getByLabel('Estilo',{exact:true})).toBeVisible();await expect(dialog.getByLabel('¿Quieres cambiar algo más? (opcional)')).toHaveValue('');
 await expect(dialog.getByRole('button',{name:'Crear versión'})).toBeDisabled();
 const initial=4;
 await dialog.getByLabel('Estilo',{exact:true}).selectOption('Casera');await dialog.getByLabel('Picante',{exact:true}).selectOption('Suave');
 await page.screenshot({path:info.outputPath('personalization.png'),fullPage:true});
 await dialog.getByRole('button',{name:'Crear versión'}).click();
 await expect(dialog.locator('.recipe-revision-error')).toBeVisible();expect(payload.servings).toBe(initial);expect(payload.instruction).toContain('Estilo: Casera');expect(payload.instruction).toContain('Picante: Suave');expect(payload.instruction).not.toContain('Tiempo máximo');
 await expect(page.locator('h1')).toHaveText(title!);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
