import { Clock3, Heart, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';
import type { CookingRequest, HistoryEntry, Recipe } from '../domain/types';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { getAllRecipes, getRecipeById } from '../services/recipeCatalog';
import '../my-recipes.css';

export function MyRecipesPage() {
  const navigate = useNavigate();
  const { favorites, history, settings, setSearch, toggleFavorite, removeHistoryEntry, removeRecipeFromLibrary } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const tab = params.get('tab') ?? 'all';

  const recentRecipeIds = useMemo(
    () => history.filter(entry => entry.kind === 'recipe' && entry.recipeId).map(entry => entry.recipeId as string),
    [history]
  );

  const recipes = useMemo(() => {
    const ids = tab === 'favorites'
      ? favorites
      : Array.from(new Set([...recentRecipeIds, ...favorites]));
    const normalizedQuery = query.trim().toLocaleLowerCase('es');
    const catalog = getAllRecipes();
    return ids
      .map(id => catalog.find(recipe => recipe.id === id))
      .filter((recipe): recipe is Recipe => Boolean(recipe))
      .filter(recipe => !normalizedQuery || recipe.title.toLocaleLowerCase('es').includes(normalizedQuery));
  }, [favorites, recentRecipeIds, query, tab]);

  const repeatSearch = async (entry: HistoryEntry) => {
    const request = entry.request ?? buildLegacyRequest(entry, settings.defaultServings, settings.pantryBasics);
    const result = await getHybridProposals(request);
    setSearch(request, result.proposals);
    navigate('/propuestas');
  };

  const deleteRecipe = (recipe: Recipe) => {
    const isExternal = recipe.source?.kind === 'ai' || recipe.source?.kind === 'web';
    const message = isExternal
      ? `¿Eliminar “${recipe.title}” de Mis recetas, Favoritos e Historial? La receta generada también se borrará de este dispositivo.`
      : `¿Quitar “${recipe.title}” de Mis recetas, Favoritos e Historial?`;
    if (!window.confirm(message)) return;
    removeRecipeFromLibrary(recipe.id);
  };

  return (
    <AppShell>
      <div className="simple-page-header light-header"><span className="eyebrow">TU COCINA</span><h1>Mis recetas</h1><p>Favoritas, recetas consultadas y búsquedas recientes para volver a ellas cuando quieras.</p></div>
      <div className="page-content nav-safe">
        <div className="library-tabs">
          <button className={tab === 'all' ? 'active' : ''} onClick={() => setParams({})}>Todo</button>
          <button className={tab === 'favorites' ? 'active' : ''} onClick={() => setParams({ tab: 'favorites' })}>Favoritas</button>
          <button className={tab === 'history' ? 'active' : ''} onClick={() => setParams({ tab: 'history' })}>Historial</button>
        </div>

        {tab !== 'history' && <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar en mis recetas…" /></div>}

        {tab !== 'history' && (
          <section className="library-section">
            <div className="section-heading-row"><div><span className="eyebrow">{tab === 'favorites' ? 'FAVORITAS' : 'MIS RECETAS'}</span><h2>{recipes.length ? (tab === 'favorites' ? 'Tus imprescindibles' : 'Tus recetas recientes') : (tab === 'favorites' ? 'Todavía no hay favoritas' : 'Todavía no hay recetas consultadas')}</h2></div><Heart size={20} /></div>
            <div className="library-list">
              {recipes.map(recipe => (
                <div className="library-card" key={recipe.id} role="button" tabIndex={0} onClick={() => navigate(`/receta/${recipe.id}`)} onKeyDown={event => event.key === 'Enter' && navigate(`/receta/${recipe.id}`)}>
                  <span className="library-emoji">{recipe.emoji}</span>
                  <div style={{ minWidth: 0, flex: 1 }}><strong>{recipe.title}</strong><small><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min · {recipe.cuisine}</small></div>
                  <button
                    type="button"
                    className="library-delete"
                    aria-label={tab === 'favorites' ? `Quitar ${recipe.title} de favoritos` : `Borrar ${recipe.title}`}
                    onClick={event => {
                      event.stopPropagation();
                      if (tab === 'favorites') toggleFavorite(recipe.id);
                      else deleteRecipe(recipe);
                    }}
                  ><Trash2 size={17} /></button>
                </div>
              ))}
              {!recipes.length && <div className="empty-card">{tab === 'favorites' ? 'Marca una receta con ♥ y aparecerá aquí.' : 'Abre una receta y aparecerá aquí automáticamente.'}</div>}
            </div>
          </section>
        )}

        {tab !== 'favorites' && (
          <section className="library-section">
            <div className="section-heading-row"><div><span className="eyebrow">HISTORIAL</span><h2>Actividad reciente</h2></div></div>
            <div className="history-list">
              {history.slice(0, 20).map(entry => {
                const recipe = entry.recipeId ? getRecipeById(entry.recipeId) : undefined;
                const date = new Date(entry.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

                if (entry.kind === 'recipe') {
                  return (
                    <div className="history-card" key={entry.id} role={recipe ? 'button' : undefined} tabIndex={recipe ? 0 : undefined} onClick={() => recipe && navigate(`/receta/${recipe.id}`)} onKeyDown={event => recipe && event.key === 'Enter' && navigate(`/receta/${recipe.id}`)}>
                      <span>{recipe ? 'Receta' : 'Receta no disponible'}</span>
                      <strong>{recipe?.title ?? entry.label}</strong>
                      <small>{date} · {recipe ? 'Abrir receta' : 'Puedes eliminar esta entrada antigua'}</small>
                      <button className="history-delete" type="button" aria-label="Borrar del historial" onClick={event => { event.stopPropagation(); removeHistoryEntry(entry.id); }}><Trash2 size={16} /></button>
                    </div>
                  );
                }

                return (
                  <div className="history-card" role="button" tabIndex={0} key={entry.id} onClick={() => repeatSearch(entry)} onKeyDown={event => event.key === 'Enter' && repeatSearch(entry)}>
                    <span>{entry.mode === 'pantry' ? 'Nevera' : 'Chef'}</span>
                    <strong>{entry.label}</strong>
                    <small>{date} · Repetir búsqueda</small>
                    <button className="history-delete" type="button" aria-label="Borrar del historial" onClick={event => { event.stopPropagation(); removeHistoryEntry(entry.id); }}><Trash2 size={16} /></button>
                  </div>
                );
              })}
              {!history.length && <div className="empty-card">Las recetas que consultes y tus búsquedas aparecerán aquí.</div>}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function buildLegacyRequest(entry: HistoryEntry, servings: number, pantryBasics: string[]): CookingRequest {
  if (entry.mode === 'pantry') {
    return {
      mode: 'pantry',
      servings,
      maxMinutes: 60,
      pantryIngredients: entry.label.split(',').map(name => ({ name: name.trim() })).filter(item => item.name),
      pantryBasics
    };
  }

  return {
    mode: 'desire',
    servings,
    maxMinutes: 60,
    desireText: entry.label
  };
}
