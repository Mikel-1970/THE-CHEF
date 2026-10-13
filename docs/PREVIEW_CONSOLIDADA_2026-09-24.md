# The Chef — candidata consolidada, 24 septiembre 2026

Base verificada: `58cd695de73f8e3bdb28488e4a94df716853714a`, rama `reconcile/baseline-2026-09-21`. Trabajo realizado en una copia independiente; las copias anteriores con cambios sin guardar se han conservado. Main observado antes de publicar: `74879ee24722e1b6fdf488a3d16ae7a2c6280443`.

## Reconciliación de los hilos

- Preview casi final de navegación / Preview casi final de The Chef: cinco accesos principales, manteniendo las acciones de cocinar y Foto Receta.
- Preparar preview casi final: conservar ingredientes neutros, tiempo sin límite y picante sin aplicar; nunca sustituir una petición por una receta ajena por fallo de IA.
- Lista de técnicas culinarias: las 180 fichas estaban en la base actual, pero el resolver y sus enlaces desde receta/cocina solo existían en `feat/technique-library-v1-2026-09-23`. Se recuperaron selectivamente sin reemplazar las páginas con versiones antiguas.
- Fichas de cocina: mantener los 150 tips, sus 14 categorías y el motor contextual ya integrado.
- Implementa pantalla inicial R1-03: la decisión posterior dejó la presentación fija con Regístrate y Login; se conserva, junto con los 16 avatares y el fondo vigente.

## Resultado

- Accesos: Favoritos, Mis recetas, Técnicas, Despensa, Lista de la compra. Técnicas y Tips comparten módulo; no se añade otro botón Tips al avatar ni se mezclan técnicas con Mis recetas.
- Biblioteca de 180 técnicas con buscador que acepta texto sin tildes, familias y niveles. La ficha tiene URL propia, sobrevive a recarga y devuelve a la biblioteca con filtros conservados.
- Las recetas y los pasos enlazan las fichas canónicas. El regreso conserva receta/paso/comensales. Las palabras de ingredientes por sí solas no activan técnicas.
- Temporizador opcional y manual cuando no existe duración inequívoca; sin inicio automático, con un único temporizador activo. Conserva el contador al consultar una ficha y volver.
- Se eliminó la doble flecha en Elaboración y se corrigió el solapamiento de la cabecera móvil.
- IndexedDB editorial actualizado de 15 a 180 técnicas; no se borran recetas, favoritos, inventario ni valoraciones personales.
- Imágenes: se conserva la generación/caché existente; se corrigen recursos liberados tarde e imágenes rotas. No hay 180 fotografías estáticas específicas incluidas en public; su disponibilidad depende del servicio existente y de su caché. No se sustituyen por fotos de platos no relacionados.
- PDF: se conserva el diseño actual de tres páginas, descarga y compartir; revisión visual de las tres páginas de una receta de prueba. La fotografía del test es una imagen simulada para verificar prioridad de foto aportada, no una evidencia culinaria.

## Comprobaciones

- Auditoría estática: 49 comprobaciones.
- TypeScript, Pages Functions y build Vite: PASS.
- `npm run test:preview`: 76 pruebas en Chromium escritorio y Pixel 7 emulado: PASS.
- Tras ajustar la especificidad CSS de la cabecera, se repitió la prueba de temporizador y geometría de cabecera en ambos tamaños.
- `npm audit --omit=dev --audit-level=critical`: cero vulnerabilidades reportadas.
- CI incorpora la misma suite de preview antes del build de Cloudflare.

## Pendiente para beta final

- Aceptación visual del usuario y matriz física de iPhone/Android/PC, especialmente micrófono, cámara, compartir PDF y temporizador con pantalla bloqueada.
- Comprobar IA real y fotografías de técnicas con servicio disponible; los tests aíslan la red y no prueban calidad gastronómica ni generación remota.
- Actualizar/verificar D1 y sincronización real de valoraciones entre dispositivos. Se conserva el mecanismo que protege los 150 tips frente a un catálogo remoto antiguo.
- Pruebas de recetas especialmente largas en el PDF de tres páginas: esta revisión verifica una receta normal, no todos los extremos de contenido.
- La URL y el commit desplegado deben verificarse en Cloudflare; una compilación local o un push no constituyen prueba de publicación. No se cierra la aceptación física F2.4 por esta entrega.
