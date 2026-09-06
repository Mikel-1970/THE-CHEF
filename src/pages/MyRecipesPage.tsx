import { Check, Clock3, Heart, Mic, MicOff, Search, Sparkles, Trash2, Utensils, Wrench, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { RecipeThumbnail } from '../components/RecipeThumbnail';
import { useApp } from '../AppContext';
import { useAiDictation } from '../hooks/useAiDictation';
import type { CookingRequest, HistoryEntry, Recipe } from '../domain/types';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { getAllRecipes, getRecipeById } from '../services/recipeCatalog';
import { getSavedTechniques, removeTechnique } from '../services/techniqueCatalog';
import type { Technique } from '../services/techniqueGateway';
import '../my-recipes.css';
import '../voice-input.css';

const MONTHS = ['Todos los meses','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function MyRecipesPage() {
  const navigate = useNavigate();
  const { favorites, savedRecipes, history, settings, setSearch, toggleFavorite, removeHistoryEntry, removeRecipeFromLibrary } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [isRepeating, setIsRepeating] = useState(false);
  const [techniques, setTechniques] = useState<Technique[]>(() => getSavedTechniques());
  const [dishCategory, setDishCategory] = useState('Todos');
  const [historyYear, setHistoryYear] = useState('Todos');
  const [historyMonth, setHistoryMonth] = useState('Todos');
  const voice = useAiDictation(transcript => setQuery(current => current.trim() ? `${current.trim()} ${transcript.trim()}` : transcript.trim()));
  const tab = params.get('tab') ?? 'all';
  const libraryType = params.get('type') ?? 'dishes';

  const recipes = useMemo(() => {
    const ids = tab === 'favorites' ? favorites : Array.from(new Set([...savedRecipes, ...favorites]));
    const normalizedQuery = query.trim().toLocaleLowerCase('es');
    const catalog = getAllRecipes();
    return ids
      .map(id => catalog.find(recipe => recipe.id === id))
      .filter((recipe): recipe is Recipe => Boolean(recipe))
      .filter(recipe => !normalizedQuery || recipe.title.toLocaleLowerCase('es').includes(normalizedQuery))
      .filter(recipe => dishCategory === 'Todos' || inferDishCategory(recipe) === dishCategory);
  }, [favorites, savedRecipes, query, tab, dishCategory]);

  const visibleTechniques = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es');
    return techniques.filter(item => !normalizedQuery || item.title.toLocaleLowerCase('es').includes(normalizedQuery));
  }, [techniques, query]);

  const historyYears = useMemo(() => Array.from(new Set(history.map(entry => String(new Date(entry.createdAt).getFullYear())))).sort((a, b) => Number(b) - Number(a)), [history]);
  const filteredHistory = useMemo(() => history.filter(entry => {
    const date = new Date(entry.createdAt);
    if (historyYear !== 'Todos' && String(date.getFullYear()) !== historyYear) return false;
    if (historyMonth !== 'Todos' && String(date.getMonth() + 1) !== historyMonth) return false;
    return true;
  }), [history, historyYear, historyMonth]);

  const repeatSearch = async (entry: HistoryEntry) => {
    if (isRepeating) return;
    const request = entry.request ?? buildLegacyRequest(entry, settings.defaultServings, settings.pantryBasics);
    setIsRepeating(true);
    try {
      const result = await getHybridProposals(request);
      setSearch(request, result.proposals);
      navigate('/propuestas');
    } finally {
      setIsRepeating(false);
    }
  };

  const deleteRecipe = (recipe: Recipe) => {
    if (!window.confirm(`¿Quitar “${recipe.title}” de Mis recetas y Favoritos? El historial se conservará.`)) return;
    removeRecipeFromLibrary(recipe.id);
  };

  const confirmQuery = () => {
    if (voice.isListening) voice.stop();
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  const setDishTab = (nextTab: string) => setParams(nextTab === 'all' ? { type: 'dishes' } : { type: 'dishes', tab: nextTab });

  return (
    <AppShell hideBack hideProfile>
      <ChefLoadingOverlay active={isRepeating} title="Repitiendo búsqueda" messages={['Recuperando tus preferencias…']} />
      <div className="simple-page-header light-header"><span className="eyebrow">TU COCINA</span><h1>Mis recetas</h1><p>Recetas guardadas, favoritas, técnicas e historial de actividad.</p></div>
      <div className="page-content nav-safe">
        <div className="library-type-tabs">
          <button className={libraryType === 'dishes' ? 'active' : ''} onClick={() => setParams({ type: 'dishes' })}><Utensils size={19} /><span><strong>Platos</strong><small>Recetas completas</small></span></button>
          <button className={libraryType === 'techniques' ? 'active' : ''} onClick={() => setParams({ type: 'techniques' })}><Wrench size={19} /><span><strong>Técnicas</strong><small>Preparaciones reutilizables</small></span></button>
        </div>

        {libraryType === 'dishes' && <>
          <div className="library-tabs">
            <button className={tab === 'all' ? 'active' : ''} onClick={() => setDishTab('all')}>Todo</button>
            <button className={tab === 'favorites' ? 'active' : ''} onClick={() => setDishTab('favorites')}>Favoritas</button>
            <button className={tab === 'history' ? 'active' : ''} onClick={() => setDishTab('history')}>Historial</button>
          </div>

          {tab !== 'history' && <>
            <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar en mis recetas…" /><div className="voice-inline-actions"><button type="button" className="clear-input-button" onClick={() => { voice.stop(); setQuery(''); }} disabled={!query.trim() && !voice.isListening} aria-label="Borrar búsqueda"><X size={17} /></button><button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar búsqueda'}>{voice.isListening ? <MicOff size={18} /> : <Mic size={18} />}</button><button type="button" className="voice-confirm-button" onClick={confirmQuery} disabled={!query.trim() || voice.isListening || voice.isTranscribing} aria-label="Confirmar búsqueda"><Check size={18} /></button></div></div>
            {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… toca de nuevo cuando termines.</div>}
            {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
            {voice.error && <div className="voice-status error">{voice.error}</div>}
            <div className="dish-category-row">{['Todos','Arroces','Pastas','Carnes','Pescados','Guisos','Postres','Otros'].map(category => <button type="button" className={dishCategory === category ? 'active' : ''} onClick={() => setDishCategory(category)} key={category}>{category}</button>)}</div>

            <section className="library-section">
              <div className="section-heading-row"><div><span className="eyebrow">{tab === 'favorites' ? 'FAVORITAS' : 'MIS RECETAS'}</span><h2>{recipes.length ? (tab === 'favorites' ? 'Tus imprescindibles' : 'Recetas guardadas') : (tab === 'favorites' ? 'Todavía no hay favoritas' : 'Todavía no has guardado ninguna receta')}</h2></div><Heart size={20} /></div>
              <div className="library-list">
                {recipes.map(recipe => (
                  <div className="library-card" key={recipe.id} role="button" tabIndex={0} onClick={() => navigate(`/receta/${recipe.id}`)} onKeyDown={event => event.key === 'Enter' && navigate(`/receta/${recipe.id}`)}>
                    <RecipeThumbnail recipe={recipe} />
                    <div style={{ minWidth: 0, flex: 1 }}><strong>{recipe.title}</strong><small><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min · {recipe.cuisine}</small></div>
                    <button type="button" className="library-delete" aria-label={tab === 'favorites' ? `Quitar ${recipe.title} de favoritos` : `Quitar ${recipe.title} de Mis recetas`} onClick={event => { event.stopPropagation(); if (tab === 'favorites') toggleFavorite(recipe.id); else deleteRecipe(recipe); }}><Trash2 size={17} /></button>
                  </div>
                ))}
                {!recipes.length && <div className="empty-card">{tab === 'favorites' ? 'Marca una receta con ♥ y aparecerá aquí.' : 'Abre una receta y pulsa “Guardar receta” para conservarla aquí.'}</div>}
              </div>
            </section>
          </>}

          {tab === 'history' && <section className="library-section history-only-section">
            <div className="section-heading-row"><div><span className="eyebrow">HISTORIAL</span><h2>Actividad reciente</h2></div></div>
            <div className="history-filter-row">
              <label><span>Año</span><select value={historyYear} onChange={event => setHistoryYear(event.target.value)}><option value="Todos">Todos</option>{historyYears.map(year => <option value={year} key={year}>{year}</option>)}</select></label>
              <label><span>Mes</span><select value={historyMonth} onChange={event => setHistoryMonth(event.target.value)}><option value="Todos">Todos</option>{MONTHS.slice(1).map((month, index) => <option value={String(index + 1)} key={month}>{month}</option>)}</select></label>
            </div>
            <div className="history-list">
              {filteredHistory.slice(0, 40).map(entry => {
                const recipe = entry.recipeId ? getRecipeById(entry.recipeId) : undefined;
                const date = new Date(entry.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                if (entry.kind === 'recipe') {
                  return <div className="history-card" key={entry.id} role={recipe ? 'button' : undefined} tabIndex={recipe ? 0 : undefined} onClick={() => recipe && navigate(`/receta/${recipe.id}`)} onKeyDown={event => recipe && event.key === 'Enter' && navigate(`/receta/${recipe.id}`)}><span>{recipe ? 'Receta' : 'Receta no disponible'}</span><strong>{recipe?.title ?? entry.label}</strong><small>{date} · {recipe ? 'Abrir receta' : 'Entrada antigua'}</small><button className="history-delete" type="button" aria-label="Borrar del historial" onClick={event => { event.stopPropagation(); removeHistoryEntry(entry.id); }}><Trash2 size={16} /></button></div>;
                }
                return <div className="history-card" role="button" tabIndex={0} key={entry.id} onClick={() => void repeatSearch(entry)} onKeyDown={event => event.key === 'Enter' && void repeatSearch(entry)}><span>{entry.mode === 'pantry' ? 'Despensa' : 'Chef'}</span><strong>{entry.label}</strong><small>{date} · Repetir búsqueda</small><button className="history-delete" type="button" aria-label="Borrar del historial" onClick={event => { event.stopPropagation(); removeHistoryEntry(entry.id); }}><Trash2 size={16} /></button></div>;
              })}
              {!filteredHistory.length && <div className="empty-card">No hay actividad para ese periodo.</div>}
            </div>
          </section>}
        </>}

        {libraryType === 'techniques' && <>
          <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar en mis técnicas…" /></div>
          <section className="library-section"><div className="section-heading-row"><div><span className="eyebrow">TÉCNICAS</span><h2>{visibleTechniques.length ? 'Preparaciones guardadas' : 'Todavía no hay técnicas'}</h2></div><Wrench size={20} /></div><div className="library-list">{visibleTechniques.map(item => <div className="library-card" key={item.id} role="button" tabIndex={0} onClick={() => navigate(`/tecnicas?open=${encodeURIComponent(item.id)}`)} onKeyDown={event => event.key === 'Enter' && navigate(`/tecnicas?open=${encodeURIComponent(item.id)}`)}><span className="library-emoji">🧪</span><div style={{ minWidth: 0, flex: 1 }}><strong>{item.title}</strong><small><Clock3 size={13} /> {item.timeMinutes} min · {item.category}</small></div><button type="button" className="library-delete" aria-label={`Eliminar ${item.title}`} onClick={event => { event.stopPropagation(); setTechniques(removeTechnique(item.id)); }}><Trash2 size={17} /></button></div>)}{!visibleTechniques.length && <div className="empty-card">Las técnicas que genere El Chef aparecerán aquí automáticamente.</div>}</div></section>
        </>}
      </div>
    </AppShell>
  );
}

function buildLegacyRequest(entry: HistoryEntry, servings: number, pantryBasics: string[]): CookingRequest {
  if (entry.mode === 'pantry') return { mode: 'pantry', servings, maxMinutes: 60, pantryIngredients: entry.label.split(',').map(name => ({ name: name.trim() })).filter(item => item.name), pantryBasics };
  return { mode: 'desire', servings, maxMinutes: 60, desireText: entry.label };
}

function inferDishCategory(recipe: Recipe) {
  const text = `${recipe.title} ${recipe.ingredients.map(item => item.name).join(' ')}`.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/arroz|paella|risotto/.test(text)) return 'Arroces';
  if (/pasta|espagueti|macarron|tallarin|lasana|ravioli/.test(text)) return 'Pastas';
  if (/pollo|ternera|cerdo|cordero|carne|pavo/.test(text)) return 'Carnes';
  if (/pescado|lubina|salmon|merluza|bacalao|atun|dorada|marisco/.test(text)) return 'Pescados';
  if (/guiso|cocido|estofado|potaje|lenteja|garbanzo/.test(text)) return 'Guisos';
  if (/postre|tarta|bizcocho|crema|helado|chocolate/.test(text)) return 'Postres';
  return 'Otros';
}
