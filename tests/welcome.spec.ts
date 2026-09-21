import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('first visit shows El Chef and automatically opens login in 2–3 seconds', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.goto('./');
  const splash = page.getByRole('main', { name: 'Acceso a The Chef' });
  await expect(splash).toBeVisible();
  await expect(splash.locator('img')).toHaveAttribute('src', /avatars\/chef-man.png$/);
  await expect.poll(() => splash.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1122);
  await page.clock.runFor(1000);
  const brand = await page.locator('.welcome-character').elementHandle();
  const brandBox = await page.locator('.welcome-character').boundingBox();
  await page.clock.runFor(1100);
  await expect(splash).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeHidden();
  await page.clock.runFor(700);
  await expect(splash).toBeVisible();
  expect(await brand!.evaluate(node => node.isConnected)).toBe(true);
  expect(await page.locator('.welcome-character').boundingBox()).toEqual(brandBox);
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Usuario o correo', { exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Contraseña', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('animated entry and login render without clipping', async ({ page }, info) => {
  await page.goto('./');
  await expect(page.locator('.welcome-character')).toHaveCSS('opacity', '1');
  await expect(page.locator('.welcome-tagline')).toHaveCSS('opacity', '1');
  const image = await page.locator('.welcome-character img').boundingBox();
  const heading = await page.locator('.welcome-content h1').boundingBox();
  expect(image!.y + image!.height).toBeLessThanOrEqual(heading!.y);
  await page.screenshot({ path: info.outputPath('splash.png'), fullPage: true });
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
  await expect(page.locator('.welcome-fields')).toHaveCSS('opacity', '1');
  await expect(page.locator('.entry-primary')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: info.outputPath('login.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('explicit skip opens login and registration retains permissions and tutorial', async ({ page }, info) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Entrar ahora' }).click();
  await page.getByRole('button', { name: 'Registro', exact: true }).click();
  await page.getByPlaceholder('Tu nombre').fill('Prueba R1-03');
  await page.locator('.registration-avatar-picker summary').click();
  await expect(page.locator('.registration-avatar-grid button')).toHaveCount(16);
  await expect.poll(()=>page.locator('.registration-avatar-grid img').evaluateAll(images=>images.every(img=>(img as HTMLImageElement).naturalWidth===1122))).toBe(true);
  await expect(page.locator('.entry-form .entry-primary')).toHaveCSS('opacity','1');
  await page.screenshot({path:info.outputPath('registration-avatars.png'),fullPage:true});
  await page.getByRole('button', {name:'Elegir avatar Voldi',exact:true}).click();
  await page.getByPlaceholder('tu@correo.com').fill('r103@example.test');
  await page.getByPlaceholder('Contraseña', { exact: true }).fill('test-r103');
  await page.getByPlaceholder('Repite la contraseña').fill('test-r103');
  await page.getByRole('button', { name: 'Registro', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¿Permitir el micrófono?' })).toBeVisible();
  await page.getByRole('button', { name: 'Ahora no', exact: true }).click();
  await expect(page.getByRole('heading', { name: '¿Quieres que El Chef te enseñe la app?' })).toBeVisible();
  await page.getByRole('button', { name: 'Ahora no', exact: true }).click();
  await page.evaluate(() => sessionStorage.removeItem('chef:auth:session:v1'));
  await page.reload();
  await page.getByRole('button', { name: 'Entrar ahora' }).click();
  await expect(page.getByRole('heading', {name:'Bienvenido, Prueba R1-03'})).toBeVisible();
  await expect(page.locator('.welcome-character img')).toHaveAttribute('src',/dachshund.png$/);
  await page.getByPlaceholder('Contraseña', { exact: true }).fill('wrong');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByText('Usuario o contraseña incorrectos.')).toBeVisible();
  await page.getByPlaceholder('Contraseña', { exact: true }).fill('test-r103');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.locator('.access-card')).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('chef:auth:session:v1'))).toBe('1');
});

test('avatar selected in settings persists into the next entry', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('chef:auth:session:v1', '1');
    sessionStorage.setItem('chef:entry-tutorial:seen-session:v1', '1');
    sessionStorage.setItem('chef:tutorial:invite-dismissed-session:v2', '1');
  });
  await page.goto('./#/ajustes');
  await page.getByRole('button', { name: 'Elegir avatar Voldi', exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('chef:settings')!).avatarEmoji)).toBe('dachshund');
  const settings = await page.evaluate(() => localStorage.getItem('chef:settings')!);
  const clean = await page.context().browser()!.newContext();
  await clean.addInitScript(value => localStorage.setItem('chef:settings', value), settings);
  const entry = await clean.newPage();
  await entry.goto('http://127.0.0.1:4175/THE-CHEF/');
  await expect(entry.locator('.welcome-character img')).toHaveAttribute('src', /dachshund.png$/);
  await clean.close();
});

test('authenticated session goes directly to the requested route without splash or login', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('chef:auth:session:v1', '1');
    sessionStorage.setItem('chef:entry-tutorial:seen-session:v1', '1');
  });
  await page.goto('./#/ajustes');
  await expect(page.locator('.avatar-gallery')).toBeVisible();
  await expect(page.locator('.welcome-entry,.access-card')).toHaveCount(0);
  await expect(page.locator('.avatar-gallery img')).toHaveCount(16);
  await expect.poll(() => page.locator('.avatar-gallery img').evaluateAll(images => images.every(img => (img as HTMLImageElement).naturalWidth === 1122))).toBe(true);
});

test('reduced motion keeps the automatic transition without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.welcome-character')).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
});

test('invalid stored avatar safely defaults to El Chef', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('chef:settings', JSON.stringify({ avatarEmoji: 'unknown-avatar' })));
  await page.goto('./');
  await expect(page.locator('.welcome-character img')).toHaveAttribute('src', /chef-man.png$/);
});


test('home has two larger cards, aligned actions and upper-right hat', async ({ page }, info) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('chef:auth:session:v1', '1');
    sessionStorage.setItem('chef:entry-tutorial:seen-session:v1', '1');
    sessionStorage.setItem('chef:tutorial:invite-dismissed-session:v2', '1');
  });
  await page.goto('./');
  await expect(page.locator('.reference-secondary-card')).toHaveCount(2);
  await expect(page.getByText('Crear tu receta', { exact:true })).toHaveCount(0);
  await expect(page.getByText('Abre la despensa', { exact:true })).toBeVisible();
  const actions = await page.locator('.reference-secondary-copy b').all();
  const a = await actions[0].boundingBox(); const b = await actions[1].boundingBox();
  expect(Math.abs(a!.y - b!.y)).toBeLessThan(1);
  const hero = await page.locator('.reference-action-card').boundingBox();
  const hat = await page.locator('.reference-card-icon').boundingBox();
  expect(hat!.x).toBeGreaterThan(hero!.x + hero!.width/2);
  expect(hat!.y - hero!.y).toBeLessThan(20);
  for (const card of await page.locator('.reference-secondary-card').all()) {
    expect((await card.boundingBox())!.height).toBeGreaterThanOrEqual(240);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:info.outputPath('home.png'),fullPage:true});
  await page.getByRole('button', { name:/Abre la despensa/ }).click();
  await expect(page.getByText('ABRE LA DESPENSA', {exact:true})).toBeVisible();
});
