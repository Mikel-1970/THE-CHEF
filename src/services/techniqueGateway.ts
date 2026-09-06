const API_URL = (import.meta.env.VITE_RECIPE_API_URL || 'https://nrtmmepynzczfdddvohh.supabase.co/functions/v1').trim().replace(/\/+$/, '');
const API_KEY = (import.meta.env.VITE_RECIPE_API_KEY || 'sb_publishable_b08-tfZCh2pEBGK0lBH-1g_oB3RwvV8').trim();
const TIMEOUT_MS = 90_000;

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

export async function generateTechnique(request: string): Promise<Technique> {
  const clean = request.trim();
  if (!clean) throw new Error('Indica qué técnica o elaboración quieres preparar.');
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_URL}/recipes/technique`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ request: clean }),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(describeError(response.status, payload));
    if (!isRecord(payload) || !isRecord(payload.technique)) throw new Error('El Chef no ha devuelto una técnica utilizable.');
    return normalizeTechnique(payload.technique);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('El Chef ha tardado demasiado en preparar la técnica. Puedes repetirlo.');
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function normalizeTechnique(value: Record<string, any>): Technique {
  const now = new Date().toISOString();
  const title = text(value.title) || 'Técnica culinaria';
  return {
    id: text(value.id) || `tech-${Date.now().toString(36)}-${slug(title)}`,
    title,
    description: text(value.description),
    category: text(value.category) || 'Técnica',
    timeMinutes: positiveNumber(value.timeMinutes) || 1,
    difficulty: value.difficulty === 'Media' || value.difficulty === 'Avanzada' ? value.difficulty : 'Fácil',
    equipment: strings(value.equipment),
    ingredients: Array.isArray(value.ingredients) ? value.ingredients.filter(isRecord).map(item => ({
      name: text(item.name),
      quantity: finiteNumber(item.quantity),
      unit: text(item.unit) || undefined,
      optional: Boolean(item.optional)
    })).filter(item => item.name) : [],
    steps: Array.isArray(value.steps) ? value.steps.filter(isRecord).map((item, index) => ({
      number: positiveNumber(item.number) || index + 1,
      instruction: text(item.instruction),
      minutes: finiteNumber(item.minutes),
      temperatureC: finiteNumber(item.temperatureC),
      cue: text(item.cue) || undefined
    })).filter(item => item.instruction) : [],
    criticalPoints: strings(value.criticalPoints),
    storage: text(value.storage),
    uses: strings(value.uses),
    createdAt: text(value.createdAt) || now
  };
}

function describeError(status: number, payload: unknown) {
  const data = isRecord(payload) ? payload : {};
  const message = text(data.errorMessage);
  if (status === 429) return 'La API de OpenAI no tiene cuota disponible ahora mismo.';
  if (status === 401 || status === 403) return 'La IA ha rechazado la autenticación.';
  if (message) return message.slice(0, 180);
  return status >= 500 ? 'El Chef ha tenido un fallo temporal. Puedes repetirlo.' : `No se ha podido generar la técnica (error ${status}).`;
}

function slug(value: string) { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 36) || 'tecnica'; }
function text(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }
function strings(value: unknown): string[] { return Array.isArray(value) ? value.map(text).filter(Boolean) : []; }
function finiteNumber(value: unknown): number | undefined { return typeof value === 'number' && Number.isFinite(value) ? value : undefined; }
function positiveNumber(value: unknown): number | undefined { const n = finiteNumber(value); return n !== undefined && n > 0 ? n : undefined; }
function isRecord(value: unknown): value is Record<string, any> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
