import { ChevronDown, ChevronUp, Clock3, Mic, MicOff, Plus, Sparkles, Star, Trash2, UsersRound, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { CuisineSelect } from '../components/CuisineSelect';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { Difficulty, IngredientInput } from '../domain/types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { parseIngredientInput } from '../utils/ingredientInput';
import '../voice-input.css';

const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];

export function PantryPage() {
  const navigate = useNavigate();
  const { settings, setSearch } = useApp();
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: 'Pollo', priority: true },
    { name: 'Arroz' },
    { name: 'Calabacín' },
    { name: 'Huevos', quantity: 4, unit: 'ud' }
  ]);
  const [draft, setDraft] = useState('');
  const [servings, setServings] = useState(settings.defaultServings);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [advanced, setAdvanced] = useState(false);
  const [style, setStyle] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);
  const [isSearching, setIsSearching] = useState(false);

  const voice = useSpeechRecognition(transcript => setDraft(current => appendDictation(current, transcript, ', ')));

  const addIngredient = (e?: FormEvent) => {
    e?.preventDefault();
    const entries = splitIngredientEntries(draft);
    if (!entries.length) return;
    setIngredients(current => mergeIngredientEntries(current, entries));
    setDraft('');
  };

  const clearDraft = () => { voice.stop(); setDraft(''); };

  const search = async () => {
    if (isSearching) return;
    const request = {
      mode: 'pantry' as const,
      servings,
      maxMinutes,
      pantryIngredients: ingredients,
      pantryBasics: settings.pantryBasics,
      style,
      cuisine,
      difficulty
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
      <TopBar eyebrow="MIRA A VER QUÉ ENCUENTRAS" title="¿Qué hay en la nevera?" />
      <div className="page-content">
        <section className="editorial-card intro-card olive-intro">
          <span className="eyebrow">APROVECHA LO QUE HAY</span>
          <h2>Cuéntame lo que tienes.</h2>
          <p>Las cantidades son opcionales. Marca con ★ lo que quieras aprovechar especialmente.</p>
        </section>

        <section className="form-section">
          <div className="section-label"><span>Ingredientes</span><small>Pulsa ★ para priorizar</small></div>
          <form className="ingredient-input" onSubmit={addIngredient}>
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ej. pollo 300 g, 4 huevos, arroz…" />
            {draft.trim() && <button type="button" className="clear-input-button" onClick={clearDraft} aria-label="Borrar ingredientes introducidos" title="Borrar texto"><X size={18} /></button>}
            <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar ingredientes'} aria-pressed={voice.isListening} title={voice.isSupported ? 'Dictar ingredientes' : 'Dictado no disponible en este navegador'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
            <button type="submit" aria-label="Añadir ingrediente"><Plus size={19} /></button>
          </form>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… habla con normalidad.</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}
          {!voice.isSupported && <div className="voice-status unsupported">El dictado por voz no está disponible en este navegador. Puedes seguir escribiendo normalmente.</div>}
          <div className="pantry-basics-note" style={{ marginTop: 8 }}>Puedes escribir o dictar uno o varios productos. Separa los ingredientes con comas o con “y”. Si no indicas cantidad, El Chef no la inventará.</div>
          <div className="ingredient-pills">
            {ingredients.map((item, index) => (
              <div className={`ingredient-pill ${item.priority ? 'priority' : ''}`} key={`${item.name}-${index}`}>
                <button className="star-toggle" onClick={() => setIngredients(ingredients.map((x, i) => i === index ? { ...x, priority: !x.priority } : x))}><Star size={15} fill={item.priority ? 'currentColor' : 'none'} /></button>
                <span>{item.name}{item.quantity !== undefined ? ` · ${formatIngredientQuantity(item)}` : ''}</span>
                <button onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="pantry-basics-note"><span>Básicos activos:</span> {settings.pantryBasics.join(' · ')} <button onClick={() => navigate('/ajustes')}>Editar</button></div>
        </section>

        <section className="control-card">
          <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={setServings} /></div>
          <div className="divider" />
          <div className="control-row"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Saltos de 5 min · también puedes escribirlo</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={setMaxMinutes} /></div>
        </section>

        <div className="helper-note"><Sparkles size={17} /> Antes de considerar que falta un ingrediente, comprobaremos si tienes una sustitución razonable. Si una cantidad no alcanza, te indicaremos cuánto falta.</div>
        <button className="advanced-toggle" onClick={() => setAdvanced(v => !v)}><span>Más opciones</span>{advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
        {advanced && <section className="advanced-panel"><div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{RECIPE_STYLES.map(v => <Chip key={v} selected={style === v} onClick={() => setStyle(style === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Tipo de cocina</strong><CuisineSelect value={cuisine} onChange={setCuisine} /></div><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(v => <Chip key={v} selected={difficulty === v} onClick={() => setDifficulty(difficulty === v ? undefined : v)}>{v}</Chip>)}</div></div></section>}
        <div className="helper-note"><Sparkles size={17} /> La primera búsqueda muestra 2 propuestas para responder más rápido y evitar esperas innecesarias.</div>
        <div className="sticky-action"><PrimaryButton onClick={search} disabled={ingredients.length === 0 || isSearching}>{isSearching ? 'Buscando las mejores opciones…' : 'Buscar 2 propuestas'}</PrimaryButton></div>
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
  return value.split(/[,;\n]+|\s+(?:y|e)\s+/i).map(item => item.trim()).filter(Boolean);
}

function appendDictation(current: string, transcript: string, separator: string): string {
  const base = current.trimEnd();
  if (!base) return transcript.trim();
  return `${base}${separator}${transcript.trim()}`;
}

function formatIngredientQuantity(item: IngredientInput): string {
  if (item.quantity === undefined) return '';
  const value = Number.isInteger(item.quantity) ? String(item.quantity) : item.quantity.toLocaleString('es-ES', { maximumFractionDigits: 1 });
  return `${value}${item.unit ? ` ${item.unit}` : ''}`;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
