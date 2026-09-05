# Changelog

## V0.5.0 — IA estable + cierre de la V1 para prueba

- Flujo IA en dos fases consolidado: 2 propuestas ligeras y generación de receta completa solo al seleccionar una.
- Backend de recetas actualizado para reducir latencia y errores intermitentes de generación.
- Se amplían los márgenes de espera del cliente para evitar falsos timeouts durante la generación.
- La receta permite marcar ingredientes como “Tengo” o “Me falta” tanto desde búsquedas normales como desde “Cocina con lo que tengo”.
- La lista de compra se vincula a la receta activa y se vacía al pasar a una receta distinta para evitar mezclar compras.
- La lista de compra puede compartirse desde el menú nativo del móvil y dispone de acceso directo a WhatsApp.
- “Avisos” desaparece de la navegación principal y se sustituye por acceso directo a “Compra”.
- La descripción, trabajos previos, puntos críticos y recomendaciones incorporan paneles ampliables con tipografía mayor.
- Se mantiene el ajuste global de tamaño de fuente.
- Mis recetas e Historial conservan compatibilidad con entradas antiguas y permiten recuperar recetas IA guardadas.
- El estado de búsqueda, favoritas, recetas guardadas, historial, ajustes y lista de compra se mantiene en almacenamiento local.
- El Modo Cocina conserva temporizadores, avance paso a paso y prevención del bloqueo de pantalla cuando el navegador lo permite.

### Alcance intencionadamente fuera de esta V1

- Fotografía automática de ingredientes.
- Despensa completa con caducidades y tickets.
- Planificación semanal.
- Nutrición detallada conectada a una base oficial.
- Imágenes generadas dinámicamente para cada receta.
- Foto del resultado cocinado y valoración avanzada de recetas.

Estas funciones quedan previstas para fases posteriores para no comprometer la estabilidad de la versión de prueba.

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
