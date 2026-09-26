import {DISH_CATEGORIES,matchesDishCategory} from '../utils/dishCategories';
import {chefLibrary} from '../data/library';
import {CATALOG_EMPTY} from '../services/hybridRecommendationEngine';
import { Check, Clock3, Heart, Mic, MicOff, Search, Sparkles, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { RecipeThumbnail } from '../components/RecipeThumbnail';
import { useApp } from '../AppContext';
import { useAiDictation } from '../hooks/useAiDictation';
import type { CookingRequest, HistoryEntry, Recipe } from '../domain/types';
import { generateDirectRecipe } from '../services/directRecipeGateway';
import { getAllRecipes, getRecipeById } from '../services/recipeCatalog';
import '../my-recipes.css';
import '../voice-input.css';

const MONTHS = ['Todos los meses','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function MyRecipesPage() {
  const navigate = useNavigate();
  const { favorites, savedRecipes, history, settings, setSearch, toggleFavorite, removeHistoryEntry, removeRecipeFromLibrary } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatError,setRepeatError]=useState('');
  const [repeatEntry,setRepeatEntry]=useState<HistoryEntry>();
  const [dishCategory, setDishCategory] = useState('Todos');
  const [kind,setKind]=useState('all');
  const [cuisine,setCuisine]=useState('');
  const [alcohol,setAlcohol]=useState('all');
  const [historyCategory,setHistoryCategory]=useState('Todos');
  const [historyQuery,setHistoryQuery]=useState('');
  const [historyPeriod,setHistoryPeriod]=useState('all');
  const [historyYear, setHistoryYear] = useState('Todos');
  const [historyMonth, setHistoryMonth] = useState('Todos');
  const voice = useAiDictation(transcript => setQuery(current => current.trim() ? `${current.trim()} ${transcript.trim()}` : transcript.trim()));
  const tab = params.get('tab') ?? 'library';
  const libraryRecipes = useMemo(() => {
    const catalog = getAllRecipes();
    const ids = new Set([...chefLibrary.map(r=>r.id), ...savedRecipes, ...favorites]);
    return catalog.filter(recipe => ids.has(recipe.id));
  }, [savedRecipes, favorites]);

  const recipes = useMemo(() => {
    const ids = tab === 'library' ? libraryRecipes.map(r=>r.id) : tab === 'favorites' ? favorites : savedRecipes;
    const normalizedQuery = query.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const catalog = getAllRecipes();
    return ids
      .map(id => catalog.find(recipe => recipe.id === id))
      .filter((recipe): recipe is Recipe => Boolean(recipe))
      .filter(recipe => !normalizedQuery || [recipe.title,recipe.source?.label??''].join(' ').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(normalizedQuery))
      .filter(recipe => matchesDishCategory(recipe,dishCategory))
      .filter(recipe=>kind==='all'||recipe.recipeKind===kind)
      .filter(recipe=>!cuisine||recipe.cuisine===cuisine)
      .filter(recipe=>alcohol==='all'||recipe.recipeKind==='cocktail'&&recipe.alcohol===(alcohol==='yes'));
  }, [libraryRecipes, favorites, savedRecipes, query, tab, dishCategory,kind,cuisine,alcohol]);

  const historyYears = useMemo(() => Array.from(new Set(history.map(entry => String(new Date(entry.createdAt).getFullYear())))).sort((a, b) => Number(b) - Number(a)), [history]);
  const filteredHistory = useMemo(() => history.filter(entry => {
    const date = new Date(entry.createdAt);
    const recipe=entry.recipeId?getRecipeById(entry.recipeId):undefined;
    if(historyCategory!=='Todos'&&(!recipe||!matchesDishCategory(recipe,historyCategory)))return false;
    if(historyQuery.trim()&&!((recipe?.title??entry.label).toLocaleLowerCase('es').includes(historyQuery.trim().toLocaleLowerCase('es'))))return false;
    if(historyPeriod!=='all'&&date.getTime()<Date.now()-Number(historyPeriod)*86400000)return false;
    if (historyYear !== 'Todos' && String(date.getFullYear()) !== historyYear) return false;
    if (historyMonth !== 'Todos' && String(date.getMonth() + 1) !== historyMonth) return false;
    return true;
  }), [history, historyYear, historyMonth,historyCategory,historyQuery,historyPeriod]);

  const repeatSearch = async (entry: HistoryEntry,forceAi=false) => {
    if (isRepeating) return;
    const request:CookingRequest = {...(entry.request ?? buildLegacyRequest(entry, settings.defaultServings, settings.pantryBasics)),generationMode:forceAi?'ai':'catalog'};
    setRepeatEntry(entry);setRepeatError('');
    setIsRepeating(true);
    try {
      const result = await generateDirectRecipe(request);
      setSearch(request, [result.proposal]);
      navigate(`/receta/${result.recipe.id}?servings=${request.servings}`);
    } catch(error) {
      setRepeatError(error instanceof Error?error.message:'No se ha podido recuperar la búsqueda.');
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

  const setDishTab = (nextTab: string) => setParams(nextTab === 'library' ? {} : { tab: nextTab });

  return (
    <AppShell>
      <ChefLoadingOverlay active={isRepeating} title="Preparando tu receta" messages={['Recuperando tus preferencias…','Preparando la receta completa…','Preparando la imagen…']} />
      <div className="simple-page-header light-header"><span className="eyebrow">TU COCINA</span><h1>Mis recetas</h1><p>{libraryRecipes.filter(r=>r.recipeKind!=='cocktail').length} recetas y {libraryRecipes.filter(r=>r.recipeKind==='cocktail').length} cócteles listos para preparar. Guarda tus favoritos y tus propias versiones.</p></div>
      <div className="page-content nav-safe"><button className="secondary-button" onClick={()=>navigate('/importar-receta')}>Importar receta</button>
          <div className="library-tabs">
            <button className={tab === 'library' ? 'active' : ''} onClick={() => setDishTab('library')}>Biblioteca</button>
            <button className={tab === 'all' ? 'active' : ''} onClick={() => setDishTab('all')}>Mis recetas</button>
            <button className={tab === 'favorites' ? 'active' : ''} onClick={() => setDishTab('favorites')}>Favoritos</button>
            <button className={tab === 'history' ? 'active' : ''} onClick={() => setDishTab('history')}>Historial</button>
          </div>

          {tab !== 'history' && <>
            <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar recetas y cócteles…" /><div className="voice-inline-actions"><button type="button" className="clear-input-button" onClick={() => { voice.stop(); setQuery(''); }} disabled={!query.trim() && !voice.isListening} aria-label="Borrar búsqueda"><X size={17} /></button><button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar búsqueda'}>{voice.isListening ? <MicOff size={18} /> : <Mic size={18} />}</button><button type="button" className="voice-confirm-button" onClick={confirmQuery} disabled={!query.trim() || voice.isListening || voice.isTranscribing} aria-label="Confirmar búsqueda"><Check size={18} /></button></div></div>
            {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… toca de nuevo cuando termines.</div>}
            {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
            {voice.error && <div className="voice-status error">{voice.error}</div>}
            <div className="library-filters"><label>Tipo<select aria-label="Tipo de receta" value={kind} onChange={e=>{setKind(e.target.value);setDishCategory('Todos');setAlcohol('all')}}><option value="all">Todos</option><option value="dish">Platos</option><option value="dessert">Postres</option><option value="cocktail">Cócteles</option></select></label><label>Cocina<select aria-label="Filtrar por cocina" value={cuisine} onChange={e=>setCuisine(e.target.value)}><option value="">Todas las cocinas</option>{Array.from(new Set(libraryRecipes.map(r=>r.cuisine))).sort().map(c=><option key={c}>{c}</option>)}</select></label>{(kind==='cocktail'||dishCategory==='Cócteles')&&<label>Alcohol<select aria-label="Filtrar por alcohol" value={alcohol} onChange={e=>setAlcohol(e.target.value)}><option value="all">Todos</option><option value="yes">Con alcohol</option><option value="no">Sin alcohol</option></select></label>}</div><div className="dish-category-row">{DISH_CATEGORIES.map(category => <button type="button" className={dishCategory === category ? 'active' : ''} onClick={() => setDishCategory(category)} key={category}>{category}</button>)}</div>

            <section className="library-section">
              <div className="section-heading-row"><div><span className="eyebrow">{tab === 'library' ? 'BIBLIOTECA' : tab === 'favorites' ? 'FAVORITOS' : 'MIS RECETAS'}</span><h2>{tab==='library'? recipes.length+' recetas disponibles' : recipes.length ? (tab === 'favorites' ? 'Tus imprescindibles' : 'Recetas guardadas') : (tab === 'favorites' ? 'Todavía no hay favoritas' : 'Todavía no has guardado ninguna receta')}</h2></div><Heart size={20} /></div>
              <div className="library-photo-grid">
                {recipes.map(recipe => (
                  <article className="library-photo-card" key={recipe.id}>
                    <button className="library-photo-open" aria-label={`Abrir ${recipe.title}`} onClick={() => navigate(`/receta/${recipe.id}`)}><RecipeThumbnail recipe={recipe} /><div className="library-photo-caption"><strong>{recipe.title}</strong><small><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min</small></div></button><button type="button" className="library-photo-heart" aria-label={`${favorites.includes(recipe.id)?'Quitar':'Marcar'} ${recipe.title} ${favorites.includes(recipe.id)?'de favoritos':'como favorita'}`} aria-pressed={favorites.includes(recipe.id)} onClick={()=>toggleFavorite(recipe.id)}><Heart size={20} fill={favorites.includes(recipe.id)?'currentColor':'none'}/></button>
                    {tab!=='library'&&<button type="button" className="library-delete" aria-label={tab === 'favorites' ? `Quitar ${recipe.title} de favoritos` : `Quitar ${recipe.title} de Mis recetas`} onClick={event => { event.stopPropagation(); if (tab === 'favorites') toggleFavorite(recipe.id); else deleteRecipe(recipe); }}><Trash2 size={17} /></button>}
                  </article>
                ))}
                {!recipes.length && <div className="empty-card">{tab === 'library' ? 'No hay recetas con estos filtros. Prueba otra categoría o cocina.' : tab === 'favorites' ? 'Marca una receta con ♥ y aparecerá aquí.' : 'Abre una receta y pulsa “Guardar receta” para conservarla aquí.'}</div>}
              </div>
            </section>
          </>}

          {tab === 'history' && <section className="library-section history-only-section">
            {repeatError&&<p role="alert">{repeatError}</p>}
            {repeatError===CATALOG_EMPTY&&repeatEntry&&<button className="secondary-button" disabled={isRepeating} onClick={()=>void repeatSearch(repeatEntry,true)}>Crear receta con IA</button>}
            <div className="section-heading-row"><div><span className="eyebrow">HISTORIAL</span><h2>Actividad reciente</h2></div></div>
            <div className="search-box"><Search size={18}/><input aria-label="Buscar en el historial" placeholder="Buscar en el historial…" value={historyQuery} onChange={e=>setHistoryQuery(e.target.value)}/></div>
            <div className="history-filter-row">
              <label>Comida<select aria-label="Comida del historial" value={historyCategory} onChange={e=>setHistoryCategory(e.target.value)}>{DISH_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
              <label>Periodo<select aria-label="Periodo del historial" value={historyPeriod} onChange={e=>{setHistoryPeriod(e.target.value);setHistoryYear('Todos');setHistoryMonth('Todos')}}><option value="all">Cualquier fecha</option><option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option><option value="90">Últimos 3 meses</option></select></label>
              <label><span>Año</span><select value={historyYear} onChange={event => {setHistoryYear(event.target.value);setHistoryPeriod('all')}}><option value="Todos">Todos</option>{historyYears.map(year => <option value={year} key={year}>{year}</option>)}</select></label>
              <label><span>Mes</span><select value={historyMonth} onChange={event => {setHistoryMonth(event.target.value);setHistoryPeriod('all')}}><option value="Todos">Todos</option>{MONTHS.slice(1).map((month, index) => <option value={String(index + 1)} key={month}>{month}</option>)}</select></label>
            </div>
            <div className="history-list">
              {filteredHistory.map(entry => {
                const recipe = entry.recipeId ? getRecipeById(entry.recipeId) : undefined;
                const date = new Date(entry.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                if (entry.kind === 'recipe') {
                  return <div className="history-card history-recipe-card" key={entry.id} role={recipe ? 'button' : undefined} tabIndex={recipe ? 0 : undefined} onClick={() => recipe && navigate(`/receta/${recipe.id}`)} onKeyDown={event => recipe && event.key === 'Enter' && navigate(`/receta/${recipe.id}`)}>{recipe ? <RecipeThumbnail recipe={recipe} /> : <span className="history-recipe-placeholder">—</span>}<div className="history-card-copy"><span>{recipe ? 'Receta' : 'Receta no disponible'}</span><strong>{recipe?.title ?? entry.label}</strong><small>{date} · {recipe ? 'Abrir receta' : 'Entrada antigua'}</small></div><button className="history-delete" type="button" aria-label="Borrar del historial" onClick={event => { event.stopPropagation(); removeHistoryEntry(entry.id); }}><Trash2 size={16} /></button></div>;
                }
                return <div className="history-card" role="button" tabIndex={0} key={entry.id} onClick={() => void repeatSearch(entry)} onKeyDown={event => event.key === 'Enter' && void repeatSearch(entry)}><span>{entry.mode === 'pantry' ? 'Cocina con lo que hay' : 'Chef'}</span><strong>{entry.label}</strong><small>{date} · Repetir búsqueda</small><button className="history-delete" type="button" aria-label="Borrar del historial" onClick={event => { event.stopPropagation(); removeHistoryEntry(entry.id); }}><Trash2 size={16} /></button></div>;
              })}
              {!filteredHistory.length && <div className="empty-card">No hay actividad con estos filtros.</div>}
            </div>
          </section>}


      </div>
    </AppShell>
  );
}

function buildLegacyRequest(entry: HistoryEntry, servings: number, pantryBasics: string[]): CookingRequest {
  if (entry.mode === 'pantry') return { mode: 'pantry', servings, maxMinutes: 60, pantryIngredients: entry.label.split(',').map(name => ({ name: name.trim() })).filter(item => item.name), pantryBasics };
  return { mode: 'desire', servings, maxMinutes: 60, desireText: entry.label };
}
