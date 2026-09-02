import { ChevronDown, ChevronUp, Clock3, Sparkles, UsersRound, WandSparkles } from 'lucide-react';
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
import { mockRecipes } from '../data/mockRecipes';
import type { Difficulty } from '../domain/types';
import { getMockProposals } from '../services/mockRecommendationEngine';
import { formatDuration } from '../utils/time';

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
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [advanced, setAdvanced] = useState(false);
  const [style, setStyle] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(settings.defaultDifficulty);

  const suggestions = useMemo(
    () => buildSuggestions(favorites, history.map(entry => entry.label)),
    [favorites, history]
  );

  const search = () => {
    const request = { mode: 'desire' as const, servings, maxMinutes, desireText: text, style, cuisine, difficulty };
    const proposals = getMockProposals(request);
    setSearch(request, proposals);
    navigate('/propuestas');
  };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="EL CHEF SE ENCARGA" title="¿Qué te apetece hoy?" />
      <div className="page-content">
        <section className="editorial-card desire-intro olive-intro"><span className="eyebrow">PÍDELO A TU MANERA</span><h2>Háblame como lo harías en casa.</h2><p>Describe el plato que te apetece y usa los filtros solo cuando realmente te ayuden.</p></section>
        <section className="form-section"><div className="section-label"><span>Hoy me apetece…</span></div><div className="desire-box"><WandSparkles size={22} /><textarea rows={5} value={text} onChange={e => setText(e.target.value)} placeholder="Ej. un plato italiano con pollo, fácil y en menos de 40 minutos…" /></div><div className="suggestion-row">{suggestions.map(s => <button key={s} onClick={() => setText(s)}>{s}</button>)}</div></section>
        <section className="control-card"><div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={setServings} /></div><div className="divider" /><div className="control-stack"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Tiempo total de elaboración</small></div></div><div className="range-row"><input type="range" min="15" max="300" step="5" value={maxMinutes} onChange={e => setMaxMinutes(Number(e.target.value))} /><span>{formatDuration(maxMinutes)}</span></div></div></section>
        <button className="advanced-toggle" onClick={() => setAdvanced(v => !v)}><span>Más opciones</span>{advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
        {advanced && <section className="advanced-panel"><div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{RECIPE_STYLES.map(v => <Chip key={v} selected={style === v} onClick={() => setStyle(style === v ? undefined : v)}>{v}</Chip>)}</div></div><div className="advanced-group"><strong>Tipo de cocina</strong><CuisineSelect value={cuisine} onChange={setCuisine} /></div><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(v => <Chip key={v} selected={difficulty === v} onClick={() => setDifficulty(difficulty === v ? undefined : v)}>{v}</Chip>)}</div></div></section>}
        <div className="helper-note"><Sparkles size={17} /> Las opciones rápidas se irán adaptando a tus búsquedas y recetas favoritas.</div>
        <div className="sticky-action"><PrimaryButton onClick={search} disabled={!text.trim()}>Que decida el Chef</PrimaryButton></div>
      </div>
    </AppShell>
  );
}

function buildSuggestions(favoriteIds: string[], historyLabels: string[]): string[] {
  const suggestions: string[] = [];
  const push = (value?: string) => {
    if (value && !suggestions.some(existing => existing.toLocaleLowerCase('es') === value.toLocaleLowerCase('es'))) suggestions.push(value);
  };

  favoriteIds.forEach(id => {
    const recipe = mockRecipes.find(item => item.id === id);
    if (!recipe) return;
    push(cuisinePhrases[recipe.cuisine] ?? recipe.cuisine);
    if (recipe.style === 'Rápida') push('Algo rápido');
    if (recipe.style === 'Saludable') push('Algo saludable');
    if (recipe.style === 'Casera') push('Cocina casera');
    if (recipe.style === 'Moderna') push('Algo moderno');
    ingredientSignals.forEach(signal => {
      if (recipe.ingredients.some(ingredient => normalize(ingredient.name).includes(normalize(signal)))) push(signal);
    });
  });

  historyLabels.forEach(label => {
    const normalized = normalize(label);
    ingredientSignals.forEach(signal => {
      if (normalized.includes(normalize(signal))) push(signal);
    });
    Object.entries(cuisinePhrases).forEach(([cuisine, phrase]) => {
      if (normalized.includes(normalize(cuisine))) push(phrase);
    });
    if (normalized.includes('rapid')) push('Algo rápido');
    if (normalized.includes('salud')) push('Algo saludable');
  });

  defaultSuggestions.forEach(push);
  return suggestions.slice(0, 5);
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
