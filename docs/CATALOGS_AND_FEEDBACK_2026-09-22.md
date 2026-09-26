# Catálogos y correcciones de la prueba del 22-09-2026

Ámbito: Mikel-1970/THE-CHEF, reconcile/baseline-2026-09-21. Solo preview privada. Se mantienen el Documento maestro y el registro de requisitos previo como baseline; estas correcciones no cierran por sí solas F2.4 ni el roadmap completo.

## Catálogos
- 15 técnicas incorporadas, clasificadas por tipo y buscables por nombre/uso. Incluyen proceso, utensilios, ingredientes, puntos críticos y enlace de referencia. Algunas fichas avanzadas son guías de selección del método, no fórmulas universales: remiten a la formulación del fabricante para dosificaciones, pH y equipo.
- Sous vide incluye cuatro ejemplos condicionados por producto, 20 mm de grosor y 5 °C iniciales, de las tablas de Baldwin. No extrapolar a horno ni congelados. La ficha de horno exige receta/equipo concretos y sonda; no inventa una tabla universal.
- 36 tips editoriales con fuentes individuales, iconos y revisión Me interesa/Ocultar/Sin decidir en /consejos. Rotación aleatoria cada 9 segundos, sin repetir dentro del ciclo de la sesión. Los ocultos no se muestran. Indicador de carga SVG visible; movimiento reducido respetado.
- Catálogos versionados en el repositorio y guardados/leídos en IndexedDB the-chef-culinary-catalog (techniques, tips, metadata). Fallback al catálogo incluido si el navegador bloquea la base local. Valoraciones de tips en localStorage. El usuario autorizó sincronización: D1 the-chef-preview-catalog, UUID 49dcf453-4b48-4011-82dc-97ed1c3f38c3, jurisdicción UE, binding CHEF_CATALOG solo en preview. 15 técnicas y 36 tips confirmados mediante SELECT remoto. PUT/GET privados con JWT de Access verificado, email de cuenta como clave de usuario, SQL parametrizado y comprobación de origen. Cola local de valoraciones y reintento al recuperar conexión o foco. No se ha cambiado de plan; D1 se rige por las cuotas de la cuenta.
- No hay rastreo periódico de Internet activado. Actualizaciones editoriales mediante versiones revisadas. No se han generado imágenes individuales: iconos ilustrativos.

## Correcciones
- Despensa propone ubicación por producto; mantiene cambios manuales existentes. Solo los productos elegidos se envían como ingredientes a la propuesta, junto con básicos configurados. Selección sin límite artificial de cuatro. Personalización trasladada a la propuesta; foto no muestra opciones iniciales.
- Foto receta conserva texto corregido y fotografía aportada. getRecipeImage prioriza foto de origen, incluso en recetas anteriores si está guardada. Las nuevas recetas fotográficas marcan imageOrigin para impedir generación sustitutiva si falta la foto.
- Dos acciones al final de receta: Guardar y Compartir receta. Compartir produce PDF y usa Web Share si admite archivos; alternativa descarga. Cancelar no se trata como fallo. Origen real debajo de Personalizar. Sin WhatsApp directo ni botón duplicado Generar PDF.
- jsPDF se carga con la aplicación para evitar la importación tardía de un chunk antiguo tras despliegue. El PDF conserva proporción de la imagen. Coste: paquete inicial mayor (aprox. 289 kB gzip); aviso de Vite de chunk >500 kB sin comprimir, no error.
- Encontrado en prueba: selfDestroying de la antigua PWA eliminaba TODAS las cachés y recargaba páginas. Sustituido por retirada específica que conserva fotos/miniaturas y solo elimina precache de Workbox. No restaura imágenes que ya se hubieran borrado.

## Evidencia local
- npm run validate: 45 comprobaciones, tipos frontend/functions y build correctos.
- Pruebas Playwright escritorio/Pixel 7 emulado: selección enviada, corrección contra respuesta IA contradictoria, persistencia de catálogos y votos, rotación/spinner, foto sin llamadas de generación, PDF binario válido descargado, contrato nativo de archivo/cancelación, técnicas/filtros, ubicaciones, biblioteca.
- Suite ampliada: 58/62 inicialmente; cuatro fallos revelaron el borrado de cachés. Tras arreglar la PWA, los 14 casos de catálogo/PDF/biblioteca pasan. Se conservan en test-results los PDFs y capturas locales (no se versionan datos de prueba).
- PDF de prueba: 3 páginas, texto extraíble en todas, portada renderizada y revisada. Fotografía de fixture intencional: no valida adecuación gastronómica de esa foto al título.
- No equivale a envío real por correo/WhatsApp ni prueba física iOS/Android. IA y envío nativo están simulados en tests para no consumir generación ni enviar a terceros.

- Pruebas adicionales: 22 casos de API/Access pasan (incluyen firma, expiración, audiencia, origen, valores inválidos y aislamiento por usuario). Build CF_PAGES y dos pruebas con navegadores aislados y backend simulado confirman sincronización bidireccional y reintento offline.

## Abierto
- Idiomas completos y comparación automática contra foto de propuesta siguen sin evidencia de cierre.
- Validación culinaria práctica de técnicas avanzadas y aceptación del catálogo por Mikel.
- Evidencia de despliegue y Access se registra tras publicar este commit en la rama autorizada.
