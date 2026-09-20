# The Chef — F2.4 Smoke test físico

## Objetivo
Validar la candidata de reconciliación en dispositivo real antes de corregir severidad alta y congelar la beta.

## Dispositivos mínimos
1. iPhone / Safari o PWA instalada.
2. Android / Chrome o PWA instalada.
3. PC / navegador Chromium.

Registrar por prueba: dispositivo, navegador, fecha, resultado PASS/FAIL, captura si falla y comentario breve.

## ST-01 Acceso y migración
1. Abrir la app desde cero.
2. Registro.
3. Verificar contraseña oculta y ojo.
4. Cerrar/reabrir sesión.
5. Login.
6. Recuperación/cambio local.
7. Confirmar que Ajustes no muestra la contraseña.
**PASS:** acceso funciona y no se muestra contraseña almacenada.

## ST-02 Inicio y navegación
1. Revisar Inicio.
2. Entrar en cada modo.
3. Abrir avatar flotante fuera de Inicio.
4. Volver/Inicio/menú con teclado abierto.
5. Hacer zoom y recorrer pantalla larga.
**PASS:** ningún botón inaccesible, sin scroll horizontal y sin pérdidas inesperadas.

## ST-03 ¿Qué quieres que te prepare?
Entrada:
“Somos cuatro. Quiero pescado moderno, al horno, menos de 45 minutos y sin lácteos.”
1. Dictarlo y repetirlo por texto.
2. Confirmar interpretación.
3. Revisar filtros.
4. Generar.
**PASS:** 2 propuestas, ≤45 min, sin lácteos y distintas.

## ST-04 Restricción crítica
Entrada:
“Pasta italiana para 2, sin lácteos y sin cebolla.”
**PASS:** ninguna propuesta/receta reintroduce leche, queso, mantequilla, nata, yogur o cebolla.

## ST-05 Abre la nevera
Inventario:
- 500 g pollo
- 250 g arroz
- 1 calabacín
- 2 huevos
- tomate
Marcar como prioritarios pollo y calabacín.
1. Generar.
2. Revisar usados, faltantes, insuficientes y sustituciones.
**PASS:** conoce todo el inventario, prioriza solo lo marcado y no inventa cantidades.

## ST-06 Cantidad insuficiente
Guardar 100 g de pollo y pedir receta para 4.
**PASS:** no afirma que alcanza; indica faltante, lo usa como secundario o propone alternativa.

## ST-07 Sustitución
Crear un caso donde falte un ingrediente con sustituto disponible.
1. Elegir “Usar sustituto”.
2. Confirmar variante.
**PASS:** original intacto; variante actualiza ingredientes/pasos/nutrición de forma coherente.

## ST-08 Ficha
**PASS visual:** título → resumen → foto → nutrición → opciones. La ficha no aparece como terminada sin foto preparada. Si falla foto, reintentar no debe regenerar toda la receta.

## ST-09 Raciones
Cambiar 2 → 6 comensales.
**PASS:** ingredientes se adaptan y no quedan cifras contradictorias en pasos. Si aparece contradicción, registrar captura: es gap TC-04-03.

## ST-10 Tengo / Me falta
1. Marcar dos ingredientes.
2. Salir y volver.
3. Abrir compra.
**PASS:** estados persistentes; inventario reconocido; faltantes llegan a compra sin duplicados.

## ST-11 Lista de compra
1. Añadir faltantes de receta A.
2. Añadir manual “papel de cocina”.
3. Abrir receta B.
**PASS:** se sustituyen automáticos de A; “papel de cocina” permanece.

## ST-12 Modo Elaboración
1. Avanzar/retroceder.
2. Salir a receta y volver.
**PASS:** conserva paso y muestra tiempos/temperatura/señal cuando existen.

## ST-13 Temporizador
1. Iniciar 2 min.
2. Bloquear pantalla/cambiar de app.
3. Volver.
4. Iniciar otro timer.
**PASS:** tiempo restante real; el anterior queda cancelado; solo un timer activo.

## ST-14 Notificación background
Con permisos concedidos, dejar un timer terminar con PWA/navegador en segundo plano y pantalla bloqueada.
**PASS/LIMITACIÓN:** registrar exactamente si suena/notifica en cada OS. Una limitación del navegador no se disfrazará como función garantizada.

## ST-15 Foto Receta
1. Foto de un plato.
2. Corregir una identificación por voz.
3. Corregir de nuevo.
4. Confirmar.
**PASS:** corrección del usuario prevalece y la foto origen queda separada.

## ST-16 Cámara/foto final
Terminar una receta, fotografiar resultado y volver.
**PASS:** foto final persiste y no elimina imagen IA/origen.

## ST-17 Favoritos / Historial / Mis recetas
Guardar, favoritar, abrir, retirar favorito y borrar historial.
**PASS:** relaciones independientes; receta guardada no desaparece por retirar favorito/historial.

## ST-18 Variante
Personalizar una receta dos veces.
**PASS:** original + versiones sucesivas; no sobrescribe.

## ST-19 PDF
Generar PDF de receta corta y larga.
**PASS:** 3 páginas, legible, sin contenido cortado y coherente con ficha.

## ST-20 Idioma
Cambiar a italiano y recorrer Inicio → propuesta → receta → elaboración → PDF.
**PASS:** registrar cualquier cadena residual en español.

## Criterio de severidad
- **S0 Bloqueante:** pérdida de datos, app no abre, receta imposible de generar/cocinar, restricción/alergia incumplida.
- **S1 Alta:** flujo principal roto, cantidades contradictorias relevantes, navegación bloqueada, timer incorrecto.
- **S2 Media:** función secundaria incorrecta con alternativa disponible.
- **S3 Baja:** texto, alineación, icono, traducción residual o detalle visual.

## Gate
F2.4 se considera superada solo cuando:
- ST-01 a ST-13 y ST-17 a ST-19 no tienen S0/S1 abiertos;
- ST-14 queda documentada por dispositivo;
- cámara/micrófono/teclado se han probado al menos en iPhone y Android;
- todos los fallos tienen ID y severidad.
