# El Chef · PWA V0.3

Versión privada de validación de la app de recetas. Esta entrega adopta la dirección visual adjudicada: **marfil cálido + verde oliva + mostaza**, con fotografías integradas en los dos accesos principales.

## Qué incluye

- PWA instalable en iPhone/Android cuando se publica por HTTPS.
- Inicio rediseñado con identidad **El Chef**.
- Modos principales:
  - **¿Qué tenemos por ahí?** · Abre la nevera.
  - **¿Qué te apetece hoy?** · El Chef se encarga.
- 3 propuestas por búsqueda.
- Motor local de recomendación con puntuación por:
  - ingredientes disponibles;
  - ingredientes prioritarios;
  - básicos de despensa;
  - compras adicionales;
  - tiempo;
  - tipo de comida;
  - estilo;
  - cocina;
  - dificultad.
- Botón **Dame otras 3** funcional.
- Filtros opcionales de estilo, cocina y dificultad.
- Básicos de despensa configurables.
- Preferencia local de comensales, nivel de cocina y picante.
- Recetas estructuradas, escalado, mise en place, elaboración y Modo Cocina.
- Favoritos e historial guardados en `localStorage`.
- Sin Supabase y sin API de IA: **esta versión no genera costes de uso**.

## Probarla en el ordenador

Necesitas Node.js instalado.

En PowerShell, dentro de la carpeta del proyecto:

```powershell
npm.cmd install
npm.cmd run dev
```

Vite mostrará una dirección similar a:

```text
http://localhost:5173
```

Ábrela en el navegador.

## Generar versión de producción

```powershell
npm.cmd run build
```

Se genera la carpeta:

```text
dist
```

## Publicar en GitHub Pages

El proyecto conserva el workflow de GitHub Actions en:

```text
.github/workflows/deploy.yml
```

Flujo recomendado:

1. Crea un repositorio de GitHub para la app.
2. Sube todos los archivos del proyecto.
3. En GitHub entra en **Settings → Pages**.
4. Configura **Source: GitHub Actions**.
5. Abre la pestaña **Actions** y comprueba que el despliegue finaliza correctamente.
6. GitHub mostrará la URL pública de la PWA.

Esta V0.3 no contiene claves API ni datos privados.

## Instalar en iPhone como PWA

Una vez publicada por HTTPS:

1. Abre la URL con **Safari**.
2. Pulsa **Compartir**.
3. Selecciona **Añadir a pantalla de inicio**.
4. Confirma **El Chef**.

Aparecerá con su propio icono y se abrirá en modo aplicación.

## Qué NO incluye todavía

- Supabase.
- Usuarios.
- Sincronización entre dispositivos.
- OpenAI/API de IA.
- Imágenes generadas dinámicamente para cada propuesta.
- Búsqueda web culinaria.
- Nutrición conectada a una base oficial.

Los datos nutricionales actuales forman parte de las recetas simuladas y sirven solo para validar la interfaz.

## Próxima fase recomendada

Cuando la V0.3 esté validada en uso real personal:

1. crear proyecto Supabase gratuito;
2. mover recetas/ingredientes de mock a datos estructurados;
3. crear una capa segura de backend para IA;
4. conectar generación real de propuestas;
5. conectar generación estructurada de recetas;
6. incorporar imágenes dinámicas;
7. medir coste real por operación antes de abrir la beta a usuarios.

La interfaz no debería necesitar rehacerse para realizar esos cambios: el objetivo de V0.3 es cerrar ya la base de producto y UX.
