# ¡A la mesa! — Implementación UI candidata

**Fecha:** 02/10/2026  
**Rama:** `ui/a-la-mesa-final-2026-10-02`  
**Baseline funcional de partida:** `reconcile/baseline-2026-09-21`  
**Referencia visual:** `docs/UI_MASTER_BASELINE_2026-10-02.md`

## Objetivo

Reconstruir la capa visual de la beta para que los cinco mockups maestros funcionen como un sistema real y reutilizable, manteniendo la lógica y los flujos funcionales existentes.

## Implementado

### UI-1 — Design System

Creado `src/a-la-mesa-system.css` y activado desde `src/main.tsx`.

Define:
- roles tipográficos: Fraunces / Inter / Caveat;
- verde oscuro, terracota, crema, oliva y grises cálidos;
- radios, sombras y espaciados;
- botones primario/secundario/acento;
- chips, campos, tarjetas, estados y paneles;
- avatar/menú y navegación superior;
- modales, bottom sheets, loading, errores y estados vacíos;
- normalización de clases legacy activas para evitar saltos visuales.

El antiguo `a-la-mesa-beta.css` deja de cargarse.

### UI-2 — Cinco patrones maestros reales

**Home**
- identidad editorial;
- buscador;
- tarjetas Abre la despensa + Foto/Video Receta;
- imagen de despensa tradicional;
- accesos rápidos;
- propuesta del día horizontal;
- acentos manuscritos.

**Despensa + Lista de compra**
- cabecera común;
- selector segmentado Despensa / Lista de compra;
- gestión de inventario conservada;
- vista previa de compra integrada;
- misma familia de controles, estados y listas.

**Foto/Video Receta**
- cabecera maestra;
- captura/importación;
- tarjeta visual de identificación;
- confirmación/corrección;
- tarjeta “Tu receta lista” antes de incorporar el borrador;
- funcionalidad existente intacta.

**Ficha de receta**
- cabecera de marca;
- acciones favorito/compartir;
- taxonomía;
- hero;
- métricas visuales;
- nutrición;
- raciones con stepper;
- cuatro módulos;
- CTA “Ver elaboración · Paso a paso de la receta”.

**Paso a paso**
- cabecera de marca;
- resumen superior de receta;
- control segmentado;
- progreso;
- hero visual del paso con fallback;
- instrucción + señales culinarias;
- temporizador;
- navegación anterior/siguiente.

### UI-3 — Pantallas derivadas

Se ha aplicado la cabecera editorial común `AlmPageHeader` y el sistema visual a:
- Mis recetas / Favoritos / Historial;
- Búsqueda;
- Técnicas;
- Tips;
- Ajustes / Perfil;
- Tutorial;
- Importar receta;
- Avisos;
- “¿Qué quieres cocinar?”;
- “Abre la despensa”;
- Inventario;
- Lista de compra;
- Foto/Video.

Acceso, bienvenida, tour, loading, modales y social share también heredan la identidad.

## Funcionalidad preservada

No se han eliminado ni reescrito los motores de:
- recomendación/generación;
- inventario;
- compra;
- importación foto/vídeo/enlace;
- receta y escalado;
- favoritos/biblioteca/historial;
- técnicas;
- temporizadores;
- personalización/versionado;
- PDF y compartir.

Plan nutricional continúa fuera de esta beta.

## QA automático

Se han añadido controles estáticos específicos de UI a `scripts/phase1-audit.mjs`:
- stylesheet oficial;
- tres roles tipográficos;
- patrón Home;
- patrón Despensa+Compra;
- patrón Foto/Video;
- patrón Ficha;
- patrón Paso a paso;
- cabeceras derivadas;
- identidad de Acceso/Tutorial.

Los tests afectados por cambios de wording/geometría se han actualizado únicamente cuando la expectativa anterior correspondía a la UI descartada.

## Gate

La implementación se considera **candidata visual**, no freeze final, hasta:
1. CI completo verde;
2. deploy privado Cloudflare correcto;
3. revisión visual real por el usuario en iPhone;
4. smoke físico iPhone/Android/PC sin S0/S1.

`main` permanece fuera de alcance.
