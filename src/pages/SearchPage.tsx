import { Check, ChevronDown, ChevronUp, Clock3, Globe2, Mic, MicOff, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { Chip } from '../components/Chip';
import { CuisineSelect } from '../components/CuisineSelect';
import { NumberStepper } from '../components/NumberStepper';
import { RECIPE_STYLES } from '../data/cookingOptions';
import type { Difficulty } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { fetchExternalSearch, isExternalRecipeApiConfigured } from '../services/externalRecipeGateway';
import { getAllRecipes, registerExternalRecipes } from '../services/recipeCatalog';
import { formatDuration } from '../utils/time';
import '../voice-input.css';

const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];
const difficultyRank: Record<Difficulty, number> = { Fácil: 1, Media: 2, Avanzada: 3 };

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cuisine, setCuisine] = useState<string>();
  const [style, setStyle] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty>();
  const [maxMinutes, setMaxMinutes] = useState(180);
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [externalMessage, setExternalMessage] = useState<string>();
  const voice = useAiDictation(transcript => setQuery(current => appendSentence(current, transcript)));

  const catalog = useMemo(() => getAllRecipes(), [catalogVersion]);

  const recipes = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    return catalog
      .filter(recipe => {
        const haystack = normalize([recipe.title, recipe.description, recipe.cuisine, recipe.style, ...recipe.ingredients.map(ingredient => ingredient.name)].join(' '));
        const textMatches = !words.length || words.every(word => haystack.includes(word));
        const cuisineMatches = !cuisine || normalize(recipe.cuisine) === normalize(cuisine);
        const styleMatches = !style || normalize(recipe.style) === normalize(style);
        const difficultyMatches = !difficulty || difficultyRank[recipe.difficulty] <= difficultyRank[difficulty];
        const timeMatches = recipe.prepMinutes + recipe.cookMinutes <= maxMinutes;
        return textMatches && cuisineMatches && styleMatches && difficultyMatches && timeMatches;
      })
      .sort((a, b) => (a.prepMinutes + a.cookMinutes) - (b.prepMinutes + b.cookMinutes));
  }, [catalog, query, cuisine, style, difficulty, maxMinutes]);

  const activeFilters = [cuisine, style, difficulty, maxMinutes < 180 ? String(maxMinutes) : undefined].filter(Boolean).length;
  const externalConfigured = isExternalRecipeApiConfigured();

  const clearFilters = () => {
    setCuisine(undefined);
    setStyle(undefined);
    setDifficulty(undefined);
    setMaxMinutes(180);
  };

  const confirmQuery = () => {
    if (voice.isListening) voice.stop();
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  const searchExternal = async () => {
    if (!externalConfigured || isSearchingExternal) return;
    setIsSearchingExternal(true);
    setExternalMessage(undefined);
    try {
      const received = await fetchExternalSearch({ query, cuisine, style, difficulty, maxMinutes });
      const accepted = registerExternalRecipes(received);
      setCatalogVersion(version => version + 1);
      setExternalMessage(accepted.length ? `Se han incorporado ${accepted.length} recetas externas validadas.` : 'No se han encontrado nuevas recetas que superen los controles de calidad.');
    } catch {
      setExternalMessage('No se han podido consultar las fuentes online. La búsqueda local sigue disponible.');
    } finally {
      setIsSearchingExternal(false);
    }
  };

  return (
    <AppShell>
      <ChefLoadingOverlay active={isSearchingExternal} title="Buscando recetas" messages={['¡Oído cocina!', 'Buscando nuevas recetas…', 'Revisando opciones…', 'Comprobando resultados…']} />
      <div className="simple-page-header light-header"><span className="eyebrow">BUSCAR RECETAS</span><h1>Encuentra un plato</h1><p>Busca por nombre, ingrediente, estilo o tipo de cocina.</p></div>
      <div className="page-content nav-safe">
        <div className="search-box">
          <Search size={18} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej. pasta pollo, italiana, calabacín…" />
          <div className="voice-inline-actions">
            <button type="button" className="clear-input-button" onClick={() => { voice.stop(); setQuery(''); }} disabled={!query.trim() && !voice.isListening} aria-label="Borrar búsqueda"><X size={17} /></button>
            <button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar búsqueda'}>{voice.isListening ? <MicOff size={18} /> : <Mic size={18} />}</button>
            <button type="button" className="voice-confirm-button" onClick={confirmQuery} disabled={!query.trim() || voice.isListening || voice.isTranscribing} aria-label="Confirmar búsqueda"><Check size={18} /></button>
          </div>
        </div>
        {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… toca de nuevo cuando termines.</div>}
        {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
        {voice.error && <div className="voice-status error">{voice.error}</div>}

        <button className="advanced-toggle" onClick={() => setFiltersOpen(value => !value)}><span><SlidersHorizontal size={17} /> Filtros{activeFilters ? ` · ${activeFilters}` : ''}</span>{filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>

        {filtersOpen && (
          <section className="advanced-panel">
            <div className="advanced-group"><strong>Tiempo máximo</strong><div className="control-row"><div className="control-title"><Clock3 size={18} /><div><small>Saltos de 5 min · también puedes escribirlo</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={setMaxMinutes} /></div></div>
            <div className="advanced-group"><strong>Tipo de cocina</strong><CuisineSelect value={cuisine} onChange={setCuisine} /></div>
            <div className="advanced-group"><strong>Estilo</strong><div className="chip-row">{RECIPE_STYLES.map(value => <Chip key={value} selected={style === value} onClick={() => setStyle(style === value ? undefined : value)}>{value}</Chip>)}</div></div>
            <div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(value => <Chip key={value} selected={difficulty === value} onClick={() => setDifficulty(difficulty === value ? undefined : value)}>{value}</Chip>)}</div></div>
            {activeFilters > 0 && <button className="secondary-button" onClick={clearFilters}>Limpiar filtros</button>}
          </section>
        )}

        {externalConfigured && <button className="secondary-button" style={{ marginTop: 14 }} onClick={searchExternal} disabled={isSearchingExternal}><Globe2 size={17} /> {isSearchingExternal ? 'Consultando fuentes online…' : 'Buscar también en fuentes online'}</button>}
        {externalMessage && <div className="pantry-basics-note">{externalMessage}</div>}

        <section className="library-section">
          <div className="section-heading-row"><div><span className="eyebrow">RECETAS</span><h2>{recipes.length ? `${recipes.length} disponibles` : 'No hay coincidencias'}</h2></div></div>
          <div className="library-list">
            {recipes.map(recipe => (
              <Link className="library-card" key={recipe.id} to={`/receta/${recipe.id}`} aria-label={`Abrir receta ${recipe.title}`}>
                <span className="library-emoji">{recipe.emoji}</span>
                <div><strong>{recipe.title}</strong><small><Clock3 size={13} /> {formatDuration(recipe.prepMinutes + recipe.cookMinutes)} · {recipe.cuisine} · {recipe.style}{recipe.source?.kind === 'web' ? ' · Web' : recipe.source?.kind === 'ai' ? ' · IA validada' : ''}</small></div>
              </Link>
            ))}
            {!recipes.length && <div className="empty-card">Prueba con otros términos o amplía los filtros.</div>}
          </div>
        </section>

        <section className="editorial-card small-info"><div><strong>{externalConfigured ? 'Búsqueda híbrida activa' : 'Búsqueda híbrida preparada'}</strong><p>{externalConfigured ? 'El catálogo local se combina con recetas externas que pasan los controles de coherencia antes de mostrarse.' : 'La app ya está preparada para consultar web e IA mediante un backend seguro. Hasta conectarlo, utiliza el catálogo validado de El Chef.'}</p></div></section>
      </div>
    </AppShell>
  );
}

function appendSentence(current: string, transcript: string): string {
  const base = current.trimEnd();
  const clean = transcript.trim();
  return base ? `${base}${/[.!?…]$/.test(base) ? ' ' : ' '}${clean}` : clean;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
