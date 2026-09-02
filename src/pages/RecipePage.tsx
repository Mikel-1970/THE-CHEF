import { AlertTriangle, ChefHat, Clock3, Flame, Heart, Leaf, Play, ShieldCheck, ShoppingBasket, Sparkles, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { RecipeSourceNote } from '../components/RecipeSourceNote';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import type { RecipeIngredient } from '../domain/types';
import {
  evaluateRecipePantry,
  formatInsufficientIngredient,
  type PantryIngredientEvaluation
} from '../services/pantryEvaluation';
import { getRecipeById } from '../services/recipeCatalog';
import { getIngredientAlternatives } from '../services/substitutions';
import { formatQuantity, scaleQuantity } from '../utils/scaling';
import { formatDuration } from '../utils/time';

type IngredientAvailability = 'have' | 'missing' | 'substitute';

export function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    favorites,
    toggleFavorite,
    recordRecipeView,
    currentRequest,
    shoppingList,
    upsertShoppingItem,
    removeShoppingItem
  } = useApp();
  const recipe = getRecipeById(id);
  const [servings, setServings] = useState(currentRequest?.servings ?? recipe?.baseServings ?? 4);
  const [availability, setAvailability] = useState<Record<string, IngredientAvailability>>({});

  const sections = useMemo(() => {
    if (!recipe) return [] as Array<[string, RecipeIngredient[]]>;
    const grouped = new Map<string, RecipeIngredient[]>();
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.section || 'Ingredientes';
      grouped.set(key, [...(grouped.get(key) ?? []), ingredient]);
    });
    return Array.from(grouped.entries());
  }, [recipe]);

  const pantryEvaluations = useMemo(() => {
    if (!recipe || currentRequest?.mode !== 'pantry') return [] as PantryIngredientEvaluation[];
    return evaluateRecipePantry(recipe, { ...currentRequest, servings });
  }, [recipe, currentRequest, servings]);

  const pantryEvaluationByName = useMemo(
    () => new Map(pantryEvaluations.map(entry => [entry.ingredient.name, entry])),
    [pantryEvaluations]
  );

  useEffect(() => {
    if (!recipe) return;
    recordRecipeView(recipe.id, recipe.title);
  }, [recipe?.id]);

  useEffect(() => {
    if (!recipe) return;
    if (currentRequest?.mode !== 'pantry') {
      setAvailability({});
      return;
    }

    const next: Record<string, IngredientAvailability> = {};
    pantryEvaluations.forEach(evaluation => {
      const ingredient = evaluation.ingredient;
      const itemId = shoppingItemId(recipe.id, ingredient.name);

      if (evaluation.status === 'available') {
        next[ingredient.name] = 'have';
        removeShoppingItem(itemId);
        return;
      }

      if (evaluation.status === 'substituted') {
        next[ingredient.name] = 'substitute';
        removeShoppingItem(itemId);
        return;
      }

      next[ingredient.name] = 'missing';
      if (ingredient.optional) return;

      const quantity = evaluation.status === 'insufficient' && evaluation.shortage !== undefined
        ? evaluation.shortage
        : evaluation.requiredQuantity;
      upsertShoppingItem(toShoppingItem(recipe.id, recipe.title, ingredient, recipe.baseServings, servings, quantity));
    });

    setAvailability(next);
  }, [recipe?.id, currentRequest?.mode, servings, pantryEvaluations]);

  if (!recipe) return null;

  const isFavorite = favorites.includes(recipe.id);
  const total = recipe.prepMinutes + recipe.cookMinutes;
  const missingCount = recipe.ingredients.filter(ingredient => availability[ingredient.name] === 'missing' && !ingredient.optional).length;

  const setIngredientAvailability = (ingredient: RecipeIngredient, status: IngredientAvailability) => {
    setAvailability(current => ({ ...current, [ingredient.name]: status }));
    const itemId = shoppingItemId(recipe.id, ingredient.name);
    if (status === 'missing' && !ingredient.optional) {
      upsertShoppingItem(toShoppingItem(recipe.id, recipe.title, ingredient, recipe.baseServings, servings));
    } else {
      removeShoppingItem(itemId);
    }
  };

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
              <span><Clock3 size={16} /> {formatDuration(total)}</span>
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

          <RecipeSourceNote recipe={recipe} />
          <section className="trust-strip"><ShieldCheck size={18} /><div><strong>Comprueba lo que tienes</strong><span>La ficha respeta las cantidades indicadas, detecta si no alcanzan y propone sustituciones antes de añadir compras.</span></div></section>

          <section className="recipe-section">
            <div className="section-heading"><ShoppingBasket size={20} /><div><span className="eyebrow">01</span><h2>Ingredientes</h2></div></div>
            {sections.map(([section, ingredients]) => (
              <div className="ingredient-section" key={section}>
                <h3>{section}</h3>
                {ingredients.map(ingredient => {
                  const status = availability[ingredient.name];
                  const evaluation = pantryEvaluationByName.get(ingredient.name);
                  const scaledQuantity = scaleQuantity(ingredient, recipe.baseServings, servings);
                  const alternatives = status === 'missing'
                    ? getIngredientAlternatives(ingredient.name, recipe.substitutions, ingredient.optional)
                    : [];
                  return (
                    <div key={`${section}-${ingredient.name}`}>
                      <div className="recipe-ingredient">
                        <div style={{ minWidth: 0 }}>
                          <span>{ingredient.name}{ingredient.optional ? <small> opcional</small> : null}</span>
                          <div className="chip-row compact" style={{ marginTop: 7 }}>
                            <Chip selected={status === 'have'} onClick={() => setIngredientAvailability(ingredient, 'have')}>Tengo</Chip>
                            {evaluation?.substitute && (
                              <Chip selected={status === 'substitute'} onClick={() => setIngredientAvailability(ingredient, 'substitute')}>Usar {evaluation.substitute}</Chip>
                            )}
                            <Chip selected={status === 'missing'} onClick={() => setIngredientAvailability(ingredient, 'missing')}>Me falta</Chip>
                          </div>
                        </div>
                        <strong>{formatQuantity(scaledQuantity)} {ingredient.unit}</strong>
                      </div>

                      {evaluation?.status === 'substituted' && status === 'substitute' && (
                        <div className="pantry-basics-note" style={{ marginTop: 5, marginBottom: 10 }}>
                          <span>Sustitución disponible:</span> tienes {evaluation.substitute}; puedes usarlo en lugar de {ingredient.name}.
                        </div>
                      )}

                      {evaluation?.status === 'insufficient' && status === 'missing' && (
                        <div className="pantry-basics-note" style={{ marginTop: 5, marginBottom: 10 }}>
                          <span>Cantidad insuficiente:</span> {formatInsufficientIngredient(evaluation)}
                          {!ingredient.optional && <button onClick={() => navigate('/lista-compra')}>Ver lista</button>}
                        </div>
                      )}

                      {status === 'missing' && evaluation?.status !== 'insufficient' && (
                        <div className="pantry-basics-note" style={{ marginTop: 5, marginBottom: 10 }}>
                          <span>Alternativas:</span> {alternatives.join(' · ')}
                          {!ingredient.optional && <button onClick={() => navigate('/lista-compra')}>Ver lista</button>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {missingCount > 0 && <button className="advanced-toggle" onClick={() => navigate('/lista-compra')}><ShoppingBasket size={17} /> Ver lista de compra ({shoppingList.length})</button>}
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
            <div className="insight-card"><Leaf size={19} /><strong>Sustituciones generales</strong>{recipe.substitutions.map(p => <p key={p}>{p}</p>)}</div>
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

function normalize(value: string): string {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function shoppingItemId(recipeId: string, ingredientName: string): string {
  return `${recipeId}:${normalize(ingredientName).replace(/\s+/g, '-')}`;
}

function toShoppingItem(
  recipeId: string,
  recipeTitle: string,
  ingredient: RecipeIngredient,
  baseServings: number,
  servings: number,
  quantityOverride?: number
) {
  return {
    id: shoppingItemId(recipeId, ingredient.name),
    name: ingredient.name,
    quantity: quantityOverride ?? scaleQuantity(ingredient, baseServings, servings),
    unit: ingredient.unit,
    recipeId,
    recipeTitle,
    checked: false
  };
}
