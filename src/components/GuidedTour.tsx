import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './GuidedTour.css';

const TOUR_DONE_KEY = 'chef:onboarding:v1';
const TOUR_REPLAY_KEY = 'chef:onboarding:replay';

const steps = [
  {
    selector: '[data-tour="desire"]',
    title: 'Pídele al Chef lo que quieras',
    body: 'Empieza por aquí cuando ya sabes qué te apetece. Puedes escribirlo o dictarlo y después ajustar comensales, tiempo, estilo o cocina.'
  },
  {
    selector: '[data-tour="pantry-cook"]',
    title: 'Cocina con lo que tienes',
    body: 'Selecciona productos de tu despensa y El Chef buscará la mejor forma de aprovecharlos, priorizando calidad y pocas compras adicionales.'
  },
  {
    selector: '[data-tour="photo"]',
    title: 'Reproduce un plato desde una foto',
    body: 'Haz una foto o elige una imagen. Primero confirmas qué plato es y sus ingredientes; después se genera la receta completa.'
  },
  {
    selector: '[data-tour="quick"]',
    title: 'Tus accesos rápidos',
    body: 'Desde aquí entras directamente en tus recetas, favoritas, historial y cesta de la compra.'
  },
  {
    selector: '[data-tour="bottom-nav"]',
    title: 'El menú siempre está disponible',
    body: 'Inicio, Buscar, Chef, Despensa y Técnicas permanecen fijos para que nunca tengas que reiniciar el flujo para moverte por la app.'
  },
  {
    selector: '[data-tour="profile"]',
    title: 'Personaliza El Chef',
    body: 'En tu perfil puedes elegir avatar o foto, ajustar preferencias y volver a reproducir esta guía cuando quieras.'
  }
] as const;

export function GuidedTour() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const step = steps[index];

  const progress = useMemo(() => `${index + 1} / ${steps.length}`, [index]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    let shouldStart = false;
    try {
      const replay = localStorage.getItem(TOUR_REPLAY_KEY) === '1';
      const completed = localStorage.getItem(TOUR_DONE_KEY) === '1';
      shouldStart = replay || !completed;
      if (replay) localStorage.removeItem(TOUR_REPLAY_KEY);
    } catch {
      shouldStart = true;
    }
    if (!shouldStart) return;
    const timer = window.setTimeout(() => {
      setIndex(0);
      setActive(true);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (!active || !step) return;
    const target = document.querySelector<HTMLElement>(step.selector);
    if (!target) return;
    target.classList.add('guided-tour-highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return () => target.classList.remove('guided-tour-highlight');
  }, [active, step]);

  if (!active || !step || location.pathname !== '/') return null;

  const finish = () => {
    try { localStorage.setItem(TOUR_DONE_KEY, '1'); } catch { /* sin persistencia */ }
    setActive(false);
  };

  const next = () => {
    if (index >= steps.length - 1) finish();
    else setIndex(current => current + 1);
  };

  return (
    <div className="guided-tour-layer" role="dialog" aria-modal="true" aria-label="Guía de uso de El Chef">
      <div className="guided-tour-shade" />
      <section className="guided-tour-card">
        <button className="guided-tour-close" type="button" onClick={finish} aria-label="Cerrar guía"><X size={19} /></button>
        <span className="guided-tour-progress">{progress}</span>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
        <div className="guided-tour-actions">
          <button type="button" className="guided-tour-secondary" onClick={() => setIndex(current => Math.max(0, current - 1))} disabled={index === 0}><ChevronLeft size={18} /> Anterior</button>
          <button type="button" className="guided-tour-primary" onClick={next}>{index === steps.length - 1 ? 'Terminar' : 'Siguiente'} {index < steps.length - 1 && <ChevronRight size={18} />}</button>
        </div>
      </section>
    </div>
  );
}

export function requestGuidedTourReplay() {
  try { localStorage.setItem(TOUR_REPLAY_KEY, '1'); } catch { /* sin persistencia */ }
}
