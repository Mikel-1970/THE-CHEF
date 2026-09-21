# R1-03 — Presentación y avatares definitivos

Fecha: 2026-09-21. Repositorio: Mikel-1970/THE-CHEF.
Rama exclusiva: reconcile/baseline-2026-09-21.
Base remota: afd79810653dbf4cdc33ceeb76a8acbd9c6d85bc.
Main antes de publicar: 74879ee24722e1b6fdf488a3d16ae7a2c6280443.

## Comportamiento

- Primera entrada sin sesión: logo The Chef, El Chef por defecto, animación breve y transición automática a los 2500 ms.
- Entrar ahora permite omitir la espera; el avatar no es un control.
- Acceso conserva usuario, contraseña, registro, recuperación, permisos y tutorial; botón principal Entrar.
- Una sesión ya autenticada continúa directamente a la ruta solicitada.
- La selección previa de avatar se lee de los ajustes existentes; un valor ausente o desconocido usa El Chef.
- prefers-reduced-motion elimina animaciones manteniendo acceso automático.
- Se fuerza una nueva sección al cambiar entre acceso/registro/recuperación para impedir que el observador de traducciones restaure etiquetas del modo anterior.

## Recursos

16 PNG originales extraídos de los dos ZIP de la conversación Revisiones The Chef, sin regeneración ni recorte. Todos 1122 x 1402 y canal alfa con valores 0–255. Mapeo, nombres de origen y SHA256 en R1_03_AVATAR_MANIFEST.json. Se mantienen los identificadores internos para conservar preferencias guardadas. Las imágenes se muestran completas con object-fit:contain, sin gorro superpuesto adicional.

## Verificación local

- npm run validate: auditoría de 45 comprobaciones y TypeScript/Vite.
- npx playwright test: 14 casos sobre el build, Chromium escritorio y móvil emulado. Incluye duración 2–3 s, transición, salto manual, registro, contraseña inválida/válida, permisos, tutorial, avatar elegido, sesión existente, 16 imágenes, movimiento reducido, valor desconocido y ausencia de solapamiento de personaje/texto.
- Capturas de presentación y acceso revisadas en ambos tamaños.
- npm audit --omit=dev --audit-level=critical: 0 vulnerabilidades.
- La primera ejecución detectó etiquetas antiguas en Registro y la inspección visual detectó desbordamiento del PNG; ambos corregidos antes de publicar.

## Despliegue

Destino autorizado: the-chef-private-preview. Configuración remota comprobada antes de publicar: producción deshabilitada, previews limitadas a la rama candidata y Access sobre *.the-chef-private-preview.pages.dev con allow únicamente para meguiluz@ingitech.com, sin bypass.
La URL inmutable y el resultado remoto se registran al concluir el despliegue; este documento no los presupone.
No se modifica main ni se publica producción. Se conserva intacta la copia chef-preview con cambios locales de otra tarea.

## Límites

Las pruebas móviles son emuladas; no acreditan dispositivos físicos ni cierran el gate F2.4. Persistencia de avatar y credenciales sigue siendo local al origen: una URL inmutable nueva no comparte localStorage con la preview anterior. No se modifica el sistema provisional de autenticación.
