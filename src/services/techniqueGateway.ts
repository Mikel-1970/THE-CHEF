const API_URL = (import.meta.env.VITE_RECIPE_API_URL || 'https://nrtmmepynzczfdddvohh.supabase.co/functions/v1').trim().replace(/\/+$/, '');
const API_KEY = (import.meta.env.VITE_RECIPE_API_KEY || 'sb_publishable_b08-tfZCh2pEBGK0lBH-1g_oB3RwvV8').trim();
const TIMEOUT_MS = 120_000;

export type TechniqueIngredient = {
  name: string;
  quantity?: number;
  unit?: string;
  optional?: boolean;
};

export type TechniqueStep = {
  number: number;
  instruction: string;
  minutes?: number;
  temperatureC?: number;
  cue?: string;
};

export type Technique = {
  id: string;
  title: string;
  description: string;
  category: string;
  timeMinutes: number;
  difficulty: 'Fácil' | 'Media' | 'Avanzada';
  equipment: string[];
  ingredients: TechniqueIngredient[];
  steps: TechniqueStep[];
  criticalPoints: string[];
  storage: string;
  uses: string[];
  createdAt: string;
};

const techniqueTemplate = {
  id: 'technique-template',
  title: 'Plantilla de técnica culinaria',
  description: 'Plantilla interna para crear una elaboración parcial reutilizable.',
  emoji: '🧪',
  baseServings: 4,
  prepMinutes: 5,
  cookMinutes: 5,
  difficulty: 'Fácil',
  mealType: 'Comida',
  style: 'Técnica',
  cuisine: 'Internacional',
  ingredients: [
    { name: 'ingrediente principal', quantity: 100, unit: 'g', section: 'Base', scalingMode: 'linear', optional: false },
    { name: 'agua', quantity: 100, unit: 'ml', section: 'Base', scalingMode: 'culinary', optional: true },
    { name: 'sal', quantity: 1, unit: 'g', section: 'Ajuste', scalingMode: 'culinary', optional: true }
  ],
  miseEnPlace: ['Preparar el material necesario.'],
  steps: [
    { number: 1, instruction: 'Preparar la base de la técnica.', minutes: 5, temperatureC: null, cue: 'La preparación debe quedar homogénea.' },
    { number: 2, instruction: 'Finalizar y comprobar el punto.', minutes: 5, temperatureC: null, cue: 'Debe quedar lista para reutilizar.' }
  ],
  criticalPoints: ['Controlar el punto final.'],
  substitutions: ['Indicar usos compatibles de la técnica terminada.'],
  storage: 'Conservar según seguridad alimentaria.',
  nutritionPerServing: { kcal: 1, proteinG: 0, carbsG: 0, fatG: 0 },
  source: { kind: 'ai', label: 'OpenAI · The Chef · técnica', retrievedAt: new Date().toISOString(), adapted: true }
};

export async function generateTechnique(request: string): Promise<Technique> {
  const clean = request.trim();
  if (!clean) throw new Error('Indica qué técnica o elaboración quieres preparar.');
  const instruction = `Convierte esta plantilla en una TÉCNICA CULINARIA REUTILIZABLE, no en un plato completo. La petición exacta del usuario es: "${clean}". El título debe nombrar la técnica. Usa ingredientes y cantidades precisas cuando proceda, pasos cronológicos, temperaturas, tiempos, señales de punto y puntos críticos. En miseEnPlace enumera principalmente utensilios o preparación previa. En substitutions escribe exclusivamente ejemplos de uso de esta técnica dentro de otras recetas. Mantén la ficha práctica y profesional.`;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_URL}/recipes/revise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ recipe: techniqueTemplate, instruction, servings: 4 }),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(describeError(response.status, payload));
    const recipe = isRecord(payload) && Array.isArray(payload.recipes) ? payload.recipes.find(isRecord) : undefined;
    if (!recipe) throw new Error('El Chef no ha devuelto una técnica utilizable.');
    return fromRecipe(recipe);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('El Chef ha tardado demasiado en preparar la técnica. Puedes repetirlo.');
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function fromRecipe(recipe: Record<string, any>): Technique {
  const title = text(recipe.title) || 'Técnica culinaria';
  const prep = finiteNumber(recipe.prepMinutes) ?? 0;
  const cook = finiteNumber(recipe.cookMinutes) ?? 0;
  return {
    id: `tech-${Date.now().toString(36)}-${slug(title)}`,
    title,
    description: text(recipe.description),
    category: inferCategory(title),
    timeMinutes: Math.max(1, prep + cook),
    difficulty: recipe.difficulty === 'Media' || recipe.difficulty === 'Avanzada' ? recipe.difficulty : 'Fácil',
    equipment: strings(recipe.miseEnPlace),
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.filter(isRecord).map(item => ({
      name: text(item.name),
      quantity: finiteNumber(item.quantity),
      unit: text(item.unit) || undefined,
      optional: Boolean(item.optional)
    })).filter(item => item.name) : [],
    steps: Array.isArray(recipe.steps) ? recipe.steps.filter(isRecord).map((item, index) => ({
      number: positiveNumber(item.number) || index + 1,
      instruction: text(item.instruction),
      minutes: finiteNumber(item.minutes),
      temperatureC: finiteNumber(item.temperatureC),
      cue: text(item.cue) || undefined
    })).filter(item => item.instruction) : [],
    criticalPoints: strings(recipe.criticalPoints),
    storage: text(recipe.storage),
    uses: strings(recipe.substitutions),
    createdAt: new Date().toISOString()
  };
}

function inferCategory(title: string) {
  const value = normalize(title);
  if (value.includes('aceite')) return 'Aceites';
  if (value.includes('salsa')) return 'Salsas';
  if (value.includes('fondo') || value.includes('caldo')) return 'Fondos';
  if (value.includes('marinad') || value.includes('macerad')) return 'Marinados';
  if (value.includes('esfer') || value.includes('caviar')) return 'Esferificaciones';
  if (value.includes('confit')) return 'Confitados';
  if (value.includes('baja temperatura')) return 'Baja temperatura';
  if (value.includes('encurt')) return 'Encurtidos';
  return 'Técnica';
}

function describeError(status: number, payload: unknown) {
  const data = isRecord(payload) ? payload : {};
  const message = text(data.errorMessage);
  if (status === 429) return 'La API de OpenAI no tiene cuota disponible ahora mismo.';
  if (status === 401 || status === 403) return 'La IA ha rechazado la autenticación.';
  if (message) return message.slice(0, 180);
  return status >= 500 ? 'El Chef ha tenido un fallo temporal. Puedes repetirlo.' : `No se ha podido generar la técnica (error ${status}).`;
}

function normalize(value: string) { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
function slug(value: string) { return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 36) || 'tecnica'; }
function text(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }
function strings(value: unknown): string[] { return Array.isArray(value) ? value.map(text).filter(Boolean) : []; }
function finiteNumber(value: unknown): number | undefined { return typeof value === 'number' && Number.isFinite(value) ? value : undefined; }
function positiveNumber(value: unknown): number | undefined { const n = finiteNumber(value); return n !== undefined && n > 0 ? n : undefined; }
function isRecord(value: unknown): value is Record<string, any> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
