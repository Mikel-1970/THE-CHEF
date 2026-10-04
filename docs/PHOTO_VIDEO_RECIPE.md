# Foto/Video Receta

Flujo: archivo o enlace → identificación corregible → selección de ingredientes → borrador editable → confirmación explícita → incorporación al catálogo personal.

La lógica adapta el skill `the-chef-import-recipe` a la aplicación. No ejecuta un skill local dentro del navegador. Las hipótesis culinarias se presentan para revisión; ningún borrador se registra antes de confirmar. Editar el borrador invalida la confirmación. La fuente y el carácter adaptado con IA se conservan. No se calculan valores nutricionales sin base fiable.

## Fuentes y límites
- Fotos: análisis visual, sin atribuir certeza a ingredientes ocultos o cantidades.
- Vídeos: hasta 20 MB y 5 minutos; seis fotogramas distribuidos y transcripción de audio cuando está disponible. No equivale a inspeccionar cada instante. Compatibilidad dependiente del navegador/códec.
- Enlace directo a MP4/WebM/MOV: requiere acceso público y autorización CORS del servidor.
- Páginas de recetas o vídeos: se lee texto público disponible mediante el proxy con sus protecciones de red. No se afirma haber visto un vídeo incrustado. Si falta contenido, se solicita el archivo o la transcripción.
- No se eluden autenticación, DRM ni bloqueos de plataformas.

Los ingredientes propuestos se pueden seleccionar o descartar antes de generar. Cantidades, tiempos y elaboración se revisan antes del guardado. La revisión final permite aceptar explícitamente la adaptación completa.

## Verificación
`tests/photo-video-recipe.spec.ts` cubre foto, vídeo WebM real creado en navegador y enlace; servicios IA simulados. Comprueba ausencia de persistencia previa, confirmación obligatoria y su invalidación tras una edición, en escritorio y móvil emulado. La calidad de la interpretación real y compatibilidad con archivos de móviles físicos requieren aceptación adicional.
