import { UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell({ children, hideProfile = false }: {
  children: ReactNode;
  hideNav?: boolean;
  hideBack?: boolean;
  hideProfile?: boolean;
  onBack?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <div className="app-bg">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />
      <main className="phone-shell">{children}</main>

      {isHome && !hideProfile && (
        <button data-tour="profile" className="floating-profile-button" onClick={() => navigate('/ajustes')} aria-label="Abrir Perfil">
          <UserRound size={22} strokeWidth={1.9} />
        </button>
      )}

      <BottomNav />
    </div>
  );
}
