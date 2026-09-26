# Renovación fotográfica de la biblioteca — 2026-09-25

170 fotografías nuevas (150 platos y 20 cócteles), generadas con Nano Banana en Higgsfield a partir de los ingredientes y elaboración de cada receta. Estética editorial: luz natural cálida, mesa real, vajilla y fondos con profundidad. Sin cambios en el contenido de las recetas.

## Recursos y coste

- 170 miniaturas WebP 360 × 480 y 170 fotos de detalle WebP 960 × 1280, proporción 3:4 para evitar el recorte horizontal anterior en las tarjetas.
- Miniaturas por debajo de 60 KB y detalle por debajo de 220 KB; tamaños y SHA-256 en CHEF_LIBRARY_ASSETS.json.
- Revisión HTTP `editorial-20260925` en las URL para renovar las imágenes almacenadas en caché.
- Saldo inicial verificado: 187 créditos. Saldo final verificado: 16. Consumo observado: 171, máximo autorizado: 180.
- 170 generaciones iniciales y una regeneración de la carbonara para eliminar la yema entera de adorno. Dos solicitudes rechazadas por límite de velocidad se reintentaron, sin duplicar trabajos aceptados.
- Revisión visual de las 170 imágenes en hojas de contacto; originales y recibos conservados localmente en work/photo-refresh, fuera del paquete publicado.

## Alcance

Publicación exclusiva en reconcile/baseline-2026-09-21. Main y producción quedan fuera del cambio. PR #16 permanece en borrador. La valoración final del estilo en el móvil físico corresponde a la revisión del usuario.

## Validación local

- npm run validate: correcto (auditoría, nutrición, Functions, TypeScript y build).
- 48 pruebas Playwright correctas en escritorio y móvil emulado: biblioteca, imágenes, PDF, compartir y retirada del plan de comidas.
- Revisión visual de tarjetas reales de platos y cócteles en ambos tamaños.

