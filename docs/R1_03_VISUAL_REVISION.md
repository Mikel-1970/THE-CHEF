# Revisión visual de acceso, petición y navegación

Rama: reconcile/baseline-2026-09-21. Destino: the-chef-private-preview. Sin cambios en main, producción, permisos Access o backend.

## Cambios
- Acceso integrado conservado: logo y personaje, aparición progresiva del formulario a los 2,5 segundos, botón Entrar.
- Registro en orden: nombre, selector visual de 16 avatares, correo y contraseña. El Chef por defecto; elección persistida y bienvenida con nombre al regresar. Se mantiene el acceso local provisional de beta, sin crear un sistema de cuentas remotas.
- Petición simplificada: título, «Con una frase basta», campo de texto y botones borrar, micrófono y confirmar. Retiradas sugerencias y textos repetidos.
- Dictado solo mediante pulsación explícita: iniciar, parar con el mismo botón, revisar transcripción y confirmar. Permiso denegado mantiene escritura disponible. Se liberan pistas al salir; no se solicita audio automáticamente.
- Opciones con iconos, negrita, separadores y desplegables homogéneos. Comensales y minutos mantienen sus contadores. Restricciones admite varias selecciones y exclusión libre. Eliminados producto principal, técnica y utensilios de esta pantalla. Chile para picante.
- Una propuesta en petición y despensa, también al refrescar. Petición al servicio con count=1 y directiva singular; respuesta acotada a una. El servicio remoto no se despliega ni modifica. El porcentaje IA se redondea a una única plaza: 0–40 catálogo, 50–100 IA, con fallback local.
- Volver arriba a la izquierda en pantallas interiores; perfil/ajustes arriba a la derecha. Avatar flotante en todas las pantallas de la aplicación, arrastrable y con posición guardada. Menú de iconos en colores crema/oliva; incluye inicio, cocinar, despensa, foto, favoritas, recetas, inventario, compra, búsqueda, técnicas y guía.
- Corregida la traducción de nodos dinámicos para no restaurar etiquetas antiguas cuando cambia el estado del micrófono o de un control.

## Verificación
- npm run validate: 45 comprobaciones estáticas y compilación TypeScript/Vite correctas.
- Playwright: 26 pruebas de navegador, escritorio y móvil emulado. Acceso integrado/temporización, 16 PNG cargados, registro/correo/avatar/bienvenida, contraseña incorrecta/correcta, persistencia, sesión existente, movimiento reducido y tarjetas iniciales.
- Nuevas pruebas: sin micrófono automático; inicio/parada/transcripción simulada/confirmación; permiso denegado; opciones conservadas en petición; count=1 y una tarjeta incluso ante respuesta de dos; refresco singular; avatar fijo al hacer scroll, arrastre sin abrir menú accidentalmente, navegación, ajustes y volver, presencia en biblioteca/técnicas.
- Capturas inspeccionadas en escritorio y móvil: formulario simplificado, opciones, menú, registro con avatares.
- Micrófono y respuesta IA simulados en las pruebas: no acreditan audio físico en Safari/iPhone ni generación IA real. No se cierra el gate de dispositivos.
- Access remoto comprobado: wildcard del proyecto con una política allow para el propietario, sin bypass. Producción deshabilitada; previews solo de la rama candidata.
- La URL inmutable y el commit desplegado se anotan en el informe local de entrega tras confirmar éxito remoto.

Persistencia de perfil, contraseña y avatar es local al origen: una nueva URL inmutable no comparte esos datos con la anterior.
