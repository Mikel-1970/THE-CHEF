# ¡A la mesa! — Review UI de la beta

**Fecha:** 02/10/2026  
**Rama revisada:** `reconcile/baseline-2026-09-21`  
**Commit base revisado:** `94745906d7dd8f97a04e1d99a012344812679194`  
**Baseline de comparación:** 5 mockups maestros aprobados + `UI_MASTER_BASELINE_2026-10-02.md`.

## 1. Resultado ejecutivo

**ESTADO GLOBAL: NO CONFORME para freeze visual de beta.**

La beta es funcional y ya incorpora marca, colores y parte de la nueva portada, pero la migración visual no se ejecutó como un sistema completo. El resultado actual es una capa nueva aplicada sobre una arquitectura de estilos heredada.

La observación del usuario queda confirmada por inspección estática del código:

- solo **Home** utiliza una estructura de clases específica `alm-*`;
- las otras cuatro pantallas maestras siguen montadas principalmente con componentes/clases heredadas;
- `src/main.tsx` carga en cascada ocho capas CSS: `styles.css`, `v05-fixes.css`, `final-v1.css`, `revision-validated.css`, `phase1-final.css`, `appearance.css`, `brand-theme.css`, `a-la-mesa-beta.css`;
- `styles.css` mantiene DM Sans + Playfair Display y la paleta histórica;
- múltiples hojas activas conservan colores hardcoded antiguos (`#405626`, `#fffaf1`, etc.);
- `a-la-mesa-beta.css` actúa mayoritariamente como override final, no como Design System único.

**Causa raíz:** rebranding por superposición de CSS en vez de reconstrucción de componentes/patrones.

## 2. Escala de estados

- **CONFORME:** respeta estructura, lenguaje visual y componentes del patrón maestro.
- **PARCIAL:** incorpora parte sustancial del patrón pero mantiene divergencias visibles.
- **NO CONFORME:** usa estructura/estilos heredados incompatibles con la baseline.
- **PENDIENTE:** no se puede cerrar solo por inspección estática o requiere prueba visual/dispositivo.

## 3. Review de los cinco patrones maestros

| Pantalla | Estado | Prioridad | Evidencia / gap |
|---|---|---:|---|
| Home | PARCIAL | P0 | Es la única pantalla con estructura `alm-*`, dos accesos principales, accesos rápidos y carrusel diario. Falta fidelidad 1:1 en composición, tipografía, decoración editorial, espaciado y relación logo/avatar. |
| Despensa + Lista de compra | NO CONFORME | P0 | La funcionalidad está separada entre `PantryPage` y `ShoppingListPage`; ambas usan estructuras heredadas. El patrón maestro exige selector integrado, buscador, categorías, filas visuales, estados y compra bajo el mismo lenguaje. |
| Foto/Video Receta | NO CONFORME | P0 | El flujo funcional está completo, pero la pantalla usa `TopBar`, `editorial-card` y layout heredado. No reproduce la zona de captura, jerarquía, tarjeta IA y resultado del patrón maestro. |
| Ficha de receta | PARCIAL | P0 | Mantiene título, descripción, imagen, nutrición, módulos y CTA de elaboración, pero estructura, orden, tarjetas, header y métricas no coinciden 1:1 con el patrón. |
| Paso a paso / modo cocina | NO CONFORME | P0 | Conserva progreso, instrucciones, señales y temporizador, pero carece de la composición maestra: tarjeta superior de receta, pestañas, hero visual del paso y jerarquía equivalente. |

## 4. Review de pantallas derivadas

| Pantalla / área | Patrón de herencia | Estado | Prioridad | Acción |
|---|---|---|---:|---|
| Favoritos | Home + Despensa | NO CONFORME | P1 | Rehacer listado con cabecera, filtros y tarjeta de receta oficial. |
| Mis recetas | Home + Despensa | NO CONFORME | P1 | Unificar tabs, buscador, grid/lista y estados. |
| Historial | Home + Despensa | NO CONFORME | P1 | Reutilizar componente de listado oficial y jerarquía temporal. |
| Búsqueda | Home + Despensa | NO CONFORME | P1 | Adoptar barra, chips, filtros y tarjetas oficiales. |
| Técnicas | Home + Ficha | NO CONFORME | P1 | Biblioteca derivada de listado + detalle derivado de ficha. |
| Tips / Consejos | Home + Ficha | NO CONFORME | P1 | Integrar mismo patrón de biblioteca/detalle. |
| Ajustes / Perfil | Despensa + Ficha | NO CONFORME | P1 | Transformar formularios técnicos en secciones/tarjetas coherentes. |
| Tutorial / Ayuda | Despensa + Ficha | NO CONFORME | P1 | Rehacer como lista editorial de módulos y fichas. |
| Splash / Acceso | Home | NO CONFORME | P1 | Aplicar marca, tipografía, fondos, ilustración y CTA oficiales. |
| Importar receta | Foto/Video | NO CONFORME | P1 | Integrar en el patrón de proceso/importación. |
| Avisos | Home + Despensa | NO CONFORME | P2 | Normalizar lista y estado vacío. |
| Modales / confirmaciones | Foto/Video + Paso a paso | NO CONFORME | P1 | Crear un único modal/bottom sheet oficial. |
| Cargas IA | Proceso | PARCIAL | P1 | Conservar lógica; rediseñar overlay y mensajes con sistema oficial. |
| Estados vacíos | Home + Despensa | NO CONFORME | P1 | Crear componente EmptyState oficial. |
| Errores | Proceso | NO CONFORME | P1 | Normalizar alertas, recuperación y CTA. |
| Avatar + menú | Home | PARCIAL | P1 | La navegación por avatar ya existe y usa parte de la nueva paleta; ajustar geometría, tipografía e iconografía al mockup. |

## 5. Review del Design System actual

| Área | Estado | Hallazgo |
|---|---|---|
| Tipografía | NO CONFORME | Conviven DM Sans, Playfair Display y Fraunces; no existe rol manuscrito estandarizado. |
| Paleta | PARCIAL | Existen tokens nuevos, pero siguen activos colores legacy hardcoded en múltiples hojas. |
| Iconografía | PARCIAL | Predomina Lucide, positivo; todavía convive con emojis/recursos de estilos diferentes. |
| Botones | NO CONFORME | Hay varias familias heredadas: primary, secondary, advanced, entry, cook, voice, etc. sin componente visual unificado. |
| Tarjetas | NO CONFORME | `editorial-card`, `settings-card`, cards de biblioteca, cocina y receta no comparten una especificación única. |
| Espaciado / radios / sombras | NO CONFORME | Valores distribuidos por múltiples CSS y overrides. |
| Header | PARCIAL | BrandMark y avatar existen, pero se resuelven de forma distinta según pantalla. |
| Navegación inferior | CONFORME | No se usa en AppShell activo. El archivo `BottomNav.tsx` queda como legado a limpiar. |
| Responsive | PENDIENTE | Hay media queries y tests funcionales, pero falta QA visual contra los mockups reales. |
| Dark mode | PENDIENTE | Existe, pero no está definido todavía dentro de la nueva baseline visual. |

## 6. Hallazgos técnicos que explican la divergencia

### P0 — Arquitectura visual por capas
`src/main.tsx` importa múltiples generaciones de CSS y el último fichero corrige a los anteriores mediante overrides. Esto impide fidelidad y consistencia sostenibles.

**Acción:** consolidar tokens + componentes y reducir el cascade legacy.

### P0 — 4 de 5 patrones no están implementados como patrones reales
Home sí tiene clases propias `alm-*`; Despensa, Foto/Video, Receta y Cook conservan DOM y clases de versiones anteriores.

**Acción:** reconstruir las cinco bases como componentes/páginas reales antes de propagar.

### P0 — Despensa y compra no comparten presentación
Actualmente inventario y compra son pantallas separadas. La baseline visual exige una experiencia integrada o, como mínimo, dos rutas con el mismo shell/selector/patrón.

**Acción:** crear `PantryShoppingShell` compartido sin alterar la lógica de datos.

### P0 — Modo cocina no tiene hero visual por paso
La UI actual presenta instrucción + facts + timer, pero no un bloque visual equivalente al mockup.

**Acción:** introducir `CookingStepCard`/media del paso con fallback seguro, sin inventar imágenes.

## 7. Backlog priorizado

### P0 — antes de cualquier nueva preview visual
1. Crear Design System real: tokens, typography roles, button/card/icon primitives.
2. Eliminar dependencia visual de overrides legacy para los cinco patrones.
3. Rehacer Home 1:1.
4. Rehacer Despensa/Compra 1:1.
5. Rehacer Foto/Video 1:1.
6. Rehacer Ficha 1:1.
7. Rehacer Paso a paso 1:1.
8. QA visual móvil contra los cinco mockups.

### P1 — inmediatamente después
9. Favoritos / Mis recetas / Historial.
10. Búsqueda.
11. Técnicas + Tips.
12. Ajustes / Perfil.
13. Tutorial / Ayuda.
14. Splash / Acceso.
15. Importar receta.
16. Modales, confirmaciones, errores, vacíos y carga IA.

### P2 — limpieza y calidad
17. Retirar CSS y componentes legacy no usados.
18. Revisar `BottomNav.tsx`, `CreateRecipePage.tsx`, `MealPlanPage.tsx` y otros restos no activos.
19. Definir dark mode dentro del nuevo sistema o aplazarlo explícitamente.
20. Microinteracciones, transiciones y pulido editorial.

## 8. Gate de beta revisado

**F2.6 Freeze Beta Privada: BLOQUEADO por UI.**

No basta con CI verde ni con una preview funcional. El siguiente gate exige:

- cinco patrones reales conformes;
- pantallas derivadas P1 adaptadas;
- ausencia de mezcla visual perceptible;
- QA visual y responsive;
- regresión funcional verde;
- validación en iPhone / Android / PC.

La preview del commit `9474590...` sigue siendo útil como baseline funcional, pero **queda rechazada como baseline visual final**.
