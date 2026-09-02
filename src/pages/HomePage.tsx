import {
  BookOpen,
  ChefHat,
  Clock3,
  Heart,
  Refrigerator,
  ShoppingBasket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import '../home-v04.css';
import '../home-v04-refinements.css';

export function HomePage() {
  const navigate = useNavigate();
  const { favorites, history } = useApp();
  const pantryImage = `${import.meta.env.BASE_URL}home-pantry.webp`;
  const desireImage = `${import.meta.env.BASE_URL}home-desire.webp`;

  return (
    <AppShell>
      <section className="reference-home">
        <div
          className="reference-decor reference-decor-left"
          style={{ backgroundImage: `url(${pantryImage})` }}
          aria-hidden="true"
        />
        <div
          className="reference-decor reference-decor-right"
          style={{ backgroundImage: `url(${desireImage})` }}
          aria-hidden="true"
        />

        <header className="reference-brand">
          <div className="reference-chef-logo">
            <ChefHat size={68} strokeWidth={1.55} />
            <Heart size={13} strokeWidth={2.3} className="reference-chef-heart" />
          </div>
          <h1>El Chef</h1>
          <div className="reference-divider" aria-hidden="true"><span /><i>◇</i><span /></div>
          <h2>¡Bienvenido de nuevo!</h2>
          <p>Vamos a cocinar algo delicioso.</p>
          <Heart className="reference-doodle-heart" size={31} strokeWidth={1.65} />
        </header>

        <section className="reference-main-actions" aria-label="Modos principales">
          <button className="reference-action-card reference-pantry-card" onClick={() => navigate('/nevera')}>
            <div className="reference-action-text">
              <h3>¿Qué hay<br />en la nevera?</h3>
              <span className="reference-action-line" />
              <p>Mira a ver</p>
            </div>
            <div
              className="reference-action-photo reference-pantry-photo"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(255,253,248,.98) 0%, rgba(255,253,248,.84) 38%, rgba(255,253,248,.18) 66%, rgba(255,253,248,0) 100%), url(${pantryImage})`
              }}
              aria-hidden="true"
            />
            <span className="reference-card-icon reference-card-icon-green"><Refrigerator size={34} strokeWidth={1.7} /></span>
          </button>

          <button className="reference-action-card reference-desire-card" onClick={() => navigate('/antojo')}>
            <div className="reference-action-text">
              <h3>¡Pregúntale<br />al Chef!</h3>
              <span className="reference-action-line reference-action-line-gold" />
              <p>¡Oído cocina!</p>
            </div>
            <div
              className="reference-action-photo reference-desire-photo"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(255,253,248,.98) 0%, rgba(255,253,248,.88) 38%, rgba(255,253,248,.14) 68%, rgba(255,253,248,0) 100%), url(${desireImage})`
              }}
              aria-hidden="true"
            />
            <span className="reference-card-icon reference-card-icon-gold"><ChefHat size={38} strokeWidth={1.55} /></span>
          </button>
        </section>

        <section className="reference-quick-section" aria-label="Accesos rápidos">
          <div className="reference-quick-title"><span>❧</span><h2>Accesos rápidos</h2><span>❧</span></div>
          <div className="reference-quick-grid">
            <button onClick={() => navigate('/mis-recetas')}>
              <BookOpen size={37} strokeWidth={1.65} />
              <strong>Mis recetas</strong>
            </button>
            <button className="reference-favorite" onClick={() => navigate('/mis-recetas?tab=favorites')}>
              <Heart size={39} strokeWidth={1.55} fill="currentColor" />
              <strong>Favoritas</strong>
              {favorites.length > 0 && <small>{favorites.length}</small>}
            </button>
            <button onClick={() => navigate('/mis-recetas?tab=history')}>
              <Clock3 size={39} strokeWidth={1.55} />
              <strong>Historial</strong>
              {history.length > 0 && <small>{history.length}</small>}
            </button>
            <button onClick={() => navigate('/lista-compra')}>
              <ShoppingBasket size={39} strokeWidth={1.55} />
              <strong>Cesta compra</strong>
            </button>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
