import { BookOpen, CookingPot, Home, PackageOpen, Search, Settings, ShoppingBasket, Sparkles, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { BottomNav } from './BottomNav';
import { ChefAvatar } from './ChefAvatar';

export function AppShell({ children, hideProfile = false }: {
  children: ReactNode;
  hideNav?: boolean;
  hideBack?: boolean;
  hideProfile?: boolean;
  onBack?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  const go = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="app-bg">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />
      <main className={`phone-shell ${isHome ? '' : 'without-bottom-nav'}`}>{children}</main>

      {isHome && !hideProfile && (
        <button data-tour="profile" className="floating-profile-button" onClick={() => navigate('/ajustes')} aria-label="Abrir Perfil">
          <ChefAvatar avatar={settings.avatarEmoji} size={42} showHat={false} className="chef-avatar-compact" />
        </button>
      )}

      {isHome && <BottomNav />}

      {!isHome && !hideProfile && (
        <div className={`floating-avatar-menu ${menuOpen ? 'open' : ''}`}>
          {menuOpen && (
            <div className="floating-avatar-popover" role="menu" aria-label="Menú de navegación">
              <button type="button" onClick={() => go('/')}><Home size={19} /><span>Inicio</span></button>
              <button type="button" onClick={() => go('/antojo')}><Sparkles size={19} /><span>¿Qué quieres cocinar?</span></button>
              <button type="button" onClick={() => go('/buscar')}><Search size={19} /><span>Buscar</span></button>
              <button type="button" onClick={() => go('/nevera')}><PackageOpen size={19} /><span>Despensa y nevera</span></button>
              <button type="button" onClick={() => go('/lista-compra')}><ShoppingBasket size={19} /><span>Lista de compra</span></button>
              <button type="button" onClick={() => go('/mis-recetas')}><BookOpen size={19} /><span>Mis recetas</span></button>
              <button type="button" onClick={() => go('/tecnicas')}><CookingPot size={19} /><span>Técnicas</span></button>
              <button type="button" onClick={() => go('/ajustes')}><Settings size={19} /><span>Ajustes</span></button>
            </div>
          )}
          <button type="button" className="floating-avatar-button" onClick={() => setMenuOpen(value => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {menuOpen ? <X size={26} /> : <ChefAvatar avatar={settings.avatarEmoji} size={58} showHat={false} />}
          </button>
        </div>
      )}
    </div>
  );
}
