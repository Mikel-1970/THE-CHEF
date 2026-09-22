import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.addInitScript(()=>{
 sessionStorage.setItem('chef:auth:session:v1','1');sessionStorage.setItem('chef:entry-tutorial:seen-session:v1','1');sessionStorage.setItem('chef:tutorial:invite-dismissed-session:v2','1');
 localStorage.setItem('chef:settings',JSON.stringify({aiPreference:100}));
 });
});
test('visual controls preserve choices and request/display one proposal including refresh',async({page},info)=>{
 const requests:any[]=[];
 await page.route('**/recipes/suggest',r=>{requests.push(r.request().postDataJSON());return r.fulfill({json:{proposals:[1,2].map(i=>({id:`ai-proposal-${i}`,title:`Arroz de prueba ${i}`,subtitle:'Con verduras',emoji:'🍚',minutes:30,difficulty:'Fácil',reason:'Cumple la petición',usedIngredients:['arroz'],missingIngredients:[]}))}})});
 await page.goto('./#/antojo');
 await expect(page.getByRole('heading',{name:'¿Qué quieres que te prepare?'})).toHaveCount(1);
 await expect(page.getByText('Con una frase basta.',{exact:true})).toBeVisible();
 await expect(page.getByText('Algo italiano',{exact:true})).toHaveCount(0);
 await page.screenshot({path:info.outputPath('desire.png'),fullPage:true});
 await page.getByRole('button',{name:'Personalizar',exact:true}).click();
 await page.getByRole('combobox',{name:'Estilo',exact:true}).selectOption('Casera');
 await page.getByRole('combobox',{name:'Tipo de cocina',exact:true}).selectOption('Española');
 await page.getByRole('combobox',{name:'Dificultad máxima'}).selectOption('Fácil');
 await page.getByRole('combobox',{name:'Picante',exact:true}).selectOption('Suave');
 await page.locator('.visual-multiselect summary').click();
 await page.getByRole('checkbox',{name:'Sin lácteos',exact:true}).check();
 await page.getByRole('textbox',{name:'Otra exclusión'}).fill('cebolla');
 await page.locator('.visual-multiselect summary').click();
 await expect(page.locator('.visual-multiselect summary')).toHaveText('Sin lácteos · Otra exclusión');
 for(const text of ['Producto principal','Técnica preferida','Utensilios'])await expect(page.getByText(text,{exact:true})).toHaveCount(0);
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:info.outputPath('options.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('textbox',{name:'Tu petición'}).fill('Arroz para cuatro');
 await page.getByRole('button',{name:'Confirmar petición'}).click();
 await page.getByRole('button',{name:'Generar propuesta',exact:true}).click();
 await expect(page.locator('.proposal-stack').locator(':scope > *')).toHaveCount(1);
 expect(requests[0].count).toBe(1);
 expect(requests[0].request).toMatchObject({style:'Casera',cuisine:'Española',difficulty:'Fácil',spiceLevel:'Suave',restrictions:['Sin lácteos','cebolla']});
 await page.getByRole('button',{name:'Dame otra',exact:true}).click();
 await expect.poll(()=>requests.length).toBe(2);
 await expect(page.getByRole('button',{name:'Dame otra',exact:true})).toBeVisible();
 await expect(page.locator('.proposal-stack').locator(':scope > *')).toHaveCount(1);
});
test('avatar remains fixed when scrolling, stays upper right, opens styled menu; settings and back work',async({page},info)=>{
 await page.goto('./#/antojo');
 await page.getByRole('button',{name:'Personalizar',exact:true}).click();
 const avatar=page.locator('.chef-draggable-avatar');const initial=await avatar.boundingBox();
 await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
 await expect(avatar).toBeInViewport();expect(await avatar.boundingBox()).toEqual(initial);
 await expect(page.getByRole('button',{name:'Volver',exact:true})).toBeInViewport();
 await expect(page.locator('.chef-draggable-avatar')).toBeInViewport();
 expect(initial!.x).toBeGreaterThan(page.viewportSize()!.width-90);
 await expect(page.locator('.chef-navigation-panel')).toHaveCount(0);
 await avatar.click();await expect(page.getByRole('navigation',{name:'Menú de navegación'})).toBeVisible();
 await expect(page.locator('.chef-menu-grid')).toHaveCSS('display','grid');
 await page.screenshot({path:info.outputPath('avatar-menu.png')});
 await page.getByRole('button',{name:'Inicio',exact:true}).click();
 await expect(avatar).toBeInViewport();
 await avatar.click();await page.getByRole('button',{name:'Perfil y ajustes'}).click();await page.getByRole('button',{name:'Editar perfil',exact:true}).click();await expect(page.locator('.avatar-gallery')).toBeVisible();
 await page.getByRole('button',{name:'Volver',exact:true}).click();await expect(page.locator('.reference-action-card')).toBeVisible();
});
test('microphone is manual, same button stops, transcript is confirmed separately',async({page})=>{
 await page.addInitScript(()=>{
 (window as any).micCalls=0;(window as any).stopped=0;
 Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{(window as any).micCalls++;return {getTracks:()=>[{stop:()=>{(window as any).stopped++}}]}}}});
 (window as any).MediaRecorder=class {state='inactive';mimeType='audio/webm';ondataavailable:any;onstop:any;onerror:any;static isTypeSupported(){return true}start(){this.state='recording'}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['audio'])});this.onstop?.()}};
 });
 await page.route('**/chef-media/transcribe',r=>r.fulfill({json:{text:'Quiero arroz con pollo'}}));
 await page.goto('./#/antojo');
 expect(await page.evaluate(()=>(window as any).micCalls)).toBe(0);
 await page.getByRole('button',{name:'Iniciar micrófono'}).click();
 await expect(page.getByRole('button',{name:'Parar micrófono'})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('button',{name:'Confirmar petición'})).toBeDisabled();
 await page.getByRole('button',{name:'Parar micrófono'}).click();
 await expect(page.getByRole('textbox',{name:'Tu petición'})).toHaveValue('Quiero arroz con pollo');
 await expect(page.getByRole('button',{name:'Generar propuesta',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Confirmar petición'}).click();
 await expect(page.getByRole('button',{name:'Generar propuesta',exact:true})).toBeEnabled();
 expect(await page.evaluate(()=>(window as any).micCalls)).toBe(1);expect(await page.evaluate(()=>(window as any).stopped)).toBe(1);
});
test('denied microphone leaves typing available',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{throw new DOMException('Denied','NotAllowedError')}}});(window as any).MediaRecorder=class{}});
 await page.goto('./#/antojo');await page.getByRole('button',{name:'Iniciar micrófono'}).click();
 await expect(page.getByRole('alert')).toContainText('permiso');
 await page.getByRole('textbox',{name:'Tu petición'}).fill('Arroz');await page.getByRole('button',{name:'Confirmar petición'}).click();
 await expect(page.getByRole('button',{name:'Generar propuesta',exact:true})).toBeEnabled();
});

test('library and techniques retain floating navigation',async({page})=>{
 for(const route of ['mis-recetas','tecnicas']) {
 await page.goto('./#/'+route);
 await expect(page.locator('.chef-draggable-avatar')).toBeInViewport();
 await expect(page.locator('.chef-draggable-avatar')).toBeInViewport();
 await expect(page.getByRole('button',{name:'Volver',exact:true})).toBeInViewport();
 }
});
