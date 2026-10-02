import {CUISINES} from '../data/cookingOptions';
import {matchesCuisineFilter} from '../utils/cuisineFilter';
import {chefLibrary} from '../data/library';
import {foodTextMatches} from '../utils/recipeSearch';
import {DISH_CATEGORIES,matchesDishCategory} from '../utils/dishCategories';
import {CATALOG_EMPTY} from '../services/hybridRecommendationEngine';
import { Check, Clock3, Heart, Mic, MicOff, Search, Sparkles, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { AlmPageHeader } from '../components/AlmPageHeader';
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
  const { favorites, savedRecipes, history, settings, setSearch, toggleFavorite, removeHistoryEntry } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [removedIds,setRemovedIds]=useState<string[]>(()=>{try{const v=JSON.parse(localStorage.getItem('chef:removed-library-recipes:v1')??'[]');return Array.isArray(v)?v.filter(id=>typeof id==='string'):[];}catch{return [];}});
  const [lastRemoved,setLastRemoved]=useState<Recipe>();
  const [removeError,setRemoveError]=useState('');
  const updateRemoved=(ids:string[])=>{try{localStorage.setItem('chef:removed-library-recipes:v1',JSON.stringify(ids));setRemovedIds(ids);setRemoveError('');return true;}catch{setRemoveError('No se ha podido guardar el cambio.');return false;}};
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatError,setRepeatError]=useState('');
  const [repeatEntry,setRepeatEntry]=useState<HistoryEntry>();
  const [dishCategory, setDishCategory] = useState('Todos');
  const [customTypes,setCustomTypes]=useState<{name:string;recipeIds:string[]}[]>(()=>{
    try { const value=JSON.parse(localStorage.getItem('chef:custom-dish-types:v1')??'[]');return Array.isArray(value)?value.filter(t=>typeof t?.name==='string'&&Array.isArray(t.recipeIds)):[]; } catch { return []; }
  });
  const typeDialog=useRef<HTMLDialogElement>(null);
  const [typeOverrides,setTypeOverrides]=useState<Record<string,string>>(()=>{try{const v=JSON.parse(localStorage.getItem('chef:recipe-type-overrides:v1')??'{}');return v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).filter((entry):entry is [string,string]=>typeof entry[1]==='string')):{};}catch{return {};}});
  const changeRecipeType=(id:string,type:string)=>{
    const next={...typeOverrides};if(type)next[id]=type;else delete next[id];
    try{localStorage.setItem('chef:recipe-type-overrides:v1',JSON.stringify(next));setTypeOverrides(next);setRemoveError('');}catch{setRemoveError('No se ha podido guardar el tipo de la receta.');}
  };
  const [addingType,setAddingType]=useState(false);
  const [typeName,setTypeName]=useState('');
  const [typeRecipeIds,setTypeRecipeIds]=useState<string[]>([]);
  const [typeError,setTypeError]=useState('');
  useEffect(()=>{if(addingType)typeDialog.current?.showModal();else typeDialog.current?.close();},[addingType]);
  const categories=[...DISH_CATEGORIES,...customTypes.map(t=>t.name)];
  const matchesType=(recipe:Recipe,category:string)=>category==='Todos'||(typeOverrides[recipe.id]?typeOverrides[recipe.id]===category:customTypes.find(t=>t.name===category)?.recipeIds.includes(recipe.id)??matchesDishCategory(recipe,category));
  const saveType=()=>{
    const name=typeName.trim();
    if(!name||categories.some(c=>c.localeCompare(name,'es',{sensitivity:'base'})===0)){setTypeError('Escribe un nombre nuevo para el tipo.');return;}
    const next=[...customTypes,{name,recipeIds:typeRecipeIds}];
    try { localStorage.setItem('chef:custom-dish-types:v1',JSON.stringify(next)); } catch { setTypeError('No se ha podido guardar el tipo en este dispositivo.');return; }
    setCustomTypes(next);setDishCategory(name);setAddingType(false);setTypeName('');setTypeRecipeIds([]);setTypeError('');
  };
  const [cuisine,setCuisine]=useState('');
  const [alcohol,setAlcohol]=useState('all');
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
      .filter(recipe=>!removedIds.includes(recipe.id))
      .filter(recipe => !normalizedQuery || foodTextMatches([recipe.title,recipe.source?.label??'',...recipe.ingredients.map(i=>i.name)].join(' '),query))
      .filter(recipe => matchesType(recipe,dishCategory))
      .filter(recipe=>matchesCuisineFilter(recipe.cuisine,cuisine))
      .filter(recipe=>alcohol==='all'||recipe.recipeKind==='cocktail'&&recipe.alcohol===(alcohol==='yes'));
  }, [libraryRecipes, favorites, savedRecipes, query, tab, dishCategory,cuisine,alcohol,customTypes,removedIds,typeOverrides]);

  const historyYears = useMemo(() => Array.from(new Set(history.map(entry => String(new Date(entry.createdAt).getFullYear())))).sort((a, b) => Number(b) - Number(a)), [history]);
  const filteredHistory = useMemo(() => history.filter(entry => {
    const date = new Date(entry.createdAt);
    const recipe=entry.recipeId?getRecipeById(entry.recipeId):undefined;
    if(dishCategory!=='Todos'&&(!recipe||!matchesType(recipe,dishCategory)))return false;
    if(cuisine&&(!recipe||!matchesCuisineFilter(recipe.cuisine,cuisine)))return false;
    if(alcohol!=='all'&&(!recipe||recipe.recipeKind!=='cocktail'||recipe.alcohol!==(alcohol==='yes')))return false;
    if(query.trim()&&!foodTextMatches([recipe?.title??entry.label,...(recipe?.ingredients.map(i=>i.name)??[])].join(' '),query))return false;
    if(historyPeriod!=='all'&&date.getTime()<Date.now()-Number(historyPeriod)*86400000)return false;
    if (historyYear !== 'Todos' && String(date.getFullYear()) !== historyYear) return false;
    if (historyMonth !== 'Todos' && String(date.getMonth() + 1) !== historyMonth) return false;
    return true;
  }), [history, historyYear, historyMonth,dishCategory,query,cuisine,alcohol,customTypes,historyPeriod,typeOverrides]);

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
    if (!window.confirm(`¿Quitar “${recipe.title}” de Mis recetas? El historial se conservará y podrás recuperar las recetas quitadas.`)) return;
    if(updateRemoved([...removedIds,recipe.id]))setLastRemoved(recipe);
  };

  const confirmQuery = () => {
    if (voice.isListening) voice.stop();
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  const setDishTab = (nextTab: string) => setParams(nextTab === 'library' ? {} : { tab: nextTab });

  return (
    <AppShell>
      <ChefLoadingOverlay active={isRepeating} title="Preparando tu receta" messages={['Recuperando tus preferencias…','Preparando la receta completa…','Preparando la imagen…']} />
      <AlmPageHeader eyebrow="TU COCINA" title="Mis recetas" subtitle={`${libraryRecipes.filter(r=>r.recipeKind!=='cocktail').length} recetas y ${libraryRecipes.filter(r=>r.recipeKind==='cocktail').length} cócteles listos para preparar. Guarda tus favoritos y tus propias versiones.`} accent="Recetas de hoy, recuerdos de siempre"/>
      <div className="page-content nav-safe recipe-library-content">
            <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar recetas y cócteles…" /><div className="voice-inline-actions"><button type="button" className="clear-input-button" onClick={() => { voice.stop(); setQuery(''); }} disabled={!query.trim() && !voice.isListening} aria-label="Borrar búsqueda"><X size={17} /></button><button type="button" className={`voice-button ${voice.isListening ? 'listening' : ''}`} onClick={voice.toggle} disabled={!voice.isSupported || voice.isTranscribing} aria-label={voice.isListening ? 'Detener dictado' : 'Dictar búsqueda'}>{voice.isListening ? <MicOff size={18} /> : <Mic size={18} />}</button><button type="button" className="voice-confirm-button" onClick={confirmQuery} disabled={!query.trim() || voice.isListening || voice.isTranscribing} aria-label="Confirmar búsqueda"><Check size={18} /></button></div></div>
            {voice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando… toca de nuevo cuando termines.</div>}
            {voice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}
            {voice.error && <div className="voice-status error">{voice.error}</div>}
            <div className="library-filters">
              <label>Tipo<select aria-label="Tipo de receta" value={dishCategory} onChange={e=>{if(e.target.value==='__add_type__'){setTypeError('');setAddingType(true);}else{setDishCategory(e.target.value);setAlcohol('all')}}}>{categories.map(c=><option key={c}>{c}</option>)}<option value="__add_type__">Añadir tipo…</option></select></label>
              <label>Cocina<select aria-label="Filtrar por cocina" value={cuisine} onChange={e=>setCuisine(e.target.value)}><option value="">Todas las cocinas</option>{[...CUISINES,'Otras cocinas'].map(c=><option key={c}>{c}</option>)}</select></label>
              {dishCategory==='Cócteles'&&<label>Alcohol<select aria-label="Filtrar por alcohol" value={alcohol} onChange={e=>setAlcohol(e.target.value)}><option value="all">Todos</option><option value="yes">Con alcohol</option><option value="no">Sin alcohol</option></select></label>}

            </div>
            <dialog ref={typeDialog} className="recipe-type-dialog" aria-labelledby="new-type-title" onCancel={()=>setAddingType(false)} onClose={()=>setAddingType(false)}>
              <form className="custom-type-editor" onSubmit={e=>{e.preventDefault();saveType();}}>
                <h2 id="new-type-title">Nuevo tipo de comida</h2>
                <label>Nombre del tipo<input autoFocus value={typeName} maxLength={60} onChange={e=>setTypeName(e.target.value)}/></label>
                <details><summary>Incluir recetas (opcional)</summary><div className="custom-type-recipes">{libraryRecipes.map(r=><label key={r.id}><input type="checkbox" checked={typeRecipeIds.includes(r.id)} onChange={e=>setTypeRecipeIds(ids=>e.target.checked?[...ids,r.id]:ids.filter(id=>id!==r.id))}/>{r.title}</label>)}</div></details>
                <p>Se guardará en este dispositivo. Puedes cambiar el tipo desde cada receta.</p>
                {typeError&&<p role="alert">{typeError}</p>}
                <div className="recipe-type-actions"><button className="secondary-button" type="submit">Guardar tipo</button><button className="secondary-button" type="button" onClick={()=>setAddingType(false)}>Cancelar</button></div>
              </form>
            </dialog>
            <div className="library-tabs">
              <button aria-pressed={tab==='favorites'} className={tab==='favorites'?'active':''} onClick={()=>setDishTab(tab==='favorites'?'library':'favorites')}>Favoritos</button>
              <button aria-pressed={tab==='history'} className={tab==='history'?'active':''} onClick={()=>setDishTab(tab==='history'?'library':'history')}>Historial</button>
            </div>
            <button className="secondary-button library-import" onClick={()=>navigate('/importar-receta')}>Importar receta</button>
            {tab!=='library'&&<button className="library-back-all" onClick={()=>setDishTab('library')}>Ver todas las recetas</button>}
            {removeError&&<p role="alert">{removeError}</p>}
            {lastRemoved&&<div role="status">Se ha quitado «{lastRemoved.title}». <button onClick={()=>{if(updateRemoved(removedIds.filter(id=>id!==lastRemoved.id)))setLastRemoved(undefined)}}>Deshacer</button></div>}
            {removedIds.length>0&&<button className="library-back-all" onClick={()=>{if(updateRemoved([]))setLastRemoved(undefined)}}>Recuperar recetas quitadas ({removedIds.length})</button>}
            {tab !== 'history' && <>
            <section className="library-section">
              <div className="section-heading-row"><div><span className="eyebrow">{tab === 'library' ? 'BIBLIOTECA' : tab === 'favorites' ? 'FAVORITOS' : 'MIS RECETAS'}</span><h2>{tab==='library'? recipes.length+' recetas disponibles' : recipes.length ? (tab === 'favorites' ? 'Tus imprescindibles' : 'Recetas guardadas') : (tab === 'favorites' ? 'Todavía no hay favoritas' : 'Todavía no has guardado ninguna receta')}</h2></div></div>
              <div className="library-photo-grid">
                {recipes.map(recipe => (
                  <article className="library-photo-card" key={recipe.id}>
                    <button className="library-photo-open" aria-label={`Abrir ${recipe.title}`} onClick={() => navigate(`/receta/${recipe.id}`)}><RecipeThumbnail recipe={recipe} /><div className="library-photo-caption"><strong>{recipe.title}</strong><small><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min</small></div></button><button type="button" className="library-photo-heart" aria-label={`${favorites.includes(recipe.id)?'Quitar':'Marcar'} ${recipe.title} ${favorites.includes(recipe.id)?'de favoritos':'como favorita'}`} aria-pressed={favorites.includes(recipe.id)} onClick={()=>toggleFavorite(recipe.id)}><Heart size={20} fill={favorites.includes(recipe.id)?'currentColor':'none'}/></button>
                    <button type="button" className="library-delete" aria-label={`Quitar ${recipe.title} de Mis recetas`} onClick={event=>{event.stopPropagation();deleteRecipe(recipe)}}><Trash2 size={17}/></button>
                    <label className="recipe-card-type">Tipo<select aria-label={'Cambiar tipo de '+recipe.title} value={typeOverrides[recipe.id]??''} onChange={e=>changeRecipeType(recipe.id,e.target.value)}><option value="">Asignado por la app</option>{categories.filter(c=>c!=='Todos').map(c=><option key={c}>{c}</option>)}</select></label>
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
            <div className="history-filter-row">
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

