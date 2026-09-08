import type { ReactNode } from 'react';
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
  const isHome = location.pathname === '/';

  return (
    <div className="app-bg">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />
      <main className="phone-shell">{children}</main>

      {isHome && !hideProfile && (
        <button data-tour="profile" className="floating-profile-button" onClick={() => navigate('/ajustes')} aria-label="Abrir Perfil">
          <ChefAvatar avatar={settings.avatarEmoji} size={42} showHat={false} className="chef-avatar-compact" />
        </button>
      )}

      <BottomNav />
    </div>
  );
}
