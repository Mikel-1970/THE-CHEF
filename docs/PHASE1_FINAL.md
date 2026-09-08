# The Chef — Cierre de Fase 1

## Objetivo
Entregar una versión definitiva de Fase 1 suficientemente estable, coherente y completa para realizar un test real con familiares y amigos antes de iniciar la Fase 2.

## Alcance de la versión final de Fase 1
La versión deberá incorporar el checklist funcional validado en la revisión del 8 de septiembre de 2026, incluyendo:

- navegación definitiva con avatar;
- 16 avatares finales;
- generación libre de recetas;
- Abre la nevera...;
- Foto Receta;
- Crear tu receta;
- dos propuestas comparables con información nutricional;
- ficha definitiva de receta;
- Elaboración paso a paso y temporizador en segundo plano;
- personalización y variantes/versionado;
- Historial, Favoritos y Mis recetas;
- Despensa y nevera V1;
- Lista de compra general;
- PDF profesional de receta;
- sistema multidioma funcional;
- Guía/Tutorial desde el menú del avatar;
- ajuste Recetas existentes ↔ IA;
- medición de consumo/coste IA por función y usuario;
- diseño responsive sin scroll horizontal funcional;
- persistencia de estado, manejo de errores y reintentos.

## Auditorías internas obligatorias
Antes de declarar cerrada la Fase 1 se ejecutarán de forma autónoma:

1. Auditoría integral de código y refactorización.
2. Auditoría de rendimiento y consumo de IA.
3. Auditoría de seguridad y privacidad.
4. Pruebas funcionales, de regresión y casos límite.
5. Pruebas específicas en móvil, voz, cámara, temporizador, imágenes y PDF.

No se solicitarán decisiones al usuario por cuestiones técnicas internas salvo que una decisión pueda modificar de forma material una función aprobada, la experiencia de usuario, la seguridad, el coste o el comportamiento del producto.

## Criterios de aceptación
La versión de Fase 1 podrá declararse lista para test real cuando:

- no existan errores críticos o bloqueantes conocidos;
- los cuatro modos principales desemboquen en la misma lógica y estructura de receta;
- el flujo principal pueda completarse de principio a fin en móvil;
- no se pierda estado al cambiar de pantalla o salir temporalmente de la app;
- el temporizador continúe en segundo plano y cancele el anterior al iniciar uno nuevo;
- la receta, sus variantes y el PDF sean coherentes entre sí;
- la interfaz sea consistente, legible y sin desplazamiento horizontal accidental;
- los idiomas seleccionables traduzcan realmente la interfaz;
- el consumo de IA quede medido para posteriores decisiones de monetización;
- se haya realizado una prueba de regresión completa tras la refactorización final.

## Entrega para Fase 2
La Fase 2 comenzará con una versión estable destinada a pruebas con familiares y amigos. El objetivo de esa fase será recoger feedback real sobre:

- facilidad de uso;
- funciones más y menos utilizadas;
- módulos prescindibles;
- mejoras de flujo;
- calidad de las recetas;
- claridad de la interfaz;
- percepción de valor;
- posibles nuevas funciones.

La Fase 2 no debe comenzar hasta disponer de una versión de Fase 1 suficientemente estable para que los fallos técnicos no contaminen la valoración funcional del usuario.

## Funcionalidades previstas para fases posteriores
Quedan fuera del cierre técnico de Fase 1, aunque previstas en arquitectura:

- planificación semanal y planes nutricionales;
- caducidades y alertas de despensa/nevera;
- lectura de tickets de compra;
- reconocimiento fotográfico de inventario;
- nutrición avanzada;
- definición final de planes de suscripción y monetización;
- decisión de marca/nombre comercial definitivo y estrategia de protección.
