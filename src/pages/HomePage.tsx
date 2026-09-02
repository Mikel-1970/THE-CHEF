import {
  Bell,
  BookOpen,
  ChefHat,
  Clock3,
  Heart,
  Home,
  ListChecks,
  Menu,
  Refrigerator,
  Search,
  Settings2,
  UserRound,
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
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <AppShell hideNav>
      <section className="reference-home">
        <div className="reference-decor reference-decor-left" aria-hidden="true" />
        <div className="reference-decor reference-decor-right" aria-hidden="true" />

        <div className="reference-topbar">
          <button className="reference-top-icon" onClick={() => setMenuOpen(value => !value)} aria-label="Abrir menú">
            {menuOpen ? <X size={27} /> : <Menu size={29} />}
          </button>
          <button className="reference-top-icon reference-bell" onClick={() => setNoticeOpen(value => !value)} aria-label="Notificaciones">
            <Bell size={29} />
            <span />
          </button>
        </div>

        {menuOpen && (
          <div className="reference-popover reference-menu-popover">
            <button onClick={() => navigate('/mis-recetas')}><BookOpen size={18} /> Mis recetas</button>
            <button onClick={() => navigate('/ajustes')}><Settings2 size={18} /> Ajustes</button>
          </div>
        )}

        {noticeOpen && (
          <div className="reference-popover reference-notice-popover">
            <strong>Todo al día</strong>
            <span>En esta versión privada no hay avisos pendientes.</span>
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
            <div className="reference-action-photo reference-pantry-photo" aria-hidden="true" />
            <span className="reference-card-icon reference-card-icon-green"><Refrigerator size={34} strokeWidth={1.7} /></span>
          </button>

          <button className="reference-action-card reference-desire-card" onClick={() => navigate('/antojo')}>
            <div className="reference-action-text">
              <h3>¿Qué te<br />apetece<br />hoy?</h3>
              <span className="reference-action-line reference-action-line-gold" />
              <p>El Chef se<br />encarga.</p>
            </div>
            <div className="reference-action-photo reference-desire-photo" aria-hidden="true" />
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
            <button onClick={() => navigate('/ajustes')}>
              <Settings2 size={39} strokeWidth={1.55} />
              <strong>Ajustes</strong>
            </button>
          </div>
        </section>

        <nav className="reference-bottom-nav" aria-label="Navegación principal">
          <button className="reference-nav-item reference-nav-active" onClick={() => navigate('/')}>
            <Home size={25} fill="currentColor" strokeWidth={1.8} />
            <span>Inicio</span>
            <i />
          </button>
          <button className="reference-nav-item" onClick={() => navigate('/buscar')}>
            <Search size={26} strokeWidth={1.75} />
            <span>Buscar</span>
          </button>
          <button className="reference-nav-item reference-chef-nav" onClick={() => navigate('/antojo')} aria-label="Abrir El Chef">
            <b><ChefHat size={35} strokeWidth={1.55} /></b>
          </button>
          <button className="reference-nav-item" onClick={() => navigate('/lista-compra')}>
            <ListChecks size={25} strokeWidth={1.75} />
            <span>Lista</span>
          </button>
          <button className="reference-nav-item" onClick={() => navigate('/ajustes')}>
            <UserRound size={25} strokeWidth={1.65} />
            <span>Perfil</span>
          </button>
        </nav>
      </section>
    </AppShell>
  );
}
