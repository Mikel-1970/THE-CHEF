# Ficha y personalización — 2026-09-22

Petición: título y favorito arriba, descripción y metadatos, una foto completa, nutrición y acceso directo a opciones de personalización.

- Se elimina la foto duplicada del bloque de procedencia en esta ficha; se conservan compartir y fuente.
- La imagen usa ancho disponible y altura natural, sin recorte.
- Comensales se traslada al menú de personalización. Se abre el menú compartido de opciones directamente y se añade un campo breve opcional. Solo las opciones tocadas se incorporan a la petición de variante; no se fuerza una nueva cocina o estilo por defecto.
- Se conserva la receta original y el flujo de versiones. El menú mantiene los cambios si falla el servicio.
- El diálogo queda por encima del avatar y bloquea el desplazamiento del fondo.

Validación: 45 comprobaciones estáticas, tipos Functions y build correctos. 10 pruebas Playwright correctas (escritorio/móvil emulado), incluyendo orden de ficha, imagen sin recorte, favorito, opciones sin texto obligatorio, contenido enviado y conservación de original ante fallo simulado. Capturas revisadas. No se invocó IA real en pruebas ni se certifica aceptación en móvil físico.

Rama: reconcile/baseline-2026-09-21. Solo preview privada, sin main ni producción.
