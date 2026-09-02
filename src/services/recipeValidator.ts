import type { Recipe } from '../domain/types';

export type RecipeValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

const backgroundIngredients = ['sal', 'pimienta', 'aceite', 'aceite de oliva', 'agua'];

export function validateRecipe(recipe: Recipe): RecipeValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!recipe.id.trim()) errors.push('La receta no tiene identificador.');
  if (!recipe.title.trim()) errors.push('La receta no tiene nombre.');
  if (!Number.isFinite(recipe.baseServings) || recipe.baseServings <= 0) errors.push('El número base de comensales no es válido.');
  if (!Number.isFinite(recipe.prepMinutes) || recipe.prepMinutes < 0) errors.push('El tiempo de preparación no es válido.');
  if (!Number.isFinite(recipe.cookMinutes) || recipe.cookMinutes < 0) errors.push('El tiempo de cocción no es válido.');
  if (!recipe.ingredients.length) errors.push('La receta no tiene ingredientes.');
  if (!recipe.steps.length) errors.push('La receta no tiene elaboración.');

  recipe.ingredients.forEach((ingredient, index) => {
    if (!ingredient.name.trim()) errors.push(`El ingrediente ${index + 1} no tiene nombre.`);
    if (!Number.isFinite(ingredient.quantity) || ingredient.quantity <= 0) errors.push(`La cantidad de ${ingredient.name || `ingrediente ${index + 1}`} no es válida.`);
    if (!ingredient.unit.trim()) errors.push(`${ingredient.name || `Ingrediente ${index + 1}`} no tiene unidad.`);
  });

  const stepNumbers = recipe.steps.map(step => step.number);
  const expectedNumbers = recipe.steps.map((_, index) => index + 1);
  if (stepNumbers.some((number, index) => number !== expectedNumbers[index])) {
    errors.push('Los pasos de elaboración no están numerados de forma consecutiva.');
  }

  recipe.steps.forEach(step => {
    if (!step.instruction.trim()) errors.push(`El paso ${step.number} no contiene instrucciones.`);
    if (step.minutes !== undefined && (!Number.isFinite(step.minutes) || step.minutes <= 0)) {
      errors.push(`El tiempo del paso ${step.number} no es válido.`);
    }
    if (step.temperatureC !== undefined && (step.temperatureC < 0 || step.temperatureC > 350)) {
      errors.push(`La temperatura del paso ${step.number} está fuera de un rango culinario razonable.`);
    }
  });

  const totalDeclared = recipe.prepMinutes + recipe.cookMinutes;
  const totalSteps = recipe.steps.reduce((sum, step) => sum + (step.minutes ?? 0), 0);
  if (totalDeclared > 0 && totalSteps > totalDeclared * 1.75 + 10) {
    warnings.push('La suma de tiempos de los pasos es muy superior al tiempo total declarado.');
  }

  const duplicatedIngredients = findDuplicates(recipe.ingredients.map(ingredient => normalize(ingredient.name)));
  if (duplicatedIngredients.length) warnings.push(`Hay ingredientes repetidos: ${duplicatedIngredients.join(', ')}.`);

  const instructions = normalize([
    ...recipe.miseEnPlace,
    ...recipe.steps.map(step => step.instruction)
  ].join(' '));

  const unused = recipe.ingredients
    .filter(ingredient => !ingredient.optional)
    .filter(ingredient => !backgroundIngredients.includes(normalize(ingredient.name)))
    .filter(ingredient => !ingredientMentioned(ingredient.name, instructions))
    .map(ingredient => ingredient.name);

  if (unused.length) warnings.push(`Conviene revisar si se utilizan estos ingredientes: ${unused.join(', ')}.`);
  if (!recipe.criticalPoints.length) warnings.push('La receta no incluye puntos críticos de ejecución.');
  if (!recipe.storage.trim()) warnings.push('La receta no incluye indicaciones de conservación.');

  const nutritionValues = Object.values(recipe.nutritionPerServing);
  if (nutritionValues.some(value => !Number.isFinite(value) || value < 0)) {
    errors.push('Los valores nutricionales contienen datos no válidos.');
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.filter(recipe => validateRecipe(recipe).valid);
}

function ingredientMentioned(name: string, instructions: string): boolean {
  const normalizedName = normalize(name);
  if (instructions.includes(normalizedName)) return true;
  const significantWords = normalizedName.split(/\s+/).filter(word => word.length >= 5);
  return significantWords.some(word => instructions.includes(word));
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  values.forEach(value => {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  });
  return [...duplicates];
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
