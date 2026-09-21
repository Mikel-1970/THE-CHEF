import {test,expect} from '@playwright/test';
const identity=()=>({user:{id:'access:owner',email:'admin@example.test',name:'Mikel',role:'admin'},expiresAt:Date.now()+3600000,stableUrl:'https://reconcile-baseline-2026-09-2.the-chef-private-preview.pages.dev/'});
test('admin enters from empty storage and keeps avatar across reload and new tab',async({page,context})=>{
 await context.route('**/api/session',r=>r.fulfill({json:identity()}));
 await page.goto('./');await expect(page.locator('.reference-action-card')).toBeVisible();
 await expect(page.getByRole('button',{name:'Registro',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Perfil y ajustes'}).click();
 await expect(page.getByText('Administrador de pruebas · cuenta verificada',{exact:true})).toBeVisible();
 await expect(page.getByPlaceholder('Usuario',{exact:true})).toHaveValue('admin@example.test');
 await page.getByRole('button',{name:'Elegir avatar Voldi',exact:true}).click();
 await page.reload();await expect(page.locator('.chef-draggable-avatar img')).toHaveAttribute('src',/dachshund.png$/);
 const other=await context.newPage();await other.goto('http://127.0.0.1:4175/THE-CHEF/');
 await expect(other.locator('.reference-action-card')).toBeVisible();await expect(other.locator('.chef-draggable-avatar img')).toHaveAttribute('src',/dachshund.png$/);
 expect(await other.evaluate(()=>localStorage.getItem('chef:local-credential:v2'))).toBeNull();
});
test('denied session cannot use a forged local authenticated flag',async({page})=>{
 await page.addInitScript(()=>{sessionStorage.setItem('chef:auth:session:v1','1');localStorage.setItem('chef:settings',JSON.stringify({role:'admin',loginUser:'admin@example.test'}))});
 await page.route('**/api/session',r=>r.fulfill({status:401,json:{error:'Invalid'}}));
 await page.goto('./');await expect(page.getByRole('button',{name:'Volver a verificar acceso'})).toBeVisible();
 await expect(page.locator('.reference-action-card')).toHaveCount(0);await expect(page.getByRole('button',{name:'Registro',exact:true})).toHaveCount(0);
});
test('expired session stops showing the application',async({page})=>{
 await page.clock.install();await page.route('**/api/session',r=>r.fulfill({json:{...identity(),expiresAt:Date.now()+60000}}));
 await page.goto('./');await expect(page.locator('.reference-action-card')).toBeVisible();await page.clock.fastForward(61000);
 await expect(page.getByRole('button',{name:'Volver a verificar acceso'})).toBeVisible();await expect(page.locator('.reference-action-card')).toHaveCount(0);
});
