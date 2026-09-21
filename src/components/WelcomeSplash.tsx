import { useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { ChefAvatar } from './ChefAvatar';
import '../entry-flow.css';
import './WelcomeSplash.css';

export function WelcomeSplash({ onComplete }: { onComplete: () => void }) {
  const { settings } = useApp();
  const complete = useRef(onComplete);
  complete.current = onComplete;

  useEffect(() => {
    const timer = window.setTimeout(() => complete.current(), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="entry-page welcome-splash" aria-label="Presentación de The Chef">
      <section className="welcome-content">
        <div className="entry-logo welcome-logo" aria-label="The Chef"><span>THE</span><strong>CHEF</strong></div>
        <div className="welcome-character">
          <ChefAvatar avatar={settings.avatarEmoji} size={280} showHat={false} />
        </div>
        <h1>¿Qué cocinamos hoy?</h1>
        <p role="status">Tu cocina empieza aquí</p>
        <button className="welcome-skip" type="button" onClick={() => complete.current()}>Entrar ahora</button>
      </section>
    </main>
  );
}
