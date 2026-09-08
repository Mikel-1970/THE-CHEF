import { ChefHat } from 'lucide-react';
import { useState } from 'react';
import { requestGuidedTourReplay } from '../components/GuidedTour';
import '../entry-flow.css';

type Props = { onContinue: () => void };

const INVITE_HIDDEN_KEY = 'chef:tutorial:invite-hidden:v2';
const INVITE_DISMISSED_SESSION_KEY = 'chef:tutorial:invite-dismissed-session:v2';

export function TutorialWelcomePage({ onContinue }: Props) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const start = () => {
    requestGuidedTourReplay();
    try { sessionStorage.setItem(INVITE_DISMISSED_SESSION_KEY, '1'); } catch { /* sin persistencia */ }
    onContinue();
  };

  const skip = () => {
    try {
      sessionStorage.setItem(INVITE_DISMISSED_SESSION_KEY, '1');
      if (dontShowAgain) localStorage.setItem(INVITE_HIDDEN_KEY, '1');
    } catch { /* sin persistencia */ }
    onContinue();
  };

  return (
    <div className="entry-page">
      <section className="entry-card tutorial-welcome-card">
        <div className="entry-logo"><span>THE</span><strong>CHEF</strong></div>
        <div className="entry-round-icon"><ChefHat size={36} /></div>
        <span className="entry-eyebrow">GUÍA / TUTORIAL</span>
        <h1>¿Quieres que El Chef te enseñe la app?</h1>
        <p>La guía te irá explicando cada zona mientras navegas. Puedes iniciarla ahora, dejarla para otro momento o hacer que no vuelva a aparecer.</p>
        <label className="tutorial-welcome-check"><input type="checkbox" checked={dontShowAgain} onChange={event => setDontShowAgain(event.target.checked)} /><span>No volver a mostrar esta pantalla</span></label>
        <div className="entry-actions stacked">
          <button type="button" className="entry-primary" onClick={start}>Iniciar guía</button>
          <button type="button" className="entry-secondary" onClick={skip}>Ahora no</button>
        </div>
      </section>
    </div>
  );
}
