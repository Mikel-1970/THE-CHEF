import type { Difficulty } from '../domain/types';

type InterpretedDesire = {
  servings?: number;
  maxMinutes?: number;
  cuisine?: string;
  style?: string;
  difficulty?: Difficulty;
};

const cuisineSignals: Array<{ cuisine: string; signals: string[] }> = [
  { cuisine: 'Española', signals: ['espanola', 'espanol'] },
  { cuisine: 'Mediterránea', signals: ['mediterranea', 'mediterraneo'] },
  { cuisine: 'Italiana', signals: ['italiana', 'italiano'] },
  { cuisine: 'Francesa', signals: ['francesa', 'frances'] },
  { cuisine: 'Portuguesa', signals: ['portuguesa', 'portugues'] },
  { cuisine: 'Griega', signals: ['griega', 'griego'] },
  { cuisine: 'Mexicana', signals: ['mexicana', 'mexicano'] },
  { cuisine: 'Peruana', signals: ['peruana', 'peruano'] },
  { cuisine: 'Japonesa', signals: ['japonesa', 'japones'] },
  { cuisine: 'China', signals: ['china', 'chino'] },
  { cuisine: 'Asiática', signals: ['asiatica', 'asiatico'] },
  { cuisine: 'Tailandesa', signals: ['tailandesa', 'tailandes'] },
  { cuisine: 'India', signals: ['india', 'indio'] },
  { cuisine: 'Árabe / Oriente Medio', signals: ['arabe', 'oriente medio'] },
  { cuisine: 'Estadounidense', signals: ['estadounidense', 'americana', 'americano'] }
];

export function interpretDesireText(text: string): InterpretedDesire {
  const normalized = normalize(text);
  const interpreted: InterpretedDesire = {};

  interpreted.servings = parseServings(normalized);
  interpreted.maxMinutes = parseTime(normalized);
  interpreted.cuisine = cuisineSignals.find(item => item.signals.some(signal => normalized.includes(signal)))?.cuisine;
  interpreted.style = parseStyle(normalized);
  interpreted.difficulty = parseDifficulty(normalized);

  return interpreted;
}

function parseServings(text: string): number | undefined {
  const somos = text.match(/\bsomos\s+(\d{1,2})\b/);
  if (somos) return clamp(Number(somos[1]), 1, 20);

  const para = text.match(/\bpara\s+(\d{1,2})\s*(?:personas?|comensales?)\b/);
  if (para) return clamp(Number(para[1]), 1, 20);
  return undefined;
}

function parseTime(text: string): number | undefined {
  const minutes = text.match(/(?:menos de|maximo|max|hasta|en)\s*(\d{1,3})\s*(?:min|minuto|minutos)\b/);
  if (minutes) return clamp(Number(minutes[1]), 15, 120);

  const hours = text.match(/(?:menos de|maximo|max|hasta|en)?\s*(\d+(?:[.,]\d+)?)\s*(?:h|hora|horas)\b/);
  if (hours) return clamp(Math.round(Number(hours[1].replace(',', '.')) * 60), 15, 120);
  return undefined;
}

function parseStyle(text: string): string | undefined {
  if (/(rapida|rapido|poco tiempo|sin complicarme)/.test(text)) return 'Rápida';
  if (/(saludable|ligera|ligero|sana|sano)/.test(text)) return 'Saludable';
  if (/(casera|casero|tradicional)/.test(text)) return 'Casera';
  if (/(moderna|moderno|creativa|creativo)/.test(text)) return 'Moderna';
  return undefined;
}

function parseDifficulty(text: string): Difficulty | undefined {
  if (/(facil|sencilla|sencillo|simple)/.test(text)) return 'Fácil';
  if (/(avanzada|avanzado|dificil|elaborada|elaborado)/.test(text)) return 'Avanzada';
  if (/(media|intermedia|intermedio)/.test(text)) return 'Media';
  return undefined;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
