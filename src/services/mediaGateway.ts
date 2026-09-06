import type { Recipe } from '../domain/types';

const API_URL = (import.meta.env.VITE_RECIPE_API_URL || 'https://nrtmmepynzczfdddvohh.supabase.co/functions/v1').trim().replace(/\/+$/, '');
const API_KEY = (import.meta.env.VITE_RECIPE_API_KEY || 'sb_publishable_b08-tfZCh2pEBGK0lBH-1g_oB3RwvV8').trim();
const IMAGE_CACHE = 'chef-recipe-images-v1';
const THUMBNAIL_CACHE = 'chef-recipe-thumbnails-v1';

export type DishEvaluation = {
  score: number;
  verdict: 'excelente' | 'muy_bien' | 'bien' | 'mejorable';
  summary: string;
  strengths: string[];
  improvements: string[];
};

export async function getRecipeImage(recipe: Recipe): Promise<string | undefined> {
  const cacheKey = imageRequest(recipe.id);
  if ('caches' in window) {
    const cache = await caches.open(IMAGE_CACHE);
    const hit = await cache.match(cacheKey);
    if (hit) {
      const blob = await hit.blob();
      await cacheThumbnailBlob(recipe.id, blob);
      return URL.createObjectURL(blob);
    }
  }

  const response = await fetch(`${API_URL}/chef-media/image`, {
    method: 'POST',
    headers: headers('application/json'),
    body: JSON.stringify({
      recipe: {
        title: recipe.title,
        description: recipe.description,
        cuisine: recipe.cuisine,
        style: recipe.style,
        ingredients: recipe.ingredients.map(item => ({ name: item.name }))
      }
    })
  });
  const payload = await response.json().catch(() => undefined);
  if (!response.ok) throw new Error(readError(payload, 'No se ha podido generar la imagen.'));

  if (payload?.imageBase64) {
    const blob = base64ToBlob(payload.imageBase64, payload.mimeType || 'image/webp');
    if ('caches' in window) {
      const cache = await caches.open(IMAGE_CACHE);
      await cache.put(cacheKey, new Response(blob, { headers: { 'Content-Type': blob.type } }));
      await cacheThumbnailBlob(recipe.id, blob);
    }
    return URL.createObjectURL(blob);
  }
  if (typeof payload?.imageUrl === 'string') return payload.imageUrl;
  return undefined;
}

export async function getRecipeThumbnail(recipeId: string): Promise<string | undefined> {
  if (!('caches' in window)) return undefined;
  const cache = await caches.open(THUMBNAIL_CACHE);
  const hit = await cache.match(thumbnailRequest(recipeId));
  if (!hit) return undefined;
  return URL.createObjectURL(await hit.blob());
}

export async function saveRecipeThumbnail(recipeId: string, imageUrl: string): Promise<void> {
  if (!('caches' in window) || !imageUrl) return;
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  await cacheThumbnailBlob(recipeId, blob);
}

export async function transcribeCookingAudio(audio: Blob): Promise<string> {
  const form = new FormData();
  const extension = audio.type.includes('mp4') ? 'm4a' : audio.type.includes('ogg') ? 'ogg' : 'webm';
  form.append('audio', audio, `dictado.${extension}`);

  const response = await fetch(`${API_URL}/chef-media/transcribe`, {
    method: 'POST',
    headers: headers(),
    body: form
  });
  const payload = await response.json().catch(() => undefined);
  if (!response.ok) throw new Error(readError(payload, 'No se ha podido transcribir el audio.'));
  if (typeof payload?.text !== 'string' || !payload.text.trim()) throw new Error('La transcripción ha llegado vacía.');
  return payload.text.trim();
}

export async function evaluateDishPhoto(recipe: Recipe, file: File): Promise<{ evaluation: DishEvaluation; previewUrl: string }> {
  const { base64, mimeType, previewUrl } = await prepareDishImage(file);
  const response = await fetch(`${API_URL}/chef-media/evaluate-dish`, {
    method: 'POST',
    headers: headers('application/json'),
    body: JSON.stringify({
      imageBase64: base64,
      mimeType,
      recipe: {
        title: recipe.title,
        description: recipe.description,
        style: recipe.style,
        cuisine: recipe.cuisine,
        criticalPoints: recipe.criticalPoints,
        steps: recipe.steps.map(step => ({ instruction: step.instruction, cue: step.cue }))
      }
    })
  });
  const payload = await response.json().catch(() => undefined);
  if (!response.ok) throw new Error(readError(payload, 'No se ha podido valorar la foto final.'));
  const evaluation = payload?.evaluation as DishEvaluation | undefined;
  if (!evaluation || typeof evaluation.score !== 'number' || typeof evaluation.summary !== 'string') throw new Error('La valoración visual no ha llegado completa.');
  return { evaluation, previewUrl };
}

async function prepareDishImage(file: File): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('No se ha podido leer la fotografía.'));
      element.src = sourceUrl;
    });
    const maxSide = 1280;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se ha podido preparar la fotografía.');
    context.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', .82);
    return { base64: dataUrl.slice(dataUrl.indexOf(',') + 1), mimeType: 'image/jpeg', previewUrl: dataUrl };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

async function cacheThumbnailBlob(recipeId: string, blob: Blob) {
  if (!('caches' in window)) return;
  const cache = await caches.open(THUMBNAIL_CACHE);
  await cache.put(thumbnailRequest(recipeId), new Response(blob, { headers: { 'Content-Type': blob.type || 'image/jpeg' } }));
}

function imageRequest(recipeId: string) { return new Request(`https://the-chef.local/generated-images/${encodeURIComponent(recipeId)}`); }
function thumbnailRequest(recipeId: string) { return new Request(`https://the-chef.local/recipe-thumbnails/${encodeURIComponent(recipeId)}`); }

function headers(contentType?: string): HeadersInit {
  return {
    ...(contentType ? { 'Content-Type': contentType } : {}),
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`
  };
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

function readError(payload: any, fallback: string): string {
  const message = payload?.message || payload?.errorMessage;
  return typeof message === 'string' && message.trim() ? message.trim().slice(0, 180) : fallback;
}
