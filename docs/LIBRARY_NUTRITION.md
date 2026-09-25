# Estimaciones nutricionales de la biblioteca

Las 170 recetas se calculan por ingredientes, sin consultas de IA en ejecución. No son resultados de laboratorio ni planes nutricionales personalizados.

## Fuentes

- Public Health England, **CoFID 2021**, tabla 1.3 Proximates: https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid . Open Government Licence v3.0; atribución a Public Health England. Descarga verificada 2026-09-25.
- USDA, **SR Legacy 2018**, descarga CSV oficial: https://fdc.nal.usda.gov/download-datasets/ . Se usa para ingredientes no cubiertos o sin macronutrientes completos en CoFID. Descarga verificada 2026-09-25.
- SHA-256 XLSX CoFID: `436e9445ef2adb2a75f3d7edd51302de3adad25385f9795fc94ba58bd030e97d`.
- SHA-256 ZIP USDA: `b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0`.

`src/data/library/nutrition-ingredients.json` conserva las filas de nutrientes utilizadas, sus identificadores oficiales, nombres originales, unidades de referencia y aproximaciones. No se sustituye un nutriente desconocido por cero; la generación falla si faltan calorías, proteínas, hidratos o grasas. Los valores Tr de CoFID se interpretan como trazas, aproximadas a cero.

## Método reproducible

Por ingrediente: cantidad comestible / 100 × nutrientes de su alimento de referencia. Se suman los ingredientes y se divide entre las raciones base de la receta. `node scripts/calculate-library-nutrition.mjs --check` reproduce y verifica los 170 resultados; sin `--check` actualiza recetas y auditoría.

Las cantidades en gramos se toman de la formulación. Para unidades se usan pesos comestibles estimados expresos (huevo 50 g, yema 17 g, ajo 3 g, etc.). Para mililitros se usa densidad estimada 1 g/ml salvo aceite 0,92, leche 1,03 y sirope simple 1,23. Las bebidas alcohólicas CoFID se expresan por 100 ml, no por 100 g.

Se aplican fracciones comestibles estimadas cuando el peso incluye conchas, huesos o espinas. Las filas CoFID que ya incluyen el peso con hueso no se corrigen dos veces. Se excluyen ingredientes opcionales. Para el aceite de inmersión en frituras se estiman **10 g absorbidos por ración**, limitados al aceite disponible: es una hipótesis orientativa, no una medición. La tortilla y las patatas bravas se incluyen expresamente en esta regla; el aceite de pilpil o de repostería se incorpora completo. El alcohol de cocina se conserva íntegro en el cálculo porque no se dispone de datos de evaporación de cada preparación.

Los equivalentes genéricos de marcas, variedades y preparaciones se identifican como aproximaciones. Por ejemplo, licores genéricos para bebidas de marca, panceta curada como equivalente de guanciale, queso duro para pecorino y formulación 70% patata / 30% harina para ñoquis. No deben interpretarse como análisis de un producto comercial concreto. La base de hidratos de CoFID y USDA puede diferir; los resultados se redondean en pantalla y no se publican como etiquetado alimentario.

No se publican fibra, sodio ni micronutrientes porque su cobertura no es completa. Los decimales guardados solo permiten reproducir el cálculo; la interfaz muestra valores redondeados. La nutrición por ración parte de la formulación base; el escalado culinario puede modificar las proporciones.

`docs/LIBRARY_NUTRITION_AUDIT.json` permite comprobar para cada receta la cantidad computada, las fuentes y los resultados. La ficha y el PDF explican estas limitaciones. Estas estimaciones quedan separadas del futuro plan nutricional semanal.
