# The Chef — Preview privada en Cloudflare Pages

Fecha: 2026-09-21
Rama candidata: `reconcile/baseline-2026-09-21`

## Objetivo
Usar Cloudflare Pages para probar la candidata F2.4 sin modificar `main` y sin exponer públicamente la preview.

## Configuración de build
Cloudflare Pages:
- Framework preset: **React (Vite)**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: raíz del repositorio
- Rama de producción configurada: `main`, con `production_deployments_enabled=false`. No desplegarla.
- Rama de preview exclusiva: `reconcile/baseline-2026-09-21`. Nunca configurarla como rama de producción.
- Mantener `preview_deployment_setting=none` hasta verificar Access. Después usar `custom` e incluir únicamente la rama candidata.

Cloudflare Pages inyecta `CF_PAGES=1`; `vite.config.ts` usa esa variable para construir con base `/`.
GitHub Pages conserva su base histórica `/THE-CHEF/`.

## Protección privada
Las preview deployments de Cloudflare Pages son públicas por defecto.
Para F2.4 debe activarse Cloudflare Access:

1. Cloudflare Dashboard → Workers & Pages.
2. Abrir el proyecto de The Chef.
3. Settings → General.
4. **Enable access policy**.
5. Limitar acceso a la identidad/cuenta autorizada.

La política de Access protege las URLs de preview, no necesariamente el dominio principal `*.pages.dev`.
Por eso F2.4 debe ejecutarse sobre una **preview deployment** de la rama/PR, no sobre un deployment público de producción.

## Flujo recomendado
1. Importar `Mikel-1970/THE-CHEF` desde GitHub.
2. Usar build `npm run build` → `dist`.
3. Activar y verificar Access policy antes de crear cualquier despliegue de preview.
4. Mantener `main` sin cambios.
5. Abrir/usar la preview del PR #16 o de `reconcile/baseline-2026-09-21`.
6. Ejecutar `docs/F2_4_SMOKE_TEST.md`.
7. Registrar fallos S0–S3.
8. Corregir en F2.5.
9. Solo después valorar merge a `main`.

## Regla
No utilizar el dominio de producción para F2.4. La prueba se realizará únicamente sobre una URL de preview protegida por Access.
