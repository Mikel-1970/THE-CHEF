import { AlertTriangle, ChefHat, Clock3, Flame, Heart, Leaf, Play, ShieldCheck, ShoppingBasket, Sparkles, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { NumberStepper } from '../components/NumberStepper';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import { mockRecipes } from '../data/mockRecipes';
import { formatQuantity, scaleQuantity } from '../utils/scaling';

export function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite, currentRequest } = useApp();
  const recipe = mockRecipes.find(r => r.id === id);
  const [servings, setServings] = useState(currentRequest?.servings ?? recipe?.baseServings ?? 4);
  if (!recipe) return null;

  const sections = useMemo(() => {
    const grouped = new Map<string, typeof recipe.ingredients>();
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.section || 'Ingredientes';
      grouped.set(key, [...(grouped.get(key) ?? []), ingredient]);
    });
    return Array.from(grouped.entries());
  }, [recipe]);

  const isFavorite = favorites.includes(recipe.id);
  const total = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <AppShell hideNav>
      <TopBar eyebrow="RECETA" title="Lista para cocinar" />
      <div className="recipe-page">
        <section className="recipe-hero">
          <div className="recipe-hero-art">
            <span>{recipe.emoji}</span>
            <div className="hero-glow" />
          </div>
          <button className={`floating-heart ${isFavorite ? 'active' : ''}`} onClick={() => toggleFavorite(recipe.id)} aria-label="Favorito">
            <Heart size={21} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <div className="recipe-title-block">
            <span className="eyebrow light">{recipe.cuisine.toUpperCase()} · {recipe.style.toUpperCase()}</span>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            <div className="hero-meta">
              <span><Clock3 size={16} /> {total} min</span>
              <span><ChefHat size={16} /> {recipe.difficulty}</span>
              <span><UsersRound size={16} /> {servings}</span>
            </div>
          </div>
        </section>

        <div className="recipe-content">
          <section className="servings-card">
            <div><span className="eyebrow">COMENSALES</span><strong>Ajusta la receta</strong></div>
            <NumberStepper value={servings} onChange={setServings} />
          </section>

          <section className="trust-strip"><ShieldCheck size={18} /><div><strong>Prototipo estructurado</strong><span>En la versión con IA, las recetas nuevas pasarán validación automática.</span></div></section>

          <section className="recipe-section">
            <div className="section-heading"><ShoppingBasket size={20} /><div><span className="eyebrow">01</span><h2>Ingredientes</h2></div></div>
            {sections.map(([section, ingredients]) => (
              <div className="ingredient-section" key={section}>
                <h3>{section}</h3>
                {ingredients.map(ingredient => (
                  <div className="recipe-ingredient" key={`${section}-${ingredient.name}`}>
                    <span>{ingredient.name}{ingredient.optional ? <small> opcional</small> : null}</span>
                    <strong>{formatQuantity(scaleQuantity(ingredient, recipe.baseServings, servings))} {ingredient.unit}</strong>
                  </div>
                ))}
              </div>
            ))}
          </section>

          <section className="recipe-section tinted">
            <div className="section-heading"><Sparkles size={20} /><div><span className="eyebrow">02</span><h2>Antes de empezar</h2></div></div>
            <ol className="mise-list">{recipe.miseEnPlace.map((item, i) => <li key={item}><span>{i + 1}</span>{item}</li>)}</ol>
          </section>

          <section className="recipe-section">
            <div className="section-heading"><Flame size={20} /><div><span className="eyebrow">03</span><h2>Elaboración</h2></div></div>
            <div className="steps-preview">
              {recipe.steps.map(step => (
                <div className="step-row" key={step.number}>
                  <span className="step-number">{String(step.number).padStart(2, '0')}</span>
                  <div><p>{step.instruction}</p>{step.cue && <small>{step.cue}</small>}</div>
                  {step.minutes && <span className="step-time">{step.minutes}′</span>}
                </div>
              ))}
            </div>
          </section>

          <section className="insight-grid">
            <div className="insight-card warning"><AlertTriangle size={19} /><strong>Puntos críticos</strong>{recipe.criticalPoints.map(p => <p key={p}>{p}</p>)}</div>
            <div className="insight-card"><Leaf size={19} /><strong>Sustituciones</strong>{recipe.substitutions.map(p => <p key={p}>{p}</p>)}</div>
          </section>

          <section className="nutrition-card">
            <div><span className="eyebrow">VALORES APROXIMADOS</span><h2>Por ración</h2></div>
            <div className="nutrition-grid">
              <div><strong>{recipe.nutritionPerServing.kcal}</strong><span>kcal</span></div>
              <div><strong>{recipe.nutritionPerServing.proteinG} g</strong><span>proteína</span></div>
              <div><strong>{recipe.nutritionPerServing.carbsG} g</strong><span>hidratos</span></div>
              <div><strong>{recipe.nutritionPerServing.fatG} g</strong><span>grasas</span></div>
            </div>
          </section>

          <div className="cook-cta">
            <button onClick={() => navigate(`/cocinar/${recipe.id}?servings=${servings}`)}><Play size={20} fill="currentColor" /> Empezar a cocinar</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
