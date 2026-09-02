# Backend de recetas de The Chef

La PWA publicada en GitHub Pages no debe contener claves privadas. Toda consulta a IA, buscadores, blogs o APIs de recetas debe pasar por un backend propio.

## Variable pública del frontend

```env
VITE_RECIPE_API_URL=https://backend.example.com
```

Esta URL puede ser pública. Las claves privadas deben residir únicamente en el backend.

## Endpoints esperados

### `POST /recipes/recommend`

Entrada:

```json
{
  "request": {
    "mode": "pantry",
    "servings": 4,
    "maxMinutes": 40,
    "pantryIngredients": [
      { "name": "Pollo", "quantity": 400, "unit": "g", "priority": true }
    ],
    "pantryBasics": ["Sal", "Aceite de oliva"]
  }
}
```

Salida:

```json
{
  "recipes": []
}
```

### `POST /recipes/search`

Entrada:

```json
{
  "filters": {
    "query": "pasta con tomate",
    "cuisine": "Italiana",
    "style": "Casera",
    "difficulty": "Fácil",
    "maxMinutes": 45
  }
}
```

Salida:

```json
{
  "recipes": []
}
```

## Requisitos de cada receta externa

La respuesta debe respetar el tipo `Recipe` definido en `src/domain/types.ts` e incluir `source`:

```json
{
  "source": {
    "kind": "web",
    "label": "Nombre de la fuente",
    "publisher": "Sitio o autor",
    "url": "https://...",
    "retrievedAt": "2026-09-02T22:00:00Z",
    "adapted": true
  }
}
```

Para recetas generadas por IA, `kind` debe ser `ai`.

## Reglas del backend

1. Nunca devolver texto web copiado como receta final sin normalizarlo.
2. Usar las fuentes externas como evidencia e inspiración culinaria, no como única autoridad.
3. Normalizar ingredientes, unidades, cantidades, tiempos y pasos al esquema de The Chef.
4. Diferenciar receta tradicional, adaptación y reinterpretación.
5. Conservar URL y editor de la fuente cuando se haya usado una fuente web concreta.
6. No inventar una cantidad disponible del usuario si no la ha indicado.
7. Mantener las restricciones, ingredientes prioritarios y número de comensales del usuario.
8. El frontend volverá a validar estructuralmente las recetas antes de incorporarlas al catálogo.
9. Ante fallo de IA, búsqueda o red, responder con error controlado; el frontend usará el catálogo local.

## Seguridad

- Claves de OpenAI, motores de búsqueda, Supabase `service_role` u otros proveedores: solo backend.
- No usar variables `VITE_*` para secretos: Vite las inserta en el JavaScript público.
- Aplicar límites de uso por usuario cuando se implemente autenticación y monetización.
- Registrar proveedor, latencia, coste aproximado y fuentes consultadas para poder auditar calidad y gasto.
