# The Chef — Cierre de Fase 1

## Objetivo
Entregar una versión definitiva de Fase 1 suficientemente estable, coherente y completa para realizar un test real con familiares y amigos antes de iniciar la Fase 2.

## Estado de entrega
**Candidato Fase 2: v1.0.0-rc2.**

La revisión técnica automatizada de cierre incluye compilación TypeScript/Vite, auditoría estática de regresión de requisitos y auditoría de dependencias de producción. El despliegue de GitHub Pages valida además que `version.json` publicado coincide con el commit desplegado.

La prueba real de cámara, micrófono, notificaciones y comportamiento del sistema operativo en segundo plano debe completarse en dispositivos físicos durante el smoke test previo y la propia Fase 2, porque depende de permisos y políticas de iOS/Android/navegador.

## Alcance de la versión final de Fase 1
La versión incorpora el checklist funcional validado en la revisión del 8 de septiembre de 2026, incluyendo:

- navegación definitiva con avatar;
- 16 avatares y nomenclatura final;
- generación libre de recetas;
- Abre la nevera...;
- Foto Receta con corrección confirmada por usuario;
- Crear tu receta guiada;
- dos propuestas comparables con información nutricional;
- ficha definitiva de receta;
- Elaboración paso a paso y temporizador basado en hora real de finalización;
- personalización y variantes/versionado;
- Historial, Favoritos y Mis recetas;
- Despensa y nevera V1 con categorías personalizadas y unidades sugeridas;
- Lista de compra general con conservación de compras manuales;
- PDF profesional de tres páginas;
- sistema multidioma funcional para interfaz principal y contenido generado por IA;
- Guía/Tutorial desde el menú del avatar;
- ajuste Recetas existentes ↔ IA;
- medición de consumo IA por operación;
- diseño responsive sin scroll horizontal funcional;
- persistencia de búsqueda, preferencias, biblioteca y compra; manejo de errores y reintentos.

## Auditorías internas de cierre
1. Auditoría de código y eliminación de redundancias en flujos principales.
2. Auditoría de consumo IA: generación completa solo tras elegir propuesta, mezcla catálogo/IA y telemetría de llamadas.
3. Auditoría de dependencias: el pipeline bloquea vulnerabilidades críticas de producción.
4. Auditoría estática de regresión de requisitos de Fase 1.
5. Compilación TypeScript y build PWA en CI.
6. Validación automática del artefacto publicado en GitHub Pages.

## Limitaciones deliberadas de la beta privada
- El acceso de usuario sigue siendo **provisional y local al dispositivo**. No debe utilizarse como autenticación de producción ni para una beta pública abierta. Antes del lanzamiento comercial se sustituirá por autenticación backend con almacenamiento seguro de credenciales y políticas de acceso por usuario.
- La alarma del temporizador utiliza un `deadline` real, por lo que el tiempo no se pausa al abandonar la app. La notificación mientras la PWA está completamente suspendida por el sistema operativo es dependiente del navegador/OS y debe verificarse en dispositivo físico.
- La internacionalización cubre la navegación y los flujos principales, y fuerza el idioma seleccionado en el contenido generado por IA. Durante Fase 2 deben anotarse cadenas residuales que aún aparezcan en español para completar el catálogo final.
- Los planes nutricionales, caducidades, tickets y reconocimiento fotográfico de inventario permanecen fuera de esta fase.

## Criterios de aceptación para Fase 2
- sin errores críticos o bloqueantes conocidos en CI;
- cuatro modos principales conectados a una estructura común de receta;
- dos propuestas por generación;
- receta, variantes, elaboración y PDF coherentes;
- navegación global por avatar fuera de Inicio;
- compra manual independiente de recetas;
- temporizador resiliente a cambios de pantalla/background por cálculo de tiempo absoluto;
- auditoría de dependencias y build en verde;
- despliegue validado contra versión y commit esperados.

## Entrega para Fase 2
La Fase 2 se utilizará para recoger feedback real sobre facilidad de uso, funciones más y menos utilizadas, módulos prescindibles, mejoras de flujo, calidad de recetas, claridad de interfaz, percepción de valor y nuevas funciones. Los fallos encontrados se clasificarán por severidad y se corregirán antes de una distribución más amplia.

## Funcionalidades previstas para fases posteriores
- planificación semanal y planes nutricionales;
- caducidades y alertas de despensa/nevera;
- lectura de tickets de compra;
- reconocimiento fotográfico de inventario;
- nutrición avanzada;
- definición final de planes de suscripción y monetización;
- decisión de marca/nombre comercial definitivo y estrategia de protección.
