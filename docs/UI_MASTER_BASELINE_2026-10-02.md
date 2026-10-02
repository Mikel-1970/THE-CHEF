# ¡A la mesa! — Baseline visual oficial

**Fecha de cierre de decisión:** 02/10/2026  
**Estado:** DECISIÓN CERRADA  
**Alcance:** capa UI/UX visual de toda la aplicación. La funcionalidad, lógica y flujos aprobados se conservan salvo contradicción explícita.

## 1. Regla principal

Toda la app debe sentirse como un único producto coherente. Debe mantener en todas las pantallas:

- misma jerarquía tipográfica;
- misma paleta;
- mismo sistema de botones;
- mismas familias de tarjetas;
- misma iconografía;
- mismo tono visual;
- misma jerarquía de información;
- misma lógica de presentación;
- misma sensación mediterránea, cálida, cuidada y editorial.

No se acepta una mezcla de pantallas antiguas, pantallas retocadas y pantallas nuevas.

## 2. Cinco patrones maestros

Los cinco mockups aprobados pasan a ser la **baseline visual oficial** y origen de todo el sistema:

1. **Home**
2. **Despensa y lista de la compra**
3. **Foto/Video Receta**
4. **Ficha de receta**
5. **Paso a paso / modo cocina**

Toda pantalla existente o futura debe derivar explícitamente de uno o varios de estos patrones.

## 3. Herencia de pantallas derivadas

### A. Biblioteca / listado → Home + Despensa

Incluye Favoritos, Mis recetas, Técnicas, Historial, Resultados de búsqueda, listas de recetas y categorías.

Debe usar:
- cabecera editorial;
- buscador claro;
- chips/filtros redondeados;
- tarjetas homogéneas;
- imágenes grandes y cuidadas;
- scroll limpio;
- título editorial dominante;
- decoración sutil.

### B. Detalle → Ficha de receta

Incluye detalle de técnica, ingrediente, recomendación, mise en place, punto crítico, nota y receta guardada.

Debe usar:
- hero visual;
- título editorial;
- descripción clara;
- módulos en tarjetas;
- navegación visual por secciones;
- CTA grandes y consistentes;
- mismas proporciones, radios y espaciado.

### C. Proceso / interacción → Foto/Video + Paso a paso

Incluye edición de receta, corrección de plato, revisión antes de generar, cocina guiada, temporizadores, confirmaciones y procesos paso a paso.

Debe usar:
- una acción principal inequívoca;
- bloques de confirmación;
- CTA verde/naranja;
- navegación simple;
- información priorizada;
- progreso visual;
- continuidad con modo cocina.

### D. Configuración / utilidad → Despensa + Ficha de receta

Incluye Ajustes, Perfil, Tutorial, Ayuda, Preferencias, configuración de despensa, gestión de usuario y avatar.

Debe usar:
- listas limpias;
- iconografía consistente;
- secciones agrupadas;
- tarjetas homogéneas;
- aspecto premium y amable, no técnico.

## 4. Sistema visual obligatorio

### Tipografía

Se fijan tres **roles tipográficos**:

1. **Editorial/display:** títulos, titulares, nombres de recetas y bloques importantes.
2. **Sans limpia:** textos de apoyo, descripciones, inputs, botones secundarios y metadata.
3. **Manuscrita/acento:** solo frases decorativas, llamadas emocionales y pequeños mensajes.

**PENDIENTE DE CIERRE NOMINAL:** familia exacta de cada rol. No bloquear la review por este punto; sí bloquear el freeze visual final.

### Paleta

- Verde oscuro: identidad, marca, CTA principal.
- Naranja terracota: acento, acción y calor culinario.
- Crema/marfil: fondo.
- Olivas suaves: apoyo y decoración.
- Grises cálidos: texto secundario.

No introducir colores de sistema ajenos al lenguaje visual salvo estados funcionales que lo exijan y estén normalizados.

### Iconografía

Una única familia visual:
- grosor consistente;
- mismo lenguaje lineal/relleno;
- tamaños normalizados;
- sin mezcla arbitraria de estilos.

### Tarjetas

Familias mínimas:
- tarjeta principal;
- tarjeta de receta;
- tarjeta de acceso;
- tarjeta informativa;
- tarjeta de acción;
- tarjeta de paso.

Deben compartir radios, sombra, espaciado y lógica de composición.

### Botones

- **Primario:** verde, acción principal.
- **Secundario:** claro, borde/bloque suave.
- **Acento:** terracota, acción destacada.
- **Icon button:** favorito, compartir, volver, menú y equivalentes.

## 5. Regla de homogeneidad

Antes de diseñar o modificar cualquier pantalla se debe responder:

> ¿De cuál de los cinco patrones maestros deriva?

Si no existe una respuesta clara, la pantalla no está correctamente integrada en el sistema.

## 6. Pantallas obligatorias a adaptar

### Navegación principal
Home, Favoritos, Mis recetas, Técnicas, Despensa, Lista de la compra, Ajustes, Tutorial, Historial.

### Flujo receta
Propuesta/resultado, ficha, Ingredientes, Mise en place, Recomendaciones, Puntos críticos, Elaboración, Notas, Compartir/Guardar.

### Flujo despensa
Despensa, Lista de compra, Añadir producto, Editar producto, Categorías, Estado del producto, búsqueda.

### Foto/Video Receta
Captura/importación, identificación, corrección, generación y resultado.

### Otras
Splash/Acceso, Avatar/menú, estados vacíos, carga, error, confirmaciones, modales y diálogos.

## 7. Orden de ejecución obligatorio

### Fase UI-1 — Design System
Tokens, tipografías, paleta, espaciado, componentes, iconos y patrones.

### Fase UI-2 — 5 patrones reales
Rehacer las cinco pantallas maestras en la app funcional, no como mockups.

### Fase UI-3 — Propagación
Adaptar todas las pantallas derivadas.

### Fase UI-4 — Pulido
Consistencia, responsive, vacíos, scroll, transiciones, legibilidad y QA visual.

## 8. Criterio de aceptación

La beta visual no se considera cerrada por cambiar logo, colores o tipografías globales. Para cerrar el gate debe:

1. reproducir fielmente los cinco patrones maestros en pantallas reales;
2. mantener funcionalidad y flujos aprobados;
3. usar componentes compartidos, no estilos aislados;
4. no conservar restos visuales perceptibles de la UI anterior;
5. mantener coherencia en todas las pantallas derivadas;
6. superar QA funcional, responsive y visual en móvil y escritorio.

La preview técnica anterior queda como evidencia funcional, **no como acabado visual aceptado**.
