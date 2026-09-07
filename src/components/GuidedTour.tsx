import { ChefHat, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './GuidedTour.css';

const TUTORIAL_ACTIVE_KEY = 'chef:tutorial:active:v2';
const TUTORIAL_INVITE_HIDDEN_KEY = 'chef:tutorial:invite-hidden:v2';

type TutorialTip = {
  selector?: string;
  title: string;
  body: string;
};

const HOME_TIPS: TutorialTip[] = [
  {
    selector: '[data-tour="desire"]',
    title: 'Pídele al Chef lo que quieras',
    body: 'Entra aquí cuando ya sabes qué te apetece. Puedes escribir o dictar tu petición y después ajustar comensales, tiempo, estilo o tipo de cocina.'
  },
  {
    selector: '[data-tour="pantry-cook"]',
    title: 'Cocina con lo que hay',
    body: 'Selecciona lo que tienes disponible y El Chef buscará la mejor forma de aprovecharlo, priorizando calidad y pocas compras adicionales.'
  },
  {
    selector: '[data-tour="photo"]',
    title: 'Foto receta',
    body: 'Haz una foto o elige una imagen. Primero confirmarás qué plato es y sus ingredientes; después se generará la receta completa.'
  },
  {
    selector: '[data-tour="quick"]',
    title: 'Tus accesos rápidos',
    body: 'Desde aquí puedes entrar directamente en Mis recetas, Favoritas, Historial y Cesta de compra.'
  },
  {
    selector: '[data-tour="bottom-nav"]',
    title: 'Navega libremente',
    body: 'El menú inferior permanece disponible. Mientras el tutorial esté activo puedes entrar en cualquier función y recibirás ayuda contextual al llegar.'
  },
  {
    selector: '[data-tour="profile"]',
    title: 'Perfil y ajustes',
    body: 'Desde tu perfil puedes cambiar preferencias, avatar o foto y volver a iniciar este tutorial siempre que quieras.'
  }
];

function tipsForPath(pathname: string): TutorialTip[] {
  if (pathname === '/') return HOME_TIPS;
  if (pathname.startsWith('/foto')) return [
    { selector: '.photo-recipe-upload', title: 'Añade la imagen', body: 'Puedes hacer una foto o elegir una de la galería. Procura que el plato se vea completo y con buena luz.' },
    { selector: '.photo-recipe-actions', title: 'Foto o galería', body: 'Elige la entrada que prefieras. Después El Chef analizará el plato antes de generar ninguna receta.' },
    { selector: '.photo-identification-card', title: 'Confirma antes de continuar', body: 'Revisa la identificación, corrígela por texto o voz si hace falta y confirma los ingredientes y comensales antes de generar la receta.' }
  ];
  if (pathname.startsWith('/cocina-despensa')) return [
    { selector: '.pantry-choice-grid', title: 'Elige lo que quieres aprovechar', body: 'Marca los productos que quieres utilizar. Puedes añadir otros escribiendo o dictando.' },
    { selector: '.advanced-toggle', title: 'Ajusta solo si lo necesitas', body: 'En Más opciones puedes limitar estilo, tipo de cocina o dificultad sin complicar la búsqueda básica.' },
    { selector: '.sticky-action', title: 'Pide propuestas', body: 'Cuando esté todo listo, El Chef utilizará esos productos como prioridad y propondrá platos coherentes.' }
  ];
  if (pathname.startsWith('/nevera')) return [
    { selector: '.pantry-add-first', title: 'Tu despensa es un inventario', body: 'Añade aquí lo que tienes en casa, con cantidad si la conoces. Este apartado guarda existencias; para cocinar usa Cocina con lo que hay.' },
    { selector: '.editable-stock-list', title: 'Actualiza lo que tienes', body: 'Puedes cambiar cantidades y unidades o eliminar productos. Si quitas uno, podrás pasarlo a la lista de compra.' }
  ];
  if (pathname.startsWith('/propuestas')) return [
    { selector: '.proposal-stack', title: 'Compara las propuestas', body: 'Elige la opción que más te encaje. La receta completa se genera solo cuando seleccionas una propuesta.' },
    { selector: '.proposal-footer-actions', title: 'Cambia sin empezar de cero', body: 'Puedes pedir otras ideas o volver a cambiar opciones conservando el contexto de la búsqueda.' }
  ];
  if (pathname.startsWith('/receta/')) return [
    { selector: '.recipe-action-grid', title: 'Consulta lo importante', body: 'Ingredientes, Mise en place, Puntos críticos y Recomendaciones están separados para que puedas consultarlos sin duplicar la elaboración.' },
    { selector: '.cook-cta', title: 'Pasa al modo cocina', body: 'Cuando quieras empezar, entra en Empezar a cocinar para avanzar paso a paso con tiempos, temperaturas y temporizadores.' }
  ];
  if (pathname.startsWith('/cocinar/')) return [
    { selector: '.cook-main', title: 'Sigue un paso cada vez', body: 'Cada pantalla muestra únicamente lo necesario para ese paso: instrucción, tiempo, temperatura y señales visuales.' },
    { selector: '.cook-footer', title: 'Avanza a tu ritmo', body: 'Usa Anterior y Siguiente. Al terminar podrás fotografiar el resultado y compararlo con la referencia cuando exista.' }
  ];
  if (pathname.startsWith('/lista-compra')) return [
    { selector: '.pantry-add-input', title: 'Añade cualquier compra', body: 'La lista funciona por sí sola. Puedes escribir o dictar productos, con cantidades y unidades.' },
    { selector: '.editable-stock-list', title: 'Gestiona la compra', body: 'Marca productos comprados, modifica cantidades o unidades y elimina lo que ya no necesites.' }
  ];
  if (pathname.startsWith('/mis-recetas')) return [
    { selector: '.library-type-tabs', title: 'Tu biblioteca', body: 'Separa recetas completas y técnicas. Dentro de Platos puedes consultar guardadas, favoritas e historial.' },
    { selector: '.dish-category-row', title: 'Filtra por tipo de plato', body: 'Usa las categorías para localizar más rápido arroces, pastas, carnes, pescados, guisos, postres y otros platos.' }
  ];
  if (pathname.startsWith('/tecnicas')) return [
    { selector: '.technique-input-box', title: 'Pregunta por una técnica', body: 'Escribe o dicta la preparación que quieres aprender. El Chef generará una ficha reutilizable.' },
    { selector: '.recipe-action-grid', title: 'Consulta antes de empezar', body: 'Revisa Ingredientes, Mise en place, Recomendaciones y Puntos críticos, y después entra en Empezar técnica.' }
  ];
  if (pathname.startsWith('/buscar')) return [
    { title: 'Busca una receta', body: 'Utiliza este apartado cuando quieras localizar una receta concreta por nombre, ingrediente o idea.' }
  ];
  if (pathname.startsWith('/antojo')) return [
    { title: 'Dile al Chef qué te apetece', body: 'Describe el plato o la idea con tus palabras. Puedes hacerlo por texto o voz y completar únicamente las opciones que te interesen.' }
  ];
  if (pathname.startsWith('/ajustes')) return [
    { selector: '.profile-settings-card', title: 'Personaliza tu experiencia', body: 'Aquí puedes elegir avatar o foto y configurar tus preferencias de cocina.' },
    { selector: '.settings-guide-button', title: 'Tutorial siempre disponible', body: 'Desde este botón podrás volver a activar el tutorial contextual cuando lo necesites.' }
  ];
  return [{ title: 'Tutorial activo', body: 'Navega normalmente por la aplicación. Al entrar en cada función verás consejos breves sobre cómo utilizarla.' }];
}

export function GuidedTour() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const tips = useMemo(() => tipsForPath(location.pathname), [location.pathname]);
  const tip = tips[Math.min(tipIndex, Math.max(0, tips.length - 1))];

  useEffect(() => {
    setTipIndex(0);
    let persistedActive = false;
    let hideInvite = false;
    try {
      persistedActive = localStorage.getItem(TUTORIAL_ACTIVE_KEY) === '1';
      hideInvite = localStorage.getItem(TUTORIAL_INVITE_HIDDEN_KEY) === '1';
    } catch { /* sin persistencia */ }
    setActive(persistedActive);
    setInviteVisible(location.pathname === '/' && !persistedActive && !hideInvite);
  }, [location.pathname]);

  useEffect(() => {
    if (!active || !tip?.selector) return;
    const target = document.querySelector<HTMLElement>(tip.selector);
    if (!target) return;
    target.classList.add('guided-tour-highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return () => target.classList.remove('guided-tour-highlight');
  }, [active, tip]);

  const startTutorial = () => {
    try {
      localStorage.setItem(TUTORIAL_ACTIVE_KEY, '1');
      if (dontShowAgain) localStorage.setItem(TUTORIAL_INVITE_HIDDEN_KEY, '1');
    } catch { /* sin persistencia */ }
    setInviteVisible(false);
    setTipIndex(0);
    setActive(true);
  };

  const dismissInvite = () => {
    if (dontShowAgain) {
      try { localStorage.setItem(TUTORIAL_INVITE_HIDDEN_KEY, '1'); } catch { /* sin persistencia */ }
    }
    setInviteVisible(false);
  };

  const stopTutorial = () => {
    try { localStorage.removeItem(TUTORIAL_ACTIVE_KEY); } catch { /* sin persistencia */ }
    setActive(false);
    setInviteVisible(false);
  };

  return (
    <>
      {inviteVisible && (
        <section className="tutorial-invite" role="dialog" aria-modal="true" aria-label="Guía tutorial de El Chef">
          <button className="tutorial-hat-button" type="button" onClick={startTutorial} aria-label="Iniciar guía tutorial"><ChefHat size={38} /></button>
          <div className="tutorial-invite-copy"><span>GUÍA / TUTORIAL</span><strong>¿Quieres que El Chef te enseñe la app?</strong><p>La guía no te obliga a seguir un recorrido. Tú navegas y recibirás ayuda cuando entres en cada función.</p></div>
          <label className="tutorial-dont-show"><input type="checkbox" checked={dontShowAgain} onChange={event => setDontShowAgain(event.target.checked)} /> <span>No volver a ver</span></label>
          <div className="tutorial-invite-actions"><button type="button" className="tutorial-later" onClick={dismissInvite}>Ahora no</button><button type="button" className="tutorial-start" onClick={startTutorial}>Iniciar guía</button></div>
        </section>
      )}

      {active && tip && (
        <div className="guided-tour-layer" aria-live="polite">
          <button className="guided-tour-exit" type="button" onClick={stopTutorial} aria-label="Salir del tutorial"><X size={20} /><span>Salir del tutorial</span></button>
          <section className="guided-tour-card" role="status" aria-label="Ayuda contextual">
            <span className="guided-tour-progress">Tutorial activo · {tipIndex + 1}/{tips.length}</span>
            <h2>{tip.title}</h2>
            <p>{tip.body}</p>
            <div className="guided-tour-actions">
              <button type="button" className="guided-tour-secondary" onClick={() => setTipIndex(current => Math.max(0, current - 1))} disabled={tipIndex === 0}><ChevronLeft size={18} /> Anterior</button>
              <button type="button" className="guided-tour-primary" onClick={() => setTipIndex(current => Math.min(tips.length - 1, current + 1))} disabled={tipIndex >= tips.length - 1}>Siguiente consejo <ChevronRight size={18} /></button>
            </div>
            <small className="guided-tour-free-nav">Puedes ignorar esta tarjeta y seguir navegando por la app.</small>
          </section>
        </div>
      )}
    </>
  );
}

export function requestGuidedTourReplay() {
  try {
    localStorage.setItem(TUTORIAL_ACTIVE_KEY, '1');
  } catch { /* sin persistencia */ }
}
