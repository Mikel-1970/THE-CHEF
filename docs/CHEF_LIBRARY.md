# Biblioteca del Chef

El catálogo incluido contiene 150 recetas y 20 cócteles. Se distribuye con la aplicación y no necesita generar texto ni imágenes al abrir sus fichas.

## Contenido

- 80 recetas españolas: 10 arroces, 10 guisos y legumbres, 10 carnes, 10 pescados y mariscos, 10 verduras y ensaladas, 10 tapas y huevos, 5 sopas y cremas y 15 postres.
- 15 recetas italianas.
- 5 recetas por cocina: francesa, portuguesa, griega, mexicana, peruana, japonesa, china, tailandesa, india, árabe/oriental y estadounidense.
- 20 cócteles, incluidos tres sin alcohol. Las cantidades iniciales de bebidas corresponden a una copa; las de platos y postres, a cuatro personas.

Las recetas son formulaciones editoriales predefinidas, con tiempos orientativos. No constituyen una certificación culinaria. La información nutricional no se ha calculado y se omite expresamente, tanto en la ficha como en el PDF, en lugar de mostrar valores inventados. Los tiempos totales de las preparaciones que requieren remojo, reposo o frío incluyen esos periodos indicados.

## Comportamiento

`Mis recetas` abre la Biblioteca del Chef. `Mis guardadas`, Favoritas e Historial conservan los contenidos personales. Hay filtros por tipo, cocina, categoría y alcohol, y búsqueda por nombre.

La búsqueda normal consulta primero las recetas incluidas y aplica cocina, restricciones, tiempo y dificultad. Si no encuentra coincidencia, ofrece crear una con IA mediante un botón explícito. Desde una ficha incluida se puede solicitar `Crear otra con IA`; conserva los criterios de la búsqueda que originó esa receta y excluye el plato actual. Una consulta de una receta ajena a la búsqueda activa no hereda sus preferencias accidentalmente.

El número de comensales o copas puede modificarse sin IA. Se conserva en la URL y pasa a ingredientes, elaboración y PDF. Las recetas incluidas no ocupan el cupo de recetas personales guardadas.

## Archivos y mantenimiento

- `src/data/library/recipes.json`: contenido canónico con identificadores estables `lib-001` a `lib-170`.
- `public/library/lib-NNN_min.webp`: miniatura de 360 × 270.
- `public/library/lib-NNN.webp`: detalle de 960 × 720.
- `src/data/library/index.ts`: acceso al catálogo y rutas estáticas según la base del despliegue.

No renumerar los identificadores al reordenar o ampliar el catálogo: favoritos e historial se refieren a ellos. Las imágenes son ilustraciones generadas y prealmacenadas. La cuadrícula usa carga diferida; no se precargan todas las fotos.

## Validación

`npm run validate` comprueba auditoría, funciones y compilación. `npm run test:preview` incluye contenido, filtros, escalado, fotos estáticas, búsqueda sin IA, alternativa explícita con API simulada y regresión de los temporizadores. Las pruebas de API simuladas no demuestran disponibilidad del proveedor real. La aceptación culinaria y las pruebas en dispositivos físicos siguen siendo revisión humana.

Destino: rama `reconcile/baseline-2026-09-21` y preview de Cloudflare Pages. PR #16 permanece en borrador. No publicar en `main` ni producción sin autorización explícita.
