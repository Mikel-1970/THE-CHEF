# Despensa visual y opciones compartidas

- Inventario visual con filtros Todo, Nevera y Despensa; hasta cuatro ingredientes prioritarios. El resto del inventario sigue disponible para complementar.
- Foto desde cámara o archivo: identificación por IA, revisión editable y confirmación antes de guardar. No se inventan cantidades; se conservan las existentes.
- Un único componente Personalizar para antojo, despensa y foto receta: comensales, tiempo, estilo, cocina, restricciones, dificultad y picante.
- Una propuesta por solicitud. Foto receta envía las opciones a la generación y no sustituye un fallo visual por una receta local ajena.

Validación: npm run validate correcto (45 comprobaciones, tipos y build); Playwright 58/58 escritorio y móvil. Prueba real de visión HTTP 200 sobre imagen de despensa: ajo, limón, cebolla y pasta. Las pruebas de contratos de generación usan respuestas controladas. Revisadas capturas móviles; pendiente aceptación de cámara y micrófono en el teléfono físico.

Cambios limitados a reconcile/baseline-2026-09-21 y preview privada; sin cambios en main ni en el backend de producción. Usar el enlace estable de preview para conservar los datos locales del navegador entre publicaciones.
