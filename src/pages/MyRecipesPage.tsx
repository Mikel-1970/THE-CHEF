import { Clock3, Heart, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';
import { mockRecipes } from '../data/mockRecipes';

export function MyRecipesPage() {
  const navigate = useNavigate();
  const { favorites, history } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const tab = params.get('tab') ?? 'all';
  const recipes = useMemo(() => mockRecipes.filter(r => favorites.includes(r.id) && r.title.toLowerCase().includes(query.toLowerCase())), [favorites, query]);

  return (
    <AppShell>
      <div className="simple-page-header light-header"><span className="eyebrow">TU COCINA</span><h1>Mis recetas</h1><p>Favoritas, búsquedas recientes y todo lo que quieras volver a consultar.</p></div>
      <div className="page-content nav-safe">
        <div className="library-tabs">
          <button className={tab === 'all' ? 'active' : ''} onClick={() => setParams({})}>Todo</button>
          <button className={tab === 'favorites' ? 'active' : ''} onClick={() => setParams({ tab: 'favorites' })}>Favoritas</button>
          <button className={tab === 'history' ? 'active' : ''} onClick={() => setParams({ tab: 'history' })}>Historial</button>
        </div>

        {tab !== 'history' && <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar en mis recetas…" /></div>}

        {tab !== 'history' && (
          <section className="library-section">
            <div className="section-heading-row"><div><span className="eyebrow">FAVORITAS</span><h2>{recipes.length ? 'Tus imprescindibles' : 'Todavía no hay favoritas'}</h2></div><Heart size={20} /></div>
            <div className="library-list">
              {recipes.map(recipe => (
                <button className="library-card" key={recipe.id} onClick={() => navigate(`/receta/${recipe.id}`)}>
                  <span className="library-emoji">{recipe.emoji}</span>
                  <div><strong>{recipe.title}</strong><small><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min · {recipe.cuisine}</small></div>
                </button>
              ))}
              {!recipes.length && <div className="empty-card">Marca una receta con ♥ y aparecerá aquí.</div>}
            </div>
          </section>
        )}

        {tab !== 'favorites' && (
          <section className="library-section">
            <div className="section-heading-row"><div><span className="eyebrow">HISTORIAL</span><h2>Últimas búsquedas</h2></div></div>
            <div className="history-list">
              {history.slice(0, 12).map(entry => <div key={entry.id}><span>{entry.mode === 'pantry' ? 'Nevera' : 'Antojo'}</span><strong>{entry.label}</strong><small>{new Date(entry.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></div>)}
              {!history.length && <div className="empty-card">Tus búsquedas aparecerán aquí.</div>}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
