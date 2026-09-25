# Temporizador global y alarma persistente — 2026-09-25

## Problema y corrección
El estado del temporizador estaba dentro de StepTimer, con efectos de lectura/escritura asociados al identificador del paso. Cambiar ese identificador podía escribir el estado del paso anterior sobre el siguiente. La interfaz y el bloqueo de pantalla dependían además del montaje del paso.

Ahora el estado vive en un almacén único fuera de las rutas. GlobalTimer mantiene la sincronización por deadline, el bloqueo de pantalla opcional y los controles flotantes. Los pasos solo editan y controlan ese estado. Se mantiene un único temporizador activo; abrir otro paso no lo sustituye. La sesión conserva el plazo al recargar.

La señal breve se sustituye por una sirena de frecuencia alternante repetida cada 2,5 segundos. Silenciar y cerrar detiene tanto los osciladores en curso como las repeticiones. Cancelar, reiniciar o editar el temporizador terminado también detiene la alarma.

## Validación
- Auditoría estática: 49 comprobaciones.
- TypeScript, Pages Functions y build Vite.
- Pruebas de regresión móvil/escritorio: pasos, cambio de ruta, recarga, pausa, reanudación, cancelación, finalización fuera de la ficha, repetición de sonido y silencio.
- Las pruebas verifican la creación repetida de osciladores, no el volumen físico de un teléfono.

## Límites
El volumen multimedia del dispositivo y las restricciones del navegador siguen aplicando. No se garantiza sonido puntual si el sistema suspende o cierra la app. El plazo se recalcula al volver a una app suspendida.

Solo rama reconcile/baseline-2026-09-21 y preview de Cloudflare. Sin cambios en main ni producción. PR #16 permanece en borrador.
