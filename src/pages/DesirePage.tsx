import { Check, ChevronDown, ChevronUp, Clock3, Mic, Sparkles, UsersRound, WandSparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { CookingRequest, Difficulty } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { getAllRecipes } from '../services/recipeCatalog';
import { interpretDesireText } from '../services/requestInterpreter';
import type { SpiceLevel } from '../services/storage';
import '../voice-input.css';

const defaultSuggestions = ['Algo italiano', 'Pollo', 'Pasta', 'Algo rápido', 'Algo ligero'];
const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];
const ingredientSignals = ['Pollo', 'Pasta', 'Arroz', 'Huevos', 'Garbanzos', 'Tomate', 'Calabacín'];
const cuisinePhrases: Record<string, string> = { Española: 'Algo español', Mediterránea: 'Algo mediterráneo', Italiana: 'Algo italiano', Francesa: 'Algo francés', Mexicana: 'Algo mexicano', Japonesa: 'Algo japonés', China: 'Algo chino', Asiática: 'Algo asiático', India: 'Algo indio' };

export function DesirePage() {
  const navigate = useNavigate();
  const { settings, favorites, history, setSearch } = useApp();
  const [text, setText] = useState('');
  const [servings, setServings] = useState(settings.defaultServings);
  const [servingsTouched, setServingsTouched] = useState(false);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [timeTouched, setTimeTouched] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [style, setStyle] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>(settings.spiceLevel);
  const [isSearching, setIsSearching] = useState(false);
  const [requestConfirmed, setRequestConfirmed] = useState(false);
  const autoMicAttempted = useRef(false);
  const ignoreNextVoice = useRef(false);

  const requestVoice = useAiDictation(transcript => {
    if (ignoreNextVoice.current) {
      ignoreNextVoice.current = false;
      return;
    }
    setText(transcript.trim());
    setRequestConfirmed(false);
  });

  useEffect(() => {
    if (autoMicAttempted.current || !requestVoice.isSupported) return;
    autoMicAttempted.current = true;
    void requestVoice.start();
  }, [requestVoice.isSupported, requestVoice.start]);

  const suggestions = useMemo(() => buildSuggestions(favorites, history.map(entry => entry.label)), [favorites, history]);

  const clearRequest = () => {
    if (requestVoice.isListening) {
      ignoreNextVoice.current = true;
      requestVoice.stop();
    }
    setText('');
    setRequestConfirmed(false);
  };

  const confirmRequest = () => {
    if (isSearching || requestVoice.isTranscribing) return;
    if (requestVoice.isListening) {
      requestVoice.stop();
      return;
    }
    if (!text.trim()) return;
    setRequestConfirmed(true);
  };

  const handleTextChange = (value: string) => {
    if (requestVoice.isListening) {
      ignoreNextVoice.current = true;
      requestVoice.stop();
    }
    setText(value);
    setRequestConfirmed(false);
  };

  const search = async () => {
    if (isSearching || requestVoice.isListening || requestVoice.isTranscribing || !requestConfirmed || !text.trim()) return;
    const interpreted = interpretDesireText(text);
    const request: CookingRequest = {
      mode: 'desire',
      servings: servingsTouched ? servings : interpreted.servings ?? servings,
      maxMinutes: timeTouched ? maxMinutes : interpreted.maxMinutes ?? maxMinutes,
      desireText: text.trim(),
      style: style ?? interpreted.style,
      cuisine: interpreted.cuisine,
      difficulty: difficulty ?? interpreted.difficulty,
      spiceLevel,
      pantryPolicy: 'ignore'
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
      <ChefLoadingOverlay active={isSearching} title="Buscando propuestas" messages={['¡Oído cocina!', 'Buscando la mejor opción…', 'El Chef está pensando…', 'Afinando tus propuestas…']} />
      <TopBar eyebrow="¡OÍDO COCINA!" title="¿Qué quieres que te prepare?" />
      <div className="page-content desire-simple-page">
        <section className="editorial-card desire-intro olive-intro"><span className="eyebrow">PÍDELO A TU MANERA</span><h2>Dime qué te apetece.</h2><p>Habla o escribe. Después confirma el texto y El Chef preparará dos propuestas.</p></section>

        <section className="form-section">
          <div className="section-label"><span>¿Qué quieres que prepare?</span></div>
          <div className={`desire-box desire-box-simple ${requestConfirmed ? 'confirmed' : ''}`}>
            <WandSparkles size={22} />
            <textarea rows={5} value={text} onChange={event => handleTextChange(event.target.value)} placeholder="Ej. prepárame una paella con pollo; o un postre de chocolate; o algo nuevo y rápido…" />
            <div className="voice-action-stack voice-action-two">
              <button type="button" className="clear-input-button" onClick={clearRequest} disabled={!text.trim() && !requestVoice.isListening && !requestVoice.isTranscribing} aria-label="Borrar petición"><X size={20} /></button>
              <button type="button" className={`voice-confirm-button ${requestConfirmed ? 'confirmed' : ''}`} onClick={confirmRequest} disabled={(!text.trim() && !requestVoice.isListening) || requestVoice.isTranscribing || isSearching} aria-label={requestVoice.isListening ? 'Terminar dictado' : requestConfirmed ? 'Petición confirmada' : 'Confirmar petición'}><Check size={21} /></button>
            </div>
          </div>
          {requestVoice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… pulsa ✓ cuando termines.</div>}
          {requestVoice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
          {requestVoice.error && <div className="voice-status error">{requestVoice.error} Puedes escribir la petición directamente.</div>}
          {requestConfirmed && <div className="voice-status confirmed"><Check size={14} /> Texto confirmado. Puedes generar las propuestas.</div>}
          <div className="suggestion-row">{suggestions.map(s => <button key={s} onClick={() => { if (requestVoice.isListening) { ignoreNextVoice.current = true; requestVoice.stop(); } setText(s); setRequestConfirmed(false); }}>{s}</button>)}</div>
        </section>

        <section className="form-section contextual-options-section">
          <button type="button" className="advanced-toggle contextual-options-toggle" onClick={() => setOptionsOpen(value => !value)} aria-expanded={optionsOpen}>
            <span>Opciones de la propuesta</span>{optionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {optionsOpen && <div className="advanced-panel contextual-options-panel">
            <div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Comensales</strong><small>Número de personas</small></div></div><NumberStepper value={servings} onChange={value => { setServingsTouched(true); setServings(value); }} /></div>
            <div className="divider" />
            <div className="control-row"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Hasta 3 horas</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={value => { setTimeTouched(true); setMaxMinutes(value); }} /></div>
            <div className="advanced-group"><strong>Estilo de comida</strong><div className="chip-row">{RECIPE_STYLES.map(v => <Chip key={v} selected={style === v} onClick={() => setStyle(style === v ? undefined : v)}>{v}</Chip>)}</div></div>
            <div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(v => <Chip key={v} selected={difficulty === v} onClick={() => setDifficulty(difficulty === v ? undefined : v)}>{v}</Chip>)}</div></div>
            <div className="advanced-group"><strong>Picante</strong><div className="chip-row">{(['Nada','Suave','Medio','Alto'] as SpiceLevel[]).map(v => <Chip key={v} selected={spiceLevel === v} onClick={() => setSpiceLevel(v)}>{v}</Chip>)}</div></div>
          </div>}
        </section>

        <div className="sticky-action desire-generate-action"><PrimaryButton onClick={() => void search()} disabled={!requestConfirmed || !text.trim() || isSearching || requestVoice.isListening || requestVoice.isTranscribing}>{isSearching ? 'Consultando al Chef…' : 'Generar 2 propuestas'}</PrimaryButton></div>
      </div>
    </AppShell>
  );
}

function buildSuggestions(favoriteIds: string[], historyLabels: string[]): string[] {
  const suggestions: string[] = [];
  const recipes = getAllRecipes();
  const push = (value?: string) => { if (value && !suggestions.some(existing => existing.toLocaleLowerCase('es') === value.toLocaleLowerCase('es'))) suggestions.push(value); };
  favoriteIds.forEach(id => {
    const recipe = recipes.find(item => item.id === id);
    if (!recipe) return;
    push(cuisinePhrases[recipe.cuisine] ?? recipe.cuisine);
    if (recipe.style === 'Rápida') push('Algo rápido');
    if (recipe.style === 'Saludable') push('Algo saludable');
    if (recipe.style === 'Casera' || recipe.style === 'Tradicional') push('Cocina tradicional');
    if (recipe.style === 'Moderna') push('Algo moderno');
    ingredientSignals.forEach(signal => { if (recipe.ingredients.some(ingredient => normalize(ingredient.name).includes(normalize(signal)))) push(signal); });
  });
  historyLabels.forEach(label => {
    const normalized = normalize(label);
    ingredientSignals.forEach(signal => { if (normalized.includes(normalize(signal))) push(signal); });
    Object.entries(cuisinePhrases).forEach(([cuisine, phrase]) => { if (normalized.includes(normalize(cuisine))) push(phrase); });
  });
  defaultSuggestions.forEach(push);
  return suggestions.slice(0, 5);
}

function normalize(value: string) { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
