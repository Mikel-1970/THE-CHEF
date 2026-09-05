import type { CookingRequest, Difficulty, DishClassification, Proposal, Recipe } from '../domain/types';

const API_URL = (import.meta.env.VITE_RECIPE_API_URL || 'https://nrtmmepynzczfdddvohh.supabase.co/functions/v1').trim().replace(/\/+$/, '');
const API_KEY = (import.meta.env.VITE_RECIPE_API_KEY || 'sb_publishable_b08-tfZCh2pEBGK0lBH-1g_oB3RwvV8').trim();

const SUGGEST_TIMEOUT_MS = 65_000;
const GENERATE_TIMEOUT_MS = 120_000;
const PROPOSAL_COUNT = 2;

export function isAiProposalApiConfigured() {
  return Boolean(API_URL && API_KEY);
}

export async function fetchAiProposals(request: CookingRequest): Promise<Proposal[]> {
  const payload = await postJson('/recipes/suggest', { request }, SUGGEST_TIMEOUT_MS);
  const items = isRecord(payload) && Array.isArray(payload.proposals) ? payload.proposals : [];
  return items.map(toProposal).filter((item): item is Proposal => Boolean(item)).slice(0, PROPOSAL_COUNT);
}

export async function generateAiRecipe(request: CookingRequest, proposal: Proposal): Promise<Recipe> {
  const payload = await postJson('/recipes/generate', { request, proposal }, GENERATE_TIMEOUT_MS);
  const candidates = isRecord(payload) && Array.isArray(payload.recipes) ? payload.recipes : [];
  const candidate = candidates.find(item => isRecord(item) && isRecord(item.source) && item.source.kind === 'ai');
  if (!candidate) {
    throw new Error('La IA no ha devuelto una receta completa utilizable.');
  }
  // La normalización y validación definitiva se hacen al registrarla en recipeCatalog.
  return candidate as Recipe;
}

async function postJson(path: string, body: unknown, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) throw new Error(describeError(response.status, payload));
    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(path.endsWith('/suggest')
        ? 'La IA ha superado el tiempo máximo de respuesta. Puedes repetir la búsqueda.'
        : 'La IA ha tardado demasiado en completar la receta. Puedes volver a intentarlo sin repetir la búsqueda.');
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function toProposal(value: unknown): Proposal | undefined {
  if (!isRecord(value)) return undefined;
  const difficulty = asDifficulty(value.difficulty);
  const classification = asClassification(value.classification);
  if (!text(value.id) || !text(value.title) || !text(value.subtitle) || !text(value.emoji) || !number(value.minutes) || !difficulty || !text(value.reason)) return undefined;
  return {
    id: value.id.trim(),
    title: value.title.trim(),
    subtitle: value.subtitle.trim(),
    emoji: value.emoji.trim(),
    minutes: value.minutes,
    difficulty,
    classification,
    usedIngredients: strings(value.usedIngredients),
    missingIngredients: strings(value.missingIngredients),
    insufficientIngredients: strings(value.insufficientIngredients),
    substitutionNotes: strings(value.substitutionNotes),
    reason: value.reason.trim(),
    recipeId: text(value.recipeId) ? value.recipeId.trim() : value.id.trim()
  };
}

function describeError(status: number, payload: unknown) {
  const data = isRecord(payload) ? payload : {};
  const code = typeof data.errorCode === 'string' ? data.errorCode : undefined;
  const message = typeof data.errorMessage === 'string' ? data.errorMessage : undefined;
  if (status === 429) return 'La API de OpenAI no tiene cuota disponible ahora mismo.';
  if (status === 401 || status === 403) return `La IA ha rechazado la autenticación${code ? ` (${code})` : ''}.`;
  if (status >= 500) return `La IA ha tenido un fallo temporal${code ? ` (${code})` : ''}. Puedes repetir la búsqueda.`;
  if (message) return `La generación con IA ha fallado${code ? ` (${code})` : ''}: ${sanitize(message)}`;
  return `La generación con IA ha fallado (error ${status}).`;
}

function sanitize(message: string) {
  return message.replace(/sk-[A-Za-z0-9_-]+/g, 'sk-…').slice(0, 180);
}

function asDifficulty(value: unknown): Difficulty | undefined {
  return value === 'Fácil' || value === 'Media' || value === 'Avanzada' ? value : undefined;
}

function asClassification(value: unknown): DishClassification | undefined {
  return value === 'Con lo que tienes' || value === 'Te falta muy poco' || value === 'Buena opción si compras algunas cosas' ? value : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(text).map(item => item.trim()).filter(Boolean) : [];
}

function text(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value.trim());
}

function number(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
