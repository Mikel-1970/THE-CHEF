import {BrandMark} from './BrandMark';
import { useState, type ReactNode } from 'react';
import { useApp } from '../AppContext';
import { ChefAvatar } from './ChefAvatar';
import '../entry-flow.css';
import { FoodCollage } from './FoodCollage';
import './WelcomeSplash.css';

export function WelcomeSplash({ children, avatar, greeting, onComplete, onChoose, notice }: { children: ReactNode; avatar?: string; greeting?: string; onComplete?:(mode:'login'|'register')=>void; onChoose?:(mode:'login'|'register')=>void; notice?:string }) {
  const { settings } = useApp();
  const [ready, setReady] = useState(false);
  const choose=(mode:'login'|'register')=>{if(onComplete){onComplete(mode);return}onChoose?.(mode);setReady(true)};
  return (
    <main className={`entry-page welcome-entry ${ready ? 'welcome-ready' : ''}`} aria-label="Acceso a Chef Voldi">
      <FoodCollage/><div className="welcome-content">
        <div className="welcome-brand"><BrandMark/></div>
        <div className="welcome-character"><ChefAvatar avatar={avatar ?? settings.avatarEmoji} size={220} showHat={false} /></div>
        <h1 key={greeting}>{greeting || '¿Qué cocinamos hoy?'}</h1>
        <p className="welcome-tagline">Tu cocina empieza aquí</p>
        {!ready && <div className="welcome-entry-actions"><button className="entry-secondary" type="button" onClick={()=>choose('register')}>Regístrate</button><button className="entry-primary" type="button" onClick={()=>choose('login')}>Login</button></div>}
        {notice&&<p role="status" className="welcome-notice">{notice}</p>}
        <div className="welcome-fields" hidden={!ready}>{children}</div>
      </div>
    </main>
  );
}
