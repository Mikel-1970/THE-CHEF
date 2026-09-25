# Preview: importación, portada y plan con IA

## Comportamiento
- Plan con IA por defecto; biblioteca sin IA opcional. Una llamada por comida, sin imágenes; conserva resultados parciales y permite detener las siguientes peticiones.
- Objetivo calórico confirmado por el usuario; macros opcionales en porcentajes (suma 100) o gramos; fibra en g/día. Sin objetivo, solo menú culinario. Calculadora de mantenimiento opcional existente.
- Alternativas con explicación y cambio solicitado; revisión antes de sustituir. Valores nutricionales calculados cuando hay equivalencias y estimados por IA en los restantes campos; no se garantiza equivalencia ni cumplimiento exacto.
- Plan en memoria de sesión y copia cifrada manual; no se activa facturación ni suscripción. No se envía antropometría al generador.
- Importación personal revisada desde texto, TXT/MD, DOCX, PDF e imagen. OCR local con descarga inicial del lector. IA solo al pulsar analizar. Datos ausentes requieren revisión; nutrición desconocida no se inventa.
- Enlaces: HTML público HTTPS, autenticación de preview, comprobación de destino y redirecciones, límite de tamaño. YouTube usa la descripción disponible; si no contiene la receta, se pega la transcripción. No se analiza vídeo.
- Fotoreceta: probables ingredientes sin marcar; sin básicos automáticos; se rechazan ajo, cebolla o pimienta no confirmados en postres reconocidos.
- Portada en dos filas, nuevas categorías y opciones para Instagram/Facebook/TikTok/X. La web no puede forzar qué aplicaciones aparecen en el selector del sistema; descarga/copia como alternativa. Publicación final en cada red.

## Validación local
- Auditoría, nutrición de biblioteca, TypeScript de funciones y build: PASS.
- 190 pruebas Playwright escritorio/móvil: PASS. Generación IA comprobada con respuestas controladas, no validación clínica.
- OCR de imagen de prueba y DOCX: PASS. PDF y guardado personal comprobados.
- Pruebas físicas de compartir en las cuatro apps del móvil pendientes; no se afirma publicación automática.

Referencias: https://w3c.github.io/web-share/ ; https://mozilla.github.io/pdf.js/api/ ; https://github.com/naptha/tesseract.js ; https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values
