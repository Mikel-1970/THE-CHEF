import { useEffect, useState, type ReactNode } from 'react';
import { useApp } from '../AppContext';
import { ChefAvatar } from './ChefAvatar';
import '../entry-flow.css';
import { FoodCollage } from './FoodCollage';
import './WelcomeSplash.css';

export function WelcomeSplash({ children, avatar, greeting, onComplete }: { children: ReactNode; avatar?: string; greeting?: string; onComplete?:()=>void }) {
  const { settings } = useApp();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {setReady(true);onComplete?.()}, 3500);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <main className={`entry-page welcome-entry ${ready ? 'welcome-ready' : ''}`} aria-label="Acceso a The Chef">
      <FoodCollage/><div className="welcome-content">
        <div className="entry-logo welcome-logo" aria-label="The Chef"><span>THE</span><strong>CHEF</strong></div>
        <div className="welcome-character"><ChefAvatar avatar={avatar ?? settings.avatarEmoji} size={220} showHat={false} /></div>
        <h1 key={greeting}>{greeting || '¿Qué cocinamos hoy?'}</h1>
        <p className="welcome-tagline">Tu cocina empieza aquí</p>
        {!ready && <button className="welcome-skip" type="button" onClick={() => {setReady(true);onComplete?.()}}>Entrar ahora</button>}
        <div className="welcome-fields" hidden={!ready}>{children}</div>
      </div>
    </main>
  );
}
