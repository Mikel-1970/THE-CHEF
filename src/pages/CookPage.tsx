import { ArrowLeft, ChevronLeft, ChevronRight, Clock3, Pause, Play, RotateCcw, ScreenShare, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getActiveRecipe, getRecipeById } from '../services/recipeCatalog';

export function CookPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const recipe = getRecipeById(id) ?? getActiveRecipe(id);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const wakeLock = useRef<any>(null);
  const servings = Number(params.get('servings') || recipe?.baseServings || 4);

  useEffect(() => {
    if (!recipe) return;
    const mins = recipe.steps[index]?.minutes || 0;
    setSeconds(mins * 60);
    setRunning(false);
  }, [index, recipe]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds(s => {
      if (s <= 1) {
        setRunning(false);
        return 0;
      }
      return s - 1;
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

  if (!recipe) {
    return (
      <div className="cook-screen">
        <header className="cook-header">
          <button onClick={() => navigate(-1)} aria-label="Volver"><ArrowLeft size={21} /></button>
          <div><span>Modo Cocina</span><strong>Receta no disponible</strong></div>
          <button onClick={() => navigate('/')} aria-label="Cerrar"><X size={21} /></button>
        </header>
        <main className="cook-main">
          <p className="cook-instruction">No he podido recuperar esta receta. Vuelve a abrirla desde Mis recetas o genera una nueva propuesta.</p>
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
          <button onClick={() => navigate('/')} aria-label="Cerrar"><X size={21} /></button>
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
        <button onClick={() => navigate('/')} aria-label="Cerrar"><X size={21} /></button>
      </header>

      <div className="cook-progress"><span style={{ width: `${((safeIndex + 1) / recipe.steps.length) * 100}%` }} /></div>

      <main className="cook-main">
        <div className="cook-step-label">PASO {safeIndex + 1} DE {recipe.steps.length}</div>
        <div className="cook-number">{String(safeIndex + 1).padStart(2, '0')}</div>
        <p className="cook-instruction">{step.instruction}</p>
        {step.cue && <div className="cook-cue"><ScreenShare size={18} /><span><strong>Fíjate en esto</strong>{step.cue}</span></div>}
        {step.minutes && (
          <div className="timer-card">
            <Clock3 size={19} />
            <div className="timer-time">{mins}:{secs}</div>
            <div className="timer-actions">
              <button onClick={() => setRunning(v => !v)}>{running ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}</button>
              <button onClick={() => { setSeconds((step.minutes || 0) * 60); setRunning(false); }}><RotateCcw size={18} /></button>
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
          <button className="cook-nav primary" onClick={() => navigate(`/receta/${recipe.id}`)}>Terminar</button>
        )}
      </footer>
    </div>
  );
}
