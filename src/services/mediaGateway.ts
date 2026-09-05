import type { Recipe } from '../domain/types';

const API_URL = (import.meta.env.VITE_RECIPE_API_URL || 'https://nrtmmepynzczfdddvohh.supabase.co/functions/v1').trim().replace(/\/+$/, '');
const API_KEY = (import.meta.env.VITE_RECIPE_API_KEY || 'sb_publishable_b08-tfZCh2pEBGK0lBH-1g_oB3RwvV8').trim();
const IMAGE_CACHE = 'chef-recipe-images-v1';

export async function getRecipeImage(recipe: Recipe): Promise<string | undefined> {
  const cacheKey = new Request(`https://the-chef.local/generated-images/${encodeURIComponent(recipe.id)}`);
  if ('caches' in window) {
    const cache = await caches.open(IMAGE_CACHE);
    const hit = await cache.match(cacheKey);
    if (hit) return URL.createObjectURL(await hit.blob());
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
    }
    return URL.createObjectURL(blob);
  }
  if (typeof payload?.imageUrl === 'string') return payload.imageUrl;
  return undefined;
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
