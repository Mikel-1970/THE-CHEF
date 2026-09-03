import { ChevronDown, ChevronUp, Clock3, Mic, MicOff, Sparkles, UsersRound, WandSparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { CuisineSelect } from '../components/CuisineSelect';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { Difficulty } from '../domain/types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { getAllRecipes } from '../services/recipeCatalog';
import { interpretDesireText } from '../services/requestInterpreter';
import '../voice-input.css';

const defaultSuggestions = ['Algo italiano', 'Pollo', 'Pasta', 'Algo rápido', 'Algo ligero'];
const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];
const ingredientSignals = ['Pollo', 'Pasta', 'Arroz', 'Huevos', 'Garbanzos', 'Tomate', 'Calabacín'];
const cuisinePhrases: Record<string, string> = {
  'Española': 'Algo español',
  'Mediterránea': 'Algo mediterráneo',
  'Italiana': 'Algo italiano',
  'Francesa': 'Algo francés',
  'Mexicana': 'Algo mexicano',
  'Japonesa': 'Algo japonés',
  'China': 'Algo chino',
  'Asiática': 'Algo asiático',
  'India': 'Algo indio'
};

export function DesirePage() {
  const navigate = useNavigate();
  const { settings, favorites, history, setSearch } = useApp();
  const [text, setText] = useState('');
  const [servings, setServings] = useState(settings.defaultServings);
  const [servingsTouched, setServingsTouched] = useState(false);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [timeTouched, setTimeTouched] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [style, setStyle] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);
  const [isSearching, setIsSearching] = useState(false);

  const voice = useSpeechRecognition(transcript => setText(current => appendDictation(current, transcript)));
  const suggestions = useMemo(() => buildSuggestions(favorites, history.map(entry => entry.label)), [favorites, history]);

  const search = async () => {
    if (isSearching) return;
    const interpreted = interpretDesireText(text);
    const request = {
      mode: 'desire' as const,
      servings: servingsTouched ? servings : interpreted.servings ?? servings,
      maxMinutes: timeTouched ? maxMinutes : interpreted.maxMinutes ?? maxMinutes,
      desireText: text,
      style: style ?? interpreted.style,
      cuisine: cuisine ?? interpreted.cuisine,
      difficulty: difficulty ?? interpreted.difficulty
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

  const changeServings = (value: number) => { setServingsTouched(true); setServings(value); };
  const changeTime = (value: number) => { setTimeTouched(true); setMaxMinutes(value); };
  const clearText = () => { voice.stop(); setText(''); };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="¡OÍDO COCINA!" title="¡Pregúntale al Chef!" />
      <div className="page-content">
        <section className="editorial-card desire-intro olive-intro"><span className="eyebrow">PÍDELO A TU MANERA</span><h2>Háblame como lo harías en casa.</h2><p>Describe el plato que te apetece y usa los filtros solo cuando realmente te ayuden.</p></section>
        <section className="form-section">
          <div className="section-label"><span>Hoy me apetece…</span></div>
          <div className="desire-box">
            <WandSparkles size={22} />
            <textarea rows={5} value={text} onChange={e => setText(e.target.value)} placeholder="Ej. somos cuatro, algo italiano con pollo, fácil y en menos de 40 minutos…" />
            <div className="voice-action-stack">
              {text.trim() && <button type="button" className="clear-input-button" onClick={clearText} aria-label="Borrar petición" title="Borrar texto"><X size={18} /></button>}
              <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar lo que te apetece'} aria-pressed={voice.isListening} title={voice.isSupported ? 'Dictar lo que te apetece' : 'Dictado no disponible en este navegador'}>{voice.isListening ? <MicOff size={19} /> : <Mic size={19} />}</button>
            </div>
          </div>
          {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… cuéntale al Chef lo que te apetece.</div>}
          {voice.error && <div className="voice-status error">{voice.error}</div>}
          {!voice.isSupported && <div className="voice-status unsupported">El dictado por voz no está disponible en este navegador. Puedes seguir escribiendo normalmente.</div>}
          <div className="suggestion-row">{suggestions.map(s => <button key={s} onClick={() => setText(s)}>{s}</button>)}</div>
        </section>
        <div className="helper-note"><Sparkles size={17} /> El Chef interpreta del texto comensales, tiempo, dificultad, estilo y tipo de cocina. Si eliges un filtro manualmente, ese filtro tiene prioridad.</div>
        <section className="control-card">
          <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={changeServings} /></div>
          <div className="divider" />
          <div className="control-row"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Saltos de 5 min · también puedes escribirlo</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={changeTime} /></div>
        </section>
        <button className="advanced-toggle" onClick={() => setAdvanced(v => !v)}><span>Más opciones</span>{advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
        {advanced && <section className="advanced-panel"><div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{RECIPE_STYLES.map(v => <Chip key={v} selected={style === v} onClick={() => setStyle(style === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Tipo de cocina</strong><CuisineSelect value={cuisine} onChange={setCuisine} /></div><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(v => <Chip key={v} selected={difficulty === v} onClick={() => setDifficulty(difficulty === v ? undefined : v)}>{v}</Chip>)}</div></div></section>}
        <div className="helper-note"><Sparkles size={17} /> La búsqueda inicial muestra solo 2 propuestas para responder más rápido. Al elegir una se trabaja sobre esa receta.</div>
        <div className="sticky-action"><PrimaryButton onClick={search} disabled={!text.trim() || isSearching}>{isSearching ? 'Consultando al Chef…' : 'Buscar 2 propuestas'}</PrimaryButton></div>
      </div>
    </AppShell>
  );
}

function appendDictation(current: string, transcript: string): string {
  const base = current.trimEnd();
  const clean = transcript.trim();
  if (!base) return clean;
  const separator = /[.!?…]$/.test(base) ? ' ' : '. ';
  return `${base}${separator}${clean}`;
}

function buildSuggestions(favoriteIds: string[], historyLabels: string[]): string[] {
  const suggestions: string[] = [];
  const recipes = getAllRecipes();
  const push = (value?: string) => {
    if (value && !suggestions.some(existing => existing.toLocaleLowerCase('es') === value.toLocaleLowerCase('es'))) suggestions.push(value);
  };
  favoriteIds.forEach(id => {
    const recipe = recipes.find(item => item.id === id);
    if (!recipe) return;
    push(cuisinePhrases[recipe.cuisine] ?? recipe.cuisine);
    if (recipe.style === 'Rápida') push('Algo rápido');
    if (recipe.style === 'Saludable') push('Algo saludable');
    if (recipe.style === 'Casera') push('Cocina casera');
    if (recipe.style === 'Moderna') push('Algo moderno');
    ingredientSignals.forEach(signal => { if (recipe.ingredients.some(ingredient => normalize(ingredient.name).includes(normalize(signal)))) push(signal); });
  });
  historyLabels.forEach(label => {
    const normalized = normalize(label);
    ingredientSignals.forEach(signal => { if (normalized.includes(normalize(signal))) push(signal); });
    Object.entries(cuisinePhrases).forEach(([cuisine, phrase]) => { if (normalized.includes(normalize(cuisine))) push(phrase); });
    if (normalized.includes('rapid')) push('Algo rápido');
    if (normalized.includes('salud')) push('Algo saludable');
  });
  defaultSuggestions.forEach(push);
  return suggestions.slice(0, 5);
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
