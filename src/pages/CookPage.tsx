import { ArrowLeft, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Pause, Play, RotateCcw, ScreenShare, Sparkles, Thermometer } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { evaluateDishPhoto, getRecipeImage, type DishEvaluation } from '../services/mediaGateway';
import { getActiveRecipe, getRecipeById } from '../services/recipeCatalog';
import '../cook-enhancements.css';

export function CookPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const recipe = getRecipeById(id) ?? getActiveRecipe(id);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<DishEvaluation>();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [photoError, setPhotoError] = useState<string>();
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>();
  const [referenceImageError, setReferenceImageError] = useState(false);
  const wakeLock = useRef<any>(null);
  const servings = Number(params.get('servings') || recipe?.baseServings || 4);
  const recipeId = recipe?.id;
  const stepMinutes = recipe?.steps[index]?.minutes || 0;

  useEffect(() => {
    if (!recipeId || finished) return;
    setSeconds(stepMinutes * 60);
    setRunning(false);
  }, [recipeId, index, stepMinutes, finished]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds(current => {
      if (current <= 1) {
        setRunning(false);
        return 0;
      }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) wakeLock.current = await (navigator as any).wakeLock.request('screen');
      } catch { /* fallback silently */ }
    };
    requestWakeLock();
    return () => wakeLock.current?.release?.();
  }, []);

  useEffect(() => {
    if (!recipe) return;
    let disposed = false;
    let generatedUrl: string | undefined;
    setReferenceImageError(false);
    getRecipeImage(recipe)
      .then(url => {
        generatedUrl = url;
        if (!disposed && url) setReferenceImageUrl(url);
      })
      .catch(() => {
        if (!disposed) setReferenceImageError(true);
      });
    return () => {
      disposed = true;
      if (generatedUrl?.startsWith('blob:')) URL.revokeObjectURL(generatedUrl);
    };
  }, [recipeId]);

  if (!recipe) {
    return (
      <div className="cook-screen">
        <header className="cook-header">
          <button onClick={() => navigate(-1)} aria-label="Volver"><ArrowLeft size={21} /></button>
          <div><span>Modo Cocina</span><strong>Receta no disponible</strong></div>
          <span aria-hidden="true" />
        </header>
        <main className="cook-main">
          <p className="cook-instruction">No he podido recuperar esta receta. Vuelve a abrirla desde Mis recetas o genera una nueva propuesta.</p>
        </main>
      </div>
    );
  }

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError(undefined);
    setEvaluation(undefined);
    setEvaluating(true);
    try {
      const result = await evaluateDishPhoto(recipe, file);
      setPhotoUrl(result.previewUrl);
      setEvaluation(result.evaluation);
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'No se ha podido valorar la fotografía.');
    } finally {
      setEvaluating(false);
      event.target.value = '';
    }
  };

  if (finished) {
    const celebration = evaluation && evaluation.score >= 8.5;
    return (
      <div className="cook-screen cook-finish-screen">
        <header className="cook-header">
          <button onClick={() => setFinished(false)} aria-label="Volver al último paso"><ArrowLeft size={21} /></button>
          <div><span>Resultado final</span><strong>{recipe.title}</strong></div>
          <span aria-hidden="true" />
        </header>

        <main className="cook-finish-main">
          <div className={`finish-badge ${celebration ? 'celebrate' : ''}`}>
            {evaluation ? (celebration ? '👏' : <CheckCircle2 size={34} />) : <Camera size={34} />}
          </div>
          <h1>{evaluation ? (celebration ? '¡Enhorabuena!' : 'Plato terminado') : '¿Cómo te ha quedado?'}</h1>
          <p>{evaluation ? 'He comparado visualmente el resultado con lo esperable para esta receta.' : 'Haz una foto del resultado final y El Chef te dará una valoración visual con puntos fuertes y mejoras concretas.'}</p>

          <section className="dish-reference-card" aria-label="Presentación esperada">
            <span>PROPUESTA DE EL CHEF</span>
            {referenceImageUrl ? <img src={referenceImageUrl} alt={`Presentación sugerida de ${recipe.title}`} /> : <div className="dish-reference-placeholder"><span>{recipe.emoji}</span><strong>{referenceImageError ? 'No se ha podido cargar la referencia' : 'Preparando la imagen en segundo plano…'}</strong></div>}
          </section>

          {photoUrl && <section className="dish-real-card"><span>TU PLATO</span><img className="dish-result-photo" src={photoUrl} alt={`Resultado final de ${recipe.title}`} /></section>}

          {!evaluation && (
            <label className={`photo-capture-button ${evaluating ? 'disabled' : ''}`}>
              <Camera size={21} /> {evaluating ? 'Analizando la foto…' : 'Hacer o elegir una foto'}
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} disabled={evaluating} />
            </label>
          )}

          {photoError && <div className="dish-evaluation-error">{photoError}</div>}

          {evaluation && (
            <section className="dish-evaluation-card">
              <div className="dish-score"><strong>{evaluation.score.toFixed(1)}</strong><span>/ 10</span></div>
              <p className="dish-summary">{evaluation.summary}</p>
              {evaluation.strengths.length > 0 && <div><h3>Lo mejor</h3>{evaluation.strengths.map((item, i) => <p key={`${item}-${i}`}>✓ {item}</p>)}</div>}
              {evaluation.improvements.length > 0 && <div><h3>Para mejorarlo</h3>{evaluation.improvements.map((item, i) => <p key={`${item}-${i}`}>• {item}</p>)}</div>}
              <label className="photo-retry-button"><Camera size={17} /> Probar con otra foto<input type="file" accept="image/*" capture="environment" onChange={handlePhoto} disabled={evaluating} /></label>
            </section>
          )}

          <button className="finish-return-button" type="button" onClick={() => navigate(`/receta/${recipe.id}`)}>Volver a la receta</button>
        </main>
      </div>
    );
  }

  const safeIndex = Math.min(index, Math.max(0, recipe.steps.length - 1));
  const step = recipe.steps[safeIndex];
  if (!step) {
    return (
      <div className="cook-screen">
        <header className="cook-header">
          <button onClick={() => navigate(-1)} aria-label="Volver"><ArrowLeft size={21} /></button>
          <div><span>Modo Cocina</span><strong>{recipe.title}</strong></div>
          <span aria-hidden="true" />
        </header>
        <main className="cook-main"><p className="cook-instruction">Esta receta no contiene pasos de elaboración válidos.</p></main>
      </div>
    );
  }

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="cook-screen">
      <header className="cook-header">
        <button onClick={() => navigate(-1)} aria-label="Volver"><ArrowLeft size={21} /></button>
        <div><span>Modo Cocina</span><strong>{recipe.title}</strong></div>
        <span aria-hidden="true" />
      </header>

      <div className="cook-progress"><span style={{ width: `${((safeIndex + 1) / recipe.steps.length) * 100}%` }} /></div>

      <main className="cook-main">
        <div className="cook-step-label">PASO {safeIndex + 1} DE {recipe.steps.length}</div>
        <div className="cook-number">{String(safeIndex + 1).padStart(2, '0')}</div>
        <p className="cook-instruction">{step.instruction}</p>

        <div className="cook-step-facts">
          {step.temperatureC && <div><Thermometer size={18} /><span><small>Temperatura</small><strong>{step.temperatureC} °C</strong></span></div>}
          {step.minutes && <div><Clock3 size={18} /><span><small>Duración de este paso</small><strong>{step.minutes} min</strong></span></div>}
        </div>

        {step.cue && <div className="cook-cue"><ScreenShare size={18} /><span><strong>Fíjate en esto</strong>{step.cue}</span></div>}
        {step.minutes && (
          <div className="timer-card timer-card-labelled">
            <Clock3 size={19} />
            <div><small>Temporizador de este paso</small><div className="timer-time">{mins}:{secs}</div></div>
            <div className="timer-actions">
              <button type="button" onClick={() => setRunning(value => !value)} aria-label={running ? 'Pausar temporizador' : 'Iniciar temporizador'}>{running ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}</button>
              <button type="button" onClick={() => { setSeconds((step.minutes || 0) * 60); setRunning(false); }} aria-label="Reiniciar temporizador"><RotateCcw size={18} /></button>
            </div>
          </div>
        )}
        <div className="cook-serving">Receta ajustada para <strong>{servings} personas</strong></div>
      </main>

      <footer className="cook-footer">
        <button className="cook-nav secondary" disabled={safeIndex === 0} onClick={() => setIndex(i => Math.max(0, i - 1))}><ChevronLeft size={20} /> Anterior</button>
        {safeIndex < recipe.steps.length - 1 ? (
          <button className="cook-nav primary" onClick={() => setIndex(i => Math.min(recipe.steps.length - 1, i + 1))}>Siguiente <ChevronRight size={20} /></button>
        ) : (
          <button className="cook-nav primary" onClick={() => setFinished(true)}><Sparkles size={18} /> Terminar</button>
        )}
      </footer>
    </div>
  );
}
