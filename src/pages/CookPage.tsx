import { ArrowLeft, ChevronLeft, ChevronRight, Clock3, Pause, Play, RotateCcw, ScreenShare, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { mockRecipes } from '../data/mockRecipes';

export function CookPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const recipe = mockRecipes.find(r => r.id === id);
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

  if (!recipe) return null;
  const step = recipe.steps[index];
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="cook-screen">
      <header className="cook-header">
        <button onClick={() => navigate(-1)} aria-label="Volver"><ArrowLeft size={21} /></button>
        <div><span>Modo Cocina</span><strong>{recipe.title}</strong></div>
        <button onClick={() => navigate('/')} aria-label="Cerrar"><X size={21} /></button>
      </header>

      <div className="cook-progress"><span style={{ width: `${((index + 1) / recipe.steps.length) * 100}%` }} /></div>

      <main className="cook-main">
        <div className="cook-step-label">PASO {index + 1} DE {recipe.steps.length}</div>
        <div className="cook-number">{String(index + 1).padStart(2, '0')}</div>
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
        <button className="cook-nav secondary" disabled={index === 0} onClick={() => setIndex(i => Math.max(0, i - 1))}><ChevronLeft size={20} /> Anterior</button>
        {index < recipe.steps.length - 1 ? (
          <button className="cook-nav primary" onClick={() => setIndex(i => Math.min(recipe.steps.length - 1, i + 1))}>Siguiente <ChevronRight size={20} /></button>
        ) : (
          <button className="cook-nav primary" onClick={() => navigate(`/receta/${recipe.id}`)}>Terminar</button>
        )}
      </footer>
    </div>
  );
}
