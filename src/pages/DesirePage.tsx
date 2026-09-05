import { Check, ChevronDown, ChevronUp, Clock3, Mic, MicOff, Sparkles, Star, Trash2, UsersRound, WandSparkles, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { CuisineSelect } from '../components/CuisineSelect';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { CookingRequest, Difficulty, IngredientInput } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { getAllRecipes } from '../services/recipeCatalog';
import { interpretDesireText } from '../services/requestInterpreter';
import { parseIngredientInput } from '../utils/ingredientInput';
import '../voice-input.css';

const defaultSuggestions = ['Algo italiano', 'Pollo', 'Pasta', 'Algo rápido', 'Algo ligero'];
const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];
const ingredientSignals = ['Pollo', 'Pasta', 'Arroz', 'Huevos', 'Garbanzos', 'Tomate', 'Calabacín'];
const cuisinePhrases: Record<string, string> = { Española: 'Algo español', Mediterránea: 'Algo mediterráneo', Italiana: 'Algo italiano', Francesa: 'Algo francés', Mexicana: 'Algo mexicano', Japonesa: 'Algo japonés', China: 'Algo chino', Asiática: 'Algo asiático', India: 'Algo indio' };

export function DesirePage() {
  const navigate = useNavigate();
  const { settings, favorites, history, setSearch } = useApp();
  const [text, setText] = useState('');
  const [ingredients, setIngredients] = useState<IngredientInput[]>(() => settings.pantryStock ?? []);
  const [ingredientDraft, setIngredientDraft] = useState('');
  const [usePantry, setUsePantry] = useState((settings.pantryStock?.length ?? 0) > 0);
  const [servings, setServings] = useState(settings.defaultServings);
  const [servingsTouched, setServingsTouched] = useState(false);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [timeTouched, setTimeTouched] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [style, setStyle] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);
  const [isSearching, setIsSearching] = useState(false);

  const requestVoice = useAiDictation(transcript => setText(current => appendSentence(current, transcript)));
  const ingredientVoice = useAiDictation(transcript => setIngredientDraft(current => appendIngredientDictation(current, transcript)));
  const suggestions = useMemo(() => buildSuggestions(favorites, history.map(entry => entry.label)), [favorites, history]);

  const confirmRequest = () => {
    requestVoice.stop();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  const addIngredient = (e?: FormEvent) => {
    e?.preventDefault();
    ingredientVoice.stop();
    const entries = splitIngredientEntries(ingredientDraft);
    if (!entries.length) return;
    setIngredients(current => mergeIngredientEntries(current, entries));
    setIngredientDraft('');
    setUsePantry(true);
  };

  const search = async () => {
    if (isSearching) return;
    const interpreted = interpretDesireText(text);
    const request: CookingRequest = {
      mode: usePantry ? 'pantry' : 'desire',
      servings: servingsTouched ? servings : interpreted.servings ?? servings,
      maxMinutes: timeTouched ? maxMinutes : interpreted.maxMinutes ?? maxMinutes,
      desireText: text,
      style: style ?? interpreted.style,
      cuisine: cuisine ?? interpreted.cuisine,
      difficulty: difficulty ?? interpreted.difficulty,
      pantryIngredients: usePantry ? ingredients : [],
      pantryBasics: usePantry ? settings.pantryBasics : [],
      pantryPolicy: usePantry ? 'prioritize' : 'ignore'
    };

    setIsSearching(true);
    try {
      const result = await getHybridProposals(request);
      setSearch(request, result.proposals.slice(0, 2));
      navigate('/propuestas');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="¡OÍDO COCINA!" title="¿Qué quieres que te prepare?" />
      <div className="page-content">
        <section className="editorial-card desire-intro olive-intro"><span className="eyebrow">PÍDELO A TU MANERA</span><h2>Dime qué te apetece.</h2><p>Puedes pedir un plato concreto, un tipo de comida o dejar que El Chef te sorprenda.</p></section>

        <section className="form-section">
          <div className="section-label"><span>¿Qué quieres que prepare?</span></div>
          <div className="desire-box">
            <WandSparkles size={22} />
            <textarea rows={5} value={text} onChange={e => setText(e.target.value)} placeholder="Ej. prepárame una paella con pollo; o un postre de chocolate; o algo nuevo y rápido…" />
            <div className="voice-action-stack">
              <button type="button" className="clear-input-button" onClick={() => { requestVoice.stop(); setText(''); }} disabled={!text.trim() && !requestVoice.isListening} aria-label="Borrar o cancelar petición"><X size={18} /></button>
              <button type="button" className={`voice-button ${requestVoice.isListening ? 'listening' : ''}`} onClick={requestVoice.toggle} disabled={!requestVoice.isSupported || requestVoice.isTranscribing} aria-label={requestVoice.isListening ? 'Detener dictado' : 'Dictar petición'}>{requestVoice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
              <button type="button" className="voice-confirm-button" onClick={confirmRequest} disabled={!text.trim() || requestVoice.isTranscribing} aria-label="Confirmar petición"><Check size={19} /></button>
            </div>
          </div>
          {requestVoice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… pulsa el micrófono o ✓ cuando termines.</div>}
          {requestVoice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado con IA…</div>}
          {requestVoice.error && <div className="voice-status error">{requestVoice.error}</div>}
          <div className="suggestion-row">{suggestions.map(s => <button key={s} onClick={() => setText(s)}>{s}</button>)}</div>
        </section>

        <section className="form-section">
          <div className="section-label"><span>Productos que tienes</span><small>Opcional · ★ principal/prioritario</small></div>
          <form className="ingredient-input" onSubmit={addIngredient}>
            <input value={ingredientDraft} onChange={e => setIngredientDraft(e.target.value)} placeholder="Ej. pollo 300 g, 4 huevos, arroz…" />
            <button type="button" className="clear-input-button" onClick={() => { ingredientVoice.stop(); setIngredientDraft(''); }} disabled={!ingredientDraft.trim() && !ingredientVoice.isListening} aria-label="Borrar o cancelar productos"><X size={18} /></button>
            <button type="button" className={`voice-button ${ingredientVoice.isListening ? 'listening' : ''}`} onClick={ingredientVoice.toggle} disabled={!ingredientVoice.isSupported || ingredientVoice.isTranscribing} aria-label={ingredientVoice.isListening ? 'Detener dictado' : 'Dictar productos'}>{ingredientVoice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
            <button type="submit" className="voice-confirm-button" disabled={!ingredientDraft.trim() || ingredientVoice.isTranscribing} aria-label="Confirmar y añadir productos"><Check size={19} /></button>
          </form>
          {ingredientVoice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando la lista de productos…</div>}
          {ingredientVoice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Separando e interpretando ingredientes con IA…</div>}
          {ingredientVoice.error && <div className="voice-status error">{ingredientVoice.error}</div>}
          <div className="ingredient-pills">
            {ingredients.map((item, index) => (
              <div className={`ingredient-pill ${item.priority ? 'priority' : ''}`} key={`${item.name}-${index}`}>
                <button className="star-toggle" onClick={() => setIngredients(ingredients.map((x, i) => i === index ? { ...x, priority: !x.priority } : x))} aria-label="Marcar como principal"><Star size={15} fill={item.priority ? 'currentColor' : 'none'} /></button>
                <span>{item.name}{item.quantity !== undefined ? ` · ${formatIngredientQuantity(item)}` : ''}</span>
                <button onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))} aria-label="Eliminar"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="advanced-panel" style={{ marginTop: 12 }}>
            <div className="advanced-group"><strong>¿Quieres que aproveche lo que tienes?</strong><div className="chip-row"><Chip selected={usePantry} onClick={() => setUsePantry(true)}>Sí, aprovéchalo</Chip><Chip selected={!usePantry} onClick={() => setUsePantry(false)}>No, sorpréndeme</Chip></div></div>
          </div>
          {usePantry && <div className="pantry-basics-note"><span>Básicos activos:</span> {settings.pantryBasics.join(' · ') || 'ninguno'} <button onClick={() => navigate('/nevera')}>Abrir despensa</button></div>}
        </section>

        <section className="control-card">
          <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={value => { setServingsTouched(true); setServings(value); }} /></div>
          <div className="divider" />
          <div className="control-row"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>También puedes escribirlo</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={value => { setTimeTouched(true); setMaxMinutes(value); }} /></div>
        </section>

        <button className="advanced-toggle" onClick={() => setAdvanced(v => !v)}><span>Más opciones</span>{advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
        {advanced && <section className="advanced-panel"><div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{RECIPE_STYLES.map(v => <Chip key={v} selected={style === v} onClick={() => setStyle(style === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Tipo de cocina</strong><CuisineSelect value={cuisine} onChange={setCuisine} /></div><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(v => <Chip key={v} selected={difficulty === v} onClick={() => setDifficulty(difficulty === v ? undefined : v)}>{v}</Chip>)}</div></div></section>}

        <div className="helper-note"><Sparkles size={17} /> El Chef combina tu petición con lo que tienes solo cuando se lo indicas. La búsqueda inicial muestra 2 propuestas para responder más rápido.</div>
        <div className="sticky-action"><PrimaryButton onClick={search} disabled={!text.trim() || isSearching}>{isSearching ? 'Consultando al Chef…' : 'Buscar 2 propuestas'}</PrimaryButton></div>
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
      if (parsed.quantity !== undefined) next[existingIndex] = { ...next[existingIndex], quantity: parsed.quantity, unit: parsed.unit };
      return;
    }
    next.push(parsed);
  });
  return next;
}

function splitIngredientEntries(value: string): string[] {
  return value.replace(/\bademás\b/gi, ',').split(/[,;\n]+|\s+(?:y|e)\s+/i).map(item => item.replace(/^[.\-–—\s]+|[.\s]+$/g, '').trim()).filter(Boolean);
}
function appendSentence(current: string, transcript: string): string { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}${/[.!?…]$/.test(base) ? ' ' : '. '}${clean}` : clean; }
function appendIngredientDictation(current: string, transcript: string): string { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}, ${clean}` : clean; }
function formatIngredientQuantity(item: IngredientInput): string { if (item.quantity === undefined) return ''; const value = Number.isInteger(item.quantity) ? String(item.quantity) : item.quantity.toLocaleString('es-ES', { maximumFractionDigits: 1 }); return `${value}${item.unit ? ` ${item.unit}` : ''}`; }
function buildSuggestions(favoriteIds: string[], historyLabels: string[]): string[] { const suggestions: string[] = []; const recipes = getAllRecipes(); const push = (value?: string) => { if (value && !suggestions.some(existing => existing.toLocaleLowerCase('es') === value.toLocaleLowerCase('es'))) suggestions.push(value); }; favoriteIds.forEach(id => { const recipe = recipes.find(item => item.id === id); if (!recipe) return; push(cuisinePhrases[recipe.cuisine] ?? recipe.cuisine); if (recipe.style === 'Rápida') push('Algo rápido'); if (recipe.style === 'Saludable') push('Algo saludable'); if (recipe.style === 'Casera') push('Cocina casera'); if (recipe.style === 'Moderna') push('Algo moderno'); ingredientSignals.forEach(signal => { if (recipe.ingredients.some(ingredient => normalize(ingredient.name).includes(normalize(signal)))) push(signal); }); }); historyLabels.forEach(label => { const normalized = normalize(label); ingredientSignals.forEach(signal => { if (normalized.includes(normalize(signal))) push(signal); }); Object.entries(cuisinePhrases).forEach(([cuisine, phrase]) => { if (normalized.includes(normalize(cuisine))) push(phrase); }); if (normalized.includes('rapid')) push('Algo rápido'); if (normalized.includes('salud')) push('Algo saludable'); }); defaultSuggestions.forEach(push); return suggestions.slice(0, 5); }
function normalize(value: string): string { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
