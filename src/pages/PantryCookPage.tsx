import { Check, ChevronDown, ChevronUp, Clock3, Mic, MicOff, Sparkles, Star, UsersRound, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { Chip } from '../components/Chip';
import { CuisineSelect } from '../components/CuisineSelect';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { CookingRequest, Difficulty, IngredientInput } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { parseIngredientInput } from '../utils/ingredientInput';
import '../voice-input.css';

const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];

export function PantryCookPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, setSearch } = useApp();
  const pantry = settings.pantryStock ?? [];
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [draft, setDraft] = useState('');
  const [servings, setServings] = useState(settings.defaultServings);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [advanced, setAdvanced] = useState(false);
  const [style, setStyle] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);
  const [isSearching, setIsSearching] = useState(false);
  const voice = useAiDictation(transcript => setDraft(current => appendDictation(current, transcript)));
  const sortedPantry = useMemo(() => [...pantry].sort((a, b) => a.name.localeCompare(b.name, 'es')), [pantry]);

  const toggle = (name: string) => setSelected(current => {
    const next = new Set(current); const key = normalize(name);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const addIngredient = (event?: FormEvent) => {
    event?.preventDefault();
    if (voice.isListening) voice.stop();
    const entries = splitIngredientEntries(draft);
    if (!entries.length) return;
    updateSettings({ pantryStock: mergeIngredientEntries(pantry, entries) });
    setSelected(current => new Set([...current, ...entries.map(entry => normalize(parseIngredientInput(entry).name)).filter(Boolean)]));
    setDraft('');
  };

  const search = async () => {
    const chosen = pantry.filter(item => selected.has(normalize(item.name))).map(item => ({ ...item, priority: true }));
    if (!chosen.length || isSearching) return;
    const request: CookingRequest = { mode: 'pantry', servings, maxMinutes, style, cuisine, difficulty, pantryIngredients: chosen, pantryBasics: settings.pantryBasics, pantryPolicy: 'prioritize' };
    setIsSearching(true);
    try { const result = await getHybridProposals(request); setSearch(request, result.proposals.slice(0, 3)); navigate('/propuestas'); }
    finally { setIsSearching(false); }
  };

  return (
    <AppShell>
      <ChefLoadingOverlay active={isSearching} title="Cocinando con tu despensa" messages={['Buscando la mejor combinación…']} />
      <TopBar eyebrow="COCINA CON LO QUE TIENES" title="Elige tus productos" />
      <div className="page-content nav-safe">
        <section className="editorial-card olive-intro"><span className="eyebrow">TU DESPENSA</span><h2>¿Qué quieres utilizar?</h2><p>Selecciona uno o varios productos. El Chef añadirá solo lo necesario para construir recetas coherentes.</p></section>
        <section className="form-section">
          <div className="section-label"><span>Productos disponibles</span><small>{selected.size} seleccionados</small></div>
          <div className="pantry-choice-grid">{sortedPantry.map(item => { const active = selected.has(normalize(item.name)); return <button type="button" className={active ? 'selected' : ''} aria-pressed={active} onClick={() => toggle(item.name)} key={item.name}><Star size={16} fill={active ? 'currentColor' : 'none'} /><span>{item.name}{item.quantity !== undefined ? ` · ${formatIngredientQuantity(item)}` : ''}</span></button>; })}</div>
          {!pantry.length && <div className="pantry-basics-note">Tu despensa está vacía. Añade productos escribiendo o usando el micrófono.</div>}
          <form className="ingredient-input pantry-add-input" onSubmit={addIngredient}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Añadir otro producto…" /><button type="button" className="clear-input-button" onClick={() => { voice.stop(); setDraft(''); }} disabled={!draft.trim() && !voice.isListening} aria-label="Borrar"><X size={18} /></button><button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar productos'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button><button type="submit" className="voice-confirm-button" disabled={!draft.trim() || voice.isListening || voice.isTranscribing} aria-label="Añadir productos"><Check size={19} /></button></form>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando productos…</div>}{voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}{voice.error && <div className="voice-status error">{voice.error}</div>}
        </section>
        <section className="control-card"><div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={setServings} /></div><div className="divider" /><div className="control-row"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Tiempo total</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={setMaxMinutes} /></div></section>
        <button className="advanced-toggle" onClick={() => setAdvanced(value => !value)}><span>Más opciones</span>{advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
        {advanced && <section className="advanced-panel"><div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{RECIPE_STYLES.map(value => <Chip key={value} selected={style === value} onClick={() => setStyle(style === value ? undefined : value)}>{value}</Chip>)}</div></div><div className="advanced-group"><strong>Tipo de cocina</strong><CuisineSelect value={cuisine} onChange={setCuisine} /></div><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(value => <Chip key={value} selected={difficulty === value} onClick={() => setDifficulty(difficulty === value ? undefined : value)}>{value}</Chip>)}</div></div></section>}
        <div className="sticky-action"><PrimaryButton onClick={() => void search()} disabled={!selected.size || isSearching}>{isSearching ? 'Buscando propuestas…' : 'Cocinar con estos productos'}</PrimaryButton></div>
      </div>
    </AppShell>
  );
}

function mergeIngredientEntries(current: IngredientInput[], entries: string[]) { const next = [...current]; entries.forEach(entry => { const parsed = parseIngredientInput(entry); if (!parsed.name) return; const index = next.findIndex(item => normalize(item.name) === normalize(parsed.name)); if (index >= 0) next[index] = { ...next[index], ...parsed }; else next.push(parsed); }); return next; }
function splitIngredientEntries(value: string) { return value.replace(/\bademás\b/gi, ',').split(/[,;\n]+|\s+(?:y|e)\s+/i).map(item => item.replace(/^[.\-–—\s]+|[.\s]+$/g, '').trim()).filter(Boolean); }
function appendDictation(current: string, transcript: string) { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}, ${clean}` : clean; }
function formatIngredientQuantity(item: IngredientInput) { if (item.quantity === undefined) return ''; const value = Number.isInteger(item.quantity) ? String(item.quantity) : item.quantity.toLocaleString('es-ES', { maximumFractionDigits: 1 }); return `${value}${item.unit ? ` ${item.unit}` : ''}`; }
function normalize(value: string) { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
