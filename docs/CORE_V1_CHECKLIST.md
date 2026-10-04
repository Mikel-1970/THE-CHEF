# The Chef — CORE V1 Checklist

## A. Base y trazabilidad
- [ ] Commit y versión visibles y reproducibles.
- [ ] Fuente de verdad = GitHub.
- [ ] Sin dependencia de decisiones no documentadas.
- [ ] Documento maestro mapeado contra pruebas reales.

## B. Inicio y navegación
- [ ] Inicio claro y usable en móvil.
- [ ] Acceso a ¿Qué quieres que te prepare?
- [ ] Acceso a Abre la nevera.
- [ ] Acceso a biblioteca, compra y despensa.
- [ ] Volver/cerrar no pierde estado.
- [ ] Scroll vertical, teclado y zoom correctos.

## C. Interpretación y búsqueda
- [ ] Entrada por texto.
- [ ] Entrada por voz.
- [ ] Reutiliza comensales, tiempo y restricciones detectadas.
- [ ] Filtros avanzados opcionales.
- [ ] Restricciones y exclusiones nunca se reintroducen.

## D. Cocina con lo disponible
- [ ] No inventa existencias ni cantidades.
- [ ] Admite cantidad desconocida, aproximada y exacta.
- [ ] Reconoce sobras y cocinados.
- [ ] Prioriza productos marcados.
- [ ] Comprueba sustituciones antes de declarar compra necesaria.
- [ ] Clasifica: Con lo que tienes / Te falta muy poco / Buena opción si compras algunas cosas.

## E. Propuestas
- [ ] Exactamente dos propuestas por defecto.
- [ ] Son culinariamente diferentes.
- [ ] Incluyen nombre, resumen, tiempo, dificultad, estilo/cocina y nutrición cuando proceda.
- [ ] Generar receta completa solo al seleccionar propuesta.

## F. Ficha de receta
- [ ] Orden final: título → resumen → foto → nutrición → opciones.
- [ ] Foto preparada antes de presentar la receta como terminada.
- [ ] Si falla solo la foto, reintento aislado y estado claro.
- [ ] Ingredientes con cantidades y unidades.
- [ ] Escalado por comensales con criterio culinario.
- [ ] Mise en place.
- [ ] Recomendaciones.
- [ ] Puntos críticos.
- [ ] Elaboración.
- [ ] Personalización crea variante sin sobrescribir original.

## G. Modo cocina
- [ ] Paso a paso cronológico.
- [ ] Cantidades, tiempos, temperaturas y señales cuando aplican.
- [ ] Posición persistente al salir y volver.
- [ ] Temporizador por deadline real.
- [ ] Solo un temporizador activo.
- [ ] Comportamiento validado en background real.

## H. Biblioteca
- [ ] Historial independiente.
- [ ] Favoritos independientes.
- [ ] Mis recetas independiente.
- [ ] Eliminar relación no borra las demás.
- [ ] Variantes versionadas.
- [ ] Recetas antiguas siguen abriendo.

## I. Despensa y nevera
- [ ] Dos almacenes diferenciados.
- [ ] Categorías simplificadas.
- [ ] Alta/edición/baja de producto.
- [ ] Cantidad opcional.
- [ ] Unidad sugerida pero corregible.
- [ ] Entrada múltiple por texto/voz.
- [ ] Sin productos demo en usuario nuevo.

## J. Lista de compra
- [ ] Combina manuales y faltantes de receta.
- [ ] Al cambiar de receta solo sustituye vinculados.
- [ ] Los manuales permanecen.
- [ ] Evita duplicados.
- [ ] Volver recupera la receta exacta.

## K. PDF
- [ ] Tres páginas.
- [ ] Contenido coherente con ficha.
- [ ] Ingredientes, preparación y elaboración completos.
- [ ] Avatar/usuario según datos reales.
- [ ] Selección de imagen cuando exista foto final.

## L. Calidad y fiabilidad
- [ ] No hay ingredientes sin usar.
- [ ] No faltan ingredientes usados en pasos.
- [ ] Cantidades y comensales coherentes.
- [ ] Tiempos y temperaturas plausibles.
- [ ] Sin restos de versiones anteriores.
- [ ] Errores recuperables sin perder trabajo.

## M. QA
- [ ] npm run audit:phase1.
- [ ] npm run build.
- [ ] npm audit --omit=dev --audit-level=critical.
- [ ] iPhone/Safari.
- [ ] Android/Chrome.
- [ ] PC.
- [ ] Cámara.
- [ ] Micrófono.
- [ ] Teclado.
- [ ] Zoom.
- [ ] Temporizador background.
- [ ] Cero bloqueantes antes de beta privada.
