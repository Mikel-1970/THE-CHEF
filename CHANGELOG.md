# Changelog

## V0.4.0 — Primera revisión funcional tras prueba real

- Se eliminan los filtros de tipo de comida (comida, cena, brunch): la app se centra en generar y buscar platos.
- El tipo de cocina pasa a un desplegable con una selección más amplia.
- El tiempo máximo de elaboración se amplía hasta 5 horas y se muestra en horas/minutos.
- Nuevo ajuste global de tamaño de texto: Normal, Grande y Muy grande. La opción Grande queda como valor inicial.
- Se elimina el límite “Puedo comprar X productos”. Los ingredientes que falten ya no descartan automáticamente una receta.
- La receta permite marcar cada ingrediente como “Tengo” o “Me falta”.
- Los ingredientes faltantes muestran alternativas culinarias y se pueden incorporar a una lista de compra persistente.
- “Lista” pasa a ser una lista de compra real, distinta de “Mis recetas”.
- “Perfil” desaparece de la barra inferior; “Recetas” ocupa ese acceso y Ajustes sigue disponible desde Inicio.
- “Buscar” deja de abrir la generación de propuestas y dispone de una pantalla independiente de búsqueda de recetas.
- El botón central “Chef” abre el flujo “¿Qué te apetece hoy?”.
- Las sugerencias rápidas de “Hoy me apetece…” empiezan a adaptarse según favoritas e historial.
- Se mantiene el motor local del prototipo; la búsqueda externa y la personalización con IA quedan preparadas para una fase posterior.

## V0.3.0 — Dirección visual adjudicada + motor local mejorado

- Nueva identidad visual marfil, verde oliva y mostaza.
- Inicio reconstruido según la propuesta seleccionada.
- Fotografías integradas en los dos accesos principales.
- Nueva navegación inferior de cinco accesos.
- Nuevo icono PWA de El Chef.
- Filtros opcionales de estilo, cocina y dificultad.
- Básicos de despensa configurables.
- Preferencias de nivel de cocina y picante.
- Motor local de recomendaciones basado en puntuación.
- Los ingredientes marcados como prioritarios reciben mayor peso.
- Tiempo, comida, cocina, estilo y dificultad afectan al ranking.
- `Dame otras 3` ya genera una segunda tanda de propuestas.
- Mis recetas incorpora vistas Todo / Favoritas / Historial.
- Sigue sin servicios externos ni costes de API.

## V0.2.0 — PWA rediseñada

- Migración del prototipo Expo a PWA React/Vite.
- Primera dirección visual gastronómica.
- Flujos principales con datos simulados.
- Modo Cocina y persistencia local básica.
