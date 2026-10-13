import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.addInitScript(()=>{
  for(const k of ['chef:auth:session:v1','chef:entry-tutorial:seen-session:v1','chef:tutorial:invite-dismissed-session:v2','chef:home-greeted:v2'])sessionStorage.setItem(k,'1');
  (window as any).alarmStarts=0;const original=AudioContext.prototype.createOscillator;AudioContext.prototype.createOscillator=function(){(window as any).alarmStarts++;return original.call(this)};
 });
});
async function start(page:any,seconds=20){await page.getByRole('button',{name:'Abrir temporizador',exact:true}).click();await page.getByLabel('Minutos del temporizador').fill('0');await page.getByLabel('Segundos del temporizador').fill(String(seconds));await page.getByRole('button',{name:'Iniciar',exact:true}).click();await expect(page.locator('.global-timer')).toBeVisible();}
test('recipe timer survives steps, routes and reload; pause and resume remain global',async({page})=>{
 await page.goto('./#/cocinar/arroz-pollo-calabacin');await page.clock.install();await start(page);
 await page.getByRole('button',{name:/Siguiente/}).click();await page.clock.runFor(3000);await expect(page.locator('.global-timer-summary')).toContainText('00:17');
 await page.evaluate(()=>{location.hash='/lista-compra'});await page.clock.runFor(2000);await expect(page.locator('.global-timer-summary')).toContainText('00:15');
 await page.reload();await expect(page.locator('.global-timer-summary')).toContainText('00:15');
 await page.locator('.global-timer-summary').click();await page.getByRole('button',{name:'Pausar temporizador',exact:true}).click();await page.clock.runFor(3000);await expect(page.locator('.global-timer-summary')).toContainText('00:15 · Pausado');
 await page.getByRole('button',{name:'Reanudar temporizador',exact:true}).click();await page.clock.runFor(2000);await expect(page.locator('.global-timer-summary')).toContainText('00:13');
 await page.getByRole('button',{name:'Cancelar temporizador',exact:true}).click();await expect(page.locator('.global-timer')).toHaveCount(0);
});
test('technique alarm repeats on another page and stops when silenced',async({page})=>{
 await page.goto('./#/tecnicas');await page.locator('.technique-photo-open').first().click();await page.getByRole('button',{name:/Empezar técnica/}).click();await page.clock.install();await start(page,3);
 await page.evaluate(()=>{location.hash='/'});await page.clock.runFor(3500);await expect(page.getByRole('button',{name:'Silenciar y cerrar'})).toBeVisible();expect(await page.evaluate(()=>(window as any).alarmStarts)).toBe(1);
 await page.clock.runFor(5000);expect(await page.evaluate(()=>(window as any).alarmStarts)).toBe(3);
 await page.getByRole('button',{name:'Silenciar y cerrar'}).click();await page.clock.runFor(5000);expect(await page.evaluate(()=>(window as any).alarmStarts)).toBe(3);await expect(page.locator('.global-timer')).toHaveCount(0);
});

for(const finishedAlarm of [false,true])test(`finishing recipe clears ${finishedAlarm?'ringing alarm':'running timer'} and persisted state`,async({page})=>{
 await page.goto('./#/cocinar/lib-097?servings=4');await page.clock.install();await start(page,finishedAlarm?2:60);
 while(await page.getByRole('button',{name:/Siguiente/}).count())await page.getByRole('button',{name:/Siguiente/}).click();
 if(finishedAlarm){await page.clock.runFor(2500);expect(await page.evaluate(()=>(window as any).alarmStarts)).toBeGreaterThan(0);}
 await page.getByRole('button',{name:'Terminar',exact:true}).click();
 await expect(page.getByRole('heading',{name:'¿Cómo te ha quedado?'})).toBeVisible();await expect(page.locator('.global-timer')).toHaveCount(0);
 expect(await page.evaluate(()=>sessionStorage.getItem('chef:global-timer:v1'))).toBeNull();
 const sounds=await page.evaluate(()=>(window as any).alarmStarts);await page.clock.runFor(65000);expect(await page.evaluate(()=>(window as any).alarmStarts)).toBe(sounds);
 await page.reload();await expect(page.locator('.global-timer')).toHaveCount(0);
});

test('recipe back arrow returns to library after cooking instead of browser history',async({page})=>{
 await page.goto('./#/cocinar/lib-097?servings=4');
 await page.getByRole('button',{name:'Volver a receta',exact:true}).click();
 await page.getByRole('button',{name:'Volver',exact:true}).click();
 await expect(page).toHaveURL(/#\/mis-recetas$/);
});
