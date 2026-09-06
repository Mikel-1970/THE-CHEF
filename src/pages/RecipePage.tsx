import { AlertTriangle, Bookmark, Check, ChefHat, Clock3, Heart, Leaf, Mic, MicOff, Play, Share2, ShieldCheck, ShoppingBasket, Sparkles, UsersRound, WandSparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { NumberStepper } from '../components/NumberStepper';
import { RecipeSourceNote } from '../components/RecipeSourceNote';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import type { RecipeIngredient } from '../domain/types';
import { useAiDictation } from '../hooks/useAiDictation';
import { reviseAiRecipe } from '../services/aiProposalGateway';
import { getRecipeImage } from '../services/mediaGateway';
import { shareRecipePdf } from '../services/recipePdf';
import { getRecipeById, registerExternalRecipes, rememberActiveRecipe, rememberLibraryRecipe } from '../services/recipeCatalog';
import { formatQuantity, scaleQuantity } from '../utils/scaling';
import { formatDuration } from '../utils/time';
import '../recipe-enhancements.css';
import '../voice-input.css';

type RecipePanel = 'ingredients' | 'prep' | 'critical' | 'recommendations' | null;

export function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, savedRecipes, toggleFavorite, toggleSavedRecipe, recordRecipeView, currentRequest, shoppingList, upsertShoppingItem, removeShoppingItem } = useApp();
  const recipe = getRecipeById(id);
  const [servings, setServings] = useState(currentRequest?.servings ?? recipe?.baseServings ?? 4);
  const [activePanel, setActivePanel] = useState<RecipePanel>(null);
  const [missing, setMissing] = useState<Set<string>>(() => new Set());
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [revisionText, setRevisionText] = useState('');
  const [revisionError, setRevisionError] = useState<string>();
  const [isRevising, setIsRevising] = useState(false);
  const [sharingPdf, setSharingPdf] = useState(false);
  const [shareStatus, setShareStatus] = useState<string>();
  const revisionVoice = useAiDictation(transcript => setRevisionText(current => appendSentence(current, transcript)));

  const sections = useMemo(() => {
    if (!recipe) return [] as Array<[string, RecipeIngredient[]]>;
    const grouped = new Map<string, RecipeIngredient[]>();
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.section || 'Ingredientes';
      grouped.set(key, [...(grouped.get(key) ?? []), ingredient]);
    });
    return Array.from(grouped.entries());
  }, [recipe]);

  useEffect(() => {
    if (!recipe) return;
    recordRecipeView(recipe.id, recipe.title);
    rememberActiveRecipe(recipe);
    rememberLibraryRecipe(recipe);
  }, [recipe?.id]);

  useEffect(() => {
    setMissing(new Set());
    setActivePanel(null);
    setIsRevisionOpen(false);
    setRevisionText('');
    setRevisionError(undefined);
    setShareStatus(undefined);
  }, [recipe?.id]);

  if (!recipe) return <AppShell><div className="page-content nav-safe"><section className="editorial-card"><h2>Esta receta no está disponible.</h2><p>Vuelve a Mis recetas o genera una nueva propuesta.</p></section></div></AppShell>;

  const total = recipe.prepMinutes + recipe.cookMinutes;
  const isFavorite = favorites.includes(recipe.id);
  const isSaved = savedRecipes.includes(recipe.id);

  const setMissingIngredient = (ingredient: RecipeIngredient, shouldBeMissing: boolean) => {
    const itemId = shoppingItemId(recipe.id, ingredient.name);
    setMissing(current => {
      const next = new Set(current);
      if (shouldBeMissing) next.add(ingredient.name); else next.delete(ingredient.name);
      return next;
    });
    if (shouldBeMissing && !ingredient.optional) {
      upsertShoppingItem({ id: itemId, name: ingredient.name, quantity: scaleQuantity(ingredient, recipe.baseServings, servings), unit: ingredient.unit, recipeId: recipe.id, recipeTitle: recipe.title, checked: false });
    } else removeShoppingItem(itemId);
  };

  const saveRecipe = () => {
    const willSave = !isSaved;
    toggleSavedRecipe(recipe.id);
    if (willSave) void getRecipeImage(recipe).catch(() => undefined);
  };

  const sharePdf = async () => {
    if (sharingPdf) return;
    setSharingPdf(true);
    setShareStatus(undefined);
    try {
      const result = await shareRecipePdf(recipe, servings);
      setShareStatus(result === 'shared' ? 'PDF compartido.' : 'PDF preparado. Puedes compartirlo desde tus descargas.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareStatus(error instanceof Error ? error.message : 'No se ha podido preparar el PDF.');
    } finally {
      setSharingPdf(false);
    }
  };

  const startCooking = () => {
    rememberActiveRecipe(recipe);
    navigate(`/cocinar/${recipe.id}?servings=${servings}`);
  };

  const applyRevision = async () => {
    const instruction = revisionText.trim();
    if (!instruction || isRevising || revisionVoice.isListening || revisionVoice.isTranscribing) return;
    setIsRevising(true);
    setRevisionError(undefined);
    try {
      const revised = await reviseAiRecipe(recipe, instruction, servings);
      const [registered] = registerExternalRecipes([revised]);
      if (!registered) throw new Error('La versión revisada no ha superado la validación.');
      rememberActiveRecipe(registered);
      rememberLibraryRecipe(registered);
      if (!savedRecipes.includes(registered.id)) toggleSavedRecipe(registered.id);
      setIsRevisionOpen(false);
      setRevisionText('');
      navigate(`/receta/${registered.id}`);
    } catch (error) {
      setRevisionError(error instanceof Error ? error.message : 'No se ha podido revisar la receta.');
    } finally { setIsRevising(false); }
  };

  const ingredientPanel = <>
    <div className="panel-intro"><p>Revisa los ingredientes. Si marcas “Me falta”, se añadirá automáticamente a la lista de compra.</p></div>
    {sections.map(([section, ingredients]) => <div className="ingredient-section" key={section}><h3>{section}</h3>{ingredients.map(ingredient => {
      const quantity = scaleQuantity(ingredient, recipe.baseServings, servings);
      const isMissing = missing.has(ingredient.name);
      return <div className="recipe-ingredient" key={`${section}-${ingredient.name}`}><div style={{ minWidth: 0 }}><span>{ingredient.name}{ingredient.optional ? <small> opcional</small> : null}</span><div className="chip-row compact" style={{ marginTop: 7 }}><button className={`chip ${!isMissing ? 'selected' : ''}`} onClick={() => setMissingIngredient(ingredient, false)}>Tengo</button><button className={`chip ${isMissing ? 'selected' : ''}`} onClick={() => setMissingIngredient(ingredient, true)}>Me falta</button></div></div><strong>{formatQuantity(quantity)} {ingredient.unit}</strong></div>;
    })}</div>)}
    {!!shoppingList.filter(item => item.recipeId === recipe.id && !item.checked).length && <button className="advanced-toggle full-panel-action" onClick={() => navigate('/lista-compra')}><ShoppingBasket size={17} /> Ver lista de compra</button>}
    <div className="recipe-panel-end-spacer" aria-hidden="true" />
  </>;

  const panelConfig: Record<Exclude<RecipePanel, null>, { title: string; eyebrow: string; content: ReactNode }> = {
    ingredients: { title: 'Ingredientes', eyebrow: 'LO QUE NECESITAS', content: ingredientPanel },
    prep: { title: 'Mise en place', eyebrow: 'PREPARACIÓN PREVIA', content: <><ol className="expanded-list">{recipe.miseEnPlace.map((item, i) => <li key={`${item}-${i}`}><strong>{i + 1}.</strong> {item}</li>)}</ol><div className="recipe-panel-end-spacer" aria-hidden="true" /></> },
    critical: { title: 'Puntos críticos', eyebrow: 'PARA QUE SALGA BIEN', content: <div className="panel-advice warning">{recipe.criticalPoints.map((point, i) => <p key={`${point}-${i}`}><AlertTriangle size={17} /> <span>{point}</span></p>)}<div className="recipe-panel-end-spacer" aria-hidden="true" /></div> },
    recommendations: { title: 'Recomendaciones', eyebrow: 'CONSEJOS Y SUSTITUCIONES', content: <div className="panel-advice">{recipe.substitutions.map((point, i) => <p key={`${point}-${i}`}><Leaf size={17} /> <span>{point}</span></p>)}<div className="recipe-panel-end-spacer" aria-hidden="true" /></div> }
  };
  const currentPanel = activePanel ? panelConfig[activePanel] : null;

  return (
    <AppShell hideBack hideProfile>
      <ChefLoadingOverlay active={isRevising} title="Rehaciendo tu receta" messages={['¡Oído cocina!']} />
      <ChefLoadingOverlay active={sharingPdf} title="Preparando la ficha" messages={['Montando tu receta en PDF…']} />
      <TopBar eyebrow="RECETA" title="Lista para cocinar" />
      <div className="recipe-page">
        <section className="recipe-hero"><div className="recipe-hero-art"><span>{recipe.emoji}</span><div className="hero-glow" /></div><button className={`floating-heart ${isFavorite ? 'active' : ''}`} onClick={() => toggleFavorite(recipe.id)} aria-label="Favorito"><Heart size={21} fill={isFavorite ? 'currentColor' : 'none'} /></button><div className="recipe-title-block"><span className="eyebrow light">{recipe.cuisine.toUpperCase()} · {recipe.style.toUpperCase()}</span><h1>{recipe.title}</h1><p>{recipe.description}</p><div className="hero-meta"><span><Clock3 size={16} /> {formatDuration(total)}</span><span><ChefHat size={16} /> {recipe.difficulty}</span><span><UsersRound size={16} /> {servings}</span></div></div></section>

        <div className="recipe-content nav-safe">
          <section className="nutrition-card nutrition-card-priority"><div><span className="eyebrow">INFORMACIÓN NUTRICIONAL APROXIMADA</span><h2>Por ración</h2></div><div className="nutrition-grid"><div><strong>{recipe.nutritionPerServing.kcal}</strong><span>kcal</span></div><div><strong>{recipe.nutritionPerServing.proteinG} g</strong><span>proteína</span></div><div><strong>{recipe.nutritionPerServing.carbsG} g</strong><span>hidratos</span></div><div><strong>{recipe.nutritionPerServing.fatG} g</strong><span>grasas</span></div></div></section>
          <section className="servings-card"><div><span className="eyebrow">COMENSALES</span><strong>Ajusta la receta</strong></div><NumberStepper value={servings} onChange={setServings} /></section>
          <div className="recipe-save-actions">
            <button className="secondary-button" type="button" onClick={saveRecipe}><Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Guardada en Mis recetas' : 'Guardar receta'}</button>
            <button className="secondary-button" type="button" onClick={() => void sharePdf()} disabled={sharingPdf}><Share2 size={18} /> {sharingPdf ? 'Preparando PDF…' : 'Compartir ficha PDF'}</button>
            <button className="secondary-button recipe-revision-launch" type="button" onClick={() => { setRevisionText(''); setRevisionError(undefined); setIsRevisionOpen(true); }}><WandSparkles size={18} /> Personalizar receta</button>
          </div>
          {shareStatus && <div className="recipe-share-status">{shareStatus}</div>}
          <RecipeSourceNote recipe={recipe} />
          <section className="recipe-action-grid" aria-label="Información de la receta"><button type="button" onClick={() => setActivePanel('ingredients')}><ShoppingBasket size={22} /><strong>Ingredientes</strong><span>Lo que necesitas</span></button><button type="button" onClick={() => setActivePanel('prep')}><Sparkles size={22} /><strong>Mise en place</strong><span>Preparación previa</span></button><button type="button" onClick={() => setActivePanel('critical')}><AlertTriangle size={22} /><strong>Puntos críticos</strong><span>Lo importante para acertar</span></button><button type="button" onClick={() => setActivePanel('recommendations')}><Leaf size={22} /><strong>Recomendaciones</strong><span>Consejos y sustituciones</span></button></section>
          <section className="trust-strip compact-trust-strip"><ShieldCheck size={18} /><div><strong>Todo preparado</strong><span>La elaboración completa está en el modo cocina para evitar información duplicada.</span></div></section>
          <div className="cook-cta"><button onClick={startCooking}><Play size={20} fill="currentColor" /> Empezar a cocinar</button></div>
        </div>
      </div>

      {currentPanel && <div className="recipe-panel-backdrop" role="presentation" onClick={() => setActivePanel(null)}><section className="recipe-panel-sheet" role="dialog" aria-modal="true" aria-label={currentPanel.title} onClick={event => event.stopPropagation()}><header className="recipe-panel-header"><div><span className="eyebrow">{currentPanel.eyebrow}</span><h2>{currentPanel.title}</h2></div><button type="button" onClick={() => setActivePanel(null)} aria-label="Cerrar"><X size={22} /></button></header><div className="recipe-panel-body">{currentPanel.content}</div></section></div>}

      {isRevisionOpen && <div className="recipe-panel-backdrop recipe-revision-backdrop" role="presentation" onClick={() => !isRevising && setIsRevisionOpen(false)}><section className="recipe-panel-sheet recipe-revision-sheet" role="dialog" aria-modal="true" aria-label="Personalizar receta" onClick={event => event.stopPropagation()}><header className="recipe-panel-header"><div><span className="eyebrow">PERSONALIZA TU VERSIÓN</span><h2>¿Qué quieres cambiar?</h2></div><button type="button" onClick={() => setIsRevisionOpen(false)} disabled={isRevising} aria-label="Cerrar"><X size={22} /></button></header><div className="recipe-panel-body recipe-revision-body"><div className="panel-intro"><p>Escribe o dicta los cambios. El Chef creará una nueva versión y conservará la original.</p></div><div className="recipe-revision-input"><textarea rows={6} value={revisionText} onChange={event => setRevisionText(event.target.value)} disabled={isRevising} placeholder="Ej. cambia la guarnición por patata panadera." /></div><div className="recipe-revision-toolbar"><button type="button" className="revision-clear-button" onClick={() => { revisionVoice.stop(); setRevisionText(''); }} disabled={isRevising || (!revisionText && !revisionVoice.isListening)} aria-label="Borrar cambios"><X size={20} /></button><button type="button" className={`voice-button ${revisionVoice.isListening ? 'listening' : ''}`} onClick={revisionVoice.toggle} disabled={!revisionVoice.isSupported || revisionVoice.isTranscribing || isRevising} aria-label={revisionVoice.isListening ? 'Detener dictado' : 'Dictar cambios'}>{revisionVoice.isListening ? <MicOff size={20} /> : <Mic size={20} />}</button><button type="button" className="revision-confirm-button" onClick={() => void applyRevision()} disabled={!revisionText.trim() || revisionVoice.isListening || revisionVoice.isTranscribing || isRevising} aria-label="Confirmar cambios"><Check size={22} /></button></div>{revisionVoice.isListening && <div className="voice-status listening"><Mic size={14} /> Escuchando…</div>}{revisionVoice.isTranscribing && <div className="voice-status listening"><Sparkles size={14} /> Interpretando el dictado…</div>}{revisionVoice.error && <div className="voice-status error">{revisionVoice.error}</div>}{revisionError && <div className="recipe-revision-error"><AlertTriangle size={16} /><span>{revisionError}</span></div>}</div></section></div>}
    </AppShell>
  );
}

function appendSentence(current: string, transcript: string): string { const base = current.trimEnd(); const clean = transcript.trim(); return base ? `${base}${/[.!?…]$/.test(base) ? ' ' : '. '}${clean}` : clean; }
function normalize(value: string): string { return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
function shoppingItemId(recipeId: string, ingredientName: string): string { return `${recipeId}:${normalize(ingredientName).replace(/\s+/g, '-')}`; }
