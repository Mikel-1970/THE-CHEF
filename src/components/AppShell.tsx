import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: ReactNode; hideNav?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

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

      <BottomNav />
    </div>
  );
}
