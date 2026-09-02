import { Clock3, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { mockRecipes } from '../data/mockRecipes';

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const recipes = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return mockRecipes;
    return mockRecipes.filter(recipe => normalize([
      recipe.title,
      recipe.description,
      recipe.cuisine,
      recipe.style,
      ...recipe.ingredients.map(ingredient => ingredient.name)
    ].join(' ')).includes(normalizedQuery));
  }, [query]);

  return (
    <AppShell>
      <div className="simple-page-header light-header"><span className="eyebrow">BUSCAR RECETAS</span><h1>Encuentra un plato</h1><p>Busca por nombre, ingrediente, estilo o tipo de cocina. Esta pantalla queda separada de la generación de propuestas del Chef.</p></div>
      <div className="page-content nav-safe">
        <div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej. pasta, pollo, italiana…" /></div>

        <section className="library-section">
          <div className="section-heading-row"><div><span className="eyebrow">RECETAS</span><h2>{recipes.length ? `${recipes.length} disponibles` : 'No hay coincidencias'}</h2></div></div>
          <div className="library-list">
            {recipes.map(recipe => (
              <button className="library-card" key={recipe.id} onClick={() => navigate(`/receta/${recipe.id}`)}>
                <span className="library-emoji">{recipe.emoji}</span>
                <div><strong>{recipe.title}</strong><small><Clock3 size={13} /> {recipe.prepMinutes + recipe.cookMinutes} min · {recipe.cuisine} · {recipe.style}</small></div>
              </button>
            ))}
            {!recipes.length && <div className="empty-card">Prueba con otro plato, ingrediente o cocina.</div>}
          </div>
        </section>

        <section className="editorial-card small-info"><div><strong>Siguiente fase</strong><p>La búsqueda local es el primer paso. La arquitectura queda preparada para incorporar resultados externos y usar esas fuentes como apoyo del motor de recetas.</p></div></section>
      </div>
    </AppShell>
  );
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
