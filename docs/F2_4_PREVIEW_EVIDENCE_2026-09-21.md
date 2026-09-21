# F2.4 — Preview privada y evidencia actual

## Baseline

- Repositorio exclusivo: `Mikel-1970/THE-CHEF`.
- Rama: `reconcile/baseline-2026-09-21`.
- Commit recibido: `311838110905ba214aeb26893fbb3c94175259ca`.
- Candidata desplegada: `213d7cc4f4048a37ddf64fc9e339827fb499449b`.
- `main` consultada por `git ls-remote`: `74879ee24722e1b6fdf488a3d16ae7a2c6280443`. No modificada por esta tarea.
- Documento maestro leído: edición 11/09/2026, 104 puntos, 17 bloques; SHA256 `604D62EAA6EF0680D8AA6A5D3AFE6DD827E24C7F501B8C3971BEEB2DDA2E91CF`.
- La copia local anterior estaba en otra rama con cambios pendientes. Se conserva; la candidata procede de un clon de la rama remota solicitada.

## Configuración verificada en Cloudflare

- Proyecto: `the-chef-private-preview` (`4f30c5f7-da42-4ecd-8283-88eef9d64dc6`).
- GitHub conectado al repositorio indicado.
- Build: `npm run build`; salida: `dist`; raíz: `/`; Node: `24`.
- Producción: rama `main`, `production_deployments_enabled=false`.
- Preview: `custom`, única rama incluida `reconcile/baseline-2026-09-21`.
- Access se activó antes del primer despliegue. No se publicaron previews sin protección.
- Aplicación Access: `b67c54ae-1081-4525-a593-e262565288c0`.
- Dominio protegido: `*.the-chef-private-preview.pages.dev`.
- Política allow: únicamente `meguiluz@ingitech.com`, sin bypass, duración de sesión 24 h.
- No se ha creado ningún deployment de producción. El dominio principal respondió HTTP 522; no es la URL de prueba.

## Despliegue y pruebas

- Deployment: `86936f9a-5d9e-4cdd-81e6-ba911a5f4fad`, entorno `preview`.
- URL inmutable: https://86936f9a.the-chef-private-preview.pages.dev
- Alias real devuelto por Cloudflare (truncado por la plataforma): https://reconcile-baseline-2026-09-2.the-chef-private-preview.pages.dev
- Build y deploy: `success`, finalizado 21/09/2026 00:50:29 UTC.
- Los logs confirman Node 24.13.1, instalación desde lockfile, TypeScript/Vite y 17 archivos publicados, incluido `version.json`.
- Validación local: 40/40 comprobaciones estáticas y build correcto. Son comprobaciones de código, no pruebas funcionales completas.
- Auditoría actual `npm audit --omit=dev --audit-level=critical`: 0 vulnerabilidades.
- Visita anónima: HTTP 302 a Cloudflare Access; navegador muestra el formulario de código por correo.
- Repetir prueba negativa con `node scripts/check-preview-access.mjs` (URL, metadatos, JS y alias; sin cookies).
- Acceso autenticado y lectura de `version.json`: pendiente de completar el código de Access en navegador.

## Cambios acotados

- Lockfile incorporado para fijar las dependencias de la candidata.
- Builds de Cloudflare generan `version.json` con rama y commit; fallan si faltan esos metadatos. La compilación histórica de GitHub Pages conserva su comportamiento.
- Corrección de instrucciones que podían sugerir usar la rama candidata como producción.
- Exclusión de archivos incrementales de TypeScript.
- Registro `F2_4_RESULTADOS.csv`: 60 casos pendientes, 20 por dispositivo. No contiene resultados inventados.

## Roadmap y pendientes

F2.4 sigue abierta. La infraestructura privada no acredita el gate físico.

1. Completar acceso autenticado y contrastar `version.json` con el commit candidato.
2. Ejecutar ST-01 a ST-20 en iPhone/Safari, Android/Chrome y PC, registrando dispositivo, commit, fecha, evidencia y severidad en el CSV.
3. F2.5: reproducir y resolver S0/S1; comenzar por TC-04-03 (cantidades en pasos al escalar), documentado como GAP en la auditoría previa. No se declara resuelto en esta tarea.
4. Registrar comportamiento real del temporizador en segundo plano, cámara/micrófono, persistencia y PDF. Ningún emulador sustituye esta evidencia.
5. F2.6 queda bloqueada hasta resolver S0/S1 y completar el gate. No iniciar F3 ni fusionar a main.

Advertencias de build observadas: fondos CSS `./home-pantry.jpg` / `./home-desire.jpg` sin resolver en compilación y chunk principal >500 kB. Revisar impacto visual/rendimiento en F2.4; no se clasifican como fallos funcionales confirmados solo por el warning.

Fuente técnica de Access: https://developers.cloudflare.com/pages/configuration/preview-deployments/
