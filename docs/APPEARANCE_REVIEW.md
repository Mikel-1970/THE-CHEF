# Revisión visual: entrada, navegación, receta y ajustes

- Collage gastronómico original generado para The Chef, sin texto ni marcas, integrado como fondo decorativo con velo marfil.
- Entrada de 3,5 segundos y aparición lateral del avatar; respeta movimiento reducido y permite Entrar ahora. Usuario autenticado recibe saludo al abrir Inicio una vez por sesión de pestaña, sin nuevo registro.
- Avatar fijo arriba a la derecha; ajustes dentro de su menú. Volver permanece arriba a la izquierda.
- Ficha con fotografía arriba de 208 px frente a los 260 px anteriores (20 % menos de altura), título y contenido debajo.
- Editar perfil, salida explícita, temas claro/oscuro/automático persistidos y cambio automático con el sistema.
- Acerca de: comentarios mediante compartir/copiar del dispositivo, valoración local de beta, compartir enlace privado y eliminación confirmada de datos locales. No se simula publicación en tiendas ni eliminación de la cuenta Cloudflare.

Validación: 45 comprobaciones de auditoría, tipos de funciones y compilación correctos. Regresión inicial: 60 casos correctos y 2 afectados por el cambio de duración/alineación, corregidos y revalidados; tanda de entrada/apariencia 22/22, última tanda de apariencia 6/6 tras ajuste de contraste. 64 casos distintos cubiertos entre tandas. Capturas revisadas en escritorio y móvil; compartir y cerrar sesión reales no ejecutados para conservar la sesión del usuario.

Solo rama reconcile/baseline-2026-09-21 y preview privada; sin cambios en main o producción.
