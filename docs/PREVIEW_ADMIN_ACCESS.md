# Cuenta administradora de pruebas y enlace persistente

Estado: implementación local validada; correo administrador confirmado por el usuario. Configuración preview aplicada; despliegue pendiente de verificación remota.

## Problema y resultado
El alta anterior era local al origen y la sesión a la pestaña. Cada URL inmutable nueva parecía una cuenta nueva.
La preview privada ahora usa la identidad verificada de Cloudflare Access para aprovisionar automáticamente el perfil administrador de Mikel, sin contraseña adicional ni registro local. El correo autorizado se define exclusivamente en configuración de servidor.

Enlace de uso habitual: https://reconcile-baseline-2026-09-2.the-chef-private-preview.pages.dev/
El alias se actualiza con cada despliegue de reconcile/baseline-2026-09-21. Los enlaces inmutables siguen disponibles para trazabilidad, pero no son la dirección habitual de pruebas.

## Implementación y seguridad
- Pages Function GET /api/session verifica firma RS256, issuer, audience, expiración, subject y correo en Cf-Access-Jwt-Assertion usando jose y las claves públicas del dominio Access configurado.
- No confía en cabeceras de correo sin firma, flags de localStorage, rol recibido del navegador ni registro de la primera persona que entre.
- Solo el correo configurado obtiene role=admin. Respuesta private/no-store; no expone JWT ni crea credenciales propias.
- Configuración ausente: 503. Aserción ausente/inválida: 401. Otro correo validado: 403.
- Las compilaciones Cloudflare no ofrecen registro local como alternativa si falla la validación. Las compilaciones locales/GitHub mantienen el flujo beta anterior.
- Cliente comprueba la sesión al abrir y al volver a la pestaña, y retira el contenido al vencer la sesión. No guarda un indicador de administrador persistente como autoridad.
- Perfil conserva avatar y preferencias del navegador en la dirección fija. Ajustes identifica el rol, enlaza la dirección fija y permite cerrar sesión mediante Access.
- Se omiten los avisos de introducción repetidos para esta identidad de pruebas. Guía y permisos manuales siguen accesibles.
- No se amplían políticas de Access ni su duración (24 h), ni se toca main/producción. Se añaden variables solo al entorno preview. El valor de plataforma fail_open se conserva: Cloudflare exige que coincida en producción y preview. El endpoint y el cliente deniegan acceso si no pueden validar la identidad; Access permanece activo.
- No se crea una base de datos, proveedor de autenticación nuevo ni cuenta con permisos administrativos en Supabase/Cloudflare. El rol es el administrador de esta aplicación de pruebas; no implica un panel de gestión de otros usuarios.

## Persistencia y límites
La cuenta es reconocida desde servidor en cada visita con Access válido, incluso sin datos locales. Avatar, recetas y preferencias siguen guardados por origen/navegador; no se sincronizan entre dispositivos ni se migran desde URLs antiguas. Usar siempre el enlace fijo conserva esos datos entre despliegues.
Cloudflare puede solicitar verificación de correo al caducar su sesión. No es necesario repetir el registro de The Chef ni definir otra contraseña.

## Verificación
45 comprobaciones estáticas, compilación TypeScript/Vite y typecheck de Functions. 48 pruebas Playwright: 32 ejecuciones de flujos en escritorio/móvil emulado y 16 ejecuciones de 8 casos de servidor.
Casos nuevos: entrada sin almacenamiento previo, administrador visible, avatar tras recarga y nueva pestaña, rechazo pese a flag local falsificado, expiración; firma válida/inválida, correo ajeno, issuer/audience erróneos, token caducado, falta de exp/sub/JWT y configuración ausente.
Verificación del despliegue y de la sesión real se registra en el informe local de entrega.

Referencias: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/ y https://developers.cloudflare.com/pages/configuration/preview-deployments/.
