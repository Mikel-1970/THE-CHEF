export type MealType = 'Desayuno' | 'Brunch' | 'Comida' | 'Merienda' | 'Cena';
export type Difficulty = 'Fácil' | 'Media' | 'Avanzada';
export type DishClassification = 'Con lo que tienes' | 'Te falta muy poco' | 'Buena opción si compras algunas cosas';

export type IngredientInput = {
  name: string;
  quantity?: number;
  unit?: string;
  priority?: boolean;
};

export type CookingRequest = {
  mode: 'pantry' | 'desire';
  servings: number;
  mealType?: MealType;
  maxMinutes?: number;
  style?: string;
  cuisine?: string;
  difficulty?: Difficulty;
  maxExtraPurchases?: 0 | 1 | 2 | 3;
  pantryIngredients?: IngredientInput[];
  pantryBasics?: string[];
  desireText?: string;
};

export type Proposal = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  minutes: number;
  difficulty: Difficulty;
  classification: DishClassification;
  usedIngredients: string[];
  missingIngredients: string[];
  reason: string;
  recipeId: string;
};

export type RecipeIngredient = {
  name: string;
  quantity: number;
  unit: string;
  section?: string;
  scalingMode: 'linear' | 'discrete' | 'culinary' | 'fixed';
  optional?: boolean;
};

export type RecipeStep = {
  number: number;
  instruction: string;
  minutes?: number;
  temperatureC?: number;
  cue?: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  baseServings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  mealType: MealType;
  style: string;
  cuisine: string;
  ingredients: RecipeIngredient[];
  miseEnPlace: string[];
  steps: RecipeStep[];
  criticalPoints: string[];
  substitutions: string[];
  storage: string;
  nutritionPerServing: {
    kcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
};

export type HistoryEntry = {
  id: string;
  createdAt: string;
  label: string;
  mode: CookingRequest['mode'];
};
