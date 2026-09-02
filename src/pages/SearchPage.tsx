import { ChevronDown, ChevronUp, Clock3, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { CuisineSelect } from '../components/CuisineSelect';
import { RECIPE_STYLES } from '../data/cookingOptions';
import { mockRecipes } from '../data/mockRecipes';
import type { Difficulty } from '../domain/types';
import { formatDuration } from '../utils/time';

const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];
const difficultyRank: Record<Difficulty, number> = { Fácil: 1, Media: 2, Avanzada: 3 };

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cuisine, setCuisine] = useState<string>();
  const [style, setStyle] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty>();
  const [maxMinutes, setMaxMinutes] = useState(120);

  const recipes = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);

    return mockRecipes
      .filter(recipe => {
        const haystack = normalize([
          recipe.title,
          recipe.description,
          recipe.cuisine,
          recipe.style,
          ...recipe.ingredients.map(ingredient => ingredient.name)
        ].join(' '));

        const textMatches = !words.length || words.every(word => haystack.includes(word));
        const cuisineMatches = !cuisine || normalize(recipe.cuisine) === normalize(cuisine);
        const styleMatches = !style || normalize(recipe.style) === normalize(style);
        const difficultyMatches = !difficulty || difficultyRank[recipe.difficulty] <= difficultyRank[difficulty];
        const timeMatches = recipe.prepMinutes + recipe.cookMinutes <= maxMinutes;

        return textMatches && cuisineMatches && styleMatches && difficultyMatches && timeMatches;
      })
      .sort((a, b) => (a.prepMinutes + a.cookMinutes) - (b.prepMinutes + b.cookMinutes));
  }, [query, cuisine, style, difficulty, maxMinutes]);

  const activeFilters = [cuisine, style, difficulty, maxMinutes < 120 ? String(maxMinutes) : undefined].filter(Boolean).length;

  const clearFilters = () => {
    setCuisine(undefined);
    setStyle(undefined);
    setDifficulty(undefined);
    setMaxMinutes(120);
  };

  return (
    <AppShell>
      <div className="simple-page-header light-header">
        <span className="eyebrow">BUSCAR RECETAS</span>
        <h1>Encuentra un plato</h1>
        <p>Busca por nombre, ingrediente, estilo o tipo de cocina.</p>
      </div>

      <div className="page-content nav-safe">
        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ej. pasta pollo, italiana, calabacín…"
          />
        </div>

        <button className="advanced-toggle" onClick={() => setFiltersOpen(value => !value)}>
          <span><SlidersHorizontal size={17} /> Filtros{activeFilters ? ` · ${activeFilters}` : ''}</span>
          {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {filtersOpen && (
          <section className="advanced-panel">
            <div className="advanced-group">
              <strong>Tiempo máximo</strong>
              <div className="range-row">
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={maxMinutes}
                  onChange={e => setMaxMinutes(Number(e.target.value))}
                />
                <span>{formatDuration(maxMinutes)}</span>
              </div>
            </div>

            <div className="advanced-group">
              <strong>Tipo de cocina</strong>
              <CuisineSelect value={cuisine} onChange={setCuisine} />
            </div>

            <div className="advanced-group">
              <strong>Estilo</strong>
              <div className="chip-row">
                {RECIPE_STYLES.map(value => (
                  <Chip key={value} selected={style === value} onClick={() => setStyle(style === value ? undefined : value)}>
                    {value}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="advanced-group">
              <strong>Dificultad máxima</strong>
              <div className="chip-row">
                {difficulties.map(value => (
                  <Chip key={value} selected={difficulty === value} onClick={() => setDifficulty(difficulty === value ? undefined : value)}>
                    {value}
                  </Chip>
                ))}
              </div>
            </div>

            {activeFilters > 0 && (
              <button className="secondary-button" onClick={clearFilters}>Limpiar filtros</button>
            )}
          </section>
        )}

        <section className="library-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">RECETAS</span>
              <h2>{recipes.length ? `${recipes.length} disponibles` : 'No hay coincidencias'}</h2>
            </div>
          </div>

          <div className="library-list">
            {recipes.map(recipe => (
              <Link className="library-card" key={recipe.id} to={`/receta/${recipe.id}`} aria-label={`Abrir receta ${recipe.title}`}>
                <span className="library-emoji">{recipe.emoji}</span>
                <div>
                  <strong>{recipe.title}</strong>
                  <small>
                    <Clock3 size={13} /> {formatDuration(recipe.prepMinutes + recipe.cookMinutes)} · {recipe.cuisine} · {recipe.style}
                  </small>
                </div>
              </Link>
            ))}
            {!recipes.length && <div className="empty-card">Prueba con otros términos o amplía los filtros.</div>}
          </div>
        </section>

        <section className="editorial-card small-info">
          <div>
            <strong>Búsqueda local V1</strong>
            <p>La siguiente evolución incorporará fuentes externas como apoyo del motor de recetas, sin sustituir los controles de coherencia culinaria de la app.</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
