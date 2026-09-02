import { ArrowRight, Bell, BookOpen, ChefHat, Clock3, Heart, Menu, Refrigerator, Settings2, Sparkles, UtensilsCrossed, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AppShell } from '../components/AppShell';
import '../home-v04.css';

export function HomePage() {
  const navigate = useNavigate();
  const { favorites, history } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <AppShell>
      <section className="home-v04">
        <div className="home-v04-toolbar">
          <button className="home-round-button" onClick={() => setMenuOpen(value => !value)} aria-label="Abrir menú">
            {menuOpen ? <X size={22} /> : <Menu size={23} />}
          </button>

          <div className="home-v04-mini-brand" aria-label="El Chef">
            <ChefHat size={22} strokeWidth={1.65} />
            <span>El Chef</span>
          </div>

          <button className="home-round-button notification-button" onClick={() => setNoticeOpen(value => !value)} aria-label="Notificaciones">
            <Bell size={22} />
            <span className="notification-dot" />
          </button>
        </div>

        {menuOpen && (
          <div className="home-popover menu-popover">
            <button onClick={() => navigate('/mis-recetas')}><BookOpen size={18} /> Mis recetas</button>
            <button onClick={() => navigate('/ajustes')}><Settings2 size={18} /> Ajustes</button>
          </div>
        )}

        {noticeOpen && (
          <div className="home-popover notice-popover">
            <strong>Todo al día</strong>
            <span>En esta versión privada no hay avisos pendientes.</span>
          </div>
        )}

        <header className="home-v04-hero">
          <div className="home-v04-brand-mark">
            <ChefHat size={61} strokeWidth={1.45} />
            <Heart className="brand-heart" size={13} fill="currentColor" />
          </div>
          <h1 className="home-v04-title">El Chef</h1>
          <div className="home-v04-kicker"><Sparkles size={13} /> Cocina a tu manera</div>
          <p className="home-v04-intro">Dime qué tienes en casa o qué te apetece. Yo me encargo de convertirlo en un plato.</p>
        </header>

        <section className="home-v04-actions" aria-label="¿Qué quieres cocinar?">
          <button
            className="home-v04-primary"
            onClick={() => navigate('/nevera')}
            style={{
              backgroundImage: "linear-gradient(180deg, rgba(34,48,21,.06) 0%, rgba(34,48,21,.22) 45%, rgba(31,42,21,.86) 100%), url('./home-pantry.jpg')"
            }}
          >
            <div className="home-v04-primary-copy">
              <span className="home-v04-action-label"><Refrigerator size={16} /> Cocina con lo que tienes</span>
              <h2>¿Qué tenemos por ahí?</h2>
              <p>Aprovecha lo que hay en casa y encuentra la mejor forma de cocinarlo.</p>
              <span className="home-v04-go"><ArrowRight size={20} /></span>
            </div>
          </button>

          <button className="home-v04-secondary" onClick={() => navigate('/antojo')}>
            <div className="home-v04-secondary-copy">
              <span className="home-v04-action-label"><UtensilsCrossed size={16} /> Elige el plato</span>
              <h2>¿Qué te apetece hoy?</h2>
              <p>Cuéntame la idea y la convertimos en una receta.</p>
            </div>
            <div
              className="home-v04-secondary-photo"
              style={{
                backgroundImage: "linear-gradient(90deg, #fff8eb 0%, rgba(255,248,235,.18) 38%, rgba(255,248,235,0) 100%), url('./home-desire.jpg')"
              }}
              aria-hidden="true"
            />
          </button>
        </section>

        <section aria-label="Accesos rápidos">
          <div className="home-v04-section-head">
            <h3>Tu cocina</h3>
            <span>Todo a mano</span>
          </div>

          <div className="home-v04-quick-grid">
            <button className="home-v04-quick-card" onClick={() => navigate('/mis-recetas')}>
              <BookOpen size={27} strokeWidth={1.75} />
              <strong>Mis recetas</strong>
            </button>

            <button className="home-v04-quick-card favorite" onClick={() => navigate('/mis-recetas?tab=favorites')}>
              <Heart size={27} strokeWidth={1.75} fill={favorites.length ? 'currentColor' : 'none'} />
              <small>{favorites.length}</small>
              <strong>Favoritas</strong>
            </button>

            <button className="home-v04-quick-card" onClick={() => navigate('/mis-recetas?tab=history')}>
              <Clock3 size={27} strokeWidth={1.75} />
              <small>{history.length}</small>
              <strong>Historial</strong>
            </button>

            <button className="home-v04-quick-card" onClick={() => navigate('/ajustes')}>
              <Settings2 size={27} strokeWidth={1.75} />
              <strong>Ajustes</strong>
            </button>
          </div>
        </section>

        <div className="home-v04-footer-note">
          <Sparkles size={13} />
          <span>Menos decisiones. Más ganas de cocinar.</span>
        </div>
      </section>
    </AppShell>
  );
}
