# Módulo de plan de comidas aplazado — 2026-09-25

Retirado de la aplicación activa por decisión del usuario. No hay accesos, menciones visibles ni importación de MealPlanPage en App.tsx. Los dos enlaces antiguos redirigen a Inicio con replace para evitar un bucle de navegación.

Se conservan MealPlanPage.tsx y su CSS, los servicios mealPlan/aiMealPlan/mealPlanSession, planBreakfasts y las pruebas tests/meal-plan.deferred.ts como base de una futura ampliación. No hay activación mediante ajustes ni bandera pública. Las pruebas diferidas no forman parte de la suite activa: requieren rediseño y revisión antes de reactivar.

Se mantiene la compatibilidad de los productos previamente añadidos a la lista de compra; no se borran datos existentes ni copias cifradas descargadas.

Portada recuperada: botón principal grande «¿Qué quieres que te prepare?» y debajo «Abre la despensa» y «Foto Receta». Marca Chef Voldi y funciones ajenas al módulo conservadas.
