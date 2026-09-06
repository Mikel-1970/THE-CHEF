import type { Technique } from './techniqueGateway';

const STORAGE_KEY = 'the-chef.techniques.v1';

export function getSavedTechniques(): Technique[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isTechnique) : [];
  } catch {
    return [];
  }
}

export function saveTechnique(technique: Technique): Technique[] {
  const current = getSavedTechniques();
  const next = [technique, ...current.filter(item => item.id !== technique.id)].slice(0, 60);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeTechnique(id: string): Technique[] {
  const next = getSavedTechniques().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function isTechnique(value: unknown): value is Technique {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Partial<Technique>;
  return typeof item.id === 'string' && typeof item.title === 'string' && Array.isArray(item.steps) && Array.isArray(item.ingredients);
}
