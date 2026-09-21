# The Chef — F2.5 precorrecciones preventivas

Fecha: 2026-09-21
Rama: `reconcile/baseline-2026-09-21`

## Regla
F2.5 formal no se cierra antes de completar F2.4 en dispositivos físicos. Este documento registra correcciones preventivas hechas únicamente sobre problemas ya conocidos y reproducibles, sin inventar resultados de dispositivo.

## Correcciones realizadas antes del gate físico

### TC-04-03 — Escalado y cantidades dentro de pasos
- Los ingredientes siguen usando modos `linear`, `discrete`, `culinary` y `fixed`.
- Se añadió escalado determinista de cantidades explícitas ligadas a ingredientes dentro de las instrucciones.
- El ajuste se aplica tanto en Modo cocina como en el PDF.
- No se modifican tiempos, temperaturas, tamaños de corte ni cifras no vinculadas a ingredientes.
- ST-09 sigue siendo obligatorio porque redacciones no estándar pueden escapar al sustituidor.

### Rendimiento inicial
- `jsPDF` dejó de formar parte del bundle inicial y se carga solo al exportar.
- Bundle inicial observado: de ~870 kB a ~476 kB minificado.
- Chunk PDF separado: ~391 kB.
- Desapareció el warning de chunk inicial >500 kB.

### Assets de Home
- Se retiraron referencias CSS obsoletas a `./home-pantry.jpg` y `./home-desire.jpg`.
- Home usa los assets válidos mediante `import.meta.env.BASE_URL`.
- Desapareció el warning de assets CSS sin resolver.

### Límites duros también en propuestas IA
- Las propuestas devueltas por IA se filtran de forma determinista antes de mostrarse.
- Una propuesta con tiempo superior al máximo o dificultad superior a la permitida se descarta y se completa con otra opción válida cuando existe.
- No se confía únicamente en que el modelo respete el límite textual.

### Nutrición y falsa precisión
- Cuando cambian los comensales y hay ingredientes con escalado no lineal, la ficha mantiene la nutrición como estimación y muestra una advertencia explícita.
- No se inventa un recálculo numérico sin datos nutricionales por ingrediente.
- Las variantes generadas por sustitución sí solicitan a la IA recalcular cantidades, pasos y nutrición.

### Trazabilidad de pruebas
- La app muestra en Ajustes el commit y rama del build Cloudflare.
- El tester puede asociar cada PASS/FAIL al commit exacto sin depender de abrir `version.json`.

## Validación
- `npm audit --omit=dev --audit-level=critical`: 0 vulnerabilidades.
- Auditoría estática ampliada: **45/45** comprobaciones previstas para este commit.
- TypeScript/Vite: verde en el último commit de código validado.
- Cloudflare Pages debe terminar el redeploy de la rama antes de iniciar la batería física.

## Pendientes que NO se dan por resueltos
- TC-04-04: nutrición tras cambios no lineales/sustituciones requiere evidencia real y no se aproximará con fórmulas inventadas.
- ST-13/ST-14: timer y notificación en background.
- ST-15/ST-16: cámara/foto en dispositivos.
- ST-19: PDF largo en dispositivo real.
- ST-20: cobertura de idioma.
