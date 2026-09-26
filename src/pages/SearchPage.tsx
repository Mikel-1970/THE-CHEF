import {foodTextMatches,foodTitleScore} from '../utils/recipeSearch';
import { Check, ChevronDown, ChevronUp, Clock3, Globe2, Mic, MicOff, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useApp} from '../AppContext';
import {CookingOptions,cookingRequestOptions,type CookingOptionsValue} from '../components/CookingOptions';
import {RecipeThumbnail} from '../components/RecipeThumbnail';
import {recipeViolatesRestrictions} from '../services/restrictionGuard';
import {generateDirectRecipe} from '../services/directRecipeGateway';
import '../my-recipes.css';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import type { Difficulty } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { fetchExternalSearch, isExternalRecipeApiConfigured } from '../services/externalRecipeGateway';
import { getAllRecipes, registerExternalRecipes } from '../services/recipeCatalog';
import { formatDuration } from '../utils/time';
import '../voice-input.css';

const difficultyRank: Record<Difficulty, number> = { Fácil: 1, Media: 2, Avanzada: 3 };

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {settings,setSearch}=useApp();const navigate=useNavigate();
  const emptyOptions:CookingOptionsValue={servings:settings.defaultServings,restrictions:[],customRestriction:''};
  const [options,setOptions]=useState<CookingOptionsValue>(emptyOptions);
  const {cuisine,style,difficulty,maxMinutes,spiceLevel}=options;
  const restrictions=cookingRequestOptions(options).restrictions;
  const [generating,setGenerating]=useState(false);
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
        const textMatches = !words.length || foodTextMatches(haystack,query);
        const cuisineMatches = !cuisine || normalize(recipe.cuisine) === normalize(cuisine);
        const styleMatches = !style || normalize(recipe.style) === normalize(style);
        const difficultyMatches = !difficulty || difficultyRank[recipe.difficulty] <= difficultyRank[difficulty];
        const timeMatches = maxMinutes===undefined||recipe.prepMinutes + recipe.cookMinutes <= maxMinutes;
        const restrictionMatches=!recipeViolatesRestrictions(recipe,restrictions);
        const spicy=/guindilla|chile|cayena|sriracha|tabasco|picante/i.test(recipe.ingredients.filter(i=>!i.optional).map(i=>i.name).join(' '));
        const spiceMatches=!spiceLevel||(spiceLevel==='Nada'?!spicy:spicy);
        return Boolean(query.trim()) && textMatches && cuisineMatches && styleMatches && difficultyMatches && timeMatches && restrictionMatches && spiceMatches;
      })
      .sort((a, b) => foodTitleScore(b.title,query)-foodTitleScore(a.title,query)||(a.prepMinutes + a.cookMinutes) - (b.prepMinutes + b.cookMinutes));
  }, [catalog, query, options]);

  const activeFilters=[cuisine,style,difficulty,maxMinutes,spiceLevel,...restrictions].filter(v=>v!==undefined&&v!=='').length;
  const externalConfigured=isExternalRecipeApiConfigured();
  const clearFilters=()=>setOptions(emptyOptions);
  const generate=async()=>{
    if(!query.trim()||generating)return;setGenerating(true);setExternalMessage(undefined);
    const request={mode:'desire' as const,generationMode:'ai' as const,desireText:query.trim(),...cookingRequestOptions(options)};
    try{const result=await generateDirectRecipe(request);setSearch(request,[result.proposal]);navigate(`/receta/${result.recipe.id}?servings=${request.servings}`)}catch(e){setExternalMessage(e instanceof Error?e.message:'No se ha podido generar la receta.')}finally{setGenerating(false)}
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
      <ChefLoadingOverlay active={isSearchingExternal||generating} title={generating?"Creando tu receta":"Buscando recetas"} messages={['¡Oído cocina!', 'Buscando nuevas recetas…', 'Revisando opciones…', 'Comprobando resultados…']} />
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

        {filtersOpen && <><CookingOptions value={options} onChange={patch=>setOptions(v=>({...v,...patch}))} expanded hideServings/>{activeFilters>0&&<button className="secondary-button" onClick={clearFilters}>Limpiar filtros</button>}</>}

        {externalConfigured && <button className="secondary-button" style={{ marginTop: 14 }} onClick={searchExternal} disabled={isSearchingExternal||!query.trim()}><Globe2 size={17} /> {isSearchingExternal ? 'Consultando fuentes online…' : 'Buscar también en fuentes online'}</button>}
        {externalMessage && <div className="pantry-basics-note">{externalMessage}</div>}

        {query.trim()?<section className="library-section">
          <div className="section-heading-row"><div><span className="eyebrow">RECETAS</span><h2>{recipes.length?`${recipes.length} disponibles`:'No hay coincidencias'}</h2></div></div>
          {spiceLevel&&spiceLevel!=='Nada'&&<p>Recetas con ingredientes picantes. La intensidad se ajusta al personalizar o generar la receta.</p>}
          <div className="library-photo-grid">{recipes.map(recipe=><article className="library-photo-card" key={recipe.id}><Link className="library-photo-open" to={`/receta/${recipe.id}`} aria-label={`Abrir receta ${recipe.title}`}><RecipeThumbnail recipe={recipe}/><div className="library-photo-caption"><strong>{recipe.title}</strong><small><Clock3 size={13}/> {formatDuration(recipe.prepMinutes+recipe.cookMinutes)} · {recipe.cuisine}</small></div></Link></article>)}</div>
          {!recipes.length&&<p className="empty-card">Prueba otros términos o genera una receta con tus preferencias.</p>}
          <button className="secondary-button" style={{marginTop:16}} disabled={generating||isSearchingExternal} onClick={()=>void generate()}><Sparkles size={18}/> Generar una receta con IA</button>
        </section>:<p className="empty-card">Escribe un plato o ingrediente para encontrar recetas.</p>}
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
