import { Clock3, Heart, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';
import type { CookingRequest, HistoryEntry, Recipe } from '../domain/types';
import { getHybridProposals } from '../services/hybridRecommendationEngine';
import { getAllRecipes, getRecipeById } from '../services/recipeCatalog';
import '../my-recipes.css';

export function MyRecipesPage() {
  const navigate = useNavigate();
  const { favorites, history, settings, setSearch } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const tab = params.get('tab') ?? 'all';

  const recentRecipeIds = useMemo(
    () => history.filter(entry => entry.recipeId).map(entry => entry.recipeId as string),
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
                <Link className="library-card" key={recipe.id} to={`/receta/${recipe.id}`} aria-label={`Abrir receta ${recipe.title}`}>
                  <span className="library-emoji">{recipe.emoji}</span>
                  <div><strong>{recipe.title}</strong><small><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min · {recipe.cuisine}</small></div>
                </Link>
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

                if (recipe) {
                  return (
                    <Link className="history-card" key={entry.id} to={`/receta/${recipe.id}`} aria-label={`Abrir receta ${recipe.title}`}>
                      <span>Receta</span>
                      <strong>{recipe.title}</strong>
                      <small>{date} · Abrir receta</small>
                    </Link>
                  );
                }

                return (
                  <button className="history-card" type="button" key={entry.id} onClick={() => repeatSearch(entry)}>
                    <span>{entry.mode === 'pantry' ? 'Nevera' : 'Chef'}</span>
                    <strong>{entry.label}</strong>
                    <small>{date} · Repetir búsqueda</small>
                  </button>
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
