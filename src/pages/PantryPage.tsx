import { FormEvent, useMemo, useState } from 'react';
import { Check, Mic, MicOff, Sparkles, Star, Trash2, X } from 'lucide-react';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { TopBar } from '../components/TopBar';
import type { IngredientInput } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { parseIngredientInput } from '../utils/ingredientInput';
import '../voice-input.css';

export function PantryPage() {
  const { settings, updateSettings } = useApp();
  const [draft, setDraft] = useState('');
  const ingredients = settings.pantryStock ?? [];
  const basics = settings.pantryBasics ?? [];
  const voice = useAiDictation(transcript => setDraft(current => appendDictation(current, transcript)));

  const sortedIngredients = useMemo(
    () => [...ingredients].sort((a, b) => Number(Boolean(b.priority)) - Number(Boolean(a.priority)) || a.name.localeCompare(b.name, 'es')),
    [ingredients]
  );

  const addIngredient = (e?: FormEvent) => {
    e?.preventDefault();
    if (voice.isListening) voice.stop();
    const entries = splitIngredientEntries(draft);
    if (!entries.length) return;
    const next = mergeIngredientEntries(ingredients, entries);
    updateSettings({ pantryStock: next });
    setDraft('');
  };

  const togglePriority = (name: string) => {
    updateSettings({ pantryStock: ingredients.map(item => normalize(item.name) === normalize(name) ? { ...item, priority: !item.priority } : item) });
  };

  const removeIngredient = (name: string) => {
    updateSettings({ pantryStock: ingredients.filter(item => normalize(item.name) !== normalize(name)) });
  };

  const clearDraft = () => { voice.stop(); setDraft(''); };

  return (
    <AppShell>
      <TopBar eyebrow="TU COCINA" title="Despensa" />
      <div className="page-content nav-safe">
        <section className="editorial-card olive-intro">
          <span className="eyebrow">LO QUE TIENES EN CASA</span>
          <h2>Guarda aquí tus productos habituales.</h2>
          <p>El Chef podrá utilizarlos cuando le pidas que aproveche lo que tienes. Las cantidades son opcionales y nunca se inventan.</p>
        </section>

        <section className="form-section">
          <div className="section-label"><span>Productos disponibles</span><small>★ = priorizar</small></div>
          <form className="ingredient-input" onSubmit={addIngredient}>
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ej. pollo 300 g, huevos, arroz…" />
            <button type="button" className="clear-input-button" onClick={clearDraft} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button>
            <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar productos'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
            <button type="submit" className="voice-confirm-button" disabled={!draft.trim() || voice.isListening || voice.isTranscribing} aria-label="Confirmar productos"><Check size={19} /></button>
          </form>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… toca de nuevo cuando termines.</div>}
          {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado con IA…</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}

          <div className="ingredient-pills">
            {sortedIngredients.map(item => (
              <div className={`ingredient-pill ${item.priority ? 'priority' : ''}`} key={item.name}>
                <button className="star-toggle" onClick={() => togglePriority(item.name)} aria-label="Cambiar prioridad"><Star size={15} fill={item.priority ? 'currentColor' : 'none'} /></button>
                <span>{item.name}{item.quantity !== undefined ? ` · ${formatIngredientQuantity(item)}` : ''}</span>
                <button onClick={() => removeIngredient(item.name)} aria-label="Eliminar"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          {!ingredients.length && <div className="pantry-basics-note">Todavía no has guardado productos. Puedes añadirlos ahora o introducirlos directamente al pedir una receta.</div>}
        </section>

        <section className="editorial-card">
          <span className="eyebrow">BÁSICOS DE DESPENSA</span>
          <h2>Productos que damos por disponibles</h2>
          <p>{basics.join(' · ') || 'No hay básicos configurados.'}</p>
          <small>Puedes editarlos desde Perfil. Se consideran básicos habituales, no ingredientes prioritarios.</small>
        </section>
      </div>
    </AppShell>
  );
}

function mergeIngredientEntries(current: IngredientInput[], entries: string[]): IngredientInput[] {
  const next = [...current];
  entries.forEach(entry => {
    const parsed = parseIngredientInput(entry);
    if (!parsed.name) return;
    const existingIndex = next.findIndex(item => normalize(item.name) === normalize(parsed.name));
    if (existingIndex >= 0) {
      next[existingIndex] = { ...next[existingIndex], ...parsed, priority: next[existingIndex].priority };
      return;
    }
    next.push(parsed);
  });
  return next;
}

function splitIngredientEntries(value: string): string[] {
  return value
    .replace(/\bademás\b/gi, ',')
    .split(/[,;\n]+|\s+(?:y|e)\s+/i)
    .map(item => item.replace(/^[.\-–—\s]+|[.\s]+$/g, '').trim())
    .filter(Boolean);
}

function appendDictation(current: string, transcript: string): string {
  const base = current.trimEnd();
  const clean = transcript.trim();
  return base ? `${base}, ${clean}` : clean;
}

function formatIngredientQuantity(item: IngredientInput): string {
  if (item.quantity === undefined) return '';
  const value = Number.isInteger(item.quantity) ? String(item.quantity) : item.quantity.toLocaleString('es-ES', { maximumFractionDigits: 1 });
  return `${value}${item.unit ? ` ${item.unit}` : ''}`;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
