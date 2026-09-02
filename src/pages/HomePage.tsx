import { Bell, BookOpen, ChefHat, Clock3, Heart, Menu, Refrigerator, Settings2, UtensilsCrossed, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { useApp } from '../AppContext';

export function HomePage() {
  const navigate = useNavigate();
  const { favorites, history } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <AppShell>
      <section className="home-v03">
        <div className="home-top-actions">
          <button className="home-round-button" onClick={() => setMenuOpen(v => !v)} aria-label="Abrir menú">
            {menuOpen ? <X size={22} /> : <Menu size={23} />}
          </button>
          <button className="home-round-button notification-button" onClick={() => setNoticeOpen(v => !v)} aria-label="Notificaciones">
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

        <header className="chef-brand-hero">
          <div className="chef-logo-mark"><ChefHat size={52} strokeWidth={1.55} /><Heart className="chef-logo-heart" size={12} fill="currentColor" /></div>
          <div className="chef-wordmark">El Chef</div>
          <div className="chef-divider"><span /><i>◆</i><span /></div>
          <h1>¡Bienvenido de nuevo!</h1>
          <p>Vamos a cocinar algo delicioso.</p>
        </header>

        <section className="mode-showcase" aria-label="Modos principales">
          <button className="mode-photo-card pantry-mode-card" onClick={() => navigate('/nevera')}>
            <div className="mode-card-copy">
              <span className="mode-line-icon"><Refrigerator size={23} /></span>
              <h2>¿Qué tenemos<br />por ahí?</h2>
              <span className="mode-accent-line" />
              <p>Abre la nevera.</p>
            </div>
            <div className="mode-card-photo pantry-photo" style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0), rgba(61,82,35,.05)), url('./home-pantry.jpg')" }} aria-hidden="true" />
          </button>

          <button className="mode-photo-card desire-mode-card" onClick={() => navigate('/antojo')}>
            <div className="mode-card-copy">
              <span className="mode-line-icon mustard"><UtensilsCrossed size={23} /></span>
              <h2>¿Qué te apetece<br />hoy?</h2>
              <span className="mode-accent-line mustard" />
              <p>El Chef se encarga.</p>
            </div>
            <div className="mode-card-photo desire-photo" style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0), rgba(166,112,21,.04)), url('./home-desire.jpg')" }} aria-hidden="true" />
          </button>
        </section>

        <section className="quick-access-v03">
          <div className="quick-heading"><span /> <h2>Accesos rápidos</h2> <span /></div>
          <div className="quick-access-grid">
            <button onClick={() => navigate('/mis-recetas')}><BookOpen size={29} /><strong>Mis recetas</strong></button>
            <button onClick={() => navigate('/mis-recetas?tab=favorites')}><Heart size={29} fill={favorites.length ? 'currentColor' : 'none'} /><strong>Favoritas</strong><small>{favorites.length}</small></button>
            <button onClick={() => navigate('/mis-recetas?tab=history')}><Clock3 size={29} /><strong>Historial</strong><small>{history.length}</small></button>
            <button onClick={() => navigate('/ajustes')}><Settings2 size={29} /><strong>Ajustes</strong></button>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
