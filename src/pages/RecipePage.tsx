import { AlertTriangle, Bookmark, ChefHat, Clock3, Flame, Heart, Leaf, Play, ShieldCheck, ShoppingBasket, Sparkles, UsersRound, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
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
import { getRecipeById, rememberActiveRecipe, rememberLibraryRecipe } from '../services/recipeCatalog';
import { getIngredientAlternatives } from '../services/substitutions';
import { formatQuantity, scaleQuantity } from '../utils/scaling';
import { formatDuration } from '../utils/time';
import '../recipe-enhancements.css';

type IngredientAvailability = 'have' | 'missing' | 'substitute';
type RecipePanel = 'ingredients' | 'prep' | 'steps' | 'critical' | 'recommendations' | null;

export function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    favorites,
    savedRecipes,
    toggleFavorite,
    toggleSavedRecipe,
    recordRecipeView,
    currentRequest,
    shoppingList,
    upsertShoppingItem,
    removeShoppingItem,
    clearShoppingList
  } = useApp();
  const recipe = getRecipeById(id);
  const [servings, setServings] = useState(currentRequest?.servings ?? recipe?.baseServings ?? 4);
  const [availabilityOverrides, setAvailabilityOverrides] = useState<Record<string, IngredientAvailability>>({});
  const [activePanel, setActivePanel] = useState<RecipePanel>(null);

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

  const automaticAvailability = useMemo(() => {
    const next: Record<string, IngredientAvailability> = {};
    pantryEvaluations.forEach(evaluation => {
      next[evaluation.ingredient.name] = evaluation.status === 'available'
        ? 'have'
        : evaluation.status === 'substituted'
          ? 'substitute'
          : 'missing';
    });
    return next;
  }, [pantryEvaluations]);

  const availabilityFor = (ingredientName: string): IngredientAvailability | undefined =>
    availabilityOverrides[ingredientName] ?? automaticAvailability[ingredientName];

  useEffect(() => {
    if (!recipe) return;
    recordRecipeView(recipe.id, recipe.title);
    rememberActiveRecipe(recipe);
    rememberLibraryRecipe(recipe);
  }, [recipe?.id]);

  useEffect(() => {
    if (!recipe) return;
    const hasItemsFromAnotherRecipe = shoppingList.some(item => item.recipeId !== recipe.id);
    if (hasItemsFromAnotherRecipe) clearShoppingList();
  }, [recipe?.id]);

  useEffect(() => {
    if (!recipe) return;

    recipe.ingredients.forEach(ingredient => {
      const itemId = shoppingItemId(recipe.id, ingredient.name);
      const evaluation = pantryEvaluationByName.get(ingredient.name);
      const override = availabilityOverrides[ingredient.name];
      const status = override ?? automaticAvailability[ingredient.name];

      if (!status) return;

      if (status === 'have' || status === 'substitute') {
        removeShoppingItem(itemId);
        return;
      }

      if (status === 'missing' && !ingredient.optional) {
        const quantity = override === 'missing'
          ? scaleQuantity(ingredient, recipe.baseServings, servings)
          : evaluation?.status === 'insufficient' && evaluation.shortage !== undefined
            ? evaluation.shortage
            : evaluation?.requiredQuantity ?? scaleQuantity(ingredient, recipe.baseServings, servings);
        upsertShoppingItem(toShoppingItem(recipe.id, recipe.title, ingredient, recipe.baseServings, servings, quantity));
      }
    });
  }, [recipe?.id, servings, pantryEvaluationByName, automaticAvailability, availabilityOverrides]);

  useEffect(() => {
    if (!activePanel) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activePanel]);

  if (!recipe) {
    return (
      <AppShell>
        <div className="page-content nav-safe">
          <section className="editorial-card">
            <h2>Esta receta no está disponible.</h2>
            <p>Vuelve a tus propuestas o a Mis recetas para continuar.</p>
            <button className="secondary-button" type="button" onClick={() => navigate('/propuestas')}>Volver a propuestas</button>
          </section>
        </div>
      </AppShell>
    );
  }

  const isFavorite = favorites.includes(recipe.id);
  const isSaved = savedRecipes.includes(recipe.id);
  const total = recipe.prepMinutes + recipe.cookMinutes;
  const missingCount = recipe.ingredients.filter(ingredient => availabilityFor(ingredient.name) === 'missing' && !ingredient.optional).length;

  const setIngredientAvailability = (ingredient: RecipeIngredient, status: IngredientAvailability) => {
    setAvailabilityOverrides(current => ({ ...current, [ingredient.name]: status }));
  };

  const startCooking = () => {
    rememberActiveRecipe(recipe);
    navigate(`/cocinar/${recipe.id}?servings=${servings}`);
  };

  const ingredientPanel = (
    <>
      <div className="panel-intro">
        <p>Marca lo que ya tienes. Lo que falte se añade automáticamente a la lista de compra.</p>
      </div>
      {sections.map(([section, ingredients]) => (
        <div className="ingredient-section" key={section}>
          <h3>{section}</h3>
          {ingredients.map(ingredient => {
            const status = availabilityFor(ingredient.name);
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
      {missingCount > 0 && (
        <button className="advanced-toggle full-panel-action" onClick={() => navigate('/lista-compra')}>
          <ShoppingBasket size={17} /> Ver lista de compra ({shoppingList.length})
        </button>
      )}
    </>
  );

  const panelConfig: Record<Exclude<RecipePanel, null>, { title: string; eyebrow: string; content: ReactNode }> = {
    ingredients: {
      title: 'Ingredientes',
      eyebrow: 'LO QUE NECESITAS',
      content: ingredientPanel
    },
    prep: {
      title: 'Antes de empezar',
      eyebrow: 'MISE EN PLACE',
      content: <ol className="expanded-list">{recipe.miseEnPlace.map((item, i) => <li key={`${item}-${i}`}><strong>{i + 1}.</strong> {item}</li>)}</ol>
    },
    steps: {
      title: 'Elaboración',
      eyebrow: 'RESUMEN DE PASOS',
      content: (
        <div className="steps-preview panel-steps">
          {recipe.steps.map((step, i) => (
            <div className="step-row" key={`${step.number}-${i}`}>
              <span className="step-number">{String(step.number).padStart(2, '0')}</span>
              <div><p>{step.instruction}</p>{step.cue && <small>{step.cue}</small>}</div>
              {step.minutes && <span className="step-time">{step.minutes}′</span>}
            </div>
          ))}
        </div>
      )
    },
    critical: {
      title: 'Puntos críticos',
      eyebrow: 'PARA QUE SALGA BIEN',
      content: <div className="panel-advice warning">{recipe.criticalPoints.map((point, i) => <p key={`${point}-${i}`}><AlertTriangle size={17} /> <span>{point}</span></p>)}</div>
    },
    recommendations: {
      title: 'Recomendaciones',
      eyebrow: 'CONSEJOS Y SUSTITUCIONES',
      content: <div className="panel-advice">{recipe.substitutions.map((point, i) => <p key={`${point}-${i}`}><Leaf size={17} /> <span>{point}</span></p>)}</div>
    }
  };

  const currentPanel = activePanel ? panelConfig[activePanel] : null;

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
          <section className="nutrition-card nutrition-card-priority">
            <div><span className="eyebrow">INFORMACIÓN NUTRICIONAL APROXIMADA</span><h2>Por ración</h2></div>
            <div className="nutrition-grid">
              <div><strong>{recipe.nutritionPerServing.kcal}</strong><span>kcal</span></div>
              <div><strong>{recipe.nutritionPerServing.proteinG} g</strong><span>proteína</span></div>
              <div><strong>{recipe.nutritionPerServing.carbsG} g</strong><span>hidratos</span></div>
              <div><strong>{recipe.nutritionPerServing.fatG} g</strong><span>grasas</span></div>
            </div>
          </section>

          <section className="servings-card">
            <div><span className="eyebrow">COMENSALES</span><strong>Ajusta la receta</strong></div>
            <NumberStepper value={servings} onChange={setServings} />
          </section>

          <button className="secondary-button" type="button" onClick={() => toggleSavedRecipe(recipe.id)}>
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Guardada en Mis recetas' : 'Guardar receta'}
          </button>

          <RecipeSourceNote recipe={recipe} />

          <section className="recipe-action-grid" aria-label="Información de la receta">
            <button type="button" onClick={() => setActivePanel('ingredients')}><ShoppingBasket size={22} /><strong>Ingredientes</strong><span>Lo que tienes y lo que falta</span></button>
            <button type="button" onClick={() => setActivePanel('prep')}><Sparkles size={22} /><strong>Antes de empezar</strong><span>Preparación previa</span></button>
            <button type="button" onClick={() => setActivePanel('steps')}><Flame size={22} /><strong>Elaboración</strong><span>Resumen de los pasos</span></button>
            <button type="button" onClick={() => setActivePanel('critical')}><AlertTriangle size={22} /><strong>Puntos críticos</strong><span>Lo importante para acertar</span></button>
            <button type="button" onClick={() => setActivePanel('recommendations')}><Leaf size={22} /><strong>Recomendaciones</strong><span>Consejos y sustituciones</span></button>
          </section>

          <section className="trust-strip compact-trust-strip">
            <ShieldCheck size={18} />
            <div><strong>Todo preparado</strong><span>Revisa solo los apartados que necesites y, cuando estés listo, entra en el modo cocina paso a paso.</span></div>
          </section>

          <div className="cook-cta">
            <button onClick={startCooking}><Play size={20} fill="currentColor" /> Empezar a cocinar</button>
          </div>
        </div>
      </div>

      {currentPanel && (
        <div className="recipe-panel-backdrop" role="presentation" onClick={() => setActivePanel(null)}>
          <section className="recipe-panel-sheet" role="dialog" aria-modal="true" aria-label={currentPanel.title} onClick={event => event.stopPropagation()}>
            <header className="recipe-panel-header">
              <div><span className="eyebrow">{currentPanel.eyebrow}</span><h2>{currentPanel.title}</h2></div>
              <button type="button" onClick={() => setActivePanel(null)} aria-label="Cerrar"><X size={22} /></button>
            </header>
            <div className="recipe-panel-body">{currentPanel.content}</div>
          </section>
        </div>
      )}
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
