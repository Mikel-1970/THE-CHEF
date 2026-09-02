import {
  BookOpen,
  ChefHat,
  Clock3,
  Heart,
  Menu,
  Refrigerator,
  ShoppingBasket,
  Settings2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import '../home-v04.css';

export function HomePage() {
  const navigate = useNavigate();
  const { favorites, history } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const pantryImage = `${import.meta.env.BASE_URL}home-pantry.jpg`;
  const desireImage = `${import.meta.env.BASE_URL}home-desire.jpg`;

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

        <div className="reference-topbar">
          <button className="reference-top-icon" onClick={() => setMenuOpen(value => !value)} aria-label="Abrir menú">
            {menuOpen ? <X size={27} /> : <Menu size={29} />}
          </button>
          <span className="reference-top-spacer" aria-hidden="true" />
        </div>

        {menuOpen && (
          <div className="reference-popover reference-menu-popover">
            <button onClick={() => navigate('/mis-recetas')}><BookOpen size={18} /> Mis recetas</button>
            <button onClick={() => navigate('/ajustes')}><Settings2 size={18} /> Ajustes</button>
          </div>
        )}

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
              <h3>¿Qué<br />tenemos<br />por ahí?</h3>
              <span className="reference-action-line" />
              <p>Abre la nevera.</p>
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
              <h3>¿Qué te<br />apetece<br />hoy?</h3>
              <span className="reference-action-line reference-action-line-gold" />
              <p>El Chef se<br />encarga.</p>
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
