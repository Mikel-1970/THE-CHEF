import { ArrowLeft, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: ReactNode; hideNav?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/ajustes';

  return (
    <div className="app-bg">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />
      <main className="phone-shell">{children}</main>

      {!isHome && (
        <button
          className="floating-back-button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeft size={23} strokeWidth={2} />
        </button>
      )}

      {!isProfile && (
        <button
          className="floating-profile-button"
          onClick={() => navigate('/ajustes')}
          aria-label="Abrir Perfil"
        >
          <UserRound size={22} strokeWidth={1.9} />
        </button>
      )}

      <BottomNav />
    </div>
  );
}
